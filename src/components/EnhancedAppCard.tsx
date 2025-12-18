import { useState } from "react";
import { 
  Star, 
  Eye, 
  Download, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Copy, 
  Upload, 
  Heart,
  Package,
  Wrench,
  Brain,
  Globe,
  ChevronDown,
  Info
} from "lucide-react@0.487.0";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { AppDependencies } from "../types/appDependencies";
import { componentLibraryService } from "../services/ComponentLibraryService";

interface EnhancedAppCardProps {
  app: {
    id: number;
    title: string;
    author: string;
    description: string;
    tags: string[];
    likes: number;
    views: number;
    downloads: number;
    icon: string;
    color: string;
    status?: string;
  };
  onClick?: () => void;
  onAction?: (action: string, app: any) => void;
  category?: 'personal' | 'public' | 'favorite';
  dependencies?: AppDependencies;
  onDependencyClick?: (type: string, dependency: any) => void;
  showDependencies?: boolean;
}

export function EnhancedAppCard({ 
  app, 
  onClick, 
  onAction, 
  category = 'public',
  dependencies,
  onDependencyClick,
  showDependencies = true
}: EnhancedAppCardProps) {
  const [showFullDependencies, setShowFullDependencies] = useState(false);
  const [selectedDependencyType, setSelectedDependencyType] = useState<string | null>(null);

  const handleActionClick = (action: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onAction) {
      onAction(action, app);
    }
  };

  const getActionsForCategory = () => {
    switch (category) {
      case 'personal':
        return [
          { action: 'edit', label: '编辑', icon: Edit },
          { action: 'publish', label: '发布', icon: Upload },
          { action: 'delete', label: '删除', icon: Trash2 },
        ];
      case 'favorite':
        return [
          { action: 'copy', label: '复制', icon: Copy },
          { action: 'delete', label: '取消收藏', icon: Trash2 },
        ];
      case 'public':
      default:
        return [
          { action: 'copy', label: '复制', icon: Copy },
          { action: 'favorite', label: '收藏', icon: Heart },
        ];
    }
  };

  const actions = getActionsForCategory();

  return (
    <TooltipProvider>
      <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group">
        {/* 主要内容区域 - 点击可跳转 */}
        <div className="p-6" onClick={onClick}>
          {/* App Icon and Info */}
          <div className="flex items-start space-x-4 mb-4">
            <div className={`w-12 h-12 rounded-xl ${app.color} flex items-center justify-center text-white text-lg flex-shrink-0`}>
              {app.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{app.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="text-xs bg-gray-200">
                        {app.author.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{app.author}</span>
                    {/* 依赖健康状态指示器 */}
                    {dependencies && (
                      <DependencyHealthIndicator dependencies={dependencies} />
                    )}
                  </div>
                </div>
                {/* Actions Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {actions.map(({ action, label, icon: Icon }) => (
                      <DropdownMenuItem
                        key={action}
                        onClick={(e) => handleActionClick(action, e)}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          {app.status && (
            <div className="mb-3">
              <Badge 
                variant={app.status === '已发布' ? 'default' : 'secondary'}
                className="text-xs"
              >
                {app.status}
              </Badge>
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">{app.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {app.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {app.tags.length > 3 && (
              <Badge variant="outline" className="text-xs text-gray-500">
                +{app.tags.length - 3} 更多
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>{app.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{app.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Download className="w-4 h-4" />
                <span>{app.downloads}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 依赖区域 - 独立交互区域 */}
        {showDependencies && dependencies && (
          <div className="border-t bg-gray-50/50">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  技术栈依赖
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFullDependencies(!showFullDependencies);
                  }}
                  className="text-xs h-7 px-3 hover:bg-white"
                >
                  {showFullDependencies ? "收起" : "展开"}
                  <ChevronDown className={`ml-1 h-3 w-3 transition-transform duration-200 ${
                    showFullDependencies ? "rotate-180" : ""
                  }`} />
                </Button>
              </div>
              
              {/* 只在展开时显示依赖内容 */}
              {showFullDependencies && (
                <>
                  <DependencyTagsSection
                    dependencies={dependencies}
                    showFullDependencies={showFullDependencies}
                    onDependencyClick={onDependencyClick}
                    onTypeFilter={setSelectedDependencyType}
                    selectedType={selectedDependencyType}
                  />
                  
                  {/* 依赖统计摘要 */}
                  <DependencySummary dependencies={dependencies} />
                </>
              )}
              
              {/* 收起时显示简化摘要 */}
              {!showFullDependencies && (
                <div className="text-xs text-gray-600">
                  <DependencySummary dependencies={dependencies} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

// 依赖健康状态指示器
function DependencyHealthIndicator({ dependencies }: { dependencies: AppDependencies }) {
  const healthScore = dependencies.healthScore || 85;
  const healthColor = healthScore >= 80 ? 'green' : 
                      healthScore >= 60 ? 'yellow' : 'red';
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`w-2 h-2 rounded-full bg-${healthColor}-500`} />
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-sm">
          <div>依赖健康度: {healthScore}%</div>
          <div className="text-gray-500">点击查看详情</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

// 依赖标签区域组件
function DependencyTagsSection({ 
  dependencies, 
  showFullDependencies, 
  onDependencyClick,
  onTypeFilter,
  selectedType 
}: {
  dependencies: AppDependencies;
  showFullDependencies: boolean;
  onDependencyClick?: (type: string, dependency: any) => void;
  onTypeFilter: (type: string | null) => void;
  selectedType: string | null;
}) {
  // 移除API依赖类型，只保留来自组件库的三种类型
  const dependencyTypes = [
    {
      key: 'components',
      label: '组件',
      icon: Package,
      color: 'blue',
      count: dependencies.components?.length || 0
    },
    {
      key: 'toolServices', 
      label: '工具',
      icon: Wrench,
      color: 'green',
      count: dependencies.toolServices?.length || 0
    },
    {
      key: 'modelVersions',
      label: '模型',
      icon: Brain,
      color: 'purple',
      count: dependencies.modelVersions?.length || 0
    }
  ];
  
  return (
    <div className="space-y-3">
      {/* 依赖类型过滤器 */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedType === null ? "default" : "outline"}
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onTypeFilter(null);
          }}
          className="text-xs h-6 px-2"
        >
          全部
        </Button>
        {dependencyTypes.map(type => (
          <Button
            key={type.key}
            variant={selectedType === type.key ? "default" : "outline"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onTypeFilter(type.key);
            }}
            className="text-xs h-6 px-2"
          >
            <type.icon className="w-3 h-3 mr-1" />
            {type.label}
            {type.count > 0 && (
              <Badge variant="secondary" className="ml-1 text-xs px-1 h-4">
                {type.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>
      
      {/* 依赖标签列表 */}
      <div className="space-y-2">
        {dependencyTypes.map(type => (
          <DependencyTypeSection
            key={type.key}
            type={type}
            dependencies={(dependencies as any)[type.key] || []}
            isVisible={selectedType === null || selectedType === type.key}
            showAll={showFullDependencies}
            onDependencyClick={(dep) => onDependencyClick?.(type.key, dep)}
          />
        ))}
      </div>
    </div>
  );
}

// 单个依赖类型展示区域
function DependencyTypeSection({ 
  type, 
  dependencies, 
  isVisible, 
  showAll, 
  onDependencyClick 
}: {
  type: any;
  dependencies: any[];
  isVisible: boolean;
  showAll: boolean;
  onDependencyClick: (dep: any) => void;
}) {
  if (!isVisible || dependencies.length === 0) return null;
  
  const displayDependencies = showAll ? dependencies : dependencies.slice(0, 3);
  const hasMore = dependencies.length > 3 && !showAll;
  
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <type.icon className={`w-4 h-4 text-${type.color}-500`} />
        <span className="text-sm font-medium text-gray-700">{type.label}</span>
        <span className="text-xs text-gray-500">({dependencies.length})</span>
      </div>
      
      <div className="flex flex-wrap gap-1">
        {displayDependencies.map((dep, index) => (
          <DependencyTag
            key={dep.id || index}
            dependency={dep}
            type={type}
            onClick={(e) => {
              e.stopPropagation();
              onDependencyClick(dep);
            }}
          />
        ))}
        
        {hasMore && (
          <Badge variant="outline" className="text-xs cursor-pointer">
            +{dependencies.length - 3} 更多
          </Badge>
        )}
      </div>
    </div>
  );
}

// 单个依赖标签组件
function DependencyTag({ dependency, type, onClick }: {
  dependency: any;
  type: any;
  onClick: (e: React.MouseEvent) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable': case 'active': return 'green';
      case 'beta': return 'yellow';
      case 'deprecated': case 'maintenance': return 'red';
      default: return 'gray';
    }
  };

  // 从统一组件库获取组件详细信息
  const getComponentDetails = (dep: any) => {
    if (type.key === 'components') {
      return componentLibraryService.getComponent(dep.id) || dep;
    } else if (type.key === 'toolServices') {
      return componentLibraryService.getToolService(dep.id) || dep;
    } else if (type.key === 'modelVersions') {
      return componentLibraryService.getModel(dep.id) || dep;
    }
    return dep;
  };

  const componentDetails = getComponentDetails(dependency);
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-flex items-center gap-1">
          <Badge
            variant="outline"
            className={`text-xs cursor-pointer hover:shadow-sm transition-shadow border-${type.color}-200 hover:border-${type.color}-400 dependency-badge`}
            onClick={onClick}
          >
            <div className={`w-2 h-2 rounded-full bg-${getStatusColor(componentDetails.status || dependency.status)}-500 mr-1`} />
            {componentDetails.name || dependency.name}
          </Badge>
          {(componentDetails.version || dependency.version) && (
            <Badge 
              variant="secondary" 
              className="text-xs px-1.5 py-0.5 h-5 text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              v{componentDetails.version || dependency.version}
            </Badge>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-sm max-w-xs">
          <div className="font-medium">{componentDetails.name || dependency.name}</div>
          <div className="text-gray-500">版本: {componentDetails.version || dependency.version}</div>
          <div className="text-gray-500">状态: {componentDetails.status || dependency.status}</div>
          {(componentDetails.metadata?.description || componentDetails.description || dependency.description) && (
            <div className="text-gray-600 mt-1">
              {componentDetails.metadata?.description || componentDetails.description || dependency.description}
            </div>
          )}
          {componentDetails.metadata?.author && (
            <div className="text-gray-500 mt-1">作者: {componentDetails.metadata.author}</div>
          )}
          {componentDetails.usageCount && (
            <div className="text-gray-500">使用次数: {componentDetails.usageCount}</div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

// 依赖统计摘要
function DependencySummary({ dependencies }: { dependencies: AppDependencies }) {
  const stats = {
    total: (dependencies.components?.length || 0) + 
           (dependencies.toolServices?.length || 0) + 
           (dependencies.modelVersions?.length || 0),
    
    deprecated: [
      ...(dependencies.components?.filter(c => c.status === 'deprecated') || []),
      ...(dependencies.toolServices?.filter(t => t.status === 'deprecated') || []),
      ...(dependencies.modelVersions?.filter(m => m.status === 'deprecated') || [])
    ].length,
    
    critical: dependencies.dependencyGraph?.filter(n => n.properties.critical).length || 0
  };
  
  return (
    <div className="flex items-center gap-4 pt-2 text-xs text-gray-600">
      <span>总计 {stats.total} 个依赖</span>
      {stats.deprecated > 0 && (
        <span className="text-orange-600">
          ⚠️ {stats.deprecated} 个过期
        </span>
      )}
      {stats.critical > 0 && (
        <span className="text-red-600">
          🔥 {stats.critical} 个关键
        </span>
      )}
    </div>
  );
}