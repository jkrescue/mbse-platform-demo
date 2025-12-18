import { useState } from "react";
import { NavigationService } from "../services/NavigationService";
import { ComponentInstantiationDialog } from "../components/ComponentInstantiationDialog";

export function useSmartNavigation() {
  const [showInstantiationDialog, setShowInstantiationDialog] = useState(false);
  const [selectedDependency, setSelectedDependency] = useState<{
    type: string;
    dependency: any;
    sourceApp?: any;
  } | null>(null);

  const handleDependencyClick = (
    dependencyType: string, 
    dependency: any, 
    sourceApp?: any
  ) => {
    // 设置选中的依赖信息
    setSelectedDependency({
      type: dependencyType,
      dependency,
      sourceApp
    });

    // 显示实例化对话框
    setShowInstantiationDialog(true);
  };

  const handleInstantiate = (instance: any) => {
    console.log("组件实例化完成:", instance);
    // 这里可以添加更多的实例化后处理逻辑
    // 比如更新用户的组件列表、跳转到组件管理页面等
    
    // 可选：导航到组件管理页面并高亮新实例
    const navigationService = NavigationService.getInstance();
    navigationService.navigateTo('componentManagement', {
      highlightComponent: instance.id,
      showSuccessMessage: true
    });
  };

  const handleCloseInstantiationDialog = () => {
    setShowInstantiationDialog(false);
    setSelectedDependency(null);
  };

  return {
    handleDependencyClick,
    showInstantiationDialog,
    selectedDependency,
    handleInstantiate,
    handleCloseInstantiationDialog,
    // 导出对话框组件用于渲染
    InstantiationDialog: () => selectedDependency ? (
      <ComponentInstantiationDialog
        open={showInstantiationDialog}
        onOpenChange={setShowInstantiationDialog}
        dependencyType={selectedDependency.type}
        dependency={selectedDependency.dependency}
        sourceApp={selectedDependency.sourceApp}
        onInstantiate={handleInstantiate}
      />
    ) : null
  };
}