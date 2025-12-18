import React, { useState } from 'react'
import { Users, UserPlus, Edit, Trash2, Shield, Activity, Search, Filter, MoreVertical, Key, Eye, EyeOff, AlertCircle, CheckCircle2, FileText, Clock, Copy, Mail, Download, UserCheck, UserX, Phone, MapPin, Calendar, History, Plus, ChevronUp, ChevronDown, X, Zap, Settings, RefreshCw, Ban, Unlock, Crown, Award, Target, TrendingUp, AlertTriangle, CheckCircle, XCircle, Database, Monitor, Globe, Wifi } from 'lucide-react@0.487.0'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Label } from './ui/label'
import { Checkbox } from './ui/checkbox'
import { Switch } from './ui/switch'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Textarea } from './ui/textarea'
import { ScrollArea } from './ui/scroll-area'
import { Separator } from './ui/separator'
import { Progress } from './ui/progress'

// 角色权限对比组件
function RolePermissionComparisonDialog({ user, open, onOpenChange }: any) {
  const rolePermissions = {
    admin: {
      name: '平台管理员',
      permissions: ['system.full', 'user.manage', 'role.manage', 'audit.view', 'data.all'],
      description: '拥有系统所有权限，可以管理用户、角色和查看审计日志'
    },
    projectManager: {
      name: '项目经理',
      permissions: ['project.manage', 'team.manage', 'report.view', 'workflow.approve'],
      description: '负责项目管理和团队协调'
    },
    architect: {
      name: '系统架构师',
      permissions: ['model.design', 'architecture.edit', 'component.manage', 'requirement.edit'],
      description: '负责系统架构设计和模型构建'
    },
    simulation: {
      name: '仿真工程师',
      permissions: ['simulation.run', 'model.execute', 'result.analyze', 'data.read'],
      description: '执行仿真任务和结果分析'
    },
    modeling: {
      name: '建模工程师',
      permissions: ['model.create', 'model.edit', 'library.manage', 'data.read'],
      description: '创建和维护仿真模型'
    }
  }

  const currentRole = rolePermissions[user?.role as keyof typeof rolePermissions]
  const userPermissions = user?.permissions || []

  const getPermissionStatus = (permission: string) => {
    const hasRole = currentRole?.permissions.includes(permission)
    const hasCustom = userPermissions.includes(permission)
    
    if (hasRole && hasCustom) return 'inherited'
    if (hasRole && !hasCustom) return 'role-only'
    if (!hasRole && hasCustom) return 'custom-granted'
    return 'none'
  }

  const allPermissions = Array.from(new Set([
    ...Object.values(rolePermissions).flatMap(role => role.permissions),
    ...userPermissions
  ]))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col bg-white">
        <DialogHeader className="flex-shrink-0 pb-4 bg-white border-b">
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            角色权限对比 - {user?.name}
          </DialogTitle>
          <DialogDescription>
            查看用户当前角色权限与自定义权限的对比情况
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden min-h-0">
          <ScrollArea className="h-full">
            <div className="space-y-6 p-6 bg-white">
              {/* 用户基本信息 */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium">{user?.name}</h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                  <Badge variant="outline" className="mt-1">
                    {currentRole?.name}
                  </Badge>
                </div>
              </div>

              {/* 权限对比表格 */}
              <div className="border rounded-lg bg-white">
                <div className="p-4 bg-gray-50 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">权限详细对比</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        显示角色继承权限与自定义授权权限的差异
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      共 {allPermissions.length} 项权限
                    </Badge>
                  </div>
                </div>
                
                <div className="relative bg-white">
                  <div className="max-h-80 overflow-y-auto">
                    <div className="p-4 space-y-1">
                      {allPermissions.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>暂无权限数据</p>
                        </div>
                      ) : (
                        allPermissions.map((permission, index) => {
                          const status = getPermissionStatus(permission)
                          return (
                            <div 
                              key={permission} 
                              className="flex items-center justify-between py-3 px-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                  status === 'inherited' ? 'bg-green-500' :
                                  status === 'role-only' ? 'bg-blue-500' :
                                  status === 'custom-granted' ? 'bg-orange-500' :
                                  'bg-gray-300'
                                }`} />
                                <div className="min-w-0 flex-1">
                                  <span className="font-mono text-sm break-all">{permission}</span>
                                  <div className="text-xs text-gray-500 mt-1">
                                    权限编号: #{(index + 1).toString().padStart(2, '0')}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                                {status === 'inherited' && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">继承+自定义</Badge>
                                )}
                                {status === 'role-only' && (
                                  <Badge className="bg-blue-100 text-blue-800 text-xs">角色继承</Badge>
                                )}
                                {status === 'custom-granted' && (
                                  <Badge className="bg-orange-100 text-orange-800 text-xs">自定义授权</Badge>
                                )}
                                {status === 'none' && (
                                  <Badge variant="outline" className="text-xs text-gray-500">无权限</Badge>
                                )}
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                  
                  {/* 滚动指示器 */}
                  {allPermissions.length > 8 && (
                    <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 rounded-full p-1 shadow-sm border">
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* 权限统计 */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {allPermissions.filter(p => getPermissionStatus(p) === 'inherited').length}
                  </div>
                  <div className="text-sm text-green-600">继承+自定义</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {allPermissions.filter(p => getPermissionStatus(p) === 'role-only').length}
                  </div>
                  <div className="text-sm text-blue-600">仅角色继承</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {allPermissions.filter(p => getPermissionStatus(p) === 'custom-granted').length}
                  </div>
                  <div className="text-sm text-orange-600">仅自定义</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {allPermissions.length}
                  </div>
                  <div className="text-sm text-gray-600">总权限数</div>
                </div>
              </div>

              {/* 底部填充空间 */}
              <div className="h-4" />
            </div>
          </ScrollArea>
        </div>
        
        <DialogFooter className="flex-shrink-0 pt-4 bg-white border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
          <Button onClick={() => toast.success('权限对比报告已导出')}>
            <Download className="w-4 h-4 mr-2" />
            导出报告
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 用户编辑对话框组件
function UserEditDialog({ user, open, onOpenChange, editForm, setEditForm }: any) {
  const handleSave = () => {
    toast.success(`用户 ${editForm.name} 信息已更新`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-blue-600" />
            编辑用户信息 - {user?.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">姓名</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">邮箱</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-role">角色</Label>
              <Select value={editForm.role} onValueChange={(value) => setEditForm({...editForm, role: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">平台管理员</SelectItem>
                  <SelectItem value="projectManager">项目经理</SelectItem>
                  <SelectItem value="architect">系统架构师</SelectItem>
                  <SelectItem value="simulation">仿真工程师</SelectItem>
                  <SelectItem value="modeling">建模工程师</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-department">部门</Label>
              <Input
                id="edit-department"
                value={editForm.department}
                onChange={(e) => setEditForm({...editForm, department: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-status">状态</Label>
              <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">活跃</SelectItem>
                  <SelectItem value="inactive">非活跃</SelectItem>
                  <SelectItem value="pending">待审核</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">电话</Label>
              <Input
                id="edit-phone"
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                placeholder="请输入电话号码"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave}>
            保存修改
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 权限分配对话框组件
function PermissionAssignDialog({ user, open, onOpenChange, assignForm, setAssignForm }: any) {
  const allPermissions = [
    { id: 'system.full', name: '系统完全控制', category: '系统管理' },
    { id: 'user.manage', name: '用户管理', category: '用户权限' },
    { id: 'role.manage', name: '角色管理', category: '用户权限' },
    { id: 'project.manage', name: '项目管理', category: '项目协作' },
    { id: 'team.manage', name: '团队管理', category: '项目协作' },
    { id: 'model.create', name: '模型创建', category: '建模仿真' },
    { id: 'model.edit', name: '模型编辑', category: '建模仿真' },
    { id: 'simulation.run', name: '执行仿真', category: '建模仿真' },
    { id: 'data.read', name: '数据读取', category: '数据权限' },
    { id: 'data.write', name: '数据写入', category: '数据权限' },
    { id: 'data.delete', name: '数据删除', category: '数据权限' },
    { id: 'audit.view', name: '审计查看', category: '安全审计' },
    { id: 'report.view', name: '报告查看', category: '分析报告' }
  ]

  const categories = Array.from(new Set(allPermissions.map(p => p.category)))

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    const newPermissions = checked
      ? [...(assignForm.selectedPermissions || []), permissionId]
      : (assignForm.selectedPermissions || []).filter((id: string) => id !== permissionId)
    
    setAssignForm({...assignForm, selectedPermissions: newPermissions})
  }

  const handleAssign = () => {
    toast.success(`已为用户 ${user?.name} 分配权限`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[95vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-green-600" />
            权限分配 - {user?.name}
          </DialogTitle>
          <DialogDescription>
            为用户分配自定义权限，可设置生效时间和过期时间
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden min-h-0">
          <ScrollArea className="h-full">
            <div className="space-y-6 pr-4">
              {/* 用户信息概览 */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium">{user?.name}</h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {user?.role === 'admin' ? '平台管理员' :
                       user?.role === 'projectManager' ? '项目经理' :
                       user?.role === 'architect' ? '系统架构师' :
                       user?.role === 'simulation' ? '仿真工程师' : '建模工程师'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {user?.department}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* 权限选择区域 */}
              <div className="border rounded-lg bg-white">
                <div className="p-4 bg-gray-50 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">选择权限</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        选择要为用户分配的权限，按分类组织
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      已选择 {(assignForm.selectedPermissions || []).length} 项权限
                    </Badge>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-4 space-y-6">
                      {categories.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Key className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>暂无权限数据</p>
                        </div>
                      ) : (
                        categories.map((category, categoryIndex) => (
                          <div key={category} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${
                                  categoryIndex === 0 ? 'bg-blue-500' :
                                  categoryIndex === 1 ? 'bg-green-500' :
                                  categoryIndex === 2 ? 'bg-purple-500' :
                                  categoryIndex === 3 ? 'bg-orange-500' :
                                  categoryIndex === 4 ? 'bg-red-500' : 'bg-gray-500'
                                }`} />
                                {category}
                              </h5>
                              <Badge variant="outline" className="text-xs">
                                {allPermissions.filter(p => p.category === category).length} 项权限
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-5">
                              {allPermissions
                                .filter(p => p.category === category)
                                .map(permission => (
                                  <div 
                                    key={permission.id} 
                                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    <Checkbox
                                      id={permission.id}
                                      checked={(assignForm.selectedPermissions || []).includes(permission.id)}
                                      onCheckedChange={(checked) => handlePermissionChange(permission.id, !!checked)}
                                      className="flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <Label 
                                        htmlFor={permission.id} 
                                        className="text-sm font-medium cursor-pointer block"
                                      >
                                        {permission.name}
                                      </Label>
                                      <p className="text-xs text-gray-500 mt-1 font-mono">
                                        {permission.id}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  {/* 滚动指示器 */}
                  {allPermissions.length > 10 && (
                    <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 rounded-full p-1 shadow-sm border">
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* 时间设置 */}
              <div className="border rounded-lg bg-white p-4">
                <h4 className="font-medium mb-4">权限有效期设置</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="effective-date">生效时间</Label>
                    <Input
                      id="effective-date"
                      type="datetime-local"
                      value={assignForm.effectiveDate}
                      onChange={(e) => setAssignForm({...assignForm, effectiveDate: e.target.value})}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">留空则立即生效</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry-date">过期时间</Label>
                    <Input
                      id="expiry-date"
                      type="datetime-local"
                      value={assignForm.expiryDate}
                      onChange={(e) => setAssignForm({...assignForm, expiryDate: e.target.value})}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">留空则永久有效</p>
                  </div>
                </div>
              </div>

              {/* 分配原因 */}
              <div className="border rounded-lg bg-white p-4">
                <div className="space-y-2">
                  <Label htmlFor="assign-reason">分配原因</Label>
                  <Textarea
                    id="assign-reason"
                    placeholder="请输入权限分配的原因，便于审计和追踪..."
                    value={assignForm.reason}
                    onChange={(e) => setAssignForm({...assignForm, reason: e.target.value})}
                    className="w-full resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">详细的分配原因有助于权限管理和安全审计</p>
                </div>
              </div>

              {/* 权限摘要 */}
              {(assignForm.selectedPermissions || []).length > 0 && (
                <div className="border rounded-lg bg-blue-50 border-blue-200 p-4">
                  <h4 className="font-medium text-blue-900 mb-3">权限分配摘要</h4>
                  <div className="space-y-2">
                    <div className="text-sm text-blue-800">
                      <span className="font-medium">将为用户分配 {(assignForm.selectedPermissions || []).length} 项权限：</span>
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                      {(assignForm.selectedPermissions || []).map((permissionId: string) => {
                        const permission = allPermissions.find(p => p.id === permissionId)
                        return permission ? (
                          <Badge key={permissionId} variant="outline" className="text-xs bg-white">
                            {permission.name}
                          </Badge>
                        ) : null
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* 底部填充空间 */}
              <div className="h-4" />
            </div>
          </ScrollArea>
        </div>
        
        <DialogFooter className="flex-shrink-0 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button 
            onClick={handleAssign}
            disabled={(assignForm.selectedPermissions || []).length === 0}
          >
            <Key className="w-4 h-4 mr-2" />
            分配权限 ({(assignForm.selectedPermissions || []).length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 用户详情对话框组件
function UserDetailDialog({ user, open, onOpenChange }: any) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-600" />
            用户详情 - {user?.name}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">基本信息</TabsTrigger>
            <TabsTrigger value="permissions">权限详情</TabsTrigger>
            <TabsTrigger value="activity">活动记录</TabsTrigger>
            <TabsTrigger value="stats">统计数据</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600">姓名</Label>
                  <p className="text-sm">{user?.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">邮箱</Label>
                  <p className="text-sm">{user?.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">角色</Label>
                  <Badge variant="outline">{user?.role}</Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-600">部门</Label>
                  <p className="text-sm">{user?.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">状态</Label>
                  <Badge className={user?.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {user?.status === 'active' ? '活跃' : '非活跃'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">创建时间</Label>
                  <p className="text-sm">{user?.createTime || '2024-01-15 10:30'}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="permissions" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">当前权限列表</h4>
              <div className="space-y-2">
                {user?.permissions?.map((permission: string) => (
                  <div key={permission} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-mono text-sm">{permission}</span>
                  </div>
                )) || <p className="text-gray-500">无自定义权限</p>}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">最近活动</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 border rounded">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm">登录系统</p>
                    <p className="text-xs text-gray-500">2024-01-20 09:15</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded">
                  <FileText className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm">创建工作流</p>
                    <p className="text-xs text-gray-500">2024-01-19 14:30</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">15</div>
                <div className="text-sm text-blue-600">创建工作流</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">32</div>
                <div className="text-sm text-green-600">登录次数</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// 审计日志对话框组件
function AuditLogDialog({ user, open, onOpenChange }: any) {
  const auditLogs = [
    { id: 1, action: '用户登录', details: '通过SSO登录系统', timestamp: '2024-01-20 09:15:23', ip: '192.168.1.100', level: 'info' },
    { id: 2, action: '权限修改', details: '新增data.read权限', timestamp: '2024-01-19 16:45:12', ip: '192.168.1.100', level: 'warning' },
    { id: 3, action: '创建工作流', details: '创建"电池热管理"工作流', timestamp: '2024-01-19 14:30:45', ip: '192.168.1.100', level: 'info' },
    { id: 4, action: '删除数据', details: '删除临时仿真结果', timestamp: '2024-01-18 11:20:15', ip: '192.168.1.100', level: 'warning' },
    { id: 5, action: '角色变更', details: '从modeling变更为simulation', timestamp: '2024-01-15 10:30:00', ip: '192.168.1.100', level: 'critical' }
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-600 bg-blue-50'
      case 'warning': return 'text-yellow-600 bg-yellow-50'
      case 'critical': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info': return <Activity className="w-4 h-4" />
      case 'warning': return <AlertTriangle className="w-4 h-4" />
      case 'critical': return <XCircle className="w-4 h-4" />
      default: return <CheckCircle className="w-4 h-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-gray-600" />
            审计日志 - {user?.name}
          </DialogTitle>
          <DialogDescription>
            查看用户的详细操作记录和系统审计日志
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* 过滤器 */}
          <div className="flex items-center gap-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部级别</SelectItem>
                <SelectItem value="info">信息</SelectItem>
                <SelectItem value="warning">警告</SelectItem>
                <SelectItem value="critical">严重</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="搜索操作..." className="flex-1" />
          </div>

          {/* 日志列表 */}
          <ScrollArea className="max-h-96">
            <div className="space-y-2">
              {auditLogs.map(log => (
                <div key={log.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded ${getLevelColor(log.level)}`}>
                        {getLevelIcon(log.level)}
                      </div>
                      <div>
                        <div className="font-medium">{log.action}</div>
                        <div className="text-sm text-gray-600 mt-1">{log.details}</div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {log.timestamp}
                          </span>
                          <span className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {log.ip}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getLevelColor(log.level)}>
                      {log.level}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
          <Button onClick={() => toast.success('审计日志已导出')}>
            <Download className="w-4 h-4 mr-2" />
            导出日志
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function UserManagement({
  userRole,
  onBack
}: {
  userRole?: string;
  onBack?: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showEditUserDialog, setShowEditUserDialog] = useState(false)
  const [showPermissionAssignDialog, setShowPermissionAssignDialog] = useState(false)
  const [showUserDetailDialog, setShowUserDetailDialog] = useState(false)
  const [showAuditLogDialog, setShowAuditLogDialog] = useState(false)
  const [showRoleComparisonDialog, setShowRoleComparisonDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)

  // 表单状态
  const [inviteForm, setInviteForm] = useState({
    email: '',
    name: '',
    role: '',
    department: '',
    permissions: []
  })
  
  const [editUserForm, setEditUserForm] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    department: '',
    status: '',
    phone: ''
  })
  
  const [permissionAssignForm, setPermissionAssignForm] = useState({
    selectedPermissions: [] as string[],
    effectiveDate: '',
    expiryDate: '',
    reason: ''
  })

  // 模拟用户数据
  const users = [
    {
      id: '1',
      name: '张工程师',
      email: 'zhang.engineer@company.com',
      role: 'simulation',
      department: '仿真部',
      status: 'active',
      lastLogin: '2024-01-20 09:15',
      permissions: ['simulation.run', 'data.read', 'data.delete'],
      createTime: '2024-01-15 10:30'
    },
    {
      id: '2', 
      name: '李项目经理',
      email: 'li.pm@company.com',
      role: 'projectManager',
      department: '项目部',
      status: 'active',
      lastLogin: '2024-01-19 16:45',
      permissions: ['project.manage', 'team.manage'],
      createTime: '2024-01-10 14:20'
    },
    {
      id: '3',
      name: '王建模师',
      email: 'wang.modeler@company.com', 
      role: 'modeling',
      department: '技术部',
      status: 'inactive',
      lastLogin: '2024-01-18 11:20',
      permissions: ['model.create', 'model.edit'],
      createTime: '2024-01-08 09:15'
    }
  ]

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: '平台管理员',
      projectManager: '项目经理', 
      architect: '系统架构师',
      simulation: '仿真工程师',
      modeling: '建模工程师'
    }
    return roleMap[role] || role
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !selectedRole || selectedRole === "all" || user.role === selectedRole
    const matchesStatus = !selectedStatus || selectedStatus === "all" || user.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* 页面标题和操作栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">用户管理</h1>
          <p className="text-gray-600 mt-1">管理系统用户、角色权限和访问控制</p>
        </div>
        <div className="flex items-center space-x-3">
          {['admin'].includes(userRole || '') && (
            <Button
              onClick={() => setShowInviteDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              邀请用户
            </Button>
          )}
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">总用户数</p>
                <p className="text-2xl font-semibold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">活跃用户</p>
                <p className="text-2xl font-semibold">{users.filter(u => u.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Shield className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">待审核</p>
                <p className="text-2xl font-semibold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">今日登录</p>
                <p className="text-2xl font-semibold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 筛选和搜索 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="搜索用户名或邮箱..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="筛选角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部角色</SelectItem>
                <SelectItem value="admin">平台管理员</SelectItem>
                <SelectItem value="projectManager">项目经理</SelectItem>
                <SelectItem value="architect">系统架构师</SelectItem>
                <SelectItem value="simulation">仿真工程师</SelectItem>
                <SelectItem value="modeling">建模工程师</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">活跃</SelectItem>
                <SelectItem value="inactive">非活跃</SelectItem>
                <SelectItem value="pending">待审核</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 批量操作栏 */}
      {selectedUsers.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-blue-800">
                  已选择 {selectedUsers.length} 个用户
                </span>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="outline">
                    <Mail className="w-4 h-4 mr-1" />
                    批量邮件
                  </Button>
                  <Button size="sm" variant="outline">
                    <Key className="w-4 h-4 mr-1" />
                    批量权限
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    导出数据
                  </Button>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setSelectedUsers([])}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 用户列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>用户列表</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                共 {filteredUsers.length} 个用户
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{user.name}</h3>
                        <Badge variant="outline">{getRoleDisplay(user.role)}</Badge>
                        <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {user.status === 'active' ? '活跃' : '非活跃'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>{user.department}</span>
                        <span>最后登录: {user.lastLogin}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-2">
                    {/* 批量选择复选框 */}
                    <Checkbox 
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedUsers([...selectedUsers, user.id])
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id))
                        }
                      }}
                      className="mr-2"
                      title="选择用户进行批量操作"
                    />
                    
                    {/* 角色权限对比按钮 */}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user)
                        setShowRoleComparisonDialog(true)
                      }}
                      title="角色权限对比"
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    >
                      <Shield className="w-4 h-4" />
                    </Button>

                    {/* 权限冲突检测指示器 */}
                    {(() => {
                      // 模拟权限冲突检测逻辑
                      const hasConflicts = user.permissions?.includes('data.delete') && user.role === 'simulation'
                      return hasConflicts && (
                        <div className="relative">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              toast.warning(`用户 ${user.name} 存在权限冲突，建议检查`)
                            }}
                            title="权限冲突警告"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <AlertCircle className="w-4 h-4" />
                          </Button>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        </div>
                      )
                    })()}
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user)
                        setEditUserForm({
                          id: user.id,
                          name: user.name,
                          email: user.email,
                          role: user.role,
                          department: user.department,
                          status: user.status,
                          phone: ''
                        })
                        setShowEditUserDialog(true)
                      }}
                      title="编辑用户"
                      disabled={!['admin', 'projectManager'].includes(userRole || '')}
                      className={!['admin', 'projectManager'].includes(userRole || '') ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user)
                        setPermissionAssignForm({
                          selectedPermissions: user.permissions || [],
                          effectiveDate: '',
                          expiryDate: '',
                          reason: ''
                        })
                        setShowPermissionAssignDialog(true)
                      }}
                      title="权限管理"
                      disabled={!['admin'].includes(userRole || '')}
                      className={!['admin'].includes(userRole || '') ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                      <Key className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user)
                            setShowUserDetailDialog(true)
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          查看详情
                        </DropdownMenuItem>
                        
                        {/* 角色权限相关操作 */}
                        {['admin', 'projectManager'].includes(userRole || '') && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user)
                                setPermissionAssignForm({
                                  selectedPermissions: user.permissions || [],
                                  effectiveDate: '',
                                  expiryDate: '',
                                  reason: ''
                                })
                                setShowPermissionAssignDialog(true)
                              }}
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              分配权限
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem
                              onClick={() => {
                                toast.info(`查看用户 ${user.name} 的角色继承关系`)
                              }}
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              角色继承关系
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem
                              onClick={() => {
                                toast.info(`快速应用权限模板到 ${user.name}`)
                              }}
                            >
                              <Zap className="w-4 h-4 mr-2" />
                              快速权限模板
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        {/* 团队协作功能 */}
                        {['admin', 'projectManager', 'architect'].includes(userRole || '') && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                toast.info(`查看 ${user.name} 的团队成员`)
                              }}
                            >
                              <Users className="w-4 h-4 mr-2" />
                              团队成员
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem
                              onClick={() => {
                                toast.info(`设置 ${user.name} 为项目负责人`)
                              }}
                            >
                              <UserCheck className="w-4 h-4 mr-2" />
                              设为项目负责人
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        {/* 权限影响分析 - 仅管理员可见 */}
                        {userRole === 'admin' && (
                          <DropdownMenuItem
                            onClick={() => {
                              toast.info(`分析用户 ${user.name} 的权限影响范围`)
                            }}
                          >
                            <Activity className="w-4 h-4 mr-2" />
                            权限影响分析
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUser(user)
                            setShowAuditLogDialog(true)
                          }}
                        >
                          <History className="w-4 h-4 mr-2" />
                          查看日志
                        </DropdownMenuItem>
                        
                        {/* ���信功能 */}
                        <DropdownMenuItem
                          onClick={() => {
                            toast.info(`向 ${user.email} 发送邮件`)
                          }}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          发送邮件
                        </DropdownMenuItem>
                        
                        {/* 工作流相关操作 */}
                        <DropdownMenuItem
                          onClick={() => {
                            toast.info(`查看 ${user.name} 创建的工作流`)
                          }}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          用户工作流
                        </DropdownMenuItem>
                        
                        {/* 安全操作 - 基于权限显示 */}
                        {['admin'].includes(userRole || '') && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                toast.success('已重置用户密码，新密码已发送至邮箱')
                              }}
                            >
                              <Key className="w-4 h-4 mr-2" />
                              重置密码
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem
                              onClick={() => {
                                toast.success('已强制用户重新登录')
                              }}
                            >
                              <Activity className="w-4 h-4 mr-2" />
                              强制重新登录
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                toast.success(`用户 ${user.name} 已被${user.status === 'active' ? '禁用' : '启用'}`)
                              }}
                            >
                              {user.status === 'active' ? (
                                <>
                                  <UserX className="w-4 h-4 mr-2" />
                                  禁用用户
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-4 h-4 mr-2" />
                                  启用用户
                                </>
                              )}
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        {/* 危险操作分隔线 */}
                        {['admin'].includes(userRole || '') && user.status === 'inactive' && (
                          <>
                            <div className="h-px bg-gray-200 my-1" />
                            <DropdownMenuItem 
                              className="text-red-600 bg-red-50 hover:bg-red-100"
                              onClick={() => {
                                if (window.confirm(`确定要永久删除用户 ${user.name} 吗？此操作不可撤销。`)) {
                                  toast.success(`用户 ${user.name} 已被永久删除`)
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              永久删除用户
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 对话框组件 */}
      <RolePermissionComparisonDialog
        user={selectedUser}
        open={showRoleComparisonDialog}
        onOpenChange={setShowRoleComparisonDialog}
      />

      <UserEditDialog
        user={selectedUser}
        open={showEditUserDialog}
        onOpenChange={setShowEditUserDialog}
        editForm={editUserForm}
        setEditForm={setEditUserForm}
      />

      <PermissionAssignDialog
        user={selectedUser}
        open={showPermissionAssignDialog}
        onOpenChange={setShowPermissionAssignDialog}
        assignForm={permissionAssignForm}
        setAssignForm={setPermissionAssignForm}
      />

      <UserDetailDialog
        user={selectedUser}
        open={showUserDetailDialog}
        onOpenChange={setShowUserDetailDialog}
      />

      <AuditLogDialog
        user={selectedUser}
        open={showAuditLogDialog}
        onOpenChange={setShowAuditLogDialog}
      />

      {/* 邀请用户对话框 */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              邀请新用户
            </DialogTitle>
            <DialogDescription>
              邀请新用户加入系统，系统将发送邀请邮件
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">邮箱地址</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="user@company.com"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="invite-name">姓名</Label>
              <Input
                id="invite-name"
                placeholder="请输入用户姓名"
                value={inviteForm.name}
                onChange={(e) => setInviteForm({...inviteForm, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invite-role">角色</Label>
                <Select value={inviteForm.role} onValueChange={(value) => setInviteForm({...inviteForm, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modeling">建模工程师</SelectItem>
                    <SelectItem value="simulation">仿真工程师</SelectItem>
                    <SelectItem value="architect">系统架构师</SelectItem>
                    <SelectItem value="projectManager">项目经理</SelectItem>
                    {userRole === 'admin' && (
                      <SelectItem value="admin">平台管理员</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="invite-department">部门</Label>
                <Select value={inviteForm.department} onValueChange={(value) => setInviteForm({...inviteForm, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择部门" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="技术部">技术部</SelectItem>
                    <SelectItem value="项目部">项目部</SelectItem>
                    <SelectItem value="仿真部">仿真部</SelectItem>
                    <SelectItem value="架构部">架构部</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              取消
            </Button>
            <Button 
              onClick={() => {
                toast.success(`已向 ${inviteForm.email} 发送邀请邮件`)
                setShowInviteDialog(false)
                setInviteForm({ email: '', name: '', role: '', department: '', permissions: [] })
              }}
              disabled={!inviteForm.email || !inviteForm.name || !inviteForm.role}
            >
              <Mail className="w-4 h-4 mr-2" />
              发送邀请
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}