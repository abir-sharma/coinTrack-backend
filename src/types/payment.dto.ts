export interface CreatePaymentDTO {
  amount: number;
  category: string;
  method: "CASH" | "UPI" | "CARD" | "BANK";
  description?: string;
  date: string; // ISO string
}

export interface UpdatePaymentDTO {
  amount?: number;
  category?: string;
  method?: "CASH" | "UPI" | "CARD" | "BANK";
  description?: string;
  date?: string;
}
