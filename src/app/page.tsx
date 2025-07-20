import { EventList, Event } from "../components/EventList";
import { Poll, PollOption } from "../components/Poll";
import { FunWidget } from "../components/FunWidget";
import { AuthButton } from "../components/AuthButton";
import { AddEventForm } from "../components/AddEventForm";
import { AddPollForm } from "../components/AddPollForm";
import { useFirebaseAuth } from "../hooks/useFirebaseAuth";
import { useState } from "react";
import { AppNav } from "../components/AppNav";

export default function Home() {
  const { user, isAdmin } = useFirebaseAuth();
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
      <div className="font-sans flex flex-col items-center min-h-screen p-4 sm:p-10 gap-8">
        <header className="w-full max-w-xl text-center mb-4">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] bg-clip-text text-transparent mb-2 drop-shadow">AmoyVix</h1>
          <p className="text-lg text-white/90 font-medium">A private space for our group of friends</p>
        </header>
        <AuthButton />
      </div>
    );
  }
  return (
    <div className="font-sans flex flex-col items-center min-h-screen p-4 sm:p-10 gap-8">
      <AppNav />
      <header className="w-full max-w-xl text-center mb-4">
        <p className="text-white/80 mt-2">Welcome, {user.displayName || user.email}!</p>
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
