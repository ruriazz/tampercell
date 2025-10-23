// Console Viewer Types and Interfaces

export type LogType = 'log' | 'warn' | 'error' | 'info' | 'debug' | 'result';

export interface LogEntry {
    type: LogType;
    message: string;
    time: Date;
}

export interface ConsoleViewerElements {
    toggleBtn: HTMLButtonElement;
    panel: HTMLDivElement;
    logsContainer: HTMLDivElement;
    clearBtn: HTMLButtonElement;
    searchInput: HTMLInputElement;
    filterBtns: NodeListOf<HTMLButtonElement>;
    promptInput: HTMLTextAreaElement;
    runBtn: HTMLButtonElement;
    promptToggle: HTMLButtonElement;
    promptContainer: HTMLDivElement;
}

export interface OriginalConsoleMethods {
    log: typeof console.log;
    warn: typeof console.warn;
    error: typeof console.error;
    info: typeof console.info;
    debug: typeof console.debug;
}

// Configuration constants
export interface ConsoleViewerConfig {
    readonly maxLogEntries: number;
    readonly maxCommandHistory: number;
    readonly maxObjectProperties: number;
    readonly promptInitialHeight: number;
}

// Global window extensions
declare global {
    interface Window {
        CustomConsole: () => void;
        __consoleViewerObjects?: Map<string, any>;
        executeFunction?: (objId: string, propName: string, element: HTMLElement) => void;
        toggleJson?: (id: string) => void;
    }
}