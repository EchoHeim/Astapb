import type { Category } from './types';
/**
 * 站点数据 —— 全部 23 个分类 / 302 个条目。
 * （`TOTAL_SITES` 只统计各分类的 `sites` 数组，「推荐位」单独算、不计入其中。
 *  所以交来的站点一旦被放成推荐位，就不会在 `sites` 里再出现一次 ——
 *  目前有两个：财经的推荐位天天基金网、Git收藏的推荐位 Cemu。）
 *
 * 内容分三部分，每部分在文件里都有对应的分隔注释：
 *
 *   1. **原有部分（97 条）**：与原 `main.js` 的 `resource` 数组逐条对齐，
 *      顺序、名称、URL 一个都没动。
 *   2. **aa 补录（162 条）**：2026-09-22 从 lackar.com/aa（AnywhereAnything）补录，
 *      带 `// ---- 以下为 aa 补录 ----`。原站已下线，数据取自 Common Crawl 的
 *      CC-MAIN-2019-18 快照（`lackar.com/aa/`，2019-04-22），逐条比对本项目已有
 *      URL 后去重。原站的数据模型是「在此站内搜索」，存的是站内搜索模板；
 *      本项目要的是「跳转到站点首页」，所以这里存的是首页地址。
 *   3. **手工补充（43 条）**：带 `// ---- 以下为手工补录 ----`。分布是
 *      「设计」7、「其他」6，「财经」5、「软件」5、「Git收藏」5，「数码」4、
 *      「论坛」3，「知识」2、「工具」2，「编程」1、「书籍」1、「网络」1、
 *      「游戏」1。
 *      归类一律按站点性质，不按"哪一批一起给的"：
 *      「论坛」曾一次进过 10 条（7 条其实是博客 / 资讯 / 教材站，已调到
 *      「知识 / 数码 / 工具」），后来又进过树莓派官网（已调到「数码」）；
 *      异次元软件世界虽然最初被放到「数码」，但它是软件站，已移入「软件」。
 *
 * aa 补录时跳过的条目见 `docs/aa-import.md`（关停站点、已改名品牌，以及两处
 * 「用 Google 搜某站」的伪条目）。
 *
 * 图标策略：
 *   1. 原有 97 条**一条都没改**，图标键原样保留；
 *   2. 补录条目里能对上真实 Logo 的只有 CocoaChina（`cocoachina`）、
 *      NS中文网（`ns211`，取自站点自己的 `<link rel="icon">`），照实写；
 *   3. 其余**刻意不写 icon**，渲染成首字母色块。
 *      这是有意为之：扁平图标池里的公司 Logo 大多是别家的，把它们套到
 *      新站点上比留白更糟。想补真实图标时，把文件丢进 `icon/<任意目录>/`
 *      并在下面填上键名即可（键名写错构建会失败，不会静默留白）。
 *
 * `visible` 是每个分类**折叠状态下默认展示的条数**，超出部分悬停/聚焦到
 * 最后一条可见项时展开（见 lib/render.ts 的 `.clamp-end`）。
 * 目前统一为 8：旧代码里写死的是 `createItem(val, div, 6)`，2026-10-01 按
 * 需求提到 8；后建的六个分类（电影 / 应用 / 搜索 / 财经 / 软件 / Git收藏）
 * 沿用同一个值。想给某个分类单独调，改它自己的 `visible` 即可 ——
 * 卡片高度与「最后一条可见项」的标记都跟着它走，不需要动别的文件。
 */
