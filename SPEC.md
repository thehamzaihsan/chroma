# ChromaStudio - Color Palette Generator & Design Toolkit

## Concept & Vision

ChromaStudio is a sleek, professional-grade color tool that feels like a creative studio rather than a utility. The interface embraces a dark, immersive aesthetic with vibrant color accents that shift based on the user's current palette—making the tool itself a canvas. Every interaction feels intentional and satisfying, from the smooth color generation animations to the tactile lock buttons. It's designed for designers who want speed without sacrificing depth.

## Design Language

### Aesthetic Direction
**Dark Studio Aesthetic** — Deep charcoal backgrounds (#0D0D0F) with subtle grain texture, floating glass panels, and colors that pop against the darkness. The UI recedes while colors take center stage.

### Color Palette
- **Background Primary**: `#0D0D0F` (near-black)
- **Background Secondary**: `#161618` (elevated surfaces)
- **Background Tertiary**: `#1E1E22` (cards, inputs)
- **Border**: `#2A2A30` (subtle dividers)
- **Text Primary**: `#F5F5F7` (headings)
- **Text Secondary**: `#A1A1A6` (body)
- **Text Muted**: `#6E6E73` (hints)
- **Accent Primary**: Dynamic (matches first color in palette)
- **Accent Secondary**: Dynamic (matches second color)
- **Success**: `#34C759`
- **Warning**: `#FF9F0A`
- **Error**: `#FF453A`

### Typography
- **Headings**: `Space Grotesk` (700) — geometric, modern
- **Body**: `Inter` (400, 500) — excellent legibility
- **Mono**: `JetBrains Mono` — for color codes and technical info
- **Scale**: 12/14/16/20/28/40/56px

### Spatial System
- Base unit: 4px
- Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96px
- Border radius: 8px (small), 12px (medium), 16px (large), 24px (cards)
- Max content width: 1400px

### Motion Philosophy
- **Generative actions**: Quick, satisfying micro-bounces (150ms spring)
- **Page transitions**: Smooth fades with slight vertical shift (300ms ease-out)
- **Color reveals**: Staggered cascade from top-left (50ms intervals)
- **Lock toggles**: Scale bounce with lock icon morph
- **Hover states**: Subtle lift with shadow expansion (200ms)
- All animations respect `prefers-reduced-motion`

### Visual Assets
- **Icons**: Lucide React (consistent 1.5px stroke)
- **Decorative**: CSS gradients, subtle noise texture overlay
- **Empty states**: Custom SVG illustrations in muted tones

## Layout & Structure

### Navigation
- **Sidebar** (240px fixed): Logo, main nav, quick actions
- **Main Content**: Fluid, centered, max-width 1200px
- **Header**: Context title, view toggles, global actions

### Pages
1. **Generator** (default): Palette generation with controls
2. **Image Picker**: Upload and extract colors
3. **Gradient Maker**: Create and customize gradients
4. **Contrast Checker**: Accessibility testing
5. **Color Inspector**: Detailed color analysis
6. **Color Blindness**: Simulator
7. **Explore**: Browse community palettes
8. **Projects**: Organize saved work
9. **Export**: Multi-format output

### Responsive Strategy
- **Desktop** (1200px+): Full sidebar, multi-column layouts
- **Tablet** (768-1199px): Collapsible sidebar, 2-column grids
- **Mobile** (< 768px): Bottom nav, single column, touch-optimized

## Features & Interactions

### 1. Fast Generator (Generator Page)
- **Default view**: 5 color swatches in a row, each 200px wide
- **Spacebar trigger**: Smooth shuffle animation, colors cascade out then in
- **Click swatch**: Expands to show color details (HEX, RGB, HSL)
- **Hover swatch**: Subtle lift, shows copy icon
- **Copy HEX**: Click copies to clipboard, toast confirmation

### 2. Lock & Generate
- **Lock button**: Bottom-right of each swatch, locked state shows filled icon
- **Locked colors**: Fade slightly, remain in position
- **Generate with locks**: Unlocked colors shuffle, locked stay
- **Visual feedback**: Lock icon bounces on toggle

### 3. Color Theory Rules
- **Rule selector**: Dropdown with options
  - Random (default)
  - Monochromatic (single hue variations)
  - Analogous (adjacent hues, ±30°)
  - Complementary (opposite hues)
  - Split Complementary (base + two adjacent to complement)
  - Triadic (three equidistant hues)
  - Tetradic (four hues in rectangle)
- **Base color**: Adjustable for theory-based generation
- **Harmony preview**: Small visualization of color wheel position

### 4. Palette Visualizer
- **Tab toggle**: "Generator" | "Visualizer"
- **Presets**: Website hero, Mobile app, Dashboard, Landing page
- **Live preview**: Palette applied to mock UI in real-time
- **Click preset**: Expands to full preview modal

### 5. Color Bot (AI Assistant)
- **Chat interface**: Slide-out panel from right
- **Input**: Text field for color queries
- **Responses**: Color suggestions, palette ideas, accessibility tips
- **Quick actions**: Preset questions ("Give me a warm sunset palette")
- **Implementation**: Local AI simulation using predefined patterns

### 6. Image Picker
- **Drop zone**: Large area with dashed border
- **Drag states**: Border highlights, "Drop to extract" text
- **Processing**: Pulsing animation during color extraction
- **Output**: Generated palette from image + option to adjust count
- **Algorithms**: K-means clustering for dominant colors

### 7. Gradient Maker
- **Canvas**: Large gradient preview area
- **Handles**: Draggable color stops on gradient bar
- **Angle control**: Circular dial for linear, position for radial
- **Type toggle**: Linear | Radial | Conic
- **CSS output**: Live code preview, copy button
- **Palette export**: Extract stops as palette

### 8. Collage Maker
- **Canvas**: Grid layout builder
- **Image slots**: Drag images or pick from uploads
- **Palette overlay**: Add color strip from current palette
- **Templates**: Pre-made layouts (2-up, 3-up, mood board)
- **Export**: PNG download

### 9. SVG Recolor
- **Drop zone**: Upload SVG files
- **Color picker**: Click any SVG element to recolor
- **Batch replace**: Find and replace specific colors
- **Export**: Download recolored SVG

### 10. Contrast Checker
- **Color inputs**: Two color pickers (foreground/background)
- **Preview**: Text samples at various sizes
- **Ratio display**: Large, prominent contrast ratio number
- **WCAG badges**: AA/AAA pass/fail for normal and large text
- **Suggestions**: Button to find accessible alternatives

### 11. Color Blindness Simulator
- **Input**: Current palette or custom colors
- **Filters**: Protanopia, Deuteranopia, Tritanopia, Achromatopsia
- **Toggle view**: Side-by-side or overlay mode
- **Preview swatches**: All palette colors shown under each filter

### 12. Color Inspector
- **Color input**: HEX, RGB, HSL, or visual picker
- **Formats displayed**: HEX, RGB, RGBA, HSL, HSLA, CMYK, LAB, HSB
- **Color name**: Nearest named color (from color names database)
- **Copy buttons**: Each format has copy action
- **Shade generator**: Lighten/darken variations

### 13. Explore Page
- **Grid view**: Masonry layout of community palettes
- **Filters**: Trending, Newest, Most Saved, by style (Warm, Cool, Pastel, Neon, Earth, etc.)
- **Search**: By color name or hex value
- **Palette card**: 5-color strip, name, saves count, hover preview
- **Click**: Opens palette in modal with full details

### 14. Font Explorer
- **Font list**: Curated Google Fonts with preview
- **Style filters**: Serif, Sans-serif, Display, Monospace
- **Pairing**: Shows suggested font combinations
- **Apply to preview**: See fonts with current palette

### 15. Projects & Collections
- **Sidebar list**: User's projects
- **Project view**: Grid of palettes within project
- **Create project**: Modal with name, description, color tag
- **Drag to organize**: Reorder palettes within project

### 16. Export Options
- **Format selector**: PDF, PNG, SVG, CSS, SCSS, JSON, Swift, Kotlin, Java
- **Preview panel**: Live preview of export
- **Customization**: Include/exclude formats, add labels
- **Download button**: Generates and downloads file

### 17. Local Storage
- **Auto-save**: All palettes saved to localStorage
- **Sync indicator**: Shows save status
- **Data structure**: JSON with palettes, projects, settings

## Component Inventory

### ColorSwatch
- **Default**: Rounded rectangle with color fill, subtle shadow
- **Hover**: Lift (translateY -4px), shadow expands, copy icon appears
- **Active/Selected**: Glowing border matching color
- **Locked**: Lock icon visible, slightly dimmed overlay
- **Loading**: Shimmer animation

### LockButton
- **Default**: Outlined lock icon, transparent bg
- **Hover**: Background fills with color
- **Locked**: Filled icon, accent background
- **Click**: Scale bounce (1 → 1.2 → 1)

### ColorInput
- **Default**: Color swatch preview + hex text input
- **Focus**: Ring outline
- **Invalid**: Red border, error message below
- **With picker**: Click opens native color picker

### Button
- **Primary**: Accent background, white text, 12px radius
- **Secondary**: Transparent, border, hover fills
- **Ghost**: No border, subtle hover background
- **Icon**: Square, icon only, tooltip on hover
- **States**: All have hover lift, active press, disabled opacity

### Card
- **Default**: Tertiary background, 16px radius, subtle border
- **Hover**: Slight lift, border highlight
- **Selected**: Accent border glow

### Modal
- **Backdrop**: Black 60% opacity, blur
- **Container**: Secondary bg, 24px radius, max 600px width
- **Header**: Title + close button
- **Animation**: Fade + scale from 95%

### Toast
- **Success**: Green left border, check icon
- **Error**: Red left border, X icon
- **Info**: Blue left border, info icon
- **Position**: Bottom-right, stacks upward
- **Animation**: Slide in from right, auto-dismiss 3s

### Tabs
- **Container**: Border-bottom, gap 4px
- **Tab**: Text button, no background
- **Active**: Accent underline, text becomes white
- **Hover**: Background highlight

### Slider
- **Track**: Border color, 4px height
- **Fill**: Accent color from left
- **Thumb**: White circle, shadow, accent ring on drag

### DropZone
- **Default**: Dashed border, muted text
- **Hover**: Border solid, accent color
- **Dragging**: Background highlight, scale 1.02
- **Processing**: Pulsing border animation

## Technical Approach

### Framework
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling (with custom config)

### State Management
- **Zustand** for global state (palette, projects, settings)
- **React Hook Form** for form handling
- **URL state** for shareable palette links

### Key Libraries
- `colord` - Color manipulation and conversion
- `chroma-js` - Advanced color algorithms
- `react-colorful` - Color picker component
- `@hello-pangea/dnd` - Drag and drop
- `lucide-react` - Icons
- `html2canvas` - PNG export
- `jspdf` - PDF export
- `file-saver` - File downloads
- `uuid` - Unique IDs

### Data Model

```typescript
interface Color {
  id: string;
  hex: string;
  name?: string;
}

interface Palette {
  id: string;
  name: string;
  colors: Color[];
  lockedIndices: number[];
  createdAt: Date;
  updatedAt: Date;
  projectId?: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  palettes: Palette[];
  createdAt: Date;
}

interface Settings {
  colorTheory: ColorTheory;
  baseColor: string;
  exportFormats: string[];
}
```

### API Routes (Local)
- `POST /api/palette/generate` - Generate new palette with rules
- `POST /api/palette/extract` - Extract colors from image
- `GET /api/explore` - Get community palettes (mock data)
- `POST /api/export` - Generate export files

### Local Storage Structure
```json
{
  "chromastudio": {
    "palettes": [...],
    "projects": [...],
    "settings": {...},
    "history": [...]
  }
}
```

### Performance
- Debounced color generation
- Memoized color calculations
- Lazy-loaded route components
- Image compression before processing
