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

interface DOEAnalysisNodeConfigProps {
  node: any;
  onSave: (config: any) => void;
  onCancel?: () => void;
  userRole?: string;
}

export function DOEAnalysisNodeConfig({
  node,
  onSave,
  onCancel,
  userRole,
}: DOEAnalysisNodeConfigProps) {
  const [config, setConfig] = useState({
    nodeName: node?.name || "实验分析",
    description: node?.description || "基于仿真结果的DOE实验设计与优化分析",
    timeout: node?.config?.timeout || 3600,
    retryCount: node?.config?.retryCount || 1,
    autoRun: node?.config?.autoRun || true,
    // DOE特有配置
    designType:
      node?.config?.parameters?.designType || "factorial",
    factors: node?.config?.parameters?.factors || 3,
    levels: node?.config?.parameters?.levels || 2,
    responseVariables: node?.config?.parameters
      ?.responseVariables || ["output1"],
    optimizationTarget:
      node?.config?.parameters?.optimizationTarget ||
      "maximize",
    analysisMethod:
      node?.config?.parameters?.analysisMethod || "anova",
    significanceLevel:
      node?.config?.parameters?.significanceLevel || 0.05,
    generatePlots:
      node?.config?.parameters?.generatePlots || true,
    outputDirectory:
      node?.config?.parameters?.outputDirectory ||
      "/doe-results",
    // 新增：汽车能耗分析特有的配置项
    inputResultPath: node?.config?.parameters?.inputResultPath || "",
    dataFormat: node?.config?.parameters?.dataFormat || "csv",
    autoParseResults: node?.config?.parameters?.autoParseResults || false,
    doeMethod: node?.config?.parameters?.doeMethod || "factorial",
    doeTools: node?.config?.parameters?.doeTools || "minitab",
    factorCount: node?.config?.parameters?.factorCount || 3,
    levelCount: node?.config?.parameters?.levelCount || 2,
    responseVariables: node?.config?.parameters?.responseVariables || "",
    constraintConditions: node?.config?.parameters?.constraintConditions || "",
    optimizationObjective: node?.config?.parameters?.optimizationObjective || "maximize",
    enableExternalTool: node?.config?.parameters?.enableExternalTool || false,
    autoOpenTool: node?.config?.parameters?.autoOpenTool || false,
    generateReport: node?.config?.parameters?.generateReport || true,
    exportResults: node?.config?.parameters?.exportResults || true,
    confidenceLevel: node?.config?.parameters?.confidenceLevel || 0.95,
  });

  const handleSave = () => {
    const saveConfig = {
      ...config,
      parameters: {
        designType: config.designType,
        factors: config.factors,
        levels: config.levels,
        responseVariables: config.responseVariables,
        optimizationTarget: config.optimizationTarget,
        analysisMethod: config.analysisMethod,
        significanceLevel: config.significanceLevel,
        generatePlots: config.generatePlots,
        outputDirectory: config.outputDirectory,
        inputResultPath: config.inputResultPath,
        dataFormat: config.dataFormat,
        autoParseResults: config.autoParseResults,
        doeMethod: config.doeMethod,
        doeTools: config.doeTools,
        factorCount: config.factorCount,
        levelCount: config.levelCount,
        constraintConditions: config.constraintConditions,
        optimizationObjective: config.optimizationObjective,
        enableExternalTool: config.enableExternalTool,
        autoOpenTool: config.autoOpenTool,
        generateReport: config.generateReport,
        exportResults: config.exportResults,
        confidenceLevel: config.confidenceLevel,
      },
    };
    onSave(saveConfig);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mt-1">
          配置实验设计(DOE)分析参数，基于上一轮仿真结果进行实验设计和优化分析
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">基础设置</TabsTrigger>
          <TabsTrigger value="design">实验设计</TabsTrigger>
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
            <Label>输入数据配置</Label>
            <div className="space-y-3 mt-2 p-3 bg-gray-50 rounded">
              <div>
                <Label htmlFor="inputResultPath">
                  仿真结果路径
                </Label>
                <Input
                  id="inputResultPath"
                  value={config.inputResultPath || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      inputResultPath: e.target.value,
                    })
                  }
                  placeholder="/results/simulation_output.csv"
                />
              </div>

              <div>
                <Label htmlFor="dataFormat">数据格式</Label>
                <Select
                  value={config.dataFormat || "csv"}
                  onValueChange={(value) =>
                    setConfig({ ...config, dataFormat: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择数据格式" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="mat">MAT</SelectItem>
                    <SelectItem value="hdf5">HDF5</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="autoParseResults"
                  checked={config.autoParseResults || false}
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      autoParseResults: checked,
                    })
                  }
                />
                <Label htmlFor="autoParseResults">
                  自动解析结果
                </Label>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="autoRun"
              checked={config.autoRun || false}
              onCheckedChange={(checked) =>
                setConfig({ ...config, autoRun: checked })
              }
            />
            <Label htmlFor="autoRun">自动运行</Label>
          </div>
        </TabsContent>

        <TabsContent value="design" className="space-y-4">
          <div>
            <Label htmlFor="doeMethod">DOE方法</Label>
            <Select
              value={config.doeMethod || "factorial"}
              onValueChange={(value) =>
                setConfig({ ...config, doeMethod: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择DOE方法" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="factorial">
                  全因子设计
                </SelectItem>
                <SelectItem value="fractional-factorial">
                  部分因子设计
                </SelectItem>
                <SelectItem value="response-surface">
                  响应面设计
                </SelectItem>
                <SelectItem value="central-composite">
                  中心复合设计
                </SelectItem>
                <SelectItem value="box-behnken">
                  Box-Behnken设计
                </SelectItem>
                <SelectItem value="taguchi">
                  田口设计
                </SelectItem>
                <SelectItem value="latin-hypercube">
                  拉丁超立方
                </SelectItem>
                <SelectItem value="optimal">
                  最优设计
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="doeTools">DOE工具</Label>
            <Select
              value={config.doeTools || "minitab"}
              onValueChange={(value) =>
                setConfig({ ...config, doeTools: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择DOE工具" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minitab">Minitab</SelectItem>
                <SelectItem value="jmp">JMP</SelectItem>
                <SelectItem value="design-expert">
                  Design-Expert
                </SelectItem>
                <SelectItem value="r-programming">
                  R语言
                </SelectItem>
                <SelectItem value="python-sklearn">
                  Python scikit-learn
                </SelectItem>
                <SelectItem value="matlab-doe">
                  MATLAB DOE工具箱
                </SelectItem>
                <SelectItem value="custom">
                  自定义算法
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>实验因子配置</Label>
            <div className="space-y-3 mt-2 p-3 bg-gray-50 rounded">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="factorCount">因子数量</Label>
                  <Input
                    id="factorCount"
                    type="number"
                    value={config.factorCount || 3}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        factorCount:
                          parseInt(e.target.value) || 3,
                      })
                    }
                    min="1"
                    max="20"
                  />
                </div>
                <div>
                  <Label htmlFor="levelCount">水平数</Label>
                  <Input
                    id="levelCount"
                    type="number"
                    value={config.levelCount || 2}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        levelCount:
                          parseInt(e.target.value) || 2,
                      })
                    }
                    min="2"
                    max="10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="responseVariables">
                  响应变量
                </Label>
                <Input
                  id="responseVariables"
                  value={config.responseVariables || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      responseVariables: e.target.value,
                    })
                  }
                  placeholder="效率,功率,温度 (用逗号分隔)"
                />
              </div>

              <div>
                <Label htmlFor="constraintConditions">
                  约束条件
                </Label>
                <Textarea
                  id="constraintConditions"
                  value={config.constraintConditions || ""}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      constraintConditions: e.target.value,
                    })
                  }
                  placeholder="输入约束条件，例如：x1 > 0, x2 < 100"
                  rows={2}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="optimizationObjective">
              优化目标
            </Label>
            <Select
              value={config.optimizationObjective || "maximize"}
              onValueChange={(value) =>
                setConfig({
                  ...config,
                  optimizationObjective: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择优化目标" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maximize">最大化</SelectItem>
                <SelectItem value="minimize">最小化</SelectItem>
                <SelectItem value="target">
                  目标值优化
                </SelectItem>
                <SelectItem value="robust">
                  稳健性优化
                </SelectItem>
                <SelectItem value="multi-objective">
                  多目标优化
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="analysisMethod">统计分析方法</Label>
            <Select
              value={config.analysisMethod || "anova"}
              onValueChange={(value) =>
                setConfig({ ...config, analysisMethod: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="选择分析方法" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anova">
                  方差分析(ANOVA)
                </SelectItem>
                <SelectItem value="regression">
                  回归分析
                </SelectItem>
                <SelectItem value="rsm">
                  响应面方法(RSM)
                </SelectItem>
                <SelectItem value="machine-learning">
                  机器学习
                </SelectItem>
                <SelectItem value="neural-network">
                  神经网络
                </SelectItem>
                <SelectItem value="genetic-algorithm">
                  遗传算法
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="execution" className="space-y-4">
          <div>
            <Label>工具集成选项</Label>
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="enableExternalTool"
                  checked={config.enableExternalTool || false}
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      enableExternalTool: checked,
                    })
                  }
                />
                <Label htmlFor="enableExternalTool">
                  启用外部工具调用
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="autoOpenTool"
                  checked={config.autoOpenTool || false}
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      autoOpenTool: checked,
                    })
                  }
                />
                <Label htmlFor="autoOpenTool">
                  自动打开外部工具
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="generateReport"
                  checked={config.generateReport || true}
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      generateReport: checked,
                    })
                  }
                />
                <Label htmlFor="generateReport">
                  生成分析报告
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="exportResults"
                  checked={config.exportResults || true}
                  onCheckedChange={(checked) =>
                    setConfig({
                      ...config,
                      exportResults: checked,
                    })
                  }
                />
                <Label htmlFor="exportResults">
                  导出分析结果
                </Label>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="outputDirectory">输出目录</Label>
            <Input
              id="outputDirectory"
              value={config.outputDirectory || "./doe_results"}
              onChange={(e) =>
                setConfig({
                  ...config,
                  outputDirectory: e.target.value,
                })
              }
              placeholder="请输入输出目录路径"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="significanceLevel">
                显著性水平
              </Label>
              <Input
                id="significanceLevel"
                type="number"
                value={config.significanceLevel || 0.05}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    significanceLevel:
                      parseFloat(e.target.value) || 0.05,
                  })
                }
                min="0.001"
                max="0.1"
                step="0.001"
              />
            </div>
            <div>
              <Label htmlFor="confidenceLevel">置信水平</Label>
              <Input
                id="confidenceLevel"
                type="number"
                value={config.confidenceLevel || 0.95}
                onChange={(e) =>
                  setConfig({
                    ...config,
                    confidenceLevel:
                      parseFloat(e.target.value) || 0.95,
                  })
                }
                min="0.8"
                max="0.99"
                step="0.01"
              />
            </div>
          </div>
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