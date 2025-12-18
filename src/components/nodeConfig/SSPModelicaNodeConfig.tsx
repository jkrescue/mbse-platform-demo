import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  NodeProps,
  Handle,
  Position,
  MarkerType,
} from 'reactflow';
import { createPortal } from 'react-dom';
import 'reactflow/dist/style.css';

interface SSPModelicaNodeConfigProps {
  node: any;
  onSave: (config: any) => void;
  onCancel?: () => void;
  userRole?: string;
}

// 模型配置接口
interface ModelConfig {
  id: string;
  name: string;
  type: 'fmu' | 'modelica' | 'amesim' | 'none';
  file?: File | null;
  fileName?: string;
  filePath?: string;
  uploadedAt?: string;
}

// IBD 组件定义
interface IBDComponent {
  id: string;
  name: string;
  displayName: string;
  type: 'block';
  category: 'power' | 'control' | 'thermal' | 'mechanical';
  ports: {
    id: string;
    name: string;
    type: 'input' | 'output' | 'bidirectional';
    position: Position;
    interfaceType: 'electric' | 'mechanical' | 'thermal' | 'signal' | 'can';
  }[];
  description: string;
}

// 整车能耗系统 IBD 组件定义 - 重新设计为左输入右输出
const VEHICLE_ENERGY_COMPONENTS: IBDComponent[] = [
  {
    id: 'battery_pack',
    name: '动力电池包',
    displayName: ':Battery Pack',
    type: 'block',
    category: 'power',
    description: '高压动力电池系统，提供整车能量来源',
    ports: [
      { id: 'battery_can_in', name: 'CANIn', type: 'input', position: Position.Left, interfaceType: 'can' },
      { id: 'battery_power_out', name: 'PowerOut', type: 'output', position: Position.Right, interfaceType: 'electric' },
      { id: 'battery_thermal_out', name: 'ThermalOut', type: 'output', position: Position.Right, interfaceType: 'thermal' },
    ],
  },
  {
    id: 'bms',
    name: 'BMS系统',
    displayName: ':BMS',
    type: 'block',
    category: 'control',
    description: '电池管理系统，监控电池状态和安全',
    ports: [
      { id: 'bms_battery_in', name: 'BatteryIn', type: 'input', position: Position.Left, interfaceType: 'signal' },
      { id: 'bms_can_out', name: 'CANOut', type: 'output', position: Position.Right, interfaceType: 'can' },
      { id: 'bms_control_out', name: 'ControlOut', type: 'output', position: Position.Right, interfaceType: 'signal' },
    ],
  },
  {
    id: 'motor_controller',
    name: '电机控制器',
    displayName: ':Motor Controller',
    type: 'block',
    category: 'control',
    description: '驱动电机控制器（MCU），控制电机运行',
    ports: [
      { id: 'mcu_power_in', name: 'PowerIn', type: 'input', position: Position.Left, interfaceType: 'electric' },
      { id: 'mcu_can_in', name: 'CANIn', type: 'input', position: Position.Left, interfaceType: 'can' },
      { id: 'mcu_regen_in', name: 'RegenIn', type: 'input', position: Position.Left, interfaceType: 'electric' },
      { id: 'mcu_power_out', name: 'PowerOut', type: 'output', position: Position.Right, interfaceType: 'electric' },
      { id: 'mcu_thermal_out', name: 'ThermalOut', type: 'output', position: Position.Right, interfaceType: 'thermal' },
    ],
  },
  {
    id: 'drive_motor',
    name: '驱动电机',
    displayName: ':Drive Motor',
    type: 'block',
    category: 'power',
    description: '永磁同步电机或异步电机，驱动车辆行驶',
    ports: [
      { id: 'motor_power_in', name: 'PowerIn', type: 'input', position: Position.Left, interfaceType: 'electric' },
      { id: 'motor_thermal_in', name: 'ThermalIn', type: 'input', position: Position.Left, interfaceType: 'thermal' },
      { id: 'motor_mech_out', name: 'MechOut', type: 'output', position: Position.Right, interfaceType: 'mechanical' },
    ],
  },
  {
    id: 'transmission',
    name: '传动系统',
    displayName: ':Transmission',
    type: 'block',
    category: 'mechanical',
    description: '减速器和差速器，传递扭矩到车轮',
    ports: [
      { id: 'trans_mech_in', name: 'MechIn', type: 'input', position: Position.Left, interfaceType: 'mechanical' },
      { id: 'trans_mech_out', name: 'MechOut', type: 'output', position: Position.Right, interfaceType: 'mechanical' },
    ],
  },
  {
    id: 'brake_system',
    name: '制动系统',
    displayName: ':Brake System',
    type: 'block',
    category: 'mechanical',
    description: '能量回收制动和机械制动系统',
    ports: [
      { id: 'brake_mech_in', name: 'MechIn', type: 'input', position: Position.Left, interfaceType: 'mechanical' },
      { id: 'brake_can_in', name: 'CANIn', type: 'input', position: Position.Left, interfaceType: 'can' },
      { id: 'brake_regen_out', name: 'RegenOut', type: 'output', position: Position.Right, interfaceType: 'electric' },
    ],
  },
  {
    id: 'thermal_mgmt',
    name: '热管理系统',
    displayName: ':Thermal Mgmt',
    type: 'block',
    category: 'thermal',
    description: '冷却和加热系统，管理电池和电机温度',
    ports: [
      { id: 'thermal_battery_in', name: 'BatteryIn', type: 'input', position: Position.Left, interfaceType: 'thermal' },
      { id: 'thermal_mcu_in', name: 'MCUIn', type: 'input', position: Position.Left, interfaceType: 'thermal' },
      { id: 'thermal_power_in', name: 'PowerIn', type: 'input', position: Position.Left, interfaceType: 'electric' },
      { id: 'thermal_coolant_out', name: 'CoolantOut', type: 'output', position: Position.Right, interfaceType: 'thermal' },
    ],
  },
  {
    id: 'vehicle_body',
    name: '车身控制',
    displayName: ':Vehicle Body',
    type: 'block',
    category: 'mechanical',
    description: '车身控制单元和底盘',
    ports: [
      { id: 'body_mech_in', name: 'MechIn', type: 'input', position: Position.Left, interfaceType: 'mechanical' },
      { id: 'body_can_in', name: 'CANIn', type: 'input', position: Position.Left, interfaceType: 'can' },
      { id: 'body_mech_out', name: 'MechOut', type: 'output', position: Position.Right, interfaceType: 'mechanical' },
      { id: 'body_aux_out', name: 'AuxOut', type: 'output', position: Position.Right, interfaceType: 'electric' },
      { id: 'body_can_out', name: 'CANOut', type: 'output', position: Position.Right, interfaceType: 'can' },
    ],
  },
  {
    id: 'auxiliary_systems',
    name: '辅助系统',
    displayName: ':Auxiliary',
    type: 'block',
    category: 'power',
    description: '空调、照明、娱乐等辅助用电设备',
    ports: [
      { id: 'aux_power_in', name: 'PowerIn', type: 'input', position: Position.Left, interfaceType: 'electric' },
      { id: 'aux_can_in', name: 'CANIn', type: 'input', position: Position.Left, interfaceType: 'can' },
    ],
  },
];

