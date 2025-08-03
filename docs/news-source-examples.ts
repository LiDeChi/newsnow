/**
 * 新闻数据获取方法示例文件
 *
 * 这个文件包含了各种类型的新闻源实现示例，供AI参考学习
 * 每个示例都包含详细的注释说明
 */

import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

// ============================================================================
// 示例1: 基础HTML抓取 - 适用于大多数新闻网站
// ============================================================================

/**
 * 基础HTML抓取示例
 * 适用场景：传统新闻网站，有规律的HTML结构
 */
const basicHtmlScraping = defineSource({
  "example-basic": async () => {
    // 1. 获取网页HTML
    const html = await myFetch("https://example-news.com")
    const $ = cheerio.load(html)
    const news: NewsItem[] = []

    // 2. 遍历新闻列表
    $(".news-list .news-item").each((_, el) => {
      const $item = $(el)

      // 3. 提取基本信息
      const title = $item.find(".title").text().trim()
      const url = $item.find(".title a").attr("href")
      const summary = $item.find(".summary").text().trim()
      const author = $item.find(".author").text().trim()
      const time = $item.find(".publish-time").text().trim()
      const viewCount = $item.find(".view-count").text().trim()

      // 4. 数据验证和清理
      if (!title || !url) return

      const cleanTitle = title
        .replace(/\n+/g, " ") // 替换换行符
        .replace(/\s+/g, " ") // 合并多个空格
        .trim() // 去除首尾空格
        .slice(0, 200) // 限制长度

      // 5. 构建完整URL
      const fullUrl = url.startsWith("http")
        ? url
        : `https://example-news.com${url}`

      // 6. 添加到结果数组
      news.push({
        id: url, // 使用URL作为唯一ID
        title: cleanTitle,
        url: fullUrl,
        extra: {
          hover: summary, // 悬停显示摘要
          info: `${author} · ${viewCount}`, // 显示作者和浏览量
          date: time, // 发布时间
        },
      })
    })

    return news.slice(0, 50) // 限制返回数量
  },
})

// ============================================================================
// 示例2: JSON API调用 - 适用于现代网站API
// ============================================================================

/**
 * JSON API调用示例
 * 适用场景：提供JSON API的现代网站
 */
interface ApiNewsResponse {
  code: number
  message: string
  data: {
    list: {
      id: number
      title: string
      url: string
      content: string
      author: string
      publish_time: string
      category: string
      tags: string[]
      view_count: number
      comment_count: number
    }[]
    total: number
  }
}

const jsonApiExample = defineSource({
  "example-api": async () => {
    // 1. 调用API
    const response: ApiNewsResponse = await myFetch("https://api.example.com/v1/news", {
      query: {
        page: 1,
        limit: 50,
        category: "tech",
      },
    })

    // 2. 检查响应状态
    if (response.code !== 200 || !response.data?.list) {
      throw new Error(`API返回错误: ${response.message}`)
    }

    // 3. 转换数据格式
    return response.data.list.map(item => ({
      id: item.id.toString(),
      title: item.title,
      url: item.url,
      pubDate: new Date(item.publish_time).getTime(),
      extra: {
        hover: `${item.content.slice(0, 200)}...`, // 截取内容作为预览
        info: `${item.view_count}浏览 · ${item.comment_count}评论`,
        icon: false, // 不显示图标
      },
    }))
  },
})

// ============================================================================
// 示例3: RSS源处理 - 适用于提供RSS的网站
// ============================================================================

/**
 * RSS源处理示例
 * 适用场景：提供RSS订阅的网站
 */
const rssExample = defineSource({
  // 使用内置RSS解析器
  "example-rss": defineRSSSource("https://example.com/rss.xml", {
    hiddenDate: false, // 显示发布日期
  }),

  // 使用RSSHub服务
  "example-rsshub": defineRSSHubSource("/example/route", {
    limit: 30, // 限制条目数量
    sorted: true, // 按时间排序
  }),
})

// ============================================================================
// 示例4: 复杂数据处理 - 需要多步骤处理的情况
// ============================================================================

/**
 * 复杂数据处理示例
 * 适用场景：需要多次请求或复杂数据转换的网站
 */
const complexProcessingExample = defineSource({
  "example-complex": async () => {
    const news: NewsItem[] = []

    try {
      // 1. 获取新闻列表页面
      const listHtml = await myFetch("https://complex-site.com/news")
      const $ = cheerio.load(listHtml)

      // 2. 提取新闻链接
      const newsLinks: string[] = []
      $(".news-item a").each((_, el) => {
        const href = $(el).attr("href")
        if (href) {
          newsLinks.push(href.startsWith("http") ? href : `https://complex-site.com${href}`)
        }
      })

      // 3. 并发获取详细信息（限制并发数）
      const batchSize = 5
      for (let i = 0; i < Math.min(newsLinks.length, 20); i += batchSize) {
        const batch = newsLinks.slice(i, i + batchSize)
        const batchResults = await Promise.allSettled(
          batch.map(async (url) => {
            const detailHtml = await myFetch(url)
            const $detail = cheerio.load(detailHtml)

            const title = $detail("h1").text().trim()
            const content = $detail(".content").text().trim()
            const author = $detail(".author").text().trim()
            const publishTime = $detail(".publish-time").attr("datetime")

            return {
              id: url,
              title,
              url,
              pubDate: publishTime ? new Date(publishTime).getTime() : undefined,
              extra: {
                hover: `${content.slice(0, 150)}...`,
                info: `作者: ${author}`,
              },
            }
          }),
        )

        // 4. 处理结果
        batchResults.forEach((result) => {
          if (result.status === "fulfilled" && result.value.title) {
            news.push(result.value)
          }
        })

        // 5. 添加延迟避免请求过快
        if (i + batchSize < newsLinks.length) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      }
    } catch (error) {
      console.error("获取复杂数据失败:", error)
      // 返回空数组而不是抛出错误
      return []
    }

    return news
  },
})

