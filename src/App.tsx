import { useState, useEffect } from "react"
import { VehicleEnergyAnalysisApp } from "./components/VehicleEnergyAnalysisApp"
import { AuthProvider, useAuth } from "./components/AuthContext"
import { UserRoleProvider } from "./components/UserRoleContext"
import { ProjectProvider } from "./components/ProjectContext"
import { NavigationService } from "./services/NavigationService"
import { componentLibraryService } from "./services/ComponentLibraryService"
import { Toaster } from "./components/ui/sonner"
import { toast } from "sonner@2.0.3"
import { Loader2, Lightbulb } from "lucide-react@0.487.0"
import { WorkflowRecommendationPanel } from "./components/WorkflowRecommendationPanel"
import { RoleBasedWorkflowWizard } from "./components/RoleBasedWorkflowWizard"

// Import all the page components
import { Sidebar } from "./components/Sidebar"
import { TopBar } from "./components/TopBar"
import { Console } from "./components/Console"
import { StatsCards } from "./components/StatsCards"
import { WorkflowTable } from "./components/WorkflowTable"
import { WorkflowEditor } from "./components/WorkflowEditor"
import { BlankWorkflowEditor } from "./components/BlankWorkflowEditor"
import { WorkflowDefinition } from "./components/WorkflowDefinition"
import { AppCenter } from "./components/AppCenter"
import { AppDetail } from "./components/AppDetail"
import { ComponentManagement } from "./components/ComponentManagement"
import { ToolService } from "./components/ToolService"
import { ModelManagement } from "./components/ModelManagement"
import { ModelDetail } from "./components/ModelDetail"
import { ModelComparison } from "./components/ModelComparison"
import { ModelVersion } from "./components/ModelVersion"
import { UserManagement } from "./components/UserManagement"
import { EAToolPage } from "./components/EAToolPage"
import { DymolaToolPage } from "./components/DymolaToolPage"
import { PolarionToolPage } from "./components/PolarionToolPage"
import { ProjectHub } from "./components/ProjectHub"
import { ProjectDashboard } from "./components/ProjectDashboard"
import { ProjectCreationWizard } from "./components/project/ProjectCreationWizard"
import { MetricsHub } from "./components/MetricsHub"
import { LoginPage } from "./components/LoginPage"

type Page = "console" | "workflow" | "appCenter" | "appDetail" | "appEditor" | "workflowDefinition" | "componentManagement" | "componentCategory" | "componentDetail" | "mbseSimulation" | "toolService" | "modelManagement" | "modelDetail" | "modelComparison" | "modelVersion" | "userManagement" | "eaTool" | "dymolaTool" | "polarionTool" | "projectHub" | "projectDashboard" | "metricsHub" | "vehicleEnergyApp" | "vehicleEnergyWorkflow"
type WorkflowView = "list" | "editor"
type WorkflowSource = "workflow" | "appDetail" | "appCenter"

