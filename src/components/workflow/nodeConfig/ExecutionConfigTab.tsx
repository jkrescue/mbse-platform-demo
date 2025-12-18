import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import { NodeConfig } from "./types";

interface ExecutionConfigTabProps {
  config: NodeConfig;
  setConfig: (updater: (prev: NodeConfig) => NodeConfig) => void;
  node: any;
}

export function ExecutionConfigTab({ config, setConfig, node }: ExecutionConfigTabProps) {
  return (
    <div className="m-0 p-4 space-y-4">
      {/* 自动执行开关 */}
      <div className="flex items-center justify-between">
        <Label>自动执行</Label>
        <Switch
          checked={config.autoExecute}
          onCheckedChange={(checked) => setConfig(prev => ({ ...prev, autoExecute: checked }))}
        />
      </div>

      {/* 执行超时时间 */}
      <div>
        <Label>执行超时时间 (秒)</Label>
        <Input
          type="number"
          value={config.timeout}
          onChange={(e) => setConfig(prev => ({ ...prev, timeout: parseInt(e.target.value) || 60 }))}
          placeholder="60"
          className="mt-1"
        />
      </div>

      {/* 重试次数 */}
      <div>
        <Label>重试次数</Label>
        <Input
          type="number"
          value={config.retryCount}
          onChange={(e) => setConfig(prev => ({ ...prev, retryCount: parseInt(e.target.value) || 3 }))}
          placeholder="3"
          className="mt-1"
        />
      </div>

      <Separator />

      {/* 节点状态信息 */}
      <div>
        <Label className="mb-3 block">节点状态</Label>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">当前状态:</span>
            <Badge variant="secondary" className={
              node.status === "completed" ? "bg-green-100 text-green-800" :
              node.status === "running" ? "bg-yellow-100 text-yellow-800" :
              "bg-gray-100 text-gray-800"
            }>
              {node.status === "completed" ? "已完成" :
               node.status === "running" ? "运行中" : "等待中"}
            </Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">节点类型:</span>
            <span className="text-gray-900">{node.type || "通用节点"}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">标签:</span>
            <Badge variant="secondary" className={node.tagColor}>
              {node.tag}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}