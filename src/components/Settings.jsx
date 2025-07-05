import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/Config"; // adjust path if needed
import "./Settings.css";

function Settings({ onLogout }) {
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    // govID: "",
    // address: "",
    // emergency: "",
  });

  useEffect(() => {
    const fetchSchoolData = async () => {
      const schoolId = localStorage.getItem("schoolId");
      if (!schoolId) return;

      try {
        const schoolRef = doc(db, "schools", schoolId);
        const docSnap = await getDoc(schoolRef);
        if (docSnap.exists()) {
          const schoolData = docSnap.data();
          setFormData({
            fullName: schoolData.name || "",
            email: schoolData.email || "",
            phone: schoolData.phoneNumber || "",
            // govID: schoolData.govID || "",
            // address: schoolData.address || "",
            // emergency: schoolData.emergency || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch school data:", err);
      }
    };

    fetchSchoolData();
  }, []);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    const schoolId = localStorage.getItem("schoolId");
    if (!schoolId) return;

    try {
      const schoolRef = doc(db, "schools", schoolId);
      await updateDoc(schoolRef, {
        [editField]: formData[editField],
      });
      setEditField(null);
    } catch (err) {
      console.error("Failed to update field:", err);
    }
  };

  const renderField = (label, field, isEmail = false) => (
    <div className="setting-item">
      <div className="setting-content">
        <h3>{label}</h3>
        {editField === field ? (
          <input
            type={isEmail ? "email" : "text"}
            value={formData[field]}
            onChange={(e) => handleChange(field, e.target.value)}
          />
        ) : (
          <p>{formData[field] || "Not provided"}</p>
        )}
      </div>
      {editField === field ? (
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      ) : (
        <button className="edit-button" onClick={() => setEditField(field)}>
          {formData[field] ? "Edit" : "Add"}
        </button>
      )}
    </div>
  );

  return (
    <div className="settings-container">
      <h1 className="settings-title">Settings</h1>

      <div className="profile-section">
        <div className="profile-header">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <div className="profile-info">
            <h2>{formData.fullName || "No Name"}</h2>
            <p>{formData.email || "No Email"}</p>
          </div>
        </div>
      </div>

      <div className="settings-section">
        {renderField("Full name", "fullName")}
        {renderField("Email address", "email", true)}
        {renderField("Phone numbers", "phone")}
        {/* Removed Government ID, Address, and Emergency contact */}
        <div className="setting-item">
          <div className="setting-content">
            <h3>Logout</h3>
            <p>Sign out of your account</p>
          </div>
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
