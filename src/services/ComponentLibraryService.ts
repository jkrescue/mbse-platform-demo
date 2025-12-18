// 组件库统一数据服务
import { ComponentDependency, ToolServiceDependency, ModelVersionDependency } from '../types/appDependencies';

// MBSE组件库标准分类体系
export const COMPONENT_CATEGORIES = {
  REQUIREMENT: 'requirement-management',      // 需求管理及同步
  ARCHITECTURE: 'function-architecture',     // 功能与架构设计
  SIMULATION: 'system-integration-sim',       // 系统集成仿真
  CAE: 'cae-simulation',                     // 专业CAE仿真
  VALIDATION: 'verification-validation',      // 验证与确认
  OPTIMIZATION: 'optimization-analysis'       // 优化分析
} as const;

// 工具链标签映射
export const TOOL_CHAIN_TAGS = {
  POLARION: 'POLARION-DOORS',
  EA: 'EA-MAGICDRAW', 
  MWORKS: 'MWORKS-MODELICA',
  ANSYS: 'ANSYS-ABAQUS',
  TESTSTAND: 'TESTSTAND-VV',
  OPTISLANG: 'OPTISLANG-DOE'
} as const;

// 组件库服务类
export class ComponentLibraryService {
  private static instance: ComponentLibraryService;
  private components: Map<string, ComponentDependency> = new Map();
  private toolServices: Map<string, ToolServiceDependency> = new Map();
  private models: Map<string, ModelVersionDependency> = new Map();

  private constructor() {
    this.initializeComponentLibrary();
  }

  public static getInstance(): ComponentLibraryService {
    if (!ComponentLibraryService.instance) {
      ComponentLibraryService.instance = new ComponentLibraryService();
    }
    return ComponentLibraryService.instance;
  }

