import React, { useEffect, useState } from "react";
import { FileText, Download, MoreVertical } from "lucide-react";
import "./Materials.css";

import API_BASE from "../../config";

function Materials() {
  const [activeClassName, setActiveClassName] = useState("");
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    const storedClassName = localStorage.getItem("activeClassName");
    if (storedClassName) {
      setActiveClassName(storedClassName);

      fetch(`${API_BASE}/api/materials/${storedClassName}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.files) {
            setMaterials(data.files);
          }
        })
        .catch((err) => {
          console.error("Error fetching materials:", err);
        });
    }
  }, []);

  return (
    <div className="materials-container">
      <h1 className="materials-title">Materials</h1>

      <div className="section-header">
        <div className="section-info">
          <div className="section-avatar">
            <span>
              {activeClassName ? activeClassName[0].toUpperCase() : "--"}
            </span>
          </div>
          <div className="section-details">
            <h2>{activeClassName || "No Class Selected"}</h2>
          </div>
        </div>
        {/* Dropdown REMOVED as requested */}
      </div>

      <div className="documents-list">
        {materials.length > 0 ? (
          materials.map((file, index) => (
            <div key={index} className="document-item">
              <div className="document-icon">
                <FileText size={20} color="#24786d" />
              </div>
              <div className="document-info">
                <p className="document-name">{file.name}</p>
              </div>
              <div className="document-actions">
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  <button className="action-button download-button">
                    <Download size={20} color="#24786d" />
                  </button>
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>No materials found for this class.</p>
        )}
      </div>
    </div>
  );
}

export default Materials;
