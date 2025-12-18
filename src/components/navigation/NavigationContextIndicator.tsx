import { useState, useEffect } from "react";
import { X, Navigation } from "lucide-react@0.487.0";
import { Button } from "../ui/button";

interface NavigationFilter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'in' | 'range';
  value: any;
  display?: string;
}

interface NavigationContextIndicatorProps {
  filters: NavigationFilter[];
  highlightItems?: string[];
  onClose?: () => void;
}

export function NavigationContextIndicator({ 
  filters, 
  highlightItems = [], 
  onClose 
}: NavigationContextIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 5秒后自动隐藏
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible || (filters.length === 0 && highlightItems.length === 0)) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <div className="fixed top-20 right-4 bg-blue-50 border border-blue-200 rounded-lg p-3 shadow-lg z-50 max-w-sm">
      <div className="flex items-center gap-2 mb-2">
        <Navigation className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium text-blue-800">导航上下文</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="h-6 w-6 p-0 ml-auto hover:bg-blue-100"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      {filters.length > 0 && (
        <div className="space-y-1 mb-2">
          <div className="text-xs font-medium text-blue-700">应用筛选条件:</div>
          {filters.map((filter, index) => (
            <div key={index} className="text-xs text-blue-700 bg-blue-100 rounded px-2 py-1">
              {filter.display || `${filter.field}: ${filter.value}`}
            </div>
          ))}
        </div>
      )}
      
      {highlightItems.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-blue-700">高亮项目:</div>
          {highlightItems.map((item, index) => (
            <div key={index} className="text-xs text-blue-700 bg-blue-100 rounded px-2 py-1">
              {item}
            </div>
          ))}
        </div>
      )}
      
      <div className="text-xs text-blue-600 mt-2">
        自动跳转成功，3秒后自动关闭
      </div>
    </div>
  );
}