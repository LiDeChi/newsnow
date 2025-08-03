/**
 * API 相关配置参数
 * 
 * 这个文件包含了所有与 API 相关的可调节参数
 * 包括缓存设置、请求限制、认证配置等
 */

// API 基础配置
export const API_CONFIG = {
  // 默认缓存时间（毫秒）
  DEFAULT_CACHE_DURATION: 30 * 60 * 1000, // 30分钟
  
  // 最小请求间隔（毫秒）
  MIN_REQUEST_INTERVAL: 2 * 60 * 1000, // 2分钟
  
  // 默认返回的新闻条数
  DEFAULT_NEWS_COUNT: 10,
  
  // 最大返回的新闻条数
  MAX_NEWS_COUNT: 100,
  
  // API 版本
  API_VERSION: "1.0.0",
  
  // 是否启用 CORS
  ENABLE_CORS: true,
  
  // 允许的跨域来源（* 表示允许所有）
  CORS_ORIGINS: "*",
  
  // 允许的 HTTP 方法
  CORS_METHODS: "GET, HEAD, POST, PUT, OPTIONS",
  
  // 允许的请求头
  CORS_HEADERS: "*",
} as const

// 认证相关配置
export const AUTH_CONFIG = {
  // JWT Token 过期时间
  JWT_EXPIRATION: "60d",
  
  // JWT 算法
  JWT_ALGORITHM: "HS256",
  
  // 是否启用认证（从环境变量读取）
  ENABLE_AUTH: process.env.G_CLIENT_ID && process.env.G_CLIENT_SECRET && process.env.JWT_SECRET,
  
  // GitHub OAuth 配置
  GITHUB_OAUTH: {
    CLIENT_ID: process.env.G_CLIENT_ID,
    CLIENT_SECRET: process.env.G_CLIENT_SECRET,
    SCOPE: "user:email",
    AUTHORIZE_URL: "https://github.com/login/oauth/authorize",
    TOKEN_URL: "https://github.com/login/oauth/access_token",
    USER_API_URL: "https://api.github.com/user",
  },
  
  // 需要认证的端点
  PROTECTED_ENDPOINTS: [
    "/api/me",
  ],
  
  // 可选认证的端点（有 token 时提供额外功能）
  OPTIONAL_AUTH_ENDPOINTS: [
    "/api/s",
  ],
} as const

// 缓存相关配置
export const CACHE_CONFIG = {
  // 是否启用缓存
  ENABLE_CACHE: process.env.ENABLE_CACHE !== "false",
  
  // 缓存类型
  CACHE_TYPE: "database", // 可选: "memory", "database", "redis"
  
  // 内存缓存配置
  MEMORY_CACHE: {
    // 最大缓存条目数
    MAX_ENTRIES: 1000,
    
    // 缓存检查间隔（毫秒）
    CHECK_INTERVAL: 5 * 60 * 1000, // 5分钟
  },
  
  // 数据库缓存配置
  DATABASE_CACHE: {
    // 缓存表名
    TABLE_NAME: "cache",
    
    // 自动清理过期缓存的间隔（毫秒）
    CLEANUP_INTERVAL: 60 * 60 * 1000, // 1小时
    
    // 保留过期缓存的时间（毫秒）
    RETENTION_TIME: 24 * 60 * 60 * 1000, // 24小时
  },
} as const

// 请求限制配置
export const RATE_LIMIT_CONFIG = {
  // 是否启用请求限制
  ENABLE_RATE_LIMIT: true,
  
  // 基于 IP 的限制
  IP_RATE_LIMIT: {
    // 时间窗口（毫秒）
    WINDOW_MS: 15 * 60 * 1000, // 15分钟
    
    // 最大请求次数
    MAX_REQUESTS: 100,
    
    // 超出限制时的响应消息
    MESSAGE: "Too many requests from this IP, please try again later.",
  },
  
  // 基于用户的限制（已认证用户）
  USER_RATE_LIMIT: {
    // 时间窗口（毫秒）
    WINDOW_MS: 15 * 60 * 1000, // 15分钟
    
    // 最大请求次数
    MAX_REQUESTS: 200,
    
    // 超出限制时的响应消息
    MESSAGE: "Too many requests from this user, please try again later.",
  },
  
  // 特殊端点的限制
  ENDPOINT_LIMITS: {
    "/api/s": {
      WINDOW_MS: 1 * 60 * 1000, // 1分钟
      MAX_REQUESTS: 30,
    },
    "/api/s/entire": {
      WINDOW_MS: 5 * 60 * 1000, // 5分钟
      MAX_REQUESTS: 10,
    },
  },
} as const

// 数据源相关配置
export const SOURCE_CONFIG = {
  // 默认数据源列表
  DEFAULT_SOURCES: [
    "weibo",
    "zhihu", 
    "v2ex",
    "36kr",
    "ithome",
  ],
  
  // 数据源分类
  SOURCE_CATEGORIES: {
    SOCIAL: ["weibo", "weibo-realtime", "zhihu", "v2ex"],
    TECH: ["36kr", "ithome", "cnbeta", "github-trending"],
    FINANCE: ["wallstreetcn", "fastbull", "mktnews"],
    ENTERTAINMENT: ["douban-movie"],
  },
  
  // 数据源优先级（数字越小优先级越高）
  SOURCE_PRIORITY: {
    "weibo": 1,
    "zhihu": 2,
    "v2ex": 3,
    "36kr": 4,
    "ithome": 5,
  },
  
  // 数据源刷新间隔（毫秒）
  SOURCE_INTERVALS: {
    "weibo": 5 * 60 * 1000,      // 5分钟
    "zhihu": 10 * 60 * 1000,     // 10分钟
    "v2ex": 15 * 60 * 1000,      // 15分钟
    "36kr": 10 * 60 * 1000,      // 10分钟
    "ithome": 10 * 60 * 1000,    // 10分钟
  },
} as const

