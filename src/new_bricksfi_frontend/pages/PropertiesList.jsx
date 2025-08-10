import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { new_bricksfi_backend } from "declarations/new_bricksfi_backend";
import Navbar from "../components/Navbar";

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    bedrooms: 0,
    bathrooms: 0,
    squareMeters: 0,
    imageUrls: [""],
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {
        name,
        description,
        bedrooms,
        bathrooms,
        squareMeters,
        imageUrls,
      } = formData;
      await new_bricksfi_backend.createProperty(
        name,
        description,
        bedrooms,
        bathrooms,
        squareMeters,
        imageUrls.filter((url) => url.trim() !== "")
      );
      const fetchedProperties = await new_bricksfi_backend.getAllProperties();
      setProperties(fetchedProperties);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...formData.imageUrls];
    newImageUrls[index] = value;
    setFormData((prev) => ({ ...prev, imageUrls: newImageUrls }));
  };

  const addImageUrlField = () => {
    setFormData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ""] }));
  };

  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#000",
    color: "#fff",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  };

  const cardStyle = {
    backgroundColor: "#111",
    borderRadius: "12px",
    // padding: "16px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
    marginBottom: "20px",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #333",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    marginBottom: "12px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    color: "#bbb",
  };

  const buttonStyle = {
    backgroundColor: "#2563eb",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",
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
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
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

          {/* Form (commented out) */}
          {/* <form
          onSubmit={handleSubmit}
          style={{ ...cardStyle, marginBottom: "40px" }}
        >
          <div>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <label style={labelStyle}>Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                min="0"
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                min="0"
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Square Meters</label>
              <input
                type="number"
                name="squareMeters"
                value={formData.squareMeters}
                onChange={handleChange}
                min="0"
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Image URLs</label>
            {formData.imageUrls.map((url, index) => (
              <div key={index}>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  style={inputStyle}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addImageUrlField}
              style={{
                ...buttonStyle,
                backgroundColor: "#444",
                marginTop: "6px",
              }}
            >
              + Add Another Image
            </button>
          </div>

          <button type="submit" style={{ ...buttonStyle, marginTop: "12px" }}>
            Create Property
          </button>
        </form> */}

          {/* Properties Grid */}
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

                  {/* Details below the image */}
                  <div style={{ padding: "16px" }}>
                    <h2
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        marginBottom: "6px",
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
                        color: "#999",
                        marginBottom: "10px",
                      }}
                    >
                      <span>{Number(property.bedrooms)} Beds</span>
                      <span>{Number(property.bathrooms)} Baths</span>
                      <span>{Number(property.squareMeters)} m²</span>
                    </div>

                    {/* Centered button for View Details */}
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
