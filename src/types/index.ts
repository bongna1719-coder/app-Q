export interface FaqStep {
  step: number;
  text: string;
  image: string;
}

export interface FaqItem {
  id: string;
  title: string;
  category: string;
  desc: string;
  videoUrl?: string;
  steps: FaqStep[];
}

export interface Branch {
  id: number;
  branch: string;
  name: string;
  address: string;
  image: string;
  mapsUrl: string;
  openingHours: {
    morning: string;
    afternoon: string;
  };
  phone: string;
  tel: string;
  badge?: string;
}

export interface ProductItem {
  id: string;
  category: string;
  categoryLabel: string;
  name: string;
  image: string;
  desc: string;
  highlights: string[];
}

export interface LoanScheduleRow {
  period: number;
  paymentDate: string;
  remainingPrincipal: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
}
