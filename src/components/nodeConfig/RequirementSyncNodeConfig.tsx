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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  AlertTriangle,
  Database,
  ArrowRightLeft,
  Settings,
  Check,
  X,
  Plus,
  Trash2,
  MapPin,
} from "lucide-react@0.487.0";

interface RequirementSyncNodeConfigProps {
  node: any;
  onSave: (config: any) => void;
  onCancel?: () => void;
  userRole?: string;
}

export function RequirementSyncNodeConfig({
  node,
  onSave,
  onCancel,
  userRole,
}: RequirementSyncNodeConfigProps) {
  const [config, setConfig] = useState({
    nodeName: node?.name || "需求同步",
    description:
      node?.description || "从Polarion同步需求到EA架构设计",
    timeout: node?.config?.timeout || 600,
    retryCount: node?.config?.retryCount || 2,
    autoRun: node?.config?.autoRun || false,

    // Polarion连接配置
    polarionConnection: node?.config?.parameters
      ?.polarionConnection || {
      serverUrl: "",
      projectId: "",
      username: "",
      password: "",
      workspace: "default",
      enableSSL: true,
    },

    // EA连接配置
    eaConnection: node?.config?.parameters?.eaConnection || {
      repositoryPath: "",
      repositoryType: "file", // file, cloud, sql
      username: "",
      password: "",
      packagePath: "",
    },

    // 需求类型映射配置
    requirementTypeMapping: node?.config?.parameters
      ?.requirementTypeMapping || [
      {
        id: "1",
        polarionType: "functional-requirement",
        polarionTypeName: "功能需求",
        eaStereotype: "Functional Requirement",
        eaElementType: "Requirement",
        description: "系统功能性需求映射",
        enabled: true,
      },
      {
        id: "2",
        polarionType: "performance-requirement",
        polarionTypeName: "性能需求",
        eaStereotype: "Performance Requirement",
        eaElementType: "Requirement",
        description: "系统性能需求映射",
        enabled: true,
      },
      {
        id: "3",
        polarionType: "safety-requirement",
        polarionTypeName: "安全需求",
        eaStereotype: "Safety Requirement",
        eaElementType: "Requirement",
        description: "安全相关需求映射",
        enabled: true,
      },
      {
        id: "4",
        polarionType: "interface-requirement",
        polarionTypeName: "接口需求",
        eaStereotype: "Interface Requirement",
        eaElementType: "Interface",
        description: "系统接口需求映射",
        enabled: false,
      },
    ],

    // 属性字段映射
    fieldMapping: node?.config?.parameters?.fieldMapping || [
      {
        id: "1",
        polarionField: "title",
        polarionFieldName: "标题",
        eaProperty: "Name",
        eaPropertyName: "元素名称",
        dataType: "text",
        required: true,
        transformation: "direct",
      },
      {
        id: "2",
        polarionField: "description",
        polarionFieldName: "描述",
        eaProperty: "Notes",
        eaPropertyName: "说明",
        dataType: "text",
        required: false,
        transformation: "direct",
      },
      {
        id: "3",
        polarionField: "priority",
        polarionFieldName: "优先级",
        eaProperty: "Priority",
        eaPropertyName: "优先级",
        dataType: "enum",
        required: false,
        transformation: "mapping",
        valueMapping: {
          High: "High",
          Medium: "Medium",
          Low: "Low",
        },
      },
      {
        id: "4",
        polarionField: "status",
        polarionFieldName: "状态",
        eaProperty: "Status",
        eaPropertyName: "状态",
        dataType: "enum",
        required: false,
        transformation: "mapping",
        valueMapping: {
          Draft: "Proposed",
          Approved: "Approved",
          Implemented: "Implemented",
          Verified: "Validated",
        },
      },
    ],

    // 同步配置
    syncSettings: node?.config?.parameters?.syncSettings || {
      syncDirection: "unidirectional", // unidirectional, bidirectional
      conflictResolution: "polarion-wins", // polarion-wins, ea-wins, manual
      batchSize: 50,
      enableDeltaSync: true,
      syncDeletedItems: false,
      preserveEAStructure: true,
    },

    // 过滤条件
    filterConditions: node?.config?.parameters
      ?.filterConditions || {
      enableFilter: true,
      polarionQuery: "type:requirement AND status:approved",
      dateRange: {
        enabled: false,
        startDate: "",
        endDate: "",
      },
      authorFilter: {
        enabled: false,
        authors: [],
      },
    },

    // 质量检查
    qualityChecks: node?.config?.parameters?.qualityChecks || {
      validateRequiredFields: true,
      checkDuplicates: true,
      validateReferences: true,
      enforceNamingConvention: false,
      maxDescriptionLength: 2000,
    },

    // 输出设置
    outputSettings: node?.config?.parameters
      ?.outputSettings || {
      generateSyncReport: true,
      logLevel: "info",
      exportMappingReport: true,
      notifyOnCompletion: false,
      emailNotification: "",
    },
  });

  const [showMappingDialog, setShowMappingDialog] =
    useState(false);
  const [editingMapping, setEditingMapping] =
    useState<any>(null);
  const [showFieldMappingDialog, setShowFieldMappingDialog] =
    useState(false);
  const [editingFieldMapping, setEditingFieldMapping] =
    useState<any>(null);
  const [testConnection, setTestConnection] = useState<{
    system: string;
    status: string;
    message: string;
  } | null>(null);

  // 测试Polarion连接
  const handleTestPolarionConnection = async () => {
    setTestConnection({
      system: "polarion",
      status: "testing",
      message: "正在测试Polarion连接...",
    });

    setTimeout(() => {
      const { serverUrl, projectId, username } =
        config.polarionConnection;
      if (serverUrl && projectId && username) {
        setTestConnection({
          system: "polarion",
          status: "success",
          message: "Polarion连接成功！",
        });
      } else {
        setTestConnection({
          system: "polarion",
          status: "error",
          message: "连接失败，请检查服务器地址、项目ID和用户名",
        });
      }
    }, 2000);
  };

  // 测试EA连接
  const handleTestEAConnection = async () => {
    setTestConnection({
      system: "ea",
      status: "testing",
      message: "正在测试EA连接...",
    });

    setTimeout(() => {
      const { repositoryPath } = config.eaConnection;
      if (repositoryPath) {
        setTestConnection({
          system: "ea",
          status: "success",
          message: "EA连接成功！",
        });
      } else {
        setTestConnection({
          system: "ea",
          status: "error",
          message: "连接失败，请检查仓库路径",
        });
      }
    }, 2000);
  };

  // 添加需求类型映射
  const handleAddTypeMapping = () => {
    setEditingMapping(null);
    setShowMappingDialog(true);
  };

  // 编辑需求类型映射
  const handleEditTypeMapping = (mapping: any) => {
    setEditingMapping(mapping);
    setShowMappingDialog(true);
  };

  // 删除需求类型映射
  const handleDeleteTypeMapping = (mappingId: string) => {
    setConfig((prev) => ({
      ...prev,
      requirementTypeMapping:
        prev.requirementTypeMapping.filter(
          (m) => m.id !== mappingId,
        ),
    }));
  };

  // 保存需求类型映射
  const handleSaveTypeMapping = (mappingData: any) => {
    if (editingMapping) {
      // 编辑现有映射
      setConfig((prev) => ({
        ...prev,
        requirementTypeMapping: prev.requirementTypeMapping.map(
          (m) =>
            m.id === editingMapping.id
              ? { ...m, ...mappingData }
              : m,
        ),
      }));
    } else {
      // 添加新映射
      const newMapping = {
        id: Date.now().toString(),
        ...mappingData,
        enabled: true,
      };
      setConfig((prev) => ({
        ...prev,
        requirementTypeMapping: [
          ...prev.requirementTypeMapping,
          newMapping,
        ],
      }));
    }
    setShowMappingDialog(false);
  };

  // 添加字段映射
  const handleAddFieldMapping = () => {
    setEditingFieldMapping(null);
    setShowFieldMappingDialog(true);
  };

  // 编辑字段映射
  const handleEditFieldMapping = (mapping: any) => {
    setEditingFieldMapping(mapping);
    setShowFieldMappingDialog(true);
  };

  // 删除字段映射
  const handleDeleteFieldMapping = (mappingId: string) => {
    setConfig((prev) => ({
      ...prev,
      fieldMapping: prev.fieldMapping.filter(
        (m) => m.id !== mappingId,
      ),
    }));
  };

  // 保存字段映射
  const handleSaveFieldMapping = (mappingData: any) => {
    if (editingFieldMapping) {
      setConfig((prev) => ({
        ...prev,
        fieldMapping: prev.fieldMapping.map((m) =>
          m.id === editingFieldMapping.id
            ? { ...m, ...mappingData }
            : m,
        ),
      }));
    } else {
      const newMapping = {
        id: Date.now().toString(),
        ...mappingData,
      };
      setConfig((prev) => ({
        ...prev,
        fieldMapping: [...prev.fieldMapping, newMapping],
      }));
    }
    setShowFieldMappingDialog(false);
  };

  const handleSave = () => {
    const saveConfig = {
      ...config,
      parameters: {
        polarionConnection: config.polarionConnection,
        eaConnection: config.eaConnection,
        requirementTypeMapping: config.requirementTypeMapping,
        fieldMapping: config.fieldMapping,
        syncSettings: config.syncSettings,
        filterConditions: config.filterConditions,
        qualityChecks: config.qualityChecks,
        outputSettings: config.outputSettings,
      },
    };
    onSave(saveConfig);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground m-[0px] mt-[0px] mr-[0px] mb-[0px] ml-[5px] px-[5px] py-[0px]">
          配置从Polarion系统到Enterprise Architect的需求同步参数和映射规则
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="flex justify-center w-full">
          <TabsTrigger value="basic">基础配置</TabsTrigger>
          <TabsTrigger value="connection">连接设置</TabsTrigger>
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

        <TabsContent value="connection" className="space-y-4">
          {/* Polarion 连接配置 */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <Database className="h-4 w-4 text-blue-600" />
                <span>Polarion ALM 连接配置</span>
              </CardTitle>
              <CardDescription className="text-sm">
                配置Polarion系统的连接参数
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="polarionUrl" className="text-sm font-medium">服务器地址</Label>
                <Input
                  id="polarionUrl"
                  value={config.polarionConnection.serverUrl}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      polarionConnection: {
                        ...config.polarionConnection,
                        serverUrl: e.target.value,
                      },
                    })
                  }
                  placeholder="https://polarion.company.com"
                  className="h-9"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="polarionProject" className="text-sm font-medium">
                    项目ID
                  </Label>
                  <Input
                    id="polarionProject"
                    value={config.polarionConnection.projectId}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        polarionConnection: {
                          ...config.polarionConnection,
                          projectId: e.target.value,
                        },
                      })
                    }
                    placeholder="PROJECT_ID"
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="polarionWorkspace" className="text-sm font-medium">
                    工作空间
                  </Label>
                  <Input
                    id="polarionWorkspace"
                    value={config.polarionConnection.workspace}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        polarionConnection: {
                          ...config.polarionConnection,
                          workspace: e.target.value,
                        },
                      })
                    }
                    placeholder="default"
                    className="h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="polarionUsername" className="text-sm font-medium">
                    用户名
                  </Label>
                  <Input
                    id="polarionUsername"
                    value={config.polarionConnection.username}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        polarionConnection: {
                          ...config.polarionConnection,
                          username: e.target.value,
                        },
                      })
                    }
                    placeholder="用户名"
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="polarionPassword" className="text-sm font-medium">密码</Label>
                  <Input
                    id="polarionPassword"
                    type="password"
                    value={config.polarionConnection.password}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        polarionConnection: {
                          ...config.polarionConnection,
                          password: e.target.value,
                        },
                      })
                    }
                    placeholder="密码"
                    className="h-9"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="enableSSL"
                    checked={config.polarionConnection.enableSSL}
                    onCheckedChange={(checked) =>
                      setConfig({
                        ...config,
                        polarionConnection: {
                          ...config.polarionConnection,
                          enableSSL: checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor="enableSSL" className="text-sm font-medium">启用SSL</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleTestPolarionConnection}
                    variant="outline"
                    size="sm"
                    className="h-8"
                  >
                    <Settings className="h-3 w-3 mr-2" />
                    测试连接
                  </Button>
                  {testConnection?.system === "polarion" && (
                    <Badge
                      variant={
                        testConnection.status === "success"
                          ? "default"
                          : testConnection.status === "error"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {testConnection.message}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 需求类型选择区域 */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <MapPin className="h-4 w-4 text-purple-600" />
                <span>需求类型选择</span>
              </CardTitle>
              <CardDescription className="text-sm">
                选择要同步的需求类型，只有选中的类型才会被同步到EA中
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { id: "functional", name: "功能需求", description: "系统功能性需求" },
                  { id: "performance", name: "性能需求", description: "系统性能指标" },
                  { id: "safety", name: "安全需求", description: "安全相关需求" },
                  { id: "interface", name: "接口需求", description: "系统接口规范" },
                  { id: "usability", name: "可用性需求", description: "用户体验需求" },
                  { id: "reliability", name: "可靠性需求", description: "系统可靠性指标" }
                ].map((type) => {
                  const isEnabled = config.requirementTypeMapping.some(
                    mapping => mapping.polarionType.includes(type.id) && mapping.enabled
                  );
                  return (
                    <div key={type.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{type.name}</div>
                        <div className="text-xs text-gray-600">{type.description}</div>
                      </div>
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={(checked) => {
                          setConfig(prev => ({
                            ...prev,
                            requirementTypeMapping: prev.requirementTypeMapping.map(mapping =>
                              mapping.polarionType.includes(type.id)
                                ? { ...mapping, enabled: checked }
                                : mapping
                            )
                          }));
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* EA 连接配置 */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-base">
                <ArrowRightLeft className="h-4 w-4 text-green-600" />
                <span>Enterprise Architect 连接配置</span>
              </CardTitle>
              <CardDescription className="text-sm">
                配置Enterprise Architect仓库的连接参数
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="repositoryType" className="text-sm font-medium">仓库类型</Label>
                <Select
                  value={config.eaConnection.repositoryType}
                  onValueChange={(value) =>
                    setConfig({
                      ...config,
                      eaConnection: {
                        ...config.eaConnection,
                        repositoryType: value,
                      },
                    })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="选择仓库类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="file">
                      文件仓库(.eapx)
                    </SelectItem>
                    <SelectItem value="cloud">
                      云仓库
                    </SelectItem>
                    <SelectItem value="sql">
                      SQL Server
                    </SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="oracle">
                      Oracle
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repositoryPath" className="text-sm font-medium">仓库路径</Label>
                <Input
                  id="repositoryPath"
                  value={config.eaConnection.repositoryPath}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      eaConnection: {
                        ...config.eaConnection,
                        repositoryPath: e.target.value,
                      },
                    })
                  }
                  placeholder={
                    config.eaConnection.repositoryType === "file"
                      ? "C:/Projects/Repository.eapx"
                      : config.eaConnection.repositoryType === "cloud"
                        ? "https://cloud.sparxsystems.com/repository"
                        : "Server=localhost;Database=EARepo;"
                  }
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="packagePath" className="text-sm font-medium">目标包路径</Label>
                <Input
                  id="packagePath"
                  value={config.eaConnection.packagePath}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      eaConnection: {
                        ...config.eaConnection,
                        packagePath: e.target.value,
                      },
                    })
                  }
                  placeholder="Model/Requirements/Functional"
                  className="h-9"
                />
              </div>

              {config.eaConnection.repositoryType !== "file" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="eaUsername" className="text-sm font-medium">用户名</Label>
                    <Input
                      id="eaUsername"
                      value={config.eaConnection.username}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          eaConnection: {
                            ...config.eaConnection,
                            username: e.target.value,
                          },
                        })
                      }
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eaPassword" className="text-sm font-medium">密码</Label>
                    <Input
                      id="eaPassword"
                      type="password"
                      value={config.eaConnection.password}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          eaConnection: {
                            ...config.eaConnection,
                            password: e.target.value,
                          },
                        })
                      }
                      className="h-9"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end pt-2">
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleTestEAConnection}
                    variant="outline"
                    size="sm"
                    className="h-8"
                  >
                    <Settings className="h-3 w-3 mr-2" />
                    测试连接
                  </Button>
                  {testConnection?.system === "ea" && (
                    <Badge
                      variant={
                        testConnection.status === "success"
                          ? "default"
                          : testConnection.status === "error"
                            ? "destructive"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {testConnection.message}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


      </Tabs>

      <div className="flex justify-end space-x-3 pt-[5px] pr-[70px] pb-[0px] pl-[0px]">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSave}>
          保存配置
        </Button>
      </div>

      {/* 需求类型映射配置对话框 */}
      <Dialog
        open={showMappingDialog}
        onOpenChange={setShowMappingDialog}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingMapping
                ? "编辑需求类型映射"
                : "添加需求类型映射"}
            </DialogTitle>
            <DialogDescription>
              配置Polarion需求类型到EA元素类型的映射关系
            </DialogDescription>
          </DialogHeader>

          <TypeMappingForm
            mapping={editingMapping}
            onSave={handleSaveTypeMapping}
            onCancel={() => setShowMappingDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* 字段映射配置对话框 */}
      <Dialog
        open={showFieldMappingDialog}
        onOpenChange={setShowFieldMappingDialog}
      >
        <DialogContent className="max-w-lg">
          <FieldMappingForm
            mapping={editingFieldMapping}
            onSave={handleSaveFieldMapping}
            onCancel={() => setShowFieldMappingDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 需求类型映射配置表单组件
function TypeMappingForm({ mapping, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    polarionType: mapping?.polarionType || "",
    polarionTypeName: mapping?.polarionTypeName || "",
    eaStereotype: mapping?.eaStereotype || "",
    eaElementType: mapping?.eaElementType || "Requirement",
    description: mapping?.description || "",
  });

  const handleSave = () => {
    if (formData.polarionType && formData.eaStereotype) {
      onSave(formData);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="polarionType">Polarion需求类型</Label>
        <Input
          id="polarionType"
          value={formData.polarionType}
          onChange={(e) =>
            setFormData({
              ...formData,
              polarionType: e.target.value,
            })
          }
          placeholder="functional-requirement"
        />
      </div>

      <div>
        <Label htmlFor="polarionTypeName">类型显示名称</Label>
        <Input
          id="polarionTypeName"
          value={formData.polarionTypeName}
          onChange={(e) =>
            setFormData({
              ...formData,
              polarionTypeName: e.target.value,
            })
          }
          placeholder="功能需求"
        />
      </div>

      <div>
        <Label htmlFor="eaStereotype">EA构造型</Label>
        <Input
          id="eaStereotype"
          value={formData.eaStereotype}
          onChange={(e) =>
            setFormData({
              ...formData,
              eaStereotype: e.target.value,
            })
          }
          placeholder="Functional Requirement"
        />
      </div>

      <div>
        <Label htmlFor="eaElementType">EA元素类型</Label>
        <Select
          value={formData.eaElementType}
          onValueChange={(value) =>
            setFormData({ ...formData, eaElementType: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Requirement">需求</SelectItem>
            <SelectItem value="Interface">接口</SelectItem>
            <SelectItem value="UseCase">用例</SelectItem>
            <SelectItem value="Component">组件</SelectItem>
            <SelectItem value="Class">类</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">描述</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({
              ...formData,
              description: e.target.value,
            })
          }
          placeholder="映射关系描述"
          rows={2}
        />
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button
          onClick={handleSave}
          disabled={
            !formData.polarionType || !formData.eaStereotype
          }
        >
          保存
        </Button>
      </DialogFooter>
    </div>
  );
}

// 字段映射配置表单组件
function FieldMappingForm({ mapping, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    polarionField: mapping?.polarionField || "",
    polarionFieldName: mapping?.polarionFieldName || "",
    eaProperty: mapping?.eaProperty || "",
    eaPropertyName: mapping?.eaPropertyName || "",
    dataType: mapping?.dataType || "text",
    required: mapping?.required || false,
    transformation: mapping?.transformation || "direct",
    valueMapping: mapping?.valueMapping || {},
  });

  const handleSave = () => {
    if (formData.polarionField && formData.eaProperty) {
      onSave(formData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="polarionField">Polarion字段</Label>
          <Input
            id="polarionField"
            value={formData.polarionField}
            onChange={(e) =>
              setFormData({
                ...formData,
                polarionField: e.target.value,
              })
            }
            placeholder="title"
          />
        </div>
        <div>
          <Label htmlFor="polarionFieldName">
            字段显示名称
          </Label>
          <Input
            id="polarionFieldName"
            value={formData.polarionFieldName}
            onChange={(e) =>
              setFormData({
                ...formData,
                polarionFieldName: e.target.value,
              })
            }
            placeholder="标题"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="eaProperty">EA属性</Label>
          <Input
            id="eaProperty"
            value={formData.eaProperty}
            onChange={(e) =>
              setFormData({
                ...formData,
                eaProperty: e.target.value,
              })
            }
            placeholder="Name"
          />
        </div>
        <div>
          <Label htmlFor="eaPropertyName">属性显示名称</Label>
          <Input
            id="eaPropertyName"
            value={formData.eaPropertyName}
            onChange={(e) =>
              setFormData({
                ...formData,
                eaPropertyName: e.target.value,
              })
            }
            placeholder="元素名称"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dataType">数据类型</Label>
          <Select
            value={formData.dataType}
            onValueChange={(value) =>
              setFormData({ ...formData, dataType: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">文本</SelectItem>
              <SelectItem value="number">数字</SelectItem>
              <SelectItem value="boolean">布尔值</SelectItem>
              <SelectItem value="date">日期</SelectItem>
              <SelectItem value="enum">枚举</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="transformation">转换方式</Label>
          <Select
            value={formData.transformation}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                transformation: value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="direct">直接映射</SelectItem>
              <SelectItem value="mapping">值映射</SelectItem>
              <SelectItem value="expression">
                表达式转换
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="required"
          checked={formData.required}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, required: checked })
          }
        />
        <Label htmlFor="required">必填字段</Label>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button
          onClick={handleSave}
          disabled={
            !formData.polarionField || !formData.eaProperty
          }
        >
          保存
        </Button>
      </DialogFooter>
    </div>
  );
}