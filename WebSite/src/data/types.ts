/**
 * 导航站的数据模型。
 *
 * 设计要点：图标在数据里**显式声明**，不再靠分类中文名去猜目录。
 *
 * 旧实现（create.js）用 `switch (obj.header)` 把「知识」映射到 `icon/knowledge/`，
 * 于是「分类改名」和「图标路径」被强行绑死，任何跨分类复用图标都会静默 404。
 * 现在图标来自一个扁平的键值清单（见 lib/icons.ts），数据里写什么键就取什么图，
 * 键不存在时构建期直接报错，而不是悄悄渲染一个空白。
 */

/** 一个站点条目 */
export interface Site {
  /** 显示名 */
  name: string;
  /** 点击后打开的地址 */
  url: string;
  /**
   * 图标键，对应资产文件名去掉扩展名（如 `github` → `icon/code/github.png`）。
   * 省略表示没有合适的图标，渲染时用首字母色块兜底。
   */
  icon?: string;
}

/** 分类的「推荐位」——那个大图标 */
export interface Recommend {
  name: string;
  url: string;
  /** 图标键，对应 header/ 下的文件 */
  icon: string;
}

/** 一个分类 */
export interface Category {
  /** 锚点 id，同时用于滚动定位与深链，保持 ASCII */
  id: string;
  /** 分类显示名 */
  name: string;
  /** 分类下默认展示的条目数，超出的部分悬停/聚焦展开 */
  visible: number;
  recommend: Recommend;
  sites: Site[];
}

/** 搜索框那一排外部搜索引擎 */
export interface Engine {
  /** 图标键，对应 search/ 下的文件 */
  icon: string;
  /** 引擎名，用于无障碍标签与提示 */
  name: string;
  /** 查询地址前缀，会拼接输入的关键词 */
  query: string;
}
