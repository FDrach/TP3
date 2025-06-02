import { create } from "zustand";
import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const useAppStore = create((set, get) => ({
  currentUser: null,
  isLoadingAuth: true,

  cartItems: [],
  totalAmount: 0,

  initializeAuth: () => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        set({ currentUser: JSON.parse(storedUser), isLoadingAuth: false });
      } else {
        set({ isLoadingAuth: false });
      }
    } catch (e) {
      console.error("Error autenticando desde localStorage:", e);
      localStorage.removeItem("currentUser");
      set({ isLoadingAuth: false });
    }
  },

  login: async (username, password) => {
    set({ isLoadingAuth: true });
    try {
      const response = await axios.get(`${API_BASE_URL}/usuarios`);
      const users = response.data;
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        const userData = {
          id: user.id,
          username: user.username,
          role: user.role,
          nombreCompleto: user.nombreCompleto,
          ...(user.role === "cliente" &&
            user.clientId && { clientId: user.clientId }),
        };
        set({ currentUser: userData, isLoadingAuth: false });
        localStorage.setItem("currentUser", JSON.stringify(userData));
        return true;
      } else {
        set({ isLoadingAuth: false });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      set({ isLoadingAuth: false });
      return false;
    }
  },

  logout: () => {
    set({ currentUser: null, cartItems: [], totalAmount: 0 });
    localStorage.removeItem("currentUser");
  },

  _recalculateTotal: () => {
    const newTotal = get().cartItems.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    set({ totalAmount: newTotal });
  },

  addToCart: (product, quantity) => {
    if (quantity <= 0) return false;
    if (quantity > product.stock) {
      console.warn(
        `No se puede agregar más de ${product.stock} unidades de ${product.nombre}.`
      );
      return false;
    }

    const cartItemId = `${product.id}-${product.tamano}`;
    const existingItemIndex = get().cartItems.findIndex(
      (item) => item.cartId === cartItemId
    );
    let newCartItems = [...get().cartItems];

    if (existingItemIndex > -1) {
      const newQuantity = newCartItems[existingItemIndex].quantity + quantity;
      if (newQuantity > product.stock) {
        console.warn(
          `No se puede agregar más de ${product.stock} unidades de ${product.nombre}.`
        );
        return false;
      }
      newCartItems[existingItemIndex].quantity = newQuantity;
      newCartItems[existingItemIndex].subtotal = newQuantity * product.precio;
    } else {
      newCartItems.push({
        cartId: cartItemId,
        savorId: product.id,
        tamano: product.tamano,
        stockItemId: product.stockItemId,
        nombre: product.nombre,
        color: product.color,
        quantity: quantity,
        unitPrice: product.precio,
        subtotal: quantity * product.precio,
        availableStock: product.stock,
      });
    }
    set({ cartItems: newCartItems });
    get()._recalculateTotal();
    return true;
  },

  removeFromCart: (cartIdToRemove) => {
    const newCartItems = get().cartItems.filter(
      (item) => item.cartId !== cartIdToRemove
    );
    set({ cartItems: newCartItems });
    get()._recalculateTotal();
  },

  updateCartItemQuantity: (cartIdToUpdate, newQuantity) => {
    const itemIndex = get().cartItems.findIndex(
      (item) => item.cartId === cartIdToUpdate
    );
    if (itemIndex === -1) return false;

    const item = get().cartItems[itemIndex];
    if (newQuantity <= 0) {
      get().removeFromCart(cartIdToUpdate);
      return true;
    }
    if (newQuantity > item.availableStock) {
      console.warn(
        `Cantidad mayor al stock disponible de ${item.nombre}.`
      );
      return false;
    }

    const newCartItems = [...get().cartItems];
    newCartItems[itemIndex].quantity = newQuantity;
    newCartItems[itemIndex].subtotal = newQuantity * item.unitPrice;
    set({ cartItems: newCartItems });
    get()._recalculateTotal();
    return true;
  },

  clearCart: () => {
    set({ cartItems: [], totalAmount: 0 });
  },
}));

useAppStore.getState().initializeAuth();

export default useAppStore;
