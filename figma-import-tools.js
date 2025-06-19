#!/usr/bin/env node

/**
 * 🎨 Figma Import Tools for SERA Mobile Design System
 * 
 * Additional tools to create Figma-ready assets:
 * - CSS Variables for web import
 * - SCSS/Sass variables
 * - Figma Plugin compatible JSON
 * - Color swatches
 * - Component documentation
 */

const fs = require('fs');
const path = require('path');

class FigmaImportTools {
    constructor() {
        this.exportDir = path.join(process.cwd(), 'design-system-export');
        this.figmaDir = path.join(this.exportDir, 'figma');
        this.tokensFile = path.join(this.figmaDir, 'design-tokens.json');

        this.init();
    }

    init() {
        console.log('🎨 Generating Figma Import Tools...\n');

        if (!fs.existsSync(this.tokensFile)) {
            console.error('❌ Design tokens file not found. Please run design-system-extractor.js first.');
            return;
        }

        const tokens = JSON.parse(fs.readFileSync(this.tokensFile, 'utf8'));

        this.generateCSSVariables(tokens);
        this.generateSassVariables(tokens);
        this.generateFigmaPluginJSON(tokens);
        this.generateColorPalettes(tokens);
        this.generateComponentTokens(tokens);
        this.generateFigmaImportGuide();

        console.log('✅ Figma Import Tools Generated Successfully!');
        console.log(`📁 Output directory: ${this.figmaDir}`);
    }

    generateCSSVariables(tokens) {
        console.log('📝 Generating CSS Variables...');

        let css = `/* SERA Mobile Design System - CSS Variables */\n`;
        css += `/* Generated on: ${new Date().toISOString()} */\n\n`;

        css += `:root {\n`;
        css += `  /* Light Theme Colors */\n`;

        if (tokens.global.colors) {
            Object.entries(tokens.global.colors).forEach(([name, token]) => {
                const cssVarName = name.replace(/([A-Z])/g, '-$1').toLowerCase();
                css += `  --${cssVarName}: ${token.value};\n`;
            });
        }

        css += `\n  /* Typography */\n`;
        if (tokens.global.typography) {
            Object.entries(tokens.global.typography).forEach(([name, token]) => {
                const cssVarName = name.replace(/([A-Z])/g, '-$1').toLowerCase();
                if (token.type === 'fontSizes') {
                    css += `  --${cssVarName}: ${token.value}px;\n`;
                } else {
                    css += `  --${cssVarName}: ${token.value};\n`;
                }
            });
        }

        css += `\n  /* Spacing */\n`;
        if (tokens.global.spacing) {
            Object.entries(tokens.global.spacing).forEach(([name, token]) => {
                const cssVarName = name.replace(/([A-Z])/g, '-$1').toLowerCase();
                css += `  --${cssVarName}: ${token.value}px;\n`;
            });
        }

        css += `}\n\n`;

        // Add dark theme
        css += `[data-theme="dark"] {\n`;
        css += `  /* Dark Theme Colors */\n`;
        if (tokens.global.colors) {
            Object.entries(tokens.global.colors).forEach(([name, token]) => {
                if (name.startsWith('dark-')) {
                    const lightName = name.replace('dark-', 'light-');
                    const cssVarName = lightName.replace(/([A-Z])/g, '-$1').toLowerCase();
                    css += `  --${cssVarName}: ${token.value};\n`;
                }
            });
        }
        css += `}\n\n`;

        // Add utility classes
        css += this.generateUtilityClasses(tokens);

        fs.writeFileSync(path.join(this.figmaDir, 'sera-design-system.css'), css);
        console.log('✅ Generated: sera-design-system.css');
    }

