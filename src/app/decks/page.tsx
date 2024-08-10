"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { convertFileSrc, invoke } from "@tauri-apps/api/core";
import { useEditor } from "@tiptap/react";

import { BsThreeDotsVertical } from "react-icons/bs";
import { IoClose } from "react-icons/io5";

import { Button, EditorPreview, previewEditorOptions } from "@components";
import { addToast } from "@slices/toasts.slice";
import { ToastType } from "@typings/core";
import { Dispatch } from "@reduxjs/toolkit";
import { QuestionType } from "@typings/deck";

interface PreviewDeck {
  id: number;
  name: string;
  color: string;
  cover_image?: string;
}

interface Deck extends PreviewDeck {
  parent_id?: number;
  description: string;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

interface PreviewQuestion {
  id: number;
  question_type: QuestionType;
  title: string;
}

/* function imageUrl(image: number[]) {
  return URL.createObjectURL(
    new Blob([new Uint8Array(image)], {
      type: "image/jpeg",
    }),
  );
} */

interface DeckProps {
  deck: PreviewDeck;
  deckOptions?: number;
  setDeckOptions: React.Dispatch<React.SetStateAction<number | undefined>>;
  dispatch: Dispatch;
}

const DeckComponent = ({
  deck,
  deckOptions,
  setDeckOptions,
  dispatch,
}: DeckProps) => {
  return (
    <div key={deck.id}>
      <div className="group relative">
        <Link
          href={`/decks?id=${deck.id}`}
          className="block peer transition-[background,transform] active:bg-bg-secondary active:border-black active:scale-95 bg-bg-modal rounded-lg overflow-hidden border-2 border-border group-hover:border-border-hover group-active:border-border-active"
        >
          <div
            className="relative h-24 w-full"
            style={{ background: deck.color }}
          >
            {deck.cover_image && (
              <Image
                src={convertFileSrc(deck.cover_image)}
                alt="Cover Image"
                className="absolute h-full w-full object-cover object-center"
                fill
              />
            )}
          </div>
          <div className="p-5">
            <p className="text-sm text-fg-tertiary font-semibold">Local</p>
            <p className="mt-1 text-xl font-bold">{deck.name}</p>
          </div>
        </Link>

        <div
          className={`absolute top-0 left-0 h-full w-full border-2 border-border rounded-lg bg-bg transition-[opacity,visibility,transform] ${deckOptions !== deck.id && "opacity-0 invisible scale-90"}`}
        >
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full p-2">
            <button
              className="block w-full mt-1 py-2 px-5 rounded-lg hover:bg-secondary active:bg-secondary-hover transition font-bold"
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
              className="block w-full mt-1 py-2 px-5 rounded-lg hover:bg-secondary active:bg-secondary-hover transition font-bold"
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
            </button>{" "}
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
          className={`absolute top-2 right-2 p-2 rounded-full bg-bg-modal text-secondary-fg border-2 border-border hover:bg-secondary-hover active:bg-secondary-active transition ${deckOptions === deck.id ? "-translate-y-5 translate-x-5" : "hidden group-hover:block peer-active:opacity-0 active:opacity-100"}`}
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
  );
};

export default function Decks() {
  const [decks, setDecks] = useState<PreviewDeck[]>([]);
  const [deck, setDeck] = useState<Deck | undefined>();
  const [deckOptions, setDeckOptions] = useState<number | undefined>();
  const [questions, setQuestions] = useState<PreviewQuestion[] | undefined>();

  const editor = useEditor(previewEditorOptions);

  const dispatch = useDispatch();
  const params = useSearchParams();
  const id = params.get("id") || undefined;

  useEffect(() => {
    invoke<PreviewDeck[]>("get_decks", { id: id ? parseInt(id) : undefined })
      .then(setDecks)
      .catch(console.error);

    if (id) {
      invoke<Deck>("get_deck", { id: parseInt(id) })
        .then(setDeck)
        .catch(console.error);

      invoke<PreviewQuestion[]>("get_questions", {
        deck_id: parseInt(id),
      })
        .then(setQuestions)
        .catch(console.error);
    } else {
      setDeck(undefined);
    }
  }, [id]);

  return (
    <main className="mt-5 pb-40 p-5 max-w-5xl mx-auto">
      {deck && (
        <div className="mb-5">
          <div className="relative h-40 w-full rounded-lg border-2 border-border overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full w-full"
              style={{ background: deck.color }}
            ></div>
            {deck.cover_image && (
              <Image
                src={convertFileSrc(deck.cover_image)}
                className="absolute w-full h-full object-cover object-center"
                alt="Cover Image"
                fill
              />
            )}
          </div>
          <h1 className="font-bold text-3xl mt-5">{deck.name}</h1>
          <div className="my-5 py-5 border-y-2 border-border">
            <EditorPreview editor={editor} value={deck.description} />
          </div>
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
        <div className="h-0.5 my-5 rounded-md bg-border"></div>

        {decks.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 py-2">
            {decks.map((deck, i) => (
              <DeckComponent
                key={i}
                deck={deck}
                deckOptions={deckOptions}
                setDeckOptions={setDeckOptions}
                dispatch={dispatch}
              />
            ))}
          </div>
        ) : (
          <p className="border-2 border-border rounded-lg p-5 text-center text-fg-secondary font-semibold">
            {id ? "No sub-decks in deck." : "You have no decks."}
          </p>
        )}
      </div>

      {id && (
        <>
          <div className="h-0.5 mt-5 rounded-md bg-border"></div>

          <div className="mt-5">
            {questions?.map((question, index) => (
              <Link
                key={index}
                href={`/decks/questions?id=${question.id}`}
                className="mt-2 block py-4 px-5 border-2 rounded-lg font-semibold transition border-border hover:border-border-hover active:border-border-active hover:bg-secondary active:bg-secondary-hover active:scale-[0.99]"
              >
                {question.title}
              </Link>
            ))}
            <Link
              href={`/decks/questions/new?deck_id=${id}`}
              className="mt-5 block text-center py-4 px-5 rounded-lg font-semibold transition text-success-fg bg-lime-500 hover:hover:bg-lime-600 active:bg-lime-700 active:scale-[0.99]"
            >
              New Question
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
