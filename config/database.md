# 数据库配置

## 支持的数据库

### 1. SQLite (本地开发)
```typescript
// nitro.config.ts
database: {
  default: {
    connector: "better-sqlite3",
  },
}
```

### 2. Cloudflare D1 (生产环境)
```typescript
// nitro.config.ts - CF_PAGES=1 时自动启用
database: {
  default: {
    connector: "cloudflare-d1",
    options: {
      bindingName: "NEWSNOW_DB",
    },
  },
}
```

### 3. MySQL (可选)
```typescript
// 需要自行配置连接信息
database: {
  default: {
    connector: "mysql2",
    options: {
      host: "localhost",
      user: "root",
      password: "password",
      database: "newsnow"
    },
  },
}
```

### 4. Bun SQLite
```typescript
// BUN=1 时自动启用
database: {
  default: {
    connector: "bun-sqlite",
  },
}
```

## Cloudflare D1 配置

### 1. 创建数据库
```bash
# 使用 Wrangler CLI
wrangler d1 create newsnow-db
```

### 2. 获取数据库 ID
创建后会返回数据库 ID，类似：
```
database_id = "f5ed4f60-6284-4ba3-8c9c-105312a2278c"
```

### 3. 更新 wrangler.toml
```toml
[[d1_databases]]
binding = "NEWSNOW_DB"
database_name = "newsnow-db"
database_id = "your-database-id"
```

### 4. 本地开发
```bash
# 创建本地数据库
wrangler d1 execute newsnow-db --local --file=./schema.sql

# 运行迁移
wrangler d1 migrations apply newsnow-db --local
```

## 数据库表结构

### 缓存表 (cache)
```sql
CREATE TABLE cache (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated INTEGER NOT NULL
);
```

### 用户表 (users)
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT,
  data TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now'))
);
```

## 数据库操作

### 初始化
```bash
# 设置环境变量
INIT_TABLE=true

# 启动应用，会自动创建表
pnpm dev
```

### 备份 (SQLite)
```bash
# 备份本地数据库
cp .data/db.sqlite3 backup/db-$(date +%Y%m%d).sqlite3
```

### 迁移 (D1)
```bash
# 创建迁移文件
wrangler d1 migrations create newsnow-db "add-new-column"

# 应用迁移
wrangler d1 migrations apply newsnow-db
```

## 性能优化

### 缓存策略
- 默认缓存 30 分钟
- 登录用户可强制刷新
- 自适应抓取间隔（最小 2 分钟）

### 索引优化
```sql
-- 为常用查询添加索引
CREATE INDEX idx_cache_updated ON cache(updated);
CREATE INDEX idx_users_email ON users(email);
```

## 故障排除

### 常见问题
1. **数据库连接失败**: 检查配置和权限
2. **表不存在**: 确保 INIT_TABLE=true
3. **D1 绑定失败**: 检查 wrangler.toml 配置
4. **本地开发数据库锁定**: 重启开发服务器

### 调试命令
```bash
# 检查 D1 数据库
wrangler d1 info newsnow-db

# 查看表结构
wrangler d1 execute newsnow-db --command="SELECT sql FROM sqlite_master WHERE type='table';"

# 查看数据
wrangler d1 execute newsnow-db --command="SELECT * FROM cache LIMIT 10;"
```
