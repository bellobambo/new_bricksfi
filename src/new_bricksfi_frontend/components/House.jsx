function House() {
  return (
    <>
      <svg width="0" height="0">
        <defs>
          <clipPath id="houseClip" clipPathUnits="objectBoundingBox">
            <path
              d="
                M0.5 0
                L0.03 0.5
                Q0 0.52 0 0.55
                L0 0.95
                Q0 1 0.05 1
                L0.95 1
                Q1 1 1 0.95
                L1 0.55
                Q1 0.52 0.97 0.5
                Z
              "
              // Explanation:
              // M0.5 0 -> top tip
              // L0.03 0.5 -> left base of roof (slightly inset for rounding)
              // Q0 0.52 0 0.55 -> rounded corner down left edge
              // L0 0.95 -> bottom left (with slight inset)
              // Q0 1 0.05 1 -> bottom left corner rounded
              // L0.95 1 -> bottom right inset
              // Q1 1 1 0.95 -> bottom right corner rounded
              // L1 0.55 -> right base of roof inset
              // Q1 0.52 0.97 0.5 -> rounded roof right corner
              // Z close path
            />
          </clipPath>
        </defs>
      </svg>

      <img
        src="/HomeImage.png"
        alt=""
        style={{
          width: "400px",
          height: "400px",
          objectFit: "cover",
          clipPath: "url(#houseClip)",
        }}
      />
    </>
  );
}

export default House