// 接口连接定义 - 重新设计连接关系
const VEHICLE_ENERGY_CONNECTIONS = [
  // 主能量流：电池 → 电机控制器 → 驱动电机 → 传动 → 车身
  { id: 'e1', source: 'battery_pack', sourceHandle: 'battery_power_out', target: 'motor_controller', targetHandle: 'mcu_power_in', label: ':Electric Power', type: 'electric' },
  { id: 'e2', source: 'motor_controller', sourceHandle: 'mcu_power_out', target: 'drive_motor', targetHandle: 'motor_power_in', label: ':Electric Power', type: 'electric' },
  { id: 'e3', source: 'drive_motor', sourceHandle: 'motor_mech_out', target: 'transmission', targetHandle: 'trans_mech_in', label: ':Mechanical', type: 'mechanical' },
  { id: 'e4', source: 'transmission', sourceHandle: 'trans_mech_out', target: 'vehicle_body', targetHandle: 'body_mech_in', label: ':Mechanical', type: 'mechanical' },
  
  // 制动能量回收
  { id: 'e5', source: 'vehicle_body', sourceHandle: 'body_mech_out', target: 'brake_system', targetHandle: 'brake_mech_in', label: ':Mechanical', type: 'mechanical' },
  { id: 'e6', source: 'brake_system', sourceHandle: 'brake_regen_out', target: 'motor_controller', targetHandle: 'mcu_regen_in', label: ':Regen', type: 'electric' },
  
  // 热管理
  { id: 'e7', source: 'battery_pack', sourceHandle: 'battery_thermal_out', target: 'thermal_mgmt', targetHandle: 'thermal_battery_in', label: ':Thermal', type: 'thermal' },
  { id: 'e8', source: 'motor_controller', sourceHandle: 'mcu_thermal_out', target: 'thermal_mgmt', targetHandle: 'thermal_mcu_in', label: ':Thermal', type: 'thermal' },
  { id: 'e9', source: 'thermal_mgmt', sourceHandle: 'thermal_coolant_out', target: 'drive_motor', targetHandle: 'motor_thermal_in', label: ':Coolant', type: 'thermal' },
  { id: 'e10', source: 'battery_pack', sourceHandle: 'battery_power_out', target: 'thermal_mgmt', targetHandle: 'thermal_power_in', label: ':Power', type: 'electric' },
  
  // 辅助系统
  { id: 'e11', source: 'vehicle_body', sourceHandle: 'body_aux_out', target: 'auxiliary_systems', targetHandle: 'aux_power_in', label: ':Power', type: 'electric' },
  
  // CAN总线
  { id: 'c1', source: 'bms', sourceHandle: 'bms_can_out', target: 'battery_pack', targetHandle: 'battery_can_in', label: ':CAN', type: 'can' },
  { id: 'c2', source: 'bms', sourceHandle: 'bms_can_out', target: 'motor_controller', targetHandle: 'mcu_can_in', label: ':CAN', type: 'can' },
  { id: 'c3', source: 'vehicle_body', sourceHandle: 'body_can_out', target: 'brake_system', targetHandle: 'brake_can_in', label: ':CAN', type: 'can' },
  { id: 'c4', source: 'vehicle_body', sourceHandle: 'body_can_out', target: 'auxiliary_systems', targetHandle: 'aux_can_in', label: ':CAN', type: 'can' },
];

