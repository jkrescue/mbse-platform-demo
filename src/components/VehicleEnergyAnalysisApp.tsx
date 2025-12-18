import { useState } from "react"
import { ChevronLeft, Download, Heart, Eye, Calendar, User, Edit, Activity, Gauge, Car, RotateCcw, Thermometer, CheckCircle, XCircle, GitBranch, Zap, TrendingUp, Wind, Sun, Battery } from "lucide-react@0.487.0"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Card } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Label } from "./ui/label"
import { Slider } from "./ui/slider"
import { Progress } from "./ui/progress"
import { TraceabilityVisualization } from "./TraceabilityVisualization"


interface VehicleEnergyAnalysisAppProps {
  onBack: () => void
  onOpenWorkflow?: () => void
  userRole?: string
}

// 系统架构数据 - 整车能耗相关
const systemArchitectureData = [
  { component: "车辆动力学", connections: 10, complexity: 88, criticality: "高" },
  { component: "驱动系统", connections: 8, complexity: 85, criticality: "高" },
  { component: "电池系统", connections: 7, complexity: 82, criticality: "高" },
  { component: "热管理系统", connections: 6, complexity: 78, criticality: "中" },
  { component: "制动能量回收", connections: 5, complexity: 75, criticality: "中" },
]

// 仿真配置参数 - 整车能耗场景
const simulationConfig = {
  drivingCycle: "NEDC",
  vehicleMass: 1850,
  ambientTemp: 25,
  roadGradient: 0,
  windSpeed: 5,
  initialSOC: 90,
}

// 实时能耗数据
const realtimeEnergyData = [
  { time: "0", totalPower: 52, motorPower: 45, auxPower: 7, speed: 0, soc: 90 },
  { time: "200", totalPower: 68, motorPower: 58, auxPower: 10, speed: 35, soc: 88 },
  { time: "400", totalPower: 85, motorPower: 72, auxPower: 13, speed: 50, soc: 85 },
  { time: "600", totalPower: 45, motorPower: 38, auxPower: 7, speed: 25, soc: 83 },
  { time: "800", totalPower: 95, motorPower: 82, auxPower: 13, speed: 70, soc: 79 },
  { time: "1000", totalPower: 38, motorPower: 30, auxPower: 8, speed: 15, soc: 77 },
]

// 能量流分布数据
const energyFlowData = [
  { name: "驱动电机", value: 78.5, color: "#3b82f6" },
  { name: "空调系统", value: 8.2, color: "#10b981" },
  { name: "车载电器", value: 4.3, color: "#f59e0b" },
  { name: "热管理", value: 6.8, color: "#ef4444" },
  { name: "能量回收", value: -12.5, color: "#8b5cf6" },
]

// 系统性能指标 - 初始值
const initialPerformanceMetrics = {
  overallEfficiency: 88.5,
  rangeRemaining: 478,
  energyConsumption: 15.2,
  thermalBalance: 91.3,
  systemHealth: 95.8,
  complianceScore: 92.7,
}

// 历史场景数据
const historicalScenarios = [
  { id: 1, name: "NEDC工况", efficiency: 88.5, range: 478, consumption: 15.2, status: "合格", date: "2025-12-10" },
  { id: 2, name: "WLTP工况", efficiency: 85.3, range: 445, consumption: 16.8, status: "合格", date: "2025-12-09" },
  { id: 3, name: "CLTC工况", efficiency: 90.1, range: 495, consumption: 14.5, status: "合格", date: "2025-12-08" },
  { id: 4, name: "高速120km/h", efficiency: 78.2, range: 385, consumption: 19.2, status: "不合格", date: "2025-12-07" },
  { id: 5, name: "爬坡工况", efficiency: 72.5, range: 348, consumption: 21.8, status: "不合格", date: "2025-12-06" },
]

// 多维度能耗分析
const multiDimensionData = [
  { dimension: "驱动效率", value: 92, fullMark: 100 },
  { dimension: "能量回收", value: 85, fullMark: 100 },
  { dimension: "热管理", value: 88, fullMark: 100 },
  { dimension: "轻量化", value: 78, fullMark: 100 },
  { dimension: "空气动力", value: 82, fullMark: 100 },
  { dimension: "滚阻优化", value: 86, fullMark: 100 },
]

