import React, { useState, useCallback, useMemo } from 'react'
import { 
  Archive, 
  GitBranch, 
  Tag, 
  Plus, 
  Download, 
  Upload, 
  Eye, 
  Edit, 
  Trash2,
  Clock,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Copy,
  Star,
  GitCommit,
  GitMerge,
  Rewind,
  FastForward,
  RotateCcw,
  Shield,
  Lock,
  Unlock,
  Settings,
  Activity,
  TrendingUp,
  Calendar,
  Hash,
  Database,
  Zap,
  Code,
  Box,
  FileCheck,
  Merge,
  Split,
  GitPullRequest
} from 'lucide-react@0.487.0'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from './ui/dialog'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Switch } from './ui/switch'
import { Progress } from './ui/progress'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { Checkbox } from './ui/checkbox'
import { toast } from 'sonner@2.0.3'

// 增强的模型版本数据 - 基于MBSE实际需求设计
const modelVersions = [
  {
    id: 'v3.1.0',
    version: '3.1.0',
    modelName: '电池热管理模型',
    type: 'major',
    author: '张工程师',
    date: '2025-01-08 14:30',
    description: '重大更新：新增高温预警功能，优化热传导算法，提升计算精度15%，增强与MBSE工具链的集成度',
    status: 'stable',
    isBaseline: true,
    downloadCount: 45,
    size: '15.2 MB',
    hash: 'a1b2c3d4e5f6',
    branch: 'main',
    project: '新能源汽车项目',
    rflpCategory: 'Physical',
    changes: [
      { type: 'added', description: '新增高温预警算法模块' },
      { type: 'improved', description: '优化热传导计算性能提升15%' },
      { type: 'fixed', description: '修复边界条件处理bug' },
      { type: 'added', description: '集成POLARION需求追踪接口' }
    ],
    dependencies: ['ThermalLib v2.1', 'MathCore v1.8', 'MBSE-Toolkit v3.0'],
    testResults: {
      accuracy: 95.2,
      performance: 88.5,
      stability: 92.0,
      coverage: 89.3,
      regressionTests: 147,
      passedTests: 145,
      failedTests: 2
    },
    metrics: {
      complexity: 'Medium',
      maintainability: 94.5,
      documentation: 96.8,
      codeQuality: 91.2
    },
    approvals: [
      { reviewer: '李项目经理', status: 'approved', date: '2025-01-08 16:00', comment: '功能完善，性能提升显著' },
      { reviewer: '王架构师', status: 'approved', date: '2025-01-08 15:30', comment: '架构设计合理，建议发布' }
    ]
  },
  {
    id: 'v3.0.2',
    version: '3.0.2',
    modelName: '电池热管理模型',
    type: 'patch',
    author: '李工程师',
    date: '2024-12-28 16:45',
    description: '修复版本：解决温度梯度计算异常问题，优化内存使用效率',
    status: 'stable',
    isBaseline: false,
    downloadCount: 67,
    size: '14.8 MB',
    hash: 'b2c3d4e5f6a1',
    branch: 'main',
    project: '新能源汽车项目',
    rflpCategory: 'Physical',
    changes: [
      { type: 'fixed', description: '修复温度梯度计算异常' },
      { type: 'fixed', description: '解决内存泄漏问题' },
      { type: 'improved', description: '优化数值稳定性' }
    ],
    dependencies: ['ThermalLib v2.0', 'MathCore v1.8'],
    testResults: {
      accuracy: 94.8,
      performance: 87.2,
      stability: 91.5,
      coverage: 88.0,
      regressionTests: 142,
      passedTests: 140,
      failedTests: 2
    },
    metrics: {
      complexity: 'Medium',
      maintainability: 93.2,
      documentation: 95.1,
      codeQuality: 89.8
    },
    approvals: [
      { reviewer: '李项目经理', status: 'approved', date: '2024-12-28 18:00', comment: 'Bug修复及时，质量良好' }
    ]
  },
  {
    id: 'v3.0.1',
    version: '3.0.1',
    modelName: '电池热管理模型',
    type: 'patch',
    author: '王工程师',
    date: '2024-12-15 10:20',
    description: '小幅优化：提升计算效率，减少内存占用，完善文档和测试用例',
    status: 'stable',
    isBaseline: false,
    downloadCount: 89,
    size: '14.5 MB',
    hash: 'c3d4e5f6a1b2',
    branch: 'main',
    project: '新能源汽车项目',
    rflpCategory: 'Physical',
    changes: [
      { type: 'improved', description: '优化内存使用效率' },
      { type: 'improved', description: '提升计算速度10%' },
      { type: 'added', description: '增加单元测试覆盖率' }
    ],
    dependencies: ['ThermalLib v2.0', 'MathCore v1.7'],
    testResults: {
      accuracy: 94.5,
      performance: 86.8,
      stability: 90.2,
      coverage: 87.5,
      regressionTests: 138,
      passedTests: 136,
      failedTests: 2
    },
    metrics: {
      complexity: 'Medium',
      maintainability: 92.8,
      documentation: 94.3,
      codeQuality: 88.9
    },
    approvals: [
      { reviewer: '李项目经理', status: 'approved', date: '2024-12-15 14:00', comment: '优化合理，可以发布' }
    ]
  },
  {
    id: 'v3.0.0',
    version: '3.0.0',
    modelName: '电池热管理模型',
    type: 'major',
    author: '陈工程师',
    date: '2024-11-20 09:15',
    description: '重大版本：全新架构设计，支持多电池包并行计算，重构核心算法，提升可扩展性',
    status: 'deprecated',
    isBaseline: false,
    downloadCount: 156,
    size: '13.9 MB',
    hash: 'd4e5f6a1b2c3',
    branch: 'main',
    project: '新能源汽车项目',
    rflpCategory: 'Physical',
    changes: [
      { type: 'added', description: '新增多电池包并行计算支持' },
      { type: 'added', description: '重构核心算法架构' },
      { type: 'removed', description: '移除旧版本兼容接口' },
      { type: 'improved', description: '提升系统可扩展性' }
    ],
    dependencies: ['ThermalLib v1.9', 'MathCore v1.7'],
    testResults: {
      accuracy: 93.8,
      performance: 85.5,
      stability: 89.8,
      coverage: 86.2,
      regressionTests: 125,
      passedTests: 121,
      failedTests: 4
    },
    metrics: {
      complexity: 'High',
      maintainability: 89.2,
      documentation: 91.5,
      codeQuality: 86.3
    },
    approvals: [
      { reviewer: '李项目经理', status: 'approved', date: '2024-11-20 11:00', comment: '架构升级成功' },
      { reviewer: '王架构师', status: 'approved', date: '2024-11-20 10:30', comment: '重构质量良好' }
    ]
  }
]

