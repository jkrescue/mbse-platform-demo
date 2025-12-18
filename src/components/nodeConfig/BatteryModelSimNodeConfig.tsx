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

// 仿真工具常量
const SIMULATION_TOOLS = [
  { value: "mworks", label: "M-Works" },
  { value: "simulink", label: "Simulink" },
  { value: "dymola", label: "Dymola" },
  { value: "openmodelica", label: "OpenModelica" },
  { value: "systemmodeler", label: "SystemModeler" },
  { value: "custom", label: "自定义工具" },
];

const SOLVER_TYPES = [
  { value: "dassl", label: "DASSL (默认)" },
  { value: "cvode", label: "CVODE" },
  { value: "ida", label: "IDA" },
  { value: "runge_kutta", label: "Runge-Kutta" },
  { value: "euler", label: "Euler" },
];

const MODEL_FORMATS = [
  { value: "fmu", label: "FMU (功能样机单元)" },
  { value: "ssp", label: "SSP (系统结构与参数化)" },
  { value: "modelica", label: "Modelica模型" },
  { value: "simulink", label: "Simulink模型" },
  { value: "native", label: "原生格式" },
];

const OUTPUT_FORMATS = [
  { value: "csv", label: "CSV" },
  { value: "mat", label: "MAT" },
  { value: "hdf5", label: "HDF5" },
  { value: "json", label: "JSON" },
  { value: "excel", label: "Excel" },
];

const RESULT_TYPES = [
  { value: "timeSeries", label: "时间序列" },
  { value: "finalValues", label: "最终值" },
  { value: "statistics", label: "统计信息" },
  { value: "plots", label: "图表" },
  { value: "reports", label: "报告" },
];

