import { useState } from 'react'
import { Check, ChevronsUpDown, FolderKanban, Plus, X } from 'lucide-react@0.487.0'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover'
import { Badge } from '../ui/badge'
import { useProject } from '../ProjectContext'
import { projectService } from '../../services/ProjectService'
import { Project } from '../../types/project'
import { useAuth } from '../AuthContext'

interface ProjectContextSwitcherProps {
  onCreateProject?: () => void
}

export function ProjectContextSwitcher({ onCreateProject }: ProjectContextSwitcherProps) {
  const [open, setOpen] = useState(false)
  const { currentProject, switchProject, clearProject } = useProject()
  const { user } = useAuth()

  // 获取用户可见的项目列表
  const projects = projectService.getProjects()
  const userProjects = user?.role === 'admin'
    ? projects
    : projects.filter(p =>
        p.ownerId === user?.id || p.teamMembers.some(m => m.userId === user?.id)
      )

  const handleSelectProject = (project: Project) => {
    switchProject(project.id)
    setOpen(false)
  }

  const handleClearProject = (e: React.MouseEvent) => {
    e.stopPropagation()
    clearProject()
    setOpen(false)
  }

  const getProjectTypeName = (type: string) => {
    const typeNames: Record<string, string> = {
      vehicle: '整车',
      powertrain: '三电',
      battery: '电池',
      custom: '自定义'
    }
    return typeNames[type] || type
  }

  const getProjectPhaseColor = (phase: string) => {
    const colors: Record<string, string> = {
      concept: 'bg-purple-100 text-purple-700',
      design: 'bg-blue-100 text-blue-700',
      validation: 'bg-green-100 text-green-700',
      production: 'bg-orange-100 text-orange-700'
    }
    return colors[phase] || 'bg-gray-100 text-gray-700'
  }

  const getProjectPhaseName = (phase: string) => {
    const names: Record<string, string> = {
      concept: '概念',
      design: '设计',
      validation: '验证',
      production: '量产'
    }
    return names[phase] || phase
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-9 justify-between min-w-[200px] max-w-[280px]"
        >
          {currentProject ? (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FolderKanban className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{currentProject.name}</span>
              <X
                className="h-3 w-3 flex-shrink-0 ml-auto hover:bg-gray-200 rounded"
                onClick={handleClearProject}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4" />
              <span className="text-gray-500">选择项目</span>
            </div>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <div className="max-h-[400px] overflow-auto">
          {/* 当前项目 */}
          {currentProject && (
            <div className="p-2 border-b">
              <div className="text-xs text-gray-500 mb-1 px-2">当前项目</div>
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                <Check className="h-4 w-4 text-blue-600" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{currentProject.name}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-500">{currentProject.code}</span>
                    <Badge variant="outline" className={`text-xs ${getProjectPhaseColor(currentProject.phase)}`}>
                      {getProjectPhaseName(currentProject.phase)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 项目列表 */}
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2 px-2">
              所有项目 ({userProjects.length})
            </div>
            {userProjects.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-8">
                暂无可用项目
              </div>
            ) : (
              <div className="space-y-1">
                {userProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleSelectProject(project)}
                    className={`
                      w-full flex items-start gap-2 p-2 rounded text-left hover:bg-gray-100 transition-colors
                      ${currentProject?.id === project.id ? 'bg-blue-50' : ''}
                    `}
                  >
                    <FolderKanban className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate text-sm">{project.name}</div>
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        <span className="text-xs text-gray-500">{project.code}</span>
                        <Badge variant="outline" className="text-xs">
                          {getProjectTypeName(project.type)}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${getProjectPhaseColor(project.phase)}`}>
                          {getProjectPhaseName(project.phase)}
                        </Badge>
                        {project.progress !== undefined && (
                          <span className="text-xs text-gray-500">
                            {project.progress}%
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 创建新项目 */}
          {onCreateProject && (user?.role === 'admin' || user?.role === 'projectManager') && (
            <div className="border-t p-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => {
                  setOpen(false)
                  onCreateProject()
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                创建新项目
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
