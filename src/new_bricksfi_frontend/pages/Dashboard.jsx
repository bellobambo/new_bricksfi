import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { actor } = useAuth();
  const [myProperties, setMyProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (!actor) return;

    async function fetchProperties() {
      try {
        const fetchedProperties = await actor.getCreatedProperties();
        setMyProperties(fetchedProperties);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [actor]);

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-[#2E2E2E] hidden md:flex flex-col">
        <div className="h-16 flex items-center justify-center font-bold text-xl border-b border-[#2E2E2E]">
          <div className="flex items-center">
            <Icon />
            <span className="ml-2.5 text-[20px] font-medium">BricksFi</span>
          </div>
        </div>
        <nav className="flex-1 p-4">
          <p className="text-sm text-gray-400 mb-4">Menu</p>
          <ul className="space-y-4">
            <li>
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-lg h-[48px] text-[16px] cursor-pointer font-[500] transition
        ${
          isActive("/dashboard")
            ? "bg-[#5D3FD3] text-white"
            : "text-gray-300 hover:bg-[#2E2E2E]"
        }`}
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/properties"
                className={`block items-center px-3 py-2 rounded-lg h-[48px] text-[16px] cursor-pointer font-[500] transition
        ${
          isActive("/properties")
            ? "bg-[#5D3FD3] text-white"
            : "text-gray-300 hover:bg-[#2E2E2E]"
        }`}
              >
                Browse Properties
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="h-16 bg-black flex items-center justify-between px-6">
          <span className="text-lg font-semibold">Dashboard</span>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {/* Top section */}
          <div className="flex justify-between items-center my-4">
            <span className="text-lg font-[500]">Asset Overview</span>
            <button className="px-4 py-2 bg-[#5D3FD3] rounded-lg text-white text-[14px] cursor-pointer font-medium hover:bg-[#4c2fb8] transition">
              Withdraw
            </button>
          </div>

          {/* Stats cards */}
          <div className="flex gap-x-6 w-full mb-10">
            {[
              { label: "Current Rent Balance", value: "₦120,000" },
              { label: "Properties Owned", value: "12" },
              { label: "Total Earnings", value: "₦450,000" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-[#181818] p-6 rounded-xl flex-1 h-[150px] flex flex-col justify-between shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-[#2E2E2E] p-3 rounded-lg flex items-center justify-center">
                    <House className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-gray-300 text-sm font-medium">
                    {item.label}
                  </p>
                </div>
                <div className="text-3xl font-bold tracking-wide mt-4">
                  {item.value}
                </div>
              </div>
            ))}
          </div>

          {/* My Properties */}
          <h2 className="text-xl font-semibold mb-4">My Properties</h2>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : myProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProperties.map((property) => {
                const ICPs = Number(property.totalPrice) / 100_000_000;
                const usdValue = ICPs * 6.2; // TODO: replace with live ICP price
                const fundedICPs = Number(property.fundedAmount) / 100_000_000;
                const fundedPercent =
                  ICPs > 0 ? Math.round((fundedICPs / ICPs) * 100) : 0;

                return (
                  <div
                    key={property.id}
                    className="bg-[#181818] rounded-xl overflow-hidden shadow-md"
                  >
                    {property.imageUrls?.length > 0 ? (
                      <img
                        src={property.imageUrls[0]}
                        alt={property.name}
                        className="w-full h-40 object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <div className="w-full h-40 bg-[#333] flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}

                    <div className="p-4 text-left">
                      <h3 className="text-lg font-semibold mb-2">
                        {property.name}
                      </h3>

                      {/* Price */}
                      <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                        <span className="text-[#5D3FD3] font-bold text-base">
                          {ICPs.toLocaleString()} ICP
                        </span>
                        |
                        <span className="text-[#5D3FD3] font-semibold">
                          ${usdValue.toFixed(2)}
                        </span>
                        <span>total</span>
                      </div>

                      {/* Location + investors */}
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <span>{property.location}</span> |{" "}
                        <span>0 investors</span>
                      </div>

                      {/* Yield + funded */}
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                        <span>{property.yieldPercentage}% Yield</span> |{" "}
                        <span>{fundedPercent}% Funded</span>
                      </div>

                      {/* Button */}
                      <Link
                        to={`/property/${property.id}`}
                        className="block w-full bg-[#5D3FD3] text-center text-white text-sm font-medium py-2 rounded-lg hover:bg-[#4c2fb8] transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400">No properties found</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

function House() {
  return (
    <svg
      width="20"
      height="22"
      viewBox="0 0 20 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 21L7.002 16.998C7.002 16.067 7.002 15.602 7.155 15.235C7.25551 14.9922 7.4029 14.7716 7.58872 14.5857C7.77455 14.3999 7.99518 14.2525 8.238 14.152C8.605 14 9.07 14 10 14C10.93 14 11.396 14 11.764 14.152C12.0068 14.2525 12.2274 14.3999 12.4133 14.5857C12.5991 14.7716 12.7465 14.9922 12.847 15.235C13 15.603 13 16.068 13 17V21"
        stroke="#E0E0E0"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5.088 3.762L4.088 4.543C2.572 5.727 1.813 6.319 1.407 7.153C1 7.988 1 8.952 1 10.88V12.972C1 16.756 1 18.648 2.172 19.824C3.344 21 5.229 21 9 21H11C14.771 21 16.657 21 17.828 19.824C18.999 18.648 19 16.756 19 12.971V10.881C19 8.952 19 7.988 18.593 7.153C18.186 6.319 17.428 5.727 15.912 4.543L14.912 3.763C12.552 1.92 11.372 1 10 1C8.628 1 7.448 1.92 5.088 3.762Z"
        stroke="#E0E0E0"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

function Icon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.846172 32V12.6942H31.3077V32H25.9231V19.1295H6.23078V32H0.846172Z"
        fill="white"
      />
      <path
        d="M26.3846 6.43526H5.61538C2.76923 5.73003 0.615385 2.82094 0 0H32C31.3846 2.82094 29.3077 5.81818 26.3846 6.43526Z"
        fill="white"
      />
    </svg>
  );
}
