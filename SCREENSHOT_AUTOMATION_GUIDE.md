# App Store Screenshot & Metadata Automation Guide

## Your Current Setup

- **App**: BrainDump (React Native + iOS)
- **Apple ID**: 6758730049
- **Fastlane**: Installed, has `beta` lane only
- **Existing locales in app**: en, es, fr, de, it, pt, ja, ko, zh-Hans, zh-Hant, ru, ar, tr, nl, pl
- **Missing**: No `fastlane/metadata/` or `fastlane/screenshots/` folders yet

---

## THE PIPELINE (What You're Building)

```
Figma (English screens)
    ↓  Figma MCP plugin
Claude Code (translate text layers per locale)
    ↓  Export PNGs
fastlane/screenshots/{locale}/ folder
    ↓  fastlane deliver
App Store Connect
```

---

## STEP 1: Install the Figma MCP Plugin

**Repo**: https://github.com/arinspunk/claude-talk-to-figma-mcp

The "Claude Talk to Figma" MCP plugin lets Claude Code read and modify your Figma file directly.

### 1a. Install Bun (if you don't have it)

```bash
curl -fsSL https://bun.sh/install | bash
```

### 1b. Install & build the MCP server

**Quick way (one command):**
```bash
npx claude-talk-to-figma-mcp
```
This clones the repo, installs deps, and starts the WebSocket server automatically.

**Manual way:**
```bash
cd ~/Desktop
git clone https://github.com/arinspunk/claude-talk-to-figma-mcp.git
cd claude-talk-to-figma-mcp
bun install
bun run build
```

### 1c. Add MCP to Claude Code config

Add this to your `~/.claude.json` (or project-level `.mcp.json`):

```json
{
  "mcpServers": {
    "ClaudeTalkToFigma": {
      "command": "bunx",
      "args": ["claude-talk-to-figma-mcp@latest"]
    }
  }
}
```

### 1d. Install the Figma plugin

1. Open **Figma Desktop** (not web — the plugin needs local WebSocket)
2. Go to **Menu > Plugins > Development > Import plugin from manifest**
3. Navigate to the cloned repo and select: `src/claude_mcp_plugin/manifest.json`
4. The plugin is now installed in your Figma

### 1e. Connect everything

1. **Start the WebSocket server**: `bun socket` (from the cloned repo folder)
2. **Verify it's running**: open `http://localhost:3055/status` in browser
3. **In Figma**: open your screenshot file, run "Claude MCP Plugin" from Plugins menu
4. **Copy the channel ID** the plugin shows
5. **Restart Claude Code** — you should see the Figma MCP tools available
6. **Tell Claude Code**: "Talk to Figma, channel {paste-channel-ID-here}"

### Available MCP tools you'll use:
| Tool | What it does |
|------|-------------|
| `get_document_info` | Read the Figma file structure |
| `get_selection` | Get currently selected elements |
| `get_text_in_selection` | Read all text from selected frames |
| `scan_text_in_page` | Find all text layers on a page |
| `clone_node` | Duplicate a frame (for creating locale copies) |
| `set_text_content` | Replace text in a layer |
| `set_font_size` | Adjust font size (useful if translated text is longer) |
| `export_node_as_png` | Export a frame as PNG |
| `move_node` | Position duplicated frames |
| `create_frame` | Create new containing frames per locale |

---

## STEP 2: Prepare Your Figma File

Your Figma file needs to be structured for automation:

### Required structure:
```
Page: "App Store Screenshots"
  ├── Frame: "en" (your existing English screens)
  │   ├── Screen 1 (iPhone 6.7" — 1290×2796)
  │   ├── Screen 2
  │   ├── ...
  │   └── Screen 10
  └── (localized copies will be generated here)
```

### Important:
- All text layers that need translation must be **separate text layers** (not flattened into images)
- Screenshot frames must be **exactly** the App Store required sizes:
  - **iPhone 6.7"**: 1290 x 2796 px (required)
  - **iPhone 6.5"**: 1284 x 2778 px (or 1242 x 2688)
  - **iPad Pro 12.9"**: 2048 x 2732 px (if you support iPad)
- Name your frames clearly: `Screen_01`, `Screen_02`, etc.

---

## STEP 3: Use Claude Code + Figma MCP to Localize

Once the MCP is connected, you can ask Claude Code to:

1. **Read all text layers** from your English frames
2. **Translate them** into each target locale
3. **Duplicate the English frames** per locale
4. **Replace text layers** with translated content
5. **Handle RTL** for Arabic (ar) — mirror layouts if needed
6. **Export each frame as PNG** at the correct resolution

### Example prompt to Claude Code:

> "Read all text layers from my English screenshot frames. Duplicate them for
> these locales: de, fr, es, it, pt, ja, ko, zh-Hans, zh-Hant, ru, ar, tr, nl, pl.
> Translate all text layers into each language. Export each frame as PNG at 1x."

### What Claude Code will do:
- Use `get_text_in_selection` / `get_node_info` to read text
- Use `clone_node` to duplicate frames
- Use `set_text_content` to replace with translations
- Use `export_node_as_png` to export final screenshots

---

## STEP 4: Set Up Fastlane Metadata & Screenshots Folders

Run this to initialize the folder structure:

```bash
cd /Users/engin/Desktop/my/brainDump

# Initialize fastlane deliver (downloads existing metadata from App Store Connect)
fastlane deliver init
```

This creates:
```
fastlane/
  metadata/
    en-US/
      name.txt
      subtitle.txt
      description.txt
      keywords.txt
      promotional_text.txt
      privacy_url.txt
      support_url.txt
      marketing_url.txt
      release_notes.txt
    de-DE/
    fr-FR/
    ...
  screenshots/
    en-US/
    de-DE/
    fr-FR/
    ...
```

