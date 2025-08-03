/**
 * 新闻源配置参数
 * 
 * 这个文件集中管理所有新闻源的可调节参数
 * 修改这些参数可以调整新闻获取的行为
 */

// ============================================================================
// 基础配置参数
// ============================================================================

export const BASE_CONFIG = {
  // 请求超时时间（毫秒）
  REQUEST_TIMEOUT: 10000,
  
  // 重试次数
  MAX_RETRIES: 3,
  
  // 重试间隔（毫秒）
  RETRY_DELAY: 1000,
  
  // 默认用户代理
  DEFAULT_USER_AGENT: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  
  // 默认返回新闻数量限制
  DEFAULT_NEWS_LIMIT: 50,
  
  // 标题最大长度
  MAX_TITLE_LENGTH: 200,
  
  // 摘要最大长度
  MAX_SUMMARY_LENGTH: 300,
  
  // 并发请求数量限制
  MAX_CONCURRENT_REQUESTS: 5,
  
  // 请求间隔（毫秒）- 避免请求过快
  REQUEST_INTERVAL: 500
} as const

// ============================================================================
// 数据处理配置
// ============================================================================

export const DATA_PROCESSING = {
  // 文本清理规则
  TEXT_CLEANING: {
    // 是否移除HTML标签
    REMOVE_HTML_TAGS: true,
    
    // 是否合并多个空格
    MERGE_SPACES: true,
    
    // 是否移除换行符
    REMOVE_NEWLINES: true,
    
    // 是否去除首尾空格
    TRIM_WHITESPACE: true,
    
    // 特殊字符替换规则
    CHAR_REPLACEMENTS: {
      "&#8217;": "'",
      "&#8220;": '"',
      "&#8221;": '"',
      "&#8230;": "...",
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&nbsp;": " "
    }
  },
  
  // URL处理配置
  URL_PROCESSING: {
    // 是否自动补全相对URL
    AUTO_COMPLETE_RELATIVE_URLS: true,
    
    // 是否验证URL格式
    VALIDATE_URL_FORMAT: true,
    
    // 是否移除URL参数
    REMOVE_URL_PARAMS: false,
    
    // 需要移除的URL参数列表
    PARAMS_TO_REMOVE: ["utm_source", "utm_medium", "utm_campaign", "ref"]
  },
  
  // 去重配置
  DEDUPLICATION: {
    // 是否启用标题去重
    ENABLE_TITLE_DEDUP: true,
    
    // 是否启用URL去重
    ENABLE_URL_DEDUP: true,
    
    // 标题相似度阈值（0-1）
    TITLE_SIMILARITY_THRESHOLD: 0.8,
    
    // 是否忽略大小写
    IGNORE_CASE: true
  }
} as const

// ============================================================================
// 错误处理配置
// ============================================================================

export const ERROR_HANDLING = {
  // 是否在错误时返回空数组
  RETURN_EMPTY_ON_ERROR: true,
  
  // 是否记录错误日志
  LOG_ERRORS: true,
  
  // 错误日志级别
  ERROR_LOG_LEVEL: "warn" as "error" | "warn" | "info",
  
  // 网络错误重试配置
  NETWORK_ERROR_RETRY: {
    // 是否重试网络错误
    ENABLED: true,
    
    // 重试的错误类型
    RETRY_ERROR_TYPES: ["ECONNRESET", "ETIMEDOUT", "ENOTFOUND"],
    
    // 指数退避重试间隔
    EXPONENTIAL_BACKOFF: true
  },
  
  // 降级策略
  FALLBACK_STRATEGY: {
    // 是否启用降级
    ENABLED: true,
    
    // 降级数据源
    FALLBACK_SOURCES: [] as string[]
  }
} as const

// ============================================================================
// 缓存配置
// ============================================================================

export const CACHE_CONFIG = {
  // 是否启用缓存
  ENABLED: false,
  
  // 缓存过期时间（毫秒）
  EXPIRY_TIME: 5 * 60 * 1000, // 5分钟
  
  // 缓存键前缀
  KEY_PREFIX: "newsnow:cache:",
  
  // 最大缓存条目数
  MAX_ENTRIES: 1000,
  
  // 是否在错误时使用缓存
  USE_CACHE_ON_ERROR: true
} as const

// ============================================================================
// 特定源配置
// ============================================================================

