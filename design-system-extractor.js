#!/usr/bin/env node

/**
 * 🎨 SERA Mobile Design System Extractor
 * 
 * Comprehensive toolkit to extract design tokens, components, and screens
 * from React Native codebase and generate Figma-compatible design system
 * 
 * Features:
 * - Extract color palettes (light/dark themes)
 * - Extract typography system
 * - Extract spacing and layout tokens
 * - Analyze component hierarchy
 * - Generate screen documentation
 * - Create Arabic/English UI variations
 * - Export Figma design tokens
 */

const fs = require('fs');
const path = require('path');

class SERADesignSystemExtractor {
    constructor() {
        this.projectRoot = process.cwd();
        this.srcPath = path.join(this.projectRoot, 'src');
        this.outputDir = path.join(this.projectRoot, 'design-system-export');

        this.designTokens = {
            colors: {},
            typography: {},
            spacing: {},
            shadows: {},
            borderRadius: {},
            components: {},
            screens: {},
            i18n: {}
        };

        this.init();
    }

    init() {
        console.log('🚀 Starting SERA Mobile Design System Extraction...\n');

        // Create output directory
        this.ensureOutputDirectory();

        // Extract all design tokens
        this.extractThemeTokens();
        this.extractTypographyTokens();
        this.extractSpacingTokens();
        this.extractComponentStyles();
        this.extractScreenHierarchy();
        this.extractI18nVariations();

        // Generate outputs
        this.generateFigmaTokens();
        this.generateDocumentation();
        this.generateComponentLibrary();
        this.generateScreenMaps();

        console.log('✅ Design System Extraction Complete!\n');
        console.log(`📁 Output directory: ${this.outputDir}`);
    }

    ensureOutputDirectory() {
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }

