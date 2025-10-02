# 🚀 SERA Mobile Figma Quick Start Guide

## **Let's Create Your First Screen in 30 Minutes!**

This guide will walk you through creating the **HomeScreen** in Figma using your extracted design system.

---

## 📋 **What You'll Need:**

✅ **Figma account** (free or paid)  
✅ **Generated design tokens** from `design-system-export/figma/`  
✅ **30 minutes** of focused time  
✅ **This guide** open beside Figma  

---

## 🎯 **Step 1: Setup Your Figma File (5 minutes)**

### 1.1 Create New File
```
1. Open Figma → Create new design file
2. Rename it: "SERA Mobile App Screens"
3. Set up your workspace
```

### 1.2 Import Design Tokens
```
1. Install "Figma Tokens" plugin (if you haven't)
2. Open plugin → Import tokens
3. Upload: design-system-export/figma/figma-tokens.json
4. Click "Update Figma" to apply all tokens
```

### 1.3 Create Mobile Frame
```
1. Press 'F' → Select "iPhone 14" (375 × 812px)
2. Name the frame: "HomeScreen - Light"
3. Set background color: #f8f9fa (light background)
```

---

## 🏗️ **Step 2: Build the Component Library (10 minutes)**

### 2.1 Create Header Component
```
📱 Create Header Component:
1. Draw rectangle: 375 × 80px
2. Fill: #ffffff (surface color)
3. Add shadow: 0px 2px 8px rgba(0,0,0,0.1)

Add SERA Logo:
1. Text element: "SERA" 
2. Font: 24px, Bold, Color: #00623B
3. Position: Left side, centered vertically

Add Profile Avatar:
1. Circle: 40 × 40px
2. Fill: #e9ecef (border color)
3. Position: Right side, centered vertically
4. Add user icon or placeholder
```

### 2.2 Create Card Component
```
📄 Card Component:
1. Rectangle: 343 × 120px (375 - 32px margin)
2. Fill: #ffffff (surface)
3. Border radius: 12px
4. Shadow: 0px 2px 8px rgba(0,0,0,0.1)
5. Padding: 18px all sides

Convert to Component:
1. Select card → Create Component (Ctrl/Cmd + Alt + K)
2. Name: "Quick Action Card"
```

### 2.3 Create Button Component
```
🔘 Primary Button:
1. Rectangle: Auto × 48px
2. Fill: #00623B (primary color)
3. Border radius: 8px
4. Padding: 16px horizontal, 14px vertical
5. Text: "Action Button", 16px, Bold, #ffffff

Create Component:
1. Select button → Create Component
2. Name: "Primary Button"
3. Create variants: Primary, Secondary
```

---

## 🖼️ **Step 3: Build HomeScreen Layout (10 minutes)**

### 3.1 Screen Structure
```
📱 HomeScreen Layout (from top to bottom):

┌─────────────── Header (80px) ───────────────┐
│  SERA Logo              Profile Avatar      │
├─────────────── Content Area ────────────────┤
│                                             │
│  Welcome Message (32px margin)              │
│                                             │
│  Quick Actions Grid (2×2)                   │
│  ┌──────────┐  ┌──────────┐                │
│  │Complaints│  │ Permits  │                │
│  └──────────┘  └──────────┘                │
│  ┌──────────┐  ┌──────────┐                │
│  │Services  │  │   News   │                │
│  └──────────┘  └──────────┘                │
│                                             │
│  Recent Activity Section                    │
│                                             │
└─────────────── Tab Bar (83px) ──────────────┘
```

### 3.2 Add Welcome Section
```
Welcome Text:
1. Text: "مرحباً بك في هيئة تنظيم الكهرباء" (Arabic)
2. Font: 20px, Semi-bold, #2c3e50
3. Position: 32px from left, 100px from top
4. Text align: Right (for Arabic)

Subtitle:
1. Text: "Welcome to Saudi Electricity Regulatory Authority"
2. Font: 16px, Regular, #6c757d
3. Position: Below Arabic text, 8px gap
```

### 3.3 Create Quick Actions Grid
```
Quick Actions Setup:
1. Create 4 card instances from your component
2. Arrange in 2×2 grid
3. Gap: 16px between cards
4. Position: 32px margin from screen edges

Card Content (for each):
┌─ Complaints Card ─┐
│ 📋 Icon (32×32)   │
│ "الشكاوى"          │
│ "Complaints"      │
└───────────────────┘

┌─ Permits Card ────┐
│ 📜 Icon (32×32)   │
│ "التراخيص"        │
│ "Permits"         │
└───────────────────┘

┌─ Services Card ───┐
│ ⚙️ Icon (32×32)   │
│ "الخدمات"         │
│ "Services"        │
└───────────────────┘

┌─ News Card ───────┐
│ 📰 Icon (32×32)   │
│ "الأخبار"         │
│ "News"            │
└───────────────────┘
```

