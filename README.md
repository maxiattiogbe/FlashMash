# <img src="public/logo.png" alt="FlashMash Logo" width="32"/> FlashMash

Fun with flashcards reimagined  
[https://flashmash.vercel.app/](https://flashmash.vercel.app/)

## Overview

FlashMash is a multimodal, interactive web app for learning vocabulary with Spanish-English flashcards. Users match Spanish words with their English definitions in a timed game, powered by adaptive flashing cards and multiple input modes: stop button, webcam gesture (open hand), or voice command (saying "stop").

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [File Structure](#file-structure)
- [Setup Instructions](#setup-instructions)
- [Technologies](#technologies)
- [Usage](#usage)
- [Multimodal Controls](#multimodal-controls)
- [License](#license)

## Features

- Adaptive flashcard speed that responds to user performance
- Voice and gesture controls for accessibility and engagement
- Tracks performance across multiple rounds and provides detailed feedback
- CSV upload support for custom decks
- Interactive directions panel for user onboarding

## File Structure 
**Note:** There are some files that are not shown below but are in the repo for additional pages like generate flashcards and settings that exist for future work on this project.

    flashmash/
    ├── app/                                   # Next.js 15 “app router” directory
    │   ├── (dashboard)/
    │   │   ├── (routes)/
    │   │       ├── find-flashcards/
    │   │           ├── page.tsx              # Flashcard game page
    │   │           ├── loading.tsx           # Suspense fallback
    │   ├── layout.tsx                        # Global <html> / ClerkProvider
    │   └── globals.css                       # Tailwind base styles
    │
    ├── components/                           # Reusable UI + game logic
    │   ├── card-pair.tsx                     # Orchestrates a Spanish word and English definition pair
    │   ├── fixed-card.tsx                    # Static Spanish word card
    │   ├── flashing-card.tsx                 # Rotating English definition options
    │   ├── teachable-machine-webcam.tsx      # Open‑hand gesture detector
    │   ├── teachable-machine-audio.tsx       # Voice “Stop” detector
    │   ├── heading.tsx                       # Dashboard page headings
    │   ├── ui/                               # shadcn/ui copies (Button, Sheet, etc)
    │
    ├── decks/                                # Flashcard CSV files
    │   ├── flashmash_decks/
    │       ├── spanish/
    │           ├── easy/
    │           │   ├── spanish_words_easy.csv
    │           ├── medium/
    │           │   ├──spanish_words_medium.csv
    │           ├── hard/
    │               ├── spanish_words_hard.csv
    │
    ├── lib/                                  # Server / helper utilities
    │   ├──loadCsvDeck.ts                    # Synchronous CSV loader (csv‑parse/sync)
    │
    ├── public/                               # Static assets served at /
    │   ├── logo.png
    │   ├── open-hand-stop.jpg                # Gesture control directions image
    │   ├── favicon.ico
    │
    ├── README.md                             # Main project read‑me
    ├── next.config.mjs                       # Next.js config 
    ├── tailwind.config.ts                    # Tailwind theme overrides
    ├── tsconfig.json                         # TypeScript compiler options
    ├── package.json                          # npm scripts + dependencies
    ├── .eslintrc.json                        # ESLint rules 
    └── ...

## Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/maxiattiogbe/flashmash.git
cd flashmash
```
2. **Install dependencies**

```bash
npm install
```

3. Run locally

```bash
npm run dev   # opens on http://localhost:3000
```

## Technologies

| Stack              | Purpose                                         |
| ------------------ | ----------------------------------------------- |
| **Next.js 15**     | React + App Router, TypeScript                  |
| **Tailwind CSS**   | Utility‑first styling                           |
| **TensorFlow.js**  | Loads Teachable Machine models in‑browser       |
| **csv‑parse/sync** | Parses deck CSVs server‑side                    |


## Usage

1. Navigate to **Find Flashcards**.
2. A Spanish word appears on the left; the English card on the right cycles through four options.
3. Stop the flashing by:  
   - Clicking the **Stop** button, **or**  
   - Holding up an open hand to the **webcam**, **or**  
   - Saying **“Stop”** into the **microphone**.
4. Receive instant feedback and watch the flash speed adapt to your performance.
5. Play through all cards, then view your full results summary.

## Multimodal Controls

| Input Mode | How to Trigger   | Permission Needed |
| ---------- | ---------------- | ----------------- |
| **Button** | Click **Stop**   | None              |
| **Gesture**| Show open hand   | Webcam            |
| **Voice**  | Say “Stop”       | Microphone        |

## License

Released under the MIT License.
