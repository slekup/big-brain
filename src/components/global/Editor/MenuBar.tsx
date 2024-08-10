import React, { useState } from "react";
import { Editor } from "@tiptap/react";

import {
  BiBold,
  BiItalic,
  BiStrikethrough,
  BiParagraph,
  BiCodeBlock,
  BiSolidQuoteRight,
  BiCode,
} from "react-icons/bi";
import { ImRedo2, ImUndo2 } from "react-icons/im";
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
} from "react-icons/lu";
import {
  MdAddLink,
  MdFormatClear,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdHorizontalRule,
  MdLinkOff,
  MdOutlineDeleteSweep,
} from "react-icons/md";
import { VscNewline } from "react-icons/vsc";

import Tooltip from "../Tooltip/Tooltip";
import {
  TbColumnInsertLeft,
  TbColumnInsertRight,
  TbColumnRemove,
  TbRowInsertBottom,
  TbRowInsertTop,
  TbRowRemove,
  TbTableMinus,
  TbTablePlus,
} from "react-icons/tb";

const MenuBar = ({ editor }: { editor: Editor }) => {
  enum Tabs {
    Format,
    Actions,
    Table,
    Colors,
  }

  const [tab, setTab] = useState<Tabs>(Tabs.Format);
  if (!editor) {
    return null;
  }

  const defaultBtnStyle =
    "h-9 py-1 px-2 rounded-md m-0.5 text-sm font-semibold transition ";
  const activeBtnStyle =
    "text-primary-fg bg-primary hover:bg-primary-hover active:bg-primary-active";
  const inactiveBtnStyle =
    "text-secondary-fg bg-secondary hover:bg-secondary-hover active:bg-secondary-active";
  function getClass(active: boolean) {
    if (active) {
      return defaultBtnStyle + activeBtnStyle;
    } else {
      return defaultBtnStyle + inactiveBtnStyle;
    }
  }

  let colors: string[][] = [
    [
      "#000000",
      "#3E4143",
      "#656565",
      "#99999A",
      "#B6B6B7",
      "#CBCCCC",
      "#DADCDF",
      "#F1F1F1",
      "#f5f5f5",
      "#FFFFFF",
    ],
    [
      "#990000",
      "#FF0000",
      "#FF9900",
      "#FFFF01",
      "#00FF00",
      "#00FFFF",
      "#4A86E8",
      "#0000FF",
      "#9901FF",
      "#FF00FF",
    ],
  ];

  return (
    <div className="rounded-t-lg border-2 border-border">
      <div className="h-10 w-full flex bg-bg-secondary rounded-t-md">
        {(
          [
            ["Format", Tabs.Format],
            ["Actions", Tabs.Actions],
            ["Table", Tabs.Table],
            ["Colors", Tabs.Colors],
          ] as [string, Tabs][]
        ).map((t, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setTab(t[1])}
            className={`py-2 px-5 text-s font-semibold rounded-t-md bg-bg border-b-2 transition ${tab === t[1] ? "bg-bg border-bg" : "bg-bg-secondary hover:bg-secondary-hover active:bg-secondary-active border-border"}`}
          >
            {t[0]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap p-1">
        {tab === Tabs.Format && (
          <>
            <Tooltip offset={-5} text="Bold">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={getClass(editor.isActive("bold"))}
              >
                <BiBold className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Italic">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={getClass(editor.isActive("italic"))}
              >
                <BiItalic className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Strike Through">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={getClass(editor.isActive("strike"))}
              >
                <BiStrikethrough className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Code">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleCode().run()}
                disabled={!editor.can().chain().focus().toggleCode().run()}
                className={getClass(editor.isActive("code"))}
              >
                <BiCode className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Code Block">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={getClass(editor.isActive("codeBlock"))}
              >
                <BiCodeBlock className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Paragraph">
              <button
                type="button"
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={getClass(editor.isActive("paragraph"))}
              >
                <BiParagraph className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Bullet List">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={getClass(editor.isActive("bulletList"))}
              >
                <MdFormatListBulleted className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Numbered List">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={getClass(editor.isActive("orderedList"))}
              >
                <MdFormatListNumbered className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Block Quote">
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={getClass(editor.isActive("blockquote"))}
              >
                <BiSolidQuoteRight className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Horizontal Rule">
              <button
                type="button"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className={defaultBtnStyle + inactiveBtnStyle}
              >
                <MdHorizontalRule className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Heading 1">
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={getClass(editor.isActive("heading", { level: 1 }))}
              >
                <LuHeading1 className="h-5 w-5" />{" "}
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Heading 2">
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={getClass(editor.isActive("heading", { level: 2 }))}
              >
                <LuHeading2 className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Heading 3">
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={getClass(editor.isActive("heading", { level: 3 }))}
              >
                <LuHeading3 className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Heading 4">
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 4 }).run()
                }
                className={getClass(editor.isActive("heading", { level: 4 }))}
              >
                <LuHeading4 className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Heading 5">
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 5 }).run()
                }
                className={getClass(editor.isActive("heading", { level: 5 }))}
              >
                <LuHeading5 className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Heading 6">
              <button
                type="button"
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 6 }).run()
                }
                className={getClass(editor.isActive("heading", { level: 6 }))}
              >
                <LuHeading6 className="h-5 w-5" />
              </button>
            </Tooltip>
          </>
        )}

        {tab === Tabs.Actions && (
          <>
            <Tooltip offset={-5} text="Undo">
              <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className={defaultBtnStyle + inactiveBtnStyle}
              >
                <ImUndo2 className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Redo">
              <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className={defaultBtnStyle + inactiveBtnStyle}
              >
                <ImRedo2 className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Clear Formatting">
              <button
                type="button"
                onClick={() => editor.chain().focus().unsetAllMarks().run()}
                className={defaultBtnStyle + inactiveBtnStyle}
              >
                <MdFormatClear className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Clear Nodes">
              <button
                type="button"
                onClick={() => editor.chain().focus().clearNodes().run()}
                className={defaultBtnStyle + inactiveBtnStyle}
              >
                <MdOutlineDeleteSweep className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="New Line">
              <button
                type="button"
                onClick={() => editor.chain().focus().setHardBreak().run()}
                className={defaultBtnStyle + inactiveBtnStyle}
              >
                <VscNewline className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Set Link">
              <button
                type="button"
                onClick={() => {
                  const previousUrl = editor.getAttributes("link").href;
                  const url = window.prompt("URL", previousUrl);

                  if (url === null) {
                    return;
                  }

                  try {
                    new URL(url);
                  } catch {
                    return;
                  }

                  if (url === "") {
                    editor
                      .chain()
                      .focus()
                      .extendMarkRange("link")
                      .unsetLink()
                      .run();

                    return;
                  }

                  editor
                    .chain()
                    .focus()
                    .extendMarkRange("link")
                    .setLink({ href: url })
                    .run();
                }}
                className={defaultBtnStyle + inactiveBtnStyle}
              >
                <MdAddLink className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Unset Link">
              <button
                type="button"
                onClick={() => editor.chain().focus().unsetLink().run()}
                className={defaultBtnStyle + inactiveBtnStyle}
              >
                <MdLinkOff className="h-5 w-5" />
              </button>
            </Tooltip>
          </>
        )}

        {tab === Tabs.Table && (
          <>
            <Tooltip offset={-5} text="Insert Table">
              <button
                type="button"
                onClick={() => editor.chain().focus().insertTable().run()}
                className={defaultBtnStyle + inactiveBtnStyle}
              >
                <TbTablePlus className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Delete Table">
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteTable().run()}
                className={defaultBtnStyle + inactiveBtnStyle}
              >
                <TbTableMinus className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Insert Row Above">
              <button
                type="button"
                onClick={() => editor.chain().focus().addRowBefore().run()}
                className={defaultBtnStyle + inactiveBtnStyle}
              >
                <TbRowInsertTop className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Insert Row Below">
              <button
                type="button"
                onClick={() => editor.chain().focus().addRowAfter().run()}
                className={defaultBtnStyle + inactiveBtnStyle}
              >
                <TbRowInsertBottom className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Delete Row">
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteRow().run()}
                className={defaultBtnStyle + inactiveBtnStyle}
              >
                <TbRowRemove className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Insert Column to Left">
              <button
                type="button"
                onClick={() => editor.chain().focus().addColumnBefore().run()}
                className={defaultBtnStyle + inactiveBtnStyle}
              >
                <TbColumnInsertLeft className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Insert Column to Right">
              <button
                type="button"
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                className={defaultBtnStyle + inactiveBtnStyle}
              >
                <TbColumnInsertRight className="h-5 w-5" />
              </button>
            </Tooltip>

            <Tooltip offset={-5} text="Delete Column">
              <button
                type="button"
                onClick={() => editor.chain().focus().deleteColumn().run()}
                className={defaultBtnStyle + inactiveBtnStyle}
              >
                <TbColumnRemove className="h-5 w-5" />
              </button>
            </Tooltip>
          </>
        )}

        {tab === Tabs.Colors &&
          colors.map((row, index) => (
            <div key={index} className="flex flex-wrap">
              {row.map((c, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => editor.chain().focus().setColor(c).run()}
                  className={`px-1 h-7 my-1.5 ${getClass(
                    editor.isActive("textStyle", { color: c }),
                  )
                    .replace("h-9", "")
                    .replace("px-2", "")}`}
                >
                  <div
                    className="h-5 w-5 rounded-full"
                    style={{ background: c }}
                  ></div>
                </button>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};

export default MenuBar;
