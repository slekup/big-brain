"use client";

import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { JSONContent, useEditor } from "@tiptap/react";
import {
  Control,
  Controller,
  SubmitHandler,
  useForm,
  useFieldArray,
} from "react-hook-form";

import { BsThreeDotsVertical } from "react-icons/bs";
import { HiChevronDown } from "react-icons/hi";

import {
  Button,
  Editor,
  editorOptions,
  Select,
  SelectOption,
  SwitchBox,
} from "@components";
import { addToast } from "@slices/toasts.slice";
import { ToastType } from "@typings/core";
import Link from "next/link";
import { QuestionType } from "@typings/deck";

const questionTypeOptions: SelectOption<string>[] = [
  {
    label: "Multiple Choice",
    value: QuestionType.MultiChoice,
  },
  {
    label: "Binary",
    value: QuestionType.Binary,
  },
  {
    label: "Fill In The Blank",
    value: QuestionType.FillBlank,
  },
  {
    label: "Short Answer",
    value: QuestionType.ShortAnswer,
  },
  {
    label: "Long Answer",
    value: QuestionType.LongAnswer,
  },
  {
    label: "Match",
    value: QuestionType.Match,
  },
  {
    label: "Sequence",
    value: QuestionType.Sequence,
  },
  {
    label: "Word Drag",
    value: QuestionType.WordDrag,
  },
  {
    label: "Dropdown",
    value: QuestionType.Dropdown,
  },
  {
    label: "Numeric",
    value: QuestionType.Numeric,
  },
  {
    label: "Hotspot",
    value: QuestionType.Hotspot,
  },
  {
    label: "Code",
    value: QuestionType.Code,
  },
  {
    label: "Math",
    value: QuestionType.Math,
  },
  {
    label: "Geolocation",
    value: QuestionType.Geolocation,
  },
];

interface Answer {
  content: JSONContent;
  correct: boolean;
}

interface NewQuestionForm {
  questionType: QuestionType;
  title: string;
  content: JSONContent;
  layoutCols: number;
  singleAnswer: boolean;
  answers: Answer[];
}

interface AnswerProps {
  control: Control<NewQuestionForm>;
  index: number;
  remove: (index: number) => void;
}

