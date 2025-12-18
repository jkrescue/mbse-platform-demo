import { Star, Eye, Download, MoreHorizontal, Edit, Trash2, Copy, Upload, Heart } from "lucide-react@0.487.0"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

interface AppCardProps {
  app: {
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
    status?: string
  }
  onClick?: () => void
  onAction?: (action: string, app: any) => void
  category?: 'personal' | 'public' | 'favorite'
}

export function AppCard({ app, onClick, onAction, category = 'public' }: AppCardProps) {
  const handleActionClick = (action: string, event: React.MouseEvent) => {
    event.stopPropagation(); // 防止触发卡片点击事件
    if (onAction) {
      onAction(action, app);
    }
  };

  const getActionsForCategory = () => {
    switch (category) {
      case 'personal':
        return [
          { action: 'edit', label: '编辑', icon: Edit },
          { action: 'publish', label: '发布', icon: Upload },
          { action: 'delete', label: '删除', icon: Trash2 },
        ];
      case 'favorite':
        return [
          { action: 'copy', label: '复制', icon: Copy },
          { action: 'delete', label: '取消收藏', icon: Trash2 },
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer group" onClick={onClick}>
      {/* App Icon and Info */}
      <div className="flex items-start space-x-4 mb-4">
        <div className={`w-12 h-12 rounded-xl ${app.color} flex items-center justify-center text-white text-lg flex-shrink-0`}>
          {app.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1 truncate">{app.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Avatar className="w-5 h-5">
                  <AvatarFallback className="text-xs bg-gray-200">
                    {app.author.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{app.author}</span>
              </div>
            </div>
            {/* Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {actions.map(({ action, label, icon: Icon }) => (
                  <DropdownMenuItem
                    key={action}
                    onClick={(e) => handleActionClick(action, e)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      {app.status && (
        <div className="mb-3">
          <Badge 
            variant={app.status === '已发布' ? 'default' : 'secondary'}
            className="text-xs"
          >
            {app.status}
          </Badge>
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{app.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {app.tags.map((tag, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span>{app.likes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Eye className="w-4 h-4" />
            <span>{app.views}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Download className="w-4 h-4" />
            <span>{app.downloads}</span>
          </div>
        </div>
      </div>
    </div>
  )
}