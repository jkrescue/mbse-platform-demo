// 智能导航服务
interface NavigationContext {
  source: {
    page: string;
    component?: string;
    action?: string;
    timestamp: string;
  };
  
  target: {
    page: string;
    section?: string;
    highlightItems?: string[];
    filters?: NavigationFilter[];
  };
  
  context: {
    appId?: string;
    componentId?: string;
    modelId?: string;
    toolId?: string;
    versionId?: string;
    searchQuery?: string;
    metadata?: Record<string, any>;
  };
  
  breadcrumb: NavigationBreadcrumb[];
  
  returnPath?: {
    page: string;
    state?: any;
    scrollPosition?: number;
  };
}

interface NavigationFilter {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'in' | 'range';
  value: any;
  display?: string;
}

interface NavigationBreadcrumb {
  page: string;
  title: string;
  params?: Record<string, any>;
  timestamp: string;
}

export class NavigationService {
  private static instance: NavigationService;
  private navigationHistory: NavigationContext[] = [];
  private currentContext: NavigationContext | null = null;
  private navigationCallback: ((page: string, context?: any) => void) | null = null;

  static getInstance(): NavigationService {
    if (!NavigationService.instance) {
      NavigationService.instance = new NavigationService();
    }
    return NavigationService.instance;
  }

  // 设置导航回调函数
  setNavigationCallback(callback: (page: string, context?: any) => void) {
    this.navigationCallback = callback;
  }

  // 智能导航
  navigateWithContext(
    targetPage: string,
    context: Partial<NavigationContext['context']>,
    options?: {
      replace?: boolean;
      animation?: boolean;
      keepHistory?: boolean;
    }
  ) {
    const navigationContext: NavigationContext = {
      source: {
        page: this.getCurrentPage(),
        timestamp: new Date().toISOString()
      },
      target: {
        page: targetPage,
        highlightItems: context.highlightItems ? [context.highlightItems] : undefined,
        filters: this.buildNavigationFilters(context)
      },
      context,
      breadcrumb: this.buildBreadcrumb(targetPage),
      returnPath: options?.keepHistory ? {
        page: this.getCurrentPage(),
        state: this.getCurrentPageState(),
        scrollPosition: window.scrollY
      } : undefined
    };

    // 保存到历史记录
    if (options?.keepHistory !== false) {
      this.navigationHistory.push(navigationContext);
    }

    // 设置当前上下文
    this.currentContext = navigationContext;

    // 执行导航
    this.executeNavigation(navigationContext, options);
  }

  // 处理依赖点击导航
  handleDependencyNavigation(
    dependencyType: 'components' | 'toolServices' | 'modelVersions' | 'externalAPIs',
    dependency: any,
    sourceApp?: any
  ) {
    const navigationMappings = {
      components: {
        page: 'componentManagement',
        context: {
          highlightComponent: dependency.id,
          category: dependency.category,
          searchQuery: dependency.name,
          appId: sourceApp?.id
        }
      },
      toolServices: {
        page: 'toolService',
        context: {
          highlightService: dependency.id,
          searchQuery: dependency.name,
          tab: 'services',
          appId: sourceApp?.id
        }
      },
      modelVersions: {
        page: 'modelManagement',
        context: {
          highlightModel: dependency.id,
          version: dependency.version,
          searchQuery: dependency.modelName,
          appId: sourceApp?.id
        }
      },
      externalAPIs: {
        page: 'toolService',
        context: {
          highlightAPI: dependency.id,
          searchQuery: dependency.name,
          tab: 'apis',
          appId: sourceApp?.id
        }
      }
    };

    const mapping = navigationMappings[dependencyType];
    if (mapping) {
      this.navigateWithContext(mapping.page, mapping.context, {
        animation: true,
        keepHistory: true
      });

      // 触发导航事件
      this.emitNavigationEvent('dependency-click', {
        dependencyType,
        dependency,
        sourceApp,
        targetPage: mapping.page
      });
    }
  }

  // 处理返回导航
  navigateBack(): boolean {
    if (this.currentContext?.returnPath) {
      const returnPath = this.currentContext.returnPath;

      // 恢复页面状态
      this.executeNavigation({
        source: this.currentContext.target,
        target: { page: returnPath.page },
        context: {},
        breadcrumb: []
      }, {
        restoreState: returnPath.state,
        restoreScroll: returnPath.scrollPosition
      });

      return true;
    }

    return false;
  }

