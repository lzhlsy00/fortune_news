export default function Home() {
  // 模拟新闻数据 - 按时间倒序排列
  const newsData = [
    {
      id: 1,
      title: "全球股市创新高，科技股领涨",
      category: "财经",
      publishTime: "2小时前",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      title: "新能源汽车销量持续增长，市场渗透率进一步提升",
      category: "科技",
      publishTime: "4小时前",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: 3,
      title: "国际贸易新协议达成，促进全球经济复苏",
      category: "国际",
      publishTime: "6小时前",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
    {
      id: 4,
      title: "体育产业数字化转型加速，VR技术改变观赛体验",
      category: "体育",
      publishTime: "8小时前",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
    },
    {
      id: 5,
      title: "人工智能在医疗领域取得重大突破",
      category: "科技",
      publishTime: "10小时前",
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000)
    },
    {
      id: 6,
      title: "央行宣布新一轮货币政策调整",
      category: "财经",
      publishTime: "12小时前",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
    },
    {
      id: 7,
      title: "气候变化峰会达成重要共识",
      category: "国际",
      publishTime: "14小时前",
      timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000)
    },
    {
      id: 8,
      title: "奥运会筹备工作进展顺利",
      category: "体育",
      publishTime: "16小时前",
      timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000)
    },
    {
      id: 9,
      title: "5G网络覆盖率达到新高度",
      category: "科技",
      publishTime: "18小时前",
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000)
    },
    {
      id: 10,
      title: "房地产市场政策迎来新调整",
      category: "财经",
      publishTime: "20小时前",
      timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000)
    }
  ];

  // 按时间戳排序（最新的在前）
  const sortedNews = newsData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '财经': 'bg-blue-100 text-blue-800',
      '科技': 'bg-green-100 text-green-800',
      '国际': 'bg-purple-100 text-purple-800',
      '体育': 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 主要内容区域 */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">最新新闻</h1>
        </div>

        {/* 新闻列表 */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {sortedNews.map((news, index) => (
              <div 
                key={news.id} 
                className="p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  {/* 左侧内容 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(news.category)}`}>
                        {news.category}
                      </span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                      {news.title}
                    </h2>
                  </div>
                  
                  {/* 右侧时间信息 */}
                  <div className="ml-6 flex-shrink-0">
                    <span className="text-sm text-gray-500 font-medium">
                      {news.publishTime}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 加载更多按钮 */}
        <div className="text-center mt-8">
          <button className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors duration-200 font-medium">
            加载更多新闻
          </button>
        </div>
      </div>
    </div>
  );
}