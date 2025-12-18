import React, { useRef, useCallback, useEffect, useState } from "react";
import { Move } from "lucide-react@0.487.0";
import { WorkflowNode, Connection, ConnectionStartState } from './types';
import { WorkflowNodeComponent } from './WorkflowNodeComponent';
import { getTagColor, constrainPosition, constrainPan, generateNodeId } from './utils';
import { NODE_DIMENSIONS, PORT_POSITIONS } from './constants';
import { toast } from "sonner@2.0.3";

interface WorkflowCanvasProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  nodes: WorkflowNode[];
  setNodes: React.Dispatch<React.SetStateAction<WorkflowNode[]>>;
  connections: Connection[];
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
  selectedNode: string | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<string | null>>;
  draggingNode: any;
  setDraggingNode: React.Dispatch<React.SetStateAction<any>>;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  panX: number;
  setPanX: React.Dispatch<React.SetStateAction<number>>;
  panY: number;
  setPanY: React.Dispatch<React.SetStateAction<number>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  dragStart: { x: number; y: number };
  setDragStart: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  lastPan: { x: number; y: number };
  setLastPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  isDraggingFromLibrary: boolean;
  setIsDraggingFromLibrary: React.Dispatch<React.SetStateAction<boolean>>;
  selectedLibraryItem: any;
  setSelectedLibraryItem: React.Dispatch<React.SetStateAction<any>>;
  isCreatingConnection: boolean;
  setIsCreatingConnection: React.Dispatch<React.SetStateAction<boolean>>;
  connectionStart: ConnectionStartState | null;
  setConnectionStart: React.Dispatch<React.SetStateAction<ConnectionStartState | null>>;
  dragPosition: { x: number; y: number };
  setDragPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  isMoveMode: boolean;
  setIsMoveMode: React.Dispatch<React.SetStateAction<boolean>>;
  isResultDrawerOpen: boolean;
  setIsResultDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  contextMenu: any;
  setContextMenu: React.Dispatch<React.SetStateAction<any>>;
  isConfigDrawerOpen: boolean;
  setIsConfigDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setConfigNodeId: React.Dispatch<React.SetStateAction<string | null>>;
  onNodeClick: (nodeId: string) => void;
  constrainPosition: (x: number, y: number) => { x: number; y: number };
  constrainPan: (panX: number, panY: number) => { x: number; y: number };
  getTagColor: (tag: string) => string;
  getNodeStatusStyle: (status: string) => string;
  getConnectionColor: (fromStatus: string, toStatus: string) => string;
}

