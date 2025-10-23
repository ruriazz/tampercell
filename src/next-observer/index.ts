import type { 
    NextObserverConfig, 
    NextObserverState, 
    NextReadyEventDetail, 
    NextObserverInstance 
} from '@types';

class NextJsObserver {
    private config: Required<NextObserverConfig>;
    private state: NextObserverState;
    private readyCallbackExecuted: boolean = false;
    private mutationCount: number = 0;
    private mutationTimer: NodeJS.Timeout | null = null;
    private observer: MutationObserver | null = null;

    constructor(userConfig: NextObserverConfig = {}) {
        this.config = {
            timeout: 15000, // 15 seconds timeout
            checkInterval: 100,
            debug: true,
            minContentCheck: 3, // minimum content elements before considered loaded
            ...userConfig
        };

        this.state = {
            nextDetected: false,
            contentLoaded: false,
            scriptsLoaded: false,
            imagesLoaded: false,
            noMoreMutations: false,
            firstPaint: false
        };

        this.init();
    }

    private log(...args: any[]): void {
        if (this.config.debug) {
            console.log('[Next.js Observer]', ...args);
        }
    }

    private onNextJsReady(): void {
        if (this.readyCallbackExecuted) return;
        this.readyCallbackExecuted = true;

        this.log('✅ Next.js Application is READY!');
        this.log('State:', this.state);
        this.log('Timing:', performance.now().toFixed(2), 'ms');

        const eventDetail: NextReadyEventDetail = {
            state: this.state,
            timestamp: Date.now(),
            timing: performance.now()
        };

        window.dispatchEvent(new CustomEvent('nextjs:ready', {
            detail: eventDetail
        }));
    }

