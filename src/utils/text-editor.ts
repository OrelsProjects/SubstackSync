import { marked } from "marked";
import TurndownService from "turndown";

import { Editor, Extension, UseEditorOptions } from "@tiptap/react";
import { InputRule } from "@tiptap/core";

import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Heading from "@tiptap/extension-heading";
import CodeBlock from "@tiptap/extension-code-block";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { cn } from "@/lib/utils";
import Blockquote from "@tiptap/extension-blockquote";
import { Plugin, PluginKey } from "prosemirror-state";
import { DecorationSet } from "prosemirror-view";
import { JsonBody } from "@/types/json-body";

// Convert HTML → Markdown properly
export const unformatText = (html: string): string => {
  if (!html) return "";

  // Clean up any potential double spaces or unnecessary newlines
  const cleanHtml = html.replace(/\s+/g, " ").replace(/>\s+</g, "><").trim();

  return turndownService.turndown(cleanHtml);
};

export const formatText = (text: string): string => {
  if (text === "") return "";

  marked.setOptions({
    gfm: true,
    breaks: false,
  });
  text = text.replace(/\\n\\n/g, "\n\n");
  text = text.replace(/<br\s*\/?>/g, "</p><p>");

  // Handle mentions: convert special markdown format back to HTML
  // Format: [[mention|[id]|[label]|[mentionType]|[url]|[text]]]
  // Use double square brackets with pipe delimiters - safe and unlikely to conflict
  text = text.replace(
    /\[\[mention\|([^|]*)\|([^|]*)\|([^|]*)\|([^|]*)\|([^\]]*)\]\]/g,
    (match, id, label, mentionType, url, displayText) => {
      // Create the mention span with all required data attributes
      const urlAttr = url && url !== "" ? ` data-url="${url}"` : "";
      // Use just the label with @ prefix for display
      const finalDisplayText = `@${label}`;
      return `<span data-type="substack_mention" data-id="${id}" data-label="${label}" data-mention-type="${mentionType}"${urlAttr} class="mention font-medium text-primary hover:underline hover:cursor-pointer" contenteditable="false">${finalDisplayText}</span>`;
    }
  );

  // Handle custom image dimensions before passing to marked
  text = text.replace(
    /!\[(.*?)\]\((.*?)\){width=(\d+)}/g,
    (_, alt, src, width) => `<img src="${src}" alt="${alt}" width="${width}" />`
  );

  return marked(text) as string;
};

export const formatSpecialFormats = (text: string): string => {
  if (text === "") return "";
  const regexPullquote =
    /(?:<p>)?:::pullquote[A-Za-z]*?\s*([\s\S]*?)\s*:::(?:<\/p>)?/g;
  const regexBlockquote =
    /(?:<p>)?:::blockquote[A-Za-z]*?\s*([\s\S]*?)\s*:::(?:<\/p>)?/g;

  const quotes: { type: string; content: string }[] = [];

  // Extract pullquotes with better whitespace handling
  text = text.replace(regexPullquote, (match, content, offset, string) => {
    quotes.push({ type: "pullquote", content: content.trim() });
    // Check if we need to preserve a newline
    const needsNewline = string[offset + match.length] === "\n" ? "\n" : "";
    return `###PULLQUOTE${quotes.length - 1}###${needsNewline}`;
  });

  // Extract blockquotes with better whitespace handling
  text = text.replace(regexBlockquote, (match, content, offset, string) => {
    quotes.push({ type: "blockquote", content: content.trim() });
    // Check if we need to preserve a newline
    const needsNewline = string[offset + match.length] === "\n" ? "\n" : "";
    return `###BLOCKQUOTE${quotes.length - 1}###${needsNewline}`;
  });

  // Replace quote placeholders with formatted HTML, preserving only necessary whitespace
  quotes.forEach((quote, index) => {
    const formattedContent = formatText(quote.content);
    if (quote.type === "pullquote") {
      text = text.replace(
        `###PULLQUOTE${index}###`,
        `<div class="pullquote">${formattedContent}</div>`
      );
    } else {
      text = text.replace(
        `###BLOCKQUOTE${index}###`,
        `<blockquote>${formattedContent}</blockquote>`
      );
    }
  });

  // Clean up any potential double newlines
  return text.replace(/\n{3,}/g, "\n\n");
};

