"use client";
import { EventList, Event } from "../components/EventList";
import { AppNav } from "../components/AppNav";
import { SetNicknameModal } from "../components/SetNicknameModal";
import { AuthButton } from "../components/AuthButton";
import { AddEventForm } from "../components/AddEventForm";
import { AddPollForm } from "../components/AddPollForm";
import { Poll } from "../components/Poll";
import { FunWidget } from "../components/FunWidget";
import { app } from "../firebase";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { useState, useEffect } from "react";
type InumanSession = {
  players: string[];
  order: string[];
  outPlayers: Record<string, { out: boolean; reason: string }>;
  ended: boolean;
  endedAt?: Date | { toDate: () => Date } | null;
};
type PollOption = { id: string; text: string };
type PollType = { id: string; question: string; options: PollOption[] };
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, onSnapshot, query, orderBy, where, limit } from "firebase/firestore";
export default function Home() {
  const { user, isAdmin } = useFirebaseAuth();
  const [nickname, setNickname] = useState<string | null>(null);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [recentSession, setRecentSession] = useState<InumanSession | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [polls, setPolls] = useState<PollType[]>([]);

  // Fetch most recent ended Inuman session
  useEffect(() => {
    const db = getFirestore(app);
    const q = query(collection(db, "inumanSessions"), where("ended", "==", true), orderBy("endedAt", "desc"), limit(1));
    const unsub = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setRecentSession(snapshot.docs[0].data() as InumanSession);
      } else {
        setRecentSession(null);
      }
    });
    return () => unsub();
  }, []);

  // Prompt for nickname on first login, now persistent in Firestore
  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const db = getFirestore(app);
          const ref = doc(db, "users", user.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            const data = snap.data();
            if (data.nickname) setNickname(data.nickname);
            if (data.photoURL) {
              setPhotoURL(data.photoURL);
            } else if (user.photoURL) {
              setPhotoURL(user.photoURL);
              // Save Google photoURL to Firestore for future logins
              await setDoc(ref, { photoURL: user.photoURL }, { merge: true });
            } else {
              setPhotoURL(null);
            }
          } else {
            setShowNicknameModal(true);
            if (user.photoURL) {
              setPhotoURL(user.photoURL);
              // Save Google photoURL to Firestore for new users
              await setDoc(ref, { photoURL: user.photoURL }, { merge: true });
            } else {
              setPhotoURL(null);
            }
          }
        } catch (e) {
          setShowNicknameModal(true);
          setPhotoURL(user.photoURL || null);
        }
      };
      fetchProfile();
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
        setShowNicknameModal(false);
      }
    }
  };

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
      setPolls(snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          question: data.question,
          options: Array.isArray(data.options) ? data.options : []
        };
      }));
    });
    return () => unsub();
  }, []);
  const memories = [
    "Susuka pero hindi susubo, susuko*"
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
        <h2 className="text-2xl font-extrabold bg-gradient-to-r from-[#ff9966] via-[#ff5e62] to-[#ffc371] bg-clip-text text-transparent drop-shadow mb-1">
          Welcome{nickname ? ", " : ""}{nickname || user.displayName || user.email}!
        </h2>
        <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] rounded-full mb-2"></div>
      </header>
      <div className="w-full max-w-xl bg-white/90 rounded-xl shadow p-6 mb-4 text-black">
        {/* Recent Inuman Session Stats */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2 text-[#f58529]">Recent Inuman Session Stats</h3>
          {recentSession ? (
            <div className="bg-gradient-to-r from-[#f58529]/10 via-[#dd2a7b]/10 to-[#515bd4]/10 rounded-xl p-4">
              <div className="mb-2 text-sm text-gray-700">Players:</div>
              <ul className="mb-2">
                {recentSession.order.map((name: string, idx: number) => {
                  const out = recentSession.outPlayers?.[name]?.out;
                  const reason = recentSession.outPlayers?.[name]?.reason;
                  return (
                    <li key={idx} className={`flex items-center gap-2 mb-1 ${out ? "text-gray-400" : "text-black"}`}>
                      <span className={`font-bold ${out ? "bg-gray-200" : "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#515bd4] text-white"} rounded-full px-2 py-1 text-xs`}>{name}</span>
                      <span className="text-xs font-semibold ml-2">
                        {out ? `Weakling${reason ? ` (${reason})` : ""}` : "Matibay"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">No recent session yet.</div>
          )}
        </div>
        {isAdmin && <AddEventForm onAdd={handleAddEvent} />}
        {events.length > 0 ? <EventList events={events} /> : <div className="text-gray-600">No events yet.</div>}
        {isAdmin && <AddPollForm onAdd={handleAddPoll} />}
        {polls.length > 0 ? polls.map((poll: PollType, idx: number) => (
          <Poll key={idx} question={poll.question} options={poll.options} />
        )) : <div className="text-gray-600">No polls yet.</div>}
        <FunWidget nextEvent={events[0]?.title + " on " + events[0]?.date} memory={randomMemory} />
      </div>
      <footer className="mt-8 text-center text-xs">
        &copy; {new Date().getFullYear()} AmoyVix. For our friends only.
      </footer>
    </div>
  );
}
