import { useState } from "react";
import {
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Play,
  Database,
  FileText,
  GitBranch,
  Cpu,
  Shield,
  TrendingUp,
  Monitor,
  Activity,
  Server,
  Plus,
  ExternalLink,
  X,
  Upload,
  Download,
  Link,
  Wrench,
  Globe,
  Lock,
  Users,
  BarChart3,
  Zap,
  TestTube,
} from "lucide-react@0.487.0";
import { toast } from "sonner@2.0.3";
import { ToolConfigModal } from "./ToolConfigModal";
import ToolModelIntegrationService from "../services/ToolModelIntegrationService";
import { useAuth } from "./AuthContext";

interface ToolServiceProps {
  userRole?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  tools: Tool[];
  stage: string;
  color: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "maintenance" | "configured" | "disconnected";
  version: string;
  lastUsed?: string;
  usage: number;
  type: string;
  features: string[];
  complexity: "初级" | "中级" | "高级";
  vendor: string;
  license: string;
  isConfigured?: boolean;
  connectionUrl?: string;
  roleRelevance?: {
    admin: "高" | "中" | "低";
    projectManager: "高" | "中" | "低";
    architect: "高" | "中" | "低";
    simulation: "高" | "中" | "低";
    modeling: "高" | "中" | "低";
  };
}

