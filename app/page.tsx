import Image from "next/image";
import React from 'react';

const highlight = (text: string, highlights: { [key: string]: string }) => {
  const regex = new RegExp(`(${Object.keys(highlights).join('|')})`, 'gi');
  return text.split(regex).map((part, i) =>
    highlights[part.toLowerCase()]
      ? (
        <span
          key={i}
          className={`transition-colors ${highlights[part.toLowerCase()]}`}
          style={{ padding: 0, margin: 0, display: 'inline' }}
        >
          {part}
        </span>
      )
      : part
  );
};

export default function Home() {
  const highlights = {
    code: 'text-lavender',
    coffee: 'text-rosewater',
    personal: 'text-rosewater',
    vibes: 'text-rosewater',
    cats: 'text-peach',
    cattiness: 'text-peach',
    development: 'text-lavender',
    web: 'text-lavender',
    solutions: 'text-lavender',
    pittsburgh: 'text-rosewater',
    service: 'text-rosewater'
  };

  return (
    <div className="space-y-6 px-2">
      <main className="flex flex-col gap-[8px] items-center w-full">
        {/*  change the svg to match the new color palette */}
        <Image
          className="mb-8 mt-4"
          src="/code_cat_colored.svg"
          alt="Code Cat logo"
          width={100}
          height={100}
          priority
        />
        <h1 className="text-6xl font-bold z-10 mb-6 text-sapphire">Code Cat Developers</h1>
        <div className="relative flex flex-col gap-[1s6px] justify-center items-center rounded-3xl p-8 w-full">
          <Image
            src="/code_cat_fill.svg"
            alt="Background Image"
            width={350}
            height={350}
            style={{ opacity: 0.18 }}
            className="absolute rounded-lg pointer-events-none dark:invert"
          />
          <p className="text-3xl z-10 text-center font-extrabold tracking-tight drop-shadow-lg dark:text-white">
            {highlight("Code, Coffee, and Cats.", highlights)}
          </p>
          <p className="text-lg z-10 text-center font-medium leading-relaxed dark:text-white">
            {highlight(
              "That, plus effective and simple web solutions, is what we love. Pittsburgh-based and proud, we strive to offer the best possible service in development to your needs, from creating a landing page for your newly created business that matches your personal vibes, to engineering a solution for that monotonous, repeatable task that’s driving you wild. Spreadsheet data entry and data crunching, generation of tailored PDF reports, we’re happy to chat about any problems you’re experiencing, and find a path forward, no overhead, no cattiness. We leave that to the actual cats in our lives!",
              highlights
            )}
          </p>
        </div>
      </main>
    </div>
  );
}