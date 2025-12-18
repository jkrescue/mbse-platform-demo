import { useState, useEffect } from "react";
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
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { X, Settings, Save } from "lucide-react@0.487.0";
import { toast } from "sonner@2.0.3";

interface ArchConversionNodeConfigProps {
  node?: any;
  isOpen?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onSave: (config: any) => void;
  initialData?: any;
  nodeName?: string;
  nodeDescription?: string;
  userRole?: string;
}

export function ArchConversionNodeConfig({
  node,
  isOpen = true,
  onClose,
  onCancel,
  onSave,
  initialData,
  nodeName,
  nodeDescription,
  userRole,
}: ArchConversionNodeConfigProps) {
  const [config, setConfig] = useState({
    nodeName: "",
    nodeId: "",
    description: "",
    priority: "中",
    creator: "系统管理员",
    createTime: "",
    conversionType: "IBD_TO_SSP",
    sourceModel: "",
    targetFormat: "SSP",
    autoExecute: true,
    executionLog: [] as Array<{
      id: string;
      time: string;
      action: string;
      status: string;
    }>,
  });

  // 初始化配置数据
  useEffect(() => {
    if (node) {
      setConfig({
        nodeName: nodeName || node.name || "功能与架构设计",
        nodeId: node.id || "IDFAD-001",
        description:
          nodeDescription || node.description ||
          "基于需求模型完成功能与架构建模设计",
        priority: "中",
        creator: "系统管理员",
        createTime: new Date()
          .toLocaleString("zh-CN")
          .replace(/\//g, "/"),
        conversionType: "IBD_TO_SSP",
        sourceModel: "整车能量管理系统模型",
        targetFormat: "SSP",
        autoExecute: true,
        executionLog: [
          {
            id: "log-1",
            time: "2025-07-30 14:35:25",
            action: "初始化架构转换引擎",
            status: "已完成",
          },
          {
            id: "log-2",
            time: "2025-07-30 14:36:12",
            action: "解析源模型结构",
            status: "已完成",
          },
          {
            id: "log-3",
            time: "2025-07-30 14:37:05",
            action: "执行架构转换",
            status: "进行中",
          },
        ],
      });
    }
  }, [node, nodeName, nodeDescription]);

  const handleSave = () => {
    onSave(config);
    toast.success("架构转换节点配置已保存");
  };
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (onClose) {
      onClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "已完成":
        return "bg-green-100 text-green-800";
      case "进行中":
        return "bg-blue-100 text-blue-800";
      case "失败":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isOpen || !node) return null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">架构同步配置</h3>
        <p className="text-sm text-muted-foreground mt-1">
          配置架构同步节点的参数和选项
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="nodeName">节点名称</Label>
          <Input
            id="nodeName"
            value={config.nodeName}
            onChange={(e) => setConfig({ ...config, nodeName: e.target.value })}
            placeholder="请输入节点名称"
          />
        </div>

        <div>
          <Label htmlFor="description">节点描述</Label>
          <Textarea
            id="description"
            value={config.description}
            onChange={(e) => setConfig({ ...config, description: e.target.value })}
            placeholder="请输入节点描述"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="sourceModel">源架构模型</Label>
          <Input
            id="sourceModel"
            value={config.sourceModel}
            onChange={(e) => setConfig({ ...config, sourceModel: e.target.value })}
            placeholder="请选择或输入源模型路径"
          />
        </div>

        <div>
          <Label htmlFor="conversionType">转换类型</Label>
          <Select value={config.conversionType} onValueChange={(value) => setConfig({ ...config, conversionType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择转换类型" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="IBD_TO_SSP">IBD到SSP</SelectItem>
              <SelectItem value="SYSML_TO_SSP">SysML到SSP</SelectItem>
              <SelectItem value="SYSML_TO_MODELICA">SysML到Modelica</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="targetFormat">目标格式</Label>
          <Input
            id="targetFormat"
            value={config.targetFormat}
            onChange={(e) => setConfig({ ...config, targetFormat: e.target.value })}
            placeholder="SSP"
            disabled
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="autoExecute"
            checked={config.autoExecute}
            onCheckedChange={(checked) => setConfig({ ...config, autoExecute: checked })}
          />
          <Label htmlFor="autoExecute">自动执行</Label>
        </div>
      </div>

      <div className="flex justify-center space-x-3 pt-4">
        <Button variant="outline" onClick={handleCancel}>
          取消
        </Button>
        <Button onClick={handleSave}>
          保存配置
        </Button>
      </div>
    </div>
  );
}