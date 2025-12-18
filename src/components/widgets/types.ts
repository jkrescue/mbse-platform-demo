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
  config?: {
    timeout?: number;
    retryCount?: number;
    autoRun?: boolean;
    parameters?: Record<string, any>;
    archConversionConfig?: any;
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

// 工作流编辑器Props接口
export interface BlankWorkflowEditorProps {
  workflowData: any;
  onBack: () => void;
  onSave: (data: any) => void;
  userRole?: string;
  isFromAppCenter?: boolean; // 标识是否来自应用中心
}

// 画布边界配置
export interface CanvasBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

// 视图边界配置  
export interface ViewportBounds {
  minPanX: number;
  maxPanX: number;
  minPanY: number;
  maxPanY: number;
}

// 组件库项目接口
export interface ComponentLibraryItem {
  id: string;
  name: string;
  description: string;
  action: string;
}

// 组件库分类接口
export interface ComponentLibrarySection {
  id: string;
  title: string;
  tag: string;
  tagColor: string;
  isOpen: boolean;
  items: ComponentLibraryItem[];
}

// 拖拽状态接口
export interface DragState {
  x: number;
  y: number;
}

// 节点拖拽状态接口
export interface NodeDragState {
  id: string;
  offset: { x: number; y: number };
  startPosition: { x: number; y: number };
  hasMoved: boolean;
}

// 连接创建状态接口
export interface ConnectionStartState {
  nodeId: string;
  port: "input" | "output";
  x: number;
  y: number;
}

// 选中的库项目状态接口
export interface SelectedLibraryItem {
  item: any;
  sectionTag: string;
}