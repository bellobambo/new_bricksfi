import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { new_bricksfi_backend } from "declarations/new_bricksfi_backend";
import Navbar from "../components/Navbar";

const containerStyle = {
  minHeight: "100vh",
  backgroundColor: "#000",
  padding: "24px",
  color: "#fff",
  fontFamily: "Arial, sans-serif",
  margin: "0 auto",
};

const detailsGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "12px",
  marginBottom: "16px",
};

const detailBlockStyle = {
  backgroundColor: "#222",
  padding: "12px",
  borderRadius: "8px",
  color: "#ccc",
  fontWeight: "600",
  textAlign: "center",
};

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [contentWidth, setContentWidth] = useState("100%");
  const imageRef = useRef(null);

  useEffect(() => {
    new_bricksfi_backend.getProperty(Number(id)).then((res) => {
      console.log("Fetched property:", res);
      if (res && res.length > 0) {
        setProperty(res[0]);
      } else {
        setProperty(null);
      }
    });
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

  if (!property) {
    return <p style={{ color: "#fff", padding: "20px" }}>Loading...</p>;
  }

  return (
    <>
      <Navbar />
      <div style={{ margin: "0 auto" }}>
        <Link
          to="/"
          style={{
            display: "inline-block",
            color: "white",
            padding: "10px 16px",
            borderRadius: "8px",
            fontWeight: "400",
            fontSize: "14px",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          ← Back to Properties
        </Link>
      </div>
      <div>
        {/* Full-width image */}
        {property.imageUrls && property.imageUrls.length > 0 ? (
          <img
            ref={imageRef}
            src={property.imageUrls[0]}
            alt={`${property.name} main`}
            style={{
              width: "100vw",
              height: "400px",
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
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "bold",
              marginBottom: "24px",
              color: "#fff",
              textAlign: "center",
            }}
          >
            {property.name}
          </h2>

          <div style={detailsGridStyle}>
            <div style={detailBlockStyle}>{Number(property.bedrooms)} Beds</div>
            <div style={detailBlockStyle}>
              {Number(property.bathrooms)} Baths
            </div>
            <div style={detailBlockStyle}>
              {Number(property.squareMeters)} m²
            </div>
            <div style={detailBlockStyle}></div>
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

          <button
            onClick={() => alert(`Buying token for property ${property.name}`)}
            style={{
              display: "block",
              backgroundColor: "#5D3FD3",
              color: "white",
              padding: "14px 0",
              borderRadius: "8px",
              fontWeight: "600",
              width: "100%",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Buy Token
          </button>
        </div>
      </div>
    </>
  );
}
