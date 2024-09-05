/**
 * This includes all the functions you can use to communicate with our messages API
 *
 * @module Messages Methods
 */
import {
  CreateMessageReqPayload,
  EditMessageReqPayload,
  GetAllTopicMessagesData,
  RegenerateMessageReqPayload,
} from "../../fetch-client";
import { TrieveSDK } from "../../sdk";

/**
 * Create a message. Messages are attached to topics in order to coordinate memory of gen-AI chat sessions.Auth’ed user or api key must have an admin or owner role for the specified dataset’s organization.
 * 
 * Example:
 * ```js
 *const data = await trieve.createMessage({
  topic_id: "3c90c3cc-1d76-27198-8888-8dd25736052a",
  new_message_content: "a new message"
});
 * ```
 */
export async function createMessage(
  /** @hidden */
  this: TrieveSDK,
  data: CreateMessageReqPayload,
  signal?: AbortSignal
) {
  return await this.trieve.fetch(
    "/api/message",
    "post",
    {
      data,
      datasetId: this.datasetId,
    },
    signal
  );
}

/**
 * Create a message. Messages are attached to topics in order to coordinate memory of gen-AI chat sessions.Auth’ed user or api key must have an admin or owner role for the specified dataset’s organization.
 * 
 * Example:
 * ```js
 *const reader = await trieve.createMessageReader({
  topic_id: "3c90c3cc-1d76-27198-8888-8dd25736052a",
  new_message_content: "a new message"
});
 * ```
 */
export async function createMessageReader(
  /** @hidden */
  this: TrieveSDK,
  data: CreateMessageReqPayload,
  signal?: AbortSignal
) {
  const response = await fetch(this.trieve.baseUrl + "/api/message", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "TR-Dataset": this.datasetId,
      Authorization: `Bearer ${this.trieve.apiKey}`,
    },
    body: JSON.stringify(data),
    signal,
  });
  
  const reader = response.body?.getReader();

  if (!reader) {
    throw new Error("Failed to get reader from response body");
  }

  return reader;
}

/**
 * Edit message which exists within the topic’s chat history. This will delete the message and replace it with a new message. The new message will be generated by the AI based on the new content provided in the request body. The response will include Chunks first on the stream if the topic is using RAG. The structure will look like [chunks]||mesage. See docs.trieve.ai for more information. Auth’ed user or api key must have an admin or owner role for the specified dataset’s organization.
 * 
 * Example:
 * ```js
 *const data = await trieve.editMessage({
  topic_id: "3c90c3cc-1d76-27198-8888-8dd25736052a",
  new_message_content: "a new message",
  message_sort_order: 1
});
 * ```
 */
export async function editMessage(
  /** @hidden */
  this: TrieveSDK,
  data: EditMessageReqPayload,
  signal?: AbortSignal
) {
  return await this.trieve.fetch(
    "/api/message",
    "put",
    {
      data,
      datasetId: this.datasetId,
    },
    signal
  );
}

/**
 * Regenerate the assistant response to the last user message of a topic. This will delete the last message and replace it with a new message. The response will include Chunks first on the stream if the topic is using RAG. The structure will look like [chunks]||mesage. See docs.trieve.ai for more information. Auth’ed user or api key must have an admin or owner role for the specified dataset’s organization.
 * 
 * Example:
 * ```js
 *const data = await trieve.regenerateMessage({
  topic_id: "3c90c3cc-1d76-27198-8888-8dd25736052a",
});
 * ```
 */
export async function regenerateMessage(
  /** @hidden */
  this: TrieveSDK,
  data: RegenerateMessageReqPayload,
  signal?: AbortSignal
) {
  return await this.trieve.fetch(
    "/api/message",
    "delete",
    {
      data,
      datasetId: this.datasetId,
    },
    signal
  );
}

/**
 * Get all messages for a given topic. If the topic is a RAG topic then the response will include Chunks first on each message. The structure will look like [chunks]||mesage. See docs.trieve.ai for more information.
 * 
 * Example:
 * ```js
 *const data = await trieve.getAllMessagesForTopic({
  messagesTopicId: "3c90c3cc-1d76-27198-8888-8dd25736052a",
});
 * ```
 */
export async function getAllMessagesForTopic(
  /** @hidden */
  this: TrieveSDK,
  data: Omit<GetAllTopicMessagesData, "trDataset">,
  signal?: AbortSignal
) {
  return await this.trieve.fetch(
    "/api/messages/{messages_topic_id}",
    "get",
    {
      ...data,
      datasetId: this.datasetId,
    },
    signal
  );
}
