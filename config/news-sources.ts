/**
 * 新闻源配置参数
 * 统一管理所有可调节的参数
 */

// 通用配置
export const COMMON_CONFIG = {
  // 默认新闻条数限制
  DEFAULT_NEWS_LIMIT: 30,
  
  // 请求超时时间（毫秒）
  REQUEST_TIMEOUT: 10000,
  
  // 重试次数
  MAX_RETRIES: 3,
  
  // 用户代理
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
} as const

// 珠三角地区新闻源配置
export const PEARL_RIVER_DELTA_CONFIG = {
  // 南方网·佛山频道
  NANFANG_FOSHAN: {
    baseUrl: 'http://fs.southcn.com',
    newsLimit: 30,
    selectors: {
      newsItems: '.news-list .news-item, .content-list .item, .list-item',
      title: 'a',
      url: 'a',
      time: '.time, .date, .pub-time',
    },
    refreshInterval: 30 * 60 * 1000, // 30分钟
  },
  
  // 东莞阳光网
  DONGGUAN_SUN: {
    baseUrl: 'http://news.sun0769.com',
    newsLimit: 30,
    selectors: {
      newsItems: '.news-list li, .list-item, .news-item',
      title: 'a',
      url: 'a',
      time: '.time, .date',
    },
    refreshInterval: 30 * 60 * 1000,
  },
  
  // 珠江时报
  ZHUJIANG_TIMES: {
    baseUrl: 'http://szb.nanhaitoday.com',
    newsLimit: 30,
    selectors: {
      newsItems: '.news-list .item, .content-list li, .list-item',
      title: 'a',
      url: 'a',
      time: '.time, .date',
    },
    refreshInterval: 30 * 60 * 1000,
  },
  
  // RSS源配置
  RSS_SOURCES: {
    guangzhouDaily: {
      route: '/baijiahao/author/广州日报',
      limit: 30,
      sorted: true,
    },
    foshanNews: {
      route: '/baijiahao/author/佛山新闻网',
      limit: 30,
      sorted: true,
    },
  },
} as const

// 长三角地区新闻源配置
export const YANGTZE_RIVER_DELTA_CONFIG = {
  // 解放日报·上观新闻
  SHOBSERVER: {
    baseUrl: 'https://www.shobserver.com',
    newsPath: '/news',
    newsLimit: 30,
    selectors: {
      newsItems: '.news-list .item, .content-list li, h3 a',
      title: 'a, self',
      url: 'a, self',
    },
    refreshInterval: 30 * 60 * 1000,
  },
  
  // 东方网
  EASTDAY: {
    baseUrl: 'http://sh.eastday.com',
    newsLimit: 30,
    selectors: {
      newsItems: '.news-list .item, .content-list li, .list-item',
      title: 'a',
      url: 'a',
      time: '.time, .date',
    },
    refreshInterval: 30 * 60 * 1000,
  },
  
  // 新华日报·交汇点
  JHNEWS: {
    baseUrl: 'https://www.jhnews.com.cn',
    newsLimit: 30,
    selectors: {
      newsItems: '.news-list .item, .content-list li, .list-item',
      title: 'a',
      url: 'a',
      time: '.time, .date',
    },
    refreshInterval: 30 * 60 * 1000,
  },
  
  // 现代快报
  XDKB: {
    baseUrl: 'https://www.xdkb.net',
    newsLimit: 30,
    selectors: {
      newsItems: '.news-list .item, .content-list li, .list-item',
      title: 'a',
      url: 'a',
      time: '.time, .date',
    },
    refreshInterval: 30 * 60 * 1000,
  },
  
  // 浙江在线
  ZJOL: {
    baseUrl: 'http://zj.zjol.com.cn',
    newsLimit: 30,
    selectors: {
      newsItems: '.news-list .item, .content-list li, .list-item',
      title: 'a',
      url: 'a',
      time: '.time, .date',
    },
    refreshInterval: 30 * 60 * 1000,
  },
  
  // 杭州网
  HANGZHOU_NEWS: {
    baseUrl: 'http://news.hangzhou.com.cn',
    newsLimit: 30,
    selectors: {
      newsItems: '.news-list .item, .content-list li, .list-item',
      title: 'a',
      url: 'a',
      time: '.time, .date',
    },
    refreshInterval: 30 * 60 * 1000,
  },
  
  // 安徽日报·中安在线
  ANHUINEWS: {
    baseUrl: 'http://www.anhuinews.com',
    newsLimit: 30,
    selectors: {
      newsItems: '.news-list .item, .content-list li, .list-item',
      title: 'a',
      url: 'a',
      time: '.time, .date',
    },
    refreshInterval: 30 * 60 * 1000,
  },
} as const

