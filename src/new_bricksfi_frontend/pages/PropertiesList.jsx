import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { new_bricksfi_backend } from "declarations/new_bricksfi_backend";
import Navbar from "../components/Navbar";

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [icpPrice, setIcpPrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const fetchedProperties = await new_bricksfi_backend.getAllProperties();
        console.log("fetched data", fetchedProperties);
        setProperties(fetchedProperties);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  useEffect(() => {
    async function fetchIcpPrice() {
      try {
        // Using CoinGecko API
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=usd"
        );
        const data = await response.json();
        console.log("ICP PRICE", data);
        setIcpPrice(data["internet-computer"].usd);
      } catch (err) {
        console.error("Failed to fetch ICP price:", err);

        setIcpPrice(10); // You can set a default value here
      } finally {
        setPriceLoading(false);
      }
    }
    fetchIcpPrice();
  }, []);

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#000",
    color: "#fff",
    padding: "24px",
    fontFamily: "Albert Sans",
  };

  const cardStyle = {
    backgroundColor: "#111",
    borderRadius: "12px",
    maxWidth: "360px",
    // padding: "16px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
    marginBottom: "20px",
    border: "2px solid #1F1F1F",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        Loading properties...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
        Error: {error}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main style={containerStyle}>
        <div style={{ margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <h1 style={{ fontSize: "28px", fontWeight: "500" }}>
              All Properties
            </h1>
            <h1
              style={{ fontSize: "16px", fontWeight: "600", color: "#979797" }}
            >
              {properties.length} properties
            </h1>
          </div>

          <div style={gridStyle}>
            {properties.length > 0 ? (
              properties.map((property) => (
                <div key={property.id} style={cardStyle}>
                  {property.imageUrls && property.imageUrls.length > 0 ? (
                    <img
                      src={property.imageUrls[0]}
                      alt={`${property.name} main`}
                      style={{
                        width: "100%",
                        height: "160px",
                        objectFit: "cover",
                        borderRadius: "8px 8px 0 0", // rounded corners on top only
                        display: "block",
                      }}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "160px",
                        backgroundColor: "#333",
                        borderRadius: "8px 8px 0 0",
                      }}
                    >
                      No Image
                    </div>
                  )}

                  {/* Description */}
                  <div
                    style={{
                      padding: "16px",
                      alignItems: "left",
                      textAlign: "left",
                    }}
                  >
                    {/* Property name centered */}
                    <h2
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        marginBottom: "16px",
                        color: "#FFFFFF",
                      }}
                    >
                      {property.name}
                    </h2>

                    {/* Details 2 per row, left aligned */}
                    <div
                      style={{
                        display: "grid",
                        gap: "0.5px",
                        fontSize: "14px",
                        color: "#ccc",
                        marginBottom: "12px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <div
                          style={{
                            color: "#5D3FD3",
                            fontWeight: "700",
                            fontSize: "18px",
                          }}
                        >
                          {Number(property.totalPrice).toLocaleString()} ICP
                        </div>{" "}
                        |
                        <div>
                          <span
                            style={{
                              color: "#5D3FD3",
                              fontWeight: "600",
                              fontSize: "14px",
                            }}
                          >
                            $ {icpPrice}
                          </span>
                          <span>
                            {" "}
                            <span></span>per token
                          </span>
                        </div>
                      </div>
                      <br />

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <div>{property.location}</div> |<div>11 investors</div>
                      </div>
                      <br />

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <div>{property.yieldPercentage}% Yield</div> |
                        <div>
                          {Math.round(
                            (Number(property.fundedAmount) /
                              Number(property.totalPrice)) *
                              100
                          ) || 0}
                          % Funded
                        </div>
                      </div>
                    </div>

                    {/* View Details button */}
                    <Link
                      to={`/property/${property.id}`}
                      style={{
                        display: "block",
                        backgroundColor: "#5D3FD3",
                        fontSize: "14px",
                        color: "white",
                        padding: "10px 0",
                        borderRadius: "8px",
                        fontWeight: "500",
                        textAlign: "center",
                        textDecoration: "none",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#777" }}>No properties found</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
