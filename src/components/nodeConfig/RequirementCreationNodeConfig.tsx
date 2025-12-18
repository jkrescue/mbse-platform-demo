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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import {
  AlertTriangle,
  Database,
  Globe,
  Link,
  Plus,
  Settings,
  Upload,
  FileText,
  X,
} from "lucide-react@0.487.0";

interface RequirementCreationNodeConfigProps {
  node: any;
  onSave: (config: any) => void;
  onCancel?: () => void;
  userRole?: string;
}

export function RequirementCreationNodeConfig({
  node,
  onSave,
  onCancel,
  userRole,
}: RequirementCreationNodeConfigProps) {
  const [config, setConfig] = useState({
    nodeName: node?.name || "创建需求",
    description:
      node?.description ||
      "定义和创建系统需求，支持本地和远程同步",
    timeout: node?.config?.timeout || 600,
    retryCount: node?.config?.retryCount || 2,
    autoRun: node?.config?.autoRun || false,

    // 需求定义配置
    requirementType:
      node?.config?.parameters?.requirementType || "functional",
    requirementPriority:
      node?.config?.parameters?.requirementPriority || "medium",
    requirementCategory:
      node?.config?.parameters?.requirementCategory || "system",
    requirementStatus:
      node?.config?.parameters?.requirementStatus || "draft",

    // 同步模式配置
    syncMode: node?.config?.parameters?.syncMode || "local",

    // 远程连接配置
    remoteSystem:
      node?.config?.parameters?.remoteSystem || "polarion",
    connectionConfig: node?.config?.parameters
      ?.connectionConfig || {
      polarion: {
        serverUrl: "",
        projectId: "",
        workspace: "",
        username: "",
        password: "",
        apiVersion: "v1",
      },
      oslc: {
        serviceUrl: "",
        serviceProvider: "",
        catalog: "",
        username: "",
        password: "",
        domain: "rm",
      },
      teamcenter: {
        serverUrl: "",
        database: "",
        username: "",
        password: "",
        clientVersion: "12.4",
      },
    },

    // 需求属性配置
    requirementAttributes: node?.config?.parameters
      ?.requirementAttributes || {
      enableTraceability: true,
      enableVersioning: true,
      enableApproval: false,
      enableImpactAnalysis: true,
      customFields: [],
    },

    // 数据源配置
    requirementSources:
      node?.config?.parameters?.requirementSources || [],

    // 质量控制配置
    qualityChecks: node?.config?.parameters?.qualityChecks || {
      enableSyntaxCheck: true,
      enableComplianceCheck: true,
      enableDuplicationCheck: true,
      enableCompletenessCheck: true,
    },

    // 输出配置
    outputSettings: node?.config?.parameters
      ?.outputSettings || {
      generateId: true,
      exportFormat: "polarion",
      includeMetadata: true,
      enableAutoSync: false,
    },

    // 本地模式文件上传配置
    uploadedFiles: node?.config?.parameters?.uploadedFiles || [],
  });

  const [showSourceDialog, setShowSourceDialog] =
    useState(false);
  const [selectedSource, setSelectedSource] =
    useState<any>(null);
  const [testConnection, setTestConnection] = useState<{
    status: string;
    message: string;
  } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // 处理远程系统变更
  const handleRemoteSystemChange = (system: string) => {
    setConfig((prev) => ({ ...prev, remoteSystem: system }));
    setTestConnection(null);
  };

  // 处理连接测试
  const handleTestConnection = async () => {
    setTestConnection({
      status: "testing",
      message: "正在测试连接...",
    });

    // 模拟连接测试
    setTimeout(() => {
      const connectionData =
        config.connectionConfig[
          config.remoteSystem as keyof typeof config.connectionConfig
        ];
      const hasRequiredFields =
        config.remoteSystem === "polarion"
          ? connectionData.serverUrl && connectionData.projectId
          : config.remoteSystem === "oslc"
            ? connectionData.serviceUrl &&
              connectionData.serviceProvider
            : connectionData.serverUrl &&
              connectionData.database;

      if (hasRequiredFields) {
        setTestConnection({
          status: "success",
          message: "连接成功！",
        });
      } else {
        setTestConnection({
          status: "error",
          message: "连接失败，请检查配置信息",
        });
      }
    }, 2000);
  };

  // 添加需求来源
  const handleAddSource = () => {
    setSelectedSource(null);
    setShowSourceDialog(true);
  };

  // 保存需求来源
  const handleSaveSource = (sourceData: any) => {
    const newSource = {
      id: Date.now().toString(),
      ...sourceData,
      type: config.remoteSystem,
      createdAt: new Date().toISOString(),
    };

    setConfig((prev) => ({
      ...prev,
      requirementSources: [
        ...prev.requirementSources,
        newSource,
      ],
    }));

    setShowSourceDialog(false);
  };

  // 删除需求来源
  const handleRemoveSource = (sourceId: string) => {
    setConfig((prev) => ({
      ...prev,
      requirementSources: prev.requirementSources.filter(
        (s: any) => s.id !== sourceId,
      ),
    }));
  };

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
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSave = () => {
    const saveConfig = {
      ...config,
      parameters: {
        requirementType: config.requirementType,
        requirementPriority: config.requirementPriority,
        requirementCategory: config.requirementCategory,
        requirementStatus: config.requirementStatus,
        syncMode: config.syncMode,
        remoteSystem: config.remoteSystem,
        connectionConfig: config.connectionConfig,
        requirementAttributes: config.requirementAttributes,
        requirementSources: config.requirementSources,
        qualityChecks: config.qualityChecks,
        outputSettings: config.outputSettings,
        uploadedFiles: config.uploadedFiles,
      },
    };
    onSave(saveConfig);
  };

  return (
    <div className="space-y-6">
      <div>
        
        <p className="text-sm text-muted-foreground m-[0px] mt-[0px] mr-[0px] mb-[0px] ml-[5px] px-[5px] py-[0px]">
          配置需求定义参数和远程系统连接，支持Polarion、OSLC、TeamCenter集成
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="flex justify-center w-full">
          <TabsTrigger value="basic">基础配置</TabsTrigger>
          <TabsTrigger value="sync">同步设置</TabsTrigger>
          <TabsTrigger value="attributes">需求属性</TabsTrigger>
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
            <Label htmlFor="requirementType">需求类型</Label>
            <Select
              value={config.requirementType}
              onValueChange={(value) =>
                setConfig({ ...config, requirementType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择需求类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="functional">
                  功能需求
                </SelectItem>
                <SelectItem value="non-functional">
                  非功能需求
                </SelectItem>
                <SelectItem value="user-story">
                  用户故事
                </SelectItem>
                <SelectItem value="business-requirement">
                  业务需求
                </SelectItem>
                <SelectItem value="technical-requirement">
                  技术需求
                </SelectItem>
                <SelectItem value="safety-requirement">
                  安全需求
                </SelectItem>
                <SelectItem value="compliance-requirement">
                  合规需求
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="requirementCategory">
              需求分类
            </Label>
            <Select
              value={config.requirementCategory}
              onValueChange={(value) =>
                setConfig({
                  ...config,
                  requirementCategory: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择需求分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">
                  系统级需求
                </SelectItem>
                <SelectItem value="subsystem">
                  子系统需求
                </SelectItem>
                <SelectItem value="component">
                  组件需求
                </SelectItem>
                <SelectItem value="interface">
                  接口需求
                </SelectItem>
                <SelectItem value="performance">
                  性能需求
                </SelectItem>
                <SelectItem value="security">
                  安全需求
                </SelectItem>
                <SelectItem value="usability">
                  可用性需求
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="requirementPriority">优先级</Label>
            <Select
              value={config.requirementPriority}
              onValueChange={(value) =>
                setConfig({
                  ...config,
                  requirementPriority: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择优先级" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">关键</SelectItem>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="low">低</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="requirementStatus">初始状态</Label>
            <Select
              value={config.requirementStatus}
              onValueChange={(value) =>
                setConfig({
                  ...config,
                  requirementStatus: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择初始状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="proposed">已提议</SelectItem>
                <SelectItem value="approved">已批准</SelectItem>
                <SelectItem value="implemented">
                  已实现
                </SelectItem>
                <SelectItem value="verified">已验证</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="autoExecute"
              checked={config.autoRun}
              onCheckedChange={(checked) =>
                setConfig({
                  ...config,
                  autoRun: checked,
                })
              }
            />
            <Label htmlFor="autoExecute">自动运行</Label>
          </div>
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <div>
            <Label htmlFor="syncMode">同步模式</Label>
            <Select
              value={config.syncMode}
              onValueChange={(value) =>
                setConfig({ ...config, syncMode: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择同步模式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">本地模式</SelectItem>
                <SelectItem value="remote">远程同步</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {config.syncMode === "local" && (
            <div className="space-y-4 p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Upload className="h-4 w-4 text-amber-600" />
                <Label className="text-amber-900">本地文件上传</Label>
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
                    拖拽文件到此处或
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.multiple = true;
                      input.accept = ".txt,.doc,.docx,.pdf,.xlsx,.csv,.json,.xml";
                      input.onchange = (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        handleFileUpload(files);
                      };
                      input.click();
                    }}
                  >
                    <Plus className="h-3 w-3 mr-2" />
                    选择文件
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    支持 .txt, .doc, .docx, .pdf, .xlsx, .csv, .json, .xml 格式
                  </p>
                </div>

                {config.uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">已上传文件</Label>
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
                                {formatFileSize(file.size)} • {new Date(file.uploadTime).toLocaleString('zh-CN')}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(file.id)}
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

          {config.syncMode === "remote" && (
            <>
              <div>
                <Label htmlFor="remoteSystem">远程系统</Label>
                <Select
                  value={config.remoteSystem}
                  onValueChange={handleRemoteSystemChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择远程系统" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="polarion">
                      Polarion ALM
                    </SelectItem>
                    <SelectItem value="oslc">
                      OSLC 标准接口
                    </SelectItem>
                    <SelectItem value="teamcenter">
                      Siemens TeamCenter
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Polarion 配置 */}
              {config.remoteSystem === "polarion" && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    <Label className="text-blue-900">
                      Polarion ALM 连接配置
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="polarionUrl">
                      服务器地址
                    </Label>
                    <Input
                      id="polarionUrl"
                      value={
                        config.connectionConfig.polarion
                          .serverUrl
                      }
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          connectionConfig: {
                            ...config.connectionConfig,
                            polarion: {
                              ...config.connectionConfig
                                .polarion,
                              serverUrl: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="https://polarion.company.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="polarionProject">
                        项目ID
                      </Label>
                      <Input
                        id="polarionProject"
                        value={
                          config.connectionConfig.polarion
                            .projectId
                        }
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            connectionConfig: {
                              ...config.connectionConfig,
                              polarion: {
                                ...config.connectionConfig
                                  .polarion,
                                projectId: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="PROJECT_ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="polarionWorkspace">
                        工作空间
                      </Label>
                      <Input
                        id="polarionWorkspace"
                        value={
                          config.connectionConfig.polarion
                            .workspace
                        }
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            connectionConfig: {
                              ...config.connectionConfig,
                              polarion: {
                                ...config.connectionConfig
                                  .polarion,
                                workspace: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="default"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="polarionUsername">
                        用户名
                      </Label>
                      <Input
                        id="polarionUsername"
                        value={
                          config.connectionConfig.polarion
                            .username
                        }
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            connectionConfig: {
                              ...config.connectionConfig,
                              polarion: {
                                ...config.connectionConfig
                                  .polarion,
                                username: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="polarionPassword">
                        密码
                      </Label>
                      <Input
                        id="polarionPassword"
                        type="password"
                        value={
                          config.connectionConfig.polarion
                            .password
                        }
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            connectionConfig: {
                              ...config.connectionConfig,
                              polarion: {
                                ...config.connectionConfig
                                  .polarion,
                                password: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* OSLC 配置 */}
              {config.remoteSystem === "oslc" && (
                <div className="space-y-4 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Link className="h-4 w-4 text-green-600" />
                    <Label className="text-green-900">
                      OSLC 标准接口配置
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="oslcServiceUrl">
                      服务URL
                    </Label>
                    <Input
                      id="oslcServiceUrl"
                      value={
                        config.connectionConfig.oslc.serviceUrl
                      }
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          connectionConfig: {
                            ...config.connectionConfig,
                            oslc: {
                              ...config.connectionConfig.oslc,
                              serviceUrl: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="https://server.com/oslc/rm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="oslcProvider">
                        服务提供者
                      </Label>
                      <Input
                        id="oslcProvider"
                        value={
                          config.connectionConfig.oslc
                            .serviceProvider
                        }
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            connectionConfig: {
                              ...config.connectionConfig,
                              oslc: {
                                ...config.connectionConfig.oslc,
                                serviceProvider: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="requirements"
                      />
                    </div>
                    <div>
                      <Label htmlFor="oslcCatalog">目录</Label>
                      <Input
                        id="oslcCatalog"
                        value={
                          config.connectionConfig.oslc.catalog
                        }
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            connectionConfig: {
                              ...config.connectionConfig,
                              oslc: {
                                ...config.connectionConfig.oslc,
                                catalog: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="catalog"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TeamCenter 配置 */}
              {config.remoteSystem === "teamcenter" && (
                <div className="space-y-4 p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-purple-600" />
                    <Label className="text-purple-900">
                      TeamCenter PLM 连接配置
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="tcServerUrl">
                      服务器地址
                    </Label>
                    <Input
                      id="tcServerUrl"
                      value={
                        config.connectionConfig.teamcenter
                          .serverUrl
                      }
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          connectionConfig: {
                            ...config.connectionConfig,
                            teamcenter: {
                              ...config.connectionConfig
                                .teamcenter,
                              serverUrl: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="http://teamcenter-server:port"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tcDatabase">数据库</Label>
                      <Input
                        id="tcDatabase"
                        value={
                          config.connectionConfig.teamcenter
                            .database
                        }
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            connectionConfig: {
                              ...config.connectionConfig,
                              teamcenter: {
                                ...config.connectionConfig
                                  .teamcenter,
                                database: e.target.value,
                              },
                            },
                          })
                        }
                        placeholder="teamcenter_db"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tcVersion">
                        客户端版本
                      </Label>
                      <Select
                        value={
                          config.connectionConfig.teamcenter
                            .clientVersion
                        }
                        onValueChange={(value) =>
                          setConfig({
                            ...config,
                            connectionConfig: {
                              ...config.connectionConfig,
                              teamcenter: {
                                ...config.connectionConfig
                                  .teamcenter,
                                clientVersion: value,
                              },
                            },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12.4">
                            TeamCenter 12.4
                          </SelectItem>
                          <SelectItem value="13.0">
                            TeamCenter 13.0
                          </SelectItem>
                          <SelectItem value="13.1">
                            TeamCenter 13.1
                          </SelectItem>
                          <SelectItem value="14.0">
                            TeamCenter 14.0
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleTestConnection}
                  variant="outline"
                  size="sm"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  测试连接
                </Button>
                {testConnection && (
                  <Badge
                    variant={
                      testConnection.status === "success"
                        ? "default"
                        : testConnection.status === "error"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {testConnection.message}
                  </Badge>
                )}
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="attributes" className="space-y-4">
          <div>
            <Label>需求管理属性</Label>
            <div className="space-y-2 mt-2">
              {[
                {
                  key: "enableTraceability",
                  label: "启用需求追溯",
                },
  

                {
                  key: "enableImpactAnalysis",
                  label: "启用影响分析",
                },
              ].map((attr) => (
                <div
                  key={attr.key}
                  className="flex items-center space-x-2"
                >
                  <Switch
                    id={attr.key}
                    checked={
                      config.requirementAttributes[
                        attr.key as keyof typeof config.requirementAttributes
                      ]
                    }
                    onCheckedChange={(checked) =>
                      setConfig({
                        ...config,
                        requirementAttributes: {
                          ...config.requirementAttributes,
                          [attr.key]: checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor={attr.key}>{attr.label}</Label>
                </div>
              ))}
            </div>
          </div>

          


        </TabsContent>

        <TabsContent value="sources" className="space-y-4">
          {config.syncMode !== "remote" && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-800">
                  请先启用远程同步模式才能配置数据源
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {config.requirementSources.map((source: any) => (
              <div
                key={source.id}
                className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">
                    {source.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {source.description}
                  </div>
                  <Badge variant="outline" className="mt-1">
                    {source.type}
                  </Badge>
                </div>
                <Button
                  onClick={() => handleRemoveSource(source.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-800"
                >
                  删除
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-3 pt-[5px] pr-[70px] pb-[0px] pl-[0px]">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSave}>保存配置</Button>
      </div>

      {/* 需求来源配置对话框 */}
      <Dialog
        open={showSourceDialog}
        onOpenChange={setShowSourceDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>配置需求来源</DialogTitle>
            <DialogDescription>
              配置从
              {config.remoteSystem === "polarion"
                ? "Polarion"
                : config.remoteSystem === "oslc"
                  ? "OSLC"
                  : "TeamCenter"}
              获取需求的数据源
            </DialogDescription>
          </DialogHeader>

          <RequirementSourceForm
            remoteSystem={config.remoteSystem}
            onSave={handleSaveSource}
            onCancel={() => setShowSourceDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 需求来源配置表单组件
function RequirementSourceForm({
  remoteSystem,
  onSave,
  onCancel,
}: any) {
  const [sourceConfig, setSourceConfig] = useState({
    name: "",
    description: "",
    path: "",
    filter: "",
    maxResults: 100,
    syncInterval: 60,
  });

  const handleSave = () => {
    onSave(sourceConfig);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="sourceName">数据源名称</Label>
        <Input
          id="sourceName"
          value={sourceConfig.name}
          onChange={(e) =>
            setSourceConfig({
              ...sourceConfig,
              name: e.target.value,
            })
          }
          placeholder="输入数据源名称"
        />
      </div>

      <div>
        <Label htmlFor="sourceDescription">描述</Label>
        <Textarea
          id="sourceDescription"
          value={sourceConfig.description}
          onChange={(e) =>
            setSourceConfig({
              ...sourceConfig,
              description: e.target.value,
            })
          }
          placeholder="描述此数据源的用途"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="sourcePath">
          {remoteSystem === "polarion"
            ? "工作项路径"
            : remoteSystem === "oslc"
              ? "资源查询路径"
              : "文件夹路径"}
        </Label>
        <Input
          id="sourcePath"
          value={sourceConfig.path}
          onChange={(e) =>
            setSourceConfig({
              ...sourceConfig,
              path: e.target.value,
            })
          }
          placeholder={
            remoteSystem === "polarion"
              ? "/project/requirements"
              : remoteSystem === "oslc"
                ? "/oslc/rm/requirements"
                : "/Requirements"
          }
        />
      </div>

      <div>
        <Label htmlFor="sourceFilter">过滤条件</Label>
        <Input
          id="sourceFilter"
          value={sourceConfig.filter}
          onChange={(e) =>
            setSourceConfig({
              ...sourceConfig,
              filter: e.target.value,
            })
          }
          placeholder={
            remoteSystem === "polarion"
              ? "type:requirement AND status:approved"
              : remoteSystem === "oslc"
                ? 'dcterms:type="requirement"'
                : "status=approved"
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="maxResults">最大结果数</Label>
          <Input
            id="maxResults"
            type="number"
            value={sourceConfig.maxResults}
            onChange={(e) =>
              setSourceConfig({
                ...sourceConfig,
                maxResults: parseInt(e.target.value) || 100,
              })
            }
            min="1"
            max="1000"
          />
        </div>
        <div>
          <Label htmlFor="syncInterval">同步间隔(分钟)</Label>
          <Input
            id="syncInterval"
            type="number"
            value={sourceConfig.syncInterval}
            onChange={(e) =>
              setSourceConfig({
                ...sourceConfig,
                syncInterval: parseInt(e.target.value) || 60,
              })
            }
            min="5"
            max="1440"
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button
          onClick={handleSave}
          disabled={!sourceConfig.name || !sourceConfig.path}
        >
          保存
        </Button>
      </DialogFooter>
    </div>
  );
}