export const SOURCE_SPECIFIC_CONFIG = {
  // RSS源配置
  RSS: {
    // 默认条目数量
    DEFAULT_LIMIT: 30,
    
    // 是否按时间排序
    SORT_BY_DATE: true,
    
    // 是否显示发布日期
    SHOW_PUBLISH_DATE: true,
    
    // RSS解析超时时间
    PARSE_TIMEOUT: 5000
  },
  
  // HTML抓取配置
  HTML_SCRAPING: {
    // 是否启用JavaScript渲染
    ENABLE_JS_RENDERING: false,
    
    // 页面加载等待时间（毫秒）
    PAGE_LOAD_WAIT: 2000,
    
    // 是否跟随重定向
    FOLLOW_REDIRECTS: true,
    
    // 最大重定向次数
    MAX_REDIRECTS: 5
  },
  
  // API调用配置
  API: {
    // 默认请求头
    DEFAULT_HEADERS: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    
    // 是否启用请求压缩
    ENABLE_COMPRESSION: true,
    
    // API密钥配置（从环境变量读取）
    API_KEYS: {
      // 示例：NEWS_API_KEY: process.env.NEWS_API_KEY
    }
  }
} as const

// ============================================================================
// 性能优化配置
// ============================================================================

export const PERFORMANCE_CONFIG = {
  // 并发控制
  CONCURRENCY: {
    // 最大并发数
    MAX_CONCURRENT: 10,
    
    // 队列大小限制
    QUEUE_SIZE_LIMIT: 100,
    
    // 是否启用请求池
    ENABLE_REQUEST_POOLING: true
  },
  
  // 内存管理
  MEMORY: {
    // 最大内存使用量（MB）
    MAX_MEMORY_USAGE: 512,
    
    // 是否启用垃圾回收
    ENABLE_GC: true,
    
    // GC触发阈值
    GC_THRESHOLD: 0.8
  },
  
  // 响应优化
  RESPONSE: {
    // 是否启用响应压缩
    ENABLE_COMPRESSION: true,
    
    // 压缩级别（1-9）
    COMPRESSION_LEVEL: 6,
    
    // 是否启用流式响应
    ENABLE_STREAMING: false
  }
} as const

// ============================================================================
// 监控和日志配置
// ============================================================================

export const MONITORING_CONFIG = {
  // 性能监控
  PERFORMANCE_MONITORING: {
    // 是否启用性能监控
    ENABLED: true,
    
    // 慢请求阈值（毫秒）
    SLOW_REQUEST_THRESHOLD: 5000,
    
    // 是否记录请求时间
    LOG_REQUEST_TIME: true
  },
  
  // 健康检查
  HEALTH_CHECK: {
    // 是否启用健康检查
    ENABLED: true,
    
    // 检查间隔（毫秒）
    CHECK_INTERVAL: 60000,
    
    // 失败阈值
    FAILURE_THRESHOLD: 3
  },
  
  // 日志配置
  LOGGING: {
    // 日志级别
    LEVEL: "info" as "debug" | "info" | "warn" | "error",
    
    // 是否记录请求详情
    LOG_REQUEST_DETAILS: false,
    
    // 是否记录响应详情
    LOG_RESPONSE_DETAILS: false,
    
    // 日志格式
    FORMAT: "json" as "json" | "text"
  }
} as const

// ============================================================================
// 开发和调试配置
// ============================================================================

export const DEBUG_CONFIG = {
  // 是否启用调试模式
  ENABLED: process.env.NODE_ENV === "development",
  
  // 是否显示详细错误信息
  VERBOSE_ERRORS: true,
  
  // 是否保存原始响应
  SAVE_RAW_RESPONSES: false,
  
  // 调试输出目录
  DEBUG_OUTPUT_DIR: "./debug",
  
  // 是否启用请求模拟
  ENABLE_MOCKING: false,
  
  // 模拟数据目录
  MOCK_DATA_DIR: "./mocks"
} as const

// ============================================================================
// 导出合并配置
// ============================================================================

export const NEWS_SOURCE_CONFIG = {
  BASE: BASE_CONFIG,
  DATA_PROCESSING,
  ERROR_HANDLING,
  CACHE: CACHE_CONFIG,
  SOURCE_SPECIFIC: SOURCE_SPECIFIC_CONFIG,
  PERFORMANCE: PERFORMANCE_CONFIG,
  MONITORING: MONITORING_CONFIG,
  DEBUG: DEBUG_CONFIG
} as const

// 类型导出
export type NewsSourceConfig = typeof NEWS_SOURCE_CONFIG
export type BaseConfig = typeof BASE_CONFIG
export type DataProcessingConfig = typeof DATA_PROCESSING
export type ErrorHandlingConfig = typeof ERROR_HANDLING
