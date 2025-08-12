import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div
        style={{
          display: "flex ",
          justifyContent: "space-between",
          padding: "40px",
          marginTop: "40px",
          alignItems: "center",

          fontFamily: "Albert Sans",
        }}
      >
        <div
          style={{
            width: "660px",
          }}
        >
          <span
            style={{
              lineHeight: "50px",
              letterSpacing: "0.4%",
              fontWeight: "600",
              fontSize: "38px",
            }}
          >
            Reinventing Africa’s Property
            <br />
            Market with Fractional
            <br />
            Ownership on <span style={{ color: "#5D3FD3" }}> ICP</span>
          </span>

          <br />
          <span
            style={{
              lineHeight: "32px",
              letterSpacing: "0.2%",
              fontWeight: "400",
              fontSize: "20px",
              color: "#B9B9B9",
            }}
          >
            Bricks lets you invest in tokenized real estate properties across
            Africa through secure, on‑chain ownership powered by the Internet
            Computer Protocol (ICP).
          </span>

          <br />
          <br />
          <a
            style={{
              backgroundColor: "#5D3FD3",
              padding: "12px",
              borderRadius: "10px",
              fontSize: "14px",
              cursor: "pointer",
              textDecoration: "none",
              color: "white",
            }}
            href="/properties"
          >
            Explore Properties
          </a>
        </div>
        <div>
          <House />
        </div>
      </div>
    </>
  );
};

export default Home;

function House() {
  return (
    <>
      <svg width="0" height="0">
        <defs>
          <clipPath id="houseClip" clipPathUnits="objectBoundingBox">
            <path
              d="
                M0.5 0
                L0.03 0.5
                Q0 0.52 0 0.55
                L0 0.95
                Q0 1 0.05 1
                L0.95 1
                Q1 1 1 0.95
                L1 0.55
                Q1 0.52 0.97 0.5
                Z
              "
              // Explanation:
              // M0.5 0 -> top tip
              // L0.03 0.5 -> left base of roof (slightly inset for rounding)
              // Q0 0.52 0 0.55 -> rounded corner down left edge
              // L0 0.95 -> bottom left (with slight inset)
              // Q0 1 0.05 1 -> bottom left corner rounded
              // L0.95 1 -> bottom right inset
              // Q1 1 1 0.95 -> bottom right corner rounded
              // L1 0.55 -> right base of roof inset
              // Q1 0.52 0.97 0.5 -> rounded roof right corner
              // Z close path
            />
          </clipPath>
        </defs>
      </svg>

      <img
        src="/HomeImage.png"
        alt=""
        style={{
          width: "400px",
          height: "400px",
          objectFit: "cover",
          clipPath: "url(#houseClip)",
        }}
      />
    </>
  );
}
