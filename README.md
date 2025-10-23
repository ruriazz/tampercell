# 🧬 TamperCell

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-00485B?style=for-the-badge&logo=tampermonkey&logoColor=white)](https://www.tampermonkey.net/)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)](https://github.com/ruriazz/tampercell)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

> **Modern TypeScript libraries for enhanced Tampermonkey development**

TamperCell is a collection of powerful, type-safe libraries designed specifically for Tampermonkey userscripts. Built with TypeScript and modern web standards, it provides essential utilities for web automation, debugging, and Next.js application monitoring.

## 📦 Available Libraries

| Library | Description | Documentation |
|---------|-------------|---------------|
| **🔍 Next Observer** | Smart Next.js application state detection with comprehensive readiness checks | [📖 Docs](docs/next-observer.md) |
| **🖥️ Custom Console** | Advanced console viewer with object inspection, filtering, and JavaScript execution | [📖 Docs](docs/custom-console.md) |

## 🚀 Quick Start

### CDN Usage (Recommended)

All libraries are available via CDN for easy integration with Tampermonkey:

```javascript
// ==UserScript==
// @name         My Enhanced Script
// @version      1.0.0
// @match        https://example.com/*
// @require      https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/next-observer/main.min.js
// @require      https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/custom-console/main.min.js
// @grant        none
// ==/UserScript==
```

### Basic Example

```javascript
(function () {
  'use strict';

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/custom-console/main.min.css';

  // Initialize libraries
  style.onload = window.CustomConsole;
  window.NextObserver();

  document.head.appendChild(style);

  // Listen for Next.js ready event
  window.addEventListener('nextjs:ready', () => {
      console.log('🚀 Next.js is ready!');
      // Your code here...
  });
})();
```

## 📖 Documentation

## 📚 Documentation

For comprehensive documentation and guides, please refer to:

- **[Next Observer Documentation](docs/next-observer.md)** - Smart Next.js application detection
- **[Custom Console Documentation](docs/custom-console.md)** - Advanced debugging console
- **[API Reference](docs/api-reference.md)** - Complete TypeScript type definitions
- **[Examples & Tutorials](docs/examples.md)** - Real-world usage examples and best practices
- **[API Reference](docs/api-reference.md)** - TypeScript interfaces and type definitions
- **[Examples](docs/examples.md)** - Real-world usage examples and recipes

## 🛠️ Development

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup
```bash
git clone https://github.com/ruriazz/tampercell.git
cd tampercell
npm install
```

### Build
```bash
npm run build
```

### Project Structure
```
tampercell/
├── src/                  # Source code
│   ├── custom-console/   # Custom Console library
│   └── next-observer/    # Next Observer library
├── types/                # TypeScript type definitions
├── docs/                 # Documentation
├── dist/                 # Built files
└── README.md            # This file
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [TypeScript](https://www.typescriptlang.org/) for type safety
- Bundled with [Rollup](https://rollupjs.org/) for optimal output
- Designed for [Tampermonkey](https://www.tampermonkey.net/) userscripts

---

**Made with ❤️ for the Tampermonkey community**