// 需求追溯数据
const traceabilityData = [
  { requirement: "REQ-E001", element: "整车能耗目标", status: "已验证", coverage: 92 },
  { requirement: "REQ-E002", element: "续航里程要求", status: "已验证", coverage: 95 },
  { requirement: "REQ-E003", element: "能量回收效率", status: "部分验证", coverage: 78 },
  { requirement: "REQ-E004", element: "热管理策略", status: "已验证", coverage: 88 },
  { requirement: "REQ-E005", element: "低温性能", status: "待验证", coverage: 65 },
]

export function VehicleEnergyAnalysisApp({ onBack, onOpenWorkflow, userRole }: VehicleEnergyAnalysisAppProps) {
  const [activeTab, setActiveTab] = useState("architecture")
  const [configValues, setConfigValues] = useState(simulationConfig)
  
  // 仿真相关状态
  const [performanceMetrics, setPerformanceMetrics] = useState(initialPerformanceMetrics)
  const [isReSimulating, setIsReSimulating] = useState(false)
  const [reSimulationProgress, setReSimulationProgress] = useState(0)

  const isCompliant = performanceMetrics.complianceScore >= 90

  // 重新仿真处理函数
  const handleReSimulate = () => {
    setIsReSimulating(true)
    setReSimulationProgress(0)
    
    // 模拟仿真进度
    const progressInterval = setInterval(() => {
      setReSimulationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          
          // 仿真完成，生成新的随机指标
          setTimeout(() => {
            const newMetrics = {
              overallEfficiency: +(85 + Math.random() * 8).toFixed(1),
              rangeRemaining: Math.floor(420 + Math.random() * 100),
              energyConsumption: +(14 + Math.random() * 4).toFixed(1),
              thermalBalance: +(88 + Math.random() * 8).toFixed(1),
              systemHealth: +(94 + Math.random() * 5).toFixed(1),
              complianceScore: +(88 + Math.random() * 10).toFixed(1),
            }
            setPerformanceMetrics(newMetrics)
            setIsReSimulating(false)
            setReSimulationProgress(0)
          }, 500)
          
          return 100
        }
        return prev + 2
      })
    }, 100)
  }

  return (
    <div className="space-y-6 p-6">
      {/* 面包屑导航 */}
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                href="#" 
                onClick={(e) => {
                  e.preventDefault()
                  onBack()
                }}
                className="flex items-center"
              >
                应用中心
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>整车能耗分析</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          返回
        </Button>
      </div>

      {/* 应用基本信息 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center text-white text-2xl">
              ⚡
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-semibold">整能耗分析</h1>
                <Badge variant="secondary">v1.5.0</Badge>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  已发布
                </Badge>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                电动汽车整车能耗分析与优化平台，涵盖车辆动力学、驱动系统、电池系统、热管理等全链路能量流仿真。
                支持多工况循环测试、能耗分解分析和续航预测，符合国标GB/T 18386标准。
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  系统工程师
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  2025年7月发布
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  856 次查看
                </div>
                <div className="flex items-center">
                  <Download className="w-4 h-4 mr-1" />
                  342 次下载
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Heart className="w-4 h-4 mr-2" />
              收藏
            </Button>
            <Button variant="outline" onClick={onOpenWorkflow}>
              <Edit className="w-4 h-4 mr-2" />
              打开工作流
            </Button>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              下载应用
            </Button>
          </div>
        </div>
      </div>

      {/* 系统状态总览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">仿真车型</p>
              <p className="text-xl font-semibold mt-1">45</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">综合效率</p>
              <p className="text-xl font-semibold mt-1">{performanceMetrics.overallEfficiency}%</p>
            </div>
            <Gauge className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">续航里程</p>
              <p className="text-xl font-semibold mt-1">{performanceMetrics.rangeRemaining}km</p>
            </div>
            <Car className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">百公里能耗</p>
              <p className="text-xl font-semibold mt-1">{performanceMetrics.energyConsumption}kWh</p>
            </div>
            <Zap className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">热平衡</p>
              <p className="text-xl font-semibold mt-1">{performanceMetrics.thermalBalance}%</p>
            </div>
            <Thermometer className="w-8 h-8 text-red-600" />
          </div>
        </Card>
        
        <Card className={`p-4 ${isCompliant ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">合规性</p>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-xl font-semibold">{performanceMetrics.complianceScore}%</p>
                {isCompliant ? 
                  <CheckCircle className="w-5 h-5 text-green-600" /> : 
                  <XCircle className="w-5 h-5 text-red-600" />
                }
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 主要功能区域 */}
      <div className="bg-white rounded-xl border border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 m-6 mb-0">
            <TabsTrigger value="architecture">系统架构</TabsTrigger>
            <TabsTrigger value="simulation">仿真配置</TabsTrigger>
            <TabsTrigger value="dashboard">实时监控</TabsTrigger>
            <TabsTrigger value="history">历史对比</TabsTrigger>
            <TabsTrigger value="traceability">需求追溯</TabsTrigger>
          </TabsList>
          
          {/* 系统架构总览 */}
          <TabsContent value="architecture" className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 左侧：架构图 */}
              <div>
                <div className="mb-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <GitBranch className="w-5 h-5 mr-2" />
                    整车能耗系统架构图
                  </h3>
                  <p className="text-sm text-gray-600">
                    展示整车能耗分析系统的主要组件及其相互关系
                  </p>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <img 
                    src="https://images.pexels.com/photos/35155776/pexels-photo-35155776.png" 
                    alt="整车能耗系统架构" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">架构说明</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 车辆动力学模型：车身质量、风阻、滚阻、坡度</li>
                    <li>• 驱动系统：电机、减速器、传动效率</li>
                    <li>• 电池系统：SOC管理、充放电特性、温度影响</li>
                    <li>• 热管理：电池热管理、电机冷却、空调能耗</li>
                    <li>• 能量回收：制动能量回收、滑行能量回收</li>
                  </ul>
                </div>
              </div>

              {/* 右侧：组件详情表格 */}
              <div>
                <h3 className="font-medium mb-4">系统组件清单</h3>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">组件名称</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">连接数</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">复杂度</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">关键性</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {systemArchitectureData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{item.component}</td>
                          <td className="px-4 py-3 text-sm">{item.connections}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${item.complexity}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600">{item.complexity}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={item.criticality === "高" ? "destructive" : "secondary"}>
                              {item.criticality}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 能量流分布 */}
                <div className="mt-6">
                  <h3 className="font-medium mb-4">能量流分布</h3>
                  <div className="space-y-3">
                    {energyFlowData.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-700">{item.name}</span>
                          <span className="text-sm font-medium" style={{ color: item.color }}>
                            {item.value > 0 ? '+' : ''}{item.value}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${Math.abs(item.value) * 1.2}%`,
                              backgroundColor: item.color
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 仿真配置 */}
          <TabsContent value="simulation" className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 左侧：配置参数 */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">仿真工况配置</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="drivingCycle">行驶循环</Label>
                      <Select 
                        value={configValues.drivingCycle}
                        onValueChange={(value) => setConfigValues({...configValues, drivingCycle: value})}
                      >
                        <SelectTrigger id="drivingCycle">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEDC">NEDC (欧洲)</SelectItem>
                          <SelectItem value="WLTP">WLTP (全球)</SelectItem>
                          <SelectItem value="CLTC">CLTC (中国)</SelectItem>
                          <SelectItem value="EPA">EPA (美国)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>整车质量: {configValues.vehicleMass} kg</Label>
                      <Slider 
                        value={[configValues.vehicleMass]}
                        onValueChange={(value) => setConfigValues({...configValues, vehicleMass: value[0]})}
                        min={1500}
                        max={2500}
                        step={50}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>环境温度: {configValues.ambientTemp}°C</Label>
                      <Slider 
                        value={[configValues.ambientTemp]}
                        onValueChange={(value) => setConfigValues({...configValues, ambientTemp: value[0]})}
                        min={-20}
                        max={45}
                        step={5}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>道路坡度: {configValues.roadGradient}%</Label>
                      <Slider 
                        value={[configValues.roadGradient]}
                        onValueChange={(value) => setConfigValues({...configValues, roadGradient: value[0]})}
                        min={-10}
                        max={10}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>侧风风速: {configValues.windSpeed} m/s</Label>
                      <Slider 
                        value={[configValues.windSpeed]}
                        onValueChange={(value) => setConfigValues({...configValues, windSpeed: value[0]})}
                        min={0}
                        max={20}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>初始SOC: {configValues.initialSOC}%</Label>
                      <Slider 
                        value={[configValues.initialSOC]}
                        onValueChange={(value) => setConfigValues({...configValues, initialSOC: value[0]})}
                        min={20}
                        max={100}
                        step={5}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleReSimulate}
                  disabled={isReSimulating}
                >
                  {isReSimulating ? "仿真运行中..." : "开始仿真"}
                </Button>

                {isReSimulating && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">仿真进度</span>
                      <span className="font-medium">{reSimulationProgress}%</span>
                    </div>
                    <Progress value={reSimulationProgress} />
                  </div>
                )}
              </div>

              {/* 右侧：多维度能耗分析 */}
              <div>
                <h3 className="font-medium mb-4">多维度能耗分析</h3>
                <div className="border border-gray-200 rounded-lg p-4 h-96 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={multiDimensionData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="dimension" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar 
                        name="性能指标" 
                        dataKey="value" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.6} 
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  {multiDimensionData.map((item, index) => (
                    <Card key={index} className="p-4">
                      <p className="text-sm text-gray-600 mb-1">{item.dimension}</p>
                      <p className="text-xl font-semibold">{item.value}分</p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 实时监控 */}
          <TabsContent value="dashboard" className="p-6">
            <div className="space-y-6">
              {/* 实时能耗趋势 */}
              <div>
                <h3 className="font-medium mb-4">实时能耗监控</h3>
                <div className="border border-gray-200 rounded-lg p-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={realtimeEnergyData}>
                      <defs>
                        <linearGradient id="totalPower" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="motorPower" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" label={{ value: '时间(s)', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: '功率(kW)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="totalPower" 
                        stroke="#3b82f6" 
                        fillOpacity={1} 
                        fill="url(#totalPower)" 
                        name="总功率"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="motorPower" 
                        stroke="#10b981" 
                        fillOpacity={1} 
                        fill="url(#motorPower)" 
                        name="电机功率"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 车速与SOC曲线 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">车速曲线</h3>
                  <div className="border border-gray-200 rounded-lg p-4 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={realtimeEnergyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="speed" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          name="车速(km/h)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">SOC变化</h3>
                  <div className="border border-gray-200 rounded-lg p-4 h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={realtimeEnergyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis domain={[70, 95]} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="soc" 
                          stroke="#8b5cf6" 
                          strokeWidth={2}
                          name="SOC(%)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 历史对比 */}
          <TabsContent value="history" className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">历史工况对比分析</h3>
                <Button variant="outline" size="sm">
                  导出报告
                </Button>
              </div>

              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">工况名称</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">综合效率</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">续航里程</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">百公里能耗</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">测试日期</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {historicalScenarios.map((scenario) => (
                      <tr key={scenario.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">{scenario.name}</td>
                        <td className="px-4 py-3 text-sm">{scenario.efficiency}%</td>
                        <td className="px-4 py-3 text-sm">{scenario.range} km</td>
                        <td className="px-4 py-3 text-sm">{scenario.consumption} kWh</td>
                        <td className="px-4 py-3">
                          <Badge variant={scenario.status === "合格" ? "default" : "destructive"}>
                            {scenario.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{scenario.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 历史趋势对比图 */}
              <div>
                <h3 className="font-medium mb-4">工况效率对比</h3>
                <div className="border border-gray-200 rounded-lg p-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={historicalScenarios}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="efficiency" fill="#3b82f6" name="效率(%)" />
                      <Bar dataKey="consumption" fill="#f59e0b" name="能耗(kWh)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 需求追溯 */}
          <TabsContent value="traceability" className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">需求追溯可视化</h3>
                <p className="text-sm text-gray-600 mb-4">
                  基于SysML的需求-设计-验证追溯关系，确保所有能耗指标需求得到完整验证
                </p>
              </div>

              <TraceabilityVisualization />

              <div className="mt-6">
                <h3 className="font-medium mb-4">需求验证状态</h3>
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">需求ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">需求要素</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">验证状态</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">覆盖率</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {traceabilityData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-mono">{item.requirement}</td>
                          <td className="px-4 py-3 text-sm">{item.element}</td>
                          <td className="px-4 py-3">
                            <Badge 
                              variant={
                                item.status === "已验证" ? "default" : 
                                item.status === "部分验证" ? "secondary" : 
                                "outline"
                              }
                            >
                              {item.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-2">
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    item.coverage >= 90 ? 'bg-green-600' :
                                    item.coverage >= 70 ? 'bg-yellow-600' :
                                    'bg-red-600'
                                  }`}
                                  style={{ width: `${item.coverage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-12">{item.coverage}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}