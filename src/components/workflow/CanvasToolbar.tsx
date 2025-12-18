import React from 'react';
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react@0.487.0";
import { ZOOM_CONFIG } from './constants';

interface CanvasToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

export function CanvasToolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
}: CanvasToolbarProps) {
  return (
    <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center p-2 space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          disabled={zoom >= ZOOM_CONFIG.max}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          disabled={zoom <= ZOOM_CONFIG.min}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetView}
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <span className="text-sm text-gray-600 px-2">
          {zoom}%
        </span>
      </div>
    </div>
  );
}