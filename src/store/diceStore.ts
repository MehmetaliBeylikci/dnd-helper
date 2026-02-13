import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DiceRoll, RollRequest } from '../types/dice';
import { performRoll } from '../lib/dice';

interface DiceStore {
  rolls: DiceRoll[];
  roll: (request: RollRequest) => DiceRoll;
  clearHistory: () => void;
  removeRoll: (id: string) => void;
}

export const useDiceStore = create<DiceStore>()(
  persist(
    (set, get) => ({
      rolls: [],

      roll: (request: RollRequest) => {
        const newRoll = performRoll(request);
        set((state) => ({
          rolls: [newRoll, ...state.rolls].slice(0, 100), // Keep last 100 rolls
        }));
        return newRoll;
      },

      clearHistory: () => {
        set({ rolls: [] });
      },

      removeRoll: (id: string) => {
        set((state) => ({
          rolls: state.rolls.filter((roll) => roll.id !== id),
        }));
      },
    }),
    {
      name: 'dnd-dice-storage',
      partialize: (state) => ({ rolls: state.rolls.slice(0, 50) }), // Only persist last 50
    }
  )
);