export function WorkflowCanvas({
  canvasRef,
  nodes,
  setNodes,
  connections,
  setConnections,
  selectedNode,
  setSelectedNode,
  draggingNode,
  setDraggingNode,
  zoom,
  setZoom,
  panX,
  setPanX,
  panY,
  setPanY,
  isDragging,
  setIsDragging,
  dragStart,
  setDragStart,
  lastPan,
  setLastPan,
  isDraggingFromLibrary,
  setIsDraggingFromLibrary,
  selectedLibraryItem,
  setSelectedLibraryItem,
  isCreatingConnection,
  setIsCreatingConnection,
  connectionStart,
  setConnectionStart,
  dragPosition,
  setDragPosition,
  isMoveMode,
  setIsMoveMode,
  isResultDrawerOpen,
  setIsResultDrawerOpen,
  contextMenu,
  setContextMenu,
  isConfigDrawerOpen,
  setIsConfigDrawerOpen,
  setConfigNodeId,
  onNodeClick,
  getNodeStatusStyle,
  getConnectionColor,
}: WorkflowCanvasProps) {
  
  const [currentMousePosition, setCurrentMousePosition] = useState({ x: 0, y: 0 });
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hoveredPort, setHoveredPort] = useState<{ nodeId: string; port: 'input' | 'output' } | null>(null);
  
  // 添加状态用于区分点击和拖拽
  const [mouseDownTime, setMouseDownTime] = useState<number>(0);
  const [mouseDownPosition, setMouseDownPosition] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [potentialClickNodeId, setPotentialClickNodeId] = useState<string | null>(null);

  // 拖放状态管理
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragOverPosition, setDragOverPosition] = useState({ x: 0, y: 0 });

  // ESC键监听，退出移动模式
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMoveMode) {
        setIsMoveMode(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMoveMode, setIsMoveMode]);

  // 处理鼠标按下事件
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // 只处理左键

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const canvasX = (e.clientX - rect.left - panX) / (zoom / 100);
    const canvasY = (e.clientY - rect.top - panY) / (zoom / 100);

    setCurrentMousePosition({ x: canvasX, y: canvasY });

    // 检查是否点击在节点上
    const clickedNode = nodes.find(node => {
      const nodeX = node.position.x;
      const nodeY = node.position.y;
      return canvasX >= nodeX && canvasX <= nodeX + NODE_DIMENSIONS.width &&
             canvasY >= nodeY && canvasY <= nodeY + NODE_DIMENSIONS.height;
    });

    // 检查是否点击在端口上
    if (clickedNode) {
      const relativeX = canvasX - clickedNode.position.x;
      const relativeY = canvasY - clickedNode.position.y;
      
      // 输入端口区域 (左侧)
      if (relativeX <= 20 && relativeY >= 50 && relativeY <= 70) {
        if (isCreatingConnection && connectionStart) {
          // 完成连接 - 检查串行连接规则
          if (connectionStart.nodeId !== clickedNode.id && connectionStart.port === "output") {
            // 检查目标节点是否已有输入连接
            const hasInputConnection = connections.some(conn => conn.to === clickedNode.id);
            if (hasInputConnection) {
              // 显示错误提示
              toast.error("该节点已有输入连接，工作流必须保持串行结构");
              setIsCreatingConnection(false);
              setConnectionStart(null);
              return;
            }
            
            // 检查源节点是否已有输出连接
            const hasOutputConnection = connections.some(conn => conn.from === connectionStart.nodeId);
            if (hasOutputConnection) {
              // 显示错误提示
              toast.error("源节点已有输出连接，工作流必须保持串行结构");
              setIsCreatingConnection(false);
              setConnectionStart(null);
              return;
            }
            
            const newConnection: Connection = {
              id: `connection-${Date.now()}`,
              from: connectionStart.nodeId,
              to: clickedNode.id,
              fromPort: "output",
              toPort: "input"
            };
            setConnections(prev => [...prev, newConnection]);
          }
          setIsCreatingConnection(false);
          setConnectionStart(null);
        } else {
          // 开始从输入端口创建连接（反向连接）
          // 检查该节点是否已有输入连接
          const hasInputConnection = connections.some(conn => conn.to === clickedNode.id);
          if (hasInputConnection) {
            toast.error("该节点已有输入连接，无法创建新的输入连接");
            return;
          }
          
          setIsCreatingConnection(true);
          setConnectionStart({
            nodeId: clickedNode.id,
            port: "input",
            x: clickedNode.position.x,
            y: clickedNode.position.y + 60
          });
        }
        return;
      }
      
      // 输出端口区域 (右侧)
      if (relativeX >= NODE_DIMENSIONS.width - 20 && relativeY >= 50 && relativeY <= 70) {
        if (isCreatingConnection && connectionStart) {
          // 完成连接 - 检查串行连接规则
          if (connectionStart.nodeId !== clickedNode.id && connectionStart.port === "input") {
            // 检查目标节点是否已有输出连接
            const hasOutputConnection = connections.some(conn => conn.from === clickedNode.id);
            if (hasOutputConnection) {
              // 显示错误提示
              toast.error("该节点已有输出连接，工作流必须保持串行结构");
              setIsCreatingConnection(false);
              setConnectionStart(null);
              return;
            }
            
            // 检查源节点是否已有输入连接
            const hasInputConnection = connections.some(conn => conn.to === connectionStart.nodeId);
            if (hasInputConnection) {
              // 显示错误提示
              toast.error("源节点已有输入连接，工作流必须保持串行结构");
              setIsCreatingConnection(false);
              setConnectionStart(null);
              return;
            }
            
            const newConnection: Connection = {
              id: `connection-${Date.now()}`,
              from: clickedNode.id,
              to: connectionStart.nodeId,
              fromPort: "output",
              toPort: "input"
            };
            setConnections(prev => [...prev, newConnection]);
          }
          setIsCreatingConnection(false);
          setConnectionStart(null);
        } else {
          // 开始从输出端口创建连接
          // 检查该节点是否已有输出连接
          const hasOutputConnection = connections.some(conn => conn.from === clickedNode.id);
          if (hasOutputConnection) {
            toast.error("该节点已有输出连接，无法创建新的输出连接");
            return;
          }
          
          setIsCreatingConnection(true);
          setConnectionStart({
            nodeId: clickedNode.id,
            port: "output",
            x: clickedNode.position.x + NODE_DIMENSIONS.width,
            y: clickedNode.position.y + 60
          });
        }
        return;
      }

      // 点击在节点主体上
      if (!isMoveMode) {
        // 记录鼠标按下的时间和位置，用于区分点击和拖拽
        setMouseDownTime(Date.now());
        setMouseDownPosition({ x: e.clientX, y: e.clientY });
        setHasMoved(false);
        setPotentialClickNodeId(clickedNode.id);
        
        setSelectedNode(clickedNode.id);
        setDraggedNodeId(clickedNode.id);
        setDragOffset({
          x: canvasX - clickedNode.position.x,
          y: canvasY - clickedNode.position.y
        });
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    } else {
      // 点击在空白区域
      if (isCreatingConnection) {
        setIsCreatingConnection(false);
        setConnectionStart(null);
      } else {
        setSelectedNode(null);
        // 只有在非移动模式下才关闭抽屉和结果查看页面
        if (!isMoveMode) {
          setIsConfigDrawerOpen(false);
          setConfigNodeId(null);
          setIsResultDrawerOpen(false);
        }
        
        if (isMoveMode) {
          // 移动模式：拖拽画布
          e.preventDefault();
          setIsDragging(true);
          setDragStart({ x: e.clientX, y: e.clientY });
          setLastPan({ x: panX, y: panY });
        }
      }
    }

    // 检查是否正在从库中拖拽
    if (isDraggingFromLibrary && selectedLibraryItem) {
      // 创建新节点
      const newNode: WorkflowNode = {
        id: generateNodeId(),
        type: selectedLibraryItem.item.action.toLowerCase().replace(/\s+/g, '-'),
        name: selectedLibraryItem.item.name,
        description: selectedLibraryItem.item.description,
        tag: selectedLibraryItem.sectionTag,
        tagColor: getTagColor(selectedLibraryItem.sectionTag),
        status: "waiting",
        position: constrainPosition(canvasX - NODE_DIMENSIONS.width / 2, canvasY - NODE_DIMENSIONS.height / 2),
        collapsed: false,
        ports: {
          input: PORT_POSITIONS.input,
          output: PORT_POSITIONS.output
        },
        action: selectedLibraryItem.item.action,
        config: {
          timeout: 300,
          retryCount: 1,
          autoRun: true,
          parameters: {}
        }
      };

      setNodes(prev => [...prev, newNode]);
      setSelectedNode(newNode.id);
      setIsDraggingFromLibrary(false);
      setSelectedLibraryItem(null);
    }
  }, [nodes, canvasRef, panX, panY, zoom, isMoveMode, isCreatingConnection, connectionStart, 
      isDraggingFromLibrary, selectedLibraryItem, setNodes, setConnections, setSelectedNode, 
      setIsDragging, setDragStart, setLastPan, setIsCreatingConnection, setConnectionStart, 
      setIsDraggingFromLibrary, setSelectedLibraryItem, constrainPosition, getTagColor]);

  // 处理鼠标移动事件
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const canvasX = (e.clientX - rect.left - panX) / (zoom / 100);
    const canvasY = (e.clientY - rect.top - panY) / (zoom / 100);

    setCurrentMousePosition({ x: canvasX, y: canvasY });

    // 检查是否发生了移动（用于区分点击和拖拽）
    if (potentialClickNodeId && !hasMoved) {
      const moveDistance = Math.sqrt(
        Math.pow(e.clientX - mouseDownPosition.x, 2) + 
        Math.pow(e.clientY - mouseDownPosition.y, 2)
      );
      // 如果移动距离超过5像素，则认为是拖拽而不是点击
      if (moveDistance > 5) {
        setHasMoved(true);
      }
    }

    if (isDragging) {
      if (draggedNodeId) {
        // 拖拽节点
        const newX = canvasX - dragOffset.x;
        const newY = canvasY - dragOffset.y;
        const constrainedPos = constrainPosition(newX, newY);

        setNodes(prev => prev.map(node => 
          node.id === draggedNodeId 
            ? { ...node, position: constrainedPos }
            : node
        ));
      } else if (isMoveMode) {
        // 移动画布
        e.preventDefault?.();
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        const newPan = constrainPan(lastPan.x + deltaX, lastPan.y + deltaY);
        setPanX(newPan.x);
        setPanY(newPan.y);
      }
    }

    // 更新拖拽位置用于从库中拖拽
    if (isDraggingFromLibrary) {
      setDragPosition({ x: e.clientX, y: e.clientY });
    }

    // 检查鼠标是否悬停在端口上
    if (!isDragging && !isCreatingConnection) {
      let hoveredPortInfo = null;
      
      for (const node of nodes) {
        const relativeX = canvasX - node.position.x;
        const relativeY = canvasY - node.position.y;
        
        if (canvasX >= node.position.x && canvasX <= node.position.x + NODE_DIMENSIONS.width &&
            canvasY >= node.position.y && canvasY <= node.position.y + NODE_DIMENSIONS.height) {
          
          // 检查输入端口
          if (relativeX <= 20 && relativeY >= 50 && relativeY <= 70) {
            hoveredPortInfo = { nodeId: node.id, port: 'input' as const };
            break;
          }
          
          // 检查输出端口
          if (relativeX >= NODE_DIMENSIONS.width - 20 && relativeY >= 50 && relativeY <= 70) {
            hoveredPortInfo = { nodeId: node.id, port: 'output' as const };
            break;
          }
        }
      }
      
      setHoveredPort(hoveredPortInfo);
    }
  }, [isDragging, draggedNodeId, dragOffset, canvasRef, panX, panY, zoom, isMoveMode, 
      dragStart, lastPan, isDraggingFromLibrary, nodes, isCreatingConnection, setNodes, setPanX, setPanY, 
      setDragPosition, constrainPosition, constrainPan, potentialClickNodeId, hasMoved, mouseDownPosition]);

  // 处理鼠标松开事件
  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    // 如果有潜在的点击节点，并且没有发生移动，则认为是点击
    if (potentialClickNodeId && !hasMoved) {
      const clickDuration = Date.now() - mouseDownTime;
      // 放宽点击时间限制，从200ms增加到500ms，确保配置抽屉能正常打开
      if (clickDuration < 500) {
        setConfigNodeId(potentialClickNodeId);
        setIsConfigDrawerOpen(true);
        onNodeClick(potentialClickNodeId);
      }
    }
    
    // 重置状态
    setIsDragging(false);
    setDraggedNodeId(null);
    setDragOffset({ x: 0, y: 0 });
    setPotentialClickNodeId(null);
    setHasMoved(false);
    setMouseDownTime(0);
    setMouseDownPosition({ x: 0, y: 0 });
  }, [setIsDragging, onNodeClick, potentialClickNodeId, hasMoved, mouseDownTime, 
      setConfigNodeId, setIsConfigDrawerOpen]);

  // 处理触摸板双指移动（仅在移动模式下）
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!isMoveMode) return;
    
    // 检查是否是触摸板双指操作
    if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
      
      // 双指移动画布
      const deltaX = -e.deltaX * 0.5; // 调整移动灵敏度
      const deltaY = -e.deltaY * 0.5;
      
      const newPan = constrainPan(panX + deltaX, panY + deltaY);
      setPanX(newPan.x);
      setPanY(newPan.y);
    }
  }, [isMoveMode, panX, panY, setPanX, setPanY, constrainPan]);

  // 处理右键菜单
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const canvasX = (e.clientX - rect.left - panX) / (zoom / 100);
    const canvasY = (e.clientY - rect.top - panY) / (zoom / 100);

    // 检查是否右键点击在节点上
    const clickedNode = nodes.find(node => {
      const nodeX = node.position.x;
      const nodeY = node.position.y;
      return canvasX >= nodeX && canvasX <= nodeX + NODE_DIMENSIONS.width &&
             canvasY >= nodeY && canvasY <= nodeY + NODE_DIMENSIONS.height;
    });

    if (clickedNode) {
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        nodeId: clickedNode.id
      });
    }
  }, [canvasRef, panX, panY, zoom, nodes, setContextMenu]);

  // 处理从组件库拖放
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const canvasX = (e.clientX - rect.left - panX) / (zoom / 100);
    const canvasY = (e.clientY - rect.top - panY) / (zoom / 100);
    
    setIsDragOver(true);
    setDragOverPosition({ x: canvasX, y: canvasY });
  }, [canvasRef, panX, panY, zoom]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // 只有当拖拽真正离开画布区域时才重置状态
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const isLeavingCanvas = 
      e.clientX < rect.left || 
      e.clientX > rect.right || 
      e.clientY < rect.top || 
      e.clientY > rect.bottom;
    
    if (isLeavingCanvas) {
      setIsDragOver(false);
    }
  }, [canvasRef]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    try {
      const itemData = e.dataTransfer.getData("application/json");
      if (!itemData) return;
      
      const item = JSON.parse(itemData);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const canvasX = (e.clientX - rect.left - panX) / (zoom / 100);
      const canvasY = (e.clientY - rect.top - panY) / (zoom / 100);

      // 创建新节点
      const newNode: WorkflowNode = {
        id: generateNodeId(),
        type: item.action.toLowerCase().replace(/\s+/g, '-'),
        name: item.name,
        description: item.description,
        tag: item.tag || "DEFAULT",
        tagColor: getTagColor(item.tag || "DEFAULT"),
        status: "waiting",
        position: constrainPosition(canvasX - NODE_DIMENSIONS.width / 2, canvasY - NODE_DIMENSIONS.height / 2),
        collapsed: false,
        ports: {
          input: PORT_POSITIONS.input,
          output: PORT_POSITIONS.output
        },
        action: item.action,
        config: {
          timeout: 300,
          retryCount: 1,
          autoRun: true,
          parameters: {}
        }
      };

      setNodes(prev => [...prev, newNode]);
      setSelectedNode(newNode.id);
      toast.success(`已添加组件 "${item.name}" 到工作流`);
    } catch (error) {
      console.error('Failed to parse dropped item:', error);
      toast.error('拖拽失败，请重试');
    }
  }, [canvasRef, panX, panY, zoom, setNodes, setSelectedNode, constrainPosition, getTagColor]);

  // 处理节点点击
  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNode(nodeId);
    onNodeClick(nodeId);
  }, [setSelectedNode, onNodeClick]);

  // 双击节点打开配置
  const handleNodeDoubleClick = useCallback((nodeId: string) => {
    setConfigNodeId(nodeId);
    setIsConfigDrawerOpen(true);
  }, [setConfigNodeId, setIsConfigDrawerOpen]);

  // 简化的连接线路径计算（参考图片样式）
  const calculateConnectionPath = useCallback((fromX: number, fromY: number, toX: number, toY: number) => {
    const dx = toX - fromX;
    const dy = toY - fromY;
    
    // 使用更简洁的贝塞尔曲线
    const controlOffset = Math.min(Math.abs(dx) * 0.5, 100);
    const controlX1 = fromX + controlOffset;
    const controlX2 = toX - controlOffset;
    
    return `M ${fromX} ${fromY} C ${controlX1} ${fromY} ${controlX2} ${toY} ${toX} ${toY}`;
  }, []);

  // 渲染连接线
  const renderConnections = useCallback(() => {
    return connections.map((connection) => {
      const fromNode = nodes.find(n => n.id === connection.from);
      const toNode = nodes.find(n => n.id === connection.to);
      
      if (!fromNode || !toNode) return null;
      
      const startX = fromNode.position.x + NODE_DIMENSIONS.width;
      const startY = fromNode.position.y + NODE_DIMENSIONS.height / 2;
      const endX = toNode.position.x;
      const endY = toNode.position.y + NODE_DIMENSIONS.height / 2;
      
      // 计算控制点以创建平滑的贝塞尔曲线
      const controlPointDistance = Math.min(Math.abs(endX - startX) * 0.5, 100);
      const controlX1 = startX + controlPointDistance;
      const controlX2 = endX - controlPointDistance;
      
      // 根据节点状态确定连接线的颜色和样式
      let strokeColor = '#9CA3AF'; // 默认灰色
      let strokeWidth = 2;
      let strokeDasharray = 'none';
      let markerEnd = 'url(#arrowhead-simple)';
      let animationClass = '';
      
      // 如果任一节点是waiting状态，连接线保持灰色
      if (fromNode.status === 'waiting' || toNode.status === 'waiting') {
        strokeColor = '#9CA3AF'; // 灰色
        strokeWidth = 2;
        markerEnd = 'url(#arrowhead-simple)';
        animationClass = '';
      } else {
        // 只有当两个节点都不是waiting状态时，才使用彩色连接线
        if (fromNode.status === 'completed' && toNode.status === 'running') {
          // 已完成节点到运行中节点：黄色活跃连接
          strokeColor = '#EAB308';
          strokeWidth = 3;
          markerEnd = 'url(#arrowhead-yellow)';
          animationClass = 'animate-pulse';
        } else if (fromNode.status === 'completed' && toNode.status === 'completed') {
          // 两个节点都已完成：绿色连接
          strokeColor = '#22C55E';
          strokeWidth = 2.5;
          markerEnd = 'url(#arrowhead-green)';
        } else if (fromNode.status === 'running') {
          // 运行中的节点：蓝色脉冲连接
          strokeColor = '#3B82F6';
          strokeWidth = 2.5;
          markerEnd = 'url(#arrowhead-blue)';
          animationClass = 'animate-pulse';
        } else if (connection.type === 'traceability') {
          // 追溯关系：红色虚线
          strokeColor = '#EF4444';
          strokeDasharray = '8,4';
          strokeWidth = 2;
          markerEnd = 'url(#arrowhead-red)';
        } else if (connection.type === 'decomposition') {
          // 分解关系：蓝色
          strokeColor = '#3B82F6';
          strokeWidth = 2;
          markerEnd = 'url(#arrowhead-blue)';
        }
      }
      
      return (
        <g key={connection.id} className={animationClass}>
          <path
            d={`M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            fill="none"
            markerEnd={markerEnd}
            className="transition-all duration-300 ease-in-out drop-shadow-sm"
          />
          
          {/* 状态指示器 - 只在非waiting状态的连接上显示 */}
          {fromNode.status !== 'waiting' && toNode.status !== 'waiting' && 
           fromNode.status === 'completed' && toNode.status === 'waiting' && (
            <circle
              cx={(startX + endX) / 2}
              cy={(startY + endY) / 2}
              r="4"
              fill="#F97316"
              className="animate-ping opacity-75"
            />
          )}
        </g>
      );
    });
  }, [connections, nodes]);

  // 渲染正在创建的连接线
  const renderCreatingConnection = useCallback(() => {
    if (!isCreatingConnection || !connectionStart) return null;

    const endX = currentMousePosition.x;
    const endY = currentMousePosition.y;
    const startX = connectionStart.x;
    const startY = connectionStart.y;

    const path = connectionStart.port === "output" 
      ? calculateConnectionPath(startX, startY, endX, endY)
      : calculateConnectionPath(endX, endY, startX, startY);

    return (
      <g>
        <path
          d={path}
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,5"
          className="pointer-events-none"
          markerEnd="url(#arrowhead-creating)"
        />
        
        {/* 创建连接时的终点指示器 */}
        <circle
          cx={endX}
          cy={endY}
          r="3"
          fill="#3b82f6"
          className="opacity-60"
        />
      </g>
    );
  }, [isCreatingConnection, connectionStart, currentMousePosition, calculateConnectionPath]);

  return (
    <div className="flex-1 relative overflow-hidden">
      <div
        ref={canvasRef}
        className={`canvas-container h-full w-full relative select-none ${
          isMoveMode ? "bg-blue-50" : "bg-gray-100"
        } ${isDragOver ? "bg-green-50 border-2 border-dashed border-green-500" : ""}`}
        style={{
          cursor: isDragging ? "grabbing" : isMoveMode ? "move" : "grab",
          marginBottom: isResultDrawerOpen ? "384px" : "0px",
          transition: "margin 300ms ease-in-out, background-color 200ms ease-in-out",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={handleContextMenu}
        onDragStart={(e) => e.preventDefault()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* 画布变换容器 */}
        <div
          style={{
            transform: `translate(${panX}px, ${panY}px) scale(${zoom / 100})`,
            transformOrigin: "0 0",
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        >
          {/* 简洁网格背景 */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern
                  id="grid"
                  width="24"
                  height="24"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 24 0 L 0 0 0 24"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* SVG for connections */}
          <svg className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
            <defs>
              {/* 简洁的箭头标记 */}
              <marker
                id="arrowhead-simple"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path
                  d="M 0 0 L 8 3 L 0 6 L 2 3 Z"
                  fill="#9CA3AF"
                  stroke="none"
                />
              </marker>
              
              {/* 绿色箭头标记（完成状态连接） */}
              <marker
                id="arrowhead-green"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path
                  d="M 0 0 L 8 3 L 0 6 L 2 3 Z"
                  fill="#22c55e"
                  stroke="none"
                />
              </marker>
              
              {/* 黄色箭头标记（完成到运行中连接） */}
              <marker
                id="arrowhead-yellow"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path
                  d="M 0 0 L 8 3 L 0 6 L 2 3 Z"
                  fill="#eab308"
                  stroke="none"
                />
              </marker>
              
              {/* 橙色箭头标记（可执行状态） */}
              <marker
                id="arrowhead-orange"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path
                  d="M 0 0 L 8 3 L 0 6 L 2 3 Z"
                  fill="#f97316"
                  stroke="none"
                />
              </marker>
              
              {/* 蓝色箭头标记（运行中状态） */}
              <marker
                id="arrowhead-blue"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path
                  d="M 0 0 L 8 3 L 0 6 L 2 3 Z"
                  fill="#3b82f6"
                  stroke="none"
                />
              </marker>
              
              {/* 红色箭头标记（追溯关系） */}
              <marker
                id="arrowhead-red"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path
                  d="M 0 0 L 8 3 L 0 6 L 2 3 Z"
                  fill="#ef4444"
                  stroke="none"
                />
              </marker>
              
              {/* 创建连接时的箭头 */}
              <marker
                id="arrowhead-creating"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path
                  d="M 0 0 L 8 3 L 0 6 L 2 3 Z"
                  fill="#3b82f6"
                  stroke="none"
                />
              </marker>
            </defs>
            {renderConnections()}
            {renderCreatingConnection()}
          </svg>

          {/* 渲染节点 */}
          {nodes.map(node => {
            // 检查该节点的连接状态
            const hasInputConnection = connections.some(conn => conn.to === node.id);
            const hasOutputConnection = connections.some(conn => conn.from === node.id);
            
            return (
              <div
                key={node.id}
                style={{
                  position: 'absolute',
                  left: node.position.x,
                  top: node.position.y,
                  zIndex: selectedNode === node.id ? 10 : 1,
                }}
              >
                {/* 节点组件 */}
                <div className="relative">
                  <WorkflowNodeComponent
                    node={node}
                    isSelected={selectedNode === node.id}
                    onClick={handleNodeClick}
                  />
                  
                  {/* 输入端口 - 带状态指示 */}
                  <div
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all duration-200 cursor-pointer ${
                      hasInputConnection 
                        ? 'bg-green-500' // 已连接：绿色
                        : hoveredPort?.nodeId === node.id && hoveredPort?.port === 'input'
                        ? 'bg-blue-500 scale-125' // 悬停：蓝色放大
                        : isCreatingConnection && connectionStart?.port === 'output'
                        ? 'bg-green-400 scale-110' // 可连接：绿色高亮
                        : 'bg-gray-300 hover:bg-gray-400' // 默认：灰色
                    }`}
                    style={{ left: -6 }}
                    title={
                      hasInputConnection 
                        ? "已连接的输入端口" 
                        : isCreatingConnection && connectionStart?.port === 'output'
                        ? "点击完成连接"
                        : "输入端口 - 拖拽创建连接"
                    }
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      if (hasInputConnection) {
                        toast.error("该节点已有输入连接，无法创建新的输入连接");
                        return;
                      }
                      
                      if (isCreatingConnection && connectionStart) {
                        // 完成连接
                        if (connectionStart.nodeId !== node.id && connectionStart.port === "output") {
                          // 检查源节点是否已有输出连接
                          const hasOutputConnection = connections.some(conn => conn.from === connectionStart.nodeId);
                          if (hasOutputConnection) {
                            toast.error("源节点已有输出连接，工作流必须保持串行结构");
                            setIsCreatingConnection(false);
                            setConnectionStart(null);
                            return;
                          }
                          
                          const newConnection: Connection = {
                            id: `connection-${Date.now()}`,
                            from: connectionStart.nodeId,
                            to: node.id,
                            fromPort: "output",
                            toPort: "input"
                          };
                          setConnections(prev => [...prev, newConnection]);
                          toast.success("连接创建成功");
                        }
                        setIsCreatingConnection(false);
                        setConnectionStart(null);
                      } else {
                        // 开始从输入端口创建连接（反向连接）
                        setIsCreatingConnection(true);
                        setConnectionStart({
                          nodeId: node.id,
                          port: "input",
                          x: node.position.x,
                          y: node.position.y + NODE_DIMENSIONS.height / 2
                        });
                      }
                    }}
                  />
                  
                  {/* 输出端口 - 带状态指示 */}
                  <div
                    className={`absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm transition-all duration-200 cursor-pointer ${
                      hasOutputConnection 
                        ? 'bg-green-500' // 已连接：绿色
                        : hoveredPort?.nodeId === node.id && hoveredPort?.port === 'output'
                        ? 'bg-blue-500 scale-125' // 悬停：蓝色放大
                        : isCreatingConnection && connectionStart?.port === 'input'
                        ? 'bg-green-400 scale-110' // 可连接：绿色高亮
                        : 'bg-gray-300 hover:bg-gray-400' // 默认：灰色
                    }`}
                    style={{ right: -6 }}
                    title={
                      hasOutputConnection 
                        ? "已连接的输出端口" 
                        : isCreatingConnection && connectionStart?.port === 'input'
                        ? "点击完成连接"
                        : "输出端口 - 拖拽创建连接"
                    }
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      if (hasOutputConnection) {
                        toast.error("该节点已有输出连接，无法创建新的输出连接");
                        return;
                      }
                      
                      if (isCreatingConnection && connectionStart) {
                        // 完成连接
                        if (connectionStart.nodeId !== node.id && connectionStart.port === "input") {
                          // 检查源节点是否已有输入连接
                          const hasInputConnection = connections.some(conn => conn.to === connectionStart.nodeId);
                          if (hasInputConnection) {
                            toast.error("源节点已有输入连接，工作流必须保持串行结构");
                            setIsCreatingConnection(false);
                            setConnectionStart(null);
                            return;
                          }
                          
                          const newConnection: Connection = {
                            id: `connection-${Date.now()}`,
                            from: node.id,
                            to: connectionStart.nodeId,
                            fromPort: "output",
                            toPort: "input"
                          };
                          setConnections(prev => [...prev, newConnection]);
                          toast.success("连接创建成功");
                        }
                        setIsCreatingConnection(false);
                        setConnectionStart(null);
                      } else {
                        // 开始从输出端口创建连接
                        setIsCreatingConnection(true);
                        setConnectionStart({
                          nodeId: node.id,
                          port: "output",
                          x: node.position.x + NODE_DIMENSIONS.width,
                          y: node.position.y + NODE_DIMENSIONS.height / 2
                        });
                      }
                    }}
                  />
                  
                  {/* 连接状态指示器 */}
                  {hasInputConnection && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-2">
                      <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                    </div>
                  )}
                  
                  {hasOutputConnection && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-2">
                      <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                    </div>
                  )}
                  
                  {/* 双击区域 */}
                  <div
                    className="absolute inset-0 cursor-pointer"
                    onDoubleClick={() => handleNodeDoubleClick(node.id)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      // 判断是否为可以在工具中打开的节点类型
                      const canOpenInTool = node.type === 'function-system-design' || 
                                           node.name === '功能&系统设计' ||
                                           node.category === 'system-design' ||
                                           node.id.includes('function-system') ||
                                           node.action?.includes('功能&系统设计') ||
                                           node.type === 'battery-thermal-design' ||
                                           node.type === 'vehicle-safety-arch' ||
                                           node.type === 'ssp-modelica' ||
                                           node.name?.includes('架构同步') ||
                                           node.action?.includes('SSP') ||
                                           node.action?.includes('Modelica') ||
                                           node.type === 'simulation' ||
                                           node.action?.includes('仿真') ||
                                           node.type === 'requirement-management' ||
                                           node.action?.includes('需求') ||
                                           node.name?.includes('需求') ||
                                           node.action?.includes('Requirement') ||
                                           node.action?.includes('POLARION') ||
                                           node.id?.includes('requirement') ||
                                           node.category === 'requirement';

                      setContextMenu({
                        x: e.clientX,
                        y: e.clientY,
                        nodeId: node.id,
                        canOpenInTool
                      });
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 移动模式指示器 */}
        {isMoveMode && !isDragging && !isDraggingFromLibrary && (
          <div className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 pointer-events-none z-10 shadow-lg">
            <Move className="h-4 w-4" />
            移动模式：点击拖拽或双指移动画布，按ESC键退出
          </div>
        )}

        {/* 连接创建提示 */}
        {isCreatingConnection && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg text-sm pointer-events-none z-10 shadow-lg animate-pulse">
            点击目标节点的 {connectionStart?.port === 'output' ? '输入' : '输出'} 端口完成连接
          </div>
        )}

        {/* 端口悬停提示 */}
        {hoveredPort && !isCreatingConnection && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded text-sm pointer-events-none z-10">
            {hoveredPort.port === 'input' ? '输入端口' : '输出端口'} - 点击创建连接
          </div>
        )}

        {/* 拖拽预览（从组件库拖拽时） */}
        {isDraggingFromLibrary && selectedLibraryItem && (
          <div
            className="fixed pointer-events-none z-50 bg-white border-2 border-blue-500 rounded-lg shadow-xl p-4 opacity-90"
            style={{
              left: dragPosition.x + 10,
              top: dragPosition.y + 10,
              width: NODE_DIMENSIONS.width,
              minHeight: NODE_DIMENSIONS.height,
              transform: 'rotate(-3deg)',
            }}
          >
            <h3 className="font-medium text-sm">{selectedLibraryItem.item.name}</h3>
            <p className="text-xs text-gray-600 mt-1">{selectedLibraryItem.item.description}</p>
            <div className="text-xs text-blue-600 mt-2">{selectedLibraryItem.item.action}</div>
          </div>
        )}

        {/* 拖拽提示 */}
        {isDragOver && (
          <>
            <div className="absolute inset-0 bg-green-100/30 pointer-events-none z-20" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-medium pointer-events-none z-30 shadow-xl">
              🎯 拖拽释放到此处添加组件
            </div>
            {/* 拖拽位置指示器 */}
            <div 
              className="absolute pointer-events-none z-30"
              style={{
                left: `${panX + dragOverPosition.x * (zoom / 100) - NODE_DIMENSIONS.width / 2}px`,
                top: `${panY + dragOverPosition.y * (zoom / 100) - NODE_DIMENSIONS.height / 2}px`,
                width: NODE_DIMENSIONS.width,
                height: NODE_DIMENSIONS.height,
                border: '3px dashed #22c55e',
                borderRadius: '8px',
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}