        // Create subdirectories
        const subdirs = ['tokens', 'components', 'screens', 'documentation', 'figma'];
        subdirs.forEach(dir => {
            const dirPath = path.join(this.outputDir, dir);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
        });
    }

    extractThemeTokens() {
        console.log('🎨 Extracting color tokens...');

        try {
            const themeContextPath = path.join(this.srcPath, 'context', 'ThemeContext.js');
            const themeContent = fs.readFileSync(themeContextPath, 'utf8');

            // Extract light theme colors
            const lightThemeMatch = themeContent.match(/const lightTheme = \{[\s\S]*?colors: \{([\s\S]*?)\}/);
            if (lightThemeMatch) {
                this.designTokens.colors.light = this.parseColorTokens(lightThemeMatch[1]);
            }

            // Extract dark theme colors
            const darkThemeMatch = themeContent.match(/const darkTheme = \{[\s\S]*?colors: \{([\s\S]*?)\}/);
            if (darkThemeMatch) {
                this.designTokens.colors.dark = this.parseColorTokens(darkThemeMatch[1]);
            }

            // Extract shadows
            const shadowsMatch = themeContent.match(/shadows: \{([\s\S]*?)\}/);
            if (shadowsMatch) {
                this.designTokens.shadows = this.parseShadowTokens(shadowsMatch[1]);
            }

        } catch (error) {
            console.error('Error extracting theme tokens:', error.message);
        }
    }

    parseColorTokens(colorString) {
        const colors = {};
        const colorLines = colorString.split('\n');

        colorLines.forEach(line => {
            const match = line.match(/(\w+):\s*['"`]([^'"`]+)['"`]/);
            if (match) {
                const [, name, value] = match;
                colors[name] = {
                    value: value,
                    type: 'color',
                    figmaType: 'PAINT'
                };
            }
        });

        return colors;
    }

    parseShadowTokens(shadowString) {
        const shadows = {};
        const lines = shadowString.split('\n');
        let currentShadow = null;

        lines.forEach(line => {
            const nameMatch = line.match(/(\w+):\s*\{/);
            if (nameMatch) {
                currentShadow = nameMatch[1];
                shadows[currentShadow] = {};
            }

            if (currentShadow) {
                const propMatch = line.match(/(\w+):\s*([^,]+)/);
                if (propMatch) {
                    const [, prop, value] = propMatch;
                    shadows[currentShadow][prop] = value.trim().replace(',', '');
                }
            }
        });

        return shadows;
    }

    extractTypographyTokens() {
        console.log('✍️ Extracting typography tokens...');

        try {
            const styleManagerPath = path.join(this.srcPath, 'styles', 'StyleManager.js');
            const styleContent = fs.readFileSync(styleManagerPath, 'utf8');

            // Extract typography object
            const typographyMatch = styleContent.match(/this\.typography = \{([\s\S]*?)\};/);
            if (typographyMatch) {
                this.designTokens.typography = this.parseTypographyTokens(typographyMatch[1]);
            }

        } catch (error) {
            console.error('Error extracting typography tokens:', error.message);
        }
    }

    parseTypographyTokens(typographyString) {
        const typography = {};

        // Extract font sizes
        const sizesMatch = typographyString.match(/sizes:\s*\{([\s\S]*?)\}/);
        if (sizesMatch) {
            typography.sizes = this.parseNumberTokens(sizesMatch[1]);
        }

        // Extract font weights
        const weightsMatch = typographyString.match(/weights:\s*\{([\s\S]*?)\}/);
        if (weightsMatch) {
            typography.weights = this.parseStringTokens(weightsMatch[1]);
        }

        // Extract line heights
        const lineHeightsMatch = typographyString.match(/lineHeights:\s*\{([\s\S]*?)\}/);
        if (lineHeightsMatch) {
            typography.lineHeights = this.parseNumberTokens(lineHeightsMatch[1]);
        }

        return typography;
    }

    parseNumberTokens(tokenString) {
        const tokens = {};
        const lines = tokenString.split('\n');

        lines.forEach(line => {
            const match = line.match(/(\w+):\s*(\d+)/);
            if (match) {
                const [, name, value] = match;
                tokens[name] = {
                    value: parseInt(value),
                    type: 'number',
                    figmaType: 'FLOAT'
                };
            }
        });

        return tokens;
    }

    parseStringTokens(tokenString) {
        const tokens = {};
        const lines = tokenString.split('\n');

        lines.forEach(line => {
            const match = line.match(/(\w+):\s*['"`]([^'"`]+)['"`]/);
            if (match) {
                const [, name, value] = match;
                tokens[name] = {
                    value: value,
                    type: 'string',
                    figmaType: 'STRING'
                };
            }
        });

        return tokens;
    }

    extractSpacingTokens() {
        console.log('📏 Extracting spacing tokens...');

        try {
            const styleManagerPath = path.join(this.srcPath, 'styles', 'StyleManager.js');
            const styleContent = fs.readFileSync(styleManagerPath, 'utf8');

            // Extract spacing
            const spacingMatch = styleContent.match(/this\.spacing = \{([\s\S]*?)\};/);
            if (spacingMatch) {
                this.designTokens.spacing = this.parseNumberTokens(spacingMatch[1]);
            }

            // Extract border radius
            const borderRadiusMatch = styleContent.match(/this\.borderRadius = \{([\s\S]*?)\};/);
            if (borderRadiusMatch) {
                this.designTokens.borderRadius = this.parseNumberTokens(borderRadiusMatch[1]);
            }

        } catch (error) {
            console.error('Error extracting spacing tokens:', error.message);
        }
    }

    extractComponentStyles() {
        console.log('🧩 Analyzing component styles...');

        const componentsDir = path.join(this.srcPath, 'components');
        const screensDir = path.join(this.srcPath, 'screens');

        this.analyzeDirectory(componentsDir, 'components');
        this.analyzeDirectory(screensDir, 'screens');
    }

    analyzeDirectory(directory, type) {
        if (!fs.existsSync(directory)) return;

        const files = fs.readdirSync(directory);

        files.forEach(file => {
            if (file.endsWith('.js')) {
                this.analyzeComponentFile(path.join(directory, file), type);
            }
        });
    }

    analyzeComponentFile(filePath, type) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const fileName = path.basename(filePath, '.js');

            const component = {
                name: fileName,
                type: type,
                path: filePath,
                styles: this.extractFileStyles(content),
                icons: this.extractIconUsage(content),
                i18nKeys: this.extractI18nKeys(content),
                dependencies: this.extractDependencies(content)
            };

            if (type === 'components') {
                this.designTokens.components[fileName] = component;
            } else {
                this.designTokens.screens[fileName] = component;
            }

        } catch (error) {
            console.error(`Error analyzing ${filePath}:`, error.message);
        }
    }

    extractFileStyles(content) {
        const styles = [];

        // Extract StyleSheet.create calls
        const styleMatches = content.match(/StyleSheet\.create\(\{([\s\S]*?)\}\)/g);

        if (styleMatches) {
            styleMatches.forEach(match => {
                const styleContent = match.match(/StyleSheet\.create\(\{([\s\S]*?)\}\)/)[1];
                styles.push(this.parseStyleObject(styleContent));
            });
        }

        return styles;
    }

    parseStyleObject(styleString) {
        const styles = {};
        const lines = styleString.split('\n');
        let currentStyle = null;

        lines.forEach(line => {
            const styleNameMatch = line.match(/(\w+):\s*\{/);
            if (styleNameMatch) {
                currentStyle = styleNameMatch[1];
                styles[currentStyle] = {};
            }

            if (currentStyle) {
                const propMatch = line.match(/(\w+):\s*([^,]+)/);
                if (propMatch) {
                    const [, prop, value] = propMatch;
                    styles[currentStyle][prop] = value.trim().replace(/[,']/g, '');
                }
            }
        });

        return styles;
    }

    extractIconUsage(content) {
        const icons = [];
        const iconMatches = content.match(/import.*from\s*['"`]@fluentui\/react-native-icons['"`]/);

        if (iconMatches) {
            const iconImports = content.match(/\{([^}]+)\}/);
            if (iconImports) {
                const iconNames = iconImports[1].split(',').map(name => name.trim());
                icons.push(...iconNames);
            }
        }

        return icons;
    }

    extractI18nKeys(content) {
        const keys = [];
        const i18nMatches = content.match(/t\(['"`]([^'"`]+)['"`]\)/g);

        if (i18nMatches) {
            i18nMatches.forEach(match => {
                const key = match.match(/t\(['"`]([^'"`]+)['"`]\)/)[1];
                keys.push(key);
            });
        }

        return keys;
    }

    extractDependencies(content) {
        const deps = [];
        const importMatches = content.match(/import.*from\s*['"`]([^'"`]+)['"`]/g);

        if (importMatches) {
            importMatches.forEach(match => {
                const dep = match.match(/from\s*['"`]([^'"`]+)['"`]/)[1];
                if (!dep.startsWith('@react-native') && !dep.startsWith('react')) {
                    deps.push(dep);
                }
            });
        }

        return deps;
    }

    extractScreenHierarchy() {
        console.log('🗺️ Mapping screen hierarchy...');

        try {
            const navigatorPath = path.join(this.srcPath, 'navigation', 'AppNavigator.js');
            const navContent = fs.readFileSync(navigatorPath, 'utf8');

            // Extract screen names and their navigation structure
            const screenMatches = navContent.match(/<Stack\.Screen[\s\S]*?\/>/g);

            if (screenMatches) {
                const hierarchy = screenMatches.map(match => {
                    const nameMatch = match.match(/name=['"`]([^'"`]+)['"`]/);
                    const componentMatch = match.match(/component=\{([^}]+)\}/);

                    return {
                        name: nameMatch ? nameMatch[1] : null,
                        component: componentMatch ? componentMatch[1] : null,
                        raw: match
                    };
                }).filter(screen => screen.name);

                this.designTokens.navigation = hierarchy;
            }

        } catch (error) {
            console.error('Error extracting navigation:', error.message);
        }
    }

    extractI18nVariations() {
        console.log('🌍 Extracting i18n variations...');

        try {
            const i18nPath = path.join(this.srcPath, 'localization', 'i18n.js');
            const i18nContent = fs.readFileSync(i18nPath, 'utf8');

            // Extract English translations
            const enMatch = i18nContent.match(/en:\s*\{[\s\S]*?translation:\s*\{([\s\S]*?)\}\s*\}/);
            if (enMatch) {
                this.designTokens.i18n.en = this.parseI18nObject(enMatch[1]);
            }

            // Extract Arabic translations
            const arMatch = i18nContent.match(/ar:\s*\{[\s\S]*?translation:\s*\{([\s\S]*?)\}\s*\}/);
            if (arMatch) {
                this.designTokens.i18n.ar = this.parseI18nObject(arMatch[1]);
            }

        } catch (error) {
            console.error('Error extracting i18n:', error.message);
        }
    }

    parseI18nObject(i18nString) {
        // Simplified i18n parsing - this would need more sophisticated parsing
        // for nested objects in a real implementation
        const translations = {};
        const lines = i18nString.split('\n');

        lines.forEach(line => {
            const match = line.match(/(\w+):\s*['"`]([^'"`]+)['"`]/);
            if (match) {
                const [, key, value] = match;
                translations[key] = value;
            }
        });

        return translations;
    }

    generateFigmaTokens() {
        console.log('🎨 Generating Figma design tokens...');

        const figmaTokens = {
            global: {
                colors: this.convertColorsToFigmaFormat(),
                typography: this.convertTypographyToFigmaFormat(),
                spacing: this.convertSpacingToFigmaFormat(),
                effects: this.convertShadowsToFigmaFormat()
            },
            themes: {
                light: {
                    colors: this.designTokens.colors.light
                },
                dark: {
                    colors: this.designTokens.colors.dark
                }
            }
        };

        this.writeJsonFile('figma/design-tokens.json', figmaTokens);
    }

    convertColorsToFigmaFormat() {
        const figmaColors = {};

        ['light', 'dark'].forEach(theme => {
            if (this.designTokens.colors[theme]) {
                Object.entries(this.designTokens.colors[theme]).forEach(([name, color]) => {
                    figmaColors[`${theme}-${name}`] = {
                        value: color.value,
                        type: 'color',
                        description: `${theme} theme ${name} color`
                    };
                });
            }
        });

        return figmaColors;
    }

    convertTypographyToFigmaFormat() {
        const figmaTypography = {};

        if (this.designTokens.typography.sizes) {
            Object.entries(this.designTokens.typography.sizes).forEach(([name, size]) => {
                figmaTypography[`fontSize-${name}`] = {
                    value: size.value,
                    type: 'fontSizes',
                    description: `Font size ${name}`
                };
            });
        }

        if (this.designTokens.typography.weights) {
            Object.entries(this.designTokens.typography.weights).forEach(([name, weight]) => {
                figmaTypography[`fontWeight-${name}`] = {
                    value: weight.value,
                    type: 'fontWeights',
                    description: `Font weight ${name}`
                };
            });
        }

        return figmaTypography;
    }

    convertSpacingToFigmaFormat() {
        const figmaSpacing = {};

        if (this.designTokens.spacing) {
            Object.entries(this.designTokens.spacing).forEach(([name, space]) => {
                figmaSpacing[`spacing-${name}`] = {
                    value: space.value,
                    type: 'spacing',
                    description: `Spacing ${name}`
                };
            });
        }

        return figmaSpacing;
    }

    convertShadowsToFigmaFormat() {
        const figmaEffects = {};

        if (this.designTokens.shadows) {
            Object.entries(this.designTokens.shadows).forEach(([name, shadow]) => {
                figmaEffects[`shadow-${name}`] = {
                    value: shadow,
                    type: 'boxShadow',
                    description: `Shadow ${name}`
                };
            });
        }

        return figmaEffects;
    }

    generateDocumentation() {
        console.log('📚 Generating documentation...');

        // Generate comprehensive documentation
        const docs = {
            overview: this.generateOverviewDoc(),
            colors: this.generateColorDoc(),
            typography: this.generateTypographyDoc(),
            spacing: this.generateSpacingDoc(),
            components: this.generateComponentDoc(),
            screens: this.generateScreenDoc(),
            i18n: this.generateI18nDoc()
        };

        Object.entries(docs).forEach(([name, content]) => {
            this.writeFile(`documentation/${name}.md`, content);
        });
    }

    generateOverviewDoc() {
        return `# SERA Mobile Design System

## Overview
This document contains the complete design system extracted from the SERA Mobile React Native application.

## Structure
- **Colors**: Light and dark theme color palettes
- **Typography**: Font sizes, weights, and line heights
- **Spacing**: Consistent spacing scale
- **Components**: ${Object.keys(this.designTokens.components).length} components analyzed
- **Screens**: ${Object.keys(this.designTokens.screens).length} screens documented
- **Internationalization**: Arabic and English variations

## Key Features
- 🇸🇦 Government-compliant design system
- 🌍 Arabic (RTL) and English (LTR) support
- 🌙 Light and dark theme variations
- 🔐 Nafath authentication integration
- 📱 Mobile-first responsive design

Generated on: ${new Date().toISOString()}
`;
    }

    generateColorDoc() {
        let doc = `# Color System\n\n`;

        ['light', 'dark'].forEach(theme => {
            if (this.designTokens.colors[theme]) {
                doc += `## ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme\n\n`;

                Object.entries(this.designTokens.colors[theme]).forEach(([name, color]) => {
                    doc += `### ${name}\n`;
                    doc += `- **Value**: \`${color.value}\`\n`;
                    doc += `- **Usage**: ${this.getColorUsage(name)}\n\n`;
                });
            }
        });

        return doc;
    }

    getColorUsage(colorName) {
        const usageMap = {
            primary: 'Primary brand color for buttons, links, and key UI elements',
            primaryLight: 'Light variant of primary color for backgrounds and hover states',
            primaryDark: 'Dark variant of primary color for pressed states',
            background: 'Main background color for screens',
            surface: 'Surface color for cards and elevated elements',
            text: 'Primary text color',
            textSecondary: 'Secondary text color for less important content',
            error: 'Error state color for validation and alerts',
            success: 'Success state color for confirmations',
            warning: 'Warning state color for cautions'
        };

        return usageMap[colorName] || 'General purpose color';
    }

    generateTypographyDoc() {
        let doc = `# Typography System\n\n`;

        if (this.designTokens.typography.sizes) {
            doc += `## Font Sizes\n\n`;
            Object.entries(this.designTokens.typography.sizes).forEach(([name, size]) => {
                doc += `- **${name}**: ${size.value}px\n`;
            });
            doc += `\n`;
        }

        if (this.designTokens.typography.weights) {
            doc += `## Font Weights\n\n`;
            Object.entries(this.designTokens.typography.weights).forEach(([name, weight]) => {
                doc += `- **${name}**: ${weight.value}\n`;
            });
            doc += `\n`;
        }

        doc += `## Typography Usage\n\n`;
        doc += `- Uses system fonts for optimal Arabic and English rendering\n`;
        doc += `- Supports RTL text direction for Arabic content\n`;
        doc += `- Consistent line heights for readability\n`;

        return doc;
    }

    generateSpacingDoc() {
        let doc = `# Spacing System\n\n`;

        if (this.designTokens.spacing) {
            doc += `## Spacing Scale\n\n`;
            Object.entries(this.designTokens.spacing).forEach(([name, space]) => {
                doc += `- **${name}**: ${space.value}px\n`;
            });
        }

        if (this.designTokens.borderRadius) {
            doc += `\n## Border Radius\n\n`;
            Object.entries(this.designTokens.borderRadius).forEach(([name, radius]) => {
                doc += `- **${name}**: ${radius.value}px\n`;
            });
        }

        return doc;
    }

    generateComponentDoc() {
        let doc = `# Component Library\n\n`;

        Object.entries(this.designTokens.components).forEach(([name, component]) => {
            doc += `## ${name}\n\n`;
            doc += `- **Type**: ${component.type}\n`;
            doc += `- **Path**: ${component.path}\n`;

            if (component.icons.length > 0) {
                doc += `- **Icons Used**: ${component.icons.join(', ')}\n`;
            }

            if (component.i18nKeys.length > 0) {
                doc += `- **I18n Keys**: ${component.i18nKeys.slice(0, 5).join(', ')}${component.i18nKeys.length > 5 ? '...' : ''}\n`;
            }

            doc += `\n`;
        });

        return doc;
    }

    generateScreenDoc() {
        let doc = `# Screen Documentation\n\n`;

        if (this.designTokens.navigation) {
            doc += `## Navigation Structure\n\n`;
            this.designTokens.navigation.forEach(screen => {
                doc += `- **${screen.name}**: ${screen.component}\n`;
            });
            doc += `\n`;
        }

        doc += `## Screen Details\n\n`;
        Object.entries(this.designTokens.screens).forEach(([name, screen]) => {
            doc += `### ${name}\n\n`;
            doc += `- **Component**: ${screen.name}\n`;

            if (screen.i18nKeys.length > 0) {
                doc += `- **Text Content**: ${screen.i18nKeys.length} translatable strings\n`;
            }

            if (screen.icons.length > 0) {
                doc += `- **Icons**: ${screen.icons.length} unique icons\n`;
            }

            doc += `\n`;
        });

        return doc;
    }

    generateI18nDoc() {
        let doc = `# Internationalization\n\n`;

        doc += `## Supported Languages\n\n`;
        doc += `- **Arabic (ar)**: Right-to-left (RTL) layout\n`;
        doc += `- **English (en)**: Left-to-right (LTR) layout\n\n`;

        if (this.designTokens.i18n.en && this.designTokens.i18n.ar) {
            const enKeys = Object.keys(this.designTokens.i18n.en);
            const arKeys = Object.keys(this.designTokens.i18n.ar);

            doc += `## Translation Statistics\n\n`;
            doc += `- **English Keys**: ${enKeys.length}\n`;
            doc += `- **Arabic Keys**: ${arKeys.length}\n`;
            doc += `- **Coverage**: ${Math.round((Math.min(enKeys.length, arKeys.length) / Math.max(enKeys.length, arKeys.length)) * 100)}%\n\n`;
        }

        return doc;
    }

    generateComponentLibrary() {
        console.log('🧩 Generating component library...');

        const componentLib = {
            metadata: {
                name: 'SERA Mobile Component Library',
                description: 'Government-compliant component library for Saudi Electricity Regulatory Authority',
                version: '1.0.0',
                extractedAt: new Date().toISOString()
            },
            components: this.designTokens.components,
            designTokens: {
                colors: this.designTokens.colors,
                typography: this.designTokens.typography,
                spacing: this.designTokens.spacing,
                shadows: this.designTokens.shadows
            }
        };

        this.writeJsonFile('components/component-library.json', componentLib);
    }

    generateScreenMaps() {
        console.log('🗺️ Generating screen maps...');

        const screenMaps = {
            hierarchy: this.designTokens.navigation,
            screens: this.designTokens.screens,
            userFlows: this.generateUserFlows()
        };

        this.writeJsonFile('screens/screen-maps.json', screenMaps);
    }

    generateUserFlows() {
        // Generate common user flows based on screen names
        const flows = [];

        if (this.designTokens.navigation) {
            // Authentication Flow
            const authScreens = this.designTokens.navigation.filter(screen =>
                screen.name.toLowerCase().includes('login') ||
                screen.name.toLowerCase().includes('nafath')
            );

            if (authScreens.length > 0) {
                flows.push({
                    name: 'Authentication Flow',
                    screens: authScreens.map(s => s.name),
                    description: 'User authentication via Nafath system'
                });
            }

            // Complaints Flow
            const complaintScreens = this.designTokens.navigation.filter(screen =>
                screen.name.toLowerCase().includes('complaint')
            );

            if (complaintScreens.length > 0) {
                flows.push({
                    name: 'Complaints Management',
                    screens: complaintScreens.map(s => s.name),
                    description: 'Submit and manage complaints'
                });
            }

            // Permits Flow
            const permitScreens = this.designTokens.navigation.filter(screen =>
                screen.name.toLowerCase().includes('permit')
            );

            if (permitScreens.length > 0) {
                flows.push({
                    name: 'Permits & Licensing',
                    screens: permitScreens.map(s => s.name),
                    description: 'Apply for and manage permits'
                });
            }
        }

        return flows;
    }

    writeJsonFile(filename, data) {
        const filePath = path.join(this.outputDir, filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`✅ Generated: ${filename}`);
    }

    writeFile(filename, content) {
        const filePath = path.join(this.outputDir, filename);
        fs.writeFileSync(filePath, content);
        console.log(`✅ Generated: ${filename}`);
    }
}

// CLI Interface
if (require.main === module) {
    const extractor = new SERADesignSystemExtractor();
}

module.exports = SERADesignSystemExtractor; 