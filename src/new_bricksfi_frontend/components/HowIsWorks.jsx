import React from "react";

const HowIsWorks = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="mb-4 text-2xl font-bold md:mb-8 md:text-3xl">
          HOW IT WORKS
        </h1>
        <p className="mb-6 max-w-2xl text-base md:mb-10 md:text-lg">
          it's time for a change... BricksFi helps anyone lay a path to
          financial freedom with fractional real estate investing
        </p>
      </div>
      <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between">
        <div className="mb-6 w-full md:mb-0 md:w-2/3 md:pr-4">
          <img
            src="/Chart.png"
            alt="Chart illustration"
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="w-full md:w-1/3">
          <img
            src="/Frame 1171275346.png"
            alt="Frame illustration"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default HowIsWorks;
