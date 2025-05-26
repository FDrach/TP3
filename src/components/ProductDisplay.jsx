import React from "react";
import useGetProductos from "../hooks/useGetProductos";

function ProductDisplay() {
  const { products, loading, error } = useGetProductos();

  console.log(products);
  console.log(loading);
  console.log(error);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (products.length === 0) {
    return <p>No hay productos disponibles.</p>;
  }

  return (
    <div>
      <h1>Product List</h1>
      <main className="product-list">
        {products.map((product) => (
          <div key={`${product.id}-${product.tamano}`} className="product-card">
            <h2>{product.nombre}</h2>
            <p>
              Color:{" "}
              <span
                style={{ backgroundColor: product.color, padding: "0 5px" }}
              >
                {product.color}
              </span>
            </p>
            <p>Precio: ${product.precio.toFixed(2)}</p>
            <p>Stock: {product.stock} units</p>
            <p>Tamaño: {product.tamano}ml</p>
            <p>
              <small>(ID: {product.id})</small>
            </p>
          </div>
        ))}
      </main>
    </div>
  );
}

export default ProductDisplay;