    private detectNextJs(): boolean {
        if (this.state.nextDetected) return true;

        // Check __NEXT_DATA__ (exists in production)
        if (window.__NEXT_DATA__) {
            this.log('✓ Detected via __NEXT_DATA__');
            this.state.nextDetected = true;
            return true;
        }

        // Check _next scripts (always exists in production)
        const nextScripts = document.querySelectorAll('script[src*="/_next/"]');
        if (nextScripts.length > 0) {
            this.log('✓ Detected via _next scripts:', nextScripts.length);
            this.state.nextDetected = true;
            return true;
        }

        // Check meta generator
        const metaGenerator = document.querySelector('meta[name="generator"]') as HTMLMetaElement;
        if (metaGenerator && metaGenerator.content.includes('Next.js')) {
            this.log('✓ Detected via meta generator');
            this.state.nextDetected = true;
            return true;
        }

        // Check next-route-announcer (Next.js accessibility feature)
        if (document.querySelector('[aria-live="assertive"]#__next-route-announcer__')) {
            this.log('✓ Detected via route announcer');
            this.state.nextDetected = true;
            return true;
        }

        // Check buildId in scripts
        const allScripts = Array.from(document.scripts);
        const hasBuildId = allScripts.some(s => s.src.match(/\/_next\/static\/[a-zA-Z0-9_-]+\//));
        if (hasBuildId) {
            this.log('✓ Detected via buildId pattern');
            this.state.nextDetected = true;
            return true;
        }

        return false;
    }

    private checkContentLoaded(): boolean {
        if (this.state.contentLoaded) return true;

        const { body } = document;
        if (!body) return false;

        // Check for substantial content (not just loading spinner)
        const mainContent = body.querySelectorAll('main, article, section, [role="main"], .container, #root, [id*="app"], [id*="root"]');

        if (mainContent.length > 0) {
            // Check for sufficient text content
            let totalTextLength = 0;
            let elementCount = 0;

            mainContent.forEach(el => {
                const text = el.textContent?.trim() || '';
                totalTextLength += text.length;
                if (text.length > 10) elementCount++;
            });

            if (elementCount >= this.config.minContentCheck || totalTextLength > 100) {
                this.log('✓ Content loaded:', elementCount, 'elements,', totalTextLength, 'chars');
                this.state.contentLoaded = true;
                return true;
            }
        }

        // Alternative: check if body has enough children
        if (body.children.length > 5) {
            this.log('✓ Content loaded via body children:', body.children.length);
            this.state.contentLoaded = true;
            return true;
        }

        return false;
    }

    private checkScriptsLoaded(): boolean {
        if (this.state.scriptsLoaded) return true;

        const nextScripts = document.querySelectorAll('script[src*="/_next/"]');
        if (nextScripts.length === 0) return false;

        // Alternative: check window.next or __NEXT_DATA__.props
        if (window.__NEXT_DATA__?.props || window.next) {
            this.log('✓ Scripts loaded (Next.js runtime available)');
            this.state.scriptsLoaded = true;
            return true;
        }

        // Check React hydrated
        const hasReactProps = document.querySelector('[data-reactroot], [data-reactid]');
        if (hasReactProps || document.body.querySelector('*[class*="__"]')) {
            this.log('✓ Scripts loaded (React detected)');
            this.state.scriptsLoaded = true;
            return true;
        }

        return false;
    }

    private checkImagesLoaded(): boolean {
        if (this.state.imagesLoaded) return true;

        const images = document.querySelectorAll('img') as NodeListOf<HTMLImageElement>;
        if (images.length === 0) {
            // No images, skip check
            this.state.imagesLoaded = true;
            return true;
        }

        let loadedCount = 0;
        images.forEach(img => {
            if (img.complete && img.naturalHeight > 0) {
                loadedCount++;
            }
        });

        // Tolerance: 80% of images loaded
        const loadPercentage = (loadedCount / images.length) * 100;
        if (loadPercentage >= 80) {
            this.log('✓ Images loaded:', loadedCount, '/', images.length);
            this.state.imagesLoaded = true;
            return true;
        }

        return false;
    }

    private checkFirstPaint(): boolean {
        if (this.state.firstPaint) return true;

        // Use PerformanceObserver for FCP
        if (window.PerformanceObserver) {
            try {
                const perfObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.name === 'first-contentful-paint') {
                            this.log('✓ First Contentful Paint:', entry.startTime.toFixed(2), 'ms');
                            this.state.firstPaint = true;
                        }
                    }
                });
                perfObserver.observe({ entryTypes: ['paint'] });
            } catch (e) {
                // Fallback
                this.state.firstPaint = true;
            }
        }

        // Simple fallback
        if (document.body && document.body.children.length > 0) {
            this.state.firstPaint = true;
            return true;
        }

        return false;
    }

    private checkIfReady(): boolean {
        const isNextDetected = this.detectNextJs();
        const isContentLoaded = this.checkContentLoaded();
        const isScriptsLoaded = this.checkScriptsLoaded();
        const isImagesLoaded = this.checkImagesLoaded();
        const isFirstPaint = this.checkFirstPaint();

        // Next.js ready if:
        // 1. Next.js detected
        // 2. Content exists
        // 3. Scripts loaded
        // 4. First paint occurred
        // (images optional, can be disabled)

        if (isNextDetected && isContentLoaded && isScriptsLoaded && isFirstPaint && isImagesLoaded) {
            return true;
        }

        return false;
    }

    private onMutationStable(): void {
        this.log('✓ DOM mutations stable');
        this.state.noMoreMutations = true;

        if (this.checkIfReady()) {
            if (this.observer) this.observer.disconnect();
            this.onNextJsReady();
        }
    }

    private startObserving(): void {
        this.log('🔍 Starting observation...');

        // Immediate check
        if (this.checkIfReady()) {
            this.onNextJsReady();
            return;
        }

        // MutationObserver
        this.observer = new MutationObserver(() => {
            this.mutationCount++;

            // Reset timer on every mutation
            if (this.mutationTimer) clearTimeout(this.mutationTimer);
            this.mutationTimer = setTimeout(() => this.onMutationStable(), 500); // 500ms without mutation = stable

            // Check on every mutation
            if (this.checkIfReady()) {
                if (this.observer) this.observer.disconnect();
                this.onNextJsReady();
            }
        });

        this.observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });

        // Fallback polling
        let checkCount = 0;
        const pollingInterval = setInterval(() => {
            checkCount++;

            if (this.checkIfReady()) {
                clearInterval(pollingInterval);
                if (this.observer) this.observer.disconnect();
                this.onNextJsReady();
            }

            if (checkCount * this.config.checkInterval >= this.config.timeout) {
                clearInterval(pollingInterval);
                if (this.observer) this.observer.disconnect();
                this.log('⚠️ Timeout reached');

                // Force trigger if at least Next.js detected
                if (this.state.nextDetected) {
                    this.log('Forcing ready callback (Next.js detected)');
                    this.onNextJsReady();
                }
            }
        }, this.config.checkInterval);
    }

    private attachImageListeners(): void {
        window.addEventListener('load', () => {
            this.log('✓ Window load event');
            this.state.imagesLoaded = true;

            if (this.checkIfReady()) {
                if (this.observer) this.observer.disconnect();
                this.onNextJsReady();
            }
        });
    }

    private init(): void {
        this.log('Next.js Observer initialized');

        this.attachImageListeners();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.log('✓ DOMContentLoaded');
                this.startObserving();
            });
        } else {
            this.startObserving();
        }

        // Mark scripts as loaded when they execute
        const scriptObserver = new MutationObserver(() => {
            document.querySelectorAll('script[src*="/_next/"]').forEach(script => {
                if (!script.hasAttribute('data-loaded')) {
                    script.addEventListener('load', () => {
                        script.setAttribute('data-loaded', 'true');
                    });
                }
            });
        });
        scriptObserver.observe(document.documentElement, { childList: true, subtree: true });

        // Expose for debugging
        const debugInstance: NextObserverInstance = {
            state: this.state,
            config: this.config,
            forceCheck: () => this.checkIfReady(),
            forceReady: () => this.onNextJsReady(),
            detectNext: () => this.detectNextJs()
        };

        window.__nextObserver = debugInstance;
    }

    // Public method to force check
    public forceCheck(): boolean {
        return this.checkIfReady();
    }

    // Public method to force ready
    public forceReady(): void {
        this.onNextJsReady();
    }

    // Public method to detect Next.js
    public detectNext(): boolean {
        return this.detectNextJs();
    }
}

// Export the function to window for tampermonkey usage
window.NextObserver = (config?: NextObserverConfig): void => {
    new NextJsObserver(config);
};