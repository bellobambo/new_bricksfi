import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import House from "../components/House";
import FeaturedProperties from "../components/FeaturedProperties";
import HowIsWorks from "../components/HowIsWorks";
import CardsRender from "../components/CardsRender";
import Footer from "../components/Footer";

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
          <Link
            style={{
              backgroundColor: "#5D3FD3",
              padding: "12px",
              borderRadius: "10px",
              fontSize: "14px",
              cursor: "pointer",
              textDecoration: "none",
              color: "white",
            }}
            to="/properties"
          >
            Explore Properties
          </Link>
        </div>
        <div>
          <House />
        </div>
      </div>

      <FeaturedProperties />
      <HowIsWorks />

      <CardsRender />
      <Footer />
    </>
  );
};

export default Home;
