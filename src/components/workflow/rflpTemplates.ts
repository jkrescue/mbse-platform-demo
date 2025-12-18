// RFLP模板定义文件 - 基于现有nodeConfig组件
export interface RFLPTemplate {
  id: string
  name: string
  description: string
  domain: 'automotive' | 'aerospace' | 'general'
  layers: RFLPLayers
  presetNodes: PresetNode[]
  presetConnections: Connection[]
  validationRules: ValidationRule[]
}

export interface RFLPLayers {
  requirements: {
    name: string
    color: string
    nodeTypes: string[]
  }
  functions: {
    name: string
    color: string
    nodeTypes: string[]
  }
  logical: {
    name: string
    color: string
    nodeTypes: string[]
  }
  physical: {
    name: string
    color: string
    nodeTypes: string[]
  }
}

export interface PresetNode {
  id: string
  type: string
  position: { x: number; y: number }
  layer: 'requirements' | 'functions' | 'logical' | 'physical'
  data: {
    label: string
    config?: Record<string, any>
  }
}

export interface Connection {
  id: string
  source: string
  target: string
  type: 'traceability' | 'decomposition' | 'realization'
  label: string
}

export interface ValidationRule {
  rule: string
  description: string
  level: 'error' | 'warning'
}

// RFLP层定义
export const rflpLayers: RFLPLayers = {
  requirements: {
    name: '需求层',
    color: '#ef4444',
    nodeTypes: ['RequirementCreation', 'RequirementSync', 'EnergyRequirementSync']
  },
  functions: {
    name: '功能层',
    color: '#3b82f6',
    nodeTypes: ['FunctionSystemDesign']
  },
  logical: {
    name: '逻辑层',
    color: '#8b5cf6',
    nodeTypes: ['VehicleSafetyArch', 'SSPArchConversion']
  },
  physical: {
    name: '物理层',
    color: '#10b981',
    nodeTypes: ['BatteryThermalDesign', 'BatteryModelSim', 'EnergySimulation', 'MWorksSim', 'DOEAnalysis']
  }
}

// 节点类型显示名称映射
export const nodeTypeDisplayNames: Record<string, string> = {
  'RequirementCreation': '需求创建',
  'RequirementSync': '需求同步',
  'EnergyRequirementSync': '能量需求同步',
  'FunctionSystemDesign': '功能系统设计',
  'VehicleSafetyArch': '车辆安全架构',
  'SSPArchConversion': 'SSP架构转换',
  'BatteryThermalDesign': '电池热管理设计',
  'BatteryModelSim': '电池建模仿真',
  'EnergySimulation': '能量仿真',
  'MWorksSim': 'M-WORKS仿真',
  'DOEAnalysis': 'DOE分析'
}

