#!/usr/bin/env node

/**
 * 🖼️ SERA Mobile Screen Creator for Figma
 * 
 * Analyzes React Native screens and generates Figma screen specifications:
 * - Screen layouts and component hierarchy
 * - Content structure and text elements
 * - Image and icon placements
 * - Navigation patterns
 * - Form layouts
 * - Responsive breakpoints
 */

const fs = require('fs');
const path = require('path');

class FigmaScreenCreator {
    constructor() {
        this.projectRoot = process.cwd();
        this.srcPath = path.join(this.projectRoot, 'src');
        this.screensPath = path.join(this.srcPath, 'screens');
        this.outputDir = path.join(this.projectRoot, 'design-system-export', 'figma-screens');

        this.screenSpecs = {};
        this.componentLibrary = {};
        this.layoutPatterns = {};
    }

    init() {
        console.log('🖼️ Analyzing SERA Mobile Screens for Figma Recreation...\n');

        this.ensureOutputDirectory();
        this.analyzeAllScreens();
        this.generateScreenSpecs();
        this.generateComponentSpecs();
        this.generateFigmaGuide();
        this.generateScreenTemplates();

        console.log('✅ Figma Screen Creator Complete!');
        console.log(`📁 Output directory: ${this.outputDir}`);
    }

    ensureOutputDirectory() {
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }

