#!/bin/bash

# NewsNow 快速数据导出脚本
# 
# 这个脚本提供了几种常用的数据导出方式
# 使用前请确保项目已运行并生成了数据库文件

set -e  # 遇到错误立即退出

# 配置
DB_PATH=".data/db.sqlite3"
OUTPUT_DIR="./exports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查依赖
check_dependencies() {
    print_info "检查依赖..."
    
    # 检查 sqlite3 命令
    if ! command -v sqlite3 &> /dev/null; then
        print_error "sqlite3 命令未找到，请安装 SQLite"
        exit 1
    fi
    
    # 检查数据库文件
    if [ ! -f "$DB_PATH" ]; then
        print_error "数据库文件不存在: $DB_PATH"
        print_info "请确保 NewsNow 项目已运行并生成了数据库文件"
        exit 1
    fi
    
    # 检查 Node.js (如果要使用 JS 脚本)
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js 版本: $NODE_VERSION"
    else
        print_warning "Node.js 未安装，将只使用 SQLite 命令导出"
    fi
}

# 创建输出目录
create_output_dir() {
    if [ ! -d "$OUTPUT_DIR" ]; then
        mkdir -p "$OUTPUT_DIR"
        print_success "创建输出目录: $OUTPUT_DIR"
    fi
}

# 显示数据库统计信息
show_stats() {
    print_info "数据库统计信息:"
    
    # 总缓存条目数
    TOTAL_CACHE=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM cache;")
    print_info "缓存条目总数: $TOTAL_CACHE"
    
    # 各新闻源统计
    print_info "各新闻源缓存情况:"
    sqlite3 "$DB_PATH" "
        SELECT 
            id as '新闻源',
            datetime(updated/1000, 'unixepoch', 'localtime') as '更新时间',
            length(data) as '数据大小(字节)'
        FROM cache 
        ORDER BY updated DESC;
    " -header -column
}

# 导出所有数据为 JSON
export_all_json() {
    print_info "导出所有数据为 JSON 格式..."
    
    OUTPUT_FILE="$OUTPUT_DIR/all_news_$TIMESTAMP.json"
    
    # 使用 SQLite JSON 功能导出
    sqlite3 "$DB_PATH" "
        SELECT json_object(
            'timestamp', datetime('now'),
            'sources', json_group_array(
                json_object(
                    'id', id,
                    'updated', updated,
                    'updatedTime', datetime(updated/1000, 'unixepoch'),
                    'data', json(data)
                )
            )
        )
        FROM cache;
    " > "$OUTPUT_FILE"
    
    print_success "JSON 文件已保存: $OUTPUT_FILE"
}

# 导出特定新闻源
export_source() {
    local source_id="$1"
    
    if [ -z "$source_id" ]; then
        print_error "请指定新闻源 ID"
        return 1
    fi
    
    print_info "导出新闻源: $source_id"
    
    # 检查新闻源是否存在
    EXISTS=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM cache WHERE id='$source_id';")
    if [ "$EXISTS" -eq 0 ]; then
        print_error "新闻源 '$source_id' 不存在"
        return 1
    fi
    
    OUTPUT_FILE="$OUTPUT_DIR/${source_id}_$TIMESTAMP.json"
    
    sqlite3 "$DB_PATH" "
        SELECT json_object(
            'sourceId', id,
            'updated', updated,
            'updatedTime', datetime(updated/1000, 'unixepoch'),
            'data', json(data)
        )
        FROM cache 
        WHERE id='$source_id';
    " > "$OUTPUT_FILE"
    
    print_success "新闻源数据已保存: $OUTPUT_FILE"
}

# 导出最近的数据
export_recent() {
    local hours="${1:-24}"  # 默认24小时
    
    print_info "导出最近 $hours 小时的数据..."
    
    # 计算时间戳
    CUTOFF_TIME=$(($(date +%s) - hours * 3600))000
    
    OUTPUT_FILE="$OUTPUT_DIR/recent_${hours}h_$TIMESTAMP.json"
    
    sqlite3 "$DB_PATH" "
        SELECT json_object(
            'timeRange', '${hours} hours',
            'cutoffTime', datetime($CUTOFF_TIME/1000, 'unixepoch'),
            'sources', json_group_array(
                json_object(
                    'id', id,
                    'updated', updated,
                    'updatedTime', datetime(updated/1000, 'unixepoch'),
                    'data', json(data)
                )
            )
        )
        FROM cache 
        WHERE updated > $CUTOFF_TIME;
    " > "$OUTPUT_FILE"
    
    print_success "最近数据已保存: $OUTPUT_FILE"
}

