import Image from "next/image";

import Footer from "./components/Footer";
import About from "./components/About";

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen items-center justify-center font-sans">
      <main className="flex flex-col gap-[16px] items-center w-full">
        <Image
          className="dark:invert"
          src="/code_cat_white.svg"
          alt="Code Cat logo"
          width={200}
          height={200}
          priority
        />
        <h1 className="text-4xl font-bold mb-6">Code Cat Developers</h1>
        <About />
        <Footer />
      </main>
    </div>
  );
}