// ============================================================================
// 示例5: 多子源配置 - 一个网站多个频道
// ============================================================================

/**
 * 多子源配置示例
 * 适用场景：一个网站有多个不同的新闻频道或分类
 */
const multiSourceExample = defineSource({
  // 主源 - 综合新闻
  "example-multi": async () => {
    return await fetchNewsByCategory("all")
  },

  // 子源 - 科技新闻
  "example-multi-tech": async () => {
    return await fetchNewsByCategory("technology")
  },

  // 子源 - 财经新闻
  "example-multi-finance": async () => {
    return await fetchNewsByCategory("finance")
  },

  // 子源 - 体育新闻
  "example-multi-sports": async () => {
    return await fetchNewsByCategory("sports")
  },
})

// 辅助函数：按分类获取新闻
async function fetchNewsByCategory(category: string): Promise<NewsItem[]> {
  const url = `https://multi-source.com/api/news?category=${category}&limit=30`
  const response = await myFetch(url)

  return response.data.map((item: any) => ({
    id: item.id,
    title: item.title,
    url: item.link,
    pubDate: item.timestamp,
    extra: {
      info: `${category} · ${item.readCount}阅读`,
      hover: item.summary,
    },
  }))
}

// ============================================================================
// 示例6: 错误处理和重试机制
// ============================================================================

/**
 * 错误处理和重试机制示例
 * 适用场景：不稳定的数据源，需要重试和降级处理
 */
const errorHandlingExample = defineSource({
  "example-robust": async () => {
    const maxRetries = 3
    let lastError: Error | null = null

    // 尝试多个数据源
    const dataSources = [
      "https://primary-api.com/news",
      "https://backup-api.com/news",
      "https://fallback-site.com/rss",
    ]

    for (const source of dataSources) {
      for (let retry = 0; retry < maxRetries; retry++) {
        try {
          console.log(`尝试获取数据: ${source} (第${retry + 1}次)`)

          let data: any
          if (source.endsWith("/rss")) {
            // RSS源处理
            data = await rss2json(source)
            return data.items.map((item: any) => ({
              id: item.link,
              title: item.title,
              url: item.link,
              pubDate: item.created,
            }))
          } else {
            // API源处理
            data = await myFetch(source, {
              timeout: 5000 + retry * 2000, // 递增超时时间
            })
            return data.news.map((item: any) => ({
              id: item.id,
              title: item.title,
              url: item.url,
              extra: {
                info: item.category,
              },
            }))
          }
        } catch (error) {
          lastError = error as Error
          console.warn(`数据源 ${source} 第${retry + 1}次尝试失败:`, error)

          // 最后一次重试前等待更长时间
          if (retry < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, (retry + 1) * 1000))
          }
        }
      }
    }

    // 所有数据源都失败，记录错误并返回空数组
    console.error("所有数据源都失败了，最后错误:", lastError)
    return []
  },
})

// ============================================================================
// 示例7: 数据缓存和去重
// ============================================================================

/**
 * 数据缓存和去重示例
 * 适用场景：需要合并多个源或去除重复内容
 */
const cachingExample = defineSource({
  "example-cached": async () => {
    const allNews: NewsItem[] = []
    const seenUrls = new Set<string>()
    const seenTitles = new Set<string>()

    // 从多个API获取数据
    const apis = [
      "https://api1.example.com/news",
      "https://api2.example.com/latest",
      "https://api3.example.com/trending",
    ]

    const results = await Promise.allSettled(
      apis.map(api => myFetch(api)),
    )

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        const data = result.value

        data.items?.forEach((item: any) => {
          // 去重检查
          const normalizedTitle = item.title.toLowerCase().trim()
          if (seenUrls.has(item.url) || seenTitles.has(normalizedTitle)) {
            return
          }

          seenUrls.add(item.url)
          seenTitles.add(normalizedTitle)

          allNews.push({
            id: item.url,
            title: item.title,
            url: item.url,
            pubDate: item.publishTime,
            extra: {
              info: `来源${index + 1}`,
              hover: item.description,
            },
          })
        })
      }
    })

    // 按时间排序
    return allNews
      .sort((a, b) => {
        const timeA = a.pubDate ? new Date(a.pubDate).getTime() : 0
        const timeB = b.pubDate ? new Date(b.pubDate).getTime() : 0
        return timeB - timeA
      })
      .slice(0, 50)
  },
})

// ============================================================================
// 导出所有示例（实际使用时只需要导出一个）
// ============================================================================

export default defineSource({
  ...basicHtmlScraping,
  ...jsonApiExample,
  ...rssExample,
  ...complexProcessingExample,
  ...multiSourceExample,
  ...errorHandlingExample,
  ...cachingExample,
})
