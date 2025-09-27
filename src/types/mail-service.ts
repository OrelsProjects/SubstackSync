type Tag = string | number;

export interface SubscriberName {
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

export interface AddSubscriberParams {
  email: string;
  name: SubscriberName | string;
  fields?: Record<string, string>;
  source?: string;
}

export interface AddTagParams {
  email: string;
  tag: Tag;
}

export interface AddTagToManyEmailsParams {
  emails: string[];
  tag: Tag;
}

export interface SendEmailParams {
  to: string | string[];
  from: string;
  subject: string;
  template: string;
  cc?: string[];
}

// Responses from Kit
export interface KitAddSubscriberResponse {
  subscriber: {
    id: number;
    first_name: string;
    email_address: string;
    state: string;
    created_at: string;
    fields: Record<string, string>;
  };
}