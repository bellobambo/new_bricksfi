import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <Link
        to={`/properties`}
        style={{
          color: "#2563eb",
          display: "inline-block",
          marginTop: "10px",
        }}
      >
        View Properties
      </Link>
    </div>
  );
};

export default Home;
