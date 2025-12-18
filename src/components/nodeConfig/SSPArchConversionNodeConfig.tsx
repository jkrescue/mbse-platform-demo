import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface SSPArchConversionNodeConfigProps {
  node: any;
  onSave: (config: any) => void;
  onCancel?: () => void;
  userRole?: string;
}

export function SSPArchConversionNodeConfig({ node, onSave, onCancel, userRole }: SSPArchConversionNodeConfigProps) {
  const [config, setConfig] = useState({
    nodeName: node?.name || 'SSP架构转换',
    description: node?.description || '架构转换为可信的管理',
    timeout: node?.config?.timeout || 450,
    retryCount: node?.config?.retryCount || 3,
    autoRun: node?.config?.autoRun || false,
    // SSP架构转换特有配置
    sourceFormat: node?.config?.parameters?.sourceFormat || 'ea-model',
    targetFormat: node?.config?.parameters?.targetFormat || 'ssp-standard',
    sspVersion: node?.config?.parameters?.sspVersion || '1.0',
    compressionLevel: node?.config?.parameters?.compressionLevel || 'standard',
    validationMode: node?.config?.parameters?.validationMode || 'strict',
    conversionOptions: node?.config?.parameters?.conversionOptions || {
      preserveHierarchy: true,
      includeGeometry: false,
      behaviorMapping: true,
      portMapping: true,
      parameterMapping: true
    },
    sspComponents: node?.config?.parameters?.sspComponents || [
      'system-structure',
      'component-interfaces',
      'parameter-sets',
      'connection-definitions'
    ],
    outputSettings: node?.config?.parameters?.outputSettings || {
      generateDocumentation: true,
      includeValidationReport: true,
      exportFormat: 'standard-ssp',
      compressionEnabled: true
    },
    qualityChecks: node?.config?.parameters?.qualityChecks || {
      semanticValidation: true,
      syntaxValidation: true,
      interfaceCompatibility: true,
      parameterConsistency: true
    },
    conversionRules: node?.config?.parameters?.conversionRules || 'default-mapping',
  });

  const handleSave = () => {
    const saveConfig = {
      ...config,
      parameters: {
        sourceFormat: config.sourceFormat,
        targetFormat: config.targetFormat,
        sspVersion: config.sspVersion,
        compressionLevel: config.compressionLevel,
        validationMode: config.validationMode,
        conversionOptions: config.conversionOptions,
        sspComponents: config.sspComponents,
        outputSettings: config.outputSettings,
        qualityChecks: config.qualityChecks,
        conversionRules: config.conversionRules,
      }
    };
    onSave(saveConfig);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">SSP架构转换配置</h3>
        <p className="text-sm text-muted-foreground mt-1">
          配置架构模型到SSP标准格式的转换参数和选项
        </p>
      </div>

      <Separator />

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">基础设置</TabsTrigger>
          <TabsTrigger value="conversion">转换配置</TabsTrigger>
          <TabsTrigger value="quality">质量检查</TabsTrigger>
          <TabsTrigger value="output">输出设置</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div>
            <Label htmlFor="nodeName">节点名称</Label>
            <Input
              id="nodeName"
              value={config.nodeName}
              onChange={(e) => setConfig({ ...config, nodeName: e.target.value })}
              placeholder="请输入节点名称"
            />
          </div>

          <div>
            <Label htmlFor="description">节点描述</Label>
            <Textarea
              id="description"
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              placeholder="请输入节点描述"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="sourceFormat">源格式</Label>
            <Select value={config.sourceFormat} onValueChange={(value) => setConfig({ ...config, sourceFormat: value })}>
              <SelectTrigger>
                <SelectValue placeholder="选择源格式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ea-model">EA模型</SelectItem>
                <SelectItem value="sysml-model">SysML模型</SelectItem>
                <SelectItem value="capella-model">Capella模型</SelectItem>
                <SelectItem value="simulink-model">Simulink模型</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="targetFormat">目标格式</Label>
            <Select value={config.targetFormat} onValueChange={(value) => setConfig({ ...config, targetFormat: value })}>
              <SelectTrigger>
                <SelectValue placeholder="选择目标格式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ssp-standard">标准SSP</SelectItem>
                <SelectItem value="ssp-extended">扩展SSP</SelectItem>
                <SelectItem value="ssp-automotive">汽车SSP</SelectItem>
                <SelectItem value="ssp-custom">自定义SSP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sspVersion">SSP版本</Label>
            <Select value={config.sspVersion} onValueChange={(value) => setConfig({ ...config, sspVersion: value })}>
              <SelectTrigger>
                <SelectValue placeholder="选择SSP版本" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.0">SSP 1.0</SelectItem>
                <SelectItem value="1.1">SSP 1.1</SelectItem>
                <SelectItem value="2.0">SSP 2.0 (预览)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="conversionRules">转换规则</Label>
            <Select value={config.conversionRules} onValueChange={(value) => setConfig({ ...config, conversionRules: value })}>
              <SelectTrigger>
                <SelectValue placeholder="选择转换规则" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default-mapping">默认映射</SelectItem>
                <SelectItem value="automotive-standard">汽车标准</SelectItem>
                <SelectItem value="aerospace-standard">航空标准</SelectItem>
                <SelectItem value="custom-rules">自定义规则</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="conversion" className="space-y-4">
          <div>
            <Label htmlFor="validationMode">验证模式</Label>
            <Select value={config.validationMode} onValueChange={(value) => setConfig({ ...config, validationMode: value })}>
              <SelectTrigger>
                <SelectValue placeholder="选择验证模式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lenient">宽松验证</SelectItem>
                <SelectItem value="standard">标准验证</SelectItem>
                <SelectItem value="strict">严格验证</SelectItem>
                <SelectItem value="custom">自定义验证</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>转换选项</Label>
            <div className="space-y-2 mt-2">
              {[
                { key: 'preserveHierarchy', label: '保持层次结构' },
                { key: 'includeGeometry', label: '包含几何信息' },
                { key: 'behaviorMapping', label: '行为建模映射' },
                { key: 'portMapping', label: '端口映射优化' },
                { key: 'parameterMapping', label: '参数映射' }
              ].map((option) => (
                <div key={option.key} className="flex items-center space-x-2">
                  <Switch
                    id={option.key}
                    checked={config.conversionOptions[option.key as keyof typeof config.conversionOptions]}
                    onCheckedChange={(checked) => setConfig({
                      ...config,
                      conversionOptions: {
                        ...config.conversionOptions,
                        [option.key]: checked
                      }
                    })}
                  />
                  <Label htmlFor={option.key}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>SSP组件</Label>
            <div className="space-y-2 mt-2">
              {[
                { key: 'system-structure', label: '系统结构' },
                { key: 'component-interfaces', label: '组件接口' },
                { key: 'parameter-sets', label: '参数集' },
                { key: 'connection-definitions', label: '连接定义' },
                { key: 'annotation-metadata', label: '注释元数据' },
                { key: 'validation-rules', label: '验证规则' }
              ].map((component) => (
                <div key={component.key} className="flex items-center space-x-2">
                  <Switch
                    id={component.key}
                    checked={config.sspComponents.includes(component.key)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setConfig({
                          ...config,
                          sspComponents: [...config.sspComponents, component.key]
                        });
                      } else {
                        setConfig({
                          ...config,
                          sspComponents: config.sspComponents.filter(c => c !== component.key)
                        });
                      }
                    }}
                  />
                  <Label htmlFor={component.key}>{component.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div>
            <Label>质量检查项</Label>
            <div className="space-y-2 mt-2">
              {[
                { key: 'semanticValidation', label: '语义验证' },
                { key: 'syntaxValidation', label: '语法验证' },
                { key: 'interfaceCompatibility', label: '接口兼容性' },
                { key: 'parameterConsistency', label: '参数一致性' }
              ].map((check) => (
                <div key={check.key} className="flex items-center space-x-2">
                  <Switch
                    id={check.key}
                    checked={config.qualityChecks[check.key as keyof typeof config.qualityChecks]}
                    onCheckedChange={(checked) => setConfig({
                      ...config,
                      qualityChecks: {
                        ...config.qualityChecks,
                        [check.key]: checked
                      }
                    })}
                  />
                  <Label htmlFor={check.key}>{check.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">质量检查说明</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 语义验证：检查模型元素的语义正确性</li>
              <li>• 语法验证：验证SSP格式语法符合标准</li>
              <li>• 接口兼容性：确保组件接口匹配</li>
              <li>• 参数一致性：验证参数类型和约束</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="output" className="space-y-4">
          <div>
            <Label htmlFor="exportFormat">导出格式</Label>
            <Select value={config.outputSettings.exportFormat} onValueChange={(value) => setConfig({
              ...config,
              outputSettings: { ...config.outputSettings, exportFormat: value }
            })}>
              <SelectTrigger>
                <SelectValue placeholder="选择导出格式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard-ssp">标准SSP包</SelectItem>
                <SelectItem value="compressed-ssp">压缩SSP包</SelectItem>
                <SelectItem value="xml-only">仅XML文件</SelectItem>
                <SelectItem value="multi-format">多格式输出</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="compressionLevel">压缩级别</Label>
            <Select value={config.compressionLevel} onValueChange={(value) => setConfig({ ...config, compressionLevel: value })}>
              <SelectTrigger>
                <SelectValue placeholder="选择压缩级别" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">无压缩</SelectItem>
                <SelectItem value="standard">标准压缩</SelectItem>
                <SelectItem value="high">高压缩</SelectItem>
                <SelectItem value="maximum">最大压缩</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>输出选项</Label>
            <div className="space-y-2 mt-2">
              {[
                { key: 'generateDocumentation', label: '生成文档' },
                { key: 'includeValidationReport', label: '包含验证报告' },
                { key: 'compressionEnabled', label: '启用压缩' }
              ].map((option) => (
                <div key={option.key} className="flex items-center space-x-2">
                  <Switch
                    id={option.key}
                    checked={config.outputSettings[option.key as keyof typeof config.outputSettings]}
                    onCheckedChange={(checked) => setConfig({
                      ...config,
                      outputSettings: {
                        ...config.outputSettings,
                        [option.key]: checked
                      }
                    })}
                  />
                  <Label htmlFor={option.key}>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="autoRun"
              checked={config.autoRun}
              onCheckedChange={(checked) => setConfig({ ...config, autoRun: checked })}
            />
            <Label htmlFor="autoRun">自动运行</Label>
          </div>

          <div>
            <Label htmlFor="timeout">超时时间（秒）</Label>
            <Input
              id="timeout"
              type="number"
              value={config.timeout}
              onChange={(e) => setConfig({ ...config, timeout: parseInt(e.target.value) || 450 })}
              min="1"
            />
          </div>

          <div>
            <Label htmlFor="retryCount">重试次数</Label>
            <Input
              id="retryCount"
              type="number"
              value={config.retryCount}
              onChange={(e) => setConfig({ ...config, retryCount: parseInt(e.target.value) || 3 })}
              min="0"
              max="10"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center space-x-3 pt-4">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={handleSave}>
          保存配置
        </Button>
      </div>
    </div>
  );
}