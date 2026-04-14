import { create } from "zustand";

// useCounterStore: custom hooks
const useCounterStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  name: 'Ankit Tripathi'
}));

export default useCounterStore;

/* What’s happening here
- create() → creates a global store
- count → state
- increment, decrement → actions
- set() → updates state

() => {}      // returns nothing
() => ({})    // returns an object
 👉 Parentheses () are REQUIRED to return an object implicitly
 
 */
