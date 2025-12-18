import { useState, useEffect } from "react";
import { 
  Lightbulb, 
  Star, 
  Target, 
  TrendingUp, 
  Users, 
  Clock, 
  ChevronRight,
  Filter,
  RefreshCw,
  X
} from "lucide-react@0.487.0";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner@2.0.3";

interface WorkflowRecommendationPanelProps {
  workflows: any[];
  userRole?: string;
  onWorkflowClick?: (workflow: any) => void;
  onClose?: () => void;
}

export function WorkflowRecommendationPanel({ 
  workflows, 
  userRole, 
  onWorkflowClick,
  onClose
}: WorkflowRecommendationPanelProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedRecommendationType, setSelectedRecommendationType] = useState("role-based");

  // 获取角色显示名称
  const getRoleDisplayName = (role: string) => {
    switch(role) {
      case 'admin': return '平台管理员';
      case 'projectManager': return '项目经理';
      case 'architect': return '系统架构师';
      case 'simulation': return '仿真工程师';
      case 'modeling': return '建模工程师';
      default: return '用户';
    }
  };

  // 获取工作流相关性
  const getWorkflowRelevance = (workflow: any) => {
    if (!userRole || !workflow.roleRelevance) return "低";
    return workflow.roleRelevance[userRole] || "低";
  };

  // 基于角色的推荐
  const getRoleBasedRecommendations = () => {
    if (!userRole) return [];
    
    return workflows
      .filter(workflow => {
        const relevance = getWorkflowRelevance(workflow);
        return relevance === "高" || relevance === "中";
      })
      .sort((a, b) => {
        // 先按相关性排序，再按运行次数
        const aRelevance = getWorkflowRelevance(a);
        const bRelevance = getWorkflowRelevance(b);
        const relevanceOrder = { "高": 3, "中": 2, "低": 1 };
        
        const relevanceComparison = (relevanceOrder[bRelevance as keyof typeof relevanceOrder] || 1) - 
                                   (relevanceOrder[aRelevance as keyof typeof relevanceOrder] || 1);
        
        if (relevanceComparison !== 0) return relevanceComparison;
        
        return b.runCount - a.runCount;
      })
      .slice(0, 5);
  };

  // 热门推荐（基于运行次数）
  const getPopularRecommendations = () => {
    return workflows
      .filter(workflow => workflow.runCount > 0)
      .sort((a, b) => b.runCount - a.runCount)
      .slice(0, 5);
  };

  // 最新推荐（基于创建时间）
  const getLatestRecommendations = () => {
    return workflows
      .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
      .slice(0, 5);
  };

  // 智能推荐（综合算法）
  const getSmartRecommendations = () => {
    if (!userRole) return getPopularRecommendations();

    return workflows
      .map(workflow => {
        const relevance = getWorkflowRelevance(workflow);
        const relevanceScore = relevance === "高" ? 3 : relevance === "中" ? 2 : 1;
        const popularityScore = Math.min(workflow.runCount / 10, 3); // 标准化到0-3分
        const recencyScore = (() => {
          const daysSinceCreation = (Date.now() - new Date(workflow.createTime).getTime()) / (1000 * 60 * 60 * 24);
          return Math.max(3 - daysSinceCreation / 30, 0); // 30天内的工作流得分更高
        })();
        
        const totalScore = relevanceScore * 0.5 + popularityScore * 0.3 + recencyScore * 0.2;
        
        return { ...workflow, smartScore: totalScore };
      })
      .sort((a, b) => b.smartScore - a.smartScore)
      .slice(0, 5);
  };

  // 获取推荐类型的工作流
  const getRecommendationsByType = (type: string) => {
    switch(type) {
      case "role-based": return getRoleBasedRecommendations();
      case "popular": return getPopularRecommendations();
      case "latest": return getLatestRecommendations();
      case "smart": return getSmartRecommendations();
      default: return [];
    }
  };

  // 获取相关性标签
  const getRelevanceBadge = (workflow: any) => {
    const relevance = getWorkflowRelevance(workflow);
    const colors: Record<string, string> = {
      高: "bg-red-100 text-red-700 border-red-200",
      中: "bg-yellow-100 text-yellow-700 border-yellow-200",
      低: "bg-gray-100 text-gray-700 border-gray-200",
    };

    if (!userRole || relevance === "低") return null;

    return (
      <Badge
        variant="outline"
        className={`${colors[relevance]} text-xs`}
        title={`与${getRoleDisplayName(userRole)}的相关度：${relevance}`}
      >
        {relevance === "高" ? <Star className="w-3 h-3 mr-1" /> : <Target className="w-3 h-3 mr-1" />}
        {relevance}
      </Badge>
    );
  };

  // 刷新推荐
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast.success("推荐已刷新");
  };

  // 推荐类型配置
  const recommendationTypes = [
    {
      id: "role-based",
      name: "角色推荐",
      icon: Users,
      description: userRole ? `为${getRoleDisplayName(userRole)}量身定制` : "基于角色的推荐",
      count: getRoleBasedRecommendations().length
    },
    {
      id: "smart",
      name: "智能推荐", 
      icon: Lightbulb,
      description: "综合分析的最佳选择",
      count: getSmartRecommendations().length
    },
    {
      id: "popular",
      name: "热门推荐",
      icon: TrendingUp,
      description: "使用频率最高的工作流",
      count: getPopularRecommendations().length
    },
    {
      id: "latest",
      name: "最新推荐",
      icon: Clock,
      description: "最近创建的工作流",
      count: getLatestRecommendations().length
    }
  ];

  const handleWorkflowClick = (workflow: any) => {
    if (onWorkflowClick) {
      onWorkflowClick(workflow);
    }
    toast.info(`打开工作流: ${workflow.name}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h3 className="font-medium">智能推荐系统</h3>
          {userRole && (
            <Badge variant="outline" className="text-xs">
              {getRoleDisplayName(userRole)}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleRefresh}
            className="h-8 w-8 p-0"
            title="刷新推荐"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          {onClose && (
            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
              className="h-8 w-8 p-0"
              title="关闭推荐面板"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* 推荐类型选择 */}
      <div className="p-4 border-b border-gray-200">
        <Tabs value={selectedRecommendationType} onValueChange={setSelectedRecommendationType}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            {recommendationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <TabsTrigger key={type.id} value={type.id} className="flex items-center space-x-1">
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{type.name}</span>
                  <span className="sm:hidden">{type.name.slice(0, 2)}</span>
                  <Badge variant="secondary" className="text-xs ml-1">
                    {type.count}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {recommendationTypes.map((type) => (
            <TabsContent key={type.id} value={type.id} className="mt-4 space-y-3">
              {/* 类型描述 */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <type.icon className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-900">{type.name}</span>
                </div>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>

              {/* 推荐工作流列表 */}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {getRecommendationsByType(type.id).map((workflow, index) => (
                  <Card
                    key={`${workflow.id}-${refreshKey}`}
                    className="p-3 hover:shadow-md transition-all cursor-pointer border border-gray-200"
                    onClick={() => handleWorkflowClick(workflow)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm text-gray-900 truncate">
                            {workflow.name}
                          </span>
                          {getRelevanceBadge(workflow)}
                          <Badge variant="outline" className="text-xs">
                            {workflow.type}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {workflow.description}
                        </p>
                        
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <span>创建者: {workflow.creator}</span>
                          <span>运行 {workflow.runCount} 次</span>
                          <span>{workflow.priority}优先级</span>
                        </div>

                        {/* 推荐理由 */}
                        {type.id === "role-based" && userRole && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
                            💡 此工作流与您的{getRoleDisplayName(userRole)}角色高度匹配
                          </div>
                        )}
                        
                        {type.id === "smart" && (
                          <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-700">
                            🎯 综合评分最高的推荐工作流
                          </div>
                        )}
                        
                        {type.id === "popular" && workflow.runCount > 5 && (
                          <div className="mt-2 p-2 bg-orange-50 rounded text-xs text-orange-700">
                            🔥 用户使用频率很高，值得尝试
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-2">
                        <span className="text-xs text-gray-400">#{index + 1}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </Card>
                ))}

                {getRecommendationsByType(type.id).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Lightbulb className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">暂无{type.name}内容</p>
                    {type.id === "role-based" && !userRole && (
                      <p className="text-xs mt-1">需要角色信息才能提供角色推荐</p>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* 底部统计 */}
      <div className="p-3 bg-gray-50 text-center">
        <p className="text-xs text-gray-600">
          基于 {workflows.length} 个工作流数据为您智能推荐
          {userRole && ` • ${getRoleDisplayName(userRole)}专属定制`}
        </p>
      </div>
    </div>
  );
}