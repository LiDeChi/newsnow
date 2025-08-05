#!/bin/bash

# NewsNow 项目依赖安装脚本
# 用于安装项目所需的所有依赖

echo "🚀 开始安装 NewsNow 项目依赖..."

# 检查 Node.js 版本
echo "📋 检查 Node.js 版本..."
node_version=$(node -v)
echo "当前 Node.js 版本: $node_version"

# 检查 pnpm 是否安装
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm 未安装，正在安装 pnpm..."
    npm install -g pnpm
else
    echo "✅ pnpm 已安装"
fi

# 显示 pnpm 版本
pnpm_version=$(pnpm -v)
echo "当前 pnpm 版本: $pnpm_version"

# 安装项目依赖
echo "📦 安装项目依赖..."
pnpm install

# 检查关键依赖是否正确安装
echo "🔍 检查关键依赖..."

# 检查新闻源相关依赖
dependencies=(
    "cheerio"
    "dayjs"
    "ofetch"
    "fast-xml-parser"
    "defu"
    "h3"
    "consola"
)

for dep in "${dependencies[@]}"; do
    if pnpm list "$dep" &> /dev/null; then
        echo "✅ $dep 已安装"
    else
        echo "❌ $dep 未安装，正在安装..."
        pnpm add "$dep"
    fi
done

# 检查开发依赖
echo "🛠️  检查开发依赖..."
dev_dependencies=(
    "tsx"
    "vite"
    "typescript"
    "@types/node"
)

for dep in "${dev_dependencies[@]}"; do
    if pnpm list "$dep" &> /dev/null; then
        echo "✅ $dep 已安装"
    else
        echo "❌ $dep 未安装，正在安装..."
        pnpm add -D "$dep"
    fi
done

# 运行类型检查
echo "🔧 运行类型检查..."
pnpm run typecheck

# 生成源文件
echo "📝 生成源文件..."
pnpm run presource

echo "🎉 依赖安装完成！"
echo ""
echo "📋 下一步操作："
echo "1. 运行开发服务器: pnpm run dev"
echo "2. 构建项目: pnpm run build"
echo "3. 运行测试: pnpm run test"
echo ""
echo "🌐 新增的地区新闻源："
echo "- 珠三角地区新闻源"
echo "- 长三角地区新闻源"
echo "- 京津冀地区新闻源"
echo ""
echo "📚 查看变更记录: changelog/2025-08-05-regional-news-sources.md"
