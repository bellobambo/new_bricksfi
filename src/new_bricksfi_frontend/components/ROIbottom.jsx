import React from "react";

const ROIbottom = () => {
  return (
    <div className="space-y-6 mt-20 mb-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Be the First to Own Real Estate on the Blockchain
      </h2>

      <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
        Get early access to BricksFi – a Web3 platform for fractional real
        estate ownership. No banks. No agents. Just the chain.
      </p>

      {/* Join Waitlist Button */}
      <div className="pt-4 px-4 sm:px-0">
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-medium sm:font-semibold text-base sm:text-lg transition-colors duration-300 flex items-center gap-2 sm:gap-3 mx-auto">
          Join Waitlist
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ROIbottom;
