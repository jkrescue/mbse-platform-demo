import { useState } from "react";
import {
  Grid,
  List,
  Search,
  Plus,
  ChevronDown,
  BarChart3,
  Star,
  Heart,
} from "lucide-react@0.487.0";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { AppCarousel } from "./AppCarousel";
import { AppCard } from "./AppCard";
import { EnhancedAppCard } from "./EnhancedAppCard";
import { AppListView } from "./AppListView";
import { AppStatistics } from "./statistics/AppStatistics";
import { OperationsPanel } from "./operations/OperationsPanel";
import { MockDependencyService } from "../services/MockDependencyService";
import { useSmartNavigation } from "../hooks/useSmartNavigation";
import { componentLibraryService } from "../services/ComponentLibraryService";
import { AppDependencies } from "../types/appDependencies";

const apps = [
  {
    id: 1,
    title: "整车动能安全",
    author: "jkzhang",
    description:
      "基于MBSE方法，集成STAP的功能安全分析，支持从需求分析到安全验证的全流程开发",
    tags: ["功能安全", "STAP", "整车分析"],
    likes: 24,
    views: 156,
    downloads: 89,
    icon: "🔒",
    color: "bg-purple-500",
    status: "已发布", // 公共应用都是已发布状态
  },
  {
    id: 2,
    title: "空调热管理",
    author: "jkzhang",
    description:
      "汽车空调系统热管理分析与仿真，支持多种工况下的热力学计算和性能优化",
    tags: ["热管理", "空调", "仿真"],
    likes: 18,
    views: 203,
    downloads: 67,
    icon: "❄️",
    color: "bg-cyan-500",
    status: "已发布",
  },
  {
    id: 3,
    title: "整车集成",
    author: "jkzhang",
    description:
      "整车系统集成分析工具，支持多学科优化和车身系统级仿真验证",
    tags: ["系统集成", "多学科", "优化"],
    likes: 32,
    views: 189,
    downloads: 124,
    icon: "🏗️",
    color: "bg-blue-500",
    status: "已发布",
  },
  {
    id: 4,
    title: "电池管理系统",
    author: "jkzhang",
    description:
      "电动汽车电池管理系统设计与分析，包含热管理、电量估算和安全保护功能",
    tags: ["电池管理", "热管理", "安全"],
    likes: 41,
    views: 267,
    downloads: 156,
    icon: "🔋",
    color: "bg-green-500",
    status: "已发布",
  },
  {
    id: 5,
    title: "车身结构分析",
    author: "jkzhang",
    description:
      "车身结构强度分析与优化，支持碰撞安全和轻量化设计验证",
    tags: ["结构分析", "碰撞安全", "轻量化"],
    likes: 28,
    views: 145,
    downloads: 98,
    icon: "🚗",
    color: "bg-orange-500",
    status: "已发布",
  },
  {
    id: 6,
    title: "动力总成匹配",
    author: "jkzhang",
    description:
      "动力系统匹配优化工具，支持发动机与变速器的最优匹配分析",
    tags: ["动力总成", "匹配优化", "性能"],
    likes: 35,
    views: 198,
    downloads: 142,
    icon: "⚙️",
    color: "bg-red-500",
    status: "已发布",
  },
  {
    id: 7,
    title: "整车能耗分析",
    author: "jkzhang",
    description:
      "电动汽车整车能耗分析与优化，涵盖车辆动力学、驱动系统、电池系统、热管理等全链路能量流仿真，支持多工况续航预测",
    tags: ["能耗分析", "能量管理", "续航优化"],
    likes: 29,
    views: 176,
    downloads: 103,
    icon: "⚡",
    color: "bg-yellow-500",
    status: "已发布",
  },
];

const categories = [
  { id: "all", label: "全部" },
  { id: "thermal", label: "热管理" },
  { id: "electric", label: "电控" },
  { id: "dynamics", label: "车身动力学" },
  { id: "safety", label: "功能安全" },
];

interface AppCenterProps {
  onAppClick?: (app: any) => void;
  onCreateApp?: (type?: string) => void;
  userApps?: any[];
  favoriteApps?: any[];
  onAppAction?: (action: string, app: any) => void;
  userRole?: string;
}

