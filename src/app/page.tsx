"use client";
import { EventList, Event } from "../components/EventList";
import { Poll, PollOption } from "../components/Poll";
import { FunWidget } from "../components/FunWidget";
import { AuthButton } from "../components/AuthButton";
import { AddEventForm } from "../components/AddEventForm";
import { AddPollForm } from "../components/AddPollForm";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { app } from "../firebase";
import { AppNav } from "../components/AppNav";
import { SetNicknameModal } from "../components/SetNicknameModal";

export default function Home() {
  const { user, isAdmin } = useFirebaseAuth();
  const [nickname, setNickname] = useState<string | null>(null);
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  // Prompt for nickname on first login, now persistent in Firestore
  useEffect(() => {
    if (user) {
      const fetchNickname = async () => {
        try {
          const db = getFirestore(app);
          const ref = doc(db, "users", user.uid);
          const snap = await getDoc(ref);
          if (snap.exists() && snap.data().nickname) {
            setNickname(snap.data().nickname);
          } else {
            setShowNicknameModal(true);
          }
        } catch (e) {
          // fallback to localStorage if Firestore fails
          const key = `amoyvix-nickname-${user.uid}`;
          const stored = typeof window !== "undefined" ? localStorage.getItem(key) : null;
          if (stored) {
            setNickname(stored);
          } else {
            setShowNicknameModal(true);
          }
        }
      };
      fetchNickname();
    }
  }, [user]);

  const handleSaveNickname = async (nick: string) => {
    if (user) {
      try {
        const db = getFirestore(app);
        const ref = doc(db, "users", user.uid);
        await setDoc(ref, { nickname }, { merge: true });
        setNickname(nick);
        setShowNicknameModal(false);
      } catch (e) {
        // fallback to localStorage if Firestore fails
        const key = `amoyvix-nickname-${user.uid}`;
        localStorage.setItem(key, nick);
        setNickname(nick);
        setShowNicknameModal(false);
      }
    }
  };
  const [events, setEvents] = useState<Event[]>([
    { id: "1", title: "Beach Day", date: "2025-08-10", description: "Let's have fun at the beach!" },
    { id: "2", title: "Game Night", date: "2025-08-24", description: "Board games and snacks." },
  ]);
  const [polls, setPolls] = useState([
    { question: "What should we eat for our next meetup?", options: [
      { id: "a", text: "Pizza" },
      { id: "b", text: "Sushi" },
      { id: "c", text: "Burgers" },
    ] }
  ]);
  const memories = [
    "Remember our epic karaoke night?",
    "That time we got lost on the hike!",
    "The group costume party was legendary.",
    "Movie marathon until 3am!",
    "Our first beach trip together."
  ];
  const randomMemory = memories[Math.floor(Math.random() * memories.length)];

  const handleAddEvent = (title: string, date: string, description: string) => {
    setEvents(evts => [
      ...evts,
      { id: Date.now().toString(), title, date, description }
    ]);
  };
  const handleAddPoll = (question: string, options: string[]) => {
    setPolls(pls => [
      ...pls,
      { question, options: options.map((text, i) => ({ id: i.toString(), text })) }
    ]);
  };

  if (!user) {
    return (
      <div className="font-sans min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f58529]/30 via-[#dd2a7b]/30 to-[#515bd4]/30 p-4">
        <div className="bg-white/90 rounded-2xl shadow-2xl flex flex-col items-center px-8 py-10 max-w-md w-full">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] bg-clip-text text-transparent mb-2 drop-shadow text-center">AmoyVix</h1>
          <p className="text-lg text-black/80 font-medium mb-8 text-center">A private space for our group of friends</p>
          <AuthButton />
        </div>
      </div>
    );
  }
  return (
    <div className="font-sans flex flex-col items-center min-h-screen p-4 sm:p-10 gap-8">
      <SetNicknameModal open={showNicknameModal} onSave={handleSaveNickname} defaultValue={nickname || user.displayName || user.email || ""} />
      <AppNav
        nickname={nickname || user.displayName || user.email || ""}
        photoURL={user.photoURL}
        onEditNickname={() => setShowNicknameModal(true)}
      />
      <header className="w-full max-w-xl text-center mb-4">
        <p className="text-white/80 mt-2">Welcome, {nickname || user.displayName || user.email}!</p>
      </header>
      {isAdmin && <AddEventForm onAdd={handleAddEvent} />}
      {events.length > 0 ? <EventList events={events} /> : <div className="text-white/80">No events yet.</div>}
      {isAdmin && <AddPollForm onAdd={handleAddPoll} />}
      {polls.length > 0 ? polls.map((poll, idx) => (
        <Poll key={idx} question={poll.question} options={poll.options} />
      )) : <div className="text-white/80">No polls yet.</div>}
      <FunWidget nextEvent={events[0]?.title + " on " + events[0]?.date} memory={randomMemory} />
      <footer className="mt-8 text-center text-white/80 text-xs">
        &copy; {new Date().getFullYear()} AmoyVix. For our friends only.
      </footer>
    </div>
  );
}
