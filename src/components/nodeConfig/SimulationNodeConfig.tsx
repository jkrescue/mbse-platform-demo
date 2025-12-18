import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Car, Gauge, MapPin, Clock, Thermometer, Battery } from 'lucide-react@0.487.0';

interface SimulationNodeConfigProps {
  node: any;
  onSave: (config: any) => void;
  onCancel?: () => void;
  userRole?: string;
}

export function SimulationNodeConfig({ node, onSave, onCancel, userRole }: SimulationNodeConfigProps) {
  // 优化配置数据获取
  const getNodeParameter = (path: string, defaultValue: any) => {
    return node?.config?.parameters?.[path] || 
           node?.parameters?.[path] || 
           node?.config?.[path] || 
           defaultValue;
  };

  const [config, setConfig] = useState({
    nodeName: node?.name || '仿真配置',
    description: node?.description || '定义整车仿真工况和参数',
    timeout: getNodeParameter('timeout', 1800),
    retryCount: getNodeParameter('retryCount', 1),
    autoRun: getNodeParameter('autoRun', true),
    
    // 驾驶循环配置
    drivingCycle: getNodeParameter('drivingCycle', 'NEDC'),
    customCycleFile: getNodeParameter('customCycleFile', ''),
    
    // 环境条件配置
    ambientTemperature: getNodeParameter('ambientTemperature', 25),
    altitude: getNodeParameter('altitude', 0),
    windSpeed: getNodeParameter('windSpeed', 0),
    roadGrade: getNodeParameter('roadGrade', 0),
    roadCondition: getNodeParameter('roadCondition', 'dry-asphalt'),
    
    // 整车参数配置
    vehicleMass: getNodeParameter('vehicleMass', 1500),
    passengerLoad: getNodeParameter('passengerLoad', 150),
    cargoLoad: getNodeParameter('cargoLoad', 0),
    dragCoefficient: getNodeParameter('dragCoefficient', 0.28),
    frontalArea: getNodeParameter('frontalArea', 2.3),
    rollingResistance: getNodeParameter('rollingResistance', 0.01),
    wheelRadius: getNodeParameter('wheelRadius', 0.3),
    
    // 电池初始状态
    initialSOC: getNodeParameter('initialSOC', 100),
    batteryCapacity: getNodeParameter('batteryCapacity', 60),
    batteryVoltage: getNodeParameter('batteryVoltage', 400),
    
    // 仿真求解器配置
    solver: getNodeParameter('solver', 'dassl'),
    startTime: getNodeParameter('startTime', 0),
    stopTime: getNodeParameter('stopTime', 1800),
    tolerance: getNodeParameter('tolerance', 1e-6),
    stepSize: getNodeParameter('stepSize', 0.01),
    outputInterval: getNodeParameter('outputInterval', 1),
    
    // 输出配置
    outputFormat: getNodeParameter('outputFormat', 'csv'),
    outputDirectory: getNodeParameter('outputDirectory', '/results/simulation'),
    enableRealTimePlot: getNodeParameter('enableRealTimePlot', false),
    
    // 高级选项
    enableParallel: getNodeParameter('enableParallel', false),
    enableLogging: getNodeParameter('enableLogging', true),
    logLevel: getNodeParameter('logLevel', 'info'),
  });

  const handleSave = () => {
    const nodeConfig = {
      nodeName: config.nodeName,
      description: config.description,
      priority: '高',
      autoExecute: config.autoRun,
      timeout: config.timeout,
      retryCount: config.retryCount,
      parameters: {
        // 驾驶循环
        drivingCycle: config.drivingCycle,
        customCycleFile: config.customCycleFile,
        
        // 环境条件
        ambientTemperature: config.ambientTemperature,
        altitude: config.altitude,
        windSpeed: config.windSpeed,
        roadGrade: config.roadGrade,
        roadCondition: config.roadCondition,
        
        // 整车参数
        vehicleMass: config.vehicleMass,
        passengerLoad: config.passengerLoad,
        cargoLoad: config.cargoLoad,
        dragCoefficient: config.dragCoefficient,
        frontalArea: config.frontalArea,
        rollingResistance: config.rollingResistance,
        wheelRadius: config.wheelRadius,
        
        // 电池初始状态
        initialSOC: config.initialSOC,
        batteryCapacity: config.batteryCapacity,
        batteryVoltage: config.batteryVoltage,
        
        // 仿真求解器
        solver: config.solver,
        startTime: config.startTime,
        stopTime: config.stopTime,
        tolerance: config.tolerance,
        stepSize: config.stepSize,
        outputInterval: config.outputInterval,
        
        // 输出配置
        outputFormat: config.outputFormat,
        outputDirectory: config.outputDirectory,
        enableRealTimePlot: config.enableRealTimePlot,
        
        // 高级选项
        enableParallel: config.enableParallel,
        enableLogging: config.enableLogging,
        logLevel: config.logLevel,
      }
    };

    onSave(nodeConfig);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">仿真工况配置</h3>
        <p className="text-sm text-muted-foreground mt-1">
          配置整车能耗仿真的工况参数、环境条件和求解器设置
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">基础设置</TabsTrigger>
          <TabsTrigger value="driving">驾驶工况</TabsTrigger>
          <TabsTrigger value="vehicle">整车参数</TabsTrigger>
          <TabsTrigger value="solver">求解器</TabsTrigger>
        </TabsList>

        {/* 基础设置 */}
        <TabsContent value="basic" className="space-y-4 mt-4">
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

          <div className="flex items-center space-x-2">
            <Switch
              id="autoRun"
              checked={config.autoRun}
              onCheckedChange={(checked) => setConfig({ ...config, autoRun: checked })}
            />
            <Label htmlFor="autoRun">自动运行</Label>
          </div>

          <Separator />

          <div>
            <Label htmlFor="ambientTemperature">
              环境条件
            </Label>
            <div className="mt-3 space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="ambientTemperature">环境温度 (°C)</Label>
                  <Input
                    id="ambientTemperature"
                    type="number"
                    value={config.ambientTemperature}
                    onChange={(e) => setConfig({ ...config, ambientTemperature: parseFloat(e.target.value) || 25 })}
                  />
                </div>
                <div>
                  <Label htmlFor="altitude">海拔高度 (m)</Label>
                  <Input
                    id="altitude"
                    type="number"
                    value={config.altitude}
                    onChange={(e) => setConfig({ ...config, altitude: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="windSpeed">风速 (m/s)</Label>
                  <Input
                    id="windSpeed"
                    type="number"
                    value={config.windSpeed}
                    onChange={(e) => setConfig({ ...config, windSpeed: parseFloat(e.target.value) || 0 })}
                    step="0.1"
                  />
                </div>
                <div>
                  <Label htmlFor="roadGrade">道路坡度 (%)</Label>
                  <Input
                    id="roadGrade"
                    type="number"
                    value={config.roadGrade}
                    onChange={(e) => setConfig({ ...config, roadGrade: parseFloat(e.target.value) || 0 })}
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="roadCondition">路面条件</Label>
                <Select
                  value={config.roadCondition}
                  onValueChange={(value) => setConfig({ ...config, roadCondition: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dry-asphalt">干燥沥青路面</SelectItem>
                    <SelectItem value="wet-asphalt">潮湿沥青路面</SelectItem>
                    <SelectItem value="dry-concrete">干燥混凝土路面</SelectItem>
                    <SelectItem value="wet-concrete">潮湿混凝土路面</SelectItem>
                    <SelectItem value="gravel">碎石路面</SelectItem>
                    <SelectItem value="snow">雪地路面</SelectItem>
                    <SelectItem value="ice">冰面</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 驾驶工况 */}
        <TabsContent value="driving" className="space-y-4 mt-4">
          <div>
            <Label className="flex items-center space-x-2">
              <Car className="h-4 w-4" />
              <span>驾驶循环选择</span>
            </Label>
            <Select
              value={config.drivingCycle}
              onValueChange={(value) => setConfig({ ...config, drivingCycle: value })}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEDC">
                  <div className="flex flex-col">
                    <span>NEDC - 新欧洲驾驶循环</span>
                    <span className="text-xs text-gray-500">时长: 1180秒 | 距离: 11km</span>
                  </div>
                </SelectItem>
                <SelectItem value="WLTC">
                  <div className="flex flex-col">
                    <span>WLTC - 全球轻型车测试循环</span>
                    <span className="text-xs text-gray-500">时长: 1800秒 | 距离: 23.3km</span>
                  </div>
                </SelectItem>
                <SelectItem value="CLTC">
                  <div className="flex flex-col">
                    <span>CLTC - 中国轻型车测试循环</span>
                    <span className="text-xs text-gray-500">时长: 1800秒 | 距离: 14.48km</span>
                  </div>
                </SelectItem>
                <SelectItem value="CLTC-P">
                  <div className="flex flex-col">
                    <span>CLTC-P - 中国乘用车测试循环</span>
                    <span className="text-xs text-gray-500">时长: 1800秒 | 距离: 14.48km</span>
                  </div>
                </SelectItem>
                <SelectItem value="FTP75">
                  <div className="flex flex-col">
                    <span>FTP75 - 美国城市循环</span>
                    <span className="text-xs text-gray-500">时长: 1874秒 | 距离: 17.77km</span>
                  </div>
                </SelectItem>
                <SelectItem value="HWFET">
                  <div className="flex flex-col">
                    <span>HWFET - 美国高速循环</span>
                    <span className="text-xs text-gray-500">时长: 765秒 | 距离: 16.5km</span>
                  </div>
                </SelectItem>
                <SelectItem value="JC08">
                  <div className="flex flex-col">
                    <span>JC08 - 日本测试循环</span>
                    <span className="text-xs text-gray-500">时长: 1204秒 | 距离: 8.17km</span>
                  </div>
                </SelectItem>
                <SelectItem value="CUSTOM">自定义驾驶循环</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {config.drivingCycle === 'CUSTOM' && (
            <div>
              <Label htmlFor="customCycleFile">自定义循环文件路径</Label>
              <Input
                id="customCycleFile"
                value={config.customCycleFile}
                onChange={(e) => setConfig({ ...config, customCycleFile: e.target.value })}
                placeholder="/data/custom_cycle.csv"
              />
              <p className="text-xs text-gray-500 mt-1">
                文件格式: 时间(s), 速度(km/h) 的CSV文件
              </p>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-sm mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              当前工况信息
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">驾驶循环:</span>
                <span className="font-medium">{config.drivingCycle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">环境温度:</span>
                <span className="font-medium">{config.ambientTemperature}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">路面条件:</span>
                <span className="font-medium">
                  {config.roadCondition === 'dry-asphalt' ? '干燥沥青' :
                   config.roadCondition === 'wet-asphalt' ? '潮湿沥青' :
                   config.roadCondition === 'dry-concrete' ? '干燥混凝土' : config.roadCondition}
                </span>
              </div>
            </div>
          </div>

          <div>
            <Label className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>仿真时间设置</span>
            </Label>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="startTime">开始时间 (s)</Label>
                <Input
                  id="startTime"
                  type="number"
                  value={config.startTime}
                  onChange={(e) => setConfig({ ...config, startTime: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="stopTime">结束时间 (s)</Label>
                <Input
                  id="stopTime"
                  type="number"
                  value={config.stopTime}
                  onChange={(e) => setConfig({ ...config, stopTime: parseFloat(e.target.value) || 1800 })}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 整车参数 */}
        <TabsContent value="vehicle" className="space-y-4 mt-4">
          <div>
            <Label className="flex items-center space-x-2">
              <Gauge className="h-4 w-4" />
              <span>整车质量参数</span>
            </Label>
            <div className="mt-3 space-y-3 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="vehicleMass">整车质量 (kg)</Label>
                <Input
                  id="vehicleMass"
                  type="number"
                  value={config.vehicleMass}
                  onChange={(e) => setConfig({ ...config, vehicleMass: parseFloat(e.target.value) || 1500 })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="passengerLoad">乘员载荷 (kg)</Label>
                  <Input
                    id="passengerLoad"
                    type="number"
                    value={config.passengerLoad}
                    onChange={(e) => setConfig({ ...config, passengerLoad: parseFloat(e.target.value) || 150 })}
                  />
                </div>
                <div>
                  <Label htmlFor="cargoLoad">货物载荷 (kg)</Label>
                  <Input
                    id="cargoLoad"
                    type="number"
                    value={config.cargoLoad}
                    onChange={(e) => setConfig({ ...config, cargoLoad: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="p-3 bg-white border border-gray-300 rounded">
                <div className="text-sm">
                  <span className="text-gray-600">总质量: </span>
                  <span className="font-medium">
                    {config.vehicleMass + config.passengerLoad + config.cargoLoad} kg
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label>空气动力学参数</Label>
            <div className="mt-3 space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="dragCoefficient">风阻系数 (Cd)</Label>
                  <Input
                    id="dragCoefficient"
                    type="number"
                    value={config.dragCoefficient}
                    onChange={(e) => setConfig({ ...config, dragCoefficient: parseFloat(e.target.value) || 0.28 })}
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="frontalArea">迎风面积 (m²)</Label>
                  <Input
                    id="frontalArea"
                    type="number"
                    value={config.frontalArea}
                    onChange={(e) => setConfig({ ...config, frontalArea: parseFloat(e.target.value) || 2.3 })}
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label>轮胎与滚阻参数</Label>
            <div className="mt-3 space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="rollingResistance">滚动阻力系数</Label>
                  <Input
                    id="rollingResistance"
                    type="number"
                    value={config.rollingResistance}
                    onChange={(e) => setConfig({ ...config, rollingResistance: parseFloat(e.target.value) || 0.01 })}
                    step="0.001"
                  />
                </div>
                <div>
                  <Label htmlFor="wheelRadius">车轮半径 (m)</Label>
                  <Input
                    id="wheelRadius"
                    type="number"
                    value={config.wheelRadius}
                    onChange={(e) => setConfig({ ...config, wheelRadius: parseFloat(e.target.value) || 0.3 })}
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label className="flex items-center space-x-2">
              <Battery className="h-4 w-4" />
              <span>电池初始状态</span>
            </Label>
            <div className="mt-3 space-y-3 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="initialSOC">初始SOC (%)</Label>
                <Input
                  id="initialSOC"
                  type="number"
                  value={config.initialSOC}
                  onChange={(e) => setConfig({ ...config, initialSOC: parseFloat(e.target.value) || 100 })}
                  min="0"
                  max="100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="batteryCapacity">电池容量 (kWh)</Label>
                  <Input
                    id="batteryCapacity"
                    type="number"
                    value={config.batteryCapacity}
                    onChange={(e) => setConfig({ ...config, batteryCapacity: parseFloat(e.target.value) || 60 })}
                  />
                </div>
                <div>
                  <Label htmlFor="batteryVoltage">电池电压 (V)</Label>
                  <Input
                    id="batteryVoltage"
                    type="number"
                    value={config.batteryVoltage}
                    onChange={(e) => setConfig({ ...config, batteryVoltage: parseFloat(e.target.value) || 400 })}
                  />
                </div>
              </div>

              <div className="p-3 bg-white border border-gray-300 rounded">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">可用能量:</span>
                    <span className="font-medium">
                      {(config.batteryCapacity * config.initialSOC / 100).toFixed(2)} kWh
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">初始SOC:</span>
                    <span className="font-medium">{config.initialSOC}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 求解器配置 */}
        <TabsContent value="solver" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="solver">求解器类型</Label>
            <Select
              value={config.solver}
              onValueChange={(value) => setConfig({ ...config, solver: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dassl">DASSL (推荐)</SelectItem>
                <SelectItem value="euler">Euler - 显式欧拉法</SelectItem>
                <SelectItem value="runge-kutta">Runge-Kutta - 4阶龙格库塔</SelectItem>
                <SelectItem value="radau">Radau - 隐式Radau法</SelectItem>
                <SelectItem value="cvode">CVODE - 变步长多步法</SelectItem>
                <SelectItem value="ida">IDA - 微分代数方程求解器</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              {config.solver === 'dassl' && 'DASSL适合刚性微分代数方程，推荐用于汽车动力学仿真'}
              {config.solver === 'cvode' && 'CVODE适合大规模常微分方程组'}
              {config.solver === 'ida' && 'IDA专门处理微分代数方程系统'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="tolerance">求解容差</Label>
              <Input
                id="tolerance"
                type="number"
                value={config.tolerance}
                onChange={(e) => setConfig({ ...config, tolerance: parseFloat(e.target.value) || 1e-6 })}
                step="1e-7"
              />
            </div>
            <div>
              <Label htmlFor="stepSize">固定步长 (s)</Label>
              <Input
                id="stepSize"
                type="number"
                value={config.stepSize}
                onChange={(e) => setConfig({ ...config, stepSize: parseFloat(e.target.value) || 0.01 })}
                step="0.001"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="outputInterval">输出间隔 (s)</Label>
            <Input
              id="outputInterval"
              type="number"
              value={config.outputInterval}
              onChange={(e) => setConfig({ ...config, outputInterval: parseFloat(e.target.value) || 1 })}
              step="0.1"
            />
            <p className="text-xs text-gray-500 mt-1">
              数据记录的时间间隔，较小的值会产生更详细的结果
            </p>
          </div>

          <Separator />

          <div>
            <Label htmlFor="outputFormat">输出格式</Label>
            <Select
              value={config.outputFormat}
              onValueChange={(value) => setConfig({ ...config, outputFormat: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV - 逗号分隔值</SelectItem>
                <SelectItem value="mat">MAT - MATLAB格式</SelectItem>
                <SelectItem value="json">JSON - JSON格式</SelectItem>
                <SelectItem value="hdf5">HDF5 - 分层数据格式</SelectItem>
                <SelectItem value="xlsx">XLSX - Excel格式</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="outputDirectory">输出目录</Label>
            <Input
              id="outputDirectory"
              value={config.outputDirectory}
              onChange={(e) => setConfig({ ...config, outputDirectory: e.target.value })}
              placeholder="/results/simulation"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="enableRealTimePlot"
                checked={config.enableRealTimePlot}
                onCheckedChange={(checked) => setConfig({ ...config, enableRealTimePlot: checked })}
              />
              <Label htmlFor="enableRealTimePlot">启用实时绘图</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enableParallel"
                checked={config.enableParallel}
                onCheckedChange={(checked) => setConfig({ ...config, enableParallel: checked })}
              />
              <Label htmlFor="enableParallel">启用并行计算</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enableLogging"
                checked={config.enableLogging}
                onCheckedChange={(checked) => setConfig({ ...config, enableLogging: checked })}
              />
              <Label htmlFor="enableLogging">启用详细日志</Label>
            </div>
          </div>

          {config.enableLogging && (
            <div>
              <Label htmlFor="logLevel">日志级别</Label>
              <Select
                value={config.logLevel}
                onValueChange={(value) => setConfig({ ...config, logLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debug">Debug - 调试信息</SelectItem>
                  <SelectItem value="info">Info - 一般信息</SelectItem>
                  <SelectItem value="warning">Warning - 警告信息</SelectItem>
                  <SelectItem value="error">Error - 错误信息</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="timeout">超时时间 (秒)</Label>
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