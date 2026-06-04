# Dynamic Poll Dashboard

A React application that integrates the raw, non-React **Chart.js** library into the React lifecycle using `useEffect` as an escape hatch. Users vote for their favorite JavaScript framework and a bar chart updates in real-time.
https://youtu.be/Y3SPGVRbCoE
## Assignment Tasks

### 1. Build a Dynamic Poll Dashboard

- Created a "Favorite JavaScript Framework" poll with voting buttons (React, Vue, Angular, Svelte, Solid)
- Clicking a button updates React state, and the `useEffect` hook intercepts the state change to imperatively command Chart.js to update the bar chart in real-time

### 2. Imperative Instantiation

- Inside `useEffect`, the code checks if `chartInstanceRef.current` is empty
- If it is, a new `Chart(canvasRef.current, {...})` is instantiated and saved to the ref
- Configured as a `"bar"` chart mapped to the `votes` state array

### 3. State Synchronization

- If the chart instance already exists when the effect runs, no new chart is created
- Instead, the existing chart's data array is mutated directly with the updated `votes` values
- The imperative `.update()` method is called to re-render the bars

### 4. Cleanup Execution

- The effect returns a cleanup function that calls `.destroy()` on the active chart instance
- This detaches all event listeners Chart.js binds to the canvas and frees cached context configurations
- Prevents memory leaks on unmount and avoids duplicate-instance errors

### 5. Code Comment Verification

- A comment is placed directly above the cleanup `return` block explaining why running `new Chart()` on every state render without destroying the old instance causes canvas rendering errors

### 6. Visual Polish

- Dark theme with slate/indigo palette
- Gradient title text, pill-style vote count badges on buttons
- Smooth hover animations with indigo glow
- Rounded chart bars, dark-themed axes/tooltips
- Inter font via Google Fonts
- Responsive layout for mobile

## Running the App

```bash
npm install
npm run dev
```

## Tech Stack

- **React** — UI state and rendering
- **Chart.js** — Imperative bar chart (vanilla JS library)
- **TypeScript** — Type safety
- **Vite** — Build tooling with HMR
