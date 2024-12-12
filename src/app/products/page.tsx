"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCartIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/solid";

import { createClient } from "@/lib/contentful";
import { useCartStore } from "@/store/cart-store";
import { Product } from "@/types/product";
import { ProductFieldsWithSys } from "@/lib/contentful";
import { useRouter } from "next/navigation";

// Utility function for safe image URL extraction
function extractImageUrl(item: ProductFieldsWithSys["fields"]): string {
  if (item.image && item.image.fields && item.image.fields.file) {
    const imageFile = item.image.fields.file;

    // Prefer WebP format if available
    if (imageFile.contentType === "image/webp") {
      return `https:${imageFile.url}`;
    }

    // Fallback to original image URL
    return `https:${imageFile.url}`;
  }
  return "/placeholder-image.png"; // Fallback image
}

// Utility function for formatting price
const formatPrice = (price: number | undefined): string => {
  if (price === undefined) return "₹0";

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  // Format the price and then remove trailing zeros if they're just .00
  const formattedPrice = formatter.format(price);
  return formattedPrice.replace(/\.00$/, "");
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const {
    items: cartItems,
    // clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCartStore();

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const client = createClient();
      const response = await client.getEntries<ProductFieldsWithSys>({
        content_type: "product",
      });

      const fetchedProducts: Product[] = response.items
        .map(
          (entry): Product => ({
            id: entry.sys.id,
            name: entry.fields.name || "Unnamed Product",
            price: entry.fields.price || 0,
            description: entry.fields.description || "",
            imageUrl: extractImageUrl(entry.fields),
            availableQuantity: entry.fields.availableQuantity || 0,
          })
        )
        .filter((product: Product) => product.availableQuantity > 0);

      setProducts(fetchedProducts);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error fetching products:", errorMessage);
      setError("Failed to load products. Please check your connection.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // const sendWhatsAppOrder = useCallback(() => {
  //   if (cartItems.length === 0) return;

  //   const orderText = cartItems
  //     .map((item) => `${item.name} x ${item.quantity}`)
  //     .join("\n");

  //   const totalPrice = cartItems.reduce(
  //     (total, item) => total + item.price * item.quantity,
  //     0
  //   );

  //   const whatsappUrl = `https://wa.me/+919908862141?text=${encodeURIComponent(
  //     `🛒 Order Details:\n${orderText}\n\n💰 Total: ${formatPrice(totalPrice)}`
  //   )}`;

  //   window.open(whatsappUrl, "_blank");
  //   clearCart();
  // }, [cartItems, clearCart]);

  // Memoized cart total calculation

  const cartTotal = useMemo(
    () =>
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [cartItems]
  );

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Sticky Header
  const StickyHeader = () => (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-green-50 to-emerald-50 pb-2 border-b border-green-100 shadow-sm">
      {/* Header with Logo and Cart Summary */}
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center py-1 px-4">
          {/* Logo on the left */}
          <Link href="/" className="w-auto">
            <Image
              src="/logo.png"
              alt="Grocery Store Logo"
              width={120}
              height={100}
              className="h-10 w-auto object-contain transition-transform hover:scale-105"
            />
          </Link>

          {/* Cart Summary on the right */}
          <div className="z-10">{CartSummary()}</div>
        </div>

        {/* Search Bar below logo and cart */}
        <div className="px-4">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-full border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all text-gray-800 placeholder-gray-500 bg-white"
          />
        </div>
      </div>
    </div>
  );

  const sendToCheckout = () => {
    if (cartItems.length > 0) {
      router.push("/checkout");
    }
  };

  // Cart Summary Floating Button
  const CartSummary = () =>
    cartItems.length > 0 && (
      <div className="bg-white border border-green-100 shadow-md rounded-xl p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-gray-700">Total:</span>
            <span className="font-bold text-green-700 text-xl">
              {formatPrice(cartTotal)}
            </span>
          </div>
          <button
            onClick={sendToCheckout}
            className="bg-green-600 text-white px-3 py-1 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors ml-2"
          >
            <ShoppingCartIcon className="w-4 h-4 text-white" />
            <span className="ml-1 text-xs">
              {/* {cartItems.reduce((total, item) => total + item.quantity, 0)} */}
              {cartItems.length}
            </span>
          </button>
        </div>
      </div>
    );

  // Loading state component
  const LoadingState = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-store-primary"></div>
    </div>
  );

  // Error state component
  const ErrorState = () => (
    <div className="flex flex-col justify-center items-center h-screen p-4 text-center">
      <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mb-4" />
      <h2 className="text-xl font-bold mb-2">Oops! Something went wrong</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={fetchProducts}
        className="bg-store-primary text-white px-4 py-2 rounded flex items-center"
      >
        <ArrowPathIcon className="w-5 h-5 mr-2" />
        Try Again
      </button>
    </div>
  );

  // No products state
  const NoProductsState = () => (
    <div className="flex flex-col justify-center items-center h-screen p-4 text-center">
      <p className="text-xl text-gray-500">
        No products available at the moment
      </p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 relative">
      {/* Sticky Header */}
      {StickyHeader()}

      {/* Product List with scrollable content */}
      <div className="pt-4">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState />
        ) : products.length === 0 ? (
          <NoProductsState />
        ) : (
          <>
            {filteredProducts.length === 0 && searchTerm && (
              <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg mx-4">
                <p>No products found matching &apos;{searchTerm}&apos;</p>
              </div>
            )}
            <div className="w-full space-y-4 py-4">
              {filteredProducts.map((product) => {
                // Calculate dynamic price based on cart quantity
                const cartItem = cartItems.find(
                  (item) => item.id === product.id
                );
                const dynamicPrice = cartItem
                  ? formatPrice(product.price * cartItem.quantity)
                  : formatPrice(0);

                return (
                  <div
                    key={product.id}
                    className={`relative flex items-center border rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4 ${
                      cartItems.find((item) => item.id === product.id)
                        ? "bg-green-200 border-green-300"
                        : "bg-white border-green-50"
                    }`}
                  >
                    {/* Product Image - Left */}
                    <div className="w-1/4 mr-4">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        width={120}
                        height={120}
                        className="object-cover rounded-lg transition-transform hover:scale-110"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>

                    {/* Product Details - Middle */}
                    <div className="flex-grow space-y-2">
                      {/* Product Name */}
                      <h3 className="text-lg font-bold text-gray-800 truncate">
                        {product.name}
                      </h3>

                      {/* Product Price */}
                      <p className="text-red-600 font-bold">
                        {formatPrice(product.price)}
                      </p>

                      {/* Available Quantity */}
                      {product.availableQuantity > 0 && (
                        <span className="text-xs text-gray-500">
                          {product.availableQuantity} available
                        </span>
                      )}
                    </div>

                    {/* Absolute positioned Quantity Control - Bottom Right */}
                    <div className="absolute bottom-4 right-4">
                      {/* Dynamic Price */}
                      {cartItems.find((item) => item.id === product.id) && (
                        <div className="text-green-700 font-bold text-right mb-1">
                          {dynamicPrice}
                        </div>
                      )}

                      {/* Quantity Control */}
                      <div className="flex items-center border border-green-100 rounded-full overflow-hidden">
                        <button
                          onClick={() => decreaseQuantity(product.id)}
                          className="bg-green-50 text-green-600 px-3 py-1 hover:bg-green-100 transition-colors"
                        >
                          -
                        </button>
                        <span className="bg-white text-gray-800 px-4 py-1">
                          {cartItems.find((item) => item.id === product.id)
                            ?.quantity || 0}
                        </span>
                        <button
                          onClick={() => increaseQuantity(product)}
                          className="bg-green-600 text-white px-3 py-1 hover:bg-green-700 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
