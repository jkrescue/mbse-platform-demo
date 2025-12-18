import { AppDependencies } from '../types/appDependencies';

// 模拟依赖数据服务
export class MockDependencyService {
  // 获取应用依赖信息
  static getAppDependencies(appId: string): AppDependencies {
    const mockDependencies: Record<string, AppDependencies> = {
      "1": { // 整车动能安全
        appId: "1",
        lastUpdated: "2025-08-09T10:30:00Z",
        healthScore: 85,
        components: [
          {
            id: "comp-safety-001",
            name: "碰撞分析器",
            type: "atomic",
            version: "2.1.0",
            category: "Safety",
            status: "stable",
            usageCount: 15,
            lastUsed: "2025-08-08T14:20:00Z",
            metadata: {
              description: "车辆碰撞安全分析组件",
              author: "安全团队",
              documentation: "",
              repository: "",
              license: "MIT",
              size: 245
            },
            compatibility: {
              minPlatformVersion: "1.0.0",
              conflictsWith: [],
              recommendedWith: ["comp-safety-002"]
            }
          },
          {
            id: "comp-safety-002",
            name: "NCAP评估器",
            type: "composite",
            version: "1.5.0",
            category: "Safety",
            status: "stable",
            usageCount: 8,
            lastUsed: "2025-08-07T09:15:00Z",
            metadata: {
              description: "NCAP标准评估组件",
              author: "安全团队",
              documentation: "",
              repository: "",
              license: "MIT",
              size: 189
            },
            compatibility: {
              minPlatformVersion: "1.0.0",
              conflictsWith: [],
              recommendedWith: ["comp-safety-001"]
            }
          }
        ],
        toolServices: [
          {
            id: "tool-ansys-001",
            name: "ANSYS LS-DYNA",
            type: "external",
            version: "R13.1",
            endpoint: "https://api.ansys.com/ls-dyna",
            status: "active",
            configuration: {
              timeout: 3600,
              retryPolicy: {
                maxRetries: 3,
                backoff: "exponential"
              },
              authentication: {
                type: "apiKey",
                required: true
              }
            },
            usage: {
              callCount: 245,
              errorRate: 0.02,
              avgResponseTime: 1250,
              dataVolume: 15.6
            }
          },
          {
            id: "tool-stap-001",
            name: "STAP安全分析",
            type: "internal",
            version: "3.2.0",
            endpoint: "/api/stap/analysis",
            status: "active",
            configuration: {
              timeout: 1800,
              retryPolicy: {
                maxRetries: 2,
                backoff: "linear"
              },
              authentication: {
                type: "oauth",
                required: true
              }
            },
            usage: {
              callCount: 189,
              errorRate: 0.01,
              avgResponseTime: 890,
              dataVolume: 8.9
            }
          }
        ],
        modelVersions: [
          {
            id: "model-crash-001",
            modelName: "碰撞预测模型",
            version: "2.0.1",
            framework: "TensorFlow",
            status: "stable",
            modelInfo: {
              size: 125,
              inputShape: [1, 512, 256],
              outputShape: [1, 10],
              precision: "fp32",
              accelerator: "gpu"
            },
            performance: {
              accuracy: 94.5,
              inferenceTime: 45,
              memoryUsage: 512,
              throughput: 128
            }
          }
        ],
        externalAPIs: [
          {
            id: "api-iihs-001",
            name: "IIHS安全数据API",
            provider: "IIHS",
            endpoint: "https://api.iihs.org/v2/safety",
            version: "2.0",
            configuration: {
              method: "GET",
              headers: {},
              rateLimit: {
                requestsPerMinute: 60,
                requestsPerDay: 5000
              }
            },
            reliability: {
              uptime: 99.2,
              avgResponseTime: 156,
              errorRate: 0.8
            }
          }
        ],
        dependencyGraph: [
          {
            id: "comp-safety-001",
            type: "component",
            name: "碰撞分析器",
            version: "2.1.0",
            dependencies: ["tool-ansys-001"],
            dependents: ["comp-safety-002"],
            properties: {
              critical: true,
              replaceable: false,
              impact: "high"
            }
          }
        ]
      },

      "2": { // 空调热管理
        appId: "2",
        lastUpdated: "2025-08-09T09:15:00Z",
        healthScore: 92,
        components: [
          {
            id: "comp-thermal-001",
            name: "热交换器建模",
            type: "atomic",
            version: "1.8.0",
            category: "Thermal",
            status: "stable",
            usageCount: 23,
            lastUsed: "2025-08-09T08:45:00Z",
            metadata: {
              description: "汽车空调热交换器建模组件",
              author: "热管理团队",
              documentation: "",
              repository: "",
              license: "Apache-2.0",
              size: 167
            },
            compatibility: {
              minPlatformVersion: "1.0.0",
              conflictsWith: [],
              recommendedWith: ["comp-thermal-002"]
            }
          },
          {
            id: "comp-thermal-002",
            name: "制冷剂循环",
            type: "composite",
            version: "2.0.0",
            category: "Thermal",
            status: "stable",
            usageCount: 19,
            lastUsed: "2025-08-08T16:30:00Z",
            metadata: {
              description: "制冷剂循环系统建模",
              author: "热管理团队",
              documentation: "",
              repository: "",
              license: "Apache-2.0",
              size: 234
            },
            compatibility: {
              minPlatformVersion: "1.0.0",
              conflictsWith: [],
              recommendedWith: ["comp-thermal-001"]
            }
          }
        ],
        toolServices: [
          {
            id: "tool-fluent-001",
            name: "ANSYS Fluent",
            type: "external",
            version: "2023.R2",
            endpoint: "https://api.ansys.com/fluent",
            status: "active",
            configuration: {
              timeout: 7200,
              retryPolicy: {
                maxRetries: 2,
                backoff: "exponential"
              },
              authentication: {
                type: "apiKey",
                required: true
              }
            },
            usage: {
              callCount: 203,
              errorRate: 0.015,
              avgResponseTime: 2450,
              dataVolume: 28.7
            }
          }
        ],
        modelVersions: [
          {
            id: "model-thermal-001",
            modelName: "热管理优化模型",
            version: "1.5.0",
            framework: "PyTorch",
            status: "stable",
            modelInfo: {
              size: 89,
              inputShape: [1, 256, 128],
              outputShape: [1, 5],
              precision: "fp16",
              accelerator: "gpu"
            },
            performance: {
              accuracy: 91.2,
              inferenceTime: 32,
              memoryUsage: 256,
              throughput: 256
            }
          }
        ],
        externalAPIs: [
          {
            id: "api-weather-001",
            name: "天气数据API",
            provider: "OpenWeather",
            endpoint: "https://api.openweathermap.org/v2.5",
            version: "2.5",
            configuration: {
              method: "GET",
              headers: {},
              rateLimit: {
                requestsPerMinute: 60,
                requestsPerDay: 1000
              }
            },
            reliability: {
              uptime: 99.8,
              avgResponseTime: 89,
              errorRate: 0.2
            }
          }
        ],
        dependencyGraph: [
          {
            id: "comp-thermal-001",
            type: "component",
            name: "热交换器建模",
            version: "1.8.0",
            dependencies: ["tool-fluent-001"],
            dependents: ["comp-thermal-002"],
            properties: {
              critical: true,
              replaceable: true,
              impact: "medium"
            }
          }
        ]
      },

      "4": { // 电池管理系统
        appId: "4",
        lastUpdated: "2025-08-09T11:20:00Z",
        healthScore: 78,
        components: [
          {
            id: "comp-battery-001",
            name: "电池单体建模",
            type: "atomic",
            version: "3.0.0",
            category: "Energy",
            status: "stable",
            usageCount: 45,
            lastUsed: "2025-08-09T10:15:00Z",
            metadata: {
              description: "锂电池单体建模组件",
              author: "电池团队",
              documentation: "",
              repository: "",
              license: "GPL-3.0",
              size: 312
            },
            compatibility: {
              minPlatformVersion: "1.2.0",
              conflictsWith: [],
              recommendedWith: ["comp-battery-002", "comp-battery-003"]
            }
          },
          {
            id: "comp-battery-002",
            name: "热管理系统",
            type: "composite",
            version: "2.1.0",
            category: "Thermal",
            status: "beta",
            usageCount: 32,
            lastUsed: "2025-08-08T15:45:00Z",
            metadata: {
              description: "电池热管理系统建模",
              author: "电池团队",
              documentation: "",
              repository: "",
              license: "GPL-3.0",
              size: 456
            },
            compatibility: {
              minPlatformVersion: "1.2.0",
              conflictsWith: [],
              recommendedWith: ["comp-battery-001"]
            }
          },
          {
            id: "comp-battery-003",
            name: "SOC估算器",
            type: "atomic",
            version: "1.9.0",
            category: "Logic",
            status: "deprecated",
            usageCount: 28,
            lastUsed: "2025-08-06T12:30:00Z",
            metadata: {
              description: "电池荷电状态估算器",
              author: "算法团队",
              documentation: "",
              repository: "",
              license: "MIT",
              size: 198
            },
            compatibility: {
              minPlatformVersion: "1.0.0",
              maxPlatformVersion: "1.8.0",
              conflictsWith: ["comp-battery-004"],
              recommendedWith: []
            }
          }
        ],
        toolServices: [
          {
            id: "tool-battery-sim",
            name: "电池仿真服务",
            type: "internal",
            version: "2.5.0",
            endpoint: "/api/battery/simulation",
            status: "active",
            configuration: {
              timeout: 3600,
              retryPolicy: {
                maxRetries: 3,
                backoff: "exponential"
              },
              authentication: {
                type: "oauth",
                required: true
              }
            },
            usage: {
              callCount: 456,
              errorRate: 0.08,
              avgResponseTime: 1890,
              dataVolume: 45.2
            }
          },
          {
            id: "tool-thermal-calc",
            name: "热计算引擎",
            type: "external",
            version: "4.1.0",
            endpoint: "https://thermal-calc.example.com/api",
            status: "maintenance",
            configuration: {
              timeout: 2400,
              retryPolicy: {
                maxRetries: 2,
                backoff: "linear"
              },
              authentication: {
                type: "apiKey",
                required: true
              }
            },
            usage: {
              callCount: 234,
              errorRate: 0.12,
              avgResponseTime: 2340,
              dataVolume: 23.8
            }
          }
        ],
        modelVersions: [
          {
            id: "model-battery-thermal",
            modelName: "电池热模型",
            version: "1.3.0",
            framework: "ONNX",
            status: "stable",
            modelInfo: {
              size: 67,
              inputShape: [1, 128],
              outputShape: [1, 32],
              precision: "fp32",
              accelerator: "cpu"
            },
            performance: {
              accuracy: 88.9,
              inferenceTime: 28,
              memoryUsage: 128,
              throughput: 512
            }
          },
          {
            id: "model-soc-estimation",
            modelName: "SOC估算模型",
            version: "2.0.0",
            framework: "TensorFlow",
            status: "deprecated",
            modelInfo: {
              size: 145,
              inputShape: [1, 256],
              outputShape: [1, 1],
              precision: "fp16",
              accelerator: "gpu"
            },
            performance: {
              accuracy: 82.1,
              inferenceTime: 52,
              memoryUsage: 256,
              throughput: 128
            }
          }
        ],
        externalAPIs: [
          {
            id: "api-battery-data",
            name: "电池数据API",
            provider: "BatteryTech",
            endpoint: "https://api.batterytech.com/v1",
            version: "1.0",
            configuration: {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              rateLimit: {
                requestsPerMinute: 30,
                requestsPerDay: 2000
              }
            },
            reliability: {
              uptime: 97.5,
              avgResponseTime: 234,
              errorRate: 2.5
            }
          }
        ],
        dependencyGraph: [
          {
            id: "comp-battery-001",
            type: "component",
            name: "电池单体建模",
            version: "3.0.0",
            dependencies: ["tool-battery-sim"],
            dependents: ["comp-battery-002"],
            properties: {
              critical: true,
              replaceable: false,
              impact: "high"
            }
          },
          {
            id: "comp-battery-002",
            type: "component",
            name: "热管理系统",
            version: "2.1.0",
            dependencies: ["comp-battery-001", "tool-thermal-calc"],
            dependents: [],
            properties: {
              critical: false,
              replaceable: true,
              impact: "medium"
            }
          }
        ]
      },

      "3": { // 整车集成
        appId: "3",
        lastUpdated: "2025-08-09T12:45:00Z",
        healthScore: 95,
        components: [
          {
            id: "comp-integration-001",
            name: "系统集成器",
            type: "composite",
            version: "1.0.0",
            category: "Integration",
            status: "stable",
            usageCount: 67,
            lastUsed: "2025-08-09T11:30:00Z",
            metadata: {
              description: "多系统集成组件",
              author: "集成团队",
              documentation: "",
              repository: "",
              license: "MIT",
              size: 423
            },
            compatibility: {
              minPlatformVersion: "1.0.0",
              conflictsWith: [],
              recommendedWith: []
            }
          }
        ],
        toolServices: [
          {
            id: "tool-mdo-001",
            name: "多学科优化工具",
            type: "internal",
            version: "1.2.0",
            endpoint: "/api/mdo/optimize",
            status: "active",
            configuration: {
              timeout: 7200,
              retryPolicy: {
                maxRetries: 1,
                backoff: "none"
              },
              authentication: {
                type: "basic",
                required: false
              }
            },
            usage: {
              callCount: 189,
              errorRate: 0.01,
              avgResponseTime: 4560,
              dataVolume: 67.3
            }
          }
        ],
        modelVersions: [],
        externalAPIs: [],
        dependencyGraph: [
          {
            id: "comp-integration-001",
            type: "component",
            name: "系统集成器",
            version: "1.0.0",
            dependencies: ["tool-mdo-001"],
            dependents: [],
            properties: {
              critical: true,
              replaceable: true,
              impact: "high"
            }
          }
        ]
      }
    };

    return mockDependencies[appId] || this.getDefaultDependencies(appId);
  }