const turndownService = new TurndownService({
  headingStyle: "atx", // Converts headings into `#`, `##`, etc.
  codeBlockStyle: "fenced", // Ensures code blocks use triple backticks
  strongDelimiter: "**",
  emDelimiter: "*",
  bulletListMarker: "*",
});

// Custom rules for improved Markdown output
turndownService.addRule("heading", {
  filter: ["h1", "h2", "h3", "h4", "h5", "h6"],
  replacement: function (content: any, node: { nodeName: string }) {
    const level = Number(node.nodeName.charAt(1));
    return `\n${"#".repeat(level)} ${content}\n`;
  },
});

// Add this to where turndownService is configured
turndownService.addRule("images", {
  filter: "img",
  replacement: function (content: any, node: any) {
    const alt = node.getAttribute("alt") || "";
    const src = node.getAttribute("src") || "";
    const width = node.getAttribute("width") || "";
    // Include width and height in the markdown if they exist
    const dimensions = width ? `{width=${width}}` : "";
    return `![${alt}](${src})${dimensions}`;
  },
});

// Add custom rules for quotes
turndownService.addRule("blockquote", {
  filter: "blockquote",
  replacement: function (content: string, node: any) {
    // Clean up newlines and spaces while preserving content structure
    const cleanContent = content.replace(/\n+/g, "\n").trim();
    return `:::blockquote${cleanContent}:::`;
  },
});

turndownService.addRule("pullquote", {
  filter: (node: {
    nodeName: string;
    classList: { contains: (arg0: string) => any };
  }) => node.nodeName === "DIV" && node.classList.contains("pullquote"),
  replacement: function (content: string, node: any) {
    // Clean up newlines and spaces while preserving content structure
    const cleanContent = content.replace(/\n+/g, "\n").trim();
    return `:::pullquote${cleanContent}:::`;
  },
});

// Add custom rule for mentions
// Converts mention spans to special markdown format: [[mention|[id]|[label]|[mentionType]|[url]|[text]]]
turndownService.addRule("mention", {
  filter: (node: HTMLElement): boolean =>
    node.nodeName === "SPAN" &&
    (node.getAttribute("data-type") === "substack_mention" ||
      node.classList?.contains("mention")),
  replacement: function (content: any, node: any) {
    const id = node.getAttribute("data-id") || "";
    const label = node.getAttribute("data-label") || "";
    const mentionType = node.getAttribute("data-mention-type") || "user";
    const url = node.getAttribute("data-url") || "";
    const text = content || label || "";

    // Create the special markdown format for mentions using double square brackets and pipe delimiters
    // Format: [[mention|[id]|[label]|[mentionType]|[url]|[text]]]
    return `[[mention|${id}|${label}|${mentionType}|${url}|${text}]]`;
  },
});

// A custom extension to map Enter key inside code blocks.
const CustomKeymap = Extension.create({
  name: "customKeymap",
  addKeyboardShortcuts() {
    return {
      Enter: () => this.editor.commands.newlineInCode(),
    };
  },
});

// Add custom blockquote with styling
const CustomBlockquote = Blockquote.extend({
  parseHTML() {
    return [{ tag: "blockquote" }];
  },
  renderHTML() {
    return ["blockquote", { class: "blockquote" }, 0];
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        appendTransaction: (transactions, oldState, newState) => {
          // Prevent empty paragraph insertion before blockquotes
          return null;
        },
      }),
    ];
  },
});

export const skeletonPluginKey = new PluginKey("skeletonPlugin");

// 2) Create the plugin that holds a DecorationSet
const SkeletonPlugin = Extension.create({
  name: "skeleton",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: skeletonPluginKey,

        state: {
          init() {
            return DecorationSet.empty;
          },
          apply(tr, oldDecoSet) {
            let decoSet = oldDecoSet.map(tr.mapping, tr.doc);
            const meta = tr.getMeta(skeletonPluginKey);
            if (meta && meta.add) {
              decoSet = decoSet.add(tr.doc, meta.add);
            }
            return decoSet;
          },
        },

        props: {
          decorations(state) {
            return this.getState(state);
          },
        },
      }),
    ];
  },
});

