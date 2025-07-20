"use client";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import Image from "next/image";

export const AuthButton = () => {
  const { user, loading, isAdmin, signIn, signOut } = useFirebaseAuth();

  if (loading) return <div className="text-white">Loading...</div>;

  if (!user)
    return (
      <button
        onClick={signIn}
        className="rounded-full bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] text-white font-semibold px-6 py-2 shadow hover:opacity-90 transition"
      >
        Sign in with Google
      </button>
    );

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        {user.photoURL && (
          <Image
            src={user.photoURL}
            alt={user.displayName || "User"}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <span className="text-white font-medium">{user.displayName || user.email}</span>
        {isAdmin && (
          <span className="ml-2 px-2 py-0.5 rounded bg-[#f58529] text-xs text-white font-bold">ADMIN</span>
        )}
      </div>
      <button
        onClick={signOut}
        className="rounded-full bg-white/80 text-[#dd2a7b] font-semibold px-4 py-1 shadow hover:bg-white transition text-sm"
      >
        Sign out
      </button>
    </div>
  );
};
