import { supabase } from "../lib/supabase";
import type { Farm, CreateFarmInput, UpdateFarmInput } from "../+types/farm";

export async function getFarms() {
  const { data, error } = await supabase
    .from("farms")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Farm[];
}

export async function getFarmById(id: string) {
  const { data, error } = await supabase
    .from("farms")
    .select("*")
    .eq("farm_id", id)
    .single();

  if (error) throw error;
  return data as Farm;
}

export async function createFarm(input: CreateFarmInput) {
  const { data, error } = await supabase
    .from("farms")
    .insert([input])
    .select()
    .single();

  if (error) throw error;
  return data as Farm;
}

export async function updateFarm(input: UpdateFarmInput) {
  const { farm_id, ...updateData } = input;
  const { data, error } = await supabase
    .from("farms")
    .update(updateData)
    .eq("farm_id", farm_id)
    .select()
    .single();

  if (error) throw error;
  return data as Farm;
}

export async function deleteFarm(id: string) {
  const { error } = await supabase
    .from("farms")
    .delete()
    .eq("farm_id", id);

  if (error) throw error;
} 