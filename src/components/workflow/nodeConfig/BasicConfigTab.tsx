import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { NodeConfig } from "./types";

interface BasicConfigTabProps {
  config: NodeConfig;
  setConfig: (updater: (prev: NodeConfig) => NodeConfig) => void;
}

export function BasicConfigTab({ config, setConfig }: BasicConfigTabProps) {
  return (
    <div className="m-0 p-4 space-y-4">
      {/* 节点名称 */}
      <div>
        <Label>节点名称</Label>
        <Input
          value={config.nodeName}
          onChange={(e) => setConfig(prev => ({ ...prev, nodeName: e.target.value }))}
          placeholder="请输入节点名称"
          className="mt-1"
        />
      </div>

      {/* 节点ID */}
      <div>
        <Label>节点ID</Label>
        <Input
          value={config.nodeId}
          readOnly
          className="mt-1 bg-gray-50"
        />
      </div>

      {/* 描述 */}
      <div>
        <Label>描述</Label>
        <Textarea
          value={config.description}
          onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
          placeholder="请输入节点描述"
          rows={3}
          className="mt-1"
        />
      </div>

      {/* 优先级 */}
      <div>
        <Label>优先级</Label>
        <Select value={config.priority} onValueChange={(value) => setConfig(prev => ({ ...prev, priority: value }))}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="高">高</SelectItem>
            <SelectItem value="中">中</SelectItem>
            <SelectItem value="低">低</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 创建人 */}
      <div>
        <Label>创建人</Label>
        <Input
          value={config.creator}
          readOnly
          className="mt-1 bg-gray-50"
        />
      </div>

      {/* 创建时间 */}
      <div>
        <Label>创建时间</Label>
        <Input
          value={config.createTime}
          readOnly
          className="mt-1 bg-gray-50"
        />
      </div>
    </div>
  );
}