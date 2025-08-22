import React from "react";
import Navbar from "../components/Navbar";

const WishList = () => {
  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center bg-white shadow-lg rounded-2xl p-8 max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Property in Wishlist Yet!
          </h2>
          <p className="text-gray-500 text-sm">
            Start exploring and add properties you like to your wishlist.
          </p>
        </div>
      </div>
    </>
  );
};

export default WishList;
