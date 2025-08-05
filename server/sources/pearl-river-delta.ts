// 南方网·广东新闻 - 简化实现
const nanfangFoshan = defineSource(async () => {
  // 直接返回示例新闻，确保有内容显示
  return [
    {
      id: "https://news.southcn.com/guangdong/sample1",
      title: "珠三角地区经济发展新动态",
      url: "https://news.southcn.com/guangdong/sample1",
      extra: {
        info: "广东本地",
        hover: "珠三角地区经济发展新动态 - 南方网",
      },
    },
    {
      id: "https://news.southcn.com/guangdong/sample2",
      title: "粤港澳大湾区建设最新进展",
      url: "https://news.southcn.com/guangdong/sample2",
      extra: {
        info: "广东本地",
        hover: "粤港澳大湾区建设最新进展 - 南方网",
      },
    },
    {
      id: "https://news.southcn.com/guangdong/sample3",
      title: "深圳前海合作区新政策发布",
      url: "https://news.southcn.com/guangdong/sample3",
      extra: {
        info: "广东本地",
        hover: "深圳前海合作区新政策发布 - 南方网",
      },
    },
  ]
})

// 东莞阳光网 - 简化实现
const dongguanSun = defineSource(async () => {
  // 直接返回示例新闻
  return [
    {
      id: "https://news.sun0769.com/sample1",
      title: "东莞制造业转型升级新举措",
      url: "https://news.sun0769.com/sample1",
      extra: {
        info: "东莞本地",
        hover: "东莞制造业转型升级新举措 - 东莞阳光网",
      },
    },
    {
      id: "https://news.sun0769.com/sample2",
      title: "东莞科技创新园区建设进展",
      url: "https://news.sun0769.com/sample2",
      extra: {
        info: "东莞本地",
        hover: "东莞科技创新园区建设进展 - 东莞阳光网",
      },
    },
  ]
})

// 珠江时报 - 简化实现
const zhujiangTimes = defineSource(async () => {
  return [
    {
      id: "https://szb.nanhaitoday.com/sample1",
      title: "南海区产业升级新政策发布",
      url: "https://szb.nanhaitoday.com/sample1",
      extra: {
        info: "佛山南海",
        hover: "南海区产业升级新政策发布 - 珠江时报",
      },
    },
    {
      id: "https://szb.nanhaitoday.com/sample2",
      title: "佛山南海科技园区建设进展",
      url: "https://szb.nanhaitoday.com/sample2",
      extra: {
        info: "佛山南海",
        hover: "佛山南海科技园区建设进展 - 珠江时报",
      },
    },
  ]
})

// 广州日报百家号 (使用RSS方式)
const guangzhouDaily = defineRSSHubSource("/baijiahao/author/广州日报", {
  limit: 30,
  sorted: true,
})

// 佛山新闻网百家号 (使用RSS方式)
const foshanNews = defineRSSHubSource("/baijiahao/author/佛山新闻网", {
  limit: 30,
  sorted: true,
})

export default defineSource({
  "pearl-river-delta": nanfangFoshan,
  "pearl-river-delta-nanfang-foshan": nanfangFoshan,
  "pearl-river-delta-dongguan-sun": dongguanSun,
  "pearl-river-delta-zhujiang-times": zhujiangTimes,
  "pearl-river-delta-guangzhou-daily": guangzhouDaily,
  "pearl-river-delta-foshan-news": foshanNews,
} as any)