// MBSE工具服务分类数据 - 完整版本
export const toolServiceCategories: ServiceCategory[] = [
  {
    id: "requirement-management",
    name: "需求管理",
    description: "需求定义、追踪、验证和管理工具集",
    icon: FileText,
    stage: "需求阶段",
    color: "blue",
    tools: [
      {
        id: "polarion",
        name: "POLARION ALM",
        description: "企业级需求管理和协作平台，支持全生命周期需求追踪",
        status: "configured",
        version: "2024.1",
        lastUsed: "2025-01-27 14:30",
        usage: 89,
        type: "需求管理",
        vendor: "Siemens",
        license: "商业许可",
        complexity: "高级",
        connectionUrl: "https://polarion.company.com",
        features: ["需求建模", "变更管理", "协作审查", "报告生成", "基线管理", "影响分析"],
        roleRelevance: {
          admin: "高",
          projectManager: "高",
          architect: "中",
          simulation: "低",
          modeling: "中"
        }
      },
      {
        id: "doors",
        name: "IBM DOORS Next",
        description: "专业需求管理工具，支持复杂系统工程需求管理",
        status: "configured",
        version: "7.0.3",
        lastUsed: "2025-01-26 16:45",
        usage: 76,
        type: "需求管理",
        vendor: "IBM",
        license: "商业许可",
        complexity: "高级",
        connectionUrl: "https://doors.company.com",
        features: ["需求追踪", "基线管理", "影响分析", "合规检查", "OSLC集成", "DXL脚本"],
        roleRelevance: {
          admin: "高",
          projectManager: "高",
          architect: "中",
          simulation: "低",
          modeling: "中"
        }
      },
      {
        id: "reqtify",
        name: "ReqTify",
        description: "需求追溯和验证工具，连接需求与设计实现",
        status: "active",
        version: "2024.1",
        lastUsed: "2025-01-25 10:20",
        usage: 65,
        type: "需求追溯",
        vendor: "Dassault Systèmes",
        license: "商业许可",
        complexity: "中级",
        features: ["需求追溯", "影响分析", "验证管理", "质量保证"],
        roleRelevance: {
          admin: "中",
          projectManager: "高",
          architect: "高",
          simulation: "中",
          modeling: "中"
        }
      }
    ],
  },
  {
    id: "architecture-design",
    name: "架构设计",
    description: "系统架构设计和建模工具",
    icon: GitBranch,
    stage: "设计阶段",
    color: "green",
    tools: [
      {
        id: "ea",
        name: "Enterprise Architect",
        description: "企业架构建模工具，支持UML/SysML/BPMN建模",
        status: "configured",
        version: "16.1",
        lastUsed: "2025-01-27 10:15",
        usage: 92,
        type: "架构建模",
        vendor: "Sparx Systems",
        license: "商业许可",
        complexity: "中级",
        connectionUrl: "ea://localhost:1433",
        features: ["UML建模", "SysML支持", "代码生成", "文档输出", "团队协作", "版本控制"],
        roleRelevance: {
          admin: "中",
          projectManager: "中",
          architect: "高",
          simulation: "中",
          modeling: "高"
        }
      },
      {
        id: "magicdraw",
        name: "MagicDraw",
        description: "专业SysML建模工具，支持完整的MBSE方法学",
        status: "configured",
        version: "19.0",
        lastUsed: "2025-01-27 09:20",
        usage: 88,
        type: "系统建模",
        vendor: "Dassault Systèmes",
        license: "商业许可",
        complexity: "高级",
        connectionUrl: "https://magicdraw.company.com",
        features: ["SysML建模", "需求追踪", "仿真集成", "团队协作", "插件开发", "模型库"],
        roleRelevance: {
          admin: "中",
          projectManager: "中",
          architect: "高",
          simulation: "中",
          modeling: "高"
        }
      },
      {
        id: "rhapsody",
        name: "IBM Rhapsody",
        description: "基于模型的系统工程和软件开发环境",
        status: "active",
        version: "9.0.1",
        lastUsed: "2025-01-26 14:30",
        usage: 72,
        type: "MBSE工具",
        vendor: "IBM",
        license: "商业许可",
        complexity: "高级",
        features: ["实时建模", "代码生成", "仿真调试", "需求链接", "DoDAF支持"],
        roleRelevance: {
          admin: "中",
          projectManager: "中",
          architect: "高",
          simulation: "高",
          modeling: "高"
        }
      },
      {
        id: "capella",
        name: "Eclipse Capella",
        description: "开源MBSE建模工具，基于ARCADIA方法学",
        status: "maintenance",
        version: "7.0.1",
        usage: 34,
        type: "系统工程",
        vendor: "Eclipse Foundation",
        license: "开源许可",
        complexity: "中级",
        features: ["ARCADIA方法", "架构设计", "验证分析", "协作建模"],
        roleRelevance: {
          admin: "低",
          projectManager: "低",
          architect: "高",
          simulation: "中",
          modeling: "高"
        }
      }
    ],
  },
  {
    id: "system-integration",
    name: "系统集成仿真",
    description: "多学科仿真和系统集成验证",
    icon: Cpu,
    stage: "仿真阶段",
    color: "purple",
    tools: [
      {
        id: "mworks",
        name: "MWorks",
        description: "多学科仿真平台，支持Modelica建模语言",
        status: "configured",
        version: "2024.2",
        lastUsed: "2025-01-27 13:45",
        usage: 95,
        type: "仿真计算",
        vendor: "华中科技大学",
        license: "商业许可",
        complexity: "高级",
        connectionUrl: "https://mworks.company.com",
        features: ["Modelica仿真", "多物理域", "并行计算", "优化设计", "FMI支持", "云端计算"],
        roleRelevance: {
          admin: "中",
          projectManager: "中",
          architect: "中",
          simulation: "高",
          modeling: "高"
        }
      },
      {
        id: "dymola",
        name: "Dymola",
        description: "多物理域建模和仿真环境，支持FMI标准",
        status: "active",
        version: "2024x",
        lastUsed: "2025-01-27 11:30",
        usage: 87,
        type: "仿真建模",
        vendor: "Dassault Systèmes",
        license: "商业许可",
        complexity: "高级",
        features: ["动态建模", "实时仿真", "FMU导出", "优化算法"],
        roleRelevance: {
          admin: "低",
          projectManager: "低",
          architect: "中",
          simulation: "高",
          modeling: "高"
        }
      },
      {
        id: "amesim",
        name: "Simcenter Amesim",
        description: "1D系统仿真平台，专注于多学科系统建模",
        status: "active",
        version: "2024.1",
        lastUsed: "2025-01-26 15:20",
        usage: 72,
        type: "系统仿真",
        vendor: "Siemens",
        license: "商业许可",
        complexity: "中级",
        features: ["液压建模", "热管理", "控制系统", "HIL集成"],
        roleRelevance: {
          admin: "低",
          projectManager: "中",
          architect: "中",
          simulation: "高",
          modeling: "中"
        }
      },
      {
        id: "simulink",
        name: "MATLAB/Simulink",
        description: "模型设计和仿真环境，广泛应用于控制系统",
        status: "active",
        version: "R2024a",
        lastUsed: "2025-01-25 16:45",
        usage: 83,
        type: "控制建模",
        vendor: "MathWorks",
        license: "商业许可",
        complexity: "中级",
        features: ["信号处理", "控制设计", "代码生成", "硬件在环"],
        roleRelevance: {
          admin: "低",
          projectManager: "低",
          architect: "中",
          simulation: "高",
          modeling: "高"
        }
      }
    ],
  },
  {
    id: "cae-simulation",
    name: "专业CAE仿真",
    description: "结构、流体、电磁等专业领域仿真",
    icon: Database,
    stage: "仿真分析",
    color: "orange",
    tools: [
      {
        id: "ansys-workbench",
        name: "ANSYS Workbench",
        description: "通用有限元分析软件，涵盖多物理场仿真",
        status: "configured",
        version: "2024 R1",
        lastUsed: "2025-01-27 08:45",
        usage: 91,
        type: "有限元分析",
        vendor: "ANSYS Inc.",
        license: "商业许可",
        complexity: "高级",
        connectionUrl: "https://ansys.company.com",
        features: ["结构分析", "流体仿真", "电磁分析", "多物理场耦合", "优化设计", "疲劳分析"],
        roleRelevance: {
          admin: "中",
          projectManager: "中",
          architect: "中",
          simulation: "高",
          modeling: "中"
        }
      },
      {
        id: "abaqus",
        name: "Abaqus",
        description: "高级非线性有限元分析软件",
        status: "configured",
        version: "2024",
        lastUsed: "2025-01-26 14:20",
        usage: 78,
        type: "非线性分析",
        vendor: "Dassault Systèmes",
        license: "商业许可",
        complexity: "高级",
        connectionUrl: "abaqus://license.company.com",
        features: ["非线性分析", "复合材料", "疲劳分析", "冲击仿真", "断裂力学", "热传导"],
        roleRelevance: {
          admin: "低",
          projectManager: "低",
          architect: "中",
          simulation: "高",
          modeling: "中"
        }
      },
      {
        id: "adams",
        name: "MSC Adams",
        description: "多体动力学仿真软件，专注于机械系统分析",
        status: "configured",
        version: "2024",
        lastUsed: "2025-01-25 11:30",
        usage: 69,
        type: "多体动力学",
        vendor: "MSC Software",
        license: "商业许可",
        complexity: "中级",
        connectionUrl: "adams://license.company.com",
        features: ["多体动力学", "机构仿真", "振动分析", "疲劳预测", "控制集成"],
        roleRelevance: {
          admin: "低",
          projectManager: "低",
          architect: "中",
          simulation: "高",
          modeling: "中"
        }
      },
      {
        id: "fluent",
        name: "ANSYS Fluent",
        description: "专业CFD流体力学分析软件",
        status: "active",
        version: "2024 R1",
        lastUsed: "2025-01-24 16:15",
        usage: 85,
        type: "流体分析",
        vendor: "ANSYS Inc.",
        license: "商业许可",
        complexity: "高级",
        features: ["CFD分析", "传热仿真", "多相流", "燃烧建模"],
        roleRelevance: {
          admin: "低",
          projectManager: "低",
          architect: "中",
          simulation: "高",
          modeling: "中"
        }
      }
    ],
  },
  {
    id: "verification-validation",
    name: "验证确认",
    description: "系统验证和确认工具集",
    icon: Shield,
    stage: "验证阶段",
    color: "red",
    tools: [
      {
        id: "teststand",
        name: "NI TestStand",
        description: "自动化测试执行和管理平台",
        status: "active",
        version: "2023 Q3",
        lastUsed: "2025-01-27 12:15",
        usage: 79,
        type: "自动测试",
        vendor: "National Instruments",
        license: "商业许可",
        complexity: "中级",
        features: ["测试序列", "自动执行", "结果分析", "报告生成"],
        roleRelevance: {
          admin: "中",
          projectManager: "高",
          architect: "中",
          simulation: "高",
          modeling: "低"
        }
      },
      {
        id: "rtrt",
        name: "IBM RTRT",
        description: "实时测试和验证工具，支持嵌入式系统测试",
        status: "active",
        version: "10.3",
        lastUsed: "2025-01-26 17:30",
        usage: 63,
        type: "实时测试",
        vendor: "IBM",
        license: "商业许可",
        complexity: "高级",
        features: ["单元测试", "集成测试", "覆盖率分析", "性能测试"],
        roleRelevance: {
          admin: "中",
          projectManager: "中",
          architect: "中",
          simulation: "高",
          modeling: "低"
        }
      },
      {
        id: "vectorcast",
        name: "VectorCAST",
        description: "嵌入式软件测试和验证平台",
        status: "active",
        version: "2024.0",
        lastUsed: "2025-01-25 09:45",
        usage: 71,
        type: "软件测试",
        vendor: "Vector Software",
        license: "商业许可",
        complexity: "中级",
        features: ["单元测试", "集成测试", "覆盖率分析", "回归测试"],
        roleRelevance: {
          admin: "中",
          projectManager: "中",
          architect: "低",
          simulation: "中",
          modeling: "低"
        }
      }
    ],
  },
  {
    id: "optimization-analysis",
    name: "优化分析",
    description: "系统优化和性能分析工具",
    icon: TrendingUp,
    stage: "优化阶段",
    color: "indigo",
    tools: [
      {
        id: "optislang",
        name: "ANSYS optiSLang",
        description: "多学科设计优化和鲁棒性分析平台",
        status: "active",
        version: "2024.1",
        lastUsed: "2025-01-27 16:00",
        usage: 82,
        type: "设计优化",
        vendor: "ANSYS Inc.",
        license: "商业许可",
        complexity: "高级",
        features: ["多目标优化", "敏感性分析", "鲁棒设计", "不确定性量化"],
        roleRelevance: {
          admin: "低",
          projectManager: "中",
          architect: "中",
          simulation: "高",
          modeling: "中"
        }
      },
      {
        id: "modeFrontier",
        name: "modeFRONTIER",
        description: "多学科优化和数据分析平台",
        status: "active",
        version: "2024.1",
        lastUsed: "2025-01-27 15:45",
        usage: 71,
        type: "多学科优化",
        vendor: "ESTECO",
        license: "商业许可",
        complexity: "高级",
        features: ["参数优化", "DOE实验", "数据挖掘", "工作流自动化"],
        roleRelevance: {
          admin: "低",
          projectManager: "中",
          architect: "中",
          simulation: "高",
          modeling: "中"
        }
      }
    ],
  },
];

