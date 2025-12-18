import { useState } from "react"
import { ChevronLeft, Download, Heart, Eye, Calendar, User, Star, Settings, PlayCircle, Activity, Battery, Gauge, TrendingUp, Zap, Thermometer, RotateCcw, CheckCircle, XCircle, FileText, Share2, Layers, GitBranch, Cpu, Car, Wind, Sun, Edit } from "lucide-react@0.487.0"
import sysmlArchitectureImage from "figma:asset/62f5dbffb7220e54012b9f148616d7a0e8f3998a.png"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Card } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, RadialBarChart, RadialBar, PieChart, Pie, Cell } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Slider } from "./ui/slider"
import { Switch } from "./ui/switch"
import { Progress } from "./ui/progress"
import { TraceabilityVisualization } from "./TraceabilityVisualization"

interface AppDetailProps {
  app: any
  onBack: () => void
  onOpenWorkflow?: () => void
}

// MBSE系统架构数据
const systemArchitectureData = [
  { component: "EMS控制器", connections: 8, complexity: 85, criticality: "高" },
  { component: "BMS电池管理", connections: 6, complexity: 78, criticality: "高" },
  { component: "TMS热管理", connections: 5, complexity: 72, criticality: "中" },
  { component: "VCU整车控制", connections: 12, complexity: 92, criticality: "高" },
  { component: "HVAC空调系统", connections: 4, complexity: 65, criticality: "中" },
]

// 仿真配置参数
const simulationConfig = {
  drivingScenario: "城市综合",
  ambientTemp: 25,
  targetTemp: 22,
  initialSOC: 80,
  drivingStyle: "经济",
  regenEfficiency: 85,
}

// 实时仿真数据
const realtimeData = [
  { time: "00:00", motorPower: 45, hvacPower: 8, batteryTemp: 28, soc: 80, efficiency: 87 },
  { time: "00:05", motorPower: 52, hvacPower: 12, batteryTemp: 29, soc: 79, efficiency: 84 },
  { time: "00:10", motorPower: 38, hvacPower: 15, batteryTemp: 31, soc: 78, efficiency: 89 },
  { time: "00:15", motorPower: 48, hvacPower: 10, batteryTemp: 30, soc: 77, efficiency: 86 },
  { time: "00:20", motorPower: 42, hvacPower: 9, batteryTemp: 29, soc: 76, efficiency: 88 },
]

// 系统性能指标 - 初始值
const initialPerformanceMetrics = {
  overallEfficiency: 87.2,
  rangeRemaining: 456,
  regenRecovery: 23.5,
  thermalBalance: 92.8,
  systemHealth: 96.5,
  complianceScore: 94.2,
}

// 历史场景数据
const historicalScenarios = [
  { id: 1, name: "城市拥堵工况", efficiency: 82.5, range: 420, status: "合格", date: "2024-03-15" },
  { id: 2, name: "高速巡航工况", efficiency: 89.3, range: 485, status: "合格", date: "2024-03-14" },
  { id: 3, name: "山路驾驶工况", efficiency: 78.1, range: 365, status: "不合格", date: "2024-03-13" },
  { id: 4, name: "极寒环境工况", efficiency: 71.2, range: 325, status: "不合格", date: "2024-03-12" },
]

// SysML追溯数据
const traceabilityData = [
  { requirement: "REQ-001", element: "电池SOC管理", status: "已验证", coverage: 95 },
  { requirement: "REQ-002", element: "热管理策略", status: "部分验证", coverage: 78 },
  { requirement: "REQ-003", element: "能量回收效率", status: "已验证", coverage: 92 },
  { requirement: "REQ-004", element: "安全阈值监控", status: "已验证", coverage: 88 },
]

