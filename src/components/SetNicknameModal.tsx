"use client";
import { useState } from "react";

interface SetNicknameModalProps {
  open: boolean;
  onSave: (nickname: string) => void;
  defaultValue?: string;
}

export const SetNicknameModal: React.FC<SetNicknameModalProps> = ({ open, onSave, defaultValue }) => {
  const [nickname, setNickname] = useState(defaultValue || "");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs flex flex-col items-center">
        <h2 className="text-lg font-bold mb-2 text-[#dd2a7b]">Set your Nickname</h2>
        <input
          className="rounded px-2 py-1 border w-full mb-4"
          placeholder="Enter nickname"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          maxLength={24}
        />
        <button
          className="rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] text-white font-semibold px-4 py-1 mt-2 w-full"
          onClick={() => nickname.trim() && onSave(nickname.trim())}
        >
          Save
        </button>
      </div>
    </div>
  );
};
