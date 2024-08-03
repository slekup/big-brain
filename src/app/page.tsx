import Link from "next/link";

export default function Home() {
  return (
    <main className="text-center absolute w-full h-full">
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
        <h1 className="text-[50px] font-extrabold">Big Brain</h1>

        <div className="mt-10">
          <div className="flex justify-center">
            <Link
              href="/decks"
              className="block py-7 w-60 m-2 rounded-xl bg-purple-500 hover:bg-purple-600 active:bg-purple-700 transition text-white font-bold text-xl"
            >
              Decks
            </Link>
            <Link
              href="/study"
              className="block py-7 w-60 m-2 rounded-xl bg-lime-500 hover:bg-lime-600 active:bg-lime-700 transition text-white font-bold text-xl"
            >
              Study
            </Link>
          </div>
          <div className="flex justify-center">
            <Link
              href="/community"
              className="block py-7 w-60 m-2 rounded-xl bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition text-white font-bold text-xl"
            >
              Community
            </Link>
            <Link
              href="/stats"
              className="block py-7 w-60 m-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transition text-white font-bold text-xl"
            >
              Stats
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
