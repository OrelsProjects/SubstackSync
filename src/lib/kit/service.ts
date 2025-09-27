import loggerServer from "@/app/loggerServer";
import {
  AddSubscriberParams,
  AddTagParams,
  KitAddSubscriberResponse,
} from "@/types/mail-service";

export class KitService {
  private baseUrl = "https://api.kit.com/v4";
  private headers: Record<string, string>;

  constructor(apiKey: string) {
    this.headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Kit-Api-Key": apiKey,
    };
  }

  async addSubscriber({
    email,
    name,
    source = "SubstackSync",
    fields = {},
  }: AddSubscriberParams) {
    try {
      // Here you would implement your provider-specific logic
      // For example with fetch:

      loggerServer.info(`Adding subscriber: ${email}, source: ${source}`);

      let firstName = "";
      let lastName = "";
      let fullName = "";
      if (typeof name === "string") {
        firstName = name.split(" ")[0];
        lastName = name.split(" ")[name.split(" ").length - 1];
        fullName = name;
      } else {
        firstName = name.firstName || "";
        lastName = name.lastName || "";
        fullName = name.fullName || "";
      }

      const response = await fetch(`${this.baseUrl}/subscribers`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          email_address: email,
          first_name: firstName,
          state: "active",
          fields: {
            last_name: lastName,
            full_name: fullName,
            ...fields,
          },
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(
          `Failed to add subscriber: ${response.statusText}, ${response.status}, ${responseText}`
        );
      }

      const data = (await response.json()) as KitAddSubscriberResponse;
      loggerServer.info(`Subscriber added: ${email}`);
      return data.subscriber;
    } catch (error: any) {
      loggerServer.error(`Error adding subscriber: ${error.message}`);
      return null;
    }
  }

  async addTagToEmail({ email, tag }: AddTagParams) {
    try {
      const tagId = tag;
      const inputBody = {
        email_address: email,
      };

      // Provider-specific implementation
      const response = await fetch(
        `${this.baseUrl}/tags/${tagId}/subscribers`,
        {
          method: "POST",
          headers: this.headers,
          body: JSON.stringify(inputBody),
        }
      );

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(
          `Failed to add tag: ${response.statusText}, ${responseText}`
        );
      }

      const data = await response.json();
      loggerServer.info(`Tag added to email: ${email}, tag: ${tag}`);
      return data;
    } catch (error: any) {
      loggerServer.error(`Error adding tag to email: ${error.message}`);
      return null;
    }
  }
  // exactly the same as addTagToEmail, but DELETE
  async removeTagFromEmail({ email, tag }: AddTagParams) {
    try {
      const tagId = tag;
      const response = await fetch(
        `${this.baseUrl}/tags/${tagId}/subscribers`,
        {
          method: "DELETE",
          headers: {
            ...this.headers,
            Accept: "",
          },
        }
      );

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(
          `Failed to remove tag: ${response.statusText}, ${responseText}`
        );
      }

      const data = await response.json();
      loggerServer.info(`Tag removed from email: ${email}, tag: ${tag}`);
      return data;
    } catch (error: any) {
      loggerServer.error(`Error removing tag from email: ${error.message}`);
      return null;
    }
  }

  async fetchTags() {
    try {
      loggerServer.info("Fetching tags from Kit");
      
      const response = await fetch(`${this.baseUrl}/tags`, {
        method: "GET",
        headers: this.headers,
      });

      if (!response.ok) {
        const responseText = await response.text();
        throw new Error(
          `Failed to fetch tags: ${response.statusText}, ${response.status}, ${responseText}`
        );
      }

      const data = await response.json();
      loggerServer.info(`Fetched ${data.tags?.length || 0} tags from Kit`);
      
      // Kit returns tags in { tags: [ { id, name, created_at } ] } format
      return data.tags || [];
    } catch (error: any) {
      loggerServer.error(`Error fetching tags: ${error.message}`);
      throw error;
    }
  }
}
