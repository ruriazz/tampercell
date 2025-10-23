# 🖥️ Custom Console

> **Advanced console viewer with object inspection, filtering, and JavaScript execution capabilities**

Custom Console provides a powerful, interactive console overlay for debugging and development within any web page. Perfect for Tampermonkey scripts that need advanced logging and object inspection capabilities.

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Basic Usage](#-basic-usage)
- [Features in Detail](#-features-in-detail)
- [Object Inspection](#-object-inspection)
- [JavaScript Execution](#-javascript-execution)
- [Filtering & Search](#-filtering--search)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [UI Controls](#-ui-controls)
- [Advanced Examples](#-advanced-examples)
- [Customization](#-customization)
- [Troubleshooting](#-troubleshooting)

## ✨ Features

- 🔍 **Advanced Object Inspector** - Deep object exploration with circular reference handling
- 🎯 **Smart Filtering** - Filter logs by type (log, warn, error, info, debug, result)
- 🔎 **Real-time Search** - Search through log entries instantly
- ⚡ **JavaScript Executor** - Execute JavaScript directly with command history
- 🎨 **Syntax Highlighting** - Beautiful JSON syntax highlighting
- 🔗 **Interactive Functions** - Click to execute object methods
- 📱 **Responsive Design** - Adapts to different screen sizes
- ⌨️ **Keyboard Shortcuts** - Efficient navigation and execution
- 💾 **Command History** - Navigate through previous commands
- 🎪 **Auto-resize Editor** - Dynamically adjusting textarea
- 🔄 **Console Override** - Captures all console methods
- 📊 **Performance Friendly** - Efficient rendering and memory management

## 📦 Installation

### CDN (Recommended for Tampermonkey)

```javascript
// ==UserScript==
// @require https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/custom-console/main.min.js
// @resource CUSTOM_CONSOLE_CSS https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/custom-console/main.min.css
// @grant none
// ==/UserScript==
```

### Available Builds

| Build | Description | Use Case |
|-------|-------------|----------|
| `main.min.js` + `main.min.css` | Minified production | Production Tampermonkey scripts |
| `main.js` + `main.css` | Unminified development | Development/debugging |
| `main.esm.js` | ES modules | Modern bundlers |
| `main.cjs.js` | CommonJS | Node.js environments |

## 🚀 Basic Usage

### Simple Implementation

```javascript
// ==UserScript==
// @require https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/custom-console/main.min.js
// @resource CUSTOM_CONSOLE_CSS https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/custom-console/main.min.css
// @grant none
// ==/UserScript==

(function() {
    'use strict';
    
    // Load CSS
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/custom-console/main.min.css';

    // Initialize libraries
    style.onload = window.CustomConsole;

    document.head.appendChild(style);
})();
```

### Complete Setup with Error Handling

```javascript
(function() {
    'use strict';
    
    try {
        // Load CSS
        const style = document.createElement('link');
        style.rel = 'stylesheet';
        style.href = 'https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/custom-console/main.min.css';

        // Initialize libraries
        style.onload = window.CustomConsole;

        document.head.appendChild(style);
        
    } catch (error) {
        console.error('Failed to initialize Custom Console:', error);
    }
})();
```

## 🔍 Features in Detail

### Console Override

Custom Console automatically overrides all console methods while preserving original functionality:

```javascript
// All these will appear in both browser console and Custom Console
console.log('Regular log message');
console.warn('Warning message');
console.error('Error message');
console.info('Info message');
console.debug('Debug message');

// Original console methods are preserved
const originalLog = console.log; // Still available
```

### Log Entry Types

| Type | Icon | Color | Description |
|------|------|-------|-------------|
| `log` | ⚪ | White | Standard log messages |
| `warn` | 🟡 | Yellow | Warning messages |
| `error` | 🔴 | Red | Error messages |
| `info` | 🔵 | Blue | Information messages |
| `debug` | 🟣 | Purple | Debug messages |
| `result` | 🟢 | Green | JavaScript execution results |

## 🔍 Object Inspection

### Basic Object Logging

```javascript
// Simple objects
const user = {
    name: 'John Doe',
    age: 30,
    email: 'john@example.com'
};

console.log('User:', user);
```

### Complex Object Handling

```javascript
// Complex objects with various data types
const complexObject = {
    // Primitives
    string: 'Hello World',
    number: 42,
    boolean: true,
    nullValue: null,
    undefinedValue: undefined,
    symbol: Symbol('test'),
    bigint: 123456789012345678901234567890n,
    
    // Objects
    nested: {
        deep: {
            value: 'nested data'
        }
    },
    
    // Arrays
    array: [1, 2, 3, 'four', { five: 5 }],
    
    // Functions
    greet: function() { return 'Hello!'; },
    calculate: (x, y) => x + y,
    
    // Built-in objects
    date: new Date(),
    regex: /pattern/gi,
    map: new Map([['key1', 'value1'], ['key2', 'value2']]),
    set: new Set([1, 2, 3, 4, 5]),
    
    // DOM elements (if available)
    element: document.body,
    
    // Circular reference handling
    self: null
};

complexObject.self = complexObject; // Creates circular reference

console.log('Complex Object:', complexObject);
// Custom Console handles circular references gracefully
```

### Interactive Function Execution

When objects contain functions, you can click on them in the console to execute:

```javascript
const calculator = {
    value: 0,
    add: function(x) { 
        this.value += x; 
        return this.value; 
    },
    multiply: function(x) { 
        this.value *= x; 
        return this.value; 
    },
    reset: function() { 
        this.value = 0; 
        return 'Reset complete'; 
    }
};

console.log('Calculator:', calculator);
// Click on function names in the console to execute them!
```

## ⚡ JavaScript Execution

### Basic Execution

The console includes a powerful JavaScript executor with full page context:

```javascript
// Type in the executor and press Ctrl/Cmd + Enter:
document.title = 'Modified by Custom Console';

// Access page variables
console.log('Page URL:', window.location.href);

// Manipulate DOM
document.body.style.backgroundColor = '#f0f0f0';

// Use page functions and variables
if (typeof jQuery !== 'undefined') {
    console.log('jQuery version:', jQuery.fn.jquery);
}
```

### Advanced Execution Examples

```javascript
// Multi-line code execution
function enhancePage() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach((btn, index) => {
        btn.style.border = '2px solid #007acc';
        btn.title = `Enhanced button ${index + 1}`;
    });
    return `Enhanced ${buttons.length} buttons`;
}

enhancePage();

// Async operations
async function fetchData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        console.log('Fetched data:', data);
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

fetchData();

// Complex data manipulation
const users = [
    { name: 'Alice', age: 25, role: 'admin' },
    { name: 'Bob', age: 30, role: 'user' },
    { name: 'Charlie', age: 35, role: 'user' }
];

const adminUsers = users
    .filter(user => user.role === 'admin')
    .map(user => ({ ...user, permissions: ['read', 'write', 'delete'] }));

console.log('Admin users:', adminUsers);
```

### Command History Navigation

- **↑ Arrow**: Previous command
- **↓ Arrow**: Next command  
- **History limit**: 50 commands
- **Persistent**: History maintained during session

## 🎯 Filtering & Search

### Type Filtering

Click the colored filter buttons to show/hide specific log types:

```javascript
// Generate different log types for testing
console.log('This is a log message');
console.warn('This is a warning');
console.error('This is an error'); 
console.info('This is info');
console.debug('This is debug');

// Test JavaScript execution result
2 + 2; // This will show as 'result' type
```

### Search Functionality

Use the search box to filter logs by content:

- **Real-time**: Filters as you type
- **Case-insensitive**: Matches regardless of case
- **Content search**: Searches within log messages
- **Clear search**: Empty search box to show all logs

## ⌨️ Keyboard Shortcuts

### JavaScript Executor

| Shortcut | Action | Description |
|----------|--------|-------------|
| `Ctrl/Cmd + Enter` | Execute | Run the JavaScript code |
| `Shift + Enter` | New Line | Add new line in multi-line code |
| `↑` | History Up | Previous command in history |
| `↓` | History Down | Next command in history |
| `Ctrl/Cmd + A` | Select All | Select all text in editor |
| `Ctrl/Cmd + C` | Copy | Copy selected text |
| `Ctrl/Cmd + V` | Paste | Paste from clipboard |
| `Ctrl/Cmd + X` | Cut | Cut selected text |

### Console Controls

| Action | Method | Description |
|--------|--------|-------------|
| Toggle Console | Click `>_` button | Show/hide the console panel |
| Clear Logs | Click 🗑️ button | Remove all log entries |
| Collapse Editor | Click ↕ button | Minimize/expand code editor |

## 🎛️ UI Controls

### Main Interface

```
┌─────────────────────────────────────────────┐
│ 🗑️ Clear  🔍 Search...  ⚪🟡🔴🔵🟣🟢        │ ← Toolbar
├─────────────────────────────────────────────┤
│                                             │
│  Log entries appear here...                 │ ← Logs Area
│  > Complex objects are expandable           │
│  > Functions are clickable                  │
│                                             │
├─────────────────────────────────────────────┤
│ ↕ Toggle           ▶ Run                    │ ← Editor Header
├─────────────────────────────────────────────┤
│ › Execute JavaScript...                     │ ← Code Editor
└─────────────────────────────────────────────┘
```

### Responsive Design

The console adapts to different screen sizes:

- **Desktop**: Full features with optimal layout
- **Tablet**: Adjusted proportions and touch-friendly controls
- **Mobile**: Compact layout with collapsible sections

## 📋 Advanced Examples

### Debug Complex Applications

```javascript
// ==UserScript==
// @name         Advanced Debugging Console
// @require      https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/custom-console/main.min.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://cdn.jsdelivr.net/gh/ruriazz/tampercell@latest/dist/custom-console/main.min.css';

    // Initialize libraries
    style.onload = window.CustomConsole;

    document.head.appendChild(style);

    // Enhanced debugging utilities
    window.debug = {
        // Log all event listeners on an element
        getEventListeners: function(element) {
            const listeners = getEventListeners(element);
            console.log('Event Listeners:', listeners);
            return listeners;
        },
        
        // Monitor attribute changes
        watchAttributes: function(element, callback) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes') {
                        console.log('Attribute changed:', {
                            element: mutation.target,
                            attribute: mutation.attributeName,
                            oldValue: mutation.oldValue,
                            newValue: mutation.target.getAttribute(mutation.attributeName)
                        });
                        if (callback) callback(mutation);
                    }
                });
            });
            
            observer.observe(element, { 
                attributes: true, 
                attributeOldValue: true 
            });
            
            console.log('Watching attributes on:', element);
            return observer;
        },
        
        // Performance monitoring
        measurePerformance: function(name, fn) {
            const start = performance.now();
            const result = fn();
            const end = performance.now();
            
            console.log(`Performance [${name}]:`, {
                duration: `${(end - start).toFixed(2)}ms`,
                result: result
            });
            
            return result;
        },
        
        // Network request monitoring
        monitorFetch: function() {
            const originalFetch = window.fetch;
            window.fetch = function(...args) {
                console.log('Fetch Request:', args[0], args[1]);
                return originalFetch(...args).then(response => {
                    console.log('Fetch Response:', {
                        url: response.url,
                        status: response.status,
                        statusText: response.statusText,
                        headers: Object.fromEntries(response.headers.entries())
                    });
                    return response;
                });
            };
            console.log('🌐 Fetch monitoring enabled');
        }
    };
    
    console.log('🔧 Advanced debugging tools loaded:', window.debug);
})();
```

### API Testing Console

```javascript
// API testing utilities
window.apiTest = {
    baseURL: 'https://api.example.com',
    
    async get(endpoint, options = {}) {
        const url = this.baseURL + endpoint;
        console.log('🌐 GET Request:', url);
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            const data = await response.json();
            console.log('✅ GET Response:', { url, status: response.status, data });
            return data;
        } catch (error) {
            console.error('❌ GET Error:', { url, error });
            throw error;
        }
    },
    
    async post(endpoint, body, options = {}) {
        const url = this.baseURL + endpoint;
        console.log('🌐 POST Request:', url, body);
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                body: JSON.stringify(body),
                ...options
            });
            
            const data = await response.json();
            console.log('✅ POST Response:', { url, status: response.status, data });
            return data;
        } catch (error) {
            console.error('❌ POST Error:', { url, error });
            throw error;
        }
    }
};

// Usage examples:
// apiTest.get('/users');
// apiTest.post('/users', { name: 'John', email: 'john@example.com' });
```

### Form Analysis Tool

```javascript
// Form debugging and analysis
window.formDebug = {
    analyzeForm: function(form) {
        const formElement = typeof form === 'string' ? document.querySelector(form) : form;
        
        if (!formElement) {
            console.error('Form not found');
            return;
        }
        
        const analysis = {
            element: formElement,
            action: formElement.action,
            method: formElement.method,
            fields: [],
            validation: {}
        };
        
        // Analyze form fields
        const inputs = formElement.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            const field = {
                name: input.name,
                type: input.type,
                value: input.value,
                required: input.required,
                disabled: input.disabled,
                placeholder: input.placeholder,
                pattern: input.pattern,
                min: input.min,
                max: input.max,
                minLength: input.minLength,
                maxLength: input.maxLength
            };
            
            analysis.fields.push(field);
            
            // Check validation
            if (input.checkValidity) {
                analysis.validation[input.name] = {
                    valid: input.checkValidity(),
                    validationMessage: input.validationMessage
                };
            }
        });
        
        console.log('📋 Form Analysis:', analysis);
        return analysis;
    },
    
    fillTestData: function(form) {
        const formElement = typeof form === 'string' ? document.querySelector(form) : form;
        const testData = {
            email: 'test@example.com',
            name: 'Test User',
            phone: '+1234567890',
            age: '25',
            url: 'https://example.com',
            date: '2023-12-25',
            password: 'TestPassword123!'
        };
        
        formElement.querySelectorAll('input').forEach(input => {
            if (testData[input.type] && !input.value) {
                input.value = testData[input.type];
                input.dispatchEvent(new Event('input', { bubbles: true }));
            } else if (testData[input.name] && !input.value) {
                input.value = testData[input.name];
                input.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
        
        console.log('📝 Test data filled for form:', formElement);
    }
};

// Usage:
// formDebug.analyzeForm('#loginForm');
// formDebug.fillTestData('#registrationForm');
```

## 🎨 Customization

### CSS Variables

Custom Console uses CSS variables for easy theming:

```css
/* Add to your @resource CSS or inject via GM_addStyle */
:root {
    --console-bg: #1e1e1e;
    --console-text: #ffffff;
    --console-border: #444444;
    --console-log: #ffffff;
    --console-warn: #ffa500;
    --console-error: #ff4444;
    --console-info: #4488ff;
    --console-debug: #aa88ff;
    --console-result: #44ff44;
}

/* Dark theme example */
.dark-theme {
    --console-bg: #000000;
    --console-text: #00ff00;
    --console-border: #008800;
}

/* Light theme example */
.light-theme {
    --console-bg: #ffffff;
    --console-text: #000000;
    --console-border: #cccccc;
    --console-log: #000000;
    --console-warn: #ff8800;
    --console-error: #cc0000;
    --console-info: #0066cc;
    --console-debug: #6600cc;
    --console-result: #008800;
}
```

### Position and Size

```css
/* Customize console position and size */
.console-viewer-panel {
    top: 50px !important;
    right: 50px !important;
    width: 600px !important;
    height: 400px !important;
}

/* Make it fullscreen */
.console-viewer-panel.fullscreen {
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
}
```

## 🔧 Troubleshooting

### Common Issues

#### Console Not Appearing

```javascript
// Check if console is initialized
if (window.CustomConsole) {
    console.log('Custom Console is available');
} else {
    console.error('Custom Console not loaded');
}

// Check for CSS loading
const cssElements = document.querySelectorAll('style, link[rel="stylesheet"]');
console.log('CSS elements:', cssElements.length);
```

#### Styling Issues

```javascript
// Force reload CSS
const cssText = GM_getResourceText('CUSTOM_CONSOLE_CSS');
if (cssText) {
    GM_addStyle(cssText);
    console.log('CSS reloaded');
} else {
    console.error('CSS resource not found');
}
```

#### Performance Issues

```javascript
// Check log count
const console = document.querySelector('.console-viewer-logs');
const logCount = console?.children.length || 0;
console.log('Current log count:', logCount);

// Clear logs if too many
if (logCount > 1000) {
    document.querySelector('.console-viewer-clear')?.click();
}
```

### Debug Mode

```javascript
// Enable additional debugging
window.CustomConsole();

// Check console state
setTimeout(() => {
    const panel = document.querySelector('.console-viewer-panel');
    const logs = document.querySelector('.console-viewer-logs');
    
    console.log('Console Debug Info:', {
        panelExists: !!panel,
        panelVisible: panel && !panel.classList.contains('hidden'),
        logContainer: !!logs,
        logCount: logs?.children.length || 0
    });
}, 1000);
```

---

## 🔗 Related Documentation

- [Next Observer](next-observer.md) - Smart Next.js application detection
- [API Reference](api-reference.md) - Complete TypeScript interfaces
- [Examples](examples.md) - More real-world usage examples

---

**Custom Console - Advanced debugging made beautiful and powerful** 🖥️✨