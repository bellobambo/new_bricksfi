import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import House from "../components/House";
import FeaturedProperties from "../components/FeaturedProperties";
import HowIsWorks from "../components/HowIsWorks";
import CardsRender from "../components/CardsRender";
import ROI from "../components/ROI";
import Footer from "../components/Footer";
import ROIbottom from "../components/ROIbottom";

const Home = () => {
  return (
    <>
      <Navbar />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "40px",
          marginTop: "40px",
          alignItems: "center",
          fontFamily: "Albert Sans",
          flexWrap: "wrap", // allow stacking
        }}
      >
        <div
          style={{
            flex: "1 1 400px",
            maxWidth: "600px",
          }}
        >
          <span
            style={{
              lineHeight: "1.3",
              fontWeight: "600",
              fontSize: "2.3rem",
            }}
          >
            Reinventing Property
            <br />
            Market with Fractional
            <br />
            Ownership on <span style={{ color: "#5D3FD3" }}>ICP</span>
          </span>

          <br />
          <span
            style={{
              lineHeight: "1.5",
              fontWeight: "400",
              fontSize: "1.1rem",
              color: "#B9B9B9",
              display: "block",
              marginTop: "1rem",
            }}
          >
            Bricks lets you invest in tokenized real estate assets through
            secure, on-chain ownership powered by the Internet Computer Protocol
            (ICP).
          </span>

          <br />
          <Link
            style={{
              backgroundColor: "#5D3FD3",
              padding: "12px 20px",
              borderRadius: "10px",
              fontSize: "14px",
              cursor: "pointer",
              textDecoration: "none",
              color: "white",
              display: "inline-block",
              marginTop: "1.5rem",
            }}
            to="/properties"
          >
            Explore Properties
          </Link>
        </div>

        <div
          style={{
            flex: "1 1 300px", // image container shrinks on mobile
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <House style={{ maxWidth: "100%", height: "auto" }} />
        </div>
      </div>

      <FeaturedProperties />
      <HowIsWorks />
      <CardsRender />
      <ROI />
      <ROIbottom />
      <Footer />
    </>
  );
};

export default Home;
