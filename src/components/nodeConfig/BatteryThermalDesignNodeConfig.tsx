import React, { useState } from "react";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import {
  Upload,
  FileText,
  X,
  Database,
  ExternalLink,
} from "lucide-react@0.487.0";

interface BatteryThermalDesignNodeConfigProps {
  node: any;
  onSave: (config: any) => void;
  onCancel?: () => void;
  userRole?: string;
}

export function BatteryThermalDesignNodeConfig({
  node,
  onSave,
  onCancel,
  userRole,
}: BatteryThermalDesignNodeConfigProps) {
  const [config, setConfig] = useState({
    nodeName: node?.name || "EA模型搭建",
    description:
      node?.description ||
      "基于Enterprise Architect的系统建模与架构设计",
    timeout: node?.config?.timeout || 900,
    retryCount: node?.config?.retryCount || 2,
    autoRun: node?.config?.autoRun || false,

    // 工具类型配置
    toolType:
      node?.config?.parameters?.toolType ||
      "enterprise-architect",
    modelType:
      node?.config?.parameters?.modelType || "system-model",

    // 模型来源配置
    modelSource:
      node?.config?.parameters?.modelSource ||
      "direct-modeling",

    // 本地文件上传配置
    uploadedFiles:
      node?.config?.parameters?.uploadedFiles || [],

    // 模型库配置
    selectedModelLibrary:
      node?.config?.parameters?.selectedModelLibrary || "",

    // 工具连接配置
    toolConnection: node?.config?.parameters
      ?.toolConnection || {
      serverUrl: "",
      repositoryPath: "",
      username: "",
      password: "",
    },

    includeTestCases:
      node?.config?.parameters?.includeTestCases || true,
    generateReport:
      node?.config?.parameters?.generateReport || true,
  });

  const [isDragOver, setIsDragOver] = useState(false);

  // 文件上传处理
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files).map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      uploadTime: new Date().toISOString(),
    }));

    setConfig((prev) => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...newFiles],
    }));
  };

  // 删除上传文件
  const handleRemoveFile = (fileId: number) => {
    setConfig((prev) => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter(
        (file: any) => file.id !== fileId,
      ),
    }));
  };

  // 拖拽处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
      " " +
      sizes[i]
    );
  };

  // 打开工具
  const handleOpenTool = () => {
    // 这里可以根据工具类型打开对应的工具
    console.log(`打开${config.toolType}工具`);
    // 实际实现中可以调用API或打开外部应用
  };

  const handleSave = () => {
    const saveConfig = {
      ...config,
      parameters: {
        toolType: config.toolType,
        modelType: config.modelType,
        modelSource: config.modelSource,
        uploadedFiles: config.uploadedFiles,
        selectedModelLibrary: config.selectedModelLibrary,
        toolConnection: config.toolConnection,
        includeTestCases: config.includeTestCases,
        generateReport: config.generateReport,
      },
    };
    onSave(saveConfig);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground m-[0px] px-[10px] py-[0px] my-[0px] mx-[10px] mt-[0px] mr-[0px] mb-[0px] ml-[10px]">
          配置EA模型搭建的基础设置和架构设计参数
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">基础设置</TabsTrigger>
          <TabsTrigger value="architecture">
            架构设计
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div>
            <Label htmlFor="nodeName">节点名称</Label>
            <Input
              id="nodeName"
              value={config.nodeName}
              onChange={(e) =>
                setConfig({
                  ...config,
                  nodeName: e.target.value,
                })
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
            <Label htmlFor="toolType">工具类型</Label>
            <Select
              value={config.toolType}
              onValueChange={(value) =>
                setConfig({ ...config, toolType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择工具类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enterprise-architect">
                  Enterprise Architect
                </SelectItem>
                <SelectItem value="visio">
                  Microsoft Visio
                </SelectItem>
                <SelectItem value="drawio">Draw.io</SelectItem>
                <SelectItem value="papyrus">
                  Eclipse Papyrus
                </SelectItem>
                <SelectItem value="magicdraw">
                  MagicDraw
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="modelType">模型类型</Label>
            <Select
              value={config.modelType}
              onValueChange={(value) =>
                setConfig({ ...config, modelType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择模型类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system-model">
                  系统模型
                </SelectItem>
                <SelectItem value="requirements-model">
                  需求模型
                </SelectItem>
                <SelectItem value="architecture-model">
                  架构模型
                </SelectItem>
                <SelectItem value="behavioral-model">
                  行为模型
                </SelectItem>
                <SelectItem value="structural-model">
                  结构模型
                </SelectItem>
              </SelectContent>
            </Select>
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
        </TabsContent>

        <TabsContent value="architecture" className="space-y-4">
          <div>
            <Label htmlFor="modelSource">模型来源</Label>
            <Select
              value={config.modelSource}
              onValueChange={(value) =>
                setConfig({ ...config, modelSource: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择模型来源" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local-upload">
                  本地上传
                </SelectItem>
                <SelectItem value="model-library">
                  模型库加载
                </SelectItem>
                <SelectItem value="direct-modeling">
                  直接建模
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {config.modelSource === "local-upload" && (
            <div className="space-y-4 p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Upload className="h-4 w-4 text-amber-600" />
                <Label className="text-amber-900">
                  本地文件上传
                </Label>
              </div>

              <div className="space-y-3">
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragOver
                      ? "border-amber-400 bg-amber-100"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    拖拽模型文件到此处或
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input =
                        document.createElement("input");
                      input.type = "file";
                      input.multiple = true;
                      input.accept =
                        ".eap,.eapx,.xmi,.uml,.mdzip";
                      input.onchange = (e) => {
                        const files = (
                          e.target as HTMLInputElement
                        ).files;
                        handleFileUpload(files);
                      };
                      input.click();
                    }}
                  >
                    选择文件
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    支持 .eap, .eapx, .xmi, .uml, .mdzip 格式
                  </p>
                </div>

                {config.uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      已上传文件
                    </Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {config.uploadedFiles.map((file: any) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium truncate max-w-48">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(file.size)} •{" "}
                                {new Date(
                                  file.uploadTime,
                                ).toLocaleString("zh-CN")}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveFile(file.id)
                            }
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1 h-6 w-6"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {config.modelSource === "model-library" && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-blue-600" />
                <Label className="text-blue-900">
                  模型库选择
                </Label>
              </div>

              <div>
                <Label htmlFor="modelLibrary">选择模型库</Label>
                <Select
                  value={config.selectedModelLibrary}
                  onValueChange={(value) =>
                    setConfig({
                      ...config,
                      selectedModelLibrary: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择预设模型库" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automotive-reference">
                      汽车参考架构模型库
                    </SelectItem>
                    <SelectItem value="systems-engineering">
                      系统工程模型库
                    </SelectItem>
                    <SelectItem value="sysml-templates">
                      SysML标准模板库
                    </SelectItem>
                    <SelectItem value="enterprise-templates">
                      企业架构模板库
                    </SelectItem>
                    <SelectItem value="custom-library">
                      自定义模型库
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {config.modelSource === "direct-modeling" && (
            <div className="space-y-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <ExternalLink className="h-4 w-4 text-green-600" />
                <Label className="text-green-900">
                  直接建模工具
                </Label>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="serverUrl">
                    工具服务地址
                  </Label>
                  <Input
                    id="serverUrl"
                    value={config.toolConnection.serverUrl}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        toolConnection: {
                          ...config.toolConnection,
                          serverUrl: e.target.value,
                        },
                      })
                    }
                    placeholder="http://localhost:8080 或工具服务器地址"
                  />
                </div>

                <div>
                  <Label htmlFor="repositoryPath">
                    仓库路径
                  </Label>
                  <Input
                    id="repositoryPath"
                    value={config.toolConnection.repositoryPath}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        toolConnection: {
                          ...config.toolConnection,
                          repositoryPath: e.target.value,
                        },
                      })
                    }
                    placeholder="/project/models 或本地文件路径"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="username">用户名</Label>
                    <Input
                      id="username"
                      value={config.toolConnection.username}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          toolConnection: {
                            ...config.toolConnection,
                            username: e.target.value,
                          },
                        })
                      }
                      placeholder="用户名"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">密码</Label>
                    <Input
                      id="password"
                      type="password"
                      value={config.toolConnection.password}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          toolConnection: {
                            ...config.toolConnection,
                            password: e.target.value,
                          },
                        })
                      }
                      placeholder="密码"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleOpenTool}
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  打开{" "}
                  {config.toolType === "enterprise-architect"
                    ? "Enterprise Architect"
                    : config.toolType === "visio"
                      ? "Microsoft Visio"
                      : config.toolType === "drawio"
                        ? "Draw.io"
                        : config.toolType === "papyrus"
                          ? "Eclipse Papyrus"
                          : config.toolType === "magicdraw"
                            ? "MagicDraw"
                            : "建模工具"}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-center space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSave}>保存配置</Button>
      </div>
    </div>
  );
}