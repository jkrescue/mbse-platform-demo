/**
 * 任务模型提交面板
 * 管理任务中提交的模型及其与指标的匹配关系
 */

import { useState } from 'react'
import {
  Package,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  FileText
} from 'lucide-react@0.487.0'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { toast } from 'sonner@2.0.3'
import { Task, TaskModelSubmission, ModelMetricMatchType, ConfidenceLevel } from '../../types/task'
import { taskService } from '../../services/TaskService'
import { useAuth } from '../AuthContext'

interface TaskModelSubmissionPanelProps {
  task: Task
  onUpdate: () => void
}

export function TaskModelSubmissionPanel({ task, onUpdate }: TaskModelSubmissionPanelProps) {
  const { user } = useAuth()
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [submissionData, setSubmissionData] = useState<any>({
    modelId: '',
    modelName: '',
    modelVersion: '',
    submitType: 'initial',
    description: '',
    changeLog: '',
    metricMatches: []
  })

  const handleSubmit = () => {
    if (!submissionData.modelName || !submissionData.modelVersion) {
      toast.error('请填写模型名称和版本')
      return
    }

    const result = taskService.submitModel(
      task.id,
      submissionData.modelId || `model-${Date.now()}`,
      submissionData.modelName,
      submissionData.modelVersion,
      {
        metricMatches: submissionData.metricMatches,
        submitType: submissionData.submitType,
        description: submissionData.description,
        changeLog: submissionData.changeLog,
        validationStatus: 'pending'
      },
      user?.id || 'user-001'
    )

    if (result) {
      toast.success('模型提交成功')
      setShowSubmitDialog(false)
      setSubmissionData({
        modelId: '',
        modelName: '',
        modelVersion: '',
        submitType: 'initial',
        description: '',
        changeLog: '',
        metricMatches: []
      })
      onUpdate()
    } else {
      toast.error('提交失败')
    }
  }

  const handleValidation = (submissionId: string, status: 'validated' | 'rejected', comments: string) => {
    const result = taskService.validateModelSubmission(
      task.id,
      submissionId,
      status,
      comments,
      user?.id || 'user-001'
    )

    if (result) {
      toast.success(status === 'validated' ? '模型已通过验证' : '模型验证被拒绝')
      onUpdate()
    } else {
      toast.error('操作失败')
    }
  }

  const addMetricMatch = () => {
    if (task.metricAssignments.length === 0) {
      toast.error('该任务暂无关联指标')
      return
    }

    setSubmissionData({
      ...submissionData,
      metricMatches: [
        ...submissionData.metricMatches,
        {
          metricId: task.metricAssignments[0].metricId,
          metricName: task.metricAssignments[0].metricName,
          matchType: 'direct_output',
          parameterPath: '',
          confidence: 'medium'
        }
      ]
    })
  }

  const updateMetricMatch = (index: number, field: string, value: any) => {
    const updated = [...submissionData.metricMatches]
    updated[index] = { ...updated[index], [field]: value }
    setSubmissionData({ ...submissionData, metricMatches: updated })
  }

  const removeMetricMatch = (index: number) => {
    setSubmissionData({
      ...submissionData,
      metricMatches: submissionData.metricMatches.filter((_: any, i: number) => i !== index)
    })
  }

  const getMatchTypeText = (matchType: ModelMetricMatchType) => {
    const texts: Record<ModelMetricMatchType, string> = {
      direct_output: '直接输出',
      derived: '派生计算',
      constraint: '约束条件',
      validation: '验证手段'
    }
    return texts[matchType]
  }

  const getConfidenceText = (confidence: ConfidenceLevel) => {
    const texts: Record<ConfidenceLevel, string> = {
      very_high: '非常高',
      high: '高',
      medium: '中',
      low: '低',
      very_low: '非常低'
    }
    return texts[confidence]
  }

  const getValidationStatusColor = (status: TaskModelSubmission['validationStatus']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      validated: 'bg-green-100 text-green-700 border-green-200',
      rejected: 'bg-red-100 text-red-700 border-red-200'
    }
    return colors[status]
  }

  const getValidationStatusText = (status: TaskModelSubmission['validationStatus']) => {
    const texts = {
      pending: '待验证',
      validated: '已验证',
      rejected: '已拒绝'
    }
    return texts[status]
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900">模型提交记录</h3>
        <Button onClick={() => setShowSubmitDialog(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          提交模型
        </Button>
      </div>

      {task.modelSubmissions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>暂无模型提交</p>
          <p className="text-sm mt-2">点击上方按钮提交模型</p>
        </div>
      ) : (
        <div className="space-y-4">
          {task.modelSubmissions.map(submission => (
            <Card key={submission.id} className="border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-base">{submission.modelName}</CardTitle>
                      <Badge variant="outline">v{submission.modelVersion}</Badge>
                      <Badge className={getValidationStatusColor(submission.validationStatus)}>
                        {getValidationStatusText(submission.validationStatus)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-600">
                      <span>提交人: {submission.submittedBy}</span>
                      <span>提交时间: {submission.submittedAt.split('T')[0]}</span>
                      <span>类型: {submission.submitType}</span>
                    </div>
                  </div>
                  {submission.validationStatus === 'pending' && (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-green-600 border-green-300 hover:bg-green-50"
                        onClick={() =>
                          handleValidation(submission.id, 'validated', '模型验证通过')
                        }
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        通过
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => handleValidation(submission.id, 'rejected', '需要修改')}
                      >
                        <XCircle className="w-4 h-4" />
                        拒绝
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 描述 */}
                <div>
                  <Label className="text-xs text-gray-600">模型描述</Label>
                  <p className="text-sm text-gray-900 mt-1">{submission.description}</p>
                </div>

                {/* 变更日志 */}
                {submission.changeLog && (
                  <div>
                    <Label className="text-xs text-gray-600">变更日志</Label>
                    <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                      {submission.changeLog}
                    </p>
                  </div>
                )}

                {/* 指标匹配关系 */}
                {submission.metricMatches.length > 0 && (
                  <div>
                    <Label className="text-xs text-gray-600 mb-2 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      模型-指标匹配关系 ({submission.metricMatches.length})
                    </Label>
                    <div className="space-y-2">
                      {submission.metricMatches.map((match, index) => (
                        <div key={index} className="border rounded-lg p-3 bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-900">{match.metricName}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {getMatchTypeText(match.matchType)}
                              </Badge>
                              <Badge
                                className={
                                  match.confidence === 'very_high' || match.confidence === 'high'
                                    ? 'bg-green-100 text-green-700'
                                    : match.confidence === 'medium'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }
                              >
                                {getConfidenceText(match.confidence)}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-xs text-gray-600">
                            <span>参数路径: </span>
                            <code className="bg-gray-200 px-1 py-0.5 rounded">
                              {match.parameterPath}
                            </code>
                          </div>
                          {match.calculationFormula && (
                            <div className="text-xs text-gray-600 mt-1">
                              <span>计算公式: </span>
                              <code className="bg-gray-200 px-1 py-0.5 rounded">
                                {match.calculationFormula}
                              </code>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 验证信息 */}
                {submission.validationStatus !== 'pending' && (
                  <div className="pt-4 border-t">
                    <Label className="text-xs text-gray-600 mb-2 flex items-center gap-1.5">
                      {submission.validationStatus === 'validated' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-600" />
                      )}
                      验证结果
                    </Label>
                    <p className="text-sm text-gray-900">{submission.validationComments}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
                      <span>验证人: {submission.validatedBy}</span>
                      <span>验证时间: {submission.validatedAt?.split('T')[0]}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 提交模型对话框 */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>提交模型</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>模型名称 *</Label>
                <Input
                  value={submissionData.modelName}
                  onChange={e =>
                    setSubmissionData({ ...submissionData, modelName: e.target.value })
                  }
                  placeholder="例如：电池包系统模型"
                />
              </div>
              <div>
                <Label>模型版本 *</Label>
                <Input
                  value={submissionData.modelVersion}
                  onChange={e =>
                    setSubmissionData({ ...submissionData, modelVersion: e.target.value })
                  }
                  placeholder="例如：v1.2"
                />
              </div>
            </div>

            <div>
              <Label>提交类型</Label>
              <Select
                value={submissionData.submitType}
                onValueChange={value =>
                  setSubmissionData({ ...submissionData, submitType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="initial">初始提交</SelectItem>
                  <SelectItem value="update">更新</SelectItem>
                  <SelectItem value="revision">修订</SelectItem>
                  <SelectItem value="final">最终版本</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>模型描述</Label>
              <Textarea
                value={submissionData.description}
                onChange={e =>
                  setSubmissionData({ ...submissionData, description: e.target.value })
                }
                placeholder="描述模型的主要功能和特点..."
                rows={3}
              />
            </div>

            <div>
              <Label>变更日志（可选）</Label>
              <Textarea
                value={submissionData.changeLog}
                onChange={e =>
                  setSubmissionData({ ...submissionData, changeLog: e.target.value })
                }
                placeholder="记录本次提交的主要变更内容..."
                rows={3}
              />
            </div>

            {/* 指标匹配关系 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>模型-指标匹配关系</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addMetricMatch}
                  className="gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  添加匹配
                </Button>
              </div>
              {submissionData.metricMatches.length === 0 ? (
                <div className="text-center py-6 text-sm text-gray-500 border rounded-lg">
                  暂未添加指标匹配关系
                </div>
              ) : (
                <div className="space-y-3">
                  {submissionData.metricMatches.map((match: any, index: number) => (
                    <Card key={index} className="p-3">
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">关联指标</Label>
                            <Select
                              value={match.metricId}
                              onValueChange={value => {
                                const metric = task.metricAssignments.find(
                                  m => m.metricId === value
                                )
                                updateMetricMatch(index, 'metricId', value)
                                updateMetricMatch(index, 'metricName', metric?.metricName || '')
                              }}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {task.metricAssignments.map(ma => (
                                  <SelectItem key={ma.metricId} value={ma.metricId}>
                                    {ma.metricName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-xs">匹配类型</Label>
                            <Select
                              value={match.matchType}
                              onValueChange={value => updateMetricMatch(index, 'matchType', value)}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="direct_output">直接输出</SelectItem>
                                <SelectItem value="derived">派生计算</SelectItem>
                                <SelectItem value="constraint">约束条件</SelectItem>
                                <SelectItem value="validation">验证手段</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs">参数路径</Label>
                          <Input
                            className="h-8"
                            value={match.parameterPath}
                            onChange={e =>
                              updateMetricMatch(index, 'parameterPath', e.target.value)
                            }
                            placeholder="例如：battery.energyDensity"
                          />
                        </div>

                        {match.matchType === 'derived' && (
                          <div>
                            <Label className="text-xs">计算公式</Label>
                            <Input
                              className="h-8"
                              value={match.calculationFormula || ''}
                              onChange={e =>
                                updateMetricMatch(index, 'calculationFormula', e.target.value)
                              }
                              placeholder="例如：capacity / weight"
                            />
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <Label className="text-xs">匹配可信度</Label>
                            <Select
                              value={match.confidence}
                              onValueChange={value => updateMetricMatch(index, 'confidence', value)}
                            >
                              <SelectTrigger className="h-8 w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="very_high">非常高</SelectItem>
                                <SelectItem value="high">高</SelectItem>
                                <SelectItem value="medium">中</SelectItem>
                                <SelectItem value="low">低</SelectItem>
                                <SelectItem value="very_low">非常低</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => removeMetricMatch(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
                取消
              </Button>
              <Button onClick={handleSubmit}>提交模型</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
