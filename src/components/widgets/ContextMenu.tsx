import React, { useEffect, useRef, useState } from "react";
import { Copy, Trash2, Eye, Play, FastForward, Wrench, BarChart3 } from "lucide-react@0.487.0";
import { EAToolModal } from "./EAToolModal";

interface ContextMenuProps {
  contextMenu: any;
  setContextMenu: React.Dispatch<React.SetStateAction<any>>;
  nodes: any[];
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
  connections: any[];
  setConnections: React.Dispatch<React.SetStateAction<any[]>>;
  setConfigNodeId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsConfigDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setResultNodeId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsResultDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenInTool?: (nodeData: any) => void;
}

export function ContextMenu({
  contextMenu,
  setContextMenu,
  nodes,
  setNodes,
  connections,
  setConnections,
  setConfigNodeId,
  setIsConfigDrawerOpen,
  setResultNodeId,
  setIsResultDrawerOpen,
  onOpenInTool,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isEAToolOpen, setIsEAToolOpen] = useState(false);

  // 监听画布点击事件，点击任意位置关闭右键菜单
  useEffect(() => {
    if (!contextMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // 检查点击是否在菜单内部
      if (menuRef.current && menuRef.current.contains(target)) {
        return; // 点击在菜单内部，不关闭
      }
      
      // 点击在任何外部区域都关闭菜单
      setContextMenu(null);
    };

    // 添加事件监听器
    document.addEventListener('mousedown', handleClickOutside);
    
    // 清理函数
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu, setContextMenu]);

  if (!contextMenu) return null;

  const node = nodes.find((n) => n.id === contextMenu.nodeId);
  if (!node) return null;

  const handleContextMenuAction = (action: string, nodeId: string) => {
    switch (action) {
      case "copy":
        const newNode = {
          ...node,
          id: `node-${Date.now()}`,
          position: {
            x: node.position.x + 50,
            y: node.position.y + 50,
          },
          name: `${node.name} (副本)`,
        };
        setNodes((prev) => [...prev, newNode]);
        break;
      case "delete":
        setNodes((prev) => prev.filter((n) => n.id !== nodeId));
        setConnections((prev) =>
          prev.filter((c) => c.from !== nodeId && c.to !== nodeId)
        );
        break;
      case "openInTool":
        // 调用页面导航回调，打开EA工具页面
        if (onOpenInTool) {
          onOpenInTool(node);
        }
        console.log(`在EA工具中打开节点: ${nodeId}`);
        break;
      case "executeNode":
        // 执行此节点的逻辑
        setNodes((prev) =>
          prev.map((n) => (n.id === nodeId ? { ...n, status: "running" } : n))
        );
        console.log(`执行节点: ${nodeId}`);
        break;
      case "executeFromNode":
        // 从该节点执行的逻辑
        console.log(`从节点执行: ${nodeId}`);
        break;
      case "viewResults":
        if (node.status === "completed") {
          setResultNodeId(nodeId);
          setIsResultDrawerOpen(true);
        }
        break;
    }
    setContextMenu(null);
  };

  const MenuItem = ({ onClick, children, className = "", icon: Icon, disabled = false }: any) => (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`flex items-center gap-2 px-3 py-2 ${!disabled ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-not-allowed'} ${className}`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </div>
  );

  const MenuSeparator = () => <div className="h-px bg-gray-200 my-1" />;

  // 判断是否可以在工具中打开的节点类型
  const canOpenInTool = contextMenu.canOpenInTool || 
                        node.type === 'function-system-design' || 
                        node.name === '功能&系统设计' ||
                        node.category === 'system-design' ||
                        node.id.includes('function-system') ||
                        node.action?.includes('功能&系统设计') ||
                        node.type === 'battery-thermal-design' ||
                        node.type === 'vehicle-safety-arch' ||
                        node.type === 'simulation' ||
                        node.action?.includes('仿真');

  return (
    <div
      ref={menuRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-[160px]"
      style={{
        left: contextMenu.x,
        top: contextMenu.y,
      }}
    >
      <MenuItem
        onClick={() => handleContextMenuAction("copy", contextMenu.nodeId)}
        icon={Copy}
      >
        复制节点
      </MenuItem>

      <MenuItem
        onClick={() => handleContextMenuAction("delete", contextMenu.nodeId)}
        className="text-red-600"
        icon={Trash2}
      >
        删除节点
      </MenuItem>

      {canOpenInTool && (
        <>
          <MenuSeparator />
          <MenuItem
            onClick={() => handleContextMenuAction("openInTool", contextMenu.nodeId)}
            className="text-blue-600"
            icon={Wrench}
          >
            在工具中打开
          </MenuItem>
        </>
      )}

      <MenuSeparator />

      <MenuItem
        onClick={() => handleContextMenuAction("executeNode", contextMenu.nodeId)}
        className="text-green-600"
        icon={Play}
      >
        执行此节点
      </MenuItem>

      <MenuItem
        onClick={() => handleContextMenuAction("executeFromNode", contextMenu.nodeId)}
        className="text-orange-600"
        icon={FastForward}
      >
        从该节点执行
      </MenuItem>

      <MenuItem
        onClick={node.status === "completed" ? () => handleContextMenuAction("viewResults", contextMenu.nodeId) : undefined}
        className={node.status === "completed" ? "text-blue-600" : "text-gray-400 cursor-not-allowed"}
        icon={BarChart3}
        disabled={node.status !== "completed"}
      >
        查看结果
      </MenuItem>
    </div>
  );
}