import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
import { NodeConfig } from "./types";
import { getValidationLevelColor } from "./utils";

interface ValidationRulesTabProps {
  config: NodeConfig;
  setConfig: (updater: (prev: NodeConfig) => NodeConfig) => void;
}

export function ValidationRulesTab({ config, setConfig }: ValidationRulesTabProps) {
  return (
    <div className="m-0 p-4 space-y-4">
      <div>
        <Label className="mb-3 block">转换验证规则</Label>
        <div className="space-y-3">
          {config.validationRules.map((rule) => (
            <div key={rule.id} className="p-3 bg-gray-50 rounded border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge className={getValidationLevelColor(rule.level)} variant="secondary">
                      {rule.level === "error" ? "错误" : rule.level === "warning" ? "警告" : "信息"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{rule.rule}</p>
                </div>
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={(checked) => {
                    setConfig(prev => ({
                      ...prev,
                      validationRules: prev.validationRules.map(r =>
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

      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">验证说明</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 错误级别验证失败将阻止转换继续</li>
          <li>• 警告级别验证失败将生成警告但不影响转换</li>
          <li>• 信息级别验证仅用于提供额外的转换信息</li>
        </ul>
      </div>
    </div>
  );
}