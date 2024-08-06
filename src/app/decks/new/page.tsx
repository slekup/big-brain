"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { invoke } from "@tauri-apps/api/core";
import { useRouter, useSearchParams } from "next/navigation";
import { HexColorPicker } from "react-colorful";
import { addToast } from "@/src/slices/toasts.slice";
import { ToastType } from "@/src/typings/core";
import { useDispatch } from "react-redux";

export default function NewDeck() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string | undefined>();
  const [coverImage, setCoverImage] = useState<File | undefined>();
  const [color, setColor] = useState("#000000");
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [parentName, setParentName] = useState<string | undefined>();

  const router = useRouter();
  const dispatch = useDispatch();
  const params = useSearchParams();
  const parentId = params.get("parent_id");

  useEffect(() => {
    if (parentId) {
      invoke<string>("get_deck_name", { id: parseInt(parentId) })
        .then((data) => {
          setParentName(data);
        })
        .catch(console.error);
    }
  }, [parentId]);

  const handleSubmit = async () => {
    if (!name) {
      dispatch(
        addToast({
          title: "Missing Fields",
          description: "Please fill in the required fields.",
          type: ToastType.Error,
        }),
      );
      return;
    }

    if (description?.length === 0) {
      setDescription(undefined);
    }

    if (coverImage) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const coverImage = new Uint8Array(reader.result as ArrayBuffer);
        invoke("new_deck", {
          deck: {
            parent_id: parentId,
            name,
            description,
            color,
            cover_image: Array.from(coverImage),
          },
        })
          .then((id) => {
            router.push(`/decks?id=${id}`);
            dispatch(
              addToast({
                title: "Successfully created deck",
                type: ToastType.Success,
                description: `Name: ${name}`,
              }),
            );
          })
          .catch((e) => {
            dispatch(
              addToast({
                title: "Failed to create deck",
                type: ToastType.Error,
                description: String(e),
              }),
            );
            console.error(e);
          });
      };

      reader.readAsArrayBuffer(coverImage);
    } else {
      invoke("new_deck", {
        deck: {
          parent_id: parentId,
          name,
          description,
          color,
        },
      })
        .then((id) => {
          router.push(`/decks?id=${id}`);
          dispatch(
            addToast({
              title: "Successfully created deck",
              type: ToastType.Success,
              description: `Name: ${name}`,
            }),
          );
        })
        .catch((e) => {
          dispatch(
            addToast({
              title: "Failed to create deck",
              type: ToastType.Error,
              description: String(e),
            }),
          );
          console.error(e);
        });
    }
  };

  return (
    <main className="max-w-3xl mx-auto my-10 p-5">
      <form onSubmit={(e) => e.preventDefault()}>
        {parentName && (
          <p className="font-bold text-gray-400">Parent Deck: {parentName}</p>
        )}

        <div className="mt-5">
          <p className="font-bold uppercase text-gray-400">Title:</p>
          <input
            type="text"
            maxLength={100}
            className="mt-1 py-3 px-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 focus:border-black font-semibold text-2xl w-full"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mt-5">
          <p className="font-bold uppercase text-gray-400">Description:</p>
          <textarea
            className="mt-1 py-3 px-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 focus:border-black text-lg w-full"
            maxLength={500}
            rows={5}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mt-5">
          <p className="font-bold uppercase text-gray-400">Cover Image:</p>
          <div className="mt-1 flex">
            <div
              className={`relative mr-2 h-40 w-96 rounded-lg transition bg-gray-200 hover:bg-gray-300 active:bg-gray-400 overflow-hidden`}
            >
              <p className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-2xl font-bold text-gray-500 text-center">
                Select Image
              </p>
              {coverImage && (
                <Image
                  src={URL.createObjectURL(coverImage)}
                  fill={true}
                  alt="Cover image preview"
                  className="object-cover object-center"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && setCoverImage(e.target.files[0])
                }
                className="absolute top-0 left-0 h-full w-full opacity-0 cursor-crosshair"
              />
            </div>
            <div className="relative ml-2">
              <div className="flex">
                <div
                  className="h-5 w-5 rounded-full"
                  style={{ background: color }}
                ></div>
                <p className="font-bold -mt-0.5 ml-1">{color}</p>
              </div>
              <button
                onClick={() => setShowColorPicker(true)}
                className="mt-2 py-3 px-5 rounded-lg font-semibold transition bg-gray-200 hover:bg-gray-300 active:bg-gray-400 active:scale-95"
              >
                Open Color Picker
              </button>
              {showColorPicker && (
                <>
                  <div
                    className="fixed top-0 left-0 h-full w-full"
                    onClick={() => setShowColorPicker(false)}
                  ></div>

                  <div className="absolute top-7 left-0">
                    <HexColorPicker color={color} onChange={setColor} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <button
            className="px-5 py-3 rounded-lg bg-lime-500 hover:bg-lime-600 active:bg-lime-700 text-white font-semibold transition active:scale-95"
            onClick={handleSubmit}
          >
            Create Deck
          </button>
        </div>
      </form>
    </main>
  );
}
