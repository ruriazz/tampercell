// Next.js Observer Types and Interfaces

export interface NextObserverConfig {
    timeout?: number;
    checkInterval?: number;
    debug?: boolean;
    minContentCheck?: number;
}

export interface NextObserverState {
    nextDetected: boolean;
    contentLoaded: boolean;
    scriptsLoaded: boolean;
    imagesLoaded: boolean;
    noMoreMutations: boolean;
    firstPaint: boolean;
}

export interface NextReadyEventDetail {
    state: NextObserverState;
    timestamp: number;
    timing: number;
}

export interface NextObserverInstance {
    state: NextObserverState;
    config: Required<NextObserverConfig>;
    forceCheck: () => boolean;
    forceReady: () => void;
    detectNext: () => boolean;
}

// Next.js specific types
export interface NextData {
    props?: any;
    page?: string;
    query?: Record<string, any>;
    buildId?: string;
    [key: string]: any;
}

// Global window extensions for Next Observer
declare global {
    interface Window {
        NextObserver: (config?: NextObserverConfig) => void;
        __nextObserver?: NextObserverInstance;
        __NEXT_DATA__?: NextData;
        next?: any;
    }

    interface WindowEventMap {
        'nextjs:ready': CustomEvent<NextReadyEventDetail>;
    }
}