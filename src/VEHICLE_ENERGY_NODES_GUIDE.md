# 整车能耗分析工作流节点配置指南

## 概述
本文档说明了整车能耗分析工作流中三个核心节点的配置功能和使用方法。

## 节点配置总览

### 1. 架构同步节点 (SSP-Modelica)

**文件位置**: `/components/nodeConfig/SSPModelicaNodeConfig.tsx`

**核心功能**:
- ✅ **建模方式选择**: 支持SSP导入或基于Modelica等工具重新建模
- ✅ **多类型模型支持**: FMU、Modelica、AMESim三种模型类型
- ✅ **交互式架构可视化**: 基于ReactFlow的IBD架构图
- ✅ **模型映射配置**: 为每个系统模块选择对应的仿真模型

**主要配置项**:
- `modelingApproach`: 建模方式 ('ssp-import' 或 'rebuild-modeling')
- `sourceSSPFile`: SSP文件来源
- `targetPlatform`: 目标平台 (modelica/amesim/simulink)
- `modelicaCompiler`: Modelica编译器选择
- `ibdBlockModels`: 模块模型映射表

**使用流程**:
1. 选择建模方式（SSP导入 或 重新建模）
2. 配置源文件和目标平台
3. 在架构图中点击各模块，选择对应模型
4. 应用默认配置或逐个配置
5. 保存节点配置

---

### 2. 仿真配置节点 (Simulation)

**文件位置**: `/components/nodeConfig/SimulationNodeConfig.tsx`

**核心功能**:
- ✅ **驾驶循环配置**: 支持NEDC/WLTC/CLTC/FTP75等标准循环
- ✅ **环境条件设置**: 温度、海拔、风速、路面条件等
- ✅ **整车参数配置**: 质量、风阻、滚阻、轮胎参数等
- ✅ **电池初始状态**: SOC、容量、电压配置
- ✅ **求解器设置**: 多种求解器和精度控制

**主要配置项**:
- **驾驶工况**:
  - `drivingCycle`: 驾驶循环 (NEDC/WLTC/CLTC/CLTC-P/FTP75/HWFET/JC08/CUSTOM)
  - `customCycleFile`: 自定义循环文件路径
  
- **环境条件**:
  - `ambientTemperature`: 环境温度 (°C)
  - `altitude`: 海拔高度 (m)
  - `windSpeed`: 风速 (m/s)
  - `roadGrade`: 道路坡度 (%)
  - `roadCondition`: 路面条件
  
- **整车参数**:
  - `vehicleMass`: 整车质量 (kg)
  - `passengerLoad`: 乘员载荷 (kg)
  - `cargoLoad`: 货物载荷 (kg)
  - `dragCoefficient`: 风阻系数
  - `frontalArea`: 迎风面积 (m²)
  - `rollingResistance`: 滚动阻力系数
  - `wheelRadius`: 车轮半径 (m)
  
- **电池参数**:
  - `initialSOC`: 初始SOC (%)
  - `batteryCapacity`: 电池容量 (kWh)
  - `batteryVoltage`: 电池电压 (V)
  
- **求解器**:
  - `solver`: 求解器类型 (dassl/cvode/ida/euler/runge-kutta/radau)
  - `tolerance`: 求解容差
  - `stepSize`: 固定步长 (s)
  - `outputInterval`: 输出间隔 (s)

**使用流程**:
1. 在"基础设置"标签页配置节点名称和环境条件
2. 在"驾驶工况"标签页选择驾驶循环和仿真时间
3. 在"整车参数"标签页设置车辆质量、空气动力学和电池参数
4. 在"求解器"标签页配置求解器和输出选项
5. 保存配置

---

### 3. 实验分析节点 (DOE Analysis)

**文件位置**: `/components/nodeConfig/DOEAnalysisNodeConfig.tsx`

**核心功能**:
- ✅ **DOE方法选择**: 全因子/部分因子/响应面/中心复合/Box-Behnken/田口/拉丁超立方等
- ✅ **工具集成**: 支持Minitab/JMP/Design-Expert/R/Python/MATLAB等
- ✅ **实验因子配置**: 因子数量、水平数、响应变量
- ✅ **优化目标**: 最大化/最小化/目标值/稳健性/多目标优化
- ✅ **统计分析**: ANOVA/回归分析/RSM/机器学习/遗传算法等

**主要配置项**:
- **输入数据**:
  - `inputResultPath`: 仿真结果文件路径
  - `dataFormat`: 数据格式 (csv/json/mat/hdf5/excel)
  - `autoParseResults`: 自动解析结果
  
