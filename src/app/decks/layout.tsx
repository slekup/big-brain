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
  const parent_id = params.get("parent_id");
  const deck_id = params.get("deck_id");

  useEffect(() => {
    let crumb_id = id;

    switch (pathname) {
      case "/decks/new": {
        crumb_id = parent_id;
        break;
      }
      case "/decks/questions/new": {
        crumb_id = deck_id;
        break;
      }
      default: {
        crumb_id = id;
        break;
      }
    }

    if (crumb_id) {
      invoke<Crumb[]>("get_deck_crumbs", { id: parseInt(crumb_id) })
        .then((data) => setCrumbs(data.reverse()))
        .catch(console.error);
    } else {
      setCrumbs([]);
    }
  }, [pathname, id, parent_id, deck_id]);

  return (
    <>
      <div className="h-14"></div>

      <div className="fixed z-20 bg-bg left-60 right-0 top-0 h-14 border-b-2 border-border">
        <div className="flex font-bold text-xl px-5 py-2.5">
          <Link
            href="/decks"
            className="block py-1 px-2 rounded-lg hover:bg-bg-secondary active:bg-bg-tertiary transition"
          >
            Decks
          </Link>

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

          {pathname == "/decks/new" && (
            <>
              <p className="mx-1 scale-90 mt-1.5 text-gray-400">/</p>
              <p className="cursor-pointer block py-1 px-2 rounded-lg text-success hover:bg-bg-secondary active:bg-bg-tertiary transition">
                New Deck
              </p>
            </>
          )}

          {pathname == "/decks/questions/new" && (
            <>
              <p className="mx-1 scale-90 mt-1.5 text-gray-400">/</p>
              <p className="cursor-pointer block py-1 px-2 rounded-lg text-success hover:bg-bg-secondary active:bg-bg-tertiary transition">
                New Question
              </p>
            </>
          )}
        </div>
      </div>
      <div>{children}</div>
    </>
  );
}
