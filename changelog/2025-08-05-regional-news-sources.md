# 版本变更记录 - 2025-08-05

## 新增地区新闻源

### 概述
本次更新添加了三个重要地区的新闻源，覆盖中国经济最活跃的三大区域：珠三角、长三角和京津冀地区。

### 新增功能

#### 1. 珠三角地区新闻源 (Pearl River Delta)
- **文件**: `server/sources/pearl-river-delta.ts`
- **主要源**:
  - 南方网·佛山频道 (`nanfang-foshan`)
  - 东莞阳光网 (`dongguan-sun`)
  - 珠江时报 (`zhujiang-times`)
  - 广州日报 (`guangzhou-daily`)
  - 佛山新闻网 (`foshan-news`)
- **特点**: 覆盖广州、深圳、佛山、东莞等珠三角核心城市的本地新闻

#### 2. 长三角地区新闻源 (Yangtze River Delta)
- **文件**: `server/sources/yangtze-river-delta.ts`
- **主要源**:
  - 解放日报·上观新闻 (`shobserver`)
  - 东方网 (`eastday`)
  - 新华日报·交汇点 (`jhnews`)
  - 现代快报 (`xdkb`)
  - 浙江在线 (`zjol`)
  - 杭州网 (`hangzhou-news`)
  - 安徽日报·中安在线 (`anhuinews`)
- **特点**: 覆盖上海、江苏、浙江、安徽等长三角地区的权威媒体

#### 3. 京津冀地区新闻源 (Beijing-Tianjin-Hebei)
- **文件**: `server/sources/beijing-tianjin-hebei.ts`
- **主要源**:
  - 千龙网 (`qianlong`)
  - 北方网 (`enorth`)
  - 长城网 (`hebnews`)
  - 京津冀网 (`jjjnews`)
  - 雄安官网 (`xiongan-gov`)
  - 天津日报 (`tianjin-daily`)
  - 河北日报 (`hebei-daily`)
  - 北京日报 (`beijing-daily`)
- **特点**: 覆盖北京、天津、河北三地协同发展的重要新闻

### 技术实现

#### 数据获取方式
1. **HTML 抓取**: 使用 Cheerio 解析静态网页内容
2. **RSS 订阅**: 通过 RSSHub 获取百家号等平台的内容
3. **错误处理**: 每个源都包含完善的错误处理机制

#### 配置文件更新
1. **源配置** (`shared/pre-sources.ts`):
   - 添加了三个主要地区源的配置
   - 每个地区包含多个子源
   - 设置了合适的刷新间隔和颜色主题

2. **类型定义** (`server/glob.d.ts`):
   - 添加了新源的 TypeScript 类型定义
   - 确保类型安全

#### 数据结构
每个新闻项包含以下字段：
- `id`: 唯一标识符（通常使用 URL）
- `title`: 新闻标题
- `url`: 新闻链接
- `extra.info`: 显示信息（时间或地区标识）
- `extra.hover`: 悬停提示信息

### 配置参数

#### 刷新间隔
- 所有地区新闻源使用 `Time.Common` (30分钟) 的刷新间隔
- 平衡了数据新鲜度和服务器负载

#### 颜色主题
- 珠三角: `emerald` (翠绿色)
- 长三角: `cyan` (青色)
- 京津冀: `amber` (琥珀色)

#### 分类归属
- 所有地区新闻源归类为 `china` 栏目
- 体现了本土新闻的特色

### 使用方法

#### API 访问
```bash
# 访问珠三角新闻
curl http://localhost:3000/api/pearl-river-delta

# 访问长三角新闻
curl http://localhost:3000/api/yangtze-river-delta

# 访问京津冀新闻
curl http://localhost:3000/api/beijing-tianjin-hebei

# 访问具体子源
curl http://localhost:3000/api/nanfang-foshan
curl http://localhost:3000/api/shobserver
curl http://localhost:3000/api/qianlong
```

#### 前端显示
新闻源会自动出现在对应的栏目中，用户可以：
- 查看各地区的综合新闻
- 选择特定的子源查看
- 享受统一的界面体验

### 质量保证

#### 数据验证
- 每个源都验证标题和 URL 的有效性
- 限制返回数量（通常为 30 条）
- 过滤无效或重复内容

#### 错误处理
- 网络请求失败时返回空数组而非抛出错误
- 记录详细的错误日志便于调试
- 确保单个源的失败不影响整体服务

#### 性能优化
- 使用合理的请求超时设置
- 限制并发请求数量
- 缓存机制减少重复请求

### 未来扩展

#### 可能的改进方向
1. **更多地区**: 可以继续添加其他重要经济区域
2. **移动端适配**: 为移动端用户提供专门的 URL
3. **个性化推荐**: 基于用户位置推荐相关地区新闻
4. **数据分析**: 统计各地区新闻的热度和趋势

#### 维护建议
1. **定期检查**: 监控各源的可用性和数据质量
2. **更新适配**: 当目标网站结构变化时及时更新解析逻辑
3. **用户反馈**: 收集用户对新闻源质量的反馈

### 依赖项
- `cheerio`: HTML 解析
- `@shared/types`: 类型定义
- RSSHub 服务: RSS 内容获取

### 测试建议
1. 运行开发服务器测试各源的数据获取
2. 检查返回数据的格式和完整性
3. 验证错误处理机制的有效性
4. 测试前端显示效果

---

**变更作者**: AI Assistant
**变更日期**: 2025-08-05
**影响范围**: 新增功能，无破坏性变更
**测试状态**: 待测试
