import React, { useState } from 'react';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState([
    { id: 1, title: 'Meeting with John', date: '2024-03-20', time: '10:00 AM', type: 'meeting' },
    { id: 2, title: 'Project Deadline', date: '2024-03-22', time: '11:30 AM', type: 'deadline' },
    { id: 3, title: 'Team Lunch', date: '2024-03-25', time: '1:00 PM', type: 'event' },
  ]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(event => event.date === date);

      days.push(
        <div key={day} className="h-24 border border-gray-200 p-2">
          <div className="font-semibold text-gray-700">{day}</div>
          <div className="mt-1 space-y-1">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded ${
                  event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                  event.type === 'deadline' ? 'bg-red-100 text-red-800' :
                  'bg-green-100 text-green-800'
                }`}
              >
                {event.time} - {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-gray-700">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
          {renderCalendar()}
        </div>
      </div>
    </div>
  );
}

export default Calendar; 