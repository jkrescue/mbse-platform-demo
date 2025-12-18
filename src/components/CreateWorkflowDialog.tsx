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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import {
  Workflow,
  Database,
  Shield,
  BarChart3,
  Settings,
} from "lucide-react@0.487.0";

interface CreateWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (workflowData: any) => void;
}

const workflowTypes = [
  {
    id: "vehicle-safety",
    name: "功能安全",
    icon: Database,
    description: "整车功能安全分析",
  },
  {
    id: "vehicle-analysis",
    name: "整车车速分析",
    icon: BarChart3,
    description: "整车性能验证",
  },
  {
    id: "vehicle-HVAC",
    name: "空调热管理",
    icon: Shield,
    description: "热管理模拟",
  },
  {
    id: "vehicle-seat",
    name: "座椅系统评估",
    icon: Settings,
    description: "系统座椅模拟",
  },
];

export function CreateWorkflowDialog({
  open,
  onOpenChange,
  onConfirm,
}: CreateWorkflowDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    priority: "中",
    triggerType: "manual",
    schedule: "",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.type) {
      return;
    }
    onConfirm(formData);
    onOpenChange(false);
    // 重置表单
    setFormData({
      name: "",
      description: "",
      type: "",
      priority: "中",
      triggerType: "manual",
      schedule: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Workflow className="w-5 h-5 text-blue-600" />
            <span>创建新工作流</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* 基本信息 */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">工作流名称 *</Label>
                <Input
                  id="name"
                  placeholder="请输入工作流名称"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">优先级</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      priority: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择优先级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="高">高</SelectItem>
                    <SelectItem value="中">中</SelectItem>
                    <SelectItem value="低">低</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">工作流描述</Label>
              <Textarea
                id="description"
                placeholder="请输入工作流描述"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
          </div>

          {/* 工作流类型 */}
          <div className="space-y-3">
            <Label>工作流类型 *</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  type: value,
                }))
              }
            >
              <div className="grid grid-cols-2 gap-3">
                {workflowTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.id}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={type.id}
                        id={type.id}
                      />
                      <Label
                        htmlFor={type.id}
                        className="flex items-center space-x-2 cursor-pointer flex-1 p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <Icon className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">
                            {type.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {type.description}
                          </div>
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {/* 触发方式 */}
          <div className="space-y-3">
            <Label>执行方式</Label>
            <RadioGroup
              value={formData.triggerType}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  triggerType: value,
                }))
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="manual" id="manual" />
                <Label htmlFor="manual">手动执行</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="scheduled"
                  id="scheduled"
                />
                <Label htmlFor="scheduled">自动触发</Label>
              </div>
            </RadioGroup>

            {formData.triggerType === "scheduled" && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="schedule">调度设置</Label>
                <Input
                  id="schedule"
                  placeholder="如: 0 0 * * * (每日零点执行)"
                  value={formData.schedule}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      schedule: e.target.value,
                    }))
                  }
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.type}
          >
            创建并进入编辑
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}