export const CATEGORIES: Category[] = [
  {
    id: 'knowledge',
    name: '知识',
    visible: 8,
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
      // ---- 以下为 aa 补录 ----
      { name: '丁香园', url: 'https://www.dxy.cn/' },
      { name: '下厨房', url: 'https://www.xiachufang.com/' },
      { name: 'MBA智库', url: 'https://www.mbalib.com/' },
      { name: '百度文库', url: 'https://wenku.baidu.com/' },
      { name: '果壳', url: 'https://www.guokr.com/' },
      { name: 'WIPO', url: 'https://www.wipo.int/' },
      { name: 'Fandom', url: 'https://www.fandom.com/' },
      { name: 'Slideshare', url: 'https://www.slideshare.net/' },
      { name: 'Delicious', url: 'https://del.icio.us/' },
      { name: 'Instructables', url: 'https://www.instructables.com/' },
      { name: 'ICPSR', url: 'https://www.icpsr.umich.edu/' },
      { name: 'Howcast', url: 'https://www.howcast.com/' },
      { name: 'Internet Archive', url: 'https://archive.org/' },
      // ---- 以下为手工补录 ----
      { name: '廖雪峰的官方网站', url: 'https://liaoxuefeng.com/index.html' },
      { name: '电子课本网', url: 'http://www.dzkbw.com/' },
    ],
  },
  {
    id: 'social',
    name: '社交',
    visible: 8,
    recommend: { icon: 'facebook', name: 'Facebook', url: 'https://www.facebook.com/' },
    sites: [
      { icon: 'douban', name: '豆瓣', url: 'https://www.douban.com/' },
      { icon: 'twitter', name: 'Twitter', url: 'https://twitter.com/' },
      { icon: 'sinaweibo', name: '新浪微博', url: 'https://weibo.com/' },
      { icon: 'sinaweibo', name: '小红书', url: 'https://www.xiaohongshu.com/' },
      { icon: 'sinaweibo', name: '百度贴吧', url: 'https://tieba.baidu.com/' },
      { icon: 'sinaweibo', name: '知乎', url: 'https://www.zhihu.com/' },
      // ---- 以下为 aa 补录 ----
      { name: 'Reddit', url: 'https://www.reddit.com/' },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/' },
      { name: 'Mastodon', url: 'https://mastodon.social/' },
      { name: 'Medium', url: 'https://medium.com/' },
      { name: '简书', url: 'https://www.jianshu.com/' },
      { name: '微信公众号', url: 'https://mp.weixin.qq.com/' },
      { name: '痞客邦', url: 'https://www.pixnet.net/' },
      { name: 'Tagboard', url: 'https://tagboard.com/' },
    ],
  },
  {
    id: 'news',
    name: '新闻',
    visible: 8,
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
      // ---- 以下为 aa 补录 ----
      { name: '腾讯新闻', url: 'https://news.qq.com/' },
      { name: '新华网', url: 'http://www.news.cn/' },
      { name: '凤凰网', url: 'https://www.ifeng.com/' },
      { name: '煎蛋', url: 'https://jandan.net/' },
      { name: 'CNN', url: 'https://edition.cnn.com/' },
      { name: 'Bloomberg', url: 'https://www.bloomberg.com/' },
      { name: '卫报', url: 'https://www.theguardian.com/' },
      { name: 'Google 新闻', url: 'https://news.google.com/' },
      { name: 'Feedly', url: 'https://feedly.com/' },
      { name: 'Wikinews', url: 'https://en.wikinews.org/' },
    ],
  },
  {
    id: 'design',
    name: '设计',
    visible: 8,
    recommend: { icon: 'behance', name: 'Behance', url: 'https://www.behance.net/' },
    sites: [
      { icon: 'cargo', name: 'Cargo', url: 'https://cargo.site/' },
      { icon: 'designboom', name: 'designboom', url: 'https://www.designboom.com/' },
      { icon: 'nounproject', name: 'TheNounProject', url: 'https://thenounproject.com/' },
      { icon: 'dribbble', name: 'Dribbble', url: 'https://dribbble.com/' },
      { icon: 'pinterest', name: 'Pinterest', url: 'https://www.pinterest.com/' },
      { icon: 'iconmonstr', name: 'iconmonstr', url: 'https://iconmonstr.com/' },
      { icon: 'tumblr', name: 'Tumblr', url: 'https://www.tumblr.com/' },
      // ---- 以下为 aa 补录 ----
      { name: 'Pixiv', url: 'https://www.pixiv.net/' },
      { name: 'ArtStation', url: 'https://www.artstation.com/' },
      { name: 'deviantArt', url: 'https://www.deviantart.com/' },
      { name: 'Artsy', url: 'https://www.artsy.net/' },
      { name: 'ArtStack', url: 'https://artstack.com/' },
      { name: 'Niice', url: 'https://niice.co/' },
      { name: 'MyFonts', url: 'https://www.myfonts.com/' },
      { name: 'Adobe Fonts', url: 'https://fonts.adobe.com/' },
      { name: 'ArchDaily', url: 'https://www.archdaily.com/' },
      { name: 'Houzz', url: 'https://www.houzz.com/' },
      { name: 'Sketchfab', url: 'https://sketchfab.com/' },
      { name: 'Hypebeast', url: 'https://hypebeast.com/' },
      { name: 'Google Arts & Culture', url: 'https://artsandculture.google.com/' },
      // ---- 以下为手工补录 ----
      { name: '站酷', url: 'https://www.zcool.com.cn/' },
      { name: '花瓣网', url: 'https://huaban.com/' },
      { name: '稿定设计', url: 'https://www.gaoding.com/' },
      { name: '字由', url: 'https://www.hellofont.cn/' },
      { name: '中国色', url: 'https://zhongguose.com/' },
      { name: '搜图导航', url: 'https://www.91sotu.com/' },
      { name: '致美化', url: 'https://zhutix.com/' },
      // 原先放在「图片」，按使用场景归到设计更合适（NASA 官方图库，做视觉参考常用）
      { name: 'NASA Image Library', url: 'https://images.nasa.gov/' },
    ],
  },
  {
    id: 'picture',
    name: '图片',
    visible: 8,
    recommend: { icon: 'Pinterest', name: 'Pinterest', url: 'https://www.pinterest.com/' },
    sites: [
      { icon: 'flickr', name: 'wallhaven', url: 'https://wallhaven.cc/' },
      { icon: 'flickr', name: 'flickr', url: 'https://www.flickr.com/' },
      { icon: 'flickr', name: '彼岸图', url: 'https://pic.netbian.com/' },
      // ---- 以下为 aa 补录 ----
      { name: 'Instagram', url: 'https://www.instagram.com/' },
      { name: '500px', url: 'https://500px.com/' },
      { name: 'Lofter', url: 'https://www.lofter.com/' },
      { name: '天空之城', url: 'https://www.skypixel.com/' },
      { name: 'Google 相册', url: 'https://photos.google.com/' },
      { name: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/' },
      { name: 'Imgur', url: 'https://imgur.com/' },
      { name: 'Giphy', url: 'https://giphy.com/' },
      { name: 'iStockphoto', url: 'https://www.istockphoto.com/' },
      { name: '视觉中国', url: 'https://www.vcg.com/' },
      { name: 'Getty Images', url: 'https://www.gettyimages.com/' },
    ],
  },
  {
    id: 'music',
    name: '音乐',
    visible: 8,
    recommend: { icon: '163music', name: '网易云音乐', url: 'https://music.163.com/' },
    sites: [
      { icon: 'spotify', name: 'Spotify', url: 'https://open.spotify.com/' },
      { icon: 'QQmusic', name: 'QQ音乐', url: 'https://y.qq.com/' },
      { icon: 'soundcloud', name: 'SoundCloud', url: 'https://soundcloud.com/' },
      { icon: 'doubanmusic', name: '豆瓣音乐', url: 'https://m.douban.com/music/' },
      { icon: 'bandcamp', name: 'bandcamp', url: 'https://bandcamp.com/' },
      { icon: 'pandora', name: 'Pandora', url: 'https://www.pandora.com/' },
      // ---- 以下为 aa 补录 ----
      { name: '酷狗音乐', url: 'https://www.kugou.com/' },
      { name: 'Last.fm', url: 'https://www.last.fm/' },
    ],
  },
  {
    id: 'video',
    name: '视频',
    visible: 8,
    recommend: { icon: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/' },
    sites: [
      { icon: 'bilibili', name: 'Bilibili', url: 'https://www.bilibili.com/' },
      { icon: 'vimeo', name: 'Vimeo', url: 'https://vimeo.com/' },
      { icon: 'youku', name: '优酷', url: 'https://youku.com/' },
      { icon: 'qqv', name: '腾讯视频', url: 'https://v.qq.com/' },
      { icon: 'iqiyi', name: '爱奇艺', url: 'https://www.iqiyi.com/' },
      { icon: 'MagoTV', name: '芒果TV', url: 'https://www.mgtv.com/' },
      { icon: 'letv', name: '乐视视频', url: 'https://www.le.com/' },
      // ---- 以下为 aa 补录 ----
      { name: '斗鱼', url: 'https://www.douyu.com/' },
      { name: '梨视频', url: 'https://www.pearvideo.com/' },
      { name: '搜狐视频', url: 'https://tv.sohu.com/' },
      { name: 'AcFun', url: 'https://www.acfun.cn/' },
    ],
  },
  {
    id: 'digital',
    name: '数码',
    visible: 8,
    recommend: { icon: 'Pinterest', name: '果壳网', url: 'https://www.ghxi.com/' },
    sites: [
      { name: '36kr', url: 'https://www.36kr.com/' },
      { name: '少数派', url: 'https://sspai.com/' },
      // ---- 以下为 aa 补录 ----
      { name: 'The Verge', url: 'https://www.theverge.com/' },
      { name: 'Engadget', url: 'https://www.engadget.com/' },
      { name: 'TechCrunch', url: 'https://techcrunch.com/' },
      { name: 'The Next Web', url: 'https://thenextweb.com/' },
      { name: 'Ars Technica', url: 'https://arstechnica.com/' },
      { name: 'CNET', url: 'https://www.cnet.com/' },
      { name: 'GigaOM', url: 'https://gigaom.com/' },
      { name: 'Fast Company', url: 'https://www.fastcompany.com/' },
      { name: '爱范儿', url: 'https://www.ifanr.com/' },
      { name: 'IT之家', url: 'https://www.ithome.com/' },
      { name: '数字尾巴', url: 'https://www.dgtle.com/' },
      { name: 'PingWest 品玩', url: 'https://www.pingwest.com/' },
      { name: 'Kickstarter', url: 'https://www.kickstarter.com/' },
      // ---- 以下为手工补录 ----
      { name: '蓝点网', url: 'https://www.landian.news/' },
      { name: 'tlanyan', url: 'https://itlanyan.com/' },
      { name: '零度博客', url: 'https://www.freedidi.com/' },
      { name: '树莓派', url: 'https://www.raspberrypi.com/' },
    ],
  },
  {
    id: 'shopping',
    name: '购物',
    visible: 8,
    recommend: { icon: 'taobao', name: '淘宝', url: 'https://www.taobao.com/' },
    sites: [
      { icon: 'JD', name: '京东', url: 'https://www.jd.com/' },
      { icon: 'smzdm', name: '什么值得买', url: 'https://www.smzdm.com/' },
      { icon: 'tmall', name: '天猫', url: 'https://www.tmall.com/' },
      { icon: 'amazon', name: '亚马逊', url: 'https://www.amazon.com/' },
      // ---- 以下为 aa 补录 ----
      { name: '苏宁易购', url: 'https://www.suning.com/' },
      { name: '蘑菇街', url: 'https://www.mogujie.com/' },
      { name: '阿里巴巴', url: 'https://www.1688.com/' },
      { name: '一号店', url: 'https://www.yhd.com/' },
      { name: 'eBay', url: 'https://www.ebay.com/' },
      { name: 'Etsy', url: 'https://www.etsy.com/' },
      { name: 'ASOS', url: 'https://www.asos.com/' },
      { name: 'Fancy', url: 'https://fancy.com/' },
      { name: 'Chiphell', url: 'https://www.chiphell.com/' },
    ],
  },
  {
    id: 'travel',
    name: '旅行',
    visible: 8,
    recommend: { icon: 'googlemaps', name: '谷歌地图', url: 'https://www.google.com/maps/' },
    // 原数据里这条写的是 bilibili.png 但落在 icon/travel/ 下取不到，
    // 改成扁平键名后指向真实的 icon/video/bilibili.png —— 它本来就该是这个图标。
    sites: [
      { icon: 'bilibili', name: 'Bilibili', url: 'https://www.bilibili.com/' },
      // ---- 以下为 aa 补录 ----
      { name: '高德地图', url: 'https://www.amap.com/' },
      { name: '百度地图', url: 'https://map.baidu.com/' },
      { name: 'Google Earth', url: 'https://earth.google.com/web/' },
      { name: '大众点评', url: 'https://www.dianping.com/' },
      { name: '马蜂窝', url: 'https://www.mafengwo.cn/' },
      { name: 'Airbnb', url: 'https://www.airbnb.cn/' },
      { name: '穷游网', url: 'https://www.qyer.com/' },
      { name: 'TripAdvisor', url: 'https://www.tripadvisor.com/' },
      { name: 'Foursquare', url: 'https://foursquare.com/' },
      { name: 'Lonely Planet', url: 'https://www.lonelyplanet.com/' },
      { name: 'GOV.UK', url: 'https://www.gov.uk/' },
      { name: 'Wikivoyage', url: 'https://www.wikivoyage.org/' },
    ],
  },
  {
    id: 'books',
    name: '书籍',
    visible: 8,
    recommend: { icon: 'taobao', name: 'Z-library', url: 'https://zh.singlelogin.re/' },
    sites: [
      { icon: 'weread', name: '微信读书', url: 'https://weread.qq.com/' },
      { icon: 'Goodreads', name: 'Goodreads', url: 'https://www.goodreads.com/' },
      // ---- 以下为 aa 补录 ----
      { name: 'Google 图书', url: 'https://books.google.com/' },
      { name: '起点中文网', url: 'https://www.qidian.com/' },
      { name: '多看阅读', url: 'https://www.duokan.com/' },
      { name: '书格', url: 'https://www.shuge.org/' },
      { name: 'Issuu', url: 'https://issuu.com/' },
      { name: 'Phaidon', url: 'https://www.phaidon.com/' },
      { name: 'Wikibooks', url: 'https://www.wikibooks.org/' },
      { name: '鸠摩搜索', url: 'https://www.jiumodiary.com/' },
    ],
  },
  {
    id: 'code',
    name: '编程',
    visible: 8,
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
      // ---- 以下为 aa 补录 ----
      { name: 'Cocoa Controls', url: 'https://www.cocoacontrols.com/' },
      { name: 'Code4App', url: 'http://www.code4app.com/' },
      { name: 'V2EX', url: 'https://www.v2ex.com/' },
      { name: 'CSDN', url: 'https://www.csdn.net/' },
      { name: 'Processing', url: 'https://processing.org/' },
      { name: 'Shodan', url: 'https://www.shodan.io/' },
      { name: 'Pastebin', url: 'https://pastebin.com/' },
      { name: 'PublicAPIs', url: 'https://publicapis.dev/' },
      { name: 'GoDaddy', url: 'https://www.godaddy.com/' },
      { name: 'Name.com', url: 'https://www.name.com/' },
      { name: 'Apifox', url: 'https://apifox.com/' },
    ],
  },
  {
    id: 'forums',
    name: '论坛',
    visible: 8,
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
      // ---- 以下为手工补录 ----
      { name: '吾爱破解', url: 'https://www.52pojie.cn/' },
      { name: '远景论坛', url: 'https://bbs.pcbeta.com/' },
      { name: '恩山无线论坛', url: 'https://www.right.com.cn/forum/forum.php' },
    ],
  },
  {
    id: 'tools',
    name: '工具',
    visible: 8,
    recommend: { icon: 'linux', name: 'Linux kernel', url: 'https://www.kernel.org/' },
    sites: [
      { name: 'iconfont', url: 'https://www.iconfont.cn/' },
      { icon: 'icon-icons', name: 'icons', url: 'https://icon-icons.com/pt/' },
      { icon: 'icon-icons', name: 'Free icons', url: 'https://icons8.com/' },
      { icon: 'icon-icons', name: '小众技术', url: 'https://www.xiaozhongjishu.com/' },
      { icon: 'icon-icons', name: 'emoji合成', url: 'https://tikolu.net/emojimix/' },
      // ---- 以下为手工补录 ----
      { name: '晨钟网络科技', url: 'https://jamcz.com/index.html' },
      { name: '奔跑的奶酪', url: 'https://www.runningcheese.com/' },
    ],
  },
  {
    id: 'net',
    name: '网络',
    visible: 8,
    recommend: { icon: 'linux', name: 'Cloud Flare', url: 'https://dash.cloudflare.com/' },
    sites: [
      { name: 'EU.ORG', url: 'https://nic.eu.org/' },
      { name: 'goorm', url: 'https://www.goorm.io/' },
      { name: '硬核指南', url: 'https://yinghezhinan.com/' },
    ],
  },
  {
    id: 'game',
    name: '游戏',
    visible: 8,
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
      // ---- 以下为 aa 补录 ----
      { name: 'IGN', url: 'https://www.ign.com/' },
      { name: 'GameSpot', url: 'https://www.gamespot.com/' },
      { name: 'Polygon', url: 'https://www.polygon.com/' },
      { name: 'Twitch', url: 'https://www.twitch.tv/' },
      { name: 'IndieDB', url: 'https://www.indiedb.com/' },
      { name: 'itch.io', url: 'https://itch.io/' },
      { name: 'Indienova', url: 'https://indienova.com/' },
      { name: 'VGChartz', url: 'https://www.vgchartz.com/' },
      { name: 'Minecraft Wiki', url: 'https://minecraft.wiki/' },
      { name: '游侠网', url: 'https://www.ali213.net/' },
      // ---- 以下为手工补录 ----
      { icon: 'ns211', name: 'NS中文网', url: 'https://www.ns211.com/' },
    ],
  },
  {
    id: 'others',
    name: '其他',
    visible: 8,
    recommend: { icon: 'linux', name: 'Linux kernel', url: 'https://www.kernel.org/' },
    sites: [
      { name: 'NoteBook', url: 'https://notebook.js.org/#/' },
      { name: 'SteamPY', url: 'https://steampy.com/home' },
      { name: '星露谷物语Wiki', url: 'https://zh.stardewvalleywiki.com/' },
      { name: '黑神话·悟空Wiki', url: 'https://wiki.biligame.com/wukong/' },
      // ---- 以下为 aa 补录 ----
      { name: '天眼查', url: 'https://www.tianyancha.com/' },
      { name: '企查查', url: 'https://www.qcc.com/' },
      { name: '雪球', url: 'https://xueqiu.com/' },
      { name: 'TradingEconomics', url: 'https://tradingeconomics.com/' },
      { name: '金山词霸', url: 'https://www.iciba.com/' },
      { name: 'Urban Dictionary', url: 'https://www.urbandictionary.com/' },
      { name: 'Ludwig', url: 'https://ludwig.guru/' },
      { name: 'Forvo', url: 'https://forvo.com/' },
      { name: 'Wiktionary', url: 'https://www.wiktionary.org/' },
      { name: 'Wikiquote', url: 'https://www.wikiquote.org/' },
      { name: '萌娘百科', url: 'https://zh.moegirl.org.cn/' },
      { name: '伪基百科', url: 'https://uncyclopedia.com/' },
      { name: '9GAG', url: 'https://9gag.com/' },
      { name: 'IFTTT', url: 'https://ifttt.com/' },
      // 95504 这个地址末尾的 # 是它自己的路由写法，保留原样
      { name: '昆仑加油卡', url: 'https://www.95504.net/NewIndex.aspx#' },
      { name: '中国石化加油卡', url: 'https://www.sinopecsales.com/' },
      { name: '笔点', url: 'https://www.bidianer.com/' },
      { name: 'GTAWeb.eu', url: 'https://gtaweb.eu/' },
      { name: 'Game-Zone Labs', url: 'https://gamezonelabs.com/' },
      { name: 'HTML5 Savegame Editors', url: 'https://www.marcrobledo.com/savegame-editors/' },
    ],
  },
  // ---- 以下 3 个分类为 aa 独有，本次补录时新增 ----
  {
    id: 'movie',
    name: '电影',
    visible: 8,
    recommend: { icon: 'doubanmovie', name: '豆瓣电影', url: 'https://movie.douban.com/' },
    sites: [
      { name: 'IMDb', url: 'https://www.imdb.com/' },
      { name: '时光网', url: 'https://www.mtime.com/' },
      { name: '烂番茄', url: 'https://www.rottentomatoes.com/' },
    ],
  },
  {
    id: 'app',
    name: '应用',
    visible: 8,
    recommend: { icon: 'appstore', name: 'App Store', url: 'https://www.apple.com/app-store/' },
    sites: [
      { name: 'Google Play', url: 'https://play.google.com/' },
      { name: '酷安', url: 'https://www.coolapk.com/' },
      { name: '应用宝', url: 'https://sj.qq.com/' },
      { name: '豌豆荚', url: 'https://www.wandoujia.com/' },
      { name: 'Chrome 网上应用店', url: 'https://chromewebstore.google.com/' },
      { name: 'Product Hunt', url: 'https://www.producthunt.com/' },
      { name: 'AlternativeTo', url: 'https://alternativeto.net/' },
      { name: 'BetaList', url: 'https://betalist.com/' },
      { name: 'CreativeApplications', url: 'https://www.creativeapplications.net/' },
    ],
  },
  {
    id: 'search',
    name: '搜索',
    visible: 8,
    recommend: { icon: 'google', name: 'Google', url: 'https://www.google.com/' },
    sites: [
      { name: '百度', url: 'https://www.baidu.com/' },
      { name: '搜狗', url: 'https://www.sogou.com/' },
      { name: '必应 Bing', url: 'https://www.bing.com/' },
      { name: 'DuckDuckGo', url: 'https://duckduckgo.com/' },
      { name: 'Yahoo!', url: 'https://www.yahoo.com/' },
      { name: 'Naver', url: 'https://www.naver.com/' },
      { name: 'Wolfram|Alpha', url: 'https://www.wolframalpha.com/' },
    ],
  },
  // ---- 以下 2 个分类为本次新建 ----
  {
    id: 'finance',
    name: '财经',
    visible: 8,
    // 推荐位用天天基金网：它是这 6 个站点里唯一能拿到高清方形 Logo 的
    // （官方 icon link 指向一张 256×256 的 PNG，已存为 header/tiantianjijin.png）。
    recommend: {
      icon: 'tiantianjijin',
      name: '天天基金网',
      url: 'https://www.1234567.com.cn/',
    },
    sites: [
      { name: '集思录', url: 'https://www.jisilu.cn/' },
      { name: '理杏仁', url: 'https://www.lixinger.com/' },
      { name: '同花顺问财', url: 'https://www.iwencai.com/screener' },
      { name: '巨潮资讯网', url: 'https://www.cninfo.com.cn/new/index' },
      { name: '香港交易所披露易', url: 'https://www.hkexnews.hk/index_c.htm' },
    ],
  },
  {
    id: 'software',
    name: '软件',
    visible: 8,
    // 推荐位用小众软件：这几个站点里只有它的 Logo 能拿到高清方形图，
    // 而且官网只给了 JPG，是用无头 Chrome 光栅化成 192×192 PNG 存的
    // （见 header/xiaozhongruanjian.png）。
    recommend: {
      icon: 'xiaozhongruanjian',
      name: '小众软件',
      url: 'https://www.appinn.com/',
    },
    sites: [
      { name: '异次元软件世界', url: 'https://www.iplaysoft.com/' },
      { name: '麦氪派', url: 'https://www.waitsun.com/' },
      { name: '马可菠萝', url: 'https://www.macbl.com/' },
      { name: '精品MAC应用分享', url: 'https://xclient.info/' },
      { name: 'MSDN, 我告诉你', url: 'https://msdn.itellyou.cn/' },
    ],
  },
  {
    id: 'git',
    name: 'Git收藏',
    visible: 8,
    // 推荐位给了 Cemu：六个仓库里只有它的组织头像（cemu-project）本身就是项目标志，
    // 而且是满幅方形图，缩进圆形推荐位最干净（已存为 header/cemu.png）。
    // 其余五个是仓库名，这类条目**不硬套图标**，渲染成首字母色块。
    recommend: {
      icon: 'cemu',
      name: 'Cemu',
      url: 'https://github.com/cemu-project/Cemu',
    },
    sites: [
      { name: 'Game-Cheats-Manager', url: 'https://github.com/dyang886/Game-Cheats-Manager' },
      { name: 'IPTV', url: 'https://github.com/yuanzl77/IPTV' },
      { name: 'RetroArch', url: 'https://github.com/libretro/RetroArch' },
      { name: 'HEU_KMS_Activator', url: 'https://github.com/zbezj/HEU_KMS_Activator' },
      { name: '得意黑', url: 'https://github.com/atelier-anchor/smiley-sans' },
    ],
  },
];
/** 全站条目总数，提示文案里要用 */
export const TOTAL_SITES = CATEGORIES.reduce((n, c) => n + c.sites.length, 0);
