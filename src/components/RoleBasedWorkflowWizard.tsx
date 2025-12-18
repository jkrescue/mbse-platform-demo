import { useState } from "react";
import { 
  Users, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  AlertCircle,
  Lightbulb,
  Target,
  Wrench,
  BarChart3,
  Settings,
  Globe,
  Star,
  ArrowRight
} from "lucide-react@0.487.0";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "sonner@2.0.3";

interface RoleBasedWorkflowWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (workflowData: any) => void;
  userRole?: string;
}

// 角色特定的工作流模板
const roleTemplates = {
  admin: [
    {
      id: "admin-monitoring",
      name: "平台监控与管理",
      description: "系统性能监控、用户管理、权限控制的综合管理工作流",
      type: "系统管理",
      priority: "高",
      suggestedComponents: ["用户权限管理", "系统监控", "数据备份", "安全审计"],
      estimatedTime: "2-3小时",
      complexity: "中等",
      icon: "🔧"
    },
    {
      id: "admin-analytics",
      name: "数据分析与报告",
      description: "平台使用情况分析、性能报告生成、决策支持",
      type: "数据分析",
      priority: "中",
      suggestedComponents: ["数据采集", "统计分析", "报告生成", "可视化展示"],
      estimatedTime: "3-4小时",
      complexity: "高",
      icon: "📊"
    }
  ],
  projectManager: [
    {
      id: "pm-planning",
      name: "项目规划与跟踪",
      description: "项目计划制定、进度跟踪、资源分配、风险管理",
      type: "项目管理",
      priority: "高",
      suggestedComponents: ["项目计划", "任务分配", "进度跟踪", "风险评估"],
      estimatedTime: "4-6小时",
      complexity: "中等",
      icon: "📋"
    },
    {
      id: "pm-coordination",
      name: "团队协调与沟通",
      description: "跨部门协调、团队沟通、会议管理、决策执行",
      type: "协调管理",
      priority: "中",
      suggestedComponents: ["团队管理", "沟通协调", "会议安排", "决策记录"],
      estimatedTime: "2-3小时",
      complexity: "低",
      icon: "👥"
    }
  ],
  architect: [
    {
      id: "arch-design",
      name: "系统架构设计",
      description: "系统架构设计、模块化建模、接口定义、架构验证",
      type: "架构设计",
      priority: "高",
      suggestedComponents: ["SysML建模", "架构验证", "接口设计", "模块化设计"],
      estimatedTime: "6-8小时",
      complexity: "高",
      icon: "🏗️"
    },
    {
      id: "arch-integration",
      name: "系统集成与优化",
      description: "系统集成、性能优化、架构重构、标准制定",
      type: "系统集成",
      priority: "中",
      suggestedComponents: ["系统集成", "性能优化", "架构重构", "标准规范"],
      estimatedTime: "5-7小时",
      complexity: "高",
      icon: "⚙️"
    }
  ],
  simulation: [
    {
      id: "sim-modeling",
      name: "仿真模型构建",
      description: "多物理域建模、仿真环境搭建、参数配置、模型验证",
      type: "仿真建模",
      priority: "高",
      suggestedComponents: ["Modelica建模", "M-WORKS仿真", "参数优化", "结果验证"],
      estimatedTime: "8-10小时",
      complexity: "高",
      icon: "🔬"
    },
    {
      id: "sim-analysis",
      name: "仿真分析与优化",
      description: "仿真结果分析、性能评估、参数优化、报告生成",
      type: "分析优化",
      priority: "中",
      suggestedComponents: ["数据分析", "DOE实验", "优化算法", "报告生成"],
      estimatedTime: "4-6小时",
      complexity: "中等",
      icon: "📈"
    }
  ],
  modeling: [
    {
      id: "model-development",
      name: "模型开发与验证",
      description: "数学模型建立、模型校准、验证测试、文档编写",
      type: "模型开发",
      priority: "高",
      suggestedComponents: ["数学建模", "模型校准", "验证测试", "文档管理"],
      estimatedTime: "6-8小时",
      complexity: "高",
      icon: "🧮"
    },
    {
      id: "model-library",
      name: "模型库管理",
      description: "模型库建设、版本管理、标准化、复用管理",
      type: "库管理",
      priority: "中",
      suggestedComponents: ["版本控制", "标准化", "复用管理", "质量控制"],
      estimatedTime: "3-4小时",
      complexity: "中等",
      icon: "📚"
    }
  ]
};