// 代理服务配置
export const PROXY_CONFIG = {
  // 图片代理配置
  IMAGE_PROXY: {
    // 是否启用图片代理
    ENABLE: true,
    
    // 支持的图片格式
    SUPPORTED_FORMATS: ["jpg", "jpeg", "png", "gif", "webp", "svg"],
    
    // 最大图片大小（字节）
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    
    // 缓存时间（秒）
    CACHE_DURATION: 24 * 60 * 60, // 24小时
    
    // 请求超时时间（毫秒）
    TIMEOUT: 10 * 1000, // 10秒
    
    // 用户代理
    USER_AGENT: "NewsNow Image Proxy/1.0",
  },
  
  // 通用代理配置
  GENERAL_PROXY: {
    // 请求超时时间（毫秒）
    TIMEOUT: 30 * 1000, // 30秒
    
    // 最大重试次数
    MAX_RETRIES: 3,
    
    // 重试间隔（毫秒）
    RETRY_DELAY: 1000, // 1秒
    
    // 用户代理
    USER_AGENT: "NewsNow Proxy/1.0",
  },
} as const

// 错误处理配置
export const ERROR_CONFIG = {
  // 是否在响应中包含详细错误信息
  INCLUDE_STACK_TRACE: process.env.NODE_ENV === "development",
  
  // 默认错误消息
  DEFAULT_ERROR_MESSAGES: {
    400: "Bad Request",
    401: "Unauthorized", 
    403: "Forbidden",
    404: "Not Found",
    429: "Too Many Requests",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
  },
  
  // 错误日志配置
  ERROR_LOGGING: {
    // 是否启用错误日志
    ENABLE: true,
    
    // 日志级别
    LEVEL: process.env.NODE_ENV === "development" ? "debug" : "error",
    
    // 是否记录请求详情
    LOG_REQUEST_DETAILS: process.env.NODE_ENV === "development",
  },
} as const

// MCP (Model Context Protocol) 配置
export const MCP_CONFIG = {
  // 是否启用 MCP 服务
  ENABLE_MCP: true,
  
  // MCP 服务器信息
  SERVER_INFO: {
    NAME: "NewsNow",
    VERSION: "1.0.0",
    DESCRIPTION: "NewsNow MCP Server for fetching news data",
  },
  
  // 支持的工具
  TOOLS: {
    GET_NEWS: {
      NAME: "get_hotest_latest_news",
      DESCRIPTION: "get hotest or latest news from source by {id}, return {count: 10} news.",
      DEFAULT_COUNT: 10,
      MAX_COUNT: 50,
    },
  },
  
  // MCP 端点配置
  ENDPOINT: "/api/mcp",
} as const

// 监控和日志配置
export const MONITORING_CONFIG = {
  // 是否启用性能监控
  ENABLE_PERFORMANCE_MONITORING: true,
  
  // 慢查询阈值（毫秒）
  SLOW_QUERY_THRESHOLD: 1000,
  
  // 是否记录访问日志
  ENABLE_ACCESS_LOG: process.env.NODE_ENV === "production",
  
  // 访问日志格式
  ACCESS_LOG_FORMAT: "combined",
  
  // 健康检查配置
  HEALTH_CHECK: {
    // 健康检查端点
    ENDPOINT: "/api/health",
    
    // 检查项目
    CHECKS: [
      "database",
      "cache", 
      "external_apis",
    ],
  },
} as const

// 导出所有配置
export const ALL_CONFIG = {
  API: API_CONFIG,
  AUTH: AUTH_CONFIG,
  CACHE: CACHE_CONFIG,
  RATE_LIMIT: RATE_LIMIT_CONFIG,
  SOURCE: SOURCE_CONFIG,
  PROXY: PROXY_CONFIG,
  ERROR: ERROR_CONFIG,
  MCP: MCP_CONFIG,
  MONITORING: MONITORING_CONFIG,
} as const

// 配置验证函数
export function validateConfig() {
  const errors: string[] = []
  
  // 检查必需的环境变量
  if (AUTH_CONFIG.ENABLE_AUTH) {
    if (!process.env.G_CLIENT_ID) {
      errors.push("G_CLIENT_ID environment variable is required when auth is enabled")
    }
    if (!process.env.G_CLIENT_SECRET) {
      errors.push("G_CLIENT_SECRET environment variable is required when auth is enabled")
    }
    if (!process.env.JWT_SECRET) {
      errors.push("JWT_SECRET environment variable is required when auth is enabled")
    }
  }
  
  // 检查缓存配置
  if (CACHE_CONFIG.ENABLE_CACHE && CACHE_CONFIG.CACHE_TYPE === "database") {
    // 这里可以添加数据库连接检查
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

// 获取运行时配置
export function getRuntimeConfig() {
  return {
    environment: process.env.NODE_ENV || "development",
    enableAuth: AUTH_CONFIG.ENABLE_AUTH,
    enableCache: CACHE_CONFIG.ENABLE_CACHE,
    enableRateLimit: RATE_LIMIT_CONFIG.ENABLE_RATE_LIMIT,
    enableMcp: MCP_CONFIG.ENABLE_MCP,
    apiVersion: API_CONFIG.API_VERSION,
  }
}
