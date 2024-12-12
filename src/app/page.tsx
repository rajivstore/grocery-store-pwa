import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4">
      <div className="text-center max-w-md w-full bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-6 space-y-6">
        <Image
          src="/logo.png"
          alt="Grocery Store Logo"
          width={350}
          height={100}
          className="mx-auto mb-6"
        />

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-store-primary mb-4">
            Kirana Groceries Delivered
          </h1>

          <div className="bg-green-50 border border-green-100 rounded-xl p-4 space-y-3">
            <p className="text-gray-700 text-center">
              From farm-fresh produce to daily essentials, we bring your
              neighborhood store to your doorstep.
            </p>

            <div className="flex justify-center space-x-2 text-sm">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                🚚 Free Delivery
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                🏪 Local Stores
              </span>
            </div>
          </div>

          <p className="text-sm text-red-500 italic">
            Minimum Order Value: ₹100 for Free Home Delivery
          </p>

          <div className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-200 p-3 rounded-xl text-center">
            <p className="text-xs text-gray-600 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              For Residents of MPR Urban City
            </p>
          </div>
        </div>

        <Link
          href="/products"
          className="block bg-store-primary text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-colors text-lg font-semibold"
        >
          Order Now
        </Link>
      </div>
    </div>
  );
}
