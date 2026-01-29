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
  position: { x: number; y: number };
};

export type EventNodeType = {
  id: string;
  loreId: string;
  title: string;
  position: { x: number; y: number };
};

export type ConnectionType = {
  id: string;
  loreId: string;
  sourceId: string;
  targetId: string;
};

export type NodeData = {
  label: string;
  onDelete: (id: string) => void;
  onUpdate: (id: string, name: string) => void;
}
