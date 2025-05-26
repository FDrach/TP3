import React from "react";
import useGetProductos from "../hooks/useGetProductos";
import useVender from "../hooks/useVender";

const Vender = () => {
  const {
    products,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProductsList,
  } = useGetProductos();

  const { venderProducto, vending, vendingError } = useVender();

  const handleSell = async (product) => {
    if (!product.stockItemId || product.tamano === undefined) {
      console.error("Product data is incomplete for vending:", product);
      alert("Cannot sell product: faltan datos (stockItemId or tamano).");
      return;
    }

    console.log(
      `Attempting to sell stock item ID: ${product.stockItemId}, Tamano: ${product.tamano}ml`
    );

    const success = await venderProducto(product.stockItemId, product.tamano);

    if (success) {
      console.log("Sale successful, refetching products list...");
      refetchProductsList();
    } else {
      console.log(
        "Sale failed. Error should be displayed from useVender hook."
      );
    }
  };

  if (productsLoading) {
    return <p>Loading products...</p>;
  }

  if (productsError) {
    return <p>Error loading products: {productsError}</p>;
  }

  return (
    <div className="vender-container">
      <h2 className="vender-title">Vender Productos</h2>

      {vending && (
        <p className="vender-processing-message">Processing sale...</p>
      )}
      {vendingError && (
        <p className="vender-error-message">Vending Error: {vendingError}</p>
      )}

      {products.length === 0 && !productsLoading && (
        <p className="vender-no-products-message">
          No products available to sell.
        </p>
      )}

      <ul className="vender-product-list">
        {products.map((product) => (
          <li
            key={`${product.id}-${product.tamano}`}
            className="vender-product-item"
          >
            <h3 className="vender-product-name">{product.nombre}</h3>
            <div className="vender-product-color-section">
              Color:
              <span
                className="vender-product-color-swatch"
                style={{ backgroundColor: product.color }}
                title={`Color: ${product.color}`}
              ></span>
            </div>
            <p className="vender-product-detail">
              Precio: <strong>${product.precio.toFixed(2)}</strong>
            </p>
            <p className="vender-product-detail">
              Stock Actual:{" "}
              <strong
                style={{ color: product.stock > 0 ? "green" : "orange" }}
                className="vender-product-stock"
              >
                {" "}
                {/* Dynamic style */}
                {product.stock}
              </strong>
            </p>
            <p className="vender-product-ids">
              (Savor ID: {product.id}, Tamano: {product.tamano}ml, Stock Item
              ID: {product.stockItemId})
            </p>
            <button
              onClick={() => handleSell(product)}
              disabled={vending || product.stock <= 0}
              className={`vender-sell-button ${
                vending || product.stock <= 0
                  ? "vender-sell-button-disabled"
                  : "vender-sell-button-enabled"
              }`}
            >
              {product.stock <= 0
                ? "Out of Stock"
                : vending
                ? "Processing..."
                : "Vender"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Vender;
