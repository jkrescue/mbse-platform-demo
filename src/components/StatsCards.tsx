import { useState } from "react"
import { TrendingUp, Activity, CheckCircle, Edit, Star, Target, Users, Brain } from "lucide-react@0.487.0"
import { Switch } from "./ui/switch"

interface StatsCardsProps {
  onFilterChange?: (filter: string) => void
  userRole?: string
  workflowCount?: number
  workflows?: any[]
  onRecommendationToggle?: (enabled: boolean) => void
}

export function StatsCards({ onFilterChange, userRole, workflowCount, workflows = [], onRecommendationToggle }: StatsCardsProps) {
  // 智能推荐开关状态，默认开启
  const [recommendationEnabled, setRecommendationEnabled] = useState(true)
  
  // 处理推荐开关变化
  const handleRecommendationToggle = (checked: boolean) => {
    setRecommendationEnabled(checked)
    if (onRecommendationToggle) {
      onRecommendationToggle(checked)
    }
  }
  // 动态计算各状态的工作流数量
  const draftCount = workflows.filter(w => w && w.status === "草稿").length
  const reviewingCount = workflows.filter(w => w && w.status === "审核中").length
  const publishedCount = workflows.filter(w => w && w.status === "已发布").length
  const totalCount = workflows.length

  // 筛选公共工作流（用于推荐统计）
  const publicWorkflows = workflows.filter(workflow => workflow && workflow.category === "public")

  // 基于角色相关性计算推荐工作流数量（仅统计公共工作流）
  const getRecommendedWorkflows = () => {
    if (!userRole) return publicWorkflows
    
    return publicWorkflows.filter(workflow => {
      if (!workflow) return false
      const roleRelevance = workflow.roleRelevance
      if (!roleRelevance) return true
      
      const relevanceLevel = roleRelevance[userRole]
      return relevanceLevel === "高" || relevanceLevel === "中"
    })
  }

  const recommendedWorkflows = getRecommendedWorkflows()
  const recommendedCount = recommendedWorkflows.length

  // 计算高相关度工作流数量（仅统计公共工作流）
  const highRelevanceCount = publicWorkflows.filter(workflow => {
    if (!workflow) return false
    const roleRelevance = workflow.roleRelevance
    if (!roleRelevance || !userRole) return false
    return roleRelevance[userRole] === "高"
  }).length

  const getRoleDisplayName = (role: string) => {
    switch(role) {
      case 'admin': return '平台管理员'
      case 'projectManager': return '项目经理'
      case 'architect': return '系统架构师'
      case 'simulation': return '仿真工程师'
      case 'modeling': return '建模工程师'
      default: return '用户'
    }
  }

  const stats = [
    {
      label: "总工作流",
      value: String(totalCount),
      change: "+12%",
      trend: "up",
      icon: Activity,
      color: "blue",
      filter: "all",
      description: "查看所有工作流"
    },
    {
      label: "推荐工作流",
      value: recommendationEnabled ? String(recommendedCount) : "-",
      change: recommendationEnabled ? `${userRole ? '基于角色' : '通用推荐'}` : "已关闭",
      trend: "neutral",
      icon: Star,
      color: recommendationEnabled ? "purple" : "gray",
      filter: recommendationEnabled ? "recommended" : "all",
      description: recommendationEnabled 
        ? (userRole ? `为${getRoleDisplayName(userRole)}推荐的相关工作流` : "查看推荐的工作流")
        : "智能推荐功能已关闭，点击下方开关开启"
    },
    {
      label: "高相关度",
      value: recommendationEnabled ? String(highRelevanceCount) : "-",
      change: recommendationEnabled ? (userRole ? `${getRoleDisplayName(userRole)}` : "通用") : "已关闭",
      trend: "neutral",
      icon: Target,
      color: recommendationEnabled ? "orange" : "gray",
      filter: recommendationEnabled ? "high-relevance" : "all",
      description: recommendationEnabled 
        ? (userRole ? `与${getRoleDisplayName(userRole)}高度相关的工作流` : "查看高相关度工作流")
        : "智能推荐功能已关闭，点击下方开关开启"
    },
    {
      label: "已发布",
      value: String(publishedCount),
      change: "+8%",
      trend: "up",
      icon: CheckCircle,
      color: "green",
      filter: "published",
      description: "查看已发布的工作流"
    }
  ]

  // 如果是管理员角色，展示不同的统计视图
  if (userRole === 'admin') {
    stats[1] = {
      label: "草稿工作流",
      value: String(draftCount),
      change: "+5%",
      trend: "up", 
      icon: Edit,
      color: "gray",
      filter: "draft",
      description: "查看草稿状态的工作流"
    }
    
    stats[2] = {
      label: "审核中",
      value: String(reviewingCount),
      change: "+3%",
      trend: "up",
      icon: TrendingUp,
      color: "yellow",
      filter: "reviewing",
      description: "查看审核中的工作流"
    }
  }

  const handleCardClick = (filter: string) => {
    if (onFilterChange && filter) {
      onFilterChange(filter)
    }
  }

  return (
    <div className="space-y-6">
      {/* 角色信息提示 */}
      {userRole && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900">当前角色视图</h3>
              <p className="text-sm text-blue-800">
                您正在以 <span className="font-medium">{getRoleDisplayName(userRole)}</span> 身份浏览工作流，
                系统已为您优化显示相关内容和推荐。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          if (!stat || !stat.icon) return null;
          const Icon = stat.icon
          return (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer group stats-card"
              onClick={() => handleCardClick(stat.filter)}
              title={stat.description}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1 group-hover:text-gray-800 transition-colors">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full transition-all ${
                      stat.trend === 'up' 
                        ? 'text-green-700 bg-green-100 group-hover:bg-green-200' 
                        : stat.trend === 'down'
                        ? 'text-red-700 bg-red-100 group-hover:bg-red-200'
                        : 'text-blue-700 bg-blue-100 group-hover:bg-blue-200'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full transition-all group-hover:scale-110 ${
                  stat.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' :
                  stat.color === 'green' ? 'bg-green-100 group-hover:bg-green-200' :
                  stat.color === 'yellow' ? 'bg-yellow-100 group-hover:bg-yellow-200' :
                  stat.color === 'purple' ? 'bg-purple-100 group-hover:bg-purple-200' :
                  stat.color === 'orange' ? 'bg-orange-100 group-hover:bg-orange-200' :
                  'bg-gray-100 group-hover:bg-gray-200'
                }`}>
                  <Icon className={`w-6 h-6 transition-colors ${
                    stat.color === 'blue' ? 'text-blue-600 group-hover:text-blue-700' :
                    stat.color === 'green' ? 'text-green-600 group-hover:text-green-700' :
                    stat.color === 'yellow' ? 'text-yellow-600 group-hover:text-yellow-700' :
                    stat.color === 'purple' ? 'text-purple-600 group-hover:text-purple-700' :
                    stat.color === 'orange' ? 'text-orange-600 group-hover:text-orange-700' :
                    'text-gray-600 group-hover:text-gray-700'
                  }`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 智能推荐提示 */}
      {userRole && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Brain className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-purple-900">智能推荐系统</h4>
                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                  <span className="text-xs text-purple-700">
                    {recommendationEnabled ? '已开启' : '已关闭'}
                  </span>
                  <Switch
                    checked={recommendationEnabled}
                    onCheckedChange={handleRecommendationToggle}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </div>
              </div>
              <p className="text-sm text-purple-800">
                {recommendationEnabled ? (
                  <>
                    基于您的角色特点，系统从 {totalCount} 个工作流中为您筛选出 {recommendedCount} 个相关工作流，
                    其中 {highRelevanceCount} 个具有高相关度。点击相应卡片快速查看。
                  </>
                ) : (
                  <>
                    智能推荐功能已关闭。开启后，系统将根据您的角色特点为您推荐相关工作流。
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}