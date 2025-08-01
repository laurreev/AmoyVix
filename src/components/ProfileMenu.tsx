"use client";
import { useState } from "react";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import Image from "next/image";

interface ProfileMenuProps {
  nickname: string;
  photoURL?: string | null;
  onEditProfile: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ nickname, photoURL, onEditProfile }) => {
  const { signOut } = useFirebaseAuth();
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#f58529]/20 transition"
        onClick={() => setOpen(o => !o)}
        aria-label="Open menu"
      >
        <svg width="24" height="24" fill="none" stroke="#dd2a7b" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-44 bg-white rounded-xl shadow-lg z-50 flex flex-col py-2">
          <button
            className="flex items-center gap-2 px-4 py-2 hover:bg-[#f58529]/10 text-[#dd2a7b] text-sm"
            onClick={() => { setOpen(false); onEditProfile(); }}
          >
            <svg width="18" height="18" fill="none" stroke="#dd2a7b" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg>
            Profile
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 hover:bg-[#f58529]/10 text-[#f58529] text-sm"
            onClick={() => { window.location.href = "/inuman"; }}
          >
            <svg width="18" height="18" fill="none" stroke="#f58529" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 21v-2a4 4 0 0 1 8 0v2"/><path d="M12 17v-6"/><circle cx="12" cy="7" r="4"/></svg>
            Inuman na
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 hover:bg-[#f58529]/10 text-[#dd2a7b] text-sm"
            onClick={signOut}
          >
            <svg width="18" height="18" fill="none" stroke="#dd2a7b" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7"/><path d="M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0z"/></svg>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
};
