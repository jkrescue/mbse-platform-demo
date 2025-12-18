import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { 
  BarChart3, 
  Activity, 
  Zap, 
  Heart, 
  Trophy, 
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Download,
  Eye,
  Star
} from "lucide-react@0.487.0";
import { AppStatistics } from "../../types/appDependencies";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter
} from "recharts";

interface AppStatisticsProps {
  isVisible: boolean;
  userRole: string;
}

export function AppStatistics({
  isVisible,
  userRole,
}: AppStatisticsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("7d");
  const [statisticsData, setStatisticsData] = useState<
    AppStatistics[]
  >([]);
  const [loading, setLoading] = useState(false);

  // 模拟数据
  useEffect(() => {
    if (isVisible) {
      setLoading(true);
      // 模拟数据加载
      setTimeout(() => {
        setStatisticsData(mockStatisticsData);
        setLoading(false);
      }, 500);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="space-y-6">
      {/* 统计概览卡片 */}
      <StatisticsSummaryCards
        data={statisticsData}
        timeRange={timeRange}
      />

      {/* 时间范围选择器 */}
      <div className="flex items-center justify-between">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">最近1天</SelectItem>
            <SelectItem value="7d">最近7天</SelectItem>
            <SelectItem value="30d">最近30天</SelectItem>
            <SelectItem value="90d">最近90天</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 主要内容Tab */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="performance">
            性能分析
          </TabsTrigger>
          <TabsTrigger value="usage">使用情况</TabsTrigger>
          <TabsTrigger value="ranking">排行榜</TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="space-y-6 mt-6"
        >
          <StatisticsOverview
            data={statisticsData}
            timeRange={timeRange}
          />
        </TabsContent>

        <TabsContent
          value="performance"
          className="space-y-6 mt-6"
        >
          <PerformanceAnalysis
            data={statisticsData}
            timeRange={timeRange}
          />
        </TabsContent>

        <TabsContent value="usage" className="space-y-6 mt-6">
          <UsageAnalysis
            data={statisticsData}
            timeRange={timeRange}
          />
        </TabsContent>

        <TabsContent value="ranking" className="space-y-6 mt-6">
          <AppRanking data={statisticsData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// 统计摘要卡片
function StatisticsSummaryCards({
  data,
  timeRange,
}: {
  data: AppStatistics[];
  timeRange: string;
}) {
  const summaryStats = calculateSummaryStats(data);

  const cards = [
    {
      title: "总运行次数",
      value: summaryStats.totalRuns.toLocaleString(),
      change: "+12.5%",
      trend: "up",
      icon: Activity,
      color: "blue",
    },
    {
      title: "平均成功率",
      value: `${summaryStats.avgSuccessRate.toFixed(1)}%`,
      change: "+2.3%",
      trend: "up",
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "活跃应用数",
      value: summaryStats.activeApps.toString(),
      change: "+5",
      trend: "up",
      icon: BarChart3,
      color: "purple",
    },
    {
      title: "总活跃用户",
      value: summaryStats.totalActiveUsers.toLocaleString(),
      change: "+8.7%",
      trend: "up",
      icon: Users,
      color: "orange",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {card.value}
                </p>
                <div className="flex items-center mt-2">
                  {card.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm ${card.trend === "up" ? "text-green-600" : "text-red-600"}`}
                  >
                    {card.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    vs 上期
                  </span>
                </div>
              </div>
              <div
                className={`p-3 rounded-lg bg-${card.color}-50`}
              >
                <card.icon
                  className={`w-6 h-6 text-${card.color}-500`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// 统计总览组件
function StatisticsOverview({
  data,
  timeRange,
}: {
  data: AppStatistics[];
  timeRange: string;
}) {
  // 计算资源消耗汇总
  const resourceSummary = {
    totalCpuHours: data.reduce(
      (sum, app) => sum + app.resourceConsumption.cpuUsageTotal,
      0,
    ),
    peakMemoryGB:
      Math.max(
        ...data.map(
          (app) => app.resourceConsumption.memoryPeakUsage,
        ),
      ) / 1024,
    totalLicenseCost: data.reduce(
      (sum, app) =>
        sum +
        app.resourceConsumption.licenseConsumption.costEstimate,
      0,
    ),
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 运行趋势图表 */}
      <Card>
        <CardHeader>
          <CardTitle>运行趋势</CardTitle>
          <CardDescription>
            应用运行次数和成功率趋势
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={generateTrendData(timeRange)}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="runs"
                  stroke="#3b82f6"
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="rate"
                  orientation="right"
                  stroke="#10b981"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="runs"
                  dataKey="runs"
                  fill="#3b82f6"
                  name="运行次数"
                  radius={[2, 2, 0, 0]}
                />
                <Line
                  yAxisId="rate"
                  type="monotone"
                  dataKey="successRate"
                  stroke="#10b981"
                  strokeWidth={3}
                  name="成功率(%)"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 成功率分布 */}
      <Card>
        <CardHeader>
          <CardTitle>成功率分布</CardTitle>
          <CardDescription>
            各应用成功率分布情况
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={generateSuccessRateDistribution(data)}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {generateSuccessRateDistribution(data).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: string) => [value, '应用数']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 资源消耗概览 */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>资源消耗概览</CardTitle>
          <CardDescription>
            各应用在不同时间段的资源使用情况
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {resourceSummary.totalCpuHours.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">
                CPU小时
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {resourceSummary.peakMemoryGB.toFixed(1)}GB
              </div>
              <div className="text-sm text-gray-600">
                内存峰值
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                ¥
                {resourceSummary.totalLicenseCost.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                License成本
              </div>
            </div>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart
                data={generateResourceConsumptionData(data)}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  type="number" 
                  dataKey="cpu" 
                  name="CPU使用(小时)"
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  type="number" 
                  dataKey="memory" 
                  name="内存峰值(MB)"
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-lg">
                          <p className="font-medium text-gray-900">{data.name}</p>
                          <p className="text-sm text-gray-600">CPU: {data.cpu}小时</p>
                          <p className="text-sm text-gray-600">内存: {data.memory}MB</p>
                          <p className="text-sm text-gray-600">运行次数: {data.runs}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter 
                  data={generateResourceConsumptionData(data)} 
                  fill="#3b82f6"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 性能分析组件
function PerformanceAnalysis({
  data,
  timeRange,
}: {
  data: AppStatistics[];
  timeRange: string;
}) {
  const performanceData = data.map((app) => ({
    name: app.appName,
    avgExecutionTime: app.runStatistics.averageExecutionTime,
    successRate: app.runStatistics.successRate,
    errorRate: app.qualityMetrics.errorRate,
    performanceScore: app.qualityMetrics.performanceScore,
  }));

  // 计算性能汇总指标
  const performanceSummary = {
    avgExecutionTime:
      data.reduce(
        (sum, app) =>
          sum + app.runStatistics.averageExecutionTime,
        0,
      ) / data.length || 0,
    systemAvailability:
      100 -
      (data.reduce(
        (sum, app) => sum + app.qualityMetrics.timeoutRate,
        0,
      ) / data.length || 0),
    overallErrorRate:
      data.reduce(
        (sum, app) => sum + app.qualityMetrics.errorRate,
        0,
      ) / data.length || 0,
  };

  return (
    <div className="space-y-6">
      {/* 性能指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="stats-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              平均执行时间
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceSummary.avgExecutionTime.toFixed(0)}秒
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <TrendingDown className="w-4 h-4 inline text-green-500 mr-1" />
              比上期提升15%
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              系统可用性
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceSummary.systemAvailability.toFixed(2)}
              %
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <TrendingUp className="w-4 h-4 inline text-green-500 mr-1" />
              保持稳定
            </div>
          </CardContent>
        </Card>

        <Card className="stats-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              平均错误率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceSummary.overallErrorRate.toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <TrendingDown className="w-4 h-4 inline text-green-500 mr-1" />
              比上期降低0.08%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 性能详细分析表格 */}
      <Card>
        <CardHeader>
          <CardTitle>应用性能详细分析</CardTitle>
          <CardDescription>
            各应用的详细性能指标和对比
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2">应用名称</th>
                  <th className="text-right pb-2">
                    平均执行时间
                  </th>
                  <th className="text-right pb-2">成功率</th>
                  <th className="text-right pb-2">错误率</th>
                  <th className="text-right pb-2">性能评分</th>
                  <th className="text-right pb-2">状态</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((app, index) => (
                  <tr
                    key={index}
                    className="border-b ranking-item"
                  >
                    <td className="py-3 font-medium">
                      {app.name}
                    </td>
                    <td className="py-3 text-right">
                      {app.avgExecutionTime}s
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`${app.successRate >= 95 ? "text-green-600" : app.successRate >= 90 ? "text-yellow-600" : "text-red-600"}`}
                      >
                        {app.successRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`${app.errorRate <= 1 ? "text-green-600" : app.errorRate <= 5 ? "text-yellow-600" : "text-red-600"}`}
                      >
                        {app.errorRate.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Badge
                        variant={
                          app.performanceScore >= 80
                            ? "default"
                            : app.performanceScore >= 60
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {app.performanceScore}分
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <div
                        className={`w-2 h-2 rounded-full health-indicator ${
                          app.successRate >= 95
                            ? "bg-green-500"
                            : app.successRate >= 90
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 使用情况分析组件
function UsageAnalysis({
  data,
  timeRange,
}: {
  data: AppStatistics[];
  timeRange: string;
}) {
  // 计算使用情况汇总
  const usageSummary = {
    totalDownloads: data.reduce(
      (sum, app) => sum + app.userEngagement.downloadCount,
      0,
    ),
    totalViews: data.reduce(
      (sum, app) => sum + app.userEngagement.viewCount,
      0,
    ),
    totalFavorites: data.reduce(
      (sum, app) => sum + app.userEngagement.favoriteCount,
      0,
    ),
    averageRating:
      data.reduce(
        (sum, app) =>
          sum + (app.userEngagement.ratingAverage || 0),
        0,
      ) /
        data.filter(
          (app) => app.userEngagement.ratingAverage > 0,
        ).length || 0,
  };

  return (
    <div className="space-y-6">
      {/* 使用情况概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  总下载量
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {usageSummary.totalDownloads.toLocaleString()}
                </p>
              </div>
              <Download className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  总浏览量
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {usageSummary.totalViews.toLocaleString()}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  收藏总数
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {usageSummary.totalFavorites.toLocaleString()}
                </p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  平均评分
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {usageSummary.averageRating.toFixed(1)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 用户参与度分析 */}
      <Card>
        <CardHeader>
          <CardTitle>用户参与度分析</CardTitle>
          <CardDescription>
            用户使用行为和参与度趋势
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={generateUserEngagementData(data, timeRange)}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id="colorActiveUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="activeUsers"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorActiveUsers)"
                  name="活跃用户"
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorViews)"
                  name="浏览次数"
                />
                <Area
                  type="monotone"
                  dataKey="downloads"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorDownloads)"
                  name="下载次数"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// 应用排行榜组件
function AppRanking({ data }: { data: AppStatistics[] }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 资源消耗排行 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              资源消耗排行
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RankingList
              data={mockResourceRanking}
              type="resource"
              showValue={(value) => `${value} CPU·h`}
            />
          </CardContent>
        </Card>

        {/* 最受欢迎排行 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              受欢迎排行
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RankingList
              data={mockPopularityRanking}
              type="popularity"
              showValue={(value) => `${value} 用户`}
            />
          </CardContent>
        </Card>

        {/* 性能优秀排行 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              性能排行
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RankingList
              data={mockPerformanceRanking}
              type="performance"
              showValue={(value) => `${value}分`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// 排行榜列表组件
function RankingList({
  data,
  type,
  showValue,
}: {
  data: any[];
  type: string;
  showValue: (value: number) => string;
}) {
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.id} className="flex items-center gap-3">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
              index === 0
                ? "bg-yellow-100 text-yellow-800"
                : index === 1
                  ? "bg-gray-100 text-gray-800"
                  : index === 2
                    ? "bg-orange-100 text-orange-800"
                    : "bg-gray-50 text-gray-600"
            }`}
          >
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {item.name}
            </div>
            <div className="text-xs text-gray-500">
              {showValue(item.value)}
            </div>
          </div>
          {index < 3 && (
            <div className="text-xs">
              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// 计算汇总统计
function calculateSummaryStats(data: AppStatistics[]) {
  return {
    totalRuns: data.reduce(
      (sum, app) => sum + app.runStatistics.totalRuns,
      0,
    ),
    avgSuccessRate:
      data.reduce(
        (sum, app) => sum + app.runStatistics.successRate,
        0,
      ) / data.length || 0,
    activeApps: data.filter(
      (app) => app.runStatistics.totalRuns > 0,
    ).length,
    totalActiveUsers: data.reduce(
      (sum, app) => sum + app.userEngagement.activeUsers,
      0,
    ),
  };
}

// 模拟数据
const mockStatisticsData: AppStatistics[] = [
  {
    appId: "1",
    appName: "整车动能安全",
    runStatistics: {
      totalRuns: 245,
      successfulRuns: 234,
      failedRuns: 11,
      successRate: 95.5,
      averageExecutionTime: 156,
      lastRunTime: "2025-08-09 14:30",
      recentRuns: [],
    },
    resourceConsumption: {
      cpuUsageTotal: 89.5,
      memoryPeakUsage: 2048,
      storageUsage: 512,
      licenseConsumption: {
        totalTokens: 125000,
        averageTokensPerRun: 510,
        costEstimate: 1250,
      },
      networkTraffic: 1024,
    },
    userEngagement: {
      totalUsers: 89,
      activeUsers: 34,
      downloadCount: 89,
      favoriteCount: 24,
      viewCount: 156,
      commentCount: 12,
      ratingAverage: 4.6,
      topUsers: [],
    },
    qualityMetrics: {
      errorRate: 4.5,
      timeoutRate: 0.8,
      retryRate: 2.1,
      performanceScore: 87,
      reliabilityScore: 92,
      userSatisfaction: 4.6,
    },
    trends: {
      daily: [],
      weekly: [],
      monthly: [],
    },
  },
  {
    appId: "2",
    appName: "空调热管理",
    runStatistics: {
      totalRuns: 312,
      successfulRuns: 294,
      failedRuns: 18,
      successRate: 94.2,
      averageExecutionTime: 128,
      lastRunTime: "2025-08-09 16:45",
      recentRuns: [],
    },
    resourceConsumption: {
      cpuUsageTotal: 67.3,
      memoryPeakUsage: 1536,
      storageUsage: 384,
      licenseConsumption: {
        totalTokens: 156000,
        averageTokensPerRun: 500,
        costEstimate: 1560,
      },
      networkTraffic: 768,
    },
    userEngagement: {
      totalUsers: 67,
      activeUsers: 28,
      downloadCount: 67,
      favoriteCount: 18,
      viewCount: 203,
      commentCount: 8,
      ratingAverage: 4.7,
      topUsers: [],
    },
    qualityMetrics: {
      errorRate: 5.8,
      timeoutRate: 1.2,
      retryRate: 3.1,
      performanceScore: 94,
      reliabilityScore: 89,
      userSatisfaction: 4.7,
    },
    trends: {
      daily: [],
      weekly: [],
      monthly: [],
    },
  },
  {
    appId: "3",
    appName: "整车集成",
    runStatistics: {
      totalRuns: 189,
      successfulRuns: 177,
      failedRuns: 12,
      successRate: 93.7,
      averageExecutionTime: 203,
      lastRunTime: "2025-08-09 10:15",
      recentRuns: [],
    },
    resourceConsumption: {
      cpuUsageTotal: 124.8,
      memoryPeakUsage: 3072,
      storageUsage: 768,
      licenseConsumption: {
        totalTokens: 189000,
        averageTokensPerRun: 1000,
        costEstimate: 1890,
      },
      networkTraffic: 1536,
    },
    userEngagement: {
      totalUsers: 124,
      activeUsers: 45,
      downloadCount: 124,
      favoriteCount: 32,
      viewCount: 189,
      commentCount: 15,
      ratingAverage: 4.5,
      topUsers: [],
    },
    qualityMetrics: {
      errorRate: 6.3,
      timeoutRate: 2.1,
      retryRate: 4.2,
      performanceScore: 88,
      reliabilityScore: 91,
      userSatisfaction: 4.5,
    },
    trends: {
      daily: [],
      weekly: [],
      monthly: [],
    },
  },
  {
    appId: "4",
    appName: "电池管理系统",
    runStatistics: {
      totalRuns: 428,
      successfulRuns: 389,
      failedRuns: 39,
      successRate: 90.9,
      averageExecutionTime: 178,
      lastRunTime: "2025-08-09 13:22",
      recentRuns: [],
    },
    resourceConsumption: {
      cpuUsageTotal: 156.7,
      memoryPeakUsage: 2560,
      storageUsage: 640,
      licenseConsumption: {
        totalTokens: 214000,
        averageTokensPerRun: 500,
        costEstimate: 2140,
      },
      networkTraffic: 1280,
    },
    userEngagement: {
      totalUsers: 156,
      activeUsers: 67,
      downloadCount: 156,
      favoriteCount: 41,
      viewCount: 267,
      commentCount: 22,
      ratingAverage: 4.8,
      topUsers: [],
    },
    qualityMetrics: {
      errorRate: 9.1,
      timeoutRate: 3.2,
      retryRate: 5.8,
      performanceScore: 91,
      reliabilityScore: 86,
      userSatisfaction: 4.8,
    },
    trends: {
      daily: [],
      weekly: [],
      monthly: [],
    },
  },
  {
    appId: "5",
    appName: "车身结构分析",
    runStatistics: {
      totalRuns: 167,
      successfulRuns: 152,
      failedRuns: 15,
      successRate: 91.0,
      averageExecutionTime: 234,
      lastRunTime: "2025-08-09 09:45",
      recentRuns: [],
    },
    resourceConsumption: {
      cpuUsageTotal: 98.4,
      memoryPeakUsage: 4096,
      storageUsage: 1024,
      licenseConsumption: {
        totalTokens: 167000,
        averageTokensPerRun: 1000,
        costEstimate: 1670,
      },
      networkTraffic: 2048,
    },
    userEngagement: {
      totalUsers: 98,
      activeUsers: 42,
      downloadCount: 98,
      favoriteCount: 28,
      viewCount: 145,
      commentCount: 9,
      ratingAverage: 4.4,
      topUsers: [],
    },
    qualityMetrics: {
      errorRate: 9.0,
      timeoutRate: 4.1,
      retryRate: 6.3,
      performanceScore: 88,
      reliabilityScore: 85,
      userSatisfaction: 4.4,
    },
    trends: {
      daily: [],
      weekly: [],
      monthly: [],
    },
  },
  {
    appId: "6",
    appName: "动力总成匹配",
    runStatistics: {
      totalRuns: 298,
      successfulRuns: 254,
      failedRuns: 44,
      successRate: 85.2,
      averageExecutionTime: 189,
      lastRunTime: "2025-08-09 15:18",
      recentRuns: [],
    },
    resourceConsumption: {
      cpuUsageTotal: 142.6,
      memoryPeakUsage: 2304,
      storageUsage: 576,
      licenseConsumption: {
        totalTokens: 298000,
        averageTokensPerRun: 1000,
        costEstimate: 2980,
      },
      networkTraffic: 1152,
    },
    userEngagement: {
      totalUsers: 142,
      activeUsers: 58,
      downloadCount: 142,
      favoriteCount: 35,
      viewCount: 198,
      commentCount: 18,
      ratingAverage: 4.3,
      topUsers: [],
    },
    qualityMetrics: {
      errorRate: 14.8,
      timeoutRate: 5.6,
      retryRate: 8.9,
      performanceScore: 85,
      reliabilityScore: 82,
      userSatisfaction: 4.3,
    },
    trends: {
      daily: [],
      weekly: [],
      monthly: [],
    },
  },
  {
    appId: "1001",
    appName: "智能驾驶辅助系统",
    runStatistics: {
      totalRuns: 56,
      successfulRuns: 48,
      failedRuns: 8,
      successRate: 85.7,
      averageExecutionTime: 267,
      lastRunTime: "2025-08-09 11:20",
      recentRuns: [],
    },
    resourceConsumption: {
      cpuUsageTotal: 34.2,
      memoryPeakUsage: 1792,
      storageUsage: 448,
      licenseConsumption: {
        totalTokens: 84000,
        averageTokensPerRun: 1500,
        costEstimate: 840,
      },
      networkTraffic: 896,
    },
    userEngagement: {
      totalUsers: 12,
      activeUsers: 5,
      downloadCount: 0,
      favoriteCount: 0,
      viewCount: 3,
      commentCount: 0,
      ratingAverage: 0,
      topUsers: [],
    },
    qualityMetrics: {
      errorRate: 14.3,
      timeoutRate: 7.1,
      retryRate: 12.5,
      performanceScore: 76,
      reliabilityScore: 79,
      userSatisfaction: 3.8,
    },
    trends: {
      daily: [],
      weekly: [],
      monthly: [],
    },
  },
  {
    appId: "1002",
    appName: "电池热管理优化",
    runStatistics: {
      totalRuns: 23,
      successfulRuns: 19,
      failedRuns: 4,
      successRate: 82.6,
      averageExecutionTime: 145,
      lastRunTime: "2025-08-09 12:35",
      recentRuns: [],
    },
    resourceConsumption: {
      cpuUsageTotal: 18.9,
      memoryPeakUsage: 1280,
      storageUsage: 320,
      licenseConsumption: {
        totalTokens: 34500,
        averageTokensPerRun: 1500,
        costEstimate: 345,
      },
      networkTraffic: 640,
    },
    userEngagement: {
      totalUsers: 5,
      activeUsers: 2,
      downloadCount: 0,
      favoriteCount: 0,
      viewCount: 1,
      commentCount: 0,
      ratingAverage: 0,
      topUsers: [],
    },
    qualityMetrics: {
      errorRate: 17.4,
      timeoutRate: 8.7,
      retryRate: 13.0,
      performanceScore: 72,
      reliabilityScore: 75,
      userSatisfaction: 3.5,
    },
    trends: {
      daily: [],
      weekly: [],
      monthly: [],
    },
  },
  {
    appId: "1003",
    appName: "车辆NVH分析系统",
    runStatistics: {
      totalRuns: 78,
      successfulRuns: 67,
      failedRuns: 11,
      successRate: 85.9,
      averageExecutionTime: 312,
      lastRunTime: "2025-08-09 08:50",
      recentRuns: [],
    },
    resourceConsumption: {
      cpuUsageTotal: 67.8,
      memoryPeakUsage: 3584,
      storageUsage: 896,
      licenseConsumption: {
        totalTokens: 156000,
        averageTokensPerRun: 2000,
        costEstimate: 1560,
      },
      networkTraffic: 1792,
    },
    userEngagement: {
      totalUsers: 18,
      activeUsers: 8,
      downloadCount: 0,
      favoriteCount: 0,
      viewCount: 5,
      commentCount: 1,
      ratingAverage: 4.0,
      topUsers: [],
    },
    qualityMetrics: {
      errorRate: 14.1,
      timeoutRate: 6.4,
      retryRate: 9.0,
      performanceScore: 78,
      reliabilityScore: 81,
      userSatisfaction: 4.0,
    },
    trends: {
      daily: [],
      weekly: [],
      monthly: [],
    },
  },
];

const mockResourceRanking = [
  { id: "1", name: "电池管理系统", value: 156 },
  { id: "2", name: "整车动能安全", value: 89 },
  { id: "3", name: "动力总成匹配", value: 67 },
  { id: "4", name: "车身结构分析", value: 45 },
  { id: "5", name: "空调热管理", value: 34 },
];

const mockPopularityRanking = [
  { id: "1", name: "电池管理系统", value: 267 },
  { id: "2", name: "动力总成匹配", value: 198 },
  { id: "3", name: "整车集成", value: 189 },
  { id: "4", name: "整车动能安全", value: 156 },
  { id: "5", name: "车身结构分析", value: 145 },
];

const mockPerformanceRanking = [
  { id: "1", name: "空调热管理", value: 94 },
  { id: "2", name: "电池管理系统", value: 91 },
  { id: "3", name: "车身结构分析", value: 88 },
  { id: "4", name: "整车动能安全", value: 87 },
  { id: "5", name: "动力总成匹配", value: 85 },
];

// 生成趋势数据的辅助函数
function generateTrendData(timeRange: string) {
  const today = new Date();
  const data = [];
  
  let days = 7;
  if (timeRange === "1d") days = 24; // 24小时数据
  else if (timeRange === "30d") days = 30;
  else if (timeRange === "90d") days = 90;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    
    if (timeRange === "1d") {
      date.setHours(today.getHours() - i);
      data.push({
        date: `${date.getHours()}:00`,
        runs: Math.floor(Math.random() * 50) + 10,
        successRate: Math.floor(Math.random() * 15) + 85,
        failedRuns: Math.floor(Math.random() * 8) + 1
      });
    } else {
      date.setDate(today.getDate() - i);
      data.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        runs: Math.floor(Math.random() * 120) + 30,
        successRate: Math.floor(Math.random() * 20) + 80,
        failedRuns: Math.floor(Math.random() * 15) + 2
      });
    }
  }
  
  return data;
}

// 生成成功率分布数据的辅助函数
function generateSuccessRateDistribution(data: AppStatistics[]) {
  const distribution = [
    { name: "优秀(95%+)", count: 0, color: "#10b981" },
    { name: "良好(90-95%)", count: 0, color: "#f59e0b" },
    { name: "一般(80-90%)", count: 0, color: "#ef4444" },
    { name: "较差(<80%)", count: 0, color: "#6b7280" }
  ];
  
  data.forEach(app => {
    if (app.runStatistics.successRate >= 95) {
      distribution[0].count++;
    } else if (app.runStatistics.successRate >= 90) {
      distribution[1].count++;
    } else if (app.runStatistics.successRate >= 80) {
      distribution[2].count++;
    } else {
      distribution[3].count++;
    }
  });
  
  return distribution.filter(item => item.count > 0);
}

// 生成资源消耗数据的辅助函数
function generateResourceConsumptionData(data: AppStatistics[]) {
  return data.map(app => ({
    name: app.appName,
    cpu: app.resourceConsumption.cpuUsageTotal,
    memory: app.resourceConsumption.memoryPeakUsage,
    runs: app.runStatistics.totalRuns
  }));
}

// 生成用户参与度数据的辅助函数
function generateUserEngagementData(data: AppStatistics[], timeRange: string) {
  const today = new Date();
  const dataPoints = [];
  
  let days = 7;
  if (timeRange === "1d") days = 24; // 24小时数据
  else if (timeRange === "30d") days = 30;
  else if (timeRange === "90d") days = 90;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    
    if (timeRange === "1d") {
      date.setHours(today.getHours() - i);
      dataPoints.push({
        date: `${date.getHours()}:00`,
        activeUsers: Math.floor(Math.random() * 10) + 5,
        views: Math.floor(Math.random() * 50) + 20,
        downloads: Math.floor(Math.random() * 20) + 10
      });
    } else {
      date.setDate(today.getDate() - i);
      dataPoints.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        activeUsers: Math.floor(Math.random() * 10) + 5,
        views: Math.floor(Math.random() * 50) + 20,
        downloads: Math.floor(Math.random() * 20) + 10
      });
    }
  }
  
  return dataPoints;
}