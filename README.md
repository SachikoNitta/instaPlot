# InstaPlot

A professional visual case management tool for organizing and analyzing case information cards in an interactive workspace. Perfect for investigators, researchers, and analysts who need to visualize relationships between events, people, and locations.

![InstaPlot Screenshot](./public/screenshot.png)

## ✨ Features

### 🎯 Interactive Workspace
- **Full-Screen Plot Area**: Maximizes available space with a professional dotted grid background
- **Drag & Drop Interface**: Smooth card movement with Framer Motion animations
- **Real-time Organization**: Cards automatically reorganize when switching axis modes
- **Floating Controls**: Strategically positioned UI elements for optimal workflow

### 🎛️ Dynamic Axis Configuration
- **X-Axis Control**: Place, Actor, or Time (positioned at top center with directional arrows)
- **Y-Axis Control**: Place, Actor, or Time (positioned at left center with directional arrows)
- **Instant Reorganization**: Cards automatically arrange when axis modes change
- **Visual Feedback**: Clear directional indicators for each axis

### 💾 Robust Data Management
- **Auto-Save**: All cards automatically saved to browser localStorage
- **JSON Import/Export**: Import case data from JSON files with validation
- **Session Persistence**: Data survives page refreshes and browser restarts
- **Error Handling**: Graceful handling of invalid data imports

### 🃏 Rich Case Cards
- **Comprehensive Data**: Time, Actor, Place, Claims, and Truth/Lie classification
- **Visual Indicators**: Color-coded badges for truth (✓) vs lie (⚠) status
- **Interactive Cards**: Click to select, edit, or delete with overlay controls
- **Card Actions**: Edit and delete buttons appear on card selection
- **Professional Design**: Semi-transparent cards with shadows and hover effects

### 🎨 Modern UI/UX
- **Modal Forms**: Clean, centered forms for card creation and editing
- **Responsive Design**: Works across different screen sizes
- **Professional Aesthetics**: Minimalist design with subtle animations
- **Intuitive Navigation**: Logical control placement and visual hierarchy

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd instaPlot

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔄 Axis Combinations

### Timeline Analysis
- **X: Time, Y: Place** - Track events across locations over time
- **X: Time, Y: Actor** - Follow individual actors chronologically
- **X: Actor, Y: Time** - Compare timelines between different people

### Relationship Analysis
- **X: Place, Y: Actor** - See which actors were present at each location
- **X: Actor, Y: Place** - View location patterns for each person
- **X: Place, Y: Time** - Analyze location usage over time

## 🛠️ Technical Stack

- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom safelist configuration
- **UI Components**: Radix UI primitives with custom styling
- **Animation**: Framer Motion for smooth interactions
- **Icons**: Lucide React for consistent iconography
- **State Management**: React hooks with localStorage persistence

## 📁 Project Structure

```
instaPlot/
├── app/
│   ├── layout.tsx             # Root layout with CSS imports
│   ├── page.tsx               # Main page component
│   └── globals.css            # Global styles and CSS variables
├── components/
│   ├── plot-builder.tsx       # Core application component
│   └── ui/                    # Reusable UI components
├── tailwind.config.ts         # Tailwind configuration with safelist
├── postcss.config.mjs         # PostCSS configuration
├── next.config.mjs            # Next.js configuration
└── package.json               # Dependencies and scripts
```

## 🔧 Configuration

### Tailwind Safelist
The project includes a comprehensive safelist in `tailwind.config.ts` to prevent CSS purging during production builds:

- Layout classes (positioning, sizing, display)
- Color and background utilities
- Typography and spacing
- Animation and transition classes
- Interactive states (hover, focus)

### Data Format
Cards are stored in localStorage as JSON with the following structure:

```typescript
interface CaseCard {
  id: string;
  time: string;        // ISO datetime string
  actor: string;       // Person involved
  place: string;       // Location
  claims: string;      // Description/claims
  is_lie: boolean;     // Truth/lie classification
  x: number;          // X position on plot
  y: number;          // Y position on plot
}
```

## 🎯 Use Cases

- **Criminal Investigation**: Timeline analysis and witness statement verification
- **Research**: Academic research data organization and analysis
- **Journalism**: Fact-checking and source verification
- **Legal**: Case building and evidence organization
- **Business**: Project timeline and stakeholder analysis

## 🔜 Roadmap

- [ ] Export functionality (PDF, PNG, JSON)
- [ ] Advanced filtering and search
- [ ] Collaboration features
- [ ] Additional visualization modes
- [ ] Data analytics and insights
- [ ] Theme customization
- [ ] Mobile app version

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**