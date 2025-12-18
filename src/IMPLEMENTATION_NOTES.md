# 实现说明

## 节点配置实现原则

### 1. 节点类型定义
三个节点使用不同的 `type` 标识，但共享配置组件类：

- **架构同步节点**：`type: "ssp-modelica"` → 使用 `SSPModelicaNodeConfig` 组件
- **仿真配置节点**：`type: "simulation"` → 使用 `SimulationNodeConfig` 组件  
- **实验分析节点**：`type: "doe-analysis"` → 使用 `DOEAnalysisNodeConfig` 组件

### 2. 判断函数更新
在 `/components/workflow/workflowEditorUtils.ts` 中：

```typescript
// 架构同步节点判断 - 支持多种名称
export const isSSPModelicaNode = (node: WorkflowNode | null) => {
  if (!node) return false;
  return (
    node.type === "ssp-modelica" ||
    node.name?.includes("架构同步") ||
    node.name?.includes("SSP-Modelica")
  );
};

// 仿真配置节点判断
export const isSimulationNode = (node: WorkflowNode | null) => {
  if (!node) return false;
  return (
    node.type === "simulation" ||
    node.type === "sim-config" ||
    node.name?.includes("仿真配置")
  );
};

// 实验分析节点判断
export const isDOEAnalysisNode = (node: WorkflowNode | null) => {
  if (!node) return false;
  return (
    node.type === "doe-analysis" ||
    node.type === "doe-experiment" ||
    node.name?.includes("实验分析")
  );
};
```

### 3. 节点实例化
在 `/App.tsx` 中整车能耗工作流的节点定义：

```javascript
nodes: [
  {
    id: "node-ve-1",
    type: "ssp-modelica",        // 类型：架构同步
    name: "架构同步",              // 名称
    description: "SSP导入与模型配置...",
    config: {
      parameters: {
        modelingApproach: 'ssp-import',
        // ... 其他参数
      }
    }
  },
  {
    id: "node-ve-2",
    type: "simulation",           // 类型：仿真配置
    name: "仿真配置",
    description: "整车能耗仿真工况配置...",
    config: {
      parameters: {
        drivingCycle: 'NEDC',
        // ... 其他参数
      }
    }
  },
  {
    id: "node-ve-3",
    type: "doe-analysis",         // 类型：实验分析
    name: "实验分析",
    description: "DOE实验设计...",
    config: {
      parameters: {
        doeMethod: 'factorial',
        // ... 其他参数
      }
    }
  }
]
```

### 4. 配置组件路由
在 `/components/WorkflowEditor.tsx` 中：

```typescript
const renderNodeConfig = () => {
  const node = nodes.find((n) => n.id === configNodeId);
  if (!node) return null;

  // 架构同步节点 → SSPModelicaNodeConfig
  if (isSSPModelicaNode(node)) {
    return <SSPModelicaNodeConfig node={node} onSave={...} />;
  }

  // 仿真配置节点 → SimulationNodeConfig
  if (isSimulationNode(node)) {
    return <SimulationNodeConfig node={node} onSave={...} />;
  }

  // 实验分析节点 → DOEAnalysisNodeConfig
  if (isDOEAnalysisNode(node)) {
    return <DOEAnalysisNodeConfig node={node} onSave={...} />;
  }

  // 默认配置
  return <DefaultNodeConfig node={node} onSave={...} />;
};
```

## 关键特性

### 架构同步节点 (`SSPModelicaNodeConfig.tsx`)
- ✅ 支持建模方式选择（SSP导入 / 重新建模）
- ✅ 模型库来源配置
- ✅ ReactFlow架构可视化
- ✅ 模块模型映射（9个模块）
- ✅ 一键应用默认配置
- ✅ 配置进度显示（0/9）

### 仿真配置节点 (`SimulationNodeConfig.tsx`)  
- ✅ 驾驶循环选择（NEDC/WLTC/CLTC等7种）
- ✅ 环境条件配置
- ✅ 整车参数设置
- ✅ 电池初始状态
- ✅ 求解器配置
- ✅ 实时参数计算

