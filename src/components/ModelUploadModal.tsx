import { useState, useRef, useCallback } from "react"
import {
  X,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  Plus,
  Trash2,
  Settings,
  Archive,
  Grid,
  Loader2,
  File,
  Eye,
  Download,
  AlertTriangle,
  ArrowRightLeft
} from "lucide-react@0.487.0"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Progress } from "./ui/progress"
import { toast } from "sonner@2.0.3"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { Switch } from "./ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Alert, AlertDescription } from "./ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"

interface ModelUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (modelData: ModelUploadData) => void
  userRole?: string
}

interface ModelUploadData {
  name: string
  type: string
  description: string
  version: string
  project: string
  rflpCategory: string
  tags: string[]
  isPublic: boolean
  mainFile: File | null
  interfaceFiles: File[]
  auxiliaryFiles: File[]
  metadata: ModelMetadata
}

interface ModelMetadata {
  author: string
  license: string
  dependencies: string[]
  compatibility: string[]
  documentation: string
  validationResults: ValidationResult[]
}

interface ValidationResult {
  type: 'error' | 'warning' | 'info'
  message: string
  location?: string
}

interface ParsedModelInfo {
  modelType: string
  version: string
  dependencies: string[]
  interfaces: string[]
  parameters: any[]
  components: string[]
}

// 预定义的标签选项
const predefinedTags = [
  "core-component",
  "battery-management", 
  "self-developed",
  "powertrain",
  "thermal",
  "control-logic",
  "standard-lib",
  "Engine",
  "Control System",
  "Simulink",
  "Battery",
  "Modelica",
  "Architecture",
  "System",
  "Vehicle Dynamics"
]

// 支持的模型类型
const modelTypes = [
  { value: "Simulink", label: "Simulink", extensions: [".slx", ".mdl"], icon: Settings },
  { value: "Modelica", label: "Modelica", extensions: [".mo"], icon: Archive },
  { value: "SysML", label: "SysML", extensions: [".sysml", ".xmi", ".xml"], icon: Grid },
  { value: "Requirements", label: "Requirements", extensions: [".txt", ".docx", ".xlsx"], icon: FileText }
]

// RFLP分类
const rflpCategories = [
  { value: "Requirements", label: "需求层 (Requirements)", icon: FileText, color: "blue" },
  { value: "Functions", label: "功能层 (Functions)", icon: Settings, color: "green" },
  { value: "Logical", label: "逻辑层 (Logical)", icon: Grid, color: "purple" },
  { value: "Physical", label: "物理层 (Physical)", icon: Archive, color: "orange" }
]

