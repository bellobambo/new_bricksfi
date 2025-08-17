import React from "react";

const ROI = () => {
  return (
    <section className="bg-black text-white py-20 px-4 relative overflow-hidden">
      {/* Background Large Numbers */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <span className="text-[400px] font-bold leading-none select-none">
          200%
        </span>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Main ROI Text */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Projected <span className="text-purple-500">ROI</span> per year
          </h1>
        </div>

        {/* Start Investing Button */}
        <div className="mb-16">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300 flex items-center gap-3 mx-auto">
            Start Investing from $100
            <svg
              className="w-5 h-5"
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
    </section>
  );
};

export default ROI;
