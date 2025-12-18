import React, { useEffect, useRef } from "react";
import { X, CheckCircle } from "lucide-react@0.487.0";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

interface ResultDrawerProps {
  isResultDrawerOpen: boolean;
  setIsResultDrawerOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  resultNodeId: string | null;
  nodes: any[];
}

export function ResultDrawer({
  isResultDrawerOpen,
  setIsResultDrawerOpen,
  resultNodeId,
  nodes,
}: ResultDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // 监听画布点击事件，点击空白位置关闭结果抽屉
  useEffect(() => {
    if (!isResultDrawerOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // 检查点击是否在抽屉内部
      if (drawerRef.current && drawerRef.current.contains(target)) {
        return; // 点击在抽屉内部，不关闭
      }
      
      // 检查点击是否在画布区域（React Flow的画布容器）
      const reactFlowElement = document.querySelector('.react-flow');
      if (reactFlowElement && reactFlowElement.contains(target)) {
        // 进一步检查是否点击的是画布空白区域而不是节点
        const isNodeElement = target.closest('.react-flow__node');
        const isEdgeElement = target.closest('.react-flow__edge');
        const isControlElement = target.closest('.react-flow__controls');
        const isMiniMapElement = target.closest('.react-flow__minimap');
        
        // 如果点击的不是节点、边、控制器或小地图，则认为是点击了画布空白区域
        if (!isNodeElement && !isEdgeElement && !isControlElement && !isMiniMapElement) {
          setIsResultDrawerOpen(false);
        }
      }
    };

    // 添加事件监听器
    document.addEventListener('mousedown', handleClickOutside);
    
    // 清理函数
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isResultDrawerOpen, setIsResultDrawerOpen]);

  if (!isResultDrawerOpen || !resultNodeId) return null;

  const node = nodes.find((n) => n.id === resultNodeId);
  if (!node) return null;

  // 渲染需求同步节点的专门结果展示
  const renderRequirementSyncResult = () => {
    const syncedRequirements = [
      {
        id: "REQ-001",
        name: "整车主动安全系统性能要求",
        description: "车辆配备AEB自动紧急制动系统，在车速20-80km/h范围内，对静止目标的自动制动时间不超过20秒",
        priority: "High",
        status: "Approved",
      },
      {
        id: "REQ-002",
        name: "被动安全约束系统要求", 
        description: "安全气囊系统在各碰撞测试中须符合Euro NCAP五星安全标准",
        priority: "High",
        status: "Approved",
      },
      {
        id: "REQ-004",
        name: "动力系统能效要求",
        description: "整车燃油经济性在NEDC工况下不低于6.5L/100km，城市工况下不超过8.0L/100km",
        priority: "Medium",
        status: "Approved",
      },
      {
        id: "REQ-005",
        name: "电池管理系统要求",
        description: "动力电池在-30°C至60°C环境温度下正常工作，电池管理系统具备过充、过放保护功能",
        priority: "High",
        status: "Approved",
      },
      {
        id: "REQ-006",
        name: "车身强度结构要求",
        description: "车身A柱、B柱抗压强度不低于1000MPa，满足侧面碰撞安全要求",
        priority: "High",
        status: "Approved",
      },
      {
        id: "REQ-009",
        name: "环境适应性要求",
        description: "车辆在-35°C至+85°C环境温度下须正常工作，防护等级达到IP67",
        priority: "Medium",
        status: "Approved",
      },
      {
        id: "REQ-011",
        name: "数据安全要求",
        description: "系统控制单元在防护测试环境下，对测试目标的控制精度不低于T3P占比",
        priority: "High",
        status: "Approved",
      },
    ];

    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case "High":
          return "bg-red-100 text-red-800";
        case "Medium":
          return "bg-yellow-100 text-yellow-800";
        case "Low":
          return "bg-gray-100 text-gray-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case "Approved":
          return "bg-green-100 text-green-800";
        case "Pending":
          return "bg-yellow-100 text-yellow-800";
        case "Rejected":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <div className="px-[12px] py-[16px]">
        {/* 工具和类型信息 */}
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
          <span>工具: <span className="font-medium">Polarion-EA</span></span>
          <span>|</span>
          <span>类型: <span className="font-medium">architecture</span></span>
        </div>
        
        {/* 滑动提示 */}
        <div className="mb-3 text-xs text-gray-500">
          💡 提示：表格内容较宽，可左右滑动查看完整信息
        </div>

        {/* 需求同步结果表格 */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto overflow-y-auto table-scroll-container" style={{ maxHeight: "300px" }}>
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 w-8 flex-shrink-0">#</th>
                  <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 w-20 flex-shrink-0">Id</th>
                  <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 w-40 flex-shrink-0">Name</th>
                  <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 w-60 flex-shrink-0">Description</th>
                  <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 w-24 flex-shrink-0">Priority</th>
                  <th className="px-2 py-3 text-left text-sm font-medium text-gray-700 w-24 flex-shrink-0">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {syncedRequirements.map((req, index) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-3 text-sm text-gray-600">{index + 1}</td>
                    <td className="px-2 py-3 text-sm font-medium text-blue-600">{req.id}</td>
                    <td className="px-2 py-3 text-sm text-gray-900 font-medium">
                      <div className="max-w-40 truncate" title={req.name}>
                        {req.name}
                      </div>
                    </td>
                    <td className="px-2 py-3 text-sm text-gray-700">
                      <div className="max-w-60 truncate" title={req.description}>
                        {req.description}
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(req.priority)}`}>
                        {req.priority}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 渲染创建需求节点的专门结果展示
  const renderRequirementCreationResult = () => {
    const requirements = [
      {
        id: "REQ-001",
        title: "整车主动安全系统性能要求",
        description:
          "车辆配备AEB自动紧急制动系统，在车速20-80km/h范围内，对静止目标的自动制动时间不超过20秒",
        status: "error",
        statusText: "错误",
      },
      {
        id: "REQ-002",
        title: "被动安全约束系统要求",
        description:
          "安全气囊系统在各碰撞测试中须符合Euro NCAP五星安全标准",
        status: "approved",
        statusText: "Approved",
      },
      {
        id: "REQ-003",
        title: "车辆结构控制要求",
        description:
          "ESP的子系统控制单元在19种温度测试环境下，对测试目标的控制精度不低于TDP占比",
        status: "needsChange",
        statusText: "还需修改",
      },
      {
        id: "REQ-004",
        title: "动力系统能效要求",
        description:
          "整车燃油经济性在NEDC工况下不低于6.5L/100km，城市工况下不超过8.0L/100km",
        status: "approved",
        statusText: "Approved",
      },
      {
        id: "REQ-005",
        title: "电池管理系统要求",
        description:
          "动力电池在-30°C至60°C环境温度下正常工作，电池管理系统具备过充、过放保护功能",
        status: "approved",
        statusText: "Approved",
      },
      {
        id: "REQ-006",
        title: "车身强度结构要求",
        description:
          "车身A柱、B柱抗压强度不低于1000MPa，满足侧面碰撞安全要求",
        status: "error",
        statusText: "错误",
      },
      {
        id: "REQ-007",
        title: "智能驾驶辅助要求",
        description:
          "L2级自动驾驶功能在高速公路场景下车道保持精度±15cm，跟车距离控制精度±2m",
        status: "approved",
        statusText: "Approved",
      },
      {
        id: "REQ-008",
        title: "制动系统性能要求",
        description:
          "100km/h至0制动距离不超过38m，制动踏板力不超过500N，ABS系统响应时间<120ms",
        status: "approved",
        statusText: "Approved",
      },
      {
        id: "REQ-009",
        title: "空调系统舒适性要求",
        description:
          "车内温度控制精度±2°C，制冷量不低于6kW，外界35°C环境下20分钟内降至25°C",
        status: "needsChange",
        statusText: "还需修改",
      },
      {
        id: "REQ-010",
        title: "底盘悬挂系统要求",
        description:
          "前后悬挂系统刚度可调范围20-80N/mm，阻尼可调范围1000-4000Ns/m",
        status: "approved",
        statusText: "Approved",
      },
      {
        id: "REQ-011",
        title: "EMC电磁兼容要求",
        description:
          "整车电磁辐射符合GB/T 18387标准，电磁抗扰度满足ISO 11452-2要求",
        status: "error",
        statusText: "错误",
      },
    ];

    const getStatusColor = (status: string) => {
      switch (status) {
        case "error":
          return "bg-red-100 text-red-800 border-red-200";
        case "approved":
          return "bg-green-100 text-green-800 border-green-200";
        case "needsChange":
          return "bg-orange-100 text-orange-800 border-orange-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    return (
      <div className="space-y-4 mx-[20px] my-[0px] px-[10px] mx-[10px] my-[0px] m-[0px] mx-[15px] my-[0px] px-[5px] p-[5px] px-[0px] py-[5px] mx-[5px] my-[0px]">
        {/* 副标题 */}
        <div className="text-sm text-red-600 font-medium">
          需求创建结果统计
        </div>

        {/* 统计概览 */}
        <div className="flex items-center gap-8 pb-4 border-b border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-medium text-gray-900">
              11
            </div>
            <div className="text-sm text-gray-600">全部</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-medium text-green-600">
              7
            </div>
            <div className="text-sm text-gray-600">已配置</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-medium text-red-600">
              3
            </div>
            <div className="text-sm text-gray-600">错误</div>
          </div>
        </div>

        {/* 需求列表 */}
        <div className="space-y-2">
          {requirements.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm text-blue-600 font-medium">
                    {req.id}
                  </span>
                  <h4 className="font-medium text-gray-900 truncate">
                    {req.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {req.description}
                </p>
              </div>
              <div className="flex-shrink-0 ml-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(req.status)}`}
                >
                  {req.statusText}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 渲染架构转换节点的专门结果展示
  const renderArchitectureConversionResult = () => {
    // SSP文件数据信息
    const sspFiles = [
      {
        name: "VehicleSafetySystem.ssp",
        size: "2.3 MB",
        createTime: "2025-01-15 14:30:22",
        status: "generated"
      },
      {
        name: "BrakingSubsystem.ssp", 
        size: "856 KB",
        createTime: "2025-01-15 14:28:15",
        status: "generated"
      },
      {
        name: "SafetyController.ssp",
        size: "1.2 MB", 
        createTime: "2025-01-15 14:25:08",
        status: "generated"
      }
    ];

    // 转换验证状态数据
    const validationResults = [
      {
        id: "port-validation",
        title: "Port模块情况",
        status: "Passing",
        description: "所有端口都有对应的映射",
        statusColor: "bg-green-100 text-green-800"
      },
      {
        id: "connection-validation", 
        title: "连接完整情况",
        status: "Passing",
        description: "所有连接关系完整",
        statusColor: "bg-green-100 text-green-800"
      },
      {
        id: "parameter-validation",
        title: "参数一致性检测",
        status: "Warning", 
        description: "发现2个参数类型不完全匹配",
        statusColor: "bg-yellow-100 text-yellow-800"
      },
      {
        id: "structure-validation",
        title: "模型结构验证",
        status: "Passing",
        description: "模型结构符合SSP规范",
        statusColor: "bg-green-100 text-green-800"
      }
    ];

    // 转换统计信息
    const conversionStats = {
      successful: 24,
      total: 24,
      warnings: 2,
      errors: 0
    };

    // 关联模块列表数据
    const moduleMapping = [
      {
        sourceId: "A-SYS-001",
        moduleName: "AEB制动模块",
        mappingStatus: "成功",
        sspOutput: "VehicleSafetySystem.ssp"
      },
      {
        sourceId: "A-SYS-002", 
        moduleName: "ESP稳定控制模块",
        mappingStatus: "成功",
        sspOutput: "VehicleSafetySystem.ssp"
      },
      {
        sourceId: "A-SYS-003",
        moduleName: "安全气囊控制模块", 
        mappingStatus: "成功",
        sspOutput: "SafetyController.ssp"
      },
      {
        sourceId: "A-SYS-004",
        moduleName: "制动系统控制模块",
        mappingStatus: "成功", 
        sspOutput: "BrakingSubsystem.ssp"
      }
    ];

    const getStatusColor = (status: string) => {
      switch (status) {
        case "generated":
          return "bg-green-100 text-green-800";
        case "成功":
          return "bg-green-100 text-green-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <div className="px-[12px] py-[16px] space-y-6">
        {/* 工具和类型信息 */}
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
          <span>工具: <span className="font-medium">SSP</span></span>
          <span>|</span>
          <span>类型: <span className="font-medium">architecture</span></span>
        </div>

        {/* SSP文件数据信息 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">SSP文件数据信息</h4>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">文件名</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">大小</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">创建时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sspFiles.map((file, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-blue-600 font-medium">{file.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{file.size}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{file.createTime}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(file.status)}`}>
                        Generated
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 转换验证状态 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">转换验证状态</h4>
          <div className="grid grid-cols-2 gap-4">
            {validationResults.map((result) => (
              <div key={result.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-gray-900 font-medium">{result.title}</div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${result.statusColor}`}>
                    {result.status}
                  </span>
                </div>
                <div className="text-xs text-gray-600">{result.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 转换统计信息 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">转换统计/日志</h4>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{conversionStats.successful}/{conversionStats.total}</div>
                  <div className="text-sm text-gray-600">成功/总数</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{conversionStats.warnings}</div>
                  <div className="text-sm text-gray-600">警告</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{conversionStats.errors}</div>
                  <div className="text-sm text-gray-600">错误</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 关联模块 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">关联模块</h4>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">源物理模块ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">模块名称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">映射状态</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">SSP输出文件</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {moduleMapping.map((module) => (
                  <tr key={module.sourceId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-blue-600 font-medium">{module.sourceId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{module.moduleName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(module.mappingStatus)}`}>
                        成功
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{module.sspOutput}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 渲染电池建模仿真节点的专门结果展示
  const renderBatteryModelingSimulationResult = () => {
    // 仿真模型数据信息
    const simulationModels = [
      {
        name: "电池包能量模型",
        type: "能量存储",
        status: "验证通过",
        efficiency: "95.2%",
        capacity: "85.6 kWh",
        lastUpdate: "2025-01-15 16:30:25"
      },
      {
        name: "电机控制器模型", 
        type: "功率转换",
        status: "验证通过",
        efficiency: "96.8%",
        maxPower: "150 kW",
        lastUpdate: "2025-01-15 16:28:15"
      },
      {
        name: "制动能量回收模型",
        type: "能量回收",
        status: "存在问题",
        efficiency: "88.4%",
        recoverRate: "65%",
        lastUpdate: "2025-01-15 16:25:08"
      }
    ];

    // 能量流验证结果数据
    const energyFlowResults = [
      {
        scenario: "市区工况",
        totalEnergy: "23.5 kWh/100km",
        motorEnergy: "18.2 kWh/100km",
        auxiliaryEnergy: "3.8 kWh/100km",
        recoveredEnergy: "1.5 kWh/100km",
        status: "符合预期",
        statusColor: "bg-green-100 text-green-800"
      },
      {
        scenario: "高速工况",
        totalEnergy: "19.8 kWh/100km",
        motorEnergy: "16.5 kWh/100km",
        auxiliaryEnergy: "2.9 kWh/100km",
        recoveredEnergy: "0.4 kWh/100km",
        status: "符合预期",
        statusColor: "bg-green-100 text-green-800"
      },
      {
        scenario: "爬坡工况",
        totalEnergy: "35.2 kWh/100km",
        motorEnergy: "31.8 kWh/100km",
        auxiliaryEnergy: "3.4 kWh/100km",
        recoveredEnergy: "0.0 kWh/100km",
        status: "需要优化",
        statusColor: "bg-yellow-100 text-yellow-800"
      }
    ];

    // 仿真验证统计
    const validationStats = {
      totalScenarios: 12,
      passedScenarios: 9,
      warningScenarios: 2,
      failedScenarios: 1,
      overallAccuracy: "92.3%"
    };

    // 问题和建议
    const issues = [
      {
        component: "制动能量回收系统",
        issue: "低速制动时能量回收效率偏低",
        severity: "中等",
        suggestion: "优化回收控制策略，改善低速工况下的能量回收率"
      },
      {
        component: "电池热管理",
        issue: "高温环境下电池性能衰减较快",
        severity: "高",
        suggestion: "加强散热设计，优化电池温度控制策略"
      }
    ];

    const getStatusColor = (status: string) => {
      switch (status) {
        case "验证通过":
          return "bg-green-100 text-green-800";
        case "存在问题":
          return "bg-red-100 text-red-800";
        case "需要优化":
          return "bg-yellow-100 text-yellow-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const getSeverityColor = (severity: string) => {
      switch (severity) {
        case "高":
          return "bg-red-100 text-red-800";
        case "中等":
          return "bg-yellow-100 text-yellow-800";
        case "低":
          return "bg-gray-100 text-gray-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <div className="px-[12px] py-[16px] space-y-6">
        {/* 工具和类型信息 */}
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
          <span>工具: <span className="font-medium">M-WORKS</span></span>
          <span>|</span>
          <span>类型: <span className="font-medium">battery-modeling</span></span>
        </div>

        {/* 仿真验证统计概览 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">仿真验证统计</h4>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{validationStats.totalScenarios}</div>
                <div className="text-sm text-gray-600">总场景数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{validationStats.passedScenarios}</div>
                <div className="text-sm text-gray-600">通过</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{validationStats.warningScenarios}</div>
                <div className="text-sm text-gray-600">警告</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{validationStats.failedScenarios}</div>
                <div className="text-sm text-gray-600">失败</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{validationStats.overallAccuracy}</div>
                <div className="text-sm text-gray-600">整体精度</div>
              </div>
            </div>
          </div>
        </div>

        {/* 仿真模型状态 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">仿真模型状态</h4>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">模型名称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">类型</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">效率/容量</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">更新时间</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {simulationModels.map((model, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-blue-600 font-medium">{model.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{model.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {model.efficiency}
                      {model.capacity && <div className="text-xs text-gray-500">{model.capacity}</div>}
                      {model.maxPower && <div className="text-xs text-gray-500">{model.maxPower}</div>}
                      {model.recoverRate && <div className="text-xs text-gray-500">回收率: {model.recoverRate}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{model.lastUpdate}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(model.status)}`}>
                        {model.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 能量流验证结果 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">能量流验证结果</h4>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">工况场景</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">总能耗</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">驱动电机</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">附件系统</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">能量回收</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">验证状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {energyFlowResults.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-blue-600 font-medium">{result.scenario}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{result.totalEnergy}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{result.motorEnergy}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{result.auxiliaryEnergy}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{result.recoveredEnergy}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${result.statusColor}`}>
                        {result.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 问题和建议 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">问题识别与优化建议</h4>
          <div className="space-y-3">
            {issues.map((issue, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-gray-900 font-medium">{issue.component}</div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                    {issue.severity}风险
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-2">
                  <strong>问题：</strong>{issue.issue}
                </div>
                <div className="text-sm text-blue-700">
                  <strong>建议：</strong>{issue.suggestion}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 渲染能量流仿真验证节点的专门结果展示  
  const renderEnergyFlowSimulationResult = () => {
    // 架构映射统计
    const mappingStats = {
      totalModules: 18,
      mappedModules: 16,
      warningModules: 2,
      failedModules: 0,
      mappingAccuracy: "88.9%"
    };

    // 能量流架构映射表格
    const energyFlowMappings = [
      {
        sourceArchitecture: "功能架构",
        sourceModule: "电池能量管理功能",
        targetArchitecture: "物理架构", 
        targetModule: "BMS控制器",
        mappingRule: "功能到物理映射",
        status: "映射完成",
        statusColor: "bg-green-100 text-green-800"
      },
      {
        sourceArchitecture: "功能架构",
        sourceModule: "驱动能量转换功能",
        targetArchitecture: "物理架构",
        targetModule: "电机控制器",
        mappingRule: "功能到物理映射", 
        status: "映射完成",
        statusColor: "bg-green-100 text-green-800"
      },
      {
        sourceArchitecture: "功能架构",
        sourceModule: "制动能量回收功能",
        targetArchitecture: "物理架构",
        targetModule: "制动控制器",
        mappingRule: "功能到物理映射",
        status: "映射完成", 
        statusColor: "bg-green-100 text-green-800"
      },
      {
        sourceArchitecture: "物理架构",
        sourceModule: "高压配电盒",
        targetArchitecture: "实现架构",
        targetModule: "PDU硬件模块",
        mappingRule: "物理到实现映射",
        status: "部分映射",
        statusColor: "bg-yellow-100 text-yellow-800"
      },
      {
        sourceArchitecture: "物理架构", 
        sourceModule: "DC-DC转换器",
        targetArchitecture: "实现架构",
        targetModule: "低压电源模块",
        mappingRule: "物理到实现映射",
        status: "映射完成",
        statusColor: "bg-green-100 text-green-800"
      }
    ];

    // 映射转换日志
    const mappingLog = {
      functionalToPhysical: {
        description: "功能架构到物理架构映射",
        details: [
          "• 映射规则: 基于能量流路径和控制关系进行映射",
          "• 映射覆盖: 12个功能模块成功映射到物理组件",
          "• 约束检查: 满足能量平衡和控制时序约束"
        ]
      },
      physicalToImplementation: {
        description: "物理架构到实现架构映射",
        details: [
          "• 硬件映射: 8个物理组件映射到具体硬件模块",
          "• 接口映射: CAN总线和高压连接器接口映射完成",
          "• 参数继承: 功率、电压、电流等参数正确传递"
        ]
      }
    };

    // 架构一致性验证
    const consistencyChecks = [
      {
        checkType: "能量守恒验证",
        description: "验证各级架构中能量输入输出平衡",
        result: "通过",
        details: "所有能量路径保持平衡，无能量泄漏",
        resultColor: "bg-green-100 text-green-800"
      },
      {
        checkType: "功率约束验证",
        description: "验证功率分配不超过组件额定功率",
        result: "通过",
        details: "功率分配符合各组件额定参数",
        resultColor: "bg-green-100 text-green-800"
      },
      {
        checkType: "接口兼容性验证",
        description: "验证不同架构层级间接口匹配",
        result: "警告",
        details: "2个接口存在电压等级不匹配问题",
        resultColor: "bg-yellow-100 text-yellow-800"
      },
      {
        checkType: "时序约束验证",
        description: "验证控制时序和响应时间要求",
        result: "通过", 
        details: "控制时序满足实时性要求",
        resultColor: "bg-green-100 text-green-800"
      }
    ];

    return (
      <div className="px-[12px] py-[16px] space-y-6">
        {/* 工具和类型信息 */}
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
          <span>工具: <span className="font-medium">ArchMap-EnergyFlow</span></span>
          <span>|</span>
          <span>类型: <span className="font-medium">architecture-mapping</span></span>
        </div>

        {/* 架构映射统计 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">架构映射统计</h4>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-5 gap-4 text-center text-sm">
              <div>
                <div className="text-2xl font-bold text-gray-900">{mappingStats.totalModules}</div>
                <div className="text-gray-600">总模块数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{mappingStats.mappedModules}</div>
                <div className="text-gray-600">已映射</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{mappingStats.warningModules}</div>
                <div className="text-gray-600">警告</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{mappingStats.failedModules}</div>
                <div className="text-gray-600">失败</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{mappingStats.mappingAccuracy}</div>
                <div className="text-gray-600">映射精度</div>
              </div>
            </div>
          </div>
        </div>

        {/* 能量流架构映射表格 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">能量流架构映射</h4>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">源架构</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">源模块</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">目标架构</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">目标模块</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">映射规则</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {energyFlowMappings.map((mapping, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-blue-600 font-medium">{mapping.sourceArchitecture}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{mapping.sourceModule}</td>
                    <td className="px-4 py-3 text-sm text-purple-600 font-medium">{mapping.targetArchitecture}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{mapping.targetModule}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{mapping.mappingRule}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${mapping.statusColor}`}>
                        {mapping.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 映射转换日志 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">映射转换日志</h4>
          <div className="bg-gray-800 text-white rounded-lg p-4">
            <div className="mb-4">
              <div className="text-sm text-gray-300 mb-1">能量流架构映射转换过程</div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-white mb-2">{mappingLog.functionalToPhysical.description}</div>
                <div className="space-y-1 text-sm text-gray-300">
                  {mappingLog.functionalToPhysical.details.map((detail, idx) => (
                    <div key={idx}>{detail}</div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-white mb-2">{mappingLog.physicalToImplementation.description}</div>
                <div className="space-y-1 text-sm text-gray-300">
                  {mappingLog.physicalToImplementation.details.map((detail, idx) => (
                    <div key={idx}>{detail}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 架构一致性验证 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">架构一致性验证</h4>
          <div className="space-y-3">
            {consistencyChecks.map((check, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-gray-900 font-medium">{check.checkType}</div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${check.resultColor}`}>
                    {check.result}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">{check.description}</div>
                <div className="text-sm text-gray-700">{check.details}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 渲染SSP-Modelica节点的专门结果展示
  const renderSSPModelicaResult = () => {
    // Modelica模型数据信息
    const modelicaModels = [
      {
        name: "VehicleSafetySystem.mo",
        path: "/models/safety/VehicleSafetySystem.mo",
        size: "3.8 MB",
        lastModified: "2025-01-15 15:45:32",
        status: "Generated"
      },
      {
        name: "BrakingSubsystem.mo", 
        path: "/models/braking/BrakingSubsystem.mo",
        size: "1.2 MB",
        lastModified: "2025-01-15 15:42:18",
        status: "Generated"
      },
      {
        name: "SafetyController.mo",
        path: "/models/control/SafetyController.mo", 
        size: "956 KB",
        lastModified: "2025-01-15 15:38:45",
        status: "Generated"
      }
    ];

    // 仿真准备状态数据
    const simulationStatus = [
      {
        model: "VehicleSafetySystem.mo",
        status: "Ready",
        description: "模型准备就绪，可以开始仿真",
        statusColor: "bg-green-100 text-green-800"
      },
      {
        model: "BrakingSubsystem.mo", 
        status: "Ready",
        description: "模型准备就绪，可以开始仿真",
        statusColor: "bg-green-100 text-green-800"
      },
      {
        model: "SafetyController.mo",
        status: "Error",
        description: "问题列表：",
        details: [
          "• 核心不匹配：配置依赖出现未通过参数映射",
          "• 验证失败：初始化制动器_pressure",
          "• 类型不匹配的信号参数: Real -> Integer(不兼容)"
        ],
        statusColor: "bg-red-100 text-red-800"
      }
    ];

    // 转换日志摘要
    const conversionLog = {
      connectorDetails: {
        description: "连接器详情",
        details: [
          "• 数据总线: 16个输出配置输出端口",
          "• 不兼容接口: 2个UML需要兼容性转换",
          "• 自动映射可支持的参数: Real -> Integer (2个)"
        ]
      },
      jointParameters: {
        description: "联合参数状态数据处理",
        details: [
          "• 已经验证的联合: 5个参数通过运行检验验证",
          "• 参数兼容: 6个本地配置正常配置",
          "• 自动步长配置: brake_threshold=0.8, safety_margin=0.1"
        ]
      }
    };

    // 模块关联日志数据  
    const moduleMapping = [
      {
        sysmlModule: "A-SYS-001 (AEB控制模块)",
        modelicaClass: "VehicleSafety.AEB.Controller",
        modelicaPath: "/models/safety/VehicleSafetySystem.mo",
        status: "转换完成"
      },
      {
        sysmlModule: "A-SYS-002 (ESP稳定控制模块)",
        modelicaClass: "VehicleSafety.ESP.StabilityControl", 
        modelicaPath: "/models/safety/VehicleSafetySystem.mo",
        status: "转换完成"
      },
      {
        sysmlModule: "A-SYS-003 (安全气囊控制模块)",
        modelicaClass: "SafetyControl.Airbag.Controller",
        modelicaPath: "/models/control/SafetyController.mo", 
        status: "转换完成"
      },
      {
        sysmlModule: "A-SYS-004 (制动系统控制模块)",
        modelicaClass: "Braking.System.Controller",
        modelicaPath: "/models/braking/BrakingSubsystem.mo",
        status: "转换完成"
      }
    ];

    const getStatusColor = (status: string) => {
      switch (status) {
        case "Generated":
        case "转换完成":
          return "bg-green-100 text-green-800";
        case "Ready":
          return "bg-green-100 text-green-800";
        case "Error":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <div className="px-[12px] py-[16px] space-y-6">
        {/* 工具和类型信息 */}
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
          <span>工具: <span className="font-medium">SSP-Modelica</span></span>
          <span>|</span>
          <span>类型: <span className="font-medium">simulation</span></span>
        </div>

        {/* Modelica模型名称路径 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">Modelica模型名称路径</h4>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">模型名称</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">路径</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">大小</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">最后修改</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {modelicaModels.map((model, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-blue-600 font-medium">{model.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{model.path}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{model.size}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{model.lastModified}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(model.status)}`}>
                        Generated
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 仿真准备状态 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">仿真准备状态</h4>
          <div className="space-y-3">
            {simulationStatus.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-gray-900 font-medium">{item.model}</div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">{item.description}</div>
                {item.details && (
                  <div className="mt-2 p-3 bg-red-50 rounded border border-red-200">
                    <div className="space-y-1 text-sm text-red-700">
                      {item.details.map((detail, idx) => (
                        <div key={idx}>{detail}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 转换日志/摘要 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">转换日志/摘要</h4>
          <div className="bg-gray-800 text-white rounded-lg p-4">
            <div className="mb-4">
              <div className="text-sm text-gray-300 mb-1">SafetyController.ssp → SafetyController.mo</div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-white mb-2">{conversionLog.connectorDetails.description}</div>
                <div className="space-y-1 text-sm text-gray-300">
                  {conversionLog.connectorDetails.details.map((detail, idx) => (
                    <div key={idx}>{detail}</div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-white mb-2">{conversionLog.jointParameters.description}</div>
                <div className="space-y-1 text-sm text-gray-300">
                  {conversionLog.jointParameters.details.map((detail, idx) => (
                    <div key={idx}>{detail}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 模块关联日志 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">模块关联日志</h4>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">SysML模块</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Modelica类名</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Modelica路径</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {moduleMapping.map((mapping, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-blue-600 font-medium">{mapping.sysmlModule}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{mapping.modelicaClass}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{mapping.modelicaPath}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusColor(mapping.status)}`}>
                        转换完成
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 渲染功能&系统架构设计节点的专门结果展示
  const renderFunctionSystemArchitectureResult = () => {
    // 架构模型清单数据
    const architectureModels = [
      {
        id: "A-SYS-001",
        name: "AEB制动模块",
        description: "车辆配备自动紧急制动系统",
        constraints: "制动响应时间 ≤ 0.1s",
        requirements: "REQ-001, REQ-003"
      },
      {
        id: "A-SYS-002",
        name: "ESP稳定控制模块",
        description: "车身稳定性，识别防滑控制系统",
        constraints: "制动时间 ≤ 0.015s",
        requirements: "REQ-003"
      },
      {
        id: "A-SYS-003",
        name: "安全气囊控制模块",
        description: "碰撞检测和气囊展开控制",
        constraints: "展开时间 ≤ 30ms",
        requirements: "REQ-002"
      },
      {
        id: "A-SYS-004",
        name: "制动系统控制模块",
        description: "制动力分配的协调控制",
        constraints: "制动距离 ≤ 38m@100km/h",
        requirements: "REQ-006"
      }
    ];

    // 约束&性能指标数据
    const performanceMetrics = [
      {
        title: "制动响应时间",
        value: "≤ 0.1s",
        description: "紧急制动",
        status: "关键"
      },
      {
        title: "最大动作频率",
        value: "10Hz",
        description: "系统响应",
        status: "一般"
      },
      {
        title: "工作温度范围",
        value: "-35°C ~ +85°C",
        description: "环境适应",
        status: "关键"
      }
    ];

    // 需求-模块追溯矩阵数据
    const traceabilityMatrix = [
      {
        requirementId: "REQ-001",
        assignedModule: "A-SYS-001",
        coverageRate: "100%"
      },
      {
        requirementId: "REQ-002",
        assignedModule: "A-SYS-003",
        coverageRate: "100%"
      },
      {
        requirementId: "REQ-003",
        assignedModule: "A-SYS-001, A-SYS-002",
        coverageRate: "100%"
      },
      {
        requirementId: "REQ-006",
        assignedModule: "A-SYS-004",
        coverageRate: "100%"
      }
    ];

    const getStatusColor = (status: string) => {
      switch (status) {
        case "关键":
          return "bg-red-100 text-red-800 border-red-200";
        case "一般":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    return (
      <div className="px-[12px] py-[16px] space-y-6">
        {/* 工具和类型信息 */}
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
          <span>工具: <span className="font-medium">EA</span></span>
          <span>|</span>
          <span>类型: <span className="font-medium">architecture</span></span>
        </div>

        {/* 架构模型清单 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">架构模型清单</h4>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto table-scroll-container" style={{ maxHeight: "200px" }}>
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 w-24">模块ID</th>
                    <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 w-32">名称</th>
                    <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 w-48">功能描述</th>
                    <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 w-32">设计约束</th>
                    <th className="px-3 py-2 text-left text-sm font-medium text-gray-700 w-24">关联需求</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {architectureModels.map((model) => (
                    <tr key={model.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 text-sm text-blue-600 font-medium">{model.id}</td>
                      <td className="px-3 py-2 text-sm text-gray-900">{model.name}</td>
                      <td className="px-3 py-2 text-sm text-gray-700">{model.description}</td>
                      <td className="px-3 py-2 text-sm text-gray-600">{model.constraints}</td>
                      <td className="px-3 py-2 text-sm text-blue-600">{model.requirements}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SysML架构图 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">SysML架构图 (BDD/IBD)</h4>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-lg text-gray-700 font-medium">架构图展示</p>
                <p className="text-sm text-gray-500">点击查看详细SysML BDD/IBD图</p>
              </div>
            </div>
          </div>
        </div>

        {/* 约束 & 性能指标 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">约束 & 性能指标</h4>
          <div className="grid grid-cols-3 gap-4">
            {performanceMetrics.map((metric, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm text-gray-600">{metric.title}</div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(metric.status)}`}>
                    {metric.status}
                  </span>
                </div>
                <div className="text-lg font-semibold text-blue-600 mb-1">{metric.value}</div>
                <div className="text-xs text-gray-500">{metric.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 需求-模块追溯矩阵 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">需求-模块追溯矩阵</h4>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">需求ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">分配模块</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">覆盖率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {traceabilityMatrix.map((item) => (
                  <tr key={item.requirementId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-blue-600 font-medium">{item.requirementId}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.assignedModule}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        {item.coverageRate}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 渲染默认结果展示
  const renderDefaultResult = () => {
    return (
      <div className="px-[12px] py-[16px] space-y-6">
        {/* 工具和类型信息 */}
        <div className="flex items-center gap-3 mb-4 text-sm text-gray-600">
          <span>工具: <span className="font-medium">DOE</span></span>
          <span>|</span>
          <span>类型: <span className="font-medium">simulation</span></span>
        </div>

        {/* 实验方案信息 */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">实验方案信息</h4>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="space-y-2">
              <div className="text-lg font-medium text-gray-900">AEB_DOE_Sensitivity</div>
              <div className="text-sm text-gray-600">AEB系统敏感性分析实验设计</div>
              <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="font-medium text-gray-900">2025-01-15 17:15:30</div>
                  <div className="text-sm text-gray-600">执行时间</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-900">32</div>
                  <div className="text-sm text-gray-600">实验次数</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-green-600">32</div>
                  <div className="text-sm text-gray-600">完成次数</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-green-600">100.0%</div>
                  <div className="text-sm text-gray-600">成功率</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 分析结果摘要 (Main Effects) */}
        <div className="space-y-3">
          <h4 className="text-blue-600 font-medium border-l-3 border-blue-500 pl-3">分析结果摘要 (Main Effects)</h4>
          <div className="space-y-2 text-sm text-gray-600 mb-3">
            <div>阈值范围：制动距离响应差别当前水平对响应值的平均影响</div>
            <div>R²: 0.85</div>
            <div>基质参数：3.5</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">排序</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">因素</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">效应值</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">重要性</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">影响程度</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">#1</td>
                  <td className="px-4 py-3 text-sm text-gray-900">F1 - 车辆速度 (km/h)</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">8.24</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                      High
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 bg-red-500 rounded-full" style={{ width: '82%' }}></div>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">#2</td>
                  <td className="px-4 py-3 text-sm text-gray-900">F2 - 检测距离 (m)</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">6.18</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                      High
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 bg-red-500 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">#3</td>
                  <td className="px-4 py-3 text-sm text-gray-900">F3 - 制动系统响应时间 (ms)</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">4.92</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      Medium
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '49%' }}></div>
                    </div>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">#4</td>
                  <td className="px-4 py-3 text-sm text-gray-900">F4 - 路面摩擦系数</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">3.87</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      Medium
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '39%' }}></div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={drawerRef}
      className={`fixed bg-white shadow-lg border-t border-gray-200 z-50 transform transition-transform duration-300 ease-in-out ${
        isResultDrawerOpen
          ? "translate-y-0"
          : "translate-y-full"
      }`}
      style={{
        left: "502px",
        right: "0",
        bottom: "0",
        height: "400px",
      }}
    >
      {/* 抽屉头部 */}
      <div className="flex items-center justify-between px-[16px] py-[14px] border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-medium">
            {node.type === "需求同步" ||
            node.name?.includes("需求同步")
              ? `安全需求同步到EA - 执行结果`
              : node.type === "创建需求" ||
                node.name?.includes("创建需求")
              ? `${node.name} - 执行结果`
              : (node.type === "func-system-design" || 
                 node.type === "vehicle-safety-arch" ||
                 node.type === "battery-thermal-design" ||
                 node.name?.includes("功能&系统设计") ||
                 node.name?.includes("架构设计") ||
                 node.name?.includes("整车安全架构设计") ||
                 node.name?.includes("电池热管理设计"))
              ? `整车安全架构设计 - 执行结果`
              : (node.type === "ssp-arch-conversion" ||
                 node.type === "energy-ssp-conversion" ||
                 node.name?.includes("架构转换") ||
                 node.name?.includes("SSP转换") ||
                 node.name?.includes("SSP架构转换") ||
                 node.name?.includes("能量管理SSP转换"))
              ? `SSP架构转换 - 执行结果`
              : (node.type === "ssp-modelica-conversion" ||
                 node.type === "ssp-modelica" ||
                 node.type === "架构同步" ||
                 node.name?.includes("SSP-Modelica") ||
                 node.name?.includes("SSP到Modelica") ||
                 node.name?.includes("Modelica转换") ||
                 node.name?.includes("架构同步") ||
                 node.name?.includes("SSP-MODELICA") ||
                 node.name?.toLowerCase().includes("ssp-modelica"))
              ? `SSP-Modelica架构同步 - 执行结果`
              : (node.type === "battery-modeling-simulation" ||
                 node.type === "电池建模仿真" ||
                 node.name?.includes("电池建模仿真") ||
                 node.name?.includes("电池建模") ||
                 node.name?.includes("电池仿真") ||
                 node.name?.toLowerCase().includes("battery-modeling"))
              ? `电池建模仿真 - 执行结果`
              : (node.type === "energy-flow-simulation" ||
                 node.type === "energy-flow-validation" ||
                 node.type === "能量流仿真验证" ||
                 node.name?.includes("能量流仿真验证") ||
                 node.name?.includes("能量流验证") ||
                 node.name?.includes("能量流仿真") ||
                 node.name?.toLowerCase().includes("energy-flow"))
              ? `能量流仿真验证 - 执行结果`
              : `执行结果 - ${node.name}`}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsResultDrawerOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* 抽屉内容 */}
      <ScrollArea className="h-[calc(100%-80px)]">
        {/* 根据节点类型渲染不同的结果展示 */}
        {node.type === "需求同步" ||
        node.name?.includes("需求同步")
          ? renderRequirementSyncResult()
          : node.type === "创建需求" ||
            node.name?.includes("创建需求")
          ? renderRequirementCreationResult()
          : (node.type === "func-system-design" || 
             node.type === "vehicle-safety-arch" ||
             node.type === "battery-thermal-design" ||
             node.name?.includes("功能&系统设计") ||
             node.name?.includes("架构设计") ||
             node.name?.includes("整车安全架构设计") ||
             node.name?.includes("电池热管理设计"))
          ? renderFunctionSystemArchitectureResult()
          : (node.type === "ssp-arch-conversion" ||
             node.type === "energy-ssp-conversion" ||
             node.name?.includes("架构转换") ||
             node.name?.includes("SSP转换") ||
             node.name?.includes("SSP架构转换") ||
             node.name?.includes("能量管理SSP转换"))
          ? renderArchitectureConversionResult()
          : (node.type === "ssp-modelica-conversion" ||
             node.type === "ssp-modelica" ||
             node.type === "架构同步" ||
             node.name?.includes("SSP-Modelica") ||
             node.name?.includes("SSP到Modelica") ||
             node.name?.includes("Modelica转换") ||
             node.name?.includes("架构同步") ||
             node.name?.includes("SSP-MODELICA") ||
             node.name?.toLowerCase().includes("ssp-modelica"))
          ? renderSSPModelicaResult()
          : (node.type === "battery-modeling-simulation" ||
             node.type === "电池建模仿真" ||
             node.name?.includes("电池建模仿真") ||
             node.name?.includes("电池建模") ||
             node.name?.includes("电池仿真") ||
             node.name?.toLowerCase().includes("battery-modeling"))
          ? renderBatteryModelingSimulationResult()
          : (node.type === "energy-flow-simulation" ||
             node.type === "energy-flow-validation" ||
             node.type === "能量流仿真验证" ||
             node.name?.includes("能量流仿真验证") ||
             node.name?.includes("能量流验证") ||
             node.name?.includes("能量流仿真") ||
             node.name?.toLowerCase().includes("energy-flow"))
          ? renderEnergyFlowSimulationResult()
          : renderDefaultResult()}
      </ScrollArea>
    </div>
  );
}