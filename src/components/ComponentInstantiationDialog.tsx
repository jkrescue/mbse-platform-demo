import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "./ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { componentLibraryService } from "../services/ComponentLibraryService";
import { Package, Wrench, Brain, Globe, CheckCircle, AlertTriangle } from "lucide-react@0.487.0";
import { toast } from "sonner@2.0.3";

interface ComponentInstantiationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dependencyType: string;
  dependency: any;
  sourceApp?: any;
  onInstantiate?: (instance: any) => void;
}

export function ComponentInstantiationDialog({
  open,
  onOpenChange,
  dependencyType,
  dependency,
  sourceApp,
  onInstantiate
}: ComponentInstantiationDialogProps) {
  const [instanceConfig, setInstanceConfig] = useState({
    name: "",
    description: "",
    category: "",
    parameters: {}
  });
  
  const [isInstantiating, setIsInstantiating] = useState(false);

  // 获取详细组件信息
  const getComponentDetails = () => {
    if (dependencyType === 'components') {
      return componentLibraryService.getComponent(dependency.id) || dependency;
    } else if (dependencyType === 'toolServices') {
      return componentLibraryService.getToolService(dependency.id) || dependency;
    } else if (dependencyType === 'modelVersions') {
      return componentLibraryService.getModel(dependency.id) || dependency;
    }
    return dependency;
  };

  const componentDetails = getComponentDetails();

  // 获取依赖类型信息
  const getDependencyTypeInfo = () => {
    switch (dependencyType) {
      case 'components':
        return {
          label: '组件',
          icon: Package,
          color: 'blue'
        };
      case 'toolServices':
        return {
          label: '工具服务',
          icon: Wrench,
          color: 'green'
        };
      case 'modelVersions':
        return {
          label: '模型',
          icon: Brain,
          color: 'purple'
        };
      case 'externalAPIs':
        return {
          label: 'API',
          icon: Globe,
          color: 'orange'
        };
      default:
        return {
          label: '依赖',
          icon: Package,
          color: 'gray'
        };
    }
  };

  const typeInfo = getDependencyTypeInfo();
  const Icon = typeInfo.icon;

  // 处理实例化
  const handleInstantiate = async () => {
    if (!instanceConfig.name.trim()) {
      toast.error("请输入实例名称");
      return;
    }

    setIsInstantiating(true);

    try {
      // 使用组件库服务实例化组件
      const result = componentLibraryService.instantiateComponent(
        componentDetails.id || dependency.id,
        {
          name: instanceConfig.name,
          description: instanceConfig.description || componentDetails.metadata?.description || componentDetails.description,
          parameters: instanceConfig.parameters,
          category: instanceConfig.category || componentDetails.category
        }
      );

      if (result.success && result.instance) {
        // 触发实例化成功回调
        onInstantiate?.(result.instance);
        
        toast.success(`组件 "${instanceConfig.name}" 已成功实例化到您的工作区`);
        
        // 重置表单并关闭对话框
        setInstanceConfig({
          name: "",
          description: "",
          category: "",
          parameters: {}
        });
        onOpenChange(false);
      } else {
        toast.error(result.error || "实例化失败");
      }
    } catch (error) {
      console.error("实例化组件时出错:", error);
      toast.error("实例化过程中发生错误");
    } finally {
      setIsInstantiating(false);
    }
  };

  // 获取推荐组件
  const getRecommendedComponents = () => {
    if (componentDetails.id) {
      return componentLibraryService.getRecommendedComponents(componentDetails.id);
    }
    return [];
  };

  const recommendedComponents = getRecommendedComponents();

  // 检查兼容性
  const checkCompatibility = () => {
    if (componentDetails.id) {
      // 这里可以检查与当前工作流的兼容性
      return componentLibraryService.checkCompatibility([componentDetails.id]);
    }
    return { compatible: true, conflicts: [], missing: [] };
  };

  const compatibility = checkCompatibility();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Icon className={`w-5 h-5 text-${typeInfo.color}-600`} />
            实例化 {typeInfo.label}
          </DialogTitle>
          <DialogDescription>
            将选中的{typeInfo.label}实例化到您的个人工作区，可以自定义配置和参数
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 组件基本信息 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Icon className={`w-6 h-6 text-${typeInfo.color}-600`} />
                <div>
                  <h3 className="font-medium">{componentDetails.name || dependency.name}</h3>
                  <p className="text-sm text-gray-600">
                    {componentDetails.metadata?.description || componentDetails.description || dependency.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">v{componentDetails.version || dependency.version}</Badge>
                <Badge 
                  variant={
                    (componentDetails.status || dependency.status) === 'stable' || 
                    (componentDetails.status || dependency.status) === 'active' 
                      ? 'default' : 'secondary'
                  }
                >
                  {componentDetails.status || dependency.status}
                </Badge>
              </div>
            </div>

            {/* 兼容性检查 */}
            <div className="flex items-center gap-2">
              {compatibility.compatible ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700">兼容性检查通过</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700">发现兼容性问题</span>
                </>
              )}
            </div>

            {compatibility.conflicts.length > 0 && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-xs text-yellow-800">冲突提示: {compatibility.conflicts.join(", ")}</p>
              </div>
            )}
          </div>

          {/* 实例配置 */}
          <div className="space-y-4">
            <h4 className="font-medium">实例配置</h4>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="instanceName">实例名称 *</Label>
                <Input
                  id="instanceName"
                  value={instanceConfig.name}
                  onChange={(e) => setInstanceConfig(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={`${componentDetails.name || dependency.name} - 实例`}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="instanceDescription">实例描述</Label>
                <Textarea
                  id="instanceDescription"
                  value={instanceConfig.description}
                  onChange={(e) => setInstanceConfig(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="描述这个实例的用途和配置..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="instanceCategory">目标分类</Label>
                <Select 
                  value={instanceConfig.category} 
                  onValueChange={(value) => setInstanceConfig(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="选择实例所属分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="requirement-management">需求管理及同步</SelectItem>
                    <SelectItem value="function-architecture">功能与架构设计</SelectItem>
                    <SelectItem value="system-integration-sim">系统集成仿真</SelectItem>
                    <SelectItem value="cae-simulation">专业CAE仿真</SelectItem>
                    <SelectItem value="verification-validation">验证与确认</SelectItem>
                    <SelectItem value="optimization-analysis">优化分析</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* 推荐组件 */}
          {recommendedComponents.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">推荐组合组件</h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800 mb-2">
                  以下组件经常与此组件一起使用，可以提高工作效率：
                </p>
                <div className="flex flex-wrap gap-2">
                  {recommendedComponents.slice(0, 3).map((comp) => (
                    <Badge 
                      key={comp.id} 
                      variant="outline" 
                      className="text-xs border-blue-300 text-blue-700"
                    >
                      {comp.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 组件统计信息 */}
          {componentDetails.usageCount && (
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-2">使用统计</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-blue-600">{componentDetails.usageCount}</div>
                  <div className="text-xs text-gray-600">使用次数</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-600">
                    {componentDetails.metadata?.size ? `${(componentDetails.metadata.size / 1024).toFixed(1)}MB` : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600">组件大小</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-purple-600">
                    {componentDetails.metadata?.author || 'MBSE团队'}
                  </div>
                  <div className="text-xs text-gray-600">维护团队</div>
                </div>
              </div>
            </div>
          )}

          {/* 源应用信息 */}
          {sourceApp && (
            <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
              从应用 "{sourceApp.title}" 中选择的依赖组件
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isInstantiating}
          >
            取消
          </Button>
          <Button 
            onClick={handleInstantiate}
            disabled={isInstantiating || !instanceConfig.name.trim()}
          >
            {isInstantiating ? "实例化中..." : "创建实例"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}