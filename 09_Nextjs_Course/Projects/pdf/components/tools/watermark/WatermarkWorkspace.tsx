'use client';

import { useState, useMemo } from 'react';
import { ToolSidebar } from '@/components/shared/ToolSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { PagePreview } from '@/components/tools/split/PagePreview';
import {
  WatermarkMode,
  TextSettings,
  ImageSettings,
  CommonSettings,
  WatermarkPosition,
} from '@/hooks/use-watermark-pdf';
import { Upload } from 'lucide-react';

interface WatermarkWorkspaceProps {
  file: File;
  pageCount: number;
  mode: WatermarkMode;
  textSettings: TextSettings;
  imageSettings: ImageSettings;
  commonSettings: CommonSettings;
  isProcessing: boolean;
  onModeChange: (mode: WatermarkMode) => void;
  onTextSettingsChange: <K extends keyof TextSettings>(key: K, value: TextSettings[K]) => void;
  onImageSettingsChange: <K extends keyof ImageSettings>(key: K, value: ImageSettings[K]) => void;
  onCommonSettingsChange: <K extends keyof CommonSettings>(
    key: K,
    value: CommonSettings[K]
  ) => void;
  onApplyWatermark: () => void;
  formatFileSize: (bytes: number) => string;
}

const POSITION_OPTIONS: { value: WatermarkPosition; label: string }[] = [
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-center', label: 'Top Center' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'middle-left', label: 'Middle Left' },
  { value: 'center', label: 'Center' },
  { value: 'middle-right', label: 'Middle Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-center', label: 'Bottom Center' },
  { value: 'bottom-right', label: 'Bottom Right' },
];

const ROTATION_OPTIONS = [
  { value: 0, label: '0°' },
  { value: 45, label: '45°' },
  { value: 90, label: '90°' },
  { value: 180, label: '180°' },
  { value: 270, label: '270°' },
];

const PRESET_COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF0000', // Red
  '#0000FF', // Blue
  '#00FF00', // Green
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#808080', // Gray
];