export function BatteryModelSimNodeConfig({
  node,
  onSave,
  onCancel,
  userRole,
}: {
  node: any;
  onSave: (config: any) => void;
  onCancel: () => void;
  userRole?: string;
}) {
  const [config, setConfig] = useState({
    nodeName: node?.name || "电池建模仿真",
    description:
      node?.description ||
      "执行电池建模仿真，支持专业仿真工具调用",

    // 仿真工具配置
    simulationTool: node?.config?.simulationTool || "mworks",
    solverType: node?.config?.solverType || "dassl",
    modelFormat: node?.config?.modelFormat || "fmu",

    // 仿真参数
    simulationParameters: {
      startTime: node?.config?.simulationParameters?.startTime || 0,
      stopTime: node?.config?.simulationParameters?.stopTime || 10,
      tolerance: node?.config?.simulationParameters?.tolerance || 1e-6,
      stepSize: node?.config?.simulationParameters?.stepSize || 0.01,
      outputInterval: node?.config?.simulationParameters?.outputInterval || 0.1,
    },

    // 工具集成配置
    toolIntegration: {
      enableRemoteExecution: node?.config?.toolIntegration?.enableRemoteExecution || false,
      toolPath: node?.config?.toolIntegration?.toolPath || "",
      licenseServer: node?.config?.toolIntegration?.licenseServer || "",
      parallelExecution: node?.config?.toolIntegration?.parallelExecution || false,
      maxCores: node?.config?.toolIntegration?.maxCores || 4,
    },

    // 输入输出配置
    inputOutput: {
      inputModelPath: node?.config?.inputOutput?.inputModelPath || "",
      outputPath: node?.config?.inputOutput?.outputPath || "./results",
      outputFormat: node?.config?.inputOutput?.outputFormat || "csv",
      resultTypes: node?.config?.inputOutput?.resultTypes || ["timeSeries"],
      includeMetadata: node?.config?.inputOutput?.includeMetadata !== false,
      compressResults: node?.config?.inputOutput?.compressResults || false,
    },

    // 执行配置
    executionConfig: {
      enableVisualization: node?.config?.executionConfig?.enableVisualization !== false,
      generateReport: node?.config?.executionConfig?.generateReport !== false,
      autoOpenResults: node?.config?.executionConfig?.autoOpenResults || false,
      saveIntermediateResults: node?.config?.executionConfig?.saveIntermediateResults || false,
      enableLogging: node?.config?.executionConfig?.enableLogging !== false,
      logLevel: node?.config?.executionConfig?.logLevel || "info",
    },

    // 高级设置
    timeout: node?.config?.timeout || 3600,
    retryCount: node?.config?.retryCount || 1,
    autoRun: node?.config?.autoRun || false,

    outputConfiguration: {
      modelPath: node?.config?.outputConfiguration?.modelPath || "/models/battery-simulation.fmu",
      outputFormat: node?.config?.outputConfiguration?.outputFormat || "csv",
      timeResolution: node?.config?.outputConfiguration?.timeResolution || 0.1,
      includeVisualization: node?.config?.outputConfiguration?.includeVisualization !== false,
    },
  });

  const handleSave = () => {
    onSave({
      nodeName: config.nodeName,
      description: config.description,
      priority: "中", // 默认优先级
      autoExecute: config.autoRun,
      timeout: config.timeout,
      retryCount: config.retryCount,
      // 传递所有配置数据
      simulationTool: config.simulationTool,
      solverType: config.solverType,
      modelFormat: config.modelFormat,
      simulationParameters: config.simulationParameters,
      toolIntegration: config.toolIntegration,
      inputOutput: config.inputOutput,
      executionConfig: config.executionConfig,
      outputConfiguration: config.outputConfiguration,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mt-1">
          配置系统仿真执行参数，支持M-Works等专业仿真工具调用
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">基础设置</TabsTrigger>
          <TabsTrigger value="simulation">仿真配置</TabsTrigger>
          <TabsTrigger value="execution">执行配置</TabsTrigger>
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
            <Label htmlFor="simulationTool">仿真工具</Label>
            <Select
              value={config.simulationTool}
              onValueChange={(value) =>
                setConfig({ ...config, simulationTool: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择仿真工具" />
              </SelectTrigger>
              <SelectContent>
                {SIMULATION_TOOLS.map((tool) => (
                  <SelectItem
                    key={tool.value}
                    value={tool.value}
                  >
                    {tool.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="modelPath">输入模型路径</Label>
            <Input
              id="modelPath"
              value={config.inputOutput.inputModelPath}
              onChange={(e) =>
                setConfig({
                  ...config,
                  inputOutput: {
                    ...config.inputOutput,
                    inputModelPath: e.target.value,
                  },
                })
              }
              placeholder="/models/system-model.fmu"
            />
          </div>

          <div>
            <Label>工具集成配置</Label>
            <div className="space-y-3 mt-2 p-3 bg-gray-50 rounded">
              <div>
                <Label htmlFor="toolPath">工具路径</Label>
                <Input
                  id="toolPath"
                  value={config.toolIntegration.toolPath}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      toolIntegration: {
                        ...config.toolIntegration,
                        toolPath: e.target.value,
                      },
                    })
                  }
                  placeholder="/opt/mworks/bin/mworks"
                />
              </div>

              <div>
                <Label htmlFor="licenseServer">
                  许可证服务器
                </Label>
                <Input
                  id="licenseServer"
                  value={config.toolIntegration.licenseServer}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      toolIntegration: {
                        ...config.toolIntegration,
                        licenseServer: e.target.value,
                      },
                    })
                  }
                  placeholder="license.server.com:1055"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enableRemoteExecution"
                  checked={
                    config.toolIntegration.enableRemoteExecution
                  }
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      toolIntegration: {
                        ...config.toolIntegration,
                        enableRemoteExecution: checked,
                      },
                    })
                  }
                />
                <Label htmlFor="enableRemoteExecution">
                  启用远程执行
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="parallelExecution"
                  checked={
                    config.toolIntegration.parallelExecution
                  }
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      toolIntegration: {
                        ...config.toolIntegration,
                        parallelExecution: checked,
                      },
                    })
                  }
                />
                <Label htmlFor="parallelExecution">
                  并行执行
                </Label>
              </div>

              {config.toolIntegration.parallelExecution && (
                <div>
                  <Label htmlFor="maxCores">最大核心数</Label>
                  <Input
                    id="maxCores"
                    type="number"
                    value={config.toolIntegration.maxCores}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        toolIntegration: {
                          ...config.toolIntegration,
                          maxCores:
                            parseInt(e.target.value) || 4,
                        },
                      })
                    }
                    min="1"
                    max="32"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-start space-x-2">
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

        <TabsContent value="simulation" className="space-y-4">
          <div>
            <Label>仿真参数</Label>
            <div className="space-y-3 mt-2 p-3 bg-gray-50 rounded">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="startTime">
                    开始时间 (s)
                  </Label>
                  <Input
                    id="startTime"
                    type="number"
                    value={
                      config.simulationParameters.startTime
                    }
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        simulationParameters: {
                          ...config.simulationParameters,
                          startTime:
                            parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="stopTime">结束时间 (s)</Label>
                  <Input
                    id="stopTime"
                    type="number"
                    value={config.simulationParameters.stopTime}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        simulationParameters: {
                          ...config.simulationParameters,
                          stopTime:
                            parseFloat(e.target.value) || 10,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="tolerance">容差</Label>
                  <Input
                    id="tolerance"
                    type="number"
                    step="1e-8"
                    value={
                      config.simulationParameters.tolerance
                    }
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        simulationParameters: {
                          ...config.simulationParameters,
                          tolerance:
                            parseFloat(e.target.value) || 1e-6,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="stepSize">步长 (s)</Label>
                  <Input
                    id="stepSize"
                    type="number"
                    step="0.001"
                    value={config.simulationParameters.stepSize}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        simulationParameters: {
                          ...config.simulationParameters,
                          stepSize:
                            parseFloat(e.target.value) || 0.01,
                        },
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="outputInterval">
                  输出间隔 (s)
                </Label>
                <Input
                  id="outputInterval"
                  type="number"
                  step="0.01"
                  value={
                    config.simulationParameters.outputInterval
                  }
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      simulationParameters: {
                        ...config.simulationParameters,
                        outputInterval:
                          parseFloat(e.target.value) || 0.1,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="solverType">求解器类型</Label>
            <Select
              value={config.solverType}
              onValueChange={(value) =>
                setConfig({ ...config, solverType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择求解器类型" />
              </SelectTrigger>
              <SelectContent>
                {SOLVER_TYPES.map((solver) => (
                  <SelectItem
                    key={solver.value}
                    value={solver.value}
                  >
                    {solver.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent
          value="tools"
          className="space-y-4"
        ></TabsContent>

        <TabsContent value="execution" className="space-y-4">
          <div>
            <Label>输出配置</Label>
            <div className="space-y-3 mt-2 p-3 bg-gray-50 rounded">
              <div>
                <Label htmlFor="outputPath">输出路径</Label>
                <Input
                  id="outputPath"
                  value={config.inputOutput.outputPath}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      inputOutput: {
                        ...config.inputOutput,
                        outputPath: e.target.value,
                      },
                    })
                  }
                  placeholder="./results"
                />
              </div>

              <div>
                <Label htmlFor="outputFormat">输出格式</Label>
                <Select
                  value={config.inputOutput.outputFormat}
                  onValueChange={(value) =>
                    setConfig({
                      ...config,
                      inputOutput: {
                        ...config.inputOutput,
                        outputFormat: value,
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择输出格式" />
                  </SelectTrigger>
                  <SelectContent>
                    {OUTPUT_FORMATS.map((format) => (
                      <SelectItem
                        key={format.value}
                        value={format.value}
                      >
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <Label>执行选项</Label>
            <div className="space-y-2 mt-2">
              {[
                {
                  key: "enableVisualization",
                  label: "启用可视化",
                },
                { key: "generateReport", label: "生成报告" },
                {
                  key: "autoOpenResults",
                  label: "自动打开结果",
                },
                {
                  key: "saveIntermediateResults",
                  label: "保存中间结果",
                },
                { key: "enableLogging", label: "启用日志记录" },
              ].map((option) => (
                <div
                  key={option.key}
                  className="flex items-center space-x-2"
                >
                  <Switch
                    id={option.key}
                    checked={
                      config.executionConfig[
                        option.key as keyof typeof config.executionConfig
                      ]
                    }
                    onCheckedChange={(checked) =>
                      setConfig({
                        ...config,
                        executionConfig: {
                          ...config.executionConfig,
                          [option.key]: checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor={option.key}>
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {config.executionConfig.enableLogging && (
            <div>
              <Label htmlFor="logLevel">日志级别</Label>
              <Select
                value={config.executionConfig.logLevel}
                onValueChange={(value) =>
                  setConfig({
                    ...config,
                    executionConfig: {
                      ...config.executionConfig,
                      logLevel: value,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择日志级别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">
                    Warning
                  </SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-center space-x-3 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
        >
          取消
        </Button>
        <Button onClick={handleSave}>保存配置</Button>
      </div>
    </div>
  );
}