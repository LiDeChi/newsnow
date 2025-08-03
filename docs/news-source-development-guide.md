# 新闻数据获取方法开发指南

## 概述

本文档详细说明了如何在 NewsNow 项目中添加新的新闻数据源。NewsNow 是一个聚合新闻应用，支持从多个网站获取新闻数据。

## 核心概念

### 1. 数据结构

每个新闻项目必须符合 `NewsItem` 接口：

```typescript
interface NewsItem {
  id: string | number // 唯一标识符
  title: string // 新闻标题
  url: string // 新闻链接
  mobileUrl?: string // 移动端链接（可选）
  pubDate?: number | string // 发布时间（可选）
  extra?: { // 额外信息（可选）
    hover?: string // 悬停显示的描述
    date?: number | string // 日期
    info?: false | string // 显示信息（如热度、评论数）
    diff?: number // 差异值
    icon?: false | string | { // 图标
      url: string
      scale: number
    }
  }
}
```

### 2. 源定义函数

使用 `defineSource` 函数来定义新闻源：

```typescript
// 单个源
export default defineSource(async () => {
  // 获取数据逻辑
  return newsItems
})

// 多个子源
export default defineSource({
  "source-name": async () => { /* 逻辑 */ },
  "source-name-sub": async () => { /* 逻辑 */ }
})
```

## 开发步骤

### 1. 创建新闻源文件

在 `server/sources/` 目录下创建新文件，文件名应该是小写的源名称，如 `example.ts`。

### 2. 基本模板

```typescript
import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource({
  "source-id": async () => {
    // 1. 获取数据
    const html = await myFetch("https://example.com/api")

    // 2. 解析数据
    const $ = cheerio.load(html)
    const news: NewsItem[] = []

    // 3. 提取新闻项
    $(".news-item").each((_, el) => {
      const title = $(el).find(".title").text().trim()
      const url = $(el).find("a").attr("href")
      const id = url || title

      if (title && url) {
        news.push({
          id,
          title,
          url,
          extra: {
            info: $(el).find(".meta").text().trim()
          }
        })
      }
    })

    return news
  }
})
```

### 3. 数据获取方法

#### 方法一：HTML 抓取（使用 Cheerio）

```typescript
import * as cheerio from "cheerio"

const html = await myFetch("https://example.com")
const $ = cheerio.load(html)

// 选择器示例
$(".news-list .item").each((_, el) => {
  const title = $(el).find("h3").text().trim()
  const url = $(el).find("a").attr("href")
  const desc = $(el).find(".desc").text().trim()
})
```

#### 方法二：API 调用

```typescript
interface ApiResponse {
  data: {
    title: string
    link: string
    description: string
  }[]
}

const response: ApiResponse = await myFetch("https://api.example.com/news")
const news = response.data.map(item => ({
  id: item.link,
  title: item.title,
  url: item.link,
  extra: {
    hover: item.description
  }
}))
```

#### 方法三：RSS 源

```typescript
// 使用内置的 RSS 解析器
export default defineSource({
  "rss-source": defineRSSSource("https://example.com/rss.xml")
})

// 或使用 RSSHub
export default defineSource({
  "rsshub-source": defineRSSHubSource("/example/route")
})
```

### 4. 常见数据处理

#### 文本清理

```typescript
const title = $(el).find("h3").text().replace(/\n+/g, " ").replace(/\s+/g, " ").trim() // 去除首尾空格
```

#### URL 处理

```typescript
const baseURL = "https://example.com"
const relativeUrl = $(el).find("a").attr("href")
const fullUrl = relativeUrl?.startsWith("http")
  ? relativeUrl
  : `${baseURL}${relativeUrl}`
```

#### 时间处理

```typescript
import dayjs from "dayjs"

const timeText = $(el).find(".time").text()
const pubDate = dayjs(timeText).valueOf()
```

## 实际示例

### 示例1：简单的 HTML 抓取

