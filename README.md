# BlockMerge - Unity WebGL Deployment

A beautiful, mobile-optimized web page to host and play your Unity WebGL build. Designed specifically for **portrait mobile games** with fullscreen support.

## 🎮 Features

- **📱 Mobile-First Design** - Optimized for portrait mobile games (9:16 aspect ratio)
- **🖥️ Desktop Support** - Centered, mobile-sized container on desktop
- **⚡ Fullscreen Mode** - Press 'F' or click the button for immersive gameplay
- **🎨 Premium UI** - Modern dark theme with smooth animations
- **📐 Responsive** - Adapts to landscape mode automatically
- **⌨️ Keyboard Shortcuts** - 'F' for fullscreen, 'Esc' to exit
- **🚀 CI/CD Pipeline** - Automatic deployment from Unity builds
- **📲 PWA Support** - Install as an app on Android and iOS
- **🔌 Offline Mode** - Works offline after first load
- **🍎 iOS Optimized** - Safe area support, custom fullscreen, splash screens
- **🤖 Android Optimized** - Install prompts, theme colors, performance tuning
- **👆 Touch Optimized** - Prevents zoom, pull-to-refresh, and unwanted gestures


## 🔄 Automated Deployment

This project includes a **CI/CD pipeline** that automatically deploys Unity WebGL builds from the [BlockMerge2d](https://github.com/BlockMerge/BlockMerge2d) repository.

### How It Works
1. Commit to `main` branch in BlockMerge2d
2. Unity project builds automatically
3. Build is deployed to this repository's `game/` folder
4. Changes are committed and pushed
5. (Optional) Deployed to GitHub Pages

### Setup Instructions
See **[CICD_SETUP.md](CICD_SETUP.md)** for complete setup instructions, including:
- Creating Personal Access Tokens
- Configuring GitHub Actions
- Setting up Unity build workflow
- Troubleshooting guide

## 📁 Project Structure

```
DemoWeb/
├── index.html          # Main page
├── styles.css          # Styling
├── script.js           # Functionality
├── game/               # ← PUT YOUR UNITY BUILD HERE
│   ├── index.html      # Unity's index.html
│   ├── Build/          # Unity's Build folder
│   │   ├── YourGame.loader.js
│   │   ├── YourGame.framework.js
│   │   ├── YourGame.data
│   │   └── YourGame.wasm
│   └── TemplateData/   # Unity's template assets (optional)
└── README.md
```

## 🚀 Quick Start

### Step 1: Build Your Unity Project for WebGL

1. Open your Unity project
2. Go to **File → Build Settings**
3. Select **WebGL** platform
4. Click **Switch Platform** (if not already selected)
5. Click **Build** (not "Build and Run")
6. Choose a folder name (e.g., "game")
7. Wait for the build to complete

### Step 2: Copy Your Build to This Project

1. After Unity finishes building, you'll have a folder with:
   - `index.html`
   - `Build/` folder
   - `TemplateData/` folder (optional)

2. Copy the **entire build folder** to this project:
   ```
   DemoWeb/game/
   ```

3. Your structure should look like:
   ```
   DemoWeb/
   ├── index.html (this project's file)
   ├── styles.css
   ├── script.js
   └── game/
       ├── index.html (Unity's file)
       └── Build/
   ```

### Step 3: Run a Local Server

You **cannot** open `index.html` directly in a browser due to CORS restrictions. You need a local server.

#### ⭐ Option A: Custom Unity Server (RECOMMENDED - Supports Brotli)

If your Unity build uses **Brotli compression** (`.br` files), use this custom server:

```bash
# Navigate to the DemoWeb folder
cd d:\Github\BlockMerge\DemoWeb

# Run the custom server
python server.py
```

This server properly handles:
- ✅ Brotli compression (`.br` files)
- ✅ Gzip compression (`.gz` files)
- ✅ Correct MIME types for Unity files
- ✅ CORS headers

#### Option B: Standard Python Server (Only for Uncompressed Builds)

**⚠️ Warning**: This does NOT support Brotli compression!

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Option C: Node.js
```bash
npx http-server -p 8000 --brotli
```

#### Option D: VS Code Live Server
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

**Note**: Live Server may not support Brotli compression.

### Step 4: Open in Browser

Navigate to:
```
http://localhost:8000
```

## 🎯 Unity Build Settings for Best Results

### Recommended Unity WebGL Settings:

1. **Player Settings** (Edit → Project Settings → Player):
   - **Resolution and Presentation**:
     - Default Canvas Width: `1080`
     - Default Canvas Height: `1920` (9:16 ratio)
     - Run In Background: ✅ (checked)
   
   - **Publishing Settings**:
     - Compression Format: `Brotli` or `Gzip`
     - Enable Exceptions: `None` (for smaller builds)
     - Data Caching: ✅ (checked)

2. **Build Settings**:
   - Development Build: ❌ (uncheck for production)
   - Autoconnect Profiler: ❌ (uncheck)
   - Deep Profiling: ❌ (uncheck)

3. **Quality Settings** (Edit → Project Settings → Quality):
   - Use lower quality settings for WebGL to improve performance

## 📱 Mobile Optimization

The page is optimized for mobile games:

- **Portrait Mode**: Game displays in 9:16 aspect ratio (max-width: 500px on desktop)
- **Landscape Mode**: Automatically switches to 16:9 aspect ratio
- **Fullscreen**: Works on both mobile and desktop browsers
- **Touch Controls**: Unity's touch input works seamlessly

### 📲 Install as App (PWA)

**iOS (iPhone/iPad):**
1. Open in Safari → Tap Share → "Add to Home Screen"

**Android:**
1. Open in Chrome/Edge → Menu (⋮) → "Add to Home Screen" or "Install app"

The app will work offline after first load and provides a native app-like experience!


## ⌨️ Controls

- **F Key**: Toggle fullscreen
- **Escape**: Exit fullscreen
- **Fullscreen Button**: Click to toggle fullscreen mode

## 🎨 Customization

### Change Game Title
Edit `index.html` line 6:
```html
<title>Your Game Name - Unity WebGL Game</title>
```

And line 20:
```html
<span class="logo-text">Your Game Name</span>
```

### Change Colors
Edit `styles.css` CSS variables (lines 2-20):
```css
:root {
    --color-primary: #6366f1;      /* Change primary color */
    --color-secondary: #ec4899;    /* Change secondary color */
    /* ... */
}
```

### Adjust Game Container Size
Edit `styles.css` line 243:
```css
.game-container {
    max-width: 500px; /* Change this value */
    aspect-ratio: 9 / 16; /* Or change aspect ratio */
}
```

## 🌐 Deployment

### Deploy to GitHub Pages (Recommended)

This project is **ready for GitHub Pages deployment** with automated CI/CD!

#### Quick Setup:
1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
4. Click **Save**
5. Your site will be live at: `https://yourusername.github.io/DemoWeb/`

#### Automated Deployment:
The included GitHub Actions workflow automatically:
- ✅ Receives Unity builds from BlockMerge2d repository
- ✅ Deploys to GitHub Pages on every update
- ✅ Handles all compression and file serving correctly

**📖 Detailed Guide**: See **[GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)** for:
- Complete setup instructions
- Troubleshooting guide
- Custom domain configuration
- Security settings
- Performance optimization

### Deploy to Netlify

1. Drag and drop the `DemoWeb` folder to [Netlify Drop](https://app.netlify.com/drop)
2. Your site will be instantly deployed

### Deploy to Vercel

```bash
cd DemoWeb
npx vercel
```

### Deploy to itch.io

1. Zip the entire `DemoWeb` folder
2. Upload to itch.io as an HTML5 game
3. Set viewport dimensions to match your game (e.g., 1080x1920)

## 🔧 Troubleshooting

### Game doesn't load
- ✅ Ensure the `game/` folder contains Unity's `index.html`
- ✅ Check that `Build/` folder is inside `game/`
- ✅ Verify you're using a local server (not opening file directly)
- ✅ Check browser console (F12) for errors

### Blank screen or loading forever
- ✅ Check Unity build completed successfully
- ✅ Verify file paths in Unity's `index.html` are correct
- ✅ Try rebuilding in Unity with compression disabled
- ✅ Check browser console for CORS errors

### ⚠️ Brotli Compression Error

**Error Message:**
```
Unable to parse Build/BlockMerge.framework.js.br!
This can happen if build compression was enabled but web server hosting the content 
was misconfigured to not serve the file with HTTP Response Header "Content-Encoding: br"
```

**Solutions:**

1. **Use the improved `server.py` (Local Development):**
   The included `server.py` has been updated to automatically detect `.br` files and serve them with the correct headers, even if they are requested without the `.br` extension.
   ```bash
   python server.py
   ```

2. **Automated Deployment (GitHub Pages):**
   The CI/CD pipeline (`deploy-unity-build.yml`) now automatically decompresses Brotli files during deployment. This ensures the game works on GitHub Pages and other static hosts without any configuration needed.

3. **Manual Fix (If not using CI/CD):**
   If you are manually copying files, you should either:
   - Disable compression in Unity (Project Settings → Player → Publishing Settings → Compression Format: Disabled)
   - Or decompress the `.br` files in the `Build/` folder and remove the `.br` extension from `index.html`.

**Alternative Solutions:**

1. **Disable Brotli in Unity:**
   - Edit → Project Settings → Player → Publishing Settings
   - Change "Compression Format" to `Gzip` or `Disabled`
   - Rebuild your project

2. **Use Node.js with Brotli support:**
   ```bash
   npx http-server -p 8000 --brotli
   ```

3. **Deploy to a proper web host** (GitHub Pages, Netlify, Vercel) - they all support Brotli


### Fullscreen not working
- ✅ Some browsers require user interaction before fullscreen
- ✅ Try clicking the fullscreen button instead of pressing 'F'
- ✅ Check if browser allows fullscreen (some mobile browsers don't)

### Game is too small/large
- ✅ Adjust `max-width` in `.game-container` CSS
- ✅ Change `aspect-ratio` to match your game's resolution
- ✅ Ensure Unity's canvas resolution matches the aspect ratio

### Performance issues
- ✅ Reduce Unity quality settings
- ✅ Enable compression in Unity build settings
- ✅ Optimize assets (textures, models, audio)
- ✅ Use Unity's WebGL optimization guide

## 📊 Browser Compatibility

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome  | ✅      | ✅     |
| Firefox | ✅      | ✅     |
| Safari  | ✅      | ✅     |
| Edge    | ✅      | ✅     |
| Opera   | ✅      | ✅     |

## 💡 Tips

1. **Optimize Build Size**: Use Brotli compression in Unity for smaller builds
2. **Loading Screen**: The page shows a custom loading screen while Unity loads
3. **Mobile Testing**: Test on actual mobile devices, not just browser dev tools
4. **HTTPS**: Some Unity features require HTTPS (use for production)
5. **Caching**: Enable data caching in Unity for faster subsequent loads

## 📝 Notes

- The loading screen is simulated and shows while the Unity game loads
- Fullscreen works best on modern browsers
- Mobile browsers may have restrictions on fullscreen API
- The game iframe loads from `game/index.html` - ensure this path is correct

## 🆘 Need Help?

If you encounter issues:
1. Check the browser console (F12 → Console tab)
2. Verify Unity build completed without errors
3. Ensure all files are in the correct locations
4. Try rebuilding your Unity project
5. Test with a simple Unity WebGL template first

---

**Built for Unity WebGL developers** 🎮

Enjoy testing your mobile game!