export function ToolService({ userRole }: ToolServiceProps) {
  const { user } = useAuth(); // 获取用户信息
  const [currentView, setCurrentView] = useState<"overview" | "category" | "tool">("overview");
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showCreateModelModal, setShowCreateModelModal] = useState(false);
  const [isCreatingModel, setIsCreatingModel] = useState(false);
  
  // 工具配置状态管理
  const [toolConfigs, setToolConfigs] = useState<{[key: string]: any}>({
    polarion: {
      serverUrl: 'https://polarion.company.com',
      port: '8443',
      protocol: 'https',
      username: '',
      password: '',
      projectId: '',
      workspace: 'default',
      sslEnabled: true,
      autoLogin: false,
      connectionTimeout: 30000,
      isConfigured: false
    },
    doors: {
      serverUrl: 'https://doors.company.com',
      port: '9443',
      protocol: 'https',
      username: '',
      password: '',
      database: 'requirements_db',
      project: '',
      version: '9.7',
      contextRoot: '/doors',
      integrationMode: 'REST',
      enableSso: false,
      sslEnabled: true,
      connectionTimeout: 45000,
      isConfigured: false
    },
    mworks: {
      serverUrl: 'https://mworks.company.com',
      port: '8080',
      protocol: 'https',
      username: '',
      password: '',
      licenseServer: 'mworks-license.company.com',
      licensePort: '1717',
      workspace: '/mworks/workspace',
      simulationEngine: 'ModelicaEngine',
      parallelComputing: true,
      maxCores: 8,
      memoryLimit: '16GB',
      connectionTimeout: 30000,
      isConfigured: false
    },
    ea: {
      serverUrl: 'localhost',
      port: '1433',
      protocol: 'ea',
      username: '',
      password: '',
      database: 'EA_Repository',
      cloudService: false,
      cloudUrl: '',
      projectPath: '',
      securityMode: 'Windows',
      connectionTimeout: 30000,
      isConfigured: false
    },
    magicdraw: {
      serverUrl: 'https://magicdraw.company.com',
      port: '8443',
      protocol: 'https',
      username: '',
      password: '',
      projectServer: 'TWCloud',
      projectName: '',
      branchName: 'master',
      workingDirectory: '',
      pluginPath: '',
      connectionTimeout: 30000,
      isConfigured: false
    },
    ansys: {
      serverUrl: 'https://ansys.company.com',
      port: '443',
      protocol: 'https',
      username: '',
      password: '',
      licenseServer: 'ansys-license.company.com',
      licensePort: '1055',
      workingDirectory: '/ansys/workdir',
      solverPath: '/ansys/bin',
      parallelCores: 4,
      memoryLimit: '8GB',
      connectionTimeout: 60000,
      isConfigured: false
    },
    abaqus: {
      licenseServer: 'abaqus-license.company.com',
      licensePort: '27000',
      installPath: '/opt/abaqus/2024',
      workingDirectory: '/abaqus/workdir',
      scratchDirectory: '/tmp',
      parallelCores: 8,
      memoryLimit: '16GB',
      solverType: 'Standard',
      precision: 'Double',
      connectionTimeout: 120000,
      isConfigured: false
    },
    adams: {
      licenseServer: 'adams-license.company.com',
      licensePort: '27000',
      installPath: '/opt/adams/2024',
      workingDirectory: '/adams/workdir',
      solverPath: '/opt/adams/2024/solver',
      parallelCores: 4,
      memoryLimit: '8GB',
      animationFrames: 50,
      outputFormat: 'req',
      connectionTimeout: 60000,
      isConfigured: false
    }
  });

  const [showConfigModal, setShowConfigModal] = useState<string | null>(null);

  // 根据用户角色过滤和排序工具
  const getFilteredCategories = () => {
    if (!userRole) return toolServiceCategories;
    
    return toolServiceCategories.map(category => ({
      ...category,
      tools: category.tools
        .map(tool => ({
          ...tool,
          relevanceScore: tool.roleRelevance?.[userRole as keyof typeof tool.roleRelevance] || "低"
        }))
        .sort((a, b) => {
          const relevanceOrder = { "高": 3, "中": 2, "低": 1 };
          return (relevanceOrder[b.relevanceScore as keyof typeof relevanceOrder] || 1) - 
                 (relevanceOrder[a.relevanceScore as keyof typeof relevanceOrder] || 1);
        })
    }));
  };

  // 获取集成服务实例
  const integrationService = ToolModelIntegrationService.getInstance();

  const handleCreateModelClick = async () => {
    if (!user) {
      toast.error("请先登录");
      return;
    }

    // 显示创建模型的模态框/面板
    setShowCreateModelModal(true);
  };

  // 处理从不同工具创建模型
  const handleCreateModelFromTool = async (toolType: 'EA' | 'DYMOLA' | 'POLARION' | 'MWORKS') => {
    if (!user) {
      toast.error("请先登录");
      return;
    }

    setIsCreatingModel(true);
    
    try {
      // 根据工具类型生成不同的模型内容
      const modelContent = generateModelContentByTool(toolType);
      
      // 使用集成服务保存模型
      const savedModel = await integrationService.saveModelFromTool({
        toolType,
        modelContent,
        userInfo: {
          name: user.name || "当前用户",
          role: user.role
        },
        additionalMetadata: {
          createdFrom: "ToolService",
          toolServiceVersion: "2.0",
          autoGenerated: true
        }
      });

      toast.success(`模型 "${savedModel.name}" 已成功保存到个人模型库！`, {
        duration: 5000,
        action: {
          label: "查看",
          onClick: () => {
            // 这里可以跳转到模型管理页面
            console.log("跳转到模型详情:", savedModel);
          }
        }
      });

      setShowCreateModelModal(false);
      
    } catch (error) {
      console.error("创建模型失败:", error);
      toast.error("创建模型失败，请重试");
    } finally {
      setIsCreatingModel(false);
    }
  };

  // 根据工具类型生成模型内容
  const generateModelContentByTool = (toolType: 'EA' | 'DYMOLA' | 'POLARION' | 'MWORKS') => {
    const timestamp = new Date().toLocaleString('zh-CN');
    
    const toolSpecificContent = {
      EA: {
        name: `EA_SystemArchitecture_${Date.now()}`,
        description: "使用Enterprise Architect创建的系统架构模型，包含SysML建模元素和架构设计",
        version: "1.0",
        project: "EA系统架构项目",
        tags: ["ea", "sysml", "architecture", "system-design"],
        parameters: {
          modelType: "SysML",
          diagramTypes: ["用例图", "活动图", "序列图", "类图"],
          stereotypes: ["system", "component", "interface"],
          profiles: ["SysML Profile"]
        },
        configurations: {
          repository: "EA_Repository",
          packageStructure: ["Requirements", "Analysis", "Design"],
          codeGeneration: true,
          documentGeneration: true
        }
      },
      DYMOLA: {
        name: `Dymola_PhysicalModel_${Date.now()}`,
        description: "使用Dymola创建的多物理域仿真模型，支持动态仿真和性能分析",
        version: "1.0", 
        project: "Dymola仿真项目",
        tags: ["dymola", "modelica", "simulation", "physical"],
        parameters: {
          modelType: "Modelica",
          physicalDomains: ["机械", "热力学", "电气", "控制"],
          solverType: "DASSL",
          simulationTime: "10.0",
          tolerance: "1e-6"
        },
        configurations: {
          libraries: ["Modelica Standard Library", "VehicleDynamics"],
          compilerSettings: {
            optimization: true,
            parallelization: false
          },
          outputFormat: "mat"
        }
      },
      POLARION: {
        name: `Polarion_RequirementsModel_${Date.now()}`,
        description: "使用POLARION ALM创建的需求管理模型，包含需求追踪和验证",
        version: "1.0",
        project: "POLARION需求项目", 
        tags: ["polarion", "requirements", "traceability", "verification"],
        parameters: {
          modelType: "Requirements",
          requirementTypes: ["功能需求", "性能需求", "安全需求", "接口需求"],
          traceabilityMatrix: true,
          verificationMethods: ["测试", "分析", "仿真", "检查"]
        },
        configurations: {
          workspace: "requirements_workspace",
          baselines: ["v1.0_baseline"],
          approvalWorkflow: true,
          changeControlEnabled: true
        }
      },
      MWORKS: {
        name: `MWorks_SimulationModel_${Date.now()}`,
        description: "使用MWorks创建的多学科仿真模型，支持并行计算和优化设计",
        version: "1.0",
        project: "MWorks仿真项目",
        tags: ["mworks", "modelica", "multiphysics", "optimization"],
        parameters: {
          modelType: "Modelica",
          simulationType: "动态仿真",
          parallelComputing: true,
          optimizationAlgorithm: "遗传算法",
          objectiveFunction: "最小化能耗"
        },
        configurations: {
          solverSettings: {
            method: "CVODE",
            stepSize: "auto",
            tolerance: "1e-8"
          },
          cloudComputing: true,
          resultAnalysis: ["时域分析", "频域分析", "敏感性分析"]
        }
      }
    };

    return {
      ...toolSpecificContent[toolType],
      file: `${toolType}_model_${Date.now()}.${getFileExtension(toolType)}`,
      createdAt: timestamp,
      metadata: {
        toolType,
        autoGenerated: true,
        creationMethod: "ToolService"
      }
    };
  };

  // 获取文件扩展名
  const getFileExtension = (toolType: string) => {
    const extensions = {
      EA: 'xmi',
      DYMOLA: 'mo', 
      POLARION: 'xml',
      MWORKS: 'mo'
    };
    return extensions[toolType as keyof typeof extensions] || 'unknown';
  };

  const handleToolSelection = (tool: Tool) => {
    const config = toolConfigs[tool.id];
    if (config?.isConfigured) {
      // 已配置的工具直接打开
      if (tool.connectionUrl) {
        window.open(tool.connectionUrl, "_blank");
        toast.success(`正在打开 ${tool.name}`);
      } else {
        toast.success(`正在启动 ${tool.name}`);
      }
    } else {
      // 未配置的工具提示先配置
      toast.warning(`请先配置 ${tool.name} 的连接信息`);
      setShowConfigModal(tool.id);
    }
  };

  const handleCategoryClick = (category: ServiceCategory) => {
    setSelectedCategory(category);
    setCurrentView("category");
  };

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
    setCurrentView("tool");
  };

  const handleBackToOverview = () => {
    setCurrentView("overview");
    setSelectedCategory(null);
    setSelectedTool(null);
  };

  const handleBackToCategory = () => {
    setCurrentView("category");
    setSelectedTool(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "configured":
        return "bg-green-100 text-green-800";
      case "active":
        return "bg-blue-100 text-blue-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "disconnected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "configured":
        return "已配置";
      case "active":
        return "运行中";
      case "inactive":
        return "未激活";
      case "maintenance":
        return "维护中";
      case "disconnected":
        return "未连接";
      default:
        return "未知";
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "高级":
        return "bg-red-100 text-red-800";
      case "中级":
        return "bg-yellow-100 text-yellow-800";
      case "初级":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: "bg-blue-50 border-blue-200 text-blue-900",
      green: "bg-green-50 border-green-200 text-green-900",
      purple: "bg-purple-50 border-purple-200 text-purple-900",
      orange: "bg-orange-50 border-orange-200 text-orange-900",
      red: "bg-red-50 border-red-200 text-red-900",
      indigo: "bg-indigo-50 border-indigo-200 text-indigo-900",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getRelevanceColor = (level: string) => {
    switch (level) {
      case "高":
        return "bg-red-100 text-red-800";
      case "中":
        return "bg-yellow-100 text-yellow-800";
      case "低":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 处理工具配置保存
  const handleSaveConfig = (toolId: string, configData: any) => {
    setToolConfigs(prev => ({
      ...prev,
      [toolId]: {
        ...prev[toolId],
        ...configData,
        isConfigured: true
      }
    }));
    setShowConfigModal(null);
    toast.success(`${getToolName(toolId)} 配置已保存！`);
  };

  const getToolName = (toolId: string) => {
    const allTools = toolServiceCategories.flatMap(cat => cat.tools);
    const tool = allTools.find(t => t.id === toolId);
    return tool?.name || toolId;
  };

  // 测试连接
  const handleTestConnection = async (toolId: string) => {
    const config = toolConfigs[toolId];
    if (!config) return;

    try {
      // 模拟连接测试
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 随机成功/失败（实际项目中这里会是真实的连接测试）
      const success = Math.random() > 0.3;
      
      if (success) {
        toast.success(`${getToolName(toolId)} 连接测试成功！`);
        setToolConfigs(prev => ({
          ...prev,
          [toolId]: {
            ...prev[toolId],
            isConfigured: true
          }
        }));
      } else {
        toast.error(`${getToolName(toolId)} 连接测试失败，请检查配置信息`);
      }
    } catch (error) {
      toast.error(`${getToolName(toolId)} 连接测试异常`);
    }
  };

  // 渲染服务总览页面
  if (currentView === "overview") {
    const filteredCategories = getFilteredCategories();

    return (
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="mb-2">MBSE工具服务</h1>
            <p className="text-gray-600">
              集成化的模型驱动系统工程工具链，支持全生命周期开发流程
            </p>
          </div>
          <button
            onClick={handleCreateModelClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>创建新模型</span>
          </button>
        </div>

        {/* 创建模型模态框 */}
        {showCreateModelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">创建新模型</h2>
                <button
                  onClick={() => setShowCreateModelModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  选择要使用的工具来创建新模型，模型将自动保存到您的个人模型库中。
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* EA工具 */}
                  <button
                    onClick={() => handleCreateModelFromTool('EA')}
                    disabled={isCreatingModel}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left disabled:opacity-50"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <GitBranch className="w-6 h-6 text-green-600" />
                      <h3 className="font-medium">Enterprise Architect</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      创建SysML系统架构模型，支持UML建模和系统设计
                    </p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        架构设计
                      </span>
                    </div>
                  </button>

                  {/* Dymola工具 */}
                  <button
                    onClick={() => handleCreateModelFromTool('DYMOLA')}
                    disabled={isCreatingModel}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left disabled:opacity-50"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Cpu className="w-6 h-6 text-purple-600" />
                      <h3 className="font-medium">Dymola</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      创建多物理域仿真模型，支持动态建模和仿真分析
                    </p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                        物理仿真
                      </span>
                    </div>
                  </button>

                  {/* POLARION工具 */}
                  <button
                    onClick={() => handleCreateModelFromTool('POLARION')}
                    disabled={isCreatingModel}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left disabled:opacity-50"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <FileText className="w-6 h-6 text-blue-600" />
                      <h3 className="font-medium">POLARION ALM</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      创建需求管理模型，支持需求追踪和验证管理
                    </p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        需求管理
                      </span>
                    </div>
                  </button>

                  {/* MWorks工具 */}
                  <button
                    onClick={() => handleCreateModelFromTool('MWORKS')}
                    disabled={isCreatingModel}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left disabled:opacity-50"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Database className="w-6 h-6 text-orange-600" />
                      <h3 className="font-medium">MWorks</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      创建多学科仿真模型，支持并行计算和优化设计
                    </p>
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                        系统仿真
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {isCreatingModel && (
                <div className="flex items-center justify-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>正在创建模型...</span>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowCreateModelModal(false)}
                  disabled={isCreatingModel}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 基于角色的提示信息 */}
        {userRole && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">
              针对{userRole === 'admin' ? '平台管理员' : 
                  userRole === 'projectManager' ? '项目经理' :
                  userRole === 'architect' ? '系统架构师' :
                  userRole === 'simulation' ? '仿真工程师' : '建模工程师'}的工具建议
            </h3>
            <p className="text-blue-800 text-sm">
              {userRole === 'admin' && '您可以管理所有工具的配置、用户权限和服务状态。建议关注系统集成度和用户使用情况。'}
              {userRole === 'projectManager' && '建议重点关注需求管理和项目协作工具，确保团队高效协作和项目进度可控。'}
              {userRole === 'architect' && '建议重点使用架构设计工具，如EA、MagicDraw等，进行系统建模和架构分析。'}
              {userRole === 'simulation' && '建议重点关注仿真分析工具，如MWorks、ANSYS等，进行性能验证和优化。'}
              {userRole === 'modeling' && '建议重点使用建模工具，关注模型质量和标准化建模流程。'}
            </p>
          </div>
        )}

        {/* 工具统计概览 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">已配置工具</span>
            </div>
            <p className="text-2xl font-semibold text-green-600 mt-1">
              {Object.values(toolConfigs).filter(config => config.isConfigured).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">运行中工具</span>
            </div>
            <p className="text-2xl font-semibold text-blue-600 mt-1">
              {toolServiceCategories.flatMap(cat => cat.tools).filter(tool => tool.status === 'active').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">总工具数</span>
            </div>
            <p className="text-2xl font-semibold text-purple-600 mt-1">
              {toolServiceCategories.flatMap(cat => cat.tools).length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-600">平均使用率</span>
            </div>
            <p className="text-2xl font-semibold text-orange-600 mt-1">
              {Math.round(toolServiceCategories.flatMap(cat => cat.tools).reduce((sum, tool) => sum + tool.usage, 0) / toolServiceCategories.flatMap(cat => cat.tools).length)}%
            </p>
          </div>
        </div>

        {/* 工具服务分类卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => {
            const IconComponent = category.icon;
            const configuredTools = category.tools.filter(tool => toolConfigs[tool.id]?.isConfigured).length;
            const totalTools = category.tools.length;
            
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${getCategoryColor(category.color)}`}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-white rounded-lg">
                    <IconComponent className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm opacity-75">{category.stage}</p>
                  </div>
                </div>
                <p className="text-sm mb-4 opacity-90">{category.description}</p>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-sm font-medium">
                      {totalTools} 个工具
                    </span>
                    <div className="text-xs">
                      已配置: {configuredTools}/{totalTools}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4" />
                </div>
                {/* 配置进度条 */}
                <div className="mt-3">
                  <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                    <div 
                      className="bg-current h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(configuredTools / totalTools) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 快速配置区域 */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2>快速配置工具</h2>
              <p className="text-gray-600 mt-1">
                点击下方工具卡片快速配置连接参数
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['polarion', 'doors', 'ea', 'magicdraw', 'mworks', 'ansys', 'abaqus', 'adams'].map(toolId => {
              const tool = toolServiceCategories.flatMap(cat => cat.tools).find(t => t.id === toolId);
              if (!tool) return null;
              
              const config = toolConfigs[toolId];
              const isConfigured = config?.isConfigured;
              
              return (
                <div
                  key={toolId}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                    isConfigured 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                  onClick={() => setShowConfigModal(toolId)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{tool.name}</h4>
                    {isConfigured ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Settings className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{tool.vendor}</p>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded text-xs ${getComplexityColor(tool.complexity)}`}>
                      {tool.complexity}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(tool.status)}`}>
                      {isConfigured ? '已配置' : '未配置'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 工具配置弹窗 - 现在需要为不同用途创建不同的模态框 */}
        {showConfigModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
              <h3 className="font-medium mb-4">配置 {getToolName(showConfigModal)}</h3>
              <p className="text-gray-600 text-sm mb-4">
                工具配置功能正在开发中，请稍后再试。
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowConfigModal(null)}
                  className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 创建新模型弹窗 */}
        {showCreateModelModal && (
          <ToolConfigModal
            isOpen={showCreateModelModal}
            onClose={() => setShowCreateModelModal(false)}
            onConfirm={(modelData) => {
              console.log('创建新模型:', modelData);
              setShowCreateModelModal(false);
            }}
          />
        )}
      </div>
    );
  }

  // 渲染分类视图
  if (currentView === "category" && selectedCategory) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToOverview}
            className="text-gray-600 hover:text-gray-900"
          >
            ← 返回概览
          </button>
          <div>
            <h1>{selectedCategory.name}</h1>
            <p className="text-gray-600">{selectedCategory.description}</p>
          </div>
        </div>

        {/* 基于角色的提示 */}
        {userRole && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              根据您的角色权限，工具已按相关度排序显示。相关度高的工具会优先展示。
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedCategory.tools.map((tool: any) => {
            const config = toolConfigs[tool.id];
            const isConfigured = config?.isConfigured;
            
            return (
              <div
                key={tool.id}
                className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">{tool.name}</h3>
                  <div className="flex items-center space-x-2">
                    {tool.relevanceScore && (
                      <span className={`px-2 py-1 rounded text-xs ${getRelevanceColor(tool.relevanceScore)}`}>
                        相关度: {tool.relevanceScore}
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(isConfigured ? 'configured' : tool.status)}`}>
                      {isConfigured ? '已配置' : getStatusText(tool.status)}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">厂商:</span>
                      <div>{tool.vendor}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">版本:</span>
                      <div>{tool.version}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">复杂度:</span>
                      <span className={`px-2 py-1 rounded text-xs ${getComplexityColor(tool.complexity)}`}>
                        {tool.complexity}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">使用率:</span>
                      <div>{tool.usage}%</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {tool.features.slice(0, 3).map((feature: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {feature}
                      </span>
                    ))}
                    {tool.features.length > 3 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{tool.features.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowConfigModal(tool.id)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
                    >
                      <Settings className="w-4 h-4" />
                      <span>配置</span>
                    </button>
                    <button
                      onClick={() => handleToolSelection(tool)}
                      disabled={!isConfigured}
                      className={`flex-1 px-3 py-2 text-sm rounded transition-colors flex items-center justify-center space-x-1 ${
                        isConfigured 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>打开</span>
                    </button>
                    <button
                      onClick={() => handleToolClick(tool)}
                      className="px-3 py-2 text-gray-600 text-sm border rounded hover:bg-gray-50 transition-colors"
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 工具配置弹窗 - 现在需要为不同用途创建不同的模态框 */}
        {showConfigModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
              <h3 className="font-medium mb-4">配置 {getToolName(showConfigModal)}</h3>
              <p className="text-gray-600 text-sm mb-4">
                工具配置功能正在开发中，请稍后再试。
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowConfigModal(null)}
                  className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 渲染工具详情视图
  if (currentView === "tool" && selectedTool) {
    const config = toolConfigs[selectedTool.id];
    const isConfigured = config?.isConfigured;

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToCategory}
            className="text-gray-600 hover:text-gray-900"
          >
            ← 返回分类
          </button>
          <div>
            <h1>{selectedTool.name}</h1>
            <p className="text-gray-600">{selectedTool.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="mb-4">工具信息</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">状态</label>
                  <div className={`inline-block px-2 py-1 rounded text-sm mt-1 ${getStatusColor(isConfigured ? 'configured' : selectedTool.status)}`}>
                    {isConfigured ? '已配置' : getStatusText(selectedTool.status)}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-500">版本</label>
                  <p>{selectedTool.version}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">厂商</label>
                  <p>{selectedTool.vendor}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">许可证</label>
                  <p>{selectedTool.license}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">复杂度</label>
                  <span className={`px-2 py-1 rounded text-sm ${getComplexityColor(selectedTool.complexity)}`}>
                    {selectedTool.complexity}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-gray-500">使用率</label>
                  <p>{selectedTool.usage}%</p>
                </div>
                {selectedTool.lastUsed && (
                  <div className="col-span-2">
                    <label className="text-sm text-gray-500">最后使用</label>
                    <p>{selectedTool.lastUsed}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h2 className="mb-4">功能特性</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedTool.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedTool.roleRelevance && userRole && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="mb-4">角色相关性</h2>
                <div className="space-y-3">
                  {Object.entries(selectedTool.roleRelevance).map(([role, relevance]) => (
                    <div key={role} className="flex items-center justify-between">
                      <span className="text-sm">
                        {role === 'admin' ? '平台管理员' :
                         role === 'projectManager' ? '项目经理' :
                         role === 'architect' ? '系统架构师' :
                         role === 'simulation' ? '仿真工程师' : '建模工程师'}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${getRelevanceColor(relevance)}`}>
                        {relevance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="mb-4">快速操作</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => handleToolSelection(selectedTool)}
                  disabled={!isConfigured}
                  className={`w-full px-4 py-2 rounded transition-colors flex items-center justify-center space-x-2 ${
                    isConfigured 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>启动工具</span>
                </button>
                <button 
                  onClick={() => setShowConfigModal(selectedTool.id)}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Settings className="w-4 h-4" />
                  <span>配置工具</span>
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>查看监控</span>
                </button>
                <button 
                  onClick={() => handleTestConnection(selectedTool.id)}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>测试连接</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="mb-4">使用统计</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">本月使用次数</span>
                  <span className="font-medium">{Math.floor(Math.random() * 200) + 50}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">平均响应时间</span>
                  <span className="font-medium">{(Math.random() * 3 + 0.5).toFixed(1)}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">可用性</span>
                  <span className="font-medium text-green-600">{(Math.random() * 5 + 95).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">配置状态</span>
                  <span className={`font-medium ${isConfigured ? 'text-green-600' : 'text-red-600'}`}>
                    {isConfigured ? '已配置' : '未配置'}
                  </span>
                </div>
              </div>
            </div>

            {isConfigured && config.connectionUrl && (
              <div className="bg-white rounded-lg border p-6">
                <h3 className="mb-4">连接信息</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">连接地址</span>
                    <span className="font-mono text-xs">{config.connectionUrl}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">协议</span>
                    <span>{config.protocol?.toUpperCase()}</span>
                  </div>
                  {config.port && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">端口</span>
                      <span>{config.port}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 工具配置弹窗 - 现在需要为不同用途创建不同的模态框 */}
        {showConfigModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-h-[80vh] overflow-y-auto">
              <h3 className="font-medium mb-4">配置 {getToolName(showConfigModal)}</h3>
              <p className="text-gray-600 text-sm mb-4">
                工具配置功能正在开发中，请稍后再试。
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowConfigModal(null)}
                  className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}