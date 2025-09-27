import { NodeType, TextType } from "@tiptap/react";

type DocumentType<
  TDocAttributes extends Record<string, any> | undefined = Record<string, any>,
  TContentType extends NodeType[] = NodeType[]
> = Omit<
  NodeType<"doc", TDocAttributes, never, TContentType>,
  "marks" | "content"
> & {
  content: TContentType;
};

export type JsonBody = DocumentType<
  Record<string, any> | undefined,
  NodeType<
    string,
    undefined | Record<string, any>,
    any,
    (NodeType | TextType)[]
  >[]
>;
