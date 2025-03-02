import React, { useState } from "react";

import styles from "./FontSizeForm.module.css";
import { useSettings } from "../../../contexts/SettingsContext";

const FontSizeForm = () => {
  const { settings, updateSettings } = useSettings();
  const [selectedSize, setSelectedSize] = useState(settings.fontSize);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateSettings("fontSize", selectedSize);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-inputs">
        <div className="form-input-group">
          <label htmlFor="fontsize">Story font size</label>
          <select
            name="fontsize"
            id="fontsize"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="small">Small</option>
            <option value="initial">Normal</option>
            <option value="large">Large</option>
            <option value="larger">Larger</option>
          </select>
          <div
            className={styles.examplePage}
            style={{ fontSize: selectedSize }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu
            nibh at odio fermentum convallis nec ut sapien. Praesent volutpat
            nisl et tortor ornare interdum. Nam rutrum vestibulum porttitor.
            Fusce.
          </div>
          <div>
            <strong>Warning:</strong> Altering the font size will disrupt
            current bookmark placements.
          </div>
        </div>
        <button type="submit" disabled={selectedSize === settings.fontSize}>
          Set font size
        </button>
      </div>
    </form>
  );
};

export default FontSizeForm;
