import React from "react";
import { X } from "lucide-react@0.487.0";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

interface ConfigDrawerProps {
  isConfigDrawerOpen: boolean;
  setIsConfigDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  configNodeId: string | null;
  setConfigNodeId: React.Dispatch<React.SetStateAction<string | null>>;
  nodes: any[];
  toolbarRef: React.RefObject<HTMLDivElement>;
  renderNodeConfigContent: (node: any) => React.ReactNode;
}

export function ConfigDrawer({
  isConfigDrawerOpen,
  setIsConfigDrawerOpen,
  configNodeId,
  setConfigNodeId,
  nodes,
  toolbarRef,
  renderNodeConfigContent,
}: ConfigDrawerProps) {
  if (!isConfigDrawerOpen || !configNodeId) return null;

  const node = nodes.find((n) => n.id === configNodeId);
  if (!node) return null;

  // 计算工具栏底部位置
  const toolbarHeight = toolbarRef.current?.offsetHeight || 0;
  const toolbarTop = toolbarRef.current?.offsetTop || 0;
  const drawerTop = toolbarTop + toolbarHeight;

  return (
    <div
      className="fixed right-0 w-96 bg-white shadow-lg border-l border-gray-200 z-50 transform transition-transform duration-300 ease-in-out flex flex-col"
      style={{
        top: `${drawerTop}px`,
        height: `calc(100vh - ${drawerTop}px)`,
        transform: isConfigDrawerOpen ? "translateX(0)" : "translateX(100%)",
      }}
    >
      {/* 抽屉头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-lg font-medium">节点配置</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsConfigDrawerOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* 抽屉内容 */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full config-drawer-scroll">
          <div className="px-4 py-4 pb-6 space-y-4">
            {renderNodeConfigContent(node)}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}