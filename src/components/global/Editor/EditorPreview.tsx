"use client";

import React, { useEffect } from "react";
import {
  Editor as EditorType,
  EditorContent,
  UseEditorOptions,
} from "@tiptap/react";

import BlockQuote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Color from "@tiptap/extension-color";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import EditorLink from "./EditorLink";
import HardBreak from "@tiptap/extension-hard-break";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import History from "@tiptap/extension-history";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import ImageExtension from "@tiptap/extension-image";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
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

import "./content.css";

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
  // EditorLink.configure({
  //   openOnClick: true,
  //   defaultProtocol: "https",
  // }),
  ListItem,
  Link,
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

export const previewEditorOptions: UseEditorOptions = {
  extensions,
  editable: false,
  immediatelyRender: false,
  shouldRerenderOnTransaction: false,
};

interface EditorProps {
  editor: EditorType | null;
  value: string;
}

const EditorPreview = ({ editor, value }: EditorProps) => {
  useEffect(() => {
    if (editor) {
      editor.commands.setContent(JSON.parse(value));
    }
  }, [editor, value]);

  return editor && <EditorContent editor={editor} />;
};

export default EditorPreview;
