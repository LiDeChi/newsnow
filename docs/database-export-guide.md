# 数据库数据导出指南

## 概述

NewsNow 项目使用数据库缓存新闻数据，你可以直接从数据库导出数据，这比调用 API 更加直接和高效。

## 数据库类型支持

### 1. SQLite (本地开发)
- 数据库文件位置: `.data/db.sqlite3`
- 适用于本地开发和小规模部署

### 2. Cloudflare D1 (生产环境)
- 云端数据库，需要使用 Wrangler CLI 访问
- 适用于 Cloudflare Pages 部署

### 3. MySQL (可选)
- 需要配置连接信息
- 适用于自建服务器部署

## 数据表结构

### 缓存表 (cache)
```sql
-- 存储各个新闻源的缓存数据
CREATE TABLE cache (
  id TEXT PRIMARY KEY,      -- 新闻源ID (weibo, zhihu, v2ex 等)
  data TEXT NOT NULL,       -- JSON格式的新闻数据
  updated INTEGER NOT NULL  -- 更新时间戳 (毫秒)
);
```

### 用户表 (user)
```sql
-- 存储用户信息和配置
CREATE TABLE user (
  id TEXT PRIMARY KEY,      -- 用户ID
  email TEXT,              -- 邮箱
  data TEXT,               -- 用户配置数据(JSON)
  type TEXT,               -- 登录类型(github)
  created INTEGER,         -- 创建时间戳
  updated INTEGER          -- 更新时间戳
);
```

## 数据导出方法

### 方法1: SQLite 直接导出

如果使用 SQLite 数据库，可以直接操作数据库文件：

```bash
# 1. 查看所有新闻源
sqlite3 .data/db.sqlite3 "SELECT id, updated FROM cache ORDER BY updated DESC;"

# 2. 导出所有缓存数据
sqlite3 .data/db.sqlite3 "SELECT * FROM cache;" > news_cache.csv

# 3. 导出特定新闻源
sqlite3 .data/db.sqlite3 "SELECT data FROM cache WHERE id='weibo';" > weibo_news.json

# 4. 导出最近更新的数据
sqlite3 .data/db.sqlite3 "SELECT id, data FROM cache WHERE updated > $(date -d '1 hour ago' +%s)000;"
```

### 方法2: Cloudflare D1 导出

如果使用 Cloudflare D1 数据库：

```bash
# 1. 查看数据库信息
wrangler d1 info newsnow-db

# 2. 导出所有缓存数据
wrangler d1 execute newsnow-db --command "SELECT * FROM cache;" --output json > news_cache.json

# 3. 导出特定新闻源
wrangler d1 execute newsnow-db --command "SELECT data FROM cache WHERE id='weibo';" --output json > weibo_news.json

# 4. 本地数据库操作
wrangler d1 execute newsnow-db --local --command "SELECT * FROM cache;"
```

### 方法3: MySQL 导出

如果使用 MySQL 数据库：

```bash
# 1. 导出所有缓存数据
mysqldump -h localhost -u newsnow -p newsnow cache > cache_backup.sql

# 2. 导出为 CSV 格式
mysql -h localhost -u newsnow -p -e "SELECT * FROM cache;" newsnow > news_cache.csv

# 3. 导出特定新闻源的 JSON 数据
mysql -h localhost -u newsnow -p -e "SELECT data FROM cache WHERE id='weibo';" newsnow > weibo_news.txt
```

## 数据格式说明

### 缓存数据格式

每个新闻源的 `data` 字段包含 JSON 格式的新闻列表：

```json
[
  {
    "id": "unique-id",
    "title": "新闻标题",
    "url": "https://example.com/news/1",
    "mobileUrl": "https://m.example.com/news/1",
    "pubDate": 1703123456789,
    "extra": {
      "hover": "悬停显示的描述",
      "date": 1703123456789,
      "info": "热度信息",
      "diff": 100,
      "icon": {
        "url": "https://example.com/icon.png",
        "scale": 1.0
      }
    }
  }
]
```

### 时间戳说明

- `updated` 字段: 缓存更新时间（毫秒时间戳）
- `pubDate` 字段: 新闻发布时间（毫秒时间戳）

转换为可读时间：
```bash
# Linux/Mac
date -d @$(echo "1703123456789" | cut -c1-10)

# 或使用 JavaScript
node -e "console.log(new Date(1703123456789))"
```

## 自动化导出脚本

### Shell 脚本示例

```bash
#!/bin/bash
# export_news.sh - 自动导出新闻数据

DB_PATH=".data/db.sqlite3"
OUTPUT_DIR="./exports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 创建输出目录
mkdir -p $OUTPUT_DIR

# 导出所有缓存数据
echo "导出所有缓存数据..."
sqlite3 $DB_PATH "SELECT id, updated, data FROM cache;" > "$OUTPUT_DIR/all_cache_$TIMESTAMP.csv"

# 导出各个新闻源
echo "导出各个新闻源..."
for source in weibo zhihu v2ex 36kr ithome; do
  sqlite3 $DB_PATH "SELECT data FROM cache WHERE id='$source';" > "$OUTPUT_DIR/${source}_$TIMESTAMP.json"
done

# 导出最近1小时的数据
echo "导出最近1小时的数据..."
HOUR_AGO=$(($(date +%s) - 3600))000
sqlite3 $DB_PATH "SELECT id, data FROM cache WHERE updated > $HOUR_AGO;" > "$OUTPUT_DIR/recent_$TIMESTAMP.csv"

echo "导出完成，文件保存在 $OUTPUT_DIR 目录"
```

