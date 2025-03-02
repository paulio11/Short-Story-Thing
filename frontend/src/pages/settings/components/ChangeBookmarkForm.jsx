import React, { useState } from "react";

import styles from "./ChangeBookmarkForm.module.css";
import { useSettings } from "../../../contexts/SettingsContext";

const ChangeBookmarkForm = () => {
  const { settings, updateSettings } = useSettings();
  const [selectedColor, setSelectedColor] = useState(settings.bookmarkColor);

  const choices = [
    { name: "Red", hex: "#980000" },
    { name: "Orange Red", hex: "#B34D00" },
    { name: "Orange", hex: "#B37F00" },
    { name: "Amber", hex: "#B39F00" },
    { name: "Yellow", hex: "#B3B300" },
    { name: "Yellow Green", hex: "#8F8F00" },
    { name: "Chartreuse", hex: "#66B300" },
    { name: "Green", hex: "#00B300" },
    { name: "Spring Green", hex: "#00B366" },
    { name: "Cyan", hex: "#00B3B3" },
    { name: "Deep Sky Blue", hex: "#0080B3" },
    { name: "Dodger Blue", hex: "#0066B3" },
    { name: "Blue", hex: "#0033B3" },
    { name: "Indigo", hex: "#3D0066" },
    { name: "Blue Violet", hex: "#6A1D9B" },
    { name: "Violet", hex: "#660066" },
    { name: "Orchid", hex: "#6A2D8D" },
    { name: "Magenta", hex: "#B300B3" },
    { name: "Fuchsia", hex: "#9C1AFF" },
    { name: "Deep Pink", hex: "#B30066" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings("bookmarkColor", selectedColor);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-inputs">
        <div className={`form-input-group ${styles.container}`}>
          <label htmlFor="bookmark-color">Bookmark color</label>
          <div className={styles.colors}>
            {choices.map((color, index) => (
              <div
                key={index}
                className={`${styles.color} ${
                  selectedColor === color.hex && styles.selectedColor
                }`}
                style={{ backgroundColor: color.hex }}
                onClick={() => setSelectedColor(color.hex)}
              ></div>
            ))}
          </div>
          {/* Select element for accessibility (hidden) */}
          <select
            name="bookmark-color"
            id="bookmark-color"
            onChange={(e) => setSelectedColor(e.target.value)}
            hidden
          >
            <option value="" disabled>
              Select a bookmark color
            </option>
            {choices.map((color, index) => (
              <option key={index} value={color.hex}>
                {color.name}
              </option>
            ))}
          </select>
        </div>
        <button disabled={selectedColor === settings.bookmarkColor}>
          Set bookmark color
        </button>
      </div>
    </form>
  );
};

export default ChangeBookmarkForm;
