export type Lore = {
  id: string;
  name: string;
  type: string;
  image?: string;
};

export type Event = {
  id: string;
  loreId: string;
  title: string;
  description: string;
  characterIds: string[];
};

export type Character = {
  id: string;
  loreId: string;
  name: string;
  role?: string;
};
