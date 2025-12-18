import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Checkbox } from "../ui/checkbox";
import { 
  Shield,
  Zap, 
  Activity, 
  Settings,
  Play,
  Pause,
  RotateCcw,
  Heart,
  Archive,
  Trash2,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  BarChart3
} from "lucide-react@0.487.0";
import { toast } from "sonner@2.0.3";

interface OperationsPanelProps {
  apps: any[];
  selectedApps: string[];
  onAppSelection: (appIds: string[]) => void;
  userRole: string;
}

export function OperationsPanel({ apps, selectedApps, onAppSelection, userRole }: OperationsPanelProps) {
  const [activeOperation, setActiveOperation] = useState<string | null>(null);
  const [batchOperationDialog, setBatchOperationDialog] = useState(false);
  const [maintenanceDialog, setMaintenanceDialog] = useState(false);
  const [operationInProgress, setOperationInProgress] = useState(false);

  // 权限检查
  const canPerformOperations = ['admin', 'projectManager'].includes(userRole);

  if (!canPerformOperations) {
    return (
      <div className="text-center text-gray-500 py-8">
        <Shield className="w-12 h-12 mx-auto mb-4" />
        <p>您没有权限执行运维操作</p>
        <p className="text-sm mt-2">此功能仅对管理员和项目经理开放</p>
      </div>
    );
  }

  const handleQuickOperation = async (operationId: string) => {
    if (selectedApps.length === 0) {
      toast.error("请先选择要操作的应用");
      return;
    }

    setOperationInProgress(true);
    setActiveOperation(operationId);

    // 模拟操作执行
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      switch (operationId) {
        case 'enable':
          toast.success(`已启用 ${selectedApps.length} 个应用`);
          break;
        case 'disable':
          toast.success(`已停用 ${selectedApps.length} 个应用`);
          break;
        case 'restart':
          toast.success(`已重启 ${selectedApps.length} 个应用服务`);
          break;
        case 'health-check':
          toast.success(`已完成 ${selectedApps.length} 个应用的健康检查`);
          break;
        case 'backup':
          toast.success(`已创建 ${selectedApps.length} 个应用的数据备份`);
          break;
        case 'cleanup':
          toast.success(`已清理 ${selectedApps.length} 个应用的缓存`);
          break;
        default:
          toast.info(`操作 ${operationId} 已完成`);
      }
    } catch (error) {
      toast.error(`操作失败: ${error}`);
    } finally {
      setOperationInProgress(false);
      setActiveOperation(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 操作面板头部 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">快捷运维操作</h3>
            <p className="text-sm text-gray-600">
              已选择 {selectedApps.length} 个应用进行操作
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBatchOperationDialog(true)}
              disabled={selectedApps.length === 0}
            >
              <Settings className="w-4 h-4 mr-2" />
              批量配置
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMaintenanceDialog(true)}
            >
              <Clock className="w-4 h-4 mr-2" />
              维护计划
            </Button>
          </div>
        </div>

        {/* 应用选择器 */}
        <AppMultiSelect
          apps={apps}
          selectedApps={selectedApps}
          onSelection={onAppSelection}
        />
      </div>

      {/* 快速操作区域 */}
      <QuickOperationsSection
        selectedApps={selectedApps}
        onOperation={handleQuickOperation}
        operationInProgress={operationInProgress}
        activeOperation={activeOperation}
      />

      {/* 健康监控区域 */}
      <HealthMonitoringSection apps={apps} />

      {/* 批量操作对话框 */}
      <BatchOperationDialog
        isOpen={batchOperationDialog}
        onClose={() => setBatchOperationDialog(false)}
        selectedApps={selectedApps}
        apps={apps}
      />

      {/* 维护计划对话框 */}
      <MaintenanceScheduleDialog
        isOpen={maintenanceDialog}
        onClose={() => setMaintenanceDialog(false)}
        selectedApps={selectedApps}
      />
    </div>
  );
}

