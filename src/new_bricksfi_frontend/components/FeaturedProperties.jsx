import React from "react";
import PropertyCard, { staticProperties } from "./PropertyCard";

const FeaturedProperties = () => {
  return (
    <div className="bg-black py-16 px-4">
      <div className="max-w-9xl mx-auto">
        {/* Section Title */}
        <h2 className="text-white text-3xl md:text-4xl font-semibold text-center mb-12 tracking-wide">
          FEATURED PROPERTIES
        </h2>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {staticProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProperties;
