class NextJsObserver {
    constructor(userConfig = {}) {
        this.readyCallbackExecuted = false;
        this.mutationCount = 0;
        this.mutationTimer = null;
        this.observer = null;
        this.routeChangeCallbacks = [];
        this.routeLoadStartTime = 0;
        this.config = Object.assign({ timeout: 15000, checkInterval: 100, debug: true, minContentCheck: 3, routeChangeDetection: true, routeLoadTimeout: 5000 }, userConfig);
        this.state = {
            nextDetected: false,
            contentLoaded: false,
            scriptsLoaded: false,
            imagesLoaded: false,
            noMoreMutations: false,
            firstPaint: false,
            routeChangeInProgress: false,
            currentRoute: window.location.pathname,
            previousRoute: ''
        };
        this.init();
    }
    log(...args) {
        if (this.config.debug) {
            console.log('[Next.js Observer]', ...args);
        }
    }
    onNextJsReady() {
        if (this.readyCallbackExecuted)
            return;
        this.readyCallbackExecuted = true;
        this.log('✅ Next.js Application is READY!');
        this.log('State:', this.state);
        this.log('Timing:', performance.now().toFixed(2), 'ms');
        const eventDetail = {
            state: this.state,
            timestamp: Date.now(),
            timing: performance.now()
        };
        window.dispatchEvent(new CustomEvent('nextjs:ready', {
            detail: eventDetail
        }));
    }
    detectNextJs() {
        if (this.state.nextDetected)
            return true;
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
        const metaGenerator = document.querySelector('meta[name="generator"]');
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
    checkContentLoaded() {
        if (this.state.contentLoaded)
            return true;
        const { body } = document;
        if (!body)
            return false;
        // Check for substantial content (not just loading spinner)
        const mainContent = body.querySelectorAll('main, article, section, [role="main"], .container, #root, [id*="app"], [id*="root"]');
        if (mainContent.length > 0) {
            // Check for sufficient text content
            let totalTextLength = 0;
            let elementCount = 0;
            mainContent.forEach(el => {
                var _a;
                const text = ((_a = el.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
                totalTextLength += text.length;
                if (text.length > 10)
                    elementCount++;
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
    checkScriptsLoaded() {
        var _a;
        if (this.state.scriptsLoaded)
            return true;
        const nextScripts = document.querySelectorAll('script[src*="/_next/"]');
        if (nextScripts.length === 0)
            return false;
        // Alternative: check window.next or __NEXT_DATA__.props
        if (((_a = window.__NEXT_DATA__) === null || _a === void 0 ? void 0 : _a.props) || window.next) {
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
    checkImagesLoaded() {
        if (this.state.imagesLoaded)
            return true;
        const images = document.querySelectorAll('img');
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
    checkFirstPaint() {
        if (this.state.firstPaint)
            return true;
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
            }
            catch (e) {
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
    checkIfReady() {
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
    onMutationStable() {
        this.log('✓ DOM mutations stable');
        this.state.noMoreMutations = true;
        if (this.checkIfReady()) {
            if (this.observer)
                this.observer.disconnect();
            this.onNextJsReady();
        }
    }
    startObserving() {
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
            if (this.mutationTimer)
                clearTimeout(this.mutationTimer);
            this.mutationTimer = setTimeout(() => this.onMutationStable(), 500); // 500ms without mutation = stable
            // Check on every mutation
            if (this.checkIfReady()) {
                if (this.observer)
                    this.observer.disconnect();
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
                if (this.observer)
                    this.observer.disconnect();
                this.onNextJsReady();
            }
            if (checkCount * this.config.checkInterval >= this.config.timeout) {
                clearInterval(pollingInterval);
                if (this.observer)
                    this.observer.disconnect();
                this.log('⚠️ Timeout reached');
                // Force trigger if at least Next.js detected
                if (this.state.nextDetected) {
                    this.log('Forcing ready callback (Next.js detected)');
                    this.onNextJsReady();
                }
            }
        }, this.config.checkInterval);
    }
    attachImageListeners() {
        window.addEventListener('load', () => {
            this.log('✓ Window load event');
            this.state.imagesLoaded = true;
            if (this.checkIfReady()) {
                if (this.observer)
                    this.observer.disconnect();
                this.onNextJsReady();
            }
        });
    }
    init() {
        this.log('Next.js Observer initialized');
        this.attachImageListeners();
        this.setupRouteChangeDetection();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.log('✓ DOMContentLoaded');
                this.startObserving();
            });
        }
        else {
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
        // Setup route change detection
        this.setupRouteChangeDetection();
        // Expose for debugging
        const debugInstance = {
            state: this.state,
            config: this.config,
            forceCheck: () => this.checkIfReady(),
            forceReady: () => this.onNextJsReady(),
            detectNext: () => this.detectNextJs(),
            getCurrentRoute: () => this.getCurrentRoute(),
            onRouteChange: (callback) => this.onRouteChange(callback)
        };
        window.__nextObserver = debugInstance;
    }
    // Route change detection methods
    onRouteChangeStart(to) {
        const from = this.state.currentRoute;
        if (from === to)
            return; // No actual route change
        this.log('🔄 Route change starting:', from, '->', to);
        this.state.previousRoute = from;
        this.state.currentRoute = to;
        this.state.routeChangeInProgress = true;
        this.routeLoadStartTime = performance.now();
        // Reset content loading states for new route
        this.state.contentLoaded = false;
        this.state.scriptsLoaded = false;
        this.state.imagesLoaded = false;
        this.state.noMoreMutations = false;
        // Dispatch before route change event
        const beforeChangeDetail = {
            from,
            to,
            timestamp: Date.now()
        };
        window.dispatchEvent(new CustomEvent('nextjs:route:before-change', {
            detail: beforeChangeDetail
        }));
        // Notify callbacks
        this.routeChangeCallbacks.forEach(callback => {
            try {
                callback(from, to);
            }
            catch (e) {
                this.log('Error in route change callback:', e);
            }
        });
    }
    onRouteLoadComplete() {
        if (!this.state.routeChangeInProgress)
            return;
        this.log('✅ Route load complete:', this.state.currentRoute);
        this.state.routeChangeInProgress = false;
        const afterLoadDetail = {
            route: this.state.currentRoute,
            timestamp: Date.now(),
            timing: performance.now() - this.routeLoadStartTime,
            state: Object.assign({}, this.state)
        };
        window.dispatchEvent(new CustomEvent('nextjs:route:after-load', {
            detail: afterLoadDetail
        }));
    }
    setupRouteChangeDetection() {
        var _a;
        if (!this.config.routeChangeDetection)
            return;
        this.log('🔗 Setting up route change detection');
        // Store reference to this instance for use in global callbacks
        const self = this;
        // Method 1: Listen to Next.js router events (if available)
        if ((_a = window.next) === null || _a === void 0 ? void 0 : _a.router) {
            const { router } = window.next;
            router.events.on('routeChangeStart', (url) => {
                self.onRouteChangeStart(url);
            });
            router.events.on('routeChangeComplete', () => {
                // Wait a bit for content to load before marking as complete
                setTimeout(() => {
                    if (self.checkContentLoaded()) {
                        self.onRouteLoadComplete();
                    }
                    else {
                        // Check periodically for content loaded
                        self.startRouteLoadObservation();
                    }
                }, 100);
            });
            router.events.on('routeChangeError', () => {
                self.state.routeChangeInProgress = false;
                self.log('❌ Route change error');
            });
        }
        // Method 2: Listen to browser navigation events (popstate)
        window.addEventListener('popstate', () => {
            const newRoute = self.getCurrentRoute();
            if (newRoute !== self.state.currentRoute) {
                self.onRouteChangeStart(newRoute);
                setTimeout(() => self.startRouteLoadObservation(), 100);
            }
        });
        // Method 3: Override pushState and replaceState
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        history.pushState = function (...args) {
            const result = originalPushState.apply(this, args);
            setTimeout(() => {
                const newRoute = window.location.pathname + window.location.search;
                if (newRoute !== self.state.currentRoute) {
                    self.onRouteChangeStart(newRoute);
                    setTimeout(() => self.startRouteLoadObservation(), 100);
                }
            }, 0);
            return result;
        };
        history.replaceState = function (...args) {
            const result = originalReplaceState.apply(this, args);
            setTimeout(() => {
                const newRoute = window.location.pathname + window.location.search;
                if (newRoute !== self.state.currentRoute) {
                    self.onRouteChangeStart(newRoute);
                    setTimeout(() => self.startRouteLoadObservation(), 100);
                }
            }, 0);
            return result;
        };
    }
    startRouteLoadObservation() {
        if (!this.state.routeChangeInProgress)
            return;
        this.log('👀 Starting route load observation');
        let checkCount = 0;
        const maxChecks = this.config.routeLoadTimeout / this.config.checkInterval;
        const checkInterval = setInterval(() => {
            checkCount++;
            // Check if new route content is loaded
            const isContentLoaded = this.checkContentLoaded();
            const isScriptsLoaded = this.checkScriptsLoaded();
            const isImagesLoaded = this.checkImagesLoaded();
            if (isContentLoaded && isScriptsLoaded && isImagesLoaded) {
                clearInterval(checkInterval);
                this.onRouteLoadComplete();
                return;
            }
            if (checkCount >= maxChecks) {
                clearInterval(checkInterval);
                this.log('⚠️ Route load timeout reached');
                this.onRouteLoadComplete(); // Force complete
            }
        }, this.config.checkInterval);
    }
    // Public method to force check
    forceCheck() {
        return this.checkIfReady();
    }
    // Public method to force ready
    forceReady() {
        this.onNextJsReady();
    }
    // Public method to detect Next.js
    detectNext() {
        return this.detectNextJs();
    }
    // Public method to get current route
    getCurrentRoute() {
        return this.state.currentRoute;
    }
    // Public method to add route change callback
    onRouteChange(callback) {
        this.routeChangeCallbacks.push(callback);
    }
}
// Export the function to window for tampermonkey usage
window.NextObserver = (config) => {
    new NextJsObserver(config);
};
//# sourceMappingURL=main.esm.js.map
