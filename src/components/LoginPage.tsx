import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  AlertCircle,
  Loader2,
} from "lucide-react@0.487.0";

export function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [selectedDemo, setSelectedDemo] = useState("");

  const { login, loading } = useAuth();

  // 演示用户账号
  const demoAccounts = [
    {
      username: "admin",
      name: "系统管理员",
      role: "平台管理员",
    },
    {
      username: "pmzhang",
      name: "项目经理张工",
      role: "项目经理",
    },
    {
      username: "archli",
      name: "架构师李工",
      role: "系统架构师",
    },
    {
      username: "simwang",
      name: "仿真工程师王工",
      role: "仿真工程师",
    },
    {
      username: "modelchen",
      name: "建模工程师陈工",
      role: "建模工程师",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("请输入用户名和密码");
      return;
    }

    const success = await login(username, password);
    if (!success) {
      setError("用户名或密码错误");
    }
  };

  const handleDemoLogin = (demoUsername: string) => {
    setUsername(demoUsername);
    setPassword("123456");
    setSelectedDemo(demoUsername);
  };

  const quickLogin = async (demoUsername: string) => {
    setError("");
    const success = await login(demoUsername, "123456");
    if (!success) {
      setError("演示登录失败");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* 左侧 - 品牌介绍 */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">
                  M
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  MBSE平台
                </h1>
                <p className="text-gray-600">
                  Model-Based Systems Engineering
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                基于模型的系统工程平台
              </h2>
              <p className="text-gray-600 leading-relaxed">
                集成需求管理、架构设计、建模仿真、验证确认于一体的全流程MBSE解决方案，
                支持SysML建模、多学科仿真、SSP标准，助力汽车行业数字化转型。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">
                  系统架构设计
                </h3>
                <p className="text-sm text-gray-600">
                  SysML/UML建模工具集成
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">
                  多学科仿真
                </h3>
                <p className="text-sm text-gray-600">
                  FMU/SSP标准化仿真
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">
                  工作流管理
                </h3>
                <p className="text-sm text-gray-600">
                  可视化流程编排
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">
                  模型库管理
                </h3>
                <p className="text-sm text-gray-600">
                  版本控制与复用
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧 - 登录表单 */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                欢迎登录
              </h2>
              <p className="text-gray-600">
                请输入您的账号信息
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-700">
                    {error}
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  用户名
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    placeholder="请输入用户名"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="请输入密码"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    登录中...
                  </>
                ) : (
                  "登录"
                )}
              </button>
            </form>

            {/* 演示账号快速登录 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-4 text-center">
                演示账号快速登录
              </h3>
              <div className="space-y-2">
                {demoAccounts.map((account) => (
                  <button
                    key={account.username}
                    onClick={() => quickLogin(account.username)}
                    disabled={loading}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      selectedDemo === account.username
                        ? "bg-blue-50 border-blue-300"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">
                          {account.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {account.role} • {account.username}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        点击登录
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                默认密码：123456
              </p>
            </div>

            {/* 系统信息 */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
              <p>MBSE Platform v2.1.0</p>
              <p className="mt-1">
                © 2024 Model-Based Systems Engineering
              </p>
            </div>
          </div>
        </div>

        {/* 移动端品牌信息 */}
        <div className="lg:hidden text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                M
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                MBSE平台
              </h1>
              <p className="text-sm text-gray-600">
                Model-Based Systems Engineering
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            基于模型的系统工程平台，集成需求管理、架构设计、建模仿真于一体
          </p>
        </div>
      </div>
    </div>
  );
}