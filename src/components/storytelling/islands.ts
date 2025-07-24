
export interface WineInfo {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number; // 0-5
  description?: string;
}

export interface IslandInfo {
  id: string;
  name: string;
  image: string; // Hero image or map thumb
  history: string;
  regionClassification?: string; // PDO, PGI, or none
  grapes?: string[]; // Key indigenous or cultivated varieties
  styles?: string[]; // Signature wine styles
  producers?: string[]; // Anchor estates for storytelling
  wines?: WineInfo[]; // Optional list of concrete wine products
}

// Removed the static ISLANDS array – islands are now served from the backend API.