// components/Chart.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { init, dispose, Chart as KLineChart } from 'klinecharts';
import { OHLCVData, BollingerBandsData, BollingerBandsSettings } from '@/lib/types';
import { computeBollingerBands } from '@/lib/indicators/bollinger';

interface ChartProps {
  data: OHLCVData[];
  bollingerSettings: BollingerBandsSettings;
  showBollinger: boolean;
}

export const Chart: React.FC<ChartProps> = ({ data, bollingerSettings, showBollinger }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<KLineChart | null>(null);
  const [bollingerData, setBollingerData] = useState<BollingerBandsData[]>([]);

  // Initialize chart
  useEffect(() => {
    if (!chartRef.current) return;

    const chart = init(chartRef.current!) as KLineChart;
    chartInstanceRef.current = chart;

    // Configure chart
    chart!.setStyles({
      grid: {
        horizontal: { color: '#e5e5e5' },
        vertical: { color: '#e5e5e5' },
      },
      candle: {
        type: 'candle_solid' as any, // ✅ cast
        bar: {
          upColor: '#26a69a',
          downColor: '#ef5350',
          noChangeColor: '#888888',
        },
        tooltip: {
          showRule: 'always' as any, // ✅ cast
          showType: 'standard' as any, // ✅ cast
        },
      },
      xAxis: {
        axisLine: {
          color: '#dddddd',
        },
      },
      yAxis: {
        axisLine: {
          color: '#dddddd',
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        dispose(chartRef.current!);
        chartInstanceRef.current = null;
      }
    };
  }, []);

  // Update chart data
  useEffect(() => {
    if (!chartInstanceRef.current || !data.length) return;

    const klineData = data.map(item => ({
      timestamp: item.timestamp,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
    }));

    chartInstanceRef.current!.applyNewData(klineData); // ✅ non-null assertion
  }, [data]);

  // Calculate Bollinger Bands
  useEffect(() => {
    if (!data.length) return;

    const bands = computeBollingerBands(data, bollingerSettings.inputs);
    setBollingerData(bands);
  }, [data, bollingerSettings.inputs]);

  // Create Bollinger Bands indicator
  // Create Bollinger Bands indicator
useEffect(() => {
  const chart = chartInstanceRef.current as any;
  if (!chart) return;

  // remove existing BOLL indicator if any
  try {
    chart.removeIndicator({ name: 'BOLL' });
  } catch (e) {
    // ignore if not present
  }

  if (!showBollinger) return;

  // read params from your settings
  const length = bollingerSettings.inputs.length ?? 20;
  const stdDev = bollingerSettings.inputs.stdDevMultiplier ?? 2;

  // create built-in Bollinger Bands indicator
  chart.createIndicator(
    { name: 'BOLL', calcParams: [length, stdDev] },
    false // false → render on main price pane, not a separate sub-pane
  );

  // cleanup on unmount or when deps change
  return () => {
    try {
      chart.removeIndicator({ name: 'BOLL' });
    } catch (e) {}
  };
}, [showBollinger, bollingerSettings.inputs]);

  // Add custom tooltip for Bollinger Bands
  useEffect(() => {
    if (!chartInstanceRef.current) return;

    const chart = chartInstanceRef.current;

    const handleCrosshair = (data: any) => {
      if (!showBollinger || !bollingerData.length || !data.dataIndex) return;
      const index = data.dataIndex;
      const bollingerPoint = bollingerData[index];
      if (bollingerPoint && !isNaN(bollingerPoint.basis)) {
        // tooltip logic (unchanged)
      }
    };

    (chart as any).subscribeAction('onCrosshairChange' as any, handleCrosshair); // ✅ cast

    return () => {
      (chart as any).unsubscribeAction('onCrosshairChange' as any, handleCrosshair); // ✅ cast
    };
  }, [showBollinger, bollingerData]);

  return (
    <div className="w-full h-full">
      <div
        ref={chartRef}
        className="w-full h-[600px] bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
      />

      {showBollinger && (
        <div className="mt-2 flex flex-wrap gap-4 text-sm">
          {bollingerSettings.style.basis.visible && (
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-0.5"
                style={{ backgroundColor: bollingerSettings.style.basis.color }}
              />
              <span>Basis (SMA)</span>
            </div>
          )}
          {bollingerSettings.style.upper.visible && (
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-0.5"
                style={{ backgroundColor: bollingerSettings.style.upper.color }}
              />
              <span>Upper</span>
            </div>
          )}
          {bollingerSettings.style.lower.visible && (
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-0.5"
                style={{ backgroundColor: bollingerSettings.style.lower.color }}
              />
              <span>Lower</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