export function AppCenter({
  onAppClick,
  onCreateApp,
  userApps = [],
  favoriteApps = [],
  onAppAction,
  userRole,
}: AppCenterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">(
    "grid",
  );
  const [sortBy, setSortBy] = useState("latest");

  // 新增状态：管理员功能相关
  const [
    selectedAppsForOperations,
    setSelectedAppsForOperations,
  ] = useState<string[]>([]);
  const [showEnhancedCards, setShowEnhancedCards] =
    useState(true);

  // 智能导航Hook
  const { handleDependencyClick, InstantiationDialog } =
    useSmartNavigation();

  // 管理员权限检查
  const showAdminFeatures =
    userRole === "admin" || userRole === "projectManager";

  // Tab配置（移除管理员专属Tab，只保留核心功能Tab）
  const tabs = [
    { id: "all", title: "公共", icon: Star },
    { id: "favorites", title: "我收藏的", icon: Heart },
    { id: "published", title: "我创建的", icon: Plus },
  ];

  // 模拟应用依赖数据 - 使用统一组件库数据
  const generateAppDependencies = (
    appId: number,
  ): AppDependencies => {
    // 获取组件库中的组件作为依赖数据源
    const allComponents =
      componentLibraryService.getAllComponents();
    const allToolServices =
      componentLibraryService.getAllToolServices();
    const allModels = componentLibraryService.getAllModels();

    // 为不同应用选择不同的依赖组合
    const componentSelection =
      appId % 2 === 0
        ? allComponents.slice(0, 4 + (appId % 3))
        : allComponents.slice(2, 6 + (appId % 2));

    const toolSelection =
      appId % 3 === 0
        ? allToolServices.slice(0, 2)
        : allToolServices.slice(0, 1);

    const modelSelection =
      appId % 4 === 0 ? allModels.slice(0, 1) : [];

    return {
      appId: appId.toString(),
      lastUpdated: new Date().toISOString(),
      components: componentSelection,
      toolServices: toolSelection,
      modelVersions: modelSelection,
      dependencyGraph: [
        {
          id: "root-app",
          type: "component",
          name: "主应用",
          version: "1.0.0",
          dependencies: componentSelection.map((c) => c.id),
          dependents: [],
          properties: {
            critical: true,
            replaceable: false,
            impact: "high",
          },
        },
      ],
      healthScore: 85 + (appId % 15), // 模拟不同的健康分数
    };
  };

  // 处理依赖点击事件
  const handleAppDependencyClick = (
    dependencyType: string,
    dependency: any,
    sourceApp: any,
  ) => {
    handleDependencyClick(
      dependencyType,
      dependency,
      sourceApp,
    );
  };

  // 渲染应用卡片（增强版或普通版）
  const renderAppCard = (app: any, category: string) => {
    if (showEnhancedCards && showAdminFeatures) {
      // 使用统一组件库生成的依赖数据
      const dependencies = generateAppDependencies(app.id);
      return (
        <EnhancedAppCard
          key={app.id}
          app={app}
          onClick={() => onAppClick?.(app)}
          onAction={onAppAction}
          category={category as any}
          dependencies={dependencies}
          onDependencyClick={handleAppDependencyClick}
          showDependencies={true}
        />
      );
    } else {
      return (
        <AppCard
          key={app.id}
          app={app}
          onClick={() => onAppClick?.(app)}
          onAction={onAppAction}
          category={category as any}
        />
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Featured Apps Carousel */}
      <AppCarousel onAppClick={onAppClick} />

      {/* Main Content */}
      <div className="bg-white rounded-xl border border-gray-200">
        {/* Tabs Navigation */}
        <Tabs defaultValue="all" className="w-full">
          <div className="border-b border-gray-200 app-center-container-padding">
            {/* 重构布局：将所有功能整合到一行中 */}
            <div className="app-center-unified-layout">
              {/* 左侧：Tab选项卡和搜索框 */}
              <div className="app-center-left-section">
                {/* Tab选项卡：公共应用、我的收藏、我创建的 */}
                <TabsList className="app-center-tabs-list">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="app-center-tab-trigger"
                    >
                      <tab.icon className="app-center-tab-icon" />
                      {tab.title}
                      {tab.badge && (
                        <Badge
                          variant="secondary"
                          className="ml-1 text-xs px-1 py-0 h-4 flex-shrink-0"
                        >
                          {tab.badge}
                        </Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* 搜索框 */}
                <div className="relative flex-shrink-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="搜索应用名称、作者或标签..."
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                    className="pl-10 app-center-search-box"
                  />
                </div>
              </div>

              {/* 右侧：工具栏 - 简化视图、视图切换、排序、创建应用 */}
              <div className="app-center-right-section">
                {/* 简化视图按钮 - 仅管理员可见 */}
                {showAdminFeatures && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setShowEnhancedCards(!showEnhancedCards)
                    }
                    className="app-center-toolbar-button button-no-overlap"
                  >
                    {showEnhancedCards
                      ? "简化视图"
                      : "详细视图"}
                  </Button>
                )}

                {/* 视图切换按钮组 */}
                <div className="app-center-view-toggle">
                  <Button
                    variant={
                      viewMode === "grid"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={
                      viewMode === "list"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>

                {/* 排序下拉框 */}
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <SelectTrigger className="app-center-dropdown app-center-toolbar-button">
                    <SelectValue placeholder="排序" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest">最新</SelectItem>
                    <SelectItem value="popular">
                      最热门
                    </SelectItem>
                    <SelectItem value="downloads">
                      下载量
                    </SelectItem>
                    <SelectItem value="rating">评分</SelectItem>
                  </SelectContent>
                </Select>

                {/* 创建应用按钮 - 移动到排序下拉框右侧 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="app-center-create-button">
                      <Plus className="w-3 h-3 mr-1" />
                      创建应用
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56"
                  >
                    <DropdownMenuItem
                      onClick={() => onCreateApp?.("blank")}
                      className="flex items-center p-3"
                    >
                      <div>
                        <div className="font-medium">
                          基于空白工作流创建
                        </div>
                        <div className="text-sm text-gray-500">
                          从空白画布开始设计工作流
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onCreateApp?.("rflp")}
                      className="flex items-center p-3"
                    >
                      <div>
                        <div className="font-medium">
                          基于RFLP模板创建
                        </div>
                        <div className="text-sm text-gray-500">
                          使用需求-功能-逻辑-物理模板
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Tab内容 */}
          <TabsContent value="all" className="m-0">
            <div
              className={`${viewMode === "grid" ? "p-6 space-y-6" : "space-y-0"}`}
            >
              {/* Category Filters - Only show for grid view */}
              {viewMode === "grid" && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={
                        selectedCategory === category.id
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setSelectedCategory(category.id)
                      }
                    >
                      {category.label}
                    </Button>
                  ))}
                </div>
              )}

              {/* Apps Content */}
              {viewMode === "grid" ? (
                <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
                  {apps.map((app) =>
                    renderAppCard(app, "public"),
                  )}
                </div>
              ) : (
                <AppListView
                  apps={apps}
                  onAppClick={onAppClick}
                  onAppAction={onAppAction}
                  category="public"
                />
              )}

              {/* Pagination */}
              <div
                className={`flex items-center justify-between ${viewMode === "grid" ? "pt-6" : "px-6 py-4"} border-t border-gray-200`}
              >
                <div className="text-sm text-gray-500">
                  显示 1-6 条，共 24 条应用
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    上一页
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-50 text-blue-600 border-blue-200"
                  >
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    下一���
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="m-0">
            <div className="p-6">
              {favoriteApps.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">
                    ⭐
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    暂无收藏的应用
                  </h3>
                  <p className="text-gray-500">
                    您还没有收藏任何应用，去发现一些有趣的应用吧
                  </p>
                </div>
              ) : (
                <div
                  className={`${viewMode === "grid" ? "space-y-6" : "space-y-0"}`}
                >
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                    <p className="text-green-800 text-sm">
                      💡
                      收藏的应用来源于公共应用，支持复制、删除操作。删除仅从收藏列表中移除，不影响原应用。
                    </p>
                  </div>

                  {/* 收藏的应用内容 */}
                  {viewMode === "grid" ? (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {favoriteApps.map((app) =>
                        renderAppCard(app, "favorite"),
                      )}
                    </div>
                  ) : (
                    <AppListView
                      apps={favoriteApps}
                      onAppClick={onAppClick}
                      onAppAction={onAppAction}
                      category="favorite"
                    />
                  )}

                  {/* 分页 */}
                  <div
                    className={`flex items-center justify-between ${viewMode === "grid" ? "pt-6" : "px-6 py-4"} border-t border-gray-200`}
                  >
                    <div className="text-sm text-gray-500">
                      显示 1-{favoriteApps.length} 条，共{" "}
                      {favoriteApps.length} 条收藏应用
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="published" className="m-0">
            <div className="p-6">
              {userApps.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">
                    📱
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    还没有创建的应用
                  </h3>
                  <p className="text-gray-500 mb-6">
                    创建您的第一个应用，与团队分享您的创意
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-blue-800 hover:bg-blue-900 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        创建应用
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      className="w-56"
                    >
                      <DropdownMenuItem
                        onClick={() => onCreateApp?.("blank")}
                        className="flex items-center p-3"
                      >
                        <div>
                          <div className="font-medium">
                            基于空白工作流创建
                          </div>
                          <div className="text-sm text-gray-500">
                            从空白画布开始设计工作流
                          </div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onCreateApp?.("rflp")}
                        className="flex items-center p-3"
                      >
                        <div>
                          <div className="font-medium">
                            基于RFLP模板创建
                          </div>
                          <div className="text-sm text-gray-500">
                            使用需求-功能-逻辑-物理模板
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div
                  className={`${viewMode === "grid" ? "space-y-6" : "space-y-0"}`}
                >
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
                    <p className="text-yellow-800 text-sm">
                      💡 个人创建的应用（共{userApps.length}
                      个）默认状态为草稿，支持编辑、删除、发布操作。您可以随时修改和管理自己创建的应用。
                    </p>
                  </div>

                  {/* 用户创建的应用内容 */}
                  {viewMode === "grid" ? (
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                      {userApps.map((app) =>
                        renderAppCard(app, "personal"),
                      )}
                    </div>
                  ) : (
                    <AppListView
                      apps={userApps}
                      onAppClick={onAppClick}
                      onAppAction={onAppAction}
                      category="personal"
                    />
                  )}

                  {/* 分页 - 仅当有应用时显示 */}
                  <div
                    className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${viewMode === "grid" ? "pt-6" : "px-6 py-4"} border-t border-gray-200`}
                  >
                    <div className="text-sm text-gray-500 order-2 sm:order-1">
                      显示 1-{userApps.length} 条，共{" "}
                      {userApps.length} 条个人应用
                    </div>
                    <DropdownMenu>
                      <DropdownMenuContent
                        align="end"
                        className="w-56"
                      >
                        <DropdownMenuItem
                          onClick={() => onCreateApp?.("blank")}
                          className="flex items-center p-3"
                        >
                          <div>
                            <div className="font-medium">
                              基于空白工作流创建
                            </div>
                            <div className="text-sm text-gray-500">
                              从空白画布开始设计工作流
                            </div>
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onCreateApp?.("rflp")}
                          className="flex items-center p-3"
                        >
                          <div>
                            <div className="font-medium">
                              基于RFLP模板创建
                            </div>
                            <div className="text-sm text-gray-500">
                              使用需求-功能-逻辑-物理模板
                            </div>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 管理员功能区域 - 移到页面下方 */}
      {showAdminFeatures && (
        <div className="space-y-6">
          {/* 管理员功能区域标题 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-green-500 rounded-full"></div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  管理员专区
                </h2>
                <p className="text-sm text-gray-500">
                  高级功能和系统管理工具
                </p>
              </div>
            </div>
          </div>

          {/* 管理员功能卡片 */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* 应用统计分析 */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      应用统计分析
                    </h3>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs"
                  >
                    管理员
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <AppStatistics
                  isVisible={true}
                  userRole={userRole || "admin"}
                />
              </div>
            </div>

            {/* 运维操作中心 */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      运维操作中心
                    </h3>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs"
                  >
                    管理员
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <OperationsPanel
                  apps={[...apps, ...userApps]}
                  selectedApps={selectedAppsForOperations}
                  onAppSelection={setSelectedAppsForOperations}
                  userRole={userRole || "admin"}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 组件实例化对话框 */}
      <InstantiationDialog />
    </div>
  );
}