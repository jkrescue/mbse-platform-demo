/**
 * 工具与模型管理集成服务
 * 处理工具中创建的模型保存到个人模型库的功能
 */

// 模型数据接口
export interface ModelData {
  id: string;
  name: string;
  type: string;
  description: string;
  version: string;
  project: string;
  tags: string[];
  rflpCategory?: "Requirements" | "Functions" | "Logical" | "Physical";
  source: string; // 来源工具
  sourceNodeId?: string; // 来源节点ID
  metadata: {
    author: string;
    createdTime: string;
    toolVersion: string;
    dependencies: string[];
    fileSize?: string;
    format?: string;
  };
  content?: {
    modelFile?: string; // 模型文件内容或路径
    parameters?: any; // 模型参数
    configurations?: any; // 配置信息
  };
}

// 工具类型映射
export const TOOL_TYPES = {
  EA: 'Enterprise Architect',
  DYMOLA: 'Dymola',
  POLARION: 'POLARION ALM',
  MWORKS: 'MWorks',
  ANSYS: 'ANSYS Workbench',
  SIMULINK: 'MATLAB/Simulink'
} as const;

// 模型类型映射
export const MODEL_TYPE_MAPPING = {
  EA: 'SysML',
  DYMOLA: 'Modelica',
  POLARION: 'Requirements',
  MWORKS: 'Modelica',
  ANSYS: 'FEA',
  SIMULINK: 'Simulink'
} as const;

// RFLP分类自动推断
export const RFLP_CATEGORY_MAPPING = {
  'requirements': 'Requirements',
  'functional': 'Functions',
  'function': 'Functions',
  'logical': 'Logical',
  'architecture': 'Logical',
  'physical': 'Physical',
  'simulation': 'Physical',
  'control': 'Functions',
  'system': 'Logical'
} as const;

class ToolModelIntegrationService {
  private static instance: ToolModelIntegrationService;
  private personalModels: ModelData[] = [];

  private constructor() {}

  static getInstance(): ToolModelIntegrationService {
    if (!ToolModelIntegrationService.instance) {
      ToolModelIntegrationService.instance = new ToolModelIntegrationService();
    }
    return ToolModelIntegrationService.instance;
  }

  /**
   * 从工具保存模型到个人模型库
   */
  async saveModelFromTool(params: {
    toolType: keyof typeof TOOL_TYPES;
    nodeData?: any;
    modelContent: any;
    userInfo: {
      name: string;
      role?: string;
    };
    additionalMetadata?: any;
  }): Promise<ModelData> {
    const { toolType, nodeData, modelContent, userInfo, additionalMetadata } = params;

    // 生成模型数据
    const modelData: ModelData = {
      id: `tool_model_${Date.now()}`,
      name: modelContent.name || this.generateModelName(toolType, nodeData),
      type: MODEL_TYPE_MAPPING[toolType] || 'Unknown',
      description: modelContent.description || this.generateDescription(toolType, nodeData),
      version: modelContent.version || '1.0',
      project: modelContent.project || `${TOOL_TYPES[toolType]}工程`,
      tags: this.generateTags(toolType, nodeData, modelContent),
      rflpCategory: this.inferRFLPCategory(toolType, nodeData, modelContent),
      source: TOOL_TYPES[toolType],
      sourceNodeId: nodeData?.id,
      metadata: {
        author: userInfo.name,
        createdTime: new Date().toLocaleString('zh-CN'),
        toolVersion: this.getToolVersion(toolType),
        dependencies: additionalMetadata?.dependencies || [],
        fileSize: this.calculateFileSize(modelContent),
        format: this.getModelFormat(toolType),
        ...additionalMetadata
      },
      content: {
        modelFile: modelContent.file,
        parameters: modelContent.parameters,
        configurations: modelContent.configurations
      }
    };

    // 保存到个人模型库
    this.personalModels.unshift(modelData);

    // 触发保存事件，通知其他组件
    this.notifyModelSaved(modelData);

    return modelData;
  }

  /**
   * 生成模型名称
   */
  private generateModelName(toolType: keyof typeof TOOL_TYPES, nodeData?: any): string {
    const toolName = TOOL_TYPES[toolType];
    const nodeName = nodeData?.name || nodeData?.action || '未命名';
    const timestamp = new Date().toLocaleDateString('zh-CN');
    
    return `${toolName}_${nodeName}_${timestamp}`;
  }

  /**
   * 生成模型描述
   */
  private generateDescription(toolType: keyof typeof TOOL_TYPES, nodeData?: any): string {
    const toolName = TOOL_TYPES[toolType];
    const nodeDesc = nodeData?.description || nodeData?.action || '';
    
    return `基于${toolName}工具创建的模型。${nodeDesc ? `节点功能：${nodeDesc}` : ''}自动生成于${new Date().toLocaleString('zh-CN')}。`;
  }

