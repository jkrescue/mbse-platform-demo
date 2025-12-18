import { useState } from "react";
import * as React from "react";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Play,
  Pause,
  Edit,
  Trash2,
  Copy,
  Eye,
  ExternalLink,
  Upload,
  Star,
  Target,
  TrendingUp,
  ArrowUpDown,
  Heart,
  Lightbulb,
  Users,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle2,
  PauseCircle,
  RotateCcw,
  Settings,
  FileText,
  Shield,
  Archive,
  Library,
  Globe,
  User,
} from "lucide-react@0.487.0";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Progress } from "./ui/progress";
import { Checkbox } from "./ui/checkbox";
import { CreateWorkflowDialog } from "./CreateWorkflowDialog";
import { toast } from "sonner@2.0.3";

interface WorkflowTableProps {
  workflows: any[];
  onCreateWorkflow: (data: any) => void;
  onWorkflowClick?: (workflow: any) => void;
  onWorkflowCopy?: (workflow: any) => void;
  onWorkflowEdit?: (workflow: any) => void; // 添加编辑回调
  statusFilter?: string;
  userRole?: string;
  // 新增：智能推荐和角色向导相关的props
  showRecommendationPanel?: boolean;
  onShowRecommendationPanel?: (show: boolean) => void;
  showRoleWizard?: boolean;
  onShowRoleWizard?: (show: boolean) => void;
  recommendationEnabled?: boolean; // 智能推荐开关状态
}