  // 构建导航过滤器
  private buildNavigationFilters(context: any): NavigationFilter[] {
    const filters: NavigationFilter[] = [];

    if (context.searchQuery) {
      filters.push({
        field: 'name',
        operator: 'contains',
        value: context.searchQuery,
        display: `搜索: ${context.searchQuery}`
      });
    }

    if (context.category) {
      filters.push({
        field: 'category',
        operator: 'equals',
        value: context.category,
        display: `分类: ${context.category}`
      });
    }

    if (context.appId) {
      filters.push({
        field: 'relatedApps',
        operator: 'in',
        value: [context.appId],
        display: `相关应用: ${context.appId}`
      });
    }

    return filters;
  }

  // 构建面包屑导航
  private buildBreadcrumb(targetPage: string): NavigationBreadcrumb[] {
    const breadcrumbMappings: Record<string, string> = {
      'componentManagement': '组件管理',
      'toolService': '工具服务',
      'modelManagement': '模型管理',
      'appCenter': '应用中心',
      'appDetail': '应用详情'
    };

    const breadcrumb: NavigationBreadcrumb[] = [
      {
        page: 'appCenter',
        title: '应用中心',
        params: {},
        timestamp: new Date().toISOString()
      }
    ];

    if (targetPage !== 'appCenter') {
      breadcrumb.push({
        page: targetPage,
        title: breadcrumbMappings[targetPage] || targetPage,
        params: {},
        timestamp: new Date().toISOString()
      });
    }

    return breadcrumb;
  }

  // 执行导航
  private executeNavigation(context: NavigationContext, options?: any) {
    if (this.navigationCallback) {
      // 构建导航参数
      const navigationParams = {
        ...context.context,
        highlightItems: context.target.highlightItems,
        filters: context.target.filters,
        section: context.target.section
      };

      this.navigationCallback(context.target.page, navigationParams);
    }

    // 如果需要恢复滚动位置
    if (options?.restoreScroll) {
      setTimeout(() => {
        window.scrollTo(0, options.restoreScroll);
      }, 100);
    }
  }

  // 发送导航事件
  private emitNavigationEvent(eventType: string, data: any) {
    const event = new CustomEvent('navigationEvent', {
      detail: {
        type: eventType,
        data,
        timestamp: new Date().toISOString()
      }
    });
    window.dispatchEvent(event);
  }

  // 获取当前页面
  private getCurrentPage(): string {
    // 从当前URL或状态获取页面信息
    return window.location.pathname.split('/')[1] || 'appCenter';
  }

  // 获取当前页面状态
  private getCurrentPageState(): any {
    // 返回当前页面的状态信息
    return {
      scrollPosition: window.scrollY,
      timestamp: new Date().toISOString()
    };
  }

  // 获取当前导航上下文
  getCurrentNavigationContext(): NavigationContext | null {
    return this.currentContext;
  }

  // 清除导航历史
  clearNavigationHistory() {
    this.navigationHistory = [];
    this.currentContext = null;
  }
}

// 导航工具函数
export const NavigationUtils = {
  // 构建导航URL参数
  buildNavigationParams: (context: any) => {
    const params = new URLSearchParams();

    Object.entries(context).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          params.set(key, JSON.stringify(value));
        } else {
          params.set(key, String(value));
        }
      }
    });

    return params;
  },

  // 解析导航URL参数
  parseNavigationParams: (searchParams: URLSearchParams) => {
    const context: any = {};

    for (const [key, value] of searchParams.entries()) {
      try {
        context[key] = JSON.parse(value);
      } catch {
        context[key] = value;
      }
    }

    return context;
  },

  // 生成导航面包屑
  generateBreadcrumb: (currentPage: string, context: any) => {
    const breadcrumbMappings: Record<string, string> = {
      'componentManagement': '组件管理',
      'toolService': '工具服务',
      'modelManagement': '模型管理',
      'appCenter': '应用中心',
      'appDetail': '应用详情'
    };

    const breadcrumb = [
      {
        page: 'appCenter',
        title: '应用中心',
        params: {},
        timestamp: new Date().toISOString()
      }
    ];

    if (currentPage !== 'appCenter') {
      breadcrumb.push({
        page: currentPage,
        title: breadcrumbMappings[currentPage] || currentPage,
        params: context,
        timestamp: new Date().toISOString()
      });
    }

    return breadcrumb;
  }
};