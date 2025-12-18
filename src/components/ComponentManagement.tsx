import { useState } from "react"
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Package, 
  Settings, 
  Layers, 
  Workflow,
  Clock,
  Users,
  Download,
  Star,
  Eye,
  Grid3X3,
  List,
  ArrowUpDown,
  Cpu,
  Zap,
  Database,
  Wrench,
  Upload,
  Shield,
  FileText,
  X,
  Edit,
  Trash2,
  Copy,
  ChevronRight,
  Activity,
  Target,
  Cog,
  BarChart3,
  Microscope,
  Beaker
} from "lucide-react@0.487.0"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Card } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Separator } from "./ui/separator"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { toast } from "sonner@2.0.3"
import { componentLibraryService } from "../services/ComponentLibraryService"

interface ComponentManagementProps {
  onCategoryClick?: (category: any) => void
  onComponentClick?: (component: any) => void
  onMbseSimulationClick?: () => void
}

export function ComponentManagement({ 
  onCategoryClick, 
  onComponentClick, 
  onMbseSimulationClick 
}: ComponentManagementProps) {
  const [createComponentOpen, setCreateComponentOpen] = useState(false)
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [addNodeDialogOpen, setAddNodeDialogOpen] = useState(false)
  const [selectedCategoryForNode, setSelectedCategoryForNode] = useState<any>(null)
  const [componentFormData, setComponentFormData] = useState({
    name: "",
    description: "",
    category: "",
    type: "function",
    tags: ""
  })
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
    description: "",
    color: "bg-blue-500"
  })

  // Mock data for component stats
  const componentStats = [
    {
      title: "总组件数",
      value: "156",
      change: "+12%",
      changeType: "increase" as const,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "活跃组件",
      value: "89",
      change: "+8%",
      changeType: "increase" as const,
      icon: Layers,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "本月使用",
      value: "2,341",
      change: "+23%",
      changeType: "increase" as const,
      icon: Workflow,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "贡献者",
      value: "24",
      change: "+2",
      changeType: "increase" as const,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ]

  // Enhanced component categories with MBSE structure
  const componentCategories = [
    {
      id: "requirement-management",
      name: "需求管理及同步",
      description: "需求分析、管理与同步相关组件，基于POLARION、IBM DOORS等工具",
      count: 23,
      icon: Database,
      color: "bg-blue-500",
      tag: "POLARION-DOORS",
      components: ["POLARION集成器", "DOORS连接器", "需求追踪器", "需求验证器"],
      subcategories: [
        {
          id: "polarion-integration",
          name: "POLARION集成组件", 
          description: "基于POLARION ALM的需求管理和协作组件",
          count: 8,
          components: [
            { id: "polarion-connector", name: "POLARION连接器", description: "连接POLARION服务器，同步需求数据", status: "active", toolChain: "POLARION ALM → 需求同步 → 数据验证" },
            { id: "polarion-req-sync", name: "POLARION需求同步器", description: "实时同步POLARION中的需求变更", status: "active", toolChain: "POLARION Workspace → API接口 → 本地缓存" },
            { id: "polarion-workflow", name: "POLARION工作流管理", description: "管理POLARION中的审批流程", status: "active", toolChain: "工作流定义 → 审批节点 → 状态更新" },
            { id: "polarion-baseline", name: "POLARION基线管理", description: "管理需求基线和版本控制", status: "draft", toolChain: "基线创建 → 版本比较 → 变更跟踪" }
          ]
        },
        {
          id: "doors-integration",
          name: "IBM DOORS集成组件",
          description: "基于IBM DOORS Next的需求追踪和管理组件",
          count: 7,
          components: [
            { id: "doors-connector", name: "DOORS连接器", description: "连接IBM DOORS数据库", status: "active", toolChain: "DOORS Database → OSLC/REST API → 数据解析" },
            { id: "doors-dxl-engine", name: "DOORS DXL执行引擎", description: "执行DOORS DXL脚本", status: "active", toolChain: "DXL脚本 → 执行引擎 → 数据处理" },
            { id: "doors-traceability", name: "DOORS追溯链管理", description: "管理需求间的追溯关系", status: "active", toolChain: "追溯定义 → 关系映射 → 影响分析" },
            { id: "doors-migration", name: "DOORS数据迁移器", description: "从传统DOORS迁移到DOORS Next", status: "draft", toolChain: "数据导出 → 格式转换 → 数据导入" }
          ]
        },
        {
          id: "reqtify-integration",
          name: "ReqTify追溯组件",
          description: "基于ReqTify的需求追溯和验证工具集",
          count: 8,
          components: [
            { id: "reqtify-tracer", name: "ReqTify追溯管理器", description: "建立端到端需求追溯关系", status: "active", toolChain: "需求定义 → 设计元素 → 测试用例" },
            { id: "reqtify-validator", name: "需求覆盖验证器", description: "验证需求覆盖完整性", status: "active", toolChain: "需求矩阵 → 覆盖分析 → 缺口识别" },
            { id: "reqtify-impact-analyzer", name: "变更影响分析器", description: "分析需求变更的影响范围", status: "active", toolChain: "变更检测 → 依赖分析 → 影响评估" }
          ]
        }
      ]
    },
    {
      id: "function-architecture",
      name: "功能与架构设计",
      description: "系统架构设计与建模组件，基于EA、MagicDraw、IBM Rhapsody等工具",
      count: 35,
      icon: Cpu,
      color: "bg-green-500",
      tag: "EA-MAGICDRAW",
      components: ["EA建模器", "MagicDraw连接器", "SysML转换器", "架构分析器"],
      subcategories: [
        {
          id: "ea-integration",
          name: "Enterprise Architect建模",
          description: "基于EA的UML/SysML系统建模工具",
          count: 12,
          components: [
            { id: "ea-connector", name: "EA数据库连接器", description: "连接EA项目数据库", status: "active", toolChain: "EA Repository → ODBC/API → 模型数据" },
            { id: "ea-uml-generator", name: "UML图生成器", description: "自动生成UML架构图", status: "active", toolChain: "系统模型 → UML转换 → 图形渲染" },
            { id: "ea-sysml-converter", name: "SysML转换器", description: "UML到SysML的模型转换", status: "active", toolChain: "UML模型 → SysML Profile → 系统模型" },
            { id: "ea-code-generator", name: "EA代码生成器", description: "从模型生成代码框架", status: "draft", toolChain: "类图模型 → 代码模板 → 源码生成" }
          ]
        },
        {
          id: "magicdraw-integration", 
          name: "MagicDraw系统建模",
          description: "基于MagicDraw的专业SysML建模工具集",
          count: 15,
          components: [
            { id: "magicdraw-connector", name: "MagicDraw连接器", description: "连接MagicDraw项目", status: "active", toolChain: "MagicDraw Project → TWCloud API → 模型同步" },
            { id: "sysml-modeler", name: "SysML建模器", description: "专业SysML系统建模工具", status: "active", toolChain: "需求输入 → SysML建模 → 架构验证" },
            { id: "magicdraw-simulator", name: "MagicDraw仿真引擎", description: "执行SysML模型仿真", status: "active", toolChain: "行为模型 → 仿真执行 → 结果分析" },
            { id: "cameo-integrator", name: "Cameo Systems Modeler集成", description: "与Cameo Systems Modeler集成", status: "active", toolChain: "系统架构 → Cameo建模 → 需求追踪" }
          ]
        },
        {
          id: "rhapsody-integration",
          name: "IBM Rhapsody MBSE",
          description: "基于IBM Rhapsody的模型驱动开发工具",
          count: 8,
          components: [
            { id: "rhapsody-connector", name: "Rhapsody模型连接器", description: "连接Rhapsody项目文件", status: "active", toolChain: "Rhapsody Model → API接口 → 模型数据" },
            { id: "rhapsody-codegen", name: "Rhapsody代码生成器", description: "从模型生成实时代码", status: "active", toolChain: "状态机模型 → 代码生成 → C++/Java代码" },
            { id: "rhapsody-debugger", name: "模型调试器", description: "实时模型执行和调试", status: "draft", toolChain: "可执行模型 → 断点设置 → 运行调试" }
          ]
        }
      ]
    },
    {
      id: "system-integration-sim", 
      name: "系统集成仿真",
      description: "仿真验证与测试组件，基于MWorks、Dymola、MATLAB/Simulink、AMESim等工具",
      count: 48,
      icon: Zap,
      color: "bg-purple-500",
      tag: "MWORKS-MODELICA",
      components: ["MWorks引擎", "Modelica编译器", "FMI接口", "SSP封装器"],
      subcategories: [
        {
          id: "mworks-integration",
          name: "MWorks仿真平台",
          description: "基于MWorks的多学科仿真建模工具",
          count: 18,
          components: [
            { id: "mworks-engine", name: "MWorks仿真引擎", description: "MWorks多物理域仿真计算引擎", status: "active", toolChain: "Modelica模型 → MWorks编译 → 仿真计算" },
            { id: "mworks-compiler", name: "Modelica编译器", description: "Modelica语言编译器", status: "active", toolChain: "Modelica源码 → 编译优化 → 可执行模型" },
            { id: "mworks-optimizer", name: "MWorks优化器", description: "参数优化和设计空间探索", status: "active", toolChain: "目标函数 → 优化算法 → 最优解" },
            { id: "mworks-cloud", name: "MWorks云计算平台", description: "云端并行仿真计算", status: "draft", toolChain: "本地模型 → 云端部署 → 分布式计算" }
          ]
        },
        {
          id: "dymola-integration",
          name: "Dymola仿真工具", 
          description: "基于Dymola的多物理域建模和仿真环境",
          count: 16,
          components: [
            { id: "dymola-connector", name: "Dymola连接器", description: "连接Dymola仿真环境", status: "active", toolChain: "Dymola Interface → API调用 → 仿真控制" },
            { id: "fmu-generator", name: "FMU生成器", description: "生成符合FMI标准的FMU", status: "active", toolChain: "Dymola模型 → FMU编译 → 标准接口" },
            { id: "dymola-optimizer", name: "Dymola优化工具", description: "基于Dymola的优化算法", status: "active", toolChain: "优化问题 → Dymola求解 → 结果分析" },
            { id: "real-time-simulator", name: "实时仿真器", description: "实时仿真和HIL测试", status: "draft", toolChain: "实时模型 → 硬件接口 → 实时执行" }
          ]
        },
        {
          id: "amesim-integration",
          name: "AMESim系统仿真",
          description: "基于Simcenter AMESim的1D系统仿真平台", 
          count: 10,
          components: [
            { id: "amesim-connector", name: "AMESim连接器", description: "连接AMESim仿真环境", status: "active", toolChain: "AMESim Model → API接口 → 仿真控制" },
            { id: "hydraulic-modeler", name: "液压系统建模器", description: "液压系统建模和仿真", status: "active", toolChain: "液压元件 → 系统建模 → 动态仿真" },
            { id: "thermal-analyzer", name: "热管理分析器", description: "热管理系统分析工具", status: "active", toolChain: "热源分析 → 散热设计 → 温度场仿真" },
            { id: "hil-integrator", name: "HIL集成器", description: "硬件在环测试集成", status: "draft", toolChain: "仿真模型 → 实时接口 → 硬件测试" }
          ]
        },
        {
          id: "simulink-integration",
          name: "MATLAB/Simulink工具",
          description: "基于MATLAB/Simulink的控制系统建模仿真",
          count: 14,
          components: [
            { id: "simulink-connector", name: "Simulink连接器", description: "连接MATLAB/Simulink环境", status: "active", toolChain: "Simulink Model → MATLAB Engine → 仿真执行" },
            { id: "control-designer", name: "控制系统设计器", description: "控制算法设计和验证", status: "active", toolChain: "控制需求 → 算法设计 → 仿真验证" },
            { id: "signal-processor", name: "信号处理器", description: "数字信号处理和分析", status: "active", toolChain: "原始信号 → 滤波处理 → 特征提取" },
            { id: "code-generator", name: "代码生成器", description: "从Simulink模型生成C代码", status: "active", toolChain: "Simulink模型 → 代码生成 → 嵌入式部署" }
          ]
        }
      ]
    },
    {
      id: "cae-simulation",
      name: "专业CAE仿真", 
      description: "基于ANSYS、Abaqus、MSC Adams等专业CAE工具的仿真分析",
      count: 42,
      icon: Database,
      color: "bg-orange-500",
      tag: "ANSYS-ABAQUS",
      components: ["ANSYS Workbench", "Abaqus求解器", "Adams动力学", "Fluent CFD"],
      subcategories: [
        {
          id: "ansys-integration",
          name: "ANSYS工作台",
          description: "基于ANSYS Workbench的多物理场仿真平台",
          count: 16,
          components: [
            { id: "ansys-workbench", name: "ANSYS Workbench连接器", description: "连接ANSYS Workbench环境", status: "active", toolChain: "几何模型 → 网格生成 → 求解计算" },
            { id: "ansys-structural", name: "结构分析器", description: "基于ANSYS的结构强度分析", status: "active", toolChain: "CAD几何 → 材料定义 → 强度计算" },
            { id: "ansys-thermal", name: "热分析器", description: "热传导和热应力分析", status: "active", toolChain: "热源定义 → 边界条件 → 温度场分析" },
            { id: "ansys-electromagnetic", name: "电磁分析器", description: "电磁场仿真分析", status: "active", toolChain: "电磁参数 → 场分析 → 性能评估" },
            { id: "ansys-optimizer", name: "ANSYS优化器", description: "基于ANSYS的设计优化", status: "draft", toolChain: "设计变量 → 目标��数 → 优化求解" }
          ]
        },
        {
          id: "abaqus-integration",
          name: "Abaqus非线性分析",
          description: "基于Abaqus的高级非线性有限元分析工具",
          count: 12,
          components: [
            { id: "abaqus-connector", name: "Abaqus连接器", description: "连接Abaqus求解环境", status: "active", toolChain: "Abaqus Model → 求解器调用 → 结果处理" },
            { id: "nonlinear-analyzer", name: "非线性分析器", description: "材料和几何非线性分析", status: "active", toolChain: "非线性模型 → 增量求解 → 收敛分析" },
            { id: "composite-analyzer", name: "复合材料分析器", description: "复合材料层合板分析", status: "active", toolChain: "铺层定义 → 失效分析 → 强度预测" },
            { id: "fracture-analyzer", name: "断裂力学分析器", description: "裂纹扩展和断裂分析", status: "draft", toolChain: "裂纹模型 → 断裂参数 → 寿命预测" }
          ]
        },
        {
          id: "adams-integration", 
          name: "MSC Adams动力学",
          description: "基于MSC Adams的多体动力学仿真分析",
          count: 10,
          components: [
            { id: "adams-connector", name: "Adams连接器", description: "连接MSC Adams环境", status: "active", toolChain: "机构模型 → Adams求解 → 动力学分析" },
            { id: "multibody-modeler", name: "多体建模器", description: "多体系统建模工具", status: "active", toolChain: "刚体定义 → 约束设置 → 运动副配置" },
            { id: "vibration-analyzer", name: "振动分析器", description: "系统振动特性分析", status: "active", toolChain: "模态分析 → 频响计算 → 振动评估" },
            { id: "control-integrator", name: "控制系统集成器", description: "与控制系统的联合仿真", status: "draft", toolChain: "机械系统 → 控制算法 → 闭环仿真" }
          ]
        },
        {
          id: "fluent-integration",
          name: "ANSYS Fluent CFD",
          description: "基于ANSYS Fluent的计算流体力学分析",
          count: 4,
          components: [
            { id: "fluent-connector", name: "Fluent连接器", description: "连接ANSYS Fluent求解器", status: "active", toolChain: "流体域 → 网格生成 → CFD求解" },
            { id: "turbulence-modeler", name: "湍流建模器", description: "湍流模型设置和求解", status: "active", toolChain: "湍流模型 → 边界层处理 → 流场分析" },
            { id: "heat-transfer-analyzer", name: "传热分析器", description: "流体传热分析", status: "active", toolChain: "传热模式 → 温度边界 → 热流分析" }
          ]
        }
      ]
    },
    {
      id: "verification-validation",
      name: "验证与确认",
      description: "基于NI TestStand、IBM RTRT、VectorCAST等V&V工具集",
      count: 28,
      icon: Shield,
      color: "bg-red-500",
      tag: "TESTSTAND-VV",
      components: ["TestStand测试", "RTRT验证", "VectorCAST测试", "合规检查"],
      subcategories: [
        {
          id: "teststand-integration",
          name: "NI TestStand测试平台",
          description: "基于NI TestStand的自动化测试执行平台",
          count: 10,
          components: [
            { id: "teststand-engine", name: "TestStand执行引擎", description: "自动化测试序列执行", status: "active", toolChain: "测试序列 → 自动执行 → 结果记录" },
            { id: "test-sequencer", name: "测试序列管理器", description: "测试用例序列化管理", status: "active", toolChain: "测试用例 → 序列编排 → 执行控制" },
            { id: "test-report-generator", name: "测试报告生成器", description: "自动生成测试报告", status: "active", toolChain: "测试数据 → 报告模板 → 报告生成" },
            { id: "test-data-analyzer", name: "测试数据分析器", description: "测试结果统计分析", status: "draft", toolChain: "原始数据 → 统计分析 → 趋势识别" }
          ]
        },
        {
          id: "rtrt-integration",
          name: "IBM RTRT实时测试",
          description: "基于IBM RTRT的实时测试和验证工具",
          count: 8,
          components: [
            { id: "rtrt-connector", name: "RTRT连接器", description: "连接IBM RTRT测试环境", status: "active", toolChain: "RTRT Project → 测试接口 → 执行控制" },
            { id: "unit-test-generator", name: "单元测试生成器", description: "自动生成单元测试用例", status: "active", toolChain: "源代码分析 → 测试用例生成 → 覆盖率分析" },
            { id: "integration-tester", name: "集成测试器", description: "系统集成测试工具", status: "active", toolChain: "接口定义 → 集成测试 → 兼容性验证" },
            { id: "performance-profiler", name: "性能分析器", description: "实时性能监控和分析", status: "draft", toolChain: "性能监控 → 瓶颈分析 → 优化建议" }
          ]
        },
        {
          id: "vectorcast-integration",
          name: "VectorCAST软件测试",
          description: "基于VectorCAST的嵌入式软件测试平台",
          count: 6,
          components: [
            { id: "vectorcast-connector", name: "VectorCAST连接器", description: "连接VectorCAST测试环境", status: "active", toolChain: "VectorCAST Project → API接口 → 测试管理" },
            { id: "coverage-analyzer", name: "覆盖率分析器", description: "代码覆盖率分析工具", status: "active", toolChain: "测试执行 → 覆盖率统计 → 覆盖报告" },
            { id: "regression-tester", name: "回归测试器", description: "自动化回归测试管理", status: "active", toolChain: "基线测试 → 变更检测 → 回归验证" }
          ]
        },
        {
          id: "compliance-validation",
          name: "合规性验证工具",
          description: "标准合规性检查和质量验证工具集",
          count: 4,
          components: [
            { id: "iso26262-checker", name: "ISO26262合规检查器", description: "汽车功能安全标准检查", status: "active", toolChain: "安全需求 → 合规检查 → 证据生成" },
            { id: "aspice-validator", name: "ASPICE流程验证器", description: "汽车SPICE流程合规验证", status: "active", toolChain: "流程定义 → 合规评估 → 改进建议" },
            { id: "quality-auditor", name: "质量审核器", description: "设计质量自动审核工具", status: "draft", toolChain: "质量规则 → 自动检查 → 问题报告" }
          ]
        }
      ]
    },
    {
      id: "optimization-analysis",
      name: "优化分析", 
      description: "基于ANSYS optiSLang、modeFRONTIER等优化分析工具",
      count: 22,
      icon: BarChart3,
      color: "bg-emerald-500",
      tag: "OPTISLANG-DOE",
      components: ["optiSLang优化", "modeFRONTIER", "DOE设计", "敏感性分析"],
      subcategories: [
        {
          id: "optislang-integration",
          name: "ANSYS optiSLang优化",
          description: "基于ANSYS optiSLang的多学科设计优化平台",
          count: 10,
          components: [
            { id: "optislang-connector", name: "optiSLang连接器", description: "连接ANSYS optiSLang优化环境", status: "active", toolChain: "参数定义 → 优化算法 → 结果分析" },
            { id: "multi-objective-optimizer", name: "多目标优化器", description: "多目标设计优化工具", status: "active", toolChain: "目标函数 → Pareto前沿 → 权衡分析" },
            { id: "sensitivity-analyzer", name: "敏感性分析器", description: "参数敏感性分析工具", status: "active", toolChain: "参数扰动 → 敏感性计算 → 重要性排序" },
            { id: "robustness-evaluator", name: "鲁棒性评估器", description: "设计鲁棒性分析工具", status: "active", toolChain: "不确定性量化 → 鲁棒性指标 → 可靠性评估" },
            { id: "uncertainty-quantifier", name: "不确定性量化器", description: "不确定性传播和量化", status: "draft", toolChain: "输入不确定性 → 传播分析 → 输出分布" }
          ]
        },
        {
          id: "modefrontier-integration", 
          name: "modeFRONTIER优化平台",
          description: "基于modeFRONTIER的多学科优化和数据分析平台",
          count: 8,
          components: [
            { id: "modefrontier-connector", name: "modeFRONTIER连接器", description: "连接modeFRONTIER优化平台", status: "active", toolChain: "工作流定义 → 优化执行 → 数据后处理" },
            { id: "doe-designer", name: "DOE实验设计器", description: "实验设计和样本生成", status: "active", toolChain: "设计空间 → 采样策略 → 实验矩阵" },
            { id: "data-miner", name: "数据挖掘器", description: "仿真数据挖掘和模式识别", status: "active", toolChain: "仿真数据 → 模式识别 → 知识提取" },
            { id: "workflow-automator", name: "工作流自动化器", description: "多工具集成工作流自动化", status: "draft", toolChain: "流程定义 → 自动调度 → 结果集成" }
          ]
        },
        {
          id: "dakota-integration",
          name: "DAKOTA优化工具包",
          description: "基于开源DAKOTA的优化和不确定性量化工具",
          count: 4,
          components: [
            { id: "dakota-optimizer", name: "DAKOTA优化器", description: "全局优化算法库", status: "active", toolChain: "优化问题 → 算法选择 → 最优解搜索" },
            { id: "dakota-uncertainty", name: "不确定性分析器", description: "蒙特卡洛和多项式混沌方法", status: "active", toolChain: "随机输入 → 不确定性传播 → 统计分析" },
            { id: "dakota-calibrator", name: "参数校准器", description: "模型参数校准和验证", status: "draft", toolChain: "实验数据 → 参数估计 → 模型校准" }
          ]
        }
      ]
    }
  ]

  // Mock data for recent components
  const recentComponents = [
    {
      id: 1,
      name: "POLARION集成器",
      category: "需求管理",
      lastUsed: "2小时前",
      status: "active"
    },
    {
      id: 2,
      name: "M-WORKS仿真",
      category: "系统仿真",
      lastUsed: "1天前", 
      status: "active"
    },
    {
      id: 3,
      name: "EA架构建模",
      category: "功能架构",
      lastUsed: "2天前",
      status: "draft"
    },
    {
      id: 4,
      name: "SSP配置",
      category: "可追溯性",
      lastUsed: "3天前",
      status: "active"
    }
  ]

  // Mock data for popular components
  const popularComponents = [
    {
      id: 1,
      name: "需求验证工具",
      version: "2.1.0",
      description: "自动化需求验证与测试组件",
      downloads: "1,234",
      rating: "4.8",
      category: "需求管理"
    },
    {
      id: 2,
      name: "系统仿真引擎",
      version: "1.5.2",
      description: "高性能系统级仿真组件",
      downloads: "987",
      rating: "4.6",
      category: "系统仿真"
    },
    {
      id: 3,
      name: "架构分析器",
      version: "3.0.1",
      description: "系统架构分析与优化工具",
      downloads: "756",
      rating: "4.7",
      category: "功能架构"
    }
  ]

  const handleCreateComponent = () => {
    if (!componentFormData.name.trim()) {
      toast.error("请输入组件名称")
      return
    }
    
    toast.success("组件创建成功!")
    setCreateComponentOpen(false)
    setComponentFormData({
      name: "",
      description: "",
      category: "",
      type: "function",
      tags: ""
    })
  }

  const handleCreateCategory = () => {
    if (!categoryFormData.name.trim()) {
      toast.error("请输入分类名称")
      return
    }
    
    toast.success("分类创建成功!")
    setCreateCategoryOpen(false)
    setCategoryFormData({
      name: "",
      description: "",
      color: "bg-blue-500"
    })
  }

  const handleCategoryClick = (category: any) => {
    if (selectedCategory === category.id) {
      // 如果已选中，则展开/收起
      setExpandedCategory(expandedCategory === category.id ? null : category.id)
    } else {
      // 如果未选中，则选中并展开
      setSelectedCategory(category.id)
      setExpandedCategory(category.id)
    }
  }

  const handleAddNode = (category: any) => {
    setSelectedCategoryForNode(category)
    setAddNodeDialogOpen(true)
  }

  const handleCreateNode = () => {
    toast.success("节点创建成功!")
    setAddNodeDialogOpen(false)
    setComponentFormData({
      name: "",
      description: "",
      category: "",
      type: "function",
      tags: ""
    })
  }

  const handleComponentClick = (component: any) => {
    onComponentClick?.(component)
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "create":
        setCreateComponentOpen(true)
        break
      case "import":
        toast.info("导入组件功能开发中...")
        break
      case "template":
        toast.info("组件模板功能开发中...")
        break
      case "permission":
        toast.info("权限管理功能开发中...")
        break
      default:
        break
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">组件管理</h1>
          <p className="text-gray-600 mt-1">管理和维护MBSE工作流组件库</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => setSettingsOpen(true)}>
            <Settings className="w-4 h-4 mr-2" />
            设置
          </Button>
          <Button variant="outline" onClick={onMbseSimulationClick}>
            <Microscope className="w-4 h-4 mr-2" />
            MBSE仿真建设
          </Button>
          <Button onClick={() => setCreateComponentOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            创建组件
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {componentStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        stat.changeType === "increase"
                          ? "text-green-700 bg-green-100"
                          : "text-red-700 bg-red-100"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">vs 上月</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Component Categories */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium">MBSE组件分类</h2>
              <Button variant="outline" size="sm" onClick={() => setCreateCategoryOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                新建分类
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {componentCategories.map((category) => {
                const Icon = category.icon
                const isSelected = selectedCategory === category.id
                return (
                  <div
                    key={category.id}
                    className={`p-6 border rounded-lg transition-all cursor-pointer ${
                      isSelected 
                        ? "border-blue-500 bg-blue-50 shadow-md" 
                        : "border-gray-200 hover:shadow-md hover:border-gray-300"
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-gray-900">{category.name}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                          
                          {/* 二级分类预览 - 只在未展开时显示 */}
                          {expandedCategory !== category.id && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              {category.subcategories.map((sub) => (
                                <div 
                                  key={sub.id}
                                  className="p-3 bg-gray-50 rounded border border-gray-100 hover:bg-gray-100 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onComponentClick?.(sub)
                                  }}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-800">{sub.name}</span>
                                    <ChevronRight className="w-3 h-3 text-gray-400" />
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">{sub.count} 个组件</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant={isSelected ? "default" : "secondary"}>{category.count}</Badge>
                        <ChevronRight className={`w-4 h-4 transition-transform ${expandedCategory === category.id ? 'rotate-90 text-blue-600' : isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                      </div>
                    </div>

                    {/* 展开的组件列表 */}
                    {expandedCategory === category.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">组件节点</h4>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddNode(category)
                            }}
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            添加节点
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          {category.subcategories.map((sub) => (
                            <div key={sub.id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm text-gray-900">{sub.name}</span>
                                <Badge variant="outline" className="text-xs">{sub.count} 个</Badge>
                              </div>
                              <p className="text-xs text-gray-600 mb-2">{sub.description}</p>
                              
                              {/* 具体组件列表 */}
                              <div className="grid grid-cols-1 gap-1">
                                {sub.components && sub.components.map((comp: any, idx: number) => (
                                  <div 
                                    key={typeof comp === 'string' ? idx : comp.id}
                                    className="flex items-center justify-between p-2 bg-white rounded border hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onComponentClick?.(comp)
                                    }}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                      <span className="text-sm text-gray-800">
                                        {typeof comp === 'string' ? comp : comp.name}
                                      </span>
                                    </div>
                                    {typeof comp === 'object' && comp.status && (
                                      <Badge 
                                        variant={comp.status === 'active' ? 'default' : 'secondary'} 
                                        className="text-xs px-2 py-0"
                                      >
                                        {comp.status === 'active' ? '活跃' : '草稿'}
                                      </Badge>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-medium mb-4">快速操作</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50"
                onClick={() => handleQuickAction("create")}
              >
                <Plus className="w-6 h-6 text-gray-600" />
                <span className="text-sm">创建组件</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50"
                onClick={() => handleQuickAction("import")}
              >
                <Upload className="w-6 h-6 text-gray-600" />
                <span className="text-sm">导入组件</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50"
                onClick={() => handleQuickAction("template")}
              >
                <FileText className="w-6 h-6 text-gray-600" />
                <span className="text-sm">组件模板</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50"
                onClick={() => handleQuickAction("permission")}
              >
                <Shield className="w-6 h-6 text-gray-600" />
                <span className="text-sm">权限管理</span>
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column - Recent & Popular */}
        <div className="space-y-6">
          {/* Recent Components */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">最近使用</h2>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentComponents.map((component) => (
                <div 
                  key={component.id} 
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  onClick={() => handleComponentClick(component)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {component.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{component.name}</p>
                      <p className="text-xs text-gray-600">{component.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{component.lastUsed}</p>
                    <Badge
                      variant={component.status === "active" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {component.status === "active" ? "活跃" : "草稿"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Popular Components */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">热门组件</h2>
              <Button variant="ghost" size="sm">
                <Star className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {popularComponents.map((component, index) => (
                <div key={component.id} className="space-y-2">
                  <div 
                    className="flex items-start justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                    onClick={() => handleComponentClick(component)}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">{component.name}</span>
                        <Badge variant="outline" className="text-xs">
                          v{component.version}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{component.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          <Download className="w-3 h-3 inline mr-1" />
                          {component.downloads}
                        </span>
                        <span className="text-xs text-gray-500">
                          <Star className="w-3 h-3 inline mr-1" />
                          {component.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  {index < popularComponents.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </Card>

          {/* MBSE Building Guide */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-blue-900">MBSE建设指南</h2>
              <Microscope className="w-5 h-5 text-blue-600" />
            </div>
            
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start space-x-2">
                <Target className="w-4 h-4 mt-0.5 text-blue-600" />
                <span>建立完整的需求到验证闭环</span>
              </div>
              <div className="flex items-start space-x-2">
                <Cog className="w-4 h-4 mt-0.5 text-blue-600" />
                <span>集成多学科建模仿真工具链</span>
              </div>
              <div className="flex items-start space-x-2">
                <Activity className="w-4 h-4 mt-0.5 text-blue-600" />
                <span>实现数字化持续验证</span>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-4 bg-white/50 hover:bg-white/80 border-blue-200"
              onClick={onMbseSimulationClick}
            >
              查看详细建设步骤
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>
      </div>

      {/* Create Component Dialog */}
      <Dialog open={createComponentOpen} onOpenChange={setCreateComponentOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>创建新组件</DialogTitle>
            <DialogDescription>
              填写组件信息创建新的MBSE工作流组件
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                组件名称
              </Label>
              <Input
                id="name"
                className="col-span-3"
                value={componentFormData.name}
                onChange={(e) => setComponentFormData(prev => ({...prev, name: e.target.value}))}
                placeholder="输入组件名称"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                所属分类
              </Label>
              <Select value={componentFormData.category} onValueChange={(value) => setComponentFormData(prev => ({...prev, category: value}))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {componentCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                组件类型
              </Label>
              <Select value={componentFormData.type} onValueChange={(value) => setComponentFormData(prev => ({...prev, type: value}))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="function">功能组件</SelectItem>
                  <SelectItem value="tool">工具组件</SelectItem>
                  <SelectItem value="template">模板组件</SelectItem>
                  <SelectItem value="connector">连接器组件</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                组件描述
              </Label>
              <Textarea
                id="description"
                className="col-span-3"
                value={componentFormData.description}
                onChange={(e) => setComponentFormData(prev => ({...prev, description: e.target.value}))}
                placeholder="描述组件功能和用途"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                标签
              </Label>
              <Input
                id="tags"
                className="col-span-3"
                value={componentFormData.tags}
                onChange={(e) => setComponentFormData(prev => ({...prev, tags: e.target.value}))}
                placeholder="用逗号分隔标签，如：MBSE,仿真,验证"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateComponentOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreateComponent}>创建组件</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Category Dialog */}
      <Dialog open={createCategoryOpen} onOpenChange={setCreateCategoryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>创建新分类</DialogTitle>
            <DialogDescription>
              创建新的组件分类
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryName" className="text-right">
                分类名称
              </Label>
              <Input
                id="categoryName"
                className="col-span-3"
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData(prev => ({...prev, name: e.target.value}))}
                placeholder="输入分类名称"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="categoryDescription" className="text-right pt-2">
                分类描述
              </Label>
              <Textarea
                id="categoryDescription"
                className="col-span-3"
                value={categoryFormData.description}
                onChange={(e) => setCategoryFormData(prev => ({...prev, description: e.target.value}))}
                placeholder="描述分类用途"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="categoryColor" className="text-right">
                分类颜色
              </Label>
              <Select value={categoryFormData.color} onValueChange={(value) => setCategoryFormData(prev => ({...prev, color: value}))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bg-blue-500">蓝色</SelectItem>
                  <SelectItem value="bg-green-500">绿色</SelectItem>
                  <SelectItem value="bg-purple-500">紫色</SelectItem>
                  <SelectItem value="bg-orange-500">橙色</SelectItem>
                  <SelectItem value="bg-red-500">红色</SelectItem>
                  <SelectItem value="bg-emerald-500">翠绿色</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateCategoryOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreateCategory}>创建分类</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>MBSE组件管理设置</DialogTitle>
            <DialogDescription>
              配置MBSE组件管理系统的各项设置
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="general" className="py-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">常规设置</TabsTrigger>
              <TabsTrigger value="permissions">权限管理</TabsTrigger>
              <TabsTrigger value="sync">同步配置</TabsTrigger>
              <TabsTrigger value="mbse">MBSE设置</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>自动备份组件</Label>
                    <p className="text-sm text-gray-500">定期自动备份组件库</p>
                  </div>
                  <Button variant="outline" size="sm">配置</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>组件版本控制</Label>
                    <p className="text-sm text-gray-500">启用组件版本管理</p>
                  </div>
                  <Button variant="outline" size="sm">配置</Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="permissions" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>创建权限</Label>
                    <p className="text-sm text-gray-500">谁可以创建新组件</p>
                  </div>
                  <Button variant="outline" size="sm">管理</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>编辑权限</Label>
                    <p className="text-sm text-gray-500">谁可以编辑组件</p>
                  </div>
                  <Button variant="outline" size="sm">管理</Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="sync" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>POLARION同步</Label>
                    <p className="text-sm text-gray-500">与POLARION平台同步</p>
                  </div>
                  <Button variant="outline" size="sm">配置</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>EA工具集成</Label>
                    <p className="text-sm text-gray-500">与Enterprise Architect集成</p>
                  </div>
                  <Button variant="outline" size="sm">配置</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>云端同步</Label>
                    <p className="text-sm text-gray-500">同步到云端存储</p>
                  </div>
                  <Button variant="outline" size="sm">配置</Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="mbse" className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>MBSE标准模板</Label>
                    <p className="text-sm text-gray-500">配置MBSE建模标准和模板</p>
                  </div>
                  <Button variant="outline" size="sm">管理</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>仿真集成设置</Label>
                    <p className="text-sm text-gray-500">配置仿真工具链集成</p>
                  </div>
                  <Button variant="outline" size="sm">配置</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>追溯链配置</Label>
                    <p className="text-sm text-gray-500">配置端到端追溯链</p>
                  </div>
                  <Button variant="outline" size="sm">配置</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              关闭
            </Button>
            <Button>保存设置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Node Dialog */}
      <Dialog open={addNodeDialogOpen} onOpenChange={setAddNodeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>添加新节点</DialogTitle>
            <DialogDescription>
              在 "{selectedCategoryForNode?.name}" 分类下添加新的组件节点
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nodeName" className="text-right">
                节点名称
              </Label>
              <Input
                id="nodeName"
                className="col-span-3"
                value={componentFormData.name}
                onChange={(e) => setComponentFormData(prev => ({...prev, name: e.target.value}))}
                placeholder="输入节点名称"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nodeSubcategory" className="text-right">
                所属子分类
              </Label>
              <Select value={componentFormData.category} onValueChange={(value) => setComponentFormData(prev => ({...prev, category: value}))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择子分类" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategoryForNode?.subcategories?.map((sub: any) => (
                    <SelectItem key={sub.id} value={sub.id}>
                      {sub.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nodeType" className="text-right">
                节点类型
              </Label>
              <Select value={componentFormData.type} onValueChange={(value) => setComponentFormData(prev => ({...prev, type: value}))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="function">功能节点</SelectItem>
                  <SelectItem value="tool">工具节点</SelectItem>
                  <SelectItem value="connector">连接器节点</SelectItem>
                  <SelectItem value="validator">验证节点</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="nodeDescription" className="text-right pt-2">
                节点描述
              </Label>
              <Textarea
                id="nodeDescription"
                className="col-span-3"
                value={componentFormData.description}
                onChange={(e) => setComponentFormData(prev => ({...prev, description: e.target.value}))}
                placeholder="描述节点功能和用途"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nodeTags" className="text-right">
                标签
              </Label>
              <Input
                id="nodeTags"
                className="col-span-3"
                value={componentFormData.tags}
                onChange={(e) => setComponentFormData(prev => ({...prev, tags: e.target.value}))}
                placeholder="用逗号分隔标签"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddNodeDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreateNode}>添加节点</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}