    generateUtilityClasses(tokens) {
        let css = `/* Utility Classes */\n\n`;

        // Color utilities
        css += `/* Color Utilities */\n`;
        if (tokens.global.colors) {
            Object.entries(tokens.global.colors).forEach(([name, token]) => {
                if (name.startsWith('light-')) {
                    const className = name.replace('light-', '');
                    css += `.text-${className} { color: var(--${name.replace(/([A-Z])/g, '-$1').toLowerCase()}); }\n`;
                    css += `.bg-${className} { background-color: var(--${name.replace(/([A-Z])/g, '-$1').toLowerCase()}); }\n`;
                }
            });
        }

        css += `\n/* Typography Utilities */\n`;
        if (tokens.global.typography) {
            Object.entries(tokens.global.typography).forEach(([name, token]) => {
                if (token.type === 'fontSizes') {
                    const className = name.replace('fontSize-', '');
                    css += `.text-${className} { font-size: var(--${name.replace(/([A-Z])/g, '-$1').toLowerCase()}); }\n`;
                }
            });
        }

        css += `\n/* Spacing Utilities */\n`;
        if (tokens.global.spacing) {
            Object.entries(tokens.global.spacing).forEach(([name, token]) => {
                const className = name.replace('spacing-', '');
                css += `.m-${className} { margin: var(--${name.replace(/([A-Z])/g, '-$1').toLowerCase()}); }\n`;
                css += `.p-${className} { padding: var(--${name.replace(/([A-Z])/g, '-$1').toLowerCase()}); }\n`;
            });
        }

        return css;
    }

    generateSassVariables(tokens) {
        console.log('📝 Generating Sass Variables...');

        let scss = `// SERA Mobile Design System - Sass Variables\n`;
        scss += `// Generated on: ${new Date().toISOString()}\n\n`;

        // Colors
        scss += `// Colors\n`;
        if (tokens.global.colors) {
            Object.entries(tokens.global.colors).forEach(([name, token]) => {
                const sassVarName = name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/-+/g, '-');
                scss += `$${sassVarName}: ${token.value};\n`;
            });
        }

