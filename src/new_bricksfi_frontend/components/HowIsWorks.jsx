import React from "react";

const HowIsWorks = () => {
  return (
    <div className="">
      <div className="flex flex-col items-center justify-center">
        <h1 className="mb-8">HOW IT WORKS</h1>
        <p className="mb-10">
          it's time for a change... BricksFi helps anyone lay a path to
          financial freedom with fractional real estate investing
        </p>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="flex-2/3">
          <img src="/Chart.png" alt=""  className="w-fit h-fit"/>
        </div>
        <div className="flex-1/3">
          <img src="/Frame 1171275346.png" alt="" className="w-fit h-fit"/>
        </div>
      </div>
    </div>
  );
};

export default HowIsWorks;
