import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

// 南方网·佛山频道
const nanfangFoshan = defineSource(async () => {
  try {
    const baseURL = "http://fs.southcn.com"
    const html: string = await myFetch(baseURL)
    const $ = cheerio.load(html)
    const news: NewsItem[] = []

    // 提取新闻列表
    $(".news-list .news-item, .content-list .item, .list-item").each((_, el) => {
      const $item = $(el)
      const titleEl = $item.find("a").first()
      const title = titleEl.text().trim()
      const url = titleEl.attr("href")
      const timeEl = $item.find(".time, .date, .pub-time")
      const time = timeEl.text().trim()

      if (title && url) {
        const fullUrl = url.startsWith("http") ? url : `${baseURL}${url}`
        news.push({
          id: fullUrl,
          title,
          url: fullUrl,
          extra: {
            info: time || "佛山本地",
            hover: `${title} - 南方网佛山频道`,
          },
        })
      }
    })

    return news.slice(0, 30)
  } catch (error) {
    console.error("南方网佛山频道获取失败:", error)
    return []
  }
})

// 东莞阳光网
const dongguanSun = defineSource(async () => {
  try {
    const baseURL = "http://news.sun0769.com"
    const html: string = await myFetch(baseURL)
    const $ = cheerio.load(html)
    const news: NewsItem[] = []

    // 提取新闻列表
    $(".news-list li, .list-item, .news-item").each((_, el) => {
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
            info: time || "东莞本地",
            hover: `${title} - 东莞阳光网`,
          },
        })
      }
    })

    return news.slice(0, 30)
  } catch (error) {
    console.error("东莞阳光网获取失败:", error)
    return []
  }
})

// 珠江时报电子版
const zhujiangTimes = defineSource(async () => {
  try {
    const baseURL = "http://szb.nanhaitoday.com"
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
            info: time || "佛山南海",
            hover: `${title} - 珠江时报`,
          },
        })
      }
    })

    return news.slice(0, 30)
  } catch (error) {
    console.error("珠江时报获取失败:", error)
    return []
  }
})

// 广州日报百家号 (使用RSS方式)
const guangzhouDaily = defineRSSHubSource("/baijiahao/author/广州日报", {
  limit: 30,
  sorted: true,
})

// 佛山新闻网百家号 (使用RSS方式)
const foshanNews = defineRSSHubSource("/baijiahao/author/佛山新闻网", {
  limit: 30,
  sorted: true,
})

export default defineSource({
  "pearl-river-delta": nanfangFoshan,
  "nanfang-foshan": nanfangFoshan,
  "dongguan-sun": dongguanSun,
  "zhujiang-times": zhujiangTimes,
  "guangzhou-daily": guangzhouDaily,
  "foshan-news": foshanNews,
} as any)
