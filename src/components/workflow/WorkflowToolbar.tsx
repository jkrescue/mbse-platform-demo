import React, { useState, useEffect } from "react";
import { Play, Square, Move, ZoomOut, ZoomIn, Maximize2, RotateCcw, List, X, CheckCircle, Clock, AlertTriangle } from "lucide-react@0.487.0";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { AlertCircle } from "lucide-react@0.487.0";
import { toast } from "sonner@2.0.3";

interface WorkflowToolbarProps {
  toolbarRef: React.RefObject<HTMLDivElement>;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  isMoveMode: boolean;
  setIsMoveMode: React.Dispatch<React.SetStateAction<boolean>>;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setPanX: React.Dispatch<React.SetStateAction<number>>;
  setPanY: React.Dispatch<React.SetStateAction<number>>;
  nodes: any[];
  connections: any[];
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
  constrainPan: (panX: number, panY: number) => { x: number; y: number };
}

export function WorkflowToolbar({
  toolbarRef,
  isRunning,
  setIsRunning,
  isMoveMode,
  setIsMoveMode,
  zoom,
  setZoom,
  setPanX,
  setPanY,
  nodes,
  connections,
  setNodes,
  constrainPan,
}: WorkflowToolbarProps) {
  // 运行详情弹窗状态
  const [showRunDetails, setShowRunDetails] = useState(false);
  const [showConfigWarning, setShowConfigWarning] = useState(false);
  const [configWarnings, setConfigWarnings] = useState<any[]>([]);
  const [executionHistory, setExecutionHistory] = useState<any[]>([]);
  
  // 运行状态提示框状态
  const [showRunStatusCard, setShowRunStatusCard] = useState(false);
  const [runStatusData, setRunStatusData] = useState<any>(null);
  // 检查节点模型配置完整性
  const checkNodeModelConfiguration = (node: any) => {
    const issues = [];
    
    switch (node.type) {
      case 'ssp-modelica':
      case 'energy-simulation':
        if (!node.config?.modelConfig?.selectedModel) {
          issues.push('未选择仿真模型');
        }
        if (!node.config?.modelConfig?.simulationParameters?.simulationTime) {
          issues.push('未配置仿真时间');
        }
        break;
      case 'battery-model-sim':
        if (!node.config?.modelConfig?.batteryModel?.selectedModel) {
          issues.push('未选择电池模型');
        }
        if (!node.config?.modelConfig?.simulationConfig?.analysisType) {
          issues.push('未配置分析类型');
        }
        break;
      case 'energy-ssp-conversion':
      case 'ssp-arch-conversion':
        if (!node.config?.conversionConfig?.targetFormat) {
          issues.push('未配置转换格式');
        }
        break;
      case 'm-works-sim':
        if (!node.config?.simulationConfig?.modelPath) {
          issues.push('未设置模型路径');
        }
        break;
      case 'energy-doe-analysis':
      case 'doe-experiment':
        if (!node.config?.doeConfig?.designType) {
          issues.push('未选择实验设计类型');
        }
        break;
    }
    
    return issues;
  };

  // 检查所有节点是否配置了自动执行
  const checkAllNodesAutoRun = () => {
    return nodes.every(node => node.config?.autoRun === true);
  };

  // 获取未配置自动执行的节点列表
  const getNodesWithoutAutoRun = () => {
    return nodes.filter(node => node.config?.autoRun !== true);
  };

  // 一键启用所有节点的自动运行
  const handleEnableAllAutoRun = () => {
    const nodesWithoutAutoRun = getNodesWithoutAutoRun();
    
    if (nodesWithoutAutoRun.length === 0) {
      toast.info("所有节点已启用自动运行");
      return;
    }

    // 更新所有未启用自动运行的节点
    setNodes(prevNodes => 
      prevNodes.map(node => 
        nodesWithoutAutoRun.some(n => n.id === node.id)
          ? { 
              ...node, 
              config: { 
                ...node.config, 
                autoRun: true 
              } 
            }
          : node
      )
    );

    // 显示成功提示
    const nodeNames = nodesWithoutAutoRun.map(node => node.name).join('、');
    toast.success(`已启用 ${nodesWithoutAutoRun.length} 个节点的自动运行`, {
      description: `已更新节点：${nodeNames}`,
      duration: 4000
    });

    // 关闭警告弹窗
    setShowConfigWarning(false);
  };

  // 全面检查工作流准备情况
  const checkWorkflowReadiness = () => {
    const warnings = [];
    
    // 检查自动运行配置
    const nodesWithoutAutoRun = getNodesWithoutAutoRun();
    if (nodesWithoutAutoRun.length > 0) {
      warnings.push({
        type: 'autoRun',
        title: '自动运行未配置',
        nodes: nodesWithoutAutoRun,
        message: '以下节点未配置自动执行，需要在节点配置中启用自动运行选项。'
      });
    }
    
    // 检查模型配置完整性
    const nodesWithConfigIssues = [];
    nodes.forEach(node => {
      const issues = checkNodeModelConfiguration(node);
      if (issues.length > 0) {
        nodesWithConfigIssues.push({
          node,
          issues
        });
      }
    });
    
    if (nodesWithConfigIssues.length > 0) {
      warnings.push({
        type: 'modelConfig',
        title: '模型配置不完整',
        nodes: nodesWithConfigIssues,
        message: '以下节点的模型配置不完整，需要完善配置后才能执行。'
      });
    }
    
    return warnings;
  };

  // 找到起始节点（没有输入连接的节点）
  const findStartNodes = () => {
    const nodesWithInput = connections.map(conn => conn.to);
    return nodes.filter(node => !nodesWithInput.includes(node.id));
  };

  // 构建节点依赖关系图
  const buildDependencyGraph = () => {
    const graph: Record<string, string[]> = {};
    
    // 初始化所有节点
    nodes.forEach(node => {
      graph[node.id] = [];
    });
    
    // 添加依赖关系（from节点执行完后才能执行to节点）
    connections.forEach(conn => {
      if (!graph[conn.from]) graph[conn.from] = [];
      graph[conn.from].push(conn.to);
    });
    
    return graph;
  };

  // 拓扑排序获取执行顺序
  const getExecutionOrder = () => {
    const graph = buildDependencyGraph();
    const inDegree: Record<string, number> = {};
    const executionQueue: string[] = [];
    const result: string[] = [];
    
    // 计算每个节点的入度
    nodes.forEach(node => {
      inDegree[node.id] = 0;
    });
    
    connections.forEach(conn => {
      inDegree[conn.to] = (inDegree[conn.to] || 0) + 1;
    });
    
    // 找到所有入度为0的节点作为起始节点
    nodes.forEach(node => {
      if (inDegree[node.id] === 0) {
        executionQueue.push(node.id);
      }
    });
    
    // 拓扑排序
    while (executionQueue.length > 0) {
      const currentNodeId = executionQueue.shift()!;
      result.push(currentNodeId);
      
      // 处理当前节点的所有后续节点
      graph[currentNodeId]?.forEach(nextNodeId => {
        inDegree[nextNodeId]--;
        if (inDegree[nextNodeId] === 0) {
          executionQueue.push(nextNodeId);
        }
      });
    }
    
    return result;
  };

  // 执行单个节点 - 修改为严格按依赖顺序执行
  const executeNode = (nodeId: string, order: number) => {
    const node = nodes.find(n => n.id === nodeId);
    
    // 检查前置节点是否都已完成
    const checkPrerequisites = () => {
      const prerequisiteConnections = connections.filter(conn => conn.to === nodeId);
      if (prerequisiteConnections.length === 0) return true; // 起始节点，无前置条件
      
      return prerequisiteConnections.every(conn => {
        const prerequisiteNode = nodes.find(n => n.id === conn.from);
        return prerequisiteNode && prerequisiteNode.status === 'completed';
      });
    };

    // 等待前置条件满足的检查函数
    const waitForPrerequisites = () => {
      return new Promise<void>((resolve) => {
        const checkInterval = setInterval(() => {
          setNodes(currentNodes => {
            const prerequisiteConnections = connections.filter(conn => conn.to === nodeId);
            const allPrerequisitesMet = prerequisiteConnections.length === 0 || 
              prerequisiteConnections.every(conn => {
                const prerequisiteNode = currentNodes.find(n => n.id === conn.from);
                return prerequisiteNode && prerequisiteNode.status === 'completed';
              });

            if (allPrerequisitesMet) {
              clearInterval(checkInterval);
              resolve();
            }
            return currentNodes;
          });
        }, 100); // 每100ms检查一次
      });
    };

    // 异步执行节点
    setTimeout(async () => {
      // 等待前置条件满足
      await waitForPrerequisites();
      
      // 设置节点为运行状态
      setNodes(prevNodes => 
        prevNodes.map(n => 
          n.id === nodeId 
            ? { ...n, status: "running" }
            : n
        )
      );

      // 模拟节点执行时间（2-4秒）
      const executionTime = Math.random() * 2000 + 2000;
      
      setTimeout(() => {
        setNodes(prevNodes => {
          const updatedNodes = prevNodes.map(n => 
            n.id === nodeId 
              ? { ...n, status: "completed" }
              : n
          );
          
          // 更新运行状态提示框的完成节点数
          const completedCount = updatedNodes.filter(n => n.status === 'completed').length;
          setRunStatusData(prev => ({
            ...prev,
            completedNodes: completedCount
          }));
          
          return updatedNodes;
        });
      }, executionTime);
    }, order * 100); // 给每个节点一个小的启动延迟，让依赖检查逻辑有时间工作
  };

  const handleStart = () => {
    if (nodes.length === 0) {
      return;
    }

    // 检查是否存在禁用自动运行的节点
    const nodesWithoutAutoRun = getNodesWithoutAutoRun();
    if (nodesWithoutAutoRun.length > 0) {
      // 显示配置警告弹窗
      setConfigWarnings([{
        type: 'autoRun',
        title: '自动运行未启用',
        nodes: nodesWithoutAutoRun,
        message: '工作流执行要求所有节点都启用自动运行。请逐一配置这些节点并启用自动运行选项。'
      }]);
      setShowConfigWarning(true);
      return;
    }

    // 全面检查工作流准备情况（模型配置等其他检查）
    const warnings = checkWorkflowReadiness();
    
    if (warnings.length > 0) {
      setConfigWarnings(warnings);
      setShowConfigWarning(true);
      return; // 显示配置警告弹窗，不启动运行
    }

    startWorkflowExecution();

    setIsRunning(true);
    
    // 显示运行状态提示框
    setShowRunStatusCard(true);
    setRunStatusData({
      status: 'running',
      startTime: new Date().toLocaleString('zh-CN'),
      totalNodes: nodes.length,
      completedNodes: 0
    });

    // 重置所有节点状态为等待
    setNodes(prevNodes => 
      prevNodes.map(node => ({ ...node, status: "waiting" }))
    );

    // 获取执行顺序
    const executionOrder = getExecutionOrder();
    console.log("执行顺序:", executionOrder);

    if (executionOrder.length === 0) {
      setIsRunning(false);
      return;
    }

    // 创建执行记录
    const executionRecord = {
      id: Date.now(),
      startTime: new Date().toLocaleString('zh-CN'),
      executionOrder,
      totalNodes: executionOrder.length,
      status: 'running',
      nodeProgress: {},
      warnings: []
    };

    // 保存执行计划到状态数据中
    const executionNodeNames = executionOrder.map(nodeId => {
      const node = nodes.find(n => n.id === nodeId);
      return node ? node.name : nodeId;
    }).join(" → ");
    
    // 更新运行状态数据，包含执行计划
    setRunStatusData(prev => ({
      ...prev,
      executionPlan: executionNodeNames
    }));

    // 按拓扑排序顺序启动节点执行
    executionOrder.forEach((nodeId, index) => {
      executeNode(nodeId, index);
    });

    // 监控执行完成状态
    const checkExecutionComplete = () => {
      const interval = setInterval(() => {
        setNodes(currentNodes => {
          const completedCount = currentNodes.filter(n => n.status === 'completed').length;
          
          // 如果所有节点都完成了，停止工作流
          if (completedCount === executionOrder.length) {
            clearInterval(interval);
            setIsRunning(false);
            executionRecord.status = 'completed';
            executionRecord.endTime = new Date().toLocaleString('zh-CN');
            setExecutionHistory(prev => [executionRecord, ...prev]);
            
            // 更新运行状态提示框
            setRunStatusData(prev => ({
              ...prev,
              status: 'completed',
              endTime: new Date().toLocaleString('zh-CN'),
              completedNodes: executionOrder.length
            }));
            
            // 简化完成提示，详细信息已在右下角状态卡中显示
            toast.success("工作流执行完成", {
              description: `共执行了${executionOrder.length}个节点`,
              duration: 3000
            });
          }
          
          return currentNodes;
        });
      }, 500); // 每500ms检查一次
    };
    
    checkExecutionComplete();
  };

  // 独立的工作流执行函数
  const startWorkflowExecution = () => {
  };

  const handleStop = () => {
    setIsRunning(false);
    // 停止时将所有运行中的节点设置为等待状态
    const runningNodes = nodes.filter(node => node.status === "running");
    const completedNodes = nodes.filter(node => node.status === "completed");
    
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.status === "running" 
          ? { ...node, status: "waiting" }
          : node
      )
    );
    
    // 更新运行状态提示框
    setRunStatusData(prev => ({
      ...prev,
      status: 'stopped',
      endTime: new Date().toLocaleString('zh-CN'),
      completedNodes: completedNodes.length
    }));
    
    if (runningNodes.length > 0) {
      const runningNodeNames = runningNodes.map(node => `"${node.name}"`).join("、");
      toast.warning("工作流仿真已停止", {
        description: `已停止正在运行的节点：${runningNodeNames}`,
        duration: 4000
      });
    } else {
      toast.warning("工作流仿真已停止");
    }
  };

  const toggleMoveMode = () => {
    setIsMoveMode((prev) => !prev);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 25));
  };

  const handleZoomReset = () => {
    setZoom(100);
    setPanX(0);
    setPanY(0);
  };

  const handleFitToCenter = () => {
    if (nodes.length === 0) return;

    // 计算所有节点的边界
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    nodes.forEach((node) => {
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + 360);
      maxY = Math.max(maxY, node.position.y + 120);
    });

    // 计算中心点
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // 重置到中心
    setPanX(-centerX + 400);
    setPanY(-centerY + 300);
    setZoom(100);
  };

  return (
    <div
      ref={toolbarRef}
      className="bg-white border-b border-gray-200 p-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <Button
          variant={isRunning ? "destructive" : "default"}
          size="sm"
          onClick={isRunning ? handleStop : handleStart}
          className="flex items-center gap-2"
        >
          {isRunning ? (
            <Square className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isRunning ? "停止" : "运行"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowRunDetails(true)}
          className="flex items-center gap-2"
        >
          <List className="h-4 w-4" />
          运行详情
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant={isMoveMode ? "default" : "outline"}
          size="sm"
          onClick={toggleMoveMode}
          className="flex items-center gap-2"
          title={isMoveMode ? "退出移动模式" : "进入移动模式"}
        >
          <Move className="h-4 w-4" />
          {isMoveMode ? "移动" : ""}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomOut}
          className="flex items-center gap-2"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-sm text-gray-600">{zoom}%</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomIn}
          className="flex items-center gap-2"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleFitToCenter}
          className="flex items-center gap-2"
        >
          <Maximize2 className="h-4 w-4" />
          居中
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleZoomReset}
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          重置
        </Button>
      </div>

      {/* 配置警告弹窗 */}
      <Dialog open={showConfigWarning} onOpenChange={setShowConfigWarning}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              工作流配置检查
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              在运行工作流之前，需要解决以下配置问题：
            </p>
            
            {configWarnings.map((warning, index) => (
              <div key={index} className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                <h4 className="font-medium text-orange-900 mb-2">{warning.title}</h4>
                <p className="text-sm text-orange-800 mb-3">{warning.message}</p>
                
                {warning.type === 'autoRun' && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      {warning.nodes.map((node: any) => (
                        <div key={node.id} className="flex items-center justify-between bg-white p-2 rounded border">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${node.tagColor || 'bg-gray-400'}`} />
                            <span className="font-medium">{node.name}</span>
                            <span className="text-xs text-gray-500">({node.type})</span>
                          </div>
                          <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
                            需要启用自动运行
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {/* 一键启用自动运行按钮 */}
                    <div className="flex justify-center pt-2 border-t border-orange-200">
                      <Button
                        onClick={handleEnableAllAutoRun}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        一键全部启用自动运行
                      </Button>
                    </div>
                  </div>
                )}
                
                {warning.type === 'modelConfig' && (
                  <div className="space-y-2">
                    {warning.nodes.map((item: any, nodeIndex: number) => (
                      <div key={nodeIndex} className="bg-white p-3 rounded border">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-2 h-2 rounded-full ${item.node.tagColor || 'bg-gray-400'}`} />
                          <span className="font-medium">{item.node.name}</span>
                        </div>
                        <div className="space-y-1">
                          {item.issues.map((issue: string, issueIndex: number) => (
                            <div key={issueIndex} className="flex items-center gap-2 text-sm text-red-600">
                              <span className="w-1 h-1 bg-red-500 rounded-full" />
                              {issue}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">解决步骤：</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>点击需要配置的节点</li>
                <li>在右侧配置面板中完善相关设置</li>
                <li>确保保存所有配置更改</li>
                <li>重新点击运行按钮</li>
              </ol>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConfigWarning(false)}
              >
                我知道了
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 运行详情弹窗 */}
      <Dialog open={showRunDetails} onOpenChange={setShowRunDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <List className="h-5 w-5" />
              工作流运行详情
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* 当前运行状态 */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">当前状态</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{nodes.length}</div>
                  <div className="text-sm text-gray-600">总节点数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {nodes.filter(n => n.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">已完成</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {nodes.filter(n => n.status === 'running').length}
                  </div>
                  <div className="text-sm text-gray-600">运行中</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {nodes.filter(n => n.status === 'waiting').length}
                  </div>
                  <div className="text-sm text-gray-600">等待中</div>
                </div>
              </div>
            </div>

            {/* 节点执行状态 */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">节点执行状态</h3>
              <div className="space-y-2">
                {nodes.map((node) => (
                  <div key={node.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        node.status === 'completed' ? 'bg-green-500' :
                        node.status === 'running' ? 'bg-yellow-500 animate-pulse' :
                        node.status === 'skipped' ? 'bg-orange-500' :
                        'bg-gray-300'
                      }`} />
                      <span className="font-medium">{node.name}</span>
                      <span className={`px-2 py-1 text-xs rounded ${node.tagColor} text-white`}>
                        {node.tag}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {node.status === 'completed' ? '已完成' :
                         node.status === 'running' ? '运行中' :
                         node.status === 'skipped' ? '已跳过' :
                         '等待中'}
                      </span>
                      {node.config?.autoRun !== true && (
                        <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
                          自动运行未启用
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 执行历史 */}
            {executionHistory.length > 0 && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">执行历史</h3>
                <div className="space-y-3">
                  {executionHistory.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-3 bg-gray-50 rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">执行记录 #{record.id}</span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          record.status === 'completed' ? 'bg-green-100 text-green-700' :
                          record.status === 'running' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {record.status === 'completed' ? '已完成' :
                           record.status === 'running' ? '运行中' : '未知'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>开始时间: {record.startTime}</div>
                        {record.endTime && <div>结束时间: {record.endTime}</div>}
                        <div>执行节点: {record.totalNodes} 个</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 右下角运行状态提示框 */}
      {showRunStatusCard && runStatusData && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {runStatusData.status === 'running' && (
                  <Clock className="h-5 w-5 text-blue-500 animate-pulse" />
                )}
                {runStatusData.status === 'completed' && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {runStatusData.status === 'stopped' && (
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                )}
                <h4 className="font-medium text-gray-900">
                  {runStatusData.status === 'running' && '工作流运行中'}
                  {runStatusData.status === 'completed' && '工作流已完成'}
                  {runStatusData.status === 'stopped' && '工作流已停止'}
                </h4>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRunStatusCard(false)}
                className="p-1 h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>开始时间:</span>
                <span>{runStatusData.startTime}</span>
              </div>
              {runStatusData.endTime && (
                <div className="flex justify-between">
                  <span>结束时间:</span>
                  <span>{runStatusData.endTime}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>进度:</span>
                <span>
                  {runStatusData.completedNodes}/{runStatusData.totalNodes} 个节点
                </span>
              </div>
              
              {/* 进度条 */}
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    runStatusData.status === 'completed' ? 'bg-green-500' :
                    runStatusData.status === 'stopped' ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`}
                  style={{
                    width: `${(runStatusData.completedNodes / runStatusData.totalNodes) * 100}%`
                  }}
                />
              </div>
              
              <div className="text-center text-xs text-gray-500 mt-2">
                {runStatusData.status === 'running' && '正在按依赖关系顺序执行节点...'}
                {runStatusData.status === 'completed' && '所有节点执行完成！'}
                {runStatusData.status === 'stopped' && '工作流执行已手动停止'}
              </div>
              
              {/* 显示执行计划 */}
              {runStatusData.executionPlan && runStatusData.status === 'running' && (
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">执行计划：</div>
                  <div className="text-xs text-blue-600 break-all">
                    {runStatusData.executionPlan}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}