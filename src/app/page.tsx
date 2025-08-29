'use client';
import React, { useState, useEffect } from 'react';
import { Chart } from '@/components/Chart';
import { BollingerSettings } from '@/components/BollingerSettings';
import { Button } from '@/components/ui/button';
import { OHLCVData, BollingerBandsSettings } from '@/lib/types';
import { Settings, TrendingUp } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bollinger Bands Trading Chart
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Interactive chart with Bollinger Bands technical indicator
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap gap-3">
          {!showBollinger ? (
            <Button onClick={handleAddBollinger} className="flex items-center gap-2">
              <TrendingUp size={16} />
              Add Bollinger Bands
            </Button>
          ) : (
            <>
              <Button onClick={handleRemoveBollinger} variant="outline">
                Remove Bollinger Bands
              </Button>
              <Button onClick={handleOpenSettings} variant="outline" className="flex items-center gap-2">
                <Settings size={16} />
                Settings
              </Button>
            </>
          )}
        </div>

        {/* Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <Chart
            data={data}
            bollingerSettings={bollingerSettings}
            showBollinger={showBollinger}
          />
        </div>

        {/* Info Panel */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Current Settings
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p>Length: {bollingerSettings.inputs.length}</p>
              <p>MA Type: {bollingerSettings.inputs.maType}</p>
              <p>StdDev: {bollingerSettings.inputs.stdDevMultiplier}</p>
              <p>Offset: {bollingerSettings.inputs.offset}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              About Bollinger Bands
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Bollinger Bands are a technical analysis tool that uses a moving average and 
              standard deviation to identify potential overbought and oversold conditions.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Data Info
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p>Candles: {data.length}</p>
              <p>Timeframe: 1 Hour</p>
              <p>Symbol: BTC/USD (Demo)</p>
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