        ['specs', 'components', 'layouts', 'templates', 'assets'].forEach(dir => {
            const dirPath = path.join(this.outputDir, dir);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath);
            }
        });
    }

    analyzeAllScreens() {
        console.log('📱 Analyzing screen layouts...');

        if (!fs.existsSync(this.screensPath)) {
            console.error('Screens directory not found');
            return;
        }

        const screenFiles = fs.readdirSync(this.screensPath)
            .filter(file => file.endsWith('.js'))
            .sort();

        screenFiles.forEach(file => {
            this.analyzeScreen(file);
        });
    }

    analyzeScreen(filename) {
        const filePath = path.join(this.screensPath, filename);
        const screenName = path.basename(filename, '.js');

        try {
            const content = fs.readFileSync(filePath, 'utf8');

            const screenSpec = {
                name: screenName,
                type: this.determineScreenType(screenName),
                layout: this.analyzeLayout(content),
                components: this.extractComponents(content),
                navigation: this.extractNavigation(content),
                forms: this.extractForms(content),
                content: this.extractContent(content),
                images: this.extractImages(content),
                icons: this.extractIcons(content),
                i18n: this.extractI18nKeys(content),
                states: this.extractStates(content),
                figmaSpecs: this.generateFigmaSpecs(screenName, content)
            };

            this.screenSpecs[screenName] = screenSpec;

        } catch (error) {
            console.error(`Error analyzing ${filename}:`, error.message);
        }
    }

    determineScreenType(screenName) {
        const patterns = {
            'auth': ['Login', 'Nafath', 'Verification'],
            'home': ['Home'],
            'form': ['Create', 'Form'],
            'list': ['View', 'List'],
            'detail': ['Detail', 'Profile'],
            'info': ['About', 'FAQ', 'Policy', 'Contact'],
            'settings': ['Settings', 'More'],
            'splash': ['Splash']
        };

        for (const [type, keywords] of Object.entries(patterns)) {
            if (keywords.some(keyword => screenName.includes(keyword))) {
                return type;
            }
        }

        return 'general';
    }

    analyzeLayout(content) {
        const layout = {
            structure: 'unknown',
            hasHeader: false,
            hasFooter: false,
            hasTabBar: false,
            scrollable: false,
            sections: []
        };

        // Detect layout patterns
        if (content.includes('ScrollView')) {
            layout.scrollable = true;
            layout.structure = 'scroll';
        } else if (content.includes('FlatList') || content.includes('SectionList')) {
            layout.structure = 'list';
        } else {
            layout.structure = 'static';
        }

        // Detect navigation elements
        if (content.includes('navigation.goBack') || content.includes('HeaderBackButton')) {
            layout.hasHeader = true;
        }

        if (content.includes('tabBarOptions') || content.includes('BottomTabNavigator')) {
            layout.hasTabBar = true;
        }

        // Extract sections
        const sectionMatches = content.match(/<View[^>]*style[^>]*>[^<]*<Text[^>]*>/g);
        if (sectionMatches) {
            layout.sections = sectionMatches.length;
        }

        return layout;
    }

    extractComponents(content) {
        const components = [];

        // Common React Native components
        const componentPatterns = {
            'Button': /<TouchableOpacity|<Button/g,
            'Input': /<TextInput/g,
            'Text': /<Text[^>]*>/g,
            'Image': /<Image/g,
            'Card': /style.*card|Card/gi,
            'List': /<FlatList|<SectionList/g,
            'Modal': /<Modal/g,
            'Picker': /<Picker/g,
            'Switch': /<Switch/g,
            'Slider': /<Slider/g
        };

        Object.entries(componentPatterns).forEach(([component, pattern]) => {
            const matches = content.match(pattern);
            if (matches) {
                components.push({
                    type: component,
                    count: matches.length,
                    usage: this.getComponentUsage(component, content)
                });
            }
        });

        return components;
    }

    getComponentUsage(component, content) {
        const usagePatterns = {
            'Button': this.extractButtonUsage(content),
            'Input': this.extractInputUsage(content),
            'Text': this.extractTextUsage(content),
            'Image': this.extractImageUsage(content),
            'Card': this.extractCardUsage(content)
        };

        return usagePatterns[component] || [];
    }

    extractButtonUsage(content) {
        const buttons = [];
        const buttonMatches = content.match(/<TouchableOpacity[\s\S]*?<\/TouchableOpacity>|<Button[\s\S]*?\/>/g);

        if (buttonMatches) {
            buttonMatches.forEach(match => {
                const button = {
                    type: 'button',
                    variant: 'primary',
                    text: this.extractTextFromElement(match),
                    action: this.extractOnPress(match)
                };

                // Determine button variant
                if (match.includes('secondary') || match.includes('outline')) {
                    button.variant = 'secondary';
                }

                buttons.push(button);
            });
        }

        return buttons;
    }

    extractInputUsage(content) {
        const inputs = [];
        const inputMatches = content.match(/<TextInput[\s\S]*?\/>/g);

        if (inputMatches) {
            inputMatches.forEach(match => {
                const input = {
                    type: 'input',
                    placeholder: this.extractAttribute(match, 'placeholder'),
                    multiline: match.includes('multiline'),
                    secureTextEntry: match.includes('secureTextEntry'),
                    keyboardType: this.extractAttribute(match, 'keyboardType')
                };

                inputs.push(input);
            });
        }

        return inputs;
    }

    extractTextUsage(content) {
        const texts = [];
        const textMatches = content.match(/<Text[^>]*>([^<]+)<\/Text>/g);

        if (textMatches) {
            textMatches.slice(0, 10).forEach(match => { // Limit to first 10
                const textContent = match.match(/>([^<]+)</)[1];
                const isI18n = textContent.includes('t(');

                texts.push({
                    type: 'text',
                    content: textContent,
                    isTranslatable: isI18n,
                    style: this.extractTextStyle(match)
                });
            });
        }

        return texts;
    }

    extractTextStyle(textElement) {
        const styles = {};

        if (textElement.includes('fontSize')) {
            const fontSizeMatch = textElement.match(/fontSize:\s*(\d+)/);
            if (fontSizeMatch) styles.fontSize = fontSizeMatch[1];
        }

        if (textElement.includes('fontWeight')) {
            const fontWeightMatch = textElement.match(/fontWeight:\s*['"`]([^'"`]+)['"`]/);
            if (fontWeightMatch) styles.fontWeight = fontWeightMatch[1];
        }

        if (textElement.includes('color')) {
            const colorMatch = textElement.match(/color:\s*['"`]([^'"`]+)['"`]/);
            if (colorMatch) styles.color = colorMatch[1];
        }

        return styles;
    }

    extractNavigation(content) {
        const navigation = {
            hasBackButton: false,
            title: null,
            actions: []
        };

        if (content.includes('navigation.goBack')) {
            navigation.hasBackButton = true;
        }

        // Extract screen title
        const titleMatch = content.match(/title:\s*['"`]([^'"`]+)['"`]/);
        if (titleMatch) {
            navigation.title = titleMatch[1];
        }

        // Extract navigation actions
        const actionMatches = content.match(/navigation\.(navigate|push|replace)/g);
        if (actionMatches) {
            navigation.actions = actionMatches;
        }

        return navigation;
    }

    extractForms(content) {
        const forms = [];

        // Look for form patterns
        if (content.includes('TextInput') && content.includes('onPress')) {
            const form = {
                type: 'form',
                fields: [],
                submitButton: null,
                validation: false
            };

            // Extract form fields
            const inputMatches = content.match(/<TextInput[\s\S]*?\/>/g);
            if (inputMatches) {
                inputMatches.forEach(input => {
                    form.fields.push({
                        type: 'input',
                        placeholder: this.extractAttribute(input, 'placeholder'),
                        required: input.includes('required'),
                        validation: input.includes('error')
                    });
                });
            }

            // Look for submit button
            if (content.includes('submit') || content.includes('save') || content.includes('send')) {
                form.submitButton = true;
            }

            forms.push(form);
        }

        return forms;
    }

    extractContent(content) {
        const contentStructure = {
            headers: [],
            paragraphs: [],
            lists: [],
            links: []
        };

        // Extract headers (large text elements)
        const headerMatches = content.match(/fontSize:\s*(2[0-9]|[3-9][0-9])/g);
        if (headerMatches) {
            contentStructure.headers = headerMatches.map(match => ({
                fontSize: match.match(/\d+/)[0]
            }));
        }

        // Extract i18n keys for content
        const i18nMatches = content.match(/t\(['"`]([^'"`]+)['"`]\)/g);
        if (i18nMatches) {
            contentStructure.i18nKeys = i18nMatches.map(match =>
                match.match(/['"`]([^'"`]+)['"`]/)[1]
            );
        }

        return contentStructure;
    }

    extractImages(content) {
        const images = [];
        const imageMatches = content.match(/<Image[\s\S]*?\/>/g);

        if (imageMatches) {
            imageMatches.forEach(match => {
                const source = this.extractAttribute(match, 'source');
                const style = this.extractStyleAttribute(match);

                images.push({
                    type: 'image',
                    source: source,
                    style: style,
                    resizeMode: this.extractAttribute(match, 'resizeMode')
                });
            });
        }

        return images;
    }

    extractIcons(content) {
        const icons = [];

        // Extract FluentUI icons
        const iconImportMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*['"`]@fluentui\/react-native-icons['"`]/);
        if (iconImportMatch) {
            const iconNames = iconImportMatch[1].split(',').map(name => name.trim());
            icons.push(...iconNames.map(name => ({
                type: 'icon',
                name: name,
                library: 'FluentUI'
            })));
        }

        return icons;
    }

    extractI18nKeys(content) {
        const keys = [];
        const i18nMatches = content.match(/t\(['"`]([^'"`]+)['"`]\)/g);

        if (i18nMatches) {
            i18nMatches.forEach(match => {
                const key = match.match(/['"`]([^'"`]+)['"`]/)[1];
                keys.push(key);
            });
        }

        return keys;
    }

    extractStates(content) {
        const states = {
            loading: false,
            error: false,
            empty: false,
            success: false
        };

        if (content.includes('loading') || content.includes('Loading')) {
            states.loading = true;
        }

        if (content.includes('error') || content.includes('Error')) {
            states.error = true;
        }

        if (content.includes('empty') || content.includes('Empty')) {
            states.empty = true;
        }

        if (content.includes('success') || content.includes('Success')) {
            states.success = true;
        }

        return states;
    }

    generateFigmaSpecs(screenName, content) {
        return {
            frame: {
                width: 375, // iPhone standard width
                height: 812, // iPhone standard height
                name: `${screenName} - Mobile`
            },
            layout: {
                direction: this.isRTLScreen(content) ? 'rtl' : 'ltr',
                padding: {
                    top: 44, // Status bar
                    left: 20,
                    right: 20,
                    bottom: 34 // Home indicator
                }
            },
            components: this.generateComponentSpecs(content),
            breakpoints: [
                { name: 'Mobile', width: 375 },
                { name: 'Mobile Large', width: 414 },
                { name: 'Tablet', width: 768 }
            ]
        };
    }

    isRTLScreen(content) {
        return content.includes('I18nManager.isRTL') ||
            content.includes('direction: \'rtl\'') ||
            content.includes('textAlign: \'right\'');
    }

    generateComponentSpecs(content) {
        return {
            header: this.hasHeader(content),
            navigation: this.hasNavigation(content),
            content: this.hasMainContent(content),
            forms: this.hasForms(content),
            footer: this.hasFooter(content)
        };
    }

    hasHeader(content) {
        return content.includes('header') || content.includes('navigation.setOptions');
    }

    hasNavigation(content) {
        return content.includes('navigation.') || content.includes('useNavigation');
    }

    hasMainContent(content) {
        return content.includes('ScrollView') || content.includes('View');
    }

    hasForms(content) {
        return content.includes('TextInput') && content.includes('onPress');
    }

    hasFooter(content) {
        return content.includes('footer') || content.includes('TabNavigator');
    }

    extractAttribute(element, attribute) {
        const pattern = new RegExp(`${attribute}=\\{?['"\`]?([^'"\`}]+)['"\`]?\\}?`);
        const match = element.match(pattern);
        return match ? match[1] : null;
    }

    extractStyleAttribute(element) {
        const styleMatch = element.match(/style=\{([^}]+)\}/);
        return styleMatch ? styleMatch[1] : null;
    }

    extractTextFromElement(element) {
        const textMatch = element.match(/>([^<]+)</);
        return textMatch ? textMatch[1] : null;
    }

    extractOnPress(element) {
        const onPressMatch = element.match(/onPress=\{([^}]+)\}/);
        return onPressMatch ? onPressMatch[1] : null;
    }

    generateScreenSpecs() {
        console.log('📋 Generating screen specifications...');

        const specs = {
            metadata: {
                totalScreens: Object.keys(this.screenSpecs).length,
                screenTypes: this.analyzeScreenTypes(),
                commonPatterns: this.identifyCommonPatterns(),
                generatedAt: new Date().toISOString()
            },
            screens: this.screenSpecs
        };

        fs.writeFileSync(
            path.join(this.outputDir, 'specs', 'screen-specifications.json'),
            JSON.stringify(specs, null, 2)
        );

        console.log('✅ Generated: screen-specifications.json');
    }

    analyzeScreenTypes() {
        const types = {};
        Object.values(this.screenSpecs).forEach(spec => {
            types[spec.type] = (types[spec.type] || 0) + 1;
        });
        return types;
    }

    identifyCommonPatterns() {
        const patterns = {
            hasScrolling: 0,
            hasForms: 0,
            hasNavigation: 0,
            hasImages: 0,
            isRTL: 0
        };

        Object.values(this.screenSpecs).forEach(spec => {
            if (spec.layout.scrollable) patterns.hasScrolling++;
            if (spec.forms.length > 0) patterns.hasForms++;
            if (spec.navigation.hasBackButton) patterns.hasNavigation++;
            if (spec.images.length > 0) patterns.hasImages++;
            if (spec.figmaSpecs.layout.direction === 'rtl') patterns.isRTL++;
        });

        return patterns;
    }

    generateComponentSpecs() {
        console.log('🧩 Generating component specifications...');

        // Analyze common components across all screens
        const componentUsage = {};

        Object.values(this.screenSpecs).forEach(spec => {
            spec.components.forEach(comp => {
                if (!componentUsage[comp.type]) {
                    componentUsage[comp.type] = {
                        totalUsage: 0,
                        screens: [],
                        variations: []
                    };
                }

                componentUsage[comp.type].totalUsage += comp.count;
                componentUsage[comp.type].screens.push(spec.name);
                componentUsage[comp.type].variations.push(...comp.usage);
            });
        });

        const componentLib = {
            metadata: {
                totalComponents: Object.keys(componentUsage).length,
                mostUsed: this.getMostUsedComponents(componentUsage),
                generatedAt: new Date().toISOString()
            },
            components: componentUsage,
            figmaComponents: this.generateFigmaComponentSpecs(componentUsage)
        };

        fs.writeFileSync(
            path.join(this.outputDir, 'components', 'component-specifications.json'),
            JSON.stringify(componentLib, null, 2)
        );

        console.log('✅ Generated: component-specifications.json');
    }

    getMostUsedComponents(componentUsage) {
        return Object.entries(componentUsage)
            .sort(([, a], [, b]) => b.totalUsage - a.totalUsage)
            .slice(0, 5)
            .map(([name, data]) => ({ name, usage: data.totalUsage }));
    }

    generateFigmaComponentSpecs(componentUsage) {
        const figmaComponents = {};

        Object.entries(componentUsage).forEach(([type, data]) => {
            figmaComponents[type] = {
                figmaSpecs: {
                    autoLayout: type === 'Button' || type === 'Card',
                    constraints: 'stretch',
                    fills: this.getComponentFills(type),
                    effects: this.getComponentEffects(type),
                    cornerRadius: this.getComponentRadius(type)
                },
                variants: this.getComponentVariants(type, data.variations),
                usage: `Used in ${data.screens.length} screens`
            };
        });

        return figmaComponents;
    }

    getComponentFills(type) {
        const fillMap = {
            'Button': [{ type: 'SOLID', color: { r: 0, g: 0.38, b: 0.23 } }], // Primary green
            'Card': [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }], // White
            'Input': [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }] // White
        };

        return fillMap[type] || [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    }

    getComponentEffects(type) {
        if (type === 'Card' || type === 'Button') {
            return [{
                type: 'DROP_SHADOW',
                color: { r: 0, g: 0, b: 0, a: 0.1 },
                offset: { x: 0, y: 2 },
                radius: 8,
                spread: 0
            }];
        }

        return [];
    }

    getComponentRadius(type) {
        const radiusMap = {
            'Button': 8,
            'Card': 12,
            'Input': 8
        };

        return radiusMap[type] || 0;
    }

    getComponentVariants(type, variations) {
        const variantMap = {
            'Button': ['Primary', 'Secondary', 'Outline'],
            'Text': ['Header', 'Body', 'Caption'],
            'Input': ['Default', 'Error', 'Disabled']
        };

        return variantMap[type] || ['Default'];
    }

    generateFigmaGuide() {
        console.log('📖 Generating Figma recreation guide...');

        const guide = this.createFigmaRecreationGuide();

        fs.writeFileSync(
            path.join(this.outputDir, 'FIGMA_SCREEN_RECREATION_GUIDE.md'),
            guide
        );

        console.log('✅ Generated: FIGMA_SCREEN_RECREATION_GUIDE.md');
    }

    createFigmaRecreationGuide() {
        const totalScreens = Object.keys(this.screenSpecs).length;
        const screenTypes = this.analyzeScreenTypes();

        return `# 🖼️ SERA Mobile - Figma Screen Recreation Guide

## Overview
This guide will help you recreate all ${totalScreens} SERA Mobile screens in Figma using the extracted design system.

## 📊 Screen Analysis Summary

### Screen Types Identified:
${Object.entries(screenTypes).map(([type, count]) => `- **${type}**: ${count} screens`).join('\n')}

### Common Patterns:
- **Scrollable Layouts**: Most screens use ScrollView
- **RTL Support**: All screens support Arabic (right-to-left)
- **Navigation**: Consistent back button and title patterns
- **Forms**: Government-standard form layouts
- **Cards**: Elevated content sections

## 🎯 Step-by-Step Recreation Process

### Phase 1: Setup Figma File
1. **Create new Figma file**: "SERA Mobile Screens"
2. **Import design tokens**: Use the generated figma-tokens.json
3. **Set up artboards**: Create 375x812px frames for each screen
4. **Apply auto-layout**: Use Figma's auto-layout for responsive components

### Phase 2: Create Master Components

#### 2.1 Navigation Components
\`\`\`
📱 Header Component
├── Back Button (24x24px icon)
├── Title Text (fontSize-xl, fontWeight-600)
└── Optional Action Button
\`\`\`

#### 2.2 Content Components
\`\`\`
📄 Card Component
├── Background: surface color
├── Padding: spacing-lg (18px)
├── Border Radius: 12px
└── Shadow: elevation-medium
\`\`\`

#### 2.3 Form Components
\`\`\`
📝 Input Field Component
├── Background: inputBackground color
├── Border: 1px solid inputBorder
├── Padding: spacing-md (16px)
├── Border Radius: 8px
└── Placeholder text style
\`\`\`

#### 2.4 Button Components
\`\`\`
🔘 Primary Button
├── Background: primary color (#00623B)
├── Text: textInverse color
├── Padding: spacing-md spacing-lg
├── Border Radius: 8px
└── Font Weight: 600

🔘 Secondary Button  
├── Background: transparent
├── Text: primary color
├── Border: 1px solid border color
└── Same padding/radius as primary
\`\`\`

### Phase 3: Screen Recreation Priority

#### High Priority (Core Screens):
1. **HomeScreen** - Main dashboard
2. **LoginScreen** - Authentication entry
3. **NafathLoginScreen** - Government auth
4. **ComplaintsScreen** - Service requests
5. **ServicesScreen** - Available services

#### Medium Priority (Feature Screens):
6. **CreateComplaintScreen** - Form layout
7. **ViewComplaintsScreen** - List layout
8. **PermitsScreen** - Government permits
9. **ProfileScreen** - User information
10. **SettingsScreen** - App configuration

#### Low Priority (Information Screens):
11. **AboutScreen** - App information
12. **FAQScreen** - Help content
13. **ContactScreen** - Contact details
14. **PrivacyPolicyScreen** - Legal content
15. **SplashScreen** - App loading

## 🏗️ Screen-by-Screen Layouts

### HomeScreen Layout:
\`\`\`
📱 HomeScreen (375x812px)
├── Status Bar (44px height)
├── Header Section
│   ├── SERA Logo (120x40px)
│   ├── User Greeting Text
│   └── Profile Avatar (40x40px)
├── Quick Actions Grid (2x2)
│   ├── Complaints Card
│   ├── Permits Card  
│   ├── Services Card
│   └── News Card
├── Recent Activity Section
└── Bottom Tab Navigation (83px height)
\`\`\`

### LoginScreen Layout:
\`\`\`
📱 LoginScreen (375x812px)
├── Status Bar (44px)
├── SERA Logo (centered, 160x60px)
├── Welcome Text
├── Login Form
│   ├── Username Input
│   ├── Password Input
│   └── Login Button
├── Nafath Login Button
├── Forgot Password Link
└── Footer Links
\`\`\`

### ComplaintsScreen Layout:
\`\`\`
📱 ComplaintsScreen (375x812px)
├── Navigation Header
│   ├── Back Button
│   └── "Complaints" Title
├── Filter/Search Bar
├── Complaints List (ScrollView)
│   ├── Complaint Card 1
│   ├── Complaint Card 2
│   └── ...
└── Floating Action Button (+)
\`\`\`

## 🌍 Arabic (RTL) Considerations

### RTL Layout Rules:
1. **Text Alignment**: Right-aligned for Arabic content
2. **Icon Direction**: Flip directional icons (arrows, etc.)
3. **Layout Flow**: Right-to-left content flow
4. **Navigation**: Back button on right side
5. **Forms**: Labels on right, inputs flow right-to-left

### RTL Implementation in Figma:
1. Create RTL variants of each screen
2. Use Figma's text direction settings
3. Flip horizontal layouts
4. Adjust icon orientations
5. Test with Arabic content

## 📱 Responsive Breakpoints

### Mobile Breakpoints:
- **iPhone SE**: 320x568px
- **iPhone Standard**: 375x812px  
- **iPhone Plus**: 414x896px
- **Android Standard**: 360x640px

### Component Scaling:
- **Text**: Use rem/em equivalents
- **Spacing**: Scale proportionally
- **Touch Targets**: Minimum 44x44px
- **Content Width**: Max 90% of screen width

## 🎨 Design System Integration

### Using Design Tokens in Figma:
1. **Colors**: Apply SERA color styles
2. **Typography**: Use SERA text styles
3. **Spacing**: Apply consistent spacing tokens
4. **Components**: Build using design system components
5. **Effects**: Apply SERA shadow styles

### Quality Checklist:
- ✅ All colors use design tokens
- ✅ Typography follows scale
- ✅ Spacing is consistent
- ✅ Components are reusable
- ✅ RTL layout tested
- ✅ Government branding applied
- ✅ Accessibility considered

## 🚀 Advanced Features

### Interactive Prototypes:
1. **Navigation Flow**: Link screens with transitions
2. **Form Interactions**: Show form validation states
3. **Loading States**: Add loading animations
4. **Error States**: Design error handling
5. **Success States**: Show completion flows

### Component States:
- **Default**: Normal state
- **Hover**: Desktop hover effects
- **Active**: Pressed/selected state
- **Disabled**: Inactive state
- **Loading**: Processing state
- **Error**: Validation error state

## 📋 Screen Completion Checklist

For each screen, ensure:
- [ ] Correct dimensions (375x812px base)
- [ ] Design tokens applied
- [ ] Navigation structure correct
- [ ] Content hierarchy clear
- [ ] Arabic/English variants created
- [ ] Interactive states designed
- [ ] Accessibility considered
- [ ] Government branding consistent

## 🔗 Resources

### Generated Files:
- **screen-specifications.json**: Detailed screen analysis
- **component-specifications.json**: Component library specs
- **design-tokens.json**: Complete design system
- **figma-tokens.json**: Figma-ready tokens

### Figma Plugins Recommended:
- **Figma Tokens**: Import design tokens
- **Content Reel**: Generate realistic content
- **Stark**: Accessibility checking
- **Auto Layout**: Advanced layout tools

---
Generated on: ${new Date().toISOString()}

**Next Steps:**
1. Start with HomeScreen recreation
2. Build component library first
3. Create RTL variants
4. Test with real content
5. Build interactive prototype

Happy designing! 🎨
`;
    }

    generateScreenTemplates() {
        console.log('📋 Generating screen templates...');

        // Generate specific templates for common screen types
        const templates = {
            authScreen: this.createAuthTemplate(),
            formScreen: this.createFormTemplate(),
            listScreen: this.createListTemplate(),
            detailScreen: this.createDetailTemplate(),
            homeScreen: this.createHomeTemplate()
        };

        Object.entries(templates).forEach(([name, template]) => {
            fs.writeFileSync(
                path.join(this.outputDir, 'templates', `${name}-template.json`),
                JSON.stringify(template, null, 2)
            );
        });

        console.log('✅ Generated: Screen templates');
    }

    createAuthTemplate() {
        return {
            name: "Authentication Screen Template",
            description: "Template for login and authentication screens",
            figmaSpecs: {
                frame: { width: 375, height: 812 },
                layers: [
                    {
                        type: "header",
                        height: 120,
                        content: "SERA Logo"
                    },
                    {
                        type: "form",
                        components: ["input", "input", "button"],
                        spacing: 16
                    },
                    {
                        type: "footer",
                        content: "Alternative login options"
                    }
                ]
            },
            components: ["Logo", "InputField", "PrimaryButton", "SecondaryButton", "Link"],
            states: ["default", "loading", "error"]
        };
    }

    createFormTemplate() {
        return {
            name: "Form Screen Template",
            description: "Template for data entry and form screens",
            figmaSpecs: {
                frame: { width: 375, height: 812 },
                layers: [
                    {
                        type: "navigation",
                        hasBackButton: true,
                        title: "Form Title"
                    },
                    {
                        type: "scrollContent",
                        components: ["section", "input", "picker", "button"]
                    }
                ]
            },
            components: ["Header", "InputField", "Picker", "TextArea", "SubmitButton"],
            states: ["default", "validation", "success", "error"]
        };
    }

    createListTemplate() {
        return {
            name: "List Screen Template",
            description: "Template for displaying lists of items",
            figmaSpecs: {
                frame: { width: 375, height: 812 },
                layers: [
                    {
                        type: "navigation",
                        hasBackButton: true,
                        hasSearch: true
                    },
                    {
                        type: "list",
                        itemTemplate: "card",
                        spacing: 12
                    },
                    {
                        type: "fab",
                        position: "bottom-right"
                    }
                ]
            },
            components: ["Header", "SearchBar", "ListItem", "FAB"],
            states: ["default", "loading", "empty", "error"]
        };
    }

    createDetailTemplate() {
        return {
            name: "Detail Screen Template",
            description: "Template for showing detailed information",
            figmaSpecs: {
                frame: { width: 375, height: 812 },
                layers: [
                    {
                        type: "navigation",
                        hasBackButton: true,
                        hasActions: true
                    },
                    {
                        type: "scrollContent",
                        sections: ["hero", "details", "actions"]
                    }
                ]
            },
            components: ["Header", "HeroSection", "InfoCard", "ActionButton"],
            states: ["default", "loading", "error"]
        };
    }

    createHomeTemplate() {
        return {
            name: "Home Screen Template",
            description: "Template for dashboard and home screens",
            figmaSpecs: {
                frame: { width: 375, height: 812 },
                layers: [
                    {
                        type: "header",
                        hasLogo: true,
                        hasProfile: true
                    },
                    {
                        type: "quickActions",
                        layout: "grid",
                        columns: 2
                    },
                    {
                        type: "recentActivity",
                        maxItems: 5
                    },
                    {
                        type: "tabBar",
                        position: "bottom"
                    }
                ]
            },
            components: ["Logo", "ProfileAvatar", "QuickActionCard", "ActivityItem", "TabBar"],
            states: ["default", "loading", "empty"]
        };
    }
}

// CLI Interface
if (require.main === module) {
    const creator = new FigmaScreenCreator();
    creator.init();
}

module.exports = FigmaScreenCreator; 