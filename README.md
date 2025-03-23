# ⚙️ Popout Settings Plugin

A lightweight Obsidian plugin that opens the **Settings panel in a separate popout window** – perfect for dual-screen setups or users who want to keep the main UI uncluttered.


## ✅ Features

- Opens the core Obsidian settings in a separate popout window  
- Custom layout with full width and height styling  
- Removes the modal cleanly on window close to avoid errors  
- Prevents `Uncaught illegal access` by using a 500ms unload delay  


## 📦 Installation

### Manual Installation

1. Download the latest release from the [Releases Page](https://github.com/your-username/obsidian-popout-settings/releases)  
2. Unzip the plugin folder into: your-vault/.obsidian/plugins

3. In Obsidian, go to **Settings → Community Plugins**, enable Community Plugins, and then enable **Popout Settings Plugin**


## 🧭 How to Use

After enabling the plugin, you'll see a ⚙️ gear icon in the left ribbon.  
Clicking it opens Obsidian’s settings in a **standalone window** with:

- Full-width settings layout  
- Transparent background  
- Sidebar layout fully preserved  


## ⚠️ Notes

- This plugin modifies the DOM to relocate the settings modal into a different window  
- May not be compatible with other plugins or themes that heavily alter `.modal-container`  
- Make sure you’re running an updated Obsidian version (v1.5+ recommended)  


## 🧪 Technical Details

- Uses `openPopoutLeaf()` to open a second window  
- Waits for the modal to render, then appends it to the new window  
- Cleans up with `beforeunload` and a timed delay (500ms) to avoid cross-frame errors  


## ✅ Tested With

- Obsidian v1.5.x+  
- Default Light & Dark Themes  
- Electron (Desktop app)  


## 📄 License

[MIT License](https://opensource.org/licenses/MIT) – free to use, modify, and distribute.

## 🙌 Support

🌟 Enjoy using this plugin in Obsidian?  
Made with ❤️ by Morgan Frey

[![Buy Me A Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/morganfrey)

🫶🏻 Like the project? Consider buying me a coffee or starring the repository on GitHub:  
👉 [https://github.com/your-username/obsidian-popout-settings](https://github.com/your-username/obsidian-popout-settings)
