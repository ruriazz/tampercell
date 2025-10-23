# 🚀 TamperCell Examples

> **Real-world usage examples and implementation patterns for TamperCell libraries**

This document provides comprehensive examples showing how to use TamperCell libraries in various scenarios and environments.

## 📋 Table of Contents

- [Tampermonkey Installation](#-tampermonkey-installation)
- [Next Observer Examples](#-next-observer-examples)
- [Custom Console Examples](#-custom-console-examples)
- [Advanced Integration](#-advanced-integration)
- [Troubleshooting Examples](#-troubleshooting-examples)
- [Best Practices](#-best-practices)

## 📦 Tampermonkey Installation

### Basic Tampermonkey Script Template

```javascript
// ==UserScript==
// @name         TamperCell Example
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Example usage of TamperCell libraries
// @author       You
// @match        https://yoursite.com/*
// @require      https://cdn.jsdelivr.net/npm/tampercell@latest/dist/next-observer.min.js
// @require      https://cdn.jsdelivr.net/npm/tampercell@latest/dist/custom-console.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Initialize Custom Console for debugging
    window.CustomConsole();
    
    // Initialize Next Observer with custom configuration
    window.NextObserver({
        timeout: 20000,
        debug: true,
        checkInterval: 100
    });
    
    // Listen for ready event
    window.addEventListener('nextjs:ready', (event) => {
        console.log('🎉 Next.js app is ready!', event.detail);
        
        // Your custom code here
        initializeCustomFeatures();
    });
    
    function initializeCustomFeatures() {
        // Add your custom functionality
        console.log('🔧 Initializing custom features...');
    }
})();
```

### CDN Links for Different Versions

```javascript
// Latest version (recommended)
// @require https://cdn.jsdelivr.net/npm/tampercell@latest/dist/next-observer.min.js

// Specific version
// @require https://cdn.jsdelivr.net/npm/tampercell@1.0.0/dist/next-observer.min.js

// Development versions (unminified)
// @require https://cdn.jsdelivr.net/npm/tampercell@latest/dist/next-observer.js

// With CSS for Custom Console
// @require https://cdn.jsdelivr.net/npm/tampercell@latest/dist/custom-console.min.js
// @resource customConsoleCSS https://cdn.jsdelivr.net/npm/tampercell@latest/dist/custom-console.css
```

## 🔍 Next Observer Examples

### Example 1: Basic Usage

```javascript
// ==UserScript==
// @name         Next.js Ready Detection
// @match        https://nextjs-app.com/*
// @require      https://cdn.jsdelivr.net/npm/tampercell@latest/dist/next-observer.min.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Simple initialization
    window.NextObserver();
    
    // Handle ready event
    window.addEventListener('nextjs:ready', (event) => {
        const { state, timing } = event.detail;
        
        console.log(`✅ App ready in ${timing}ms`);
        console.log('State:', state);
        
        // Now safe to interact with the page
        enhancePage();
    });
    
    function enhancePage() {
        // Add custom styling
        const style = document.createElement('style');
        style.textContent = `
            .custom-enhancement {
                border: 2px solid #0070f3;
                padding: 10px;
                border-radius: 8px;
            }
        `;
        document.head.appendChild(style);
        
        // Enhance existing elements
        document.querySelectorAll('button').forEach(btn => {
            btn.classList.add('custom-enhancement');
        });
    }
})();
```

### Example 2: Configuration with Timeout Handling

```javascript
// ==UserScript==
// @name         Next.js with Timeout Handling
// @match        https://slow-nextjs-app.com/*
// @require      https://cdn.jsdelivr.net/npm/tampercell@latest/dist/next-observer.min.js
// ==/UserScript==

(function() {
    'use strict';
    
    let isReady = false;
    
    // Configure for slower applications
    window.NextObserver({
        timeout: 30000,        // 30 seconds
        checkInterval: 200,    // Check every 200ms
        debug: true,           // Enable debug logging
        minContentCheck: 5     // At least 5 content elements
    });
    
    // Ready event handler
    window.addEventListener('nextjs:ready', (event) => {
        isReady = true;
        const { timing, state } = event.detail;
        
        console.log(`🎉 App ready after ${timing}ms`);
        initializeFeatures();
    });
    
    // Timeout fallback
    setTimeout(() => {
        if (!isReady) {
            console.warn('⚠️ Timeout reached, initializing anyway...');
            initializeFeatures();
        }
    }, 35000);
    
    function initializeFeatures() {
        // Force check if needed
        if (window.__nextObserver) {
            const currentState = window.__nextObserver.state;
            console.log('Current state:', currentState);
            
            if (!currentState.nextDetected) {
                console.warn('❌ Next.js not detected, proceeding with caution');
            }
        }
        
        // Initialize your features
        addCustomUI();
    }
    
    function addCustomUI() {
        const banner = document.createElement('div');
        banner.innerHTML = `
            <div style="
                position: fixed;
                top: 10px;
                right: 10px;
                background: #0070f3;
                color: white;
                padding: 10px;
                border-radius: 8px;
                z-index: 9999;
            ">
                🚀 Enhanced by TamperCell
            </div>
        `;
        document.body.appendChild(banner);
    }
})();
```

### Example 3: Multiple Event Listeners

```javascript
// ==UserScript==
// @name         Advanced Next.js Detection
// @match        https://complex-app.com/*
// @require      https://cdn.jsdelivr.net/npm/tampercell@latest/dist/next-observer.min.js
// ==/UserScript==

(function() {
    'use strict';
    
    const features = {
        navigation: false,
        analytics: false,
        ui: false
    };
    
    // Initialize observer
    window.NextObserver({
        debug: true,
        timeout: 25000
    });
    
    // Multiple event listeners for different features
    window.addEventListener('nextjs:ready', initializeNavigation);
    window.addEventListener('nextjs:ready', initializeAnalytics);
    window.addEventListener('nextjs:ready', initializeUI);
    
    function initializeNavigation(event) {
        if (features.navigation) return;
        features.navigation = true;
        
        console.log('🧭 Initializing navigation features...');
        
        // Add navigation enhancements
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                console.log('🔗 Navigation:', e.target.href);
                // Track navigation
            }
        });
    }
    
    function initializeAnalytics(event) {
        if (features.analytics) return;
        features.analytics = true;
        
        console.log('📊 Initializing analytics...');
        
        // Custom analytics
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    console.log('📈 DOM changed:', mutation.target);
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    function initializeUI(event) {
        if (features.ui) return;
        features.ui = true;
        
        const { timing, state } = event.detail;
        console.log(`🎨 Initializing UI enhancements (ready in ${timing}ms)...`);
        
        // Add floating action button
        const fab = document.createElement('div');
        fab.innerHTML = `
            <button id="tamper-fab" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 56px;
                height: 56px;
                border-radius: 50%;
                background: #ff4081;
                color: white;
                border: none;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                z-index: 9999;
            ">⚡</button>
        `;
        document.body.appendChild(fab);
        
        // Add click handler
        document.getElementById('tamper-fab').addEventListener('click', () => {
            alert(`TamperCell Active!\nLoad time: ${timing}ms\nAll features: ${Object.values(features).every(Boolean) ? '✅' : '⚠️'}`);
        });
    }
})();
```

## 🖥️ Custom Console Examples

### Example 1: Basic Console Enhancement

```javascript
// ==UserScript==
// @name         Enhanced Debugging Console
// @match        https://yoursite.com/*
// @require      https://cdn.jsdelivr.net/npm/tampercell@latest/dist/custom-console.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Inject CSS
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/custom-console/main.min.css';

    // Initialize libraries
    style.onload = window.CustomConsole;

    document.head.appendChild(style);
    
    // Test different log types
    setTimeout(() => {
        console.log('🔧 Console initialized successfully');
        console.info('ℹ️ This is an info message');
        console.warn('⚠️ This is a warning');
        console.error('❌ This is an error (but not really)');
        
        // Log complex objects
        console.log('Complex Object:', {
            user: {
                name: 'John Doe',
                age: 30,
                preferences: {
                    theme: 'dark',
                    language: 'en'
                }
            },
            actions: ['login', 'browse', 'purchase'],
            metadata: new Date()
        });
        
        // Log functions
        console.log('Function:', function testFunction(a, b) {
            return a + b;
        });
        
        // Log DOM elements
        console.log('DOM Element:', document.querySelector('body'));
        
    }, 1000);
})();
```

### Example 2: Interactive Console with Custom Commands

```javascript
// ==UserScript==
// @name         Interactive Debug Console
// @match        https://webapp.com/*
// @require      https://cdn.jsdelivr.net/npm/tampercell@latest/dist/custom-console.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Inject CSS
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/custom-console/main.min.css';

    // Initialize libraries
    style.onload = window.CustomConsole;

    document.head.appendChild(style);
    
    // Add custom global functions for console interaction
    window.customHelpers = {
        // Page analysis
        analyzePage() {
            const stats = {
                elements: document.querySelectorAll('*').length,
                images: document.querySelectorAll('img').length,
                links: document.querySelectorAll('a').length,
                scripts: document.querySelectorAll('script').length,
                styles: document.querySelectorAll('style, link[rel="stylesheet"]').length
            };
            
            console.log('📊 Page Analysis:', stats);
            return stats;
        },
        
        // Find elements by text
        findByText(text) {
            const xpath = `//*[contains(text(), '${text}')]`;
            const result = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
            const elements = [];
            
            for (let i = 0; i < result.snapshotLength; i++) {
                elements.push(result.snapshotItem(i));
            }
            
            console.log(`🔍 Found ${elements.length} elements containing "${text}":`, elements);
            return elements;
        },
        
        // Monitor network requests
        monitorNetwork() {
            const originalFetch = window.fetch;
            const originalXHR = window.XMLHttpRequest.prototype.open;
            
            // Override fetch
            window.fetch = function(...args) {
                console.log('🌐 Fetch Request:', args[0], args[1]);
                return originalFetch.apply(this, args);
            };
            
            // Override XMLHttpRequest
            window.XMLHttpRequest.prototype.open = function(method, url) {
                console.log('🌐 XHR Request:', method, url);
                return originalXHR.apply(this, arguments);
            };
            
            console.log('📡 Network monitoring enabled');
        },
        
        // Performance monitoring
        measurePerformance() {
            const metrics = performance.getEntriesByType('navigation')[0];
            const timing = {
                'DNS Lookup': metrics.domainLookupEnd - metrics.domainLookupStart,
                'TCP Connection': metrics.connectEnd - metrics.connectStart,
                'Request': metrics.responseStart - metrics.requestStart,
                'Response': metrics.responseEnd - metrics.responseStart,
                'DOM Processing': metrics.domComplete - metrics.domLoading,
                'Load Complete': metrics.loadEventEnd - metrics.loadEventStart
            };
            
            console.log('⚡ Performance Metrics (ms):', timing);
            return timing;
        },
        
        // Cleanup
        reset() {
            console.clear();
            console.log('🧹 Console reset. Available helpers:', Object.keys(window.customHelpers));
        }
    };
    
    // Welcome message
    setTimeout(() => {
        console.log('🎮 Interactive Debug Console Ready!');
        console.log('Available helpers:', Object.keys(window.customHelpers));
        console.log('Try: customHelpers.analyzePage()');
    }, 500);
})();
```

### Example 3: Console with Error Tracking

```javascript
// ==UserScript==
// @name         Error Tracking Console
// @match        https://errorprone-site.com/*
// @require      https://cdn.jsdelivr.net/npm/tampercell@latest/dist/custom-console.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Inject CSS
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/custom-console/main.min.css';

    // Initialize libraries
    style.onload = window.CustomConsole;

    document.head.appendChild(style);
    
    // Error tracking
    const errorTracker = {
        errors: [],
        warnings: [],
        
        init() {
            // Global error handler
            window.addEventListener('error', (event) => {
                const error = {
                    message: event.message,
                    filename: event.filename,
                    line: event.lineno,
                    column: event.colno,
                    stack: event.error?.stack,
                    timestamp: new Date().toISOString()
                };
                
                this.errors.push(error);
                console.error('🚨 JavaScript Error:', error);
            });
            
            // Unhandled promise rejection
            window.addEventListener('unhandledrejection', (event) => {
                const error = {
                    reason: event.reason,
                    promise: event.promise,
                    timestamp: new Date().toISOString()
                };
                
                this.errors.push(error);
                console.error('🚨 Unhandled Promise Rejection:', error);
            });
            
            // Console warn override
            const originalWarn = console.warn;
            console.warn = (...args) => {
                this.warnings.push({
                    args,
                    timestamp: new Date().toISOString(),
                    stack: new Error().stack
                });
                originalWarn.apply(console, args);
            };
        },
        
        getReport() {
            const report = {
                errors: this.errors.length,
                warnings: this.warnings.length,
                lastError: this.errors[this.errors.length - 1],
                lastWarning: this.warnings[this.warnings.length - 1],
                allErrors: this.errors,
                allWarnings: this.warnings
            };
            
            console.log('📋 Error Report:', report);
            return report;
        },
        
        exportReport() {
            const report = this.getReport();
            const blob = new Blob([JSON.stringify(report, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `error-report-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            console.log('📥 Error report downloaded');
        }
    };
    
    // Initialize error tracking
    errorTracker.init();
    
    // Add to global scope
    window.errorTracker = errorTracker;
    
    // Welcome and test
    setTimeout(() => {
        console.log('🛡️ Error Tracking Console Ready!');
        console.log('Commands: errorTracker.getReport(), errorTracker.exportReport()');
        
        // Create a test warning
        console.warn('⚠️ This is a test warning to demonstrate tracking');
    }, 500);
})();
```

## 🔗 Advanced Integration

### Example 1: Combined Next Observer + Custom Console

```javascript
// ==UserScript==
// @name         Full TamperCell Integration
// @match        https://nextjs-app.com/*
// @require      https://cdn.jsdelivr.net/npm/tampercell@latest/dist/next-observer.min.js
// @require      https://cdn.jsdelivr.net/npm/tampercell@latest/dist/custom-console.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/custom-console/main.min.css';

    // Initialize libraries
    // Initialize both libraries
    style.onload = window.CustomConsole;
    window.NextObserver({
        debug: true,
        timeout: 20000
    });

    document.head.appendChild(style);
    
    // Enhanced logging
    const logger = {
        log: (message, data) => {
            console.log(`[${new Date().toLocaleTimeString()}] ${message}`, data || '');
        },
        
        step: (step, description) => {
            console.log(`🔸 Step ${step}: ${description}`);
        },
        
        success: (message) => {
            console.log(`✅ ${message}`);
        },
        
        error: (message, error) => {
            console.error(`❌ ${message}`, error || '');
        }
    };
    
    // App initialization workflow
    logger.step(1, 'Initializing TamperCell libraries');
    
    window.addEventListener('nextjs:ready', (event) => {
        const { state, timing } = event.detail;
        
        logger.step(2, `Next.js ready detected (${timing}ms)`);
        logger.log('Ready state:', state);
        
        // Check all conditions
        const allReady = Object.values(state).every(Boolean);
        if (allReady) {
            logger.success('All readiness checks passed');
            initializeApp();
        } else {
            logger.error('Some readiness checks failed', state);
            initializeAppFallback();
        }
    });
    
    function initializeApp() {
        logger.step(3, 'Starting main application features');
        
        try {
            // Feature 1: Page enhancement
            enhancePage();
            logger.success('Page enhancement completed');
            
            // Feature 2: Navigation monitoring
            setupNavigationMonitoring();
            logger.success('Navigation monitoring active');
            
            // Feature 3: Performance tracking
            setupPerformanceTracking();
            logger.success('Performance tracking active');
            
            logger.success('🎉 Application fully initialized');
            
        } catch (error) {
            logger.error('Initialization failed', error);
        }
    }
    
    function initializeAppFallback() {
        logger.step(3, 'Starting fallback initialization');
        
        setTimeout(() => {
            logger.log('Fallback timeout reached, proceeding...');
            initializeApp();
        }, 2000);
    }
    
    function enhancePage() {
        // Add custom styles
        const enhancementCSS = `
            .tampercell-enhanced {
                position: relative;
            }
            .tampercell-enhanced::after {
                content: "🚀";
                position: absolute;
                top: 5px;
                right: 5px;
                font-size: 12px;
                opacity: 0.7;
            }
        `;
        
        const styleEl = document.createElement('style');
        styleEl.textContent = enhancementCSS;
        document.head.appendChild(styleEl);
        
        // Enhance buttons
        document.querySelectorAll('button').forEach((btn, index) => {
            btn.classList.add('tampercell-enhanced');
            logger.log(`Enhanced button ${index + 1}:`, btn.textContent);
        });
    }
    
    function setupNavigationMonitoring() {
        // Monitor SPA navigation
        let currentPath = window.location.pathname;
        
        const observer = new MutationObserver(() => {
            if (window.location.pathname !== currentPath) {
                currentPath = window.location.pathname;
                logger.log('🧭 Navigation detected:', currentPath);
                
                // Re-enhance new content
                setTimeout(enhancePage, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    function setupPerformanceTracking() {
        // Track performance metrics
        const startTime = performance.now();
        
        setInterval(() => {
            const metrics = {
                memory: performance.memory ? {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                    limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
                } : 'not available',
                uptime: Math.round(performance.now() - startTime),
                entries: performance.getEntriesByType('navigation').length
            };
            
            logger.log('📊 Performance metrics:', metrics);
        }, 30000); // Every 30 seconds
    }
})();
```

### Example 2: Framework Detection and Adaptation

```javascript
// ==UserScript==
// @name         Universal Framework Detection
// @match        https://spa-framework.com/*
// @require      https://cdn.jsdelivr.net/npm/tampercell@latest/dist/next-observer.min.js
// @require      https://cdn.jsdelivr.net/npm/tampercell@latest/dist/custom-console.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Initialize console first
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/custom-console/main.min.css';

    // Initialize libraries
    style.onload = window.CustomConsole;

    document.head.appendChild(style);
    
    // Framework detection
    const frameworkDetector = {
        frameworks: {},
        
        detect() {
            // React detection
            this.frameworks.react = !!(
                window.React || 
                document.querySelector('[data-reactroot]') ||
                document.querySelector('[data-react-helmet]') ||
                window.__REACT_DEVTOOLS_GLOBAL_HOOK__
            );
            
            // Next.js detection
            this.frameworks.nextjs = !!(
                window.__NEXT_DATA__ ||
                window.next ||
                document.querySelector('script[src*="_next/"]')
            );
            
            // Vue detection
            this.frameworks.vue = !!(
                window.Vue ||
                document.querySelector('[data-v-]') ||
                document.querySelector('script[src*="vue"]')
            );
            
            // Angular detection
            this.frameworks.angular = !!(
                window.ng ||
                window.Angular ||
                document.querySelector('[ng-version]') ||
                document.querySelector('script[src*="angular"]')
            );
            
            // Svelte detection
            this.frameworks.svelte = !!(
                window.__SVELTE__ ||
                document.querySelector('script[src*="svelte"]')
            );
            
            console.log('🔍 Framework Detection Results:', this.frameworks);
            return this.frameworks;
        },
        
        getActiveFramework() {
            const active = Object.entries(this.frameworks)
                .filter(([name, detected]) => detected)
                .map(([name]) => name);
            
            console.log('🎯 Active Frameworks:', active);
            return active;
        }
    };
    
    // Initialize based on detected framework
    function initializeBasedOnFramework() {
        const detected = frameworkDetector.detect();
        const active = frameworkDetector.getActiveFramework();
        
        if (detected.nextjs) {
            console.log('🚀 Next.js detected - using Next Observer');
            initializeNextJs();
        } else if (detected.react) {
            console.log('⚛️ React detected - using React-specific initialization');
            initializeReact();
        } else if (detected.vue) {
            console.log('💚 Vue detected - using Vue-specific initialization');
            initializeVue();
        } else if (detected.angular) {
            console.log('🅰️ Angular detected - using Angular-specific initialization');
            initializeAngular();
        } else {
            console.log('🌐 No SPA framework detected - using generic initialization');
            initializeGeneric();
        }
    }
    
    function initializeNextJs() {
        window.NextObserver({
            debug: true,
            timeout: 20000
        });
        
        window.addEventListener('nextjs:ready', (event) => {
            console.log('✅ Next.js ready!', event.detail);
            setupUniversalFeatures();
        });
    }
    
    function initializeReact() {
        // Wait for React to be ready
        function waitForReact() {
            if (window.React && document.querySelector('[data-reactroot], #root')) {
                console.log('✅ React ready!');
                setupUniversalFeatures();
            } else {
                setTimeout(waitForReact, 100);
            }
        }
        waitForReact();
    }
    
    function initializeVue() {
        // Wait for Vue to be ready
        function waitForVue() {
            if (window.Vue && document.querySelector('[data-v-]')) {
                console.log('✅ Vue ready!');
                setupUniversalFeatures();
            } else {
                setTimeout(waitForVue, 100);
            }
        }
        waitForVue();
    }
    
    function initializeAngular() {
        // Wait for Angular to be ready
        function waitForAngular() {
            if (window.ng && document.querySelector('[ng-version]')) {
                console.log('✅ Angular ready!');
                setupUniversalFeatures();
            } else {
                setTimeout(waitForAngular, 100);
            }
        }
        waitForAngular();
    }
    
    function initializeGeneric() {
        // Generic initialization for non-SPA sites
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('✅ DOM ready!');
                setupUniversalFeatures();
            });
        } else {
            console.log('✅ DOM already ready!');
            setupUniversalFeatures();
        }
    }
    
    function setupUniversalFeatures() {
        console.log('🔧 Setting up universal features...');
        
        // Add framework indicator
        const indicator = document.createElement('div');
        const activeFrameworks = frameworkDetector.getActiveFramework();
        const frameworkText = activeFrameworks.length > 0 
            ? activeFrameworks.join(' + ') 
            : 'Vanilla JS';
            
        indicator.innerHTML = `
            <div style="
                position: fixed;
                bottom: 10px;
                left: 10px;
                background: #333;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-family: monospace;
                font-size: 12px;
                z-index: 9999;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
                🏗️ ${frameworkText} | TamperCell Active
            </div>
        `;
        document.body.appendChild(indicator);
        
        // Add to console helpers
        window.frameworkInfo = frameworkDetector;
        
        console.log('🎉 Universal features initialized!');
        console.log('Try: frameworkInfo.detect() or frameworkInfo.getActiveFramework()');
    }
    
    // Start detection
    initializeBasedOnFramework();
})();
```

## 🐛 Troubleshooting Examples

### Debug Script for Common Issues

```javascript
// ==UserScript==
// @name         TamperCell Debug Helper
// @match        https://*/*
// @require      https://cdn.jsdelivr.net/npm/tampercell@latest/dist/next-observer.min.js
// @require      https://cdn.jsdelivr.net/npm/tampercell@latest/dist/custom-console.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    // Initialize console for debugging
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/custom-console/main.min.css';

    // Initialize libraries
    style.onload = window.CustomConsole;

    document.head.appendChild(style);
    
    // Debug helper
    window.tamperCellDebug = {
        // Check if libraries are loaded
        checkLibraries() {
            const status = {
                NextObserver: typeof window.NextObserver === 'function',
                CustomConsole: typeof window.CustomConsole === 'function',
                nextObserverInstance: !!window.__nextObserver
            };
            
            console.log('📚 Library Status:', status);
            return status;
        },
        
        // Test Next Observer manually
        testNextObserver() {
            if (typeof window.NextObserver !== 'function') {
                console.error('❌ NextObserver not loaded');
                return false;
            }
            
            console.log('🧪 Testing Next Observer...');
            
            window.NextObserver({
                debug: true,
                timeout: 5000
            });
            
            // Check if instance is created
            setTimeout(() => {
                if (window.__nextObserver) {
                    console.log('✅ Next Observer instance created');
                    console.log('State:', window.__nextObserver.state);
                    console.log('Config:', window.__nextObserver.config);
                } else {
                    console.error('❌ Next Observer instance not created');
                }
            }, 1000);
        },
        
        // Force ready event for testing
        forceReady() {
            if (window.__nextObserver) {
                window.__nextObserver.forceReady();
                console.log('🚀 Forced ready event');
            } else {
                console.error('❌ No Next Observer instance found');
            }
        },
        
        // Check DOM state
        checkDOMState() {
            const state = {
                readyState: document.readyState,
                hasContent: document.body?.children.length > 0,
                hasScripts: document.querySelectorAll('script').length > 0,
                hasImages: document.querySelectorAll('img').length > 0,
                nextDetected: !!(window.__NEXT_DATA__ || window.next),
                reactDetected: !!(window.React || document.querySelector('[data-reactroot]')),
                performance: {
                    timing: performance.timing,
                    now: performance.now()
                }
            };
            
            console.log('🔍 DOM State:', state);
            return state;
        },
        
        // Check for common issues
        diagnose() {
            console.log('🔧 Running TamperCell Diagnostic...');
            
            const issues = [];
            
            // Check libraries
            const libs = this.checkLibraries();
            if (!libs.NextObserver) issues.push('NextObserver not loaded');
            if (!libs.CustomConsole) issues.push('CustomConsole not loaded');
            
            // Check DOM
            const dom = this.checkDOMState();
            if (dom.readyState !== 'complete' && dom.readyState !== 'interactive') {
                issues.push('DOM not ready');
            }
            
            // Check for conflicts
            if (window.console.__enhanced) {
                issues.push('Console already enhanced by another script');
            }
            
            // Check CSP
            try {
                eval('1');
            } catch (e) {
                issues.push('Content Security Policy blocking eval()');
            }
            
            if (issues.length === 0) {
                console.log('✅ No issues detected');
            } else {
                console.warn('⚠️ Issues found:', issues);
            }
            
            return { issues, libs, dom };
        },
        
        // Performance test
        performanceTest() {
            console.log('⚡ Running performance test...');
            
            const start = performance.now();
            
            // Test console performance
            for (let i = 0; i < 100; i++) {
                console.log(`Test log ${i}`);
            }
            
            const end = performance.now();
            console.log(`📊 100 console logs took ${end - start}ms`);
            
            return end - start;
        }
    };
    
    // Auto-run basic checks
    setTimeout(() => {
        console.log('🛠️ TamperCell Debug Helper loaded');
        console.log('Available commands:');
        console.log('• tamperCellDebug.checkLibraries()');
        console.log('• tamperCellDebug.testNextObserver()');
        console.log('• tamperCellDebug.checkDOMState()');
        console.log('• tamperCellDebug.diagnose()');
        console.log('• tamperCellDebug.performanceTest()');
        
        // Auto-diagnose
        tamperCellDebug.diagnose();
    }, 1000);
})();
```

## ✅ Best Practices

### 1. Error Handling Pattern

```javascript
// Robust initialization pattern
(function() {
    'use strict';
    
    const initTamperCell = {
        attempts: 0,
        maxAttempts: 3,
        
        async init() {
            try {
                this.attempts++;
                
                // Check prerequisites
                if (!this.checkPrerequisites()) {
                    throw new Error('Prerequisites not met');
                }
                
                // Initialize console (always first)
                await this.initConsole();
                
                // Initialize based on environment
                if (this.isNextJsApp()) {
                    await this.initNextObserver();
                } else {
                    await this.initGeneric();
                }
                
                console.log('✅ TamperCell initialized successfully');
                
            } catch (error) {
                console.error(`❌ Initialization failed (attempt ${this.attempts}):`, error);
                
                if (this.attempts < this.maxAttempts) {
                    setTimeout(() => this.init(), 2000 * this.attempts);
                } else {
                    console.error('🚨 Max attempts reached, initialization failed');
                }
            }
        },
        
        checkPrerequisites() {
            return document.body && 
                   typeof window.CustomConsole === 'function' &&
                   typeof window.NextObserver === 'function';
        },
        
        async initConsole() {
            return new Promise((resolve) => {
                window.CustomConsole();
                setTimeout(resolve, 100);
            });
        },
        
        async initNextObserver() {
            return new Promise((resolve, reject) => {
                window.NextObserver({ debug: true });
                
                const timeout = setTimeout(() => {
                    reject(new Error('NextObserver timeout'));
                }, 30000);
                
                window.addEventListener('nextjs:ready', () => {
                    clearTimeout(timeout);
                    resolve();
                }, { once: true });
            });
        },
        
        async initGeneric() {
            return new Promise((resolve) => {
                if (document.readyState === 'complete') {
                    resolve();
                } else {
                    window.addEventListener('load', resolve, { once: true });
                }
            });
        },
        
        isNextJsApp() {
            return !!(window.__NEXT_DATA__ || window.next);
        }
    };
    
    // Start initialization
    initTamperCell.init();
})();
```

### 2. Memory Management

```javascript
// Clean shutdown pattern
(function() {
    'use strict';
    
    const tamperCellManager = {
        observers: [],
        listeners: [],
        timers: [],
        
        addObserver(observer) {
            this.observers.push(observer);
        },
        
        addEventListener(target, event, handler, options) {
            target.addEventListener(event, handler, options);
            this.listeners.push({ target, event, handler });
        },
        
        setTimeout(callback, delay) {
            const id = setTimeout(callback, delay);
            this.timers.push(id);
            return id;
        },
        
        setInterval(callback, delay) {
            const id = setInterval(callback, delay);
            this.timers.push(id);
            return id;
        },
        
        cleanup() {
            // Disconnect observers
            this.observers.forEach(observer => {
                if (observer.disconnect) observer.disconnect();
            });
            
            // Remove event listeners
            this.listeners.forEach(({ target, event, handler }) => {
                target.removeEventListener(event, handler);
            });
            
            // Clear timers
            this.timers.forEach(id => {
                clearTimeout(id);
                clearInterval(id);
            });
            
            console.log('🧹 TamperCell cleanup completed');
        }
    };
    
    // Auto-cleanup on page unload
    window.addEventListener('beforeunload', () => {
        tamperCellManager.cleanup();
    });
    
    // Make available globally
    window.tamperCellManager = tamperCellManager;
})();
```

---

## 🔗 Related Documentation

- [Next Observer](next-observer.md) - Smart Next.js application detection
- [Custom Console](custom-console.md) - Advanced debugging console
- [API Reference](api-reference.md) - Complete type definitions

---

**Examples - Practical implementations for every scenario** 🚀✨