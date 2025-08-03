#!/usr/bin/env node

/**
 * NewsNow 数据导出脚本
 *
 * 用法:
 * node scripts/export-news-data.js [选项]
 *
 * 选项:
 * --source <id>     导出特定新闻源 (如: weibo, zhihu)
 * --format <type>   输出格式 (json, csv, txt) 默认: json
 * --output <dir>    输出目录 默认: ./exports
 * --recent <hours>  只导出最近N小时的数据
 * --all             导出所有数据 (默认)
 * --help            显示帮助信息
 *
 * 示例:
 * node scripts/export-news-data.js --source weibo --format json
 * node scripts/export-news-data.js --recent 24 --output ./backup
 * node scripts/export-news-data.js --all --format csv
 */

const fs = require("node:fs")
const path = require("node:path")
const process = require("node:process")
const { program } = require("commander")

// 检查是否安装了 better-sqlite3
let Database
try {
  Database = require("better-sqlite3")
} catch {
  console.error("❌ 错误: 未找到 better-sqlite3 模块")
  console.error("请运行: npm install better-sqlite3")
  process.exit(1)
}

// 配置命令行参数
program
  .name("export-news-data")
  .description("NewsNow 数据导出工具")
  .version("1.0.0")
  .option("-s, --source <id>", "导出特定新闻源")
  .option("-f, --format <type>", "输出格式 (json, csv, txt)", "json")
  .option("-o, --output <dir>", "输出目录", "./exports")
  .option("-r, --recent <hours>", "只导出最近N小时的数据", Number.parseInt)
  .option("-a, --all", "导出所有数据", true)
  .option("--db-path <path>", "数据库文件路径", ".data/db.sqlite3")
  .parse()

const options = program.opts()

// 检查数据库文件是否存在
function checkDatabase(dbPath) {
  if (!fs.existsSync(dbPath)) {
    console.error(`❌ 错误: 数据库文件不存在: ${dbPath}`)
    console.error("请确保 NewsNow 项目已运行并生成了数据库文件")
    process.exit(1)
  }
}

// 创建输出目录
function ensureOutputDir(outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
    console.log(`📁 创建输出目录: ${outputDir}`)
  }
}

// 格式化时间戳
function formatTimestamp(timestamp) {
  return new Date(timestamp).toISOString()
}

// 获取缓存数据
function getCacheData(db, sourceId = null, recentHours = null) {
  let query = "SELECT id, updated, data FROM cache"
  const params = []

  if (sourceId) {
    query += " WHERE id = ?"
    params.push(sourceId)
  }

  if (recentHours) {
    const cutoffTime = Date.now() - (recentHours * 60 * 60 * 1000)
    if (sourceId) {
      query += " AND updated > ?"
    } else {
      query += " WHERE updated > ?"
    }
    params.push(cutoffTime)
  }

  query += " ORDER BY updated DESC"

  try {
    const stmt = db.prepare(query)
    return stmt.all(...params)
  } catch (error) {
    console.error("❌ 数据库查询错误:", error.message)
    return []
  }
}

// 处理数据
function processData(rows) {
  const processedData = {}
  let totalItems = 0

  rows.forEach((row) => {
    try {
      const newsData = JSON.parse(row.data)
      processedData[row.id] = {
        sourceId: row.id,
        updated: row.updated,
        updatedTime: formatTimestamp(row.updated),
        count: newsData.length,
        items: newsData,
      }
      totalItems += newsData.length
    } catch (error) {
      console.warn(`⚠️  警告: ${row.id} 的数据格式错误:`, error.message)
      processedData[row.id] = {
        sourceId: row.id,
        updated: row.updated,
        updatedTime: formatTimestamp(row.updated),
        count: 0,
        items: [],
        error: "数据格式错误",
      }
    }
  })

  return { processedData, totalItems }
}

// 导出为 JSON 格式
function exportAsJSON(data, outputPath) {
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf8")
}

