import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  ArrowLeft,
  Settings,
  FileText,
  Save,
  RefreshCw,
  Plus,
  Edit,
  Check,
  AlertTriangle,
  Users,
  Calendar,
  Link,
  Search,
  Filter,
  Download,
  Upload,
  History,
  Tag,
  CheckSquare,
  FileCheck,
  GitBranch,
  MessageSquare,
  Bell,
  Database,
  Workflow,
  Eye,
  Clock,
  User,
  MapPin
} from 'lucide-react@0.487.0';

interface PolarionToolPageProps {
  nodeData?: any;
  onBack: () => void;
}

export function PolarionToolPage({ nodeData, onBack }: PolarionToolPageProps) {
  const [selectedRequirement, setSelectedRequirement] = useState('REQ-001');
  const [isCreatingRequirement, setIsCreatingRequirement] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // 模拟需求数据
  const requirements = [
    {
      id: 'REQ-001',
      title: '整车碰撞安全性能要求',
      type: '安全需求',
      status: '已批准',
      priority: '高',
      assignee: '张工程师',
      description: '整车在正面碰撞测试中须满足NCAP五星标准，假人伤害指标不超过规定阈值。',
      category: '安全',
      version: '1.2',
      lastModified: '2025-01-08 10:30',
      links: ['REQ-002', 'TEST-001'],
      comments: 3,
      attachments: 2,
      workItems: ['WI-001', 'WI-002'],
      traceability: {
        parent: 'SYS-REQ-001',
        children: ['REQ-001-1', 'REQ-001-2'],
        tests: ['TEST-001', 'TEST-002'],
        designs: ['ARCH-001']
      }
    },
    {
      id: 'REQ-002',
      title: '制动距离性能要求',
      type: '功能需求',
      status: '审核中',
      priority: '高',
      assignee: '李工程师',
      description: '车辆在时速100km/h下制动距离不得超过42米，在湿滑路面条件下不超过50米。',
      category: '制动',
      version: '1.0',
      lastModified: '2025-01-07 16:45',
      links: ['REQ-001', 'REQ-003'],
      comments: 1,
      attachments: 1,
      workItems: ['WI-003'],
      traceability: {
        parent: 'SYS-REQ-002',
        children: ['REQ-002-1'],
        tests: ['TEST-003'],
        designs: ['ARCH-002']
      }
    },
    {
      id: 'REQ-003',
      title: '动力性能要求',
      type: '功能需求',
      status: '草稿',
      priority: '中',
      assignee: '王工程师',
      description: '车辆0-100km/h加速时间不超过8.5秒，最大爬坡度不小于30%。',
      category: '动力',
      version: '0.9',
      lastModified: '2025-01-08 09:15',
      links: ['REQ-002'],
      comments: 0,
      attachments: 0,
      workItems: ['WI-004'],
      traceability: {
        parent: 'SYS-REQ-003',
        children: [],
        tests: [],
        designs: []
      }
    },
    {
      id: 'REQ-004',
      title: '电池续航里程要求',
      type: '功能需求',
      status: '已批准',
      priority: '高',
      assignee: '陈工程师',
      description: '纯电模式下续航里程不少于500公里（NEDC工况）。',
      category: '能源',
      version: '1.1',
      lastModified: '2025-01-06 14:20',
      links: ['REQ-005'],
      comments: 2,
      attachments: 3,
      workItems: ['WI-005', 'WI-006'],
      traceability: {
        parent: 'SYS-REQ-004',
        children: ['REQ-004-1', 'REQ-004-2', 'REQ-004-3'],
        tests: ['TEST-004', 'TEST-005'],
        designs: ['ARCH-003', 'ARCH-004']
      }
    }
  ];

  const getCurrentRequirement = () => {
    return requirements.find(req => req.id === selectedRequirement) || requirements[0];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case '已批准': return 'bg-green-100 text-green-800 border-green-200';
      case '审核中': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case '草稿': return 'bg-gray-100 text-gray-800 border-gray-200';
      case '已拒绝': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case '高': return 'bg-red-100 text-red-800 border-red-200';
      case '中': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case '低': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || 
                         req.status === activeFilter ||
                         req.priority === activeFilter ||
                         req.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const recentActivities = [
    {
      id: 1,
      type: 'comment',
      user: '张工程师',
      action: '添加了评论',
      target: 'REQ-001',
      time: '2小时前',
      content: '已完成安全测试验证，符合标准要求'
    },
    {
      id: 2,
      type: 'status',
      user: '李工程师',
      action: '更新了状态',
      target: 'REQ-002',
      time: '4小时前',
      content: '从"草稿"更改为"审核中"'
    },
    {
      id: 3,
      type: 'link',
      user: '王工程师',
      action: '创建了关联',
      target: 'REQ-003',
      time: '昨天',
      content: '与 TEST-006 建立了追溯关系'
    },
    {
      id: 4,
      type: 'create',
      user: '陈工程师',
      action: '创建了需求',
      target: 'REQ-005',
      time: '2天前',
      content: '新增充电时间性能要求'
    }
  ];

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              返回工作流
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Polarion 需求管理</h1>
                <p className="text-xs text-gray-500">
                  节点: {nodeData?.name || '需求管理与同步'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              已连接
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              设置
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              导出
            </Button>
          </div>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              size="sm"
              onClick={() => setIsCreatingRequirement(true)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              新建需求
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              导入
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              同步
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索需求..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="筛选" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="已批准">已批准</SelectItem>
                  <SelectItem value="审核中">审核中</SelectItem>
                  <SelectItem value="草稿">草稿</SelectItem>
                  <SelectItem value="高">高优先级</SelectItem>
                  <SelectItem value="功能需求">功能需求</SelectItem>
                  <SelectItem value="安全需求">安全需求</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{filteredRequirements.length} 个需求</span>
            <Separator orientation="vertical" className="h-4" />
            <Clock className="w-4 h-4" />
            <span>最后同步: 1分钟前</span>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* 左侧 - 需求列表 */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  需求列表
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {filteredRequirements.map((req) => (
                    <div 
                      key={req.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedRequirement === req.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => setSelectedRequirement(req.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{req.id}</span>
                          <Badge className={getPriorityColor(req.priority)}>
                            {req.priority}
                          </Badge>
                        </div>
                        <Badge className={getStatusColor(req.status)}>
                          {req.status}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm mb-2 line-clamp-2">{req.title}</h4>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{req.assignee}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>{req.comments}</span>
                          </div>
                        </div>
                        <span>{req.version}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 中右侧 - 需求详情 */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="details" className="h-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="details" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  详情
                </TabsTrigger>
                <TabsTrigger value="traceability" className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  追溯
                </TabsTrigger>
                <TabsTrigger value="comments" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  评论
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  历史
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  动态
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4 h-full">
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <span>需求详情: {getCurrentRequirement().id}</span>
                        <Badge className={getStatusColor(getCurrentRequirement().status)}>
                          {getCurrentRequirement().status}
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          编辑
                        </Button>
                        <Button variant="outline" size="sm">
                          <Save className="w-4 h-4 mr-2" />
                          保存
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 基本信息 */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">需求标题</label>
                          <Input value={getCurrentRequirement().title} readOnly />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">需求类型</label>
                          <Select value={getCurrentRequirement().type}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="功能需求">功能需求</SelectItem>
                              <SelectItem value="安全需求">安全需求</SelectItem>
                              <SelectItem value="性能需求">性能需求</SelectItem>
                              <SelectItem value="接口需求">接口需求</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">分类</label>
                          <Input value={getCurrentRequirement().category} readOnly />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">优先级</label>
                          <Select value={getCurrentRequirement().priority}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="高">高</SelectItem>
                              <SelectItem value="中">中</SelectItem>
                              <SelectItem value="低">低</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">负责人</label>
                          <Select value={getCurrentRequirement().assignee}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="张工程师">张工程师</SelectItem>
                              <SelectItem value="李工程师">李工程师</SelectItem>
                              <SelectItem value="王工程师">王工程师</SelectItem>
                              <SelectItem value="陈工程师">陈工程师</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">版本</label>
                          <Input value={getCurrentRequirement().version} readOnly />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">需求描述</label>
                      <Textarea 
                        value={getCurrentRequirement().description} 
                        rows={4}
                        className="resize-none"
                        readOnly 
                      />
                    </div>

                    {/* 关联信息 */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">工作项</label>
                        <div className="flex flex-wrap gap-2">
                          {getCurrentRequirement().workItems.map((item, idx) => (
                            <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              <Workflow className="w-3 h-3 mr-1" />
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">关联链接</label>
                        <div className="flex flex-wrap gap-2">
                          {getCurrentRequirement().links.map((link, idx) => (
                            <Badge key={idx} variant="outline" className="bg-green-50 text-green-700 border-green-200 cursor-pointer hover:bg-green-100">
                              <Link className="w-3 h-3 mr-1" />
                              {link}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 附件和统计信息 */}
                    <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <FileCheck className="w-4 h-4 text-gray-500" />
                            <span>{getCurrentRequirement().attachments} 个附件</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4 text-gray-500" />
                            <span>{getCurrentRequirement().comments} 条评论</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 text-right">
                        <div>最后修改: {getCurrentRequirement().lastModified}</div>
                        <div>修改人: {getCurrentRequirement().assignee}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="traceability" className="mt-4 h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>需求追溯关系</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          上级需求
                        </h4>
                        {getCurrentRequirement().traceability.parent ? (
                          <Badge className="bg-blue-50 text-blue-700 border-blue-200 cursor-pointer hover:bg-blue-100">
                            <GitBranch className="w-3 h-3 mr-1" />
                            {getCurrentRequirement().traceability.parent}
                          </Badge>
                        ) : (
                          <span className="text-gray-500 text-sm">无上级需求</span>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <GitBranch className="w-4 h-4 text-green-500" />
                          下级需求
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {getCurrentRequirement().traceability.children.length > 0 ? (
                            getCurrentRequirement().traceability.children.map((child, idx) => (
                              <Badge key={idx} className="bg-green-50 text-green-700 border-green-200 cursor-pointer hover:bg-green-100">
                                <GitBranch className="w-3 h-3 mr-1" />
                                {child}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">无下级需求</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <CheckSquare className="w-4 h-4 text-purple-500" />
                          关联测试
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {getCurrentRequirement().traceability.tests.length > 0 ? (
                            getCurrentRequirement().traceability.tests.map((test, idx) => (
                              <Badge key={idx} className="bg-purple-50 text-purple-700 border-purple-200 cursor-pointer hover:bg-purple-100">
                                <CheckSquare className="w-3 h-3 mr-1" />
                                {test}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">无关联测试</span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Eye className="w-4 h-4 text-orange-500" />
                          关联设计
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {getCurrentRequirement().traceability.designs.length > 0 ? (
                            getCurrentRequirement().traceability.designs.map((design, idx) => (
                              <Badge key={idx} className="bg-orange-50 text-orange-700 border-orange-200 cursor-pointer hover:bg-orange-100">
                                <Eye className="w-3 h-3 mr-1" />
                                {design}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-500 text-sm">无关联设计</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 追溯完整性检查 */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        追溯完整性检查
                      </h4>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center justify-between">
                          <span>上下级关系:</span>
                          <Badge className="bg-green-100 text-green-800">
                            <Check className="w-3 h-3 mr-1" />
                            完整
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>测试覆盖:</span>
                          <Badge className={getCurrentRequirement().traceability.tests.length > 0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                            {getCurrentRequirement().traceability.tests.length > 0 ? (
                              <><Check className="w-3 h-3 mr-1" />完整</>
                            ) : (
                              <><AlertTriangle className="w-3 h-3 mr-1" />缺失</>
                            )}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>设计关联:</span>
                          <Badge className={getCurrentRequirement().traceability.designs.length > 0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                            {getCurrentRequirement().traceability.designs.length > 0 ? (
                              <><Check className="w-3 h-3 mr-1" />完整</>
                            ) : (
                              <><AlertTriangle className="w-3 h-3 mr-1" />缺失</>
                            )}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="comments" className="mt-4 h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>评论讨论</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            张
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-sm">张工程师</span>
                              <span className="text-xs text-gray-500">2小时前</span>
                            </div>
                            <p className="text-sm text-gray-700">已完成安全测试验证，符合标准要求。建议进入下一阶段评审流程。</p>
                            <div className="flex items-center space-x-3 mt-2">
                              <Button variant="ghost" size="sm" className="text-xs">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                回复
                              </Button>
                              <Button variant="ghost" size="sm" className="text-xs">
                                <Check className="w-3 h-3 mr-1" />
                                点赞
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            李
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-sm">李工程师</span>
                              <span className="text-xs text-gray-500">5小时前</span>
                            </div>
                            <p className="text-sm text-gray-700">需要确认制动距离测试条件是否包含雨雪天气场景。</p>
                            <div className="flex items-center space-x-3 mt-2">
                              <Button variant="ghost" size="sm" className="text-xs">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                回复
                              </Button>
                              <Button variant="ghost" size="sm" className="text-xs">
                                <Check className="w-3 h-3 mr-1" />
                                点赞
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 添加评论区域 */}
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            我
                          </div>
                          <div className="flex-1">
                            <Textarea placeholder="添加评论..." rows={3} className="mb-3" />
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <span>支持 @用户名 和 #需求ID</span>
                              </div>
                              <Button size="sm">
                                <MessageSquare className="w-3 h-3 mr-1" />
                                发表评论
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="mt-4 h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>修改历史</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { time: '2025-01-08 10:30', user: '张工程师', action: '更新需求描述', version: '1.2' },
                        { time: '2025-01-07 16:45', user: '张工程师', action: '修改优先级为"高"', version: '1.1' },
                        { time: '2025-01-06 09:20', user: '李工程师', action: '添加测试关联', version: '1.0' },
                        { time: '2025-01-05 14:30', user: '李工程师', action: '创建需求', version: '0.1' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">{item.action}</span>
                              <Badge variant="outline">{item.version}</Badge>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.user} · {item.time}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            查看
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-4 h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>最近活动</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                            activity.type === 'comment' ? 'bg-blue-500' :
                            activity.type === 'status' ? 'bg-green-500' :
                            activity.type === 'link' ? 'bg-purple-500' : 'bg-orange-500'
                          }`}>
                            {activity.type === 'comment' ? <MessageSquare className="w-4 h-4" /> :
                             activity.type === 'status' ? <Check className="w-4 h-4" /> :
                             activity.type === 'link' ? <Link className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm">
                              <span className="font-medium">{activity.user}</span>
                              <span className="mx-1">{activity.action}</span>
                              <Badge variant="outline" className="mx-1">{activity.target}</Badge>
                            </div>
                            {activity.content && (
                              <p className="text-sm text-gray-600 mt-1">{activity.content}</p>
                            )}
                            <span className="text-xs text-gray-500">{activity.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}