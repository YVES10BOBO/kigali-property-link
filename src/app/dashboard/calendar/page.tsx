"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  status: string;
  attendee_name: string | null;
  attendee_email: string | null;
  attendee_phone: string | null;
  properties: { title: string; location: string } | null;
  inquiries: { name: string; email: string; phone: string } | null;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [view, setView] = useState<"day" | "week" | "month">("month");

  useEffect(() => {
    fetchEvents();
  }, [selectedDate, view]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const start = new Date(selectedDate);
      const end = new Date(selectedDate);
      
      if (view === "day") {
        end.setDate(end.getDate() + 1);
      } else if (view === "week") {
        end.setDate(end.getDate() + 7);
      } else {
        end.setMonth(end.getMonth() + 1);
      }
      
      const response = await fetch(
        `/api/calendar?start=${start.toISOString()}&end=${end.toISOString()}`
      );
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "no_show":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const eventsByDate = events.reduce((acc, event) => {
    const date = new Date(event.start_time).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  if (loading) {
    return (
      <div className="text-center py-16">
        <i className="fas fa-spinner fa-spin text-4xl text-primary mb-4"></i>
        <p className="text-gray-600">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-dark mb-2">Calendar</h1>
          <p className="text-gray-600">Manage viewing appointments and events</p>
        </div>
        <Link
          href="/dashboard/calendar/add"
          className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          New Event
        </Link>
      </div>

      {/* View Controls */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setView("day")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === "day"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setView("week")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === "week"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView("month")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                view === "month"
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Month
            </button>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary outline-none"
          />
        </div>
      </div>

      {/* Calendar Events */}
      {Object.keys(eventsByDate).length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <i className="fas fa-calendar text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-2xl font-bold text-dark mb-2">No Events Scheduled</h3>
          <p className="text-gray-600 mb-6">You don't have any events scheduled for this period.</p>
          <Link
            href="/dashboard/calendar/add"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Schedule an Event
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(eventsByDate)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, dateEvents]) => (
              <div key={date} className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-dark mb-4">
                  {formatDate(date)}
                </h2>
                <div className="space-y-4">
                  {dateEvents.map((event) => (
                    <div
                      key={event.id}
                      className="border-l-4 border-primary pl-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-dark">{event.title}</h3>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                event.status
                              )}`}
                            >
                              {event.status}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-2">{event.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <i className="far fa-clock"></i>
                              {formatTime(event.start_time)} - {formatTime(event.end_time)}
                            </span>
                            {event.location && (
                              <span className="flex items-center gap-1">
                                <i className="fas fa-map-marker-alt"></i>
                                {event.location}
                              </span>
                            )}
                            {event.properties && (
                              <span className="flex items-center gap-1">
                                <i className="fas fa-home"></i>
                                {event.properties.title}
                              </span>
                            )}
                            {event.attendee_name && (
                              <span className="flex items-center gap-1">
                                <i className="fas fa-user"></i>
                                {event.attendee_name}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/dashboard/calendar/edit/${event.id}`}
                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
                          >
                            <i className="fas fa-edit mr-1"></i>
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
