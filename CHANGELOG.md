# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2024-10-25

### Added
- **Route Change Detection** for Next Observer
  - `nextjs:route:before-change` event for pre-navigation cleanup
  - `nextjs:route:after-load` event for post-navigation initialization
  - Multiple detection methods: Next.js router events, history API, browser navigation
  - New configuration options: `routeChangeDetection` and `routeLoadTimeout`
  - Route state tracking: `routeChangeInProgress`, `currentRoute`, `previousRoute`
  - API methods: `getCurrentRoute()` and `onRouteChange(callback)`

### Enhanced
- **Documentation**
  - Complete route change detection guide with examples and best practices
  - Updated Next Observer documentation with route detection section
  - Enhanced README with route change examples
  - Updated API reference with new types and interfaces
  - Professional package.json with comprehensive metadata

### Technical
- New TypeScript interfaces: `NextRouteChangeEventDetail`, `NextRouteLoadEventDetail`
- Extended `NextObserverState` and `NextObserverInstance` interfaces
- Updated WindowEventMap with route change events
- Improved build configuration and development scripts

## [1.0.0] - 2024-10-20

### Added
- **Next Observer Library**
  - Smart Next.js application state detection
  - Multiple detection methods for reliable framework identification
  - Performance monitoring with First Contentful Paint metrics
  - Content validation and mutation stability checking
  - Configurable timeouts and debug mode
  - Comprehensive state tracking

- **Custom Console Library**
  - Advanced console viewer with object inspection
  - JavaScript execution with command history
  - Real-time filtering and search capabilities
  - Syntax highlighting for JSON objects
  - Interactive function execution
  - Responsive design and keyboard shortcuts

- **Build System**
  - TypeScript compilation with Rollup
  - Multiple output formats: UMD, ESM, CommonJS
  - Minified builds for production
  - CSS processing for Custom Console styles

- **Documentation**
  - Comprehensive guides for both libraries
  - API reference with TypeScript definitions
  - Examples and usage patterns
  - Installation instructions for Tampermonkey

### Technical
- TypeScript support with complete type definitions
- Modern ES6+ features with backwards compatibility
- CDN-ready builds for easy integration
- Tampermonkey-optimized bundle formats

---

## Legend

- **Added** for new features
- **Changed** for changes in existing functionality  
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability fixes
- **Enhanced** for improvements to existing features
- **Technical** for internal/developer-facing changes