export interface GenerationParams {
  age: string;
  skinTone: string;
  gender: string;
  prompt: string;
}

export interface Product {
  name: string;
  description: string;
  link: string;
  imageUrl: string;
}

export interface InstructionsData {
  products: Product[];
  instructions: string[];
}
