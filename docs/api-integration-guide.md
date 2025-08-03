# NewsNow API 集成指南

## 概述

本文档详细说明了其他应用如何合法地从 NewsNow 项目获取新闻数据。NewsNow 提供了多种 API 接口，支持不同的认证方式和数据获取需求。

## 核心 API 端点

### 1. 获取单个新闻源数据

**端点**: `GET /api/s`

**描述**: 获取指定新闻源的最新数据

**参数**:
- `id` (必需): 新闻源 ID，如 `weibo`, `zhihu`, `v2ex` 等
- `latest` (可选): 是否强制获取最新数据，默认为 `false`

**示例请求**:
```bash
curl "https://your-domain.com/api/s?id=weibo&latest=true"
```

**响应格式**:
```json
{
  "status": "success",
  "id": "weibo",
  "updatedTime": 1703123456789,
  "items": [
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
}
```

### 2. 批量获取多个新闻源数据

**端点**: `POST /api/s/entire`

**描述**: 一次性获取多个新闻源的数据

**请求体**:
```json
{
  "sources": ["weibo", "zhihu", "v2ex"]
}
```

**示例请求**:
```bash
curl -X POST "https://your-domain.com/api/s/entire" \
  -H "Content-Type: application/json" \
  -d '{"sources": ["weibo", "zhihu", "v2ex"]}'
```

**响应格式**:
```json
[
  {
    "status": "cache",
    "id": "weibo",
    "items": [...],
    "updatedTime": 1703123456789
  },
  {
    "status": "success",
    "id": "zhihu",
    "items": [...],
    "updatedTime": 1703123456789
  }
]
```

### 3. 获取版本信息

**端点**: `GET /api/latest`

**描述**: 获取当前 API 版本信息

**示例请求**:
```bash
curl "https://your-domain.com/api/latest"
```

**响应格式**:
```json
{
  "v": "1.0.0"
}
```

### 4. 图片代理服务

**端点**: `GET /api/proxy/img.png`

**描述**: 代理获取图片资源，解决跨域问题

**参数**:
- `url` (必需): 图片 URL（需要编码）
- `type` (可选): 编码类型，默认为 `encodeURIComponent`

**示例请求**:
```bash
curl "https://your-domain.com/api/proxy/img.png?url=https%3A//example.com/image.jpg"
```

## 认证机制

### 1. 无认证访问

对于基本的新闻数据获取，无需认证即可访问：
- `/api/s` - 获取新闻数据
- `/api/proxy` - 图片代理
- `/api/latest` - 版本信息

### 2. JWT 认证（可选）

对于需要强制刷新缓存或访问用户相关功能，需要 JWT 认证：

**获取 JWT Token**:
1. 通过 GitHub OAuth 登录: `GET /api/login`
2. 回调处理: `GET /api/oauth/github`
3. 获取到 JWT Token

