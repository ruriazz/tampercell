// Next.js Observer Types and Interfaces

export interface NextObserverConfig {
    timeout?: number;
    checkInterval?: number;
    debug?: boolean;
    minContentCheck?: number;
    routeChangeDetection?: boolean; // Enable route change detection
    routeLoadTimeout?: number; // Timeout for route load detection
}

export interface NextObserverState {
    nextDetected: boolean;
    contentLoaded: boolean;
    scriptsLoaded: boolean;
    imagesLoaded: boolean;
    noMoreMutations: boolean;
    firstPaint: boolean;
    routeChangeInProgress: boolean;
    currentRoute: string;
    previousRoute: string;
}

export interface NextReadyEventDetail {
    state: NextObserverState;
    timestamp: number;
    timing: number;
}

export interface NextRouteChangeEventDetail {
    from: string;
    to: string;
    timestamp: number;
}

export interface NextRouteLoadEventDetail {
    route: string;
    timestamp: number;
    timing: number;
    state: NextObserverState;
}

export interface NextObserverInstance {
    state: NextObserverState;
    config: Required<NextObserverConfig>;
    forceCheck: () => boolean;
    forceReady: () => void;
    detectNext: () => boolean;
    getCurrentRoute: () => string;
    onRouteChange: (callback: (from: string, to: string) => void) => void;
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
        'nextjs:route:before-change': CustomEvent<NextRouteChangeEventDetail>;
        'nextjs:route:after-load': CustomEvent<NextRouteLoadEventDetail>;
    }
}