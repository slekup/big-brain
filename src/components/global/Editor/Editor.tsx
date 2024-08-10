"use client";

import React, { useEffect } from "react";
import {
  BubbleMenu,
  Editor as EditorType,
  EditorContent,
  UseEditorOptions,
  JSONContent,
} from "@tiptap/react";

import BlockQuote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import CharacterCount from "@tiptap/extension-character-count";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import { Color } from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import History from "@tiptap/extension-history";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import ImageExtension from "@tiptap/extension-image";
import Italic from "@tiptap/extension-italic";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";

import MenuBar from "./MenuBar";

import "./content.css";
import "./editor.css";

const extensions = [
  BlockQuote,
  Bold,
  BulletList,
  Code,
  CodeBlock,
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  Document,
  Dropcursor,
  HardBreak,
  Heading,
  Highlight,
  History,
  HorizontalRule,
  ImageExtension,
  Italic,
  Link.configure({
    defaultProtocol: "https",
  }),
  ListItem,
  OrderedList,
  Paragraph,
  Strike,
  Subscript,
  Superscript,
  Table,
  TableCell,
  TableHeader,
  TableRow,
  Text,
  TextAlign,
  TextStyle,
  Underline,
];

export const editorOptions = (opts?: { limit?: number }): UseEditorOptions => {
  return {
    extensions: [
      CharacterCount.configure({
        limit: opts?.limit ?? 2000,
      }),
      ...extensions,
    ],
    immediatelyRender: false,
    // shouldRerenderOnTransaction: false,
  };
};

interface EditorProps {
  editor: EditorType | null;
  value: JSONContent;
  onChange: (value: JSONContent) => void;
}

const Editor = ({ editor, value, onChange }: EditorProps) => {
  useEffect(() => {
    if (editor) {
      editor.on("update", () => {
        onChange(editor.getJSON());
      });
    }
  }, [editor, onChange]);

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  return (
    editor && (
      <div className="editor">
        <BubbleMenu
          className="bg-bg border-2 border-border rounded-lg shadow-lg grid grid-cols-3 p-1"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`py-1 px-2 rounded-md text-sm font-bold transition ${editor.isActive("bold") ? "bg-primary hover:bg-primary-hover active:bg-primary-active text-primary-fg" : "bg-bg hover:bg-bg-secondary active:bg-bg-tertiary"}`}
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`py-1 px-2 rounded-md text-sm font-bold transition ${editor.isActive("italic") ? "bg-primary hover:bg-primary-hover active:bg-primary-active text-primary-fg" : "bg-bg hover:bg-bg-secondary active:bg-bg-tertiary"}`}
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`py-1 px-2 rounded-md text-sm font-bold transition ${editor.isActive("strike") ? "bg-primary hover:bg-primary-hover active:bg-primary-active text-primary-fg" : "bg-bg hover:bg-bg-secondary active:bg-bg-tertiary"}`}
          >
            Strike
          </button>
        </BubbleMenu>

        <MenuBar editor={editor} />

        <EditorContent editor={editor} />
      </div>
    )
  );
};

export default Editor;