        scss += `\n// Typography\n`;
        if (tokens.global.typography) {
            Object.entries(tokens.global.typography).forEach(([name, token]) => {
                const sassVarName = name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/-+/g, '-');
                if (token.type === 'fontSizes') {
                    scss += `$${sassVarName}: ${token.value}px;\n`;
                } else {
                    scss += `$${sassVarName}: ${token.value};\n`;
                }
            });
        }

        scss += `\n// Spacing\n`;
        if (tokens.global.spacing) {
            Object.entries(tokens.global.spacing).forEach(([name, token]) => {
                const sassVarName = name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/-+/g, '-');
                scss += `$${sassVarName}: ${token.value}px;\n`;
            });
        }

        // Add color maps for easier access
        scss += `\n// Color Maps\n`;
        scss += `$sera-colors: (\n`;
        if (tokens.global.colors) {
            Object.entries(tokens.global.colors).forEach(([name, token]) => {
                if (name.startsWith('light-')) {
                    const colorName = name.replace('light-', '');
                    scss += `  "${colorName}": ${token.value},\n`;
                }
            });
        }
        scss += `);\n\n`;

        scss += `$sera-dark-colors: (\n`;
        if (tokens.global.colors) {
            Object.entries(tokens.global.colors).forEach(([name, token]) => {
                if (name.startsWith('dark-')) {
                    const colorName = name.replace('dark-', '');
                    scss += `  "${colorName}": ${token.value},\n`;
                }
            });
        }
        scss += `);\n\n`;

        // Add helper functions
        scss += this.generateSassHelpers();

        fs.writeFileSync(path.join(this.figmaDir, 'sera-design-system.scss'), scss);
        console.log('✅ Generated: sera-design-system.scss');
    }

    generateSassHelpers() {
        return `// Helper Functions
@function sera-color($color-name, $theme: 'light') {
  @if $theme == 'light' {
    @return map-get($sera-colors, $color-name);
  } @else {
    @return map-get($sera-dark-colors, $color-name);
  }
}

// Mixins
@mixin sera-button($variant: 'primary') {
  padding: $spacing-md $spacing-lg;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  
  @if $variant == 'primary' {
    background-color: sera-color('primary');
    color: sera-color('text-inverse');
  } @else if $variant == 'secondary' {
    background-color: transparent;
    color: sera-color('primary');
    border: 1px solid sera-color('border');
  }
}

@mixin sera-card {
  background-color: sera-color('surface');
  border-radius: 12px;
  padding: $spacing-lg;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid sera-color('border-light');
}

@mixin sera-text($size: 'base') {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  @if $size == 'xs' {
    font-size: $font-size-xs;
  } @else if $size == 'sm' {
    font-size: $font-size-sm;
  } @else if $size == 'base' {
    font-size: $font-size-base;
  } @else if $size == 'lg' {
    font-size: $font-size-lg;
  } @else if $size == 'xl' {
    font-size: $font-size-xl;
  }
}
`;
    }

    generateFigmaPluginJSON(tokens) {
        console.log('🔌 Generating Figma Plugin JSON...');

        const figmaTokens = {
            "name": "SERA Mobile Design System",
            "description": "Official design tokens for Saudi Electricity Regulatory Authority mobile app",
            "version": "1.0.0",
            "tokens": {
                "color": {},
                "typography": {},
                "spacing": {},
                "borderRadius": {},
                "shadow": {}
            }
        };

        // Process colors for Figma
        if (tokens.global.colors) {
            Object.entries(tokens.global.colors).forEach(([name, token]) => {
                const category = name.startsWith('light-') ? 'light' : 'dark';
                const colorName = name.replace(/^(light-|dark-)/, '');

                if (!figmaTokens.tokens.color[category]) {
                    figmaTokens.tokens.color[category] = {};
                }

                figmaTokens.tokens.color[category][colorName] = {
                    value: token.value,
                    type: "color",
                    description: token.description
                };
            });
        }

        // Process typography
        if (tokens.global.typography) {
            Object.entries(tokens.global.typography).forEach(([name, token]) => {
                const typeName = name.replace(/^fontSize-/, '');
                figmaTokens.tokens.typography[typeName] = {
                    value: token.value,
                    type: "fontSizes",
                    description: token.description
                };
            });
        }

        // Process spacing
        if (tokens.global.spacing) {
            Object.entries(tokens.global.spacing).forEach(([name, token]) => {
                const spaceName = name.replace(/^spacing-/, '');
                figmaTokens.tokens.spacing[spaceName] = {
                    value: token.value,
                    type: "spacing",
                    description: token.description
                };
            });
        }

        fs.writeFileSync(path.join(this.figmaDir, 'figma-tokens.json'), JSON.stringify(figmaTokens, null, 2));
        console.log('✅ Generated: figma-tokens.json');
    }

    generateColorPalettes(tokens) {
        console.log('🎨 Generating Color Palettes...');

        const palettes = {
            light: {},
            dark: {},
            swatches: []
        };

        if (tokens.global.colors) {
            Object.entries(tokens.global.colors).forEach(([name, token]) => {
                if (name.startsWith('light-')) {
                    const colorName = name.replace('light-', '');
                    palettes.light[colorName] = {
                        hex: token.value,
                        name: colorName,
                        usage: this.getColorUsage(colorName)
                    };
                } else if (name.startsWith('dark-')) {
                    const colorName = name.replace('dark-', '');
                    palettes.dark[colorName] = {
                        hex: token.value,
                        name: colorName,
                        usage: this.getColorUsage(colorName)
                    };
                }
            });
        }

        // Generate color swatches for design tools
        Object.entries(palettes.light).forEach(([name, color]) => {
            palettes.swatches.push({
                name: `SERA Light ${name}`,
                color: color.hex,
                category: 'light-theme'
            });
        });

        Object.entries(palettes.dark).forEach(([name, color]) => {
            palettes.swatches.push({
                name: `SERA Dark ${name}`,
                color: color.hex,
                category: 'dark-theme'
            });
        });

        fs.writeFileSync(path.join(this.figmaDir, 'color-palettes.json'), JSON.stringify(palettes, null, 2));
        console.log('✅ Generated: color-palettes.json');

        // Generate Adobe Swatch Exchange (ASE) compatible format
        this.generateASEFormat(palettes);
    }

    generateASEFormat(palettes) {
        // Generate a simple text format that can be imported into design tools
        let ase = `SERA Mobile Design System Color Palette\n`;
        ase += `Generated: ${new Date().toISOString()}\n\n`;

        ase += `LIGHT THEME COLORS:\n`;
        Object.entries(palettes.light).forEach(([name, color]) => {
            ase += `${name.toUpperCase()}: ${color.hex}\n`;
        });

        ase += `\nDARK THEME COLORS:\n`;
        Object.entries(palettes.dark).forEach(([name, color]) => {
            ase += `${name.toUpperCase()}: ${color.hex}\n`;
        });

        fs.writeFileSync(path.join(this.figmaDir, 'sera-colors.txt'), ase);
        console.log('✅ Generated: sera-colors.txt');
    }

    getColorUsage(colorName) {
        const usageMap = {
            primary: 'Primary brand color for buttons, links, and key UI elements',
            primaryLight: 'Light variant of primary color for backgrounds and hover states',
            primaryDark: 'Dark variant of primary color for pressed states',
            background: 'Main background color for screens',
            surface: 'Surface color for cards and elevated elements',
            card: 'Card background color',
            text: 'Primary text color',
            textSecondary: 'Secondary text color for less important content',
            textInverse: 'Inverse text color for dark backgrounds',
            border: 'Border color for dividers and outlines',
            borderLight: 'Light border color for subtle divisions',
            success: 'Success state color for confirmations',
            warning: 'Warning state color for cautions',
            error: 'Error state color for validation and alerts',
            info: 'Information state color for tips and notifications',
            shadow: 'Shadow color for depth and elevation',
            icon: 'Default icon color',
            iconActive: 'Active icon color',
            inputBackground: 'Input field background color',
            inputBorder: 'Input field border color',
            inputText: 'Input field text color',
            placeholder: 'Placeholder text color'
        };

        return usageMap[colorName] || 'General purpose color';
    }

    generateComponentTokens(tokens) {
        console.log('🧩 Generating Component Tokens...');

        const componentTokens = {
            metadata: {
                name: "SERA Mobile Component Tokens",
                description: "Pre-defined component styles using design tokens",
                version: "1.0.0"
            },
            components: {
                button: {
                    primary: {
                        backgroundColor: "var(--light-primary)",
                        color: "var(--light-text-inverse)",
                        padding: "var(--spacing-md) var(--spacing-lg)",
                        borderRadius: "8px",
                        fontWeight: "600",
                        border: "none"
                    },
                    secondary: {
                        backgroundColor: "transparent",
                        color: "var(--light-primary)",
                        padding: "var(--spacing-md) var(--spacing-lg)",
                        borderRadius: "8px",
                        fontWeight: "600",
                        border: "1px solid var(--light-border)"
                    }
                },
                card: {
                    default: {
                        backgroundColor: "var(--light-surface)",
                        borderRadius: "12px",
                        padding: "var(--spacing-lg)",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                        border: "1px solid var(--light-border-light)"
                    }
                },
                input: {
                    default: {
                        backgroundColor: "var(--light-input-background)",
                        border: "1px solid var(--light-input-border)",
                        borderRadius: "8px",
                        padding: "var(--spacing-md)",
                        color: "var(--light-input-text)",
                        fontSize: "var(--font-size-base)"
                    }
                },
                header: {
                    title: {
                        color: "var(--light-primary)",
                        fontSize: "var(--font-size-xxxl)",
                        fontWeight: "700",
                        marginBottom: "var(--spacing-sm)"
                    },
                    subtitle: {
                        color: "var(--light-text-secondary)",
                        fontSize: "var(--font-size-base)",
                        fontWeight: "400",
                        lineHeight: "1.5"
                    }
                }
            }
        };

        fs.writeFileSync(path.join(this.figmaDir, 'component-tokens.json'), JSON.stringify(componentTokens, null, 2));
        console.log('✅ Generated: component-tokens.json');
    }

    generateFigmaImportGuide() {
        console.log('📖 Generating Figma Import Guide...');

        const guide = `# Figma Import Guide for SERA Mobile Design System

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
2. Import \`figma-tokens.json\`
3. Apply tokens to your design system

### Method 2: Manual Color Import
1. Open Figma
2. Go to your design file
3. Create color styles using the colors from \`color-palettes.json\`

### Method 3: Using Design System Manager
1. Use \`design-tokens.json\` with design system management tools
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
\`\`\`css
.sera-button {
  background-color: var(--light-primary);
  color: var(--light-text-inverse);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: 8px;
}
\`\`\`

### Sass
\`\`\`scss
.sera-button {
  @include sera-button('primary');
}
\`\`\`

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
Generated on: ${new Date().toISOString()}
`;

        fs.writeFileSync(path.join(this.figmaDir, 'FIGMA_IMPORT_GUIDE.md'), guide);
        console.log('✅ Generated: FIGMA_IMPORT_GUIDE.md');
    }
}

// CLI Interface
if (require.main === module) {
    new FigmaImportTools();
}

module.exports = FigmaImportTools; 