"use client";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";

export const AppNav = () => {
  const { signOut } = useFirebaseAuth();
  return (
    <nav className="w-full max-w-xl flex items-center justify-between bg-white/80 rounded-xl shadow px-4 py-2 mb-6">
      <button
        onClick={signOut}
        className="rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] text-white font-semibold px-4 py-1 text-sm shadow hover:opacity-90 transition"
      >
        Sign out
      </button>
      <span className="font-bold text-[#dd2a7b] text-lg tracking-wide">AmoyVix</span>
      <div />
    </nav>
  );
};
