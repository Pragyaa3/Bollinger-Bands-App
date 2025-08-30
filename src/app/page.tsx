'use client';
import React, { useState, useEffect } from 'react';
import { Chart } from '@/components/Chart';
import { BollingerSettings } from '@/components/BollingerSettings';
import { Button } from '@/components/ui/button';
import { OHLCVData, BollingerBandsSettings } from '@/lib/types';
import { 
  Settings, 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Clock, 
  Database,
  Target,
  Calculator,
  Info,
  Sparkles,
  LineChart,
  Bitcoin
} from 'lucide-react';
import "./globals.css";

export default function Home() {
  const [data, setData] = useState<OHLCVData[]>([]);
  const [showBollinger, setShowBollinger] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bollingerSettings, setBollingerSettings] = useState<BollingerBandsSettings>({
    inputs: {
      length: 20,
      maType: 'SMA',
      source: 'close',
      stdDevMultiplier: 2,
      offset: 0,
    },
    style: {
      basis: {
        visible: true,
        color: '#2962ff',
        lineWidth: 1,
        lineStyle: 'solid',
      },
      upper: {
        visible: true,
        color: '#787b86',
        lineWidth: 1,
        lineStyle: 'solid',
      },
      lower: {
        visible: true,
        color: '#787b86',
        lineWidth: 1,
        lineStyle: 'solid',
      },
      background: {
        visible: true,
        opacity: 10,
      },
    },
  });

  // Load demo data
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/ohlcv.json');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Failed to load demo data:', error);
        // Fallback demo data if file load fails
        const fallbackData: OHLCVData[] = [
          { timestamp: 1703721600000, open: 42500, high: 43200, low: 42100, close: 42800, volume: 1500000 },
          { timestamp: 1703725200000, open: 42800, high: 43500, low: 42600, close: 43200, volume: 1800000 },
          { timestamp: 1703728800000, open: 43200, high: 43800, low: 42900, close: 43600, volume: 2100000 },
          { timestamp: 1703732400000, open: 43600, high: 44100, low: 43300, close: 43900, volume: 1900000 },
          { timestamp: 1703736000000, open: 43900, high: 44500, low: 43700, close: 44200, volume: 2200000 },
        ];
        setData(fallbackData);
      }
    };

    loadData();
  }, []);

  const handleAddBollinger = () => {
    setShowBollinger(true);
  };

  const handleRemoveBollinger = () => {
    setShowBollinger(false);
  };

  const handleOpenSettings = () => {
    setSettingsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center animate-in fade-in duration-1000">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg animate-pulse">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-in slide-in-from-left duration-1000">
              Bollinger Bands Trading Chart
            </h1>
          </div>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed animate-in slide-in-from-bottom duration-1000 delay-300">
            🚀 Advanced technical analysis with interactive Bollinger Bands indicator for precise market insights and professional trading decisions
          </p>
          
          {/* Status indicator */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800 animate-in zoom-in duration-700 delay-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Live Market Analysis</span>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-wrap justify-center gap-4 animate-in fade-in duration-1000 delay-500">
          {!showBollinger ? (
            <Button 
              onClick={handleAddBollinger} 
              className="group flex items-center gap-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <Sparkles size={20} className="animate-spin" />
              <span className="font-semibold text-lg">Add Bollinger Bands</span>
              <TrendingUp size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            </Button>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={handleRemoveBollinger} 
                variant="outline"
                className="group flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-red-200/60 hover:border-red-400 hover:bg-red-50 dark:border-red-800/60 dark:hover:border-red-600 dark:hover:bg-red-950/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                <LineChart size={18} className="group-hover:animate-pulse" />
                <span className="font-medium">Remove Bands</span>
              </Button>
              <Button 
                onClick={handleOpenSettings} 
                variant="outline" 
                className="group flex items-center gap-3 px-6 py-3 rounded-xl border-2 border-blue-200/60 hover:border-blue-400 hover:bg-blue-50 dark:border-blue-800/60 dark:hover:border-blue-600 dark:hover:bg-blue-950/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              >
                <Settings size={18} className="group-hover:rotate-180 transition-transform duration-500" />
                <span className="font-medium">Customize Settings</span>
              </Button>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/50 p-8 mb-8 animate-in fade-in-up duration-1000 delay-700 hover:shadow-3xl transition-all duration-500 group">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Live Chart Analysis</h2>
            </div>
            {showBollinger && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-pulse">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Bollinger Bands Active</span>
              </div>
            )}
          </div>
          <div className="relative">
            <Chart
              data={data}
              bollingerSettings={bollingerSettings}
              showBollinger={showBollinger}
            />
            {data.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-300">Loading market data...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Info Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-up duration-1000 delay-1000">
          {/* Current Settings */}
          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/30 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 hover:border-green-300 dark:hover:border-green-600">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Current Settings
              </h3>
              <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-3">
              {[
                { icon: Target, label: 'Length', value: bollingerSettings.inputs.length, color: 'blue' },
                { icon: Calculator, label: 'MA Type', value: bollingerSettings.inputs.maType, color: 'purple' },
                { icon: TrendingUp, label: 'StdDev', value: bollingerSettings.inputs.stdDevMultiplier, color: 'orange' },
                { icon: Activity, label: 'Offset', value: bollingerSettings.inputs.offset, color: 'red' }
              ].map(({ icon: Icon, label, value, color }, index) => (
                <div key={label} className={`flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl hover:bg-${color}-50 dark:hover:bg-${color}-950/30 transition-all duration-300 hover:scale-105 animate-in slide-in-from-left duration-500`} style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 text-${color}-500`} />
                    <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
                  </div>
                  <span className={`font-bold text-${color}-600 dark:text-${color}-400 text-lg`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* About Bollinger Bands */}
          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/30 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 hover:border-blue-300 dark:hover:border-blue-600">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                <Info className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                About Bollinger Bands
              </h3>
              <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                💡 Bollinger Bands are a powerful technical analysis tool that uses a moving average and 
                standard deviation to identify potential overbought and oversold market conditions.
              </p>
              <div className="space-y-2">
                {[
                  { icon: Sparkles, text: 'Perfect for volatility analysis', color: 'blue' },
                  { icon: TrendingUp, text: 'Identifies trend reversals', color: 'green' },
                  { icon: Target, text: 'Support & resistance levels', color: 'purple' }
                ].map(({ icon: Icon, text, color }, index) => (
                  <div key={text} className={`flex items-center gap-3 p-3 bg-${color}-50 dark:bg-${color}-950/30 rounded-lg hover:scale-105 transition-all duration-300 animate-in slide-in-from-right duration-500`} style={{animationDelay: `${index * 150}ms`}}>
                    <Icon className={`w-4 h-4 text-${color}-500`} />
                    <span className={`text-xs font-medium text-${color}-700 dark:text-${color}-300`}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Data Info */}
          <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/30 dark:border-gray-700/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 hover:border-purple-300 dark:hover:border-purple-600">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Database className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                Market Data
              </h3>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-ping"></div>
                <div className="w-1 h-1 bg-green-500 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                <div className="w-1 h-1 bg-green-500 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { icon: BarChart3, label: 'Candles', value: data.length, color: 'indigo', suffix: '' },
                { icon: Clock, label: 'Timeframe', value: '1 Hour', color: 'teal', suffix: '' },
                { icon: Bitcoin, label: 'Symbol', value: 'BTC/USD', color: 'amber', suffix: '' }
              ].map(({ icon: Icon, label, value, color, suffix }, index) => (
                <div key={label} className={`flex items-center justify-between p-3 bg-gray-50/80 dark:bg-gray-700/50 rounded-xl hover:bg-${color}-50 dark:hover:bg-${color}-950/30 transition-all duration-300 hover:scale-105 animate-in slide-in-from-bottom duration-500`} style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 text-${color}-500`} />
                    <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
                  </div>
                  <span className={`font-bold text-${color}-600 dark:text-${color}-400 text-lg`}>{value}{suffix}</span>
                </div>
              ))}
              <div className="mt-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 rounded-xl border border-amber-200 dark:border-amber-800 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Demo Trading Environment</span>
                  <div className="ml-auto w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Modal */}
        <BollingerSettings
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          settings={bollingerSettings}
          onSettingsChange={setBollingerSettings}
        />
      </div>
    </div>
  );
}