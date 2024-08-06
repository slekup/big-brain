"use client";

import { invoke } from "@tauri-apps/api/core";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface Crumb {
  id: string;
  name: string;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [crumbs, setCrumbs] = useState<Crumb[]>([]);

  const pathname = usePathname();

  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");

  useEffect(() => {
    if (id) {
      invoke<Crumb[]>("get_deck_crumbs", { id: parseInt(id) })
        .then((data) => setCrumbs(data.reverse()))
        .catch(console.error);
    } else {
      setCrumbs([]);
    }
  }, [id]);

  return (
    <>
      <div className="h-14 border-b-2 border-gray-200">
        <div className="flex flex-row font-bold text-xl px-5 py-2.5">
          <Link
            href="/decks"
            className="block py-1 px-2 rounded-lg hover:bg-bg-secondary active:bg-bg-tertiary transition"
          >
            <p>Decks</p>
          </Link>
          {pathname == "/decks/new" && (
            <>
              <p className="mx-1 scale-90 mt-1.5 text-gray-400">/</p>
              <p className="cursor-pointer block py-1 px-2 rounded-lg hover:bg-bg-secondary active:bg-bg-tertiary transition">
                New Deck
              </p>
            </>
          )}
          {crumbs.map((c, i) => (
            <div key={i} className="flex">
              <p className="mx-1 scale-90 mt-1.5 text-gray-400">/</p>
              <p
                key={i}
                onClick={() => {
                  router.push(`/decks?id=${c.id}`);
                }}
                className="cursor-pointer block py-1 px-2 rounded-lg hover:bg-bg-secondary active:bg-bg-tertiary transition"
              >
                {c.name}
              </p>
            </div>
          ))}
          {pathname == "/decks/card" && (
            <>
              <p className="mx-1 scale-90 mt-1.5 text-gray-400">/</p>
              <p className="cursor-pointer block py-1 px-2 rounded-lg hover:bg-bg-secondary active:bg-bg-tertiary transition">
                New Card
              </p>
            </>
          )}
        </div>
      </div>
      <div>{children}</div>
    </>
  );
}
