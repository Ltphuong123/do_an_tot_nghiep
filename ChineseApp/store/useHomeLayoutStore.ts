import { homeCard } from "@/constants/homeCards";
import { IHomeCard } from "@/types/home.type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HomeLayoutState {
  layout: IHomeCard[];
  setLayout: (layout: IHomeCard[]) => void;
  saveLayout: (layout: IHomeCard[]) => void;
  reloadLayout: () => Promise<void>;
  toggleVisibility: (id: string) => void;
  migrateFromOldStorage: () => Promise<void>;
}

export const useHomeLayoutStore = create<HomeLayoutState>()(
  persist(
    (set, get) => ({
      layout: homeCard,
      setLayout: (layout) => set({ layout }),
      saveLayout: (layout) => set({ layout }),
      reloadLayout: async () => {
        try {
          const data = await AsyncStorage.getItem("home-layout-storage");
          if (data) {
            const parsed = JSON.parse(data);
            set({ layout: parsed.state.layout });
          }
        } catch (error) {
          console.error("Error reloading layout:", error);
          set({ layout: homeCard });
        }
      },
      toggleVisibility: (id) => {
        const currentLayout = get().layout;
        const updatedLayout = currentLayout.map((card) =>
          card.id === id ? { ...card, visible: !card.visible } : card
        );
        set({ layout: updatedLayout });
      },
      migrateFromOldStorage: async () => {
        try {
          const oldData = await AsyncStorage.getItem("cardData");
          if (oldData) {
            const parsedOld = JSON.parse(oldData);
            // Assume old data is array of {id, title}, add visible: true
            const migrated = parsedOld.map((card: any) => ({
              ...card,
              visible: true,
            }));
            set({ layout: migrated });
            // Optionally remove old key
            await AsyncStorage.removeItem("cardData");
          }
        } catch (error) {
          console.error("Error migrating from old storage:", error);
        }
      },
    }),
    {
      name: "home-layout-storage",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
