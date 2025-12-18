import React, { useState, useCallback, useMemo } from 'react'
import { 
  GitCompare, 
  Plus, 
  X, 
  Search, 
  Filter, 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Eye,
  BarChart,
  FileText,
  Settings,
  Layers,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Copy,
  Share,
  RefreshCw,
  Clock,
  User,
  Hash,
  FileImage,
  Zap,
  Shield,
  Database,
  GitBranch,
  Gauge,
  Code,
  Split,
  ChevronDown,
  ChevronUp
} from 'lucide-react@0.487.0'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog'
import { Checkbox } from './ui/checkbox'
import { Progress } from './ui/progress'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { toast } from 'sonner@2.0.3'

// 模拟模型数据 - 根据MBSE和RFLP架构设计
const availableModels = [
  {
    id: 'model-1',
    name: '电池热管理模型 v2.1',
    type: '热仿真',
    version: '2.1.0',
    author: '张工程师',
    lastModified: '2025-01-08 14:30',
    status: '已发布',
    size: '15.2 MB',
    hash: 'a1b2c3d4e5f6',
    project: '新能源汽车项目',
    rflpCategory: 'Physical',
    codeType: 'SysML',
    codeContent: `<?xml version="1.0" encoding="UTF-8"?>
<xmi:XMI xmi:version="2.0">
  <uml:Model xmi:id="battery_thermal_model" name="BatteryThermalManagement">
    <packagedElement xmi:type="uml:Package" xmi:id="thermal_package" name="ThermalPackage">
      <packagedElement xmi:type="uml:Class" xmi:id="battery_cell" name="BatteryCell">
        <ownedAttribute xmi:id="temperature" name="temperature" type="Real"/>
        <ownedAttribute xmi:id="capacity" name="capacity" type="Real"/>
        <ownedAttribute xmi:id="voltage" name="voltage" type="Real"/>
        <ownedOperation xmi:id="calculate_heat" name="calculateHeat">
          <ownedParameter direction="return" type="Real"/>
        </ownedOperation>
      </packagedElement>
      <packagedElement xmi:type="uml:Class" xmi:id="cooling_system" name="CoolingSystem">
        <ownedAttribute xmi:id="flow_rate" name="flowRate" type="Real"/>
        <ownedAttribute xmi:id="coolant_temp" name="coolantTemperature" type="Real"/>
        <ownedOperation xmi:id="control_temperature" name="controlTemperature">
          <ownedParameter name="target_temp" type="Real"/>
        </ownedOperation>
      </packagedElement>
    </packagedElement>
  </uml:Model>
</xmi:XMI>`,
    parameters: {
      temperature: { min: -20, max: 60, unit: '°C', description: '工作温度范围' },
      current: { min: 0, max: 200, unit: 'A', description: '充放电电流' },
      voltage: { min: 3.0, max: 4.2, unit: 'V', description: '单体电池电压' },
      capacity: { value: 75, unit: 'kWh', description: '电池包容量' },
      thermalConductivity: { value: 0.8, unit: 'W/m·K', description: '热导率' }
    },
    performance: {
      accuracy: 95.2,
      convergenceTime: 142,
      memoryUsage: 256,
      cpuLoad: 68,
      stability: 'High',
      reliability: 98.5
    },
    structure: {
      nodeCount: 1250,
      connectionCount: 3680,
      fileSize: '15.2 MB',
      complexity: 'Medium',
      maintainability: 'High'
    },
    metadata: {
      toolVersion: 'Simulink R2023b',
      dependencies: ['ThermalLib v2.1', 'MathCore v1.8'],
      lastTested: '2025-01-07 16:20',
      testCoverage: 92.3
    }
  },
  {
    id: 'model-2',
    name: '电池热管理模型 v1.8',
    type: '热仿真',
    version: '1.8.0',
    author: '李工程师',
    lastModified: '2024-12-15 16:45',
    status: '已发布',
    size: '12.8 MB',
    hash: 'b2c3d4e5f6a1',
    project: '新能源汽车项目',
    rflpCategory: 'Physical',
    codeType: 'SysML',
    codeContent: `<?xml version="1.0" encoding="UTF-8"?>
<xmi:XMI xmi:version="2.0">
  <uml:Model xmi:id="battery_thermal_model_v18" name="BatteryThermalManagement">
    <packagedElement xmi:type="uml:Package" xmi:id="thermal_package" name="ThermalPackage">
      <packagedElement xmi:type="uml:Class" xmi:id="battery_cell" name="BatteryCell">
        <ownedAttribute xmi:id="temperature" name="temperature" type="Real"/>
        <ownedAttribute xmi:id="capacity" name="capacity" type="Real"/>
        <ownedOperation xmi:id="calculate_heat" name="calculateHeat">
          <ownedParameter direction="return" type="Real"/>
        </ownedOperation>
      </packagedElement>
      <packagedElement xmi:type="uml:Class" xmi:id="thermal_controller" name="ThermalController">
        <ownedAttribute xmi:id="setpoint" name="setpoint" type="Real"/>
        <ownedOperation xmi:id="pid_control" name="pidControl">
          <ownedParameter name="error" type="Real"/>
        </ownedOperation>
      </packagedElement>
    </packagedElement>
  </uml:Model>
</xmi:XMI>`,
    parameters: {
      temperature: { min: -15, max: 55, unit: '°C', description: '工作温度范围' },
      current: { min: 0, max: 150, unit: 'A', description: '充放电电流' },
      voltage: { min: 3.2, max: 4.0, unit: 'V', description: '单体电池电压' },
      capacity: { value: 70, unit: 'kWh', description: '电池包容量' },
      thermalConductivity: { value: 0.6, unit: 'W/m·K', description: '热导率' }
    },
    performance: {
      accuracy: 92.8,
      convergenceTime: 185,
      memoryUsage: 198,
      cpuLoad: 52,
      stability: 'Medium',
      reliability: 95.8
    },
    structure: {
      nodeCount: 980,
      connectionCount: 2890,
      fileSize: '12.8 MB',
      complexity: 'Medium',
      maintainability: 'Medium'
    },
    metadata: {
      toolVersion: 'Simulink R2022a',
      dependencies: ['ThermalLib v2.0', 'MathCore v1.8'],
      lastTested: '2024-12-10 14:15',
      testCoverage: 88.7
    }
  },
  {
    id: 'model-3',
    name: '车身结构优化模型',
    type: '结构仿真',
    version: '3.0.1',
    author: '王工程师',
    lastModified: '2025-01-05 09:20',
    status: '测试中',
    size: '28.6 MB',
    hash: 'c3d4e5f6a1b2',
    project: '车身轻量化项目',
    rflpCategory: 'Physical',
    codeType: 'Modelica',
    codeContent: `model VehicleStructure "车身结构优化模型"
  import Modelica.Mechanics.MultiBody.*;
  import Modelica.Mechanics.MultiBody.Interfaces.*;
  
  parameter Real density = 7850 "材料密度 kg/m³";
  parameter Real young_modulus = 210e9 "杨氏模量 Pa";
  parameter Real poisson_ratio = 0.3 "泊松比";
  
  Parts.FixedTranslation chassis(r={2.5, 0, 0}) "底盘";
  Parts.Body bodyFrame(
    m=300,
    r_CM={1.2, 0, 0.5},
    I_11=50, I_22=200, I_33=180
  ) "车身框架";
  
  Forces.Force loadForce "载荷力";
  
  equation
    // 结构约束方程
    der(bodyFrame.v_0) = loadForce.force / bodyFrame.m;
    
    // 应力计算
    Real stress = loadForce.force[1] * young_modulus / (density * 1e-3);
    
    // 位移约束
    assert(abs(bodyFrame.r_0[3]) < 0.05, "垂直位移超出限制");
    
  annotation(
    Documentation(info="<html>
    <p>车身结构优化模型，用于分析车身在不同载荷下的响应。</p>
    </html>")
  );
end VehicleStructure;`,
    parameters: {
      load: { min: 0, max: 5000, unit: 'N', description: '载荷范围' },
      displacement: { min: 0, max: 50, unit: 'mm', description: '位移范围' },
      stress: { max: 400, unit: 'MPa', description: '最大应力' },
      material: { value: 'Steel', unit: '-', description: '材料类型' },
      density: { value: 7850, unit: 'kg/m³', description: '材料密度' }
    },
    performance: {
      accuracy: 97.5,
      convergenceTime: 320,
      memoryUsage: 512,
      cpuLoad: 85,
      stability: 'High',
      reliability: 96.2
    },
    structure: {
      nodeCount: 5600,
      connectionCount: 15800,
      fileSize: '28.6 MB',
      complexity: 'High',
      maintainability: 'Medium'
    },
    metadata: {
      toolVersion: 'ANSYS 2023 R2',
      dependencies: ['StructuralLib v3.1', 'MaterialDB v2.5'],
      lastTested: '2025-01-04 11:30',
      testCoverage: 94.1
    }
  },
  {
    id: 'model-4',
    name: '动力总成匹配模型',
    type: '性能仿真',
    version: '2.5.0',
    author: '陈工程师',
    lastModified: '2024-12-28 11:15',
    status: '已发布',
    size: '21.4 MB',
    hash: 'd4e5f6a1b2c3',
    project: '混动系统项目',
    rflpCategory: 'Functions',
    codeType: 'Modelica',
    codeContent: `model PowertrainMatching "动力总成匹配模型"
  import Modelica.Mechanics.Rotational.*;
  import Modelica.Electrical.Machines.*;
  
  parameter Real gear_ratio = 3.5 "变速器传动比";
  parameter Real engine_max_power = 120e3 "发动机最大功率 W";
  parameter Real motor_max_power = 80e3 "电机最大功率 W";
  
  Sources.Torque engineTorque(useSupport=false) "发动机扭矩";
  Sources.Torque motorTorque(useSupport=false) "电机扭矩";
  
  Components.IdealGear transmission(ratio=gear_ratio) "变速器";
  Components.Inertia vehicleInertia(J=1500) "整车转动惯量";
  
  Real total_power;
  Real efficiency;
  Real fuel_consumption;
  
  equation
    // 功率平衡
    total_power = engineTorque.tau * transmission.flange_a.w + 
                  motorTorque.tau * transmission.flange_a.w;
    
    // 效率计算
    efficiency = if total_power > 0 then
                   transmission.flange_b.tau * transmission.flange_b.w / total_power
                 else 0;
    
    // 燃油消耗模型
    fuel_consumption = if engineTorque.tau > 0 then
                         0.25 * engineTorque.tau * transmission.flange_a.w / 1000
                       else 0;
    
    // 连接方程
    connect(engineTorque.flange, transmission.flange_a);
    connect(motorTorque.flange, transmission.flange_a);
    connect(transmission.flange_b, vehicleInertia.flange_a);
    
  annotation(
    Documentation(info="<html>
    <p>混合动力总成匹配模型，优化发动机和电机的协同工作。</p>
    </html>")
  );
end PowertrainMatching;`,
    parameters: {
      power: { min: 0, max: 300, unit: 'kW', description: '功率范围' },
      torque: { min: 0, max: 500, unit: 'Nm', description: '扭矩范围' },
      speed: { min: 0, max: 8000, unit: 'rpm', description: '转速范围' },
      efficiency: { min: 80, max: 95, unit: '%', description: '效率范围' },
      fuelConsumption: { value: 6.8, unit: 'L/100km', description: '油耗' }
    },
    performance: {
      accuracy: 94.1,
      convergenceTime: 98,
      memoryUsage: 324,
      cpuLoad: 72,
      stability: 'High',
      reliability: 97.3
    },
    structure: {
      nodeCount: 2100,
      connectionCount: 6200,
      fileSize: '21.4 MB',
      complexity: 'Medium',
      maintainability: 'High'
    },
    metadata: {
      toolVersion: 'GT-Power 2023',
      dependencies: ['PowertrainLib v4.2', 'EngineMap v1.9'],
      lastTested: '2024-12-27 09:45',
      testCoverage: 91.8
    }
  }
]