// 初始工作流数据 - 添加category属性用于分类
const initialWorkflows = [
  {
    id: 1,
    name: "整车碰撞安全分析",
    type: "安全仿真",
    status: "草稿",
    creator: "张工程师",
    createTime: "2025-07-20 09:12",
    lastRunTime: "2025-07-25 10:30",
    runCount: 5,
    priority: "高",
    description: "基于NCAP标准的整车碰撞安全性能评估",
    category: "personal", // 个人工作流
    // 新增：增强数据属性
    roleRelevance: {
      admin: "中",
      projectManager: "高",
      architect: "高", 
      simulation: "高",
      modeling: "中"
    }
  },
  {
    id: 2,
    name: "动力总成匹配优化",
    type: "性能优化",
    status: "已发布",
    creator: "李工程师",
    createTime: "2025-07-18 14:22",
    lastRunTime: "2025-07-24 16:45",
    runCount: 8,
    priority: "高",
    description: "发动机与变速器匹配优化，提升燃油经济性",
    category: "public", // 公共工作流
    roleRelevance: {
      admin: "中",
      projectManager: "高",
      architect: "高",
      simulation: "高",
      modeling: "高"
    }
  },
  {
    id: 3,
    name: "车身轻量化设计",
    type: "结构优化",
    status: "草稿",
    creator: "王工程师",
    createTime: "2025-07-10 08:00",
    lastRunTime: "2025-07-25 11:20",
    runCount: 12,
    priority: "中",
    description: "采用先进材料实现车身轻量化，降低整车重量",
    category: "personal", // 个人工作流
    roleRelevance: {
      admin: "低",
      projectManager: "中",
      architect: "高",
      simulation: "中",
      modeling: "高"
    }
  },
  {
    id: 4,
    name: "电池热管理系统",
    type: "热管理",
    status: "已发布",
    creator: "陈工程师",
    createTime: "2025-07-15 11:30",
    lastRunTime: "2025-07-25 14:20",
    runCount: 6,
    priority: "高",
    description: "新能源车电池包热管理系统设计与仿真",
    category: "public", // 公共工作流
    roleRelevance: {
      admin: "中",
      projectManager: "高",
      architect: "中",
      simulation: "高",
      modeling: "高"
    }
  },
  {
    id: 5,
    name: "底盘悬挂调校",
    type: "操控优化",
    status: "已发布",
    creator: "赵工程师",
    createTime: "2025-07-12 16:45",
    lastRunTime: "2025-07-24 08:00",
    runCount: 15,
    priority: "中",
    description: "悬挂系统参数调校，提升行驶舒适性和操控性",
    category: "personal", // 个人工作流
    roleRelevance: {
      admin: "低",
      projectManager: "中",
      architect: "中",
      simulation: "高",
      modeling: "中"
    }
  },
  {
    id: 6,
    name: "NVH噪声控制",
    type: "品质提升",
    status: "已发布",
    creator: "孙工程师",
    createTime: "2025-07-22 10:15",
    lastRunTime: "-",
    runCount: 0,
    priority: "中",
    description: "车辆噪声、振动与声振粗糙度控制",
    category: "public", // 公共工作流
    roleRelevance: {
      admin: "低",
      projectManager: "中",
      architect: "中",
      simulation: "高",
      modeling: "中"
    }
  },
  {
    id: 7,
    name: "自动驾驶算法验证",
    type: "智能驾驶",
    status: "草稿",
    creator: "郑工程师",
    createTime: "2025-07-19 13:30",
    lastRunTime: "2025-07-25 09:45",
    runCount: 3,
    priority: "高",
    description: "L3级自动驾驶算法的仿真验证",
    category: "personal", // 个人工作流
    roleRelevance: {
      admin: "中",
      projectManager: "高",
      architect: "高",
      simulation: "高",
      modeling: "中"
    }
  },
  {
    id: 8,
    name: "空调系统优化",
    type: "舒适性",
    status: "已发布",
    creator: "周工程师",
    createTime: "2025-07-21 15:20",
    lastRunTime: "2025-07-25 12:10",
    runCount: 2,
    priority: "低",
    description: "整车空调系统制冷效果优化",
    category: "public", // 公共工作流
    roleRelevance: {
      admin: "低",
      projectManager: "低",
      architect: "中",
      simulation: "中",
      modeling: "低"
    }
  },
  {
    id: 9,
    name: "制动系统性能优化",
    type: "安全系统",
    status: "审核中",
    creator: "刘工程师",
    createTime: "2025-07-26 09:30",
    lastRunTime: "2025-07-27 14:15",
    runCount: 4,
    priority: "高",
    description: "制动距离优化和ABS系统调校，提升制动安全性能",
    category: "personal", // 个人工作流
    roleRelevance: {
      admin: "中",
      projectManager: "高",
      architect: "中",
      simulation: "高",
      modeling: "中"
    }
  },
  {
    id: 10,
    name: "智能座舱交互设计",
    type: "用体验",
    status: "已发布",
    creator: "马工程师",
    createTime: "2025-07-23 11:20",
    lastRunTime: "2025-07-27 10:45",
    runCount: 7,
    priority: "中",
    description: "基于用户行为的智能座舱人机交互界面设计与验证",
    category: "personal", // 个人工作流
    roleRelevance: {
      admin: "低",
      projectManager: "中",
      architect: "高",
      simulation: "中",
      modeling: "低"
    }
  },
  {
    id: 11,
    name: "电磁兼容性测试",
    type: "合规验证",
    status: "审核中",
    creator: "吴工程师",
    createTime: "2025-07-24 16:00",
    lastRunTime: "-",
    runCount: 0,
    priority: "中",
    description: "整车电磁兼容性测试流程，确保符合国际EMC标准",
    category: "personal", // 个人工作流
    roleRelevance: {
      admin: "中",
      projectManager: "中",
      architect: "低",
      simulation: "高",
      modeling: "低"
    }
  },
  {
    id: 12,
    name: "轮胎磨损预测模型",
    type: "预测维护",
    status: "草稿",
    creator: "何工程师",
    createTime: "2025-07-25 08:45",
    lastRunTime: "2025-07-26 16:30",
    runCount: 2,
    priority: "低",
    description: "基于机器学习的轮胎磨损预测，优化维护策略",
    category: "personal", // 个人工作流
    roleRelevance: {
      admin: "低",
      projectManager: "低",
      architect: "中",
      simulation: "中",
      modeling: "高"
    }
  },
  {
    id: 13,
    name: "燃料电池系统建模",
    type: "新能源",
    status: "已发布",
    creator: "杨工程师",
    createTime: "2025-07-17 14:30",
    lastRunTime: "2025-07-27 09:20",
    runCount: 9,
    priority: "高",
    description: "氢燃料电池汽车动力系统建模与效率优化",
    category: "personal", // 个人工作流
    roleRelevance: {
      admin: "中",
      projectManager: "高",
      architect: "中",
      simulation: "高",
      modeling: "高"
    }
  },
  {
    id: 14,
    name: "整车能耗分析",
    type: "能耗优化",
    status: "已发布",
    creator: "系统",
    createTime: "2025-07-28 10:00",
    lastRunTime: "2025-07-28 15:30",
    runCount: 12,
    priority: "高",
    description: "电动汽车整车能耗分析与优化，涵盖车辆动力学、驱动系统、电池系统、热管理等全链路能量流仿真，支持多工况续航预测",
    category: "public", // 公共工作流
    roleRelevance: {
      admin: "中",
      projectManager: "高",
      architect: "高",
      simulation: "高",
      modeling: "高"
    }
  },
];

