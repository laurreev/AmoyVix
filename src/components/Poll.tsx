import React, { useState } from "react";

export interface PollOption {
  id: string;
  text: string;
}

interface PollProps {
  question: string;
  options: PollOption[];
}

export const Poll: React.FC<PollProps> = ({ question, options }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [voted, setVoted] = useState(false);

  return (
    <section className="w-full max-w-xl bg-white/80 rounded-xl shadow p-6 mb-8">
      <h2 className="text-xl font-bold mb-4 text-center text-[#8134af]">Poll</h2>
      <div className="mb-2 font-semibold">{question}</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setVoted(true);
        }}
        className="flex flex-col gap-2"
      >
        {options.map((opt) => (
          <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="poll"
              value={opt.id}
              checked={selected === opt.id}
              onChange={() => setSelected(opt.id)}
              disabled={voted}
              className="accent-[#dd2a7b]"
            />
            <span>{opt.text}</span>
          </label>
        ))}
        <button
          type="submit"
          disabled={!selected || voted}
          className="mt-4 rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] text-white font-semibold px-6 py-2 shadow hover:opacity-90 transition"
        >
          {voted ? "Voted!" : "Vote"}
        </button>
      </form>
    </section>
  );
};
