import type { Category } from './types';

/**
 * 站点数据 —— 全部 17 个分类 / 97 个条目。
 *
 * 内容与原 `main.js` 的 `resource` 数组逐条对齐，URL 未做任何改动。
 *
 * 图标策略（这次重构改动的部分）：
 *   1. 原本能正确取到图的 73 条，图标键**原样保留**，视觉与旧版完全一致；
 *   2. 原本取不到图的 24 条里，「旅行 → Bilibili」指的确实是 bilibili.com，
 *      所以恢复成真实的 bilibili 图标；
 *   3. 其余 23 条（36kr、少数派、iconfont、EU.ORG、goorm、游戏分类 14 条、
 *      其他分类 4 条）**刻意不写 icon**，渲染成首字母色块。
 *      这是有意为之：此前它们是静默 404 的空白，而扁平图标池里虽然有
 *      `flickr` / `openedv` / `MagoTV` 等键，把它们套到 36kr、EU.ORG、
 *      星露谷物语 Wiki 上只会显示成别家的 Logo，比留白更糟。
 *      想补真实图标时，把文件丢进 `icon/<任意目录>/` 并在下面填上键名即可。
 *
 * `visible: 6` 对应旧代码里写死的 `createItem(val, div, 6)`。
 */
export const CATEGORIES: Category[] = [
  {
    id: 'knowledge',
    name: '知识',
    visible: 6,
    recommend: { icon: 'wikipedia', name: '维基百科', url: 'https://www.wikipedia.org/' },
    sites: [
      { icon: 'zhihu', name: '知乎', url: 'https://www.zhihu.com/' },
      { icon: 'quora', name: 'Quora', url: 'https://www.quora.com/' },
      { icon: 'baiduzhidao', name: '百度知道', url: 'https://zhidao.baidu.com/' },
      { icon: 'googlescholar', name: 'Google学术', url: 'https://scholar.google.com/' },
      { icon: 'Khan', name: 'Khan Academy', url: 'https://www.khanacademy.org/' },
      { icon: 'wikihow', name: 'wikihow', url: 'https://www.wikihow.com/Main-Page' },
      { icon: 'worldcat', name: 'WorldCat', url: 'https://www.worldcat.org/' },
      { icon: 'ted', name: 'TED', url: 'https://www.ted.com/' },
      { icon: 'ted', name: '51自学网', url: 'https://www.51zxw.net/' },
    ],
  },
  {
    id: 'social',
    name: '社交',
    visible: 6,
    recommend: { icon: 'facebook', name: 'Facebook', url: 'https://www.facebook.com/' },
    sites: [
      { icon: 'douban', name: '豆瓣', url: 'https://www.douban.com/' },
      { icon: 'twitter', name: 'Twitter', url: 'https://twitter.com/' },
      { icon: 'sinaweibo', name: '新浪微博', url: 'https://weibo.com/' },
      { icon: 'sinaweibo', name: '小红书', url: 'https://www.xiaohongshu.com/' },
      { icon: 'sinaweibo', name: '百度贴吧', url: 'https://tieba.baidu.com/' },
      { icon: 'sinaweibo', name: '知乎', url: 'https://www.zhihu.com/' },
    ],
  },
  {
    id: 'news',
    name: '新闻',
    visible: 6,
    recommend: { icon: 'rebang.today', name: '今日热榜', url: 'https://rebang.today/' },
    sites: [
      { icon: 'news.163', name: '网易新闻', url: 'https://news.163.com/' },
      { icon: 'caixin', name: '财新网', url: 'https://www.caixin.com/' },
      {
        icon: 'trends',
        name: 'Google Trends',
        url: 'https://trends.google.com/trends/trendingsearches/daily',
      },
      { icon: 'apnews', name: 'AP美联社', url: 'https://apnews.com/' },
      { icon: 'bbcnews', name: 'BBC news', url: 'https://www.bbc.com/news' },
      { icon: 'reuters', name: '路透社', url: 'https://www.reuters.com/' },
    ],
  },
  {
    id: 'design',
    name: '设计',
    visible: 6,
    recommend: { icon: 'behance', name: 'Behance', url: 'https://www.behance.net/' },
    sites: [
      { icon: 'cargo', name: 'Cargo', url: 'https://cargo.site/' },
      { icon: 'designboom', name: 'designboom', url: 'https://www.designboom.com/' },
      { icon: 'nounproject', name: 'TheNounProject', url: 'https://thenounproject.com/' },
      { icon: 'dribbble', name: 'Dribbble', url: 'https://dribbble.com/' },
      { icon: 'pinterest', name: 'Pinterest', url: 'https://www.pinterest.com/' },
      { icon: 'iconmonstr', name: 'iconmonstr', url: 'https://iconmonstr.com/' },
      { icon: 'tumblr', name: 'Tumblr', url: 'https://www.tumblr.com/' },
    ],
  },
  {
    id: 'picture',
    name: '图片',
    visible: 6,
    recommend: { icon: 'Pinterest', name: 'Pinterest', url: 'https://www.pinterest.com/' },
    sites: [
      { icon: 'flickr', name: 'wallhaven', url: 'https://wallhaven.cc/' },
      { icon: 'flickr', name: 'flickr', url: 'https://www.flickr.com/' },
      { icon: 'flickr', name: '彼岸图', url: 'https://pic.netbian.com/' },
    ],
  },
  {
    id: 'music',
    name: '音乐',
    visible: 6,
    recommend: { icon: '163music', name: '网易云音乐', url: 'https://music.163.com/' },
    sites: [
      { icon: 'spotify', name: 'Spotify', url: 'https://open.spotify.com/' },
      { icon: 'QQmusic', name: 'QQ音乐', url: 'https://y.qq.com/' },
      { icon: 'soundcloud', name: 'SoundCloud', url: 'https://soundcloud.com/' },
      { icon: 'doubanmusic', name: '豆瓣音乐', url: 'https://m.douban.com/music/' },
      { icon: 'bandcamp', name: 'bandcamp', url: 'https://bandcamp.com/' },
      { icon: 'pandora', name: 'Pandora', url: 'https://www.pandora.com/' },
    ],
  },
  {
    id: 'video',
    name: '视频',
    visible: 6,
    recommend: { icon: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/' },
    sites: [
      { icon: 'bilibili', name: 'Bilibili', url: 'https://www.bilibili.com/' },
      { icon: 'vimeo', name: 'Vimeo', url: 'https://vimeo.com/' },
      { icon: 'youku', name: '优酷', url: 'https://youku.com/' },
      { icon: 'qqv', name: '腾讯视频', url: 'https://v.qq.com/' },
      { icon: 'iqiyi', name: '爱奇艺', url: 'https://www.iqiyi.com/' },
      { icon: 'MagoTV', name: '芒果TV', url: 'https://www.mgtv.com/' },
      { icon: 'letv', name: '乐视视频', url: 'https://www.le.com/' },
    ],
  },
  {
    id: 'digital',
    name: '数码',
    visible: 6,
    recommend: { icon: 'Pinterest', name: '果壳网', url: 'https://www.ghxi.com/' },
    sites: [
      { name: '36kr', url: 'https://www.36kr.com/' },
      { name: '少数派', url: 'https://sspai.com/' },
    ],
  },
  {
    id: 'shopping',
    name: '购物',
    visible: 6,
    recommend: { icon: 'taobao', name: '淘宝', url: 'https://www.taobao.com/' },
    sites: [
      { icon: 'JD', name: '京东', url: 'https://www.jd.com/' },
      { icon: 'smzdm', name: '什么值得买', url: 'https://www.smzdm.com/' },
      { icon: 'tmall', name: '天猫', url: 'https://www.tmall.com/' },
      { icon: 'amazon', name: '亚马逊', url: 'https://www.amazon.com/' },
    ],
  },
  {
    id: 'travel',
    name: '旅行',
    visible: 6,
    recommend: { icon: 'googlemaps', name: '谷歌地图', url: 'https://www.google.com/maps/' },
    // 原数据里这条写的是 bilibili.png 但落在 icon/travel/ 下取不到，
    // 改成扁平键名后指向真实的 icon/video/bilibili.png —— 它本来就该是这个图标。
    sites: [{ icon: 'bilibili', name: 'Bilibili', url: 'https://www.bilibili.com/' }],
  },
  {
    id: 'books',
    name: '书籍',
    visible: 6,
    recommend: { icon: 'taobao', name: 'Z-library', url: 'https://zh.singlelogin.re/' },
    sites: [
      { icon: 'weread', name: '微信读书', url: 'https://weread.qq.com/' },
      { icon: 'Goodreads', name: 'Goodreads', url: 'https://www.goodreads.com/' },
    ],
  },
  {
    id: 'code',
    name: '编程',
    visible: 6,
    recommend: { icon: 'stackoverflow', name: 'Stack Overflow', url: 'https://stackoverflow.com/' },
    sites: [
      { icon: 'github', name: 'Github', url: 'https://github.com/' },
      { icon: 'appledev', name: 'Apple Developer', url: 'https://developer.apple.com/develop/' },
      { icon: 'cocoapods', name: 'CocoaPods', url: 'https://cocoapods.org/' },
      { icon: 'unity', name: 'Unity', url: 'https://unity.com/' },
      { icon: 'apisio', name: 'APIs', url: 'https://apis.io/' },
      { icon: 'codepen', name: 'CodePen', url: 'https://codepen.io/' },
      { icon: 'codepen', name: 'W3Schools', url: 'https://www.w3school.com.cn/' },
      { icon: 'codepen', name: '菜鸟教程', url: 'https://www.runoob.com/' },
      { icon: 'codepen', name: 'Android Dev', url: 'https://developer.android.com/get-started/' },
    ],
  },
  {
    id: 'forums',
    name: '论坛',
    visible: 6,
    recommend: { icon: 'linux', name: 'Linux kernel', url: 'https://www.kernel.org/' },
    sites: [
      { icon: 'openedv', name: '开源电子网', url: 'http://www.openedv.com/' },
      { icon: 'fire', name: '野火论坛', url: 'https://www.firebbs.cn/' },
      { icon: 'fire', name: 'FireFly', url: 'https://dev.t-firefly.com/' },
      { icon: 'fire', name: 'Ubuntu中文社区', url: 'https://forum.ubuntu.org.cn/' },
      { icon: 'fire', name: 'QTCN', url: 'http://www.qtcn.org/' },
      { icon: 'fire', name: '中国电子网', url: 'https://bbs.21ic.com/' },
      { icon: 'fire', name: '电子发烧友', url: 'https://bbs.elecfans.com/' },
      { icon: 'fire', name: '电子产品世界', url: 'https://www.eepw.com.cn/' },
      { icon: 'fire', name: '阿莫电子论坛', url: 'https://www.amobbs.com/' },
    ],
  },
  {
    id: 'tools',
    name: '工具',
    visible: 6,
    recommend: { icon: 'linux', name: 'Linux kernel', url: 'https://www.kernel.org/' },
    sites: [
      { name: 'iconfont', url: 'https://www.iconfont.cn/' },
      { icon: 'icon-icons', name: 'icons', url: 'https://icon-icons.com/pt/' },
      { icon: 'icon-icons', name: 'Free icons', url: 'https://icons8.com/' },
      { icon: 'icon-icons', name: '小众技术', url: 'https://www.xiaozhongjishu.com/' },
      { icon: 'icon-icons', name: 'emoji合成', url: 'https://tikolu.net/emojimix/' },
    ],
  },
  {
    id: 'net',
    name: '网络',
    visible: 6,
    recommend: { icon: 'linux', name: 'Cloud Flare', url: 'https://dash.cloudflare.com/' },
    sites: [
      { name: 'EU.ORG', url: 'https://nic.eu.org/' },
      { name: 'goorm', url: 'https://www.goorm.io/' },
    ],
  },
  {
    id: 'game',
    name: '游戏',
    visible: 6,
    recommend: { icon: 'steam', name: 'Steam', url: 'https://store.steampowered.com/' },
    sites: [
      { icon: 'epic', name: 'EPIC', url: 'https://www.epicgames.com/' },
      { name: '好玩游戏厅', url: 'https://www.coarcade.com/' },
      { name: '520switch', url: 'https://www.520switch.com/' },
      { name: '游戏星辰', url: 'https://www.2023game.com/' },
      { name: 'byrutor', url: 'https://repack-byrutor.org/' },
      { name: 'Switch520', url: 'https://www.gamer520.com/' },
      { name: '资源避难所', url: 'https://www.flysheep6.com/' },
      { name: '灵动游戏', url: 'https://www.mhhf.com/' },
      { name: 'PacoGames', url: 'https://www.pacogames.com/' },
      { name: '小霸王', url: 'https://www.yikm.net/' },
      { name: 'KBH Games', url: 'https://kbhgames.com/' },
      { name: 'OldmanEmu', url: 'https://www.oldmantvg.net/' },
      { name: 'Tekqart', url: 'https://www.tekqart.com/' },
      { name: 'Switch321', url: 'https://www.switch321.com/' },
      { name: '三国杀', url: 'https://web.sanguosha.com/' },
    ],
  },
  {
    id: 'others',
    name: '其他',
    visible: 6,
    recommend: { icon: 'linux', name: 'Linux kernel', url: 'https://www.kernel.org/' },
    sites: [
      { name: 'NoteBook', url: 'https://notebook.js.org/#/' },
      { name: 'SteamPY', url: 'https://steampy.com/home' },
      { name: '星露谷物语Wiki', url: 'https://zh.stardewvalleywiki.com/' },
      { name: '黑神话·悟空Wiki', url: 'https://wiki.biligame.com/wukong/' },
    ],
  },
];

/** 全站条目总数，提示文案里要用 */
export const TOTAL_SITES = CATEGORIES.reduce((n, c) => n + c.sites.length, 0);
