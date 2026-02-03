export type Lore = {
  id: string;
  name: string;
  type: string;
  description?: string;
  imageUrl?: string | null;
  createdAt: string;
};

export type CreateLorePayload = {
  name: string;
  type: string;
  description?: string;
  imageUrl?: string | null;
};

export type UpdateLorePayload = Partial<CreateLorePayload>;
