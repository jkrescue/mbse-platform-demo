import { useState } from 'react'
import {
  Plus,
  Search,
  Filter,
  FolderKanban,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  MoreVertical,
  Eye,
  Edit,
  Archive,
  Trash2
} from 'lucide-react@0.487.0'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Project, ProjectStatus, ProjectType, ProjectPhase } from '../../types/project'
import { projectService } from '../../services/ProjectService'
import { useAuth } from '../AuthContext'
import { ProjectCreationWizard } from './ProjectCreationWizard'
import { toast } from 'sonner@2.0.3'
import { Progress } from '../ui/progress'

interface ProjectHubProps {
  onViewProject: (projectId: string) => void
}

export function ProjectHub({ onViewProject }: ProjectHubProps) {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [showCreateWizard, setShowCreateWizard] = useState(false)

  // 获取项目列表
  const allProjects = projectService.getProjects()
  const userProjects = user?.role === 'admin'
    ? allProjects
    : allProjects.filter(p =>
        p.ownerId === user?.id || p.teamMembers.some(m => m.userId === user?.id)
      )

  // 应用过滤
  const filteredProjects = userProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesType = typeFilter === 'all' || project.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  // 统计数据
  const stats = projectService.getStatistics(user?.id, user?.role)

  const getProjectTypeName = (type: ProjectType) => {
    const typeNames: Record<ProjectType, string> = {
      vehicle: '整车',
      powertrain: '三电',
      battery: '电池',
      custom: '自定义'
    }
    return typeNames[type]
  }

  const getProjectPhaseName = (phase: ProjectPhase) => {
    const phaseNames: Record<ProjectPhase, string> = {
      concept: '概念',
      design: '设计',
      validation: '验证',
      production: '量产'
    }
    return phaseNames[phase]
  }

  const getProjectPhaseColor = (phase: ProjectPhase) => {
    const colors: Record<ProjectPhase, string> = {
      concept: 'bg-purple-100 text-purple-700 border-purple-200',
      design: 'bg-blue-100 text-blue-700 border-blue-200',
      validation: 'bg-green-100 text-green-700 border-green-200',
      production: 'bg-orange-100 text-orange-700 border-orange-200'
    }
    return colors[phase]
  }

  const getStatusBadge = (status: ProjectStatus) => {
    const statusConfig: Record<ProjectStatus, { label: string; color: string }> = {
      active: { label: '进行中', color: 'bg-green-100 text-green-700 border-green-200' },
      archived: { label: '已归档', color: 'bg-gray-100 text-gray-700 border-gray-200' },
      onhold: { label: '暂停', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
    }
    const config = statusConfig[status]
    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const handleArchiveProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    projectService.archiveProject(projectId)
    toast.success('项目已归档')
  }

  const handleDeleteProject = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm('确定要删除该项目吗？此操作不可恢复。')) {
      projectService.deleteProject(projectId)
      toast.success('项目已删除')
    }
  }

  const formatCurrency = (amount: number, currency: 'CNY' | 'USD') => {
    const symbol = currency === 'CNY' ? '¥' : '$'
    if (amount >= 10000) {
      return `${symbol}${(amount / 10000).toFixed(1)}亿`
    }
    return `${symbol}${amount}万`
  }

  const calculateRemainingDays = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div className="space-y-6">
      {/* 头部统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总项目数</p>
                <p className="text-2xl font-bold mt-1">{stats.totalProjects}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FolderKanban className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">进行中</p>
                <p className="text-2xl font-bold mt-1">{stats.activeProjects}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总预算</p>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(stats.totalBudget, 'CNY')}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">平均进度</p>
                <p className="text-2xl font-bold mt-1">
                  {stats.averageProgress.toFixed(0)}%
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索项目名称或代号..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="active">进行中</SelectItem>
              <SelectItem value="onhold">暂停</SelectItem>
              <SelectItem value="archived">已归档</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="vehicle">整车</SelectItem>
              <SelectItem value="powertrain">三电</SelectItem>
              <SelectItem value="battery">电池</SelectItem>
              <SelectItem value="custom">自定义</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(user?.role === 'admin' || user?.role === 'projectManager') && (
          <Button onClick={() => setShowCreateWizard(true)}>
            <Plus className="h-4 w-4 mr-2" />
            创建项目
          </Button>
        )}
      </div>

      {/* 项目列表 */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <FolderKanban className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
              ? '没有找到匹配的项目'
              : '暂无项目'}
          </p>
          {(user?.role === 'admin' || user?.role === 'projectManager') && (
            <Button onClick={() => setShowCreateWizard(true)}>
              <Plus className="h-4 w-4 mr-2" />
              创建第一个项目
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onViewProject(project.id)}
            >
              <CardContent className="p-6">
                {/* 项目头部 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0 mr-2">
                    <h3 className="font-medium truncate mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.code}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        onViewProject(project.id)
                      }}>
                        <Eye className="h-4 w-4 mr-2" />
                        查看详情
                      </DropdownMenuItem>
                      {project.status === 'active' && (
                        <DropdownMenuItem onClick={(e) => handleArchiveProject(project.id, e)}>
                          <Archive className="h-4 w-4 mr-2" />
                          归档项目
                        </DropdownMenuItem>
                      )}
                      {user?.role === 'admin' && (
                        <DropdownMenuItem
                          onClick={(e) => handleDeleteProject(project.id, e)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除项目
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* 标签行 */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {getStatusBadge(project.status)}
                  <Badge variant="outline">
                    {getProjectTypeName(project.type)}
                  </Badge>
                  <Badge variant="outline" className={getProjectPhaseColor(project.phase)}>
                    {getProjectPhaseName(project.phase)}
                  </Badge>
                </div>

                {/* 描述 */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* 进度 */}
                {project.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">项目进度</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                )}

                {/* 统计信息 */}
                <div className="grid grid-cols-3 gap-4 mb-4 pt-4 border-t">
                  <div>
                    <p className="text-xs text-gray-500">工作流</p>
                    <p className="text-sm font-medium">{project.workflowCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">模型</p>
                    <p className="text-sm font-medium">{project.modelCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">应用</p>
                    <p className="text-sm font-medium">{project.appCount || 0}</p>
                  </div>
                </div>

                {/* 底部信息 */}
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{project.teamMembers.length} 人</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {calculateRemainingDays(project.endDate) > 0
                        ? `剩余 ${calculateRemainingDays(project.endDate)} 天`
                        : '已逾期'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span>{formatCurrency(project.budget, project.currency)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 创建项目向导 */}
      <ProjectCreationWizard
        open={showCreateWizard}
        onClose={() => setShowCreateWizard(false)}
        onSuccess={(projectId) => {
          // 创建成功后跳转到项目详情
          onViewProject(projectId)
        }}
      />
    </div>
  )
}
