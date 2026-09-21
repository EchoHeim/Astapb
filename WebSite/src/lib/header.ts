/**
 * 吸顶搜索区的测量。
 *
 * 搬到顶部并吸顶之后，多出两个必须知道「它有多高」的消费方：
 *   - CSS 的 `scroll-margin-top`（layout.css）：不知道高度，锚点跳转会把目标卡片
 *     顶到吸顶区下面，点了等于没点；
 *   - anchors.ts 的「当前行」判定线：如果还用原来的 `innerHeight * 0.25`，
 *     已经滚到吸顶区后面的卡片仍会被判成当前分类。
 *
 * 高度不是常量 —— 视口变窄会让锚点换行、浏览器字体缩放也会改变它，
 * 所以用 ResizeObserver 跟着量，而不是写死一个数。
 */

const HEADER_ID = 'search';

function headerElement(): HTMLElement | null {
  return document.getElementById(HEADER_ID);
}

/** 把搜索区的实际高度写进 `--header-h`，单位 px。 */
export function observeHeaderHeight(): void {
  const header = headerElement();
  if (!header) return;

  const apply = (): void => {
    document.documentElement.style.setProperty(
      '--header-h',
      `${header.getBoundingClientRect().height}px`,
    );
  };

  apply();
  new ResizeObserver(apply).observe(header);
}

/**
 * 「当前分类」判定线的纵坐标。
 *
 * 吸顶时搜索区一直贴在视口顶部，其下沿就是固定值，直接用它；
 * 搜索区是 static（移动端）或已被滚走时下沿会是负数，此时退回视口高度的 15%，
 * 保证判定线始终落在视口内、且靠近内容区顶部。
 */
export function scrollLine(): number {
  const header = headerElement();
  const bottom = header ? header.getBoundingClientRect().bottom : 0;
  return Math.max(bottom, window.innerHeight * 0.15);
}
