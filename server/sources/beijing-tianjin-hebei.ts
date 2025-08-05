import * as cheerio from "cheerio"
import type { NewsItem } from "@shared/types"

// 千龙网（北京）
const qianlong = defineSource(async () => {
  try {
    const baseURL = "http://www.qianlong.com"
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
            info: time || "北京本地",
            hover: `${title} - 千龙网`,
          },
        })
      }
    })

    return news.slice(0, 30)
  } catch (error) {
    console.error("千龙网获取失败:", error)
    return []
  }
})

// 北方网（天津）
const enorth = defineSource(async () => {
  try {
    const baseURL = "http://news.enorth.com.cn"
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
            info: time || "天津本地",
            hover: `${title} - 北方网`,
          },
        })
      }
    })

    return news.slice(0, 30)
  } catch (error) {
    console.error("北方网获取失败:", error)
    return []
  }
})

// 长城网（河北）
const hebnews = defineSource(async () => {
  try {
    const baseURL = "http://hebei.hebnews.cn"
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
            info: time || "河北本地",
            hover: `${title} - 长城网`,
          },
        })
      }
    })

    return news.slice(0, 30)
  } catch (error) {
    console.error("长城网获取失败:", error)
    return []
  }
})

// 京津冀网（门户）
const jjjnews = defineSource(async () => {
  try {
    const baseURL = "http://www.jjjnews.cn"
    const html: string = await myFetch(`${baseURL}/index.html`)
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
            info: time || "京津冀协同",
            hover: `${title} - 京津冀网`,
          },
        })
      }
    })

    return news.slice(0, 30)
  } catch (error) {
    console.error("京津冀网获取失败:", error)
    return []
  }
})

// 雄安官网·京津冀协同频道
const xionganGov = defineSource(async () => {
  try {
    const baseURL = "http://www.xiongan.gov.cn"
    const html: string = await myFetch(`${baseURL}/news/jjjxtfz.htm`)
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
            info: time || "雄安新区",
            hover: `${title} - 雄安官网`,
          },
        })
      }
    })

    return news.slice(0, 30)
  } catch (error) {
    console.error("雄安官网获取失败:", error)
    return []
  }
})

// 天津日报/今晚报（北方网子站）
const tianjinDaily = defineSource(async () => {
  try {
    const baseURL = "http://news.enorth.com.cn"
    const html: string = await myFetch(`${baseURL}/tjrb`)
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
            info: time || "天津日报",
            hover: `${title} - 天津日报`,
          },
        })
      }
    })

    return news.slice(0, 30)
  } catch (error) {
    console.error("天津日报获取失败:", error)
    return []
  }
})

// 河北日报（长城网子站）
const hebeiDaily = defineSource(async () => {
  try {
    const baseURL = "http://hebei.hebnews.cn"
    const html: string = await myFetch(`${baseURL}/node_124.htm`)
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
            info: time || "河北日报",
            hover: `${title} - 河北日报`,
          },
        })
      }
    })

    return news.slice(0, 30)
  } catch (error) {
    console.error("河北日报获取失败:", error)
    return []
  }
})

// 北京日报客户端（百家号）- 使用RSS方式
const beijingDaily = defineRSSHubSource("/baijiahao/author/北京日报", {
  limit: 30,
  sorted: true,
})

export default defineSource({
  "beijing-tianjin-hebei": qianlong,
  "qianlong": qianlong,
  "enorth": enorth,
  "hebnews": hebnews,
  "jjjnews": jjjnews,
  "xiongan-gov": xionganGov,
  "tianjin-daily": tianjinDaily,
  "hebei-daily": hebeiDaily,
  "beijing-daily": beijingDaily,
} as any)
