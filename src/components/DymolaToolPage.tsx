import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import {
  ArrowLeft,
  Settings,
  FileText,
  Play,
  Pause,
  Square,
  Save,
  FolderOpen,
  RefreshCw,
  Eye,
  Edit,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  BarChart3,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle,
  Globe,
  Code,
  Database,
  Archive
} from 'lucide-react@0.487.0';
import ToolModelIntegrationService from '../services/ToolModelIntegrationService';
import { toast } from 'sonner@2.0.3';

interface DymolaToolPageProps {
  nodeData?: any;
  onBack: () => void;
}

export function DymolaToolPage({ nodeData, onBack }: DymolaToolPageProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedModel, setSelectedModel] = useState('VehicleDynamics.mo');
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // 获取集成服务实例
  const integrationService = ToolModelIntegrationService.getInstance();

  // 模拟仿真运行
  const handleRunSimulation = () => {
    setIsRunning(true);
    setSimulationProgress(0);
    
    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  // 保存模型到个人模型库
  const handleSaveToPersonalLibrary = async () => {
    setIsSaving(true);
    
    try {
      const selectedFile = modelFiles.find(f => f.name === selectedModel);
      const modelData = await integrationService.saveModelFromTool({
        toolType: 'DYMOLA',
        nodeData: nodeData,
        modelContent: {
          name: `Dymola_${selectedModel.replace('.mo', '')}`,
          description: `基于Dymola创建的Modelica仿真模型，包含车辆动力学、控制系统等多物理域建模。当前模型文件: ${selectedModel}`,
          version: '1.0',
          project: '车辆仿真工程',
          tags: ['dymola', 'modelica', 'simulation', 'vehicle-dynamics', selectedFile?.status || 'ready'],
          file: selectedModel,
          parameters: {
            selectedModel: selectedModel,
            modelFiles: modelFiles,
            simulationResults: simulationResults,
            modelContent: `model VehicleDynamics
  parameter Real mass = 1500 "Vehicle mass [kg]";
  parameter Real drag_coefficient = 0.3 "Drag coefficient";
  parameter Real frontal_area = 2.5 "Frontal area [m2]";
  
  Real velocity(start=0) "Vehicle velocity [m/s]";
  Real acceleration "Vehicle acceleration [m/s2]";
  Real drag_force "Aerodynamic drag force [N]";
  
equation
  drag_force = 0.5 * 1.225 * drag_coefficient * frontal_area * velocity^2;
  mass * acceleration = engine_force - drag_force - brake_force;
  der(velocity) = acceleration;
  
end VehicleDynamics;`
          },
          configurations: {
            toolVersion: '2024x',
            solver: 'DASSL',
            simulationTime: '10.0s',
            outputFormat: '.mat'
          }
        },
        userInfo: {
          name: '当前用户', // 这里应该从用户上下文获取
          role: 'simulation'
        },
        additionalMetadata: {
          nodeId: nodeData?.id,
          workflowSource: true,
          simulationCompleted: simulationProgress === 100,
          lastSimulationResults: simulationResults
        }
      });
      
      toast.success(`模型 "${modelData.name}" 已成功保存到个人模型库！`);
    } catch (error) {
      console.error('保存模型失败:', error);
      toast.error('保存模型到个人模型库失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const modelFiles = [
    { name: 'VehicleDynamics.mo', type: 'Model', status: 'ready', size: '2.3KB' },
    { name: 'PowertrainModel.mo', type: 'Model', status: 'modified', size: '1.8KB' },
    { name: 'BrakeSystem.mo', type: 'Model', status: 'ready', size: '1.2KB' },
    { name: 'SuspensionModel.mo', type: 'Model', status: 'error', size: '980B' },
    { name: 'EngineControl.mo', type: 'Model', status: 'ready', size: '3.1KB' }
  ];

  const simulationResults = [
    { parameter: '最大速度', value: '180 km/h', status: 'normal' },
    { parameter: '加速度', value: '0-100km/h: 8.5s', status: 'normal' },
    { parameter: '制动距离', value: '42.3m', status: 'warning' },
    { parameter: '燃油消耗', value: '8.2L/100km', status: 'good' },
    { parameter: '排放水平', value: 'Euro 6', status: 'good' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'modified': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-orange-100 text-orange-800';
      case 'good': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'modified': return <Edit className="w-4 h-4" />;
      case 'error': return <AlertTriangle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              返回工作流
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Dymola 仿真工具</h1>
                <p className="text-xs text-gray-500">
                  节点: {nodeData?.name || '车辆动力学仿真'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              已连接
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              设置
            </Button>
          </div>
        </div>
      </div>

      {/* 主工具栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              size="sm" 
              onClick={handleRunSimulation}
              disabled={isRunning}
              className="bg-green-600 hover:bg-green-700"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  仿真中...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  运行仿真
                </>
              )}
            </Button>
            <Button variant="outline" size="sm" disabled={!isRunning}>
              <Square className="w-4 h-4 mr-2" />
              停止
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
            <Button variant="outline" size="sm">
              <FolderOpen className="w-4 h-4 mr-2" />
              打开
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSaveToPersonalLibrary}
              disabled={isSaving}
              className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Archive className="w-4 h-4 mr-2" />
              )}
              {isSaving ? '保存中...' : '保存到模型库'}
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>仿真时间: 10.0s</span>
            <Separator orientation="vertical" className="h-4" />
            <Globe className="w-4 h-4" />
            <span>求解器: DASSL</span>
          </div>
        </div>
        
        {/* 仿真进度条 */}
        {isRunning && (
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>仿真进度</span>
              <span>{simulationProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className="bg-green-600 h-1 rounded-full transition-all duration-300"
                style={{ width: `${simulationProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* 左侧 - 模型浏览器 */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  模型浏览器
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {modelFiles.map((file, index) => (
                    <div 
                      key={index}
                      className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedModel === file.name ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => setSelectedModel(file.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(file.status)}
                          <div>
                            <div className="font-medium text-sm">{file.name}</div>
                            <div className="text-xs text-gray-500">{file.size}</div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(file.status)}>
                          {file.status === 'ready' ? '就绪' : 
                           file.status === 'modified' ? '已修改' :
                           file.status === 'error' ? '错误' : file.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 中间 - 主工作区 */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="model" className="h-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="model" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  模型编辑
                </TabsTrigger>
                <TabsTrigger value="diagram" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  图形视图
                </TabsTrigger>
                <TabsTrigger value="results" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  仿真结果
                </TabsTrigger>
                <TabsTrigger value="log" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  日志
                </TabsTrigger>
              </TabsList>

              <TabsContent value="model" className="mt-4 h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>模型: {selectedModel}</span>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Minus className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Maximize2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
                      <pre>{`model VehicleDynamics
  parameter Real mass = 1500 "Vehicle mass [kg]";
  parameter Real drag_coefficient = 0.3 "Drag coefficient";
  parameter Real frontal_area = 2.5 "Frontal area [m2]";
  
  Real velocity(start=0) "Vehicle velocity [m/s]";
  Real acceleration "Vehicle acceleration [m/s2]";
  Real drag_force "Aerodynamic drag force [N]";
  
equation
  drag_force = 0.5 * 1.225 * drag_coefficient * frontal_area * velocity^2;
  mass * acceleration = engine_force - drag_force - brake_force;
  der(velocity) = acceleration;
  
end VehicleDynamics;`}</pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="diagram" className="mt-4 h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>系统图形视图</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-12 h-12 text-orange-600" />
                      </div>
                      <p className="text-gray-600">车辆动力学系统图形化视图</p>
                      <p className="text-sm text-gray-500 mt-2">包含发动机、传动系统、制动系统等组件</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="results" className="mt-4 h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>仿真结果分析</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {simulationResults.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${
                              result.status === 'good' ? 'bg-green-500' :
                              result.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`} />
                            <span className="font-medium">{result.parameter}</span>
                          </div>
                          <Badge className={getStatusColor(result.status)}>
                            {result.value}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="log" className="mt-4 h-full">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>仿真日志</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs max-h-64 overflow-y-auto">
                      <div>[2025-01-10 10:30:15] INFO: 开始初始化仿真环境</div>
                      <div>[2025-01-10 10:30:16] INFO: 加载模型文件: VehicleDynamics.mo</div>
                      <div>[2025-01-10 10:30:17] INFO: 编译模型成功</div>
                      <div>[2025-01-10 10:30:18] INFO: 设置求解器参数: DASSL</div>
                      <div>[2025-01-10 10:30:19] INFO: 开始仿真计算</div>
                      <div>[2025-01-10 10:30:20] INFO: 仿真时间: 0.0s - 2.5s 完成</div>
                      <div>[2025-01-10 10:30:21] INFO: 仿真时间: 2.5s - 5.0s 完成</div>
                      <div>[2025-01-10 10:30:22] INFO: 仿真时间: 5.0s - 7.5s 完成</div>
                      <div>[2025-01-10 10:30:23] INFO: 仿真时间: 7.5s - 10.0s 完成</div>
                      <div>[2025-01-10 10:30:24] INFO: 仿真计算完成，生成结果文件</div>
                      <div>[2025-01-10 10:30:25] INFO: 结果验证通过</div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}