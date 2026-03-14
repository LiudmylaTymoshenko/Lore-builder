export type CreateSourcePayload = {
  title: string;
  type: string;
  canon: string;
};

export type CreateLorePayload = {
  name: string;
  type: string;
  tag: string;
  sources: CreateSourcePayload[];
  description?: string;
  imageUrl?: string | null;
};

export type UpdateLorePayload = Partial<CreateLorePayload>;
