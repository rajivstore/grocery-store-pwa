"use client";

import React, { useState, useCallback } from "react";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";

export default function CheckoutPage() {
  const { items: cartItems, clearCart } = useCartStore();
  const router = useRouter();

  const [orderDetails, setOrderDetails] = useState({
    name: "",
    membershipType: "",
    membershipValue: "",
    flat: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendWhatsAppOrder = useCallback(() => {
    if (cartItems.length === 0) return;

    const orderText = cartItems
      .map((item) => `${item.name} x ${item.quantity}`)
      .join("\n");

    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const fullOrderMessage = `
🛒 Order Details:
${orderText}

💰 Total: ₹${totalPrice.toFixed(2)}

👤 Customer Details:
Name: ${orderDetails.name}
Block: ${orderDetails.membershipType} - ${orderDetails.membershipValue}
Flat: ${orderDetails.flat}
`;

    const whatsappContact = process.env.NEXT_PUBLIC_WHATSAPP_CONTACT;
    const whatsappUrl = `https://wa.me/${whatsappContact}?text=${encodeURIComponent(
      fullOrderMessage
    )}`;

    window.open(whatsappUrl, "_blank");
    clearCart();
    router.push("/products");
  }, [cartItems, orderDetails, clearCart, router]);

  return (
    <div className="container mx-auto px-4 py-1 bg-green-50 min-h-screen">
      {/* Delivery Information */}
      <h1 className="text-2xl font-bold mt-6 text-green-800">
        Delivery Information
      </h1>

      {/* Order Details Section */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-green-800">Order Summary</h2>
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between py-2 border-b border-green-100"
          >
            <span className="text-gray-800 font-medium">
              {item.name} x {item.quantity}
            </span>
            <span className="text-green-700 font-bold">
              ₹{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="flex justify-between mt-4 font-bold">
          <span className="text-gray-900 text-lg">
            Total - ({cartItems.length} items)
          </span>
          <span className="text-green-800 text-xl">
            ₹
            {cartItems
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toFixed(2)}
          </span>
        </div>
      </div>

      {/* Customer Details Section */}
      <div className="bg-white shadow-md rounded-lg mt-4 p-6 space-y-2">
        <h2 className="text-xl font-bold mb-4 text-green-800">
          Delivery Address
        </h2>

        <label className="block text-gray-700">Customer Name</label>
        <input
          type="text"
          name="name"
          value={orderDetails.name}
          onChange={handleInputChange}
          placeholder="Enter your name"
          className="w-full px-4 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 placeholder-gray-500"
          required
        />

        {/* Membership Type Radio Buttons */}
        <div>
          <label className="block text-gray-700 mb-2">Block Type</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="membershipType"
                value="Diamond Block"
                checked={orderDetails.membershipType === "Diamond Block"}
                onChange={handleInputChange}
                className="form-radio text-green-600 focus:ring-green-500 focus:ring-2"
              />
              <span
                className={`ml-2 ${
                  orderDetails.membershipType === "Diamond Block"
                    ? "text-green-600 font-bold"
                    : "text-gray-600"
                }`}
              >
                Diamond Block
              </span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="membershipType"
                value="Ruby Block"
                checked={orderDetails.membershipType === "Ruby Block"}
                onChange={handleInputChange}
                className="form-radio text-green-600 focus:ring-green-500 focus:ring-2"
              />
              <span
                className={`ml-2 ${
                  orderDetails.membershipType === "Ruby Block"
                    ? "text-green-600 font-bold"
                    : "text-gray-600"
                }`}
              >
                Ruby Block
              </span>
            </label>
          </div>
        </div>

        {/* Update the select option text as well */}
        {orderDetails.membershipType && (
          <div>
            <label className="block text-gray-700 mb-2">Block</label>
            <select
              name="membershipValue"
              value={orderDetails.membershipValue}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900"
              required
            >
              <option value="" className="text-gray-500">
                Select {orderDetails.membershipType}
              </option>
              <option value="A" className="text-gray-900">
                A
              </option>
              <option value="B" className="text-gray-900">
                B
              </option>
              <option value="C" className="text-gray-900">
                C
              </option>
              <option value="D" className="text-gray-900">
                D
              </option>
              <option value="E" className="text-gray-900">
                E
              </option>
            </select>
          </div>
        )}

        <label className="block text-gray-700">Flat</label>
        <input
          type="text"
          name="flat"
          value={orderDetails.flat}
          onChange={handleInputChange}
          placeholder="Enter flat number"
          className="w-full px-4 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-900 placeholder-gray-500"
          required
        />

        {/* Send Order Button */}
        <button
          onClick={sendWhatsAppOrder}
          disabled={
            !orderDetails.name ||
            !orderDetails.membershipType ||
            !orderDetails.membershipValue ||
            !orderDetails.flat
          }
          className="mt-6 w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-colors disabled:bg-green-300 flex items-center justify-center"
        >
          <FaWhatsapp className="mr-2 text-2xl" />
          Place Order
        </button>
      </div>
    </div>
  );
}