// 自定义 IBD 节点组件
function IBDBlockNode({ data }: NodeProps) {
  const component: IBDComponent = data.component;
  const modelConfig: ModelConfig = data.modelConfig;
  const isConfigured = modelConfig && modelConfig.type !== 'none';

  // 根据分类设置颜色
  const getCategoryColor = () => {
    switch (component.category) {
      case 'power':
        return 'bg-amber-100 border-amber-400';
      case 'control':
        return 'bg-blue-100 border-blue-400';
      case 'thermal':
        return 'bg-orange-100 border-orange-400';
      case 'mechanical':
        return 'bg-green-100 border-green-400';
      default:
        return 'bg-gray-100 border-gray-400';
    }
  };

  // 获取接口类型颜色
  const getInterfaceColor = (interfaceType: string) => {
    switch (interfaceType) {
      case 'electric': return '#ef4444';
      case 'mechanical': return '#3b82f6';
      case 'thermal': return '#f97316';
      case 'signal': return '#22c55e';
      case 'can': return '#a855f7';
      default: return '#9ca3af';
    }
  };

  // 分离左侧和右侧端口
  const leftPorts = component.ports.filter(p => p.position === Position.Left);
  const rightPorts = component.ports.filter(p => p.position === Position.Right);
  
  // 安全处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && data.onQuickUpload) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let modelType: 'fmu' | 'modelica' | 'amesim' = 'modelica';
      if (ext === 'fmu') modelType = 'fmu';
      else if (ext === 'mo') modelType = 'modelica';
      else if (ext === 'ame') modelType = 'amesim';
      
      data.onQuickUpload(component.id, file, modelType);
    }
    e.target.value = '';
  };

  return (
    <div
      className={`px-4 py-3 border-2 rounded-lg shadow-md ${getCategoryColor()} min-w-[160px] relative`}
      style={{ fontSize: '12px' }}
    >
      {/* 左侧输入端口 */}
      {leftPorts.map((port, index) => (
        <React.Fragment key={port.id}>
          <Handle
            type="target"
            position={Position.Left}
            id={port.id}
            className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
            style={{
              background: getInterfaceColor(port.interfaceType),
              top: `${((index + 1) * 100) / (leftPorts.length + 1)}%`,
            }}
          />
        </React.Fragment>
      ))}

      {/* 右侧输出端口 */}
      {rightPorts.map((port, index) => (
        <React.Fragment key={port.id}>
          <Handle
            type="source"
            position={Position.Right}
            id={port.id}
            className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
            style={{
              background: getInterfaceColor(port.interfaceType),
              top: `${((index + 1) * 100) / (rightPorts.length + 1)}%`,
            }}
          />
        </React.Fragment>
      ))}

      {/* 节点内容 */}
      <div className="text-center">
        <div className="font-semibold text-gray-800 mb-1">
          {component.displayName}
        </div>
        <div className="text-xs text-gray-600">
          {component.name}
        </div>
        
        {/* 配置状态指示 */}
        <div className="mt-2 flex items-center justify-center gap-1">
          {isConfigured ? (
            <>
              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-green-600">已配置</span>
            </>
          ) : (
            <>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-gray-400">未配置</span>
            </>
          )}
        </div>

        {/* 模型上传区域 */}
        <div className="mt-2 pt-2 border-t border-gray-200">
          <input
            type="file"
            id={`quick-upload-${component.id}`}
            className="hidden"
            accept=".fmu,.mo,.ame"
            onChange={handleFileChange}
          />
          
          {!isConfigured ? (
            <label
              htmlFor={`quick-upload-${component.id}`}
              className="flex items-center justify-center gap-1 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>点击上传</span>
              </span>
            </label>
          ) : (
            <div className="flex items-center justify-between gap-1 px-2 py-1 bg-green-50 rounded">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <svg className="w-3 h-3 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs text-green-700 truncate" title={modelConfig.fileName}>
                  {modelConfig.fileName}
                </span>
              </div>
              <label
                htmlFor={`quick-upload-${component.id}`}
                className="flex-shrink-0 p-0.5 hover:bg-green-100 rounded cursor-pointer"
                title="重新上传"
              >
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* 点击配置按钮 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          data.onConfigure?.(component.id);
        }}
        className="absolute top-1 right-1 p-1 hover:bg-white/50 rounded"
        title="配置模型"
      >
        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  );
}

