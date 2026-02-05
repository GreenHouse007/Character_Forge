export interface BreakdownEntry {
  label: string;
  value: number;
}

export interface StatBreakdown {
  total: number;
  entries: BreakdownEntry[];
}