  // 获取默认依赖信息（用于没有特定配置的应用）
  private static getDefaultDependencies(appId: string): AppDependencies {
    return {
      appId,
      lastUpdated: new Date().toISOString(),
      healthScore: 90,
      components: [
        {
          id: `comp-default-${appId}`,
          name: "基础组件",
          type: "atomic",
          version: "1.0.0",
          category: "Common",
          status: "stable",
          usageCount: 10,
          lastUsed: new Date().toISOString(),
          metadata: {
            description: "通用基础组件",
            author: "平台团队",
            documentation: "",
            repository: "",
            license: "MIT",
            size: 50
          },
          compatibility: {
            minPlatformVersion: "1.0.0",
            conflictsWith: [],
            recommendedWith: []
          }
        }
      ],
      toolServices: [
        {
          id: `tool-default-${appId}`,
          name: "通用计算服务",
          type: "internal",
          version: "1.0.0",
          endpoint: "/api/common/compute",
          status: "active",
          configuration: {
            timeout: 1800,
            retryPolicy: {
              maxRetries: 2,
              backoff: "linear"
            },
            authentication: {
              type: "oauth",
              required: true
            }
          },
          usage: {
            callCount: 50,
            errorRate: 0.02,
            avgResponseTime: 890,
            dataVolume: 5.2
          }
        }
      ],
      modelVersions: [],
      externalAPIs: [],
      dependencyGraph: [
        {
          id: `comp-default-${appId}`,
          type: "component",
          name: "基础组件",
          version: "1.0.0",
          dependencies: [`tool-default-${appId}`],
          dependents: [],
          properties: {
            critical: false,
            replaceable: true,
            impact: "low"
          }
        }
      ]
    };
  }