export function WatermarkWorkspace({
  file,
  pageCount,
  mode,
  textSettings,
  imageSettings,
  commonSettings,
  isProcessing,
  onModeChange,
  onTextSettingsChange,
  onImageSettingsChange,
  onCommonSettingsChange,
  onApplyWatermark,
  formatFileSize,
}: WatermarkWorkspaceProps) {
  const [previewPage, setPreviewPage] = useState(1);

  // Handle image file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate image file
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(selectedFile.type)) {
        alert('Please select a PNG or JPG image file.');
        return;
      }
      onImageSettingsChange('file', selectedFile);
    }
  };

  // Calculate preview overlay styles
  const previewOverlayStyle = useMemo(() => {
    if (mode === 'text') {
      const colorHex = textSettings.color.replace('#', '');
      const r = parseInt(colorHex.substring(0, 2), 16);
      const g = parseInt(colorHex.substring(2, 4), 16);
      const b = parseInt(colorHex.substring(4, 6), 16);

      // Scale down text size for preview (preview is smaller than actual PDF)
      const previewFontSize = Math.min(textSettings.fontSize * 0.4, 32);

      return {
        color: `rgb(${r}, ${g}, ${b})`,
        opacity: textSettings.opacity / 100,
        transform: `rotate(${textSettings.rotation}deg)`,
        fontSize: `${previewFontSize}px`,
        position: textSettings.position,
      };
    } else {
      return {
        opacity: imageSettings.opacity / 100,
        transform: `rotate(${imageSettings.rotation}deg)`,
        position: imageSettings.position,
        scale: imageSettings.scale,
      };
    }
  }, [mode, textSettings, imageSettings]);

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* Left Area: Preview */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Preview</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewPage(Math.max(1, previewPage - 1))}
              disabled={previewPage === 1}>
              Previous
            </Button>
            <span className="text-sm text-muted-foreground min-w-[100px] text-center">
              Page {previewPage} of {pageCount}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPreviewPage(Math.min(pageCount, previewPage + 1))}
              disabled={previewPage === pageCount}>
              Next
            </Button>
          </div>
        </div>

        {/* PDF Preview with Overlay */}
        <div className="flex-1 relative border rounded-lg overflow-hidden bg-muted/20">
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative w-full h-full max-w-md">
              <PagePreview
                file={file}
                pageNumber={previewPage}
                className="w-full h-full"
              />

              {/* Watermark Overlay */}
              {((mode === 'text' && textSettings.text) ||
                (mode === 'image' && imageSettings.previewUrl)) && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ padding: '20px' }}>
                  <div
                    className="absolute"
                    style={{
                      // Position calculation
                      left:
                        previewOverlayStyle.position === 'top-left' ||
                        previewOverlayStyle.position === 'middle-left' ||
                        previewOverlayStyle.position === 'bottom-left'
                          ? '20px'
                          : previewOverlayStyle.position === 'top-right' ||
                            previewOverlayStyle.position === 'middle-right' ||
                            previewOverlayStyle.position === 'bottom-right'
                          ? 'auto'
                          : '50%',
                      right:
                        previewOverlayStyle.position === 'top-right' ||
                        previewOverlayStyle.position === 'middle-right' ||
                        previewOverlayStyle.position === 'bottom-right'
                          ? '20px'
                          : previewOverlayStyle.position === 'top-left' ||
                            previewOverlayStyle.position === 'middle-left' ||
                            previewOverlayStyle.position === 'bottom-left'
                          ? 'auto'
                          : undefined,
                      top:
                        previewOverlayStyle.position === 'top-left' ||
                        previewOverlayStyle.position === 'top-center' ||
                        previewOverlayStyle.position === 'top-right'
                          ? '20px'
                          : previewOverlayStyle.position === 'bottom-left' ||
                            previewOverlayStyle.position === 'bottom-center' ||
                            previewOverlayStyle.position === 'bottom-right'
                          ? 'auto'
                          : '50%',
                      bottom:
                        previewOverlayStyle.position === 'bottom-left' ||
                        previewOverlayStyle.position === 'bottom-center' ||
                        previewOverlayStyle.position === 'bottom-right'
                          ? '20px'
                          : previewOverlayStyle.position === 'top-left' ||
                            previewOverlayStyle.position === 'top-center' ||
                            previewOverlayStyle.position === 'top-right'
                          ? 'auto'
                          : undefined,
                      transform:
                        previewOverlayStyle.position === 'center' ||
                        previewOverlayStyle.position === 'middle-left' ||
                        previewOverlayStyle.position === 'middle-right' ||
                        previewOverlayStyle.position === 'top-center' ||
                        previewOverlayStyle.position === 'bottom-center'
                          ? `translate(-50%, -50%) ${previewOverlayStyle.transform}`
                          : previewOverlayStyle.transform,
                    }}>
                    {mode === 'text' ? (
                      <div
                        style={{
                          color: previewOverlayStyle.color,
                          opacity: previewOverlayStyle.opacity,
                          fontSize: previewOverlayStyle.fontSize,
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap',
                        }}>
                        {textSettings.text || 'Watermark'}
                      </div>
                    ) : imageSettings.previewUrl ? (
                      <img
                        src={imageSettings.previewUrl}
                        alt="Watermark preview"
                        style={{
                          width: `${Math.min(
                            600 * (previewOverlayStyle.scale || imageSettings.scale),
                            800
                          )}px`,
                          height: 'auto',
                          maxWidth: '100%',
                          maxHeight: '80%',
                          opacity: previewOverlayStyle.opacity,
                          transform: previewOverlayStyle.transform,
                        }}
                      />
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Controls */}
      <ToolSidebar
        title="Add Watermark"
        subtitle="Customize your watermark settings"
        actionButton={{
          label: 'ADD WATERMARK',
          onClick: onApplyWatermark,
          disabled: isProcessing || (mode === 'image' && !imageSettings.file),
          isLoading: isProcessing,
        }}>
        <Tabs
          value={mode}
          onValueChange={(value) => onModeChange(value as WatermarkMode)}
          className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Place Text</TabsTrigger>
            <TabsTrigger value="image">Place Image</TabsTrigger>
          </TabsList>

          {/* Text Watermark Tab */}
          <TabsContent
            value="text"
            className="space-y-6 mt-6">
            {/* Text Input */}
            <div className="space-y-2">
              <Label htmlFor="watermark-text">Watermark Text</Label>
              <Textarea
                id="watermark-text"
                value={textSettings.text}
                onChange={(e) => onTextSettingsChange('text', e.target.value)}
                placeholder="Enter watermark text"
                rows={3}
              />
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Font Size</Label>
                <span className="text-sm text-muted-foreground">{textSettings.fontSize}px</span>
              </div>
              <Slider
                value={[textSettings.fontSize]}
                onValueChange={([value]) => onTextSettingsChange('fontSize', value)}
                min={12}
                max={120}
                step={1}
              />
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="color"
                  value={textSettings.color}
                  onChange={(e) => onTextSettingsChange('color', e.target.value)}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={textSettings.color}
                  onChange={(e) => onTextSettingsChange('color', e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onTextSettingsChange('color', color)}
                    className={`w-8 h-8 rounded border-2 ${
                      textSettings.color === color ? 'border-primary' : 'border-border'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label>Position</Label>
              <div className="grid grid-cols-3 gap-2">
                {POSITION_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={textSettings.position === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onTextSettingsChange('position', option.value)}
                    className="h-10 text-xs">
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Transparency */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Transparency</Label>
                <span className="text-sm text-muted-foreground">{textSettings.opacity}%</span>
              </div>
              <Slider
                value={[textSettings.opacity]}
                onValueChange={([value]) => onTextSettingsChange('opacity', value)}
                min={0}
                max={100}
                step={1}
              />
            </div>

            {/* Rotation */}
            <div className="space-y-2">
              <Label>Rotation</Label>
              <div className="flex flex-wrap gap-2">
                {ROTATION_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={textSettings.rotation === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onTextSettingsChange('rotation', option.value)}>
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Image Watermark Tab */}
          <TabsContent
            value="image"
            className="space-y-6 mt-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Watermark Image</Label>
              {imageSettings.previewUrl ? (
                <div className="space-y-2">
                  <div className="relative w-full h-32 border rounded-lg overflow-hidden bg-muted/20">
                    <img
                      src={imageSettings.previewUrl}
                      alt="Watermark preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onImageSettingsChange('file', null);
                      if (imageSettings.previewUrl) {
                        URL.revokeObjectURL(imageSettings.previewUrl);
                      }
                      onImageSettingsChange('previewUrl', '');
                    }}>
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div>
                  <Input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="watermark-image-upload"
                  />
                  <Label
                    htmlFor="watermark-image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Click to upload image</span>
                    <span className="text-xs text-muted-foreground">PNG or JPG</span>
                  </Label>
                </div>
              )}
            </div>

            {/* Scale */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Scale</Label>
                <span className="text-sm text-muted-foreground">
                  {Math.round(imageSettings.scale * 100)}%
                </span>
              </div>
              <Slider
                value={[imageSettings.scale]}
                onValueChange={([value]) => onImageSettingsChange('scale', value)}
                min={0.1}
                max={2.0}
                step={0.1}
              />
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label>Position</Label>
              <div className="grid grid-cols-3 gap-2">
                {POSITION_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={imageSettings.position === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onImageSettingsChange('position', option.value)}
                    className="h-10 text-xs">
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Transparency */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Transparency</Label>
                <span className="text-sm text-muted-foreground">{imageSettings.opacity}%</span>
              </div>
              <Slider
                value={[imageSettings.opacity]}
                onValueChange={([value]) => onImageSettingsChange('opacity', value)}
                min={0}
                max={100}
                step={1}
              />
            </div>

            {/* Rotation */}
            <div className="space-y-2">
              <Label>Rotation</Label>
              <div className="flex flex-wrap gap-2">
                {ROTATION_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={imageSettings.rotation === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onImageSettingsChange('rotation', option.value)}>
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Common Settings */}
        <div className="mt-8 pt-6 border-t space-y-6">
          <div className="space-y-4">
            <Label>Page Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="from-page"
                  className="text-xs text-muted-foreground">
                  From Page
                </Label>
                <Input
                  id="from-page"
                  type="number"
                  min={1}
                  max={pageCount}
                  value={commonSettings.fromPage}
                  onChange={(e) =>
                    onCommonSettingsChange('fromPage', parseInt(e.target.value) || 1)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="to-page"
                  className="text-xs text-muted-foreground">
                  To Page
                </Label>
                <Input
                  id="to-page"
                  type="number"
                  min={1}
                  max={pageCount}
                  value={commonSettings.toPage}
                  onChange={(e) => onCommonSettingsChange('toPage', parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Pages {commonSettings.fromPage} to {commonSettings.toPage} of {pageCount}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Layer</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={commonSettings.layer === 'over' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => onCommonSettingsChange('layer', 'over')}>
                Over PDF content
              </Button>
              <Button
                type="button"
                variant={commonSettings.layer === 'below' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
                onClick={() => onCommonSettingsChange('layer', 'below')}>
                Below PDF content
              </Button>
            </div>
            {commonSettings.layer === 'below' && (
              <p className="text-xs text-muted-foreground">
                Watermark will be placed behind the PDF content.
              </p>
            )}
          </div>
        </div>
      </ToolSidebar>
    </div>
  );
}
