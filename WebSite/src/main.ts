import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/responsive.css';

import logoUrl from '../img/logo.png';
import { TOTAL_SITES } from './data/categories';
import { DEFAULT_ENGINE_ID, ENGINES } from './data/engines';
import { createAnchors } from './lib/anchors';
import { mount, openExternal } from './lib/dom';
import { observeHeaderHeight } from './lib/header';
import { createGrid, renderEngines } from './lib/render';
import { initTheme } from './lib/theme';

const searchBox = mount('#searchBox') as HTMLInputElement;
const defaultEngine = ENGINES.find((engine) => engine.icon === DEFAULT_ENGINE_ID) ?? ENGINES[0]!;

// 界面上的默认引擎文案由数据推导，不再手写 —— 旧版这里写着「按回车搜索 Google」，
// 实际跳的却是必应。
const hintDefault = mount('#hintDefault');
hintDefault.textContent = `按回车用「${defaultEngine.name}」搜索`;

const hintCount = mount('#hintCount');

// 搜索框右侧那个装饰用的小图标
const logo = document.querySelector<HTMLImageElement>('.search-logo');
if (logo) logo.src = logoUrl;

const setEngineHrefs = renderEngines(mount('#searchItem'), ENGINES);

const anchors = createAnchors(mount('#anchors'));

const grid = createGrid(mount('#grid'), (shown, total, filtering) => {
  hintCount.textContent = filtering ? `匹配 ${shown} / ${total} 个站点` : `共 ${total} 个站点`;
  hintCount.classList.toggle('is-active', filtering);
});

/** 输入框内容变化时的统一入口：站内过滤 + 外链目标 + 锚点可用性一起刷新。 */
function syncQuery(): void {
  const raw = searchBox.value;
  setEngineHrefs(raw.trim());
  grid.setQuery(raw);
  anchors.refresh();
}

searchBox.addEventListener('input', syncQuery);

searchBox.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    const keyword = searchBox.value.trim();
    openExternal(defaultEngine.query + encodeURIComponent(keyword));
  } else if (event.key === 'Escape') {
    if (searchBox.value === '') return;
    searchBox.value = '';
    syncQuery();
  }
});

// 「/」聚焦搜索框 —— 只在没在输入时才接管，免得打字打不出斜杠
window.addEventListener('keydown', (event) => {
  if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
  const target = event.target as HTMLElement | null;
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
    return;
  }
  event.preventDefault();
  searchBox.focus();
  searchBox.select();
});

initTheme(mount('#themeToggle'));

// 量出吸顶搜索区的高度写进 --header-h：锚点跳转的避让距离（CSS）与
// 滚动高亮的判定线（anchors.ts）都读它。要在 syncQuery() 之前跑，
// 免得首屏那一次 refresh 用到兜底值。
observeHeaderHeight();

// 首屏：不过滤，渲染全部 17 个分类
hintCount.textContent = `共 ${TOTAL_SITES} 个站点`;
syncQuery();
