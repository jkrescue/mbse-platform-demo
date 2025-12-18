// 节点状态枚举
export type NodeStatus = "completed" | "running" | "waiting";

// 节点接口
export interface WorkflowNode {
  id: string;
  type: string;
  name: string;
  description: string;
  tag: string;
  tagColor: string;
  status: NodeStatus;
  position: { x: number; y: number };
  collapsed: boolean;
  ports: {
    input: { x: number; y: number };
    output: { x: number; y: number };
  };
  action?: string;
  // 配置选项
  config?: {
    timeout?: number;
    retryCount?: number;
    autoRun?: boolean;
    parameters?: Record<string, any>;
  };
}

// 连接线接口
export interface Connection {
  id: string;
  from: string;
  to: string;
  fromPort: "output";
  toPort: "input";
}

// 右键菜单位置
export interface ContextMenuPosition {
  x: number;
  y: number;
  nodeId: string;
}

export interface WorkflowEditorProps {
  workflowData: any;
  onBack: () => void;
  onSave: (data: any) => void;
  userRole?: string;
  onOpenInTool?: (nodeData: any) => void;
}