import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import toast, { Toaster } from "react-hot-toast";

function PropertiesList() {
  const { actor } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [icpPrice, setIcpPrice] = useState(0);
  const [priceLoading, setPriceLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;

    async function fetchProperties() {
      try {
        const fetchedProperties = await actor.getAllProperties();
        console.log("fetched data", fetchedProperties);
        setProperties(fetchedProperties);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error(`Unable to load properties: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [actor]);

  useEffect(() => {
    async function fetchIcpPrice() {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=usd"
        );
        const data = await response.json();
        setIcpPrice(data["internet-computer"].usd);
      } catch (err) {
        console.error("Failed to fetch ICP price:", err);
        setIcpPrice(10); // fallback value
      } finally {
        setPriceLoading(false);
      }
    }
    fetchIcpPrice();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-20">
        <div className="w-12 h-12 border-4 border-t-purple-600 border-b-purple-600 border-gray-300 rounded-full animate-spin"></div>
        <p className="mt-4 text-white text-lg">Loading properties...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
            fontSize: "16px",
          },
        }}
      />
      <main
        style={{
          minHeight: "100vh",
          backgroundColor: "#000",
          color: "#fff",
          padding: "24px",
        }}
      >
        <div style={{ margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {properties.length > 0 ? (
              properties.map((property) => {
                const ICPs = Number(property.totalPrice) / 100_000_000;
                const usdValue = ICPs * icpPrice;
                const fundedICPs = Number(property.fundedAmount) / 100_000_000;
                const fundedPercent =
                  ICPs > 0 ? Math.round((fundedICPs / ICPs) * 100) : 0;

                return (
                  <div
                    key={property.id}
                    style={{
                      backgroundColor: "#111",
                      borderRadius: "12px",
                      maxWidth: "360px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
                      marginBottom: "20px",
                      border: "2px solid #1F1F1F",
                    }}
                  >
                    {property.imageUrls?.[0] ? (
                      <img
                        src={property.imageUrls[0]}
                        alt={`${property.name} main`}
                        style={{
                          width: "100%",
                          height: "160px",
                          objectFit: "cover",
                          borderRadius: "8px 8px 0 0",
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
                    <div style={{ padding: "16px", textAlign: "left" }}>
                      <h2
                        style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          marginBottom: "16px",
                          color: "#fff",
                        }}
                      >
                        {property.name}
                      </h2>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "14px",
                          color: "#ccc",
                          marginBottom: "12px",
                        }}
                      >
                        <div>
                          {ICPs.toLocaleString()} ICP | ${usdValue.toFixed(2)}{" "}
                          total
                        </div>
                        <div>{fundedPercent}% Funded</div>
                      </div>
                      <a
                        href={`/property/${property.id}`}
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
                        }}
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ color: "#777" }}>No properties found</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default PropertiesList;
