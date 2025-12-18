import { Label } from "../../ui/label";
import { Badge } from "../../ui/badge";
import { CheckCircle, PlayCircle, AlertTriangle } from "lucide-react@0.487.0";
import { NodeConfig } from "./types";
import { getStatusColor } from "./utils";

interface ConversionHistoryTabProps {
  config: NodeConfig;
}

export function ConversionHistoryTab({ config }: ConversionHistoryTabProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="w-4 h-4" />;
      case "in-progress": return <PlayCircle className="w-4 h-4" />;
      case "failed": return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="m-0 p-4 space-y-4">
      <div>
        <Label className="mb-3 block">转换执行历史</Label>
        <div className="space-y-3">
          {config.conversionHistory.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <div className="text-gray-400 mb-2">📋</div>
              <div className="text-sm">暂无转换历史记录</div>
            </div>
          ) : (
            config.conversionHistory.map((record) => (
              <div key={record.id} className="p-4 bg-white rounded border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(record.status)}
                    <span className="font-medium text-gray-900">
                      {record.sourceModel} → {record.targetPath.split('/').pop()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(record.status)} variant="secondary">
                      {record.status === "success" ? "成功" : 
                       record.status === "failed" ? "失败" : "进行中"}
                    </Badge>
                    <span className="text-xs text-gray-500">{record.duration}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{record.details}</p>
                <p className="text-xs text-gray-400">{record.timestamp}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}