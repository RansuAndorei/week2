export interface FoodType {
  id: number;
  created_at: string;
  image: string;
  title: string;
  description: string;
  updated_at: string;
  is_public: boolean;
  rating: number;
  owner: string | UserType;
}

export interface UserType {
  id: string;
  created_at: string;
  name: string;
  email: string;
  username: string;
  image: string;
  is_signed_in: boolean;
}

export interface CompressorType {
  file: object;
}
