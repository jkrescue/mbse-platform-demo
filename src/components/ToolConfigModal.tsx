import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";
import {
  Database,
  FileText,
  GitBranch,
  Cpu,
  TestTube,
  Zap,
  BarChart3,
  Globe,
} from "lucide-react@0.487.0";

interface ToolConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (modelData: any) => void;
  selectedTool?: string;
}

// 模型类型配置 - 基于RFLP和MBSE方法学重新设计
const modelTypes = [
  {
    id: "requirements-model",
    name: "需求模型",
    description: "系统需求的捕获、分析和管理，建立需求与设计的追溯关系",
    icon: <FileText className="w-4 h-4" />,
    category: "需求层(R)",
    complexity: "中",
    estimatedTime: "1-2周",
  },
  {
    id: "functional-model",
    name: "功能架构模型",
    description: "系统功能分解和功能行为建模，定义系统的功能视图",
    icon: <GitBranch className="w-4 h-4" />,
    category: "功能层(F)",
    complexity: "中",
    estimatedTime: "2-3周",
  },
  {
    id: "logical-model",
    name: "逻辑架构模型",
    description: "系统逻辑结构设计，定义组件间的逻辑关系和接口",
    icon: <Database className="w-4 h-4" />,
    category: "逻辑层(L)",
    complexity: "高",
    estimatedTime: "2-4周",
  },
  {
    id: "physical-model",
    name: "物理架构模型",
    description: "系统物理实现设计，定义硬件组件的物理布局和连接",
    icon: <Cpu className="w-4 h-4" />,
    category: "物理层(P)",
    complexity: "高",
    estimatedTime: "3-4周",
  },
  {
    id: "simulation-model",
    name: "系统仿真模型",
    description: "多学科仿真分析模型，支持系统级性能仿真和优化",
    icon: <Zap className="w-4 h-4" />,
    category: "仿真分析",
    complexity: "高",
    estimatedTime: "3-5周",
  },
  {
    id: "verification-model",
    name: "验证确认模型",
    description: "测试验证和确认模型，支持V&V活动和合规性验证",
    icon: <TestTube className="w-4 h-4" />,
    category: "验证确认",
    complexity: "中",
    estimatedTime: "2-3周",
  },
  {
    id: "integration-model",
    name: "系统集成模型",
    description: "多工具、多领域集成模型，支持协同仿真和数据交换",
    icon: <Globe className="w-4 h-4" />,
    category: "系统集成",
    complexity: "高",
    estimatedTime: "4-6周",
  },
  {
    id: "optimization-model",
    name: "优化分析模型",
    description: "设计优化和参数调优模型，支持多目标优化和敏感性分析",
    icon: <BarChart3 className="w-4 h-4" />,
    category: "优化分析",
    complexity: "中",
    estimatedTime: "2-4周",
  },
];

// 支持的建模工具 - 基于MBSE工具链重新整理
const supportedTools = [
  { id: "polarion", name: "POLARION ALM", description: "需求管理和协作平台" },
  { id: "doors", name: "IBM DOORS Next", description: "专业需求管理工具" },
  { id: "ea", name: "Enterprise Architect", description: "UML/SysML架构建模" },
  { id: "magicdraw", name: "MagicDraw", description: "专业SysML建模工具" },
  { id: "rhapsody", name: "IBM Rhapsody", description: "MBSE建模和开发环境" },
  { id: "mworks", name: "MWorks", description: "多物理域系统仿真平台" },
  { id: "simulink", name: "MATLAB/Simulink", description: "控制系统建模仿真" },
  { id: "amesim", name: "Simcenter Amesim", description: "1D系统仿真平台" },
  { id: "ansys", name: "ANSYS Workbench", description: "多物理场仿真分析" },
  { id: "adams", name: "MSC Adams", description: "多体动力学仿真" },
  { id: "gt-power", name: "GT-POWER", description: "发动机仿真专业工具" },
  { id: "avl-cruise", name: "AVL CRUISE", description: "整车仿真工具" },
  { id: "carmaker", name: "CarMaker", description: "虚拟试验场仿真" },
  { id: "optiSLang", name: "ANSYS optiSLang", description: "多学科优化分析" },
];