// 京津冀地区新闻源配置
export const BEIJING_TIANJIN_HEBEI_CONFIG = {
  // 千龙网
  QIANLONG: {
    baseUrl: 'http://www.qianlong.com',
    newsLimit: 30,
    selectors: {
      newsItems: '.news-list .item, .content-list li, .list-item',
      title: 'a',
      url: 'a',
      time: '.time, .date',
    },
    refreshInterval: 30 * 60 * 1000,
  },
  
  // 北方网
  ENORTH: {
    baseUrl: 'http://news.enorth.com.cn',
    newsLimit: 30,
    selectors: {
      newsItems: '.news-list .item, .content-list li, .list-item',
      title: 'a',
      url: 'a',
      time: '.time, .date',
    },
    refreshInterval: 30 * 60 * 1000,
  },
  
  // 长城网
  HEBNEWS: {
    baseUrl: 'http://hebei.hebnews.cn',
    newsLimit: 30,
    selectors: {
      newsItems: '.news-list .item, .content-list li, .list-item',
      title: 'a',
      url: 'a',
      time: '.time, .date',
    },
    refreshInterval: 30 * 60 * 1000,
  },
  
  // 京津冀网
  JJJNEWS: {
    baseUrl: 'http://www.jjjnews.cn',
    newsPath: '/index.html',
    newsLimit: 30,
    selectors: {
      newsItems: '.news-list .item, .content-list li, .list-item',
      title: 'a',
      url: 'a',
      time: '.time, .date',
    },
    refreshInterval: 30 * 60 * 1000,
  },
  
  // 雄安官网
  XIONGAN_GOV: {
    baseUrl: 'http://www.xiongan.gov.cn',
    newsPath: '/news/jjjxtfz.htm',
    newsLimit: 30,
    selectors: {
      newsItems: '.news-list .item, .content-list li, .list-item',
      title: 'a',
      url: 'a',
      time: '.time, .date',
    },
    refreshInterval: 30 * 60 * 1000,
  },
  
  // 天津日报
  TIANJIN_DAILY: {
    baseUrl: 'http://news.enorth.com.cn',
    newsPath: '/tjrb',
    newsLimit: 30,
    selectors: {
      newsItems: '.news-list .item, .content-list li, .list-item',
      title: 'a',
      url: 'a',
      time: '.time, .date',
    },
    refreshInterval: 30 * 60 * 1000,
  },
  
  // 河北日报
  HEBEI_DAILY: {
    baseUrl: 'http://hebei.hebnews.cn',
    newsPath: '/node_124.htm',
    newsLimit: 30,
    selectors: {
      newsItems: '.news-list .item, .content-list li, .list-item',
      title: 'a',
      url: 'a',
      time: '.time, .date',
    },
    refreshInterval: 30 * 60 * 1000,
  },
  
  // RSS源配置
  RSS_SOURCES: {
    beijingDaily: {
      route: '/baijiahao/author/北京日报',
      limit: 30,
      sorted: true,
    },
  },
} as const

// RSSHub 配置
export const RSSHUB_CONFIG = {
  // RSSHub 基础 URL
  BASE_URL: 'https://rsshub.rssforever.com',
  
  // 默认参数
  DEFAULT_OPTIONS: {
    format: 'json',
    sorted: true,
    limit: 30,
  },
  
  // 请求超时
  TIMEOUT: 10000,
} as const

// 错误处理配置
export const ERROR_CONFIG = {
  // 是否在控制台输出错误日志
  LOG_ERRORS: true,
  
  // 错误时返回的默认值
  DEFAULT_RETURN: [],
  
  // 错误重试间隔（毫秒）
  RETRY_DELAY: 1000,
} as const
