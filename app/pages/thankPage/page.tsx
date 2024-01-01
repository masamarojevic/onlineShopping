"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ThankPage() {
  const router = useRouter();
  const [message, setMessage] = useState(false);

  const AbortPayment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("no token");
      return;
    }

    const response = await fetch("/api/deleteItems", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      console.log("shopping deleted");
      setMessage(true);
      setTimeout(() => {
        router.push("/pages/homePage");
      }, 3000);
    }
  };

  const navigateHome = () => {
    router.push("/pages/homePage");
  };

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Thank you for your order!</h1>
      <p className="mb-4">
        You can go back to the home page or retrieve the order by clicking
        abort.
      </p>
      {!message ? (
        <div>
          <button
            onClick={navigateHome}
            className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            HOME
          </button>
          <button
            onClick={AbortPayment}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            ABORT
          </button>
        </div>
      ) : (
        <p className="text-lg">
          Your purchase was aborted. We will contact you soon. You will be
          redirected to the homepage now.
        </p>
      )}
    </div>
  );
}
