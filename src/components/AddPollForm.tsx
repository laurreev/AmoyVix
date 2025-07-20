"use client";
import { useState } from "react";

interface AddPollFormProps {
  onAdd: (question: string, options: string[]) => void;
}

export const AddPollForm: React.FC<AddPollFormProps> = ({ onAdd }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);

  const handleOptionChange = (idx: number, value: string) => {
    setOptions(opts => opts.map((opt, i) => (i === idx ? value : opt)));
  };

  const addOption = () => setOptions(opts => [...opts, ""]);

  return (
    <form
      className="w-full max-w-xl bg-white/80 rounded-xl shadow p-4 mb-4 flex flex-col gap-2"
      onSubmit={e => {
        e.preventDefault();
        if (!question || options.some(opt => !opt)) return;
        onAdd(question, options);
        setQuestion("");
        setOptions(["", ""]);
      }}
    >
      <h3 className="font-bold text-[#8134af]">Add New Poll</h3>
      <input
        className="rounded px-2 py-1 border"
        placeholder="Poll question"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        required
      />
      {options.map((opt, idx) => (
        <input
          key={idx}
          className="rounded px-2 py-1 border"
          placeholder={`Option ${idx + 1}`}
          value={opt}
          onChange={e => handleOptionChange(idx, e.target.value)}
          required
        />
      ))}
      <button type="button" onClick={addOption} className="text-xs text-[#dd2a7b] underline self-start">+ Add option</button>
      <button
        type="submit"
        className="rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] text-white font-semibold px-4 py-1 mt-2"
      >
        Add Poll
      </button>
    </form>
  );
}