// 预定义的汽车RFLP模板
export const automotiveRFLPTemplates: RFLPTemplate[] = [
  {
    id: 'ev-powertrain',
    name: '电动汽车动力总成RFLP',
    description: '基于RFLP的电动汽车动力总成系统工程模板',
    domain: 'automotive',
    layers: rflpLayers,
    presetNodes: [
      // Requirements层
      {
        id: 'req-1',
        type: 'RequirementCreation',
        position: { x: 100, y: 100 },
        layer: 'requirements',
        data: {
          label: '需求创建',
          config: {
            requirementType: '功能需求',
            priority: '高',
            stakeholder: '整车工程师'
          }
        }
      },
      {
        id: 'req-2',
        type: 'EnergyRequirementSync',
        position: { x: 550, y: 100 },
        layer: 'requirements',
        data: {
          label: '黑需求同步',
          config: {
            energyType: '电能',
            performanceTarget: '续航里程500km'
          }
        }
      },
      // Functions层
      {
        id: 'func-1',
        type: 'FunctionSystemDesign',
        position: { x: 300, y: 280 },
        layer: 'functions',
        data: {
          label: '系统架构设计',
          config: {
            functionType: '能量转换',
            designMethod: 'SysML'
          }
        }
      },
      // Logical层
      {
        id: 'logic-1',
        type: 'VehicleSafetyArch',
        position: { x: 150, y: 460 },
        layer: 'logical',
        data: {
          label: '网安全架构',
          config: {
            safetyLevel: 'ASIL-D',
            archStyle: '分层架构'
          }
        }
      },
      {
        id: 'logic-2',
        type: 'SSPArchConversion',
        position: { x: 550, y: 460 },
        layer: 'logical',
        data: {
          label: 'JP架构转换',
          config: {
            inputFormat: 'SysML',
            outputFormat: 'SSP'
          }
        }
      },
      // Physical层
      {
        id: 'phy-1',
        type: 'BatteryThermalDesign',
        position: { x: 100, y: 620 },
        layer: 'physical',
        data: {
          label: '电池管理设计',
          config: {
            coolingType: '液冷',
            targetTemp: '25-35°C'
          }
        }
      },
      {
        id: 'phy-2',
        type: 'EnergySimulation',
        position: { x: 350, y: 620 },
        layer: 'physical',
        data: {
          label: '量仿真',
          config: {
            driveCycle: 'NEDC',
            tool: 'M-WORKS'
          }
        }
      },
      {
        id: 'phy-3',
        type: 'BatteryModelSim',
        position: { x: 600, y: 760 },
        layer: 'physical',
        data: {
          label: '电池集仿真',
          config: {
            modelType: '等效电路模型',
            tool: 'Modelica'
          }
        }
      }
    ],
    presetConnections: [
      // 严格串行连接：需求创建 -> 黑需求同步 -> 系统架构设计 -> 网安全架构 -> JP架构转换 -> 电池管理设计 -> 量仿真 -> 电池集仿真
      {
        id: 'conn-1',
        source: 'req-1',
        target: 'req-2',
        type: 'traceability',
        label: '串行流程'
      },
      {
        id: 'conn-2',
        source: 'req-2',
        target: 'func-1',
        type: 'traceability',
        label: '串行流程'
      },
      {
        id: 'conn-3',
        source: 'func-1',
        target: 'logic-1',
        type: 'decomposition',
        label: '串行流程'
      },
      {
        id: 'conn-4',
        source: 'logic-1',
        target: 'logic-2',
        type: 'decomposition',
        label: '串行流程'
      },
      {
        id: 'conn-5',
        source: 'logic-2',
        target: 'phy-1',
        type: 'realization',
        label: '串行流程'
      },
      {
        id: 'conn-6',
        source: 'phy-1',
        target: 'phy-2',
        type: 'realization',
        label: '串行流程'
      },
      {
        id: 'conn-7',
        source: 'phy-2',
        target: 'phy-3',
        type: 'realization',
        label: '串行流程'
      }
    ],
    validationRules: [
      {
        rule: 'requirements_coverage',
        description: '每个需求必须有对应的功能实现',
        level: 'error'
      },
      {
        rule: 'function_decomposition',
        description: '功能必须分解到逻辑架构',
        level: 'warning'
      },
      {
        rule: 'architecture_realization',
        description: '逻辑架构必须有物理实现',
        level: 'error'
      }
    ]
  },

  {
    id: 'chassis-system',
    name: '底盘系统RFLP',
    description: '底盘悬挂、制动、转向系统的RFLP模板',
    domain: 'automotive',
    layers: rflpLayers,
    presetNodes: [
      // Requirements层
      {
        id: 'req-chassis-1',
        type: 'RequirementCreation',
        position: { x: 100, y: 100 },
        layer: 'requirements',
        data: {
          label: '底盘性能需求',
          config: {
            requirementType: '性能需求',
            priority: '高',
            stakeholder: '底盘工程师'
          }
        }
      },
      {
        id: 'req-chassis-2',
        type: 'RequirementSync',
        position: { x: 350, y: 100 },
        layer: 'requirements',
        data: {
          label: '安全需求同步',
          config: {
            syncTarget: '整车安全系统',
            priority: '高'
          }
        }
      },
      // Functions层
      {
        id: 'func-chassis-1',
        type: 'FunctionSystemDesign',
        position: { x: 225, y: 250 },
        layer: 'functions',
        data: {
          label: '底盘功能设计',
          config: {
            functionType: '操控与稳定',
            designMethod: 'SysML'
          }
        }
      },
      // Logical层
      {
        id: 'logic-chassis-1',
        type: 'VehicleSafetyArch',
        position: { x: 225, y: 400 },
        layer: 'logical',
        data: {
          label: '底盘安全架构',
          config: {
            safetyLevel: 'ASIL-C',
            archStyle: '模块化架构'
          }
        }
      },
      // Physical层
      {
        id: 'phy-chassis-1',
        type: 'DOEAnalysis',
        position: { x: 125, y: 550 },
        layer: 'physical',
        data: {
          label: '悬挂参数优化',
          config: {
            analysisType: '多目标优化',
            variables: '刚度、阻尼参数'
          }
        }
      },
      {
        id: 'phy-chassis-2',
        type: 'EnergySimulation',
        position: { x: 325, y: 550 },
        layer: 'physical',
        data: {
          label: '制动性能仿真',
          config: {
            simulationType: '制动距离',
            tool: 'M-WORKS'
          }
        }
      }
    ],
    presetConnections: [
      {
        id: 'conn-chassis-1',
        source: 'req-chassis-1',
        target: 'func-chassis-1',
        type: 'traceability',
        label: '需求追溯'
      },
      {
        id: 'conn-chassis-2',
        source: 'req-chassis-2',
        target: 'func-chassis-1',
        type: 'traceability',
        label: '需求追溯'
      },
      {
        id: 'conn-chassis-3',
        source: 'func-chassis-1',
        target: 'logic-chassis-1',
        type: 'decomposition',
        label: '功能分解'
      },
      {
        id: 'conn-chassis-4',
        source: 'logic-chassis-1',
        target: 'phy-chassis-1',
        type: 'realization',
        label: '架构实现'
      },
      {
        id: 'conn-chassis-5',
        source: 'logic-chassis-1',
        target: 'phy-chassis-2',
        type: 'realization',
        label: '架构实现'
      }
    ],
    validationRules: [
      {
        rule: 'safety_requirements',
        description: '安全需求必须完整覆盖',
        level: 'error'
      },
      {
        rule: 'performance_validation',
        description: '性能参数必须通过仿真验证',
        level: 'warning'
      }
    ]
  },

  {
    id: 'adas-system',
    name: '智能驾驶RFLP',
    description: 'ADAS/自动驾驶系统的RFLP模板',
    domain: 'automotive',
    layers: rflpLayers,
    presetNodes: [
      // Requirements层
      {
        id: 'req-adas-1',
        type: 'RequirementCreation',
        position: { x: 100, y: 100 },
        layer: 'requirements',
        data: {
          label: 'ADAS功能需求',
          config: {
            requirementType: '功能需求',
            priority: '高',
            stakeholder: 'ADAS工程师'
          }
        }
      },
      {
        id: 'req-adas-2',
        type: 'RequirementSync',
        position: { x: 350, y: 100 },
        layer: 'requirements',
        data: {
          label: '法规需求同步',
          config: {
            syncTarget: 'ISO26262标准',
            priority: '高'
          }
        }
      },
      // Functions层
      {
        id: 'func-adas-1',
        type: 'FunctionSystemDesign',
        position: { x: 225, y: 250 },
        layer: 'functions',
        data: {
          label: '感知决策功能',
          config: {
            functionType: '感知与控制',
            designMethod: 'SysML'
          }
        }
      },
      // Logical层
      {
        id: 'logic-adas-1',
        type: 'VehicleSafetyArch',
        position: { x: 125, y: 400 },
        layer: 'logical',
        data: {
          label: 'ADAS安全架构',
          config: {
            safetyLevel: 'ASIL-B',
            archStyle: '冗余架构'
          }
        }
      },
      {
        id: 'logic-adas-2',
        type: 'SSPArchConversion',
        position: { x: 325, y: 400 },
        layer: 'logical',
        data: {
          label: '算法模型转换',
          config: {
            inputFormat: 'Simulink',
            outputFormat: 'C代码'
          }
        }
      },
      // Physical层
      {
        id: 'phy-adas-1',
        type: 'MWorksSim',
        position: { x: 125, y: 550 },
        layer: 'physical',
        data: {
          label: '感知算法仿真',
          config: {
            simulationType: '环境感知',
            tool: 'M-WORKS'
          }
        }
      },
      {
        id: 'phy-adas-2',
        type: 'DOEAnalysis',
        position: { x: 325, y: 550 },
        layer: 'physical',
        data: {
          label: '控制参数优化',
          config: {
            analysisType: '响应面分析',
            variables: '控制参数'
          }
        }
      }
    ],
    presetConnections: [
      {
        id: 'conn-adas-1',
        source: 'req-adas-1',
        target: 'func-adas-1',
        type: 'traceability',
        label: '需求追溯'
      },
      {
        id: 'conn-adas-2',
        source: 'req-adas-2',
        target: 'func-adas-1',
        type: 'traceability',
        label: '需求追溯'
      },
      {
        id: 'conn-adas-3',
        source: 'func-adas-1',
        target: 'logic-adas-1',
        type: 'decomposition',
        label: '功能分解'
      },
      {
        id: 'conn-adas-4',
        source: 'func-adas-1',
        target: 'logic-adas-2',
        type: 'decomposition',
        label: '功能分解'
      },
      {
        id: 'conn-adas-5',
        source: 'logic-adas-1',
        target: 'phy-adas-1',
        type: 'realization',
        label: '架构实现'
      },
      {
        id: 'conn-adas-6',
        source: 'logic-adas-2',
        target: 'phy-adas-2',
        type: 'realization',
        label: '架构实现'
      }
    ],
    validationRules: [
      {
        rule: 'functional_safety',
        description: '功能安全要求必须满足',
        level: 'error'
      },
      {
        rule: 'algorithm_validation',
        description: '算法必须通过仿真验证',
        level: 'warning'
      }
    ]
  }
]

// 根据用户角色获取推荐模板
export const getRecommendedTemplates = (userRole?: string): RFLPTemplate[] => {
  return automotiveRFLPTemplates.filter(template => {
    if (userRole === 'admin') return true // 管理员看到所有模板
    if (userRole === 'architect') return true // 架构师看到所有模板
    if (userRole === 'simulation') {
      // 仿真工程师偏向于包含仿真节点较多的模板
      return template.presetNodes.some(node => 
        ['EnergySimulation', 'BatteryModelSim', 'MWorksSim', 'DOEAnalysis'].includes(node.type)
      )
    }
    if (userRole === 'modeling') {
      // 建模工程师偏向于包含建模相关的模板
      return template.presetNodes.some(node =>
        ['BatteryModelSim', 'FunctionSystemDesign', 'SSPArchConversion'].includes(node.type)
      )
    }
    if (userRole === 'projectManager') {
      // 项目经理偏向于需求管理相关的模板
      return template.presetNodes.some(node =>
        ['RequirementCreation', 'RequirementSync'].includes(node.type)
      )
    }
    return true
  })
}