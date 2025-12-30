export interface Commission {
  id: string;
  inquiry_id: string | null;
  property_id: string | null;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  payment_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  inquiries?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
  } | null;
  properties?: {
    id: string;
    title: string;
    location: string;
    price: number;
    price_type: string;
  } | null;
}

export interface CommissionFormData {
  inquiry_id?: string | null;
  property_id?: string | null;
  amount: number;
  status: "pending" | "paid" | "cancelled";
  payment_date?: string | null;
  notes?: string | null;
}


