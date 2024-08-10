"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { invoke } from "@tauri-apps/api/core";
import { useRouter, useSearchParams } from "next/navigation";
import { HexColorPicker } from "react-colorful";
import { ToastType } from "@typings/core";
import { useDispatch } from "react-redux";
import { JSONContent, useEditor } from "@tiptap/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { Button, Editor, editorOptions } from "@components";
import { addToast } from "@slices/toasts.slice";

interface NewDeckForm {
  name: string;
  description: JSONContent;
  color: string;
}

export default function NewDeck() {
  const [coverImage, setCoverImage] = useState<File | undefined>();
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [parentName, setParentName] = useState<string | undefined>();

  const editor = useEditor(editorOptions());
  const { register, handleSubmit, control } = useForm<NewDeckForm>();

  const router = useRouter();
  const dispatch = useDispatch();
  const params = useSearchParams();
  const parentId = params.get("parent_id");

  useEffect(() => {
    if (parentId) {
      invoke<string>("get_deck_name", { id: parseInt(parentId) })
        .then(setParentName)
        .catch(console.error);
    }
  }, [parentId]);

  const newDeck = (data: NewDeckForm, coverImageData?: Uint8Array) => {
    invoke("new_deck", {
      deck: {
        parent_id: parentId,
        name: data.name,
        description: JSON.stringify(data.description),
        color: data.color,
        cover_image: coverImageData ? Array.from(coverImageData) : undefined,
        cover_image_type:
          coverImage && coverImageData
            ? coverImage.name.split(".")[coverImage.name.split(".").length - 1]
            : undefined,
      },
    })
      .then((id) => {
        router.push(`/decks?id=${id}`);
        dispatch(
          addToast({
            title: "Successfully Created Deck",
            type: ToastType.Success,
            description: `Name: ${data.name}`,
          }),
        );
      })
      .catch((e) => {
        dispatch(
          addToast({
            title: "Failed to Create Deck",
            type: ToastType.Error,
            description: String(e),
          }),
        );
        console.error(e);
      });
  };

  const onSubmit: SubmitHandler<NewDeckForm> = async (data) => {
    if (coverImage) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const coverImageData = new Uint8Array(reader.result as ArrayBuffer);
        newDeck(data, coverImageData);
      };
      reader.readAsArrayBuffer(coverImage);
    } else {
      newDeck(data);
    }
  };

  return (
    <main className="max-w-3xl mx-auto my-10 p-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        {parentName && (
          <p className="font-bold text-fg-secondary">
            Parent Deck: {parentName}
          </p>
        )}

        <div className="mt-5">
          <p className="font-bold uppercase text-fg-secondary">Title:</p>
          <input
            type="text"
            className="mt-1 py-3 px-4 rounded-lg border-2 border-border hover:border-border-hover focus:border-black font-semibold text-2xl w-full"
            {...register("name", {
              required: true,
              minLength: 3,
              maxLength: 100,
            })}
          />
        </div>

        <div className="mt-5">
          <p className="font-bold uppercase text-gray-400">Description:</p>
          <Controller
            name="description"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Editor editor={editor} value={value} onChange={onChange} />
            )}
          />
        </div>

        <div className="mt-5">
          <p className="font-bold uppercase text-gray-400">Cover Image:</p>
          <div className="mt-1 grid grid-cols-2 gap-x-4">
            <div className="group relative h-40 max-w-96 rounded-lg transition bg-gray-200 overflow-hidden">
              {coverImage && (
                <Image
                  src={URL.createObjectURL(coverImage)}
                  alt="Cover image preview"
                  className="object-cover object-center"
                  fill
                />
              )}
              <div
                className={`absolute h-full w-full transition ${coverImage ? "group-hover:bg-black/30 group-active:bg-black/60" : "group-hover:bg-black/10 group-active:bg-black/20"}`}
              >
                <p
                  className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-2xl font-bold text-center transition ${coverImage ? "text-white opacity-0 group-hover:opacity-100 group-active:opacity-100" : "text-gray-500"}`}
                >
                  {coverImage ? "Change" : "Select"} Image
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && setCoverImage(e.target.files[0])
                }
                className="absolute top-0 left-0 h-full w-full opacity-0 cursor-pointer"
              />
            </div>

            <div className="relative">
              {coverImage && (
                <div className="mb-8">
                  <Button
                    label="Clear Image"
                    variant="danger"
                    onClick={() => setCoverImage(undefined)}
                  />
                </div>
              )}

              <Controller
                name="color"
                control={control}
                defaultValue="#000000"
                render={({ field: { value, onChange } }) => (
                  <div>
                    <div className="flex">
                      <div
                        className="h-5 w-5 rounded-full"
                        style={{ background: value }}
                      ></div>
                      <p className="font-bold -mt-0.5 ml-1">{value}</p>
                    </div>
                    <Button
                      label="Open Color Picker"
                      variant="secondary"
                      onClick={() => setShowColorPicker(true)}
                      className="mt-2"
                    />
                    {showColorPicker && (
                      <>
                        <div
                          className="fixed top-0 left-0 h-full w-full"
                          onClick={() => setShowColorPicker(false)}
                        ></div>

                        <div className="absolute top-7 left-0">
                          <HexColorPicker color={value} onChange={onChange} />
                        </div>
                      </>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        <Button
          type="submit"
          label="Create Deck"
          variant="success"
          className="mt-10"
        />
      </form>
    </main>
  );
}
