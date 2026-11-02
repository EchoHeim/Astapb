import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';

const SCRATCH = path.join(import.meta.dirname, '_out');
const RAW = path.join(SCRATCH, 'raw');
const OUT = 'D:/Personal/Astapb/CodeKey/03-选题与成稿/技术干货/嵌入式/发布包';
// 发布包目录按日期排序，与 COVERS 数组顺序一一对应
const DIRS = fs.readdirSync(OUT).filter((d) => /^\d{4}-\d{2}-\d{2}_/.test(d)).sort();
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const FFMPEG = 'ffmpeg';

for (const d of [SCRATCH, RAW, OUT]) fs.mkdirSync(d, { recursive: true });

// 14 篇，按建议发布顺序。lines 每行 <= 8 个中文字；kicker 是左上角栏目行
const COVERS = [
  { id: '01-串口乱码', kicker: '嵌入式通信避坑 · VOL.01', lines: ['串口乱码', '先查这 6 步'], sub: 'UART · 共地 · 电平 · 溢出' },
  { id: '02-UART帧', kicker: '嵌入式通信避坑 · VOL.02', lines: ['一个 0x55', '走完串口线'], sub: '起始位 · 8 位数据 · 停止位' },
  { id: '03-USB转串口', kicker: '嵌入式通信避坑 · VOL.03', lines: ['四颗芯片', '到底差在哪'], sub: 'CH340 · CP2102 · FT232 · PL2303' },
  { id: '04-RS485不通', kicker: '嵌入式通信避坑 · VOL.04', lines: ['485 不通', '从 A/B 查起'], sub: '差分 · 终端电阻 · DE 切换' },
  { id: '05-I2C时序', kicker: '嵌入式通信避坑 · VOL.05', lines: ['读一个寄存器', '11 个动作'], sub: 'START · 地址 · ACK · ReSTART' },
  { id: '06-I2C拉死', kicker: '嵌入式通信避坑 · VOL.06', lines: ['SDA 被拉死', '怎么救回来'], sub: '总线恢复 · 9 个时钟 · STOP' },
  { id: '07-总线选型', kicker: '嵌入式通信避坑 · VOL.07', lines: ['五种总线', '一张表选完'], sub: 'UART · SPI · I2C · CAN · 485' },
  { id: '08-SPI模式', kicker: '嵌入式通信避坑 · VOL.08', lines: ['CPOL 和 CPHA', '配错就废'], sub: '四个模式 · 采样边沿' },
  { id: '09-CAN帧', kicker: '嵌入式通信避坑 · VOL.09', lines: ['CAN 一帧', '从 SOF 到 EOF'], sub: '仲裁场 · DLC · CRC · ACK' },
  { id: '10-CAN仲裁', kicker: '嵌入式通信避坑 · VOL.10', lines: ['几十个节点', '为什么不撞车'], sub: '显性 · 隐性 · 逐位比较' },
  { id: '11-CAN报错', kicker: '嵌入式通信避坑 · VOL.11', lines: ['CAN 收不到', '先看 TEC'], sub: 'Bus-Off · 错误计数 · 终端' },
  { id: '12-1Wire', kicker: '嵌入式通信避坑 · VOL.12', lines: ['一根线', '挂一串器件'], sub: 'ROM ID · 时序 · 寄生供电' },
  { id: '13-以太网', kicker: '嵌入式通信避坑 · VOL.13', lines: ['网口灯亮', '离收包还差五层'], sub: 'PHY · MAC · IP · TCP · 应用' },
  { id: '14-无线选型', kicker: '嵌入式通信避坑 · VOL.14', lines: ['WiFi BLE LoRa', '到底怎么选'], sub: '速率 · 距离 · 功耗的三角' },
];

// 视觉宽度：中文算 1，ASCII 算 0.56
const vw = (s) => [...s].reduce((n, c) => n + (/[\u4e00-\u9fa5，。？]/.test(c) ? 1 : 0.56), 0);