const nodeTypes = {
  ibdBlock: IBDBlockNode,
};

export function SSPModelicaNodeConfig({ node, onSave, onCancel, userRole }: SSPModelicaNodeConfigProps) {
  // 优化配置数据获取
  const getNodeParameter = (path: string, defaultValue: any) => {
    return node?.config?.parameters?.[path] || 
           node?.parameters?.[path] || 
           node?.config?.[path] || 
           defaultValue;
  };

  const [config, setConfig] = useState({
    nodeName: node?.name || '架构同步',
    description: node?.description || 'SSP导入与模型配置，支持FMU、Modelica、AMESim等格式',
    timeout: getNodeParameter('timeout', 1200),
    retryCount: getNodeParameter('retryCount', 1),
    autoRun: getNodeParameter('autoRun', true),
    
    // 建模方式
    modelingApproach: getNodeParameter('modelingApproach', 'ssp-import'), // ssp-import | rebuild-modelica | rebuild-amesim
    
    // SSP 源配置
    sourceSSPFile: getNodeParameter('sourceSSPFile', 'project-library'),
    customSSPPath: getNodeParameter('customSSPPath', ''),
    
    // 目标平台
    targetPlatform: getNodeParameter('targetPlatform', 'modelica'),
    modelicaCompiler: getNodeParameter('modelicaCompiler', 'openmodelica'),
    
    // 模型映射配置
    ibdBlockModels: getNodeParameter('ibdBlockModels', {} as Record<string, ModelConfig>),
    modelConfigCompleted: getNodeParameter('modelConfigCompleted', false),
  });

  // 模型配置状态
  const [modelConfigs, setModelConfigs] = useState<Record<string, ModelConfig>>(() => {
    const saved = getNodeParameter('ibdBlockModels', {});
    const initial: Record<string, ModelConfig> = {};
    
    VEHICLE_ENERGY_COMPONENTS.forEach(comp => {
      initial[comp.id] = saved[comp.id] || {
        id: comp.id,
        name: comp.name,
        type: 'none',
        file: null,
        fileName: '',
        filePath: '',
      };
    });
    
    return initial;
  });

  // 当前配置的组件
  const [currentConfigComponent, setCurrentConfigComponent] = useState<string | null>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 配置组件（需要在 useMemo 之前定义）
  const handleConfigureComponent = useCallback((componentId: string) => {
    setCurrentConfigComponent(componentId);
    setIsConfigDialogOpen(true);
  }, []);

  // 处理模型文件上传（需要在 useMemo 之前定义）
  const handleFileUpload = useCallback((componentId: string, file: File | null, modelType: 'fmu' | 'modelica' | 'amesim' | 'none') => {
    const newModelConfig: ModelConfig = {
      id: componentId,
      name: VEHICLE_ENERGY_COMPONENTS.find(c => c.id === componentId)?.name || '',
      type: modelType,
      file: file,
      fileName: file?.name || '',
      filePath: file ? `/models/${componentId}/${file.name}` : '',
      uploadedAt: file ? new Date().toISOString() : undefined,
    };

    setModelConfigs(prev => ({
      ...prev,
      [componentId]: newModelConfig,
    }));
  }, []);

  // 初始化 ReactFlow 节点
  const initialNodes: Node[] = useMemo(() => {
    const layoutConfig = {
      startX: 100,
      startY: 150,
      horizontalSpacing: 220,
      verticalSpacing: 180,
    };

    return [
      // 第一排：电池包、BMS
      {
        id: 'battery_pack',
        type: 'ibdBlock',
        position: { x: layoutConfig.startX, y: layoutConfig.startY },
        data: {
          component: VEHICLE_ENERGY_COMPONENTS.find(c => c.id === 'battery_pack'),
          modelConfig: modelConfigs['battery_pack'],
          onConfigure: handleConfigureComponent,
          onQuickUpload: handleFileUpload,
        },
      },
      {
        id: 'bms',
        type: 'ibdBlock',
        position: { x: layoutConfig.startX, y: layoutConfig.startY - 120 },
        data: {
          component: VEHICLE_ENERGY_COMPONENTS.find(c => c.id === 'bms'),
          modelConfig: modelConfigs['bms'],
          onConfigure: handleConfigureComponent,
          onQuickUpload: handleFileUpload,
        },
      },
      // 第二排：电机控制器
      {
        id: 'motor_controller',
        type: 'ibdBlock',
        position: { x: layoutConfig.startX + layoutConfig.horizontalSpacing, y: layoutConfig.startY },
        data: {
          component: VEHICLE_ENERGY_COMPONENTS.find(c => c.id === 'motor_controller'),
          modelConfig: modelConfigs['motor_controller'],
          onConfigure: handleConfigureComponent,
          onQuickUpload: handleFileUpload,
        },
      },
      // 第三排：驱动电机
      {
        id: 'drive_motor',
        type: 'ibdBlock',
        position: { x: layoutConfig.startX + layoutConfig.horizontalSpacing * 2, y: layoutConfig.startY },
        data: {
          component: VEHICLE_ENERGY_COMPONENTS.find(c => c.id === 'drive_motor'),
          modelConfig: modelConfigs['drive_motor'],
          onConfigure: handleConfigureComponent,
          onQuickUpload: handleFileUpload,
        },
      },
      // 第四排：传动系统
      {
        id: 'transmission',
        type: 'ibdBlock',
        position: { x: layoutConfig.startX + layoutConfig.horizontalSpacing * 3, y: layoutConfig.startY },
        data: {
          component: VEHICLE_ENERGY_COMPONENTS.find(c => c.id === 'transmission'),
          modelConfig: modelConfigs['transmission'],
          onConfigure: handleConfigureComponent,
          onQuickUpload: handleFileUpload,
        },
      },
      // 第五排：车身控制
      {
        id: 'vehicle_body',
        type: 'ibdBlock',
        position: { x: layoutConfig.startX + layoutConfig.horizontalSpacing * 4, y: layoutConfig.startY },
        data: {
          component: VEHICLE_ENERGY_COMPONENTS.find(c => c.id === 'vehicle_body'),
          modelConfig: modelConfigs['vehicle_body'],
          onConfigure: handleConfigureComponent,
          onQuickUpload: handleFileUpload,
        },
      },
      // 制动系统（在车身下方）
      {
        id: 'brake_system',
        type: 'ibdBlock',
        position: { x: layoutConfig.startX + layoutConfig.horizontalSpacing * 3.5, y: layoutConfig.startY + layoutConfig.verticalSpacing },
        data: {
          component: VEHICLE_ENERGY_COMPONENTS.find(c => c.id === 'brake_system'),
          modelConfig: modelConfigs['brake_system'],
          onConfigure: handleConfigureComponent,
          onQuickUpload: handleFileUpload,
        },
      },
      // 热管理系统（在电池下方）
      {
        id: 'thermal_mgmt',
        type: 'ibdBlock',
        position: { x: layoutConfig.startX + layoutConfig.horizontalSpacing, y: layoutConfig.startY + layoutConfig.verticalSpacing },
        data: {
          component: VEHICLE_ENERGY_COMPONENTS.find(c => c.id === 'thermal_mgmt'),
          modelConfig: modelConfigs['thermal_mgmt'],
          onConfigure: handleConfigureComponent,
          onQuickUpload: handleFileUpload,
        },
      },
      // 辅助系统（在车身下方）
      {
        id: 'auxiliary_systems',
        type: 'ibdBlock',
        position: { x: layoutConfig.startX + layoutConfig.horizontalSpacing * 4.5, y: layoutConfig.startY + layoutConfig.verticalSpacing },
        data: {
          component: VEHICLE_ENERGY_COMPONENTS.find(c => c.id === 'auxiliary_systems'),
          modelConfig: modelConfigs['auxiliary_systems'],
          onConfigure: handleConfigureComponent,
          onQuickUpload: handleFileUpload,
        },
      },
    ];
  }, [modelConfigs]);

  // 初始化 ReactFlow 边
  const initialEdges: Edge[] = useMemo(() => {
    // 按源节点分组，计算每个源节点的输出边数量
    const edgesBySource: Record<string, typeof VEHICLE_ENERGY_CONNECTIONS> = {};
    VEHICLE_ENERGY_CONNECTIONS.forEach(conn => {
      if (!edgesBySource[conn.source]) {
        edgesBySource[conn.source] = [];
      }
      edgesBySource[conn.source].push(conn);
    });

    // 为每条边分配偏移量
    const edgeOffsets: Record<string, number> = {};
    Object.entries(edgesBySource).forEach(([source, conns]) => {
      if (conns.length > 1) {
        conns.forEach((conn, index) => {
          // 计算偏移量：中心对齐，均匀分布
          const totalOffset = (conns.length - 1) * 20;
          edgeOffsets[conn.id] = (index * 20) - (totalOffset / 2);
        });
      } else {
        edgeOffsets[conns[0].id] = 0;
      }
    });

    return VEHICLE_ENERGY_CONNECTIONS.map(conn => {
      let strokeColor = '#9ca3af';
      let strokeWidth = 2;
      let strokeDasharray = '0';
      
      switch (conn.type) {
        case 'electric':
          strokeColor = '#ef4444';
          strokeWidth = 3;
          break;
        case 'mechanical':
          strokeColor = '#3b82f6';
          strokeWidth = 3;
          break;
        case 'thermal':
          strokeColor = '#f97316';
          strokeWidth = 2;
          strokeDasharray = '5,5';
          break;
        case 'signal':
          strokeColor = '#22c55e';
          strokeWidth = 1;
          break;
        case 'can':
          strokeColor = '#a855f7';
          strokeWidth = 2;
          break;
      }

      const offset = edgeOffsets[conn.id] || 0;

      return {
        id: conn.id,
        source: conn.source,
        target: conn.target,
        sourceHandle: conn.sourceHandle,
        targetHandle: conn.targetHandle,
        label: conn.label,
        type: 'smoothstep',
        animated: conn.type === 'electric' || conn.type === 'mechanical',
        style: {
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray,
        },
        labelStyle: {
          fontSize: 10,
          fill: strokeColor,
          fontWeight: 600,
        },
        labelBgStyle: {
          fill: 'white',
          fillOpacity: 0.8,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 15,
          height: 15,
          color: strokeColor,
        },
        // 添加路径偏移量，让多条边分散开
        data: {
          offset: offset,
        },
      };
    });
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 更新节点数据
  const updateNodeData = useCallback((componentId: string, newModelConfig: ModelConfig) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === componentId) {
          return {
            ...node,
            data: {
              ...node.data,
              modelConfig: newModelConfig,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  // 计算配置进度
  const configProgress = useMemo(() => {
    const total = VEHICLE_ENERGY_COMPONENTS.length;
    const configured = Object.values(modelConfigs).filter(mc => mc.type !== 'none').length;
    return { configured, total };
  }, [modelConfigs]);

  // 一键应用默认配置
  const handleApplyDefaultConfig = () => {
    const defaultConfigs: Record<string, ModelConfig> = {};
    
    VEHICLE_ENERGY_COMPONENTS.forEach(comp => {
      defaultConfigs[comp.id] = {
        id: comp.id,
        name: comp.name,
        type: 'modelica',
        fileName: `${comp.id}_default.mo`,
        filePath: `/models/defaults/${comp.id}_default.mo`,
        uploadedAt: new Date().toISOString(),
      };
    });

    setModelConfigs(defaultConfigs);
    
    // 更新所有节点
    VEHICLE_ENERGY_COMPONENTS.forEach(comp => {
      updateNodeData(comp.id, defaultConfigs[comp.id]);
    });

    alert('已应用默认配置！所有组件已配置为默认 Modelica 模型。');
  };

  // 保存配置
  const handleSave = () => {
    const allBlocksConfigured = Object.values(modelConfigs).every(mc => mc.type !== 'none');

    const nodeConfig = {
      nodeName: config.nodeName,
      description: config.description,
      priority: '高',
      autoExecute: config.autoRun,
      timeout: config.timeout,
      retryCount: config.retryCount,
      parameters: {
        modelingApproach: config.modelingApproach,
        sourceSSPFile: config.sourceSSPFile,
        customSSPPath: config.customSSPPath,
        targetPlatform: config.targetPlatform,
        modelicaCompiler: config.modelicaCompiler,
        modelConfigCompleted: allBlocksConfigured,
        ibdBlockModels: modelConfigs,
      }
    };

    onSave(nodeConfig);
    alert(`节点 "${config.nodeName}" 配置已保存成功！\n\n已配置 ${configProgress.configured}/${configProgress.total} 个组件的模型映射。`);
  };

  // 渲染配置对话框
  const renderConfigDialog = () => {
    if (!currentConfigComponent) return null;

    const component = VEHICLE_ENERGY_COMPONENTS.find(c => c.id === currentConfigComponent);
    const modelConfig = modelConfigs[currentConfigComponent];

    if (!component) return null;

    return (
      <Dialog open={isConfigDialogOpen} onOpenChange={setIsConfigDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>配置组件模型：{component.name}</DialogTitle>
            <DialogDescription>
              {component.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label>模型类型</Label>
              <Select
                value={modelConfig.type}
                onValueChange={(value: any) => {
                  setModelConfigs(prev => ({
                    ...prev,
                    [currentConfigComponent]: {
                      ...prev[currentConfigComponent],
                      type: value,
                      file: null,
                      fileName: '',
                    }
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">未配置</SelectItem>
                  <SelectItem value="fmu">FMU 模型 (.fmu)</SelectItem>
                  <SelectItem value="modelica">Modelica 模型 (.mo)</SelectItem>
                  <SelectItem value="amesim">AMESim 模型 (.ame)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {modelConfig.type !== 'none' && (
              <div>
                <Label>上传模型文件</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id={`file-upload-${currentConfigComponent}`}
                    className="hidden"
                    accept={
                      modelConfig.type === 'fmu' ? '.fmu' :
                      modelConfig.type === 'modelica' ? '.mo' :
                      modelConfig.type === 'amesim' ? '.ame' : '*'
                    }
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleFileUpload(currentConfigComponent, file, modelConfig.type as any);
                    }}
                  />
                  <label
                    htmlFor={`file-upload-${currentConfigComponent}`}
                    className="cursor-pointer"
                  >
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      点击上传或拖拽文件到此处
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      支持 {modelConfig.type.toUpperCase()} 格式
                    </p>
                  </label>
                </div>

                {modelConfig.fileName && (
                  <div className="mt-3 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm text-green-700 flex-1">{modelConfig.fileName}</span>
                    <button
                      onClick={() => {
                        handleFileUpload(currentConfigComponent, null, 'none');
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 组件接口信息 */}
            <div className="mt-4">
              <Label>组件接口</Label>
              <div className="mt-2 space-y-2">
                {component.ports.map(port => (
                  <div key={port.id} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        background: port.interfaceType === 'electric' ? '#ef4444' :
                                   port.interfaceType === 'mechanical' ? '#3b82f6' :
                                   port.interfaceType === 'thermal' ? '#f97316' :
                                   port.interfaceType === 'signal' ? '#22c55e' :
                                   '#a855f7',
                      }}
                    />
                    <span className="font-medium">{port.name}</span>
                    <span className="text-gray-500">
                      ({port.type === 'input' ? '输入' : port.type === 'output' ? '输出' : '双向'})
                    </span>
                    <span className="text-xs text-gray-400">
                      {port.interfaceType === 'electric' ? '电能' :
                       port.interfaceType === 'mechanical' ? '机械能' :
                       port.interfaceType === 'thermal' ? '热能' :
                       port.interfaceType === 'signal' ? '信号' : 'CAN总线'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
              关闭
            </Button>
            <Button onClick={() => {
              updateNodeData(currentConfigComponent, modelConfigs[currentConfigComponent]);
              setIsConfigDialogOpen(false);
            }}>
              确认配置
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // 渲染架构图（全屏或嵌入）
  const renderArchitectureDiagram = () => (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'} flex flex-col`}>
      {/* 工具栏 */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div>
          <h4 className="font-medium">整车能耗系统 IBD 架构图</h4>
          <p className="text-xs text-gray-500">配置进度: {configProgress.configured}/{configProgress.total} 个组件</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleApplyDefaultConfig}>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            应用默认配置
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            )}
          </Button>
        </div>
      </div>

      {/* 图例 */}
      <div className="p-2 border-b bg-gray-50 flex items-center gap-4 text-xs flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-3 h-1 bg-red-500"></div>
          <span>电能流</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-1 bg-blue-500"></div>
          <span>机械能流</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-1 bg-orange-500 border-dashed border-t-2"></div>
          <span>热能</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-1 bg-green-500"></div>
          <span>控制信号</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-1 bg-purple-500"></div>
          <span>CAN总线</span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-amber-100 border-2 border-amber-400 rounded"></div>
          <span>动力组件</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-100 border-2 border-blue-400 rounded"></div>
          <span>控制组件</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-orange-100 border-2 border-orange-400 rounded"></div>
          <span>热管理</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-400 rounded"></div>
          <span>机械组件</span>
        </div>
      </div>

      {/* ReactFlow 画布 */}
      <div className="flex-1" style={{ height: isFullscreen ? 'calc(100vh - 140px)' : '500px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          minZoom={0.2}
          maxZoom={1.5}
          defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{
            type: 'smoothstep',
          }}
        >
          <Background color="#f0f0f0" gap={16} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              const modelConfig = node.data?.modelConfig;
              return modelConfig && modelConfig.type !== 'none' ? '#22c55e' : '#d1d5db';
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />
        </ReactFlow>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">架构同步节点配置</h3>
        <p className="text-sm text-muted-foreground mt-1">
          配置整车能耗系统 IBD 架构和模型映射
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">基础设置</TabsTrigger>
          <TabsTrigger value="architecture">架构与模型配置</TabsTrigger>
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
            <Label htmlFor="modelingApproach">建模方式</Label>
            <Select
              value={config.modelingApproach}
              onValueChange={(value) => setConfig({ ...config, modelingApproach: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ssp-import">SSP 导入模式</SelectItem>
                <SelectItem value="rebuild-modelica">基于 Modelica 重新建模</SelectItem>
                <SelectItem value="rebuild-amesim">基于 AMESim 重新建模</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              {config.modelingApproach === 'ssp-import' && '从现有 SSP 文件导入架构和模型'}
              {config.modelingApproach === 'rebuild-modelica' && '使用 Modelica 工具重新构建模型'}
              {config.modelingApproach === 'rebuild-amesim' && '使用 AMESim 工具重新构建模型'}
            </p>
          </div>

          {config.modelingApproach === 'ssp-import' && (
            <>
              <div>
                <Label htmlFor="sourceSSPFile">SSP 文件来源</Label>
                <Select
                  value={config.sourceSSPFile}
                  onValueChange={(value) => setConfig({ ...config, sourceSSPFile: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local-upload">本地上传</SelectItem>
                    <SelectItem value="project-library">项目库文件</SelectItem>
                    <SelectItem value="system-default">系统默认 SSP</SelectItem>
                    <SelectItem value="recent-files">最近使用文件</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {config.sourceSSPFile === 'local-upload' && (
                <div>
                  <Label htmlFor="customSSPPath">SSP 文件路径</Label>
                  <Input
                    id="customSSPPath"
                    value={config.customSSPPath}
                    onChange={(e) => setConfig({ ...config, customSSPPath: e.target.value })}
                    placeholder="/path/to/vehicle_energy.ssp"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <Label htmlFor="targetPlatform">目标仿真平台</Label>
            <Select
              value={config.targetPlatform}
              onValueChange={(value) => setConfig({ ...config, targetPlatform: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modelica">Modelica</SelectItem>
                <SelectItem value="amesim">AMESim</SelectItem>
                <SelectItem value="simulink">Simulink</SelectItem>
                <SelectItem value="dymola">Dymola</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {config.targetPlatform === 'modelica' && (
            <div>
              <Label htmlFor="modelicaCompiler">Modelica 编译器</Label>
              <Select
                value={config.modelicaCompiler}
                onValueChange={(value) => setConfig({ ...config, modelicaCompiler: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openmodelica">OpenModelica</SelectItem>
                  <SelectItem value="dymola">Dymola</SelectItem>
                  <SelectItem value="jmodelica">JModelica</SelectItem>
                  <SelectItem value="mworks">MWorks</SelectItem>
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
                onChange={(e) => setConfig({ ...config, timeout: parseInt(e.target.value) || 1200 })}
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

        {/* 架构与模型配置 */}
        <TabsContent value="architecture" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">整车能耗系统架构</CardTitle>
              <CardDescription>
                基于 SysML IBD 的整车能耗系统内部结构图，包含 {VEHICLE_ENERGY_COMPONENTS.length} 个核心组件
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* 配置进度 */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">模型配置进度</span>
                    <span className="text-sm font-medium">
                      {configProgress.configured} / {configProgress.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(configProgress.configured / configProgress.total) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    点击架构图中的组件节点配置模型文件
                  </p>
                </div>

                {/* 架构图 */}
                {renderArchitectureDiagram()}

                {/* 提示信息 */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-amber-800">
                      <p className="font-medium mb-1">配置说明：</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>点击组件右上角的 ⚙️ 图标打开配置对话框</li>
                        <li>选择模型类型（FMU、Modelica、AMESim）并上传对应文件</li>
                        <li>接口连线表示组件之间的能量流和信号传递关系</li>
                        <li>可使用"应用默认配置"快速配置所有组件</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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

      {/* 配置对话框 */}
      {renderConfigDialog()}

      {/* 全屏架构图门户 */}
      {isFullscreen && createPortal(
        renderArchitectureDiagram(),
        document.body
      )}
    </div>
  );
}