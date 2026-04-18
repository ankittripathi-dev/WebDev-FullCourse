'use client';

import { useState, useMemo } from 'react';
import { ToolSidebar } from '@/components/shared/ToolSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageNumbersPagePreview } from './PageNumbersPagePreview';
import {
  PageNumbersMode,
  PageNumbersSettings,
  PagePosition,
  FacingPosition,
  MarginSize,
} from '@/hooks/use-page-numbers';
import { Info } from 'lucide-react';

interface PageNumbersWorkspaceProps {
  file: File;
  pageCount: number;
  mode: PageNumbersMode;
  settings: PageNumbersSettings;
  isProcessing: boolean;
  onModeChange: (mode: PageNumbersMode) => void;
  onSettingChange: <K extends keyof PageNumbersSettings>(
    key: K,
    value: PageNumbersSettings[K]
  ) => void;
  onAddNumbers: () => void;
  formatFileSize: (bytes: number) => string;
}

const POSITION_OPTIONS: { value: PagePosition; label: string }[] = [
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

const TEXT_TEMPLATE_OPTIONS = [
  { value: '{n}', label: 'Insert only page number ({n})' },
  { value: 'Page {n}', label: 'Page {n}' },
  { value: 'Page {n} of {p}', label: 'Page {n} of {p}' },
  { value: 'custom', label: 'Custom' },
];

const FONT_OPTIONS = [
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Helvetica-Bold', label: 'Helvetica Bold' },
  { value: 'Times-Roman', label: 'Times Roman' },
];

const PRESET_COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF0000', // Red
  '#0000FF', // Blue
  '#808080', // Gray
];