  // 初始化组件库数据
  private initializeComponentLibrary() {
    // 需求管理组件
    this.addComponent({
      id: 'polarion-connector',
      name: 'POLARION连接器',
      type: 'atomic',
      version: '2.1.0',
      category: COMPONENT_CATEGORIES.REQUIREMENT,
      status: 'stable',
      usageCount: 156,
      lastUsed: '2024-01-08 14:30',
      metadata: {
        description: '连接POLARION ALM系统，实现需求数据同步和协作',
        author: 'MBSE团队',
        documentation: '/docs/polarion-connector',
        repository: 'https://github.com/mbse/polarion-connector',
        license: 'MIT',
        size: 2048
      },
      compatibility: {
        minPlatformVersion: '1.0.0',
        maxPlatformVersion: '2.0.0',
        conflictsWith: [],
        recommendedWith: ['doors-connector', 'reqtify-tracer']
      }
    });

    this.addComponent({
      id: 'doors-connector',
      name: 'IBM DOORS连接器',
      type: 'atomic',
      version: '1.8.3',
      category: COMPONENT_CATEGORIES.REQUIREMENT,
      status: 'stable',
      usageCount: 89,
      lastUsed: '2024-01-08 12:15',
      metadata: {
        description: '连接IBM DOORS数据库，支持DXL脚本执行',
        author: 'MBSE团队',
        documentation: '/docs/doors-connector',
        repository: 'https://github.com/mbse/doors-connector',
        license: 'MIT',
        size: 1536
      },
      compatibility: {
        minPlatformVersion: '1.0.0',
        conflictsWith: [],
        recommendedWith: ['polarion-connector']
      }
    });

    this.addComponent({
      id: 'reqtify-tracer',
      name: 'ReqTify追溯管理器',
      type: 'composite',
      version: '3.2.1',
      category: COMPONENT_CATEGORIES.REQUIREMENT,
      status: 'stable',
      usageCount: 134,
      lastUsed: '2024-01-08 16:45',
      metadata: {
        description: '端到端需求追溯和验证管理工具',
        author: 'MBSE团队',
        documentation: '/docs/reqtify-tracer',
        repository: 'https://github.com/mbse/reqtify-tracer',
        license: 'MIT',
        size: 3072
      },
      compatibility: {
        minPlatformVersion: '1.2.0',
        conflictsWith: [],
        recommendedWith: ['polarion-connector', 'doors-connector']
      }
    });

    // 架构设计组件
    this.addComponent({
      id: 'ea-connector',
      name: 'Enterprise Architect连接器',
      type: 'atomic',
      version: '2.5.0',
      category: COMPONENT_CATEGORIES.ARCHITECTURE,
      status: 'stable',
      usageCount: 278,
      lastUsed: '2024-01-08 15:20',
      metadata: {
        description: '连接EA项目数据库，支持UML/SysML模型操作',
        author: 'MBSE团队',
        documentation: '/docs/ea-connector',
        repository: 'https://github.com/mbse/ea-connector',
        license: 'MIT',
        size: 1792
      },
      compatibility: {
        minPlatformVersion: '1.0.0',
        conflictsWith: [],
        recommendedWith: ['sysml-converter', 'magicdraw-connector']
      }
    });

    this.addComponent({
      id: 'magicdraw-connector',
      name: 'MagicDraw连接器',
      type: 'atomic',
      version: '1.9.2',
      category: COMPONENT_CATEGORIES.ARCHITECTURE,
      status: 'stable',
      usageCount: 167,
      lastUsed: '2024-01-08 11:30',
      metadata: {
        description: '连接MagicDraw项目，支持专业SysML建模',
        author: 'MBSE团队',
        documentation: '/docs/magicdraw-connector',
        repository: 'https://github.com/mbse/magicdraw-connector',
        license: 'MIT',
        size: 2304
      },
      compatibility: {
        minPlatformVersion: '1.1.0',
        conflictsWith: [],
        recommendedWith: ['ea-connector', 'sysml-converter']
      }
    });

    this.addComponent({
      id: 'sysml-converter',
      name: 'SysML转换器',
      type: 'composite',
      version: '2.3.4',
      category: COMPONENT_CATEGORIES.ARCHITECTURE,
      status: 'stable',
      usageCount: 203,
      lastUsed: '2024-01-08 13:45',
      metadata: {
        description: 'UML到SysML模型转换和系统架构分析',
        author: 'MBSE团队',
        documentation: '/docs/sysml-converter',
        repository: 'https://github.com/mbse/sysml-converter',
        license: 'MIT',
        size: 2816
      },
      compatibility: {
        minPlatformVersion: '1.2.0',
        conflictsWith: [],
        recommendedWith: ['ea-connector', 'magicdraw-connector']
      }
    });

    // 仿真组件
    this.addComponent({
      id: 'mworks-engine',
      name: 'MWorks仿真引擎',
      type: 'atomic',
      version: '4.1.2',
      category: COMPONENT_CATEGORIES.SIMULATION,
      status: 'stable',
      usageCount: 456,
      lastUsed: '2024-01-08 17:15',
      metadata: {
        description: 'MWorks多物理域仿真计算引擎',
        author: 'MBSE团队',
        documentation: '/docs/mworks-engine',
        repository: 'https://github.com/mbse/mworks-engine',
        license: 'Commercial',
        size: 15360
      },
      compatibility: {
        minPlatformVersion: '2.0.0',
        conflictsWith: [],
        recommendedWith: ['modelica-compiler', 'fmu-generator']
      }
    });

    this.addComponent({
      id: 'modelica-compiler',
      name: 'Modelica编译器',
      type: 'atomic',
      version: '3.8.1',
      category: COMPONENT_CATEGORIES.SIMULATION,
      status: 'stable',
      usageCount: 389,
      lastUsed: '2024-01-08 16:00',
      metadata: {
        description: 'Modelica语言编译器和代码生成器',
        author: 'MBSE团队',
        documentation: '/docs/modelica-compiler',
        repository: 'https://github.com/mbse/modelica-compiler',
        license: 'BSD',
        size: 8192
      },
      compatibility: {
        minPlatformVersion: '1.5.0',
        conflictsWith: [],
        recommendedWith: ['mworks-engine', 'dymola-connector']
      }
    });

    this.addComponent({
      id: 'fmu-generator',
      name: 'FMU生成器',
      type: 'composite',
      version: '2.7.0',
      category: COMPONENT_CATEGORIES.SIMULATION,
      status: 'stable',
      usageCount: 267,
      lastUsed: '2024-01-08 14:45',
      metadata: {
        description: '生成符合FMI标准的功能样机单元',
        author: 'MBSE团队',
        documentation: '/docs/fmu-generator',
        repository: 'https://github.com/mbse/fmu-generator',
        license: 'MIT',
        size: 4096
      },
      compatibility: {
        minPlatformVersion: '1.8.0',
        conflictsWith: [],
        recommendedWith: ['mworks-engine', 'dymola-connector']
      }
    });

    // CAE分析组件
    this.addComponent({
      id: 'ansys-workbench',
      name: 'ANSYS Workbench连接器',
      type: 'atomic',
      version: '22.2.1',
      category: COMPONENT_CATEGORIES.CAE,
      status: 'stable',
      usageCount: 234,
      lastUsed: '2024-01-08 15:30',
      metadata: {
        description: '连接ANSYS Workbench多物理场仿真平台',
        author: 'MBSE团队',
        documentation: '/docs/ansys-workbench',
        repository: 'https://github.com/mbse/ansys-workbench',
        license: 'Commercial',
        size: 6144
      },
      compatibility: {
        minPlatformVersion: '2.0.0',
        conflictsWith: [],
        recommendedWith: ['fluent-connector', 'structural-analyzer']
      }
    });

    this.addComponent({
      id: 'abaqus-connector',
      name: 'Abaqus求解器',
      type: 'atomic',
      version: '2023.1',
      category: COMPONENT_CATEGORIES.CAE,
      status: 'stable',
      usageCount: 189,
      lastUsed: '2024-01-08 12:45',
      metadata: {
        description: '高级非线性有限元分析求解器',
        author: 'MBSE团队',
        documentation: '/docs/abaqus-connector',
        repository: 'https://github.com/mbse/abaqus-connector',
        license: 'Commercial',
        size: 9216
      },
      compatibility: {
        minPlatformVersion: '2.1.0',
        conflictsWith: [],
        recommendedWith: ['nonlinear-analyzer']
      }
    });

    // 验证确认组件
    this.addComponent({
      id: 'teststand-engine',
      name: 'TestStand执行引擎',
      type: 'atomic',
      version: '2023.2',
      category: COMPONENT_CATEGORIES.VALIDATION,
      status: 'stable',
      usageCount: 145,
      lastUsed: '2024-01-08 10:15',
      metadata: {
        description: '自动化测试序列执行和管理引擎',
        author: 'MBSE团队',
        documentation: '/docs/teststand-engine',
        repository: 'https://github.com/mbse/teststand-engine',
        license: 'Commercial',
        size: 3584
      },
      compatibility: {
        minPlatformVersion: '1.5.0',
        conflictsWith: [],
        recommendedWith: ['test-sequencer', 'vectorcast-connector']
      }
    });

    this.addComponent({
      id: 'vectorcast-connector',
      name: 'VectorCAST连接器',
      type: 'atomic',
      version: '2024.1',
      category: COMPONENT_CATEGORIES.VALIDATION,
      status: 'beta',
      usageCount: 78,
      lastUsed: '2024-01-08 09:30',
      metadata: {
        description: '嵌入式软件测试和覆盖率分析工具',
        author: 'MBSE团队',
        documentation: '/docs/vectorcast-connector',
        repository: 'https://github.com/mbse/vectorcast-connector',
        license: 'Commercial',
        size: 2560
      },
      compatibility: {
        minPlatformVersion: '2.0.0',
        conflictsWith: [],
        recommendedWith: ['teststand-engine']
      }
    });

    // 优化分析组件
    this.addComponent({
      id: 'optislang-optimizer',
      name: 'optiSLang优化器',
      type: 'composite',
      version: '2024.1',
      category: COMPONENT_CATEGORIES.OPTIMIZATION,
      status: 'stable',
      usageCount: 123,
      lastUsed: '2024-01-08 14:00',
      metadata: {
        description: '多学科设计优化和不确定性量化平台',
        author: 'MBSE团队',
        documentation: '/docs/optislang-optimizer',
        repository: 'https://github.com/mbse/optislang-optimizer',
        license: 'Commercial',
        size: 7168
      },
      compatibility: {
        minPlatformVersion: '2.1.0',
        conflictsWith: [],
        recommendedWith: ['doe-designer', 'sensitivity-analyzer']
      }
    });

    // 工具服务
    this.addToolService({
      id: 'simulation-scheduler',
      name: '仿真调度服务',
      type: 'internal',
      version: '1.4.2',
      endpoint: '/api/v1/simulation',
      status: 'active',
      configuration: {
        timeout: 300000,
        retryPolicy: {
          maxRetries: 3,
          backoff: 'exponential'
        },
        authentication: {
          type: 'apiKey',
          required: true
        }
      },
      usage: {
        callCount: 15672,
        errorRate: 0.02,
        avgResponseTime: 1250,
        dataVolume: 524288
      }
    });

    this.addToolService({
      id: 'model-repository',
      name: '模型仓库服务',
      type: 'internal', 
      version: '2.1.0',
      endpoint: '/api/v1/models',
      status: 'active',
      configuration: {
        timeout: 180000,
        retryPolicy: {
          maxRetries: 2,
          backoff: 'linear'
        },
        authentication: {
          type: 'oauth',
          required: true
        }
      },
      usage: {
        callCount: 8934,
        errorRate: 0.01,
        avgResponseTime: 856,
        dataVolume: 1048576
      }
    });

    // 模型版本
    this.addModel({
      id: 'battery-thermal-model',
      modelName: '电池热管理模型',
      version: '3.1.4',
      framework: 'Modelica',
      status: 'stable',
      modelInfo: {
        size: 24.5,
        inputShape: [32, 16, 8],
        outputShape: [16, 1],
        precision: 'fp32',
        accelerator: 'gpu'
      },
      performance: {
        accuracy: 94.2,
        inferenceTime: 12.5,
        memoryUsage: 256,
        throughput: 850
      }
    });
  }