// 快速操作区域
function QuickOperationsSection({ 
  selectedApps, 
  onOperation, 
  operationInProgress, 
  activeOperation 
}: {
  selectedApps: string[];
  onOperation: (operationId: string) => void;
  operationInProgress: boolean;
  activeOperation: string | null;
}) {
  const quickOperations = [
    {
      id: 'enable',
      title: '批量启用',
      description: '启用选中的应用',
      icon: Play,
      color: 'green',
      disabled: selectedApps.length === 0
    },
    {
      id: 'disable',
      title: '批量停用',
      description: '停用选中的应用',
      icon: Pause,
      color: 'red',
      disabled: selectedApps.length === 0
    },
    {
      id: 'restart',
      title: '重启服务',
      description: '重启应用相关服务',
      icon: RotateCcw,
      color: 'blue',
      disabled: selectedApps.length === 0
    },
    {
      id: 'health-check',
      title: '健康检查',
      description: '执行应用健康检查',
      icon: Heart,
      color: 'pink',
      disabled: selectedApps.length === 0
    },
    {
      id: 'backup',
      title: '备份数据',
      description: '创建应用数据备份',
      icon: Archive,
      color: 'yellow',
      disabled: selectedApps.length === 0
    },
    {
      id: 'cleanup',
      title: '清理缓存',
      description: '清理应用缓存和临时文件',
      icon: Trash2,
      color: 'gray',
      disabled: selectedApps.length === 0
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          快速操作
        </CardTitle>
        <CardDescription>
          对选中的 {selectedApps.length} 个应用执行快速操作
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickOperations.map(operation => (
            <QuickOperationButton
              key={operation.id}
              operation={operation}
              onClick={() => onOperation(operation.id)}
              loading={operationInProgress && activeOperation === operation.id}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// 快速操作按钮
function QuickOperationButton({ 
  operation, 
  onClick, 
  loading 
}: { 
  operation: any; 
  onClick: () => void;
  loading: boolean;
}) {
  const colorClasses = {
    green: 'hover:bg-green-50 border-green-200 text-green-700',
    red: 'hover:bg-red-50 border-red-200 text-red-700',
    blue: 'hover:bg-blue-50 border-blue-200 text-blue-700',
    pink: 'hover:bg-pink-50 border-pink-200 text-pink-700',
    yellow: 'hover:bg-yellow-50 border-yellow-200 text-yellow-700',
    gray: 'hover:bg-gray-50 border-gray-200 text-gray-700'
  };

  return (
    <button
      onClick={onClick}
      disabled={operation.disabled || loading}
      className={`
        quick-operation-btn p-4 border rounded-lg text-center transition-all duration-200
        ${operation.disabled || loading ? 'opacity-50 cursor-not-allowed' : colorClasses[operation.color]}
      `}
    >
      {loading ? (
        <div className="animate-spin w-6 h-6 mx-auto mb-2 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <operation.icon className="h-6 w-6 mx-auto mb-2" />
      )}
      <div className="text-sm font-medium">{operation.title}</div>
      <div className="text-xs text-gray-600 mt-1">{operation.description}</div>
    </button>
  );
}

// 应用多选组件
function AppMultiSelect({ 
  apps, 
  selectedApps, 
  onSelection 
}: {
  apps: any[];
  selectedApps: string[];
  onSelection: (appIds: string[]) => void;
}) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelection(apps.map(app => app.id.toString()));
    } else {
      onSelection([]);
    }
  };

  const handleAppSelect = (appId: string, checked: boolean) => {
    if (checked) {
      onSelection([...selectedApps, appId]);
    } else {
      onSelection(selectedApps.filter(id => id !== appId));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Checkbox
          checked={selectedApps.length === apps.length}
          onCheckedChange={handleSelectAll}
        />
        <Label className="text-sm">全选应用 ({apps.length})</Label>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-48 overflow-y-auto">
        {apps.map(app => (
          <div key={app.id} className="flex items-center gap-2 p-2 rounded border">
            <Checkbox
              checked={selectedApps.includes(app.id.toString())}
              onCheckedChange={(checked) => handleAppSelect(app.id.toString(), checked)}
            />
            <div className={`w-8 h-8 rounded ${app.color} flex items-center justify-center text-white text-sm`}>
              {app.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{app.title}</div>
              <div className="text-xs text-gray-500">{app.author}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 健康监控区域
function HealthMonitoringSection({ apps }: { apps: any[] }) {
  const [monitoringEnabled, setMonitoringEnabled] = useState(true);
  const [healthData] = useState({
    healthy: 4,
    warning: 1,
    critical: 1
  });

  const [alertsData] = useState([
    {
      id: "1",
      type: "warning",
      app: "电池管理系统",
      message: "内存使用率超过80%",
      timestamp: "2分钟前"
    },
    {
      id: "2", 
      type: "critical",
      app: "整车动能安全",
      message: "服务响应时间过长",
      timestamp: "5分钟前"
    }
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 健康状态总览 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              健康状态总览
            </CardTitle>
            <Switch
              checked={monitoringEnabled}
              onCheckedChange={setMonitoringEnabled}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">健康状态图表</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-600">健康应用</span>
                <span className="font-medium">{healthData.healthy}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-yellow-600">警告状态</span>
                <span className="font-medium">{healthData.warning}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-red-600">异常状态</span>
                <span className="font-medium">{healthData.critical}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 实时告警 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            实时告警
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {alertsData.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
            
            {alertsData.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p>当前无告警信息</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 告警卡片
function AlertCard({ alert }: { alert: any }) {
  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'red';
      case 'warning': return 'yellow';
      case 'info': return 'blue';
      default: return 'gray';
    }
  };

  const color = getAlertColor(alert.type);

  return (
    <div className={`p-3 rounded-lg border border-${color}-200 bg-${color}-50`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={`w-4 h-4 text-${color}-600 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900">{alert.app}</div>
          <div className="text-sm text-gray-600">{alert.message}</div>
          <div className="text-xs text-gray-500 mt-1">{alert.timestamp}</div>
        </div>
      </div>
    </div>
  );
}

// 批量操作对话框
function BatchOperationDialog({ 
  isOpen, 
  onClose, 
  selectedApps, 
  apps 
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedApps: string[];
  apps: any[];
}) {
  const [operationType, setOperationType] = useState('');
  const [operationParams, setOperationParams] = useState({});

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>批量操作配置</DialogTitle>
          <DialogDescription>
            配置对选中的 {selectedApps.length} 个应用的批量操作
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 操作类型选择 */}
          <div>
            <Label className="font-medium">操作类型</Label>
            <Select value={operationType} onValueChange={setOperationType}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="选择要执行的操作" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="status-change">状态变更</SelectItem>
                <SelectItem value="maintenance">维护操作</SelectItem>
                <SelectItem value="testing">回归测试</SelectItem>
                <SelectItem value="backup">数据备份</SelectItem>
                <SelectItem value="cleanup">清理操作</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 执行计划配置 */}
          <div>
            <Label className="font-medium">执行计划</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Select defaultValue="immediate">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">立即执行</SelectItem>
                  <SelectItem value="scheduled">定时执行</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="parallel">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parallel">并行执行</SelectItem>
                  <SelectItem value="sequential">顺序执行</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 安全防护 */}
          <div>
            <Label className="font-medium">安全防护</Label>
            <div className="space-y-3 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="dryRun" />
                <Label htmlFor="dryRun" className="text-sm">演练模式（不实际执行）</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="confirmation" defaultChecked />
                <Label htmlFor="confirmation" className="text-sm">执行前需要确认</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="rollback" defaultChecked />
                <Label htmlFor="rollback" className="text-sm">支持回滚操作</Label>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button 
            onClick={() => {
              toast.success("批量操作已配置并启动");
              onClose();
            }}
            disabled={!operationType}
          >
            开始执行
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// 维护计划对话框
function MaintenanceScheduleDialog({ 
  isOpen, 
  onClose, 
  selectedApps 
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedApps: string[];
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>维护计划</DialogTitle>
          <DialogDescription>
            为选中的 {selectedApps.length} 个应用安排维护计划
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label className="font-medium">维护类型</Label>
            <Select defaultValue="routine">
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="routine">例行维护</SelectItem>
                <SelectItem value="emergency">紧急维护</SelectItem>
                <SelectItem value="upgrade">升级维护</SelectItem>
                <SelectItem value="security">安全维护</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="font-medium">计划时间</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <input 
                type="datetime-local" 
                className="px-3 py-2 border border-gray-300 rounded-md"
                placeholder="开始时间"
              />
              <input 
                type="datetime-local" 
                className="px-3 py-2 border border-gray-300 rounded-md"
                placeholder="结束时间"
              />
            </div>
          </div>

          <div>
            <Label className="font-medium">影响评估</Label>
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="text-sm text-yellow-800">
                预估停机时间: 30-60分钟<br/>
                影响用户数: 约{selectedApps.length * 20}人<br/>
                建议在业务低峰期执行
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={() => {
            toast.success("维护计划已创建");
            onClose();
          }}>
            创建计划
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}