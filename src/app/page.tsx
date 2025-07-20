"use client";
import { EventList, Event } from "../components/EventList";
import { Poll, PollOption } from "../components/Poll";
import { FunWidget } from "../components/FunWidget";
import { AuthButton } from "../components/AuthButton";
import { AddEventForm } from "../components/AddEventForm";
import { AddPollForm } from "../components/AddPollForm";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { app } from "../firebase";
import { AppNav } from "../components/AppNav";
import { SetNicknameModal } from "../components/SetNicknameModal";

export default function Home() {
  const { user, isAdmin } = useFirebaseAuth();
  const [nickname, setNickname] = useState<string | null>(null);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
// photoURL state already declared at the top

  // Prompt for nickname on first login, now persistent in Firestore
  useEffect(() => {
    if (user) {
      const fetchNickname = async () => {
        try {
          const db = getFirestore(app);
          const ref = doc(db, "users", user.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = snap.data();
            if (data.nickname) setNickname(data.nickname);
            if (data.photoURL) setPhotoURL(data.photoURL);
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
      setPhotoURL(user.photoURL || null);
    }
  }, [user]);

  const handleSaveNickname = async (nick: string) => {
    if (user) {
      try {
        const db = getFirestore(app);
        const ref = doc(db, "users", user.uid);
        await setDoc(ref, { nickname: nick }, { merge: true });
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
  const [events, setEvents] = useState<Event[]>([]);
  const [polls, setPolls] = useState<any[]>([]);
  // Real-time Firestore sync for events
  useEffect(() => {
    const db = getFirestore(app);
    const q = query(collection(db, "events"), orderBy("date", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event)));
    });
    return () => unsub();
  }, []);

  // Real-time Firestore sync for polls
  useEffect(() => {
    const db = getFirestore(app);
    const q = query(collection(db, "polls"));
    const unsub = onSnapshot(q, (snapshot) => {
      setPolls(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);
  const memories = [
    "Remember our epic karaoke night?",
    "That time we got lost on the hike!",
    "The group costume party was legendary.",
    "Movie marathon until 3am!",
    "Our first beach trip together."
  ];
  const randomMemory = memories[Math.floor(Math.random() * memories.length)];

  const handleAddEvent = async (title: string, date: string, description: string) => {
    const db = getFirestore(app);
    await addDoc(collection(db, "events"), { title, date, description });
  };
  const handleAddPoll = async (question: string, options: string[]) => {
    const db = getFirestore(app);
    await addDoc(collection(db, "polls"), {
      question,
      options: options.map((text, i) => ({ id: i.toString(), text }))
    });
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
    <div className="font-sans flex flex-col items-center min-h-screen p-4 sm:p-10 gap-8 bg-gradient-to-br from-[#f58529]/30 via-[#dd2a7b]/30 to-[#515bd4]/30">
      <SetNicknameModal open={showNicknameModal} onSave={handleSaveNickname} defaultValue={nickname || user.displayName || user.email || ""} />
      <AppNav
        nickname={nickname || user.displayName || user.email || ""}
        photoURL={photoURL || user.photoURL}
        onEditProfile={(newNickname, newPhotoURL) => {
          if (user) {
            const db = getFirestore(app);
            const ref = doc(db, "users", user.uid);
            setDoc(ref, { nickname: newNickname, photoURL: newPhotoURL }, { merge: true });
            setNickname(newNickname);
            setPhotoURL(newPhotoURL || null);
          }
        }}
      />
      <header className="w-full max-w-xl text-center mb-4">
        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] bg-clip-text text-transparent drop-shadow mb-1">Welcome{nickname ? ", " : ""}{nickname || user.displayName || user.email}!</h2>
        <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] rounded-full mb-2"></div>
      </header>
      <div className="w-full max-w-xl bg-white/90 rounded-xl shadow p-6 mb-4 text-black">
        {isAdmin && <AddEventForm onAdd={handleAddEvent} />}
        {events.length > 0 ? <EventList events={events} /> : <div className="text-gray-600">No events yet.</div>}
        {isAdmin && <AddPollForm onAdd={handleAddPoll} />}
        {polls.length > 0 ? polls.map((poll, idx) => (
          <Poll key={idx} question={poll.question} options={poll.options} />
        )) : <div className="text-gray-600">No polls yet.</div>}
        <FunWidget nextEvent={events[0]?.title + " on " + events[0]?.date} memory={randomMemory} />
      </div>
      <footer className="mt-8 text-center text-black/60 text-xs">
        &copy; {new Date().getFullYear()} AmoyVix. For our friends only.
      </footer>
    </div>
  );
}
