// components/BollingerSettings.tsx
import React from 'react';
import { BollingerBandsSettings } from '../lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from './ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select } from './ui/select';
import { Slider } from './ui/slider';
import { Button } from './ui/button';

interface BollingerSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: BollingerBandsSettings;
  onSettingsChange: (settings: BollingerBandsSettings) => void;
}

export const BollingerSettings: React.FC<BollingerSettingsProps> = ({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
}) => {
  const updateInputs = (updates: Partial<BollingerBandsSettings['inputs']>) => {
    onSettingsChange({
      ...settings,
      inputs: { ...settings.inputs, ...updates },
    });
  };

  const updateStyle = (updates: Partial<BollingerBandsSettings['style']>) => {
    onSettingsChange({
      ...settings,
      style: { ...settings.style, ...updates },
    });
  };

  const updateBandStyle = (
    band: 'basis' | 'upper' | 'lower',
    updates: Partial<BollingerBandsSettings['style']['basis']>
  ) => {
    updateStyle({
      [band]: { ...settings.style[band], ...updates },
    });
  };

  const updateBackgroundStyle = (
    updates: Partial<BollingerBandsSettings['style']['background']>
  ) => {
    updateStyle({
      background: { ...settings.style.background, ...updates },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bollinger Bands Settings</DialogTitle>
          <DialogClose onClick={() => onOpenChange(false)} />
        </DialogHeader>

        <Tabs defaultValue="inputs" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inputs">Inputs</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>

          {/* Inputs Tab */}
          <TabsContent value="inputs">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="length">Length</Label>
                <Input
                  id="length"
                  type="number"
                  value={settings.inputs.length}
                  onChange={(e) =>
                    updateInputs({ length: parseInt(e.target.value) || 20 })
                  }
                  min="1"
                  max="200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maType">Basic MA Type</Label>
                <Select
                  id="maType"
                  value={settings.inputs.maType}
                  onChange={(e) =>
                    updateInputs({ maType: e.target.value as 'SMA' })
                  }
                >
                  <option value="SMA">SMA</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select
                  id="source"
                  value={settings.inputs.source}
                  onChange={(e) =>
                    updateInputs({ source: e.target.value as 'close' })
                  }
                >
                  <option value="close">Close</option>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stdDev">StdDev Multiplier</Label>
                <Input
                  id="stdDev"
                  type="number"
                  step="0.1"
                  value={settings.inputs.stdDevMultiplier}
                  onChange={(e) =>
                    updateInputs({
                      stdDevMultiplier: parseFloat(e.target.value) || 2,
                    })
                  }
                  min="0.1"
                  max="10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="offset">Offset</Label>
                <Input
                  id="offset"
                  type="number"
                  value={settings.inputs.offset}
                  onChange={(e) =>
                    updateInputs({ offset: parseInt(e.target.value) || 0 })
                  }
                  min="-50"
                  max="50"
                />
              </div>
            </div>
          </TabsContent>

          {/* Style Tab */}
          <TabsContent value="style">
            <div className="space-y-6">
              {/* Basis (Middle Band) */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Basis (Middle Band)</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="basisVisible"
                      checked={settings.style.basis.visible}
                      onChange={(e) =>
                        updateBandStyle('basis', { visible: e.target.checked })
                      }
                    />
                    <Label htmlFor="basisVisible">Visible</Label>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="basisColor">Color</Label>
                    <input
                      type="color"
                      id="basisColor"
                      value={settings.style.basis.color}
                      onChange={(e) =>
                        updateBandStyle('basis', { color: e.target.value })
                      }
                      className="w-full h-8 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="basisWidth">Line Width</Label>
                    <Input
                      id="basisWidth"
                      type="number"
                      value={settings.style.basis.lineWidth}
                      onChange={(e) =>
                        updateBandStyle('basis', {
                          lineWidth: parseInt(e.target.value) || 1,
                        })
                      }
                      min="1"
                      max="5"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="basisStyle">Line Style</Label>
                    <Select
                      id="basisStyle"
                      value={settings.style.basis.lineStyle}
                      onChange={(e) =>
                        updateBandStyle('basis', {
                          lineStyle: e.target.value as 'solid' | 'dashed',
                        })
                      }
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Upper Band */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Upper Band</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="upperVisible"
                      checked={settings.style.upper.visible}
                      onChange={(e) =>
                        updateBandStyle('upper', { visible: e.target.checked })
                      }
                    />
                    <Label htmlFor="upperVisible">Visible</Label>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="upperColor">Color</Label>
                    <input
                      type="color"
                      id="upperColor"
                      value={settings.style.upper.color}
                      onChange={(e) =>
                        updateBandStyle('upper', { color: e.target.value })
                      }
                      className="w-full h-8 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="upperWidth">Line Width</Label>
                    <Input
                      id="upperWidth"
                      type="number"
                      value={settings.style.upper.lineWidth}
                      onChange={(e) =>
                        updateBandStyle('upper', {
                          lineWidth: parseInt(e.target.value) || 1,
                        })
                      }
                      min="1"
                      max="5"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="upperStyle">Line Style</Label>
                    <Select
                      id="upperStyle"
                      value={settings.style.upper.lineStyle}
                      onChange={(e) =>
                        updateBandStyle('upper', {
                          lineStyle: e.target.value as 'solid' | 'dashed',
                        })
                      }
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Lower Band */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Lower Band</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="lowerVisible"
                      checked={settings.style.lower.visible}
                      onChange={(e) =>
                        updateBandStyle('lower', { visible: e.target.checked })
                      }
                    />
                    <Label htmlFor="lowerVisible">Visible</Label>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lowerColor">Color</Label>
                    <input
                      type="color"
                      id="lowerColor"
                      value={settings.style.lower.color}
                      onChange={(e) =>
                        updateBandStyle('lower', { color: e.target.value })
                      }
                      className="w-full h-8 rounded"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lowerWidth">Line Width</Label>
                    <Input
                      id="lowerWidth"
                      type="number"
                      value={settings.style.lower.lineWidth}
                      onChange={(e) =>
                        updateBandStyle('lower', {
                          lineWidth: parseInt(e.target.value) || 1,
                        })
                      }
                      min="1"
                      max="5"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lowerStyle">Line Style</Label>
                    <Select
                      id="lowerStyle"
                      value={settings.style.lower.lineStyle}
                      onChange={(e) =>
                        updateBandStyle('lower', {
                          lineStyle: e.target.value as 'solid' | 'dashed',
                        })
                      }
                    >
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Background Fill */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Background Fill</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="backgroundVisible"
                      checked={settings.style.background.visible}
                      onChange={(e) =>
                        updateBackgroundStyle({ visible: e.target.checked })
                      }
                    />
                    <Label htmlFor="backgroundVisible">Visible</Label>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="backgroundOpacity">
                      Opacity: {settings.style.background.opacity}%
                    </Label>
                    <Slider
                      value={settings.style.background.opacity}
                      onChange={(value) =>
                        updateBackgroundStyle({ opacity: value })
                      }
                      min={0}
                      max={100}
                      step={5}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