```typescript
// server/sources/example-news.ts
import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

export default defineSource({
  "example-news": async () => {
    const html = await myFetch("https://example-news.com")
    const $ = cheerio.load(html)
    const news: NewsItem[] = []

    $(".news-list .news-item").each((_, el) => {
      const $item = $(el)
      const title = $item.find(".title a").text().trim()
      const url = $item.find(".title a").attr("href")
      const summary = $item.find(".summary").text().trim()
      const time = $item.find(".time").text().trim()

      if (title && url) {
        news.push({
          id: url,
          title,
          url: url.startsWith("http") ? url : `https://example-news.com${url}`,
          extra: {
            hover: summary,
            info: time
          }
        })
      }
    })

    return news
  }
})
```

### 示例2：API 数据获取

```typescript
// server/sources/api-news.ts
interface NewsResponse {
  status: string
  data: {
    id: number
    title: string
    url: string
    excerpt: string
    publish_time: string
    view_count: number
  }[]
}

export default defineSource({
  "api-news": async () => {
    const response: NewsResponse = await myFetch("https://api.example.com/v1/news")

    return response.data.map(item => ({
      id: item.id.toString(),
      title: item.title,
      url: item.url,
      pubDate: item.publish_time,
      extra: {
        hover: item.excerpt,
        info: `${item.view_count} 次浏览`
      }
    }))
  }
})
```

## 配置和注册

### 1. 更新全局类型定义

在 `server/glob.d.ts` 中添加新源的类型定义：

```typescript
declare module "glob:./sources/{*.ts,**/index.ts}" {
  // ... 其他源
  export const exampleNews: typeof import("./sources/example-news")
}
```

### 2. 在源配置中注册

新闻源会自动被系统发现和加载，但需要在 `shared/pre-sources.ts` 中配置元数据。

## 最佳实践

### 1. 错误处理

```typescript
export default defineSource({
  source: async () => {
    try {
      const data = await myFetch("https://example.com")
      // 处理数据
      return news
    } catch (error) {
      console.error("获取数据失败:", error)
      return [] // 返回空数组而不是抛出错误
    }
  }
})
```

### 2. 数据验证

```typescript
const news: NewsItem[] = []

items.forEach((item) => {
  if (!item.title || !item.url) {
    return // 跳过无效数据
  }

  news.push({
    id: item.url,
    title: item.title.slice(0, 200), // 限制标题长度
    url: item.url
  })
})
```

### 3. 性能优化

```typescript
// 限制返回数量
const news = allNews.slice(0, 50)

// 使用并发请求（如果需要多个API调用）
const [data1, data2] = await Promise.all([
  myFetch("https://api1.example.com"),
  myFetch("https://api2.example.com")
])
```

## 调试和测试

### 1. 本地测试

```bash
# 运行开发服务器
npm run dev

# 访问特定源的API端点
curl http://localhost:3000/api/source-id
```

### 2. 日志调试

```typescript
export default defineSource({
  source: async () => {
    console.log("开始获取数据...")
    const data = await myFetch("https://example.com")
    console.log("获取到数据:", data.length, "条")
    return news
  }
})
```

## 常见问题

### 1. 跨域问题

如果遇到跨域问题，可以使用代理：

```typescript
import { proxySource } from "#/utils/source"

export default defineSource({
  source: proxySource("https://proxy.example.com/api", async () => {
    // 原始逻辑
  })
})
```

### 2. 反爬虫机制

- 使用合适的 User-Agent（已在 `myFetch` 中配置）
- 添加适当的延迟
- 使用代理服务器

### 3. 数据格式不一致

```typescript
// 统一处理不同的时间格式
function normalizeDate(dateStr: string) {
  if (!dateStr) return undefined

  // 处理各种时间格式
  if (dateStr.includes("分钟前")) {
    const minutes = Number.parseInt(dateStr)
    return Date.now() - minutes * 60 * 1000
  }

  return dayjs(dateStr).valueOf()
}
```

## 总结

添加新的新闻源主要包括：

1. 创建源文件并实现数据获取逻辑
2. 确保返回的数据符合 `NewsItem` 接口
3. 处理错误和边界情况
4. 在配置文件中注册新源
5. 测试和调试

遵循这些指南，您可以轻松地为 NewsNow 添加新的新闻数据源。