# 导出为 CSV 格式
export_csv() {
    print_info "导出为 CSV 格式..."
    
    OUTPUT_FILE="$OUTPUT_DIR/news_summary_$TIMESTAMP.csv"
    
    # 导出摘要信息
    sqlite3 "$DB_PATH" "
        .mode csv
        .headers on
        SELECT 
            id as 'Source',
            datetime(updated/1000, 'unixepoch', 'localtime') as 'Updated',
            length(data) as 'DataSize',
            CASE 
                WHEN updated > (strftime('%s', 'now') - 3600) * 1000 THEN 'Fresh'
                WHEN updated > (strftime('%s', 'now') - 86400) * 1000 THEN 'Recent'
                ELSE 'Old'
            END as 'Status'
        FROM cache 
        ORDER BY updated DESC;
    " > "$OUTPUT_FILE"
    
    print_success "CSV 文件已保存: $OUTPUT_FILE"
}

# 使用 Node.js 脚本导出 (如果可用)
export_with_nodejs() {
    if ! command -v node &> /dev/null; then
        print_warning "Node.js 未安装，跳过 Node.js 脚本导出"
        return
    fi
    
    if [ ! -f "scripts/export-news-data.js" ]; then
        print_warning "Node.js 导出脚本不存在，跳过"
        return
    fi
    
    print_info "使用 Node.js 脚本导出..."
    
    # 检查是否安装了必要的依赖
    if [ ! -d "node_modules/better-sqlite3" ]; then
        print_warning "better-sqlite3 未安装，请运行: npm install better-sqlite3"
        return
    fi
    
    if [ ! -d "node_modules/commander" ]; then
        print_warning "commander 未安装，请运行: npm install commander"
        return
    fi
    
    # 运行 Node.js 脚本
    node scripts/export-news-data.js --all --format json --output "$OUTPUT_DIR"
}

# 清理旧的导出文件
cleanup_old_exports() {
    print_info "清理7天前的导出文件..."
    
    if [ -d "$OUTPUT_DIR" ]; then
        find "$OUTPUT_DIR" -name "*.json" -mtime +7 -delete 2>/dev/null || true
        find "$OUTPUT_DIR" -name "*.csv" -mtime +7 -delete 2>/dev/null || true
        print_success "清理完成"
    fi
}

# 显示帮助信息
show_help() {
    echo "NewsNow 快速数据导出脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  all                    导出所有数据 (默认)"
    echo "  source <id>           导出特定新闻源"
    echo "  recent [hours]        导出最近N小时的数据 (默认24小时)"
    echo "  csv                   导出为CSV格式"
    echo "  stats                 显示数据库统计信息"
    echo "  nodejs                使用Node.js脚本导出"
    echo "  cleanup               清理旧的导出文件"
    echo "  help                  显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 all                # 导出所有数据"
    echo "  $0 source weibo       # 导出微博数据"
    echo "  $0 recent 12          # 导出最近12小时的数据"
    echo "  $0 csv                # 导出CSV格式"
    echo "  $0 stats              # 显示统计信息"
}

# 主函数
main() {
    echo "🚀 NewsNow 快速数据导出工具"
    echo "================================"
    
    # 检查依赖
    check_dependencies
    
    # 创建输出目录
    create_output_dir
    
    # 根据参数执行相应操作
    case "${1:-all}" in
        "all")
            export_all_json
            ;;
        "source")
            export_source "$2"
            ;;
        "recent")
            export_recent "$2"
            ;;
        "csv")
            export_csv
            ;;
        "stats")
            show_stats
            ;;
        "nodejs")
            export_with_nodejs
            ;;
        "cleanup")
            cleanup_old_exports
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "未知选项: $1"
            show_help
            exit 1
            ;;
    esac
    
    echo ""
    print_success "操作完成!"
}

# 运行主函数
main "$@"
