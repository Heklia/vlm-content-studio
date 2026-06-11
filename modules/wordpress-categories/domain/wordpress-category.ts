export type WordPressCategory = {
  id: string;
  slug: string;
  label: string;
  wordpressId: number | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

