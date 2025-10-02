# AstroDefenders: The Tale of Impactor-2025

An interactive sci-fi experience combining retro pixel art aesthetics with real NASA data and AI-powered predictions.

## Project info

**URL**: https://lovable.dev/projects/958a636a-54b8-4c5c-920a-bbc5bc6cec36

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/958a636a-54b8-4c5c-920a-bbc5bc6cec36) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/958a636a-54b8-4c5c-920a-bbc5bc6cec36) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

---

## AstroDefenders - Custom Features

### Sound System

The game includes a retro sound system powered by Howler.js. To add custom audio:

#### Adding Sound Effects

1. Create the `/public/sounds/` directory
2. Add your retro sound effect files (MP3 or WAV format):
   - `buttonHover.mp3` - Plays when hovering over buttons
   - `buttonClick.mp3` - Plays when clicking buttons
   - `choiceSelect.mp3` - Plays when selecting story choices
   - `newAct.mp3` - Plays when a new act begins
   - `impactWarning.mp3` - Plays during critical threat moments
   - `badgeUnlock.mp3` - Plays when unlocking achievement badges

#### Adding Narration

1. Create the `/public/narration/` directory
2. Add voice-over files named by act:
   - `act1.mp3` - Narration for Act 1
   - `act2.mp3` - Narration for Act 2
   - `act3.mp3` - Narration for Act 3
   - `act4.mp3` - Narration for Act 4
   - `act5.mp3` - Narration for Act 5

The sound system is already configured in `src/lib/sounds.ts` and will automatically load these files when available.

### Character Avatars

Character avatars support both pixel art images and fallback icons.

#### Adding Custom Avatar Images

1. Create the `/public/avatars/` directory
2. Add pixel art PNG files for each character:
   - `narrator.png` - The System/Mission Control
   - `watcher.png` - The Watcher (NASA Scientist, blue theme)
   - `seeker.png` - The Seeker (USGS Guardian, orange theme)
   - `defender.png` - The Defender (Engineer, yellow theme)

**Avatar Specifications:**
- Format: PNG with transparency
- Size: 64x64 pixels minimum
- Style: Pixel art (use pixelated rendering for best results)
- Colors: Match the character's theme color

If no image is found, the system automatically falls back to geometric pixel icons.

### AI Oracle System

The AI Oracle provides dynamic risk assessments and mission recommendations. The system uses mock dynamic data that simulates AI intelligence by:

- Generating varying risk percentages (42%-91%)
- Providing confidence levels that increase with act progression
- Offering randomized but contextually appropriate suggestions
- Displaying real-time timestamps for authenticity

The Oracle's predictions are stored and displayed in the final mission report, comparing predictions vs. actual outcomes.

### 3D Earth Background

The rotating 3D Earth reacts to threat levels:

- **SAFE**: Calm cyan glow
- **WARNING**: Orange/amber glow with moderate intensity
- **CRITICAL**: Intense red glow with pulsing animation

The Earth uses a procedurally generated pixel-art texture and rotates continuously in the background.

### NASA API Integration

The game integrates with real NASA APIs. The API key is already configured in the `.env` file:

```
VITE_NASA_API_KEY=your_nasa_api_key_here
```

Current integrations:
- NASA NEO (Near-Earth Objects) API - Fetches real asteroid data
- Placeholder endpoints for USGS APIs (Earthquake, Elevation, DEM)
- NASA Earth API placeholder for satellite imagery

To add or modify API integrations, edit the files in `/src/api/`:
- `nasa.ts` - NASA NEO API integration
- `usgs.ts` - USGS API placeholders
- `earth.ts` - NASA Earth API placeholder

### Visual Design System

The game features a complete retro pixel art design system:

**Color Palette:**
- Primary: Yellow (#FFD700) - Command terminals and main UI
- Secondary: Orange - Alerts and warnings
- Accent: Cyan - Space and technology elements
- Destructive: Red - Danger and critical states

**Effects:**
- CRT scanline overlay across the entire UI
- Pixel-perfect text rendering
- Glowing borders and text effects
- Animated transitions and micro-interactions

**Customizing the Theme:**

All design tokens are defined in `src/index.css` using CSS custom properties:
```css
--glow-primary: 51 100% 50%;
--scanline-opacity: 0.05;
--pixel-border: 2px;
```

### Story Paths and Endings

The game features 3 unique endings based on player choices:

1. **The Phoenix Path** - Swift kinetic impactor approach
2. **The Silent Guardian** - Patient gravity tractor method
3. **The Splintered Sky** - Nuclear deflection with consequences

Each ending includes:
- Unique badge icon
- Oracle prediction vs. reality comparison
- Complete decision timeline
- Mission data summary
- Path unlock tracking for replay value

### Development Notes

**Audio Fallbacks:**
The sound system gracefully handles missing audio files. If sound files are not present, the game continues to function without errors.

**Avatar Fallbacks:**
Character avatars automatically switch to geometric pixel icons if image files are not found.

**API Key Security:**
Never commit real API keys to the repository. Use the `.env` file which is git-ignored.

**Performance:**
The 3D Earth uses optimized rendering with React Three Fiber. The pixel texture is generated once and cached for performance.

### File Structure

```
public/
├── sounds/           # Retro sound effects (MP3/WAV)
├── narration/        # Voice-over files (MP3)
└── avatars/          # Character pixel art (PNG)

src/
├── api/              # API integrations (NASA, USGS, Earth)
├── components/
│   ├── story/        # Story engine, dialogue, choices
│   ├── visualizer/   # 3D Earth and orbit visualizer
│   └── ui/           # shadcn-ui components
├── data/
│   └── story.json    # Complete story narrative
├── lib/
│   └── sounds.ts     # Sound system manager
└── types/
    └── story.ts      # TypeScript definitions
```