---

## 🌙 **Step 4: Create Dark Mode Variant (5 minutes)**

### 4.1 Duplicate Screen
```
1. Duplicate the HomeScreen frame
2. Rename: "HomeScreen - Dark"
3. Change background: #121212 (dark background)
```

### 4.2 Update Colors for Dark Mode
```
Header Background: #1E1E1E
Card Background: #2D2D2D
Text Colors: #FFFFFF (primary), #B0B0B0 (secondary)
Primary Color: #00A876 (brighter green for dark mode)
Border Color: #404040
```

---

## 🌍 **Step 5: Add Arabic (RTL) Support**

### 5.1 Create RTL Variant
```
1. Duplicate light mode screen
2. Rename: "HomeScreen - Arabic (RTL)"
3. Change text direction to RTL
4. Flip horizontal layout elements
```

### 5.2 RTL Adjustments
```
Text Alignment: Right-aligned
Logo Position: Right side (or keep centered)
Profile Avatar: Left side
Navigation Icons: Flip arrows and directional icons
Grid Layout: Right-to-left flow
```

---

## 🎨 **Step 6: Polish and Finalize**

### 6.1 Add Micro-interactions
```
Hover States:
1. Select card component
2. Add "Hover" variant
3. Change shadow: 0px 4px 12px rgba(0,0,0,0.15)
4. Scale: 1.02 (subtle lift effect)
```

### 6.2 Create Prototype
```
Prototype Setup:
1. Switch to Prototype tab
2. Connect cards to respective screens
3. Add transition: "Smart Animate"
4. Duration: 300ms, Ease out
```

---

## ✅ **Congratulations! You've Created Your First SERA Screen!**

### **What You've Accomplished:**
- ✅ Set up Figma with SERA design tokens
- ✅ Built reusable components (Header, Card, Button)
- ✅ Created complete HomeScreen layout
- ✅ Added dark mode variant
- ✅ Implemented Arabic RTL support
- ✅ Applied government-compliant styling

---

## 🚀 **Next Steps:**

### **Immediate (Today):**
1. **Create LoginScreen** using the same process
2. **Test your components** on different screen sizes
3. **Share with team** for feedback

### **This Week:**
1. **Complete core screens** (Login, Complaints, Services)
2. **Build interactive prototype** with navigation
3. **Test RTL layout** with Arabic content

### **This Month:**
1. **Create complete screen library** (all 27 screens)
2. **Document component usage**
3. **Train team on design system**

---

## 🔧 **Pro Tips:**

### **Component Organization:**
```
📁 SERA Components
├── 🧩 Atoms (Button, Input, Text)
├── 🔧 Molecules (Card, Header, Form Field)
├── 🏗️ Organisms (Navigation, Form, List)
└── 📱 Templates (Screen Layouts)
```

### **Naming Convention:**
```
✅ Good: "SERA/Button/Primary"
✅ Good: "SERA/Card/Quick Action"
❌ Bad: "Button 1"
❌ Bad: "Rectangle 123"
```

### **Color Usage:**
```
🎨 Always use color styles, never hex values
🎨 Test contrast ratios (WCAG AA minimum)
🎨 Verify colors in both light/dark modes
```

---

## 📚 **Resources:**

### **Generated Files You'll Use:**
- `figma-tokens.json` - Complete design tokens
- `color-palettes.json` - All colors organized
- `sera-design-system.css` - CSS reference
- `FIGMA_IMPORT_GUIDE.md` - Detailed import steps

### **Figma Plugins for SERA:**
- **Figma Tokens** - Import design tokens
- **Stark** - Accessibility checking
- **Content Reel** - Arabic/English content
- **Auto Layout** - Advanced layout tools

---

## 🆘 **Need Help?**

### **Common Issues:**
1. **"Colors don't match"** → Re-import figma-tokens.json
2. **"Text looks wrong"** → Check font weights and sizes
3. **"RTL not working"** → Use text direction settings in Figma
4. **"Components breaking"** → Use auto-layout constraints

### **Success Checklist:**
- [ ] Design tokens imported and applied
- [ ] Components follow SERA styling
- [ ] Spacing uses design system tokens
- [ ] Colors match both light/dark themes
- [ ] RTL layout tested with Arabic text
- [ ] Government branding consistent
- [ ] Touch targets minimum 44px

---

**Time to create:** ~30 minutes for first screen  
**Difficulty:** Beginner to Intermediate  
**Result:** Professional government app screen ready for development handoff

**Happy designing!** 🎨✨ 