"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { invoke } from "@tauri-apps/api/core";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/src/components/global/Button";
import { addToast } from "@/src/slices/toasts.slice";
import { ToastType } from "@/src/typings/core";
import { useDispatch } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

interface PreviewDeck {
  id: number;
  name: string;
  color: string;
  cover_image: number[] | undefined;
}

interface Deck extends PreviewDeck {
  parent_id: number | undefined;
  description: string;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

function imageUrl(image: number[]) {
  return URL.createObjectURL(
    new Blob([new Uint8Array(image)], {
      type: "image/jpeg",
    }),
  );
}

export default function Decks() {
  const [decks, setDecks] = useState<PreviewDeck[]>([]);
  const [deck, setDeck] = useState<Deck | undefined>();
  const [deckOptions, setDeckOptions] = useState<number | undefined>();

  const dispatch = useDispatch();
  const params = useSearchParams();
  const id = params.get("id") || undefined;

  useEffect(() => {
    invoke<PreviewDeck[]>("get_decks", { id: id ? parseInt(id) : undefined })
      .then((data) => setDecks(data))
      .catch(console.error);

    if (id) {
      invoke<Deck>("get_deck", { id: parseInt(id) })
        .then((data) => setDeck(data))
        .catch(console.error);
    } else {
      setDeck(undefined);
    }
  }, [id]);

  return (
    <main className="mt-5 pb-40 p-5 max-w-5xl mx-auto">
      {deck && (
        <div className="mb-5">
          <div className="relative h-40 w-full rounded-lg overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full w-full"
              style={{ background: deck.color }}
            ></div>
            {deck.cover_image && (
              <Image
                src={imageUrl(deck.cover_image)}
                fill={true}
                className="absolute w-full h-full object-cover object-center"
                alt="Cover Image"
              />
            )}
          </div>
          <h1 className="font-bold text-3xl mt-3">{deck.name}</h1>
          <p className="mt-2 text-lg text-gray-600">{deck.description}</p>
        </div>
      )}

      <div>
        <Link href={`/decks/new${id ? `?parent_id=${id}` : ""}`}>
          <Button variant="success" label={`New ${id ? "Sub-deck" : "Deck"}`} />
        </Link>
        <Button
          variant="secondary"
          label="Import"
          className="ml-2"
          onClick={() =>
            dispatch(
              addToast({
                title: "Coming soon",
                description: "Feature not implemented yet.",
                type: ToastType.Warning,
              }),
            )
          }
        />
        <Button
          variant="secondary"
          label="Export"
          className="ml-2"
          onClick={() =>
            dispatch(
              addToast({
                title: "Coming soon",
                description: "Feature not implemented yet.",
                type: ToastType.Warning,
              }),
            )
          }
        />
      </div>

      <div>
        <div className="h-0.5 my-5 rounded-md bg-gray-200"></div>

        {decks.length > 0 ? (
          <div className="flex flex-wrap py-2">
            {decks.map((deck, i) => (
              <div
                className={`w-1/3 py-3 ${i % 3 == 0 ? "pr-4" : (i - 1) % 3 == 0 ? "px-2" : (i - 2) % 3 == 0 && "pl-4"}`}
                key={deck.id}
              >
                <div className="group relative">
                  <Link
                    href={`/decks?id=${deck.id}`}
                    className="block peer transition-[background,transform] active:bg-bg-secondary active:border-black active:scale-95 bg-white rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-black"
                  >
                    <div
                      className="relative h-24 w-full"
                      style={{ background: deck.color }}
                    >
                      {deck.cover_image && (
                        <Image
                          fill={true}
                          src={imageUrl(deck.cover_image)}
                          alt="Cover Image"
                          className="absolute h-full w-full object-cover object-center"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-gray-400 font-semibold">
                        Local
                      </p>
                      <p className="mt-1 text-xl font-bold">{deck.name}</p>
                    </div>
                  </Link>
                  <div
                    className={`absolute top-0 left-0 h-full w-full border-2 border-gray-200 rounded-lg bg-bg transition-[opacity,visibility,transform] ${deckOptions !== deck.id && "opacity-0 invisible scale-90"}`}
                  >
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full p-2">
                      <button
                        className="block w-full mt-1 py-2 px-5 rounded-lg hover:bg-secondary-hover active:bg-secondary-active transition font-bold"
                        onClick={() =>
                          dispatch(
                            addToast({
                              title: "Coming soon",
                              description: "Feature not implemented yet.",
                              type: ToastType.Warning,
                            }),
                          )
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="block w-full mt-1 py-2 px-5 rounded-lg hover:bg-secondary-hover active:bg-secondary-active transition font-bold"
                        onClick={() =>
                          dispatch(
                            addToast({
                              title: "Coming soon",
                              description: "Feature not implemented yet.",
                              type: ToastType.Warning,
                            }),
                          )
                        }
                      >
                        Archive
                      </button>
                      <button
                        className="block w-full mt-1 py-2 px-5 rounded-lg text-danger hover:bg-danger hover:text-danger-fg active:bg-danger-hover active:text-danger-fg transition font-bold"
                        onClick={() =>
                          dispatch(
                            addToast({
                              title: "Coming soon",
                              description: "Feature not implemented yet.",
                              type: ToastType.Warning,
                            }),
                          )
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <button
                    className={`absolute top-2 right-2 p-2 rounded-full bg-bg text-secondary-fg hover:bg-secondary-hover active:bg-secondary-active transition ${deckOptions === deck.id ? "-translate-y-5 translate-x-5 border-2 border-gray-200" : "hidden group-hover:block peer-active:opacity-0 active:opacity-100"}`}
                    onClick={() =>
                      deckOptions === deck.id
                        ? setDeckOptions(undefined)
                        : setDeckOptions(deck.id)
                    }
                  >
                    {deckOptions === deck.id ? (
                      <IoClose className="h-5 w-5" />
                    ) : (
                      <BsThreeDotsVertical className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="border-2 border-gray-200 rounded-lg p-5 text-center text-gray-600 font-semibold">
            {id ? "No sub-decks in deck." : "You have no decks."}
          </p>
        )}
      </div>

      {id && (
        <>
          <div className="h-0.5 mt-5 rounded-md bg-gray-200"></div>
          <div className="mt-5">
            <Link
              href={`/decks/card?id=1`}
              className="mt-2 block py-4 px-5 border-2 rounded-lg font-semibold transition border-gray-200 hover:border-gray-300 active:border-black hover:bg-gray-100 active:bg-gray-200 active:scale-[0.99]"
            >
              Some random card?
            </Link>
            <Link
              href="#"
              className="mt-5 block text-center py-4 px-5 rounded-lg font-semibold transition text-white bg-lime-500 hover:hover:bg-lime-600 active:bg-lime-700 active:scale-[0.99]"
            >
              New Card
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
