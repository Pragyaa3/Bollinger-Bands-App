# Bollinger Bands Trading Chart

A production-ready Bollinger Bands indicator built with React, Next.js, TypeScript, Tailwind CSS, and KLineCharts. This project was developed as part of the FindScan frontend internship assignment.

![Bollinger Bands Chart Demo](https://via.placeholder.com/800x400/2563eb/ffffff?text=Bollinger+Bands+Chart)

## 🚀 Features

- **Interactive Candlestick Chart**: Built with KLineCharts library
- **Bollinger Bands Indicator**: Full implementation with configurable settings
- **TradingView-inspired UI**: Clean, professional interface
- **Real-time Updates**: Instant chart updates when settings change
- **Comprehensive Settings**: 
  - **Inputs**: Length, MA Type, Source, StdDev Multiplier, Offset
  - **Style**: Colors, line widths, visibility toggles, background fill
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode Support**: Automatic theme detection
- **Performance Optimized**: Smooth interaction with 200+ candles

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charting**: KLineCharts
- **Icons**: Lucide React
- **Package Manager**: npm

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd bollinger-bands-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Adding Bollinger Bands
1. Click the "Add Bollinger Bands" button
2. The indicator will appear on the chart with default settings
3. Use the "Settings" button to customize the indicator

### Configuring Settings

#### Inputs Tab
- **Length**: Period for SMA calculation (default: 20)
- **MA Type**: Moving average type (SMA only for this implementation)
- **Source**: Price source (Close price)
- **StdDev Multiplier**: Standard deviation multiplier (default: 2.0)
- **Offset**: Shift bands by N bars (default: 0)

#### Style Tab
- **Basic (Middle Band)**: Visibility, color, line width, line style
- **Upper Band**: Visibility, color, line width, line style  
- **Lower Band**: Visibility, color, line width, line style
- **Background Fill**: Visibility and opacity control

## 📊 Bollinger Bands Calculation

This implementation uses the following formulas:

### Formulas Used
- **Basis (Middle Band)**: `SMA(close, length)`
- **Standard Deviation**: Population standard deviation of the last `length` values
- **Upper Band**: `Basis + (StdDev Multiplier × StdDev)`
- **Lower Band**: `Basis - (StdDev Multiplier × StdDev)`
- **Offset**: Shifts all three bands by the specified number of bars

### Standard Deviation Note
This implementation uses **population standard deviation** (dividing by N) rather than sample standard deviation (dividing by N-1), which is more common in financial technical indicators.

## 🏗️ Project Structure

```
bollinger-bands-app/
├── app/
│   ├── globals.css          # Global styles and Tailwind setup
│   ├── layout.tsx           # Root layout component
│   └── page.tsx            # Main application page
├── components/
│   ├── Chart.tsx           # KLineCharts integration
│   ├── BollingerSettings.tsx # Settings modal component
│   └── ui/                 # Reusable UI components
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── tabs.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       └── slider.tsx
├── lib/
│   ├── indicators/
│   │   └── bollinger.ts    # Bollinger Bands calculation logic
│   └── types.ts           # TypeScript type definitions
├── public/
│   └── data/
│       └── ohlcv.json     # Demo trading data (80 candles)
└── README.md
```

## 🔧 Key Components

### Chart Component
- Manages KLineCharts instance
- Handles data updates and overlay rendering
- Implements custom Bollinger Bands visualization
- Provides tooltip integration

### BollingerSettings Component
- Tabbed interface (Inputs/Style)
- Form controls for all Bollinger Bands parameters
- Real-time preview updates
- TradingView-inspired design

### Bollinger Calculator
- Pure calculation functions
- Modular and testable design
- Handles edge cases and invalid data
- Supports offset functionality

## 📈 Demo Data

The application includes 80 candles of realistic BTC/USD demo data with:
- 1-hour timeframe
- Realistic price movements
- Volume data included
- Timestamps in Unix format

## 🎨 Design Decisions

### KLineCharts Integration
- Custom overlay implementation for Bollinger Bands
- Native tooltip integration
- Responsive chart sizing
- Clean, minimal styling

### UI/UX Choices
- TradingView-inspired settings modal
- Intuitive color pickers and sliders  
- Immediate visual feedback on changes
- Accessible form controls

### Performance Optimizations
- Efficient recalculation on settings changes
- Memoized calculations where appropriate
- Optimized rendering with React hooks
- Minimal re-renders strategy

## 🧪 Testing the Implementation

### Verification Steps
1. **Basic Functionality**: Add/remove indicator, open settings
2. **Calculations**: Verify bands expand/contract with volatility
3. **Inputs**: Test all parameter changes update immediately
4. **Styles**: Verify color, width, and visibility changes work
5. **Offset**: Test positive/negative offset shifts bands correctly
6. **Performance**: Smooth interaction with 200+ candles

### Expected Behavior
- Middle band follows price moving average
- Upper/lower bands expand during high volatility periods
- Band spacing controlled by StdDev multiplier
- All visual changes apply instantly

## 📝 Dependencies

### Production Dependencies
```json
{
  "next": "14.0.0",
  "react": "^18",
  "react-dom": "^18",
  "klinecharts": "latest",
  "lucide-react": "latest"
}
```

### Development Dependencies
```json
{
  "@types/node": "^20",
  "@types/react": "^18",
  "@types/react-dom": "^18",
  "autoprefixer": "^10",
  "eslint": "^8",
  "eslint-config-next": "14.0.0",
  "postcss": "^8",
  "tailwindcss": "^3.3.0",
  "typescript": "^5"
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

## 🔮 Future Enhancements

Potential improvements that could be added:
- Multiple MA types (EMA, WMA, etc.)
- Additional price sources (High, Low, HLC3)
- More line style options
- Export chart functionality
- Multiple timeframe support
- Real-time data connection

## 🤝 Contributing

This project was built as an internship assignment. For any questions or feedback, please reach out to the development team.

## 📄 License

This project is developed for the FindScan internship assignment.

---

**KLineCharts Version**: Latest  
**Assignment Completed**: ✅  
**Performance**: Optimized for 200-1000 candles  
**Browser Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)