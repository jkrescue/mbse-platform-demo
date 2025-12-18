import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Users, 
  FileText, 
  Upload,
  Zap,
  Shield,
  Award,
  ArrowRight,
  X,
  User,
  ChevronRight
} from "lucide-react@0.487.0";
import { toast } from "sonner@2.0.3";

interface ModelPublishWorkflowProps {
  model: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublishSuccess?: () => void;
}

// 预定义审核人员库
const REVIEWERS = [
  { id: '1', name: '张首席架构师', role: '系统架构师', avatar: '👨‍💼', expertise: ['系统设计', 'MBSE'] },
  { id: '2', name: '李技术专家', role: '仿真工程师', avatar: '👩‍🔬', expertise: ['仿真验证', 'Modelica'] },
  { id: '3', name: '王建模专家', role: '建模工程师', avatar: '🧑‍💻', expertise: ['模型开发', 'Simulink'] },
  { id: '4', name: '赵质量经理', role: '质量管理', avatar: '👔', expertise: ['质量管理', '流程规范'] },
  { id: '5', name: '陈项目经理', role: '项目经理', avatar: '👨‍💼', expertise: ['项目管理', '需求管理'] },
];

// 预定义审核流程
const REVIEW_WORKFLOWS = [
  {
    id: 'standard',
    name: '标准审核流程',
    description: '适用于常规模型发布，包含基础检查和技术评审',
    stages: [
      { name: '基础检查', type: 'auto', duration: '5分钟' },
      { name: '技术评审', type: 'manual', duration: '1-2天', reviewerCount: 1 },
      { name: '最终确认', type: 'auto', duration: '即时' }
    ]
  },
  {
    id: 'quick',
    name: '快速审核流程',
    description: '适用于紧急发布或小型更新',
    stages: [
      { name: '基础检查', type: 'auto', duration: '5分钟' },
      { name: '快速评审', type: 'manual', duration: '2-4小时', reviewerCount: 1 }
    ]
  },
  {
    id: 'comprehensive',
    name: '综合审核流程',
    description: '适用于关键模型或大版本发布',
    stages: [
      { name: '基础检查', type: 'auto', duration: '5分钟' },
      { name: '技术评审', type: 'manual', duration: '2-3天', reviewerCount: 2 },
      { name: '质量测试', type: 'manual', duration: '1-2天', reviewerCount: 1 },
      { name: '最终审批', type: 'manual', duration: '1天', reviewerCount: 1 }
    ]
  }
];

// 发布步骤
type PublishStep = 'workflow' | 'reviewers' | 'check' | 'processing' | 'success';

