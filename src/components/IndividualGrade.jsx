import React from 'react';
import { X } from 'lucide-react';
import './IndividualGrade.css';

function IndividualGrade({ student, onClose }) {
  // Mock subject data
  const subjects = [
    { name: 'English', grade: 99 },
    { name: 'Math', grade: 100 },
    { name: 'Average', grade: 99 }
  ];

  return (
    <div className="individual-grade-overlay">
      <div className="individual-grade-modal">
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="student-profile">
          <div className="student-avatar">
            {student.avatar ? (
              <img src={student.avatar} alt={student.name} />
            ) : (
              <div className="avatar-placeholder">
                {student.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="student-info">
            <h2 className="student-name">{student.name}</h2>
            <p className="student-class">{student.class || 'Class not specified'}</p>
          </div>
        </div>

        <div className="grades-table-container">
          <table className="grades-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                <tr key={index}>
                  <td>{subject.name}</td>
                  <td>{subject.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default IndividualGrade;