const page = (c) => {
  const maxW = Math.max(...c.lines.map(vw));
  const size = Math.max(34, Math.min(48, Math.floor(340 / maxW)));
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:900px;height:383px;overflow:hidden;
    background:#16201A;font-family:"Microsoft YaHei","msyhbd",sans-serif;
    position:relative}
  .grid{position:absolute;inset:0;
    background-image:linear-gradient(rgba(245,241,232,.045) 1px,transparent 1px),
                     linear-gradient(90deg,rgba(245,241,232,.045) 1px,transparent 1px);
    background-size:26px 26px}
  .safe{position:absolute;left:258px;top:0;width:383px;height:383px;
    display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
  .kicker{position:absolute;left:34px;top:30px;font-size:14px;font-weight:700;
    letter-spacing:.14em;color:#C8452F}
  .bar{position:absolute;left:34px;top:54px;width:46px;height:3px;background:#C8452F}
  .t{font-weight:900;color:#F5F1E8;line-height:1.24;font-size:${size}px;letter-spacing:.01em}
  .sub{position:absolute;left:0;right:0;bottom:30px;text-align:center;
    font-size:13px;color:#8FA396;letter-spacing:.06em}
  .deco-l{position:absolute;left:26px;top:96px;width:190px;height:200px;opacity:.55}
  .deco-r{position:absolute;right:26px;top:86px;width:196px;height:210px;opacity:.55}
  .tag{position:absolute;right:34px;top:30px;font-size:12px;color:#6E8577;letter-spacing:.1em}
  </style></head><body>
  <div class="grid"></div>
  <svg class="deco-l" viewBox="0 0 190 200">
    <g stroke="#2F4438" stroke-width="1.6" fill="none">
      <path d="M8 24 H120 V64 H182"/>
      <path d="M8 74 H76 V114 H182"/>
      <path d="M8 124 H140 V164 H182"/>
      <path d="M8 174 H60 V196"/>
    </g>
    <g fill="#C8452F" opacity=".8">
      <circle cx="120" cy="24" r="3"/><circle cx="76" cy="74" r="3"/><circle cx="140" cy="124" r="3"/>
    </g>
  </svg>
  <svg class="deco-r" viewBox="0 0 196 210">
    <g stroke="#2F4438" stroke-width="1.6" fill="none">
      <path d="M14 24 H188"/><path d="M14 24 V72"/><path d="M14 72 H188"/>
      <path d="M188 72 V120"/><path d="M14 120 H188"/><path d="M14 120 V168"/>
      <path d="M14 168 H188"/>
    </g>
    <g fill="none" stroke="#8FA396" stroke-width="1.8">
      <circle cx="14" cy="24" r="5"/><circle cx="14" cy="72" r="5"/>
      <circle cx="14" cy="120" r="5"/><circle cx="14" cy="168" r="5"/>
    </g>
  </svg>
  <div class="kicker">${c.kicker}</div>
  <div class="bar"></div>
  <div class="tag">程序小猴</div>
  <div class="safe"><div class="t">${c.lines.join('<br>')}</div></div>
  <div class="sub">${c.sub}</div>
  </body></html>`;
};

let ok = 0;
COVERS.forEach((c, idx) => {
  const html = path.join(SCRATCH, c.id + '.html');
  const raw = path.join(RAW, c.id + '.png');
  const dir = DIRS[idx];
  if (!dir) { console.log(`SKIP ${c.id}  没有对应的发布包目录`); return; }
  const out = path.join(OUT, dir, '封面.png');
  fs.writeFileSync(html, page(c), 'utf8');
  try {
    execFileSync(CHROME, [
      '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-sandbox',
      '--force-device-scale-factor=2',
      '--window-size=900,383',
      '--virtual-time-budget=3000',
      '--screenshot=' + raw,
      'file:///' + html.replace(/\\/g, '/'),
    ], { stdio: 'pipe', timeout: 60000 });
    // 1800x766 -> 900x383
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', raw,
      '-vf', 'scale=900:383:flags=lanczos', '-q:v', '3', out], { stdio: 'pipe' });
    const kb = Math.round(fs.statSync(out).size / 1024);
    console.log(`COVER ${dir}  ${kb}KB`);
    ok++;
  } catch (e) {
    console.log(`FAIL ${c.id}  ${String(e.message).slice(0, 120)}`);
  }
});
console.log(`\n封面 ${ok}/${COVERS.length} -> ${OUT}/<日期_篇目>/封面.png`);
