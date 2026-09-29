/**
 * 主题切换。
 *
 * 约定与博客（WebBlog/src/layouts/BaseLayout.astro）保持一致：
 * 键名从 `<html data-theme-key>` 上读，没手动选过就跟随系统，
 * 首帧颜色由 index.html 里的内联同步脚本决定（写在模块脚本里会来不及，会闪一下）。
 */

export type Theme = 'light' | 'dark';

function themeKey(): string {
  return document.documentElement.dataset.themeKey || 'nav-theme';
}

export function currentTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(themeKey(), theme);
  } catch {
    /* 隐私模式下 localStorage 会抛异常，忽略即可 */
  }
}

export function initTheme(button: HTMLElement): void {
  button.addEventListener('click', () => {
    applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  });

  // 用户没手动选过时，跟着系统走
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(themeKey());
    } catch {
      /* 忽略 */
    }
    if (saved !== 'light' && saved !== 'dark') {
      document.documentElement.setAttribute('data-theme', event.matches ? 'dark' : 'light');
    }
  });
}
