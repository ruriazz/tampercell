# 🔍 Next Observer

> **Smart Next.js application state detection with comprehensive readiness checks**

Next Observer provides intelligent detection and monitoring of Next.js applications, ensuring your scripts run at the optimal time when the application is fully ready.

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Basic Usage](#-basic-usage)
- [Configuration](#-configuration)
- [API Reference](#-api-reference)
- [Event Details](#-event-details)
- [Detection Methods](#-detection-methods)
- [Examples](#-examples)
- [Troubleshooting](#-troubleshooting)

## ✨ Features

- ✅ **Smart Detection** - Multiple detection methods for reliable Next.js identification
- ⚡ **Performance Monitoring** - First Contentful Paint and loading metrics
- 🎯 **Content Validation** - Ensures substantial content is loaded before triggering
- 🔄 **Mutation Stability** - Waits for DOM mutations to stabilize
- 🛠️ **Debug Mode** - Comprehensive logging for development
- ⏱️ **Timeout Protection** - Prevents infinite waiting with configurable timeouts
- 📊 **State Tracking** - Detailed readiness state information
- 🔧 **Manual Controls** - Force checks and trigger events manually

## 📦 Installation

### CDN (Recommended for Tampermonkey)

```javascript
// ==UserScript==
// @require https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/next-observer/main.min.js
// ==/UserScript==
```

### Available Builds

| Build | Description | Use Case |
|-------|-------------|----------|
| `main.min.js` | UMD minified | Production Tampermonkey scripts |
| `main.js` | UMD unminified | Development/debugging |
| `main.esm.js` | ES modules | Modern bundlers |
| `main.cjs.js` | CommonJS | Node.js environments |

## 🚀 Basic Usage

### Simple Implementation

```javascript
// Initialize with default settings
window.NextObserver();

// Listen for Next.js ready event
window.addEventListener('nextjs:ready', (event) => {
    console.log('🚀 Next.js Application is Ready!');
    console.log('Load time:', event.detail.timing + 'ms');
    
    // Your Next.js-specific code here
    initializeFeatures();
});

function initializeFeatures() {
    // Safe to interact with Next.js app now
    const userProfile = document.querySelector('[data-testid="user-profile"]');
    if (userProfile) {
        console.log('User profile found:', userProfile);
    }
}
```

### With Error Handling

```javascript
window.NextObserver({
    timeout: 30000,
    debug: true
});

window.addEventListener('nextjs:ready', (event) => {
    try {
        console.log('Next.js ready:', event.detail);
        
        // Your enhanced logic
        enhanceNextApp();
        
    } catch (error) {
        console.error('Error initializing features:', error);
    }
});
```

## ⚙️ Configuration

### Configuration Options

```typescript
interface NextObserverConfig {
    timeout?: number;         // Maximum wait time in milliseconds
    checkInterval?: number;   // Polling interval in milliseconds  
    debug?: boolean;          // Enable/disable debug logging
    minContentCheck?: number; // Minimum content elements before ready
}
```

### Default Configuration

```javascript
const defaultConfig = {
    timeout: 15000,        // 15 seconds
    checkInterval: 100,    // 100ms
    debug: true,           // Debug enabled
    minContentCheck: 3     // 3 content elements
};
```

### Advanced Configuration

```javascript
window.NextObserver({
    timeout: 25000,          // Wait up to 25 seconds
    checkInterval: 50,       // Check every 50ms for faster detection
    debug: false,            // Disable logging for production
    minContentCheck: 5       // Require more content before ready
});
```

## 📚 API Reference

### Methods

```javascript
// Access the debug instance
const observer = window.__nextObserver;
```

#### `forceCheck(): boolean`
Manually check if Next.js application is ready.

```javascript
const isReady = observer.forceCheck();
console.log('App ready:', isReady);
```

#### `forceReady(): void`
Force trigger the ready event (use with caution).

```javascript
observer.forceReady(); // Triggers 'nextjs:ready' event
```

#### `detectNext(): boolean`
Check if Next.js framework is detected.

```javascript
const hasNext = observer.detectNext();
console.log('Next.js detected:', hasNext);
```

### Properties

#### `state: NextObserverState`
Current readiness state of the application.

```javascript
console.log('Current state:', observer.state);
```

#### `config: Required<NextObserverConfig>`
Current configuration settings.

```javascript
console.log('Configuration:', observer.config);
```

## 📊 Event Details

### Event Structure

```typescript
interface NextReadyEventDetail {
    state: NextObserverState;
    timestamp: number;
    timing: number;
}
```

### State Interface

```typescript
interface NextObserverState {
    nextDetected: boolean;      // Next.js framework detected
    contentLoaded: boolean;     // Substantial content loaded
    scriptsLoaded: boolean;     // JavaScript bundles loaded
    imagesLoaded: boolean;      // Images loaded (80% threshold)
    noMoreMutations: boolean;   // DOM mutations stabilized
    firstPaint: boolean;        // First Contentful Paint occurred
}
```

### Example Event Handler

```javascript
window.addEventListener('nextjs:ready', (event) => {
    const { state, timestamp, timing } = event.detail;
    
    console.log('Ready State:', {
        nextDetected: state.nextDetected,      // true
        contentLoaded: state.contentLoaded,    // true
        scriptsLoaded: state.scriptsLoaded,    // true
        imagesLoaded: state.imagesLoaded,      // true
        noMoreMutations: state.noMoreMutations,// true
        firstPaint: state.firstPaint,          // true
        loadTime: timing + 'ms',               // e.g., "1247ms"
        timestamp: new Date(timestamp)         // Event time
    });
});
```

## 🔍 Detection Methods

Next Observer uses multiple detection strategies for maximum reliability:

### 1. Framework Detection
- **`__NEXT_DATA__`** - Next.js data object (production builds)
- **`_next` scripts** - Next.js bundle scripts
- **Meta generator** - Next.js meta tag
- **Route announcer** - Accessibility feature
- **Build ID patterns** - Next.js build artifacts

### 2. Content Detection
- **Main content elements** - `main`, `article`, `section`, etc.
- **Text content analysis** - Minimum text length requirements
- **Element count** - Sufficient DOM elements present

### 3. Script Detection
- **Runtime availability** - Next.js runtime objects
- **React hydration** - React-specific attributes
- **Bundle loading** - Script load status

### 4. Performance Detection
- **First Contentful Paint** - Performance API metrics
- **Image loading** - 80% threshold for image completion
- **Mutation stability** - DOM changes stabilized

## 📋 Examples

### E-commerce Site Enhancement

```javascript
// ==UserScript==
// @name         Next.js E-commerce Helper
// @match        https://shop.example.com/*
// @require      https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/next-observer/main.min.js
// ==/UserScript==

window.NextObserver({
    timeout: 20000,
    minContentCheck: 5  // E-commerce sites have more content
});

window.addEventListener('nextjs:ready', () => {
    // Auto-apply discount codes
    applyDiscountCode('SAVE20');
    
    // Track price changes
    monitorPriceChanges();
    
    // Enhance product pages
    enhanceProductDisplay();
});

function applyDiscountCode(code) {
    const couponInput = document.querySelector('input[name="coupon"], input[name="discount"]');
    if (couponInput && !couponInput.value) {
        couponInput.value = code;
        couponInput.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('💰 Discount code applied:', code);
    }
}

function monitorPriceChanges() {
    const priceElements = document.querySelectorAll('[data-testid*="price"], .price');
    
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                const target = mutation.target;
                if (target.matches && target.matches('[data-testid*="price"], .price')) {
                    console.log('💲 Price updated:', target.textContent);
                }
            }
        });
    });
    
    priceElements.forEach(el => {
        observer.observe(el, { childList: true, subtree: true, characterData: true });
    });
}
```

### Social Media Dashboard

```javascript
// ==UserScript==
// @name         Next.js Social Dashboard
// @match        https://dashboard.social.com/*
// @require      https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/next-observer/main.min.js
// ==/UserScript==

window.NextObserver({
    timeout: 30000,  // Dashboards can take longer to load
    debug: false     // Disable logging in production
});

window.addEventListener('nextjs:ready', (event) => {
    console.log('Dashboard ready in', event.detail.timing + 'ms');
    
    // Auto-refresh data every 5 minutes
    setInterval(refreshDashboardData, 5 * 60 * 1000);
    
    // Enhance notifications
    enhanceNotifications();
    
    // Add keyboard shortcuts
    addKeyboardShortcuts();
});

function refreshDashboardData() {
    const refreshButton = document.querySelector('[data-testid="refresh"], button[aria-label*="refresh"]');
    if (refreshButton) {
        refreshButton.click();
        console.log('📊 Dashboard data refreshed');
    }
}

function enhanceNotifications() {
    // Add desktop notifications for new messages
    const messageContainer = document.querySelector('[data-testid="messages"]');
    if (messageContainer) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.matches('[data-testid="message"]')) {
                        showDesktopNotification('New message received');
                    }
                });
            });
        });
        
        observer.observe(messageContainer, { childList: true, subtree: true });
    }
}
```

### Developer Tools Enhancement

```javascript
// ==UserScript==
// @name         Next.js Dev Tools
// @match        https://dev.example.com/*
// @require      https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/next-observer/main.min.js
// ==/UserScript==

// Enhanced debugging for development
window.NextObserver({
    timeout: 10000,
    checkInterval: 50,  // Faster polling for dev
    debug: true,
    minContentCheck: 1  // Less strict for dev environments
});

window.addEventListener('nextjs:ready', (event) => {
    const { state, timing } = event.detail;
    
    // Log detailed performance metrics
    console.group('🚀 Next.js Application Ready');
    console.log('Load Time:', timing + 'ms');
    console.log('State:', state);
    console.log('Build Info:', window.__NEXT_DATA__?.buildId);
    console.log('Page:', window.__NEXT_DATA__?.page);
    console.groupEnd();
    
    // Add development helpers
    addDevHelpers();
    
    // Monitor route changes
    monitorRouteChanges();
});

function addDevHelpers() {
    // Add a floating debug panel
    const debugPanel = document.createElement('div');
    debugPanel.style.cssText = `
        position: fixed; top: 10px; left: 10px; z-index: 10000;
        background: #000; color: #0f0; padding: 10px;
        font-family: monospace; font-size: 12px;
        border-radius: 5px; max-width: 300px;
    `;
    
    const buildId = window.__NEXT_DATA__?.buildId || 'unknown';
    const page = window.__NEXT_DATA__?.page || 'unknown';
    
    debugPanel.innerHTML = `
        <div>🔧 Next.js Debug</div>
        <div>Build: ${buildId}</div>
        <div>Page: ${page}</div>
        <div>Route: ${location.pathname}</div>
    `;
    
    document.body.appendChild(debugPanel);
    
    // Remove after 10 seconds
    setTimeout(() => debugPanel.remove(), 10000);
}
```

## 🔧 Troubleshooting

### Common Issues

#### Next.js Not Detected

```javascript
// Check detection manually
window.NextObserver();

setTimeout(() => {
    const observer = window.__nextObserver;
    console.log('Detection Status:', {
        nextDetected: observer.detectNext(),
        hasNextData: !!window.__NEXT_DATA__,
        hasNextScripts: document.querySelectorAll('script[src*="/_next/"]').length,
        state: observer.state
    });
}, 2000);
```

#### Timeout Issues

```javascript
// Increase timeout for slow sites
window.NextObserver({
    timeout: 45000,     // 45 seconds
    checkInterval: 200  // Check less frequently
});
```

#### False Positives

```javascript
// More strict content requirements
window.NextObserver({
    minContentCheck: 10,  // Require more content
    timeout: 20000        // Longer timeout for complex apps
});
```

### Debug Mode

Enable debug mode to see detailed logging:

```javascript
window.NextObserver({ debug: true });

// Check console for messages like:
// [Next.js Observer] ✓ Detected via __NEXT_DATA__
// [Next.js Observer] ✓ Content loaded: 5 elements, 234 chars
// [Next.js Observer] ✓ Scripts loaded (Next.js runtime available)
// [Next.js Observer] ✅ Next.js Application is READY!
```

### Manual Override

For testing or special cases:

```javascript
// Force ready state (development only)
window.NextObserver();

// After page load, force trigger
setTimeout(() => {
    window.__nextObserver.forceReady();
}, 5000);
```

---

## 🔗 Related Documentation

- [Custom Console](custom-console.md) - Advanced debugging console
- [API Reference](api-reference.md) - Complete TypeScript interfaces
- [Examples](examples.md) - More real-world usage examples

---

**Next Observer - Making Next.js detection reliable and efficient** 🚀