export function PageNumbersWorkspace({
  file,
  pageCount,
  mode,
  settings,
  isProcessing,
  onModeChange,
  onSettingChange,
  onAddNumbers,
  formatFileSize,
}: PageNumbersWorkspaceProps) {
  const [previewPage, setPreviewPage] = useState(1);
  const [isCustomTemplate, setIsCustomTemplate] = useState(false);

  // Check if current template is custom
  useMemo(() => {
    const isCustom = !TEXT_TEMPLATE_OPTIONS.some((opt) => opt.value === settings.textTemplate);
    setIsCustomTemplate(isCustom);
  }, [settings.textTemplate]);

  // Calculate preview overlay position
  const previewOverlayStyle = useMemo(() => {
    const margin = settings.margin === 'small' ? 10 : settings.margin === 'big' ? 30 : 20;
    const marginPx = `${margin}px`;

    let positionStyles: React.CSSProperties = {};

    if (mode === 'single') {
      switch (settings.position) {
        case 'top-left':
          positionStyles = { top: marginPx, left: marginPx };
          break;
        case 'top-center':
          positionStyles = { top: marginPx, left: '50%', transform: 'translateX(-50%)' };
          break;
        case 'top-right':
          positionStyles = { top: marginPx, right: marginPx, textAlign: 'right' };
          break;
        case 'middle-left':
          positionStyles = { top: '50%', left: marginPx, transform: 'translateY(-50%)' };
          break;
        case 'center':
          positionStyles = {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          };
          break;
        case 'middle-right':
          positionStyles = {
            top: '50%',
            right: marginPx,
            transform: 'translateY(-50%)',
            textAlign: 'right',
          };
          break;
        case 'bottom-left':
          positionStyles = { bottom: marginPx, left: marginPx };
          break;
        case 'bottom-center':
          positionStyles = {
            bottom: marginPx,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          };
          break;
        case 'bottom-right':
          positionStyles = { bottom: marginPx, right: marginPx, textAlign: 'right' };
          break;
      }
    } else {
      // Facing mode - always bottom
      const isLeft = previewPage % 2 === 0; // Even pages are left
      switch (settings.facingPosition) {
        case 'outer':
          if (isLeft) {
            positionStyles = { bottom: marginPx, left: marginPx };
          } else {
            positionStyles = { bottom: marginPx, right: marginPx, textAlign: 'right' };
          }
          break;
        case 'inner':
          if (isLeft) {
            positionStyles = { bottom: marginPx, right: marginPx, textAlign: 'right' };
          } else {
            positionStyles = { bottom: marginPx, left: marginPx };
          }
          break;
        case 'center':
          positionStyles = {
            bottom: marginPx,
            left: '50%',
            transform: 'translateX(-50%)',
          };
          break;
      }
    }

    // Parse color
    const colorHex = settings.format.color.replace('#', '');
    const r = parseInt(colorHex.substring(0, 2), 16);
    const g = parseInt(colorHex.substring(2, 4), 16);
    const b = parseInt(colorHex.substring(4, 6), 16);

    // Format text for preview
    const previewText = settings.textTemplate
      .replace(/{n}/g, previewPage.toString())
      .replace(/{p}/g, pageCount.toString());

    return {
      ...positionStyles,
      color: `rgb(${r}, ${g}, ${b})`,
      fontSize: `${settings.format.size}px`,
      fontWeight: settings.format.bold ? 'bold' : 'normal',
      fontStyle: settings.format.italic ? 'italic' : 'normal',
      text: previewText,
      whiteSpace: 'nowrap', // Prevent text wrapping
    };
  }, [mode, settings, previewPage, pageCount]);

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
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <PageNumbersPagePreview
                file={file}
                pageNumber={previewPage}
                className="w-full h-full"
              />

              {/* Page Number Overlay */}
              <div
                className="absolute pointer-events-none"
                style={{
                  ...previewOverlayStyle,
                  fontFamily: settings.format.font,
                  textAlign: previewOverlayStyle.textAlign || 'left',
                  // For right positions, constrain width to prevent overflow
                  ...(previewOverlayStyle.right !== undefined && {
                    maxWidth: `calc(100% - ${String(previewOverlayStyle.right).replace(
                      'px',
                      ''
                    )}px)`,
                    overflow: 'hidden',
                    wordBreak: 'keep-all',
                  }),
                }}>
                {previewOverlayStyle.text}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Controls */}
      <ToolSidebar
        title="Add Page Numbers"
        subtitle="Customize page number appearance and position"
        actionButton={{
          label: 'ADD PAGE NUMBERS',
          onClick: onAddNumbers,
          disabled: isProcessing,
          isLoading: isProcessing,
        }}>
        <Tabs
          value={mode}
          onValueChange={(v) => onModeChange(v as PageNumbersMode)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Page</TabsTrigger>
            <TabsTrigger value="facing">Facing Pages</TabsTrigger>
          </TabsList>

          {/* Tab 1: Single Page */}
          <TabsContent
            value="single"
            className="space-y-6 mt-6">
            {/* Position */}
            <div className="space-y-2">
              <Label>Position</Label>
              <div className="grid grid-cols-3 gap-2">
                {POSITION_OPTIONS.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={settings.position === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onSettingChange('position', option.value)}
                    className="h-10 text-xs">
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Margin */}
            <div className="space-y-2">
              <Label>Margin</Label>
              <Select
                value={settings.margin}
                onValueChange={(value) => onSettingChange('margin', value as MarginSize)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="big">Big</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pages */}
            <div className="space-y-2">
              <Label>Pages</Label>
              <div className="grid grid-cols-3 gap-2 items-end">
                <div className="space-y-1">
                  <Label
                    htmlFor="from-page"
                    className="text-xs text-muted-foreground">
                    From
                  </Label>
                  <Input
                    id="from-page"
                    type="number"
                    min={1}
                    max={pageCount}
                    value={settings.range.start}
                    onChange={(e) =>
                      onSettingChange('range', {
                        ...settings.range,
                        start: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div className="text-center pb-2">
                  <span className="text-sm text-muted-foreground">to</span>
                </div>
                <div className="space-y-1">
                  <Label
                    htmlFor="to-page"
                    className="text-xs text-muted-foreground">
                    To
                  </Label>
                  <Input
                    id="to-page"
                    type="number"
                    min={1}
                    max={pageCount}
                    value={settings.range.end}
                    onChange={(e) =>
                      onSettingChange('range', {
                        ...settings.range,
                        end: parseInt(e.target.value) || pageCount,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Text Template */}
            <div className="space-y-2">
              <Label>Text</Label>
              <Select
                value={
                  isCustomTemplate
                    ? 'custom'
                    : TEXT_TEMPLATE_OPTIONS.find((opt) => opt.value === settings.textTemplate)
                        ?.value || TEXT_TEMPLATE_OPTIONS[1].value
                }
                onValueChange={(value) => {
                  if (value === 'custom') {
                    setIsCustomTemplate(true);
                  } else {
                    setIsCustomTemplate(false);
                    onSettingChange('textTemplate', value);
                  }
                }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEXT_TEMPLATE_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isCustomTemplate && (
                <Input
                  placeholder="Enter custom template (use {n} for page, {p} for total)"
                  value={settings.textTemplate}
                  onChange={(e) => onSettingChange('textTemplate', e.target.value)}
                />
              )}
            </div>

            {/* Text Format */}
            <div className="space-y-4">
              <Label>Text Format</Label>

              {/* Font */}
              <div className="space-y-2">
                <Label
                  htmlFor="font"
                  className="text-xs text-muted-foreground">
                  Font Family
                </Label>
                <Select
                  value={settings.format.font}
                  onValueChange={(value) =>
                    onSettingChange('format', { ...settings.format, font: value })
                  }>
                  <SelectTrigger id="font">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem
                        key={font.value}
                        value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="font-size"
                    className="text-xs text-muted-foreground">
                    Size
                  </Label>
                  <span className="text-sm text-muted-foreground">{settings.format.size}px</span>
                </div>
                <Input
                  id="font-size"
                  type="number"
                  min={8}
                  max={72}
                  value={settings.format.size}
                  onChange={(e) =>
                    onSettingChange('format', {
                      ...settings.format,
                      size: parseInt(e.target.value) || 12,
                    })
                  }
                />
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Color</Label>
                <div className="flex gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded border-2 ${
                        settings.format.color === color
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-border'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => onSettingChange('format', { ...settings.format, color })}
                    />
                  ))}
                  <Input
                    type="color"
                    value={settings.format.color}
                    onChange={(e) =>
                      onSettingChange('format', { ...settings.format, color: e.target.value })
                    }
                    className="w-8 h-8 p-0 border cursor-pointer"
                  />
                </div>
              </div>

              {/* Bold/Italic */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="bold"
                    checked={settings.format.bold}
                    onCheckedChange={(checked) =>
                      onSettingChange('format', { ...settings.format, bold: !!checked })
                    }
                  />
                  <Label
                    htmlFor="bold"
                    className="text-sm cursor-pointer">
                    Bold
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="italic"
                    checked={settings.format.italic}
                    onCheckedChange={(checked) =>
                      onSettingChange('format', { ...settings.format, italic: !!checked })
                    }
                  />
                  <Label
                    htmlFor="italic"
                    className="text-sm cursor-pointer">
                    Italic
                  </Label>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Tab 2: Facing Pages */}
          <TabsContent
            value="facing"
            className="space-y-6 mt-6">
            {/* Start from Cover */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="start-from-cover"
                checked={settings.startFromCover}
                onCheckedChange={(checked) => onSettingChange('startFromCover', !!checked)}
              />
              <Label
                htmlFor="start-from-cover"
                className="text-sm cursor-pointer">
                First page is cover page
              </Label>
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label>Position</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={settings.facingPosition === 'outer' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => onSettingChange('facingPosition', 'outer')}>
                  Outer
                </Button>
                <Button
                  type="button"
                  variant={settings.facingPosition === 'inner' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => onSettingChange('facingPosition', 'inner')}>
                  Inner
                </Button>
                <Button
                  type="button"
                  variant={settings.facingPosition === 'center' ? 'default' : 'outline'}
                  size="sm"
                  className="flex-1"
                  onClick={() => onSettingChange('facingPosition', 'center')}>
                  Center
                </Button>
              </div>
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p>
                  {settings.facingPosition === 'outer' &&
                    'Outer places numbers on the outside edge of the book spread.'}
                  {settings.facingPosition === 'inner' &&
                    'Inner places numbers on the inside edge of the book spread.'}
                  {settings.facingPosition === 'center' &&
                    'Center places numbers in the center of each page.'}
                </p>
              </div>
            </div>

            {/* Margin */}
            <div className="space-y-2">
              <Label>Margin</Label>
              <Select
                value={settings.margin}
                onValueChange={(value) => onSettingChange('margin', value as MarginSize)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="big">Big</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pages */}
            <div className="space-y-2">
              <Label>Pages</Label>
              <div className="grid grid-cols-3 gap-2 items-end">
                <div className="space-y-1">
                  <Label
                    htmlFor="from-page-facing"
                    className="text-xs text-muted-foreground">
                    From
                  </Label>
                  <Input
                    id="from-page-facing"
                    type="number"
                    min={1}
                    max={pageCount}
                    value={settings.range.start}
                    onChange={(e) =>
                      onSettingChange('range', {
                        ...settings.range,
                        start: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
                <div className="text-center pb-2">
                  <span className="text-sm text-muted-foreground">to</span>
                </div>
                <div className="space-y-1">
                  <Label
                    htmlFor="to-page-facing"
                    className="text-xs text-muted-foreground">
                    To
                  </Label>
                  <Input
                    id="to-page-facing"
                    type="number"
                    min={1}
                    max={pageCount}
                    value={settings.range.end}
                    onChange={(e) =>
                      onSettingChange('range', {
                        ...settings.range,
                        end: parseInt(e.target.value) || pageCount,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Text Template - Same as Single */}
            <div className="space-y-2">
              <Label>Text</Label>
              <Select
                value={
                  isCustomTemplate
                    ? 'custom'
                    : TEXT_TEMPLATE_OPTIONS.find((opt) => opt.value === settings.textTemplate)
                        ?.value || TEXT_TEMPLATE_OPTIONS[1].value
                }
                onValueChange={(value) => {
                  if (value === 'custom') {
                    setIsCustomTemplate(true);
                  } else {
                    setIsCustomTemplate(false);
                    onSettingChange('textTemplate', value);
                  }
                }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEXT_TEMPLATE_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isCustomTemplate && (
                <Input
                  placeholder="Enter custom template (use {n} for page, {p} for total)"
                  value={settings.textTemplate}
                  onChange={(e) => onSettingChange('textTemplate', e.target.value)}
                />
              )}
            </div>

            {/* Text Format - Same as Single */}
            <div className="space-y-4">
              <Label>Text Format</Label>

              {/* Font */}
              <div className="space-y-2">
                <Label
                  htmlFor="font-facing"
                  className="text-xs text-muted-foreground">
                  Font Family
                </Label>
                <Select
                  value={settings.format.font}
                  onValueChange={(value) =>
                    onSettingChange('format', { ...settings.format, font: value })
                  }>
                  <SelectTrigger id="font-facing">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem
                        key={font.value}
                        value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="font-size-facing"
                    className="text-xs text-muted-foreground">
                    Size
                  </Label>
                  <span className="text-sm text-muted-foreground">{settings.format.size}px</span>
                </div>
                <Input
                  id="font-size-facing"
                  type="number"
                  min={8}
                  max={72}
                  value={settings.format.size}
                  onChange={(e) =>
                    onSettingChange('format', {
                      ...settings.format,
                      size: parseInt(e.target.value) || 12,
                    })
                  }
                />
              </div>

              {/* Color */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Color</Label>
                <div className="flex gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded border-2 ${
                        settings.format.color === color
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-border'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => onSettingChange('format', { ...settings.format, color })}
                    />
                  ))}
                  <Input
                    type="color"
                    value={settings.format.color}
                    onChange={(e) =>
                      onSettingChange('format', { ...settings.format, color: e.target.value })
                    }
                    className="w-8 h-8 p-0 border cursor-pointer"
                  />
                </div>
              </div>

              {/* Bold/Italic */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="bold-facing"
                    checked={settings.format.bold}
                    onCheckedChange={(checked) =>
                      onSettingChange('format', { ...settings.format, bold: !!checked })
                    }
                  />
                  <Label
                    htmlFor="bold-facing"
                    className="text-sm cursor-pointer">
                    Bold
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="italic-facing"
                    checked={settings.format.italic}
                    onCheckedChange={(checked) =>
                      onSettingChange('format', { ...settings.format, italic: !!checked })
                    }
                  />
                  <Label
                    htmlFor="italic-facing"
                    className="text-sm cursor-pointer">
                    Italic
                  </Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </ToolSidebar>
    </div>
  );
}