// 基线管理数据
const baselines = [
  {
    id: 'baseline-1',
    name: 'Production Baseline v3.1',
    version: '3.1.0',
    createdBy: '张工程师',
    createdDate: '2025-01-08 14:30',
    description: '生产环境基线，经过完整测试验证，包含最新的热管理算法和性能优化',
    status: 'active',
    type: 'production',
    models: [
      { name: '电池热管理模型', version: '3.1.0', component: 'thermal-core' },
      { name: '车身结构模型', version: '2.8.1', component: 'structure-core' },
      { name: '控制算法模型', version: '1.5.2', component: 'control-logic' }
    ],
    testStatus: 'passed',
    approvedBy: '李项目经理',
    approvalDate: '2025-01-09 10:00',
    deployments: [
      { environment: 'production', date: '2025-01-09 14:00', status: 'active' },
      { environment: 'staging', date: '2025-01-08 16:00', status: 'completed' }
    ],
    metrics: {
      stability: 98.5,
      performance: 94.2,
      coverage: 91.8
    }
  },
  {
    id: 'baseline-2',
    name: 'Release Candidate v3.0',
    version: '3.0.2',
    createdBy: '王工程师',
    createdDate: '2024-12-28 16:45',
    description: '候选发布版本基线，包含重要的bug修复和性能优化',
    status: 'archived',
    type: 'release-candidate',
    models: [
      { name: '电池热管理模型', version: '3.0.2', component: 'thermal-core' },
      { name: '车身结构模型', version: '2.8.0', component: 'structure-core' },
      { name: '控制算法模型', version: '1.5.1', component: 'control-logic' }
    ],
    testStatus: 'passed',
    approvedBy: '陈架构师',
    approvalDate: '2024-12-29 09:30',
    deployments: [
      { environment: 'staging', date: '2024-12-29 10:00', status: 'completed' },
      { environment: 'testing', date: '2024-12-28 18:00', status: 'completed' }
    ],
    metrics: {
      stability: 96.8,
      performance: 91.5,
      coverage: 89.2
    }
  }
]

