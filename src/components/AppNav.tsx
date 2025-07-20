"use client";
import { useState } from "react";
import { ProfileMenu } from "./ProfileMenu";
import { ProfileModal } from "./ProfileModal";
import Image from "next/image";

interface AppNavProps {
  nickname: string;
  photoURL?: string | null;
  onEditProfile?: (nickname: string, photoURL?: string) => void;
}

export const AppNav: React.FC<AppNavProps> = ({ nickname, photoURL, onEditProfile }) => {
  const [showProfile, setShowProfile] = useState(false);
  return (
    <>
      <ProfileModal
        open={showProfile}
        onSave={(newNickname, newPhotoURL) => {
          setShowProfile(false);
          if (typeof window !== "undefined" && newNickname) {
            if (typeof onEditProfile === "function") onEditProfile(newNickname, newPhotoURL);
          }
        }}
        defaultNickname={nickname}
        defaultPhotoURL={photoURL || undefined}
      />
      <nav className="w-full max-w-xl flex items-center justify-between bg-white/80 rounded-xl shadow px-4 py-2 mb-6">
        <ProfileMenu nickname={nickname} photoURL={photoURL} onEditProfile={() => setShowProfile(true)} />
        <span className="font-bold text-[#dd2a7b] text-lg tracking-wide">AmoyVix</span>
        <div className="flex items-center gap-2">
          {photoURL && (
            <Image src={photoURL} alt={nickname} width={32} height={32} className="rounded-full" />
          )}
          <span className="text-[#515bd4] font-semibold text-base">{nickname}</span>
        </div>
      </nav>
    </>
  );
};
