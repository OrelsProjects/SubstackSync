"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Image as ImageIcon,
  Link as LinkIcon,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadContentJsonBody, textEditorOptions } from "@/utils/text-editor";
import { MAX_ATTACHMENTS, MAX_FILE_SIZE } from "@/constants/consts";
import { JsonBody } from "@/types/json-body";

interface RichTextEditorProps {
  content: JsonBody | null;
  onChange: (content: JsonBody) => void;
  placeholder?: string;
  onImageUpload?: (file: File) => Promise<string>; // returns public URL
  maxChars?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  onImageUpload,
  maxChars,
}) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor(textEditorOptions(onChange, false));

  useEffect(() => {
    if (editor && content) {
      loadContentJsonBody(content, editor);
    }
  }, [editor, content]);
  
  // Count current image nodes inside the doc
  const imageCount = useMemo(() => {
    if (!editor) return 0;
    let count = 0;
    editor.state.doc.descendants((node: any) => {
      if (node.type?.name === "image") count += 1;
    });
    return count;
  }, [editor, content]); // content changes fire this too

  const canUploadImages = imageCount < MAX_ATTACHMENTS;

  const validateFileSize = (files: File[]) => {
    const oversized = files.filter((f) => f.size > MAX_FILE_SIZE);
    if (oversized.length > 0) {
      alert(
        `Image must be under ${Math.floor(MAX_FILE_SIZE / (1024 * 1024))}MB`
      );
      return false;
    }
    return true;
  };

  // const insertImageByUrl = (url: string) => {
  //   editor?.chain().focus().setImage({ src: url }).run();
  // };

  // Core handler: drop/paste/pick -> validate -> upload/insert
  const handleImages = useCallback(
    async (files: File[]) => {
      if (!editor || files.length === 0) return;

      const imageFiles = files.filter((f) => f.type.startsWith("image/"));
      if (imageFiles.length === 0) return;

      if (!validateFileSize(imageFiles)) return;

      const remainingSlots = MAX_ATTACHMENTS - imageCount;
      if (remainingSlots <= 0) {
        alert(`Only ${MAX_ATTACHMENTS} images allowed`);
        return;
      }

      const toProcess = imageFiles.slice(0, remainingSlots);

      try {
        setUploadingCount((c) => c + toProcess.length);

        // sequential is fine; preserves order and avoids hammering your uploader
        for (const file of toProcess) {
          try {
            if (onImageUpload) {
              await onImageUpload(file);
              // insertImageByUrl(url);
            } else {
              // no uploader provided: insert temporary object URL
              // const temp = URL.createObjectURL(file);
              // insertImageByUrl(temp);
            }
          } catch (err) {
            console.error("Failed to upload image:", err);
            alert("Failed to upload image");
          }
        }
      } finally {
        setUploadingCount((c) => Math.max(0, c - toProcess.length));
      }
    },
    [editor, onImageUpload, imageCount]
  );

  // Paste images from clipboard
  useEffect(() => {
    if (!editor) return;
    const dom = editor.view.dom as HTMLElement;

    const onPaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const files = Array.from(e.clipboardData.files || []);
      const imgFiles = files.filter((f) => f.type.startsWith("image/"));
      if (imgFiles.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        handleImages(imgFiles);
      }
    };

    dom.addEventListener("paste", onPaste);
    return () => dom.removeEventListener("paste", onPaste);
  }, [editor, handleImages]);

  // Drag-and-drop overlay and handler
  const onDragEnter = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer?.types.includes("Files")) {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(true);
    }
  }, []);

  const onDragOver = useCallback(
    (e: React.DragEvent) => {
      if (isDraggingOver) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [isDraggingOver]
  );

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // only hide if leaving the wrapper, not moving inside children
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDraggingOver(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);
      const files = Array.from(e.dataTransfer?.files || []);
      handleImages(files);
    },
    [handleImages]
  );

  // Toolbar actions
  const openFilePicker = useCallback(() => {
    if (!canUploadImages) {
      alert(`Only ${MAX_ATTACHMENTS} images allowed`);
      return;
    }
    fileInputRef.current?.click();
  }, [canUploadImages]);

  const addLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  if (!editor) {
    return <div className="h-48 bg-muted animate-pulse rounded-md" />;
  }

  return (
    <div
      className="border rounded-md relative"
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-muted" : ""}
        >
          <Bold className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-muted" : ""}
        >
          <Italic className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""}
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""}
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={editor.isActive("heading", { level: 3 }) ? "bg-muted" : ""}
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-muted" : ""}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-muted" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "bg-muted" : ""}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={openFilePicker}
          title={
            canUploadImages
              ? "Add image"
              : `Only ${MAX_ATTACHMENTS} images allowed`
          }
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            if (files.length) handleImages(files);
            e.currentTarget.value = "";
          }}
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLink}
          className={editor.isActive("link") ? "bg-muted" : ""}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="min-h-[200px] px-2 pt-1 pb-4" />

      {/* Drag overlay */}
      {isDraggingOver && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md border-2 border-dashed border-primary/50 bg-background/80 backdrop-blur-sm">
          <div className="text-sm">Drop images to upload</div>
        </div>
      )}

      {/* Simple uploading skeletons */}
      {uploadingCount > 0 && (
        <div className="p-2 flex gap-2 flex-wrap">
          {Array.from({ length: uploadingCount }).map((_, i) => (
            <div
              key={i}
              className="w-[120px] h-[68px] rounded-md bg-muted animate-pulse"
            />
          ))}
        </div>
      )}
    </div>
  );
};