// 分支管理数据
const branches = [
  {
    id: 'main',
    name: 'main',
    type: 'production',
    lastCommit: {
      hash: 'a1b2c3d4e5f6',
      author: '张工程师',
      date: '2025-01-08 14:30',
      message: '发布v3.1.0版本'
    },
    isDefault: true,
    isProtected: true,
    ahead: 0,
    behind: 0
  },
  {
    id: 'development',
    name: 'development',
    type: 'development',
    lastCommit: {
      hash: 'f6e5d4c3b2a1',
      author: '李工程师',
      date: '2025-01-08 16:20',
      message: '开发新的热管理功能'
    },
    isDefault: false,
    isProtected: true,
    ahead: 3,
    behind: 0
  },
  {
    id: 'feature-advanced-thermal',
    name: 'feature/advanced-thermal',
    type: 'feature',
    lastCommit: {
      hash: 'b3a2c1d4e5f6',
      author: '王工程师',
      date: '2025-01-07 11:45',
      message: '实现高级热管理算法'
    },
    isDefault: false,
    isProtected: false,
    ahead: 5,
    behind: 1
  }
]

interface ModelVersionProps {
  userRole?: string
}

export function ModelVersion({ userRole }: ModelVersionProps) {
  const [selectedTab, setSelectedTab] = useState<'versions' | 'baselines' | 'branches'>('versions')
  const [selectedModel, setSelectedModel] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateVersionDialog, setShowCreateVersionDialog] = useState(false)
  const [showCreateBaselineDialog, setShowCreateBaselineDialog] = useState(false)
  const [showVersionDetailsDialog, setShowVersionDetailsDialog] = useState(false)
  const [showCreateBranchDialog, setShowCreateBranchDialog] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<any>(null)
  const [selectedBaseline, setSelectedBaseline] = useState<any>(null)
  
  // 表单状态
  const [newVersionForm, setNewVersionForm] = useState({
    version: '',
    type: 'patch',
    description: '',
    isBaseline: false,
    autoTest: true,
    branch: 'main'
  })
  
  const [newBaselineForm, setNewBaselineForm] = useState({
    name: '',
    description: '',
    type: 'release-candidate',
    selectedVersions: [] as string[],
    requireApproval: true,
    autoDeployStaging: false
  })

  const [newBranchForm, setNewBranchForm] = useState({
    name: '',
    sourcebranch: 'main',
    description: '',
    isProtected: false
  })

  // 性能优化：使用useMemo缓存过滤结果
  const filteredVersions = useMemo(() => {
    return modelVersions.filter(version => {
      const matchesSearch = !searchTerm ||
        version.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        version.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        version.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesModel = selectedModel === 'all' || version.modelName.includes(selectedModel)
      const matchesStatus = statusFilter === 'all' || version.status === statusFilter
      return matchesSearch && matchesModel && matchesStatus
    })
  }, [searchTerm, selectedModel, statusFilter])

  const filteredBaselines = useMemo(() => {
    return baselines.filter(baseline => {
      const matchesSearch = !searchTerm ||
        baseline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        baseline.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })
  }, [searchTerm])

  // 处理函数
  const handleCreateVersion = useCallback(async () => {
    if (!newVersionForm.version || !newVersionForm.description) {
      toast.error('请填写完整的版本信息')
      return
    }
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success(`版本 ${newVersionForm.version} 创建成功`)
      setShowCreateVersionDialog(false)
      setNewVersionForm({
        version: '',
        type: 'patch',
        description: '',
        isBaseline: false,
        autoTest: true,
        branch: 'main'
      })
    } catch (error) {
      toast.error('版本创建失败，请重试')
    }
  }, [newVersionForm])

  const handleCreateBaseline = useCallback(async () => {
    if (!newBaselineForm.name || !newBaselineForm.description) {
      toast.error('请填写完整的基线信息')
      return
    }
    
    if (newBaselineForm.selectedVersions.length === 0) {
      toast.error('请选择至少一个版本')
      return
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success(`基线 ${newBaselineForm.name} 创建成功`)
      setShowCreateBaselineDialog(false)
      setNewBaselineForm({
        name: '',
        description: '',
        type: 'release-candidate',
        selectedVersions: [],
        requireApproval: true,
        autoDeployStaging: false
      })
    } catch (error) {
      toast.error('基线创建失败，请重试')
    }
  }, [newBaselineForm])

  const handleCreateBranch = useCallback(async () => {
    if (!newBranchForm.name) {
      toast.error('请填写分支名称')
      return
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast.success(`分支 ${newBranchForm.name} 创建成功`)
      setShowCreateBranchDialog(false)
      setNewBranchForm({
        name: '',
        sourcebranch: 'main',
        description: '',
        isProtected: false
      })
    } catch (error) {
      toast.error('分支创建失败，请重试')
    }
  }, [newBranchForm])

  const handleSetBaseline = (versionId: string) => {
    toast.success('基线设置成功')
  }

  const handleRollback = (versionId: string) => {
    toast.warning(`正在回滚到版本 ${versionId}...`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable': return 'bg-green-100 text-green-800'
      case 'beta': return 'bg-blue-100 text-blue-800'
      case 'alpha': return 'bg-yellow-100 text-yellow-800'
      case 'deprecated': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'major': return <GitBranch className="w-4 h-4" />
      case 'minor': return <GitCommit className="w-4 h-4" />
      case 'patch': return <GitMerge className="w-4 h-4" />
      default: return <GitCommit className="w-4 h-4" />
    }
  }

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'added': return <Plus className="w-3 h-3 text-green-600" />
      case 'improved': return <TrendingUp className="w-3 h-3 text-blue-600" />
      case 'fixed': return <CheckCircle className="w-3 h-3 text-orange-600" />
      case 'removed': return <XCircle className="w-3 h-3 text-red-600" />
      default: return <Activity className="w-3 h-3 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">版本管理</h1>
          <p className="text-gray-600 mt-1">管理模型版本、创建基线和追踪变更历史</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowCreateBaselineDialog(true)}
            variant="outline"
            disabled={!['admin', 'projectManager', 'architect'].includes(userRole || '')}
          >
            <Star className="w-4 h-4 mr-2" />
            创建基线
          </Button>
          <Button
            onClick={() => setShowCreateVersionDialog(true)}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={!['admin', 'architect', 'modeling'].includes(userRole || '')}
          >
            <Plus className="w-4 h-4 mr-2" />
            新建版本
          </Button>
          <Button
            onClick={() => setShowCreateBranchDialog(true)}
            variant="outline"
            disabled={!['admin', 'projectManager', 'architect'].includes(userRole || '')}
          >
            <GitBranch className="w-4 h-4 mr-2" />
            创建分支
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Archive className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">总版本数</p>
                <p className="text-2xl font-semibold">{modelVersions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">基线数量</p>
                <p className="text-2xl font-semibold">{baselines.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">稳定版本</p>
                <p className="text-2xl font-semibold">
                  {modelVersions.filter(v => v.status === 'stable').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">总下载量</p>
                <p className="text-2xl font-semibold">
                  {modelVersions.reduce((sum, v) => sum + v.downloadCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容区域 */}
      <div className="space-y-6">
        <Tabs value={selectedTab} onValueChange={(value: any) => setSelectedTab(value)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="versions">版本历史</TabsTrigger>
            <TabsTrigger value="baselines">基线管理</TabsTrigger>
            <TabsTrigger value="branches">分支管理</TabsTrigger>
          </TabsList>

          <TabsContent value="versions" className="space-y-4">
            {/* 筛选器 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Input
                    type="text"
                    placeholder="搜索版本..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-48"
                  />
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部模型</SelectItem>
                      <SelectItem value="thermal">电池热管理模型</SelectItem>
                      <SelectItem value="structure">车身结构模型</SelectItem>
                      <SelectItem value="powertrain">动力总成模型</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部状态</SelectItem>
                      <SelectItem value="stable">稳定</SelectItem>
                      <SelectItem value="beta">测试</SelectItem>
                      <SelectItem value="alpha">预览</SelectItem>
                      <SelectItem value="deprecated">已弃用</SelectItem>
                    </SelectContent>
                  </Select>
                  <Badge variant="outline" className="text-sm">
                    共 {filteredVersions.length} 个版本
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* 版本列表 */}
            <div className="space-y-4">
              {filteredVersions.map((version) => (
                <Card key={version.id} className={`${version.isBaseline ? 'border-yellow-200 bg-yellow-50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getTypeIcon(version.type)}
                          <h3 className="font-semibold text-lg">
                            {version.modelName} v{version.version}
                          </h3>
                          <Badge className={getStatusColor(version.status)}>
                            {version.status === 'stable' ? '稳定' :
                             version.status === 'beta' ? '测试' :
                             version.status === 'alpha' ? '预览' :
                             version.status === 'deprecated' ? '已弃用' : version.status}
                          </Badge>
                          {version.isBaseline && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Star className="w-3 h-3 mr-1" />
                              基线
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{version.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {version.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {version.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {version.downloadCount} 次下载
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {version.size}
                          </span>
                          <span className="flex items-center gap-1">
                            <Hash className="w-4 h-4" />
                            {version.hash}
                          </span>
                        </div>

                        {/* 变更摘要 */}
                        <div className="mt-4">
                          <h5 className="font-medium text-sm mb-2">主要变更：</h5>
                          <div className="flex flex-wrap gap-2">
                            {version.changes.slice(0, 3).map((change, index) => (
                              <div key={index} className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded">
                                {getChangeIcon(change.type)}
                                <span>{change.description}</span>
                              </div>
                            ))}
                            {version.changes.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{version.changes.length - 3} 项更改
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedVersion(version)
                            setShowVersionDetailsDialog(true)
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.success('下载已开始')}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {!version.isBaseline && ['admin', 'projectManager', 'architect'].includes(userRole || '') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetBaseline(version.id)}
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                        )}
                        {['admin', 'projectManager'].includes(userRole || '') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRollback(version.id)}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="baselines" className="space-y-4">
            <div className="space-y-4">
              {filteredBaselines.map((baseline) => (
                <Card key={baseline.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Star className="w-5 h-5 text-yellow-600" />
                          <h3 className="font-semibold text-lg">{baseline.name}</h3>
                          <Badge className={baseline.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {baseline.status === 'active' ? '活跃' : '已归档'}
                          </Badge>
                          <Badge className={baseline.testStatus === 'passed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}>
                            {baseline.testStatus === 'passed' ? '测试通过' : '测试失败'}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{baseline.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            创建者：{baseline.createdBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {baseline.createdDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Shield className="w-4 h-4" />
                            审批人：{baseline.approvedBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            {baseline.approvalDate}
                          </span>
                        </div>

                        <div>
                          <h5 className="font-medium text-sm mb-2">包含模型：</h5>
                          <div className="flex flex-wrap gap-2">
                            {baseline.models.map((model, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {model.name} v{model.version}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                        {baseline.status === 'active' && ['admin', 'projectManager'].includes(userRole || '') && (
                          <Button variant="outline" size="sm">
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="branches" className="space-y-4">
            <Card>
              <CardContent className="p-12 text-center">
                <GitBranch className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">分支管理</h3>
                <p className="text-gray-600 mb-4">
                  管理模型开发分支，支持并行开发和合并操作
                </p>
                <Badge variant="outline">即将推出</Badge>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* 创建版本对话框 */}
      <Dialog open={showCreateVersionDialog} onOpenChange={setShowCreateVersionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>创建新版本</DialogTitle>
            <DialogDescription>
              为模型创建新的版本，包含变更描述和测试配置
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="version">版本号</Label>
                <Input
                  id="version"
                  placeholder="例如：3.1.1"
                  value={newVersionForm.version}
                  onChange={(e) => setNewVersionForm({...newVersionForm, version: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">版本类型</Label>
                <Select value={newVersionForm.type} onValueChange={(value) => setNewVersionForm({...newVersionForm, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="major">主版本 (Major)</SelectItem>
                    <SelectItem value="minor">次版本 (Minor)</SelectItem>
                    <SelectItem value="patch">补丁版本 (Patch)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">版本描述</Label>
              <Textarea
                id="description"
                placeholder="详细描述此版本的主要变更和改进..."
                value={newVersionForm.description}
                onChange={(e) => setNewVersionForm({...newVersionForm, description: e.target.value})}
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newVersionForm.isBaseline}
                  onCheckedChange={(checked) => setNewVersionForm({...newVersionForm, isBaseline: checked})}
                />
                <Label>设置为基线版本</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newVersionForm.autoTest}
                  onCheckedChange={(checked) => setNewVersionForm({...newVersionForm, autoTest: checked})}
                />
                <Label>自动执行测试</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateVersionDialog(false)}>
              取消
            </Button>
            <Button onClick={handleCreateVersion}>
              创建版本
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 创建基线对话框 */}
      <Dialog open={showCreateBaselineDialog} onOpenChange={setShowCreateBaselineDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>创建基线</DialogTitle>
            <DialogDescription>
              创建一个包含多个稳定版本的基线配置
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="baseline-name">基线名称</Label>
              <Input
                id="baseline-name"
                placeholder="例如：Production Baseline v3.2"
                value={newBaselineForm.name}
                onChange={(e) => setNewBaselineForm({...newBaselineForm, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="baseline-description">基线描述</Label>
              <Textarea
                id="baseline-description"
                placeholder="描述此基线的用途和包含的主要功能..."
                value={newBaselineForm.description}
                onChange={(e) => setNewBaselineForm({...newBaselineForm, description: e.target.value})}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>选择版本</Label>
              <div className="border rounded-lg p-3 max-h-48 overflow-y-auto">
                {modelVersions.filter(v => v.status === 'stable').map((version) => (
                  <div key={version.id} className="flex items-center space-x-2 py-2">
                    <input
                      type="checkbox"
                      id={version.id}
                      checked={newBaselineForm.selectedVersions.includes(version.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewBaselineForm({
                            ...newBaselineForm,
                            selectedVersions: [...newBaselineForm.selectedVersions, version.id]
                          })
                        } else {
                          setNewBaselineForm({
                            ...newBaselineForm,
                            selectedVersions: newBaselineForm.selectedVersions.filter(id => id !== version.id)
                          })
                        }
                      }}
                      className="rounded"
                    />
                    <label htmlFor={version.id} className="text-sm">
                      {version.modelName} v{version.version}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={newBaselineForm.requireApproval}
                onCheckedChange={(checked) => setNewBaselineForm({...newBaselineForm, requireApproval: checked})}
              />
              <Label>需要审批</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={newBaselineForm.autoDeployStaging}
                onCheckedChange={(checked) => setNewBaselineForm({...newBaselineForm, autoDeployStaging: checked})}
              />
              <Label>自动部署到测试环境</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateBaselineDialog(false)}>
              取消
            </Button>
            <Button onClick={handleCreateBaseline}>
              创建基线
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 创建分支对话框 */}
      <Dialog open={showCreateBranchDialog} onOpenChange={setShowCreateBranchDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>创建分支</DialogTitle>
            <DialogDescription>
              创建新的开发分支，用于并行开发和功能实现
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="branch-name">分支名称</Label>
              <Input
                id="branch-name"
                placeholder="例如：feature/advanced-thermal"
                value={newBranchForm.name}
                onChange={(e) => setNewBranchForm({...newBranchForm, name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="branch-source">源分支</Label>
              <Select value={newBranchForm.sourcebranch} onValueChange={(value) => setNewBranchForm({...newBranchForm, sourcebranch: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.name}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="branch-description">分支描述</Label>
              <Textarea
                id="branch-description"
                placeholder="描述此分支的主要功能和目标..."
                value={newBranchForm.description}
                onChange={(e) => setNewBranchForm({...newBranchForm, description: e.target.value})}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={newBranchForm.isProtected}
                onCheckedChange={(checked) => setNewBranchForm({...newBranchForm, isProtected: checked})}
              />
              <Label>保护分支</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateBranchDialog(false)}>
              取消
            </Button>
            <Button onClick={handleCreateBranch}>
              创建分支
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 版本详情对话框 */}
      <Dialog open={showVersionDetailsDialog} onOpenChange={setShowVersionDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              版本详情 - {selectedVersion?.modelName} v{selectedVersion?.version}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            <div className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">基本信息</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">版本号：</span>
                      <span>{selectedVersion?.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">类型：</span>
                      <span>{selectedVersion?.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">状态：</span>
                      <Badge className={getStatusColor(selectedVersion?.status)}>
                        {selectedVersion?.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">大小：</span>
                      <span>{selectedVersion?.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">哈希：</span>
                      <code className="text-xs bg-gray-100 px-1 rounded">{selectedVersion?.hash}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">项目：</span>
                      <span>{selectedVersion?.project}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">分支：</span>
                      <span>{selectedVersion?.branch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">RFLP类别：</span>
                      <span>{selectedVersion?.rflpCategory}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">测试结果</h4>
                  <div className="space-y-2">
                    {Object.entries(selectedVersion?.testResults || {}).map(([key, value]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">
                            {key === 'accuracy' ? '准确度' :
                             key === 'performance' ? '性能' :
                             key === 'stability' ? '稳定性' :
                             key === 'coverage' ? '覆盖率' : key}：
                          </span>
                          <span>{value}%</span>
                        </div>
                        <Progress value={Number(value)} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* 变更日志 */}
              <div>
                <h4 className="font-medium mb-3">变更日志</h4>
                <div className="space-y-2">
                  {selectedVersion?.changes?.map((change: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      {getChangeIcon(change.type)}
                      <div>
                        <span className="text-sm font-medium capitalize">
                          {change.type === 'added' ? '新增' :
                           change.type === 'improved' ? '改进' :
                           change.type === 'fixed' ? '修复' :
                           change.type === 'removed' ? '移除' : change.type}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">{change.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 依赖关系 */}
              <div>
                <h4 className="font-medium mb-3">依赖关系</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedVersion?.dependencies?.map((dep: string, index: number) => (
                    <Badge key={index} variant="outline">{dep}</Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 审批信息 */}
              <div>
                <h4 className="font-medium mb-3">审批信息</h4>
                <div className="space-y-2">
                  {selectedVersion?.approvals?.map((approval, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="font-medium">{approval.reviewer}</span>
                        <span className="text-sm">
                          {approval.status === 'approved' ? '已批准' : '未批准'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {approval.comment}
                      </div>
                      <div className="text-xs text-gray-500">
                        {approval.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 指标信息 */}
              <div>
                <h4 className="font-medium mb-3">指标信息</h4>
                <div className="space-y-2">
                  {Object.entries(selectedVersion?.metrics || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-gray-600">{key}：</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVersionDetailsDialog(false)}>
              关闭
            </Button>
            <Button onClick={() => toast.success('下载已开始')}>
              <Download className="w-4 h-4 mr-2" />
              下载版本
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}