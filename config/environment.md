# 环境变量配置

## 必需的环境变量

### GitHub OAuth 配置
```bash
# GitHub Client ID (必需，用于 OAuth 登录)
G_CLIENT_ID=your_github_client_id

# GitHub Client Secret (必需，用于 OAuth 登录)
G_CLIENT_SECRET=your_github_client_secret

# JWT Secret (必需，通常与 Client Secret 相同)
JWT_SECRET=your_jwt_secret

# 数据库初始化 (首次运行时必须设置为 true)
INIT_TABLE=true
```

## 可选的环境变量

### 部署平台检测
```bash
# Vercel 部署标识
VERCEL=1

# Cloudflare Pages 部署标识
CF_PAGES=1

# Bun 运行时标识
BUN=1
```

### 开发配置
```bash
# 开发模式端口
PORT=3000

# 开发模式主机
HOST=localhost
```

## 配置文件

### 本地开发 (.env.server)
```bash
# 复制示例文件
cp example.env.server .env.server

# 编辑配置
# G_CLIENT_ID=your_github_client_id
# G_CLIENT_SECRET=your_github_client_secret
# JWT_SECRET=your_jwt_secret
# INIT_TABLE=true
```

### Cloudflare Pages 环境变量
在 Cloudflare Pages 控制台设置：
1. 进入项目设置
2. 找到环境变量部分
3. 添加上述必需变量

### Vercel 环境变量
在 Vercel 控制台设置：
1. 进入项目设置
2. 找到环境变量部分
3. 添加上述必需变量

## GitHub App 创建步骤

1. 访问 [GitHub Apps](https://github.com/settings/applications/new)
2. 填写应用信息：
   - Application name: 你的应用名称
   - Homepage URL: 你的网站地址
   - Authorization callback URL: `https://your-domain.com/api/oauth/github`
3. 创建后获取 Client ID 和 Client Secret
4. 将这些值设置为环境变量

## 安全注意事项

1. **不要提交敏感信息到 Git**
2. **定期轮换密钥**
3. **使用强密码生成器生成 JWT_SECRET**
4. **生产环境使用不同的密钥**

## 故障排除

### 常见问题
1. **OAuth 登录失败**: 检查 GitHub App 配置和回调 URL
2. **JWT 验证失败**: 确保 JWT_SECRET 正确设置
3. **数据库初始化失败**: 确保 INIT_TABLE=true 且有写权限
