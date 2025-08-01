import React from "react";

interface FunWidgetProps {
  nextEvent?: string;
  memory?: string;
}

export const FunWidget: React.FC<FunWidgetProps> = ({ nextEvent, memory }) => {
  const hasEvent = typeof nextEvent === "string" && nextEvent.trim() !== "" && !nextEvent.includes("undefined");
  return (
    <section className="w-full max-w-xl bg-white/80 rounded-xl shadow p-6 mb-8 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4 text-center text-[#f58529]">Fun Card</h2>
      {hasEvent ? (
        <div className="mb-2 text-center">
          <span className="font-semibold">Next Event:</span> {nextEvent}
        </div>
      ) : (
        <div className="mb-2 text-center text-gray-500">No events yet.</div>
      )}
      {memory && (
        <div className="text-center italic text-[#dd2a7b]">“{memory}”</div>
      )}
      {!hasEvent && !memory && <div className="text-gray-500">Nothing fun yet!</div>}
    </section>
  );
};
