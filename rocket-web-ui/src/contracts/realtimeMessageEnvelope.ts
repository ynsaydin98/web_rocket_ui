export type RealtimeMessageEnvelope<TPayload = unknown> = {
  id: string;
  messageId: number;
  messageType: string;
  payload: TPayload;
};
