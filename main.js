const { Plugin } = require('obsidian');

module.exports = class PopoutSettingsPlugin extends Plugin {
    settingsLeaf = null;

    async onload() {
        // Add a ribbon icon to the UI to open settings in a new window
        this.addRibbonIcon('gear', 'Open Settings in New Window', async () => {
            if (this.settingsLeaf) {
                return;
            }

            // Open a new popout leaf for the settings
            this.settingsLeaf = this.app.workspace.openPopoutLeaf();
            await this.settingsLeaf.open();
            await new Promise(resolve => setTimeout(resolve, 200));

            // Inject custom styles into the popout window
            this.injectStylesetoPopout();
            this.app.setting.open();

            let attempts = 0;
            let modalInterval = setInterval(() => {
                try {
                    const containerEl = this.settingsLeaf?.containerEl;
                    const doc = containerEl?.ownerDocument;
                    const modalContainer = doc?.querySelector('.modal-container.mod-dim');

                    if (!doc || doc.URL !== "about:blank") {
                        clearInterval(modalInterval);
                        return;
                    }

                    // Move the settings modal into the popout window
                    if (modalContainer && containerEl && !containerEl.contains(modalContainer)) {
                        containerEl.appendChild(modalContainer);

                        // Remove unnecessary UI elements (tab bar, new tab button, tab list)
                        [
                            '.workspace-tab-header.tappable',
                            '.workspace-tab-header-new-tab',
                            '.workspace-tab-header-tab-list'
                        ].forEach(sel => doc.querySelector(sel)?.remove());

                        clearInterval(modalInterval);
                    } else if (++attempts > 15) {
                        clearInterval(modalInterval);
                    }
                } catch (err) {
                    clearInterval(modalInterval);
                }
            }, 100);

            // Handler to clean up the modal when the popout window is closed
            const unloadHandler = async () => {
                try {
                    await new Promise(resolve => setTimeout(resolve, 300));
                    const doc = this.settingsLeaf?.containerEl?.ownerDocument;
                    if (!doc || doc.URL !== "about:blank") return;
                    doc.querySelector('.modal-container.mod-dim')?.remove();
                } catch (err) {}
                this.settingsLeaf = null;
            };

            try {
                const win = this.settingsLeaf?.containerEl?.ownerDocument?.defaultView;
                win?.addEventListener('beforeunload', unloadHandler);
                this.register(() => {
                    win?.removeEventListener('beforeunload', unloadHandler);
                    clearInterval(modalInterval);
                });
            } catch (err) {}
        });
    }

    onunload() {
        if (this.settingsLeaf) {
            this.settingsLeaf.detach();
            this.settingsLeaf = null;
        }
    }

    // Inject custom styles into the popout window
    injectStylesetoPopout() {
        if (!this.settingsLeaf?.containerEl?.ownerDocument) return;
        const doc = this.settingsLeaf.containerEl.ownerDocument;
        if (doc.getElementById('popout-settings-custom-style')) return;

        const style = doc.createElement('style');
        style.id = 'popout-settings-custom-style';
        style.textContent = `
            .workspace-leaf-resize-handle {
                position: relative !important;
                overflow: hidden;
            }
            .modal-container.mod-dim {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                width: 100% !important;
                height: 100% !important;                
                z-index: 10 !important;
            }
            .modal.mod-settings.mod-sidebar-layout {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                height: 100% !important;
                width: 100% !important;
                max-width: 100% !important;
                max-height: 100% !important;
                margin: 0px !important;
                border-radius: var(--anp-card-radius, var(--radius-xl)) !important;
            }
            .modal-bg {
                opacity: 0 !important;
                pointer-events: none !important;
            }
            /* 🔥 Hide the close button via CSS (ONLY in the popout!) */
            .modal-close-button {
                display: none !important;
            }
        `;
        doc.head.appendChild(style);
    }
};