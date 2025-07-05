import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, X, Circle } from "lucide-react";
import "./Attendance.css";
import API_BASE from "../../config";

const STUDENTS_PER_PAGE = 5;

function Attendance() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonthIndex = today.getMonth();

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );
  const years = [];
  for (let y = currentYear - 3; y <= currentYear + 1; y++) {
    years.push(y.toString());
  }

  const [selectedMonth, setSelectedMonth] = useState(months[currentMonthIndex]);
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [students, setStudents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const schoolId = localStorage.getItem("schoolId");
  const activeClassId = localStorage.getItem("activeClassId");
  const activeSectionId = localStorage.getItem("activeSectionId");

  const getDaysInMonth = (monthName, year) => {
    const monthIndex = months.indexOf(monthName);
    const date = new Date(year, monthIndex + 1, 0);
    const daysCount = date.getDate();
    return Array.from({ length: daysCount }, (_, i) =>
      (i + 1).toString().padStart(2, "0")
    );
  };

  const days = getDaysInMonth(selectedMonth, parseInt(selectedYear));
  const totalPages = Math.ceil(students.length / STUDENTS_PER_PAGE);

  const paginatedStudents = students.slice(
    (currentPage - 1) * STUDENTS_PER_PAGE,
    currentPage * STUDENTS_PER_PAGE
  );

  useEffect(() => {
    if (!schoolId || !activeClassId || !activeSectionId) return;

    const daysInMonth = getDaysInMonth(selectedMonth, parseInt(selectedYear));
    const monthIndex = months.indexOf(selectedMonth);

    const attendancePromises = daysInMonth.map((day) => {
      const date = `${selectedYear}-${String(monthIndex + 1).padStart(
        2,
        "0"
      )}-${day}`;
      return fetch(
        `${API_BASE}api/attendance?schoolId=${schoolId}&classId=${activeClassId}&sectionId=${activeSectionId}&date=${date}`
      )
        .then((res) => res.json())
        .then((data) => ({ date, records: data.data || [] }))
        .catch(() => ({ date, records: [] }));
    });

    Promise.all(attendancePromises).then((attendanceDataByDate) => {
      fetch(
        `${API_BASE}/api/schools/${schoolId}/classes/${activeClassId}/sections/${activeSectionId}/students`
      )
        .then((res) => res.json())
        .then((data) => {
          const studentList = data.students || [];
          const updated = studentList.map((student) => {
            const attendance = daysInMonth.map((day) => {
              const date = `${selectedYear}-${String(monthIndex + 1).padStart(
                2,
                "0"
              )}-${day}`;
              const dateRecord = attendanceDataByDate.find(
                (d) => d.date === date
              );
              const match = dateRecord?.records.find(
                (r) => r.student_id === student.id
              );
              return match ? match.status : "no-class";
            });
            return { ...student, attendance };
          });

          setStudents(updated);
          setCurrentPage(1);
        })
        .catch((err) => {
          console.error("Failed to load students:", err);
          setStudents([]);
        });
    });
  }, [schoolId, activeClassId, activeSectionId, selectedMonth, selectedYear]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const renderAttendanceIcon = (status) => {
    switch (status) {
      case "present":
        return <Check size={20} className="attendance-icon present" />;
      case "absent":
        return <X size={20} className="attendance-icon absent" />;
      case "permission":
        return <Circle size={20} className="attendance-icon permission" />;
      case "no-class":
      default:
        return <Circle size={20} className="attendance-icon no-class" />;
    }
  };

  return (
    <div className="attendance-container">
      <h1 className="attendance-title">Attendance</h1>

      <div className="attendance-filters">
        <div className="filter-dropdown">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="filter-select"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-dropdown">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="filter-select"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th className="name-column">Name</th>
              {days.map((day) => (
                <th key={day} className="day-column">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.map((student) => (
              <tr key={student.id}>
                <td className="name-cell">{student.name}</td>
                {student.attendance.map((status, index) => (
                  <td key={index} className="attendance-cell">
                    {renderAttendanceIcon(status)}
                  </td>
                ))}
              </tr>
            ))}
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

export default Attendance;
