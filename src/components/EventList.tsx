import React from "react";

export interface Event {
  id: string;
  title: string;
  date: string;
  description?: string;
}

interface EventListProps {
  events: Event[];
}

export const EventList: React.FC<EventListProps> = ({ events }) => (
  <section className="w-full max-w-xl bg-white/80 rounded-xl shadow p-6 mb-8 text-black">
    <h2 className="text-xl font-bold mb-4 text-center text-[#dd2a7b]">Upcoming Events</h2>
    {events.length === 0 ? (
      <p className="text-center text-gray-500">No events yet!</p>
    ) : (
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event.id} className="border-l-4 border-[#f58529] pl-4 py-2 bg-gradient-to-r from-[#f58529]/10 to-[#515bd4]/10 rounded">
            <div className="font-semibold text-lg">{event.title}</div>
            <div className="text-sm text-gray-600">{event.date}</div>
            {event.description && <div className="text-sm mt-1">{event.description}</div>}
          </li>
        ))}
      </ul>
    )}
  </section>
);