export function WorkflowTable({
  workflows,
  onCreateWorkflow,
  onWorkflowClick,
  onWorkflowCopy,
  onWorkflowEdit,
  statusFilter,
  userRole,
  showRecommendationPanel,
  onShowRecommendationPanel,
  showRoleWizard,
  onShowRoleWizard,
  recommendationEnabled = true,
}: WorkflowTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentStatusFilter, setCurrentStatusFilter] =
    useState(statusFilter || "all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [showCreateDialog, setShowCreateDialog] =
    useState(false);

  const [activeTab, setActiveTab] = useState("public");
  const [sortBy, setSortBy] = useState("createTime"); // 新增：排序方式
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    "desc",
  ); // 新增：排序顺序

  // 新增：批量操作相关状态
  const [selectedWorkflows, setSelectedWorkflows] = useState<
    Set<number>
  >(new Set());
  const [showBatchOperations, setShowBatchOperations] =
    useState(false);
  const [showQGStatusDialog, setShowQGStatusDialog] =
    useState(false);
  const [selectedQGWorkflow, setSelectedQGWorkflow] =
    useState<any>(null);

  // 监听外部状态筛选变化
  React.useEffect(() => {
    if (statusFilter) {
      setCurrentStatusFilter(statusFilter);
    }
  }, [statusFilter]);

  // 新增：根据用户角色获取工作流相关性
  const getWorkflowRelevance = (workflow: any) => {
    if (!workflow || !userRole || !workflow.roleRelevance) return "低";
    return workflow.roleRelevance[userRole] || "低";
  };

  // 新增：获取角色显示名称
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "平台管理员";
      case "projectManager":
        return "项目经理";
      case "architect":
        return "系统架构师";
      case "simulation":
        return "仿真工程师";
      case "modeling":
        return "建模工程师";
      default:
        return "用户";
    }
  };

  // 新增：生成模拟的运行成功率和运行时长数据
  const getWorkflowMetrics = (workflow: any) => {
    // 基于工作流ID生成一致的模拟数据
    const id = workflow.id;
    const successRate = Math.floor(75 + ((id * 7) % 25)); // 75-99之间的成功率
    const avgRunTime = Math.floor(30 + ((id * 13) % 180)); // 30-210分钟之间的运行时长

    return {
      successRate,
      avgRunTime,
      healthStatus:
        successRate >= 90
          ? "healthy"
          : successRate >= 70
            ? "warning"
            : "critical",
      qgStatus:
        workflow.status === "已发布"
          ? successRate > 85
            ? "complete"
            : "incomplete"
          : "pending",
    };
  };

  // 新增：相关性标签
  const getRelevanceBadge = (workflow: any) => {
    // 如果智能推荐功能关闭，不显示相关度标签
    if (!recommendationEnabled) return null;
    
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
        className={`${colors[relevance]} text-xs ml-2`}
        title={`与${getRoleDisplayName(userRole)}的相关度：${relevance}`}
      >
        {relevance === "高" ? (
          <Star className="w-3 h-3 mr-1" />
        ) : (
          <Target className="w-3 h-3 mr-1" />
        )}
        {relevance}
      </Badge>
    );
  };

  // 新增：健康度指示器
  const getHealthIndicator = (workflow: any) => {
    const metrics = getWorkflowMetrics(workflow);
    const colors = {
      healthy: "text-green-600",
      warning: "text-yellow-600",
      critical: "text-red-600",
    };
    const icons = {
      healthy: <CheckCircle2 className="w-4 h-4" />,
      warning: <AlertTriangle className="w-4 h-4" />,
      critical: <AlertTriangle className="w-4 h-4" />,
    };

    return (
      <div
        className={`flex items-center space-x-1 ${colors[metrics.healthStatus]}`}
        title={`健康度: ${metrics.successRate}%`}
      >
        {icons[metrics.healthStatus]}
        <span className="text-sm">{metrics.successRate}%</span>
      </div>
    );
  };

  // 新增：QG状态指示器
  const getQGStatusIndicator = (workflow: any) => {
    const metrics = getWorkflowMetrics(workflow);
    const colors = {
      complete: "bg-green-100 text-green-700 border-green-200",
      incomplete: "bg-red-100 text-red-700 border-red-200",
      pending: "bg-gray-100 text-gray-700 border-gray-200",
    };
    const labels = {
      complete: "完整",
      incomplete: "缺失",
      pending: "待定",
    };

    return (
      <Badge
        variant="outline"
        className={`${colors[metrics.qgStatus]} cursor-pointer hover:opacity-80`}
        onClick={() => handleQGStatusClick(workflow)}
        title="点击查看QG状态详情"
      >
        <Shield className="w-3 h-3 mr-1" />
        {labels[metrics.qgStatus]}
      </Badge>
    );
  };

  // 新增：处理QG状态点击
  const handleQGStatusClick = (workflow: any) => {
    setSelectedQGWorkflow(workflow);
    setShowQGStatusDialog(true);
  };

  // 新增：批量操作处理
  const handleBatchOperation = (operation: string) => {
    if (selectedWorkflows.size === 0) {
      toast.warning("请先选择要操作的工作流");
      return;
    }

    const count = selectedWorkflows.size;
    switch (operation) {
      case "deactivate":
        toast.success(`已批量停用 ${count} 个工作流`);
        break;
      case "validate":
        toast.success(`已启动 ${count} 个工作流的回归验证`);
        break;
      case "priority":
        if (userRole === "admin") {
          toast.success(`已调整 ${count} 个工作流的优先级`);
        } else {
          toast.error("只有管理员可以调整运行队列优先级");
        }
        break;
      default:
        toast.info(`批量操作: ${operation}`);
    }

    // 清空选择
    setSelectedWorkflows(new Set());
    setShowBatchOperations(false);
  };

  // 新增：全选/反选处理
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(
        filteredWorkflows.map((w) => w.id),
      );
      setSelectedWorkflows(allIds);
    } else {
      setSelectedWorkflows(new Set());
    }
  };

  // 新增：单个选择处理
  const handleSelectWorkflow = (
    workflowId: number,
    checked: boolean,
  ) => {
    const newSelection = new Set(selectedWorkflows);
    if (checked) {
      newSelection.add(workflowId);
    } else {
      newSelection.delete(workflowId);
    }
    setSelectedWorkflows(newSelection);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        variant:
          | "default"
          | "secondary"
          | "destructive"
          | "outline";
        className: string;
      }
    > = {
      草稿: {
        variant: "outline",
        className:
          "bg-gray-100 text-gray-700 hover:bg-gray-200",
      },
      审核中: {
        variant: "default",
        className:
          "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
      },
      已发布: {
        variant: "default",
        className:
          "bg-green-100 text-green-700 hover:bg-green-200",
      },
    };

    const config = variants[status] || variants["草稿"];
    return (
      <Badge
        variant={config.variant}
        className={`${config.className} cursor-pointer hover:scale-105 transition-transform`}
        onClick={() => handleStatusFilter(status)}
        title={`筛选${status}的工作流`}
      >
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      高: "bg-red-100 text-red-700 hover:bg-red-200",
      中: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
      低: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    };

    return (
      <Badge
        variant="outline"
        className={`${colors[priority] || colors["低"]} cursor-pointer hover:scale-105 transition-all`}
        onClick={() =>
          setPriorityFilter(
            priority === "高"
              ? "high"
              : priority === "中"
                ? "medium"
                : "low",
          )
        }
        title={`筛选${priority}优先级的工作流`}
      >
        {priority}
      </Badge>
    );
  };

  const handleStatusFilter = (status: string) => {
    const filterMap: Record<string, string> = {
      草稿: "draft",
      审核中: "reviewing",
      已发布: "published",
    };
    setCurrentStatusFilter(filterMap[status] || "all");
  };

  const handleWorkflowClick = (workflowId: number) => {
    const workflow = workflows.find((w) => w.id === workflowId);
    if (workflow && onWorkflowClick) {
      onWorkflowClick(workflow);
    } else {
      toast.info(`正在跳转到工作流 #${workflowId} 详情页面`);
    }
  };

  const handleActionClick = (
    action: string,
    workflowId: number,
    workflowName: string,
    isPublic?: boolean,
  ) => {
    const workflow = workflows.find((w) => w.id === workflowId);

    if (action === "copy" && workflow && onWorkflowCopy) {
      onWorkflowCopy(workflow);
      return;
    }

    if (action === "edit" && workflow && onWorkflowEdit) {
      onWorkflowEdit(workflow);
      return;
    }

    const messages: Record<string, string> = {
      run: `正在运行工作流: ${workflowName}`,
      pause: `正在暂停工作流: ${workflowName}`,
      edit: `正在编辑工作流: ${workflowName}`,
      delete: `正在删除工作流: ${workflowName}`,
      view: `正在查看工作流: ${workflowName}`,
      publish: `正在发布工作流: ${workflowName}`,
    };

    // 如果是公共工作流且操作是编辑，则提示不可编辑
    if (isPublic && action === "edit") {
      toast.error(
        "公共工作流不支持直接编辑，您可以复制后进行修改",
      );
      return;
    }

    toast.success(
      messages[action] || `正在执行操作: ${action}`,
    );
  };

  // 新增：处理排序
  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // 根据category字段判断工作流是否为个人工作流
  const isPersonalWorkflow = (workflow: any) => {
    return workflow.category === "personal";
  };

  // 筛选工作流：分为公共、个人和模板
  const personalWorkflows = workflows.filter((workflow) =>
    workflow && isPersonalWorkflow(workflow),
  );
  
  // 公共工作流筛选 - 根据智能推荐开关状态
  let publicWorkflows = workflows.filter(
    (workflow) => workflow && !isPersonalWorkflow(workflow),
  );
  
  // 如果智能推荐开启，且有用户角色，则只显示相关度为"中"或"高"的公共工作流
  if (recommendationEnabled && userRole) {
    publicWorkflows = publicWorkflows.filter((workflow) => {
      if (!workflow) return false;
      const relevance = getWorkflowRelevance(workflow);
      return relevance === "高" || relevance === "中";
    });
  }

  // 新增：模板工作流（从公共工作流中筛选可克隆的）
  const templateWorkflows = publicWorkflows.filter(
    (workflow) => workflow && workflow.status === "已发布" && workflow.type, // 已发布的公共工作流可作为模板
  );

  // 对当前活动的工作流列表进行过滤
  const currentWorkflows =
    activeTab === "personal"
      ? personalWorkflows
      : activeTab === "templates"
        ? templateWorkflows
        : publicWorkflows;

  // 筛选和排序工作流 - 增强版
  const filteredWorkflows = currentWorkflows
    .filter((workflow) => {
      if (!workflow) return false;
      
      const matchesSearch =
        workflow.name &&
        workflow.creator &&
        (workflow.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        workflow.creator
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));

      // 处理新的筛选条件
      let matchesStatus = false;
      if (currentStatusFilter === "all") {
        matchesStatus = true;
      } else if (currentStatusFilter === "draft") {
        matchesStatus = workflow.status === "草稿";
      } else if (currentStatusFilter === "reviewing") {
        matchesStatus = workflow.status === "审核中";
      } else if (currentStatusFilter === "published") {
        matchesStatus = workflow.status === "已发布";
      } else if (currentStatusFilter === "recommended") {
        // 推荐工作流筛选
        const relevance = getWorkflowRelevance(workflow);
        matchesStatus =
          relevance === "高" || relevance === "中";
      } else if (currentStatusFilter === "high-relevance") {
        // 高相关度工作流筛选
        const relevance = getWorkflowRelevance(workflow);
        matchesStatus = relevance === "高";
      }

      const matchesType =
        typeFilter === "all" || workflow.type === typeFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        (priorityFilter === "high" &&
          workflow.priority === "高") ||
        (priorityFilter === "medium" &&
          workflow.priority === "中") ||
        (priorityFilter === "low" &&
          workflow.priority === "低");

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesPriority
      );
    })
    .sort((a, b) => {
      // 智能排序逻辑
      let comparison = 0;

      switch (sortBy) {
        case "relevance":
          if (userRole) {
            const aRelevance = getWorkflowRelevance(a);
            const bRelevance = getWorkflowRelevance(b);
            const relevanceOrder = { 高: 3, 中: 2, 低: 1 };
            comparison =
              (relevanceOrder[
                bRelevance as keyof typeof relevanceOrder
              ] || 1) -
              (relevanceOrder[
                aRelevance as keyof typeof relevanceOrder
              ] || 1);
          }
          break;
        case "priority":
          const priorityOrder = { 高: 3, 中: 2, 低: 1 };
          comparison =
            (priorityOrder[
              b.priority as keyof typeof priorityOrder
            ] || 1) -
            (priorityOrder[
              a.priority as keyof typeof priorityOrder
            ] || 1);
          break;
        case "runCount":
          comparison = b.runCount - a.runCount;
          break;
        case "successRate":
          const aMetrics = getWorkflowMetrics(a);
          const bMetrics = getWorkflowMetrics(b);
          comparison =
            bMetrics.successRate - aMetrics.successRate;
          break;
        case "avgRunTime":
          const aTimeMetrics = getWorkflowMetrics(a);
          const bTimeMetrics = getWorkflowMetrics(b);
          comparison =
            aTimeMetrics.avgRunTime - bTimeMetrics.avgRunTime;
          break;
        case "createTime":
        default:
          comparison =
            new Date(b.createTime).getTime() -
            new Date(a.createTime).getTime();
          break;
      }

      return sortOrder === "asc" ? -comparison : comparison;
    });

  // 渲染操作按钮
  const renderActionButtons = (
    workflow: any,
    isPublic: boolean,
  ) => {
    return (
      <div className="flex items-center space-x-2">
        {/* 运行按钮 - 所有工作流都支持 */}
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 hover:border-green-300"
          onClick={() =>
            handleActionClick(
              "run",
              workflow.id,
              workflow.name,
              isPublic,
            )
          }
          title="运行工作流"
        >
          <Play className="w-3 h-3" />
        </Button>

        {/* 编辑按钮 - 仅个人工作流支持 */}
        {!isPublic && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
            onClick={() =>
              handleActionClick(
                "edit",
                workflow.id,
                workflow.name,
                isPublic,
              )
            }
            title="编辑工作流"
          >
            <Edit className="w-3 h-3" />
          </Button>
        )}

        {/* 复制按钮 - 所有工作流都支持 */}
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300"
          onClick={() =>
            handleActionClick(
              "copy",
              workflow.id,
              workflow.name,
              isPublic,
            )
          }
          title="复制工作流"
        >
          <Copy className="w-3 h-3" />
        </Button>

        {/* 更多操作按钮 - 仅个人工作流显示 */}
        {!isPublic && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="h-8 w-8 p-0 hover:bg-gray-100"
                title="更多操作"
              >
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* 删除操作 */}
              <DropdownMenuItem
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() =>
                  handleActionClick(
                    "delete",
                    workflow.id,
                    workflow.name,
                    isPublic,
                  )
                }
              >
                <Trash2 className="w-4 h-4 mr-2" />
                删除
              </DropdownMenuItem>
              {/* 发布操作 */}
              {workflow.status === "草稿" && (
                <DropdownMenuItem
                  onClick={() =>
                    handleActionClick(
                      "publish",
                      workflow.id,
                      workflow.name,
                      isPublic,
                    )
                  }
                >
                  <Upload className="w-4 h-4 mr-2" />
                  发布
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    );
  };

  // 新增：渲染可排序的表头
  const renderSortableHeader = (
    field: string,
    label: string,
  ) => (
    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">
      <button
        onClick={() => handleSort(field)}
        className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
        title={`按${label}排序`}
      >
        <span>{label}</span>
        <ArrowUpDown className="w-3 h-3" />
        {sortBy === field && (
          <span className="text-blue-600">
            {sortOrder === "asc" ? "↑" : "↓"}
          </span>
        )}
      </button>
    </th>
  );

  // 渲染工作流表格
  const renderWorkflowTable = (isPublic: boolean) => (
    <div className="relative">
      <div className="overflow-x-auto scrollbar-horizontal-enhanced">
        <table
          className="w-full"
          style={{ minWidth: "1400px" }}
        >
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {/* 新增：批量选择列 */}
              {!isPublic && activeTab === "personal" && (
                <th className="px-6 py-3 text-left w-16 min-w-[4rem]">
                  <Checkbox
                    checked={
                      selectedWorkflows.size ===
                        filteredWorkflows.length &&
                      filteredWorkflows.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                    className="mx-auto"
                  />
                </th>
              )}
              <th
                className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500"
                style={{ minWidth: "200px" }}
              >
                工作流名称
              </th>
              <th
                className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500"
                style={{ minWidth: "100px" }}
              >
                类型
              </th>
              <th
                className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500"
                style={{ minWidth: "80px" }}
              >
                状态
              </th>
              {/* 新增：运行成功率列 */}
              <th
                className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500"
                style={{ minWidth: "120px" }}
              >
                <button
                  onClick={() => handleSort("successRate")}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  title="按运行成功率排序"
                >
                  <span>运行成功率</span>
                  <ArrowUpDown className="w-3 h-3" />
                  {sortBy === "successRate" && (
                    <span className="text-blue-600">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </th>
              {/* 新增：平均运行时长列 */}
              <th
                className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500"
                style={{ minWidth: "120px" }}
              >
                <button
                  onClick={() => handleSort("avgRunTime")}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  title="按平均运行时长排序"
                >
                  <span>平均运行时长</span>
                  <ArrowUpDown className="w-3 h-3" />
                  {sortBy === "avgRunTime" && (
                    <span className="text-blue-600">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </th>
              {/* 新增：健康度列 */}
              <th
                className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500"
                style={{ minWidth: "80px" }}
              >
                健康度
              </th>
              {/* 新增：QG状态列 */}
              <th
                className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500"
                style={{ minWidth: "80px" }}
              >
                QG状态
              </th>
              {userRole && (
                <th
                  className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500"
                  style={{ minWidth: "80px" }}
                >
                  <button
                    onClick={() => handleSort("relevance")}
                    className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                    title="按相关度排序"
                  >
                    <span>相关度</span>
                    <ArrowUpDown className="w-3 h-3" />
                    {sortBy === "relevance" && (
                      <span className="text-blue-600">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                </th>
              )}
              <th
                className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500"
                style={{ minWidth: "100px" }}
              >
                创建者
              </th>
              <th
                className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500"
                style={{ minWidth: "120px" }}
              >
                <button
                  onClick={() => handleSort("createTime")}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  title="按创建时间排序"
                >
                  <span>创建时间</span>
                  <ArrowUpDown className="w-3 h-3" />
                  {sortBy === "createTime" && (
                    <span className="text-blue-600">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </th>
              <th
                className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500"
                style={{ minWidth: "120px" }}
              >
                最后运行时间
              </th>
              <th
                className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500"
                style={{ minWidth: "80px" }}
              >
                <button
                  onClick={() => handleSort("runCount")}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  title="按运行次数排序"
                >
                  <span>运行次数</span>
                  <ArrowUpDown className="w-3 h-3" />
                  {sortBy === "runCount" && (
                    <span className="text-blue-600">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </th>
              <th
                className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500"
                style={{ minWidth: "80px" }}
              >
                <button
                  onClick={() => handleSort("priority")}
                  className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
                  title="按优先级排序"
                >
                  <span>优先级</span>
                  <ArrowUpDown className="w-3 h-3" />
                  {sortBy === "priority" && (
                    <span className="text-blue-600">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </button>
              </th>
              <th
                className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500"
                style={{ minWidth: "200px" }}
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredWorkflows.map((workflow) => {
              const metrics = getWorkflowMetrics(workflow);
              return (
                <tr
                  key={workflow.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedWorkflows.has(workflow.id)
                      ? "bg-blue-50"
                      : ""
                  } ${
                    userRole &&
                    getWorkflowRelevance(workflow) === "高"
                      ? "bg-red-50/30 border-l-4 border-l-red-200"
                      : userRole &&
                          getWorkflowRelevance(workflow) ===
                            "中"
                        ? "bg-yellow-50/30 border-l-4 border-l-yellow-200"
                        : ""
                  }`}
                >
                  {/* 新增：批量选择单元格 */}
                  {!isPublic && activeTab === "personal" && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Checkbox
                        checked={selectedWorkflows.has(
                          workflow.id,
                        )}
                        onCheckedChange={(checked) =>
                          handleSelectWorkflow(
                            workflow.id,
                            !!checked,
                          )
                        }
                      />
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          if (
                            workflow.name === "整车碰撞安全分析"
                          ) {
                            handleWorkflowClick(workflow.id);
                          } else {
                            toast.info(
                              "该工作流暂未开放编辑功能",
                            );
                          }
                        }}
                        className={`text-sm font-medium transition-colors ${
                          workflow.name === "整车碰撞安全分析"
                            ? "text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                            : "text-gray-500 cursor-not-allowed"
                        }`}
                        title={
                          workflow.name === "整车碰撞安全分析"
                            ? workflow.description
                            : "该工作流暂未开放编辑功能"
                        }
                      >
                        {workflow.name}
                      </button>
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                      {isPublic && (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-600 text-xs"
                        >
                          公共
                        </Badge>
                      )}
                      {activeTab === "templates" && (
                        <Badge
                          variant="outline"
                          className="bg-purple-50 text-purple-600 text-xs"
                        >
                          模板
                        </Badge>
                      )}
                      {getRelevanceBadge(workflow)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {workflow.type}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(workflow.status)}
                  </td>
                  {/* 新增：运行成功率单元格 */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Progress
                        value={metrics.successRate}
                        className="w-16 h-2"
                      />
                      <span className="text-sm text-gray-900 min-w-[3rem]">
                        {metrics.successRate}%
                      </span>
                    </div>
                  </td>
                  {/* 新增：平均运行时长单元格 */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {Math.floor(metrics.avgRunTime / 60)}h{" "}
                        {metrics.avgRunTime % 60}m
                      </span>
                    </div>
                  </td>
                  {/* 新增：健康度单元格 */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getHealthIndicator(workflow)}
                  </td>
                  {/* 新增：QG状态单元格 */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getQGStatusIndicator(workflow)}
                  </td>
                  {userRole && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        {getWorkflowRelevance(workflow) ===
                          "高" && (
                          <Heart className="w-4 h-4 text-red-500" />
                        )}
                        {getWorkflowRelevance(workflow) ===
                          "中" && (
                          <Lightbulb className="w-4 h-4 text-yellow-500" />
                        )}
                        <span
                          className={`text-sm ${
                            getWorkflowRelevance(workflow) ===
                            "高"
                              ? "text-red-700 font-medium"
                              : getWorkflowRelevance(
                                    workflow,
                                  ) === "中"
                                ? "text-yellow-700 font-medium"
                                : "text-gray-500"
                          }`}
                        >
                          {getWorkflowRelevance(workflow)}
                        </span>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {workflow.creator}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {workflow.createTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {workflow.lastRunTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {workflow.runCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPriorityBadge(workflow.priority)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderActionButtons(workflow, isPublic)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        {/* 角色相关提示 */}
        {userRole && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                为{" "}
                <span className="font-medium">
                  {getRoleDisplayName(userRole)}
                </span>
                优化显示，高相关度工作流将优先展示并带有特殊标识。
              </span>
            </div>
          </div>
        )}

        {/* 新增：批量操作工具栏 */}
        {selectedWorkflows.size > 0 &&
          activeTab === "personal" && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 text-yellow-800"
                  >
                    已选择 {selectedWorkflows.size} 个工作流
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleBatchOperation("deactivate")
                    }
                    className="flex items-center space-x-1"
                  >
                    <PauseCircle className="w-3 h-3" />
                    <span>批量停用</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleBatchOperation("validate")
                    }
                    className="flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>批量回归验证</span>
                  </Button>
                  {userRole === "admin" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleBatchOperation("priority")
                      }
                      className="flex items-center space-x-1 bg-red-50 text-red-700 border-red-200"
                    >
                      <Settings className="w-3 h-3" />
                      <span>调整优先级</span>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setSelectedWorkflows(new Set())
                    }
                    className="text-gray-500"
                  >
                    取消选择
                  </Button>
                </div>
              </div>
            </div>
          )}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="搜索工作流名称或创建者..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 排序选择器 */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createTime">
                  创建时间
                </SelectItem>
                {userRole && (
                  <SelectItem value="relevance">
                    相关度
                  </SelectItem>
                )}
                <SelectItem value="priority">优先级</SelectItem>
                <SelectItem value="runCount">
                  运行次数
                </SelectItem>
                <SelectItem value="successRate">
                  运行成功率
                </SelectItem>
                <SelectItem value="avgRunTime">
                  运行时长
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={currentStatusFilter}
              onValueChange={setCurrentStatusFilter}
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="全部状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                {userRole && (
                  <SelectItem value="recommended">
                    推荐工作流
                  </SelectItem>
                )}
                {userRole && (
                  <SelectItem value="high-relevance">
                    高相关度
                  </SelectItem>
                )}
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="reviewing">
                  审核中
                </SelectItem>
                <SelectItem value="published">
                  已发布
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="全部类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="安全仿真">
                  安全仿真
                </SelectItem>
                <SelectItem value="性能优化">
                  性能优化
                </SelectItem>
                <SelectItem value="结构优化">
                  结构优化
                </SelectItem>
                <SelectItem value="热管理">热管理</SelectItem>
                <SelectItem value="操控优化">
                  操控优化
                </SelectItem>
                <SelectItem value="品质提升">
                  品质提升
                </SelectItem>
                <SelectItem value="智能驾驶">
                  智能驾驶
                </SelectItem>
                <SelectItem value="舒适性">舒适性</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={priorityFilter}
              onValueChange={setPriorityFilter}
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="全部优先级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部优先级</SelectItem>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="low">低</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-3">
            {/* 智能推荐按钮 */}
            {userRole && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  onShowRecommendationPanel &&
                  onShowRecommendationPanel(true)
                }
                className="flex items-center space-x-2 border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                <Lightbulb className="w-4 h-4" />
                <span>智能推荐</span>
              </Button>
            )}

            {/* 角色向导按钮 */}
            {userRole && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  onShowRoleWizard && onShowRoleWizard(true)
                }
                className="flex items-center space-x-2 border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Users className="w-4 h-4" />
                <span>角色向导</span>
              </Button>
            )}

            <Button
              size="sm"
              onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              创建
            </Button>
          </div>
        </div>
      </div>

      {/* 分类标签页 */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="px-6 py-2 border-b border-gray-200">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger
              value="public"
              className="flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>公共工作流</span>
              <Badge variant="secondary" className="text-xs">
                {publicWorkflows.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="personal"
              className="flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>个人工作流</span>
              <Badge variant="secondary" className="text-xs">
                {personalWorkflows.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="flex items-center space-x-2"
            >
              <Library className="w-4 h-4" />
              <span>公共模板</span>
              <Badge variant="secondary" className="text-xs">
                {templateWorkflows.length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6">
          <TabsContent value="public" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">公共工作流</h3>
                <Badge variant="outline" className="text-xs">
                  共 {publicWorkflows.length} 个工作流
                </Badge>
              </div>
              {renderWorkflowTable(true)}
            </div>
          </TabsContent>

          <TabsContent value="personal" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">个人工作流</h3>
                <Badge variant="outline" className="text-xs">
                  共 {personalWorkflows.length} 个工作流
                </Badge>
              </div>
              {renderWorkflowTable(false)}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="mt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">公共模板</h3>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className="text-xs bg-purple-50 text-purple-700"
                  >
                    可直接克隆使用
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    共 {templateWorkflows.length} 个模板
                  </Badge>
                </div>
              </div>
              {renderWorkflowTable(true)}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* 新增：QG状态详情弹窗 */}
      <Dialog
        open={showQGStatusDialog}
        onOpenChange={setShowQGStatusDialog}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>QG状态详情</span>
            </DialogTitle>
            <DialogDescription>
              {selectedQGWorkflow?.name} - 质量门证据包清单
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* QG完整性概览 */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">证据完整性</h4>
                <div className="flex items-center space-x-2">
                  {selectedQGWorkflow &&
                    getQGStatusIndicator(selectedQGWorkflow)}
                </div>
              </div>
              {selectedQGWorkflow && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>已完成证据包</span>
                    <span>8/12</span>
                  </div>
                  <Progress value={67} className="h-2" />
                  <p className="text-xs text-gray-600">
                    还需完成 4 个必要证据包才能通过QG
                  </p>
                </div>
              )}
            </div>

            {/* 证据包清单 */}
            <div className="space-y-4">
              <h4 className="font-medium">证据包清单</h4>
              <div className="space-y-3">
                {[
                  {
                    name: "需求追溯矩阵",
                    status: "complete",
                    type: "requirement",
                  },
                  {
                    name: "系统架构模型",
                    status: "complete",
                    type: "architecture",
                  },
                  {
                    name: "仿真验证报告",
                    status: "complete",
                    type: "simulation",
                  },
                  {
                    name: "代码覆盖率报告",
                    status: "incomplete",
                    type: "testing",
                  },
                  {
                    name: "性能测试报告",
                    status: "incomplete",
                    type: "performance",
                  },
                  {
                    name: "安全分析报告",
                    status: "complete",
                    type: "safety",
                  },
                  {
                    name: "合规性检查报告",
                    status: "incomplete",
                    type: "compliance",
                  },
                  {
                    name: "变更影响分析",
                    status: "complete",
                    type: "change",
                  },
                  {
                    name: "风险评估报告",
                    status: "complete",
                    type: "risk",
                  },
                  {
                    name: "测试用例执行报告",
                    status: "incomplete",
                    type: "testing",
                  },
                  {
                    name: "用户验收报告",
                    status: "complete",
                    type: "acceptance",
                  },
                  {
                    name: "技术文档",
                    status: "complete",
                    type: "documentation",
                  },
                ].map((evidence, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          evidence.status === "complete"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />
                      <div>
                        <span className="text-sm font-medium">
                          {evidence.name}
                        </span>
                        <div className="flex items-center space-x-1 mt-1">
                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            {evidence.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {evidence.status === "complete" ? (
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          已完成
                        </Badge>
                      ) : (
                        <Badge
                          variant="destructive"
                          className="text-xs"
                        >
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          缺失
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                      >
                        <FileText className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 创建工作流对话框 */}
      {showCreateDialog && (
        <CreateWorkflowDialog
          onClose={() => setShowCreateDialog(false)}
          onConfirm={onCreateWorkflow}
          userRole={userRole}
        />
      )}
    </div>
  );
}