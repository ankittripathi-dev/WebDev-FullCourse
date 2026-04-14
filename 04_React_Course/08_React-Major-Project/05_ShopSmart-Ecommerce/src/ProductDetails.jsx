import { Star, ShoppingCart, Truck, RefreshCcw } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { storecontext } from "./components/Context";

export default function ProductDetails() {
  const [product, SetProduct] = useState({});
  const { productId } = useParams();
  const { addtocart } = useContext(storecontext);

  const getProduct = () => {
    axios
      .get("https://dummyjson.com/products/" + productId)
      .then((response) => {
        SetProduct(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="max-w-6xl mx-auto  mt-28 px-6 py-10 bg-[#fff7fa] rounded-3xl shadow-md">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Thumbnail Images */}
        <div className="flex flex-col gap-4 items-center">
          {product?.images?.map((img, index) => (
            <img
              key={index}
              src={img}
              className="w-14 h-14 rounded-xl object-cover border border-pink-200 hover:border-pink-400 transition-all duration-200 cursor-pointer"
              alt={`product-thumbnail-${index}`}
            />
          ))}
        </div>

        {/* Main Product Image */}
        <div className="flex-1">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-96 object-cover rounded-2xl shadow-md"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
          <p className="text-gray-600 text-base">{product.description}</p>

          <div className="text-pink-600 text-2xl font-semibold">${product.price}</div>

          <div className="text-sm text-gray-500">
            <p>SKU: {product.sku || "N/A"}</p>
            <p>Availability: {product.availabilityStatus || "In Stock"}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => addtocart(product.id)}
              className="bg-pink-500 hover:bg-pink-600 cursor-pointer text-white px-6 py-3 rounded-full flex items-center gap-2 shadow transition-all"
            >
              <ShoppingCart size={18} /> Add to Cart
            </button>

            <button className="bg-green-100 text-green-700 px-6 cursor-pointer py-3 rounded-full flex items-center gap-2 hover:bg-green-200 transition">
              <Truck size={18} /> {product.shippingInformation || "Free Shipping"}
            </button>

            <button className="bg-rose-100 text-rose-700 px-6 cursor-pointer py-3 rounded-full flex items-center gap-2 hover:bg-rose-200 transition">
              <RefreshCcw size={18} /> {product.returnPolicy || "7-Day Return"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
