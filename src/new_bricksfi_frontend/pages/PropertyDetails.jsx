import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { new_bricksfi_backend } from "declarations/new_bricksfi_backend";
import Navbar from "../components/Navbar";

const containerStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "space-between",
  backgroundColor: "#000",
  fontFamily: "Albert Sans",

  // padding: "24px",
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
  const [property, setProperty] = useState(null);
  const [investors, setInvestors] = useState([]);
  const [fundingPercentage, setFundingPercentage] = useState(0);
  const [uniqueInvestorsCount, setUniqueInvestorsCount] = useState(0);
  const [contentWidth, setContentWidth] = useState("100%");
  const [icpPrice, setIcpPrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(true);
  const imageRef = useRef(null);

  useEffect(() => {
    async function fetchPropertyData() {
      try {
        // Fetch property
        const propertyData = await new_bricksfi_backend.getProperty(Number(id));
        if (propertyData && propertyData.length > 0) {
          setProperty(propertyData[0]);

          // Calculate funding percentage
          const funded = Number(propertyData[0].fundedAmount);
          const total = Number(propertyData[0].totalPrice);
          const percentage =
            total > 0 ? Math.min(100, (funded / total) * 100) : 0;
          setFundingPercentage(percentage.toFixed(0));

          // Fetch investment details
          const investmentDetails =
            await new_bricksfi_backend.getPropertyInvestmentDetails(Number(id));
          setInvestors(investmentDetails.investments);
          setUniqueInvestorsCount(investmentDetails.uniqueInvestors);
        }
      } catch (error) {
        console.error("Error fetching property data:", error);
      }
    }

    fetchPropertyData();
  }, [id]);

  useEffect(() => {
    const updateWidth = () => {
      if (imageRef.current) {
        setContentWidth(`${imageRef.current.clientWidth}px`);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, [property]); // Re-run when property loads (image will be available)

  useEffect(() => {
    async function fetchIcpPrice() {
      try {
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

  if (!property) {
    return <p style={{ color: "#fff", padding: "20px" }}>Loading...</p>;
  }

  return (
    <>
      <Navbar />

      <div style={{ padding: "30px" }}>
        {/* Full-width image */}
        {property.imageUrls && property.imageUrls.length > 0 ? (
          <img
            ref={imageRef}
            src={property.imageUrls[0]}
            alt={`${property.name} main`}
            style={{
              width: "100vw",
              minWidth: "100%",
              height: "50vh", // fill half the screen height dynamically
              maxHeight: "500px", // prevent it from becoming too tall on large screens
              objectFit: "cover",
              display: "block",
            }}
            onError={(e) => (e.target.style.display = "none")}
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

        {/* Rest of the property details */}
        <div style={{ ...containerStyle, maxWidth: contentWidth }}>
          <div style={{ width: "500px" }}>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "600",
                marginTop: "20px",
                marginBottom: "10px",
                color: "#fff",
              }}
            >
              {property.name}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginBottom: "10px",
              }}
            >
              <div>
                <Pointer />
              </div>
              <div style={{ fontSize: "16px", fontWeight: "500" }}>
                {property.location}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginBottom: "16px",
                width: "600px",
              }}
            >
              {/* Bedroom block */}
              <div
                style={{
                  backgroundColor: "#181818",
                  width: "180px",
                  height: "100px",
                  borderRadius: "8px",
                  color: "#ccc",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center", // vertically center
                  justifyContent: "flex-start", // align left horizontally
                  gap: "18px",
                  paddingLeft: "24px", // consistent padding left
                  paddingRight: "12px",
                  textAlign: "left",
                  flex: 1,
                }}
              >
                <span>
                  <Bed />
                </span>
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>Bedroom</span>
                  <span style={{ fontSize: "18px", marginTop: "4px" }}>
                    {Number(property.bedrooms)}
                  </span>
                </span>
              </div>

              {/* Bathrooms block */}
              <div
                style={{
                  backgroundColor: "#181818",
                  width: "180px",
                  height: "100px",
                  borderRadius: "8px",
                  color: "#ccc",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "18px",
                  paddingLeft: "24px",
                  paddingRight: "12px",
                  textAlign: "left",
                  flex: 1,
                }}
              >
                <span>
                  <Bath />
                </span>
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>Bathrooms</span>
                  <span style={{ fontSize: "18px", marginTop: "4px" }}>
                    {Number(property.bathrooms)}
                  </span>
                </span>
              </div>

              {/* Square Meters block */}
              <div
                style={{
                  backgroundColor: "#181818",
                  width: "180px",
                  height: "100px",
                  borderRadius: "8px",
                  color: "#ccc",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "18px",
                  paddingLeft: "24px",
                  paddingRight: "12px",
                  textAlign: "left",
                  flex: 1,
                }}
              >
                <span>
                  <Square />
                </span>
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>Square Meters</span>
                  <span style={{ fontSize: "18px", marginTop: "4px" }}>
                    {Number(property.squareMeters)}
                  </span>
                </span>
              </div>
            </div>

            <span style={{ marginBottom: "10px" }}>Investment Summary</span>
            <div></div>
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "10px",
                marginBottom: "16px",
                width: "600px",
              }}
            >
              <div
                style={{
                  backgroundColor: "#181818",
                  height: "100px",
                  borderRadius: "8px",
                  color: "#ccc",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "18px",
                  paddingLeft: "24px",
                  paddingRight: "12px",
                  textAlign: "left",
                  flex: 1, // <-- added to fill available space
                  minWidth: 0, // <-- prevents overflow issues
                }}
              >
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <small
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      marginBottom: "15px",
                    }}
                  >
                    Property Value
                  </small>
                  <span style={{ fontSize: "14px" }}>
                    {Number(property.totalPrice)} ICP
                  </span>
                  <span style={{ fontSize: "16px", marginTop: "5px" }}>
                    $
                    {icpPrice
                      ? (Number(property.totalPrice) * icpPrice).toFixed(2)
                      : "Loading..."}
                  </span>
                </span>
              </div>

              <div
                style={{
                  backgroundColor: "#181818",
                  height: "100px",
                  borderRadius: "8px",
                  color: "#ccc",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "18px",
                  paddingLeft: "24px",
                  paddingRight: "12px",
                  textAlign: "left",
                  flex: 1, // <-- added to fill available space
                  minWidth: 0, // <-- prevents overflow issues
                }}
              >
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <small
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      marginBottom: "15px",
                    }}
                  >
                    Price Per Token
                  </small>

                  <span style={{ fontSize: "16px", marginTop: "5px" }}>
                    $ {icpPrice}
                  </span>
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "10px",
                marginBottom: "16px",
                width: "600px",
              }}
            >
              {/* Bedroom block */}
              <div
                style={{
                  backgroundColor: "#181818",
                  height: "100px",
                  borderRadius: "8px",
                  color: "#ccc",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "18px",
                  paddingLeft: "24px",
                  paddingRight: "12px",
                  textAlign: "left",
                  flex: 1, // <-- added to fill available space
                  minWidth: 0, // <-- prevents overflow issues
                }}
              >
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>No of Investors</span>
                  <span style={{ fontSize: "18px", marginTop: "4px" }}>
                    {uniqueInvestorsCount}
                  </span>
                </span>
              </div>

              <div
                style={{
                  backgroundColor: "#181818",
                  height: "100px",
                  borderRadius: "8px",
                  color: "#ccc",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "18px",
                  paddingLeft: "24px",
                  paddingRight: "12px",
                  textAlign: "left",
                  flex: 1, // <-- added to fill available space
                  minWidth: 0,
                }}
              >
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>Funding</span>
                  <span style={{ fontSize: "18px", marginTop: "4px" }}>
                    {fundingPercentage}%
                  </span>
                </span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "10px",
                marginBottom: "16px",
                width: "600px",
              }}
            >
              {/* Bathrooms block */}
              <div
                style={{
                  backgroundColor: "#181818",
                  height: "100px",
                  borderRadius: "8px",
                  color: "#ccc",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "18px",
                  paddingLeft: "24px",
                  paddingRight: "12px",
                  textAlign: "left",
                  flex: 1 / 2,
                }}
              >
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>Monthly Rental Yield</span>
                  <span style={{ fontSize: "18px", marginTop: "4px" }}>
                    {Number(property.bathrooms)}
                  </span>
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                alert(`Buying token for property ${property.name}`)
              }
              style={{
                display: "block",
                backgroundColor: "black",
                border: "2px solid #1a1a1a",
                color: "white",
                padding: "14px 0",
                borderRadius: "8px",
                fontWeight: "600",
                // width: "45%",
                cursor: "pointer",
                fontSize: "16px",
                marginBottom: "15px",
                width: "600px",
              }}
            >
              Add to Wishist
            </button>
            <button
              onClick={() =>
                alert(`Buying token for property ${property.name}`)
              }
              style={{
                display: "block",
                backgroundColor: "#5D3FD3",
                color: "white",
                padding: "14px 0",
                borderRadius: "8px",
                fontWeight: "600",
                // width: "45%",
                width: "600px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Buy Token
            </button>
          </div>

          <div style={{ width: "700px" }}>
            <div
              style={{
                marginBottom: "24px",
                background: "#181818",
                padding: "20px",
                borderRadius: "20px",
                marginTop: "20px",
              }}
            >
              <h3
                style={{
                  marginBottom: "16px",
                  fontSize: "20px",
                  fontWeight: "600",
                }}
              >
                Gallery{" "}
              </h3>
              {property.imageUrls && property.imageUrls.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "16px",
                    width: "100%",
                  }}
                >
                  {property.imageUrls.map((url, index) => (
                    <div
                      key={index}
                      style={{
                        width: "100%",
                        height: "150px",
                        overflow: "hidden",
                        borderRadius: "8px",
                      }}
                    >
                      <img
                        src={url}
                        alt={`${property.name} image ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "350px",
                    backgroundColor: "#333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                    borderRadius: "8px",
                  }}
                >
                  No Images Available
                </div>
              )}
            </div>
            <p
              style={{
                backgroundColor: "#222",
                padding: "16px",
                borderRadius: "12px",
                color: "#bbb",
                fontWeight: "500",
                fontSize: "16px",
                marginBottom: "24px",
                lineHeight: "1.5",
              }}
            >
              {property.description}
            </p>
          </div>
        </div>
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
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11 1.8335C14.7208 1.8335 17.875 4.97583 17.875 8.78825C17.875 12.6612 14.6694 15.3791 11.7086 17.2271C11.493 17.3511 11.2487 17.4164 11 17.4164C10.7513 17.4164 10.507 17.3511 10.2914 17.2271C7.33608 15.3607 4.125 12.6749 4.125 8.78825C4.125 4.97583 7.27925 1.8335 11 1.8335Z"
        stroke="#D5D5D5"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
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
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M20 10V5.36C20 4.669 20 4.323 19.808 3.997C19.616 3.671 19.342 3.501 18.794 3.163C16.587 1.8 13.9 1 11 1C8.1 1 5.413 1.8 3.206 3.163C2.658 3.501 2.384 3.67 2.192 3.997C2 4.324 2 4.669 2 5.36V10"
        stroke="white"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
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
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
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
      <g clip-path="url(#clip0_1665_34677)">
        <path
          d="M11.4794 20.2069L4.49164 13.2192C3.7007 12.4282 3.7007 10.972 4.49164 10.181L11.4794 3.1933C12.2703 2.40237 13.7266 2.40237 14.5175 3.1933L21.5052 10.181C22.2962 10.972 22.2962 12.4282 21.5052 13.2192L14.5175 20.2069C13.7266 20.9978 12.2703 20.9978 11.4794 20.2069V20.2069Z"
          stroke="white"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M2.60156 17.123L8.27439 22.7959"
          stroke="white"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M17.7266 22.7959L23.3994 17.123"
          stroke="white"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
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
