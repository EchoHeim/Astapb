import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const SCRATCH = path.join(import.meta.dirname, '_out');
const RAW = path.join(SCRATCH, 'raw');
const BASE = 'D:/Personal/Astapb/CodeKey/03-选题与成稿/技术干货/嵌入式';
const PKG = path.join(BASE, '发布包');
const COMMON = path.join(BASE, '_通用');
// 发布包目录按日期排序，与 14 篇顺序一一对应
const DIRS = fs.readdirSync(PKG).filter((d) => /^\d{4}-\d{2}-\d{2}_/.test(d)).sort();
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const FFMPEG = 'ffmpeg';

for (const d of [SCRATCH, RAW, COMMON]) fs.mkdirSync(d, { recursive: true });

const CSS = `
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"Microsoft YaHei","msyhbd",sans-serif;
  background:#FBF6EA;color:#2E363D;position:relative;overflow:hidden}
.grid{position:absolute;inset:0;
  background-image:linear-gradient(rgba(46,54,61,.055) 1px,transparent 1px),
                   linear-gradient(90deg,rgba(46,54,61,.055) 1px,transparent 1px);
  background-size:26px 26px}
.inner{position:relative;padding:0 30px;height:100%;
  display:flex;align-items:center;gap:18px}
.bar{flex:0 0 4px;align-self:stretch;margin:18px 0;background:#9C2B1F;border-radius:2px}
.c{flex:1;display:flex;flex-direction:column;justify-content:center;gap:6px}
.kicker{font-size:13px;font-weight:700;color:#9C2B1F;letter-spacing:.12em}
.h{font-size:25px;font-weight:900;color:#1F3A6E;line-height:1.25}
.h em{font-style:normal;color:#9C2B1F}
.p{font-size:14px;color:#5A626C;line-height:1.5}
.right{flex:0 0 auto;text-align:right;font-size:13px;color:#8C8368;line-height:1.6}
.right b{color:#9C2B1F}
.dots{display:flex;gap:5px;margin-top:3px}
.dots i{width:9px;height:9px;border-radius:50%;border:1.4px solid #1F3A6E;display:block}
.dots i.on{background:#1F3A6E}
.hr{height:1px;background:rgba(46,54,61,.18);margin:0}
`;

// 14 篇顺序即 VOL 序号
const TITLES = [
  '串口收到乱码', '一个 0x55 走完串口线', 'USB 转串口四颗芯片', 'RS485 通讯不上',
  'I2C 读一个寄存器', 'I2C 总线被拉死', '五种总线怎么选', 'SPI 的 CPOL 和 CPHA',
  'CAN 一帧的结构', 'CAN 逐位仲裁', 'CAN 收不到数据', '1-Wire 一根线挂一串',
  '网口灯亮之后', 'WiFi BLE LoRa 怎么选',
];

const FIGS = [];

// 1) 系列导航：14 张，文首用
TITLES.forEach((t, i) => {
  const n = i + 1;
  FIGS.push({
    id: `引导-1-系列导航-${String(n).padStart(2, '0')}`, w: 750, h: 140,
    dest: path.join('发布包', DIRS[i], `引导-系列导航-${String(n).padStart(2, '0')}.png`),
    html: `<div class="inner">
      <div class="bar"></div>
      <div class="c">
        <div class="kicker">嵌入式通信避坑 · VOL.${String(n).padStart(2, '0')}</div>
        <div class="h">第 <em>${n}</em> 篇 / 共 14 篇</div>
        <div class="dots">${Array.from({ length: 14 }, (_, k) => `<i class="${k < n ? 'on' : ''}"></i>`).join('')}</div>
      </div>
      <div class="right">点标题下方<b>合集</b><br>看全套 14 篇</div>
    </div>`,
  });
});

// 2) 中段钩子：1 张通用
FIGS.push({
  id: '引导-2-排查表钩子', w: 750, h: 118, dest: path.join('_通用', '引导-2-排查表钩子.png'),
  html: `<div class="inner">
    <div class="bar"></div>
    <div class="c">
      <div class="kicker">下面这张是全文最值钱的</div>
      <div class="h">一张排查表，按顺序走</div>
      <div class="p">多数问题在第 1 步就现形，不用一路查到协议栈</div>
    </div>
  </div>`,
});

// 3) 文末收尾：1 张通用
FIGS.push({
  id: '引导-3-文末收尾', w: 750, h: 176, dest: path.join('_通用', '引导-3-文末收尾.png'),
  html: `<div class="inner" style="flex-direction:column;align-items:stretch;gap:12px;padding:24px 30px">
    <div style="display:flex;align-items:stretch;gap:16px">
      <div class="bar" style="margin:0"></div>
      <div class="c">
        <div class="kicker">嵌入式通信避坑 · 全套 14 篇</div>
        <div class="h">从串口一直讲到 CAN</div>
      </div>
    </div>
    <div class="hr"></div>
    <div style="display:flex;justify-content:space-between;align-items:center;padding-top:2px">
      <div class="p">串口 · 485 · I2C · SPI · CAN · USB · 以太网 · 无线</div>
      <div class="right" style="flex:0 0 auto">点标题下方<b>合集</b> →</div>
    </div>
  </div>`,
});

const page = (f) => `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
${CSS}
body{width:${f.w}px;height:${f.h}px}
</style></head><body><div class="grid"></div>${f.html}</body></html>`;

let ok = 0;
for (const f of FIGS) {
  const html = path.join(SCRATCH, f.id + '.html');
  const raw = path.join(RAW, f.id + '.png');
  const out = path.join(BASE, f.dest);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(html, page(f), 'utf8');
  try {
    execFileSync(CHROME, [
      '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-sandbox',
      '--force-device-scale-factor=2',
      `--window-size=${f.w},${f.h}`,
      '--virtual-time-budget=3000',
      '--screenshot=' + raw,
      'file:///' + html.replace(/\\/g, '/'),
    ], { stdio: 'pipe', timeout: 60000 });
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', raw,
      '-vf', `scale=${f.w}:${f.h}:flags=lanczos`, '-q:v', '3', out], { stdio: 'pipe' });
    ok++;
  } catch (e) {
    console.log(`FAIL ${f.id}  ${String(e.message).slice(0, 100)}`);
  }
}
console.log(`${ok}/${FIGS.length} 张已写入对应发布包 / _通用`);
