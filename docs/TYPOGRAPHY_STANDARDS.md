# Typography Standards for ShareWise, BookSure & CoupEx

## Design System

All pages across ShareWise, BookSure (consultant), and CoupEx features follow a consistent typography system for a unified, professional appearance.

### 1. Page Headers
```tsx
<h1 className="text-base font-bold tracking-wider uppercase">FEATURE NAME</h1>
<p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Subtitle</p>
```

### 2. Section Headings
```tsx
<h2 className="text-sm font-bold tracking-wider uppercase text-white/80">SECTION TITLE</h2>
```

### 3. Labels & Form Fields
```tsx
<label className="text-xs text-white/50 uppercase tracking-widest block mb-2">
  Field Name
</label>
```

### 4. Body Text
```tsx
<p className="text-sm text-white/70 font-light leading-relaxed">
  Body content goes here
</p>
```

### 5. Card Titles
```tsx
<h3 className="text-lg font-semibold mb-1">Card Title</h3>
<p className="text-xs text-white/50 uppercase tracking-widest">Brand/Category</p>
```

### 6. Buttons

**Primary Button:**
```tsx
<Button className="bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-white rounded-lg h-14 text-base font-bold">
  Action Text
</Button>
```

**Secondary Button:**
```tsx
<Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-lg h-12 font-light">
  Action Text
</Button>
```

### 7. Filter Tags/Badges
```tsx
<button className="px-4 py-2 text-xs font-semibold tracking-wider uppercase border">
  Filter Name
</button>
```

### 8. Status Badges
```tsx
<Badge className="bg-white/10 text-white border-white/10 rounded-none text-[10px] uppercase tracking-widest">
  STATUS
</Badge>
```

### 9. Search Inputs
```tsx
<Input className="bg-transparent border-0 border-b-2 border-white/20 text-white rounded-none h-12 focus:border-white placeholder:text-white/30 font-light" />
```

### 10. Metadata/Details
```tsx
<span className="text-xs text-white/50 uppercase tracking-widest">Label</span>
<span className="text-sm font-semibold text-white">Value</span>
```

## Color System

- **Background**: `bg-black` or `bg-gradient-to-br from-black via-black to-zinc-900`
- **Borders**: `border-white/10` (subtle) or `border-white/20` (more visible)
- **Text Primary**: `text-white`
- **Text Secondary**: `text-white/60` or `text-white/70`
- **Text Tertiary**: `text-white/40` or `text-white/50`
- **Cards**: `bg-white/5` or `bg-gradient-to-br from-white/10 to-white/5`

## Spacing & Borders

- **Card Padding**: `p-4` or `p-5`
- **Section Spacing**: `space-y-6` for main sections, `space-y-4` for subsections
- **Border Radius**: `rounded-lg` for modern elements, `rounded-none` for minimalist design
- **Shadows**: `shadow-lg shadow-white/20` for emphasis

## Examples

### Feature Landing Page
```tsx
<div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
  <div className="flex items-center justify-between py-4 px-4">
    <button className="text-white hover:text-white/80">
      <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
    </button>
    <div className="text-center">
      <h1 className="text-base font-bold tracking-wider uppercase">FEATURE NAME</h1>
      <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Tagline</p>
    </div>
    <div className="w-5" />
  </div>
</div>
```

### List Card
```tsx
<div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-5">
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-lg font-semibold">Item Title</h3>
    <Badge className="bg-white/10 text-white uppercase text-[10px] tracking-widest">NEW</Badge>
  </div>
  <p className="text-xs text-white/50 uppercase tracking-widest mb-2">Category</p>
  <p className="text-sm text-white/70 font-light leading-relaxed mb-4">
    Description text goes here with proper line height and font weight.
  </p>
  <div className="flex items-center justify-between">
    <span className="text-xs text-white/50 uppercase tracking-widest">Price</span>
    <span className="text-2xl font-bold">₹999</span>
  </div>
</div>
```

### Form Section
```tsx
<div className="space-y-6">
  <div>
    <label className="text-xs text-white/50 uppercase tracking-widest block mb-2">
      Field Label
    </label>
    <Input className="bg-white/5 border-white/20 text-white rounded-lg h-12 focus:border-white/40 font-light" />
  </div>
</div>
```

## Implementation Checklist

For each page in ShareWise, BookSure, and CoupEx:

- [ ] Page header uses bold tracking-wider uppercase
- [ ] Subtitle uses text-[10px] uppercase tracking-widest font-light
- [ ] All labels use text-xs uppercase tracking-widest
- [ ] Body text uses font-light
- [ ] Buttons follow primary/secondary patterns
- [ ] Cards use consistent borders (white/10 or white/20)
- [ ] Gradients used appropriately for backgrounds
- [ ] All text has proper hierarchy and spacing