export function ModelPublishWorkflow({ model, open, onOpenChange, onPublishSuccess }: ModelPublishWorkflowProps) {
  const [currentStep, setCurrentStep] = useState<PublishStep>('workflow');
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('');
  const [selectedReviewers, setSelectedReviewers] = useState<string[]>([]);
  const [publishNotes, setPublishNotes] = useState('');
  const [checkProgress, setCheckProgress] = useState(0);
  const [checkResults, setCheckResults] = useState<any>(null);

  // 重置状态
  const handleClose = () => {
    setCurrentStep('workflow');
    setSelectedWorkflow('');
    setSelectedReviewers([]);
    setPublishNotes('');
    setCheckProgress(0);
    setCheckResults(null);
    onOpenChange(false);
  };

  // 选择审核流程
  const handleWorkflowSelect = (workflowId: string) => {
    setSelectedWorkflow(workflowId);
    setCurrentStep('reviewers');
  };

  // 切换审核人员
  const toggleReviewer = (reviewerId: string) => {
    setSelectedReviewers(prev => 
      prev.includes(reviewerId) 
        ? prev.filter(id => id !== reviewerId)
        : [...prev, reviewerId]
    );
  };

  // 执行发布前检查
  const handleStartCheck = () => {
    if (selectedReviewers.length === 0) {
      toast.error('请至少选择一位审核人员');
      return;
    }

    setCurrentStep('check');
    setCheckProgress(0);

    // 模拟检查过程
    const checkSteps = [
      { name: '元数据完整性检查', progress: 20, delay: 500 },
      { name: '模型文件验证', progress: 40, delay: 800 },
      { name: '依赖关系检查', progress: 60, delay: 600 },
      { name: '命名规范检查', progress: 80, delay: 700 },
      { name: '接口一致性检查', progress: 100, delay: 500 }
    ];

    let currentIndex = 0;
    const runCheck = () => {
      if (currentIndex < checkSteps.length) {
        const step = checkSteps[currentIndex];
        setTimeout(() => {
          setCheckProgress(step.progress);
          currentIndex++;
          runCheck();
        }, step.delay);
      } else {
        // 检查完成，生成结果
        setCheckResults({
          passed: true,
          score: 95,
          items: [
            { name: '元数据完整性', status: 'passed', score: 100 },
            { name: '模型文件验证', status: 'passed', score: 98 },
            { name: '依赖关系检查', status: 'passed', score: 92 },
            { name: '命名规范检查', status: 'passed', score: 90 },
            { name: '接口一致性检查', status: 'passed', score: 95 }
          ]
        });
        setCurrentStep('processing');
      }
    };

    runCheck();
  };

  // 执行最终发布
  const handleFinalPublish = () => {
    setCurrentStep('success');
    
    // 延迟调用成功回调，模拟发布过程
    setTimeout(() => {
      toast.success(`模型 "${model.name}" 发布成功！`);
      onPublishSuccess?.();
      
      // 再延迟一会儿后关闭对话框
      setTimeout(() => {
        handleClose();
      }, 2000);
    }, 1500);
  };

  const getWorkflowConfig = () => {
    return REVIEW_WORKFLOWS.find(w => w.id === selectedWorkflow);
  };

  const getSelectedReviewerDetails = () => {
    return REVIEWERS.filter(r => selectedReviewers.includes(r.id));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <span>发布模型到项目库</span>
          </DialogTitle>
          <DialogDescription>
            {model?.name} - 按照流程审核后发布
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          {/* 步骤1：选择审核流程 */}
          {currentStep === 'workflow' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">选择审核流程</h3>
                <Badge variant="outline">步骤 1/4</Badge>
              </div>

              <div className="space-y-3">
                {REVIEW_WORKFLOWS.map(workflow => (
                  <Card
                    key={workflow.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedWorkflow === workflow.id ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => handleWorkflowSelect(workflow.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base flex items-center space-x-2">
                            <span>{workflow.name}</span>
                            {workflow.id === 'standard' && (
                              <Badge variant="secondary" className="ml-2">推荐</Badge>
                            )}
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-2">
                        {workflow.stages.map((stage, idx) => (
                          <div key={idx} className="flex items-center space-x-1 text-xs">
                            {stage.type === 'auto' ? (
                              <Zap className="w-3 h-3 text-yellow-600" />
                            ) : (
                              <Users className="w-3 h-3 text-blue-600" />
                            )}
                            <span className="text-gray-700">{stage.name}</span>
                            <span className="text-gray-500">({stage.duration})</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 步骤2：选择审核人员 */}
          {currentStep === 'reviewers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">选择审核人员</h3>
                  <p className="text-sm text-gray-600">
                    当前流程：{getWorkflowConfig()?.name}
                  </p>
                </div>
                <Badge variant="outline">步骤 2/4</Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {REVIEWERS.map(reviewer => (
                  <Card
                    key={reviewer.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedReviewers.includes(reviewer.id) 
                        ? 'border-blue-500 bg-blue-50' 
                        : ''
                    }`}
                    onClick={() => toggleReviewer(reviewer.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xl">{reviewer.avatar}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{reviewer.name}</div>
                          <div className="text-xs text-gray-600">{reviewer.role}</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {reviewer.expertise.slice(0, 2).map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {selectedReviewers.includes(reviewer.id) && (
                          <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>发布说明（可选）</Label>
                <Textarea
                  placeholder="请输入模型的更新说明、使用注意事项等..."
                  value={publishNotes}
                  onChange={(e) => setPublishNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={() => setCurrentStep('workflow')}>
                  上一步
                </Button>
                <Button onClick={handleStartCheck} disabled={selectedReviewers.length === 0}>
                  开始检查
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* 步骤3：发布前检查 */}
          {currentStep === 'check' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">发布前检查</h3>
                <Badge variant="outline">步骤 3/4</Badge>
              </div>

              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-blue-600 animate-pulse" />
                  </div>
                  <h4 className="font-medium mb-2">正在执行自动化检查...</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    检查模型规范性、完整性和一致性
                  </p>
                  <Progress value={checkProgress} className="w-full max-w-md mx-auto" />
                  <p className="text-sm text-gray-500 mt-2">{checkProgress}%</p>
                </div>

                {checkResults && (
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                        <div>
                          <h4 className="font-medium text-green-900">检查通过</h4>
                          <p className="text-sm text-green-700">
                            综合评分：{checkResults.score}/100
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {checkResults.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">{item.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-gray-600">{item.score}分</span>
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* 步骤4：处理中和发布确认 */}
          {currentStep === 'processing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">发布确认</h3>
                <Badge variant="outline">步骤 4/4</Badge>
              </div>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">发布摘要</h4>
                      <div className="space-y-2 text-sm text-blue-800">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600">模型名称：</span>
                          <span className="font-medium">{model.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600">审核流程：</span>
                          <span>{getWorkflowConfig()?.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600">审核人员：</span>
                          <span>{getSelectedReviewerDetails().map(r => r.name).join('、')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-600">检查结果：</span>
                          <Badge variant="default" className="bg-green-600">
                            通过 ({checkResults?.score}分)
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">发布后操作</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>模型将自动镜像到项目库</li>
                      <li>审核人员将收到评审通知</li>
                      <li>通过审核后，模型状态将变更为"已发布"</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={() => setCurrentStep('reviewers')}>
                  返回修改
                </Button>
                <Button onClick={handleFinalPublish} className="bg-green-600 hover:bg-green-700">
                  确认发布
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* 步骤5：发布成功 */}
          {currentStep === 'success' && (
            <div className="space-y-6 py-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Award className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-green-900 mb-2">发布成功！</h3>
                <p className="text-gray-600 mb-6">
                  模型 "{model.name}" 已成功发布到项目库
                </p>

                <div className="max-w-md mx-auto space-y-3">
                  <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">发布状态</span>
                          <Badge variant="default" className="bg-green-600">审核中</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">审核人员</span>
                          <span className="text-gray-900">
                            {getSelectedReviewerDetails().length}位专家
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">预计完成</span>
                          <span className="text-gray-900">1-2个工作日</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="text-xs text-gray-500 text-center">
                    您可以在模型管理页面查看审核进度
                  </div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        {currentStep !== 'success' && currentStep !== 'check' && currentStep !== 'processing' && (
          <div className="flex justify-end pt-4 border-t">
            <Button variant="ghost" onClick={handleClose}>
              取消
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
