"use client";
import { useState } from "react";

interface AddEventFormProps {
  onAdd: (title: string, date: string, description: string) => void;
}

export const AddEventForm: React.FC<AddEventFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  return (
    <form
      className="w-full max-w-xl bg-white/80 rounded-xl shadow p-4 mb-4 flex flex-col gap-2"
      onSubmit={e => {
        e.preventDefault();
        if (!title || !date) return;
        onAdd(title, date, description);
        setTitle("");
        setDate("");
        setDescription("");
      }}
    >
      <h3 className="font-bold text-[#f58529]">Add New Event</h3>
      <input
        className="rounded px-2 py-1 border"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <input
        className="rounded px-2 py-1 border"
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
      />
      <input
        className="rounded px-2 py-1 border"
        placeholder="Description (optional)"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <button
        type="submit"
        className="rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] text-white font-semibold px-4 py-1 mt-2"
      >
        Add Event
      </button>
    </form>
  );
}
