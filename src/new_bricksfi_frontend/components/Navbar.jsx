import React from "react";

const Navbar = () => {
  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        justifyContent: "space-between",
        color: "white",
        alignItems: "center",
        backgroundColor: "#111", // optional for navbar background
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: "24px",
          fontWeight: "500",
          gap: "10px",
        }}
      >
        <Icon />
        <span>BricksFi</span>
      </span>

      <span
        style={{
          display: "flex",
          gap: "20px",
          fontSize: "16px",
        }}
      >
        <span>Home</span>
        <span>Properties</span>
        <span>Dashboard</span>
      </span>

      <span
        style={{
          backgroundColor: "#5D3FD3",
          padding: "12px",
          borderRadius: "10px",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        Connect ICP
      </span>
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
