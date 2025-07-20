import React from "react";

interface FunWidgetProps {
  nextEvent?: string;
  memory?: string;
}

export const FunWidget: React.FC<FunWidgetProps> = ({ nextEvent, memory }) => (
  <section className="w-full max-w-xl bg-white/80 rounded-xl shadow p-6 mb-8 flex flex-col items-center">
    <h2 className="text-xl font-bold mb-4 text-center text-[#f58529]">Fun Widget</h2>
    {nextEvent && (
      <div className="mb-2 text-center">
        <span className="font-semibold">Next Event:</span> {nextEvent}
      </div>
    )}
    {memory && (
      <div className="text-center italic text-[#dd2a7b]">“{memory}”</div>
    )}
    {!nextEvent && !memory && <div className="text-gray-500">Nothing fun yet!</div>}
  </section>
);
