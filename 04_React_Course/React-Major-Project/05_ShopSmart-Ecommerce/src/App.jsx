import React from "react";
import {
  BrowserRouter,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Product from "./components/Product";
import Layout from "./Layout";
import ProductDetails from "./ProductDetails";
import Cart from "./components/Cart";
import Home from "./Home";
import AboutPage from "./AboutPage";
import ContactPage from "./ContactPage";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/:categorieslug?",
          element: <Product />,
        },
        {
          path: "/productfulldetails/:productId",
          element: <ProductDetails />,
        },
        {
          path: "/cart",
          element: <Cart />,
        },
        {
          path: "/aboutpage",
          element: <AboutPage />,
        },
        {
          path: "/contactpage",
          element: <ContactPage />,
        },
        {
          path: "/Shop",
          element: <Product />,
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
