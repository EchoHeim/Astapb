import type { Category } from './types';
/**
 * 站点数据。
 * （条数不写在这里 —— 手写过三版，301 / 302 / 实际 296 各不相同。要看数字跑
 *  `npm run check`，它会打印当前的分类数与条目数；README 里的数字也由它校验。
 *
 *  `TOTAL_SITES` 只统计各分类的 `sites` 数组，「推荐位」单独算、不计入其中。
 *  所以一个站点被放成推荐位后就不再留在 `sites` 里 —— 目前五个：财经的天天基金网、
 *  Git收藏的 Cemu、论坛的吾爱破解、工具的 iconfont、其他的天眼查。）
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
 *      「游戏」1。（2026-11-16 把吾爱破解提成「论坛」推荐位后，论坛的
 *      `sites` 里少一条。）
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
 * 条目超过 15 条的分类会拆成两列（见 lib/render.ts 的 `COLUMN_SPLIT`），
 * `visible` 在那里是**每列**各自的折叠条数。
 */
export const CATEGORIES: Category[] = [
  {
    id: 'knowledge',
    name: '知识',
    aliases: ['科普', '百科', '问答', '学习', '教程', '文献'],
    visible: 8,
    recommend: { icon: 'wikipedia', name: '维基百科', url: 'https://www.wikipedia.org/' },
    sites: [
      { icon: 'zhihu', name: '知乎', url: 'https://www.zhihu.com/', tags: ['问答', 'zhihu'] },
      { icon: 'quora', name: 'Quora', url: 'https://www.quora.com/', tags: ['问答', '英文'] },
      { icon: 'baiduzhidao', name: '百度知道', url: 'https://zhidao.baidu.com/', tags: ['问答', 'baidu'] },
      { icon: 'googlescholar', name: 'Google学术', url: 'https://scholar.google.com/', tags: ['论文', '文献', '学术'] },
      { icon: 'Khan', name: 'Khan Academy', url: 'https://www.khanacademy.org/', tags: ['公开课', '课程', '数学'] },
      { icon: 'wikihow', name: 'wikihow', url: 'https://www.wikihow.com/Main-Page', tags: ['教程', '指南', '生活'] },
      { icon: 'worldcat', name: 'WorldCat', url: 'https://www.worldcat.org/', tags: ['图书馆', '书目'] },
      { icon: 'ted', name: 'TED', url: 'https://www.ted.com/', tags: ['演讲', '公开课'] },
      { icon: 'ted', name: '51自学网', url: 'https://www.51zxw.net/', tags: ['教程', '视频课', '自学'] },
      // ---- 以下为 aa 补录 ----
      { name: '丁香园', url: 'https://www.dxy.cn/', tags: ['医学', '健康', '医生'] },
      { name: '下厨房', url: 'https://www.xiachufang.com/', tags: ['菜谱', '做饭', '美食'] },
      { name: 'MBA智库', url: 'https://www.mbalib.com/', tags: ['管理', '经管', '商业'] },
      { name: '百度文库', url: 'https://wenku.baidu.com/', tags: ['文档', '资料', 'ppt', '论文'] },
      { name: '果壳', url: 'https://www.guokr.com/', tags: ['科普', '科学'] },
      { name: 'WIPO', url: 'https://www.wipo.int/', tags: ['专利', '知识产权'] },
      { name: 'Fandom', url: 'https://www.fandom.com/', tags: ['粉丝', 'wiki', '百科'] },
      { name: 'Slideshare', url: 'https://www.slideshare.net/', tags: ['ppt', '演示', '文档'] },
      { name: 'Delicious', url: 'https://del.icio.us/', tags: ['书签', '收藏'] },
      { name: 'Instructables', url: 'https://www.instructables.com/', tags: ['diy', '教程', '手工'] },
      { name: 'ICPSR', url: 'https://www.icpsr.umich.edu/', tags: ['数据', '社科'] },
      { name: 'Howcast', url: 'https://www.howcast.com/', tags: ['教程', 'howto'] },
      { name: 'Internet Archive', url: 'https://archive.org/', tags: ['网页存档', '电子书', '古籍', 'archive'] },
      // ---- 以下为手工补录 ----
      { name: '廖雪峰的官方网站', url: 'https://liaoxuefeng.com/index.html', tags: ['教程', 'python', 'git', '编程'] },
      { name: '电子课本网', url: 'http://www.dzkbw.com/', tags: ['教材', '课本', '中小学'] },
    ],
  },
  {
    id: 'social',
    name: '社交',
    aliases: ['社区', '微博', '动态', '朋友圈'],
    visible: 8,
    recommend: { icon: 'facebook', name: 'Facebook', url: 'https://www.facebook.com/' },
    sites: [
      { icon: 'douban', name: '豆瓣', url: 'https://www.douban.com/', tags: ['douban', '书影音', '评分'] },
      { icon: 'twitter', name: 'Twitter', url: 'https://twitter.com/', tags: ['推特', '微博客'] },
      { icon: 'sinaweibo', name: '新浪微博', url: 'https://weibo.com/', tags: ['微博', 'weibo'] },
      { icon: 'sinaweibo', name: '小红书', url: 'https://www.xiaohongshu.com/', tags: ['xiaohongshu', '种草', '笔记'] },
      { icon: 'sinaweibo', name: '百度贴吧', url: 'https://tieba.baidu.com/', tags: ['贴吧', 'tieba', '论坛'] },
      { icon: 'sinaweibo', name: '知乎', url: 'https://www.zhihu.com/', tags: ['问答', 'zhihu'] },
      // ---- 以下为 aa 补录 ----
      { name: 'Reddit', url: 'https://www.reddit.com/', tags: ['论坛', '社区', '英文'] },
      { name: 'LinkedIn', url: 'https://www.linkedin.com/', tags: ['职场', '招聘', '领英'] },
      { name: 'Mastodon', url: 'https://mastodon.social/', tags: ['微博客', '去中心化'] },
      { name: 'Medium', url: 'https://medium.com/', tags: ['博客', '写作', '文章'] },
      { name: '简书', url: 'https://www.jianshu.com/', tags: ['博客', '写作'] },
      { name: '微信公众号', url: 'https://mp.weixin.qq.com/', tags: ['公众号', '微信', '文章'] },
      { name: '痞客邦', url: 'https://www.pixnet.net/', tags: ['博客', '台湾'] },
      { name: 'Tagboard', url: 'https://tagboard.com/', tags: ['话题', '标签', '社交搜索'] },
    ],
  },
  {
    id: 'news',
    name: '新闻',
    aliases: ['资讯', '媒体', '热点', '时事'],
    visible: 8,
    recommend: { icon: 'rebang.today', name: '今日热榜', url: 'https://rebang.today/' },
    sites: [
      { icon: 'news.163', name: '网易新闻', url: 'https://news.163.com/', tags: ['门户', 'news'] },
      { icon: 'caixin', name: '财新网', url: 'https://www.caixin.com/', tags: ['财经', '付费'] },
      {
        icon: 'trends',
        name: 'Google Trends',
        url: 'https://trends.google.com/trends/trendingsearches/daily',
        tags: ['趋势', '热搜'],
      },
      { icon: 'apnews', name: 'AP美联社', url: 'https://apnews.com/', tags: ['通讯社', '英文'] },
      { icon: 'bbcnews', name: 'BBC news', url: 'https://www.bbc.com/news', tags: ['bbc', '英文'] },
      { icon: 'reuters', name: '路透社', url: 'https://www.reuters.com/', tags: ['reuters', '英文', '财经'] },
      // ---- 以下为 aa 补录 ----
      { name: '腾讯新闻', url: 'https://news.qq.com/', tags: ['门户'] },
      { name: '新华网', url: 'http://www.news.cn/', tags: ['官方', '新华社'] },
      { name: '凤凰网', url: 'https://www.ifeng.com/', tags: ['门户'] },
      { name: '煎蛋', url: 'https://jandan.net/', tags: ['jandan', '无聊图', '科技'] },
      { name: 'CNN', url: 'https://edition.cnn.com/', tags: ['英文'] },
      { name: 'Bloomberg', url: 'https://www.bloomberg.com/', tags: ['彭博', '财经', '英文'] },
      { name: '卫报', url: 'https://www.theguardian.com/', tags: ['guardian', '英文'] },
      { name: 'Google 新闻', url: 'https://news.google.com/', tags: ['聚合', 'news'] },
      { name: 'Feedly', url: 'https://feedly.com/', tags: ['rss', '订阅'] },
      { name: 'Wikinews', url: 'https://en.wikinews.org/', tags: ['wiki', '公民新闻'] },
    ],
  },
  {
    id: 'design',
    name: '设计',
    aliases: ['ui', '创意', '视觉', '字体', '排版', '灵感', '素材'],
    visible: 8,
    recommend: { icon: 'behance', name: 'Behance', url: 'https://www.behance.net/' },
    sites: [
      { icon: 'cargo', name: 'Cargo', url: 'https://cargo.site/', tags: ['作品集', 'portfolio'] },
      { icon: 'designboom', name: 'designboom', url: 'https://www.designboom.com/', tags: ['工业设计'] },
      { icon: 'nounproject', name: 'TheNounProject', url: 'https://thenounproject.com/', tags: ['图标', 'icon'] },
      { icon: 'dribbble', name: 'Dribbble', url: 'https://dribbble.com/', tags: ['ui', '作品', '灵感'] },
      { icon: 'pinterest', name: 'Pinterest', url: 'https://www.pinterest.com/', tags: ['灵感', '图片', '收藏'] },
      { icon: 'iconmonstr', name: 'iconmonstr', url: 'https://iconmonstr.com/', tags: ['图标', 'icon'] },
      { icon: 'tumblr', name: 'Tumblr', url: 'https://www.tumblr.com/', tags: ['博客', '图片'] },
      // ---- 以下为 aa 补录 ----
      { name: 'Pixiv', url: 'https://www.pixiv.net/', tags: ['插画', '二次元', 'p站'] },
      { name: 'ArtStation', url: 'https://www.artstation.com/', tags: ['插画', '原画', 'cg'] },
      { name: 'deviantArt', url: 'https://www.deviantart.com/', tags: ['插画', '艺术'] },
      { name: 'Artsy', url: 'https://www.artsy.net/', tags: ['艺术', '拍卖'] },
      { name: 'ArtStack', url: 'https://artstack.com/', tags: ['艺术'] },
      { name: 'Niice', url: 'https://niice.co/', tags: ['灵感', 'moodboard'] },
      { name: 'MyFonts', url: 'https://www.myfonts.com/', tags: ['字体', 'font'] },
      { name: 'Adobe Fonts', url: 'https://fonts.adobe.com/', tags: ['字体', 'font', 'adobe'] },
      { name: 'ArchDaily', url: 'https://www.archdaily.com/', tags: ['建筑'] },
      { name: 'Houzz', url: 'https://www.houzz.com/', tags: ['家居', '装修'] },
      { name: 'Sketchfab', url: 'https://sketchfab.com/', tags: ['3d', '模型'] },
      { name: 'Hypebeast', url: 'https://hypebeast.com/', tags: ['潮流', '时尚'] },
      { name: 'Google Arts & Culture', url: 'https://artsandculture.google.com/', tags: ['艺术', '博物馆'] },
      // ---- 以下为手工补录 ----
      { name: '站酷', url: 'https://www.zcool.com.cn/', tags: ['zcool', '作品', '设计师'] },
      { name: '花瓣网', url: 'https://huaban.com/', tags: ['huaban', '灵感', '采集'] },
      { name: '稿定设计', url: 'https://www.gaoding.com/', tags: ['海报', '模板', '抠图'] },
      { name: '字由', url: 'https://www.hellofont.cn/', tags: ['字体', 'font'] },
      { name: '中国色', url: 'https://zhongguose.com/', tags: ['配色', '颜色', '色卡'] },
      { name: '搜图导航', url: 'https://www.91sotu.com/', tags: ['图片搜索', '图库'] },
      { name: '致美化', url: 'https://zhutix.com/', tags: ['主题', '美化', '桌面'] },
      // 原先放在「图片」，按使用场景归到设计更合适（NASA 官方图库，做视觉参考常用）
      { name: 'NASA Image Library', url: 'https://images.nasa.gov/', tags: ['nasa', '太空', '图片'] },
    ],
  },
  {
    id: 'picture',
    name: '图片',
    aliases: ['图库', '壁纸', '摄影', '照片'],
    visible: 8,
    recommend: { icon: 'Pinterest', name: 'Pinterest', url: 'https://www.pinterest.com/' },
    sites: [
      { icon: 'flickr', name: 'wallhaven', url: 'https://wallhaven.cc/', tags: ['壁纸', 'wallpaper'] },
      { icon: 'flickr', name: 'flickr', url: 'https://www.flickr.com/', tags: ['摄影', '相册'] },
      { icon: 'flickr', name: '彼岸图', url: 'https://pic.netbian.com/', tags: ['壁纸', '4k'] },
      // ---- 以下为 aa 补录 ----
      { name: 'Instagram', url: 'https://www.instagram.com/', tags: ['ins', '照片', '社交'] },
      { name: '500px', url: 'https://500px.com/', tags: ['摄影'] },
      { name: 'Lofter', url: 'https://www.lofter.com/', tags: ['摄影', '乐乎'] },
      { name: '天空之城', url: 'https://www.skypixel.com/', tags: ['航拍', '无人机', '摄影'] },
      { name: 'Google 相册', url: 'https://photos.google.com/', tags: ['照片', '备份'] },
      { name: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/', tags: ['图库', '免费版权', 'wiki'] },
      { name: 'Imgur', url: 'https://imgur.com/', tags: ['图床', '图片'] },
      { name: 'Giphy', url: 'https://giphy.com/', tags: ['gif', '动图'] },
      { name: 'iStockphoto', url: 'https://www.istockphoto.com/', tags: ['图库', '正版', '素材'] },
      { name: '视觉中国', url: 'https://www.vcg.com/', tags: ['图库', '版权'] },
      { name: 'Getty Images', url: 'https://www.gettyimages.com/', tags: ['图库', '正版'] },
    ],
  },
  {
    id: 'music',
    name: '音乐',
    aliases: ['听歌', '音频', '歌曲', '电台'],
    visible: 8,
    recommend: { icon: '163music', name: '网易云音乐', url: 'https://music.163.com/' },
    sites: [
      { icon: 'spotify', name: 'Spotify', url: 'https://open.spotify.com/', tags: ['听歌', '英文'] },
      { icon: 'QQmusic', name: 'QQ音乐', url: 'https://y.qq.com/', tags: ['听歌'] },
      { icon: 'soundcloud', name: 'SoundCloud', url: 'https://soundcloud.com/', tags: ['独立音乐', '音乐人'] },
      { icon: 'doubanmusic', name: '豆瓣音乐', url: 'https://m.douban.com/music/', tags: ['评分', '音乐'] },
      { icon: 'bandcamp', name: 'bandcamp', url: 'https://bandcamp.com/', tags: ['独立音乐'] },
      { icon: 'pandora', name: 'Pandora', url: 'https://www.pandora.com/', tags: ['电台'] },
      // ---- 以下为 aa 补录 ----
      { name: '酷狗音乐', url: 'https://www.kugou.com/', tags: ['听歌'] },
      { name: 'Last.fm', url: 'https://www.last.fm/', tags: ['记录', 'scrobble'] },
    ],
  },
  {
    id: 'video',
    name: '视频',
    aliases: ['影视', '追剧', '直播', '番剧', '弹幕'],
    visible: 8,
    recommend: { icon: 'youtube', name: 'YouTube', url: 'https://www.youtube.com/' },
    sites: [
      { icon: 'bilibili', name: 'Bilibili', url: 'https://www.bilibili.com/', tags: ['b站', '番剧', '弹幕'] },
      { icon: 'vimeo', name: 'Vimeo', url: 'https://vimeo.com/', tags: ['短片', '视频'] },
      { icon: 'youku', name: '优酷', url: 'https://youku.com/', tags: ['剧集', '综艺'] },
      { icon: 'qqv', name: '腾讯视频', url: 'https://v.qq.com/', tags: ['剧集', '综艺'] },
      { icon: 'iqiyi', name: '爱奇艺', url: 'https://www.iqiyi.com/', tags: ['剧集', '综艺'] },
      { icon: 'MagoTV', name: '芒果TV', url: 'https://www.mgtv.com/', tags: ['综艺'] },
      { icon: 'letv', name: '乐视视频', url: 'https://www.le.com/', tags: ['剧集'] },
      // ---- 以下为 aa 补录 ----
      { name: '斗鱼', url: 'https://www.douyu.com/', tags: ['直播', '游戏直播'] },
      { name: '梨视频', url: 'https://www.pearvideo.com/', tags: ['短视频', '资讯'] },
      { name: '搜狐视频', url: 'https://tv.sohu.com/', tags: ['美剧', '剧集'] },
      { name: 'AcFun', url: 'https://www.acfun.cn/', tags: ['a站', '弹幕'] },
    ],
  },
  {
    id: 'digital',
    name: '数码',
    aliases: ['科技', 'it', '硬件', '电子', '极客'],
    visible: 8,
    // 原先这里写「果壳网」却指向 ghxi.com（果核剥壳），图标又是 Pinterest —— 三个字段各说各话。
    // 果壳是 guokr.com，果核剥壳是软件站（该在「软件」）。按名字走，链到真正的果壳。
    recommend: { icon: 'guokr', name: '果壳', url: 'https://www.guokr.com/' },
    sites: [
      { name: '36kr', url: 'https://www.36kr.com/', tags: ['创业', '科技', '资讯'] },
      { name: '少数派', url: 'https://sspai.com/', tags: ['效率', '数字生活', '软件'] },
      // ---- 以下为 aa 补录 ----
      { name: 'The Verge', url: 'https://www.theverge.com/', tags: ['科技', '英文'] },
      { name: 'Engadget', url: 'https://www.engadget.com/', tags: ['科技', '英文'] },
      { name: 'TechCrunch', url: 'https://techcrunch.com/', tags: ['创投', '科技'] },
      { name: 'The Next Web', url: 'https://thenextweb.com/', tags: ['科技'] },
      { name: 'Ars Technica', url: 'https://arstechnica.com/', tags: ['科技', '深度'] },
      { name: 'CNET', url: 'https://www.cnet.com/', tags: ['评测', '科技'] },
      { name: 'GigaOM', url: 'https://gigaom.com/', tags: ['科技'] },
      { name: 'Fast Company', url: 'https://www.fastcompany.com/', tags: ['商业', '创新'] },
      { name: '爱范儿', url: 'https://www.ifanr.com/', tags: ['ifanr', '科技', '数码'] },
      { name: 'IT之家', url: 'https://www.ithome.com/', tags: ['ithome', '科技', '资讯'] },
      { name: '数字尾巴', url: 'https://www.dgtle.com/', tags: ['评测', '数码'] },
      { name: 'PingWest 品玩', url: 'https://www.pingwest.com/', tags: ['科技', '资讯'] },
      { name: 'Kickstarter', url: 'https://www.kickstarter.com/', tags: ['众筹'] },
      // ---- 以下为手工补录 ----
      { name: '蓝点网', url: 'https://www.landian.news/', tags: ['软件', 'windows', '资讯'] },
      { name: 'tlanyan', url: 'https://itlanyan.com/', tags: ['博客', 'linux', 'vps'] },
      { name: '零度博客', url: 'https://www.freedidi.com/', tags: ['博客', '软件'] },
      { name: '树莓派', url: 'https://www.raspberrypi.com/', tags: ['raspberry', 'pi', '硬件'] },
    ],
  },
  {
    id: 'shopping',
    name: '购物',
    aliases: ['电商', '网购', '比价', '优惠'],
    visible: 8,
    recommend: { icon: 'taobao', name: '淘宝', url: 'https://www.taobao.com/' },
    sites: [
      { icon: 'JD', name: '京东', url: 'https://www.jd.com/', tags: ['jd', '电商'] },
      { icon: 'smzdm', name: '什么值得买', url: 'https://www.smzdm.com/', tags: ['smzdm', '优惠', '比价'] },
      { icon: 'tmall', name: '天猫', url: 'https://www.tmall.com/', tags: ['tmall', '电商'] },
      { icon: 'amazon', name: '亚马逊', url: 'https://www.amazon.com/', tags: ['amazon', '海淘'] },
      // ---- 以下为 aa 补录 ----
      { name: '苏宁易购', url: 'https://www.suning.com/', tags: ['电商'] },
      { name: '蘑菇街', url: 'https://www.mogujie.com/', tags: ['女装', '电商'] },
      { name: '阿里巴巴', url: 'https://www.1688.com/', tags: ['1688', '批发', 'b2b'] },
      { name: '一号店', url: 'https://www.yhd.com/', tags: ['yhd', '超市'] },
      { name: 'eBay', url: 'https://www.ebay.com/', tags: ['拍卖', '海淘'] },
      { name: 'Etsy', url: 'https://www.etsy.com/', tags: ['手作', '手工', '设计'] },
      { name: 'ASOS', url: 'https://www.asos.com/', tags: ['服饰', '海淘'] },
      { name: 'Fancy', url: 'https://fancy.com/', tags: ['好物', '设计'] },
      { name: 'Chiphell', url: 'https://www.chiphell.com/', tags: ['硬件', '装机', '论坛'] },
    ],
  },
  {
    id: 'travel',
    name: '旅行',
    aliases: ['旅游', '出行', '地图', '酒店', '攻略', '机票'],
    visible: 8,
    recommend: { icon: 'googlemaps', name: '谷歌地图', url: 'https://www.google.com/maps/' },
    // 原数据里这条写的是 bilibili.png 但落在 icon/travel/ 下取不到，
    // 改成扁平键名后指向真实的 icon/video/bilibili.png —— 它本来就该是这个图标。
    sites: [
      { icon: 'bilibili', name: 'Bilibili', url: 'https://www.bilibili.com/', tags: ['b站', '番剧', '弹幕'] },
      // ---- 以下为 aa 补录 ----
      { name: '高德地图', url: 'https://www.amap.com/', tags: ['地图', '导航'] },
      { name: '百度地图', url: 'https://map.baidu.com/', tags: ['地图', '导航'] },
      { name: 'Google Earth', url: 'https://earth.google.com/web/', tags: ['地球', '卫星图'] },
      { name: '大众点评', url: 'https://www.dianping.com/', tags: ['点评', '美食', '本地'] },
      { name: '马蜂窝', url: 'https://www.mafengwo.cn/', tags: ['攻略', '游记', '旅游'] },
      { name: 'Airbnb', url: 'https://www.airbnb.cn/', tags: ['民宿', '住宿'] },
      { name: '穷游网', url: 'https://www.qyer.com/', tags: ['攻略', '出境游'] },
      { name: 'TripAdvisor', url: 'https://www.tripadvisor.com/', tags: ['点评', '旅行'] },
      { name: 'Foursquare', url: 'https://foursquare.com/', tags: ['签到', '地点'] },
      { name: 'Lonely Planet', url: 'https://www.lonelyplanet.com/', tags: ['攻略', '指南'] },
      { name: 'GOV.UK', url: 'https://www.gov.uk/', tags: ['英国', '签证', '政府'] },
      { name: 'Wikivoyage', url: 'https://www.wikivoyage.org/', tags: ['旅游', '攻略', 'wiki'] },
    ],
  },
  {
    id: 'books',
    name: '书籍',
    aliases: ['读书', '电子书', '小说', '阅读', '出版'],
    visible: 8,
    recommend: { icon: 'taobao', name: 'Z-library', url: 'https://zh.singlelogin.re/' },
    sites: [
      { icon: 'weread', name: '微信读书', url: 'https://weread.qq.com/', tags: ['读书', '电子书', 'epub'] },
      { icon: 'Goodreads', name: 'Goodreads', url: 'https://www.goodreads.com/', tags: ['书评', '读书', '英文'] },
      // ---- 以下为 aa 补录 ----
      { name: 'Google 图书', url: 'https://books.google.com/', tags: ['电子书', '图书'] },
      { name: '起点中文网', url: 'https://www.qidian.com/', tags: ['小说', '网文', '连载'] },
      { name: '多看阅读', url: 'https://www.duokan.com/', tags: ['电子书', '阅读器'] },
      { name: '书格', url: 'https://www.shuge.org/', tags: ['古籍', 'pdf', '电子书'] },
      { name: 'Issuu', url: 'https://issuu.com/', tags: ['杂志', 'pdf'] },
      { name: 'Phaidon', url: 'https://www.phaidon.com/', tags: ['艺术书', '出版'] },
      { name: 'Wikibooks', url: 'https://www.wikibooks.org/', tags: ['教材', 'wiki', '电子书'] },
      { name: '鸠摩搜索', url: 'https://www.jiumodiary.com/', tags: ['电子书', '搜书', 'pdf'] },
    ],
  },
  {
    id: 'code',
    name: '编程',
    aliases: ['开发', '代码', '程序员', '文档', '技术'],
    visible: 8,
    recommend: { icon: 'stackoverflow', name: 'Stack Overflow', url: 'https://stackoverflow.com/' },
    sites: [
      { icon: 'github', name: 'Github', url: 'https://github.com/', tags: ['代码', '仓库', '开源', 'git'] },
      { icon: 'appledev', name: 'Apple Developer', url: 'https://developer.apple.com/develop/', tags: ['ios', '苹果', '开发文档'] },
      { icon: 'cocoapods', name: 'CocoaPods', url: 'https://cocoapods.org/', tags: ['ios', '依赖', 'cocoapods'] },
      { icon: 'unity', name: 'Unity', url: 'https://unity.com/', tags: ['游戏引擎', 'unity'] },
      { icon: 'apisio', name: 'APIs', url: 'https://apis.io/', tags: ['api', '接口'] },
      { icon: 'codepen', name: 'CodePen', url: 'https://codepen.io/', tags: ['前端', 'demo', '代码'] },
      { icon: 'codepen', name: 'W3Schools', url: 'https://www.w3school.com.cn/', tags: ['前端', '教程', 'html'] },
      { icon: 'codepen', name: '菜鸟教程', url: 'https://www.runoob.com/', tags: ['教程', 'runoob', '编程'] },
      { icon: 'codepen', name: 'Android Dev', url: 'https://developer.android.com/get-started/', tags: ['安卓', 'android', '开发文档'] },
      // ---- 以下为 aa 补录 ----
      { name: 'Cocoa Controls', url: 'https://www.cocoacontrols.com/', tags: ['ios', '组件'] },
      { name: 'Code4App', url: 'http://www.code4app.com/', tags: ['ios', '代码'] },
      { name: 'V2EX', url: 'https://www.v2ex.com/', tags: ['社区', '程序员', 'v2ex'] },
      { name: 'CSDN', url: 'https://www.csdn.net/', tags: ['博客', '问答', '程序员'] },
      { name: 'Processing', url: 'https://processing.org/', tags: ['创意编程', 'processing'] },
      { name: 'Shodan', url: 'https://www.shodan.io/', tags: ['物联网', '设备搜索', '安全'] },
      { name: 'Pastebin', url: 'https://pastebin.com/', tags: ['代码片段', '粘贴'] },
      { name: 'PublicAPIs', url: 'https://publicapis.dev/', tags: ['api', '接口'] },
      { name: 'GoDaddy', url: 'https://www.godaddy.com/', tags: ['域名', '主机'] },
      { name: 'Name.com', url: 'https://www.name.com/', tags: ['域名'] },
      { name: 'Apifox', url: 'https://apifox.com/', tags: ['api', '接口', '调试'] },
    ],
  },
  {
    id: 'forums',
    name: '论坛',
    aliases: ['社区', 'bbs', '讨论', '嵌入式'],
    visible: 8,
    // 推荐位原先也是 Linux 企鹅（跟分类毫无关系）。改成这一列里最该被点的论坛：
    // 吾爱破解提上来当主链接，就不再留在 sites 里 —— 与「财经·天天基金网」同一条规矩。
    recommend: { icon: '52pojie', name: '吾爱破解', url: 'https://www.52pojie.cn/' },
    sites: [
      { icon: 'openedv', name: '开源电子网', url: 'http://www.openedv.com/', tags: ['嵌入式', 'stm32', '正点原子'] },
      { icon: 'fire', name: '野火论坛', url: 'https://www.firebbs.cn/', tags: ['嵌入式', 'stm32', '野火'] },
      { icon: 'fire', name: 'FireFly', url: 'https://dev.t-firefly.com/', tags: ['嵌入式', 'rk3399', '开发板'] },
      { icon: 'fire', name: 'Ubuntu中文社区', url: 'https://forum.ubuntu.org.cn/', tags: ['linux', 'ubuntu'] },
      { icon: 'fire', name: 'QTCN', url: 'http://www.qtcn.org/', tags: ['qt', 'qtcn'] },
      { icon: 'fire', name: '中国电子网', url: 'https://bbs.21ic.com/', tags: ['21ic', '电子'] },
      { icon: 'fire', name: '电子发烧友', url: 'https://bbs.elecfans.com/', tags: ['elecfans', '电子'] },
      { icon: 'fire', name: '电子产品世界', url: 'https://www.eepw.com.cn/', tags: ['eepw', '电子'] },
      { icon: 'fire', name: '阿莫电子论坛', url: 'https://www.amobbs.com/', tags: ['amobbs', '电子', '嵌入式'] },
      // ---- 以下为手工补录 ----
      { name: '远景论坛', url: 'https://bbs.pcbeta.com/', tags: ['pcbeta', 'windows', '黑苹果'] },
      { name: '恩山无线论坛', url: 'https://www.right.com.cn/forum/forum.php', tags: ['路由器', 'openwrt', '刷机'] },
    ],
  },
  {
    id: 'tools',
    name: '工具',
    aliases: ['在线工具', '小工具', '生成器', '转换', '图标', '素材'],
    visible: 8,
    // 同样是企鹅换掉。工具这一格最常被点的是找图标 → 阿里图标库。
    recommend: { icon: 'iconfont', name: 'iconfont 图标库', url: 'https://www.iconfont.cn/' },
    sites: [
      { icon: 'icon-icons', name: 'icons', url: 'https://icon-icons.com/pt/', tags: ['图标', 'icon'] },
      { icon: 'icon-icons', name: 'Free icons', url: 'https://icons8.com/', tags: ['图标', 'icon', 'icons8'] },
      { icon: 'icon-icons', name: '小众技术', url: 'https://www.xiaozhongjishu.com/', tags: ['博客', '工具'] },
      { icon: 'icon-icons', name: 'emoji合成', url: 'https://tikolu.net/emojimix/', tags: ['emoji', '表情'] },
      // ---- 以下为手工补录 ----
      { name: '晨钟网络科技', url: 'https://jamcz.com/index.html', tags: ['博客', '工具'] },
      { name: '奔跑的奶酪', url: 'https://www.runningcheese.com/', tags: ['效率', '软件', '博客'] },
    ],
  },
  {
    id: 'net',
    name: '网络',
    aliases: ['域名', '主机', 'cdn', 'dns', '服务器', 'vps'],
    visible: 8,
    // 原名「Cloud Flare」是拼错的，图标也借用 Linux 企鹅；换成 Cloudflare 自己的 logo。
    recommend: { icon: 'cloudflare', name: 'Cloudflare', url: 'https://dash.cloudflare.com/' },
    sites: [
      { name: 'EU.ORG', url: 'https://nic.eu.org/', tags: ['免费域名', '域名'] },
      { name: 'goorm', url: 'https://www.goorm.io/', tags: ['ide', '云端开发'] },
      { name: '硬核指南', url: 'https://yinghezhinan.com/', tags: ['教程', 'vps', '博客'] },
    ],
  },
  {
    id: 'game',
    name: '游戏',
    aliases: ['单机', '手游', '主机', '游戏下载', '模拟器'],
    visible: 8,
    recommend: { icon: 'steam', name: 'Steam', url: 'https://store.steampowered.com/' },
    sites: [
      { icon: 'epic', name: 'EPIC', url: 'https://www.epicgames.com/', tags: ['喜加一', '游戏商店'] },
      { name: '好玩游戏厅', url: 'https://www.coarcade.com/', tags: ['小游戏', '在线玩'] },
      { name: '520switch', url: 'https://www.520switch.com/', tags: ['switch', '破解'] },
      { name: '游戏星辰', url: 'https://www.2023game.com/', tags: ['单机', '下载'] },
      { name: 'byrutor', url: 'https://repack-byrutor.org/', tags: ['破解', 'repack', '下载'] },
      { name: 'Switch520', url: 'https://www.gamer520.com/', tags: ['switch', '下载'] },
      { name: '资源避难所', url: 'https://www.flysheep6.com/', tags: ['资源', '下载'] },
      { name: '灵动游戏', url: 'https://www.mhhf.com/', tags: ['小游戏', 'flash'] },
      { name: 'PacoGames', url: 'https://www.pacogames.com/', tags: ['小游戏', '在线玩'] },
      { name: '小霸王', url: 'https://www.yikm.net/', tags: ['fc', '街机', '怀旧'] },
      { name: 'KBH Games', url: 'https://kbhgames.com/', tags: ['小游戏', '在线玩'] },
      { name: 'OldmanEmu', url: 'https://www.oldmantvg.net/', tags: ['模拟器', '怀旧'] },
      { name: 'Tekqart', url: 'https://www.tekqart.com/', tags: ['switch', '资源'] },
      { name: 'Switch321', url: 'https://www.switch321.com/', tags: ['switch', '资源'] },
      { name: '三国杀', url: 'https://web.sanguosha.com/', tags: ['桌游', '卡牌'] },
      // ---- 以下为 aa 补录 ----
      { name: 'IGN', url: 'https://www.ign.com/', tags: ['评分', '评测', '游戏'] },
      { name: 'GameSpot', url: 'https://www.gamespot.com/', tags: ['评分', '评测'] },
      { name: 'Polygon', url: 'https://www.polygon.com/', tags: ['游戏媒体', '评测'] },
      { name: 'Twitch', url: 'https://www.twitch.tv/', tags: ['直播', '游戏直播'] },
      { name: 'IndieDB', url: 'https://www.indiedb.com/', tags: ['独立游戏'] },
      { name: 'itch.io', url: 'https://itch.io/', tags: ['独立游戏', 'indie'] },
      { name: 'Indienova', url: 'https://indienova.com/', tags: ['独立游戏', 'indienova'] },
      { name: 'VGChartz', url: 'https://www.vgchartz.com/', tags: ['销量', '游戏'] },
      { name: 'Minecraft Wiki', url: 'https://minecraft.wiki/', tags: ['我的世界', 'mc', 'wiki'] },
      { name: '游侠网', url: 'https://www.ali213.net/', tags: ['ali213', '单机', '攻略'] },
      // ---- 以下为手工补录 ----
      { icon: 'ns211', name: 'NS中文网', url: 'https://www.ns211.com/', tags: ['switch', 'ns'] },
    ],
  },
  {
    id: 'others',
    name: '其他',
    aliases: ['杂项', '生活', '查询', '词典'],
    visible: 8,
    // 企鹅换掉。「其他」本来就是一锅杂项，主链接给查询类里使用频率最高的天眼查。
    recommend: { icon: 'tianyancha', name: '天眼查', url: 'https://www.tianyancha.com/' },
    sites: [
      { name: 'NoteBook', url: 'https://notebook.js.org/#/', tags: ['笔记', 'notebook'] },
      { name: 'SteamPY', url: 'https://steampy.com/home', tags: ['steam', '代购'] },
      { name: '星露谷物语Wiki', url: 'https://zh.stardewvalleywiki.com/', tags: ['星露谷', 'wiki'] },
      { name: '黑神话·悟空Wiki', url: 'https://wiki.biligame.com/wukong/', tags: ['黑神话', 'wiki'] },
      // ---- 以下为 aa 补录 ----
      { name: '企查查', url: 'https://www.qcc.com/', tags: ['企业查询', '工商'] },
      { name: '雪球', url: 'https://xueqiu.com/', tags: ['股票', '投资', '社区'] },
      { name: 'TradingEconomics', url: 'https://tradingeconomics.com/', tags: ['经济数据', '宏观'] },
      { name: '金山词霸', url: 'https://www.iciba.com/', tags: ['词典', '翻译', '英语'] },
      { name: 'Urban Dictionary', url: 'https://www.urbandictionary.com/', tags: ['俚语', '英语', '词典'] },
      { name: 'Ludwig', url: 'https://ludwig.guru/', tags: ['例句', '英语'] },
      { name: 'Forvo', url: 'https://forvo.com/', tags: ['发音', '英语'] },
      { name: 'Wiktionary', url: 'https://www.wiktionary.org/', tags: ['词典', 'wiki'] },
      { name: 'Wikiquote', url: 'https://www.wikiquote.org/', tags: ['语录', 'wiki'] },
      { name: '萌娘百科', url: 'https://zh.moegirl.org.cn/', tags: ['二次元', 'wiki', 'acg'] },
      { name: '伪基百科', url: 'https://uncyclopedia.com/', tags: ['恶搞', 'wiki'] },
      { name: '9GAG', url: 'https://9gag.com/', tags: ['搞笑', 'meme', '图片'] },
      { name: 'IFTTT', url: 'https://ifttt.com/', tags: ['自动化'] },
      // 95504 这个地址末尾的 # 是它自己的路由写法，保留原样
      { name: '昆仑加油卡', url: 'https://www.95504.net/NewIndex.aspx#', tags: ['加油', '油卡'] },
      { name: '中国石化加油卡', url: 'https://www.sinopecsales.com/', tags: ['加油', '油卡'] },
      { name: '笔点', url: 'https://www.bidianer.com/', tags: ['导航', '收藏'] },
      { name: 'GTAWeb.eu', url: 'https://gtaweb.eu/', tags: ['gta', '地图'] },
      { name: 'Game-Zone Labs', url: 'https://gamezonelabs.com/', tags: ['gta', '存档'] },
      { name: 'HTML5 Savegame Editors', url: 'https://www.marcrobledo.com/savegame-editors/', tags: ['存档', '修改器'] },
    ],
  },
  // ---- 以下 3 个分类为 aa 独有，本次补录时新增 ----
  {
    id: 'movie',
    name: '电影',
    aliases: ['影视', '影评', '评分', '票房'],
    visible: 8,
    recommend: { icon: 'doubanmovie', name: '豆瓣电影', url: 'https://movie.douban.com/' },
    sites: [
      { name: 'IMDb', url: 'https://www.imdb.com/', tags: ['评分', '影评', '电影'] },
      { name: '时光网', url: 'https://www.mtime.com/', tags: ['评分', '影评', 'mtime'] },
      { name: '烂番茄', url: 'https://www.rottentomatoes.com/', tags: ['评分', '影评', 'rottentomatoes'] },
    ],
  },
  {
    id: 'app',
    name: '应用',
    aliases: ['app', '软件商店', '安卓', '下载', '插件'],
    visible: 8,
    recommend: { icon: 'appstore', name: 'App Store', url: 'https://www.apple.com/app-store/' },
    sites: [
      { name: 'Google Play', url: 'https://play.google.com/', tags: ['安卓', 'apk', '应用商店'] },
      { name: '酷安', url: 'https://www.coolapk.com/', tags: ['coolapk', '安卓', '应用'] },
      { name: '应用宝', url: 'https://sj.qq.com/', tags: ['安卓', '应用商店', '腾讯'] },
      { name: '豌豆荚', url: 'https://www.wandoujia.com/', tags: ['安卓', '应用商店'] },
      { name: 'Chrome 网上应用店', url: 'https://chromewebstore.google.com/', tags: ['扩展', '插件', 'chrome'] },
      { name: 'Product Hunt', url: 'https://www.producthunt.com/', tags: ['产品', '发现'] },
      { name: 'AlternativeTo', url: 'https://alternativeto.net/', tags: ['替代', '软件推荐'] },
      { name: 'BetaList', url: 'https://betalist.com/', tags: ['新产品', 'beta'] },
      { name: 'CreativeApplications', url: 'https://www.creativeapplications.net/', tags: ['创意', '交互', '艺术'] },
    ],
  },
  {
    id: 'search',
    name: '搜索',
    aliases: ['搜索引擎', '查资料'],
    visible: 8,
    recommend: { icon: 'google', name: 'Google', url: 'https://www.google.com/' },
    sites: [
      { name: '百度', url: 'https://www.baidu.com/', tags: ['baidu'] },
      { name: '搜狗', url: 'https://www.sogou.com/', tags: ['sogou'] },
      { name: '必应 Bing', url: 'https://www.bing.com/', tags: ['bing', '微软'] },
      { name: 'DuckDuckGo', url: 'https://duckduckgo.com/', tags: ['ddg', '隐私搜索'] },
      { name: 'Yahoo!', url: 'https://www.yahoo.com/', tags: ['雅虎'] },
      { name: 'Naver', url: 'https://www.naver.com/', tags: ['韩国'] },
      { name: 'Wolfram|Alpha', url: 'https://www.wolframalpha.com/', tags: ['计算', '数学', '知识引擎'] },
    ],
  },
  // ---- 以下 2 个分类为本次新建 ----
  {
    id: 'finance',
    name: '财经',
    aliases: ['股票', '基金', '投资', '行情', '财报'],
    visible: 8,
    // 推荐位用天天基金网：它是这 6 个站点里唯一能拿到高清方形 Logo 的
    // （官方 icon link 指向一张 256×256 的 PNG，已存为 header/tiantianjijin.png）。
    recommend: {
      icon: 'tiantianjijin',
      name: '天天基金网',
      url: 'https://www.1234567.com.cn/',
    },
    sites: [
      { name: '集思录', url: 'https://www.jisilu.cn/', tags: ['债券', '可转债', '套利'] },
      { name: '理杏仁', url: 'https://www.lixinger.com/', tags: ['估值', '财报', '股票'] },
      { name: '同花顺问财', url: 'https://www.iwencai.com/screener', tags: ['选股', '股票', '问财'] },
      { name: '巨潮资讯网', url: 'https://www.cninfo.com.cn/new/index', tags: ['公告', '财报', 'a股'] },
      { name: '香港交易所披露易', url: 'https://www.hkexnews.hk/index_c.htm', tags: ['港股', '公告', 'hkex'] },
    ],
  },
  {
    id: 'software',
    name: '软件',
    aliases: ['下载', 'windows', 'mac', '装机', '系统'],
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
      { name: '异次元软件世界', url: 'https://www.iplaysoft.com/', tags: ['iplaysoft', '软件', '下载'] },
      { name: '麦氪派', url: 'https://www.waitsun.com/', tags: ['mac', '软件', '下载'] },
      { name: '马可菠萝', url: 'https://www.macbl.com/', tags: ['mac', '软件', '下载'] },
      { name: '精品MAC应用分享', url: 'https://xclient.info/', tags: ['mac', '软件', '下载'] },
      { name: 'MSDN, 我告诉你', url: 'https://msdn.itellyou.cn/', tags: ['windows', '系统镜像', 'iso'] },
    ],
  },
  {
    id: 'git',
    name: 'Git收藏',
    aliases: ['github', '开源', '仓库', '项目'],
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
      { name: 'Game-Cheats-Manager', url: 'https://github.com/dyang886/Game-Cheats-Manager', tags: ['修改器', '游戏'] },
      { name: 'IPTV', url: 'https://github.com/yuanzl77/IPTV', tags: ['直播源', 'iptv'] },
      { name: 'RetroArch', url: 'https://github.com/libretro/RetroArch', tags: ['模拟器', 'retroarch'] },
      { name: 'HEU_KMS_Activator', url: 'https://github.com/zbezj/HEU_KMS_Activator', tags: ['激活', 'kms', 'windows'] },
      { name: '得意黑', url: 'https://github.com/atelier-anchor/smiley-sans', tags: ['字体', '开源字体', 'smiley'] },
    ],
  },
];
/** 全站条目总数，提示文案里要用 */
export const TOTAL_SITES = CATEGORIES.reduce((n, c) => n + c.sites.length, 0);
