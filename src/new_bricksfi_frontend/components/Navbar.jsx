import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, principal, login, logout } = useAuth();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const truncatedPrincipal = principal
    ? `${principal.slice(0, 5)}...${principal.slice(-3)}`
    : null;

  return (
    <div className="p-5 font-['Albert_Sans'] text-base font-medium flex items-center bg-gray-900 text-white relative">
      {/* Left: Logo */}
      <div className="flex-1 flex items-center">
        <Icon />
        <span className="ml-2.5 text-2xl font-medium">BricksFi</span>
      </div>

      {/* Middle: Links (Desktop Only) */}
      {!isMobile && (
        <div className="flex-1 flex justify-center gap-5 text-base">
          <a className="text-white no-underline" href="/">
            Home
          </a>
          <a className="text-white no-underline" href="/properties">
            Properties
          </a>
        </div>
      )}

      {/* Right: Connect / Logout OR Mobile Menu */}
      <div className="flex-1 flex justify-end items-center gap-4">
        {!isMobile ? (
          isAuthenticated ? (
            <>
              <span className="text-purple-500">{truncatedPrincipal}</span>
              <span
                className="bg-purple-600 px-3 py-3 rounded-xl text-sm cursor-pointer text-center"
                onClick={logout}
              >
                Logout
              </span>
            </>
          ) : (
            <span
              className="bg-purple-600 px-3 py-3 rounded-xl text-sm cursor-pointer text-center"
              onClick={login}
            >
              Connect ICP
            </span>
          )
        ) : (
          <div
            className="cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="w-6 h-0.5 bg-white my-1"></div>
            <div className="w-6 h-0.5 bg-white my-1"></div>
            <div className="w-6 h-0.5 bg-white my-1"></div>
          </div>
        )}
      </div>

      {/* Mobile Dropdown */}
      {isMobile && menuOpen && (
        <div className="absolute top-15 right-5 bg-gray-800 p-4 rounded-xl flex flex-col gap-4 z-10">
          <a className="text-white no-underline" href="/">
            Home
          </a>
          <a className="text-white no-underline" href="/properties">
            Properties
          </a>
          {isAuthenticated ? (
            <>
              <span className="text-white text-center">
                {truncatedPrincipal}
              </span>
              <span
                className="bg-purple-600 px-3 py-3 rounded-xl text-sm cursor-pointer text-center"
                onClick={logout}
              >
                Logout
              </span>
            </>
          ) : (
            <span
              className="bg-purple-600 px-3 py-3 rounded-xl text-sm cursor-pointer text-center"
              onClick={login}
            >
              Connect ICP
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;

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
