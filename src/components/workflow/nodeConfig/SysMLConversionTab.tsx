import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Switch } from "../../ui/switch";
import { Separator } from "../../ui/separator";
import { Progress } from "../../ui/progress";
import { FileText, Zap } from "lucide-react@0.487.0";
import { NodeConfig } from "./types";

interface SysMLConversionTabProps {
  config: NodeConfig;
  setConfig: (updater: (prev: NodeConfig) => NodeConfig) => void;
}

export function SysMLConversionTab({ config, setConfig }: SysMLConversionTabProps) {
  return (
    <div className="m-0 p-4 space-y-4">
      {/* 源SysML模型路径 */}
      <div>
        <Label className="flex items-center space-x-2">
          <FileText className="w-4 h-4" />
          <span>源SysML模型路径</span>
        </Label>
        <Input
          value={config.sourceModelPath}
          onChange={(e) => setConfig(prev => ({ ...prev, sourceModelPath: e.target.value }))}
          placeholder="/models/sysml/your_model.sysml"
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          请指定要转换的SysML模型文件完整路径
        </p>
      </div>

      {/* 目标SSP路径 */}
      <div>
        <Label className="flex items-center space-x-2">
          <Zap className="w-4 h-4" />
          <span>目标SSP输出路径</span>
        </Label>
        <Input
          value={config.targetSSPPath}
          onChange={(e) => setConfig(prev => ({ ...prev, targetSSPPath: e.target.value }))}
          placeholder="/output/ssp/converted_model.ssp"
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">
          转换后的SSP文件将保存到此路径
        </p>
      </div>

      <Separator />

      {/* 转换规则配置 */}
      <div>
        <Label className="mb-3 block">转换规则配置</Label>
        <div className="space-y-3">
          {config.conversionRules.map((rule) => (
            <div key={rule.id} className="p-3 bg-gray-50 rounded border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium text-blue-600">{rule.from}</span>
                    <span className="text-xs text-gray-400">→</span>
                    <span className="text-sm font-medium text-green-600">{rule.to}</span>
                  </div>
                  <p className="text-xs text-gray-600">{rule.rule}</p>
                </div>
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={(checked) => {
                    setConfig(prev => ({
                      ...prev,
                      conversionRules: prev.conversionRules.map(r =>
                        r.id === rule.id ? { ...r, enabled: checked } : r
                      )
                    }));
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* 优化设置 */}
      <div>
        <Label className="mb-3 block">转换优化设置</Label>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">启用端口映射</Label>
              <p className="text-xs text-gray-500">自动映射SysML端口到SSP连接器</p>
            </div>
            <Switch
              checked={config.optimizationSettings.enablePortMapping}
              onCheckedChange={(checked) => 
                setConfig(prev => ({
                  ...prev,
                  optimizationSettings: { ...prev.optimizationSettings, enablePortMapping: checked }
                }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">参数继承</Label>
              <p className="text-xs text-gray-500">保持参数层次结构和继承关系</p>
            </div>
            <Switch
              checked={config.optimizationSettings.enableParameterInheritance}
              onCheckedChange={(checked) => 
                setConfig(prev => ({
                  ...prev,
                  optimizationSettings: { ...prev.optimizationSettings, enableParameterInheritance: checked }
                }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">几何信息传递</Label>
              <p className="text-xs text-gray-500">传递3D几何和空间信息</p>
            </div>
            <Switch
              checked={config.optimizationSettings.enableGeometryTransfer}
              onCheckedChange={(checked) => 
                setConfig(prev => ({
                  ...prev,
                  optimizationSettings: { ...prev.optimizationSettings, enableGeometryTransfer: checked }
                }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm">行为映射</Label>
              <p className="text-xs text-gray-500">转换状态机和活动图</p>
            </div>
            <Switch
              checked={config.optimizationSettings.enableBehaviorMapping}
              onCheckedChange={(checked) => 
                setConfig(prev => ({
                  ...prev,
                  optimizationSettings: { ...prev.optimizationSettings, enableBehaviorMapping: checked }
                }))
              }
            />
          </div>

          {/* 压缩级别 */}
          <div>
            <Label>SSP压缩级别</Label>
            <Select 
              value={config.optimizationSettings.compressionLevel} 
              onValueChange={(value) => 
                setConfig(prev => ({
                  ...prev,
                  optimizationSettings: { ...prev.optimizationSettings, compressionLevel: value }
                }))
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">无压缩</SelectItem>
                <SelectItem value="standard">标准压缩</SelectItem>
                <SelectItem value="high">高压缩</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 转换进度 */}
      {config.transformationProgress > 0 && (
        <div>
          <Label className="mb-2 block">当前转换进度</Label>
          <Progress value={config.transformationProgress} className="w-full" />
          <p className="text-xs text-gray-500 mt-1">
            {config.transformationProgress}% 完成
          </p>
        </div>
      )}
    </div>
  );
}