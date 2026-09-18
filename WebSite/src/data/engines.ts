import type { Engine } from './types';

/**
 * 搜索框上方那一排搜索引擎。
 * 顺序即视觉顺序，与原 main.js 的 SearchData 完全一致。
 */
export const ENGINES: Engine[] = [
  { icon: 'bing', name: '必应', query: 'https://cn.bing.com/search?q=' },
  { icon: 'google', name: 'Google', query: 'https://www.google.com/search?q=' },
  { icon: 'douban', name: '豆瓣', query: 'https://www.douban.com/search?q=' },
  { icon: 'sinaweibo', name: '新浪微博', query: 'https://s.weibo.com/weibo?q=' },
  { icon: 'googleimage', name: 'Google 图片', query: 'https://google.com/search?q=' },
  { icon: 'pinterest', name: 'Pinterest', query: 'http://pinterest.com/search/pins/?q=' },
  { icon: 'twitter', name: 'Twitter', query: 'https://twitter.com/search?q=' },
  { icon: 'googlemaps', name: 'Google 地图', query: 'http://www.google.cn/maps/search/' },
  { icon: 'youdict', name: '有道词典', query: 'http://www.youdict.com/w/' },
];

/**
 * 在搜索框里按回车时使用的引擎。
 *
 * 旧代码里界面上写的是「按回车搜索 Google」，实际跳的却是 cn.bing.com —— 文案和
 * 行为对不上。这里把默认引擎显式写成数据，提示文案由它生成，两者不会再走偏。
 */
export const DEFAULT_ENGINE_ID = 'bing';
