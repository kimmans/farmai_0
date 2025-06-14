export interface Farm {
  farm_id: string;
  name: string;
  location: string;
  owner_name: string;
  size: number | null;
  crop: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateFarmInput {
  name: string;
  location: string;
  owner_name: string;
  size?: number;
  crop?: string;
}

export interface UpdateFarmInput extends Partial<CreateFarmInput> {
  farm_id: string;
} 