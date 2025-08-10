import React from "react";
import { new_bricksfi_backend } from "declarations/new_bricksfi_backend";

const CreateProperty = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    bedrooms: 0,
    bathrooms: 0,
    squareMeters: 0,
    imageUrls: [""],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  return (
    <div>
      <form
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
      </form>
    </div>
  );
};

export default CreateProperty;
