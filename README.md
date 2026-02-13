# D&D Helper

**D&D Helper** is a modern, feature-rich companion application designed for Dungeons & Dragons 5th Edition players and Dungeon Masters. It simplifies campaign management by providing tools for character tracking, combat, spells, and inventory management in a unified, easy-to-use interface.

## 🚀 Key Features

- **🛡️ Combat Tracker**: Efficiently manage initiative orders, track hit points, and monitor conditions for both players and NPCs.
- **🎲 Dice Roller**: Integrated 3D-like dice roller with support for standard dice (d4, d6, d8, d10, d12, d20) and a roll history log.
- **📜 Character Management**: Create and manage detailed character sheets, including stats, skills, saving throws, and background information.
- **✨ Spellbook**: Keep track of known spells, prepared spells, and available spell slots with an intuitive interface.
- **🎒 Inventory System**: Manage equipment, magical items, and currency. automatically calculate total weight and carrying capacity.
- **🌍 Internationalization (i18n)**: Fully localized for **English** and **Turkish** users.
- **💾 Local Storage**: All data is persisted locally using `localforage`, ensuring your campaign data is saved between sessions.
- **📄 PDF Export**: (Experimental) Export character sheets or campaign notes to PDF.

## 🛠️ Tech Stack

This project is built with a modern frontend stack ensuring performance and maintainability:

- **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Internationalization**: [i18next](https://www.i18next.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utilities**: `clsx`, `tailwind-merge`

## 🏁 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

### Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/MehmetaliBeylikci/dnd-helper.git
    cd dnd-helper
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser to see the app.

### Building for Production

To create a production-ready build:

```bash
npm run build
```

## 🤝 Contributing

Contributions are welcome! If you have suggestions or find bugs, please open an issue or submit a pull request.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/YourFeature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
