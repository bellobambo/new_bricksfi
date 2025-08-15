import React from "react";

const PropertyCard = ({ property }) => {
  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-sm">
      {/* Image Container */}
      <div className="relative">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-48 object-cover"
        />
        {/* ROI Badge */}
        <div className="absolute top-3 right-3 bg-white text-green-500 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
          {property.roi}% ROI
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 14l5-5 5 5z" />
          </svg>
        </div>
       
      </div>

      {/* Content */}
      <div className="p-4 text-white">
        {/* Property Name */}
        <h3 className="text-lg font-semibold mb-2">{property.name}</h3>

        {/* Price and Per Token */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-purple-400 text-xl font-bold">
            ${property.price.toLocaleString()}
          </span>
          <span className="text-gray-400 text-sm">
            | ${property.pricePerToken} Per token
          </span>
        </div>

        {/* Location and Investors */}
        <div className="flex items-center justify-between text-gray-400 text-sm mb-3">
          <span>{property.location}</span>
          <span>{property.investors} Investors</span>
        </div>

        {/* Rental Yield and Funded Status */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-purple-400">
            {property.rentalYield}% Rental Yield
          </span>
          <span className="text-gray-300">
            {property.fundedPercentage}% Funded
          </span>
        </div>
      </div>
    </div>
  );
};

// Static properties data
export const staticProperties = [
  {
    id: 1,
    name: "The Stables",
    image: "/featuredimg.png",
    price: 123999,
    pricePerToken: 50,
    location: "Highland Lake, Florida",
    investors: 123,
    roi: 12.7,
    rentalYield: 12.3,
    fundedPercentage: 76,
   
  },
  {
    id: 2,
    name: "Gled RD",
    image: "/featuredimg.png",
    price: 56450,
    pricePerToken: 35,
    location: "Abuja, Nigeria",
    investors: 56,
    roi: 12.7,
    rentalYield: 9.2,
    fundedPercentage: 46,
   
  },
  {
    id: 3,
    name: "Dickens Avenue",
    image: "/featuredimg.png",
    price: 208000,
    pricePerToken: 152,
    location: "Lagos, Nigeria",
    investors: 156,
    roi: 12.7,
    rentalYield: 12.4,
    fundedPercentage: 54,
  
  },
  {
    id: 4,
    name: "Deulaeux",
    image: "/featuredimg.png",
    price: 75675,
    pricePerToken: 70,
    location: "Newland",
    investors: 74,
    roi: 6,
    rentalYield: 7.8,
    fundedPercentage: 68,

  },
];

export default PropertyCard;
