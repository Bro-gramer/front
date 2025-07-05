import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Grade.css";
import API_BASE from "../../config";

const STUDENTS_PER_PAGE = 5;

function Grade() {
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSemester, setSelectedSemester] = useState("Semester 1");

  const schoolId = localStorage.getItem("schoolId");
  const activeClassId = localStorage.getItem("activeClassId");
  const activeSectionId = localStorage.getItem("activeSectionId");

  const totalPages = Math.ceil(students.length / STUDENTS_PER_PAGE);

  useEffect(() => {
    if (!activeSectionId || !activeClassId || !schoolId) return;

    const fetchStudentsAndGrades = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/schools/${schoolId}/classes/${activeClassId}/sections/${activeSectionId}/students`
        );
        const data = await res.json();
        const studentList = data.students || [];

        const semesterNum = selectedSemester === "Semester 1" ? 1 : 2;

        const studentsWithGrades = await Promise.all(
          studentList.map(async (student) => {
            try {
              const gradeRes = await fetch(
                `${API_BASE}/api/grades/semester?student_id=${student.id}&semester=${semesterNum}`
              );
              const gradeData = await gradeRes.json();

              const subjects = gradeData?.[0]?.subjects || {};
              return {
                ...student,
                math: subjects.math || 0,
                english: subjects.english || 0,
                science: subjects.science || 0,
              };
            } catch (err) {
              console.error("Error fetching grades for student:", student.id);
              return {
                ...student,
                math: 0,
                english: 0,
                science: 0,
              };
            }
          })
        );

        setStudents(studentsWithGrades);
        setCurrentPage(1);
      } catch (err) {
        console.error("Failed to fetch students or grades:", err);
      }
    };

    fetchStudentsAndGrades();
  }, [activeSectionId, activeClassId, schoolId, selectedSemester]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const paginatedStudents = students.slice(
    (currentPage - 1) * STUDENTS_PER_PAGE,
    currentPage * STUDENTS_PER_PAGE
  );

  return (
    <div className="grade-container">
      <h1 className="grade-title">Grade</h1>

      {/* Semester dropdown aligned right */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          className="section-select"
        >
          <option value="Semester 1">Semester 1</option>
          <option value="Semester 2">Semester 2</option>
        </select>
      </div>

      <div className="grade-table-container">
        <table className="grade-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Math</th>
              <th>English</th>
              <th>Science</th>
              <th>Total</th>
              <th>Average</th>
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map((student) => {
              const math = parseFloat(student.math) || 0;
              const english = parseFloat(student.english) || 0;
              const science = parseFloat(student.science) || 0;
              const total = math + english + science;
              const average = (total / 3).toFixed(2);

              return (
                <tr key={student.id} className="teacher-row">
                  <td className="name-cell">
                    <div className="teacher-name">{student.name}</div>
                    <div className="teacher-email">{student.email}</div>
                  </td>
                  <td>{math}</td>
                  <td>{english}</td>
                  <td>{science}</td>
                  <td>{total}</td>
                  <td>{average}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="pagination-button prev-button"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            className={`page-number ${currentPage === i + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="pagination-button next-button"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default Grade;
