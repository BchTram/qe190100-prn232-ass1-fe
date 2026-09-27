export type Tag = {
  tagId: number;
  tagName: string;
  color?: string | null;
};

export type TagCreateRequest = {
  tagName: string;
  color?: string | null;
};

export type TagUpdateRequest = TagCreateRequest;
