/**
 * MetricsHub - Metrics & Trade-off 中心入口
 * 整合指标管理、竞品对标、权衡研究和设计空间探索功能
 */

import React, { useState } from 'react';
import { Target, BarChart3, GitCompare, Sparkles, Settings } from 'lucide-react@0.487.0';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent } from '../ui/card';
import { MetricsManagement } from './MetricsManagement';
import { BenchmarkComparison } from './BenchmarkComparison';
import { TradeStudyAnalysis } from './TradeStudyAnalysis';
import { DSEExplorer } from './DSEExplorer';

export const MetricsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('metrics');

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="bg-white border-b px-6">
          <TabsList className="h-12">
            <TabsTrigger value="metrics" className="gap-2">
              <Target className="h-4 w-4" />
              指标管理
            </TabsTrigger>
            <TabsTrigger value="benchmark" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              竞品对标
            </TabsTrigger>
            <TabsTrigger value="trade" className="gap-2">
              <GitCompare className="h-4 w-4" />
              权衡研究
            </TabsTrigger>
            <TabsTrigger value="dse" className="gap-2">
              <Sparkles className="h-4 w-4" />
              设计空间探索
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="metrics" className="h-full m-0">
            <MetricsManagement />
          </TabsContent>

          <TabsContent value="benchmark" className="h-full m-0">
            <BenchmarkComparison />
          </TabsContent>

          <TabsContent value="trade" className="h-full m-0">
            <TradeStudyAnalysis />
          </TabsContent>

          <TabsContent value="dse" className="h-full m-0">
            <DSEExplorer />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default MetricsHub;
