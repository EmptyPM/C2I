# Design System

## Colors

The app uses a custom color palette defined in `app/globals.css`. These colors are available as CSS variables and Tailwind utilities.

### Color Variables

- `--bg-main`: `#05081a` - Base background color
- `--bg-card`: `#0b1024` - Card background color
- `--bg-card-soft`: `#101632` - Soft card background (lighter variant)
- `--border-subtle`: `rgba(148, 163, 184, 0.12)` - Subtle border color
- `--accent-main`: `#ffb020` - Main accent color (warm orange/yellow)
- `--accent-soft`: `#4fd1ff` - Soft accent color (cyan)
- `--text-muted`: `#94a3b8` - Muted text color

### Usage

#### CSS Variables
```css
.my-element {
  background-color: var(--bg-main);
  color: var(--accent-main);
  border: 1px solid var(--border-subtle);
}
```

#### Tailwind Utilities
```tsx
<div className="bg-bg-main text-accent-main border-border-subtle">
  Content
</div>
```

#### Available Tailwind Classes
- `bg-bg-main` - Main background
- `bg-bg-card` - Card background
- `bg-bg-card-soft` - Soft card background
- `border-border-subtle` - Subtle border
- `text-accent-main` - Main accent text
- `bg-accent-main` - Main accent background
- `text-accent-soft` - Soft accent text
- `bg-accent-soft` - Soft accent background
- `text-text-muted` - Muted text

### Color Palette Overview

- **Backgrounds**: Dark navy/blue tones for depth
- **Accents**: Warm orange/yellow for primary actions, cyan for secondary
- **Text**: Muted slate for secondary text
- **Borders**: Subtle transparent borders for separation






