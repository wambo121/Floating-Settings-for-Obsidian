const { Plugin } = require('obsidian');

module.exports = class PopoutSettingsPlugin extends Plugin {
    settingsLeaf = null;

    async onload() {
        console.log('PopoutSettingsPlugin loaded');

        // Ribbon icon to toggle popout settings
        this.addRibbonIcon('gear', 'Open Settings in New Window', () => {
            console.log('Ribbon icon clicked');
            this.togglePopoutSettings();
        });
    }

    onunload() {
        console.log('PopoutSettingsPlugin unloaded');
        if (this.settingsLeaf) {
            console.log('Detaching settingsLeaf in onunload');
            this.settingsLeaf.detach();
            this.settingsLeaf = null;
        }
    }

    async togglePopoutSettings() {
        console.log('togglePopoutSettings called');
        // If the popout is already open, bring it to focus.
        if (this.settingsLeaf && !this.settingsLeaf.containerEl.isConnected) {
            console.log('settingsLeaf is not connected, setting to null');
            this.settingsLeaf = null;
        }

        if (this.settingsLeaf) {
            console.log('settingsLeaf already exists, returning');
            return;
        }

        try {
            // Open a new popout leaf (separate window)
            console.log('Opening new popout leaf');
            this.settingsLeaf = this.app.workspace.openPopoutLeaf();
            if (!this.settingsLeaf) {
                throw new Error('Failed to open popout leaf');
            }

            // Wait for the leaf to initialize.
            await this.settingsLeaf.open();
            await new Promise(resolve => setTimeout(resolve, 200));

            // Open the core settings modal.
            console.log('Opening core settings modal');
            this.app.setting.open();

            // Add an event listener to handle the window close event
            const unloadHandler = () => {
                console.log('Popout window unloaded');
                this.settingsLeaf = null;
            };
            this.settingsLeaf.containerEl.addEventListener('unload', unloadHandler);

            // Ensure the event listener is removed when the plugin is unloaded
            this.register(() => {
                if (this.settingsLeaf) {
                    console.log('Removing unload event listener');
                    this.settingsLeaf.containerEl.removeEventListener('unload', unloadHandler);
                }
            });

        } catch (err) {
            console.error('Error opening popout settings:', err);
            if (this.settingsLeaf) {
                try {
                    console.log('Detaching settingsLeaf in catch block');
                    this.settingsLeaf.detach();
                } catch (detachErr) {
                    console.error('Error detaching settings leaf:', detachErr);
                }
                this.settingsLeaf = null;
            }
        }
    }
};