const COLORS = ['#0ea5e9', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444']

export function AppDetail({ app, onBack, onOpenWorkflow }: AppDetailProps) {
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
              rangeRemaining: Math.floor(400 + Math.random() * 100),
              regenRecovery: +(20 + Math.random() * 8).toFixed(1),
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
    <div className="space-y-6">
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
              <BreadcrumbPage>新能源汽车能量管理系统</BreadcrumbPage>
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
            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl">
              🔋
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-semibold">新能源汽车能量管理系统</h1>
                <Badge variant="secondary">v2.1.0</Badge>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  已发布
                </Badge>
              </div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                基于MBSE方法论的新能源汽车能量管理系统，采用SysML建模语言构建系统架构（BDD/IBD），
                集成EMS、BMS、TMS等关键控制模块，支持多工况仿真验证、参数优化和需求追溯。
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  jkzhang
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  2024年3月发布
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  1,247 次查看
                </div>
                <div className="flex items-center">
                  <Download className="w-4 h-4 mr-1" />
                  523 次下载
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
              <p className="text-sm text-gray-600">在线车辆</p>
              <p className="text-xl font-semibold mt-1">3,247</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">系统能效</p>
              <p className="text-xl font-semibold mt-1">{performanceMetrics.overallEfficiency}%</p>
            </div>
            <Gauge className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">续航预测</p>
              <p className="text-xl font-semibold mt-1">{performanceMetrics.rangeRemaining}km</p>
            </div>
            <Car className="w-8 h-8 text-orange-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">回收效率</p>
              <p className="text-xl font-semibold mt-1">{performanceMetrics.regenRecovery}%</p>
            </div>
            <RotateCcw className="w-8 h-8 text-purple-600" />
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
              {/* 左侧：SysML架构图 */}
              <div>
                <div className="mb-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <GitBranch className="w-5 h-5 mr-2" />
                    SysML 架构图 (Internal Block Diagram)
                  </h3>
                  <p className="text-sm text-gray-600">汽车传动系统能量管理IBD模型</p>
                </div>
                <Card className="p-4">
                  <div className="w-full flex justify-center">
                    <img 
                      src={sysmlArchitectureImage} 
                      alt="SysML Architecture Diagram" 
                      className="max-w-full h-auto rounded-lg border border-gray-200"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p>该IBD图展示了汽车传动系统的关键组件及其能量流关系，包括：</p>
                    <ul className="mt-2 space-y-1 ml-4">
                      <li>• <strong>GearShift</strong>: 变速器控制组件</li>
                      <li>• <strong>TCU</strong>: 传动控制单元 (Transmission Control Unit)</li>
                      <li>• <strong>ECU</strong>: 发动机控制单元 (Engine Control Unit)</li>
                      <li>• <strong>GearBox</strong>: 变速箱组件</li>
                      <li>• 各种传感器与仪表显示组件的数据流连接</li>
                    </ul>
                  </div>
                </Card>
              </div>
              
              {/* 右侧：系统组件关键性评估 */}
              <div>
                <div className="mb-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Layers className="w-5 h-5 mr-2" />
                    系统组件关键性评估
                  </h3>
                  <p className="text-sm text-gray-600">基于SysML模型的组件重要性分析</p>
                </div>
                <div className="space-y-4">
                  {systemArchitectureData.map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{item.component}</span>
                        <Badge variant={item.criticality === "高" ? "destructive" : "secondary"}>
                          {item.criticality}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>连接数</span>
                          <span>{item.connections}</span>
                        </div>
                        <Progress value={item.complexity} className="h-2" />
                        <div className="text-xs text-gray-500">复杂度: {item.complexity}%</div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Card className="p-4 mt-6 bg-blue-50 border-blue-200">
                  <h4 className="font-medium mb-2 text-blue-800">架构分析总结</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div>• VCU整车控制器具有最高的系统复杂度和连接数</div>
                    <div>• EMS和BMS作为核心控制模块，关键性评级为高</div>
                    <div>• 系统组件间的耦合度适中，便于模块化设计</div>
                    <div>• 建议优先对高关键性组件进行详细建模验证</div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 仿真参数配置 */}
          <TabsContent value="simulation" className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h3 className="font-medium mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    仿真参数配置
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 工况参数 */}
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center">
                        <Car className="w-4 h-4 mr-2" />
                        工况与环境参数
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <Label>驾驶场景</Label>
                          <Select value={configValues.drivingScenario}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="城市综合">城市综合工况</SelectItem>
                              <SelectItem value="高速巡航">高速巡航工况</SelectItem>
                              <SelectItem value="山路驾驶">山路驾驶工况</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>环境温度: {configValues.ambientTemp}°C</Label>
                          <Slider
                            value={[configValues.ambientTemp]}
                            onValueChange={(value) => setConfigValues({...configValues, ambientTemp: value[0]})}
                            max={45}
                            min={-20}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </Card>

                    {/* 空调设置 */}
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center">
                        <Wind className="w-4 h-4 mr-2" />
                        HVAC空调设置
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <Label>目标温度: {configValues.targetTemp}°C</Label>
                          <Slider
                            value={[configValues.targetTemp]}
                            onValueChange={(value) => setConfigValues({...configValues, targetTemp: value[0]})}
                            max={30}
                            min={16}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>自动模式</Label>
                          <Switch />
                        </div>
                      </div>
                    </Card>

                    {/* 电池参数 */}
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center">
                        <Battery className="w-4 h-4 mr-2" />
                        电池初始状态
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <Label>初始SOC: {configValues.initialSOC}%</Label>
                          <Slider
                            value={[configValues.initialSOC]}
                            onValueChange={(value) => setConfigValues({...configValues, initialSOC: value[0]})}
                            max={100}
                            min={10}
                            step={5}
                            className="mt-2"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>预热启用</Label>
                          <Switch />
                        </div>
                      </div>
                    </Card>

                    {/* 回收参数 */}
                    <Card className="p-4">
                      <h4 className="font-medium mb-3 flex items-center">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        能量回收参数
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <Label>回收效率: {configValues.regenEfficiency}%</Label>
                          <Slider
                            value={[configValues.regenEfficiency]}
                            onValueChange={(value) => setConfigValues({...configValues, regenEfficiency: value[0]})}
                            max={95}
                            min={60}
                            step={5}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label>驾驶风格</Label>
                          <Select value={configValues.drivingStyle}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="经济">经济模式</SelectItem>
                              <SelectItem value="舒适">舒适模式</SelectItem>
                              <SelectItem value="运动">运动模式</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <h3 className="font-medium mb-4 flex items-center">
                    <PlayCircle className="w-5 h-5 mr-2" />
                    仿真控制
                  </h3>
                </div>
                <Card className="p-4">
                  <div className="space-y-4">
                    <Button 
                      className="w-full" 
                      onClick={handleReSimulate}
                      disabled={isReSimulating}
                    >
                      <PlayCircle className={`w-4 h-4 mr-2 ${isReSimulating ? 'animate-spin' : ''}`} />
                      {isReSimulating ? "仿真中..." : "开始仿真"}
                    </Button>
                    <Button variant="outline" className="w-full">
                      保存配置模板
                    </Button>
                    <Button variant="outline" className="w-full">
                      加载历史配置
                    </Button>
                    {isReSimulating && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>仿真进度</span>
                          <span>{reSimulationProgress}%</span>
                        </div>
                        <Progress value={reSimulationProgress} className="h-2" />
                        <div className="text-xs text-gray-500 mt-1">正在重新计算系统性能指标...</div>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="p-4 mt-4">
                  <h4 className="font-medium mb-3">快速场景</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      🏙️ 城市通勤场景
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      🏔️ 山路测试场景
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      🌡️ 极端温度场景
                    </Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* 验证结果区域 - 融合到仿真配置 */}
            <div className="border-t border-gray-200 mt-6 pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="mb-4">
                    <h3 className="font-medium mb-2 flex items-center">
                      {isCompliant ? 
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" /> : 
                        <XCircle className="w-5 h-5 mr-2 text-red-600" />
                      }
                      验证结果状态
                    </h3>
                    <p className="text-sm text-gray-600">基于设定阈值的合规性评估</p>
                  </div>
                  
                  <Card className={`p-6 ${isCompliant ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${isCompliant ? 'text-green-600' : 'text-red-600'}`}>
                        {isCompliant ? '✅' : '❌'}
                      </div>
                      <div className={`text-xl font-semibold mt-2 ${isCompliant ? 'text-green-800' : 'text-red-800'}`}>
                        {isCompliant ? '验证合格' : '验证不合格'}
                      </div>
                      <div className="text-lg mt-1">
                        合规性评分: {performanceMetrics.complianceScore}%
                      </div>
                    </div>
                  </Card>

                  {!isCompliant && (
                    <Card className="p-4 mt-4 bg-yellow-50 border-yellow-200">
                      <h4 className="font-medium text-yellow-800 mb-2">改进建议</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• 优化电池热管理策略，降低温度波动</li>
                        <li>• 调整HVAC目标温度至23°C，减少功耗</li>
                        <li>• 提高制动回收效率至88%以上</li>
                      </ul>
                    </Card>
                  )}

                  <div className="mt-4">
                    <Button variant="outline" className="w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      生成报告
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <h3 className="font-medium mb-2">关键指标详情</h3>
                    <p className="text-sm text-gray-600">各项性能指标达标情况</p>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      {name: "整体能效", value: performanceMetrics.overallEfficiency, target: 85, unit: "%"},
                      {name: "续航里程", value: performanceMetrics.rangeRemaining, target: 400, unit: "km"},
                      {name: "回收效率", value: performanceMetrics.regenRecovery, target: 20, unit: "%"},
                      {name: "热平衡", value: performanceMetrics.thermalBalance, target: 90, unit: "%"},
                      {name: "系统健康", value: performanceMetrics.systemHealth, target: 95, unit: "%"},
                    ].map((metric, index) => {
                      const isPass = metric.value >= metric.target
                      return (
                        <Card key={index} className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{metric.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-semibold">{metric.value}{metric.unit}</span>
                              {isPass ? 
                                <CheckCircle className="w-5 h-5 text-green-600" /> : 
                                <XCircle className="w-5 h-5 text-red-600" />
                              }
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>目标值: {metric.target}{metric.unit}</span>
                              <span>{isPass ? '达标' : '未达标'}</span>
                            </div>
                            <Progress 
                              value={(metric.value / metric.target) * 100} 
                              className={`h-2 ${!isPass ? 'bg-red-100' : ''}`}
                            />
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 实时监控仪表板 */}
          <TabsContent value="dashboard" className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="mb-4">
                  <h3 className="font-medium mb-2">实时能量流监控</h3>
                  <p className="text-sm text-gray-600">系统组件实时功耗与效率监控</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={realtimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="motorPower" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.8} name="电机功率(kW)" />
                    <Area type="monotone" dataKey="hvacPower" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.8} name="空调功率(kW)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <div className="mb-4">
                  <h3 className="font-medium mb-2">系统健康度</h3>
                  <p className="text-sm text-gray-600">关键组件状态监控</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="80%" data={[
                    {name: '系统健康', value: performanceMetrics.systemHealth, fill: '#10b981'},
                    {name: '热平衡', value: performanceMetrics.thermalBalance, fill: '#f59e0b'},
                    {name: '能效', value: performanceMetrics.overallEfficiency, fill: '#0ea5e9'},
                  ]}>
                    <RadialBar dataKey="value" />
                    <Tooltip />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <Card className="p-4 text-center">
                <Cpu className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-lg font-semibold">EMS状态</div>
                <div className="text-sm text-green-600">正常运行</div>
              </Card>
              <Card className="p-4 text-center">
                <Battery className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-lg font-semibold">BMS状态</div>
                <div className="text-sm text-green-600">健康</div>
              </Card>
              <Card className="p-4 text-center">
                <Thermometer className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <div className="text-lg font-semibold">TMS状态</div>
                <div className="text-sm text-yellow-600">监控中</div>
              </Card>
              <Card className="p-4 text-center">
                <Wind className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-lg font-semibold">HVAC状态</div>
                <div className="text-sm text-green-600">自动模式</div>
              </Card>
            </div>
          </TabsContent>

          {/* 历史场景对比 */}
          <TabsContent value="history" className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <h3 className="font-medium mb-2">历史场景列表</h3>
                  <p className="text-sm text-gray-600">保存的仿真场景及结果概览</p>
                </div>
                
                <div className="space-y-3">
                  {historicalScenarios.map((scenario) => (
                    <Card key={scenario.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{scenario.name}</span>
                        <Badge variant={scenario.status === "合格" ? "default" : "destructive"}>
                          {scenario.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <div>能效</div>
                          <div className="font-medium">{scenario.efficiency}%</div>
                        </div>
                        <div>
                          <div>续航</div>
                          <div className="font-medium">{scenario.range}km</div>
                        </div>
                        <div>
                          <div>日期</div>
                          <div className="font-medium">{scenario.date}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    导出Excel
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    分享报告
                  </Button>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <h3 className="font-medium mb-2">趋势对比分析</h3>
                  <p className="text-sm text-gray-600">多场景关键指标对比</p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalScenarios}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} name="能效(%)" />
                    <Line type="monotone" dataKey="range" stroke="#0ea5e9" strokeWidth={2} name="续航(km)" />
                  </LineChart>
                </ResponsiveContainer>
                
                <Card className="p-4 mt-4">
                  <h4 className="font-medium mb-2">性能趋势分析</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• 城市工况和高速工况表现较好，均达到合格标准</div>
                    <div>• 山路和极寒环境下性能有待优化</div>
                    <div>• 建议重点优化低温下的热管理策略</div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* 需求追溯 */}
          <TabsContent value="traceability" className="p-6">
            <div className="mb-8">
              <div className="mb-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <GitBranch className="w-5 h-5 mr-2" />
                  需求追溯可视化图
                </h3>
                <p className="text-sm text-gray-600">
                  基于MBSE方法的需求到验证全链路追溯关系图，展示需求、功能、组件、参数、测试用例和验证结果之间的追溯关系
                </p>
              </div>
              <TraceabilityVisualization />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <h3 className="font-medium mb-2 flex items-center">
                    <GitBranch className="w-5 h-5 mr-2" />
                    SysML需求追溯矩阵
                  </h3>
                  <p className="text-sm text-gray-600">需求到设计元素的可追溯性验证</p>
                </div>
                
                <div className="space-y-3">
                  {traceabilityData.map((item, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{item.requirement}</span>
                        <Badge variant={item.status === "已验证" ? "default" : "secondary"}>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{item.element}</div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>覆盖率</span>
                          <span>{item.coverage}%</span>
                        </div>
                        <Progress value={item.coverage} className="h-2" />
                      </div>
                    </Card>
                  ))}
                </div>
                
                <Button className="w-full mt-4">
                  <Layers className="w-4 h-4 mr-2" />
                  查看完整SysML模型
                </Button>
              </div>

              <div>
                <div className="mb-4">
                  <h3 className="font-medium mb-2">模型关联映射</h3>
                  <p className="text-sm text-gray-600">参数与SysML模型元素的绑定关系</p>
                </div>
                
                <Card className="p-4">
                  <h4 className="font-medium mb-3">Parametric Diagram 参数绑定</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>电池SOC</span>
                      <span className="text-blue-600">→ Battery.StateOfCharge</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>电机功率</span>
                      <span className="text-blue-600">→ Motor.PowerOutput</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>空调功耗</span>
                      <span className="text-blue-600">→ HVAC.PowerConsumption</span>
                    </div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded">
                      <span>回收效率</span>
                      <span className="text-blue-600">→ RegenSystem.Efficiency</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 mt-4">
                  <h4 className="font-medium mb-3">状态机映射</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>正常运行状态</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>预热状态</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>回收状态</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>保护状态</span>
                    </div>
                  </div>
                </Card>

                <Button variant="outline" className="w-full mt-4">
                  <FileText className="w-4 h-4 mr-2" />
                  生成追溯报告
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}