"use client";
import React, { useState } from "react";

export default function InumanPage() {
  const [players, setPlayers] = useState<string[]>([""]);
  const [started, setStarted] = useState(false);
  const [order, setOrder] = useState<string[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [showWheel, setShowWheel] = useState(false);
  const [firstIdx, setFirstIdx] = useState<number>(0);
  // Wheel animation state (must be top-level for hooks)
  const [spinIdx, setSpinIdx] = useState<number>(0);
  const [spinning, setSpinning] = useState(false);

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
    // Pick a random starting index for the wheel
    const idx = Math.floor(Math.random() * filtered.length);
    setFirstIdx(idx);
    setSpinIdx(0);
    setSpinning(true);
    setShowWheel(true);
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

  // Wheel animation effect (must be outside conditional)
  React.useEffect(() => {
    if (!spinning || !showWheel) return;
    let totalSpins = 20 + Math.floor(Math.random() * 10); // randomize spin length
    let count = 0;
    const interval = setInterval(() => {
      setSpinIdx(i => (i + 1) % order.length);
      count++;
      if (count > totalSpins) {
        clearInterval(interval);
        setSpinIdx(firstIdx);
        setSpinning(false);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [spinning, order.length, firstIdx, showWheel]);

  // Show wheel dialog after start
  if (showWheel) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xs flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4 text-[#f58529]">Who&apos;s taking the first shot?</h2>
          <ul className="mb-6 w-full">
            {order.map((name, idx) => (
              <li key={idx} className={`py-2 px-2 rounded text-center transition-all duration-200 ${idx === spinIdx ? "bg-[#f58529]/80 text-white scale-110 font-bold" : "bg-gray-100 text-black"}`}>{name}</li>
            ))}
          </ul>
          <button
            className="rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] text-white font-semibold px-4 py-1 w-full disabled:opacity-60"
            onClick={() => { setShowWheel(false); setCurrent(firstIdx); }}
            disabled={spinning}
          >
            Let&apos;s go!
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
        <ol className="mb-6 w-full flex flex-col gap-2">
          {order.map((name, idx) => (
            <li
              key={idx}
              className={`flex items-center gap-3 py-2 px-3 rounded-xl border transition-all duration-200 shadow-sm ${
                idx === current
                  ? "bg-gradient-to-r from-[#f58529]/40 via-[#dd2a7b]/30 to-[#515bd4]/30 border-[#f58529] scale-105 font-extrabold text-[#dd2a7b] ring-2 ring-[#f58529]/60"
                  : "bg-white border-gray-200 text-black"
              }`}
            >
              <span
                className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-lg shadow ${
                  idx === current
                    ? "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#515bd4] text-white animate-bounce"
                    : "bg-gray-200 text-[#515bd4]"
                }`}
                aria-label={`Player ${idx + 1}`}
              >
                {name.charAt(0).toUpperCase()}
              </span>
              <span className="flex-1 truncate">{name}</span>
              <span className="text-xs text-gray-400">#{idx + 1}</span>
            </li>
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