  // 获取所有应用的依赖信息
  static getAllAppsDependencies(appIds: string[]): Record<string, AppDependencies> {
    const result: Record<string, AppDependencies> = {};
    appIds.forEach(appId => {
      result[appId] = this.getAppDependencies(appId);
    });
    return result;
  }

  // 计算依赖健康度
  static calculateDependencyHealth(dependencies: AppDependencies): number {
    let totalScore = 0;
    let totalWeight = 0;

    // 组件健康度权重：40%
    const componentScore = this.calculateComponentHealth(dependencies.components);
    totalScore += componentScore * 0.4;
    totalWeight += 0.4;

    // 工具服务健康度权重：30%
    const toolScore = this.calculateToolServiceHealth(dependencies.toolServices);
    totalScore += toolScore * 0.3;
    totalWeight += 0.3;

    // 模型健康度权重：20%
    const modelScore = this.calculateModelHealth(dependencies.modelVersions);
    totalScore += modelScore * 0.2;
    totalWeight += 0.2;

    // API健康度权重：10%
    const apiScore = this.calculateAPIHealth(dependencies.externalAPIs);
    totalScore += apiScore * 0.1;
    totalWeight += 0.1;

    return Math.round(totalScore / totalWeight);
  }

  // 组件健康度计算
  private static calculateComponentHealth(components: any[]): number {
    if (components.length === 0) return 100;

    let totalScore = 0;
    components.forEach(component => {
      let score = 100;

      if (component.status === 'deprecated') score -= 40;
      if (component.status === 'beta') score -= 20;

      if (component.compatibility.conflictsWith.length > 0) score -= 15;

      const daysSinceLastUsed = this.getDaysSince(component.lastUsed);
      if (daysSinceLastUsed > 90) score -= 10;
      if (daysSinceLastUsed > 365) score -= 20;

      totalScore += Math.max(0, score);
    });

    return totalScore / components.length;
  }

