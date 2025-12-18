import { Progress } from '../ui/progress'
import { Users, Cpu, FileKey, HardDrive, TrendingUp, TrendingDown, Minus } from 'lucide-react@0.487.0'

interface ResourceData {
  teamUtilization: number
  computeUtilization: number
  licenseUsage: number
  storageUsage: number
}

interface ResourceHeatmapProps {
  data: ResourceData
}

export function ResourceHeatmap({ data }: ResourceHeatmapProps) {
  const resources = [
    {
      key: 'team',
      label: '团队利用率',
      icon: Users,
      value: data.teamUtilization,
      unit: '%',
      description: '团队成员工作负载'
    },
    {
      key: 'compute',
      label: '算力使用',
      icon: Cpu,
      value: data.computeUtilization,
      unit: '%',
      description: '计算资源占用情况'
    },
    {
      key: 'license',
      label: '许可证占用',
      icon: FileKey,
      value: data.licenseUsage,
      unit: '%',
      description: '软件许可证使用率'
    },
    {
      key: 'storage',
      label: '存储空间',
      icon: HardDrive,
      value: data.storageUsage,
      unit: '%',
      description: '数据存储使用情况'
    }
  ]

  const getUtilizationColor = (value: number) => {
    if (value >= 90) return 'text-red-600'
    if (value >= 70) return 'text-orange-600'
    if (value >= 50) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getProgressColor = (value: number) => {
    if (value >= 90) return 'bg-red-600'
    if (value >= 70) return 'bg-orange-500'
    if (value >= 50) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getTrendIcon = (value: number) => {
    if (value >= 80) return TrendingUp
    if (value >= 40) return Minus
    return TrendingDown
  }

  const getTrendColor = (value: number) => {
    if (value >= 80) return 'text-red-500'
    if (value >= 40) return 'text-gray-500'
    return 'text-green-500'
  }

  return (
    <div className="space-y-4">
      {resources.map((resource) => {
        const Icon = resource.icon
        const TrendIcon = getTrendIcon(resource.value)
        
        return (
          <div key={resource.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium">{resource.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${getUtilizationColor(resource.value)}`}>
                  {resource.value}{resource.unit}
                </span>
                <TrendIcon className={`h-4 w-4 ${getTrendColor(resource.value)}`} />
              </div>
            </div>
            
            <div className="relative">
              <Progress 
                value={resource.value} 
                className="h-2"
              />
              <div 
                className={`absolute top-0 left-0 h-2 rounded-full ${getProgressColor(resource.value)}`}
                style={{ width: `${resource.value}%` }}
              />
            </div>
            
            <p className="text-xs text-gray-500">{resource.description}</p>
          </div>
        )
      })}

      {/* 总览 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium mb-3">资源使用总览</h4>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-gray-600">平均利用率:</span>
            <span className="ml-2 font-medium">
              {Math.round((data.teamUtilization + data.computeUtilization + data.licenseUsage + data.storageUsage) / 4)}%
            </span>
          </div>
          <div>
            <span className="text-gray-600">预警项目:</span>
            <span className="ml-2 font-medium text-red-600">
              {resources.filter(r => r.value >= 90).length} 项
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
