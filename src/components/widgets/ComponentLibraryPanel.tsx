import React from "react";
import { ChevronLeft, Save, Settings, ChevronDown, ChevronRight } from "lucide-react@0.487.0";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

interface ComponentLibraryPanelProps {
  componentLibrary: any[];
  openSections: string[];
  setOpenSections: React.Dispatch<React.SetStateAction<string[]>>;
  selectedLibraryItem: any;
  setSelectedLibraryItem: React.Dispatch<React.SetStateAction<any>>;
  workflowName: string;
  setWorkflowName: React.Dispatch<React.SetStateAction<string>>;
  workflowDescription: string;
  setWorkflowDescription: React.Dispatch<React.SetStateAction<string>>;
  onBack: () => void;
  onSave: () => void;
  zoom: number;
  panX: number;
  panY: number;
  nodes: any[];
  setNodes: React.Dispatch<React.SetStateAction<any[]>>;
  constrainPosition: (x: number, y: number) => { x: number; y: number };
  getTagColor: (tag: string) => string;
}

export function ComponentLibraryPanel({
  componentLibrary,
  openSections,
  setOpenSections,
  selectedLibraryItem,
  setSelectedLibraryItem,
  workflowName,
  setWorkflowName,
  workflowDescription,
  setWorkflowDescription,
  onBack,
  onSave,
  zoom,
  panX,
  panY,
  nodes,
  setNodes,
  constrainPosition,
  getTagColor,
}: ComponentLibraryPanelProps) {
  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  const handleLibraryItemClick = (item: any, sectionTag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLibraryItem({ item, sectionTag });
  };

  const handleDragStart = (e: React.DragEvent, item: any) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleLibraryItemDoubleClick = (item: any, sectionTag: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const itemWithTag = {
      ...item,
      tag: sectionTag,
    };

    // 在画布中心添加节点
    const centerX = 400;
    const centerY = 300;

    // 考虑当前的缩放和平移
    const canvasX = (centerX - panX) / (zoom / 100);
    const canvasY = (centerY - panY) / (zoom / 100);

    const x = canvasX - 180;
    const y = canvasY - 60;

    // 约束到画布边界
    const constrainedPos = constrainPosition(x, y);

    const newNode = {
      id: `node-${Date.now()}`,
      type: itemWithTag.id,
      name: itemWithTag.name,
      description: itemWithTag.description,
      tag: itemWithTag.tag || "DEFAULT",
      tagColor: getTagColor(itemWithTag.tag),
      status: "waiting",
      position: constrainedPos,
      collapsed: false,
      ports: {
        input: { x: 0, y: 60 },
        output: { x: 360, y: 60 },
      },
      action: itemWithTag.action ? `• ${itemWithTag.action}` : undefined,
      config: {
        timeout: 300,
        retryCount: 1,
        autoRun: false,
        parameters: {},
      },
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedLibraryItem(null);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* 顶部工具栏 */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            返回
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onSave}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              保存
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <Label htmlFor="workflow-name">工作流名称</Label>
            <Input
              id="workflow-name"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              placeholder="请输入工作流名称"
            />
          </div>
          <div>
            <Label htmlFor="workflow-description">工作流描述</Label>
            <Input
              id="workflow-description"
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              placeholder="请输入工作流描述"
            />
          </div>
        </div>
      </div>

      {/* 组件库 */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="mb-4">组件库</h3>
          <div className="space-y-2">
            {componentLibrary.map((section) => (
              <Collapsible
                key={section.id}
                open={openSections.includes(section.id)}
                onOpenChange={() => toggleSection(section.id)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{section.title}</span>
                  </div>
                  {openSections.includes(section.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="pl-4 space-y-1">
                    {section.items.map((item: any) => (
                      <div
                        key={item.id}
                        className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                          selectedLibraryItem?.item.id === item.id
                            ? "bg-blue-50 border-blue-200"
                            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                        draggable
                        onDragStart={(e) => {
                          const itemWithTag = {
                            ...item,
                            tag: section.tag,
                          };
                          handleDragStart(e, itemWithTag);
                        }}
                        onClick={(e) => handleLibraryItemClick(item, section.tag, e)}
                        onDoubleClick={(e) => handleLibraryItemDoubleClick(item, section.tag, e)}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">{item.name}</h4>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>

      {/* 拖拽提示 */}
      {selectedLibraryItem && (
        <div className="p-4 bg-blue-50 border-t">
          <div className="text-sm text-blue-600">拖拽或双击添加到画布</div>
        </div>
      )}
    </div>
  );
}