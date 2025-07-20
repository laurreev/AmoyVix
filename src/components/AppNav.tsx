"use client";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { ProfileMenu } from "./ProfileMenu";
import Image from "next/image";

interface AppNavProps {
  nickname: string;
  photoURL?: string | null;
  onEditNickname: () => void;
}

export const AppNav: React.FC<AppNavProps> = ({ nickname, photoURL, onEditNickname }) => {
  return (
    <nav className="w-full max-w-xl flex items-center justify-between bg-white/80 rounded-xl shadow px-4 py-2 mb-6">
      <ProfileMenu nickname={nickname} photoURL={photoURL} onEditNickname={onEditNickname} />
      <span className="font-bold text-[#dd2a7b] text-lg tracking-wide">AmoyVix</span>
      <div className="flex items-center gap-2">
        {photoURL && (
          <Image src={photoURL} alt={nickname} width={32} height={32} className="rounded-full" />
        )}
        <span className="text-[#515bd4] font-semibold text-base">{nickname}</span>
      </div>
    </nav>
  );
};