- **实验设计**:
  - `doeMethod`: DOE方法
  - `doeTools`: DOE工具
  - `factorCount`: 因子数量
  - `levelCount`: 水平数
  - `responseVariables`: 响应变量（逗号分隔）
  - `constraintConditions`: 约束条件
  
- **优化分析**:
  - `optimizationObjective`: 优化目标
  - `analysisMethod`: 统计分析方法
  - `significanceLevel`: 显著性水平
  - `confidenceLevel`: 置信水平
  
- **执行配置**:
  - `enableExternalTool`: 启用外部工具调用
  - `autoOpenTool`: 自动打开外部工具
  - `generateReport`: 生成分析报告
  - `exportResults`: 导出分析结果

**使用流程**:
1. 在"基础设置"标签页配置输入数据路径和格式
2. 在"实验设计"标签页选择DOE方法、工具和因子配置
3. 在"执行配置"标签页设置工具集成和输出选项
4. 保存配置

---

## 工作流执行顺序

```
架构同步 → 仿真配置 → 实验分析
   ↓           ↓           ↓
模型映射    工况设置    DOE优化
```

### 数据流转

1. **架构同步节点** 输出:
   - 系统架构模型
   - 模块模型映射表
   - Modelica/FMU模型文件

2. **仿真配置节点** 输入:
   - 架构同步节点的模型
   
   **仿真配置节点** 输出:
   - 仿真结果文件 (CSV/MAT/JSON/HDF5)
   - 时间序列数据（速度、SOC、功率等）

3. **实验分析节点** 输入:
   - 仿真配置节点的结果文件
   
   **实验分析节点** 输出:
   - DOE分析报告
   - 优化参数建议
   - 因子敏感性分析

---

## 配置示例

### 示例1: NEDC循环能耗仿真

**架构同步节点**:
```javascript
{
  modelingApproach: 'ssp-import',
  sourceSSPFile: 'project-library',
  targetPlatform: 'modelica',
  // 为各模块选择Modelica标准模型
}
```

**仿真配置节点**:
```javascript
{
  drivingCycle: 'NEDC',
  ambientTemperature: 25,
  vehicleMass: 1500,
  passengerLoad: 150,
  initialSOC: 100,
  solver: 'dassl',
  stopTime: 1180, // NEDC循环时长
}
```

**实验分析节点**:
```javascript
{
  doeMethod: 'factorial',
  factorCount: 3, // 如: 车速、温度、载重
  levelCount: 2,
  optimizationObjective: 'minimize', // 最小化能耗
  analysisMethod: 'anova',
}
```

---

## 注意事项

### 架构同步节点
- ⚠️ 必须完成所有模块的模型配置才能保存
- 💡 可使用"应用默认配置"快速完成配置
- 💡 支持全屏查看架构图以便更好地配置

### 仿真配置节点
- ⚠️ 确保驾驶循环与仿真时间匹配
- ⚠️ 自定义循环需提供正确的CSV文件路径
- 💡 推荐使用DASSL求解器处理汽车动力学刚性方程

### 实验分析节点
- ⚠️ 需要正确配置仿真结果路径
- ⚠️ 因子数量和水平数会影响实验次数（指数增长）
- 💡 对于能耗优化，建议使用"minimize"作为优化目标

---

## 技术特性

### 全中文界面
- ✅ 所有配置项均为中文标签
- ✅ 提示信息和帮助文本均为中文
- ✅ 错误提示和警告信息均为中文

### 数据持久化
- ✅ 节点配置自动保存
- ✅ 重新打开节点时配置自动恢复
- ✅ 支持配置导入导出

### 交互性增强
- ✅ 架构图支持缩放、拖拽
- ✅ 实时配置进度显示
- ✅ 参数计算自动更新（如总质量、可用能量）

---

## 更新日志

### 2024-12-17
- ✅ 重写架构同步节点配置，新增建模方式选择和完整的模型映射功能
- ✅ 重写仿真配置节点，新增驾驶循环、环境条件和整车参数完整配置
- ✅ 优化实验分析节点，完善DOE方法和优化目标配置
- ✅ 更新工作流初始节点数据，添加完整的默认参数
- ✅ 全部采用中文界面，符合MBSE汽车行业标准

---

## 技术支持

如有问题或需要进一步的功能定制，请参考各配置组件的源代码或联系技术支持团队。
