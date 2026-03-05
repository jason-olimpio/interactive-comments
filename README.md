# 💬 Interactive Comments

A high-performance, nested commenting system built with **React 19**, **Zustand**, and **Immer**. This project features a recursive data structure to handle multi-level replies, persistent storage, and a polished UI inspired by modern social platforms.

## 🚀 Features

* **Recursive Nesting**: Supports deep reply threads using recursive components.
* **Persistence**: Comments and votes are saved to `localStorage` using Zustand's persist middleware.
* **CRUD Operations**: Full ability to add, edit, reply to, and delete comments.
* **Voting System**: Weighted voting logic (Upvote/Downvote) with local state tracking.
* **Responsive Design**: Mobile-first approach with optimized layouts for desktop and handheld devices.

## 🛠️ Tech Stack

| Technology | Purpose |
| --- | --- |
| **React 19** | UI Library |
| **TypeScript** | Type Safety |
| **Zustand** | Global State Management |
| **Immer** | Immutable State Logic |
| **Tailwind CSS** | Styling |
| **Vite** | Build Tool |
| **date-fns** | Relative Time Formatting |

## Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/your-username/interactive-comments.git
cd interactive-comments

```

2. **Install dependencies:**
```bash
npm install

```

3. **Start the development server:**
```bash
npm run dev

```

4. **Build for production:**
```bash
npm run build

```