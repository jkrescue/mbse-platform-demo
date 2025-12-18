import { AlertTriangle } from 'lucide-react@0.487.0'
import { Badge } from '../ui/badge'

interface RiskData {
  schedule: number // 0-100, 进度风险
  cost: number // 0-100, 成本风险
  quality: number // 0-100, 质量风险
  technology: number // 0-100, 技术风险
}

interface RiskRadarProps {
  data: RiskData
}

export function RiskRadar({ data }: RiskRadarProps) {
  const dimensions = [
    { key: 'schedule', label: '进度', value: data.schedule, angle: 0 },
    { key: 'cost', label: '成本', value: data.cost, angle: 90 },
    { key: 'quality', label: '质量', value: data.quality, angle: 180 },
    { key: 'technology', label: '技术', value: data.technology, angle: 270 }
  ]

  const getRiskLevel = (value: number) => {
    if (value >= 70) return { label: '高风险', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-600' }
    if (value >= 40) return { label: '中风险', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-600' }
    return { label: '低风险', color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-600' }
  }

  const getOverallRisk = () => {
    const average = (data.schedule + data.cost + data.quality + data.technology) / 4
    return getRiskLevel(average)
  }

  // SVG 雷达图
  const svgSize = 200
  const center = svgSize / 2
  const radius = 80
  const levels = 4

  const polarToCartesian = (angle: number, distance: number) => {
    const rad = ((angle - 90) * Math.PI) / 180
    return {
      x: center + distance * Math.cos(rad),
      y: center + distance * Math.sin(rad)
    }
  }

  const dataPoints = dimensions.map(dim => {
    const distance = (dim.value / 100) * radius
    return polarToCartesian(dim.angle, distance)
  })

  const dataPath = dataPoints
    .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ') + ' Z'

  const overallRisk = getOverallRisk()

  return (
    <div className="space-y-4">
      {/* 综合风险评级 */}
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <AlertTriangle className={`h-5 w-5 ${overallRisk.dot.replace('bg-', 'text-')}`} />
          <h4 className="font-medium">综合风险评级</h4>
        </div>
        <Badge variant="outline" className={`${overallRisk.color} text-lg px-4 py-1`}>
          {overallRisk.label}
        </Badge>
      </div>

      {/* 雷达图 */}
      <div className="flex justify-center">
        <svg width={svgSize} height={svgSize} className="overflow-visible">
          {/* 背景圆环 */}
          {Array.from({ length: levels }).map((_, i) => {
            const levelRadius = (radius / levels) * (i + 1)
            return (
              <circle
                key={i}
                cx={center}
                cy={center}
                r={levelRadius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            )
          })}

          {/* 轴线 */}
          {dimensions.map(dim => {
            const end = polarToCartesian(dim.angle, radius)
            return (
              <line
                key={dim.key}
                x1={center}
                y1={center}
                x2={end.x}
                y2={end.y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            )
          })}

          {/* 数据区域 */}
          <path
            d={dataPath}
            fill="rgba(59, 130, 246, 0.2)"
            stroke="#3b82f6"
            strokeWidth="2"
          />

          {/* 数据点 */}
          {dataPoints.map((point, i) => {
            const risk = getRiskLevel(dimensions[i].value)
            return (
              <circle
                key={i}
                cx={point.x}
                cy={point.y}
                r="4"
                className={risk.dot}
              />
            )
          })}

          {/* 轴标签 */}
          {dimensions.map(dim => {
            const labelPos = polarToCartesian(dim.angle, radius + 25)
            return (
              <text
                key={dim.key}
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-xs font-medium fill-gray-700"
              >
                {dim.label}
              </text>
            )
          })}
        </svg>
      </div>

      {/* 维度详情 */}
      <div className="space-y-2">
        {dimensions.map(dim => {
          const risk = getRiskLevel(dim.value)
          return (
            <div key={dim.key} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${risk.dot}`} />
                <span className="text-sm">{dim.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={risk.color}>
                  {risk.label}
                </Badge>
                <span className="text-sm text-gray-600 w-12 text-right">{dim.value}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
