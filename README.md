# InstaPlot

A visual case management tool for organizing and analyzing case information cards in an interactive timeline. Perfect for investigators, researchers, and analysts who need to visualize relationships between events, people, and locations.

## Features

### 📊 Interactive Plot Builder
- **Drag & Drop Interface**: Move case cards freely around the plot area
- **Scrollable Canvas**: Navigate large plots with smooth scrolling
- **Semi-transparent Cards**: See overlapping cards to identify relationships

### 🎛️ Flexible Axis Configuration
- **X-Axis Options**: Place, Actor, or Time
- **Y-Axis Options**: Place, Actor, or Time
- **Auto Organization**: Automatically arrange cards based on selected axes

### 💾 Data Persistence
- **Local Storage**: All cards automatically saved to browser storage
- **Session Persistence**: Data survives page refreshes and browser restarts

### 🃏 Rich Case Cards
- **Time Tracking**: Date and time information with visual display
- **Actor Management**: Track people involved in each case
- **Location Data**: Record where events occurred
- **Claims Documentation**: Detailed description of what was claimed or observed
- **Truth/Lie Indicators**: Visual badges to mark verified vs. false information

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

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

## Usage

### Creating Cards
1. Click the **"Add Card"** button in the toolbar
2. Fill in the required information:
   - **Time**: When the event occurred
   - **Actor**: Who was involved
   - **Place**: Where it happened
   - **Claims**: What was claimed or observed
   - **Truth/Lie**: Toggle to mark false information
3. Click **"Create Card"** to add it to the plot

### Organizing Cards
- **Manual Positioning**: Drag cards to any position on the plot
- **Auto Organization**: Click "Auto Organize" to arrange cards based on selected axes
- **Axis Selection**: Use the X-axis and Y-axis dropdowns to change how cards are organized

### Viewing Cards
- **Scrolling**: Use scrollbars to navigate the plot area when cards are spread out
- **Overlapping**: Semi-transparent cards allow you to see when multiple events overlap
- **Details**: Each card shows time, actor, place, and truth/lie status with icons

## Axis Combinations

### Time-based Analysis
- **X: Time, Y: Place** - See how events unfold across different locations
- **X: Time, Y: Actor** - Track individual actors over time
- **X: Actor, Y: Time** - Compare timelines between different people

### Relationship Analysis
- **X: Place, Y: Actor** - See which actors were at which locations
- **X: Actor, Y: Place** - View location patterns for each person

## Technical Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Animation**: Framer Motion
- **Storage**: Browser localStorage

## File Structure

```
instaPlot/
├── app/
│   └── page.tsx              # Main page component
├── plot-builder.tsx          # Core plot builder component
├── components/
│   └── ui/                   # UI component library
└── README.md                 # This file
```

## Data Storage

Cards are automatically saved to browser localStorage under the key `"case-plot-cards"`. This ensures your work persists between sessions without requiring external databases or authentication.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.# instaPlot
