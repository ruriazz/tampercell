# 📚 API Reference

> **Complete TypeScript interfaces and type definitions for TamperCell libraries**

This document provides comprehensive TypeScript type definitions and API references for all TamperCell libraries.

## 📋 Table of Contents

- [Next Observer Types](#-next-observer-types)
- [Custom Console Types](#-custom-console-types)
- [Global Window Extensions](#-global-window-extensions)
- [Event Interfaces](#-event-interfaces)
- [Utility Types](#-utility-types)

## 🔍 Next Observer Types

### Configuration Interface

```typescript
interface NextObserverConfig {
    /**
     * Maximum wait time in milliseconds before timeout
     * @default 15000
     */
    timeout?: number;
    
    /**
     * Polling interval in milliseconds for readiness checks
     * @default 100
     */
    checkInterval?: number;
    
    /**
     * Enable/disable debug logging to console
     * @default true
     */
    debug?: boolean;
    
    /**
     * Minimum number of content elements required before considering ready
     * @default 3
     */
    minContentCheck?: number;
}
```

### State Interface

```typescript
interface NextObserverState {
    /**
     * Whether Next.js framework has been detected
     */
    nextDetected: boolean;
    
    /**
     * Whether substantial content has been loaded
     */
    contentLoaded: boolean;
    
    /**
     * Whether JavaScript bundles have been loaded
     */
    scriptsLoaded: boolean;
    
    /**
     * Whether images have been loaded (80% threshold)
     */
    imagesLoaded: boolean;
    
    /**
     * Whether DOM mutations have stabilized
     */
    noMoreMutations: boolean;
    
    /**
     * Whether First Contentful Paint has occurred
     */
    firstPaint: boolean;
}
```

### Event Detail Interface

```typescript
interface NextReadyEventDetail {
    /**
     * Current state of all readiness checks
     */
    state: NextObserverState;
    
    /**
     * Timestamp when the event was triggered
     */
    timestamp: number;
    
    /**
     * Time elapsed from script start to ready state (milliseconds)
     */
    timing: number;
}
```

### Observer Instance Interface

```typescript
interface NextObserverInstance {
    /**
     * Current readiness state
     */
    state: NextObserverState;
    
    /**
     * Current configuration with defaults applied
     */
    config: Required<NextObserverConfig>;
    
    /**
     * Manually check if the application is ready
     * @returns true if ready, false otherwise
     */
    forceCheck(): boolean;
    
    /**
     * Force trigger the ready event (use with caution)
     */
    forceReady(): void;
    
    /**
     * Check if Next.js framework is detected
     * @returns true if Next.js detected, false otherwise
     */
    detectNext(): boolean;
}
```

### Next.js Data Interface

```typescript
interface NextData {
    /**
     * Page props data
     */
    props?: any;
    
    /**
     * Current page route
     */
    page?: string;
    
    /**
     * Query parameters
     */
    query?: Record<string, any>;
    
    /**
     * Build identifier
     */
    buildId?: string;
    
    /**
     * Additional Next.js data
     */
    [key: string]: any;
}
```

## 🖥️ Custom Console Types

### Log Type Enum

```typescript
type LogType = 'log' | 'warn' | 'error' | 'info' | 'debug' | 'result';
```

### Log Entry Interface

```typescript
interface LogEntry {
    /**
     * Type of log entry
     */
    type: LogType;
    
    /**
     * Formatted message content (may contain HTML)
     */
    message: string;
    
    /**
     * Timestamp when log entry was created
     */
    time: Date;
}
```

### Console Elements Interface

```typescript
interface ConsoleViewerElements {
    /**
     * Main toggle button (top-right corner)
     */
    toggleBtn: HTMLButtonElement;
    
    /**
     * Main console panel container
     */
    panel: HTMLDivElement;
    
    /**
     * Container for log entries
     */
    logsContainer: HTMLDivElement;
    
    /**
     * Clear logs button
     */
    clearBtn: HTMLButtonElement;
    
    /**
     * Search input field
     */
    searchInput: HTMLInputElement;
    
    /**
     * Filter buttons for log types
     */
    filterBtns: NodeListOf<HTMLButtonElement>;
    
    /**
     * JavaScript code input textarea
     */
    promptInput: HTMLTextAreaElement;
    
    /**
     * Execute JavaScript button
     */
    runBtn: HTMLButtonElement;
    
    /**
     * Collapse/expand prompt toggle button
     */
    promptToggle: HTMLButtonElement;
    
    /**
     * Prompt container element
     */
    promptContainer: HTMLDivElement;
}
```

### Original Console Methods Interface

```typescript
interface OriginalConsoleMethods {
    /**
     * Original console.log method
     */
    log: typeof console.log;
    
    /**
     * Original console.warn method
     */
    warn: typeof console.warn;
    
    /**
     * Original console.error method
     */
    error: typeof console.error;
    
    /**
     * Original console.info method
     */
    info: typeof console.info;
    
    /**
     * Original console.debug method
     */
    debug: typeof console.debug;
}
```

### Console Configuration Interface

```typescript
interface ConsoleViewerConfig {
    /**
     * Maximum number of log entries to keep in memory
     * @default 500
     */
    readonly maxLogEntries: number;
    
    /**
     * Maximum number of commands to keep in history
     * @default 50
     */
    readonly maxCommandHistory: number;
    
    /**
     * Maximum number of object properties to display
     * @default 100
     */
    readonly maxObjectProperties: number;
    
    /**
     * Initial height of the prompt textarea
     * @default 32
     */
    readonly promptInitialHeight: number;
}
```

## 🌐 Global Window Extensions

### Window Interface Extensions

```typescript
declare global {
    interface Window {
        /**
         * Initialize Next Observer with optional configuration
         * @param config Optional configuration object
         */
        NextObserver: (config?: NextObserverConfig) => void;
        
        /**
         * Initialize Custom Console
         */
        CustomConsole: () => void;
        
        /**
         * Next Observer debug instance (available when debug: true)
         */
        __nextObserver?: NextObserverInstance;
        
        /**
         * Next.js data object (present in Next.js applications)
         */
        __NEXT_DATA__?: NextData;
        
        /**
         * Next.js runtime object
         */
        next?: any;
        
        /**
         * Custom Console object storage for interactive functions
         */
        __consoleViewerObjects?: Map<string, any>;
        
        /**
         * Execute function from object inspector
         * @param objId Object identifier
         * @param propName Property name to execute
         * @param element HTML element that triggered the execution
         */
        executeFunction?: (objId: string, propName: string, element: HTMLElement) => void;
        
        /**
         * Toggle JSON display in object inspector
         * @param id Element identifier
         */
        toggleJson?: (id: string) => void;
    }
}
```

## 📅 Event Interfaces

### Window Event Map Extensions

```typescript
declare global {
    interface WindowEventMap {
        /**
         * Fired when Next.js application is ready
         */
        'nextjs:ready': CustomEvent<NextReadyEventDetail>;
    }
}
```

### Custom Event Usage

```typescript
// Event listener with proper typing
window.addEventListener('nextjs:ready', (event: CustomEvent<NextReadyEventDetail>) => {
    const { state, timestamp, timing } = event.detail;
    
    console.log('Next.js ready:', {
        loadTime: timing + 'ms',
        allChecksPass: Object.values(state).every(Boolean)
    });
});

// Manual event dispatch
const customEvent = new CustomEvent('nextjs:ready', {
    detail: {
        state: {
            nextDetected: true,
            contentLoaded: true,
            scriptsLoaded: true,
            imagesLoaded: true,
            noMoreMutations: true,
            firstPaint: true
        },
        timestamp: Date.now(),
        timing: performance.now()
    }
});

window.dispatchEvent(customEvent);
```

## 🛠️ Utility Types

### Helper Types

```typescript
/**
 * Extract keys from an object type
 */
type Keys<T> = keyof T;

/**
 * Make all properties required
 */
type RequiredConfig<T> = Required<T>;

/**
 * Configuration with defaults applied
 */
type ConfigWithDefaults<T> = T & Required<Pick<T, keyof T>>;

/**
 * Event handler function type
 */
type EventHandler<T = any> = (event: CustomEvent<T>) => void;

/**
 * Console method type
 */
type ConsoleMethod = (...args: any[]) => void;

/**
 * Async function type
 */
type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;
```

### Type Guards

```typescript
/**
 * Check if value is a Next Observer configuration
 */
function isNextObserverConfig(value: any): value is NextObserverConfig {
    return typeof value === 'object' && 
           value !== null &&
           (value.timeout === undefined || typeof value.timeout === 'number') &&
           (value.checkInterval === undefined || typeof value.checkInterval === 'number') &&
           (value.debug === undefined || typeof value.debug === 'boolean') &&
           (value.minContentCheck === undefined || typeof value.minContentCheck === 'number');
}

/**
 * Check if value is a log type
 */
function isLogType(value: any): value is LogType {
    return ['log', 'warn', 'error', 'info', 'debug', 'result'].includes(value);
}

/**
 * Check if element is HTML element
 */
function isHTMLElement(value: any): value is HTMLElement {
    return value instanceof HTMLElement;
}
```

### Advanced Types

```typescript
/**
 * Extract function properties from an object type
 */
type FunctionPropertyNames<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

/**
 * Object with only function properties
 */
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

/**
 * Recursive partial type
 */
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Make specific properties optional
 */
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Union type for all possible log content
 */
type LogContent = string | number | boolean | object | null | undefined | Error | Date | RegExp | Map<any, any> | Set<any> | Array<any>;
```

## 📝 Usage Examples

### TypeScript Integration

```typescript
// Import types (if using module bundler)
import type { 
    NextObserverConfig, 
    NextReadyEventDetail,
    LogType,
    LogEntry 
} from '@types';

// Type-safe configuration
const observerConfig: NextObserverConfig = {
    timeout: 20000,
    debug: true,
    checkInterval: 100,
    minContentCheck: 5
};

// Type-safe event handling
const handleNextReady: EventHandler<NextReadyEventDetail> = (event) => {
    const { state, timing } = event.detail;
    
    if (state.nextDetected && state.contentLoaded) {
        console.log(`App ready in ${timing}ms`);
    }
};

window.addEventListener('nextjs:ready', handleNextReady);

// Type-safe logging
const createLogEntry = (type: LogType, message: string): LogEntry => ({
    type,
    message,
    time: new Date()
});

// Type guards usage
function processConfig(config: unknown) {
    if (isNextObserverConfig(config)) {
        window.NextObserver(config);
    } else {
        console.error('Invalid configuration');
    }
}
```

### Runtime Type Checking

```typescript
/**
 * Validate Next Observer configuration at runtime
 */
function validateNextObserverConfig(config: any): config is NextObserverConfig {
    const errors: string[] = [];
    
    if (config.timeout !== undefined) {
        if (typeof config.timeout !== 'number' || config.timeout <= 0) {
            errors.push('timeout must be a positive number');
        }
    }
    
    if (config.checkInterval !== undefined) {
        if (typeof config.checkInterval !== 'number' || config.checkInterval <= 0) {
            errors.push('checkInterval must be a positive number');
        }
    }
    
    if (config.debug !== undefined) {
        if (typeof config.debug !== 'boolean') {
            errors.push('debug must be a boolean');
        }
    }
    
    if (config.minContentCheck !== undefined) {
        if (typeof config.minContentCheck !== 'number' || config.minContentCheck < 0) {
            errors.push('minContentCheck must be a non-negative number');
        }
    }
    
    if (errors.length > 0) {
        console.error('Configuration validation errors:', errors);
        return false;
    }
    
    return true;
}

// Usage
const userConfig = { timeout: 30000, debug: true };
if (validateNextObserverConfig(userConfig)) {
    window.NextObserver(userConfig);
}
```

---

## 🔗 Related Documentation

- [Next Observer](next-observer.md) - Smart Next.js application detection
- [Custom Console](custom-console.md) - Advanced debugging console
- [Examples](examples.md) - Real-world usage examples

---

**API Reference - Complete type safety for TamperCell** 📚✨