export const CustomTextRules = Extension.create({
  name: "customTextRules",

  addInputRules() {
    // Trigger on `->`
    const arrowRule = new InputRule({
      find: /->$/,
      handler: ({ state, match, range }) => {
        if (match[0]) {
          state.tr.insertText("→", range.from, range.to);
        }
      },
    });

    const emDashRule = new InputRule({
      find: /--$/,
      handler: ({ state, match, range }) => {
        if (match[0]) {
          state.tr.insertText("—", range.from, range.to);
        }
      },
    });

    const replaceBrRule = new InputRule({
      find: /<br\s*\/?>/g,
      handler: ({ state, match, range }) => {
        if (match[0]) {
          state.tr.insertText("</p><p>", range.from, range.to);
        }
      },
    });

    return [arrowRule, emDashRule, replaceBrRule];
  },
});

const CustomHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    switch (node.attrs.level) {
      case 1:
        return [
          "h1",
          {
            ...HTMLAttributes,
            class:
              "text-text-editor-h1 mt-[1em] mb-[0.625em] font-bold !font-sans",
          },
          0,
        ];
      case 2:
        return [
          "h2",
          {
            ...HTMLAttributes,
            class:
              "text-text-editor-h2 mt-[1em] mb-[0.625em] font-bold !font-sans",
          },
          0,
        ];
      case 3:
        return [
          "h3",
          {
            ...HTMLAttributes,
            class:
              "text-text-editor-h3 mt-[1em] mb-[0.625em] font-bold !font-sans",
          },
          0,
        ];
      case 4:
        return [
          "h4",
          {
            ...HTMLAttributes,
            class:
              "text-text-editor-h4 mt-[1em] mb-[0.625em] font-bold !font-sans",
          },
          0,
        ];
      case 5:
        return [
          "h5",
          {
            ...HTMLAttributes,
            class: "text-text-editor-h5 mt-[1em] mb-[0.625em] font-bold",
          },
          0,
        ];
      case 6:
        return [
          "h6",
          {
            ...HTMLAttributes,
            class: "text-text-editor-h6 mt-[1em] mb-[0.625em] font-bold",
          },
          0,
        ];
      default:
        return ["h" + node.attrs.level, HTMLAttributes, 0];
    }
  },
});

export const textEditorOptions = (
  onChange?: (json: JsonBody) => void,
  disabled?: boolean
): UseEditorOptions => ({
  onUpdate: ({ editor }) => {
    const json = editor.getJSON();
    onChange?.(json);
  },
  immediatelyRender: false,
  editable: !disabled,
  extensions: [
    StarterKit.configure({
      paragraph: {
        HTMLAttributes: { class: cn("mb-5 leading-8") },
      },
    }),
    Document,
    Paragraph.configure({
      HTMLAttributes: { class: cn("mb-5 leading-8") },
    }),
    Text,
    BulletList,
    ListItem,
    CustomHeading,
    CustomKeymap,
    CustomHeading.configure({
      levels: [1, 2, 3, 4, 5, 6],
    }),
    Link,
    CodeBlock,

    Placeholder.configure({
      placeholder: "Start writing...",
    }),
    CustomBlockquote,
  ],
  content: "",
  editorProps: {
    attributes: {
      id: "text-editor-tiptap",
      class: "prose prose-lg mx-auto focus:outline-none h-full text-xl",
    },
    handleDrop: (view, event, slice, moved) => {
      if (moved || !event.dataTransfer) return false;
      // Let the default handler deal with it
      return false;
    },
  },
});

export const loadContent = (markdownContent: string, editor: Editor | null) => {
  let formattedContent = formatText(markdownContent);
  let contentWithSpecialFormats = formatSpecialFormats(formattedContent);
  // Clean up empty paragraphs with trailing breaks before quotes
  let cleanedHtml = contentWithSpecialFormats.replace(
    /<br\s*class=["']ProseMirror-trailingBreak["']\s*\/?>/g,
    ""
  );

  editor?.commands.setContent(cleanedHtml);
};

export const loadContentJsonBody = (jsonBody: JsonBody, editor: Editor | null) => {
  editor?.commands.setContent(jsonBody);
};
