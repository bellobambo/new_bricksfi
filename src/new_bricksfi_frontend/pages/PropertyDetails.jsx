import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "space-between",
  backgroundColor: "#000",
  fontFamily: "Albert Sans",
  color: "#fff",
  margin: "0 auto",
};

const detailsGridStyle = {
  display: "flex",
  gap: "12px",
  marginBottom: "16px",
};

const detailBlockStyle = {
  backgroundColor: "#181818",
  width: "200px",
  height: "90px",
  alignItems: "center",
  padding: "12px",
  borderRadius: "8px",
  color: "#ccc",
  fontWeight: "600",
  textAlign: "center",
};

export default function PropertyDetails() {
  const { id } = useParams();
  const { actor } = useAuth();
  const [property, setProperty] = useState(null);
  const [investors, setInvestors] = useState([]);
  const [fundingPercentage, setFundingPercentage] = useState(0);
  const [uniqueInvestorsCount, setUniqueInvestorsCount] = useState(0);
  const [contentWidth, setContentWidth] = useState("100%");
  const [icpPrice, setIcpPrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(true);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!actor) return;

      try {
        const percentage = await actor.getFundingPercentage(Number(id));
        setFundingPercentage(percentage ? percentage.toFixed(2) : 0);

        const investments = await actor.getPropertyInvestments(Number(id));
        const uniqueInvestors = new Set(
          investments.map((i) => i.investor.toString())
        );
        setUniqueInvestorsCount(uniqueInvestors.size);
      } catch (err) {
        console.error("Failed to fetch investment data:", err);
      }
    };

    fetchData();
  }, [actor, id]);

  const handleBuyTokens = async () => {
    if (!actor) {
      toast.error("Not authenticated. Please connect your wallet.");
      return;
    }

    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsLoading(true);

    try {
      const amountE8s = Math.floor(parseFloat(investmentAmount) * 100_000_000);
      const result = await actor.investInProperty(Number(id), amountE8s);

      if ("Ok" in result) {
        toast.success(`Successfully invested! Transaction ID: ${result.Ok}`);

        const percentage = await actor.getFundingPercentage(Number(id));
        setFundingPercentage(percentage ? percentage.toFixed(2) : 0);

        const investments = await actor.getPropertyInvestments(Number(id));
        const uniqueInvestors = new Set(
          investments.map((i) => i.investor.toString())
        );
        setUniqueInvestorsCount(uniqueInvestors.size);

        setIsOpen(false);
        setInvestmentAmount("");
      } else if ("Err" in result) {
        const errorType = Object.keys(result.Err)[0];
        let errorMessage = "Investment failed";

        // Customize error messages based on the error type
        switch (errorType) {
          case "NotFound":
            errorMessage = "Property not found";
            break;
          case "Unauthorized":
            errorMessage = "You are not authorized";
            break;
          case "AlreadyFunded":
            errorMessage = "This property is already fully funded";
            break;
          case "InvalidAmount":
            errorMessage = "The amount is too small (must cover fees)";
            break;
          case "TransferFailed":
            errorMessage = "ICP transfer failed";
            break;
        }

        toast.error(errorMessage);
      }
    } catch (err) {
      console.error("Investment error:", err);
      toast.error(`Please Try again later!`);
      toast.error(`Unable to invest at the moment`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!actor) return;

    async function fetchPropertyData() {
      setLoading(true);
      try {
        const propertyData = await actor.getProperty(Number(id));
        if (propertyData && propertyData.length > 0) {
          setProperty(propertyData[0]);
        }

        console.log(propertyData, "Data");
      } catch (error) {
        console.error("Error fetching property data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPropertyData();
  }, [id, actor]);

  useEffect(() => {
    const updateWidth = () => {
      if (imageRef.current) {
        setContentWidth(`${imageRef.current.clientWidth}px`);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [property]);

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
        setIcpPrice(10); // fallback
      } finally {
        setPriceLoading(false);
      }
    }
    fetchIcpPrice();
  }, []);

  if (!actor) {
    return (
      <p style={{ color: "#fff", padding: "20px" }}>
        Connecting to canister...
      </p>
    );
  }

  if (!property) {
    return <p style={{ color: "#fff", padding: "20px" }}>Loading...</p>;
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: "30px" }}>
        {property.imageUrls && property.imageUrls.length > 0 ? (
          <img
            ref={imageRef}
            src={property.imageUrls[0]}
            alt={`${property.name} main`}
            style={{
              width: "100vw",
              minWidth: "100%",
              height: "50vh",
              maxHeight: "500px",
              objectFit: "cover",
              display: "block",
            }}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <div
            ref={imageRef}
            style={{
              width: "100vw",
              height: "320px",
              backgroundColor: "#333",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
            }}
          >
            No Image
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <div
            style={{ flex: "1 1 400px", minWidth: "300px", maxWidth: "500px" }}
          >
            <div style={{ marginBottom: "24px" }}>
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: 600,
                  marginBottom: "8px",
                  color: "#fff",
                }}
              >
                {property.name}
              </h1>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#bbb",
                  fontSize: "16px",
                }}
              >
                <Pointer />
                <span>{property.location}</span>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 500,
                  marginBottom: "12px",
                  color: "#fff",
                }}
              >
                Property Features
              </h3>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                {[
                  {
                    icon: <Bed />,
                    label: "Bedrooms",
                    value: Number(property.bedrooms),
                  },
                  {
                    icon: <Bath />,
                    label: "Bathrooms",
                    value: Number(property.bathrooms),
                  },
                  {
                    icon: <Square />,
                    label: "Square Meters",
                    value: Number(property.squareMeters),
                  },
                ].map((feature, i) => (
                  <div
                    key={i}
                    style={{
                      flex: "1 1 100px",
                      minWidth: "100px",
                      backgroundColor: "#222",
                      padding: "20px",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {feature.icon}
                    <div>
                      <div style={{ fontSize: "14px", color: "#999" }}>
                        {feature.label}
                      </div>
                      <div style={{ fontSize: "16px", marginTop: "4px" }}>
                        {feature.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 500,
                  marginBottom: "12px",
                  color: "#fff",
                }}
              >
                Investment Summary
              </h3>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                <div
                  style={{
                    flex: "1 1 150px",
                    minWidth: "150px",
                    backgroundColor: "#222",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#999",
                      marginBottom: "8px",
                    }}
                  >
                    Property Value
                  </div>
                  <div style={{ fontSize: "16px" }}>
                    {(Number(property.totalPrice) / 100_000_000).toFixed(2)} ICP
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#5D3FD3",
                      marginTop: "4px",
                    }}
                  >
                    $
                    {icpPrice
                      ? (
                          (Number(property.totalPrice) / 100_000_000) *
                          icpPrice
                        ).toFixed(2)
                      : "Loading..."}
                  </div>
                </div>

                <div
                  style={{
                    flex: "1 1 150px",
                    minWidth: "150px",
                    backgroundColor: "#222",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#999",
                      marginBottom: "8px",
                    }}
                  >
                    Price Per Token
                  </div>
                  <div style={{ fontSize: "16px" }}>
                    ${icpPrice || "Loading"}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginTop: "12px",
                }}
              >
                <div
                  style={{
                    flex: "1 1 150px",
                    minWidth: "150px",
                    backgroundColor: "#222",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#999",
                      marginBottom: "8px",
                    }}
                  >
                    Investors
                  </div>
                  <div style={{ fontSize: "16px" }}>{uniqueInvestorsCount}</div>
                </div>

                <div
                  style={{
                    flex: "1 1 150px",
                    minWidth: "150px",
                    backgroundColor: "#222",
                    padding: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#999",
                      marginBottom: "8px",
                    }}
                  >
                    Funding
                  </div>
                  <div style={{ fontSize: "16px" }}>{fundingPercentage}%</div>
                  <div
                    style={{
                      height: "4px",
                      background: "#333",
                      borderRadius: "2px",
                      marginTop: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${fundingPercentage}%`,
                        height: "100%",
                        background: "#5D3FD3",
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  flex: "1 1 100%",
                  backgroundColor: "#222",
                  padding: "12px",
                  borderRadius: "8px",
                  marginTop: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    color: "#999",
                    marginBottom: "8px",
                  }}
                >
                  Monthly Rental Yield
                </div>
                <div style={{ fontSize: "16px" }}>
                  {property.yieldPercentage}%
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <button
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid #5D3FD3",
                  color: "#5D3FD3",
                  padding: "12px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Add to Wishlist
              </button>

              <button
                onClick={() => !property.fundingComplete && setIsOpen(true)}
                style={{
                  backgroundColor: property.fundingComplete
                    ? "#333"
                    : "#5D3FD3",
                  color: "#fff",
                  padding: "12px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  border: "none",
                  cursor: property.fundingComplete ? "default" : "pointer",
                  fontSize: "16px",
                }}
              >
                {property.fundingComplete ? "Fully Funded" : "Buy Token"}
              </button>
            </div>
          </div>

          <div
            style={{ flex: "1 1 400px", minWidth: "300px", maxWidth: "700px" }}
          >
            <div
              style={{
                marginBottom: "24px",
                background: "#181818",
                padding: "20px",
                borderRadius: "12px",
              }}
            >
              <h3
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: "16px",
                }}
              >
                Gallery
              </h3>
              {property.imageUrls?.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
                    gap: "16px",
                  }}
                >
                  {property.imageUrls.map((url, i) => (
                    <div
                      key={i}
                      style={{
                        width: "100%",
                        aspectRatio: "1",
                        overflow: "hidden",
                        borderRadius: "8px",
                      }}
                    >
                      <img
                        src={url}
                        alt={`${property.name} ${i + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "200px",
                    backgroundColor: "#222",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#666",
                    borderRadius: "8px",
                  }}
                >
                  No Images Available
                </div>
              )}
            </div>

            <div
              style={{
                backgroundColor: "#181818",
                padding: "20px",
                borderRadius: "12px",
                color: "#ddd",
                lineHeight: 1.6,
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  color: "#fff",
                  marginBottom: "12px",
                }}
              >
                About Property
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 400,
                  color: "#fff",
                  marginBottom: "12px",
                }}
              >
                {property.description}
              </p>
            </div>
          </div>
        </div>

        {/* Investment Modal */}
        {isOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px",
            }}
          >
            <div
              style={{
                backgroundColor: "#222",
                borderRadius: "12px",
                padding: "24px",
                width: "100%",
                maxWidth: "400px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              }}
            >
              <h2
                style={{
                  marginBottom: "8px",
                  fontSize: "20px",
                  fontWeight: "600",
                  color: "#fff",
                }}
              >
                Invest in {property.name}
              </h2>

              <p
                style={{
                  color: "#999",
                  marginBottom: "24px",
                  fontSize: "14px",
                }}
              >
                Enter the amount of ICP you want to invest
              </p>

              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#bbb",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  ICP Amount
                </label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder="0.00"
                  style={{
                    width: "90%",
                    padding: "12px",
                    backgroundColor: "#333",
                    border: "1px solid #444",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "16px",
                    outline: "none",
                    ":focus": {
                      borderColor: "#5D3FD3",
                    },
                  }}
                />
              </div>

              <div style={{ marginBottom: "24px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#bbb",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  Estimated Value (USD)
                </label>
                <input
                  type="text"
                  value={
                    investmentAmount && icpPrice
                      ? `$${(parseFloat(investmentAmount) * icpPrice).toFixed(
                          2
                        )}`
                      : "$0.00"
                  }
                  disabled
                  style={{
                    width: "90%",
                    padding: "12px",
                    backgroundColor: "#2a2a2a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    color: "#aaa",
                    fontSize: "16px",
                    cursor: "not-allowed",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: "8px",
                    backgroundColor: "transparent",
                    border: "1px solid #5D3FD3",
                    color: "#5D3FD3",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "400",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    ":hover": {
                      backgroundColor: "rgba(93, 63, 211, 0.1)",
                    },
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleBuyTokens}
                  disabled={isLoading || !investmentAmount}
                  style={{
                    flex: 1,
                    padding: "8px",
                    backgroundColor: "#5D3FD3",
                    border: "none",
                    color: "white",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "400",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    ":hover": {
                      backgroundColor: "#4a2dab",
                    },
                  }}
                >
                  {isLoading ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Pointer() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.3347 16.5002C18.1734 17.7542 18.5273 18.5196 18.2303 19.1585C18.1936 19.2367 18.1508 19.3122 18.1019 19.3849C17.5749 20.1668 16.2136 20.1668 13.4911 20.1668H8.50994C5.78744 20.1668 4.42711 20.1668 3.90003 19.3849C3.85194 19.3126 3.80905 19.2369 3.77169 19.1585C3.47469 18.5196 3.82853 17.7542 4.66636 16.5002M13.7505 8.7085C13.7505 9.43784 13.4608 10.1373 12.9451 10.653C12.4293 11.1688 11.7299 11.4585 11.0005 11.4585C10.2712 11.4585 9.57171 11.1688 9.05598 10.653C8.54026 10.1373 8.25053 9.43784 8.25053 8.7085C8.25053 7.97915 8.54026 7.27968 9.05598 6.76395C9.57171 6.24823 10.2712 5.9585 11.0005 5.9585C11.7299 5.9585 12.4293 6.24823 12.9451 6.76395C13.4608 7.27968 13.7505 7.97915 13.7505 8.7085Z"
        stroke="#D5D5D5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 1.8335C14.7208 1.8335 17.875 4.97583 17.875 8.78825C17.875 12.6612 14.6694 15.3791 11.7086 17.2271C11.493 17.3511 11.2487 17.4164 11 17.4164C10.7513 17.4164 10.507 17.3511 10.2914 17.2271C7.33608 15.3607 4.125 12.6749 4.125 8.78825C4.125 4.97583 7.27925 1.8335 11 1.8335Z"
        stroke="#D5D5D5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Bed() {
  return (
    <svg
      width="22"
      height="20"
      viewBox="0 0 22 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 15.5H1M21 19V14C21 12.114 21 11.172 20.414 10.586C19.828 10 18.886 10 17 10M17 10H5M17 10V8.213C17 7.833 16.943 7.705 16.65 7.555C16.04 7.243 15.299 7 14.5 7C13.701 7 12.96 7.243 12.35 7.555C12.057 7.705 12 7.833 12 8.213V10M5 10C3.114 10 2.172 10 1.586 10.586C1 11.172 1 12.114 1 14V19M5 10V8.213C5 7.833 5.057 7.705 5.35 7.555C5.96 7.243 6.701 7 7.5 7C8.299 7 9.04 7.243 9.65 7.555C9.943 7.705 10 7.833 10 8.213V10"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 10V5.36C20 4.669 20 4.323 19.808 3.997C19.616 3.671 19.342 3.501 18.794 3.163C16.587 1.8 13.9 1 11 1C8.1 1 5.413 1.8 3.206 3.163C2.658 3.501 2.384 3.67 2.192 3.997C2 4.324 2 4.669 2 5.36V10"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Bath() {
  return (
    <svg
      width="22"
      height="20"
      viewBox="0 0 22 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 18L4 19M17 18L18 19M2 10V11C2 14.3 2 15.95 3.025 16.975C4.05 18 5.7 18 9 18H13C16.3 18 17.95 18 18.975 16.975C20 15.95 20 14.3 20 11V10M1 10H21M3 10V3.52301C2.99965 2.91619 3.21801 2.32958 3.61506 1.8707C4.01211 1.41181 4.56125 1.1114 5.16181 1.02453C5.76237 0.937658 6.37413 1.07015 6.88494 1.39771C7.39575 1.72528 7.77139 2.22597 7.943 2.80801L8 3.00001M7 4.00001L9.5 2.00001"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Square() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1665_34677)">
        <path
          d="M11.4794 20.2069L4.49164 13.2192C3.7007 12.4282 3.7007 10.972 4.49164 10.181L11.4794 3.1933C12.2703 2.40237 13.7266 2.40237 14.5175 3.1933L21.5052 10.181C22.2962 10.972 22.2962 12.4282 21.5052 13.2192L14.5175 20.2069C13.7266 20.9978 12.2703 20.9978 11.4794 20.2069V20.2069Z"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.60156 17.123L8.27439 22.7959"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.7266 22.7959L23.3994 17.123"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1665_34677">
          <rect width="26" height="26" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
