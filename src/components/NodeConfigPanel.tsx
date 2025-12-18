import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { X, Settings, Save, RefreshCw } from "lucide-react@0.487.0";
import { toast } from "sonner@2.0.3";
import { isArchConversionNode } from "./workflow/utils";
import { createInitialConfig } from "./workflow/nodeConfig/utils";
import { NodeConfig, NodeConfigPanelProps } from "./workflow/nodeConfig/types";
import {
  DEFAULT_CONVERSION_RULES,
  DEFAULT_VALIDATION_RULES,
  DEFAULT_CONVERSION_HISTORY,
  DEFAULT_OPTIMIZATION_SETTINGS,
  DEFAULT_SOURCE_MODEL_PATH,
  DEFAULT_TARGET_SSP_PATH
} from "./workflow/nodeConfig/constants";
import { BasicConfigTab } from "./workflow/nodeConfig/BasicConfigTab";
import { SysMLConversionTab } from "./workflow/nodeConfig/SysMLConversionTab";
import { ValidationRulesTab } from "./workflow/nodeConfig/ValidationRulesTab";
import { ConversionHistoryTab } from "./workflow/nodeConfig/ConversionHistoryTab";
import { ExecutionConfigTab } from "./workflow/nodeConfig/ExecutionConfigTab";

export function NodeConfigPanel({
  node,
  isOpen,
  onClose,
  onSave
}: NodeConfigPanelProps) {
  const [config, setConfig] = useState<NodeConfig>({
    nodeName: "",
    nodeId: "",
    description: "",
    priority: "中",
    creator: "系统管理员",
    createTime: "",
    autoExecute: true,
    timeout: 60,
    retryCount: 3,
    sourceModelPath: "",
    targetSSPPath: "",
    conversionRules: [],
    validationRules: [],
    transformationProgress: 0,
    conversionHistory: [],
    optimizationSettings: DEFAULT_OPTIMIZATION_SETTINGS
  });

  const isArchNode = isArchConversionNode(node);

  // 初始化配置数据
  useEffect(() => {
    if (node && isOpen) {
      const initialConfig = createInitialConfig(node, isArchNode);
      
      if (isArchNode) {
        setConfig({
          ...initialConfig,
          conversionRules: initialConfig.conversionRules.length > 0 
            ? initialConfig.conversionRules 
            : DEFAULT_CONVERSION_RULES,
          validationRules: initialConfig.validationRules.length > 0 
            ? initialConfig.validationRules 
            : DEFAULT_VALIDATION_RULES,
          conversionHistory: initialConfig.conversionHistory.length > 0 
            ? initialConfig.conversionHistory 
            : DEFAULT_CONVERSION_HISTORY,
        });
      } else {
        setConfig(initialConfig);
      }
    }
  }, [node, isOpen, isArchNode]);

  const handleSave = () => {
    let saveConfig: any = {
      nodeName: config.nodeName,
      description: config.description,
      priority: config.priority,
      autoExecute: config.autoExecute,
      timeout: config.timeout,
      retryCount: config.retryCount
    };

    if (isArchNode) {
      saveConfig.archConversionConfig = {
        sourceModelPath: config.sourceModelPath,
        targetSSPPath: config.targetSSPPath,
        conversionRules: config.conversionRules,
        validationRules: config.validationRules,
        transformationProgress: config.transformationProgress,
        conversionHistory: config.conversionHistory,
        optimizationSettings: config.optimizationSettings
      };
    }

    onSave(saveConfig);
    toast.success("SysML架构转换节点配置已保存");
  };

  const handleReset = () => {
    if (node) {
      const resetConfig = createInitialConfig(node, false);
      if (isArchNode) {
        setConfig({
          ...resetConfig,
          sourceModelPath: DEFAULT_SOURCE_MODEL_PATH,
          targetSSPPath: DEFAULT_TARGET_SSP_PATH,
          conversionRules: DEFAULT_CONVERSION_RULES,
          validationRules: DEFAULT_VALIDATION_RULES,
          conversionHistory: [],
          optimizationSettings: DEFAULT_OPTIMIZATION_SETTINGS,
        });
      } else {
        setConfig(resetConfig);
      }
    }
    toast.info("配置已重置");
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 bottom-0 right-0 w-96 bg-white border-l border-gray-200 shadow-xl z-[60] flex flex-col">
      {/* 标题栏 */}  
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <Settings className="w-4 h-4 text-gray-600" />
          <h3 className="text-gray-900">
            {isArchNode ? "SysML架构转换配置" : "节点配置"}
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 hover:bg-gray-200"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* 主体内容 */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="basic" className="h-full flex flex-col">
          <TabsList className="mx-4 mt-4">
            <TabsTrigger value="basic">基础配置</TabsTrigger>
            {isArchNode && <TabsTrigger value="conversion">SysML转换</TabsTrigger>}
            {isArchNode && <TabsTrigger value="validation">验证规则</TabsTrigger>}
            {isArchNode && <TabsTrigger value="history">转换历史</TabsTrigger>}
            <TabsTrigger value="execution">执行配置</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <TabsContent value="basic">
                <BasicConfigTab config={config} setConfig={setConfig} />
              </TabsContent>

              {isArchNode && (
                <>
                  <TabsContent value="conversion">
                    <SysMLConversionTab config={config} setConfig={setConfig} />
                  </TabsContent>

                  <TabsContent value="validation">
                    <ValidationRulesTab config={config} setConfig={setConfig} />
                  </TabsContent>

                  <TabsContent value="history">
                    <ConversionHistoryTab config={config} />
                  </TabsContent>
                </>
              )}

              <TabsContent value="execution">
                <ExecutionConfigTab config={config} setConfig={setConfig} node={node} />
              </TabsContent>
            </ScrollArea>
          </div>
        </Tabs>
      </div>

      {/* 底部按钮栏 */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <Button variant="outline" onClick={handleReset} size="sm" className="mr-2">
          <RefreshCw className="w-3 h-3 mr-1" />
          重置
        </Button>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onClose} size="sm">
            取消
          </Button>
          <Button onClick={handleSave} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="w-4 h-4 mr-1" />
            保存配置
          </Button>
        </div>
      </div>
    </div>
  );
}