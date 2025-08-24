import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
      {/* Sidebar - Fixed to extend full height */}
      <aside className="w-64 bg-black border-r border-[#2E2E2E] hidden md:flex flex-col fixed left-0 top-0 bottom-0">
        <div className="h-16 flex items-center justify-center font-bold text-xl border-b border-[#2E2E2E]">
          <div className="flex items-center">
            <Icon />
            <span className="ml-2.5 text-[20px] font-medium">BricksFi</span>
          </div>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-sm text-gray-400 mb-4">Menu</p>
          <ul className="space-y-4">
            <li>
              <a
                href="/dashboard"
                className={`block px-3 py-2 rounded-lg h-[48px] text-[16px] cursor-pointer font-[500] transition
        ${
          isActive("/dashboard")
            ? "bg-[#5D3FD3] text-white"
            : "text-gray-300 hover:bg-[#2E2E2E]"
        }`}
              >
                Dashboard
              </a>
            </li>
            <li>
              <a
                href="/properties"
                className={`block items-center px-3 py-2 rounded-lg h-[48px] text-[16px] cursor-pointer font-[500] transition
        ${
          isActive("/properties")
            ? "bg-[#5D3FD3] text-white"
            : "text-gray-300 hover:bg-[#2E2E2E]"
        }`}
              >
                Browse Properties
              </a>
            </li>
            <li>
              <a
                href="/wishlist"
                className={`block items-center px-3 py-2 rounded-lg h-[48px] text-[16px] cursor-pointer font-[500] transition
        ${
          isActive("/properties")
            ? "bg-[#5D3FD3] text-white"
            : "text-gray-300 hover:bg-[#2E2E2E]"
        }`}
              >
                Wishlist
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content area - Adjusted for fixed sidebar */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Navbar */}
        <header className="h-16 bg-black flex items-center justify-between px-6">
          <span className="text-lg font-semibold">Dashboard</span>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Rest of your content remains the same */}
          {/* Top section */}
          <div className="flex justify-between items-center my-4">
            <span className="text-lg font-[500]">Asset Overview</span>
            <button className="px-4 py-2 bg-[#5D3FD3] rounded-lg text-white text-[14px] cursor-disallowed font-medium hover:bg-[#4c2fb8] transition ">
              Withdraw
            </button>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-10">
            {/* Current Rent Balance (Static) */}
            <div className="bg-[#181818] p-6 rounded-xl h-[150px] flex flex-col justify-between shadow-md">
              <div className="flex items-center space-x-3">
                <div className="bg-[#2E2E2E] p-3 rounded-lg flex items-center justify-center">
                  <House className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-300 text-[16px] font-medium">
                  Current Rent Balance
                </p>
              </div>
              <div className="text-[24px] font-[600] tracking-wide mt-4">
                ₦0
              </div>
            </div>

            {/* Properties Owned (Dynamic) */}
            <div className="bg-[#181818] p-6 rounded-xl h-[150px] flex flex-col justify-between shadow-md">
              <div className="flex items-center space-x-3">
                <div className="bg-[#2E2E2E] p-3 rounded-lg flex items-center justify-center">
                  <House className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-300 text-[16px] font-medium">
                  Properties Owned
                </p>
              </div>
              <div className="text-[24px] font-[600] tracking-wide mt-4">
                {myProperties.length}
              </div>
            </div>

            {/* Total Earnings (Static) */}
            <div className="bg-[#181818] p-6 rounded-xl h-[150px] flex flex-col justify-between shadow-md">
              <div className="flex items-center space-x-3">
                <div className="bg-[#2E2E2E] p-3 rounded-lg flex items-center justify-center">
                  <House className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-300 text-[16px] font-medium">
                  Total Earnings
                </p>
              </div>
              <div className="text-[24px] font-[600] tracking-wide mt-4">
                ₦0
              </div>
            </div>
          </div>

          {/* My Properties */}
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-[500]">
              My Properties
              <span className="ml-1">({myProperties.length})</span>
            </h2>
          </div>

          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : myProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
              {myProperties.map((property) => {
                const ICPs = Number(property.totalPrice) / 100_000_000;
                const usdValue = ICPs * 6.2; // TODO: replace with live ICP price
                const fundedICPs = Number(property.fundedAmount) / 100_000_000;
                const fundedPercent =
                  ICPs > 0 ? Math.round((fundedICPs / ICPs) * 100) : 0;

                return (
                  <div
                    key={property.id}
                    className="bg-[#181818] rounded-xl overflow-hidden shadow-md flex flex-col h-[400px]"
                  >
                    {/* Property Image - Slightly smaller increase */}
                    {property.imageUrls?.length > 0 ? (
                      <img
                        src={property.imageUrls[0]}
                        alt={property.name}
                        className="w-full h-52 object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <div className="w-full h-52 bg-[#333] flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}

                    {/* Property Details with slightly adjusted spacing */}
                    <div className="p-4 flex flex-col flex-1">
                      {/* Property Name */}
                      <h3 className="text-lg font-semibold mb-3">
                        {property.name}
                      </h3>

                      {/* Details Container */}
                      <div className="flex-1 flex flex-wrap justify-between gap-4 mb-3">
                        {/* Tokens */}
                        <div className="flex flex-col min-w-[100px]">
                          <span className="text-[#A1A1A1] font-[400] text-[16px] mb-1">
                            Tokens
                          </span>
                          <span className="text-white font-[500] text-[18px] text-base">
                            {ICPs.toLocaleString()} ICP
                          </span>
                        </div>

                        {/* Cash Payout */}
                        <div className="flex flex-col min-w-[100px]">
                          <span className="text-[#A1A1A1] font-[400] text-[16px] mb-1">
                            Cash Payout
                          </span>
                          <span className="text-white font-[500] text-[18px] text-base">
                            ${usdValue.toFixed(2)}
                          </span>
                        </div>

                        {/* Current Value */}
                        <div className="flex flex-col min-w-[100px]">
                          <span className="text-[#A1A1A1] font-[400] text-[16px] mb-1">
                            Current Value
                          </span>
                          <span className="text-white font-[500] text-[18px] text-base">
                            {property.yieldPercentage}% Yield
                          </span>
                        </div>
                      </div>

                      <a
                        href={`/property/${property.id}`}
                        className="mt-auto bg-[#5D3FD3] text-center text-white text-sm font-medium py-2 rounded-lg hover:bg-[#4c2fb8] transition"
                      >
                        View Details
                      </a>
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
