"use client";
import { ShoppingCartItem } from "@/utils/models/types/user";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function confirmItems() {
  const router = useRouter();
  const [shoppingCart, setShoppingCart] = useState<ShoppingCartItem[]>([]);

  useEffect(() => {
    fetchCart();
  }, []);
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await fetch("/api/confirmItems", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched shopping cart:", data.shoppingCart);
        setShoppingCart(data.shoppingCart);
        console.log("Shopping cart retrieved");
      } else {
        const errorResponse = await response.json();
        console.error(
          "Failed to retrieve shopping cart from database",
          errorResponse
        );
      }
    } catch (error) {
      console.error(
        "Error when attempting to retrieve shopping cart from database",
        error
      );
    }
  };

  const updateShoppingCart = async (updatedCart: ShoppingCartItem[]) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await fetch("/api/updatedItems", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shoppingCart: updatedCart }),
      });

      if (response.ok) {
        console.log("Shopping cart updated successfully on the server");
      } else {
        const errorResponse = await response.json();
        console.error(
          "Failed to update shopping cart on the server",
          errorResponse
        );
      }
    } catch (error) {
      console.error(
        "Error when attempting to update shopping cart on the server",
        error
      );
    }
  };
  // const removeItemFromCart = async (itemId: number) => {
  //   const updatedCart = shoppingCart.filter((item) => item.id !== itemId);
  //   setShoppingCart(updatedCart);
  //   await updateShoppingCart(updatedCart);
  // };
  const removeItemFromCart = async (itemId: number) => {
    const updatedCart = shoppingCart
      .map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    setShoppingCart(updatedCart);
    await updateShoppingCart(updatedCart);
  };

  const handlePayment = async () => {
    await updateShoppingCart(shoppingCart);
    router.push("/pages/thankPage");
  };

  const totalPrice = shoppingCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your products:</h1>
      <ul className="list-disc pl-5 mb-4">
        {shoppingCart.map((item, index) => (
          <li key={index} className="mb-2 flex justify-between items-center">
            <span className="font-medium">{item.name}</span> - Quantity:{" "}
            {item.quantity}
            <button
              onClick={() => removeItemFromCart(item.id)}
              className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p className="text-lg font-semibold">Total price: {totalPrice} kr</p>
      <button
        onClick={handlePayment}
        className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Pay
      </button>
    </div>
  );
}
