import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Albert Sans",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#111",
        color: "white",
        position: "relative",
      }}
    >
      {/* Logo */}
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

      {/* Desktop Links */}
      {!isMobile && (
        <span style={{ display: "flex", gap: "20px", fontSize: "16px" }}>
          <a style={linkStyle} href="/">
            Home
          </a>
          <a style={linkStyle} href="/properties">
            Properties
          </a>
        </span>
      )}

      {/* Desktop Button */}
      {!isMobile && <span style={connectBtnStyle}>Connect ICP</span>}

      {/* Mobile Menu Toggle */}
      {isMobile && (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div style={barStyle}></div>
          <div style={barStyle}></div>
          <div style={barStyle}></div>
        </div>
      )}

      {/* Mobile Dropdown */}
      {isMobile && menuOpen && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "20px",
            backgroundColor: "#222",
            padding: "15px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            zIndex: 10,
          }}
        >
          <a style={linkStyle} href="/">
            Home
          </a>
          <a style={linkStyle} href="/properties">
            Properties
          </a>
          <span style={connectBtnStyle}>Connect ICP</span>
        </div>
      )}
    </div>
  );
};

export default Navbar;

// Styles
const linkStyle = {
  color: "white",
  textDecoration: "none",
};

const connectBtnStyle = {
  backgroundColor: "#5D3FD3",
  padding: "12px",
  borderRadius: "10px",
  fontSize: "14px",
  cursor: "pointer",
  textAlign: "center",
};

const barStyle = {
  width: "25px",
  height: "3px",
  backgroundColor: "white",
  margin: "4px 0",
};

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
