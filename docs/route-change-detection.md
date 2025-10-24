# 🔄 Route Change Detection

> **Smart route transition monitoring with before/after lifecycle events for Next.js applications**

Route Change Detection extends Next Observer with intelligent monitoring of client-side route transitions, providing precise hooks for cleanup and initialization during navigation.

## 📋 Table of Contents

- [Features](#-features)
- [Configuration](#-configuration)
- [Event System](#-event-system)
- [API Methods](#-api-methods)
- [State Tracking](#-state-tracking)
- [Detection Methods](#-detection-methods)
- [Examples](#-examples)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)

## ✨ Features

- 🎯 **Before Route Change Detection** - Event triggered before navigation starts
- ✅ **After Route Load Detection** - Event triggered after new content is fully loaded
- 🔄 **Multiple Detection Methods** - Next.js router events, history API, and browser navigation
- 📞 **Callback Support** - Register custom functions for route change handling
- 📊 **State Tracking** - Monitor loading status for content, scripts, and images
- ⏱️ **Configurable Timeouts** - Adjustable timeouts for route load completion detection
- 🛠️ **Debug Mode** - Comprehensive logging for development and troubleshooting
- 🎛️ **Manual Controls** - Programmatic access to current route and change detection

## ⚙️ Configuration

Route change detection is automatically enabled when initializing Next Observer. Customize the behavior with these options:

```javascript
window.NextObserver({
    routeChangeDetection: true, // Enable route change detection (default: true)
    routeLoadTimeout: 5000,     // Timeout for route load completion (default: 5000ms)
    debug: true,                // Enable debug logging
    minContentCheck: 3          // Minimum content elements before considering loaded
});
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `routeChangeDetection` | `boolean` | `true` | Enable/disable route change monitoring |
| `routeLoadTimeout` | `number` | `5000` | Timeout in milliseconds for route load detection |
| `debug` | `boolean` | `true` | Enable debug logging for route changes |
| `minContentCheck` | `number` | `3` | Minimum content elements before route is considered loaded |

## 🎬 Event System

Route Change Detection provides two main events to hook into the navigation lifecycle:

### `nextjs:route:before-change`

Triggered **before** a route change begins. Perfect for cleanup operations and showing loading states.

```javascript
window.addEventListener('nextjs:route:before-change', (event) => {
    const { from, to, timestamp } = event.detail;
    console.log(`Route changing from ${from} to ${to}`);
    
    // Cleanup operations
    clearInterval(myTimer);
    subscription?.unsubscribe();
    
    // Show loading indicator
    showLoadingSpinner();
});
```

**Event Detail Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `from` | `string` | Previous route path with query parameters |
| `to` | `string` | New route path with query parameters |
| `timestamp` | `number` | Unix timestamp when event was triggered |

### `nextjs:route:after-load`

Triggered **after** a route change completes and new content is fully loaded.

```javascript
window.addEventListener('nextjs:route:after-load', (event) => {
    const { route, timestamp, timing, state } = event.detail;
    console.log(`Route ${route} loaded in ${timing}ms`);
    
    // Initialize new page components
    initializeNewPageComponents();
    
    // Hide loading indicator
    hideLoadingSpinner();
    
    // Track analytics
    gtag('config', 'GA_MEASUREMENT_ID', { page_path: route });
});
```

**Event Detail Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `route` | `string` | Current route path with query parameters |
| `timestamp` | `number` | Unix timestamp when route load completed |
| `timing` | `number` | Load time in milliseconds |
| `state` | `NextObserverState` | Current observer state snapshot |

## 🔧 API Methods

Access route change detection functionality through the global observer instance:

### `getCurrentRoute()`

Returns the current route path with query parameters.

```javascript
const currentRoute = window.__nextObserver.getCurrentRoute();
console.log('Current route:', currentRoute); // "/dashboard?tab=analytics"
```

**Returns:** `string` - Current route path with query parameters

### `onRouteChange(callback)`

Registers a callback function that will be called on every route change.

```javascript
window.__nextObserver.onRouteChange((from, to) => {
    console.log(`Route changed: ${from} → ${to}`);
    
    // Custom route change logic
    if (to.includes('/dashboard')) {
        initializeDashboard();
    } else if (to.includes('/profile')) {
        loadUserProfile();
    }
});
```

**Parameters:**
- `callback` (`function`): Function to call on route changes
  - `from` (`string`): Previous route
  - `to` (`string`): New route

**Example with Multiple Callbacks:**

```javascript
// Analytics tracking
window.__nextObserver.onRouteChange((from, to) => {
    gtag('config', 'GA_MEASUREMENT_ID', { page_path: to });
});

// Performance monitoring
window.__nextObserver.onRouteChange((from, to) => {
    console.time(`route-load-${to}`);
});

// Custom business logic
window.__nextObserver.onRouteChange((from, to) => {
    updateBreadcrumbs(to);
    updatePageTitle(to);
});
```

## 📊 State Tracking

Route Change Detection extends the observer state with additional route-specific properties:

```javascript
const state = window.__nextObserver.state;

console.log({
    // Route-specific state
    routeChangeInProgress: state.routeChangeInProgress,  // boolean
    currentRoute: state.currentRoute,                    // string
    previousRoute: state.previousRoute,                  // string
    
    // Content loading state (reset on route change)
    contentLoaded: state.contentLoaded,                  // boolean
    scriptsLoaded: state.scriptsLoaded,                  // boolean
    imagesLoaded: state.imagesLoaded,                    // boolean
    
    // General state
    nextDetected: state.nextDetected,                    // boolean
    firstPaint: state.firstPaint                         // boolean
});
```

### Route State Properties

| Property | Type | Description |
|----------|------|-------------|
| `routeChangeInProgress` | `boolean` | Whether a route transition is currently happening |
| `currentRoute` | `string` | Current route path with query parameters |
| `previousRoute` | `string` | Previous route before the current transition |

> **Note:** Content loading states (`contentLoaded`, `scriptsLoaded`, `imagesLoaded`) are reset during route changes and re-evaluated for the new route.

## 🔍 Detection Methods

Route Change Detection uses multiple methods to ensure reliable route change detection across different navigation scenarios:

### 1. Next.js Router Events

When `window.next.router` is available, the observer listens to official Next.js router events:

```javascript
// Automatically detected events:
router.events.on('routeChangeStart', (url) => { /* ... */ });
router.events.on('routeChangeComplete', () => { /* ... */ });
router.events.on('routeChangeError', () => { /* ... */ });
```

**Best for:** Standard Next.js applications with client-side routing

### 2. Browser History API

Monitors browser navigation events for back/forward navigation:

```javascript
window.addEventListener('popstate', () => {
    // Detect route changes from browser navigation
});
```

**Best for:** Browser back/forward button navigation

### 3. History API Override

Intercepts programmatic navigation by overriding `history.pushState()` and `history.replaceState()`:

```javascript
// Automatically detects:
history.pushState(null, '', '/new-route');
history.replaceState(null, '', '/another-route');
```

**Best for:** Programmatic navigation, SPA libraries, custom routing

## 📝 Examples

### Basic Setup

```javascript
// ==UserScript==
// @require https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/next-observer/main.min.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Initialize with route change detection
    window.NextObserver({
        routeChangeDetection: true,
        routeLoadTimeout: 3000,
        debug: true
    });
    
    // Listen for route changes
    window.addEventListener('nextjs:route:before-change', (event) => {
        console.log('🔄 Route changing...', event.detail);
    });
    
    window.addEventListener('nextjs:route:after-load', (event) => {
        console.log('✅ Route loaded!', event.detail);
    });
})();
```

### Advanced Analytics Integration

```javascript
window.NextObserver({ routeChangeDetection: true });

// Google Analytics 4 integration
window.addEventListener('nextjs:route:after-load', (event) => {
    const { route, timing } = event.detail;
    
    // Track page view
    gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: route,
        custom_map: { route_load_time: timing }
    });
    
    // Track custom event
    gtag('event', 'page_view', {
        page_path: route,
        load_time: timing
    });
});

// Performance monitoring
window.__nextObserver.onRouteChange((from, to) => {
    // Start performance measurement
    performance.mark('route-start');
    
    // Track route transition
    console.log(`Navigation: ${from} → ${to}`);
});
```

### Form Auto-Save Example

```javascript
window.NextObserver({ routeChangeDetection: true });

let formData = {};

// Auto-save form data before route changes
window.addEventListener('nextjs:route:before-change', (event) => {
    const { from } = event.detail;
    
    // Save form data if leaving a form page
    if (from.includes('/form') || from.includes('/edit')) {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const data = new FormData(form);
            formData[from] = Object.fromEntries(data);
            localStorage.setItem('autoSaveData', JSON.stringify(formData));
        });
        
        console.log('💾 Form data auto-saved for:', from);
    }
});

// Restore form data after route loads
window.addEventListener('nextjs:route:after-load', (event) => {
    const { route } = event.detail;
    
    // Restore form data if entering a form page
    if (route.includes('/form') || route.includes('/edit')) {
        const savedData = localStorage.getItem('autoSaveData');
        if (savedData) {
            const data = JSON.parse(savedData);
            if (data[route]) {
                // Restore form fields
                Object.entries(data[route]).forEach(([name, value]) => {
                    const field = document.querySelector(`[name="${name}"]`);
                    if (field) field.value = value;
                });
                
                console.log('🔄 Form data restored for:', route);
            }
        }
    }
});
```

## 💡 Best Practices

### Performance Optimization

```javascript
// ✅ Good: Debounce rapid route changes
let routeChangeTimeout;
window.addEventListener('nextjs:route:before-change', () => {
    clearTimeout(routeChangeTimeout);
    routeChangeTimeout = setTimeout(() => {
        // Debounced route change logic
        performExpensiveOperation();
    }, 100);
});

// ✅ Good: Cleanup resources
window.addEventListener('nextjs:route:before-change', () => {
    // Clear timers
    clearInterval(myInterval);
    clearTimeout(myTimeout);
    
    // Unsubscribe from observables
    subscription?.unsubscribe();
    
    // Remove event listeners
    window.removeEventListener('scroll', scrollHandler);
});
```

### Error Handling

```javascript
// ✅ Good: Wrap callbacks in try-catch
window.__nextObserver.onRouteChange((from, to) => {
    try {
        // Your route change logic
        updateAnalytics(from, to);
        initializeNewPage(to);
    } catch (error) {
        console.error('Route change handler error:', error);
    }
});

// ✅ Good: Graceful degradation
window.addEventListener('nextjs:route:after-load', (event) => {
    const { route } = event.detail;
    
    // Check if required elements exist
    const dashboard = document.querySelector('.dashboard');
    if (dashboard && route.includes('/dashboard')) {
        initializeDashboard();
    }
});
```

### Configuration Tips

```javascript
// ✅ Good: Adjust timeout based on your app's needs
window.NextObserver({
    routeChangeDetection: true,
    routeLoadTimeout: 3000,        // Faster for SPAs
    minContentCheck: 2,            // Lower for minimal pages
    debug: false                   // Disable in production
});

// ✅ Good: Conditional route detection
const shouldDetectRoutes = window.location.hostname === 'your-spa.com';
window.NextObserver({
    routeChangeDetection: shouldDetectRoutes
});
```

## 🔧 Troubleshooting

### Route Changes Not Detected

**Symptoms:** Events not firing, callbacks not called

**Solutions:**

1. **Check Configuration**
   ```javascript
   // Ensure route detection is enabled
   console.log(window.__nextObserver?.config.routeChangeDetection); // should be true
   ```

2. **Enable Debug Mode**
   ```javascript
   window.NextObserver({ debug: true, routeChangeDetection: true });
   // Check console for "[Next.js Observer]" messages
   ```

3. **Verify Next.js Detection**
   ```javascript
   console.log('Next.js detected:', window.__nextObserver?.state.nextDetected);
   console.log('Router available:', !!window.next?.router);
   ```

### Events Firing Multiple Times

**Symptoms:** Duplicate events, performance issues

**Solutions:**

1. **Use Event Delegation**
   ```javascript
   // ❌ Bad: Multiple similar listeners
   window.addEventListener('nextjs:route:after-load', handler1);
   window.addEventListener('nextjs:route:after-load', handler2);
   
   // ✅ Good: Single coordinated handler
   window.addEventListener('nextjs:route:after-load', (event) => {
       handleAnalytics(event);
       handleUIUpdates(event);
       handleInitialization(event);
   });
   ```

2. **Check for Duplicate Observers**
   ```javascript
   // Ensure NextObserver is only initialized once
   if (!window.__nextObserver) {
       window.NextObserver({ routeChangeDetection: true });
   }
   ```

### Slow Route Load Detection

**Symptoms:** Long delays before `after-load` events

**Solutions:**

1. **Adjust Timeout Settings**
   ```javascript
   window.NextObserver({
       routeLoadTimeout: 2000,     // Reduce timeout
       minContentCheck: 1          // Lower content threshold
   });
   ```

2. **Check Content Detection**
   ```javascript
   // Monitor what's being detected
   window.addEventListener('nextjs:route:after-load', (event) => {
       console.log('Content loaded:', event.detail.state.contentLoaded);
       console.log('Scripts loaded:', event.detail.state.scriptsLoaded);
       console.log('Images loaded:', event.detail.state.imagesLoaded);
   });
   ```

### Browser Compatibility Issues

**Symptoms:** Detection not working in specific browsers

**Solutions:**

1. **Check Required APIs**
   ```javascript
   // Verify browser support
   console.log('MutationObserver:', !!window.MutationObserver);
   console.log('History API:', !!(history.pushState && history.replaceState));
   console.log('Performance API:', !!window.performance);
   ```

2. **Graceful Fallback**
   ```javascript
   if (!window.MutationObserver) {
       console.warn('Route change detection requires MutationObserver support');
       // Implement polling fallback if needed
   }
   ```

## 📊 Performance Considerations

- **Lightweight Implementation**: Uses efficient event listeners and DOM queries
- **Memory Management**: Automatic cleanup prevents memory leaks
- **Timeout Protection**: Prevents infinite waiting scenarios
- **Debouncing Support**: Built-in protection against rapid route changes
- **Conditional Detection**: Can be disabled for better performance when not needed

## 🆘 Getting Help

If you encounter issues:

1. **Enable Debug Mode**: Set `debug: true` to see detailed logging
2. **Check Browser Console**: Look for error messages and warnings  
3. **Verify Next.js Setup**: Ensure your app uses client-side routing
4. **Test Manually**: Try `window.__nextObserver.getCurrentRoute()` in console
5. **Report Issues**: Include debug logs and browser information when reporting bugs