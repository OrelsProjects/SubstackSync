import { JsonBody } from "@/types/json-body";

export interface Update {
  id: string;
  title: string;
  summary: string;
  summaryTitle: string;
  mediaUrl: string;
  date: Date;
  body: JsonBody;
}
