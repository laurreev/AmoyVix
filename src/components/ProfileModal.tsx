"use client";
import { useState, useRef, useEffect } from "react";

interface ProfileModalProps {
  open: boolean;
  onSave: (nickname: string, photoURL?: string) => void;
  defaultNickname?: string;
  defaultPhotoURL?: string;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ open, onSave, defaultNickname, defaultPhotoURL }) => {
  const [nickname, setNickname] = useState("");
  const [photoURL, setPhotoURL] = useState<string | undefined>(defaultPhotoURL);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset fields when opened
  useEffect(() => {
    if (open) {
      setNickname("");
      setPhotoURL(defaultPhotoURL);
    }
  }, [open, defaultPhotoURL]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPhotoURL(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs flex flex-col items-center">
        <h2 className="text-lg font-bold mb-2 text-[#dd2a7b]">Profile</h2>
        <div className="mb-4 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 mb-2 flex items-center justify-center">
            {photoURL ? (
              <img src={photoURL} alt="Profile" className="object-cover w-full h-full" />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>
          <button
            className="text-xs text-[#dd2a7b] underline mb-2"
            onClick={() => fileInputRef.current?.click()}
          >
            Change Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <input
          className="rounded px-2 py-1 border w-full mb-4 text-black"
          placeholder="Enter nickname"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          maxLength={24}
        />
        <button
          className="rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] text-white font-semibold px-4 py-1 mt-2 w-full"
          onClick={() => nickname.trim() && onSave(nickname.trim(), photoURL)}
        >
          Save
        </button>
      </div>
    </div>
  );
};
