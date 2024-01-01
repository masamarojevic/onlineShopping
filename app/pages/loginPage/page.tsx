"use client";
import { User } from "@/utils/models/types/user";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState<User>({
    email: "",
    password: "",
    shoppingCart: [],
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        // Store the token in localStorage
        if (result.token) {
          localStorage.setItem("token", result.token);
        }
        router.push("/pages/homePage");
      } else {
        console.log("login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="bg-black min-h-screen flex justify-center items-center p-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-black">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Login
          </button>
          <Link
            href="/"
            className="text-green-600 hover:text-green-800 block text-center mt-4"
          >
            Don't have an account? Register here!
          </Link>
        </form>
      </div>
    </div>
  );
}