  /**
   * 生成标签
   */
  private generateTags(toolType: keyof typeof TOOL_TYPES, nodeData?: any, modelContent?: any): string[] {
    const tags = [];
    
    // 工具标签
    tags.push(toolType.toLowerCase());
    
    // 节点类型标签
    if (nodeData?.type) {
      tags.push(nodeData.type);
    }
    
    // 功能标签
    if (nodeData?.category) {
      tags.push(nodeData.category);
    }
    
    // 自定义标签
    if (modelContent?.tags) {
      tags.push(...modelContent.tags);
    }
    
    // 默认标签
    tags.push('tool-generated', 'personal');
    
    return [...new Set(tags)]; // 去重
  }

  /**
   * 推断RFLP分类
   */
  private inferRFLPCategory(
    toolType: keyof typeof TOOL_TYPES, 
    nodeData?: any, 
    modelContent?: any
  ): "Requirements" | "Functions" | "Logical" | "Physical" {
    // 根据工具类型推断
    if (toolType === 'POLARION') return 'Requirements';
    if (toolType === 'DYMOLA' || toolType === 'ANSYS') return 'Physical';
    if (toolType === 'EA') return 'Logical';
    
    // 根据节点名称或描述推断
    const text = `${nodeData?.name || ''} ${nodeData?.description || ''} ${nodeData?.action || ''}`.toLowerCase();
    
    for (const [keyword, category] of Object.entries(RFLP_CATEGORY_MAPPING)) {
      if (text.includes(keyword)) {
        return category as any;
      }
    }
    
    // 默认为逻辑层
    return 'Logical';
  }

  /**
   * 获取工具版本
   */
  private getToolVersion(toolType: keyof typeof TOOL_TYPES): string {
    const versions = {
      EA: 'v16.1',
      DYMOLA: '2024x',
      POLARION: '2024.1',
      MWORKS: '2024.2',
      ANSYS: '2024 R1',
      SIMULINK: 'R2024a'
    };
    
    return versions[toolType] || '1.0';
  }

  /**
   * 计算文件大小（模拟）
   */
  private calculateFileSize(modelContent: any): string {
    const contentSize = JSON.stringify(modelContent).length;
    if (contentSize < 1024) return `${contentSize}B`;
    if (contentSize < 1024 * 1024) return `${(contentSize / 1024).toFixed(1)}KB`;
    return `${(contentSize / (1024 * 1024)).toFixed(1)}MB`;
  }

  /**
   * 获取模型格式
   */
  private getModelFormat(toolType: keyof typeof TOOL_TYPES): string {
    const formats = {
      EA: '.xmi',
      DYMOLA: '.mo',
      POLARION: '.xml',
      MWORKS: '.mo',
      ANSYS: '.wbpj',
      SIMULINK: '.slx'
    };
    
    return formats[toolType] || '.unknown';
  }

  /**
   * 通知模型已保存
   */
  private notifyModelSaved(modelData: ModelData): void {
    // 触发自定义事件
    const event = new CustomEvent('toolModelSaved', {
      detail: { modelData }
    });
    window.dispatchEvent(event);
    
    console.log('模型已保存到个人模型库:', modelData);
  }

  /**
   * 获取个人模型列表
   */
  getPersonalModels(): ModelData[] {
    return this.personalModels;
  }

  /**
   * 获取来自特定工具的模型
   */
  getModelsByTool(toolType: keyof typeof TOOL_TYPES): ModelData[] {
    return this.personalModels.filter(model => model.source === TOOL_TYPES[toolType]);
  }

  /**
   * 删除模型
   */
  deleteModel(modelId: string): boolean {
    const index = this.personalModels.findIndex(model => model.id === modelId);
    if (index !== -1) {
      this.personalModels.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * 更新模型
   */
  updateModel(modelId: string, updates: Partial<ModelData>): ModelData | null {
    const index = this.personalModels.findIndex(model => model.id === modelId);
    if (index !== -1) {
      this.personalModels[index] = { ...this.personalModels[index], ...updates };
      return this.personalModels[index];
    }
    return null;
  }

  /**
   * 从工具快速保存模型（简化版）
   */
  async quickSaveFromTool(params: {
    toolType: keyof typeof TOOL_TYPES;
    modelName: string;
    nodeData?: any;
    userInfo: { name: string };
  }): Promise<ModelData> {
    return this.saveModelFromTool({
      ...params,
      modelContent: {
        name: params.modelName,
        description: `从${TOOL_TYPES[params.toolType]}快速保存的模型`,
        version: '1.0'
      }
    });
  }
}

export default ToolModelIntegrationService;