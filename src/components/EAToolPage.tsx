import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TreeView, TreeItem } from './ui/treeview';
import {
  ArrowLeft,
  Settings,
  FileText,
  GitBranch,
  Box,
  Target,
  Network,
  Database,
  Code,
  Play,
  Save,
  FolderOpen,
  RefreshCw,
  Eye,
  Edit,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  Maximize2,
  Minimize2,
  Upload,
  Archive
} from 'lucide-react@0.487.0';
import ToolModelIntegrationService from '../services/ToolModelIntegrationService';
import { toast } from 'sonner@2.0.3';

interface EAToolPageProps {
  nodeData?: any;
  onBack: () => void;
}

export function EAToolPage({ nodeData, onBack }: EAToolPageProps) {
  const [activeTab, setActiveTab] = useState('project');
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set(['vehicle-system', 'functional-arch', 'logical-arch']));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 获取集成服务实例
  const integrationService = ToolModelIntegrationService.getInstance();

  // 保存模型到个人模型库
  const handleSaveToPersonalLibrary = async () => {
    setIsSaving(true);
    
    try {
      const modelData = await integrationService.saveModelFromTool({
        toolType: 'EA',
        nodeData: nodeData,
        modelContent: {
          name: selectedItem ? 
            `EA_${projectStructure.find(p => p.id === selectedItem)?.name || selectedItem}` :
            `EA_${nodeData?.name || '系统架构模型'}`,
          description: `基于Enterprise Architect创建的系统架构模型，包含功能层、逻辑层和物理层的完整设计。${selectedItem ? `当前选中组件: ${selectedItem}` : ''}`,
          version: '1.0',
          project: '新能源汽车系统设计',
          tags: ['ea', 'architecture', 'sysml', selectedItem || 'system'],
          file: `EA_Model_${Date.now()}.xmi`,
          parameters: {
            selectedComponent: selectedItem,
            projectStructure: projectStructure,
            requirements: requirements,
            diagrams: diagrams
          },
          configurations: {
            toolVersion: 'v14.0.1430',
            modelingLanguage: 'SysML',
            exportFormat: 'XMI'
          }
        },
        userInfo: {
          name: '当前用户', // 这里应该从用户上下文获取
          role: 'architect'
        },
        additionalMetadata: {
          nodeId: nodeData?.id,
          workflowSource: true,
          rflpLayers: ['Functions', 'Logical', 'Physical']
        }
      });
      
      toast.success(`模型 "${modelData.name}" 已成功保存到个人模型库！`);
    } catch (error) {
      console.error('保存模型失败:', error);
      toast.error('保存模型到个人模型库失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const projectStructure = [
    {
      id: 'vehicle-system',
      name: '整车系统',
      type: 'package',
      icon: <Box className="w-4 h-4 text-blue-600" />,
      children: [
        {
          id: 'functional-arch',
          name: '功能架构',
          type: 'package',
          icon: <GitBranch className="w-4 h-4 text-green-600" />,
          children: [
            { id: 'power-mgmt', name: '能量管理', type: 'component', icon: <Target className="w-4 h-4 text-orange-600" /> },
            { id: 'safety-ctrl', name: '安全控制', type: 'component', icon: <Target className="w-4 h-4 text-red-600" /> },
            { id: 'comfort-ctrl', name: '舒适控制', type: 'component', icon: <Target className="w-4 h-4 text-purple-600" /> }
          ]
        },
        {
          id: 'logical-arch',
          name: '逻辑架构',
          type: 'package',
          icon: <Network className="w-4 h-4 text-indigo-600" />,
          children: [
            { id: 'vcu', name: 'VCU整车控制器', type: 'block', icon: <Database className="w-4 h-4 text-blue-700" /> },
            { id: 'bms', name: 'BMS电池管理系统', type: 'block', icon: <Database className="w-4 h-4 text-green-700" /> },
            { id: 'tcu', name: 'TCU热管理控制器', type: 'block', icon: <Database className="w-4 h-4 text-red-700" /> }
          ]
        }
      ]
    }
  ];

  const requirements = [
    { id: 'REQ-001', name: '整车能耗要求', priority: 'high', status: 'approved' },
    { id: 'REQ-002', name: '动力性能要求', priority: 'high', status: 'approved' },
    { id: 'REQ-003', name: '安全性要求', priority: 'medium', status: 'review' },
    { id: 'REQ-004', name: '舒适性要求', priority: 'low', status: 'draft' }
  ];

  const diagrams = [
    { name: '系统上下文图', type: 'Context Diagram', lastModified: '2024-01-10 14:30' },
    { name: '功能分解图', type: 'Activity Diagram', lastModified: '2024-01-10 11:20' },
    { name: '系统架构图', type: 'Block Definition Diagram', lastModified: '2024-01-09 16:45' },
    { name: '接口定义图', type: 'Internal Block Diagram', lastModified: '2024-01-09 09:15' },
    { name: '状态机图', type: 'State Machine Diagram', lastModified: '2024-01-08 13:20' }
  ];

  const toggleExpand = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const renderTreeNode = (item: any, level: number = 0) => {
    const isExpanded = expandedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id} className={`ml-${level * 4}`}>
        <div
          className={`flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer ${
            selectedItem === item.id ? 'bg-blue-50 border-l-2 border-blue-500' : ''
          }`}
          onClick={() => setSelectedItem(item.id)}
        >
          {hasChildren && (
            <button onClick={(e) => { e.stopPropagation(); toggleExpand(item.id); }}>
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
          {!hasChildren && <div className="w-3"></div>}
          {item.icon}
          <span className="text-sm">{item.name}</span>
          <Badge variant="outline" className="text-xs ml-auto">
            {item.type}
          </Badge>
        </div>
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {item.children.map((child: any) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50' : 'h-screen'} bg-white flex flex-col`}>
      {/* 页面标题栏 */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回工作流
          </Button>
          <div className="h-6 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <h1 className="text-xl font-semibold">Enterprise Architect - 功能&系统设计</h1>
            {nodeData && (
              <Badge variant="outline" className="text-sm">
                {nodeData.name}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            {isFullscreen ? '退出全屏' : '全屏模式'}
          </Button>
          <Badge variant="outline" className="text-sm">
            版本: v14.0.1430
          </Badge>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center gap-2 p-3 border-b bg-white">
        <Button variant="outline" size="sm">
          <FolderOpen className="w-4 h-4 mr-2" />
          打开项目
        </Button>
        <Button variant="outline" size="sm">
          <Save className="w-4 h-4 mr-2" />
          保存
        </Button>
        <div className="h-6 w-px bg-gray-300" />
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          新建元素
        </Button>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-2" />
          编辑
        </Button>
        <div className="h-6 w-px bg-gray-300" />
        <Button variant="outline" size="sm">
          <Play className="w-4 h-4 mr-2" />
          执行仿真
        </Button>
        <Button variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          刷新模型
        </Button>
        <div className="h-6 w-px bg-gray-300" />
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleSaveToPersonalLibrary}
          disabled={isSaving}
          className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
        >
          {isSaving ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Archive className="w-4 h-4 mr-2" />
          )}
          {isSaving ? '保存中...' : '保存到模型库'}
        </Button>
        <div className="flex-1" />
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>EA 工具已连接</span>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧面板 */}
        <div className="w-80 border-r bg-gray-50 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-3 m-3">
              <TabsTrigger value="project" className="text-xs">项目浏览</TabsTrigger>
              <TabsTrigger value="requirements" className="text-xs">需求管理</TabsTrigger>
              <TabsTrigger value="diagrams" className="text-xs">图表视图</TabsTrigger>
            </TabsList>

            <TabsContent value="project" className="flex-1 p-3 overflow-y-auto">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-blue-600" />
                    项目浏览器
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-1">
                  {projectStructure.map(item => renderTreeNode(item))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="requirements" className="flex-1 p-3 overflow-y-auto">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    需求管理
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-3">
                  {requirements.map(req => (
                    <div key={req.id} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-mono text-blue-600 font-medium">{req.id}</span>
                        <div className="flex gap-1">
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(req.priority)}`}>
                            {req.priority}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${getStatusColor(req.status)}`}>
                            {req.status}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{req.name}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="diagrams" className="flex-1 p-3 overflow-y-auto">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Network className="w-4 h-4 text-purple-600" />
                    图表列表
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 space-y-3">
                  {diagrams.map((diagram, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{diagram.name}</span>
                        <Eye className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{diagram.type}</p>
                      <p className="text-xs text-gray-400">最后修改: {diagram.lastModified}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* 主工作区域 */}
        <div className="flex-1 flex flex-col bg-white">
          {/* 图表工作区 */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 relative">
            {/* 模拟的系统架构图 */}
            <div className="bg-white p-12 rounded-lg border-2 border-dashed border-gray-300 max-w-5xl w-full mx-6">
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-medium text-gray-700 mb-2">系统架构设计工作区</h2>
                  <p className="text-gray-500">基于MBSE方法的系统工程建模环境</p>
                </div>
                
                <div className="grid grid-cols-3 gap-6">
                  {/* 功能层 */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <h3 className="text-base font-medium text-blue-700 mb-3">功能架��层</h3>
                    </div>
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium">能量管理</span>
                      </div>
                      <p className="text-xs text-blue-700">整车能量流控制与优化</p>
                    </div>
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">安全控制</span>
                      </div>
                      <p className="text-xs text-green-700">主被动安全系统控制</p>
                    </div>
                    <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">舒适控制</span>
                      </div>
                      <p className="text-xs text-purple-700">乘员舒适性控制系统</p>
                    </div>
                  </div>
                  
                  {/* 逻辑层 */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <h3 className="text-base font-medium text-indigo-700 mb-3">逻辑架构层</h3>
                    </div>
                    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Database className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium">VCU控制器</span>
                      </div>
                      <p className="text-xs text-indigo-700">整车控制单元</p>
                    </div>
                    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Database className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium">BMS系统</span>
                      </div>
                      <p className="text-xs text-indigo-700">电池管理系统</p>
                    </div>
                    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Database className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium">TCU控制器</span>
                      </div>
                      <p className="text-xs text-indigo-700">热管理控制单元</p>
                    </div>
                  </div>
                  
                  {/* 物理层 */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <h3 className="text-base font-medium text-gray-700 mb-3">物理实现层</h3>
                    </div>
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Box className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium">动力电池包</span>
                      </div>
                      <p className="text-xs text-gray-700">锂离子电池系统</p>
                    </div>
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Box className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium">驱动电机</span>
                      </div>
                      <p className="text-xs text-gray-700">永磁同步电机</p>
                    </div>
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <Box className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium">热管理系统</span>
                      </div>
                      <p className="text-xs text-gray-700">液冷散热系统</p>
                    </div>
                  </div>
                </div>

                {/* 连接线指示 */}
                <div className="flex justify-center items-center gap-4 mt-8">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-4 h-0.5 bg-blue-400"></div>
                    <span>功能映射</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-4 h-0.5 bg-indigo-400"></div>
                    <span>逻辑实现</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <div className="w-4 h-0.5 bg-gray-400"></div>
                    <span>物理部署</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧属性面板 */}
        <div className="w-72 border-l bg-gray-50 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-gray-600" />
              <h3 className="font-medium">属性面板</h3>
            </div>
            
            {selectedItem ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">选中元素属性</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <label className="text-gray-500 block mb-1">标识符:</label>
                    <div className="font-mono text-blue-600 bg-gray-100 px-2 py-1 rounded text-xs">
                      {selectedItem}
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">元素类型:</label>
                    <Badge variant="outline" className="text-xs">系统组件</Badge>
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">设计状态:</label>
                    <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">
                      设计中
                    </Badge>
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">版本信息:</label>
                    <div className="text-xs text-gray-600">v1.2.0</div>
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">描述信息:</label>
                    <textarea 
                      className="w-full h-20 text-xs p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="添加组件描述信息..."
                      defaultValue="这是一个系统架构组件，用于实现特定的功能需求。"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1">依赖关系:</label>
                    <div className="space-y-1">
                      <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        → 需求 REQ-001
                      </div>
                      <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                        ← 接口 IFC-002
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <Settings className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <div className="text-sm text-gray-500 mb-2">未选中任何元素</div>
                <p className="text-xs text-gray-400">
                  点击左侧项目浏览器中的元素<br />
                  或主工作区的组件查看属性
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 状态栏 */}
      <div className="flex items-center justify-between p-3 border-t bg-gray-50 text-sm text-gray-600">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>系统就绪</span>
          </div>
          <span>项目: 新能源汽车系统设计</span>
          <span>模型: {nodeData?.name || '功能&系统设计'}</span>
        </div>
        <div className="flex items-center gap-6">
          <span>缩放: 100%</span>
          <span>网格: 启用</span>
          <span>自动保存: 开启</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>EA v14.0.1430</span>
          </div>
        </div>
      </div>
    </div>
  );
}