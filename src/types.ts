export type UnitType = 'kg' | 'p' | 'pack' | 'box' | 'bottle' | 'bag';

export type CategoryType = 'veg' | 'gen';

export type Language = 'th' | 'mm' | 'en';

export interface CatalogItem {
  id: string;
  category: CategoryType;
  th: string;
  mm: string;
  en?: string;
  unit: UnitType | string;
}

export interface ExtraItem {
  id: string;
  name: string;
  qty: number;
  unit: string;
}

export interface DailyOrderData {
  values: Record<string, number | null | undefined>;
  remains?: Record<string, number | null | undefined>;
  remainUnits?: Record<string, string>;
  extras: ExtraItem[];
}
