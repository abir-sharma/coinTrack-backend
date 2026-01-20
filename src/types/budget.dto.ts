
export interface CreateBudgetDTO {
  title: string;
  amount: number;
  category: string;
  month: string;
}

export interface UpdateBudgetDTO {
  title?: string;
  amount?: number;
  category?: string;
  month?: string;
}
