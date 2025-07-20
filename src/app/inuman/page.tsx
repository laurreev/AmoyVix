"use client";
import { useState } from "react";

export default function InumanPage() {
  const [players, setPlayers] = useState<string[]>([""]);
  const [started, setStarted] = useState(false);
  const [order, setOrder] = useState<string[]>([]);
  const [current, setCurrent] = useState<number>(0);

  function handlePlayerChange(idx: number, value: string) {
    const updated = [...players];
    updated[idx] = value;
    setPlayers(updated);
  }

  function addPlayer() {
    setPlayers([...players, ""]);
  }

  function startSession() {
    const filtered = players.map(p => p.trim()).filter(Boolean);
    if (filtered.length < 2) return;
    setOrder(filtered);
    // Pick a random starting index
    setCurrent(Math.floor(Math.random() * filtered.length));
    setStarted(true);
  }

  function nextTurn() {
    setCurrent((c) => (c + 1) % order.length);
  }

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f58529]/30 via-[#dd2a7b]/30 to-[#515bd4]/30 p-4">
        <div className="bg-white/90 rounded-2xl shadow-2xl flex flex-col items-center px-8 py-10 max-w-md w-full">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] bg-clip-text text-transparent mb-4 drop-shadow text-center">Drinking Session</h1>
          <p className="mb-4 text-black/80">Who&apos;s Joining?</p>
          {players.map((name, idx) => (
            <input
              key={idx}
              className="rounded px-2 py-1 border w-full mb-2 text-black"
              placeholder={`Player ${idx + 1}`}
              value={name}
              onChange={e => handlePlayerChange(idx, e.target.value)}
              maxLength={24}
            />
          ))}
          <button
            className="rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] text-white font-semibold px-4 py-1 mt-2 w-full"
            onClick={addPlayer}
          >
            + Add Player
          </button>
          <button
            className="rounded-full bg-gradient-to-r from-[#ff9966] via-[#ff5e62] to-[#ffc371] text-white font-semibold px-4 py-1 mt-4 w-full"
            onClick={startSession}
            disabled={players.filter(p => p.trim()).length < 2}
          >
            Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f58529]/30 via-[#dd2a7b]/30 to-[#515bd4]/30 p-4">
      <div className="bg-white/90 rounded-2xl shadow-2xl flex flex-col items-center px-8 py-10 max-w-md w-full">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] bg-clip-text text-transparent mb-4 drop-shadow text-center">Drinking Session</h1>
        <p className="mb-4 text-black/80">Order:</p>
        <ol className="mb-6 w-full">
          {order.map((name, idx) => (
            <li key={idx} className={`py-1 px-2 rounded ${idx === current ? "bg-[#f58529]/20 font-bold" : ""}`}>{idx + 1}. {name}</li>
          ))}
        </ol>
        <div className="mb-4 text-lg font-semibold text-[#dd2a7b]">
          {order[current]}, it&apos;s your turn to take a shot!
        </div>
        <button
          className="rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] text-white font-semibold px-4 py-1 w-full"
          onClick={nextTurn}
        >
          Next
        </button>
      </div>
    </div>
  );
}
