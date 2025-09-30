import type { Locale } from './config';

type Messages = {
  navbar: {
    language: string;
  };
  home: {
    heading: string;
    totalCount: string; // {count}
    loading: string;
    loadMore: string;
    loadMoreLoading: string;
    noMore: string;
    noData: string;
    loadFailed: string; // {error}
    reload: string;
    categoryUnknown: string;
  };
  detail: {
    loading: string;
    back: string;
    backToHome: string;
    backToList: string;
    notFound: string;
    categoryUnknown: string;
    noContent: string;
    share: string;
    shareCopied: string;
  };
  time: {
    justNow: string;
    hoursAgo: string; // {count}
    daysAgo: string; // {count}
  };
};

export type AppMessages = Messages;

export const messages: Record<Locale, Messages> = {
  en: {
    navbar: {
      language: 'Language',
    },
    home: {
      heading: 'Latest News',
      totalCount: 'Total {count} articles',
      loading: 'Loading...',
      loadMore: 'Load more news',
      loadMoreLoading: 'Loading...',
      noMore: 'No more content',
      noData: 'No news available',
      loadFailed: 'Failed to load: {error}',
      reload: 'Reload',
      categoryUnknown: 'Uncategorized',
    },
    detail: {
      loading: 'Loading...',
      back: 'Back',
      backToHome: 'Back to Home',
      backToList: '← Back to news list',
      notFound: 'The news item does not exist or has been removed.',
      categoryUnknown: 'Uncategorized',
      noContent: 'No content available',
      share: 'Share',
      shareCopied: 'Link copied to clipboard',
    },
    time: {
      justNow: 'Just now',
      hoursAgo: '{count} hours ago',
      daysAgo: '{count} days ago',
    },
  },
  'zh-CN': {
    navbar: {
      language: '语言',
    },
    home: {
      heading: '最新新闻',
      totalCount: '共 {count} 条新闻',
      loading: '加载中...',
      loadMore: '加载更多新闻',
      loadMoreLoading: '加载中...',
      noMore: '没有更多内容',
      noData: '暂无新闻数据',
      loadFailed: '加载失败: {error}',
      reload: '重新加载',
      categoryUnknown: '未分类',
    },
    detail: {
      loading: '加载中...',
      back: '返回',
      backToHome: '返回首页',
      backToList: '← 返回新闻列表',
      notFound: '新闻不存在或已下线',
      categoryUnknown: '未分类',
      noContent: '暂无新闻内容',
      share: '分享',
      shareCopied: '链接已复制到剪贴板',
    },
    time: {
      justNow: '刚刚',
      hoursAgo: '{count}小时前',
      daysAgo: '{count}天前',
    },
  },
  ko: {
    navbar: {
      language: '언어',
    },
    home: {
      heading: '최신 뉴스',
      totalCount: '총 {count}건의 기사',
      loading: '불러오는 중...',
      loadMore: '더 많은 뉴스 보기',
      loadMoreLoading: '불러오는 중...',
      noMore: '더 이상 콘텐츠가 없습니다',
      noData: '표시할 뉴스가 없습니다',
      loadFailed: '로드 실패: {error}',
      reload: '새로고침',
      categoryUnknown: '분류 없음',
    },
    detail: {
      loading: '불러오는 중...',
      back: '뒤로',
      backToHome: '홈으로 돌아가기',
      backToList: '← 뉴스 목록으로 돌아가기',
      notFound: '존재하지 않거나 삭제된 뉴스입니다.',
      categoryUnknown: '분류 없음',
      noContent: '표시할 뉴스 내용이 없습니다',
      share: '공유',
      shareCopied: '링크가 클립보드에 복사되었습니다',
    },
    time: {
      justNow: '방금 전',
      hoursAgo: '{count}시간 전',
      daysAgo: '{count}일 전',
    },
  },
};

export const getMessages = (locale: Locale): Messages => messages[locale] ?? messages.en;
