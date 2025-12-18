import React, { useState } from 'react';
import { Badge } from "../ui/badge";
import { CheckCircle, Clock, Loader2, ChevronDown, ChevronRight } from "lucide-react@0.487.0";
import { WorkflowNode } from './types';

interface WorkflowNodeComponentProps {
  node: WorkflowNode;
  isSelected: boolean;
  onClick: (nodeId: string) => void;
}

export function WorkflowNodeComponent({
  node,
  isSelected,
  onClick,
}: WorkflowNodeComponentProps) {
  const [isCollapsed, setIsCollapsed] = useState(node.collapsed || false);

  // 根据status获取边框颜色和背景色
  const getBorderColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-50";
      case "running":
        return "border-yellow-500 bg-yellow-50";
      case "waiting":
        return "border-gray-400 bg-white";
      default:
        return "border-gray-400 bg-white";
    }
  };

  // 根据tag获取标签颜色
  const getTagStyle = (tag: string) => {
    switch (tag) {
      case "POLARION":
        return "bg-blue-500 text-white";
      case "EA":
        return "bg-green-500 text-white";
      case "POLARION-EA":
        return "bg-green-500 text-white";
      case "SSP-MODELICA":
        return "bg-purple-500 text-white";
      case "SSP":
        return "bg-teal-500 text-white";
      case "DOE":
        return "bg-emerald-500 text-white";
      case "M-WORKS":
        return "bg-pink-500 text-white";
      case "TRACEABILITY":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // 根据状态获取状态指示器
  const getStatusIndicator = () => {
    switch (node.status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "running":
        return <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />;
      case "waiting":
        return <Clock className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  // 根据状态获取状态文本
  const getStatusText = () => {
    switch (node.status) {
      case "completed":
        return "已完成";
      case "running":
        return "运行中";
      case "waiting":
        return "等待中";
      default:
        return "未知";
    }
  };

  const handleCollapseToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`rounded-lg shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md relative ${
        getBorderColor(node.status)
      } border-2 ${
        isSelected ? "ring-2 ring-blue-400 ring-opacity-50" : ""
      }`}
      style={{
        width: 360,
        minHeight: isCollapsed ? 60 : 120,
      }}
      onClick={() => onClick(node.id)}
    >
      {/* 节点头部 */}
      <div className="flex items-start justify-between p-4 pb-2">
        <div className="flex items-start space-x-2 flex-1">
          {/* 收起/展开按钮 */}
          <button
            onClick={handleCollapseToggle}
            className="mt-0.5 p-0.5 hover:bg-gray-100 rounded transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-3 h-3 text-gray-500" />
            ) : (
              <ChevronDown className="w-3 h-3 text-gray-500" />
            )}
          </button>
          
          {/* 节点标题 */}
          <h3 className="font-medium text-gray-900 leading-tight flex-1 min-w-0">
            {node.name}
          </h3>
        </div>

        {/* 右上角标签和状态 */}
        <div className="flex items-center space-x-2 ml-2">
          {getStatusIndicator()}
          <Badge className={`text-xs px-2 py-1 ${getTagStyle(node.tag)} border-0`}>
            {node.tag}
          </Badge>
        </div>
      </div>

      {/* 状态文本指示器 */}
      <div className="absolute top-2 left-2">
        <div className={`text-xs px-2 py-1 rounded-full font-medium ${
          node.status === "completed" ? "bg-green-100 text-green-700" :
          node.status === "running" ? "bg-yellow-100 text-yellow-700" :
          node.status === "waiting" ? "bg-gray-100 text-gray-600" :
          "bg-gray-100 text-gray-600"
        }`}>
          {getStatusText()}
        </div>
      </div>

      {/* 节点内容（可收起） */}
      {!isCollapsed && (
        <div className="px-4 pb-4">
          {/* 描述文字 */}
          <p className="text-sm text-gray-600 mb-3 leading-relaxed">
            {node.description}
          </p>
          
          {/* 操作信息 */}
          {node.action && (
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">•</span>
              <span className="text-sm text-blue-600 font-medium">
                {node.action}
              </span>
            </div>
          )}
        </div>
      )}

      {/* 节点状态指示线（左侧边框强调） */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
          node.status === "completed" ? "bg-green-500" :
          node.status === "running" ? "bg-yellow-500 animate-pulse" :
          node.status === "waiting" ? "bg-gray-400" :
          "bg-gray-400"
        }`}
      />

      {/* 运行中状态的脉冲效果 */}
      {node.status === "running" && (
        <div className="absolute inset-0 bg-yellow-200 opacity-20 rounded-lg animate-pulse pointer-events-none" />
      )}

      {/* 选中状态的高亮效果 */}
      {isSelected && (
        <div className="absolute inset-0 bg-blue-50 opacity-20 rounded-lg pointer-events-none" />
      )}

      {/* 悬停效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-transparent hover:from-blue-50 hover:to-transparent opacity-0 hover:opacity-30 rounded-lg pointer-events-none transition-opacity duration-200" />
    </div>
  );
}