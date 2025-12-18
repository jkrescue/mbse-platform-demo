import React, { ReactNode } from 'react'
import { ChevronDown, MoreVertical, Maximize2, Minimize2 } from 'lucide-react@0.487.0'

export type WidgetSize = 'small' | 'medium' | 'large' | 'full'

interface WidgetProps {
  id: string
  title: string
  size?: WidgetSize
  children: ReactNode
  collapsible?: boolean
  actions?: boolean
  className?: string
}

const sizeClasses = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-1 row-span-2',
  large: 'col-span-2 row-span-3',
  full: 'col-span-4 row-span-2'
}

export function Widget({ 
  id, 
  title, 
  size = 'medium', 
  children, 
  collapsible = true,
  actions = true,
  className = '' 
}: WidgetProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isMaximized, setIsMaximized] = React.useState(false)

  return (
    <div 
      className={`
        ${isMaximized ? 'col-span-4 row-span-4 z-50' : sizeClasses[size]}
        bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col
        ${className}
      `}
      data-widget-id={id}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
            >
              <ChevronDown 
                className={`w-4 h-4 text-gray-400 transform transition-transform ${
                  isCollapsed ? '-rotate-90' : ''
                }`} 
              />
            </button>
          )}
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>

        {actions && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              title={isMaximized ? "最小化" : "最大化"}
            >
              {isMaximized ? (
                <Minimize2 className="w-4 h-4 text-gray-400" />
              ) : (
                <Maximize2 className="w-4 h-4 text-gray-400" />
              )}
            </button>
            <button
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              title="更多选项"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}
      </div>

      {/* Widget Content */}
      {!isCollapsed && (
        <div className="flex-1 p-4 overflow-hidden">
          <div className="h-full overflow-auto scrollbar-thin">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}