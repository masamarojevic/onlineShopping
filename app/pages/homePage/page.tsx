"use client";
import { ShoppingCartItem } from "@/utils/models/types/user";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const products: ShoppingCartItem[] = [
    {
      id: 1,
      name: "banana",
      price: 15,
      isOnSale: true,
      quantity: 1,
      imagePath: "/bananas-1642706_1280.jpg",
    },
    {
      id: 2,
      name: "apple",
      price: 20,
      isOnSale: true,
      quantity: 1,
      imagePath: "/apple-1702316_1280.jpg",
    },
    {
      id: 3,
      name: "brocolli",
      price: 15,
      isOnSale: true,
      quantity: 1,
      imagePath: "/appetite-1238251_1280.jpg",
    },
  ];
  const [shoppingCart, setShoppingCart] = useState<ShoppingCartItem[]>([]);

  const addToCart = (product: ShoppingCartItem) => {
    setShoppingCart((prevItems) => {
      // Check if the item already exists in the cart
      const isItemInCart = prevItems.find((item) => item.id === product.id);

      if (isItemInCart) {
        // If it exists, increase the quantity
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If it does not exist, add the new item with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const buyProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await fetch("/api/buyItems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token, shoppingCart }),
      });

      if (response.ok) {
        console.log("Shopping cart updated in database");
        setShoppingCart([]);
        router.push("/pages/confirmPage");
      } else {
        const errorResponse = await response.json();
        console.error(
          "Failed to update shopping cart in database",
          errorResponse
        );
      }
    } catch (error) {
      console.error(
        "Error when attempting to update shopping cart in database",
        error
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome to Our Food Shop
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-md">
            <img
              src={product.imagePath}
              alt={product.name}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">{product.name}</h2>
                <p className="text-lg">
                  {product.price} kr - Quantity: {product.quantity}
                </p>
                {product.isOnSale && (
                  <span className="text-red-500 font-bold">On Sale!</span>
                )}
              </div>
              <button
                onClick={() => addToCart(product)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-4">Shopping Cart</h2>
        {shoppingCart.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span className="text-lg font-medium">{item.name}</span>
            <span className="text-lg">{item.quantity} pcs.</span>
          </div>
        ))}
        <button
          onClick={buyProducts}
          className="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-700 transition duration-300"
        >
          Buy
        </button>
      </div>
    </div>
  );
}
