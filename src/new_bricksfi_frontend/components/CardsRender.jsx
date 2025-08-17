import React from "react";

const CardsRender = () => {
  const features = [
    {
      id: 1,
      title: "Blockchain-Backed Full Management",
      description:
        "Complete acquisition and management handled for you, making investing effortless.",
    },
    {
      id: 2,
      title: "Effortless Investing",
      description:
        "From sign-up to purchase, we make managing your investment portfolio simple and intuitive.",
    },
    {
      id: 3,
      title: "Diversified Portfolio",
      description:
        "Invest in premium African properties, diversify your portfolio, and grow with Africa's booming real estate.",
    },
    {
      id: 4,
      title: "Low Entry Barrier",
      description:
        "BricksFi reduces high capital requirements to $50, making real estate accessible for a wider range of investors.",
    },
    {
      id: 5,
      title: "Quarterly Exit Events",
      description:
        "Our Asset Marketplace lets investors sell tokens quarterly at fair value, adding unmatched flexibility.",
    },
    {
      id: 6,
      title: "On-Chain Transparency",
      description:
        "Every transaction is securely recorded on-chain, ensuring trust, visibility, and full investor confidence.",
    },
  ];

  return (
    <section className="bg-black text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-[28px] font-bold mb-4 tracking-wide">
            REAL ESTATE STABILITY POWERED BY BLOCKCHAIN SPEED AND SECURITY
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 justify-items-center">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-black border border-gray-700 rounded-xl p-6 hover:border-purple-500 transition-colors duration-300"
              style={{ width: "408px", height: "232px" }}
            >
              {/* Feature Title */}
              <h3 className="text-[18px] font-semibold mb-4 text-white">
                {feature.title}
              </h3>

              {/* Feature Description */}
              <p className="text-white mb-6 leading-relaxed text-[18px]">
                {feature.description}
              </p>

              {/* Read More Link */}
              <button className="text-purple-400 hover:text-purple-300 font-medium flex items-center text-[18px] gap-2 transition-colors cursor-pointer">
                <p>Read more</p>
                <svg
                  className="w-4 h-4"
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default CardsRender;
