"use client";

import { create } from "zustand";
import type { ActivityFilter } from "./selectors";

export type ChartMode = "columns" | "line" | "rows";

interface UIState {
  /** Folha de nova transação. */
  addOpen: boolean;
  /** Categoria escolhida no rascunho — preservada entre aberturas. */
  draftCat: string;
  /** Filtro da tela Atividade — persiste entre trocas de aba. */
  activityFilter: ActivityFilter;
  /** Tratamento de gráfico da tela Análises — persiste entre trocas de aba. */
  chartMode: ChartMode;
  /** Mensagem do toast; string vazia = escondido. */
  toast: string;
  openAdd: () => void;
  closeAdd: () => void;
  setDraftCat: (cat: string) => void;
  setActivityFilter: (filter: ActivityFilter) => void;
  setChartMode: (mode: ChartMode) => void;
  flash: (message: string) => void;
}

let toastTimer: ReturnType<typeof setTimeout> | null = null;

export const useUIStore = create<UIState>((set) => ({
  addOpen: false,
  draftCat: "mercado",
  activityFilter: "all",
  chartMode: "columns",
  toast: "",
  openAdd: () => set({ addOpen: true }),
  closeAdd: () => set({ addOpen: false }),
  setDraftCat: (cat) => set({ draftCat: cat }),
  setActivityFilter: (filter) => set({ activityFilter: filter }),
  setChartMode: (mode) => set({ chartMode: mode }),
  flash: (message) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast: message });
    toastTimer = setTimeout(() => set({ toast: "" }), 2600);
  },
}));
