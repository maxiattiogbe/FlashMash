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

flashmash/
├── app/
│   └── (dashboard)/find-flashcards/page.tsx      # Main flashcard page
├── components/
│   ├── card-pair.tsx                             # Flashcard gameplay logic
│   ├── fixed-card.tsx                            # Static Spanish word card
│   ├── flashing-card.tsx                         # Rotating English options
│   ├── teachable-machine-webcam.tsx              # Open‑hand gesture detector
│   ├── teachable-machine-audio.tsx               # Voice “stop” detector
├── decks/
│   └── flashmash_decks/spanish/
│       ├── easy/
│       ├── medium/
│       └── hard/                                 # CSV decks
├── lib/
│   └── loadCsvDeck.ts                            # CSV loader utility
├── public/
│   ├── logo.png
│   ├── open-hand

.
├── ...
├── docs                    # Documentation files (alternatively `doc`)
│   ├── TOC.md              # Table of contents
│   ├── faq.md              # Frequently asked questions
│   ├── misc.md             # Miscellaneous information
│   ├── usage.md            # Getting started guide
│   └── ...                 # etc.
└── ...

## Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/your-username/flashmash.git
cd flashmash
```

## Technology

| Stack              | Purpose                                         |
| ------------------ | ----------------------------------------------- |
| **Next.js 15**     | React + App Router, TypeScript                  |
| **Tailwind CSS**   | Utility‑first styling                           |
| **TensorFlow.js**  | Loads Teachable Machine models in‑browser       |
| **csv‑parse/sync** | Parses deck CSVs server‑side                    |


## Usage


## Multimodal Controls

| Input Mode | How to Trigger   | Permission Needed |
| ---------- | ---------------- | ----------------- |
| **Button** | Click **Stop**   | None              |
| **Gesture**| Show open hand   | Webcam            |
| **Voice**  | Say “Stop”       | Microphone        |

## License

Released under the MIT License.
