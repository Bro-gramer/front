import React, { useEffect, useState } from "react";
import { FileText, Download } from "lucide-react";
import "./Task.css";

import API_BASE from "../../config";

function Task() {
  const [activeClassName, setActiveClassName] = useState("");
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [files, setFiles] = useState([]);
  const [homeroomTeacher, setHomeroomTeacher] = useState(""); // NEW
  const schoolId = localStorage.getItem("schoolId");

  // Get active class and section from localStorage
  useEffect(() => {
    const storedClassName = localStorage.getItem("activeClassName");
    const storedSectionId = localStorage.getItem("activeSectionId");
    if (storedClassName) setActiveClassName(storedClassName);
    if (storedSectionId) setSelectedSection(storedSectionId);
  }, []);

  // Fetch sections when activeClassName changes (for display only)
  useEffect(() => {
    if (!activeClassName || !schoolId) return;
    fetch(`${API_BASE}/api/schools/${schoolId}/classes`)
      .then((res) => res.json())
      .then((data) => {
        const classObj = data.classes.find((c) => c.name === activeClassName);
        if (classObj) {
          return fetch(
            `${API_BASE}/api/schools/${schoolId}/classes/${classObj.id}/sections`
          );
        }
        throw new Error("Class not found");
      })
      .then((res) => res.json())
      .then((data) => {
        const realSections = (data.sections || []).filter(
          (s) => s.id !== "_placeholder"
        );
        setSections(realSections);
      })
      .catch(() => setSections([]));
  }, [activeClassName, schoolId]);

  // Fetch files when selected section changes
  useEffect(() => {
    if (!selectedSection || !activeClassName || !schoolId) return;
    fetch(`${API_BASE}/api/schools/${schoolId}/classes`)
      .then((res) => res.json())
      .then((data) => {
        const classObj = data.classes.find((c) => c.name === activeClassName);
        if (classObj) {
          return fetch(
            `${API_BASE}/api/tasks/${classObj.id}/${selectedSection}`
          );
        }
        throw new Error("Class not found");
      })
      .then((res) => res.json())
      .then((data) => {
        setFiles(data.files || []);
      })
      .catch(() => setFiles([]));
  }, [selectedSection, activeClassName, schoolId]);

  // Fetch homeroom teacher for the selected section
  useEffect(() => {
    if (!selectedSection || !activeClassName || !schoolId) {
      setHomeroomTeacher("");
      return;
    }
    fetch(`${API_BASE}/api/schools/${schoolId}/classes`)
      .then((res) => res.json())
      .then((data) => {
        const classObj = data.classes.find((c) => c.name === activeClassName);
        if (!classObj) throw new Error("Class not found");
        return fetch(
          `${API_BASE}/api/schools/${schoolId}/classes/${classObj.id}/sections/${selectedSection}/teachers`
        );
      })
      .then((res) => res.json())
      .then((data) => {
        const teachers = data.teachers || [];
        const homeroom = teachers.find((t) => t.isHomeroom);
        setHomeroomTeacher(homeroom ? homeroom.name : "");
      })
      .catch(() => setHomeroomTeacher(""));
  }, [selectedSection, activeClassName, schoolId]);

  return (
    <div className="task-container">
      <h1 className="task-title">Task</h1>

      <div className="section-header">
        <div className="section-info">
          <div className="section-avatar">
            <span>
              {selectedSection
                ? (() => {
                    const section = sections.find(
                      (s) => s.id === selectedSection
                    );
                    const match = section?.name?.match(/\d+/);
                    return match ? `S${match[0]}` : "--";
                  })()
                : "--"}
            </span>
          </div>
          <div className="section-details">
            <h2>
              {sections.find((s) => s.id === selectedSection)?.name ||
                "No Section"}
            </h2>
            <p>{homeroomTeacher || "No Homeroom Teacher"}</p>
          </div>
        </div>
      </div>

      <div className="documents-list">
        {files.length > 0 ? (
          files.map((file, index) => (
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
          <p>No task files found for this section.</p>
        )}
      </div>
    </div>
  );
}

export default Task;