export function ModelUploadModal({ isOpen, onClose, onUpload, userRole }: ModelUploadModalProps) {
  const [step, setStep] = useState<'basic' | 'files' | 'metadata' | 'validation'>('basic')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([])
  const [parsedInfo, setParsedInfo] = useState<ParsedModelInfo | null>(null)
  
  // 表单数据
  const [formData, setFormData] = useState<ModelUploadData>({
    name: "",
    type: "",
    description: "",
    version: "1.0.0",
    project: "",
    rflpCategory: "",
    tags: [],
    isPublic: false,
    mainFile: null,
    interfaceFiles: [],
    auxiliaryFiles: [],
    metadata: {
      author: "",
      license: "MIT",
      dependencies: [],
      compatibility: [],
      documentation: "",
      validationResults: []
    }
  })

  // 拖拽相关状态
  const [isDragOver, setIsDragOver] = useState(false)
  const mainFileRef = useRef<HTMLInputElement>(null)
  const interfaceFileRef = useRef<HTMLInputElement>(null)
  const auxiliaryFileRef = useRef<HTMLInputElement>(null)

  // 重置表单
  const resetForm = useCallback(() => {
    setFormData({
      name: "",
      type: "",
      description: "",
      version: "1.0.0",
      project: "",
      rflpCategory: "",
      tags: [],
      isPublic: false,
      mainFile: null,
      interfaceFiles: [],
      auxiliaryFiles: [],
      metadata: {
        author: "",
        license: "MIT",
        dependencies: [],
        compatibility: [],
        documentation: "",
        validationResults: []
      }
    })
    setStep('basic')
    setValidationResults([])
    setParsedInfo(null)
    setUploadProgress(0)
  }, [])

  // 关闭模态框
  const handleClose = useCallback(() => {
    if (!isUploading) {
      resetForm()
      onClose()
    }
  }, [isUploading, resetForm, onClose])

  // 文件解析功能 - 增强解析结果
  const parseModelFile = async (file: File): Promise<ParsedModelInfo | null> => {
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    
    try {
      // 模拟文件解析过程，显示解析进度
      setUploadProgress(10)
      await new Promise(resolve => setTimeout(resolve, 500))
      setUploadProgress(30)
      await new Promise(resolve => setTimeout(resolve, 500))
      setUploadProgress(50)
      
      let parsedInfo: ParsedModelInfo
      
      switch (extension) {
        case '.slx':
        case '.mdl':
          parsedInfo = {
            modelType: 'Simulink',
            version: '2023b',
            dependencies: ['Control System Toolbox', 'Powertrain Blockset', 'Vehicle Dynamics Blockset'],
            interfaces: ['Engine_Torque_In', 'Vehicle_Speed_Out', 'Battery_SOC_In', 'Motor_Power_Out'],
            parameters: [
              { name: 'Engine_Max_Power', value: '120', type: 'double', unit: 'kW' },
              { name: 'Vehicle_Mass', value: '1500', type: 'double', unit: 'kg' },
              { name: 'Battery_Capacity', value: '60', type: 'double', unit: 'kWh' },
              { name: 'Motor_Efficiency', value: '0.95', type: 'double', unit: '-' }
            ],
            components: ['Engine Block', 'Battery Pack', 'Electric Motor', 'Vehicle Body', 'Control Unit']
          }
          break
          
        case '.mo':
          parsedInfo = {
            modelType: 'Modelica',
            version: '4.0.0',
            dependencies: ['Modelica.Blocks.Continuous', 'Modelica.Electrical.Analog', 'Modelica.Thermal.HeatTransfer'],
            interfaces: ['thermal_port', 'electrical_port', 'mechanical_flange'],
            parameters: [
              { name: 'Thermal_Conductivity', value: '237', type: 'Real', unit: 'W/(m.K)' },
              { name: 'Heat_Capacity', value: '900', type: 'Real', unit: 'J/(kg.K)' },
              { name: 'Density', value: '2700', type: 'Real', unit: 'kg/m3' },
              { name: 'Initial_Temperature', value: '293.15', type: 'Real', unit: 'K' }
            ],
            components: ['Battery Cell', 'Thermal Mass', 'Heat Transfer', 'Temperature Sensor', 'Cooling System']
          }
          break
          
        case '.sysml':
        case '.xmi':
        case '.xml':
          parsedInfo = {
            modelType: 'SysML',
            version: '1.6',
            dependencies: ['SysML Profile v1.6', 'UML Profile v2.5', 'MBSE Patterns'],
            interfaces: ['RequirementInterface', 'SystemInterface', 'ComponentInterface'],
            parameters: [
              { name: 'System_Power_Requirement', value: '100', type: 'Power', unit: 'kW', constraint: '>= 80 kW' },
              { name: 'System_Efficiency', value: '0.92', type: 'Real', unit: '-', constraint: '>= 0.9' },
              { name: 'Operating_Temperature', value: '40', type: 'Temperature', unit: '°C', constraint: '-20..60 °C' },
              { name: 'System_Mass', value: '50', type: 'Mass', unit: 'kg', constraint: '<= 60 kg' }
            ],
            components: ['Functional Requirements', 'System Architecture', 'Component Blocks', 'Verification Activities']
          }
          break
          
        default:
          throw new Error(`Unsupported file type: ${extension}`)
      }
      
      setUploadProgress(80)
      await new Promise(resolve => setTimeout(resolve, 300))
      setUploadProgress(100)
      
      return parsedInfo
    } catch (error) {
      console.error('Failed to parse model file:', error)
      setUploadProgress(0)
      return null
    }
  }

  // 文件验证功能 - 增强验证逻辑
  const validateFile = (file: File, fileType: 'main' | 'interface' | 'auxiliary'): ValidationResult[] => {
    const results: ValidationResult[] = []
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    
    // 文件大小验证
    if (file.size > 100 * 1024 * 1024) { // 100MB
      results.push({
        type: 'error',
        message: `文件大小超过100MB限制 (${Math.round(file.size / 1024 / 1024)}MB)，请压缩后重试`,
        location: '文件大小检查'
      })
    } else if (file.size > 50 * 1024 * 1024) { // 50MB
      results.push({
        type: 'warning',
        message: `文件较大 (${Math.round(file.size / 1024 / 1024)}MB)，上传可能较慢，建议在网络良好时进行`,
        location: '文件大小检查'
      })
    }
    
    // 文件类型验证
    const supportedExts = modelTypes.flatMap(type => type.extensions)
    if (fileType === 'main' && !supportedExts.includes(extension)) {
      results.push({
        type: 'error',
        message: `不支持的主文件类型: ${extension}。支持的格式: ${supportedExts.join(', ')}`,
        location: '文件类型检查'
      })
    }
    
    // 文件名验证
    if (!/^[a-zA-Z0-9_\-\s\u4e00-\u9fff]+\.[a-zA-Z0-9]+$/.test(file.name)) {
      results.push({
        type: 'warning',
        message: '文件名包含特殊字符，建议使用字母、数字、下划线、短横线和中文字符',
        location: '文件名检查'
      })
    }
    
    // 文件内容预检查（基于扩展名）
    if (fileType === 'main') {
      switch (extension) {
        case '.slx':
        case '.mdl':
          results.push({
            type: 'info',
            message: '检测到Simulink模型文件，将自动解析模型结构和参数信息',
            location: 'Simulink解析器'
          })
          break
        case '.mo':
          results.push({
            type: 'info',
            message: '检测到Modelica模型文件，将自动提取物理建模组件和接口信息',
            location: 'Modelica解析器'
          })
          break
        case '.sysml':
        case '.xmi':
        case '.xml':
          results.push({
            type: 'info',
            message: '检测到SysML模型文件，将自动解析系统架构和需求信息',
            location: 'SysML解析器'
          })
          break
      }
    }
    
    return results
  }

  // 处理主文件上传
  const handleMainFileChange = async (files: FileList | File[]) => {
    const file = files[0]
    if (!file) return

    const validationResults = validateFile(file, 'main')
    setValidationResults(validationResults)
    
    if (validationResults.some(r => r.type === 'error')) {
      toast.error('文件验证失败，请检查文件格式和大小')
      return
    }

    setFormData(prev => ({ ...prev, mainFile: file }))
    
    // 自动填充文件名
    if (!formData.name) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "")
      setFormData(prev => ({ ...prev, name: nameWithoutExt }))
    }
    
    // 自动检测模型类型
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
    const detectedType = modelTypes.find(type => type.extensions.includes(extension))
    if (detectedType && !formData.type) {
      setFormData(prev => ({ ...prev, type: detectedType.value }))
    }

    // 解析文件信息
    try {
      const info = await parseModelFile(file)
      setParsedInfo(info)
      
      if (info) {
        setFormData(prev => ({
          ...prev,
          metadata: {
            ...prev.metadata,
            dependencies: info.dependencies,
            compatibility: [info.version]
          }
        }))
        toast.success('文件解析成功')
      }
    } catch (error) {
      toast.warning('文件解析失败，但仍可继续上传')
    }
  }

  // 处理接口文件上传
  const handleInterfaceFilesChange = (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const validFiles: File[] = []
    const errors: string[] = []

    fileArray.forEach(file => {
      const validationResults = validateFile(file, 'interface')
      if (validationResults.some(r => r.type === 'error')) {
        errors.push(`${file.name}: ${validationResults.find(r => r.type === 'error')?.message}`)
      } else {
        validFiles.push(file)
      }
    })

    if (errors.length > 0) {
      toast.error(`接口文件验证失败:\n${errors.join('\n')}`)
    }

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        interfaceFiles: [...prev.interfaceFiles, ...validFiles]
      }))
      toast.success(`已添加 ${validFiles.length} 个接口文件`)
    }
  }

  // 处理辅助文件上传
  const handleAuxiliaryFilesChange = (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const validFiles: File[] = []
    const errors: string[] = []

    fileArray.forEach(file => {
      const validationResults = validateFile(file, 'auxiliary')
      if (validationResults.some(r => r.type === 'error')) {
        errors.push(`${file.name}: ${validationResults.find(r => r.type === 'error')?.message}`)
      } else {
        validFiles.push(file)
      }
    })

    if (errors.length > 0) {
      toast.error(`辅助文件验证失败:\n${errors.join('\n')}`)
    }

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        auxiliaryFiles: [...prev.auxiliaryFiles, ...validFiles]
      }))
      toast.success(`已添加 ${validFiles.length} 个辅助文件`)
    }
  }

  // 拖拽处理
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, fileType: 'main' | 'interface' | 'auxiliary') => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length === 0) return

    switch (fileType) {
      case 'main':
        handleMainFileChange(files)
        break
      case 'interface':
        handleInterfaceFilesChange(files)
        break
      case 'auxiliary':
        handleAuxiliaryFilesChange(files)
        break
    }
  }, [])

  // 删除文件
  const removeFile = (fileType: 'main' | 'interface' | 'auxiliary', index?: number) => {
    if (fileType === 'main') {
      setFormData(prev => ({ ...prev, mainFile: null }))
      setParsedInfo(null)
      setValidationResults([])
    } else if (fileType === 'interface' && typeof index === 'number') {
      setFormData(prev => ({
        ...prev,
        interfaceFiles: prev.interfaceFiles.filter((_, i) => i !== index)
      }))
    } else if (fileType === 'auxiliary' && typeof index === 'number') {
      setFormData(prev => ({
        ...prev,
        auxiliaryFiles: prev.auxiliaryFiles.filter((_, i) => i !== index)
      }))
    }
  }

  // 添加标签
  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }))
    }
  }

  // 删除标签
  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  // 自定义标签输入
  const [customTag, setCustomTag] = useState("")
  const handleAddCustomTag = () => {
    if (customTag.trim() && !formData.tags.includes(customTag.trim())) {
      addTag(customTag.trim())
      setCustomTag("")
    }
  }

  // 提交上传
  const handleSubmit = async () => {
    if (!formData.mainFile) {
      toast.error('请选择主模型文件')
      return
    }

    if (!formData.name.trim()) {
      toast.error('请输入模型名称')
      return
    }

    if (!formData.type) {
      toast.error('请选择模型类型')
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + Math.random() * 10
        })
      }, 200)

      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      clearInterval(progressInterval)
      setUploadProgress(100)

      // 构建完整的模型数据
      const modelData: ModelUploadData = {
        ...formData,
        metadata: {
          ...formData.metadata,
          validationResults: validationResults
        }
      }

      onUpload(modelData)
      toast.success(`模型 "${formData.name}" 上传成功！`)
      handleClose()
      
    } catch (error) {
      toast.error('上传失败，请稍后重试')
    } finally {
      setIsUploading(false)
    }
  }

  // 步骤验证
  const canProceedToStep = (targetStep: string): boolean => {
    switch (targetStep) {
      case 'files':
        return !!(formData.name && formData.type)
      case 'metadata':
        return !!(formData.mainFile)
      case 'validation':
        return !!(formData.description)
      default:
        return true
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">上传/注册新模型</h2>
            <p className="text-sm text-gray-600 mt-1">
              支持 Simulink、Modelica、SysML 等多种模型格式的上传和解析
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} disabled={isUploading}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* 步骤导航 */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            {[
              { id: 'basic', name: '基本信息' },
              { id: 'files', name: '文件上传' },
              { id: 'metadata', name: '元数据' },
              { id: 'validation', name: '验证提交' }
            ].map((stepItem, index) => (
              <div key={stepItem.id} className="flex items-center">
                <button
                  onClick={() => canProceedToStep(stepItem.id) && setStep(stepItem.id as any)}
                  disabled={!canProceedToStep(stepItem.id) || isUploading}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    step === stepItem.id
                      ? 'bg-blue-100 text-blue-800'
                      : canProceedToStep(stepItem.id)
                      ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      : 'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    step === stepItem.id ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index + 1}
                  </span>
                  <span>{stepItem.name}</span>
                </button>
                {index < 3 && <ChevronDown className="w-4 h-4 text-gray-400 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* 基本信息步骤 */}
          {step === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    模型名称 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="请输入模型名称"
                    disabled={isUploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    模型类型 <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                    disabled={isUploading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择模型类型" />
                    </SelectTrigger>
                    <SelectContent>
                      {modelTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <type.icon className="w-4 h-4" />
                            <span>{type.label}</span>
                            <span className="text-xs text-gray-500">
                              ({type.extensions.join(', ')})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    版本号
                  </label>
                  <Input
                    value={formData.version}
                    onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                    placeholder="1.0.0"
                    disabled={isUploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    所属项目
                  </label>
                  <Input
                    value={formData.project}
                    onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                    placeholder="项目名称（可选）"
                    disabled={isUploading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  RFLP架构分类
                </label>
                <Select
                  value={formData.rflpCategory}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, rflpCategory: value }))}
                  disabled={isUploading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择RFLP分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {rflpCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-2">
                          <category.icon className="w-4 h-4" />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  模型描述
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="请详细描述模型的功能、用途和特点..."
                  rows={4}
                  disabled={isUploading}
                />
              </div>

              {/* 标签选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  标签
                </label>
                
                {/* 已选标签 */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:bg-gray-300 rounded-full p-0.5"
                        disabled={isUploading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                {/* 预定义标签 */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {predefinedTags
                    .filter(tag => !formData.tags.includes(tag))
                    .map((tag) => (
                    <button
                      key={tag}
                      onClick={() => addTag(tag)}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border transition-colors"
                      disabled={isUploading}
                    >
                      + {tag}
                    </button>
                  ))}
                </div>

                {/* 自定义标签输入 */}
                <div className="flex space-x-2">
                  <Input
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="添加自定义标签"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
                    disabled={isUploading}
                  />
                  <Button
                    onClick={handleAddCustomTag}
                    variant="outline"
                    size="sm"
                    disabled={!customTag.trim() || isUploading}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* 权限设置 */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    公开模型
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    启用后，其他用户可以查看和下载此模型
                  </p>
                </div>
                <Switch
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
                  disabled={isUploading || (userRole !== 'admin' && formData.isPublic)}
                />
              </div>
            </div>
          )}

          {/* 文件上传步骤 */}
          {step === 'files' && (
            <div className="space-y-6">
              {/* 主模型文件 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>主模型文件 <span className="text-red-500">*</span></span>
                  </CardTitle>
                  <CardDescription>
                    上传主要的模型文件（支持 {modelTypes.find(t => t.value === formData.type)?.extensions.join(', ') || '多种格式'}）
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!formData.mainFile ? (
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, 'main')}
                    >
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">拖拽文件到此处或点击选择</p>
                      <Button
                        variant="outline"
                        onClick={() => mainFileRef.current?.click()}
                        disabled={isUploading}
                      >
                        选择文件
                      </Button>
                      <input
                        ref={mainFileRef}
                        type="file"
                        className="hidden"
                        accept={modelTypes.find(t => t.value === formData.type)?.extensions.join(',') || ''}
                        onChange={(e) => e.target.files && handleMainFileChange(e.target.files)}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <File className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">{formData.mainFile.name}</p>
                          <p className="text-sm text-green-600">
                            {Math.round(formData.mainFile.size / 1024)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile('main')}
                        disabled={isUploading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* 解析结果显示 */}
                  {parsedInfo && (
                    <Card className="mt-4">
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>文件解析结果</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* 基本信息表格 */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">基本信息</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-1/3">属性</TableHead>
                                <TableHead>值</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">模型类型</TableCell>
                                <TableCell>{parsedInfo.modelType}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">版本</TableCell>
                                <TableCell>{parsedInfo.version}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>

                        {/* 依赖项表格 */}
                        {parsedInfo.dependencies.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">依赖项</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12">#</TableHead>
                                  <TableHead>依赖项名称</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {parsedInfo.dependencies.map((dep, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{dep}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}

                        {/* 接口表格 */}
                        {parsedInfo.interfaces.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">输入/输出接口</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12">#</TableHead>
                                  <TableHead>接口名称</TableHead>
                                  <TableHead>类型</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {parsedInfo.interfaces.map((intf, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{intf}</TableCell>
                                    <TableCell>
                                      <Badge variant={intf.includes('In') ? 'destructive' : 'default'}>
                                        {intf.includes('In') ? '输入' : '输出'}
                                      </Badge>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}

                        {/* 组件表格 */}
                        {parsedInfo.components.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">模型组件</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-12">#</TableHead>
                                  <TableHead>组件名称</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {parsedInfo.components.map((comp, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{comp}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}

                        {/* 参数表格 */}
                        {parsedInfo.parameters.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-2">模型参数</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>参数名</TableHead>
                                  <TableHead>值</TableHead>
                                  <TableHead>类型</TableHead>
                                  <TableHead>单位</TableHead>
                                  <TableHead>约束</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {parsedInfo.parameters.map((param: any, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium">{param.name}</TableCell>
                                    <TableCell>{param.value}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline">{param.type}</Badge>
                                    </TableCell>
                                    <TableCell>{param.unit || '-'}</TableCell>
                                    <TableCell className="text-xs text-gray-600">
                                      {param.constraint || '-'}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              {/* 接口文件（可选） */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ArrowRightLeft className="w-5 h-5" />
                    <span>接口文件 (可选)</span>
                  </CardTitle>
                  <CardDescription>
                    上传模型接口定义文件、API文档等
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {formData.interfaceFiles.length === 0 ? (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, 'interface')}
                    >
                      <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">添加接口文件</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => interfaceFileRef.current?.click()}
                        disabled={isUploading}
                      >
                        选择文件
                      </Button>
                      <input
                        ref={interfaceFileRef}
                        type="file"
                        className="hidden"
                        multiple
                        onChange={(e) => e.target.files && handleInterfaceFilesChange(e.target.files)}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {formData.interfaceFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <File className="w-6 h-6 text-blue-600" />
                            <div>
                              <p className="font-medium text-blue-900">{file.name}</p>
                              <p className="text-sm text-blue-600">
                                {Math.round(file.size / 1024)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile('interface', index)}
                            disabled={isUploading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => interfaceFileRef.current?.click()}
                        disabled={isUploading}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        添加更多文件
                      </Button>
                      <input
                        ref={interfaceFileRef}
                        type="file"
                        className="hidden"
                        multiple
                        onChange={(e) => e.target.files && handleInterfaceFilesChange(e.target.files)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 辅助文件（可选） */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Archive className="w-5 h-5" />
                    <span>辅助文件 (可选)</span>
                  </CardTitle>
                  <CardDescription>
                    上传说明文档、示例文件、测试数据等
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {formData.auxiliaryFiles.length === 0 ? (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, 'auxiliary')}
                    >
                      <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600 mb-2">添加辅助文件</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => auxiliaryFileRef.current?.click()}
                        disabled={isUploading}
                      >
                        选择文件
                      </Button>
                      <input
                        ref={auxiliaryFileRef}
                        type="file"
                        className="hidden"
                        multiple
                        onChange={(e) => e.target.files && handleAuxiliaryFilesChange(e.target.files)}
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {formData.auxiliaryFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <File className="w-6 h-6 text-gray-600" />
                            <div>
                              <p className="font-medium text-gray-900">{file.name}</p>
                              <p className="text-sm text-gray-600">
                                {Math.round(file.size / 1024)} KB
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile('auxiliary', index)}
                            disabled={isUploading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => auxiliaryFileRef.current?.click()}
                        disabled={isUploading}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        添加更多文件
                      </Button>
                      <input
                        ref={auxiliaryFileRef}
                        type="file"
                        className="hidden"
                        multiple
                        onChange={(e) => e.target.files && handleAuxiliaryFilesChange(e.target.files)}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* 元数据步骤 */}
          {step === 'metadata' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    作者/创建者
                  </label>
                  <Input
                    value={formData.metadata.author}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata, author: e.target.value }
                    }))}
                    placeholder="模型作者姓名"
                    disabled={isUploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    许可证
                  </label>
                  <Select
                    value={formData.metadata.license}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      metadata: { ...prev.metadata, license: value }
                    }))}
                    disabled={isUploading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择许可证" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MIT">MIT License</SelectItem>
                      <SelectItem value="Apache-2.0">Apache License 2.0</SelectItem>
                      <SelectItem value="GPL-3.0">GNU GPL v3.0</SelectItem>
                      <SelectItem value="BSD-3-Clause">BSD 3-Clause License</SelectItem>
                      <SelectItem value="Proprietary">专有许可证</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  使用文档
                </label>
                <Textarea
                  value={formData.metadata.documentation}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    metadata: { ...prev.metadata, documentation: e.target.value }
                  }))}
                  placeholder="详细的使用说明、API文档、示例等..."
                  rows={6}
                  disabled={isUploading}
                />
              </div>

              {/* 依赖项显示（从文件解析中获取） */}
              {parsedInfo && parsedInfo.dependencies.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    检测到的依赖项
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {parsedInfo.dependencies.map((dep, index) => (
                      <Badge key={index} variant="outline">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* 兼容性信息 */}
              {parsedInfo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    兼容性信息
                  </label>
                  <Card>
                    <CardContent className="pt-4">
                      {/* 基本信息表格 */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-800 mb-2">基本信息</h5>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-1/3">属性</TableHead>
                              <TableHead>值</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell className="font-medium">模型版本</TableCell>
                              <TableCell>{parsedInfo.version}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="font-medium">模型类型</TableCell>
                              <TableCell>{parsedInfo.modelType}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>

                      {/* 参数表格 */}
                      {parsedInfo.parameters.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-800 mb-2">模型参数</h5>
                          <div className="max-h-40 overflow-y-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>参数名</TableHead>
                                  <TableHead>值</TableHead>
                                  <TableHead>类型</TableHead>
                                  <TableHead>单位</TableHead>
                                  <TableHead>约束</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {parsedInfo.parameters.map((param: any, index) => (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium text-sm">{param.name}</TableCell>
                                    <TableCell className="text-sm">{param.value}</TableCell>
                                    <TableCell>
                                      <Badge variant="outline" className="text-xs">{param.type}</Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">{param.unit || '-'}</TableCell>
                                    <TableCell className="text-xs text-gray-600">
                                      {param.constraint || '-'}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* 验证提交步骤 */}
          {step === 'validation' && (
            <div className="space-y-6">
              {/* 验证结果 */}
              {validationResults.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-gray-900">验证结果</h3>
                  {validationResults.map((result, index) => (
                    <Alert key={index} className={
                      result.type === 'error' ? 'border-red-200 bg-red-50' :
                      result.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    }>
                      {result.type === 'error' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                      {result.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                      {result.type === 'info' && <Info className="h-4 w-4 text-blue-600" />}
                      <AlertDescription className={
                        result.type === 'error' ? 'text-red-800' :
                        result.type === 'warning' ? 'text-yellow-800' :
                        'text-blue-800'
                      }>
                        {result.message}
                        {result.location && (
                          <span className="block text-sm mt-1 opacity-75">
                            位置: {result.location}
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              )}

              {/* 上传摘要 */}
              <Card>
                <CardHeader>
                  <CardTitle>上传摘要</CardTitle>
                  <CardDescription>请确认以下信息无误后提交</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-medium">模型名称:</span> {formData.name}</div>
                    <div><span className="font-medium">模型类型:</span> {formData.type}</div>
                    <div><span className="font-medium">版本:</span> {formData.version}</div>
                    <div><span className="font-medium">RFLP分类:</span> {formData.rflpCategory}</div>
                    <div><span className="font-medium">公开性:</span> {formData.isPublic ? '公开' : '私有'}</div>
                    <div><span className="font-medium">主文件:</span> {formData.mainFile?.name}</div>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div>
                      <span className="font-medium text-sm">标签:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {formData.description && (
                    <div>
                      <span className="font-medium text-sm">描述:</span>
                      <p className="text-sm text-gray-600 mt-1">{formData.description}</p>
                    </div>
                  )}

                  <div className="text-sm text-gray-600">
                    <div>接口文件: {formData.interfaceFiles.length} 个</div>
                    <div>辅助文件: {formData.auxiliaryFiles.length} 个</div>
                  </div>
                </CardContent>
              </Card>

              {/* 上传进度 */}
              {isUploading && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>上传中...</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress value={uploadProgress} className="mb-2" />
                    <p className="text-sm text-gray-600 text-center">
                      {uploadProgress < 30 ? '正在上传文件...' :
                       uploadProgress < 60 ? '正在解析模型...' :
                       uploadProgress < 90 ? '正在验证数据...' :
                       '即将完成...'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            {step !== 'basic' && (
              <Button
                variant="outline"
                onClick={() => {
                  const steps = ['basic', 'files', 'metadata', 'validation']
                  const currentIndex = steps.indexOf(step)
                  if (currentIndex > 0) {
                    setStep(steps[currentIndex - 1] as any)
                  }
                }}
                disabled={isUploading}
              >
                上一步
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={handleClose} disabled={isUploading}>
              取消
            </Button>
            
            {step !== 'validation' ? (
              <Button
                onClick={() => {
                  const steps = ['basic', 'files', 'metadata', 'validation']
                  const currentIndex = steps.indexOf(step)
                  if (currentIndex < steps.length - 1) {
                    setStep(steps[currentIndex + 1] as any)
                  }
                }}
                disabled={!canProceedToStep(
                  step === 'basic' ? 'files' :
                  step === 'files' ? 'metadata' :
                  step === 'metadata' ? 'validation' : 'validation'
                ) || isUploading}
              >
                下一步
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!formData.mainFile || !formData.name || !formData.type || isUploading}
              >
                {isUploading ? '上传中...' : '提交注册'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}