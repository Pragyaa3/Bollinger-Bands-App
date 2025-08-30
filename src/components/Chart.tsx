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

    const chartElement = chartRef.current; // Copy ref to variable for cleanup
    const chart = init(chartElement);
    chartInstanceRef.current = chart;

    // Set chart styles
    (chart as unknown as { setStyles: (s: Record<string, unknown>) => void }).setStyles({
      grid: {
        horizontal: { color: '#e5e5e5' },
        vertical: { color: '#e5e5e5' },
      },
      candle: {
        type: 'candle_solid',
        bar: {
          upColor: '#26a69a',
          downColor: '#ef5350',
          noChangeColor: '#888888',
        },
        tooltip: {
          showRule: 'always',
          showType: 'standard',
        },
      },
      xAxis: { axisLine: { color: '#dddddd' } },
      yAxis: { axisLine: { color: '#dddddd' } },
    });

    return () => {
      if (chartInstanceRef.current && chartElement) {
        dispose(chartElement);
        chartInstanceRef.current = null;
      }
    };
  }, []);

  // Update K-line data
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

    (chartInstanceRef.current as unknown as { applyNewData: (d: unknown[]) => void })
      .applyNewData(klineData);
  }, [data]);

  // Compute Bollinger Bands data
  useEffect(() => {
    if (!data.length) return;
    const bands = computeBollingerBands(data, bollingerSettings.inputs);
    setBollingerData(bands);
  }, [data, bollingerSettings.inputs]);

  // Add / remove Bollinger Bands indicator
  useEffect(() => {
    if (!chartInstanceRef.current) return;

    const chart = chartInstanceRef.current;

    const removeBoll = () => {
      try {
        (chart as unknown as { removeIndicator: (opts: { name: string }) => void })
          .removeIndicator({ name: 'BOLL' });
      } catch {
        // Silently handle case where no existing BOLL indicator exists
        console.log('No existing BOLL indicator to remove');
      }
    };

    removeBoll();

    if (!showBollinger) return;

    const length = bollingerSettings.inputs.length ?? 20;
    const stdDev = bollingerSettings.inputs.stdDevMultiplier ?? 2;

    try {
      (chart as unknown as { createIndicator: (opts: { name: string; calcParams: number[] }, isOverlay: boolean) => void })
        .createIndicator({ name: 'BOLL', calcParams: [length, stdDev] }, false);
    } catch (error) {
      console.error('Failed to create BOLL indicator:', error);
    }

    return () => {
      removeBoll();
    };
  }, [showBollinger, bollingerSettings.inputs]);

  // Crosshair tooltip
  useEffect(() => {
    if (!chartInstanceRef.current) return;

    const chart = chartInstanceRef.current;

    const handleCrosshair = (e: unknown) => {
      // The argument might be an Event wrapping the data
      const crosshairData =
        e && typeof e === 'object' && 'data' in e
          ? (e as Record<string, unknown>).data
          : e;

      if (!showBollinger || !bollingerData.length) return;

      if (
        typeof crosshairData === 'object' &&
        crosshairData !== null &&
        'dataIndex' in crosshairData
      ) {
        const { dataIndex } = crosshairData as { dataIndex: number };
        const point = bollingerData[dataIndex];
        if (point && !isNaN(point.basis)) {
          console.log('Bollinger point:', point);
        }
      }
    };

    (chart as unknown as {
      subscribeAction: (event: string, handler: (data: unknown) => void) => void;
    }).subscribeAction('onCrosshairChange', handleCrosshair);

    return () => {
      (chart as unknown as {
        unsubscribeAction: (event: string, handler: (data: unknown) => void) => void;
      }).unsubscribeAction('onCrosshairChange', handleCrosshair);
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