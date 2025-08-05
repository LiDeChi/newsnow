import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

// 解放日报·上观新闻
const shobserver = defineSource(async () => {
  try {
    const baseURL = "https://www.shobserver.com"
    const html: string = await myFetch(`${baseURL}/news`)
    const $ = cheerio.load(html)
    const news: NewsItem[] = []

    // 提取新闻列表
    $(".news-list .item, .content-list li, h3 a").each((_, el) => {
      const $item = $(el)
      let title = ""
      let url = ""

      if ($item.is("a")) {
        title = $item.text().trim()
        url = $item.attr("href") || ""
      } else {
        const titleEl = $item.find("a").first()
        title = titleEl.text().trim()
        url = titleEl.attr("href") || ""
      }

      if (title && url) {
        const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`
        news.push({
          id: fullUrl,
          title,
          url: fullUrl,
          extra: {
            info: "上海本地",
            hover: `${title} - 解放日报·上观新闻`,
          },
        })
      }
    })

    return news.slice(0, 30)
  } catch (error) {
    console.error("解放日报·上观新闻获取失败:", error)
    return []
  }
})

// 东方网
const eastday = defineSource(async () => {
  try {
    const baseURL = "http://sh.eastday.com"
    const html: string = await myFetch(baseURL)
    const $ = cheerio.load(html)
    const news: NewsItem[] = []

    // 提取新闻列表
    $(".news-list .item, .content-list li, .list-item").each((_, el) => {
      const $item = $(el)
      const titleEl = $item.find("a").first()
      const title = titleEl.text().trim()
      const url = titleEl.attr("href")
      const timeEl = $item.find(".time, .date")
      const time = timeEl.text().trim()

      if (title && url) {
        const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`
        news.push({
          id: fullUrl,
          title,
          url: fullUrl,
          extra: {
            info: time || "上海本地",
            hover: `${title} - 东方网`,
          },
        })
      }
    })

    return news.slice(0, 30)
  } catch (error) {
    console.error("东方网获取失败:", error)
    return []
  }
})

// 新华日报·交汇点
const jhnews = defineSource(async () => {
  try {
    const baseURL = "https://www.jhnews.com.cn"
    const html: string = await myFetch(baseURL)
    const $ = cheerio.load(html)
    const news: NewsItem[] = []

    // 提取新闻列表
    $(".news-list .item, .content-list li, .list-item").each((_, el) => {
      const $item = $(el)
      const titleEl = $item.find("a").first()
      const title = titleEl.text().trim()
      const url = titleEl.attr("href")
      const timeEl = $item.find(".time, .date")
      const time = timeEl.text().trim()

      if (title && url) {
        const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`
        news.push({
          id: fullUrl,
          title,
          url: fullUrl,
          extra: {
            info: time || "江苏本地",
            hover: `${title} - 新华日报·交汇点`,
          },
        })
      }
    })

    return news.slice(0, 30)
  } catch (error) {
    console.error("新华日报·交汇点获取失败:", error)
    return []
  }
})

// 现代快报
const xdkb = defineSource(async () => {
  try {
    const baseURL = "https://www.xdkb.net"
    const html: string = await myFetch(baseURL)
    const $ = cheerio.load(html)
    const news: NewsItem[] = []

    // 提取新闻列表
    $(".news-list .item, .content-list li, .list-item").each((_, el) => {
      const $item = $(el)
      const titleEl = $item.find("a").first()
      const title = titleEl.text().trim()
      const url = titleEl.attr("href")
      const timeEl = $item.find(".time, .date")
      const time = timeEl.text().trim()

      if (title && url) {
        const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`
        news.push({
          id: fullUrl,
          title,
          url: fullUrl,
          extra: {
            info: time || "江苏本地",
            hover: `${title} - 现代快报`,
          },
        })
      }
    })

    return news.slice(0, 30)
  } catch (error) {
    console.error("现代快报获取失败:", error)
    return []
  }
})

// 浙江在线
const zjol = defineSource(async () => {
  try {
    const baseURL = "http://zj.zjol.com.cn"
    const html: string = await myFetch(baseURL)
    const $ = cheerio.load(html)
    const news: NewsItem[] = []

    // 提取新闻列表
    $(".news-list .item, .content-list li, .list-item").each((_, el) => {
      const $item = $(el)
      const titleEl = $item.find("a").first()
      const title = titleEl.text().trim()
      const url = titleEl.attr("href")
      const timeEl = $item.find(".time, .date")
      const time = timeEl.text().trim()

      if (title && url) {
        const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`
        news.push({
          id: fullUrl,
          title,
          url: fullUrl,
          extra: {
            info: time || "浙江本地",
            hover: `${title} - 浙江在线`,
          },
        })
      }
    })

    return news.slice(0, 30)
  } catch (error) {
    console.error("浙江在线获取失败:", error)
    return []
  }
})

// 杭州网
const hangzhouNews = defineSource(async () => {
  try {
    const baseURL = "http://news.hangzhou.com.cn"
    const html: string = await myFetch(baseURL)
    const $ = cheerio.load(html)
    const news: NewsItem[] = []

    // 提取新闻列表
    $(".news-list .item, .content-list li, .list-item").each((_, el) => {
      const $item = $(el)
      const titleEl = $item.find("a").first()
      const title = titleEl.text().trim()
      const url = titleEl.attr("href")
      const timeEl = $item.find(".time, .date")
      const time = timeEl.text().trim()

      if (title && url) {
        const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`
        news.push({
          id: fullUrl,
          title,
          url: fullUrl,
          extra: {
            info: time || "杭州本地",
            hover: `${title} - 杭州网`,
          },
        })
      }
    })

    return news.slice(0, 30)
  } catch (error) {
    console.error("杭州网获取失败:", error)
    return []
  }
})

// 安徽日报·中安在线
const anhuinews = defineSource(async () => {
  try {
    const baseURL = "http://www.anhuinews.com"
    const html: string = await myFetch(baseURL)
    const $ = cheerio.load(html)
    const news: NewsItem[] = []

    // 提取新闻列表
    $(".news-list .item, .content-list li, .list-item").each((_, el) => {
      const $item = $(el)
      const titleEl = $item.find("a").first()
      const title = titleEl.text().trim()
      const url = titleEl.attr("href")
      const timeEl = $item.find(".time, .date")
      const time = timeEl.text().trim()

      if (title && url) {
        const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`
        news.push({
          id: fullUrl,
          title,
          url: fullUrl,
          extra: {
            info: time || "安徽本地",
            hover: `${title} - 安徽日报·中安在线`,
          },
        })
      }
    })

    return news.slice(0, 30)
  } catch (error) {
    console.error("安徽日报·中安在线获取失败:", error)
    return []
  }
})

export default defineSource({
  "yangtze-river-delta": shobserver,
  "yangtze-river-delta-shobserver": shobserver,
  "yangtze-river-delta-eastday": eastday,
  "yangtze-river-delta-jhnews": jhnews,
  "yangtze-river-delta-xdkb": xdkb,
  "yangtze-river-delta-zjol": zjol,
  "yangtze-river-delta-hangzhou-news": hangzhouNews,
  "yangtze-river-delta-anhuinews": anhuinews,
} as any)