export function ToolConfigModal({
  isOpen,
  onClose,
  onConfirm,
  selectedTool = "",
}: ToolConfigModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    modelType: "",
    targetTool: selectedTool,
    projectName: "",
    version: "1.0.0",
    priority: "中",
    tags: [] as string[],
    requirements: "",
  });

  const [currentTag, setCurrentTag] = useState("");
  const [selectedModelType, setSelectedModelType] = useState<any>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleModelTypeSelect = (typeId: string) => {
    const type = modelTypes.find(t => t.id === typeId);
    setSelectedModelType(type);
    handleInputChange("modelType", typeId);
  };

  const handleSubmit = () => {
    // 基本验证
    if (!formData.name.trim()) {
      toast.error("请输入模型名称");
      return;
    }
    
    if (!formData.modelType) {
      toast.error("请选择模型类型");
      return;
    }

    if (!formData.targetTool) {
      toast.error("请选择目标工具");
      return;
    }

    // 构造模型数据
    const modelData = {
      ...formData,
      id: `model_${Date.now()}`,
      createTime: new Date().toLocaleString('zh-CN'),
      status: "草稿",
      typeInfo: selectedModelType,
      estimatedCompletion: selectedModelType?.estimatedTime || "未知",
    };

    onConfirm(modelData);
    resetForm();
    toast.success(`新模型 "${formData.name}" 创建成功`);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      modelType: "",
      targetTool: selectedTool,
      projectName: "",
      version: "1.0.0",
      priority: "中",
      tags: [],
      requirements: "",
    });
    setSelectedModelType(null);
    setCurrentTag("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "高": return "bg-red-100 text-red-800";
      case "中": return "bg-yellow-100 text-yellow-800";
      case "低": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>创建新模型</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 基本信息 */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">模型名称 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="输入模型名称"
                />
              </div>
              <div>
                <Label htmlFor="version">版本号</Label>
                <Input
                  id="version"
                  value={formData.version}
                  onChange={(e) => handleInputChange("version", e.target.value)}
                  placeholder="1.0.0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">模型描述</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="描述模型的主要功能和应用场景"
                rows={3}
              />
            </div>
          </div>

          {/* 模型类型选择 */}
          <div className="space-y-4">
            <Label>模型类型 *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {modelTypes.map((type) => (
                <div
                  key={type.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    formData.modelType === type.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleModelTypeSelect(type.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-1 text-blue-600">{type.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{type.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {type.category}
                          </Badge>
                          <Badge 
                            className={`text-xs ${getComplexityColor(type.complexity)}`}
                          >
                            {type.complexity}度
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                      <div className="text-xs text-gray-500">
                        预估周期: {type.estimatedTime}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 工具和项目配置 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="targetTool">目标工具 *</Label>
              <Select
                value={formData.targetTool}
                onValueChange={(value) => handleInputChange("targetTool", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择建模工具" />
                </SelectTrigger>
                <SelectContent>
                  {supportedTools.map((tool) => (
                    <SelectItem key={tool.id} value={tool.id}>
                      <div>
                        <div className="font-medium">{tool.name}</div>
                        <div className="text-xs text-gray-500">{tool.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">优先级</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="高">高</SelectItem>
                  <SelectItem value="中">中</SelectItem>
                  <SelectItem value="低">低</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="projectName">关联项目</Label>
            <Input
              id="projectName"
              value={formData.projectName}
              onChange={(e) => handleInputChange("projectName", e.target.value)}
              placeholder="输入项目名称（可选）"
            />
          </div>

          {/* 标签管理 */}
          <div className="space-y-3">
            <Label>标签</Label>
            <div className="flex items-center space-x-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="添加标签"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={handleAddTag}>
                添加
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* 需求和约束 */}
          <div>
            <Label htmlFor="requirements">需求和约束</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleInputChange("requirements", e.target.value)}
              placeholder="描述模型的技术需求、性能指标、约束条件等"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            取消
          </Button>
          <Button onClick={handleSubmit}>
            创建模型
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}