  // 添加组件
  public addComponent(component: ComponentDependency): void {
    this.components.set(component.id, component);
  }

  // 添加工具服务
  public addToolService(toolService: ToolServiceDependency): void {
    this.toolServices.set(toolService.id, toolService);
  }

  // 添加模型
  public addModel(model: ModelVersionDependency): void {
    this.models.set(model.id, model);
  }

  // 获取组件
  public getComponent(id: string): ComponentDependency | undefined {
    return this.components.get(id);
  }

  // 获取工具服务
  public getToolService(id: string): ToolServiceDependency | undefined {
    return this.toolServices.get(id);
  }

  // 获取模型
  public getModel(id: string): ModelVersionDependency | undefined {
    return this.models.get(id);
  }

  // 获取所有组件
  public getAllComponents(): ComponentDependency[] {
    return Array.from(this.components.values());
  }

  // 获取所有工具服务
  public getAllToolServices(): ToolServiceDependency[] {
    return Array.from(this.toolServices.values());
  }

  // 获取所有模型
  public getAllModels(): ModelVersionDependency[] {
    return Array.from(this.models.values());
  }

  // 按分类获取组件
  public getComponentsByCategory(category: string): ComponentDependency[] {
    return this.getAllComponents().filter(component => component.category === category);
  }

