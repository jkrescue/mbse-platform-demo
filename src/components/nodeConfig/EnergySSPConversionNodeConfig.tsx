import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Search, FileText } from "lucide-react@0.487.0";

interface EnergySSPConversionNodeConfigProps {
  node: any;
  onSave: (config: any) => void;
  userRole?: string;
}

export function EnergySSPConversionNodeConfig({
  node,
  onSave,
  userRole,
}: EnergySSPConversionNodeConfigProps) {
  const [config, setConfig] = useState({
    nodeName: node?.name || "SysML IBD转SSP",
    description:
      node?.description || "将SysML内部块图转换为SSP格式",
    timeout: node?.config?.timeout || 450,
    retryCount: node?.config?.retryCount || 3,
    autoRun: node?.config?.autoRun || false,
    // SysML IBD转SSP特有配置
    sourceIBD:
      node?.config?.parameters?.sourceIBD || "system-ibd",
    selectedIBDName:
      node?.config?.parameters?.selectedIBDName ||
      "默认系统内部块图",
    targetFormat:
      node?.config?.parameters?.targetFormat || "standard-ssp",
    ibdDetailLevel:
      node?.config?.parameters?.ibdDetailLevel || "standard",
    sspVersion: node?.config?.parameters?.sspVersion || "1.0",
    outputDirectory:
      node?.config?.parameters?.outputDirectory ||
      "/output/ssp-export",
    includeParameters:
      node?.config?.parameters?.includeParameters !== undefined
        ? node?.config?.parameters?.includeParameters
        : true,
    includeVariables:
      node?.config?.parameters?.includeVariables !== undefined
        ? node?.config?.parameters?.includeVariables
        : true,
    includeConnections:
      node?.config?.parameters?.includeConnections !== undefined
        ? node?.config?.parameters?.includeConnections
        : true,
    includeInterfaces:
      node?.config?.parameters?.includeInterfaces !== undefined
        ? node?.config?.parameters?.includeInterfaces
        : true,
    compression:
      node?.config?.parameters?.compression !== undefined
        ? node?.config?.parameters?.compression
        : true,
    validateOutput:
      node?.config?.parameters?.validateOutput !== undefined
        ? node?.config?.parameters?.validateOutput
        : true,
    exportMetadata:
      node?.config?.parameters?.exportMetadata !== undefined
        ? node?.config?.parameters?.exportMetadata
        : true,
  });

  const [showIBDSelector, setShowIBDSelector] = useState(false);
  const [ibdSearchTerm, setIbdSearchTerm] = useState("");

  // 模拟IBD列表数据
  const availableIBDs = [
    {
      id: "system-power-ibd",
      name: "系统动力总成内部块图",
      type: "系统级",
      description: "整车动力系统架构",
    },
    {
      id: "battery-thermal-ibd",
      name: "电池热管理内部块图",
      type: "子系统级",
      description: "电池包热管理系统",
    },
    {
      id: "hvac-system-ibd",
      name: "空调系统内部块图",
      type: "子系统级",
      description: "整车空调系统架构",
    },
    {
      id: "chassis-control-ibd",
      name: "底盘控制内部块图",
      type: "系统级",
      description: "底盘电子控制系统",
    },
    {
      id: "infotainment-ibd",
      name: "信息娱乐内部块图",
      type: "子系统级",
      description: "车载信息娱乐系统",
    },
    {
      id: "safety-system-ibd",
      name: "安全系统内部块图",
      type: "系统级",
      description: "主被动安全系统架构",
    },
    {
      id: "energy-management-ibd",
      name: "能量管理内部块图",
      type: "系统级",
      description: "整车能量管理系统",
    },
    {
      id: "brake-system-ibd",
      name: "制动系统内部块图",
      type: "子系统级",
      description: "电子制动系统",
    },
  ];

  // 过滤IBD列表
  const filteredIBDs = availableIBDs.filter(
    (ibd) =>
      ibd.name
        .toLowerCase()
        .includes(ibdSearchTerm.toLowerCase()) ||
      ibd.description
        .toLowerCase()
        .includes(ibdSearchTerm.toLowerCase()),
  );

  // 处理IBD选择
  const handleIBDSelection = (ibd: any) => {
    setConfig({
      ...config,
      sourceIBD: ibd.id,
      selectedIBDName: ibd.name,
    });
    setShowIBDSelector(false);
    setIbdSearchTerm("");
  };

  // 处理选择框值变化
  const handleSourceIBDChange = (value: string) => {
    if (value === "manual-select") {
      setShowIBDSelector(true);
    } else {
      setConfig({
        ...config,
        sourceIBD: value,
        selectedIBDName:
          value === "system-ibd"
            ? "默认系统内部块图"
            : "手动选择",
      });
    }
  };

  const handleSave = () => {
    const saveConfig = {
      ...config,
      parameters: {
        sourceIBD: config.sourceIBD,
        selectedIBDName: config.selectedIBDName,
        targetFormat: config.targetFormat,
        ibdDetailLevel: config.ibdDetailLevel,
        sspVersion: config.sspVersion,
        outputDirectory: config.outputDirectory,
        includeParameters: config.includeParameters,
        includeVariables: config.includeVariables,
        includeConnections: config.includeConnections,
        includeInterfaces: config.includeInterfaces,
        compression: config.compression,
        validateOutput: config.validateOutput,
        exportMetadata: config.exportMetadata,
      },
    };
    onSave(saveConfig);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mt-1">
          配置SysML IBD图导出为SSP格式的转换参数
        </p>
      </div>

      <Separator />

      <div className="space-y-4">
        <div>
          <Label htmlFor="nodeName">节点名称</Label>
          <Input
            id="nodeName"
            value={config.nodeName}
            onChange={(e) =>
              setConfig({ ...config, nodeName: e.target.value })
            }
            placeholder="请输入节点名称"
          />
        </div>

        <div>
          <Label htmlFor="description">节点描述</Label>
          <Textarea
            id="description"
            value={config.description}
            onChange={(e) =>
              setConfig({
                ...config,
                description: e.target.value,
              })
            }
            placeholder="请输入节点描述"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="sourceIBD">源IBD图</Label>
          <Select
            value={
              config.sourceIBD === "system-ibd"
                ? "system-ibd"
                : "manual-select"
            }
            onValueChange={handleSourceIBDChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="选择要转换的IBD图">
                {config.sourceIBD === "system-ibd"
                  ? "默认系统内部块图"
                  : config.selectedIBDName}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system-ibd">
                默认系统内部块图
              </SelectItem>
              <SelectItem value="manual-select">
                手动选择
              </SelectItem>
            </SelectContent>
          </Select>

          <Dialog
            open={showIBDSelector}
            onOpenChange={setShowIBDSelector}
          >
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>选择IBD图</span>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="搜索IBD图..."
                    value={ibdSearchTerm}
                    onChange={(e) =>
                      setIbdSearchTerm(e.target.value)
                    }
                    className="pl-10"
                  />
                </div>

                <div className="max-h-96 overflow-y-auto space-y-2">
                  {filteredIBDs.map((ibd) => (
                    <div
                      key={ibd.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleIBDSelection(ibd)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {ibd.name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {ibd.description}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {ibd.type}
                        </span>
                      </div>
                    </div>
                  ))}

                  {filteredIBDs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p>没有找到匹配的IBD图</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowIBDSelector(false);
                      setIbdSearchTerm("");
                    }}
                  >
                    取消
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div>
          <Label htmlFor="targetFormat">目标SSP格式</Label>
          <Select
            value={config.targetFormat}
            onValueChange={(value) =>
              setConfig({ ...config, targetFormat: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="选择SSP目标格式" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard-ssp">
                标准SSP 1.0
              </SelectItem>

              <SelectItem value="fmi-ssp">FMI-SSP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="ibdDetailLevel">
            IBD转换详细程度
          </Label>
          <Select
            value={config.ibdDetailLevel}
            onValueChange={(value) =>
              setConfig({ ...config, ibdDetailLevel: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="选择IBD转换详细程度" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">基础转换</SelectItem>
              <SelectItem value="full">完整转换</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="includeParameters"
            checked={config.includeParameters}
            onCheckedChange={(checked) =>
              setConfig({
                ...config,
                includeParameters: checked,
              })
            }
          />
          <Label htmlFor="includeParameters">
            包含参数定义
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="includeVariables"
            checked={config.includeVariables}
            onCheckedChange={(checked) =>
              setConfig({
                ...config,
                includeVariables: checked,
              })
            }
          />
          <Label htmlFor="includeVariables">包含变量定义</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="autoRun"
            checked={config.autoRun}
            onCheckedChange={(checked) =>
              setConfig({ ...config, autoRun: checked })
            }
          />
          <Label htmlFor="autoRun">自动运行</Label>
        </div>
      </div>

      <div className="flex justify-center space-x-3 pt-4">
        <Button
          variant="outline"
          onClick={() => {
            /* 处理取消 */
          }}
        >
          取消
        </Button>
        <Button onClick={handleSave}>保存配置</Button>
      </div>
    </div>
  );
}