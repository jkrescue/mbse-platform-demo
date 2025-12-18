import { Star, Eye, Download, MoreHorizontal, Edit, Trash2, Copy, Upload, Heart } from "lucide-react@0.487.0"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

interface App {
  id: number
  title: string
  author: string
  description: string
  tags: string[]
  likes: number
  views: number
  downloads: number
  icon: string
  color: string
  createTime?: string
  updateTime?: string
  category?: string
  status?: string
}

interface AppListViewProps {
  apps: App[]
  onAppClick?: (app: App) => void
  onAppAction?: (action: string, app: any) => void
  category?: 'personal' | 'public' | 'favorite'
}

export function AppListView({ apps, onAppClick, onAppAction, category = 'public' }: AppListViewProps) {
  const handleActionClick = (action: string, app: App, event: React.MouseEvent) => {
    event.stopPropagation(); // 防止触发行点击事件
    if (onAppAction) {
      onAppAction(action, app);
    }
  };

  const getActionsForCategory = () => {
    switch (category) {
      case 'personal':
        return [
          { action: 'edit', label: '编辑', icon: Edit },
          { action: 'publish', label: '发布', icon: Upload },
          { action: 'delete', label: '删除', icon: Trash2, className: 'text-red-600' },
        ];
      case 'favorite':
        return [
          { action: 'copy', label: '复制', icon: Copy },
          { action: 'delete', label: '取消收藏', icon: Trash2, className: 'text-red-600' },
        ];
      case 'public':
      default:
        return [
          { action: 'copy', label: '复制', icon: Copy },
          { action: 'favorite', label: '收藏', icon: Heart },
        ];
    }
  };

  const actions = getActionsForCategory();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
      "已发布": { variant: "default", className: "bg-green-100 text-green-700 hover:bg-green-100" },
      "草稿": { variant: "outline", className: "bg-gray-100 text-gray-700 hover:bg-gray-100" },
      "审核中": { variant: "default", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" }
    }
    
    const config = variants[status] || variants["草稿"]
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">应用名称</th>
            <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">作者</th>
            <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">分类</th>
            <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">状态</th>
            <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">创建时间</th>
            <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">数据统计</th>
            <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-500">操作</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {apps.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onAppClick?.(app)}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg ${app.color} flex items-center justify-center text-white flex-shrink-0`}>
                    {app.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{app.title}</div>
                    <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">{app.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs bg-gray-200">
                      {app.author.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-gray-900">{app.author}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600">{app.tags?.[0] || "系统工具"}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(app.status || "已发布")}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600">{app.createTime || "2025-07-20 09:12"}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>{app.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3 text-gray-400" />
                      <span>{app.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-3 h-3 text-gray-400" />
                      <span>{app.downloads}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {actions.map(({ action, label, icon: Icon, className }) => (
                      <DropdownMenuItem
                        key={action}
                        className={className}
                        onClick={(e) => handleActionClick(action, app, e)}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}