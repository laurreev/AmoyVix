"use client";
import React, { useState, useEffect } from "react";
// Removed Firestore imports for local-only mode
import { useRouter } from "next/navigation";

type FirestoreTimestamp = { toDate: () => Date };
type InumanSession = {
  id: string;
  players: string[];
  order: string[];
  outPlayers: Record<string, { out: boolean; reason: string }>;
  ended: boolean;
  endedAt?: Date | FirestoreTimestamp | null;
  startedAt?: Date | FirestoreTimestamp | null;
  lastActive?: Date | FirestoreTimestamp | null;
  current: number;
  showWheel?: boolean;
  firstIdx?: number;
  spinIdx?: number;
  spinning?: boolean;
  started?: boolean;
};

const SESSION_LIMIT = 2;

export default function InumanPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<string[]>([""]);

  function getTimestampMillis(ts?: Date | FirestoreTimestamp | null): number {
    if (!ts) return 0;
    if (typeof ts === 'object' && typeof (ts as FirestoreTimestamp).toDate === 'function') {
      return (ts as FirestoreTimestamp).toDate().getTime();
    }
    if (ts instanceof Date) {
      return ts.getTime();
    }
    return 0;
  }
  // Removed all session dialog state for local-only mode
  const [started, setStarted] = useState(false);
  const [order, setOrder] = useState<string[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [showWheel, setShowWheel] = useState(false);
  const [firstIdx, setFirstIdx] = useState<number>(0);
  const [spinIdx, setSpinIdx] = useState<number>(0);
  const [spinning, setSpinning] = useState(false);
  const [outPlayers, setOutPlayers] = useState<Record<string, { out: boolean; reason: string }>>({});
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeSelections, setRemoveSelections] = useState<Record<string, string>>({});
  const [ended, setEnded] = useState(false);
  // removed unused isInitialMount

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
    const idx = Math.floor(Math.random() * filtered.length);
    setOrder(filtered);
    setCurrent(0);
    setShowWheel(true);
    setFirstIdx(idx);
    setSpinIdx(0);
    setSpinning(true);
    setStarted(true);
    setOutPlayers({});
    setEnded(false);
  }


  async function nextTurn() {
    // Find the next player who is not out
    let next = current;
    let tries = 0;
    do {
      next = (next + 1) % order.length;
      tries++;
    } while (outPlayers[order[next]]?.out && tries <= order.length);
    setCurrent(next);
  }

  function openRemoveModal() {
    setRemoveSelections({});
    setShowRemoveModal(true);
  }

  function handleRemoveSelection(name: string, reason: string) {
    setRemoveSelections(prev => ({ ...prev, [name]: reason }));
  }

  async function confirmRemovePlayers() {
    const updated = { ...outPlayers };
    Object.entries(removeSelections).forEach(([name, reason]) => {
      if (reason) updated[name] = { out: true, reason };
    });
    setOutPlayers(updated);
    setShowRemoveModal(false);
  }

  function cancelRemovePlayers() {
    setShowRemoveModal(false);
  }

  async function endSession() {
    setEnded(true);
  }

  // Wheel animation effect (must be at the top level, before any conditional returns)
  React.useEffect(() => {
    if (!spinning || !showWheel) return;
    const totalSpins = 20 + Math.floor(Math.random() * 10); // randomize spin length
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

  // Live session sync: subscribe to Firestore session
  // Removed Firestore live sync effect

  // On mount, if session exists and is ongoing, restore; else, start fresh
  // Removed Firestore session restore effect


  // Conditional returns must be at the top level, not nested. Fixing structure:
  if (!started && !ended) {
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

  if (ended) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f58529]/30 via-[#dd2a7b]/30 to-[#515bd4]/30 p-4">
        <div className="bg-white/90 rounded-2xl shadow-2xl flex flex-col items-center px-8 py-10 max-w-md w-full">
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] bg-clip-text text-transparent mb-4 drop-shadow text-center">Session Ended</h1>
          <p className="mb-4 text-black/80">This Inuman session has ended.</p>
          <button className="rounded-full bg-gradient-to-r from-[#515bd4] via-[#dd2a7b] to-[#f58529] text-white font-semibold px-4 py-1 mt-4" onClick={() => router.push("/")}>Back</button>
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
          {order.map((name, idx) => {
            const out = outPlayers[name]?.out;
            const reason = outPlayers[name]?.reason;
            return (
              <li
                key={idx}
                className={`flex items-center gap-3 py-2 px-3 rounded-xl border transition-all duration-200 shadow-sm ${
                  idx === current
                    ? "bg-gradient-to-r from-[#f58529]/40 via-[#dd2a7b]/30 to-[#515bd4]/30 border-[#f58529] scale-105 font-extrabold text-[#dd2a7b] ring-2 ring-[#f58529]/60"
                    : out
                      ? "bg-gray-100 border-gray-300 text-gray-400 line-through opacity-60"
                      : "bg-white border-gray-200 text-black"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-lg shadow ${
                    idx === current
                      ? "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#515bd4] text-white animate-bounce"
                      : out
                        ? "bg-gray-300 text-gray-400"
                        : "bg-gray-200 text-[#515bd4]"
                  }`}
                  aria-label={`Player ${idx + 1}`}
                >
                  {name.charAt(0).toUpperCase()}
                </span>
                <span className="flex-1 truncate">{name}</span>
                <span className="text-xs text-gray-400">#{idx + 1}</span>
                {out && reason && (
                  <span className="ml-2 text-xs text-red-400">({reason})</span>
                )}
              </li>
            );
          })}
        </ol>
        <div className="mb-4 text-lg font-semibold text-[#dd2a7b]">
          {outPlayers[order[current]]?.out
            ? `${order[current]} is out!`
            : `${order[current]}, it’s your turn to take a shot!`}
        </div>
        <button
          className="rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] text-white font-semibold px-4 py-1 w-full"
          onClick={nextTurn}
        >
          Next
        </button>
        <button
          className="rounded-full bg-gradient-to-r from-[#515bd4] via-[#dd2a7b] to-[#f58529] text-white font-semibold px-4 py-1 w-full mt-2"
          onClick={openRemoveModal}
        >
          Remove Player(s)
        </button>
        <button
          className="rounded-full bg-gradient-to-r from-[#ff5e62] via-[#ff9966] to-[#ffc371] text-white font-semibold px-4 py-1 w-full mt-2"
          onClick={endSession}
          disabled={ended}
        >
          End Session
        </button>
        {/* Remove Player Modal */}
        {showRemoveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xs flex flex-col items-center">
              <h2 className="text-xl font-bold mb-4 text-[#f58529]">Remove Player(s)</h2>
              <p className="mb-2 text-black/80 text-sm">Select players to mark as out and choose a reason:</p>
              <ul className="mb-4 w-full">
                {order.map((name, idx) => (
                  <li key={idx} className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id={`remove-${name}`}
                      checked={!!removeSelections[name]}
                      disabled={outPlayers[name]?.out}
                      onChange={e => handleRemoveSelection(name, e.target.checked ? "Sumuka" : "")}
                    />
                    <label htmlFor={`remove-${name}`} className={`flex-1 ${outPlayers[name]?.out ? "line-through text-gray-400" : "text-black"}`}>{name}</label>
                    {!!removeSelections[name] && (
                      <select
                        className="rounded border px-1 py-0.5 text-xs bg-black text-white focus:ring-2 focus:ring-[#f58529]"
                        value={removeSelections[name]}
                        onChange={e => handleRemoveSelection(name, e.target.value)}
                      >
                        <option value="Sumuka">Sumuka</option>
                        <option value="Tulog">Tulog</option>
                        <option value="Pass">Pass</option>
                        <option value="Uuwi na">Uuwi na</option>
                      </select>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex gap-2 w-full">
                <button
                  className="flex-1 rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] text-white font-semibold px-4 py-1"
                  onClick={confirmRemovePlayers}
                  disabled={Object.keys(removeSelections).length === 0}
                >
                  Confirm
                </button>
                <button
                  className="flex-1 rounded-full bg-gray-300 text-gray-700 font-semibold px-4 py-1"
                  onClick={cancelRemovePlayers}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
