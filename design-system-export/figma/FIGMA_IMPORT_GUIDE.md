# Figma Import Guide for SERA Mobile Design System

## Overview
This guide will help you import the SERA Mobile design system into Figma and other design tools.

## Files Generated

### 1. Design Tokens
- **design-tokens.json**: Complete design tokens in standard format
- **figma-tokens.json**: Figma plugin compatible format
- **component-tokens.json**: Pre-defined component styles

### 2. Code Integration
- **sera-design-system.css**: CSS custom properties (variables)
- **sera-design-system.scss**: Sass variables and mixins
- **sera-colors.txt**: Color palette for design tools

### 3. Color Resources
- **color-palettes.json**: Organized color palettes
- Light and dark theme variations
- Usage descriptions for each color

## How to Import into Figma

### Method 1: Using Figma Tokens Plugin
1. Install the "Figma Tokens" plugin
2. Import `figma-tokens.json`
3. Apply tokens to your design system

### Method 2: Manual Color Import
1. Open Figma
2. Go to your design file
3. Create color styles using the colors from `color-palettes.json`

### Method 3: Using Design System Manager
1. Use `design-tokens.json` with design system management tools
2. Sync with your development workflow

## Color Palette Structure

### Light Theme Colors
- **Primary**: #00623B (Saudi government green)
- **Background**: #f8f9fa (Light gray background)
- **Text**: #2c3e50 (Dark text for readability)
- **Surface**: #ffffff (White surfaces)

### Dark Theme Colors
- **Primary**: #00A876 (Brighter green for dark mode)
- **Background**: #121212 (Dark background)
- **Text**: #FFFFFF (White text)
- **Surface**: #1E1E1E (Dark surfaces)

## Typography Scale
- **xs**: 13px
- **sm**: 15px
- **base**: 16px
- **lg**: 18px
- **xl**: 20px
- **xxl**: 22px
- **xxxl**: 24px

## Spacing Scale
- **xs**: 4px
- **sm**: 8px
- **base**: 12px
- **md**: 16px
- **lg**: 18px
- **xl**: 20px
- **xxl**: 24px
- **xxxl**: 32px

## Government Compliance Features
- ✅ WCAG 2.1 AA compliant color contrasts
- ✅ Arabic (RTL) and English (LTR) support
- ✅ Saudi government branding guidelines
- ✅ Accessible font sizes and spacing

## Usage Examples

### CSS
```css
.sera-button {
  background-color: var(--light-primary);
  color: var(--light-text-inverse);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: 8px;
}
```

### Sass
```scss
.sera-button {
  @include sera-button('primary');
}
```

### Figma
1. Create a component
2. Apply SERA color styles
3. Use SERA spacing tokens
4. Follow typography guidelines

## Next Steps
1. Import tokens into your design tool
2. Create component library
3. Document usage patterns
4. Share with development team
5. Maintain consistency across platforms

---
Generated on: 2025-06-19T07:07:44.856Z