  // 工具服务健康度计算
  private static calculateToolServiceHealth(toolServices: any[]): number {
    if (toolServices.length === 0) return 100;

    let totalScore = 0;
    toolServices.forEach(service => {
      let score = 100;

      if (service.status === 'deprecated') score -= 40;
      if (service.status === 'maintenance') score -= 20;

      if (service.usage.errorRate > 0.05) score -= 30;
      if (service.usage.errorRate > 0.1) score -= 20;

      if (service.usage.avgResponseTime > 5000) score -= 15;

      totalScore += Math.max(0, score);
    });

    return totalScore / toolServices.length;
  }

  // 模型健康度计算
  private static calculateModelHealth(models: any[]): number {
    if (models.length === 0) return 100;

    let totalScore = 0;
    models.forEach(model => {
      let score = 100;

      if (model.status === 'deprecated') score -= 40;
      if (model.status === 'beta') score -= 20;

      if (model.performance.accuracy < 80) score -= 30;
      if (model.performance.accuracy < 60) score -= 30;

      totalScore += Math.max(0, score);
    });

    return totalScore / models.length;
  }

  // API健康度计算
  private static calculateAPIHealth(apis: any[]): number {
    if (apis.length === 0) return 100;

    let totalScore = 0;
    apis.forEach(api => {
      let score = 100;

      if (api.reliability.uptime < 95) score -= 30;
      if (api.reliability.uptime < 90) score -= 30;

      if (api.reliability.errorRate > 5) score -= 20;

      totalScore += Math.max(0, score);
    });

    return totalScore / apis.length;
  }

  // 计算天数差
  private static getDaysSince(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}