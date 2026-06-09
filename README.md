# PropView — Tokyo Property Explorer

A responsive single-page property listings dashboard built with Vue 3, Pinia, and TypeScript.

Live demo: [propview.vercel.app](https://propview-flax.vercel.app)

---

## Features

- **Filter & search** — live search by name, district, or address; filter by property type, price range, and bedroom count
- **Pinia state management** — all filter state and listing data managed in a single typed store
- **Price distribution chart** — Chart.js bar chart showing rent distribution across price bands
- **Saved properties** — bookmark listings with a heart toggle; saved tab shows combined monthly rent
- **Stats bar** — live summary of listing count, average rent, lowest, and highest price
- **Responsive layout** — works on mobile, tablet, and desktop
- **22 Vitest unit tests** — full coverage of store actions, getters, and filter logic

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | Vue 3 (Composition API, script setup) |
| State       | Pinia                               |
| Language    | TypeScript                          |
| Styling     | Tailwind CSS v4                     |
| Charts      | Chart.js via vue-chartjs            |
| Build tool  | Vite                                |
| Testing     | Vitest + @vue/test-utils            |
| Deployment  | Vercel                              |

---

## Getting Started

```bash
git clone https://github.com/aserawayneasera/propview
cd propview
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Run tests

```bash
npx vitest run
```

---

## Project Structure