  // 搜索组件
  public searchComponents(query: string): ComponentDependency[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllComponents().filter(component =>
      component.name.toLowerCase().includes(lowercaseQuery) ||
      component.metadata.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  // 获取推荐组件
  public getRecommendedComponents(componentId: string): ComponentDependency[] {
    const component = this.getComponent(componentId);
    if (!component) return [];

    const recommended = component.compatibility.recommendedWith;
    return recommended.map(id => this.getComponent(id)).filter(Boolean) as ComponentDependency[];
  }

  // 检查组件兼容性
  public checkCompatibility(componentIds: string[]): {
    compatible: boolean;
    conflicts: string[];
    missing: string[];
  } {
    const conflicts: string[] = [];
    const missing: string[] = [];
    const components = componentIds.map(id => this.getComponent(id)).filter(Boolean) as ComponentDependency[];

    // 检查缺失组件
    componentIds.forEach(id => {
      if (!this.getComponent(id)) {
        missing.push(id);
      }
    });

    // 检查冲突
    components.forEach(component => {
      const conflictingIds = component.compatibility.conflictsWith;
      conflictingIds.forEach(conflictId => {
        if (componentIds.includes(conflictId)) {
          conflicts.push(`${component.name} 与 ${this.getComponent(conflictId)?.name || conflictId} 冲突`);
        }
      });
    });

    return {
      compatible: conflicts.length === 0 && missing.length === 0,
      conflicts,
      missing
    };
  }

  // 实例化组件（创建组件实例）
  public instantiateComponent(
    componentId: string, 
    instanceConfig: {
      name: string;
      description?: string;
      parameters?: Record<string, any>;
      category?: string;
    }
  ): {
    success: boolean;
    instance?: any;
    error?: string;
  } {
    const component = this.getComponent(componentId);
    
    if (!component) {
      return {
        success: false,
        error: `组件 ${componentId} 不存在`
      };
    }

    // 创建组件实例
    const instance = {
      id: `${componentId}-${Date.now()}`,
      baseComponentId: componentId,
      name: instanceConfig.name,
      description: instanceConfig.description || component.metadata.description,
      category: instanceConfig.category || component.category,
      version: component.version,
      status: 'created',
      parameters: instanceConfig.parameters || {},
      createdAt: new Date().toISOString(),
      metadata: {
        ...component.metadata,
        instanceType: 'custom'
      }
    };

    return {
      success: true,
      instance
    };
  }

  // 获取组件使用统计
  public getComponentStats(): {
    totalComponents: number;
    activeComponents: number;
    categoryStats: Record<string, number>;
    topUsedComponents: ComponentDependency[];
  } {
    const allComponents = this.getAllComponents();
    const activeComponents = allComponents.filter(c => c.status === 'stable');
    
    const categoryStats: Record<string, number> = {};
    allComponents.forEach(component => {
      categoryStats[component.category] = (categoryStats[component.category] || 0) + 1;
    });

    const topUsedComponents = allComponents
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 10);

    return {
      totalComponents: allComponents.length,
      activeComponents: activeComponents.length,
      categoryStats,
      topUsedComponents
    };
  }
}

// 导出单例实例
export const componentLibraryService = ComponentLibraryService.getInstance();