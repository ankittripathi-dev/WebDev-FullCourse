import React from "react";
import { ShoppingBag, Truck, DollarSign, ThumbsUp } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen mt-15 bg-pink-50 text-gray-800 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-pink-900 mb-4">About Our Store</h1>
        <p className="text-lg mb-8 max-w-3xl">
          Welcome to <span className="font-semibold">EcoSphere</span> — your trusted source for sustainable,
          eco-friendly products. We're committed to making it easier for everyone to shop
          consciously and support a greener lifestyle.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white shadow-md rounded-2xl p-6 flex items-start space-x-4">
            <ShoppingBag className="text-pink-600 w-6 h-6 mt-1" />
            <div>
              <h3 className="text-xl font-semibold">Eco-Friendly Products</h3>
              <p className="text-sm text-gray-600 mt-2">
                We offer a wide range of sustainable products—from reusable home goods
                to biodegradable essentials—all carefully curated for their environmental impact.
              </p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 flex items-start space-x-4">
            <Truck className="text-pink-600 w-6 h-6 mt-1" />
            <div>
              <h3 className="text-xl font-semibold">Fast, Green Shipping</h3>
              <p className="text-sm text-gray-600 mt-2">
                We partner with eco-conscious carriers to ensure that every order gets to you
                quickly and with the lowest carbon footprint possible.
              </p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 flex items-start space-x-4">
            <DollarSign className="text-pink-600 w-6 h-6 mt-1" />
            <div>
              <h3 className="text-xl font-semibold">Affordable Sustainability</h3>
              <p className="text-sm text-gray-600 mt-2">
                Sustainability shouldn't break the bank. We source high-quality, affordable
                alternatives so you can shop smart and sustainably.
              </p>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 flex items-start space-x-4">
            <ThumbsUp className="text-pink-600 w-6 h-6 mt-1" />
            <div>
              <h3 className="text-xl font-semibold">Customer Satisfaction</h3>
              <p className="text-sm text-gray-600 mt-2">
                Your happiness is our priority. We provide responsive support and a satisfaction guarantee
                on every product we sell.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-pink-800 mb-4">Shop with Purpose</h2>
          <p className="text-gray-700 mb-6 max-w-xl mx-auto">
            Join thousands of others who are making the switch to eco-conscious shopping.
            Discover products you love while doing good for the planet.
          </p>
          <a
            href="#"
            className="inline-block bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full text-base"
          >
            Start Shopping
          </a>
        </div>
      </div>
    </div>
  );
}
