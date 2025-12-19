export type ChatMessage = {
  id: string;
  user: string;
  text: string;
  at: number;
  system?: boolean;
  room: string;
};

export type JoinAck = { ok: boolean; name: string; room: string };
