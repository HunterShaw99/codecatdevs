import Image from "next/image";

import About from "./components/About";

export default function Home() {
  return (
    <div className="space-y-6">
      <main className="flex flex-col gap-[16px] items-center w-full dark:bg-gray-900 dark:text-white">
        <Image
          className="mb-8 dark:invert"
          src="/code_cat_white.svg"
          alt="Code Cat logo"
          width={200}
          height={200}
          priority
        />
        <h1 className="text-4xl font-bold z-10 mb-6 dark:text-white">Code Cat Developers</h1>
        <About />
      </main>
    </div>
  );
}