**使用 JWT Token**:
```bash
curl "https://your-domain.com/api/s?id=weibo&latest=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 3. 检查登录状态

**端点**: `GET /api/enable-login`

**描述**: 检查是否启用了登录功能

**响应格式**:
```json
{
  "enable": true,
  "url": "https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID"
}
```

## 可用的新闻源 ID

常用的新闻源 ID 包括：

### 社交媒体
- `weibo` - 微博热搜
- `weibo-realtime` - 微博实时
- `zhihu` - 知乎热榜
- `v2ex` - V2EX 热门

### 科技资讯
- `36kr` - 36氪
- `ithome` - IT之家
- `cnbeta` - cnBeta

### 财经新闻
- `wallstreetcn` - 华尔街见闻
- `fastbull` - 快牛财经
- `mktnews` - 市场新闻

### 其他
- `douban-movie` - 豆瓣电影
- `github-trending` - GitHub 趋势

*完整的新闻源列表可以通过查看项目源码中的 `shared/sources.ts` 文件获取*

## 数据模型

### NewsItem 接口

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

### SourceResponse 接口

```typescript
interface SourceResponse {
  status: "success" | "cache" // 数据状态
  id: SourceID // 新闻源 ID
  updatedTime: number | string // 更新时间
  items: NewsItem[] // 新闻项目列表
}
```

## 错误处理

### 常见错误码

- `400` - 请求参数错误
- `401` - 认证失败（需要 JWT Token）
- `404` - 新闻源不存在
- `500` - 服务器内部错误
- `506` - 服务器配置错误（未配置登录）

### 错误响应格式

```json
{
  "statusCode": 400,
  "statusMessage": "Bad Request",
  "message": "Invalid source id"
}
```

## 使用限制和最佳实践

### 1. 缓存机制
- 默认缓存时间：30分钟
- 建议客户端也实现缓存，避免频繁请求
- 登录用户可以通过 `latest=true` 参数强制刷新

### 2. 请求频率限制
- 建议请求间隔不少于 2 分钟
- 批量请求优于单个请求
- 避免在短时间内大量请求

### 3. 数据处理建议
- 检查 `status` 字段判断数据来源（缓存或实时）
- 处理可选字段（如 `pubDate`, `extra` 等）
- 实现容错机制处理网络异常

### 4. 跨域处理
- API 支持 CORS
- 图片资源可通过 `/api/proxy/img.png` 代理获取

## MCP (Model Context Protocol) 支持

NewsNow 还支持 MCP 协议，可以作为 AI 助手的工具使用：

### 配置示例

```json
{
  "mcpServers": {
    "newsnow": {
      "command": "npx",
      "args": ["-y", "newsnow-mcp-server"],
      "env": {
        "BASE_URL": "https://your-domain.com"
      }
    }
  }
}
```

### 可用工具

- `get_hotest_latest_news`: 获取指定新闻源的热门或最新新闻

## 部署和配置

### 环境变量配置

如果需要完整功能（包括登录和缓存），需要配置以下环境变量：

```env
# GitHub OAuth 配置
G_CLIENT_ID=your_github_client_id
G_CLIENT_SECRET=your_github_client_secret

# JWT 密钥
JWT_SECRET=your_jwt_secret

# 数据库初始化
INIT_TABLE=true

# 启用缓存
ENABLE_CACHE=true
```

### 数据库支持

- 推荐使用 Cloudflare D1 数据库
- 支持 MySQL（需要额外配置）
- 本地开发可使用 SQLite

## 示例代码

### JavaScript/Node.js

```javascript
// 获取单个新闻源
async function getNewsSource(sourceId) {
  const response = await fetch(`https://your-domain.com/api/s?id=${sourceId}`)
  const data = await response.json()
  return data
}

// 批量获取新闻源
async function getMultipleSources(sourceIds) {
  const response = await fetch("https://your-domain.com/api/s/entire", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sources: sourceIds }),
  })
  const data = await response.json()
  return data
}

// 使用示例
getNewsSource("weibo").then((data) => {
  console.log("微博热搜:", data.items)
})

getMultipleSources(["weibo", "zhihu"]).then((data) => {
  data.forEach((source) => {
    console.log(`${source.id}:`, source.items)
  })
})
```

### Python

```python
import requests
import json

class NewsNowClient:
    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')

    def get_source(self, source_id, latest=False):
        """获取单个新闻源"""
        params = {'id': source_id}
        if latest:
            params['latest'] = 'true'

        response = requests.get(f'{self.base_url}/api/s', params=params)
        response.raise_for_status()
        return response.json()

    def get_multiple_sources(self, source_ids):
        """批量获取新闻源"""
        data = {'sources': source_ids}
        response = requests.post(
            f'{self.base_url}/api/s/entire',
            json=data,
            headers={'Content-Type': 'application/json'}
        )
        response.raise_for_status()
        return response.json()

# 使用示例
client = NewsNowClient('https://your-domain.com')

# 获取微博热搜
weibo_news = client.get_source('weibo')
print(f"微博热搜: {len(weibo_news['items'])} 条")

# 批量获取
multiple_news = client.get_multiple_sources(['weibo', 'zhihu', 'v2ex'])
for source in multiple_news:
    print(f"{source['id']}: {len(source['items'])} 条新闻")
```

## 技术支持

如果在集成过程中遇到问题：

1. 查看项目 GitHub 仓库的 Issues
2. 参考项目文档和示例代码
3. 检查服务器日志和错误信息
4. 确认环境变量和配置正确

## 许可证

请遵守项目的开源许可证要求，合理使用 API 服务。
