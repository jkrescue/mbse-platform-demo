import React, { useState } from "react";
import { X, User, Calendar, Clock, CheckCircle, XCircle } from "lucide-react@0.487.0";

interface Reviewer {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
}

interface ModelReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  model: any;
  onSubmitReview: (reviewData: any) => void;
}

// 模拟审核人员数据
const availableReviewers: Reviewer[] = [
  {
    id: "1",
    name: "张工程师",
    role: "高级工程师",
    department: "系统架构部",
  },
  {
    id: "2", 
    name: "李主任",
    role: "技术主任",
    department: "仿真验证部",
  },
  {
    id: "3",
    name: "王博士",
    role: "首席专家",
    department: "研发中心",
  },
  {
    id: "4",
    name: "陈经理",
    role: "项目经理",
    department: "产品管理部",
  },
  {
    id: "5",
    name: "刘专家",
    role: "资深专家",
    department: "质量管理部",
  },
];

export function ModelReviewModal({ 
  isOpen, 
  onClose, 
  model, 
  onSubmitReview 
}: ModelReviewModalProps) {
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [reviewDeadline, setReviewDeadline] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [priority, setPriority] = useState<"low" | "normal" | "high">("normal");

  if (!isOpen) return null;

  const handleReviewerToggle = (reviewerId: string) => {
    setSelectedReviewers(prev => 
      prev.includes(reviewerId)
        ? prev.filter(id => id !== reviewerId)
        : [...prev, reviewerId]
    );
  };

  const handleSubmit = () => {
    if (selectedReviewers.length === 0) {
      alert("请至少选择一位审核人员");
      return;
    }

    if (!reviewDeadline) {
      alert("请设置审核截止时间");
      return;
    }

    const reviewData = {
      modelId: model.id,
      reviewers: selectedReviewers,
      deadline: reviewDeadline,
      comment: reviewComment,
      priority: priority,
      status: "pending",
      submitTime: new Date().toISOString(),
    };

    onSubmitReview(reviewData);
    onClose();
    
    // 重置表单
    setSelectedReviewers([]);
    setReviewDeadline("");
    setReviewComment("");
    setPriority("normal");
  };

  const getPriorityColor = (priorityLevel: string) => {
    switch (priorityLevel) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "normal": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityText = (priorityLevel: string) => {
    switch (priorityLevel) {
      case "high": return "高优先级";
      case "normal": return "普通";
      case "low": return "低优先级";
      default: return "普通";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-medium text-gray-900">
              发布模型审核
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              模型: {model?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* 模型基本信息 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">模型信息</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">模型名称:</span>
                  <span className="ml-2 font-medium">{model?.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">版本:</span>
                  <span className="ml-2 font-medium">{model?.version}</span>
                </div>
                <div>
                  <span className="text-gray-600">类型:</span>
                  <span className="ml-2 font-medium">{model?.type}</span>
                </div>
                <div>
                  <span className="text-gray-600">上传者:</span>
                  <span className="ml-2 font-medium">{model?.uploader}</span>
                </div>
              </div>
            </div>

            {/* 审核优先级 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                审核优先级
              </label>
              <div className="flex space-x-4">
                {["low", "normal", "high"].map((level) => (
                  <label key={level} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value={level}
                      checked={priority === level}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="mr-2"
                    />
                    <span className={`px-3 py-1 text-xs rounded-full border ${getPriorityColor(level)}`}>
                      {getPriorityText(level)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 审核截止时间 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                审核截止时间 *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="datetime-local"
                  value={reviewDeadline}
                  onChange={(e) => setReviewDeadline(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
            </div>

            {/* 选择审核人员 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                选择审核人员 * (已选择 {selectedReviewers.length} 人)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {availableReviewers.map((reviewer) => (
                  <label
                    key={reviewer.id}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedReviewers.includes(reviewer.id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedReviewers.includes(reviewer.id)}
                      onChange={() => handleReviewerToggle(reviewer.id)}
                      className="mr-3 rounded border-gray-300"
                    />
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{reviewer.name}</div>
                        <div className="text-xs text-gray-500">
                          {reviewer.role} · {reviewer.department}
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 审核说明 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                审核说明
              </label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="请输入审核说明或特殊要求..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            {/* 审核流程说明 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">审核流程说明</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>所有选定的审核人员都需要完成审核</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span>审核通过后，模型将自动发布到公共模型库</span>
                </div>
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span>如有任一审核人员拒绝，需要重新提交审核</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedReviewers.length === 0 || !reviewDeadline}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            提交审核
          </button>
        </div>
      </div>
    </div>
  );
}