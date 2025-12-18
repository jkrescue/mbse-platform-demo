import { useState } from 'react'
import {
  ArrowLeft,
  Edit,
  Download,
  Archive,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  GitBranch,
  Database,
  AppWindow,
  AlertCircle,
  CheckCircle,
  Clock,
  ListChecks
} from 'lucide-react@0.487.0'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb'
import { Project, ProjectPhase, ProjectType } from '../../types/project'
import { projectService } from '../../services/ProjectService'
import { MilestoneGantt } from './MilestoneGantt'
import { ResourceHeatmap } from './ResourceHeatmap'
import { RiskRadar } from './RiskRadar'
import { TaskManagement } from '../task'
import { useAuth } from '../AuthContext'
import { PresetMetricsInitializer } from '../metrics'

interface ProjectDashboardProps {
  projectId: string
  onBack: () => void
}

export function ProjectDashboard({ projectId, onBack }: ProjectDashboardProps) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks'>('overview')
  const project = projectService.getProject(projectId)
  const kpi = projectService.getProjectKPI(projectId)
  const links = projectService.getProjectLinks(projectId)

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">项目不存在</p>
        <Button onClick={onBack} className="mt-4">返回</Button>
      </div>
    )
  }

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
      concept: '概念设计',
      design: '详细设计',
      validation: '验证测试',
      production: '量产准备'
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

  const formatCurrency = (amount: number, currency: 'CNY' | 'USD') => {
    const symbol = currency === 'CNY' ? '¥' : '$'
    if (amount >= 10000) {
      return `${symbol}${(amount / 10000).toFixed(1)}亿`
    }
    return `${symbol}${amount}万`
  }

  const calculateRemainingDays = () => {
    const now = new Date()
    const end = new Date(project.endDate)
    const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  const calculateRemainingMonths = () => {
    const days = calculateRemainingDays()
    return Math.ceil(days / 30)
  }

  // 查找下一个里程碑
  const getNextMilestone = () => {
    const pending = project.milestones.filter(m => m.status === 'pending' || m.status === 'inprogress')
    return pending.sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime())[0]
  }

  const nextMilestone = getNextMilestone()

  const calculateDaysToMilestone = (targetDate: string) => {
    const now = new Date()
    const target = new Date(targetDate)
    const days = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <div className="space-y-6">
      {/* 面包屑导航 */}
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onBack()
                }}
              >
                项目中心
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{project.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回列表
        </Button>
      </div>

      {/* 项目头部 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
            <p className="text-blue-100 mb-3">{project.description}</p>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                {project.code}
              </Badge>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                {getProjectTypeName(project.type)}
              </Badge>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                {getProjectPhaseName(project.phase)}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
              <Edit className="h-4 w-4 mr-2" />
              编辑
            </Button>
            <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
            <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
              <Archive className="h-4 w-4 mr-2" />
              归档
            </Button>
          </div>
        </div>
      </div>

      {/* 标签页导航 */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'overview' | 'tasks')}>
        <TabsList className="bg-white border-b w-full justify-start rounded-none h-auto p-0">
          <TabsTrigger value="overview" className="gap-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            <TrendingUp className="h-4 w-4" />
            项目概览
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none">
            <ListChecks className="h-4 w-4" />
            任务管理
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">


      {/* 项目概况 */}
      <Card>
        <CardHeader>
          <CardTitle>项目概况</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <TrendingUp className="h-4 w-4" />
                <span>项目进度</span>
              </div>
              <div className="text-2xl font-bold">{project.progress}%</div>
              <Progress value={project.progress} className="mt-2 h-2" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <DollarSign className="h-4 w-4" />
                <span>成本使用</span>
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(project.actualCost || 0, project.currency)}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                预算: {formatCurrency(project.budget, project.currency)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Calendar className="h-4 w-4" />
                <span>剩余时间</span>
              </div>
              <div className="text-2xl font-bold">{calculateRemainingMonths()}个月</div>
              <div className="text-sm text-gray-500 mt-1">
                约 {calculateRemainingDays()} 天
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <Users className="h-4 w-4" />
                <span>团队成员</span>
              </div>
              <div className="text-2xl font-bold">{project.teamMembers.length}人</div>
              <div className="text-sm text-gray-500 mt-1">
                负责人: {project.ownerName}
              </div>
            </div>
          </div>

          {nextMilestone && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">下一里程碑: {nextMilestone.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      目标日期: {nextMilestone.targetDate} ({calculateDaysToMilestone(nextMilestone.targetDate)}天后)
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                  {nextMilestone.status === 'inprogress' ? '进行中' : '待开始'}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 关键指标 & 风险预警 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 关键指标达成情况 */}
        {kpi && (
          <Card>
            <CardHeader>
              <CardTitle>关键指标达成情况</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">进度达成率</span>
                  <span className="text-sm font-medium">
                    {kpi.schedule.actualProgress}% / {kpi.schedule.plannedProgress}%
                  </span>
                </div>
                <Progress value={(kpi.schedule.actualProgress / kpi.schedule.plannedProgress) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">成本控制率</span>
                  <span className="text-sm font-medium">
                    {((1 - Math.abs(kpi.cost.variance) / kpi.cost.plannedCost) * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress value={(1 - Math.abs(kpi.cost.variance) / kpi.cost.plannedCost) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">质量评分</span>
                  <span className="text-sm font-medium">{kpi.quality.complianceScore}分</span>
                </div>
                <Progress value={kpi.quality.complianceScore} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">测试覆盖率</span>
                  <span className="text-sm font-medium">{kpi.quality.testCoverage}%</span>
                </div>
                <Progress value={kpi.quality.testCoverage} className="h-2" />
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">开放缺陷:</span>
                    <span className="ml-2 font-medium text-red-600">{kpi.quality.defectCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">开放问题:</span>
                    <span className="ml-2 font-medium text-yellow-600">{kpi.quality.issueCount}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 风险雷达 */}
        {kpi && (
          <Card>
            <CardHeader>
              <CardTitle>风险预警</CardTitle>
            </CardHeader>
            <CardContent>
              <RiskRadar
                data={{
                  schedule: kpi.risk.riskScore,
                  cost: Math.min(100, Math.abs(kpi.cost.variance / kpi.cost.plannedCost) * 100),
                  quality: 100 - kpi.quality.complianceScore,
                  technology: (kpi.quality.defectCount / 20) * 100
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* 里程碑甘特图 */}
      <Card>
        <CardHeader>
          <CardTitle>里程碑进度</CardTitle>
        </CardHeader>
        <CardContent>
          <MilestoneGantt
            milestones={project.milestones}
            startDate={project.startDate}
            endDate={project.endDate}
          />
        </CardContent>
      </Card>

      {/* 资源使用情况 */}
      {kpi && (
        <Card>
          <CardHeader>
            <CardTitle>资源使用情况</CardTitle>
          </CardHeader>
          <CardContent>
            <ResourceHeatmap data={kpi.resource} />
          </CardContent>
        </Card>
      )}

      {/* 关联资源统计 */}
      <Card>
        <CardHeader>
          <CardTitle>关联资源</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <GitBranch className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">{links?.workflowIds.length || 0}</div>
              <div className="text-sm text-gray-600">工作流</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <Database className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">{links?.modelIds.length || 0}</div>
              <div className="text-sm text-gray-600">模型</div>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <AppWindow className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">{links?.appIds.length || 0}</div>
              <div className="text-sm text-gray-600">应用</div>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <Button variant="outline" className="flex-1">
              查看所有工作流
            </Button>
            <Button variant="outline" className="flex-1">
              查看所有模型
            </Button>
            <Button variant="outline" className="flex-1">
              查看所有应用
            </Button>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        {/* 任务管理标签页 */}
        <TabsContent value="tasks" className="mt-6">
          <div className="space-y-4">
            {/* 指标初始化入口 */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-900">指标体系</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      为任务关联项目指标，建立MBSE追溯链条
                    </p>
                  </div>
                  <PresetMetricsInitializer
                    projectId={projectId}
                    onInitialized={() => {
                      // 可以在这里添加刷新逻辑
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            <TaskManagement projectId={projectId} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
