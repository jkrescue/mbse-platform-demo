import React from 'react';

interface TreeViewProps {
  children: React.ReactNode;
  className?: string;
}

interface TreeItemProps {
  children: React.ReactNode;
  className?: string;
}

export function TreeView({ children, className = '' }: TreeViewProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {children}
    </div>
  );
}

export function TreeItem({ children, className = '' }: TreeItemProps) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  );
}