/**
 * 配置文件统一导出
 * 提供项目所有配置的统一入口
 */

export * from './news-sources'

// 重新导出主要配置对象，便于使用
export {
  COMMON_CONFIG,
  PEARL_RIVER_DELTA_CONFIG,
  YANGTZE_RIVER_DELTA_CONFIG,
  BEIJING_TIANJIN_HEBEI_CONFIG,
  RSSHUB_CONFIG,
  ERROR_CONFIG,
} from './news-sources'

// 配置版本信息
export const CONFIG_VERSION = '1.0.0'
export const CONFIG_LAST_UPDATED = '2025-08-05'

// 配置使用说明
export const CONFIG_USAGE = {
  description: '新闻源配置参数管理',
  usage: {
    import: "import { COMMON_CONFIG, PEARL_RIVER_DELTA_CONFIG } from '@/config'",
    example: "const limit = COMMON_CONFIG.DEFAULT_NEWS_LIMIT",
  },
  regions: [
    '珠三角地区 (PEARL_RIVER_DELTA_CONFIG)',
    '长三角地区 (YANGTZE_RIVER_DELTA_CONFIG)', 
    '京津冀地区 (BEIJING_TIANJIN_HEBEI_CONFIG)',
  ],
} as const
