import { Milestone, MilestoneStatus } from '../../types/project'
import { Badge } from '../ui/badge'
import { Check, Clock, Circle, AlertCircle } from 'lucide-react@0.487.0'

interface MilestoneGanttProps {
  milestones: Milestone[]
  startDate: string
  endDate: string
}

export function MilestoneGantt({ milestones, startDate, endDate }: MilestoneGanttProps) {
  const projectStart = new Date(startDate)
  const projectEnd = new Date(endDate)
  const projectDuration = projectEnd.getTime() - projectStart.getTime()

  const getStatusIcon = (status: MilestoneStatus) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-600" />
      case 'inprogress':
        return <Clock className="h-4 w-4 text-blue-600 animate-pulse" />
      case 'delayed':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusLabel = (status: MilestoneStatus) => {
    const labels: Record<MilestoneStatus, string> = {
      completed: '已完成',
      inprogress: '进行中',
      delayed: '延期',
      pending: '待开始'
    }
    return labels[status]
  }

  const getStatusColor = (status: MilestoneStatus) => {
    const colors: Record<MilestoneStatus, string> = {
      completed: 'bg-green-100 text-green-700 border-green-200',
      inprogress: 'bg-blue-100 text-blue-700 border-blue-200',
      delayed: 'bg-red-100 text-red-700 border-red-200',
      pending: 'bg-gray-100 text-gray-700 border-gray-200'
    }
    return colors[status]
  }

  const calculatePosition = (date: string) => {
    const milestoneDate = new Date(date)
    const elapsed = milestoneDate.getTime() - projectStart.getTime()
    const percentage = (elapsed / projectDuration) * 100
    return Math.max(0, Math.min(100, percentage))
  }

  // 按目标日期排序
  const sortedMilestones = [...milestones].sort((a, b) =>
    new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  )

  return (
    <div className="space-y-4">
      {/* 时间轴 */}
      <div className="relative pt-8">
        {/* 背景线 */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200 rounded" />
        
        {/* 当前时间指示器 */}
        {(() => {
          const now = new Date()
          if (now >= projectStart && now <= projectEnd) {
            const position = calculatePosition(now.toISOString())
            return (
              <div
                className="absolute top-0 h-8 w-0.5 bg-red-500 z-10"
                style={{ left: `${position}%` }}
              >
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs text-red-600 whitespace-nowrap">
                  今天
                </div>
              </div>
            )
          }
          return null
        })()}

        {/* 里程碑节点 */}
        {sortedMilestones.map((milestone) => {
          const position = calculatePosition(milestone.targetDate)
          const isCriticalPath = true // 可以根据实际逻辑判断

          return (
            <div
              key={milestone.id}
              className="absolute top-0"
              style={{ left: `${position}%` }}
            >
              {/* 里程碑点 */}
              <div className={`
                relative w-4 h-4 -mt-1 rounded-full border-2 
                ${milestone.status === 'completed' ? 'bg-green-600 border-green-600' :
                  milestone.status === 'inprogress' ? 'bg-blue-600 border-blue-600' :
                  milestone.status === 'delayed' ? 'bg-red-600 border-red-600' :
                  'bg-white border-gray-400'}
              `}>
                {isCriticalPath && milestone.status !== 'completed' && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full border border-white" />
                )}
              </div>

              {/* 连接线（只有非最后一个节点才显示） */}
              {sortedMilestones.indexOf(milestone) < sortedMilestones.length - 1 && (
                <div
                  className={`
                    absolute top-1.5 left-4 h-0.5
                    ${milestone.status === 'completed' ? 'bg-green-600' : 'bg-gray-300'}
                  `}
                  style={{
                    width: `${
                      calculatePosition(sortedMilestones[sortedMilestones.indexOf(milestone) + 1].targetDate) -
                      position
                    }%`
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* 里程碑列表 */}
      <div className="space-y-2">
        {sortedMilestones.map((milestone, index) => (
          <div
            key={milestone.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
          >
            <div className="flex-shrink-0">
              {getStatusIcon(milestone.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{milestone.name}</h4>
                <Badge variant="outline" className={getStatusColor(milestone.status)}>
                  {getStatusLabel(milestone.status)}
                </Badge>
                {milestone.progress !== undefined && (
                  <span className="text-sm text-gray-600">{milestone.progress}%</span>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>目标: {milestone.targetDate}</span>
                {milestone.actualDate && (
                  <span>实际: {milestone.actualDate}</span>
                )}
                {milestone.deliverables.length > 0 && (
                  <span className="text-xs">
                    交付物: {milestone.deliverables.length} 项
                  </span>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              M{index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* 图例 */}
      <div className="flex items-center gap-4 text-xs text-gray-600 pt-4 border-t">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-600" />
          <span>已完成</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-600" />
          <span>进行中</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-400" />
          <span>待开始</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-600" />
          <span>延期</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-0.5 h-3 bg-red-500" />
          <span>当前时间</span>
        </div>
      </div>
    </div>
  )
}