interface ModelComparisonProps {
  userRole?: string
}

export function ModelComparison({ userRole }: ModelComparisonProps) {
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterRFLP, setFilterRFLP] = useState('all')
  const [comparisonMode, setComparisonMode] = useState<'parameters' | 'performance' | 'structure' | 'metadata' | 'code'>('parameters')
  const [showAddModelDialog, setShowAddModelDialog] = useState(false)
  const [showExportDialog, setShowExportDialog] = useState(false)
  const [selectedExportFormat, setSelectedExportFormat] = useState('')
  const [isExporting, setIsExporting] = useState(false)
  const [collapsedCodeSections, setCollapsedCodeSections] = useState<{ [key: string]: boolean }>({})

  const toggleCodeSection = useCallback((sectionKey: string) => {
    setCollapsedCodeSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }, [])

  // 性能优化：使用useMemo避免不必要的重新计算
  const filteredModels = useMemo(() => {
    return availableModels.filter(model => {
      const matchesSearch = !searchTerm || 
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.project.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === 'all' || model.type === filterType
      const matchesRFLP = filterRFLP === 'all' || model.rflpCategory === filterRFLP
      return matchesSearch && matchesType && matchesRFLP
    })
  }, [searchTerm, filterType, filterRFLP])

  // 获取选中的模型数据
  const selectedModelData = useMemo(() => {
    return selectedModels.map(id => 
      availableModels.find(model => model.id === id)
    ).filter(Boolean)
  }, [selectedModels])

  const handleAddModel = useCallback((modelId: string) => {
    if (selectedModels.length >= 4) {
      toast.error('最多只能同时对比4个模型')
      return
    }
    if (selectedModels.includes(modelId)) {
      toast.info('该模型已在对比列表中')
      return
    }
    setSelectedModels(prev => [...prev, modelId])
    toast.success('模型已添加到对比列表')
  }, [selectedModels])

  const handleRemoveModel = useCallback((modelId: string) => {
    setSelectedModels(prev => prev.filter(id => id !== modelId))
    toast.success('模型已从对比列表中移除')
  }, [])

  const handleExportComparison = useCallback(async (format: string) => {
    if (!selectedExportFormat) {
      toast.error('请选择导出格式')
      return
    }

    setIsExporting(true)
    try {
      // 模拟导出过程
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success(`正在生成${format}格式的对比报告...`)
      
      // 实际项目中这里会调用API进行导出
      const exportData = {
        models: selectedModelData,
        comparisonType: comparisonMode,
        timestamp: new Date().toISOString(),
        format: format
      }
      console.log('导出数据:', exportData)
      
    } catch (error) {
      toast.error('导出失败，请重试')
    } finally {
      setIsExporting(false)
      setShowExportDialog(false)
      setSelectedExportFormat('')
    }
  }, [selectedModelData, comparisonMode, selectedExportFormat])

  // 获取参数差异
  const getParameterDifference = useCallback((param1: any, param2: any, key: string) => {
    if (!param1 || !param2) return null
    
    const val1 = param1[key]
    const val2 = param2[key]
    
    if (typeof val1 === 'object' && typeof val2 === 'object') {
      if (val1.min !== undefined && val2.min !== undefined) {
        const diff = ((val1.min - val2.min) / val2.min * 100)
        return parseFloat(diff.toFixed(1))
      }
      if (val1.value !== undefined && val2.value !== undefined) {
        const diff = ((val1.value - val2.value) / val2.value * 100)
        return parseFloat(diff.toFixed(1))
      }
    }
    return null
  }, [])

  // 获取性能差异
  const getPerformanceDifference = useCallback((perf1: any, perf2: any, key: string) => {
    if (!perf1 || !perf2) return null
    
    const val1 = perf1[key]
    const val2 = perf2[key]
    
    if (typeof val1 === 'number' && typeof val2 === 'number') {
      const diff = ((val1 - val2) / val2 * 100)
      return parseFloat(diff.toFixed(1))
    }
    return null
  }, [])

  // 渲染差异指示器
  const renderDifferenceIndicator = useCallback((diff: number | null, isPositiveBetter = true) => {
    if (diff === null || Math.abs(diff) < 0.1) return null
    
    const isPositive = diff > 0
    const isBetter = isPositiveBetter ? isPositive : !isPositive
    
    return (
      <span className={`text-xs ml-2 font-medium ${
        isBetter ? 'text-green-600' : 'text-red-600'
      }`}>
        {isPositive ? '+' : ''}{diff}%
        {isBetter ? 
          <TrendingUp className="w-3 h-3 inline ml-1" /> : 
          <TrendingDown className="w-3 h-3 inline ml-1" />
        }
      </span>
    )
  }, [])

  // 获取状态颜色
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case '已发布':
        return 'bg-green-100 text-green-800 border-green-200'
      case '测试中':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case '草稿':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }, [])

  // 获取RFLP分类颜色
  const getRFLPColor = useCallback((category: string) => {
    switch (category) {
      case 'Requirements':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Functions':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Logical':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'Physical':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">模型对比分析</h1>
          <p className="text-gray-600 mt-1">基于MBSE架构的多维度模型对比与分析工具</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="text-sm">
            已选择 {selectedModels.length}/4 个模型
          </Badge>
          {selectedModels.length > 1 && (
            <Button
              onClick={() => setShowExportDialog(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              导出对比报告
            </Button>
          )}
        </div>
      </div>

      {/* 快速统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <GitCompare className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">对比模型数</p>
                <p className="text-2xl font-semibold">{selectedModels.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">共同参数</p>
                <p className="text-2xl font-semibold">
                  {selectedModelData.length > 1 ? 
                    Object.keys(selectedModelData[0]?.parameters || {}).filter(key =>
                      selectedModelData.every(model => model?.parameters[key])
                    ).length : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">差异指标</p>
                <p className="text-2xl font-semibold">
                  {selectedModelData.length > 1 ? 
                    Object.keys(selectedModelData[0]?.parameters || {}).length - 
                    Object.keys(selectedModelData[0]?.parameters || {}).filter(key =>
                      selectedModelData.every(model => model?.parameters[key])
                    ).length : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Gauge className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">最佳性能</p>
                <p className="text-2xl font-semibold">
                  {selectedModelData.length > 0 ? 
                    Math.max(...selectedModelData.map(m => m?.performance?.accuracy || 0)).toFixed(1) + '%' : '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 模型选择面板 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                可用模型库
              </CardTitle>
              <CardDescription>
                选择要对比的模型（最多4个）
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 搜索和筛选 */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="搜索模型名称、作者或项目..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="模型类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部类型</SelectItem>
                      <SelectItem value="热仿真">热仿真</SelectItem>
                      <SelectItem value="结构仿真">结构仿真</SelectItem>
                      <SelectItem value="性能仿真">性能仿真</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterRFLP} onValueChange={setFilterRFLP}>
                    <SelectTrigger>
                      <SelectValue placeholder="RFLP分类" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部分类</SelectItem>
                      <SelectItem value="Requirements">需求层</SelectItem>
                      <SelectItem value="Functions">功能层</SelectItem>
                      <SelectItem value="Logical">逻辑层</SelectItem>
                      <SelectItem value="Physical">物理层</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 模型列表 */}
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {filteredModels.map((model) => (
                    <div
                      key={model.id}
                      className={`p-3 border rounded-lg transition-all duration-200 ${
                        selectedModels.includes(model.id)
                          ? 'border-blue-500 bg-blue-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm mb-1 truncate">
                            {model.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs mb-2">
                            <Badge variant="outline" className="text-xs">
                              {model.type}
                            </Badge>
                            <Badge className={`text-xs ${getRFLPColor(model.rflpCategory)}`}>
                              {model.rflpCategory}
                            </Badge>
                            <span className="text-gray-500">v{model.version}</span>
                          </div>
                          <div className="space-y-1 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{model.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileImage className="w-3 h-3" />
                              <span>{model.size}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{new Date(model.lastModified).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={selectedModels.includes(model.id) ? "destructive" : "outline"}
                          onClick={() => 
                            selectedModels.includes(model.id)
                              ? handleRemoveModel(model.id)
                              : handleAddModel(model.id)
                          }
                          className="ml-2 flex-shrink-0"
                        >
                          {selectedModels.includes(model.id) ? (
                            <X className="w-3 h-3" />
                          ) : (
                            <Plus className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* 对比结果面板 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  模型对比结果
                </CardTitle>
                {selectedModels.length > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedModels([])
                        toast.info('已清空对比列表')
                      }}
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      清空
                    </Button>
                  </div>
                )}
              </div>
              <CardDescription>
                {selectedModels.length === 0 && '请选择至少2个模型进行对比'}
                {selectedModels.length === 1 && '请再选择至少1个模型进行对比'}
                {selectedModels.length > 1 && `正在对比 ${selectedModels.length} 个模型的多维度特征`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedModels.length < 2 ? (
                <div className="text-center py-12 text-gray-500">
                  <GitCompare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">开始对比模型</p>
                  <p className="text-sm">请从左侧选择至少2个模型进行深度对比分析</p>
                </div>
              ) : (
                <Tabs value={comparisonMode} onValueChange={(value) => setComparisonMode(value as any)}>
                  <TabsList className="grid grid-cols-5 w-full">
                    <TabsTrigger value="parameters" className="text-xs">
                      <Settings className="w-4 h-4 mr-1" />
                      参数对比
                    </TabsTrigger>
                    <TabsTrigger value="performance" className="text-xs">
                      <Activity className="w-4 h-4 mr-1" />
                      性能对比
                    </TabsTrigger>
                    <TabsTrigger value="structure" className="text-xs">
                      <Layers className="w-4 h-4 mr-1" />
                      结构对比
                    </TabsTrigger>
                    <TabsTrigger value="metadata" className="text-xs">
                      <Database className="w-4 h-4 mr-1" />
                      元数据
                    </TabsTrigger>
                    <TabsTrigger value="code" className="text-xs">
                      <Code className="w-4 h-4 mr-1" />
                      代码对比
                    </TabsTrigger>
                  </TabsList>

                  {/* 参数对比 */}
                  <TabsContent value="parameters" className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                      <ScrollArea className="h-96">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="text-left p-3 text-sm font-medium text-gray-900 sticky top-0 bg-gray-50">
                                参数名称
                              </th>
                              {selectedModelData.map((model, index) => (
                                <th key={model?.id} className="text-left p-3 text-sm font-medium text-gray-900 sticky top-0 bg-gray-50">
                                  <div className="flex flex-col">
                                    <span className="truncate max-w-32" title={model?.name}>
                                      {model?.name}
                                    </span>
                                    <span className="text-xs text-gray-500 font-normal">
                                      v{model?.version}
                                    </span>
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {Object.keys(selectedModelData[0]?.parameters || {}).map((paramKey) => (
                              <tr key={paramKey} className="hover:bg-gray-50">
                                <td className="p-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0">
                                  <div className="flex flex-col">
                                    <span>{paramKey}</span>
                                    <span className="text-xs text-gray-500 font-normal">
                                      {selectedModelData[0]?.parameters[paramKey]?.description}
                                    </span>
                                  </div>
                                </td>
                                {selectedModelData.map((model, index) => {
                                  const param = model?.parameters[paramKey]
                                  const baseParam = selectedModelData[0]?.parameters[paramKey]
                                  const diff = index > 0 ? getParameterDifference(param, baseParam, 'value') || getParameterDifference(param, baseParam, 'min') : null
                                  
                                  return (
                                    <td key={`${model?.id}-${paramKey}`} className="p-3 text-sm text-gray-900">
                                      {param ? (
                                        <div className="space-y-1">
                                          {param.min !== undefined ? (
                                            <div className="flex items-center">
                                              <span>{param.min} - {param.max}</span>
                                              <span className="text-xs text-gray-500 ml-1">{param.unit}</span>
                                              {renderDifferenceIndicator(diff)}
                                            </div>
                                          ) : param.value !== undefined ? (
                                            <div className="flex items-center">
                                              <span>{param.value}</span>
                                              <span className="text-xs text-gray-500 ml-1">{param.unit}</span>
                                              {renderDifferenceIndicator(diff)}
                                            </div>
                                          ) : (
                                            <span className="text-gray-400">-</span>
                                          )}
                                        </div>
                                      ) : (
                                        <span className="text-gray-400">-</span>
                                      )}
                                    </td>
                                  )
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  {/* 性能对比 */}
                  <TabsContent value="performance" className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                      <ScrollArea className="h-96">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="text-left p-3 text-sm font-medium text-gray-900 sticky top-0 bg-gray-50">
                                性能指标
                              </th>
                              {selectedModelData.map((model) => (
                                <th key={model?.id} className="text-left p-3 text-sm font-medium text-gray-900 sticky top-0 bg-gray-50">
                                  <div className="flex flex-col">
                                    <span className="truncate max-w-32" title={model?.name}>
                                      {model?.name}
                                    </span>
                                    <span className="text-xs text-gray-500 font-normal">
                                      v{model?.version}
                                    </span>
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {Object.keys(selectedModelData[0]?.performance || {}).map((perfKey) => (
                              <tr key={perfKey} className="hover:bg-gray-50">
                                <td className="p-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0">
                                  {perfKey === 'accuracy' && '精度 (%)'}
                                  {perfKey === 'convergenceTime' && '收敛时间 (s)'}
                                  {perfKey === 'memoryUsage' && '内存使用 (MB)'}
                                  {perfKey === 'cpuLoad' && 'CPU占用 (%)'}
                                  {perfKey === 'stability' && '稳定性'}
                                  {perfKey === 'reliability' && '可靠性 (%)'}
                                </td>
                                {selectedModelData.map((model, index) => {
                                  const perfValue = model?.performance[perfKey]
                                  const baseValue = selectedModelData[0]?.performance[perfKey]
                                  const diff = index > 0 ? getPerformanceDifference(model?.performance, selectedModelData[0]?.performance, perfKey) : null
                                  const isPositiveBetter = !['convergenceTime', 'memoryUsage', 'cpuLoad'].includes(perfKey)
                                  
                                  return (
                                    <td key={`${model?.id}-${perfKey}`} className="p-3 text-sm text-gray-900">
                                      <div className="flex items-center">
                                        <span>{typeof perfValue === 'number' ? perfValue.toFixed(1) : perfValue}</span>
                                        {typeof perfValue === 'number' && ['accuracy', 'reliability'].includes(perfKey) && (
                                          <span className="text-xs text-gray-500 ml-1">%</span>
                                        )}
                                        {typeof perfValue === 'number' && perfKey === 'convergenceTime' && (
                                          <span className="text-xs text-gray-500 ml-1">s</span>
                                        )}
                                        {typeof perfValue === 'number' && perfKey === 'memoryUsage' && (
                                          <span className="text-xs text-gray-500 ml-1">MB</span>
                                        )}
                                        {typeof perfValue === 'number' && perfKey === 'cpuLoad' && (
                                          <span className="text-xs text-gray-500 ml-1">%</span>
                                        )}
                                        {renderDifferenceIndicator(diff, isPositiveBetter)}
                                      </div>
                                    </td>
                                  )
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  {/* 结构对比 */}
                  <TabsContent value="structure" className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                      <ScrollArea className="h-96">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="text-left p-3 text-sm font-medium text-gray-900 sticky top-0 bg-gray-50">
                                结构特征
                              </th>
                              {selectedModelData.map((model) => (
                                <th key={model?.id} className="text-left p-3 text-sm font-medium text-gray-900 sticky top-0 bg-gray-50">
                                  <div className="flex flex-col">
                                    <span className="truncate max-w-32" title={model?.name}>
                                      {model?.name}
                                    </span>
                                    <span className="text-xs text-gray-500 font-normal">
                                      v{model?.version}
                                    </span>
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {Object.keys(selectedModelData[0]?.structure || {}).map((structKey) => (
                              <tr key={structKey} className="hover:bg-gray-50">
                                <td className="p-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0">
                                  {structKey === 'nodeCount' && '节点数量'}
                                  {structKey === 'connectionCount' && '连接数量'}
                                  {structKey === 'fileSize' && '文件大小'}
                                  {structKey === 'complexity' && '复杂度'}
                                  {structKey === 'maintainability' && '可维护性'}
                                </td>
                                {selectedModelData.map((model) => {
                                  const structValue = model?.structure[structKey]
                                  
                                  return (
                                    <td key={`${model?.id}-${structKey}`} className="p-3 text-sm text-gray-900">
                                      <span>{typeof structValue === 'number' ? structValue.toLocaleString() : structValue}</span>
                                    </td>
                                  )
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  {/* 元数据对比 */}
                  <TabsContent value="metadata" className="space-y-4">
                    <div className="border rounded-lg overflow-hidden">
                      <ScrollArea className="h-96">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b">
                            <tr>
                              <th className="text-left p-3 text-sm font-medium text-gray-900 sticky top-0 bg-gray-50">
                                元数据项
                              </th>
                              {selectedModelData.map((model) => (
                                <th key={model?.id} className="text-left p-3 text-sm font-medium text-gray-900 sticky top-0 bg-gray-50">
                                  <div className="flex flex-col">
                                    <span className="truncate max-w-32" title={model?.name}>
                                      {model?.name}
                                    </span>
                                    <span className="text-xs text-gray-500 font-normal">
                                      v{model?.version}
                                    </span>
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                              <td className="p-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0">
                                工具版本
                              </td>
                              {selectedModelData.map((model) => (
                                <td key={`${model?.id}-toolVersion`} className="p-3 text-sm text-gray-900">
                                  {model?.metadata?.toolVersion}
                                </td>
                              ))}
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="p-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0">
                                依赖库
                              </td>
                              {selectedModelData.map((model) => (
                                <td key={`${model?.id}-dependencies`} className="p-3 text-sm text-gray-900">
                                  <div className="space-y-1">
                                    {model?.metadata?.dependencies?.map((dep, index) => (
                                      <Badge key={index} variant="outline" className="text-xs mr-1">
                                        {dep}
                                      </Badge>
                                    ))}
                                  </div>
                                </td>
                              ))}
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="p-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0">
                                最后测试时间
                              </td>
                              {selectedModelData.map((model) => (
                                <td key={`${model?.id}-lastTested`} className="p-3 text-sm text-gray-900">
                                  {model?.metadata?.lastTested}
                                </td>
                              ))}
                            </tr>
                            <tr className="hover:bg-gray-50">
                              <td className="p-3 text-sm font-medium text-gray-900 bg-gray-50 sticky left-0">
                                测试覆盖率
                              </td>
                              {selectedModelData.map((model) => (
                                <td key={`${model?.id}-testCoverage`} className="p-3 text-sm text-gray-900">
                                  <div className="flex items-center space-x-2">
                                    <span>{model?.metadata?.testCoverage}%</span>
                                    <Progress value={model?.metadata?.testCoverage} className="w-16 h-2" />
                                  </div>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  {/* 代码对比 */}
                  <TabsContent value="code" className="space-y-4">
                    <div className="space-y-4">
                      {/* 代码统计信息 */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-center">
                              <div className="text-center">
                                <p className="text-lg font-semibold text-blue-600">
                                  {selectedModelData.filter(m => m?.codeType === 'SysML').length}
                                </p>
                                <p className="text-xs text-gray-600">SysML模型</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-center">
                              <div className="text-center">
                                <p className="text-lg font-semibold text-green-600">
                                  {selectedModelData.filter(m => m?.codeType === 'Modelica').length}
                                </p>
                                <p className="text-xs text-gray-600">Modelica模型</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-center">
                              <div className="text-center">
                                <p className="text-lg font-semibold text-purple-600">
                                  {selectedModelData.reduce((total, m) => 
                                    total + (m?.codeContent?.split('\n').length || 0), 0
                                  )}
                                </p>
                                <p className="text-xs text-gray-600">总代码行数</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-center">
                              <div className="text-center">
                                <p className="text-lg font-semibold text-orange-600">
                                  {Math.round(selectedModelData.reduce((total, m) => 
                                    total + (m?.codeContent?.length || 0), 0
                                  ) / 1024)}
                                </p>
                                <p className="text-xs text-gray-600">代码大小 (KB)</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* 代码对比内容 */}
                      <div className="space-y-4">
                        {selectedModelData.map((model, index) => (
                          <Card key={model?.id}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <Badge className={`${getRFLPColor(model?.rflpCategory || '')}`}>
                                    {model?.rflpCategory}
                                  </Badge>
                                  <CardTitle className="text-lg">{model?.name}</CardTitle>
                                  <Badge variant="outline">{model?.codeType}</Badge>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      navigator.clipboard.writeText(model?.codeContent || '')
                                      toast.success('代码已复制到剪贴板')
                                    }}
                                  >
                                    <Copy className="w-4 h-4 mr-1" />
                                    复制
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleCodeSection(`code-${model?.id}`)}
                                  >
                                    {collapsedCodeSections[`code-${model?.id}`] ? (
                                      <>
                                        <ChevronDown className="w-4 h-4 mr-1" />
                                        展开
                                      </>
                                    ) : (
                                      <>
                                        <ChevronUp className="w-4 h-4 mr-1" />
                                        折叠
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>版本: {model?.version}</span>
                                <span>作者: {model?.author}</span>
                                <span>行数: {model?.codeContent?.split('\n').length || 0}</span>
                                <span>大小: {Math.round((model?.codeContent?.length || 0) / 1024)}KB</span>
                              </div>
                            </CardHeader>
                            
                            {!collapsedCodeSections[`code-${model?.id}`] && (
                              <CardContent>
                                <div className="relative">
                                  <pre className="bg-gray-50 border rounded-lg p-4 text-xs overflow-x-auto max-h-96 font-mono">
                                    <code className="text-gray-800">
                                      {model?.codeContent || '暂无代码内容'}
                                    </code>
                                  </pre>
                                </div>
                              </CardContent>
                            )}
                          </Card>
                        ))}
                      </div>

                      {/* 代码差异摘要 */}
                      {selectedModelData.length > 1 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Split className="w-5 h-5" />
                              代码差异摘要
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <span className="text-sm font-medium">代码类型差异</span>
                                <div className="flex space-x-2">
                                  {Array.from(new Set(selectedModelData.map(m => m?.codeType))).map(type => (
                                    <Badge key={type} variant="outline">{type}</Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <span className="text-sm font-medium">代码行数范围</span>
                                <span className="text-sm">
                                  {Math.min(...selectedModelData.map(m => m?.codeContent?.split('\n').length || 0))} - {' '}
                                  {Math.max(...selectedModelData.map(m => m?.codeContent?.split('\n').length || 0))} 行
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                <span className="text-sm font-medium">大小差异</span>
                                <span className="text-sm">
                                  {Math.min(...selectedModelData.map(m => Math.round((m?.codeContent?.length || 0) / 1024)))} - {' '}
                                  {Math.max(...selectedModelData.map(m => Math.round((m?.codeContent?.length || 0) / 1024)))} KB
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 导出对话框 */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>导出对比报告</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">选择导出格式</label>
              <Select value={selectedExportFormat} onValueChange={setSelectedExportFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择格式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF 报告</SelectItem>
                  <SelectItem value="excel">Excel 表格</SelectItem>
                  <SelectItem value="json">JSON 数据</SelectItem>
                  <SelectItem value="csv">CSV 数据</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>导出内容将包括：</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>选中的 {selectedModels.length} 个模型的详细信息</li>
                <li>当前对比模式：{comparisonMode === 'parameters' ? '参数对比' : 
                                comparisonMode === 'performance' ? '性能对比' :
                                comparisonMode === 'structure' ? '结构对比' :
                                comparisonMode === 'metadata' ? '元数据对比' : '代码对比'}</li>
                <li>差异分析和统计信息</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              取消
            </Button>
            <Button 
              onClick={() => handleExportComparison(selectedExportFormat)}
              disabled={isExporting || !selectedExportFormat}
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  导出中...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  导出
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}