import React, { act, useEffect, useState } from "react";
import {
  Book,
  Calendar,
  GraduationCap,
  UserCheck,
  Award,
  Pencil,
  Trash2,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

import API_BASE from "../../config";

function Home({ activeClassName }) {
  const [classes, setClasses] = useState([]);
  const [activeClass, setActiveClass] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [isAddTeacherFormVisible, setIsAddTeacherFormVisible] = useState(false);
  const [isAddStudentFormVisible, setIsAddStudentFormVisible] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ type: null, id: null });

  const navigate = useNavigate();

  // Replace with actual schoolId from auth/session
  const schoolId = localStorage.getItem("schoolId") || "YOUR_SCHOOL_ID";

  // Fetch classes on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/schools/${schoolId}/classes`)
      .then((res) => res.json())
      .then((data) => {
        setClasses(data.classes || []);
        console.log(
          "Fetched classes:",
          data.classes?.map((c) => c.name)
        );
        console.log("Current activeClassName:", activeClassName);
      });
  }, [schoolId, activeClassName]);

  // Set activeClass based on activeClassName (case-insensitive, trimmed)
  useEffect(() => {
    if (!classes.length) return;
    const found =
      classes.find(
        (c) =>
          c.name &&
          c.name.trim().toLowerCase() === activeClassName.trim().toLowerCase()
      ) || classes[0];
    setActiveClass(found);
    if (found) {
      localStorage.setItem("activeClassId", found.id);
      localStorage.setItem("activeClassName", found.name);
      console.log("Active class:", found.name);
    } else {
      console.log("No matching class found, using default:", classes[0]?.name);
    }
  }, [classes, activeClassName]);

  // Fetch sections when activeClass changes
  useEffect(() => {
    if (!activeClass) return;
    fetch(
      `${API_BASE}/api/schools/${schoolId}/classes/${activeClass.id}/sections`
    )
      .then((res) => res.json())
      .then((data) => {
        const realSections = (data.sections || []).filter(
          (s) => s.id !== "_placeholder"
        );
        setSections(realSections);
        setSelectedSection(realSections[0]?.id || "");
      });
  }, [activeClass, schoolId]);

  // Fetch teachers and students when selectedSection changes
  useEffect(() => {
    if (!activeClass || !selectedSection) return;
    fetch(
      `${API_BASE}/api/schools/${schoolId}/classes/${activeClass.id}/sections/${selectedSection}/teachers`
    )
      .then((res) => res.json())
      .then((data) => setTeachers(data.teachers || []));
    fetch(
      `${API_BASE}/api/schools/${schoolId}/classes/${activeClass.id}/sections/${selectedSection}/students`
    )
      .then((res) => res.json())
      .then((data) => setStudents(data.students || []));
  }, [activeClass, selectedSection, schoolId]);

  useEffect(() => {
    if (selectedSection) {
      localStorage.setItem("activeSectionId", selectedSection);
    }
  }, [selectedSection]);

  // Edit handlers
  const handleEditTeacher = (teacher) => setEditTeacher(teacher);
  const handleEditStudent = (student) => setEditStudent(student);

  // Delete handlers
  const handleDeleteTeacher = (id) => setDeleteConfirm({ type: "teacher", id });
  const handleDeleteStudent = (id) => setDeleteConfirm({ type: "student", id });
  const handleDeleteSection = (id) => setDeleteConfirm({ type: "section", id });

  // Confirm delete (with backend)

  const confirmDelete = async () => {
    try {
      if (deleteConfirm.type === "teacher") {
        await fetch(
          `${API_BASE}/api/schools/${schoolId}/classes/${activeClass.id}/sections/${selectedSection}/teachers/${deleteConfirm.id}`,
          { method: "DELETE" }
        );
        setTeachers(teachers.filter((t) => t.id !== deleteConfirm.id));
      } else if (deleteConfirm.type === "student") {
        await fetch(
          `${API_BASE}/api/schools/${schoolId}/classes/${activeClass.id}/sections/${selectedSection}/students/${deleteConfirm.id}`,
          { method: "DELETE" }
        );
        setStudents(students.filter((s) => s.id !== deleteConfirm.id));
      } else if (deleteConfirm.type === "section") {
        const res = await fetch(
          `${API_BASE}/api/schools/${schoolId}/classes/${activeClass.id}/sections/${deleteConfirm.id}`,
          { method: "DELETE" }
        );
        const data = await res.json();

        if (res.ok) {
          const updatedSections = sections.filter(
            (section) => section.id !== deleteConfirm.id
          );
          setSections(updatedSections);
          setSelectedSection(updatedSections[0]?.id || "");
        } else {
          alert(data.error || "Failed to delete section");
        }
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong while deleting.");
    } finally {
      setDeleteConfirm({ type: null, id: null });
    }
  };

  const cancelDelete = () => setDeleteConfirm({ type: null, id: null });

  // Add handlers
  const handleAddTeacher = () => setIsAddTeacherFormVisible(true);
  const handleAddStudent = () => setIsAddStudentFormVisible(true);

  // Close all popups
  const handleFormClose = () => {
    setIsAddTeacherFormVisible(false);
    setIsAddStudentFormVisible(false);
    setEditTeacher(null);
    setEditStudent(null);
  };

  // Add Teacher
  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const isHomeroom = !!formData.get("isHomeroom");
    const newTeacher = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || "",
      subject: formData.get("subject"),
      isHomeroom,
    };
    // Save to backend
    const res = await fetch(
      `${API_BASE}/api/schools/${schoolId}/classes/${activeClass.id}/sections/${selectedSection}/teachers`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeacher),
      }
    );
    const data = await res.json();
    if (data.teacher) {
      // If homeroom, update all others to false in UI
      if (newTeacher.isHomeroom) {
        setTeachers([
          ...teachers.map((t) => ({ ...t, isHomeroom: false })),
          { ...data.teacher },
        ]);
      } else {
        setTeachers([...teachers, { ...data.teacher }]);
      }
    }
    handleFormClose();
  };

  // Edit Teacher (with backend)
  const handleTeacherEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const isHomeroom = !!formData.get("isHomeroom");
    const updatedTeacher = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      isHomeroom,
    };
    await fetch(
      `${API_BASE}/api/schools/${schoolId}/classes/${activeClass.id}/sections/${selectedSection}/teachers/${editTeacher.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTeacher),
      }
    );
    setTeachers(
      teachers.map((t) =>
        t.id === editTeacher.id
          ? { ...t, ...updatedTeacher }
          : isHomeroom
          ? { ...t, isHomeroom: false }
          : t
      )
    );
    handleFormClose();
  };

  // Add Section
  const handleAddSection = async () => {
    if (!activeClass) return;
    // Find the next section number
    const sectionNumbers = sections
      .map((s) => {
        const match = s.name.match(/Section (\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((n) => n > 0);
    const nextNumber = sectionNumbers.length
      ? Math.max(...sectionNumbers) + 1
      : 1;
    const newSectionName = `Section ${nextNumber}`;

    // POST to backend to create section
    const res = await fetch(
      `${API_BASE}/api/schools/${schoolId}/classes/${activeClass.id}/sections`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSectionName }),
      }
    );
    const data = await res.json();
    if (data.section) {
      setSections([...sections, data.section]);
      setSelectedSection(data.section.id);
    }
  };

  // Add Student
  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newStudent = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };
    // Save to backend
    const res = await fetch(
      `${API_BASE}/api/schools/${schoolId}/classes/${activeClass.id}/sections/${selectedSection}/students`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      }
    );
    const data = await res.json();
    if (data.student) {
      setStudents([...students, { ...data.student }]);
    }
    handleFormClose();
  };

  // Edit Student (with backend)
  const handleStudentEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedStudent = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };
    await fetch(
      `${API_BASE}/api/schools/${schoolId}/classes/${activeClass.id}/sections/${selectedSection}/students/${editStudent.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStudent),
      }
    );
    setStudents(
      students.map((s) =>
        s.id === editStudent.id ? { ...s, ...updatedStudent } : s
      )
    );
    handleFormClose();
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>
          <button
            className={`nav-tab ${activeTab === "teachers" ? "active" : ""}`}
            onClick={() => setActiveTab("teachers")}
          >
            Teachers
          </button>
          <button
            className={`nav-tab ${activeTab === "students" ? "active" : ""}`}
            onClick={() => setActiveTab("students")}
          >
            Students
          </button>
        </nav>
        <div className="section-controls">
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="section-select"
            disabled={!sections.length}
          >
            {sections.length === 0 ? (
              <option>No sections</option>
            ) : (
              sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))
            )}
          </select>
          {/* <button className="add-button" onClick={handleAddSection}>
            + Add Section
          </button> */}
          {activeTab === "home" && (
            <button className="add-button" onClick={handleAddSection}>
              Add Section
            </button>
          )}
          {activeTab === "home" && (
            <button
              className="delete-button"
              onClick={() => handleDeleteSection(selectedSection)}
            >
              Delete Section
            </button>
          )}
          {activeTab === "teachers" && (
            <button className="add-button" onClick={handleAddTeacher}>
              Add
            </button>
          )}
          {activeTab === "students" && (
            <button className="add-button" onClick={handleAddStudent}>
              Add
            </button>
          )}
        </div>
      </div>

      {activeTab === "teachers" && (
        <div className="teachers-list">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-2 px-4">Name</th>
                <th className="text-left py-2 px-4">Email</th>
                <th className="text-left py-2 px-4">Subject</th>
                <th className="text-left py-2 px-4">Actions</th>
                <th className="text-left py-2 px-4">Access Code</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="border-t">
                  <td className="py-2 px-4">
                    {teacher.isHomeroom && (
                      <span
                        title="Homeroom Teacher"
                        style={{ color: "#fbc02d", marginLeft: 4 }}
                      >
                        <Star size={16} fill="#fbc02d" stroke="#fbc02d" />
                      </span>
                    )}
                    {teacher.name}
                  </td>
                  <td className="py-2 px-4">{teacher.email}</td>
                  <td className="py-2 px-4">{teacher.subject}</td>
                  <td className="py-2 px-4">
                    <button
                      className="icon-btn"
                      title="Edit"
                      onClick={() => handleEditTeacher(teacher)}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="icon-btn"
                      title="Delete"
                      onClick={() => handleDeleteTeacher(teacher.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                  <td className="py-2 px-4">{teacher.passcode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "students" && (
        <div className="teachers-list">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-2 px-4">Name</th>
                <th className="text-left py-2 px-4">Email</th>
                <th className="text-left py-2 px-4">Phone</th>
                <th className="text-left py-2 px-4">Actions</th>
                <th className="text-left py-2 px-4">Access Code</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t">
                  <td className="py-2 px-4">{student.name}</td>
                  <td className="py-2 px-4">{student.email}</td>
                  <td className="py-2 px-4">{student.phone}</td>
                  <td className="py-2 px-4">
                    <button
                      className="icon-btn"
                      title="Edit"
                      onClick={() => handleEditStudent(student)}
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      className="icon-btn"
                      title="Delete"
                      onClick={() => handleDeleteStudent(student.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                  <td className="py-2 px-4">{student.passcode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Teacher */}
      {isAddTeacherFormVisible && (
        <div className="popup-form">
          <div className="form-container">
            <h3>Add Teacher</h3>
            <form onSubmit={handleTeacherSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  placeholder="Enter teacher's name"
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  placeholder="Enter teacher's email"
                  required
                />
              </label>
              <label>
                Phone:
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  required
                />
              </label>
              <label>
                Subject:
                <select name="subject" required>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="Science">Science</option>
                </select>
              </label>
              <label>
                <input type="checkbox" name="isHomeroom" />
                Homeroom (Class Teacher)
              </label>
              <div className="form-actions">
                <button type="button" onClick={handleFormClose}>
                  Cancel
                </button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Teacher */}
      {editTeacher && (
        <div className="popup-form">
          <div className="form-container">
            <h3>Edit Teacher</h3>
            <form onSubmit={handleTeacherEditSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  defaultValue={editTeacher.name}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  defaultValue={editTeacher.email}
                  required
                />
              </label>
              <label>
                Subject:
                <select
                  name="subject"
                  defaultValue={editTeacher.subject}
                  required
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="Science">Science</option>
                </select>
              </label>
              <label>
                <input
                  type="checkbox"
                  name="isHomeroom"
                  defaultChecked={!!editTeacher.isHomeroom}
                />
                Homeroom (Class Teacher)
              </label>
              <div className="form-actions">
                <button type="button" onClick={handleFormClose}>
                  Cancel
                </button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student */}
      {isAddStudentFormVisible && (
        <div className="popup-form">
          <div className="form-container">
            <h3>Add Student</h3>
            <form onSubmit={handleStudentSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  placeholder="Enter student's name"
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  placeholder="Enter student's email"
                  required
                />
              </label>
              <label>
                Phone Number:
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter phone number"
                  required
                />
              </label>
              <div className="form-actions">
                <button type="button" onClick={handleFormClose}>
                  Cancel
                </button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student */}
      {editStudent && (
        <div className="popup-form">
          <div className="form-container">
            <h3>Edit Student</h3>
            <form onSubmit={handleStudentEditSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  defaultValue={editStudent.name}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  defaultValue={editStudent.email}
                  required
                />
              </label>
              <label>
                Phone Number:
                <input
                  type="tel"
                  name="phone"
                  defaultValue={editStudent.phone}
                  required
                />
              </label>
              <div className="form-actions">
                <button type="button" onClick={handleFormClose}>
                  Cancel
                </button>
                <button type="submit">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm.type && (
        <div className="popup-form">
          <div className="form-container">
            <h3>Are you sure?</h3>
            {/* <p>
              {deleteConfirm.type === "teacher"
                ? "Do you really want to delete this teacher?"
                : "Do you really want to delete this student?"}
            </p> */}

            <p>
              {deleteConfirm.type === "teacher"
                ? "Do you really want to delete this teacher?"
                : deleteConfirm.type === "student"
                ? "Do you really want to delete this student?"
                : "Do you really want to delete this section?"}
            </p>
            <div className="form-actions">
              <button type="button" onClick={cancelDelete}>
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                style={{ background: "#d32f2f", color: "#fff" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "home" && (
        <div className="cards-grid">
          <div
            className="info-card materials"
            onClick={() => navigate("/materials")}
          >
            <div className="card-content">
              <h3>Materials</h3>
              <p>Supplies, Resources, Tools</p>
            </div>
            <div className="card-icon">
              <Book className="icon" />
            </div>
          </div>

          <div className="info-card task" onClick={() => navigate("/task")}>
            <div className="card-content">
              <h3>Task</h3>
              <p>Assignments, Due Dates</p>
            </div>
            <div className="card-icon">
              <GraduationCap className="icon" />
            </div>
          </div>

          <div
            className="info-card calendar"
            onClick={() => navigate("/calendar")}
          >
            <div className="card-content">
              <h3>Calendar</h3>
              <p>Events, Holidays, Schedule</p>
            </div>
            <div className="card-icon">
              <Calendar className="icon" />
            </div>
          </div>

          <div className="info-card grade" onClick={() => navigate("/grade")}>
            <div className="card-content">
              <h3>Grade</h3>
              <p>Scores, Reports, Averages</p>
            </div>
            <div className="card-icon">
              <Award className="icon" />
            </div>
          </div>

          <div
            className="info-card attendance"
            onClick={() => navigate("/attendance")}
          >
            <div className="card-content">
              <h3>Attendance</h3>
              <p>Present, Absent</p>
            </div>
            <div className="card-icon">
              <UserCheck className="icon" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
