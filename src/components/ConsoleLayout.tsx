import React, { ReactNode } from 'react'

interface ConsoleLayoutProps {
  children: ReactNode
  className?: string
}

export function ConsoleLayout({
  children,
  className = ""
}: ConsoleLayoutProps) {
  return (
    <div className="h-full bg-gray-50 overflow-y-auto admin-console-container">
      <div className={`p-3 sm:p-4 lg:p-6 ${className}`}>
        <div className="w-full max-w-[98%] 2xl:max-w-[95%] mx-auto">
          {/* 控制台网格布局 - 优化的响应式设计，减少空白，支持折叠布局 */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:gap-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}