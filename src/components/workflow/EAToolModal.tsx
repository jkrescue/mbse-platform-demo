import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TreeView, TreeItem } from '../ui/treeview';
import {
  Maximize2,
  Minimize2,
  X,
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
  ChevronDown
} from 'lucide-react@0.487.0';

interface EAToolModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodeData?: any;
}

export function EAToolModal({ open, onOpenChange, nodeData }: EAToolModalProps) {
  const [activeTab, setActiveTab] = useState('project');
  const [isMaximized, setIsMaximized] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set(['vehicle-system', 'functional-arch', 'logical-arch']));

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={`${isMaximized ? 'max-w-[95vw] h-[95vh]' : 'max-w-6xl h-[80vh]'} p-0 overflow-hidden`}
        hideCloseButton
      >
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-3 border-b bg-gray-50">
          <DialogHeader className="p-0">
            <DialogTitle className="flex items-center gap-2 text-sm">
              <Settings className="w-4 h-4 text-blue-600" />
              Enterprise Architect - 功能&系统设计
              {nodeData && (
                <Badge variant="outline" className="text-xs">
                  {nodeData.name}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMaximized(!isMaximized)}
              className="h-7 w-7 p-0"
            >
              {isMaximized ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onOpenChange(false)}
              className="h-7 w-7 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* 工具栏 */}
        <div className="flex items-center gap-2 p-2 border-b bg-white">
          <Button variant="outline" size="sm" className="h-7">
            <FolderOpen className="w-3 h-3 mr-1" />
            打开
          </Button>
          <Button variant="outline" size="sm" className="h-7">
            <Save className="w-3 h-3 mr-1" />
            保存
          </Button>
          <div className="h-4 w-px bg-gray-300" />
          <Button variant="outline" size="sm" className="h-7">
            <Plus className="w-3 h-3 mr-1" />
            新建
          </Button>
          <Button variant="outline" size="sm" className="h-7">
            <Edit className="w-3 h-3 mr-1" />
            编辑
          </Button>
          <div className="h-4 w-px bg-gray-300" />
          <Button variant="outline" size="sm" className="h-7">
            <Play className="w-3 h-3 mr-1" />
            仿真
          </Button>
          <Button variant="outline" size="sm" className="h-7">
            <RefreshCw className="w-3 h-3 mr-1" />
            刷新
          </Button>
          <div className="flex-1" />
          <Badge variant="outline" className="text-xs">
            版本: v14.0.1430
          </Badge>
        </div>

        {/* 主内容区域 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧面板 */}
          <div className="w-80 border-r bg-gray-50 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 m-2">
                <TabsTrigger value="project" className="text-xs">项目</TabsTrigger>
                <TabsTrigger value="requirements" className="text-xs">需求</TabsTrigger>
                <TabsTrigger value="diagrams" className="text-xs">图表</TabsTrigger>
              </TabsList>

              <TabsContent value="project" className="flex-1 p-2 overflow-y-auto">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">项目浏览器</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 space-y-1">
                    {projectStructure.map(item => renderTreeNode(item))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requirements" className="flex-1 p-2 overflow-y-auto">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">需求管理</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 space-y-2">
                    {requirements.map(req => (
                      <div key={req.id} className="p-2 border rounded hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono text-blue-600">{req.id}</span>
                          <div className="flex gap-1">
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(req.priority)}`}>
                              {req.priority}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${getStatusColor(req.status)}`}>
                              {req.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-gray-700">{req.name}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="diagrams" className="flex-1 p-2 overflow-y-auto">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">图表列表</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 space-y-2">
                    {diagrams.map((diagram, index) => (
                      <div key={index} className="p-2 border rounded hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{diagram.name}</span>
                          <Eye className="w-3 h-3 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500">{diagram.type}</p>
                        <p className="text-xs text-gray-400">修改: {diagram.lastModified}</p>
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
              <div className="bg-white p-8 rounded-lg border-2 border-dashed border-gray-300 text-center">
                <div className="space-y-4">
                  <div className="text-lg font-medium text-gray-700">系统架构设计工作区</div>
                  <div className="grid grid-cols-3 gap-4">
                    {/* 功能层 */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-blue-700">功能层</div>
                      <div className="bg-blue-50 border border-blue-200 rounded p-2">
                        <div className="text-xs">能量管理</div>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded p-2">
                        <div className="text-xs">安全控制</div>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded p-2">
                        <div className="text-xs">舒适控制</div>
                      </div>
                    </div>
                    
                    {/* 逻辑层 */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-indigo-700">逻辑层</div>
                      <div className="bg-indigo-50 border border-indigo-200 rounded p-2">
                        <div className="text-xs">VCU控制器</div>
                      </div>
                      <div className="bg-indigo-50 border border-indigo-200 rounded p-2">
                        <div className="text-xs">BMS系统</div>
                      </div>
                      <div className="bg-indigo-50 border border-indigo-200 rounded p-2">
                        <div className="text-xs">TCU控制器</div>
                      </div>
                    </div>
                    
                    {/* 物理层 */}
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">物理层</div>
                      <div className="bg-gray-50 border border-gray-200 rounded p-2">
                        <div className="text-xs">电池包</div>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded p-2">
                        <div className="text-xs">电机</div>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded p-2">
                        <div className="text-xs">热管理</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 右下角状态指示 */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>EA 工具已连接</span>
              </div>
            </div>
          </div>

          {/* 右侧属性面板 */}
          <div className="w-64 border-l bg-gray-50 overflow-y-auto">
            <div className="p-3">
              <div className="text-sm font-medium mb-3">属性面板</div>
              {selectedItem ? (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs">选中项属性</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    <div>
                      <label className="text-gray-500">ID:</label>
                      <div className="font-mono">{selectedItem}</div>
                    </div>
                    <div>
                      <label className="text-gray-500">类型:</label>
                      <div>组件</div>
                    </div>
                    <div>
                      <label className="text-gray-500">状态:</label>
                      <Badge variant="outline" className="text-xs">设计中</Badge>
                    </div>
                    <div>
                      <label className="text-gray-500">描述:</label>
                      <textarea 
                        className="w-full h-16 text-xs p-2 border rounded resize-none"
                        placeholder="添加描述..."
                      />
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-xs text-gray-500 text-center py-8">
                  请选择一个元素查看属性
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 状态栏 */}
        <div className="flex items-center justify-between p-2 border-t bg-gray-50 text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span>就绪</span>
            <span>项目: 新能源汽车系统设计</span>
          </div>
          <div className="flex items-center gap-4">
            <span>缩放: 100%</span>
            <span>网格: 开启</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>已连接</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}