// 导出为 CSV 格式
function exportAsCSV(data, outputPath) {
  const csvLines = ["Source,Title,URL,PubDate,UpdatedTime"]

  Object.values(data).forEach((source) => {
    source.items.forEach((item) => {
      const line = [
        source.sourceId,
        `"${(item.title || "").replace(/"/g, "\"\"")}"`,
        item.url || "",
        item.pubDate || "",
        source.updatedTime,
      ].join(",")
      csvLines.push(line)
    })
  })

  fs.writeFileSync(outputPath, csvLines.join("\n"), "utf8")
}

// 导出为 TXT 格式
function exportAsTXT(data, outputPath) {
  const txtLines = []

  Object.values(data).forEach((source) => {
    txtLines.push(`\n=== ${source.sourceId.toUpperCase()} ===`)
    txtLines.push(`更新时间: ${source.updatedTime}`)
    txtLines.push(`新闻数量: ${source.count}`)
    txtLines.push("")

    source.items.forEach((item, index) => {
      txtLines.push(`${index + 1}. ${item.title}`)
      txtLines.push(`   链接: ${item.url}`)
      if (item.pubDate) {
        txtLines.push(`   发布: ${formatTimestamp(item.pubDate)}`)
      }
      txtLines.push("")
    })
  })

  fs.writeFileSync(outputPath, txtLines.join("\n"), "utf8")
}

// 主导出函数
function exportData(data, format, outputDir, filename) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)
  const baseFilename = filename || `news_export_${timestamp}`

  switch (format.toLowerCase()) {
    case "json": {
      const jsonPath = path.join(outputDir, `${baseFilename}.json`)
      exportAsJSON(data, jsonPath)
      console.log(`📄 JSON 文件已保存: ${jsonPath}`)
      break
    }

    case "csv": {
      const csvPath = path.join(outputDir, `${baseFilename}.csv`)
      exportAsCSV(data, csvPath)
      console.log(`📊 CSV 文件已保存: ${csvPath}`)
      break
    }

    case "txt": {
      const txtPath = path.join(outputDir, `${baseFilename}.txt`)
      exportAsTXT(data, txtPath)
      console.log(`📝 TXT 文件已保存: ${txtPath}`)
      break
    }

    default:
      console.error(`❌ 不支持的格式: ${format}`)
      console.error("支持的格式: json, csv, txt")
      process.exit(1)
  }
}

// 显示统计信息
function showStats(processedData, totalItems) {
  console.log("\n📊 导出统计:")
  console.log(`新闻源数量: ${Object.keys(processedData).length}`)
  console.log(`新闻总数: ${totalItems}`)

  console.log("\n📋 各新闻源详情:")
  Object.values(processedData).forEach((source) => {
    const status = source.error ? "❌" : "✅"
    console.log(`${status} ${source.sourceId}: ${source.count} 条新闻 (${source.updatedTime})`)
  })
}

// 主函数
function main() {
  console.log("🚀 NewsNow 数据导出工具启动\n")

  // 检查数据库
  checkDatabase(options.dbPath)

  // 创建输出目录
  ensureOutputDir(options.output)

  // 连接数据库
  console.log(`📂 连接数据库: ${options.dbPath}`)
  const db = new Database(options.dbPath, { readonly: true })

  try {
    // 获取数据
    console.log("🔍 查询数据...")
    const rows = getCacheData(db, options.source, options.recent)

    if (rows.length === 0) {
      console.log("⚠️  未找到匹配的数据")
      return
    }

    // 处理数据
    console.log("⚙️  处理数据...")
    const { processedData, totalItems } = processData(rows)

    // 导出数据
    console.log("💾 导出数据...")
    const filename = options.source
      ? `${options.source}_${new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)}`
      : null

    exportData(processedData, options.format, options.output, filename)

    // 显示统计
    showStats(processedData, totalItems)

    console.log("\n✅ 导出完成!")
  } catch (error) {
    console.error("❌ 导出过程中发生错误:", error.message)
    process.exit(1)
  } finally {
    db.close()
  }
}

// 错误处理
process.on("uncaughtException", (error) => {
  console.error("❌ 未捕获的异常:", error.message)
  process.exit(1)
})

process.on("unhandledRejection", (reason) => {
  console.error("❌ 未处理的 Promise 拒绝:", reason)
  process.exit(1)
})

// 运行主函数
if (require.main === module) {
  main()
}

module.exports = {
  getCacheData,
  processData,
  exportData,
}