### 实验分析节点 (`DOEAnalysisNodeConfig.tsx`)
- ✅ DOE方法选择（8种方法）
- ✅ 工具集成（7种工具）
- ✅ 实验因子配置
- ✅ 优化目标设置
- ✅ 统计分析方法
- ✅ 报告生成选项

## 数据流转

```
┌─────────────────┐
│  架构同步节点    │
│  (ssp-modelica) │
│                 │
│  输出:          │
│  - 模型文件     │
│  - 架构映射表   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  仿真配置节点    │
│  (simulation)   │
│                 │
│  输出:          │
│  - 仿真结果     │
│  - 时间序列     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  实验分析节点    │
│  (doe-analysis) │
│                 │
│  输出:          │
│  - DOE报告      │
│  - 优化建议     │
└─────────────────┘
```

## 配置数据结构

### 架构同步节点配置
```javascript
{
  nodeName: "架构同步",
  description: "...",
  timeout: 1200,
  retryCount: 1,
  autoRun: true,
  parameters: {
    modelingApproach: 'ssp-import',    // 建模方式
    sourceSSPFile: 'project-library',   // SSP源
    targetPlatform: 'modelica',         // 目标平台
    modelicaCompiler: 'openmodelica',   // 编译器
    ibdBlockModels: {                   // 模块映射
      battery_pack: { type: 'modelica', id: '...', name: '...' },
      bms: { type: 'fmu', id: '...', name: '...' },
      // ... 其他9个模块
    },
    modelConfigCompleted: true           // 配置完成状态
  }
}
```

### 仿真配置节点配置
```javascript
{
  nodeName: "仿真配置",
  description: "...",
  timeout: 1800,
  parameters: {
    drivingCycle: 'NEDC',              // 驾驶循环
    ambientTemperature: 25,            // 环境温度
    vehicleMass: 1500,                 // 整车质量
    initialSOC: 100,                   // 初始SOC
    solver: 'dassl',                   // 求解器
    outputFormat: 'csv'                // 输出格式
  }
}
```

### 实验分析节点配置
```javascript
{
  nodeName: "实验分析",
  description: "...",
  timeout: 3600,
  parameters: {
    doeMethod: 'factorial',            // DOE方法
    doeTools: 'minitab',               // DOE工具
    factorCount: 3,                    // 因子数
    levelCount: 2,                     // 水平数
    optimizationObjective: 'minimize', // 优化目标
    analysisMethod: 'anova'            // 分析方法
  }
}
```

## 注意事项

1. **节点类型唯一性**：每个节点的 `type` 字段决定使用哪个配置组件
2. **名称灵活性**：`name` 字段可以自定义，判断函数会根据 `type` 和 `name` 综合判断
3. **配置独立性**：虽然使用相同的配置组件类，但每个节点实例的配置数据独立存储在 `node.config.parameters` 中
4. **保存机制**：配置保存后数据会更新到节点的 `config` 对象中，不会影响其他节点
5. **可扩展性**：新增节点只需定义 `type`，添加判断函数，创建或复用配置组件即可

## 测试验证

### 测试步骤
1. 打开整车能耗分析应用
2. 进入工作流编辑器
3. 点击"架构同步"节点，验证配置面板正确显示 `SSPModelicaNodeConfig`
4. 点击"仿真配置"节点，验证配置面板正确显示 `SimulationNodeConfig`
5. 点击"实验分析"节点，验证配置面板正确显示 `DOEAnalysisNodeConfig`
6. 分别配置三个节点并保存
7. 重新打开节点验证配置正确保存和恢复

### 预期结果
- ✅ 三个节点使用正确的配置组件
- ✅ 配置数据独立保存和恢复
- ✅ 界面全中文显示
- ✅ 配置选项符合MBSE汽车行业标准
