import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react@0.487.0"
import { Button } from "./ui/button"

const featuredApps = [
  {
    id: 1,
    title: "车身结构分析",
    description: "深度洞察结构特性，支持多种材料性能评估，助力产品优化设计",
    background: "",
    gradient: "linear-gradient(135deg, rgba(251, 191, 36, 0.95) 0%, rgba(245, 158, 11, 0.9) 50%, rgba(217, 119, 6, 0.95) 100%)",
    image: "🏗️"
  },
  {
    id: 2,
    title: "动力总成匹配",
    description: "动力系统智能匹配与优化，包含多种算法，支持多种工况下的性能评估和优化配置",
    background: "",
    gradient: "linear-gradient(135deg, rgba(6, 78, 59, 0.95) 0%, rgba(5, 150, 105, 0.9) 50%, rgba(16, 185, 129, 0.95) 100%)",
    image: "⚙️"
  },
  {
    id: 3,
    title: "智能驾驶调节",
    description: "ADAS系统设计与仿真，支持多种传感器融合与算法验证",
    background: "",
    gradient: "linear-gradient(135deg, rgba(30, 58, 138, 0.95) 0%, rgba(29, 78, 216, 0.9) 50%, rgba(37, 99, 235, 0.95) 100%)",
    image: "🤖"
  },
  {
    id: 7,
    title: "整车能耗分析",
    description: "电动汽车整车能耗分析与优化，涵盖动力学、驱动、电池、热管理全链路仿真",
    background: "",
    gradient: "linear-gradient(135deg, rgba(234, 179, 8, 0.95) 0%, rgba(250, 204, 21, 0.9) 50%, rgba(253, 224, 71, 0.95) 100%)",
    image: "⚡"
  },
  {
    id: 4,
    title: "能源管理系统",
    description: "电池管理与能耗优化，支持多种电池类型和充电策略",
    background: "",
    gradient: "linear-gradient(135deg, rgba(126, 34, 206, 0.95) 0%, rgba(147, 51, 234, 0.9) 50%, rgba(168, 85, 247, 0.95) 100%)",
    image: "🔋"
  },
  {
    id: 5,
    title: "热管理分析",
    description: "热流体分析与散热优化，支持多物理场耦合仿真",
    background: "",
    gradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 50%, rgba(51, 65, 85, 0.95) 100%)",
    image: "🌡️"
  }
]

interface AppCarouselProps {
  onAppClick?: (app: any) => void
}

export function AppCarousel({ onAppClick }: AppCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === featuredApps.length - 3 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? featuredApps.length - 3 : prevIndex - 1
    )
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative mb-8">
      <div className="overflow-hidden rounded-xl">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
        >
          {featuredApps.map((app) => (
            <div
              key={app.id}
              className="w-1/3 flex-shrink-0 px-2"
            >
              <div 
                className="rounded-2xl p-8 text-white h-48 flex flex-col justify-between cursor-pointer hover:scale-105 transition-all duration-300 backdrop-blur-sm border border-white/20 shadow-2xl hover:shadow-3xl hover:border-white/30 relative overflow-hidden"
                onClick={() => {
                  if ((app.title === "能源管理系统" || app.title === "整车能耗分析") && onAppClick) {
                    onAppClick(app)
                  }
                }}
                style={{
                  backdropFilter: 'blur(16px)',
                  background: `${app.gradient}, linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
                  backgroundBlendMode: 'overlay',
                }}
              >
                {/* 玻璃反光效果 */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50"></div>
                
                <div className="relative z-10">
                  <div className="text-3xl mb-3 drop-shadow-lg">{app.image}</div>
                  <h3 className="text-xl font-semibold mb-2 drop-shadow-sm">{app.title}</h3>
                  <p className="text-white/95 text-sm leading-relaxed drop-shadow-sm">{app.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="sm"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg"
        onClick={nextSlide}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: featuredApps.length - 2 }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  )
}