function AppContent() {
  const { user, isAuthenticated, loading } = useAuth()
  
  const [currentPage, setCurrentPage] = useState<Page>("console")
  const [currentView, setCurrentView] = useState<WorkflowView>("list")
  const [currentWorkflow, setCurrentWorkflow] = useState<any>(null)
  const [workflowStatusFilter, setWorkflowStatusFilter] = useState<string>("")
  const [currentApp, setCurrentApp] = useState<any>(null)
  const [workflowSource, setWorkflowSource] = useState<WorkflowSource>("workflow")
  const [templateType, setTemplateType] = useState<string | undefined>(undefined) // 新增模板类型状态
  
  // 全局工作流状态管理
  const [workflows, setWorkflows] = useState(initialWorkflows)
  
  // 工作流编辑相关状态
  const [editingWorkflow, setEditingWorkflow] = useState<any>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  
  // 组件管理相关状态
  const [currentCategory, setCurrentCategory] = useState<any>(null)
  const [currentComponent, setCurrentComponent] = useState<any>(null)
  const [navigationStack, setNavigationStack] = useState<Page[]>([])

  // 模型管理相关状态
  const [currentModel, setCurrentModel] = useState<any>(null)

  // 应用状态管理
  const [userApps, setUserApps] = useState<any[]>([]) // 用户创建的应用列表
  const [favoriteApps, setFavoriteApps] = useState<any[]>([]) // 用户收藏的应用列表

  // 新增：智能推荐和角色向导状态
  const [showRecommendationPanel, setShowRecommendationPanel] = useState(false)
  const [showRoleWizard, setShowRoleWizard] = useState(false)
  const [recommendationEnabled, setRecommendationEnabled] = useState(true) // 智能推荐开关状态

  // EA工具页面相关状态
  const [eaToolNodeData, setEaToolNodeData] = useState<any>(null)

  // 项目管理相关状态
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null)
  const [showProjectCreationWizard, setShowProjectCreationWizard] = useState(false)

  // 用户认证完成后初始化用户应用数据
  useEffect(() => {
    if (user) {
      setUserApps([
        // 初始化一些测试应用数据，方便用户查看
        {
          id: 1001,
          title: "智能驾驶辅助系统",
          description: "基于MBSE方法的智能驾驶辅助系统开发，包含感知、决策和控制模块",
          tags: ["智能驾驶", "ADAS", "安全"],
          likes: 0,
          views: 3,
          downloads: 0,
          icon: "🚗",
          color: "bg-blue-500",
          author: user.name || "测试用户",
          createTime: "2025-01-08 14:30",
          status: "草稿",
          canvasState: null,
          nodes: [],
          connections: []
        },
        {
          id: 1002,
          title: "电池热管理优化",
          description: "新能源汽车电池包热管理系统的设计与仿真验证",
          tags: ["热管理", "电池", "新能源"],
          likes: 0,
          views: 1,
          downloads: 0,
          icon: "🔋",
          color: "bg-green-500",
          author: user.name || "测试用户",
          createTime: "2025-01-08 10:15",
          status: "草稿",
          canvasState: null,
          nodes: [],
          connections: []
        },
        {
          id: 1003,
          title: "车辆NVH分析系统",
          description: "整车噪声、振动与声振粗糙度(NVH)综合分析平台",
          tags: ["NVH", "声学", "振动"],
          likes: 0,
          views: 5,
          downloads: 0,
          icon: "🔊",
          color: "bg-purple-500",
          author: user.name || "测试用户",
          createTime: "2025-01-07 16:45",
          status: "草稿",
          canvasState: null,
          nodes: [],
          connections: []
        }
      ])
    }
  }, [user])

  // 新增：导航上下文状态
  const [navigationContext, setNavigationContext] = useState<any>(null)

  // 初始化导航服务
  useEffect(() => {
    const navigationService = NavigationService.getInstance();
    navigationService.setNavigationCallback((page: string, context?: any) => {
      handleNavigation(page as Page);
      if (context) {
        setNavigationContext(context);
        // 根据上下文设置相应的状态
        if (context.highlightComponent) {
          // 高亮特定组件的逻辑
          console.log("高亮组件:", context.highlightComponent);
        }
        if (context.searchQuery) {
          // 设置搜索查询的逻辑
          console.log("搜索查询:", context.searchQuery);
        }
      }
    });
  }, []);

  // 如果还在加载认证状态，显示加载页面
  if (loading) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-2xl">M</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">MBSE平台</h2>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>正在加载...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 如果未登录，显示登录页面
  if (!isAuthenticated) {
    return <LoginPage />
  }

  const handleCreateWorkflow = (workflowData: any) => {
    const newWorkflow = {
      ...workflowData,
      id: Date.now(),
      createTime: new Date().toLocaleString('zh-CN'),
      lastRunTime: "-",
      runCount: 0,
      status: "草稿",
      creator: user?.name || '未知用户',
      category: "personal", // 新创建的工作流默认为个人工作流
      priority: workflowData.priority || "中" // 使用定义时设置的优先级
    }
    
    // 添加到工作流列表
    setWorkflows(prevWorkflows => [newWorkflow, ...prevWorkflows])
    setCurrentWorkflow(newWorkflow)
    setCurrentView("editor")
  }

  // 工作流复制处理函数
  const handleWorkflowCopy = (workflow: any) => {
    const copiedWorkflow = {
      ...workflow,
      id: Date.now(),
      name: `${workflow.name} (副本)`,
      status: "草稿",
      creator: user?.name || '未知户',
      createTime: new Date().toLocaleString('zh-CN'),
      lastRunTime: "-",
      runCount: 0,
      category: "personal", // 复制的工作流默认为个人工作流
      priority: workflow.priority || "中" // 保持原有优先级
    }
    
    // 添加到工作流列表
    setWorkflows(prevWorkflows => [copiedWorkflow, ...prevWorkflows])
    toast.success(`已复制工作流 "${workflow.name}" 到个人工作流`)
  }

  // 工作流编辑处理函数
  const handleWorkflowEdit = (workflow: any) => {
    setEditingWorkflow(workflow)
    setIsEditMode(true)
    setCurrentPage("workflowDefinition")
    setWorkflowSource("workflow")
  }

  const handleCreateApp = (type?: string) => {
    setCurrentPage("workflowDefinition")
    setWorkflowSource("appCenter")
    setTemplateType(type) // 保存模板类型
    // 这里可以根据type参数处理不同的创建类型
    // type可以是'blank'（空白工作流）或'rflp'（RFLP模板）
    console.log("创建应用类型:", type || "默认")
  }

  // 处理应用创建完成
  const handleAppCreated = (appData: any) => {
    const newApp = {
      ...appData,
      id: Date.now(),
      author: user?.name || '未知用户',
      likes: 0,
      views: 0,
      downloads: 0,
      createTime: new Date().toLocaleString('zh-CN'),
      status: '草稿', // 个人创建的应用默认状态是草稿
    }
    
    // 添加到用户应用列表
    setUserApps(prevApps => [newApp, ...prevApps])
    
    // 显示成功提示
    toast.success(`应用 "${appData.title}" 已成功创建`)
  }

  // 应用操作函数
  const handleAppAction = (action: string, app: any) => {
    switch (action) {
      case 'delete':
        // 删除应用（从个人创建或收藏列表中删除）
        setUserApps(prevApps => 
          prevApps.filter(a => a.id !== app.id)
        );
        setFavoriteApps(prevFavorites => 
          prevFavorites.filter(a => a.id !== app.id)
        );
        toast.success(`应用 "${app.title}" 已删除`);
        break;
        
      case 'publish':
        // 发布应用
        setUserApps(prevApps =>
          prevApps.map(a =>
            a.id === app.id
              ? { ...a, status: '已发布' }
              : a
          )
        );
        toast.success(`应用 "${app.title}" 已发布`);
        break;
        
      case 'copy':
        // 复制应用到个人应用
        const copiedApp = {
          ...app,
          id: Date.now(),
          title: `${app.title} (副本)`,
          status: '草稿',
          author: user?.name || '未知用户',
          createTime: new Date().toLocaleString('zh-CN'),
          likes: 0,
          views: 0,
          downloads: 0,
        };
        setUserApps(prevApps => [copiedApp, ...prevApps]);
        toast.success(`已复制应用 "${app.title}" 到我创建的应用`);
        break;
        
      case 'favorite':
        // 收藏应用
        const isAlreadyFavorited = favoriteApps.some(a => a.id === app.id);
        if (!isAlreadyFavorited) {
          setFavoriteApps(prevFavorites => [app, ...prevFavorites]);
          toast.success(`已收藏应用 "${app.title}"`);
        } else {
          toast.info(`应用 "${app.title}" 已在收藏列表中`);
        }
        break;
        
      case 'edit':
        // 编辑应用 - 这里可以跳转到应用定义页面或打开编辑弹窗
        toast.info(`正在编辑应用 "${app.title}"`);
        break;
        
      default:
        toast.info(`执行操作: ${action}`);
    }
  }

  const handleBackFromDefinition = () => {
    if (workflowSource === "appCenter") {
      setCurrentPage("appCenter")
    } else {
      setCurrentPage("workflow")
    }
    setWorkflowSource("workflow")
    setTemplateType(undefined) // 清理模板类型状态
    // 清理编辑状态
    setEditingWorkflow(null)
    setIsEditMode(false)
  }

  const handleConfirmWorkflowDefinition = (workflowData: any) => {
    // 如果是从应用中心来的，创建应用并跳转到编辑器
    if (workflowSource === "appCenter") {
      const appData = {
        title: workflowData.name,
        description: workflowData.description,
        tags: [workflowData.type],
        icon: "📱", // 默认图标
        color: "bg-blue-500", // 默认颜色
      }
      handleAppCreated(appData)
      
      // 创建工作流并跳转到相应的编辑器
      const workflow = {
        ...workflowData,
        id: Date.now(),
        createTime: new Date().toLocaleString('zh-CN'),
        lastRunTime: "-",
        runCount: 0,
        status: "草稿",
        creator: user?.name || '未知用户',
        category: "personal",
        priority: workflowData.priority || "中",
        isBlankWorkflow: !workflowData.rflpTemplate, // 有RFLP模板时不是空白工作流
        isAppWorkflow: true, // 标记为应用工作流
        appData: appData, // 关联应用数据
        // 确保空白工作流的画布状态为空
        nodes: [], // 空白工作流初始节点为空
        connections: [], // 空白工作流初始连接为空
        canvasState: null // 空白工作流无画布状态
      }
      
      setCurrentWorkflow(workflow)
      setCurrentPage("appEditor")
      setWorkflowSource("workflow")
      setTemplateType(undefined) // 清理模板类型状态
    } else if (isEditMode) {
      // 编辑模式：更新现有工作流
      setWorkflows(prevWorkflows => 
        prevWorkflows.map(workflow => 
          workflow.id === workflowData.id 
            ? { ...workflow, ...workflowData, lastModifiedTime: new Date().toLocaleString('zh-CN') }
            : workflow
        )
      )
      toast.success(`工作流 "${workflowData.name}" 已更新`)
      setCurrentPage("workflow")
      setIsEditMode(false)
      setEditingWorkflow(null)
      setTemplateType(undefined) // 清理模板类型状态
    } else {
      // 原来的逻辑：创建工作流
      setCurrentWorkflow({
        ...workflowData,
        creator: user?.name || '未知用户'
      })
      setCurrentPage("workflow")
      setCurrentView("editor")
      setTemplateType(undefined) // 清理模板类型状态
    }
  }

  const handleBackToList = () => {
    if (workflowSource === "appDetail") {
      setCurrentPage("appDetail")
      setCurrentView("list")
      setCurrentWorkflow(null)
      setWorkflowSource("workflow")
    } else {
      setCurrentView("list")
      setCurrentWorkflow(null)
    }
  }

  const handleSaveWorkflow = (workflowData: any) => {
    // 确保个人创建的工作流保持category为"personal"
    const updatedWorkflowData = {
      ...workflowData,
      category: workflowData.category || "personal", // 确保category字段存在且为personal
      lastModifiedBy: user?.name,
      lastModifiedTime: new Date().toLocaleString('zh-CN'), // 添加最后修改时间
    };

    // 更新工作流列表中的数据
    setWorkflows(prevWorkflows => 
      prevWorkflows.map(workflow => 
        workflow.id === workflowData.id 
          ? { ...workflow, ...updatedWorkflowData }
          : workflow
      )
    );

    // 如果这是一个应用工作流，也要同步更新userApps中的数据
    if (workflowData.isAppWorkflow && workflowData.appData) {
      setUserApps(prevApps => 
        prevApps.map(app => 
          // 使用appData的ID或者通过title匹配应用
          app.id === workflowData.appData.id || app.title === workflowData.name
            ? { 
                ...app, 
                title: workflowData.name,
                description: workflowData.description,
                canvasState: workflowData.canvasState,
                nodes: workflowData.nodes,
                connections: workflowData.connections,
                lastSaved: workflowData.lastSaved,
                lastModifiedTime: new Date().toLocaleString('zh-CN')
              }
            : app
        )
      );
    }

    // 使用toast提示保存成功
    toast.success(`应用 "${workflowData.name}" 已成功保存到个人创建的应用中`);
    
    console.log("保存个人应用:", updatedWorkflowData);
  }

  const handleNavigation = (page: Page) => {
    setCurrentPage(page)
    
    // 重置相关状态
    if (page !== "workflow") {
      setCurrentView("list")
      if (page !== "appEditor") {
        setCurrentWorkflow(null)
      }
      setWorkflowStatusFilter("")
    }
    if (page !== "appDetail") {
      setCurrentApp(null)
    }
    if (page !== "appEditor") {
      if (page !== "workflow") {
        setCurrentWorkflow(null)
      }
    }
    if (!page.startsWith("component")) {
      setCurrentCategory(null)
      setCurrentComponent(null)
      setNavigationStack([])
    }
    if (page !== "modelDetail") {
      setCurrentModel(null)
    }
  }

  const handleAppClick = (app: any) => {
    // 特殊处理：整车能耗分析应用跳转到专门页面
    if (app.title === "整车能耗分析" || app.id === 7) {
      setCurrentPage("vehicleEnergyApp")
      return
    }
    
    // 如果是草稿状态的应用，直接跳转到独立的应用编辑器
    if (app.status === '草稿') {
      // 根据应用数据构建工作流数据，包含之前保存的画布状态
      const workflowData = {
        id: app.id,
        name: app.title,
        description: app.description,
        type: app.tags && app.tags.length > 0 ? app.tags[0] : '默认类型',
        status: app.status,
        creator: app.author,
        createTime: app.createTime || new Date().toLocaleString('zh-CN'),
        lastRunTime: "-",
        runCount: 0,
        priority: "中",
        category: "personal",
        isBlankWorkflow: true, // 标记为空白工作流
        isAppWorkflow: true, // 标记为应用工作流
        appData: app, // 关联应用数据
        // 恢复之前保存的画布状态
        canvasState: app.canvasState,
        nodes: app.nodes || [],
        connections: app.connections || [],
        lastSaved: app.lastSaved
      }
      
      setCurrentWorkflow(workflowData)
      setCurrentPage("appEditor")
    } else {
      // 非草稿状态的应用跳转到应用详情页面
      setCurrentApp(app)
      setCurrentPage("appDetail")
    }
  }

  const handleBackToAppCenter = () => {
    setCurrentPage("appCenter")
    setCurrentApp(null)
  }

  const handleBackFromAppEditor = () => {
    setCurrentPage("appCenter")
    setCurrentWorkflow(null)
  }

  const handleOpenWorkflow = () => {
    const energyManagementWorkflow = {
      id: "energy-management-workflow",
      name: "新能源汽车能量管理工作流",
      description: "基于MBSE的新能源汽车能量管理系统设计验证工作流",
      createTime: new Date().toLocaleString('zh-CN'),
      status: "已发布",
      creator: user?.name || '系统'
    }
    
    setCurrentWorkflow(energyManagementWorkflow)
    setWorkflowSource("appDetail")
    setCurrentPage("workflow")
    setCurrentView("editor")
  }

  // 整车能耗分析应用打开工作流
  const handleOpenVehicleEnergyWorkflow = () => {
    const vehicleEnergyWorkflow = {
      id: "vehicle-energy-workflow",
      name: "整车能耗分析工作流",
      description: "电动汽车整车能耗分析与优化工作流",
      createTime: new Date().toLocaleString('zh-CN'),
      status: "已发布",
      creator: user?.name || '系统',
      isVehicleEnergyWorkflow: true, // 标记为整车能耗工作流
      // 预置三个节点
      nodes: [
        {
          id: "node-ve-1",
          type: "ssp-modelica",
          name: "架构同步",
          description: "SSP导入与模型配置，支持FMU/Modelica/AMESim多类型模型选择",
          tag: "架构同步",
          tagColor: "#f59e0b",
          status: "waiting",
          position: { x: 100, y: 200 },
          collapsed: false,
          ports: {
            input: { x: 20, y: 60 },
            output: { x: 340, y: 60 }
          },
          config: {
            priority: "高",
            autoRun: false,
            timeout: 1200,
            retryCount: 1,
            parameters: {
              modelingApproach: 'ssp-import',
              sourceSSPFile: 'project-library',
              targetPlatform: 'modelica',
              modelicaCompiler: 'openmodelica',
              modelSelection: {
                librarySource: 'standard-library',
              }
            }
          }
        },
        {
          id: "node-ve-2",
          type: "simulation",
          name: "仿真配置",
          description: "整车能耗仿真工况配置，包括驾驶循环、环境条件和整车参数",
          tag: "仿真配置",
          tagColor: "#3b82f6",
          status: "waiting",
          position: { x: 500, y: 200 },
          collapsed: false,
          ports: {
            input: { x: 20, y: 60 },
            output: { x: 340, y: 60 }
          },
          config: {
            priority: "高",
            autoRun: false,
            timeout: 1800,
            retryCount: 1,
            parameters: {
              drivingCycle: 'NEDC',
              ambientTemperature: 25,
              vehicleMass: 1500,
              initialSOC: 100,
              solver: 'dassl',
              outputFormat: 'csv'
            }
          }
        },
        {
          id: "node-ve-3",
          type: "doe-analysis",
          name: "实验分析",
          description: "基于仿真结果的DOE实验设计与多目标优化分析",
          tag: "实验分析",
          tagColor: "#10b981",
          status: "waiting",
          position: { x: 900, y: 200 },
          collapsed: false,
          ports: {
            input: { x: 20, y: 60 },
            output: { x: 340, y: 60 }
          },
          config: {
            priority: "高",
            autoRun: false,
            timeout: 3600,
            retryCount: 1,
            parameters: {
              doeMethod: 'factorial',
              doeTools: 'minitab',
              factorCount: 3,
              levelCount: 2,
              analysisMethod: 'anova',
              optimizationObjective: 'minimize'
            }
          }
        }
      ],
      // 预置两个连接
      connections: [
        {
          id: "conn-ve-1",
          from: "node-ve-1",
          to: "node-ve-2",
          fromPort: "output",
          toPort: "input",
          type: "data",
          style: {
            stroke: "#3b82f6",
            strokeWidth: 2
          }
        },
        {
          id: "conn-ve-2",
          from: "node-ve-2",
          to: "node-ve-3",
          fromPort: "output",
          toPort: "input",
          type: "data",
          style: {
            stroke: "#3b82f6",
            strokeWidth: 2
          }
        }
      ]
    }
    
    setCurrentWorkflow(vehicleEnergyWorkflow)
    setWorkflowSource("appDetail")
    setCurrentPage("vehicleEnergyWorkflow")
  }

  const handleStatsFilterChange = (filter: string) => {
    setWorkflowStatusFilter(filter)
  }

  const handleWorkflowClick = (workflow: any) => {
    setCurrentWorkflow(workflow)
    setCurrentView("editor")
  }

  // 组件管理导航处理函数
  const handleComponentCategoryClick = (category: any) => {
    setCurrentCategory(category)
    setNavigationStack([...navigationStack, currentPage])
    setCurrentPage("componentCategory")
  }

  const handleComponentClick = (component: any) => {
    setCurrentComponent(component)
    setNavigationStack([...navigationStack, currentPage])
    setCurrentPage("componentDetail")
  }

  const handleMbseSimulationClick = () => {
    setNavigationStack([...navigationStack, currentPage])
    setCurrentPage("mbseSimulation")
  }

  const handleComponentBack = () => {
    if (navigationStack.length > 0) {
      const previousPage = navigationStack[navigationStack.length - 1]
      setNavigationStack(navigationStack.slice(0, -1))
      setCurrentPage(previousPage)
      
      if (previousPage === "componentManagement") {
        setCurrentCategory(null)
        setCurrentComponent(null)
      } else if (previousPage === "componentCategory") {
        setCurrentComponent(null)
      }
    } else {
      setCurrentPage("componentManagement")
      setCurrentCategory(null)
      setCurrentComponent(null)
    }
  }

  // 模型管理相关处理函数
  const handleModelClick = (model: any) => {
    setCurrentModel(model)
    setCurrentPage("modelDetail")
  }

  const handleBackToModelManagement = () => {
    setCurrentPage("modelManagement")
    setCurrentModel(null)
  }

  // EA工具相关处理函数
  const handleOpenInTool = (nodeData: any) => {
    setEaToolNodeData(nodeData)
    
    // 根据节点类型决定打开哪个工具
    if (nodeData.type === 'simulation' || nodeData.action?.includes('仿真') || nodeData.name?.includes('仿真')) {
      setCurrentPage("dymolaTool")
      toast.success(`正在打开Dymola工具，节点: ${nodeData.name}`)
    } else if (nodeData.type === 'requirement-management' || 
               nodeData.action?.includes('需求') || 
               nodeData.name?.includes('需求') ||
               nodeData.action?.includes('Requirement') ||
               nodeData.action?.includes('POLARION') ||
               nodeData.id?.includes('requirement') ||
               nodeData.category === 'requirement') {
      setCurrentPage("polarionTool")
      toast.success(`正在打开Polarion工具，节点: ${nodeData.name}`)
    } else {
      setCurrentPage("eaTool")
      toast.success(`正在打开EA工具，节点: ${nodeData.name}`)
    }
  }

  const handleBackFromEATool = () => {
    // 始终返回到工作流编器页面
    setCurrentPage("workflow")
    setCurrentView("editor")
    setEaToolNodeData(null)
  }

  const useBlankEditor = currentWorkflow?.isBlankWorkflow === true

  const renderComponentManagementPage = () => {
    switch (currentPage) {
      case "componentManagement":
        return (
          <ComponentManagement 
            onCategoryClick={handleComponentCategoryClick}
            onComponentClick={handleComponentClick}
            onMbseSimulationClick={handleMbseSimulationClick}
            userRole={user?.role} // 传递用户角色用于内容筛选
          />
        )
      case "componentCategory":
        return currentCategory ? (
          <ComponentCategory 
            category={currentCategory}
            onBack={handleComponentBack}
            onComponentClick={handleComponentClick}
            userRole={user?.role}
          />
        ) : null
      case "componentDetail":
        return currentComponent ? (
          <ComponentDetail 
            component={currentComponent}
            onBack={handleComponentBack}
            userRole={user?.role}
          />
        ) : null
      case "mbseSimulation":
        return (
          <MbseSimulation 
            onBack={handleComponentBack}
            onComponentClick={handleComponentClick}
            userRole={user?.role}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar currentPage={currentPage} onNavigate={handleNavigation} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar 
          currentPage={currentPage}
          onCreateProject={() => setShowProjectCreationWizard(true)}
        />
        
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {currentPage === "console" ? (
            <Console 
              workflowCount={workflows.filter(w => w.category === "public").length}
              appCount={7} // 应用中心新增整车能耗分析应用
              onNavigate={handleNavigation}
            />
          ) : currentPage === "workflowDefinition" ? (
            <WorkflowDefinition
              onBack={handleBackFromDefinition}
              onConfirm={handleConfirmWorkflowDefinition}
              userRole={user?.role}
              editingWorkflow={editingWorkflow}
              isEditMode={isEditMode}
              templateType={templateType} // 传递模板类型
            />
          ) : currentPage === "workflow" && currentView === "editor" && currentWorkflow ? (
            useBlankEditor ? (
              <BlankWorkflowEditor
                workflowData={currentWorkflow}
                onBack={handleBackToList}
                onSave={handleSaveWorkflow}
                userRole={user?.role}
              />
            ) : (
              <WorkflowEditor
                workflowData={currentWorkflow}
                onBack={handleBackToList}
                onSave={handleSaveWorkflow}
                userRole={user?.role}
                onOpenInTool={handleOpenInTool}
              />
            )
          ) : currentPage === "modelDetail" && currentModel ? (
            <ModelDetail
              model={currentModel}
              onBack={handleBackToModelManagement}
              userRole={user?.role}
            />
          ) : currentPage === "appEditor" && currentWorkflow ? (
            <WorkflowEditor
              workflowData={currentWorkflow}
              onBack={handleBackFromAppEditor}
              onSave={handleSaveWorkflow}
              userRole={user?.role}
              onOpenInTool={handleOpenInTool}
            />
          ) : currentPage === "vehicleEnergyWorkflow" && currentWorkflow ? (
            <WorkflowEditor
              workflowData={currentWorkflow}
              onBack={() => setCurrentPage("vehicleEnergyApp")}
              onSave={handleSaveWorkflow}
              userRole={user?.role}
              onOpenInTool={handleOpenInTool}
            />
          ) : (
            <div className="p-6">
              <div className="max-w-7xl mx-auto">
                {currentPage === "workflow" && (
                  <>
                    <StatsCards 
                      onFilterChange={handleStatsFilterChange} 
                      userRole={user?.role}
                      workflowCount={workflows.length}
                      workflows={workflows}
                      onRecommendationToggle={setRecommendationEnabled}
                    />
                    <div className="flex space-x-6">
                      <div className="flex-1">
                        <WorkflowTable 
                          workflows={workflows}
                          onCreateWorkflow={handleCreateWorkflow}
                          onWorkflowClick={handleWorkflowClick}
                          onWorkflowCopy={handleWorkflowCopy}
                          onWorkflowEdit={handleWorkflowEdit}
                          statusFilter={workflowStatusFilter}
                          userRole={user?.role}
                          showRecommendationPanel={showRecommendationPanel}
                          onShowRecommendationPanel={setShowRecommendationPanel}
                          showRoleWizard={showRoleWizard}
                          onShowRoleWizard={setShowRoleWizard}
                          recommendationEnabled={recommendationEnabled}
                        />
                      </div>
                      
                      {/* 智能推荐面板 - 根据推荐开关状态显示 */}
                      {showRecommendationPanel && user?.role && recommendationEnabled && (
                        <div className="w-96 flex-shrink-0">
                          <WorkflowRecommendationPanel
                            workflows={workflows}
                            userRole={user.role}
                            onWorkflowClick={handleWorkflowClick}
                            onClose={() => setShowRecommendationPanel(false)}
                          />
                        </div>
                      )}
                      
                      {/* 推荐功能关闭提示 */}
                      {showRecommendationPanel && user?.role && !recommendationEnabled && (
                        <div className="w-96 flex-shrink-0">
                          <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-lg p-6">
                            <div className="text-center space-y-4">
                              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                                <Lightbulb className="w-8 h-8 text-gray-400" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900 mb-2">智能推荐已关闭</h3>
                                <p className="text-sm text-gray-600">
                                  请在上方统计卡片区域开启智能推荐开关，<br/>以查看为您定制的工作流推荐。
                                </p>
                              </div>
                              <button
                                onClick={() => setShowRecommendationPanel(false)}
                                className="text-sm text-blue-600 hover:text-blue-700"
                              >
                                关闭面板
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 角色向导对话框 */}
                    {user?.role && (
                      <RoleBasedWorkflowWizard
                        open={showRoleWizard}
                        onOpenChange={setShowRoleWizard}
                        onComplete={handleCreateWorkflow}
                        userRole={user.role}
                      />
                    )}
                  </>
                )}
                
                {currentPage === "appCenter" && (
                  <AppCenter 
                    onAppClick={handleAppClick}
                    onCreateApp={handleCreateApp}
                    userApps={userApps}
                    favoriteApps={favoriteApps}
                    onAppAction={handleAppAction}
                    userRole={user?.role}
                  />
                )}
                
                {currentPage === "appDetail" && currentApp && (
                  <AppDetail 
                    app={currentApp} 
                    onBack={handleBackToAppCenter}
                    onOpenWorkflow={handleOpenWorkflow}
                    userRole={user?.role}
                  />
                )}
                
                {(currentPage.startsWith("component") || currentPage === "mbseSimulation") && (
                  renderComponentManagementPage()
                )}
                
                {currentPage === "toolService" && (
                  <ToolService userRole={user?.role} />
                )}
                
                {currentPage === "modelManagement" && (
                  <ModelManagement onModelClick={handleModelClick} userRole={user?.role} />
                )}
                
                {currentPage === "modelComparison" && (
                  <ModelComparison userRole={user?.role} />
                )}
                
                {currentPage === "modelVersion" && (
                  <ModelVersion userRole={user?.role} />
                )}
                
                {currentPage === "userManagement" && (
                  <UserManagement userRole={user?.role} />
                )}
                
                {currentPage === "projectHub" && (
                  <ProjectHub 
                    onViewProject={(projectId) => {
                      setCurrentProjectId(projectId)
                      setCurrentPage("projectDashboard")
                    }}
                  />
                )}
                
                {currentPage === "projectDashboard" && currentProjectId && (
                  <ProjectDashboard
                    projectId={currentProjectId}
                    onBack={() => {
                      setCurrentProjectId(null)
                      setCurrentPage("projectHub")
                    }}
                  />
                )}
                
                {currentPage === "eaTool" && (
                  <EAToolPage 
                    nodeData={eaToolNodeData}
                    onBack={handleBackFromEATool}
                  />
                )}
                
                {currentPage === "dymolaTool" && (
                  <DymolaToolPage 
                    nodeData={eaToolNodeData}
                    onBack={handleBackFromEATool}
                  />
                )}
                
                {currentPage === "polarionTool" && (
                  <PolarionToolPage 
                    nodeData={eaToolNodeData}
                    onBack={handleBackFromEATool}
                  />
                )}
                
                {currentPage === "metricsHub" && (
                  <MetricsHub />
                )}
                
                {currentPage === "vehicleEnergyApp" && (
                  <VehicleEnergyAnalysisApp 
                    onBack={handleBackToAppCenter}
                    userRole={user?.role}
                    onOpenWorkflow={handleOpenVehicleEnergyWorkflow}
                  />
                )}
              </div>
            </div>
          )}
        </main>
      </div>
      
      {/* 项目创建向导 */}
      <ProjectCreationWizard
        open={showProjectCreationWizard}
        onClose={() => setShowProjectCreationWizard(false)}
        onSuccess={(projectId) => {
          setShowProjectCreationWizard(false)
          setCurrentProjectId(projectId)
          setCurrentPage("projectDashboard")
        }}
      />
      
      <Toaster />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <UserRoleProvider>
        <ProjectProvider>
          <AppContent />
        </ProjectProvider>
      </UserRoleProvider>
    </AuthProvider>
  )
}

// 组件分类详情页面组件
function ComponentCategory({ category, onBack, onComponentClick, userRole }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900"
        >
          ← 返回
        </button>
        <h1 className="text-2xl font-semibold">{category.name}</h1>
      </div>
      <p className="text-gray-600">{category.description}</p>
      
      {/* 基于角色显示提示信息 */}
      {userRole && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            根据您的角色({userRole === 'admin' ? '平台管理员' : 
                      userRole === 'projectManager' ? '项目经理' :
                      userRole === 'architect' ? '系统架构师' :
                      userRole === 'simulation' ? '仿真工程师' : '建模工程师'})，
            以下显示与您工作相关的组件内容。
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.subcategories?.map((sub: any) => (
          <div 
            key={sub.id}
            className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onComponentClick(sub)}
          >
            <h3 className="font-medium mb-2">{sub.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{sub.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{sub.count} 个组件</span>
              <span className="text-sm text-blue-600">查看详情 →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 组件详情页面组件
function ComponentDetail({ component, onBack, userRole }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900"
        >
          ← 返回
        </button>
        <h1 className="text-2xl font-semibold">{component.name}</h1>
      </div>
      
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">组件详情</h2>
        <p className="text-gray-600 mb-6">{component.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">基本信息</h3>
            <div className="space-y-2 text-sm">
              <div>类型: {component.type || '功能组件'}</div>
              <div>版本: {component.version || '1.0.0'}</div>
              <div>状态: {component.status || '活跃'}</div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">使用统计</h3>
            <div className="space-y-2 text-sm">
              <div>下载次数: {component.downloads || '0'}</div>
              <div>使用次数: {component.usage || '0'}</div>
              <div>评分: {component.rating || '5.0'}</div>
            </div>
          </div>
        </div>

        {/* 基于角色显示不同的操作建议 */}
        {userRole && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">角色建议</h4>
            <div className="text-sm text-gray-700">
              {userRole === 'admin' && (
                <p>作为平台管理员，您可以管理组件的版本、权限和使用策略。</p>
              )}
              {userRole === 'architect' && (
                <p>作为系统架构师，此组件可用于系统架构设计和模块化开发。</p>
              )}
              {userRole === 'simulation' && (
                <p>作为仿真工程师，可以将此组件集成到您的仿真模型中。</p>
              )}
              {userRole === 'modeling' && (
                <p>作为建模工程师，组件支持您的建模工作流程。</p>
              )}
              {userRole === 'projectManager' && (
                <p>作为项目经理，您可以跟踪此组件在项目中的使用情况。</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// MBSE仿真建设页面组件
function MbseSimulation({ onBack, onComponentClick, userRole }: any) {
  const simulationSteps = [
    {
      id: "step-1",
      title: "需求管理与同步",
      description: "建立MBSE需求管理系，实现需求的全生命周期管理",
      components: ["POLARION集成", "需求追踪工具", "需求验证组件"],
      status: "completed",
      details: "通过POLARION平台实现需求的创建、管理、踪和验证，确保需求的完整性和一致性。",
      roleRelevance: {
        admin: "高",
        projectManager: "高",
        architect: "中",
        simulation: "低",
        modeling: "低"
      }
    },
    {
      id: "step-2", 
      title: "架构设计与建模",
      description: "基于SysML/UML进行系统架构设计和功能建模",
      components: ["EA架构工具", "SysML建模器", "功能分解工具"],
      status: "in-progress",
      details: "使用Enterprise Architect等工具进行系统架构设计，建立功能视图、物理视图和逻辑视图。",
      roleRelevance: {
        admin: "中",
        projectManager: "中",
        architect: "高",
        simulation: "中",
        modeling: "中"
      }
    },
    {
      id: "step-3",
      title: "仿真模型构建", 
      description: "构建多学科仿真模型，支持系统级仿真验证",
      components: ["Modelica建模", "M-WORKS仿真", "联合仿真平台"],
      status: "planned",
      details: "基于Modelica语言构建多物理域仿真模型，通过M-WORKS等工具进行仿真计算。",
      roleRelevance: {
        admin: "低",
        projectManager: "中",
        architect: "中",
        simulation: "高",
        modeling: "高"
      }
    },
    {
      id: "step-4",
      title: "仿真执行与分析",
      description: "执行仿真计算，进行结果分析和优化设计",
      components: ["仿真执行引擎", "结果分析工具", "DOE实验设计"],
      status: "planned", 
      details: "通过SSP标准实现仿真模型的标准化封装，支持分布式仿真和结果分析。",
      roleRelevance: {
        admin: "低",
        projectManager: "中",
        architect: "中",
        simulation: "高",
        modeling: "中"
      }
    },
    {
      id: "step-5",
      title: "验证与确认",
      description: "验证仿真结果的正确性，确认设计满足需求",
      components: ["验证工具集", "测试用例生成", "合规性检查"],
      status: "planned",
      details: "建立完整的V&V体系，确保仿真结果的可信度和设计方案的有效性。",
      roleRelevance: {
        admin: "中",
        projectManager: "高",
        architect: "高",
        simulation: "高",
        modeling: "中"
      }
    }
  ]

  // 根据用户角色筛选和排序步骤
  const filteredSteps = simulationSteps
    .map(step => ({
      ...step,
      relevanceLevel: step.roleRelevance[userRole as keyof typeof step.roleRelevance] || "低"
    }))
    .sort((a, b) => {
      const relevanceOrder = { "高": 3, "中": 2, "低": 1 }
      return (relevanceOrder[b.relevanceLevel as keyof typeof relevanceOrder] || 1) - 
             (relevanceOrder[a.relevanceLevel as keyof typeof relevanceOrder] || 1)
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800"
      case "in-progress": return "bg-yellow-100 text-yellow-800"  
      case "planned": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed": return "已完成"
      case "in-progress": return "进行中"
      case "planned": return "计划中"
      default: return "未开始"
    }
  }

  const getRelevanceColor = (level: string) => {
    switch (level) {
      case "高": return "bg-red-100 text-red-800"
      case "中": return "bg-yellow-100 text-yellow-800"
      case "低": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900"
        >
          ← 返回
        </button>
        <h1 className="text-2xl font-semibold">MBSE仿真建设步骤</h1>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-medium text-blue-900 mb-2">MBSE仿真体系概述</h2>
        <p className="text-blue-800">
          基于模型的系统工程(MBSE)仿真体系通过数字化建模、多学科仿真和系统级验证，
          实现从需求到验证的完整闭环，提高产品开发效率和质量。
        </p>
        {userRole && (
          <div className="mt-3 p-3 bg-blue-100 rounded">
            <p className="text-blue-900 text-sm">
              💡 以下内容已根据您的角色({userRole === 'admin' ? '平台管理员' : 
                                    userRole === 'projectManager' ? '项目经理' :
                                    userRole === 'architect' ? '系统架构师' :
                                    userRole === 'simulation' ? '仿真工程师' : '建模工程师'})进行优化排序，
              相关度高的内容优先显示。
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredSteps.map((step, index) => (
          <div key={step.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                  {simulationSteps.findIndex(s => s.id === step.id) + 1}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRelevanceColor(step.relevanceLevel)}`}>
                  相关度: {step.relevanceLevel}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(step.status)}`}>
                  {getStatusText(step.status)}
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700 text-sm">{step.details}</p>
            </div>
            
            <div>
              <h4 className="font-medium text-sm mb-2">相关组件:</h4>
              <div className="flex flex-wrap gap-2">
                {step.components.map((component, idx) => (
                  <button
                    key={idx}
                    onClick={() => onComponentClick({ name: component, category: step.title })}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                  >
                    {component}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium mb-4">基于角色的实施建议</h2>
        <div className="space-y-3 text-sm text-gray-700">
          {userRole === 'admin' && (
            <>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>关注平台整体架构设计和用户权限管理</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>建立标准化的流程规范和质量管控体系</span>
              </div>
            </>
          )}
          {userRole === 'projectManager' && (
            <>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>重点关注需求管理和项目进度监控</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1"></span>
                <span>协调各团队间的协作和数据流转</span>
              </div>
            </>
          )}
          {userRole === 'architect' && (
            <>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>专注于系统架构设计和模型化建模</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>建立标准化的SysML建模规范</span>
              </div>
            </>
          )}
          {userRole === 'simulation' && (
            <>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>重点关注仿真模型构建和执行分析</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>优化仿真算法和提升计算效率</span>
              </div>
            </>
          )}
          {userRole === 'modeling' && (
            <>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>专注于模型开发和验证确认</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>建立可复用的模型库和组件库</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}