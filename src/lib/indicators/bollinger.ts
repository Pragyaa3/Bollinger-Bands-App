// lib/indicators/bollinger.ts
import { OHLCVData, BollingerBandsData, BollingerBandsInputs } from '../types';

/**
 * Calculates Simple Moving Average
 */
function calculateSMA(values: number[], period: number): number[] {
  const result: number[] = [];
  
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else {
      const sum = values.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / period);
    }
  }
  
  return result;
}

/**
 * Calculates Standard Deviation (Population)
 * Note: Using population standard deviation as it's more common in financial indicators
 */
function calculateStdDev(values: number[], period: number, means: number[]): number[] {
  const result: number[] = [];
  
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1 || isNaN(means[i])) {
      result.push(NaN);
    } else {
      const slice = values.slice(i - period + 1, i + 1);
      const mean = means[i];
      const variance = slice.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / period;
      result.push(Math.sqrt(variance));
    }
  }
  
  return result;
}

/**
 * Applies offset to data array
 */
function applyOffset<T>(data: T[], offset: number): T[] {
  if (offset === 0) return data;
  
  const result = [...data];
  
  if (offset > 0) {
    // Shift forward (right)
    for (let i = result.length - 1; i >= offset; i--) {
      result[i] = result[i - offset];
    }
    for (let i = 0; i < offset; i++) {
      result[i] = result[0]; // Fill with first valid value
    }
  } else {
    // Shift backward (left)
    const absOffset = Math.abs(offset);
    for (let i = 0; i < result.length - absOffset; i++) {
      result[i] = result[i + absOffset];
    }
    for (let i = result.length - absOffset; i < result.length; i++) {
      result[i] = result[result.length - absOffset - 1]; // Fill with last valid value
    }
  }
  
  return result;
}

/**
 * Computes Bollinger Bands
 */
export function computeBollingerBands(
  data: OHLCVData[],
  settings: BollingerBandsInputs
): BollingerBandsData[] {
  if (data.length === 0) return [];
  
  const { length, stdDevMultiplier, offset } = settings;
  
  // Extract close prices
  const closePrices = data.map(d => d.close);
  
  // Calculate SMA (basis)
  const smaValues = calculateSMA(closePrices, length);
  
  // Calculate Standard Deviation
  const stdDevValues = calculateStdDev(closePrices, length, smaValues);
  
  // Calculate bands
  let basisValues = [...smaValues];
  let upperValues = smaValues.map((sma, i) => 
    isNaN(sma) || isNaN(stdDevValues[i]) ? NaN : sma + stdDevMultiplier * stdDevValues[i]
  );
  let lowerValues = smaValues.map((sma, i) => 
    isNaN(sma) || isNaN(stdDevValues[i]) ? NaN : sma - stdDevMultiplier * stdDevValues[i]
  );
  
  // Apply offset
  if (offset !== 0) {
    basisValues = applyOffset(basisValues, offset);
    upperValues = applyOffset(upperValues, offset);
    lowerValues = applyOffset(lowerValues, offset);
  }
  
  // Combine with timestamps
  return data.map((candle, i) => ({
    timestamp: candle.timestamp,
    basis: basisValues[i],
    upper: upperValues[i],
    lower: lowerValues[i],
  }));
}