const AnswerComponent = ({ control, index, remove }: AnswerProps) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const editor = useEditor(editorOptions({ limit: 2_000 }));

  return (
    <div
      className={`relative m-4 transition-all ${index !== 0 ? "border-t-2 border-border pt-2 " + (expanded ? "mt-8" : "") : ""}`}
    >
      <div className="flex justify-between">
        <div className="flex">
          <button
            type="button"
            className="p-2 rounded-lg transition text-fg-tertiary hover:text-fg active:text-fg hover:bg-secondary-hover active:bg-secondary-active"
            onClick={() => setExpanded(!expanded)}
          >
            <HiChevronDown
              className={`h-5 w-5 transition duration-300 ${expanded ? "rotate-180" : ""}`}
            />
          </button>
          <p className="ml-2 py-1.5 px-2 h-8 text-fg-secondary font-semibold">
            Answer: {index + 1}
          </p>
        </div>

        <div className="group relative p-2 rounded-lg transition text-fg-tertiary hover:text-fg active:text-fg hover:bg-secondary-hover active:bg-secondary-active">
          <BsThreeDotsVertical className="h-5 w-5" />

          <div className="text-left text-sm absolute z-10 top-0 right-0 p-1 rounded-lg border-2 border-border bg-bg-modal w-40 invisible opacity-0 scale-90 origin-top-right transition-[visibility,opacity,transform] group-focus:visible group-focus:opacity-100 group-focus:scale-100 text-fg">
            <button
              type="button"
              className="block w-full text-left py-1 px-3 rounded-md text-sm font-semibold transition hover:bg-secondary active:bg-secondary-hover"
              onClick={() => remove(index)}
            >
              Button
            </button>
            <button
              type="button"
              className="block w-full text-left py-1 px-3 rounded-md text-sm font-semibold transition hover:bg-secondary active:bg-secondary-hover"
              onClick={() => remove(index)}
            >
              Duplicate
            </button>
            <button
              type="button"
              className="block w-full text-left py-1 px-3 rounded-md text-sm font-semibold transition text-danger hover:text-danger-fg active:text-danger-fg hover:bg-danger active:bg-danger-hover"
              onClick={() => remove(index)}
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <div
        className={`relative overflow-hidden transition-all duration-500 grid ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden min-h-0 transition-all duration-500">
          <div className="mt-2">
            <Controller
              name={`answers.${index}.content`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <Editor editor={editor} value={value} onChange={onChange} />
              )}
            />
          </div>
          <div className="mt-2">
            <Controller
              name={`answers.${index}.correct`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <SwitchBox
                  title="Correct Answer"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function NewQuestion() {
  const [deckName, setDeckName] = useState<string | undefined>();
  const editor = useEditor(editorOptions({ limit: 10_000 }));

  const router = useRouter();
  const dispatch = useDispatch();
  const params = useSearchParams();
  const deckId = params.get("deck_id");

  const { register, handleSubmit, control } = useForm<NewQuestionForm>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers",
  });

  useEffect(() => {
    if (deckId) {
      invoke<string>("get_deck_name", { id: parseInt(deckId) })
        .then(setDeckName)
        .catch(console.error);
    }
  }, [deckId]);

  const onSubmit: SubmitHandler<NewQuestionForm> = async (data) => {
    if (!deckId) {
      return dispatch(
        addToast({
          title: "No Deck ID",
          type: ToastType.Error,
          description: "Deck ID not provided.",
        }),
      );
    }

    if (fields.length < 2) {
      return dispatch(
        addToast({
          title: "Incomplete Question",
          type: ToastType.Error,
          description: "At least 2 answers are required.",
        }),
      );
    }

    if (data.answers.filter((a) => a.correct).length < 1) {
      return dispatch(
        addToast({
          title: "No Correct Answer",
          type: ToastType.Error,
          description: "At least one correct answer must be selected.",
        }),
      );
    }

    if (data.singleAnswer && data.answers.filter((a) => a.correct).length > 1) {
      return dispatch(
        addToast({
          title: "Multiple Correct Answers",
          type: ToastType.Error,
          description:
            'Single answer is set to "Yes". Change it to "No" to allow multiple correct answers.',
        }),
      );
    }

    if (
      !data.singleAnswer &&
      data.answers.filter((a) => a.correct).length < 2
    ) {
      return dispatch(
        addToast({
          title: "Single Correct Answer",
          type: ToastType.Error,
          description:
            'Single answer is set to "No". Change it to "Yes" to just have one correct answer',
        }),
      );
    }

    invoke("new_multi_choice_question", {
      question: {
        deck_id: parseInt(deckId),
        question_type: data.questionType,
        title: data.title,
        content: JSON.stringify(data.content),
      },
      multi_choice_question: {
        layout_cols: data.layoutCols,
        single_answer: data.singleAnswer,
        answers: data.answers.map((a) => ({
          content: JSON.stringify(a.content),
          correct: a.correct,
        })),
      },
    })
      .then(() => {
        router.push(`/decks?id=${deckId}`);
        dispatch(
          addToast({
            title: "Successfully Created Question",
            type: ToastType.Success,
            description: `Title: ${data.title}`,
          }),
        );
      })
      .catch((e) => {
        dispatch(
          addToast({
            title: "Failed to Create Question",
            type: ToastType.Error,
            description: String(e),
          }),
        );
        console.error(e);
      });
  };

  return (
    <main className="max-w-3xl mx-auto my-5 p-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        {deckName && (
          <p className="font-bold text-fg-tertiary">Deck: {deckName}</p>
        )}

        <div className="mt-5">
          <p className="font-bold uppercase text-fg-tertiary">Question Type:</p>
          <div className="mt-2">
            <Controller
              name="questionType"
              control={control}
              defaultValue={QuestionType.MultiChoice}
              render={({ field: { onChange, value } }) => (
                <Select
                  options={questionTypeOptions}
                  value={value}
                  onChange={onChange}
                  disabled
                />
              )}
            />
          </div>
        </div>

        <div className="mt-5 flex">
          <div className="w-1/2 pr-2">
            <p className="font-bold uppercase text-fg-tertiary">
              Layout Columns:
            </p>
            <div className="mt-2">
              <Controller
                name="layoutCols"
                control={control}
                defaultValue={1}
                render={({ field: { onChange, value } }) => (
                  <Select
                    options={[
                      {
                        label: "1",
                        value: 1,
                      },
                      {
                        label: "2",
                        value: 2,
                      },
                      {
                        label: "3",
                        value: 3,
                      },
                      {
                        label: "4",
                        value: 4,
                      },
                    ]}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </div>
          </div>

          <div className="w-1/2 pl-2">
            <p className="font-bold uppercase text-fg-tertiary">
              Single Answer:
            </p>
            <div className="mt-2">
              <Controller
                name="singleAnswer"
                control={control}
                defaultValue={true}
                render={({ field: { onChange, value } }) => (
                  <Select
                    options={[
                      {
                        label: "Yes (one answer only)",
                        value: true,
                      },
                      {
                        label: "No (multiple correct answers)",
                        value: false,
                      },
                    ]}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <p className="font-bold uppercase text-fg-tertiary">Title:</p>
          <textarea
            rows={3}
            maxLength={500}
            className="mt-1 py-3 px-4 rounded-lg bg-input focus:bg-input-focus border-2 border-border hover:border-border-hover focus:border-border-focus font-semibold text-2xl w-full resize-none"
            {...register("title", {
              required: true,
              minLength: 3,
              maxLength: 500,
            })}
          ></textarea>
        </div>

        <div className="mt-5">
          <p className="font-bold uppercase text-fg-tertiary mb-1">Content:</p>
          <Controller
            name="content"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Editor editor={editor} value={value} onChange={onChange} />
            )}
          />
        </div>

        <div className="my-5">
          <p className="font-bold uppercase text-fg-tertiary mb-1">Answers:</p>
          <div className="border-2 border-border rounded-lg">
            <div>
              {fields.length > 0 ? (
                fields.map((item, index) => (
                  <AnswerComponent
                    key={item.id}
                    control={control}
                    index={index}
                    remove={remove}
                  />
                ))
              ) : (
                <p className="m-5 text-fg-secondary font-semibold text-center">
                  No answered added.
                </p>
              )}
            </div>
            <div className="p-2 border-t-2 border-border">
              <Button
                label="Add Answer"
                onClick={() => {
                  append({
                    content: { type: "doc", content: [] },
                    correct: false,
                  });
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t-2 border-border flex">
          <Link href={`/decks?id=${deckId}`}>
            <Button label="Cancel" variant="danger" />
          </Link>
          <Button
            label="Create Question"
            variant="success"
            type="submit"
            className="ml-2"
          />
        </div>
      </form>
    </main>
  );
}