// 工作流类型定义
const workflowTypes = [
  { value: "安全仿真", label: "安全仿真", description: "碰撞安全、结构安全等仿真分析" },
  { value: "性能优化", label: "性能优化", description: "动力性能、燃油经济性等优化" },
  { value: "结构优化", label: "结构优化", description: "轻量化设计、结构强度优化" },
  { value: "热管理", label: "热管理", description: "电池热管理、发动机热管理" },
  { value: "操控优化", label: "操控优化", description: "底盘调校、悬挂优化" },
  { value: "品质提升", label: "品质提升", description: "NVH控制、耐久性测试" },
  { value: "智能驾驶", label: "智能驾驶", description: "自动驾驶算法、ADAS系统" },
  { value: "系统管理", label: "系统管理", description: "平台管理、用户权限" },
  { value: "项目管理", label: "项目管理", description: "项目规划、进度跟踪" },
  { value: "架构设计", label: "架构设计", description: "系统架构、模块化设计" },
  { value: "仿真建模", label: "仿真建模", description: "多物理域建模、仿真分析" },
  { value: "模型开发", label: "模型开发", description: "数学建模、模型验证" }
];

export function RoleBasedWorkflowWizard({ 
  open, 
  onOpenChange, 
  onComplete, 
  userRole 
}: RoleBasedWorkflowWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [workflowData, setWorkflowData] = useState({
    name: "",
    description: "",
    type: "",
    priority: "中",
    customComponents: [] as string[],
    estimatedDuration: "",
    tags: [] as string[],
    isPublic: false
  });

  const steps = [
    { id: "template", title: "选择模板", description: "基于您的角色选择合适的工作流模板" },
    { id: "customize", title: "自定义", description: "根据具体需求调整工作流配置" },
    { id: "details", title: "详细信息", description: "填写工作流的详细信息" },
    { id: "review", title: "确认", description: "检查并确认工作流配置" }
  ];

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

  // 获取当前角色的模板
  const getCurrentRoleTemplates = () => {
    if (!userRole || !roleTemplates[userRole as keyof typeof roleTemplates]) {
      return [];
    }
    return roleTemplates[userRole as keyof typeof roleTemplates];
  };

  // 处理模板选择
  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setWorkflowData(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      type: template.type,
      priority: template.priority
    }));
  };

  // 处理下一步
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // 处理上一步
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 处理完成
  const handleComplete = () => {
    const finalWorkflowData = {
      ...workflowData,
      template: selectedTemplate,
      roleOptimized: true,
      userRole: userRole,
      suggestedComponents: selectedTemplate?.suggestedComponents || []
    };

    onComplete(finalWorkflowData);
    onOpenChange(false);
    toast.success(`已创建基于${getRoleDisplayName(userRole || '')}的工作流模板`);
  };

  // 渲染模板选择步骤
  const renderTemplateStep = () => (
    <div className="space-y-6">
      {/* 角色提示 */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-900">
              {userRole ? `${getRoleDisplayName(userRole)}专属模板` : '通用模板'}
            </h3>
            <p className="text-sm text-blue-800">
              {userRole ? 
                `以下模板专为${getRoleDisplayName(userRole)}的工作特点设计，助您快速创建高效工作流。` :
                '选择适合您工作需求的模板，快速开始工作流创建。'
              }
            </p>
          </div>
        </div>
      </div>

      {/* 模板列表 */}
      <div className="space-y-3">
        {getCurrentRoleTemplates().length > 0 ? (
          getCurrentRoleTemplates().map((template) => (
            <Card
              key={template.id}
              className={`p-4 cursor-pointer border-2 transition-all hover:shadow-md ${
                selectedTemplate?.id === template.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleTemplateSelect(template)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="text-2xl">{template.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{template.name}</h4>
                      <Badge variant="outline" className={
                        template.priority === '高' ? 'border-red-200 text-red-700' :
                        template.priority === '中' ? 'border-yellow-200 text-yellow-700' :
                        'border-gray-200 text-gray-700'
                      }>
                        {template.priority}优先级
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-2">
                      {template.suggestedComponents.slice(0, 3).map((component: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {component}
                        </Badge>
                      ))}
                      {template.suggestedComponents.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.suggestedComponents.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>⏱️ 预计用时: {template.estimatedTime}</span>
                      <span>📊 复杂度: {template.complexity}</span>
                      <span>🏷️ 类型: {template.type}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {selectedTemplate?.id === template.id && (
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>暂无可用的角色模板</p>
            <p className="text-sm mt-1">您可以跳过此步骤，创建自定义工作流</p>
          </div>
        )}
      </div>

      {/* 自定义选项 */}
      <Card className="p-4 border-dashed border-gray-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-gray-400" />
            <div>
              <h4 className="font-medium">自定义工作流</h4>
              <p className="text-sm text-gray-600">不使用模板，完全自定义创建</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedTemplate(null);
              setWorkflowData(prev => ({
                ...prev,
                name: "",
                description: "",
                type: "",
                priority: "中"
              }));
              handleNext();
            }}
          >
            自定义创建
          </Button>
        </div>
      </Card>
    </div>
  );

  // 渲染自定义步骤
  const renderCustomizeStep = () => (
    <div className="space-y-6">
      {selectedTemplate && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium text-green-900">已选择模板: {selectedTemplate.name}</span>
          </div>
          <p className="text-sm text-green-800">
            您可以根据实际需求调整模板配置，或保持默认设置继续下一步。
          </p>
        </div>
      )}

      {/* 建议组件 */}
      <div>
        <label className="block font-medium mb-2">推荐组件</label>
        <div className="space-y-2">
          {selectedTemplate?.suggestedComponents.map((component: string, index: number) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
              <Checkbox 
                id={`component-${index}`}
                defaultChecked 
                onCheckedChange={(checked) => {
                  if (checked) {
                    setWorkflowData(prev => ({
                      ...prev,
                      customComponents: [...prev.customComponents.filter(c => c !== component), component]
                    }));
                  } else {
                    setWorkflowData(prev => ({
                      ...prev,
                      customComponents: prev.customComponents.filter(c => c !== component)
                    }));
                  }
                }}
              />
              <label htmlFor={`component-${index}`} className="text-sm">
                {component}
              </label>
              <Badge variant="secondary" className="text-xs">推荐</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* 预计工时 */}
      <div>
        <label className="block font-medium mb-2">预计工时</label>
        <Input
          placeholder="如：4-6小时"
          value={workflowData.estimatedDuration}
          onChange={(e) => setWorkflowData(prev => ({ ...prev, estimatedDuration: e.target.value }))}
        />
      </div>

      {/* 标签 */}
      <div>
        <label className="block font-medium mb-2">工作流标签</label>
        <div className="flex flex-wrap gap-2">
          {['高效', '协作', '自动化', '标准化', '创新'].map((tag) => (
            <Badge
              key={tag}
              variant={workflowData.tags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                if (workflowData.tags.includes(tag)) {
                  setWorkflowData(prev => ({
                    ...prev,
                    tags: prev.tags.filter(t => t !== tag)
                  }));
                } else {
                  setWorkflowData(prev => ({
                    ...prev,
                    tags: [...prev.tags, tag]
                  }));
                }
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  // 渲染详细信息步骤
  const renderDetailsStep = () => (
    <div className="space-y-6">
      {/* 基本信息 */}
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-2">工作流名称 *</label>
          <Input
            placeholder="请输入工作流名称"
            value={workflowData.name}
            onChange={(e) => setWorkflowData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">描述信息</label>
          <Textarea
            placeholder="请描述工作流的用途和特点"
            value={workflowData.description}
            onChange={(e) => setWorkflowData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
        </div>

        <div>
          <label className="block font-medium mb-2">工作流类型 *</label>
          <Select
            value={workflowData.type}
            onValueChange={(value) => setWorkflowData(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择工作流类型" />
            </SelectTrigger>
            <SelectContent>
              {workflowTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-gray-600">{type.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block font-medium mb-2">优先级</label>
          <Select
            value={workflowData.priority}
            onValueChange={(value) => setWorkflowData(prev => ({ ...prev, priority: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="高">高优先级</SelectItem>
              <SelectItem value="中">中优先级</SelectItem>
              <SelectItem value="低">低优先级</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 公开设置 */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isPublic"
          checked={workflowData.isPublic}
          onCheckedChange={(checked) => setWorkflowData(prev => ({ ...prev, isPublic: !!checked }))}
        />
        <label htmlFor="isPublic" className="text-sm">
          公开此工作流 <span className="text-gray-500">(其他用户可以查看和复制)</span>
        </label>
      </div>
    </div>
  );

  // 渲染确认步骤
  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-3">工作流配置概览</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-600">名称:</span>
            <p className="font-medium">{workflowData.name || '未设置'}</p>
          </div>
          
          <div>
            <span className="text-sm text-gray-600">类型:</span>
            <p className="font-medium">{workflowData.type || '未设置'}</p>
          </div>
          
          <div>
            <span className="text-sm text-gray-600">优先级:</span>
            <Badge variant="outline" className={
              workflowData.priority === '高' ? 'border-red-200 text-red-700' :
              workflowData.priority === '中' ? 'border-yellow-200 text-yellow-700' :
              'border-gray-200 text-gray-700'
            }>
              {workflowData.priority}
            </Badge>
          </div>
          
          <div>
            <span className="text-sm text-gray-600">模板:</span>
            <p className="font-medium">{selectedTemplate?.name || '自定义'}</p>
          </div>
        </div>

        {workflowData.description && (
          <div className="mt-4">
            <span className="text-sm text-gray-600">描述:</span>
            <p className="mt-1 text-sm">{workflowData.description}</p>
          </div>
        )}

        {workflowData.tags.length > 0 && (
          <div className="mt-4">
            <span className="text-sm text-gray-600">标签:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {workflowData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          </div>
        )}

        {workflowData.customComponents.length > 0 && (
          <div className="mt-4">
            <span className="text-sm text-gray-600">包含组件:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {workflowData.customComponents.map((component, index) => (
                <Badge key={index} variant="outline" className="text-xs">{component}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 角色优化提示 */}
      {userRole && selectedTemplate && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Star className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-blue-900 mb-1">角色优化配置</h5>
              <p className="text-sm text-blue-800">
                此工作流已根据您的{getRoleDisplayName(userRole)}角色进行优化配置，
                包含推荐的组件和最佳实践设置。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 验证提示 */}
      {(!workflowData.name || !workflowData.type) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h5 className="font-medium text-red-900 mb-1">信息不完整</h5>
              <p className="text-sm text-red-800">
                请确保已填写工作流名称和类型等必需信息。
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const isNextDisabled = () => {
    switch (currentStep) {
      case 0: // 模板选择步骤
        return false; // 可以跳过模板选择
      case 1: // 自定义步骤
        return false;
      case 2: // 详细信息步骤
        return !workflowData.name || !workflowData.type;
      default:
        return false;
    }
  };

  const isCompleteDisabled = () => {
    return !workflowData.name || !workflowData.type;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <span>角色导向工作流创建向导</span>
            {userRole && (
              <Badge variant="outline" className="text-xs">
                {getRoleDisplayName(userRole)}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* 步骤指示器 */}
        <div className="flex items-center justify-between mb-6 px-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                index <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
              </div>
              <div className="ml-2 min-w-0">
                <p className={`text-sm font-medium ${index <= currentStep ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step.title}
                </p>
                <p className={`text-xs ${index <= currentStep ? 'text-gray-600' : 'text-gray-400'}`}>
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="w-4 h-4 mx-4 text-gray-400" />
              )}
            </div>
          ))}
        </div>

        {/* 步骤内容 */}
        <div className="min-h-[400px] px-4">
          {currentStep === 0 && renderTemplateStep()}
          {currentStep === 1 && renderCustomizeStep()}
          {currentStep === 2 && renderDetailsStep()}
          {currentStep === 3 && renderReviewStep()}
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            上一步
          </Button>

          <div className="text-sm text-gray-500">
            步骤 {currentStep + 1} / {steps.length}
          </div>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleComplete}
              disabled={isCompleteDisabled()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              创建工作流
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={isNextDisabled()}
            >
              下一步
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}