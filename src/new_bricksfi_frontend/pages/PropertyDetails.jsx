import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { new_bricksfi_backend } from "declarations/new_bricksfi_backend";

const containerStyle = {
  minHeight: "100vh",
  backgroundColor: "#000",
  padding: "24px",
  color: "#fff",
  fontFamily: "Arial, sans-serif",
  maxWidth: "800px",
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

  if (!property) {
    return <p style={{ color: "#fff", padding: "20px" }}>Loading...</p>;
  }

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 1000,
        }}
      >
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

      <div style={containerStyle}>
        {property.imageUrls && property.imageUrls.length > 0 ? (
          <img
            src={property.imageUrls[0]}
            alt={`${property.name} main`}
            style={{
              width: "100%",
              objectFit: "contain", // so full image visible without cropping
              display: "block",
              borderRadius: "12px",
              marginBottom: "24px",
            }}
            onError={(e) => (e.target.style.display = "none")}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "320px",
              backgroundColor: "#333",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#999",
              marginBottom: "24px",
            }}
          >
            No Image
          </div>
        )}

        {/* Property Name */}
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

        {/* Details grid 2 per row */}
        <div style={detailsGridStyle}>
          <div style={detailBlockStyle}>{Number(property.bedrooms)} Beds</div>
          <div style={detailBlockStyle}>{Number(property.bathrooms)} Baths</div>
          <div style={detailBlockStyle}>{Number(property.squareMeters)} m²</div>
          <div style={detailBlockStyle}>
            {" "}
            {/* Empty block or you can add something here */}{" "}
          </div>
        </div>

        {/* Description full width below */}
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

        {/* Buy Token Button */}
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
    </>
  );
}