### Python 脚本示例

```python
#!/usr/bin/env python3
# export_news.py - Python 数据导出脚本

import sqlite3
import json
import os
from datetime import datetime

def export_news_data(db_path=".data/db.sqlite3", output_dir="./exports"):
    """导出新闻数据"""

    # 创建输出目录
    os.makedirs(output_dir, exist_ok=True)

    # 连接数据库
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # 获取所有缓存数据
    cursor.execute("SELECT id, updated, data FROM cache")
    rows = cursor.fetchall()

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # 导出所有数据
    all_data = {}
    for row in rows:
        source_id, updated, data = row
        try:
            news_data = json.loads(data)
            all_data[source_id] = {
                "updated": updated,
                "updated_time": datetime.fromtimestamp(updated/1000).isoformat(),
                "count": len(news_data),
                "items": news_data
            }
        except json.JSONDecodeError:
            print(f"警告: {source_id} 的数据格式错误")

    # 保存所有数据
    with open(f"{output_dir}/all_news_{timestamp}.json", "w", encoding="utf-8") as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)

    # 分别保存各个新闻源
    for source_id, data in all_data.items():
        with open(f"{output_dir}/{source_id}_{timestamp}.json", "w", encoding="utf-8") as f:
            json.dump(data["items"], f, ensure_ascii=False, indent=2)

    conn.close()
    print(f"导出完成，共 {len(all_data)} 个新闻源，文件保存在 {output_dir} 目录")

    return all_data

if __name__ == "__main__":
    export_news_data()
```

### Node.js 脚本示例

```javascript
// export_news.js - Node.js 数据导出脚本
const fs = require("node:fs")
const path = require("node:path")
const Database = require("better-sqlite3")

function exportNewsData(dbPath = ".data/db.sqlite3", outputDir = "./exports") {
  // 创建输出目录
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // 连接数据库
  const db = new Database(dbPath)

  // 获取所有缓存数据
  const rows = db.prepare("SELECT id, updated, data FROM cache").all()

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)
  const allData = {}

  // 处理数据
  rows.forEach((row) => {
    try {
      const newsData = JSON.parse(row.data)
      allData[row.id] = {
        updated: row.updated,
        updatedTime: new Date(row.updated).toISOString(),
        count: newsData.length,
        items: newsData
      }
    } catch (error) {
      console.warn(`警告: ${row.id} 的数据格式错误`)
    }
  })

  // 保存所有数据
  fs.writeFileSync(
    path.join(outputDir, `all_news_${timestamp}.json`),
    JSON.stringify(allData, null, 2)
  )

  // 分别保存各个新闻源
  Object.entries(allData).forEach(([sourceId, data]) => {
    fs.writeFileSync(
      path.join(outputDir, `${sourceId}_${timestamp}.json`),
      JSON.stringify(data.items, null, 2)
    )
  })

  db.close()
  console.log(`导出完成，共 ${Object.keys(allData).length} 个新闻源，文件保存在 ${outputDir} 目录`)

  return allData
}

// 运行导出
if (require.main === module) {
  exportNewsData()
}

module.exports = { exportNewsData }
```

## 数据同步策略

### 1. 定时导出
```bash
# 添加到 crontab，每小时导出一次
0 * * * * /path/to/export_news.sh

# 每天凌晨备份完整数据
0 0 * * * /path/to/full_backup.sh
```

### 2. 实时监控
```bash
# 监控数据库文件变化
inotifywait -m .data/db.sqlite3 -e modify --format '%T' --timefmt '%Y-%m-%d %H:%M:%S' | while read time; do
  echo "数据库更新于: $time"
  ./export_news.sh
done
```

### 3. API 触发导出
可以创建一个 API 端点来触发数据导出：

```typescript
// server/api/export.ts
export default defineEventHandler(async (event) => {
  const db = useDatabase()
  const rows = await db.prepare("SELECT id, updated, data FROM cache").all()

  const exportData = rows.map(row => ({
    source: row.id,
    updated: row.updated,
    updatedTime: new Date(row.updated).toISOString(),
    data: JSON.parse(row.data)
  }))

  return {
    timestamp: new Date().toISOString(),
    count: exportData.length,
    data: exportData
  }
})
```

## 注意事项

### 1. 数据时效性
- 缓存数据有时效性，默认30分钟更新一次
- 检查 `updated` 字段确认数据新鲜度
- 过期数据可能不是最新的新闻

### 2. 数据完整性
- 某些新闻源可能暂时无法访问
- 检查 `data` 字段是否为空或格式错误
- 建议结合多个新闻源获取完整信息

### 3. 性能考虑
- 大量数据导出可能影响数据库性能
- 建议在低峰期进行批量导出
- 使用索引优化查询性能

### 4. 数据隐私
- 用户表包含个人信息，导出时需注意隐私保护
- 建议只导出缓存表的新闻数据
- 遵守相关数据保护法规

## 总结

通过直接访问数据库，你可以：

1. **获取所有新闻源的缓存数据**
2. **批量导出特定时间段的新闻**
3. **实现自动化的数据同步**
4. **避免 API 调用限制**

这种方法比调用 API 更加直接和高效，特别适合需要大量数据或实时同步的场景。
