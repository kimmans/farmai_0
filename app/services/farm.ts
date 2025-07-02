import { supabase } from "../lib/supabase";
import type { Farm, CreateFarmInput, UpdateFarmInput } from "../+types/farm";

// 확장된 농장 데이터 인터페이스
interface ExtendedFarmData extends Farm {
  environmentData: {
    dayTemp: string;
    nightTemp: string;
    humidity: string;
    co2: string;
    light: string;
    externalTemp: string;
    weather: string;
  };
  irrigationData: {
    supplyEC: string;
    supplyPH: string;
    drainEC: string;
    drainPH: string;
    moisture: string;
    supplyAmount: string;
    drainAmount: string;
  };
  growthData: {
    stage: string;
    thinning: string;
  };
  pestControlData: {
    diseases: string;
    pests: string;
    affectedParts: string;
    severity: string;
    controlMethod: string;
    controlResult: string;
  };
  managementData: {
    production: string;
    sales: string;
    salesAmount: string;
    productionCost: string;
    netProfit: string;
  };
  interviewData: {
    content: string;
  };
}

export async function getFarms() {
  const { data, error } = await supabase
    .from("farms")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Farm[];
}

export async function getFarmById(id: string): Promise<ExtendedFarmData> {
  const { data, error } = await supabase
    .from("farms")
    .select("*")
    .eq("farm_id", id)
    .single();

  if (error) throw error;
  
  // 기본 농장 데이터에 실제 농장 데이터 추가
  const farm = data as Farm;
  
  // 실제 농장 데이터 (현재는 하드코딩, 추후 DB에서 불러오도록 수정)
  const extendedData: ExtendedFarmData = {
    ...farm,
    environmentData: {
      dayTemp: "25°C",
      nightTemp: "18°C",
      humidity: "65%",
      co2: "800 ppm",
      light: "15,000 lux",
      externalTemp: "22°C",
      weather: "맑음"
    },
    irrigationData: {
      supplyEC: "2.5 mS/cm",
      supplyPH: "6.2",
      drainEC: "2.8 mS/cm",
      drainPH: "6.4",
      moisture: "35%",
      supplyAmount: "2.5 L",
      drainAmount: "1.8 L"
    },
    growthData: {
      stage: "개화기",
      thinning: "상단 잎 2장 제거, 과실 솎음 작업 완료"
    },
    pestControlData: {
      diseases: "흰가루병",
      pests: "진딧물",
      affectedParts: "잎, 줄기",
      severity: "경미",
      controlMethod: "유기농 살충제 사용",
      controlResult: "방제 후 병해충 발생이 감소함"
    },
    managementData: {
      production: "1,200kg",
      sales: "1,000kg",
      salesAmount: "8,000,000원",
      productionCost: "3,500,000원",
      netProfit: "4,500,000원"
    },
    interviewData: {
      content: "작물 생육 상태가 양호하며, 특히 과실의 당도가 높아 고객 만족도가 높음. 스마트팜 시스템 도입으로 노동력 절감 및 생산성 향상. 내년도 시설 확장 계획 수립 중."
    }
  };
  
  return extendedData;
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