### Locale mapping (Figma → Fastlane):

| Your app locale | Fastlane locale |
|----------------|----------------|
| en             | en-US           |
| de             | de-DE           |
| fr             | fr-FR           |
| es             | es-ES           |
| it             | it               |
| pt             | pt-BR           |
| ja             | ja               |
| ko             | ko               |
| zh-Hans        | zh-Hans         |
| zh-Hant        | zh-Hant         |
| ru             | ru               |
| ar             | ar-SA           |
| tr             | tr               |
| nl             | nl-NL           |
| pl             | pl               |

---

## STEP 5: Place Exported Screenshots

After exporting from Figma, place screenshots in the correct folders:

```
fastlane/screenshots/
  en-US/
    01_DumpScreen.png
    02_ReleaseScreen.png
    03_ExitScreen.png
    ...
  de-DE/
    01_DumpScreen.png
    02_ReleaseScreen.png
    ...
  fr-FR/
    ...
```

### Naming convention:
- Files are sorted alphabetically, so prefix with numbers: `01_`, `02_`, etc.
- This controls the order they appear in the App Store

---

## STEP 6: Write Localized Metadata

For each locale folder in `fastlane/metadata/`, you need these files:

| File | Content | Max Length |
|------|---------|-----------|
| `name.txt` | App name | 30 chars |
| `subtitle.txt` | App subtitle | 30 chars |
| `description.txt` | Full description | 4000 chars |
| `keywords.txt` | Search keywords (comma-separated) | 100 chars |
| `promotional_text.txt` | Promo text (can change without review) | 170 chars |
| `release_notes.txt` | What's New text | 4000 chars |
| `privacy_url.txt` | Privacy policy URL | — |
| `support_url.txt` | Support URL | — |

You can ask Claude Code to translate your English metadata into all locales:

> "Read my fastlane/metadata/en-US/ files and create translated versions
> for all my supported locales: de-DE, fr-FR, es-ES, it, pt-BR, ja, ko,
> zh-Hans, zh-Hant, ru, ar-SA, tr, nl-NL, pl"

---

## STEP 7: Add Deliver Lane to Fastfile

Add this lane to your existing Fastfile:

```ruby
desc "Upload screenshots and metadata to App Store Connect"
lane :upload_metadata do
  deliver(
    app_identifier: "com.yourteam.braindump",  # your bundle ID
    skip_binary_upload: true,
    skip_app_version_update: false,
    force: true,                    # skip HTML preview
    overwrite_screenshots: true,
    precheck_include_in_app_purchases: false,
    submission_information: {
      add_id_info_uses_idfa: false
    },
    metadata_path: "./fastlane/metadata",
    screenshots_path: "./fastlane/screenshots"
  )
end

desc "Upload screenshots only"
lane :upload_screenshots do
  deliver(
    app_identifier: "com.yourteam.braindump",
    skip_binary_upload: true,
    skip_metadata: true,
    overwrite_screenshots: true,
    force: true,
    screenshots_path: "./fastlane/screenshots"
  )
end

desc "Upload metadata only (no screenshots)"
lane :upload_metadata_only do
  deliver(
    app_identifier: "com.yourteam.braindump",
    skip_binary_upload: true,
    skip_screenshots: true,
    force: true,
    metadata_path: "./fastlane/metadata"
  )
end
```

---

## STEP 8: Run It

```bash
# Preview what will be uploaded (opens HTML preview)
fastlane deliver --skip_binary_upload --skip_screenshots

# Upload metadata + screenshots
fastlane upload_metadata

# Upload screenshots only
fastlane upload_screenshots

# Upload metadata only
fastlane upload_metadata_only
```

---

## FULL WORKFLOW SUMMARY (Do This In Order)

### One-time setup:
1. [ ] Install Talk to Figma MCP server
2. [ ] Add MCP config to Claude Code
3. [ ] Install Figma plugin
4. [ ] Run `fastlane deliver init` to create folder structure
5. [ ] Add `upload_metadata` lanes to Fastfile
6. [ ] Move your app-specific password to env vars (SECURITY FIX)

### Every time you update screenshots:
1. [ ] Open Figma file, run the Talk to Figma plugin
2. [ ] Connect Claude Code to Figma via MCP
3. [ ] Ask Claude Code to duplicate & translate your English screens
4. [ ] Export PNGs from Figma
5. [ ] Move PNGs into `fastlane/screenshots/{locale}/` folders
6. [ ] Run `fastlane upload_screenshots`

### Every time you update metadata:
1. [ ] Update `fastlane/metadata/en-US/` files
2. [ ] Ask Claude Code to translate into all locales
3. [ ] Run `fastlane upload_metadata_only`

---

## PREREQUISITES CHECKLIST

- [ ] **Figma Desktop app** installed (not web — MCP plugin needs local WebSocket)
- [ ] **Bun** installed (`curl -fsSL https://bun.sh/install | bash`)
- [ ] **Fastlane** installed (`gem install fastlane` or `brew install fastlane`)
- [ ] **App Store Connect API key** or app-specific password configured
- [ ] **Bundle ID** confirmed (check your Xcode project)
- [ ] **Figma file** with English screenshots as editable frames (not flattened images)

---

## SECURITY FIX (DO THIS NOW)

Your Fastfile has a hardcoded app-specific password. Fix this:

1. Revoke the current password at https://appleid.apple.com
2. Generate a new one
3. Store it as an environment variable:

```bash
# Add to ~/.zshrc or ~/.bash_profile
export FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD="your-new-password"
```

4. In your Fastfile, remove the hardcoded line and fastlane will pick it up from the env automatically.
