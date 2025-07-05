import React, { useState } from 'react';
import { MapPin, Users, GraduationCap, X } from 'lucide-react';
import './Admine.css';

function Admin() {
    const [selectedSchool, setSelectedSchool] = useState(null);

    // Mock school data
    const schools = [
        {
            id: 1,
            name: "Bright Future Academy",
            location: "Addis Ababa, Ethiopia",
            studentCount: 450,
            teacherCount: 35,
            nextPaymentDate: "2024-04-15",
            email: "info@brightfuture.edu.et",
            phone: "+251 911 234 567",
            description: "Bright Future Academy is a leading educational institution committed to providing quality education through innovative teaching methods and a comprehensive curriculum. Our focus is on developing well-rounded students who excel both academically and personally.",
            address: "Bole Road, Addis Ababa",
            foundedYear: 2010,
            principalName: "Dr. Sarah Johnson",
            website: "www.brightfuture.edu.et",
            status: "active"
        },
        {
            id: 2,
            name: "New Horizon School",
            location: "Bahir Dar, Ethiopia",
            studentCount: 320,
            teacherCount: 28,
            nextPaymentDate: "2024-04-20",
            email: "contact@newhorizon.edu.et",
            phone: "+251 922 345 678",
            description: "New Horizon School offers a dynamic learning environment that encourages creativity, critical thinking, and personal growth. We emphasize both academic excellence and character development.",
            address: "Main Street, Bahir Dar",
            foundedYear: 2015,
            principalName: "Mr. Daniel Tekle",
            website: "www.newhorizon.edu.et",
            status: "active"
        },
        {
            id: 3,
            name: "Unity International School",
            location: "Hawassa, Ethiopia",
            studentCount: 280,
            teacherCount: 25,
            nextPaymentDate: "2024-04-18",
            email: "info@unityschool.edu.et",
            phone: "+251 933 456 789",
            description: "Unity International School provides a multicultural education experience, preparing students for global citizenship while maintaining strong connections to local culture and values.",
            address: "Lake View Road, Hawassa",
            foundedYear: 2012,
            principalName: "Mrs. Helen Assefa",
            website: "www.unityschool.edu.et",
            status: "active"
        }
    ];

    const handleSchoolClick = (school) => {
        setSelectedSchool(school);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">Schools Management</h1>

            <div className="schools-grid">
                {schools.map((school) => (
                    <div
                        key={school.id}
                        className="school-card"
                        onClick={() => handleSchoolClick(school)}
                    >
                        <div className="school-header">
                            <h2 className="school-name">{school.name}</h2>
                            <p className="school-location">
                                <MapPin size={16} className="inline-block mr-1" />
                                {school.location}
                            </p>
                        </div>

                        <div className="school-content">
                            <div className="school-stats">
                                <div className="stat-item">
                                    <div className="stat-value">
                                        <Users size={16} className="inline-block mr-1" />
                                        {school.studentCount}
                                    </div>
                                    <div className="stat-label">Students</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">
                                        <GraduationCap size={16} className="inline-block mr-1" />
                                        {school.teacherCount}
                                    </div>
                                    <div className="stat-label">Teachers</div>
                                </div>
                            </div>
                        </div>

                        <div className="school-footer">
                            <div className="payment-status">Next Payment</div>
                            <div className="payment-date">{formatDate(school.nextPaymentDate)}</div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedSchool && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2 className="modal-title">{selectedSchool.name}</h2>
                            <p className="text-white/90">{selectedSchool.location}</p>
                            <button
                                className="close-button"
                                onClick={() => setSelectedSchool(null)}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="info-grid">
                                <div className="info-section">
                                    <h3 className="info-title">School Information</h3>
                                    <div className="info-list">
                                        <div className="info-item">
                                            <span className="info-label">Founded Year</span>
                                            <span className="info-value">{selectedSchool.foundedYear}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Principal</span>
                                            <span className="info-value">{selectedSchool.principalName}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Status</span>
                                            <span className="info-value capitalize">{selectedSchool.status}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Website</span>
                                            <span className="info-value">{selectedSchool.website}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="info-section">
                                    <h3 className="info-title">Contact Information</h3>
                                    <div className="info-list">
                                        <div className="info-item">
                                            <span className="info-label">Email</span>
                                            <span className="info-value">{selectedSchool.email}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Phone</span>
                                            <span className="info-value">{selectedSchool.phone}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Address</span>
                                            <span className="info-value">{selectedSchool.address}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="info-section">
                                    <h3 className="info-title">Statistics</h3>
                                    <div className="info-list">
                                        <div className="info-item">
                                            <span className="info-label">Total Students</span>
                                            <span className="info-value">{selectedSchool.studentCount}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Total Teachers</span>
                                            <span className="info-value">{selectedSchool.teacherCount}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Next Payment</span>
                                            <span className="info-value">{formatDate(selectedSchool.nextPaymentDate)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="description-section">
                                <h3 className="description-title">About School</h3>
                                <p className="description-text">{selectedSchool.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;