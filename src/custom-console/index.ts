import './style.css';
import type { 
    LogType, 
    LogEntry, 
    ConsoleViewerElements, 
    OriginalConsoleMethods,
    ConsoleViewerConfig 
} from '@types';

class CustomConsoleViewer implements ConsoleViewerConfig {
    // Configuration constants
    readonly maxLogEntries: number = 500;
    readonly maxCommandHistory: number = 50;
    readonly maxObjectProperties: number = 100;
    readonly promptInitialHeight: number = 32;

    private originalConsole: OriginalConsoleMethods;
    private logs: LogEntry[] = [];
    private isVisible: boolean = false;
    private activeFilters: Set<LogType> = new Set(['log', 'warn', 'error', 'info', 'debug', 'result']);
    private searchQuery: string = '';
    private commandHistory: string[] = [];
    private historyIndex: number = -1;
    private isPromptCollapsed: boolean = false;
    private elements!: ConsoleViewerElements;

    constructor() {
        this.originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            info: console.info,
            debug: console.debug
        };
        
        this.init();
    }

    private init(): void {
        this.createElements();
        this.setupEventListeners();
        this.overrideConsoleMethods();
        this.setupGlobalFunctions();
        
        // Initial setup
        console.log('🎉 Console Viewer is ready!');
        setTimeout(() => this.autoResizeTextarea(), 100);
    }

    private createElements(): void {
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'console-viewer-toggle';
        toggleBtn.innerHTML = '>_';
        toggleBtn.title = 'Toggle Console Viewer';
        document.body.appendChild(toggleBtn);

        // Create main panel
        const panel = document.createElement('div');
        panel.className = 'console-viewer-panel hidden';
        panel.innerHTML = this.getPanelHTML();
        document.body.appendChild(panel);

        // Get all elements
        this.elements = {
            toggleBtn,
            panel,
            logsContainer: panel.querySelector('.console-viewer-logs') as HTMLDivElement,
            clearBtn: panel.querySelector('.console-viewer-clear') as HTMLButtonElement,
            searchInput: panel.querySelector('.console-viewer-search input') as HTMLInputElement,
            filterBtns: panel.querySelectorAll('.console-viewer-filter') as NodeListOf<HTMLButtonElement>,
            promptInput: panel.querySelector('.console-viewer-prompt textarea') as HTMLTextAreaElement,
            runBtn: panel.querySelector('.console-viewer-run') as HTMLButtonElement,
            promptToggle: panel.querySelector('.console-viewer-prompt-toggle') as HTMLButtonElement,
            promptContainer: panel.querySelector('.console-viewer-prompt') as HTMLDivElement
        };
    }

    private getPanelHTML(): string {
        return `
            <div class="console-viewer-toolbar">
                <button class="console-viewer-clear">🗑️ Clear</button>
                <div class="console-viewer-search">
                    <input type="text" placeholder="🔍 Search logs...">
                </div>
                <button class="console-viewer-filter log active" data-type="log">
                    <span class="filter-dot"></span>
                </button>
                <button class="console-viewer-filter warn active" data-type="warn">
                    <span class="filter-dot"></span>
                </button>
                <button class="console-viewer-filter error active" data-type="error">
                    <span class="filter-dot"></span>
                </button>
                <button class="console-viewer-filter info active" data-type="info">
                    <span class="filter-dot"></span>
                </button>
                <button class="console-viewer-filter debug active" data-type="debug">
                    <span class="filter-dot"></span>
                </button>
                <button class="console-viewer-filter result active" data-type="result">
                    <span class="filter-dot"></span>
                </button>
            </div>
            <div class="console-viewer-logs"></div>
            <div class="console-viewer-prompt">
                <div class="console-viewer-prompt-header">
                    <button class="console-viewer-prompt-toggle">↕ Toggle</button>
                    <div class="console-viewer-prompt-controls">
                        <button class="console-viewer-run">▶ Run</button>
                    </div>
                </div>
                <textarea placeholder="› Execute JavaScript..." rows="1"></textarea>
            </div>
        `;
    }

    private setupEventListeners(): void {
        // Toggle button
        this.elements.toggleBtn.addEventListener('click', () => this.togglePanel());

        // Clear button
        this.elements.clearBtn.addEventListener('click', () => this.clearLogs());

        // Search input
        this.elements.searchInput.addEventListener('input', (e: Event) => this.handleSearch(e));

        // Filter buttons
        this.elements.filterBtns.forEach((btn: HTMLButtonElement) => {
            btn.addEventListener('click', () => this.handleFilterToggle(btn));
        });

        // Run button
        this.elements.runBtn.addEventListener('click', () => this.executeCode());

        // Prompt input
        this.elements.promptInput.addEventListener('keydown', (e: KeyboardEvent) => this.handlePromptKeydown(e));
        this.elements.promptInput.addEventListener('input', () => this.autoResizeTextarea());
        this.elements.promptInput.addEventListener('contextmenu', (e: MouseEvent) => this.handleContextMenu(e));

        // Prompt toggle
        this.elements.promptToggle.addEventListener('click', () => this.togglePrompt());

        // Window resize
        window.addEventListener('resize', () => this.autoResizeTextarea());
    }

    private togglePanel(): void {
        this.isVisible = !this.isVisible;
        this.elements.panel.classList.toggle('hidden', !this.isVisible);
        if (this.isVisible) {
            setTimeout(() => this.autoResizeTextarea(), 100);
        }
    }

    private clearLogs(): void {
        this.logs = [];
        this.renderLogs();
    }

    private handleSearch(e: Event): void {
        const target = e.target as HTMLInputElement;
        this.searchQuery = target.value.toLowerCase();
        this.renderLogs();
    }

    private handleFilterToggle(btn: HTMLButtonElement): void {
        const type = btn.dataset.type as LogType;
        if (!type) return;

        if (this.activeFilters.has(type)) {
            this.activeFilters.delete(type);
            btn.classList.remove('active');
        } else {
            this.activeFilters.add(type);
            btn.classList.add('active');
        }
        this.renderLogs();
    }

    private executeCode(): void {
        const code = this.elements.promptInput.value;
        this.executeJS(code);
        this.elements.promptInput.value = '';
        this.elements.promptInput.style.height = 'auto';
        this.autoResizeTextarea();
    }

    private executeJS(code: string): void {
        if (!code.trim()) return;

        // Update command history
        this.commandHistory.unshift(code);
        if (this.commandHistory.length > this.maxCommandHistory) {
            this.commandHistory.pop();
        }
        this.historyIndex = -1;

        // Add command to logs
        this.logs.push({
            type: 'info',
            message: `› ${code}`,
            time: new Date()
        });

        try {
            const result = eval(code);
            this.logs.push({
                type: 'result',
                message: result !== undefined ? String(result) : 'undefined',
                time: new Date()
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logs.push({
                type: 'error',
                message: `Error: ${errorMessage}`,
                time: new Date()
            });
        }

        this.renderLogs();
    }

    private handlePromptKeydown(e: KeyboardEvent): void {
        // Prevent context menu on keyboard shortcuts
        if ((e.metaKey || e.ctrlKey) && ['a', 'c', 'v', 'x'].includes(e.key)) {
            e.stopPropagation();
        }

        // Cmd/Ctrl + Enter to execute code
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            this.executeCode();
            return;
        }

        // History navigation
        if (e.key === 'ArrowUp' && !e.shiftKey) {
            const cursorAtStart = this.elements.promptInput.selectionStart === 0;
            if (cursorAtStart && this.historyIndex < this.commandHistory.length - 1) {
                e.preventDefault();
                this.historyIndex++;
                this.elements.promptInput.value = this.commandHistory[this.historyIndex];
                this.autoResizeTextarea();
            }
        } else if (e.key === 'ArrowDown' && !e.shiftKey) {
            const cursorAtEnd = this.elements.promptInput.selectionStart === this.elements.promptInput.value.length;
            if (cursorAtEnd) {
                e.preventDefault();
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    this.elements.promptInput.value = this.commandHistory[this.historyIndex];
                } else if (this.historyIndex === 0) {
                    this.historyIndex = -1;
                    this.elements.promptInput.value = '';
                }
                this.autoResizeTextarea();
            }
        }
    }

    private handleContextMenu(e: MouseEvent): void {
        // Only prevent if triggered by keyboard (no mouse position)
        if (e.clientX === 0 && e.clientY === 0) {
            e.preventDefault();
        }
    }

    private togglePrompt(): void {
        this.isPromptCollapsed = !this.isPromptCollapsed;

        if (this.isPromptCollapsed) {
            this.elements.promptContainer.classList.add('collapsed');
            this.elements.promptToggle.textContent = '↑ Expand';
            this.elements.promptInput.style.height = this.promptInitialHeight + 'px';
        } else {
            this.elements.promptContainer.classList.remove('collapsed');
            this.elements.promptToggle.textContent = '↓ Collapse';
            this.autoResizeTextarea();
        }
    }

    private autoResizeTextarea(): void {
        if (!this.elements.panel.offsetHeight) return; // Panel not visible yet

        const panelHeight = this.elements.panel.offsetHeight;
        const maxHeight = Math.floor(panelHeight * 0.7); // 70% of panel height
        const minHeight = 32;
        const threshold20Percent = Math.floor(panelHeight * 0.2); // 20% threshold

        // Reset height to calculate scroll height
        this.elements.promptInput.style.height = 'auto';

        // Calculate new height
        let newHeight = Math.max(minHeight, this.elements.promptInput.scrollHeight);

        // Limit to max height
        if (newHeight > maxHeight) {
            newHeight = maxHeight;
            this.elements.promptInput.style.overflowY = 'auto';
        } else {
            this.elements.promptInput.style.overflowY = 'hidden';
        }

        this.elements.promptInput.style.height = newHeight + 'px';
        this.elements.promptInput.style.maxHeight = maxHeight + 'px';

        // Show/hide toggle button based on height
        if (newHeight > threshold20Percent && !this.isPromptCollapsed) {
            this.elements.promptToggle.classList.add('visible');
            this.elements.promptToggle.textContent = '↓ Collapse';
        } else if (this.isPromptCollapsed) {
            this.elements.promptToggle.classList.add('visible');
            this.elements.promptToggle.textContent = '↑ Expand';
        } else {
            this.elements.promptToggle.classList.remove('visible');
        }
    }

    private addLog(type: LogType, args: any[]): void {
        const processedArgs = args.map(arg => {
            if (typeof arg === 'object' && arg !== null) {
                return this.formatObject(arg);
            }
            return String(arg);
        });

        this.logs.push({
            type,
            message: processedArgs.join(' '),
            time: new Date()
        });

        if (this.logs.length > this.maxLogEntries) {
            this.logs.shift();
        }

        this.renderLogs();
    }

    private formatObject(obj: any, visited = new WeakSet()): string {
        // Handle null and undefined
        if (obj === null) return '<span class="json-null">null</span>';
        if (obj === undefined) return '<span class="json-null">undefined</span>';

        // Handle primitives
        const type = typeof obj;
        if (type === 'string') return `<span class="json-string">"${this.escapeHtml(obj)}"</span>`;
        if (type === 'number') return `<span class="json-number">${obj}</span>`;
        if (type === 'boolean') return `<span class="json-boolean">${obj}</span>`;
        if (type === 'symbol') return `<span class="json-null">${obj.toString()}</span>`;
        if (type === 'bigint') return `<span class="json-number">${obj}n</span>`;

        // Handle functions
        if (type === 'function') {
            const funcStr = obj.toString();
            const preview = funcStr.length > 50 ? funcStr.substring(0, 50) + '...' : funcStr;
            return `<span class="json-null">ƒ ${obj.name || 'anonymous'}() { ${this.escapeHtml(preview)} }</span>`;
        }

        // Check circular reference
        if (visited.has(obj)) {
            return '<span class="json-null">[Circular Reference]</span>';
        }

        try {
            visited.add(obj);
            return this.formatComplexObject(obj, visited);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            try {
                return `<span class="json-null">[${obj.constructor?.name || typeof obj}]</span>`;
            } catch (e2) {
                return '<span class="json-null">[Object]</span>';
            }
        }
    }

    private formatComplexObject(obj: any, visited: WeakSet<object>): string {
        // Handle Date
        if (obj instanceof Date) {
            return `<span class="json-string">${obj.toISOString()}</span>`;
        }

        // Handle RegExp
        if (obj instanceof RegExp) {
            return `<span class="json-string">${obj.toString()}</span>`;
        }

        // Handle Error
        if (obj instanceof Error) {
            return this.createJsonDisplay({
                name: obj.name,
                message: obj.message,
                stack: obj.stack
            }, obj.name);
        }

        // Handle Map
        if (obj instanceof Map) {
            const mapObj: Record<string, any> = {};
            obj.forEach((value, key) => {
                mapObj[`${key} =>`] = value;
            });
            return this.createJsonDisplay(mapObj, `Map(${obj.size})`);
        }

        // Handle Set
        if (obj instanceof Set) {
            const setArray = Array.from(obj);
            return this.createJsonDisplay(setArray, `Set(${obj.size})`);
        }

        // Handle Array
        if (Array.isArray(obj)) {
            return this.createJsonDisplay(obj, `Array(${obj.length})`);
        }

        // Handle DOM Elements
        if (typeof Element !== 'undefined' && obj instanceof Element) {
            const tagName = obj.tagName ? obj.tagName.toLowerCase() : 'element';
            const id = obj.id ? `#${obj.id}` : '';
            const classes = obj.className ? `.${obj.className.replace(/\s+/g, '.')}` : '';
            return `<span class="json-null">&lt;${tagName}${id}${classes}&gt;</span>`;
        }

        // Handle other DOM nodes
        if (typeof Node !== 'undefined' && obj instanceof Node) {
            return `<span class="json-null">[${obj.constructor.name}]</span>`;
        }

        // Handle native browser objects
        const nativeObjectTypes = [
            'Window', 'Document', 'HTMLDocument', 'Location', 'Navigator',
            'Screen', 'History', 'Storage', 'Performance', 'Console',
            'MediaDevices', 'AudioContext', 'WebGLRenderingContext',
            'CanvasRenderingContext2D', 'XMLHttpRequest', 'WebSocket'
        ];

        const constructorName = obj.constructor?.name || '';
        if (nativeObjectTypes.includes(constructorName) ||
            constructorName.includes('Element') ||
            constructorName.includes('HTML') ||
            constructorName.includes('SVG')) {
            
            const safeProps = this.extractSafeProperties(obj, visited);
            return this.createJsonDisplay(safeProps, constructorName);
        }

        // Handle ArrayBuffer and TypedArrays
        if (obj instanceof ArrayBuffer || ArrayBuffer.isView(obj)) {
            const typeName = obj.constructor.name;
            const length = (obj as any).byteLength || (obj as any).length || 0;
            return `<span class="json-null">${typeName}(${length})</span>`;
        }

        // Handle Promise
        if (obj instanceof Promise) {
            return '<span class="json-null">Promise {&lt;pending&gt;}</span>';
        }

        // Handle plain objects
        const safeObj = this.extractSafeProperties(obj, visited);
        const objName = constructorName !== 'Object' ? constructorName : null;
        return this.createJsonDisplay(safeObj, objName);
    }

    private extractSafeProperties(obj: any, visited = new WeakSet()): Record<string, any> {
        const props: Record<string, any> = {};
        let count = 0;

        try {
            // Get own enumerable properties first
            for (const prop in obj) {
                if (count >= this.maxObjectProperties) {
                    props['...'] = 'more properties';
                    break;
                }

                try {
                    let value = obj[prop];

                    if (typeof value === 'function') {
                        value = `[Function: ${prop}]`;
                    } else if (typeof value === 'object' && value !== null && visited.has(value)) {
                        value = '[Circular]';
                    }

                    props[prop] = value;
                    count++;
                } catch (e) {
                    const errorMessage = e instanceof Error ? e.message : String(e);
                    props[prop] = `[Error: ${errorMessage}]`;
                    count++;
                }
            }

            // Get own non-enumerable properties
            const ownProps = Object.getOwnPropertyNames(obj);
            for (const prop of ownProps) {
                if (props.hasOwnProperty(prop) || count >= this.maxObjectProperties) continue;

                try {
                    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
                    if (!descriptor) continue;

                    let value: any;
                    if (descriptor.get || descriptor.set) {
                        value = '[Getter/Setter]';
                    } else if (typeof descriptor.value === 'function') {
                        value = `[Function: ${prop}]`;
                    } else {
                        try {
                            value = obj[prop];
                            if (typeof value === 'object' && value !== null && visited.has(value)) {
                                value = '[Circular]';
                            }
                        } catch (e) {
                            value = '[Error accessing]';
                        }
                    }

                    props[prop] = value;
                    count++;
                } catch (e) {
                    // Skip
                }
            }

            // Get prototype properties (methods)
            if (count < this.maxObjectProperties && obj.constructor && obj.constructor.name !== 'Object') {
                const proto = Object.getPrototypeOf(obj);
                if (proto && proto !== Object.prototype) {
                    const protoProps = Object.getOwnPropertyNames(proto);
                    for (const prop of protoProps) {
                        if (props.hasOwnProperty(prop) || count >= this.maxObjectProperties) continue;
                        if (prop === 'constructor') continue;

                        try {
                            const descriptor = Object.getOwnPropertyDescriptor(proto, prop);
                            if (!descriptor) continue;

                            if (typeof descriptor.value === 'function') {
                                props[prop] = `[Function: ${prop}]`;
                                count++;
                            } else if (descriptor.get || descriptor.set) {
                                props[prop] = '[Getter/Setter]';
                                count++;
                            }
                        } catch (e) {
                            // Skip
                        }
                    }
                }
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            return { error: errorMessage };
        }

        return props;
    }

    private createJsonDisplay(obj: any, objectName: string | null = null): string {
        const id = 'json_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const objId = 'obj_' + id;

        // Store object reference for function execution
        if (!window.__consoleViewerObjects) {
            window.__consoleViewerObjects = new Map();
        }
        window.__consoleViewerObjects.set(objId, obj);

        // Try to stringify with circular reference handling
        let jsonString: string;
        try {
            const seen = new WeakSet();
            jsonString = JSON.stringify(obj, (key, value) => {
                if (typeof value === 'object' && value !== null) {
                    if (seen.has(value)) {
                        return '[Circular]';
                    }
                    seen.add(value);

                    // Handle special types
                    if (value instanceof Date) return value.toISOString();
                    if (value instanceof RegExp) return value.toString();
                    if (value instanceof Error) return `Error: ${value.message}`;
                    if (typeof value.toString === 'function' &&
                        value.toString !== Object.prototype.toString &&
                        !Array.isArray(value)) {
                        const str = value.toString();
                        if (str !== '[object Object]') {
                            return str;
                        }
                    }
                }
                if (typeof value === 'function') {
                    return `[Function: ${value.name || 'anonymous'}]`;
                }
                if (typeof value === 'symbol') {
                    return value.toString();
                }
                if (typeof value === 'bigint') {
                    return value.toString() + 'n';
                }
                if (value === undefined) {
                    return '[undefined]';
                }
                return value;
            }, 2);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            jsonString = `"[Error formatting object: ${errorMessage}]"`;
        }

        const formattedJson = this.syntaxHighlightJson(jsonString, objId);
        const displayName = objectName || (Array.isArray(obj) ? 'Array' : 'Object');
        const itemCount = Array.isArray(obj) ? obj.length : Object.keys(obj).length;

        return `<div class="json-container">
                <div class="json-header" onclick="toggleJson('${id}')">
                    <span class="json-toggle" id="toggle_${id}">▼</span>
                    <span>${displayName}(${itemCount})</span>
                </div>
                <div class="json-content" id="${id}" data-obj-id="${objId}">
                    ${formattedJson}
                </div>
            </div>`;
    }

    private syntaxHighlightJson(json: string, objId: string): string {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        const lines = json.split('\n');
        const highlightedLines = lines.map(line => {
            const leadingSpaces = line.match(/^(\s*)/)?.[1] || '';
            const content = line.trim();

            if (!content) return '';

            // Extract property name for function detection
            const funcMatch = content.match(/"([^"]+)":\s*"\[Function:\s*([^\]]+)\]"/);

            const highlighted = content.replace(
                /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
                (match) => {
                    let cls = 'json-number';
                    if (/^"/.test(match)) {
                        if (/:$/.test(match)) {
                            cls = 'json-key';
                        } else {
                            cls = 'json-string';
                        }
                    } else if (/true|false/.test(match)) {
                        cls = 'json-boolean';
                    } else if (/null/.test(match)) {
                        cls = 'json-null';
                    }
                    return '<span class="' + cls + '">' + match + '</span>';
                }
            ).replace(/([{}[\],])/g, '<span class="json-bracket">$1</span>');

            // Make functions clickable
            let finalHighlighted = highlighted;
            if (funcMatch) {
                const propName = funcMatch[1];
                finalHighlighted = highlighted.replace(
                    /"\[Function:[^\]]+\]"/g,
                    `<span class="json-function" onclick="executeFunction('${objId}', '${propName}', this)" style="cursor: pointer; text-decoration: underline;">"[Function: ${propName}]"</span>`
                );
            } else {
                // Also handle getter/setter
                finalHighlighted = highlighted.replace(
                    /"\[Getter\/Setter\]"/g,
                    '<span class="json-null">"[Getter/Setter]"</span>'
                );
            }

            const indentHtml = leadingSpaces.replace(/ /g, '&nbsp;');
            return indentHtml + finalHighlighted;
        });

        return highlightedLines.join('<br>');
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    private renderLogs(): void {
        const filtered = this.logs.filter(log => {
            const matchesFilter = this.activeFilters.has(log.type);
            const matchesSearch = this.searchQuery === '' ||
                log.message.toLowerCase().includes(this.searchQuery);
            return matchesFilter && matchesSearch;
        });

        this.elements.logsContainer.innerHTML = filtered.map(log => `
                <div class="console-log-entry ${log.type}">
                    ${log.message}
                </div>
            `).join('');

        this.elements.logsContainer.scrollTop = this.elements.logsContainer.scrollHeight;
    }

    private overrideConsoleMethods(): void {
        console.log = (...args: any[]) => {
            this.originalConsole.log.apply(console, args);
            this.addLog('log', args);
        };

        console.warn = (...args: any[]) => {
            this.originalConsole.warn.apply(console, args);
            this.addLog('warn', args);
        };

        console.error = (...args: any[]) => {
            this.originalConsole.error.apply(console, args);
            this.addLog('error', args);
        };

        console.info = (...args: any[]) => {
            this.originalConsole.info.apply(console, args);
            this.addLog('info', args);
        };

        console.debug = (...args: any[]) => {
            this.originalConsole.debug.apply(console, args);
            this.addLog('debug', args);
        };
    }

    private setupGlobalFunctions(): void {
        window.executeFunction = (objId: string, propName: string, element: HTMLElement): void => {
            try {
                const obj = window.__consoleViewerObjects?.get(objId);
                if (!obj) {
                    console.error('Object not found');
                    return;
                }

                const func = obj[propName];
                if (typeof func !== 'function') {
                    console.error('Property is not a function');
                    return;
                }

                // Execute function
                const result = func.call(obj);

                // Format result
                const resultHtml = this.formatObject(result);

                // Replace function text with result
                const line = element.parentElement;
                if (line) {
                    const keyMatch = line.innerHTML.match(/<span class="json-key">"([^"]+)"<\/span>/);
                    if (keyMatch) {
                        const key = keyMatch[1];
                        line.innerHTML = `<span class="json-key">"${key}"</span><span class="json-bracket">:</span> ${resultHtml}`;
                    }
                }
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : String(e);
                console.error('Error executing function:', e);
                element.innerHTML = `<span class="json-string">"[Error: ${errorMessage}]"</span>`;
            }
        };

        window.toggleJson = (id: string): void => {
            const content = document.getElementById(id);
            const toggle = document.getElementById(`toggle_${id}`);
            
            if (content && toggle) {
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? 'block' : 'none';
                toggle.textContent = isHidden ? '▼' : '▶';
            }
        };
    }
}

// Export the function to window for tampermonkey usage
window.CustomConsole = (): void => {
    new CustomConsoleViewer();
};

