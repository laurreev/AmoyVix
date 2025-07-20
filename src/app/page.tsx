
import Image from "next/image";
import { EventList, Event } from "../components/EventList";
import { Poll, PollOption } from "../components/Poll";
import { FunWidget } from "../components/FunWidget";
import { AuthButton } from "../components/AuthButton";

export default function Home() {
  // Example data
  const events: Event[] = [
    { id: "1", title: "Beach Day", date: "2025-08-10", description: "Let's have fun at the beach!" },
    { id: "2", title: "Game Night", date: "2025-08-24", description: "Board games and snacks." },
  ];
  const pollOptions: PollOption[] = [
    { id: "a", text: "Pizza" },
    { id: "b", text: "Sushi" },
    { id: "c", text: "Burgers" },
  ];
  return (
    <div className="font-sans flex flex-col items-center min-h-screen p-4 sm:p-10 gap-8">
      <header className="w-full max-w-xl text-center mb-4">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#515bd4] bg-clip-text text-transparent mb-2 drop-shadow">AmoyVix</h1>
        <p className="text-lg text-white/90 font-medium">A private space for our group of friends</p>
      </header>
      <AuthButton />
      <EventList events={events} />
      <Poll question="What should we eat for our next meetup?" options={pollOptions} />
      <FunWidget nextEvent="Beach Day on August 10, 2025" memory="Remember our epic karaoke night?" />
      <footer className="mt-8 text-center text-white/80 text-xs">
        &copy; {new Date().getFullYear()} AmoyVix. For our friends only.
      </footer>
    </div>
  );
}
