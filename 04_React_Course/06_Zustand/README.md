# 1️⃣ What is Zustand?

- Lightweight global state management library for React
- No reducers, no boilerplate
- Uses hooks (very React-friendly)
- Faster and simpler than Redux
- Ideal replacement for Context API + Redux

# 2️⃣ When should you use Zustand?

- You want global state
- You want to avoid prop drilling
- You want simple & fast state updates
- Redux feels heavy

# 3️⃣ Install Zustand

```
- npm install zustand
```

# 4️⃣ Core Concept (MOST IMPORTANT)

```
- import { create } from "zustand";

- create() → creates a global store
- Returns a custom React hook;
```

# 5️⃣ Import Zustand factory

```
- const useCounterStore = create(() => ({}));

- Create empty global store
- () => ({}) → function returning object
```

# 6️⃣ Add State

```
const useCounterStore = create(() => ({
  count: 0,
}))
```

# 7️⃣ Updating State using set

```
const useCounterStore = create((set) => ({
  count: 0,
}));

- set is provided by Zustand
- Used to update state
```

# 8️⃣ Add Actions (increment / decrement)

```
const useCounterStore = create((set) => ({
  count: 0,
  <!-- methods / actions -->
  increment: () => set((state) => ({count: state.count + 1})),
  decrement: () => set((state) => ({count: state.count - 1}))
}));

- set() accepts a function
- Function receives previous state
- Must return new object

```

# 9️⃣ Why so many brackets ❓ (Quick Map)

```
increment: () =>          // function
  set(                    // set call
    (state) =>            // callback
      ({                  // object return
        count: state.count + 1
      })
  )

```

# 🔟 Using Store in Component

```
import useCounterStore from "./store/useCounterStore";

function Counter() {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);

  return (
    <button onClick={increment}>
      Count: {count}
    </button>
  );
}

```

# 1️⃣ () => {}

const fn = () => {};
fn is a function
{} is treated as a function body
Nothing is returned
✅ Function returning undefined

# 2️⃣ () => ({})

const fn = () => ({});
fn is still a function
({}) forces {} to be treated as an object
The object is returned
So:
fn(); // {}
✅ Function returning an object
