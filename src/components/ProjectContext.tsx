import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { Project } from '../types/project'
import { projectService } from '../services/ProjectService'

interface ProjectContextType {
  currentProject: Project | null
  setCurrentProject: (project: Project | null) => void
  switchProject: (projectId: string) => void
  clearProject: () => void
  refreshProject: () => void
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

interface ProjectProviderProps {
  children: ReactNode
}

export function ProjectProvider({ children }: ProjectProviderProps) {
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null)

  // 从localStorage恢复上次选择的项目
  useEffect(() => {
    const savedProjectId = localStorage.getItem('currentProjectId')
    if (savedProjectId) {
      const project = projectService.getProject(savedProjectId)
      if (project) {
        setCurrentProjectState(project)
      } else {
        // 项目不存在，清除localStorage
        localStorage.removeItem('currentProjectId')
      }
    }
  }, [])

  const setCurrentProject = (project: Project | null) => {
    setCurrentProjectState(project)
    if (project) {
      localStorage.setItem('currentProjectId', project.id)
    } else {
      localStorage.removeItem('currentProjectId')
    }
  }

  const switchProject = (projectId: string) => {
    const project = projectService.getProject(projectId)
    if (project) {
      setCurrentProject(project)
    }
  }

  const clearProject = () => {
    setCurrentProject(null)
  }

  const refreshProject = () => {
    if (currentProject) {
      const updated = projectService.getProject(currentProject.id)
      if (updated) {
        setCurrentProjectState(updated)
      }
    }
  }

  return (
    <ProjectContext.Provider
      value={{
        currentProject,
        setCurrentProject,
        switchProject,
        clearProject,
        refreshProject
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}
