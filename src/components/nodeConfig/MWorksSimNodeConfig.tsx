import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface MWorksSimNodeConfigProps {
  node: any;
  onSave: (config: any) => void;
  onCancel?: () => void;
  userRole?: string;
}

export function MWorksSimNodeConfig({ node, onSave, onCancel, userRole }: MWorksSimNodeConfigProps) {
  const [config, setConfig] = useState({
    nodeName: node?.name || 'M-works仿真',
    description: node?.description || '进行仿真配置定义',
    timeout: node?.config?.timeout || 1800,
    retryCount: node?.config?.retryCount || 1,
    autoRun: node?.config?.autoRun || true,
    // M-works仿真特有配置
    modelPath: node?.config?.parameters?.modelPath || '/models/vehicle.mo',
    simulationMode: node?.config?.parameters?.simulationMode || 'dynamic',
    solverSettings: node?.config?.parameters?.solverSettings || {
      solver: 'dassl',
      tolerance: 1e-6,
      stepSize: 0.001,
      maxStepSize: 0.1,
      minStepSize: 1e-8
    },
    timeSettings: node?.config?.parameters?.timeSettings || {
      startTime: 0,
      stopTime: 10,
      numberOfIntervals: 10000,
      outputInterval: 0.01
    },
    modelConfiguration: node?.config?.parameters?.modelConfiguration || {
      modelType: 'continuous',
      compiler: 'mworks-compiler',
      optimizationLevel: 'standard',
      enableVectorization: true
    },
    outputSettings: node?.config?.parameters?.outputSettings || {
      format: 'csv',
      variables: 'all',
      enablePlotting: true,
      saveTrajectory: true
    },
    performanceSettings: node?.config?.parameters?.performanceSettings || {
      enableParallel: false,
      numberOfThreads: 4,
      memoryLimit: 4000,
      enableCaching: true
    },
    validationSettings: node?.config?.parameters?.validationSettings || {
      enableModelCheck: true,
      checkUnits: true,
      checkBalance: true,
      warningLevel: 'standard'
    },
  });

  const handleSave = () => {
    const saveConfig = {
      ...config,
      parameters: {
        modelPath: config.modelPath,
        simulationMode: config.simulationMode,
        solverSettings: config.solverSettings,
        timeSettings: config.timeSettings,
        modelConfiguration: config.modelConfiguration,
        outputSettings: config.outputSettings,
        performanceSettings: config.performanceSettings,
        validationSettings: config.validationSettings,
      }
    };
    onSave(saveConfig);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">M-works仿真配置</h3>
        <p className="text-sm text-muted-foreground mt-1">
          配置M-works仿真环境的参数和执行选项
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">基础设置</TabsTrigger>
          <TabsTrigger value="solver">求解器</TabsTrigger>
          <TabsTrigger value="performance">性能优化</TabsTrigger>
          <TabsTrigger value="output">输出配置</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
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
            <Label htmlFor="modelPath">模型路径</Label>
            <Input
              id="modelPath"
              value={config.modelPath}
              onChange={(e) => setConfig({ ...config, modelPath: e.target.value })}
              placeholder="/models/vehicle.mo"
            />
          </div>

          <div>
            <Label htmlFor="simulationMode">仿真模式</Label>
            <Select value={config.simulationMode} onValueChange={(value) => setConfig({ ...config, simulationMode: value })}>
              <SelectTrigger>
                <SelectValue placeholder="选择仿真模式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dynamic">动态仿真</SelectItem>
                <SelectItem value="steady-state">稳态分析</SelectItem>
                <SelectItem value="optimization">优化分析</SelectItem>
                <SelectItem value="parameter-sweep">参数扫描</SelectItem>
                <SelectItem value="sensitivity">敏感性分析</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="autoExecute">自动执行</Label>
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
          </div>

          <div>
            <Label>模型配置</Label>
            <div className="space-y-3 mt-2 p-3 bg-gray-50 rounded">
              <div>
                <Label htmlFor="modelType">模型类型</Label>
                <Select value={config.modelConfiguration.modelType} onValueChange={(value) => setConfig({
                  ...config,
                  modelConfiguration: { ...config.modelConfiguration, modelType: value }
                })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择模型类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="continuous">连续系统</SelectItem>
                    <SelectItem value="discrete">离散系统</SelectItem>
                    <SelectItem value="hybrid">混合系统</SelectItem>
                    <SelectItem value="event-driven">事件驱动</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="compiler">编译器</Label>
                <Select value={config.modelConfiguration.compiler} onValueChange={(value) => setConfig({
                  ...config,
                  modelConfiguration: { ...config.modelConfiguration, compiler: value }
                })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择编译器" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mworks-compiler">M-works编译器</SelectItem>
                    <SelectItem value="gcc">GCC</SelectItem>
                    <SelectItem value="visual-cpp">Visual C++</SelectItem>
                    <SelectItem value="intel-compiler">Intel编译器</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="optimizationLevel">优化级别</Label>
                <Select value={config.modelConfiguration.optimizationLevel} onValueChange={(value) => setConfig({
                  ...config,
                  modelConfiguration: { ...config.modelConfiguration, optimizationLevel: value }
                })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择优化级别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">无优化</SelectItem>
                    <SelectItem value="basic">基础优化</SelectItem>
                    <SelectItem value="standard">标准优化</SelectItem>
                    <SelectItem value="aggressive">激进优化</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enableVectorization"
                  checked={config.modelConfiguration.enableVectorization}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    modelConfiguration: { ...config.modelConfiguration, enableVectorization: checked }
                  })}
                />
                <Label htmlFor="enableVectorization">启用向量化</Label>
              </div>
            </div>
          </div>

          <div>
            <Label>时间设置</Label>
            <div className="grid grid-cols-2 gap-3 mt-2 p-3 bg-gray-50 rounded">
              <div>
                <Label htmlFor="startTime">开始时间 (s)</Label>
                <Input
                  id="startTime"
                  type="number"
                  value={config.timeSettings.startTime}
                  onChange={(e) => setConfig({
                    ...config,
                    timeSettings: {
                      ...config.timeSettings,
                      startTime: parseFloat(e.target.value) || 0
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="stopTime">结束时间 (s)</Label>
                <Input
                  id="stopTime"
                  type="number"
                  value={config.timeSettings.stopTime}
                  onChange={(e) => setConfig({
                    ...config,
                    timeSettings: {
                      ...config.timeSettings,
                      stopTime: parseFloat(e.target.value) || 10
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="numberOfIntervals">输出点数</Label>
                <Input
                  id="numberOfIntervals"
                  type="number"
                  value={config.timeSettings.numberOfIntervals}
                  onChange={(e) => setConfig({
                    ...config,
                    timeSettings: {
                      ...config.timeSettings,
                      numberOfIntervals: parseInt(e.target.value) || 10000
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="outputInterval">输出间隔 (s)</Label>
                <Input
                  id="outputInterval"
                  type="number"
                  step="0.001"
                  value={config.timeSettings.outputInterval}
                  onChange={(e) => setConfig({
                    ...config,
                    timeSettings: {
                      ...config.timeSettings,
                      outputInterval: parseFloat(e.target.value) || 0.01
                    }
                  })}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="solver" className="space-y-4">
          <div>
            <Label htmlFor="solver">求解器</Label>
            <Select value={config.solverSettings.solver} onValueChange={(value) => setConfig({
              ...config,
              solverSettings: { ...config.solverSettings, solver: value }
            })}>
              <SelectTrigger>
                <SelectValue placeholder="选择求解器" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dassl">DASSL</SelectItem>
                <SelectItem value="radau5od">Radau5OD</SelectItem>
                <SelectItem value="cvode">CVODE</SelectItem>
                <SelectItem value="ida">IDA</SelectItem>
                <SelectItem value="euler">Euler</SelectItem>
                <SelectItem value="runge-kutta">Runge-Kutta</SelectItem>
                <SelectItem value="adams-bashforth">Adams-Bashforth</SelectItem>
                <SelectItem value="bdf">BDF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tolerance">求解精度</Label>
            <Input
              id="tolerance"
              type="number"
              step="1e-6"
              value={config.solverSettings.tolerance}
              onChange={(e) => setConfig({
                ...config,
                solverSettings: {
                  ...config.solverSettings,
                  tolerance: parseFloat(e.target.value) || 1e-6
                }
              })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="stepSize">标准步长 (s)</Label>
              <Input
                id="stepSize"
                type="number"
                step="0.0001"
                value={config.solverSettings.stepSize}
                onChange={(e) => setConfig({
                  ...config,
                  solverSettings: {
                    ...config.solverSettings,
                    stepSize: parseFloat(e.target.value) || 0.001
                  }
                })}
              />
            </div>
            <div>
              <Label htmlFor="maxStepSize">最大步长 (s)</Label>
              <Input
                id="maxStepSize"
                type="number"
                step="0.01"
                value={config.solverSettings.maxStepSize}
                onChange={(e) => setConfig({
                  ...config,
                  solverSettings: {
                    ...config.solverSettings,
                    maxStepSize: parseFloat(e.target.value) || 0.1
                  }
                })}
              />
            </div>
            <div>
              <Label htmlFor="minStepSize">最小步长 (s)</Label>
              <Input
                id="minStepSize"
                type="number"
                step="1e-8"
                value={config.solverSettings.minStepSize}
                onChange={(e) => setConfig({
                  ...config,
                  solverSettings: {
                    ...config.solverSettings,
                    minStepSize: parseFloat(e.target.value) || 1e-8
                  }
                })}
              />
            </div>
          </div>

          <div>
            <Label>验证设置</Label>
            <div className="space-y-2 mt-2 p-3 bg-gray-50 rounded">
              {[
                { key: 'enableModelCheck', label: '启用模型检查' },
                { key: 'checkUnits', label: '单位检查' },
                { key: 'checkBalance', label: '平衡方程检查' }
              ].map((setting) => (
                <div key={setting.key} className="flex items-center space-x-2">
                  <Switch
                    id={setting.key}
                    checked={config.validationSettings[setting.key as keyof typeof config.validationSettings]}
                    onCheckedChange={(checked) => setConfig({
                      ...config,
                      validationSettings: {
                        ...config.validationSettings,
                        [setting.key]: checked
                      }
                    })}
                  />
                  <Label htmlFor={setting.key}>{setting.label}</Label>
                </div>
              ))}

              <div>
                <Label htmlFor="warningLevel">警告级别</Label>
                <Select value={config.validationSettings.warningLevel} onValueChange={(value) => setConfig({
                  ...config,
                  validationSettings: { ...config.validationSettings, warningLevel: value }
                })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择警告级别" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">无警告</SelectItem>
                    <SelectItem value="minimal">最少警告</SelectItem>
                    <SelectItem value="standard">标准警告</SelectItem>
                    <SelectItem value="verbose">详细警告</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="enableParallel"
              checked={config.performanceSettings.enableParallel}
              onCheckedChange={(checked) => setConfig({
                ...config,
                performanceSettings: { ...config.performanceSettings, enableParallel: checked }
              })}
            />
            <Label htmlFor="enableParallel">启用并行计算</Label>
          </div>

          {config.performanceSettings.enableParallel && (
            <div>
              <Label htmlFor="numberOfThreads">线程数</Label>
              <Input
                id="numberOfThreads"
                type="number"
                min="1"
                max="32"
                value={config.performanceSettings.numberOfThreads}
                onChange={(e) => setConfig({
                  ...config,
                  performanceSettings: {
                    ...config.performanceSettings,
                    numberOfThreads: parseInt(e.target.value) || 4
                  }
                })}
              />
            </div>
          )}

          <div>
            <Label htmlFor="memoryLimit">内存限制 (MB)</Label>
            <Input
              id="memoryLimit"
              type="number"
              min="512"
              value={config.performanceSettings.memoryLimit}
              onChange={(e) => setConfig({
                ...config,
                performanceSettings: {
                  ...config.performanceSettings,
                  memoryLimit: parseInt(e.target.value) || 4000
                }
              })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="enableCaching"
              checked={config.performanceSettings.enableCaching}
              onCheckedChange={(checked) => setConfig({
                ...config,
                performanceSettings: { ...config.performanceSettings, enableCaching: checked }
              })}
            />
            <Label htmlFor="enableCaching">启用结果缓存</Label>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">性能优化建议</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 复杂模型建议启用并行计算以提升性能</li>
              <li>• 线程数一般设置为CPU核心数的1-2倍</li>
              <li>• 大型模型建议增加内存限制避免内存不足</li>
              <li>• 重复仿真时启用缓存可显著提升速度</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="output" className="space-y-4">
          <div>
            <Label htmlFor="outputFormat">输出格式</Label>
            <Select value={config.outputSettings.format} onValueChange={(value) => setConfig({
              ...config,
              outputSettings: { ...config.outputSettings, format: value }
            })}>
              <SelectTrigger>
                <SelectValue placeholder="选择输出格式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="mat">MAT (MATLAB)</SelectItem>
                <SelectItem value="hdf5">HDF5</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="variables">输出变量</Label>
            <Select value={config.outputSettings.variables} onValueChange={(value) => setConfig({
              ...config,
              outputSettings: { ...config.outputSettings, variables: value }
            })}>
              <SelectTrigger>
                <SelectValue placeholder="选择输出变量" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有变量</SelectItem>
                <SelectItem value="selected">选定变量</SelectItem>
                <SelectItem value="states-only">仅状态变量</SelectItem>
                <SelectItem value="outputs-only">仅输出变量</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>输出选项</Label>
            <div className="space-y-2 mt-2">
              {[
                { key: 'enablePlotting', label: '启用绘图' },
                { key: 'saveTrajectory', label: '保存轨迹' }
              ].map((option) => (
                <div key={option.key} className="flex items-center space-x-2">
                  <Switch
                    id={option.key}
                    checked={config.outputSettings[option.key as keyof typeof config.outputSettings]}
                    onCheckedChange={(checked) => setConfig({
                      ...config,
                      outputSettings: {
                        ...config.outputSettings,
                        [option.key]: checked
                      }
                    })}
                  />
                  <Label htmlFor={option.key}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>



          <div>
            <Label htmlFor="timeout">超时时间（秒）</Label>
            <Input
              id="timeout"
              type="number"
              value={config.timeout}
              onChange={(e) => setConfig({ ...config, timeout: parseInt(e.target.value) || 1800 })}
              min="1"
            />
          </div>

          <div>
            <Label htmlFor="retryCount">重试次数</Label>
            <Input
              id="retryCount"
              type="number"
              value={config.retryCount}
              onChange={(e) => setConfig({ ...config, retryCount: parseInt(e.target.value) || 1 })}
              min="0"
              max="10"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSave}>
          保存配置
        </Button>
      </div>
    </div>
  );
}