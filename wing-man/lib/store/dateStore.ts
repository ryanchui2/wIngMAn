import { create } from 'zustand';

export interface DatePlan {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  activities: string[];
  rating?: number;
  notes?: string;
  createdAt: Date;
}

interface DateStore {
  dates: DatePlan[];
  addDate: (date: DatePlan) => void;
  updateDate: (id: string, date: Partial<DatePlan>) => void;
  deleteDate: (id: string) => void;
  rateDate: (id: string, rating: number) => void;
}

export const useDateStore = create<DateStore>((set) => ({
  dates: [],
  addDate: (date) =>
    set((state) => ({
      dates: [...state.dates, date],
    })),
  updateDate: (id, updatedDate) =>
    set((state) => ({
      dates: state.dates.map((date) =>
        date.id === id ? { ...date, ...updatedDate } : date
      ),
    })),
  deleteDate: (id) =>
    set((state) => ({
      dates: state.dates.filter((date) => date.id !== id),
    })),
  rateDate: (id, rating) =>
    set((state) => ({
      dates: state.dates.map((date) =>
        date.id === id ? { ...date, rating } : date
      ),
    })),
}));
