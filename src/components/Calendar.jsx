import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";
import { Trash2, Pencil } from "lucide-react";
import API_BASE from "../../config";

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventColor, setNewEventColor] = useState("orange");
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [schoolId, setSchoolId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const colorMap = {
    orange: "#ff8a65",
  };

  useEffect(() => {
    const id = localStorage.getItem("schoolId");
    setSchoolId(id);
  }, []);

  useEffect(() => {
    if (!schoolId) return;

    async function fetchEvents() {
      try {
        const res = await fetch(
          `${API_BASE}/api/calendar?school_id=${schoolId}`
        );
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();

        const mappedEvents = data.map((event) => ({
          id: event.id,
          name: event.title,
          description: event.description,
          date: new Date(event.start_date).toDateString(),
          allDay: true,
          color: colorMap["orange"], // You can update this if you store color in DB
        }));

        setCalendarEvents(mappedEvents);
      } catch (err) {
        console.error(err);
      }
    }

    fetchEvents();
  }, [schoolId]);

  const handleAddEvent = async () => {
    if (!newEventTitle.trim() || !selectedDate || !schoolId) return;

    const formattedDate = selectedDate.toLocaleDateString("en-CA");

    try {
      const body = {
        school_id: schoolId,
        title: newEventTitle,
        description: newEventDescription,
        start_date: formattedDate,
        end_date: formattedDate,
      };

      const res = await fetch(`${API_BASE}/api/calendar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to add event");

      setCalendarEvents((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: newEventTitle,
          description: newEventDescription,
          date: selectedDate.toDateString(),
          allDay: true,
          color: colorMap[newEventColor],
        },
      ]);

      resetModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateEvent = async () => {
    if (!editingEvent || !schoolId || !selectedDate) return;

    const formattedDate = selectedDate.toLocaleDateString("en-CA");

    try {
      const res = await fetch(
        `${API_BASE}/api/calendar/by-date?school_id=${schoolId}&start_date=${formattedDate}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newEventTitle,
            description: newEventDescription,
            new_start_date: formattedDate,
            end_date: formattedDate,
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update event");

      setCalendarEvents((prev) =>
        prev.map((event) =>
          event.id === editingEvent.id
            ? {
                ...event,
                name: newEventTitle,
                description: newEventDescription,
                color: colorMap[newEventColor],
              }
            : event
        )
      );

      resetModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (event) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmed) return;

    const formattedDate = new Date(event.date).toLocaleDateString("en-CA");

    try {
      const res = await fetch(
        `${API_BASE}/api/calendar/by-date?school_id=${schoolId}&start_date=${formattedDate}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Failed to delete event");

      setCalendarEvents((prev) => prev.filter((e) => e.id !== event.id));
    } catch (err) {
      console.error(err);
    }
  };

  const resetModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingEvent(null);
    setNewEventTitle("");
    setNewEventDescription("");
    setNewEventColor("orange");
  };

  const selectedDayEvents = calendarEvents.filter(
    (event) => event.date === selectedDate.toDateString()
  );

  return (
    <div className="calendar-container">
      <h1 className="calendar-title">Calendar</h1>

      <div className="calendar-layout">
        <div className="calendar-main">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            calendarType="gregory"
            tileClassName={({ date }) =>
              calendarEvents.some((e) => e.date === date.toDateString())
                ? "has-event"
                : null
            }
            tileContent={({ date }) => {
              const event = calendarEvents.find(
                (e) => e.date === date.toDateString()
              );
              return event ? (
                <div
                  className="day-event"
                  style={{ backgroundColor: event.color }}
                  title={event.description}
                >
                  {event.name}
                </div>
              ) : null;
            }}
          />
        </div>

        <div className="schedule-details">
          <div className="schedule-header">
            <h2 className="schedule-title">Schedule Details</h2>
            <p className="schedule-date">{selectedDate.toDateString()}</p>
            <button
              className="add-event-button"
              onClick={() => setShowModal(true)}
              aria-label="Add event"
            >
              <Plus />
            </button>
          </div>

          <div className="events-list">
            {selectedDayEvents.length === 0 ? (
              <p className="no-events">No events for this day</p>
            ) : (
              selectedDayEvents.map((event) => (
                <div
                  key={event.id}
                  className="event-item"
                  style={{ borderLeftColor: event.color }}
                >
                  <div className="event-content">
                    <div className="header-icons">
                      <div className="title">
                        <h3 className="event-title">{event.name}</h3>
                        {event.description && (
                          <p className="event-description">
                            {event.description}
                          </p>
                        )}
                      </div>
                      <div className="event-actions">
                        <button
                          className="card-edit-button"
                          onClick={() => {
                            setIsEditing(true);
                            setEditingEvent(event);
                            setNewEventTitle(event.name);
                            setNewEventDescription(event.description || "");
                            setNewEventColor(
                              Object.keys(colorMap).find(
                                (key) => colorMap[key] === event.color
                              ) || "orange"
                            );
                            setShowModal(true);
                          }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="card-delete-button"
                          onClick={() => handleDeleteEvent(event)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="event-meta">
                      <div className="event-time">
                        <CalendarIcon size={16} />
                        <span>{event.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">
              {isEditing ? "Edit Event" : "Add Event"}
            </h2>

            <div className="form-group">
              <label>Date</label>
              <input
                type="text"
                value={selectedDate.toDateString()}
                readOnly
                className="date-display-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-title">Title</label>
              <input
                id="event-title"
                type="text"
                placeholder="Enter event title"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="event-description">Description (optional)</label>
              <input
                id="event-description"
                type="text"
                placeholder="Enter description"
                value={newEventDescription}
                onChange={(e) => setNewEventDescription(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button className="modal-button cancel" onClick={resetModal}>
                Cancel
              </button>
              <button
                className="modal-button confirm"
                onClick={isEditing ? handleUpdateEvent : handleAddEvent}
                disabled={!newEventTitle.trim()}
              >
                {isEditing ? "Update Event" : "Add Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;
