// 生成「嵌入式通信避坑」系列正文配图
// 版式取自 CodeKey/02-样式素材/配图风格库_handraw-style_2026-10-22.md 的 IG/SC 编号
// 配色：C-30 象牙白底 + C-05 群青 + C-15 朱砂 + C-31 佩恩灰
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { FIXES } from './figs2.mjs';

const ROOT = 'D:/Personal/Astapb';
const SCRATCH = path.join(import.meta.dirname, '_out');
const RAW = path.join(SCRATCH, 'raw');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const BASE = ROOT + '/CodeKey/03-选题与成稿/技术干货/嵌入式';
fs.mkdirSync(RAW, { recursive: true });

/* ---------------- CSS ---------------- */
const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:750px;background:#FBF6EA}
body{font-family:"Microsoft YaHei","msyh",sans-serif;color:#232A30;
  -webkit-font-smoothing:antialiased;text-rendering:geometricPrecision}
.card{position:relative;width:750px;padding:28px 38px 20px;display:flex;flex-direction:column;
  background:
    linear-gradient(rgba(122,100,58,.05) 1px,transparent 1px) 0 0/100% 26px,
    linear-gradient(90deg,rgba(122,100,58,.05) 1px,transparent 1px) 0 0/26px 100%,
    radial-gradient(125% 92% at 50% -12%,#FFFDF7 0%,#F8F1E0 68%,#F2E8D3 100%);
  box-shadow:inset 0 0 0 1px rgba(122,100,58,.22)}
.hd{display:flex;justify-content:space-between;align-items:baseline;
  font-size:14px;letter-spacing:.13em;color:#8C8368;font-weight:700;padding-bottom:9px;
  border-bottom:1px solid rgba(122,100,58,.30)}
.hd .k{color:#232A30;letter-spacing:.06em}
.hd .k i{color:#9C2B1F;font-style:normal}
.tt{font-size:30px;font-weight:800;line-height:1.32;margin-top:15px;letter-spacing:.01em;color:#1A2025}
.sub{font-family:"KaiTi","simkai",serif;font-size:19px;color:#6B6350;margin-top:6px;line-height:1.45;text-wrap:pretty}
.bd{flex:1;display:flex;flex-direction:column;justify-content:center;padding:14px 0 10px;min-height:0}
.ft{display:flex;justify-content:space-between;align-items:baseline;font-size:14px;color:#817761;
  border-top:1px solid rgba(122,100,58,.30);padding-top:8px}
.ft .no{color:#9C2B1F;font-weight:800;letter-spacing:.12em}

/* 节点框 */
.nd{background:#FFFDF7;border:1.6px solid #2E363D;border-radius:13px 9px 12px 10px;
  box-shadow:2.5px 2.5px 0 rgba(46,54,61,.09);padding:10px 14px}
.nd .t{font-size:20px;font-weight:700;line-height:1.25;display:flex;align-items:center;gap:8px}
.nd .d{font-size:15px;color:#5A626C;margin-top:4px;line-height:1.42}
.nd.ac{border-color:#9C2B1F;background:#FDF5E8}
.nd.ac .t{color:#9C2B1F}
.nd.bl{border-color:#1F3A6E}
.nd.bl .t{color:#1F3A6E}
.nd.pl{background:#F6F2E6;border-color:rgba(46,54,61,.55);box-shadow:none}
.mono{font-family:Consolas,"Courier New",monospace;font-size:15px;letter-spacing:.02em}

/* 行 / 列 */
.row{display:flex;align-items:center;gap:14px}
.col{display:flex;flex-direction:column}
.g8{gap:8px}.g10{gap:10px}.g12{gap:12px}.g14{gap:14px}.g16{gap:16px}.g18{gap:18px}
.f1{flex:1;min-width:0}

/* 箭头 */
.ar{position:relative;flex:0 0 auto;height:16px;display:flex;align-items:center}
.ar i{display:block;width:26px;height:1.6px;background:#2E363D;position:relative}
.ar i::after{content:'';position:absolute;right:-1px;top:-3.6px;border-left:7px solid #2E363D;
  border-top:4.4px solid transparent;border-bottom:4.4px solid transparent}
.ar.dn{height:22px;justify-content:center;width:100%}
.ar.dn i{width:1.6px;height:14px}
.ar.dn i::after{right:auto;left:-3.6px;top:auto;bottom:-1px;border-top:7px solid #2E363D;
  border-left:4.4px solid transparent;border-right:4.4px solid transparent;border-bottom:0}

/* 标签 */
.tag{display:inline-flex;align-items:center;gap:6px;font-size:15px;font-weight:700;
  padding:3px 10px;border-radius:9px 6px 10px 5px;background:#EFE7D2;color:#4A4230;
  border:1px solid rgba(122,100,58,.35)}
.tag.z{background:#F6E2DC;color:#9C2B1F;border-color:rgba(156,43,31,.35)}
.tag.b{background:#E2E7F2;color:#1F3A6E;border-color:rgba(31,58,110,.3)}
.tag.g{background:#E7ECE6;color:#3E5B45;border-color:rgba(62,91,69,.3)}

/* 注释条 */
.note{display:flex;gap:10px;align-items:flex-start;font-family:"KaiTi","simkai",serif;
  font-size:18px;line-height:1.5;color:#4E4636;text-wrap:pretty}
.note::before{content:'';flex:0 0 3px;align-self:stretch;background:#9C2B1F;border-radius:2px}

/* 分支树 */
.br{position:relative;display:flex;align-items:center;gap:0;padding-left:34px;min-height:44px}
.br::before{content:'';position:absolute;left:13px;top:0;bottom:0;border-left:1.6px solid rgba(46,54,61,.42)}
.br:last-child::before{bottom:50%}
.br::after{content:'';position:absolute;left:13px;top:50%;width:15px;border-top:1.6px solid rgba(46,54,61,.42)}
.br .nm{font-size:19px;font-weight:700;white-space:nowrap}
.br .dots{flex:1;border-bottom:1.4px dotted rgba(46,54,61,.35);margin:0 12px;transform:translateY(2px)}
.broot{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:800;margin-bottom:4px}
.broot::before{content:'';width:11px;height:11px;border-radius:50%;background:#9C2B1F}

/* 段条 */
.seg{display:flex;height:52px;border:1.6px solid #2E363D;border-radius:10px 7px 9px 8px;overflow:hidden;
  box-shadow:2.5px 2.5px 0 rgba(46,54,61,.09)}
.seg>div{display:flex;flex-direction:column;justify-content:center;align-items:center;
  border-right:1.4px solid rgba(46,54,61,.55);font-size:15px;line-height:1.2;text-align:center}
.seg>div:last-child{border-right:0}
.seg .lb{font-weight:700;font-size:16px}
.seg .sm{font-size:13px;color:#5A626C;margin-top:2px}

/* 数字 */
.num{flex:0 0 30px;height:30px;border-radius:50%;background:#2E363D;color:#FFFDF7;
  font-size:16px;font-weight:800;display:flex;align-items:center;justify-content:center}

/* 矩阵 */
.mx{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.mxc{background:#FFFDF7;border:1.6px solid #2E363D;border-radius:12px 8px 11px 9px;
  box-shadow:2.5px 2.5px 0 rgba(46,54,61,.09);padding:11px 13px}
.mxc .h{display:flex;align-items:baseline;gap:8px}
.mxc .h b{font-size:19px}
.mxc .h em{font-style:normal;font-size:14px;color:#5A626C;font-family:Consolas,monospace}
.mxc .x{font-size:15px;color:#5A626C;margin-top:5px;line-height:1.4}

/* 表 */
.tb{width:100%;border-collapse:collapse;font-size:16px}
.tb th{font-size:14px;font-weight:700;color:#8C8368;text-align:left;padding:0 8px 6px;letter-spacing:.06em}
.tb td{padding:7px 8px;border-top:1px solid rgba(122,100,58,.28);vertical-align:middle}
.tb td.k{font-weight:700;white-space:nowrap}
`;

/* ---------------- 工具 ---------------- */
const esc = (s) => s;

// 生成波形 SVG：bits = [{lv, w}]，w 为相对宽度
function wave(bits, opt = {}) {
  const { bw = 54, yH = 40, yL = 118, x0 = 8, tail = 26, legend = true } = opt;
  let x = x0, y = yH, d = `M ${x} ${yH}`, cells = [];
  for (const b of bits) {
    const yy = b.lv ? yH : yL, w = bw * (b.w ?? 1);
    if (yy !== y) d += ` L ${x} ${y} L ${x} ${yy}`;
    d += ` L ${x + w} ${yy}`;
    cells.push({ x, w, lv: b.lv, lab: b.lab, tone: b.tone });
    x += w; y = yy;
  }
  if (y !== yH) d += ` L ${x} ${y} L ${x} ${yH}`;
  d += ` L ${x + tail} ${yH}`;
  const w = x + tail + x0;
  return { d, cells, w };
}

/* ---------------- 图 ---------------- */
const FIGS = [];

const F = (o) => FIGS.push(o);

/* ===== 00 总览 ===== */
F({
  id: '00-1', file: '00-常用通信方式总览-1-协议分层.png', h: 540,
  kicker: '嵌入式通信避坑 <i>·</i> 00 总览', fig: '图 1', note: '同一个系统里，协议是叠着用的，不是四选一',
  title: '别问「谁更好」，先问它站在哪一层',
  sub: 'UART 管怎么按位收发，RS-485 管电气怎么传 —— 它们是串联关系',
  body: `
  <div class="col g10">
    ${[
      ['应用数据', '要传的东西：一帧采集结果、一条寄存器命令', '应用', 'z'],
      ['Modbus RTU', '帧格式、从站地址、CRC 校验', '协议', ''],
      ['UART', '起始位、数据位、停止位，按位串行收发', '控制器', 'b'],
      ['RS-485 收发器', '差分电平转换、DE/RE 方向控制', '电气', ''],
      ['双绞线 A / B', '两根线上真正跑的电压差', '介质', ''],
    ].map(([t, d, side, tone]) => `
      <div class="row">
        <div class="nd ${tone === 'z' ? 'ac' : tone === 'b' ? 'bl' : ''} f1">
          <div class="t">${t}</div><div class="d">${d}</div>
        </div>
        <div style="flex:0 0 78px;text-align:right">
          <span class="tag ${tone}">${side}</span>
        </div>
      </div>`).join('')}
    <div class="note" style="margin-top:6px">把这两层分开看，很多争论就消失了：换 RS-485 不改你的协议，换协议也不用动收发器。</div>
  </div>`
});

F({
  id: '00-2', file: '00-常用通信方式总览-2-选型决策树.png', h: 620,
  kicker: '嵌入式通信避坑 <i>·</i> 00 总览', fig: '图 2', note: '先用距离和节点数砍掉一半选项，再看软件复杂度',
  title: '第一轮筛选：四个问题定方向',
  sub: '这不是绝对规则，但足够把十个协议砍到两三个',
  body: `
  <div class="col">
    <div class="broot" style="padding-left:0">要通信 · 先看它在哪</div>
    ${[
      ['PCB 板内', ['I²C 低速多器件', 'SPI 高速', 'UART 简单点对点'], 'g'],
      ['工业现场', ['RS-485 便宜', 'CAN 多节点可靠', 'Ethernet 高速联网'], ''],
      ['连 PC 或 U 盘', ['USB'], 'b'],
      ['不方便布线', ['Wi-Fi 局域高速', 'BLE 低功耗近距', 'LoRa 低速远距'], 'z'],
    ].map(([g, items, tone]) => `
      <div class="br">
        <span class="nm">${g}</span><span class="dots"></span>
        <span style="display:flex;gap:8px">${items.map((i) => `<span class="tag ${tone}" style="font-size:14px">${i}</span>`).join('')}</span>
      </div>`).join('')}
  </div>
  <div class="note" style="margin-top:12px">六个判断维度：距离、速度、节点数量、抗干扰、实时性、软件复杂度。前三个决定物理层，后三个决定值不值得折腾。</div>`
});

/* ===== 01 UART ===== */
const uartBits = [
  { lv: 1, lab: '空闲' }, { lv: 0, lab: '起始', tone: 'z' },
  { lv: 1, lab: 'D0' }, { lv: 0, lab: 'D1' }, { lv: 1, lab: 'D2' }, { lv: 0, lab: 'D3' },
  { lv: 1, lab: 'D4' }, { lv: 0, lab: 'D5' }, { lv: 1, lab: 'D6' }, { lv: 0, lab: 'D7' },
  { lv: 1, lab: '停止', tone: 'z' },
];
{
  const { d, cells, w } = wave(uartBits, { bw: 52, yH: 46, yL: 118, x0: 12, tail: 24 });
  const lab = cells.map((c, i) => {
    const cx = c.x + c.w / 2;
    const tone = c.tone === 'z' ? '#9C2B1F' : '#5A626C';
    return `<text x="${cx}" y="26" text-anchor="middle" font-size="14" fill="${tone}" font-weight="700">${c.lab}</text>
            <text x="${cx}" y="${c.lv ? 40 : 140}" text-anchor="middle" font-size="15"
              fill="${c.tone === 'z' ? '#9C2B1F' : '#1F3A6E'}" font-weight="700" font-family="Consolas">${c.lv}</text>`;
  }).join('');
  const ruler = `${cells[2].x} ${cells[2].x + cells[2].w}`;
  F({
    id: '01-1', file: '01-UART-1-帧结构.png', h: 540,
    kicker: '嵌入式通信避坑 <i>·</i> 01 UART', fig: '图 1', note: '0x55 = 0101 0101，低位先发，所以线上是 1010 1010',
    title: '一帧 8N1：0x55 走完这根线的全过程',
    sub: '空闲高电平，起始位把它拉低 —— 接收端就是靠这一下降醒过来的',
    body: `
    <div class="col g14" style="width:100%">
      <svg width="100%" viewBox="0 0 ${w} 168" style="display:block">
        <path d="${d}" fill="none" stroke="#232A30" stroke-width="2.4" stroke-linejoin="round"/>
        <line x1="${cells[0].x}" y1="150" x2="${cells[10].x + cells[10].w}" y2="150" stroke="rgba(46,54,61,.35)" stroke-width="1.2"/>
        ${lab}
        <line x1="${ruler.split(' ')[0]}" y1="150" x2="${ruler.split(' ')[1]}" y2="150" stroke="#9C2B1F" stroke-width="3"/>
        <text x="${(Number(ruler.split(' ')[0]) + Number(ruler.split(' ')[1])) / 2}" y="166" text-anchor="middle"
          font-size="14" fill="#9C2B1F" font-weight="700">1 bit ≈ 8.68 μs @115200</text>
      </svg>
      <div class="row g12" style="justify-content:space-between;margin-top:2px">
        <div class="nd f1"><div class="t">1 起始 + 8 数据 + 1 停止</div><div class="d">共 10 bit —— 这是线上开销，不是有效数据</div></div>
        <div class="nd ac f1"><div class="t">115200 ÷ 10 = 11520 B/s</div><div class="d">所以「115200 波特率」≠ 每秒 115200 字节</div></div>
      </div>
      <div class="note">读成 0xAA 先看位序；全乱码先看波特率与帧格式；时通时不通，先看有没有共地。</div>
    </div>`
  });
}

F({
  id: '01-2', file: '01-UART-2-环形缓冲.png', h: 600,
  kicker: '嵌入式通信避坑 <i>·</i> 01 UART', fig: '图 2', note: '中断里只搬字节，业务逻辑往后放一层',
  title: '接收放什么位置，决定了系统稳不稳',
  sub: '最忌收到一个字节就在中断里跑一大串判断',
  body: `
  <div class="col g8">
    ${[
      ['UART RX 引脚', '电平进到外设寄存器', ''],
      ['中断 / DMA', '只做一件事：把字节搬进缓冲区', 'b'],
      ['环形缓冲区', '定长数组 + 读写下标，读写不阻塞', 'bl'],
      ['协议状态机', '找帧头、等长度、核校验', 'ac'],
      ['业务处理', '在主循环里慢慢算，不赶时间', ''],
    ].map(([t, dta, cls], i) => `
      <div class="row">
        <div class="num" style="background:${i === 3 ? '#9C2B1F' : '#2E363D'}">${i + 1}</div>
        <div class="nd ${cls} f1"><div class="t">${t}</div><div class="d">${dta}</div></div>
      </div>
      ${i < 4 ? '<div class="ar dn"><i></i></div>' : ''}`).join('')}
    <div class="note" style="margin-top:4px">校验错时不要把整块缓冲区清空 —— 向后挪一个字节重新寻帧，才可能找回下一帧。</div>
  </div>`
});

/* ===== 02 RS-232 ===== */
F({
  id: '02-1', file: '02-RS232-1-电平极性.png', h: 560,
  kicker: '嵌入式通信避坑 <i>·</i> 02 RS-232', fig: '图 1', note: '同一根线，同一个逻辑 1，两边的电压是反的',
  title: 'RS-232 最反直觉的地方：负电压才是 1',
  sub: 'UART 用高电平表示 1，RS-232 反过来，还顺手把电压抬到十几伏',
  body: `
  <div class="row g18" style="align-items:stretch">
    <div class="col g10 f1">
      <div class="tag g" style="align-self:flex-start">UART / TTL · MCU 侧</div>
      <div class="nd" style="padding:14px">
        <div class="col g10">
          <div class="row"><span class="mono" style="width:34px;color:#1F3A6E;font-weight:700">1</span>
            <div style="flex:1;height:14px;background:#1F3A6E;border-radius:3px"></div>
            <span class="mono" style="width:56px;text-align:right">3.3 V</span></div>
          <div class="row"><span class="mono" style="width:34px;color:#5A626C;font-weight:700">0</span>
            <div style="flex:1;height:14px;background:#C9C3B2;border-radius:3px"></div>
            <span class="mono" style="width:56px;text-align:right">0 V</span></div>
        </div>
      </div>
      <div class="d" style="font-size:15px;color:#5A626C;line-height:1.45">单端信号，以 GND 为参考。<br>只适合板内、几十厘米。</div>
    </div>
    <div class="col g10 f1">
      <div class="tag z" style="align-self:flex-start">RS-232 · 线缆侧</div>
      <div class="nd ac" style="padding:14px">
        <div class="col g10">
          <div class="row"><span class="mono" style="width:34px;color:#5A626C;font-weight:700">0</span>
            <div style="flex:1;height:14px;background:#C9C3B2;border-radius:3px"></div>
            <span class="mono" style="width:64px;text-align:right">+3~+15 V</span></div>
          <div class="row"><span class="mono" style="width:34px;color:#9C2B1F;font-weight:700">1</span>
            <div style="flex:1;height:14px;background:#9C2B1F;border-radius:3px"></div>
            <span class="mono" style="width:64px;text-align:right">−3~−15 V</span></div>
        </div>
      </div>
      <div class="d" style="font-size:15px;color:#5A626C;line-height:1.45">负逻辑 + 高摆幅，抗干扰强。<br>距离可以拉到十几米。</div>
    </div>
  </div>
  <div class="note" style="margin-top:14px">中间那块 MAX3232 干的就是两件事：电平翻转、电荷泵升压。接口芯片坏了，现象往往是完全收不到，而不是乱码。</div>`
});

F({
  id: '02-2', file: '02-RS232-2-DB9三线制.png', h: 540,
  kicker: '嵌入式通信避坑 <i>·</i> 02 RS-232', fig: '图 2', note: 'DB9 是连接器，RS-232 是电气标准，两件事',
  title: '九根针，实际只用三根',
  sub: '2 收、3 发、5 地 —— 记住这三个就不会接反',
  body: `
  <div class="col g16">
    <div class="row g20" style="align-items:flex-start">
      <div style="flex:0 0 272px">
        <div class="col g10">
          <div class="row g10" style="justify-content:center">
            ${[1, 2, 3, 4, 5].map((n) => `<div class="db9 ${n === 2 || n === 3 || n === 5 ? 'on' : ''}">${n}</div>`).join('')}
          </div>
          <div class="row g10" style="justify-content:center">
            ${[6, 7, 8, 9].map((n) => `<div class="db9">${n}</div>`).join('')}
          </div>
        </div>
        <div style="font-size:13px;color:#8C8368;text-align:center;margin-top:10px;letter-spacing:.06em">DB9 公头，正面看</div>
      </div>
      <div class="col g8 f1">
        ${[
          ['2', 'RXD', '接收 —— 对方发给我', '#1F3A6E'],
          ['3', 'TXD', '发送 —— 我发给对方', '#9C2B1F'],
          ['5', 'GND', '信号地，两根线必须共用', '#232A30'],
        ].map(([n, nm, d, c]) => `
          <div class="row g10">
            <div class="db9 on" style="flex:0 0 44px">${n}</div>
            <div class="nd f1" style="padding:8px 12px">
              <div class="t mono" style="font-size:16px;color:${c}">${nm}</div>
              <div class="d" style="font-size:14px">${d}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>
    <div class="note">交叉接线：我的 2 接你的 3。三线制就能全双工 —— 收、发、地。</div>
  </div>`
});

/* ===== 03 RS-485 ===== */
F({
  id: '03-1', file: '03-RS485-1-差分总线.png', h: 560,
  kicker: '嵌入式通信避坑 <i>·</i> 03 RS-485', fig: '图 1', note: '终端只在两个物理端点各放一个，不是每个节点都放',
  title: '两根线挂十几台设备，靠的是电压差',
  sub: '两根线一起挨干扰，差不变 —— 这就是差分能拉长线的全部原因',
  body: `
  <div class="col g12" style="width:100%">
    <div class="row" style="align-items:center">
      <div class="nd ac" style="flex:0 0 118px;padding:8px 10px"><div class="t" style="font-size:16px">120 Ω</div></div>
      <div style="flex:1;position:relative;height:86px">
        <div style="position:absolute;left:0;right:0;top:18px;height:3px;background:#1F3A6E"></div>
        <div style="position:absolute;left:0;right:0;top:62px;height:3px;background:#9C2B1F"></div>
        <div style="position:absolute;left:0;top:6px;font-size:15px;font-weight:700;color:#1F3A6E">A</div>
        <div style="position:absolute;left:0;top:70px;font-size:15px;font-weight:700;color:#9C2B1F">B</div>
        ${[1, 2, 3].map((i) => `<div style="position:absolute;left:${18 + i * 25}%;top:21px;width:0;height:26px;border-left:1.6px solid rgba(46,54,61,.6)"></div>`).join('')}
      </div>
      <div class="nd ac" style="flex:0 0 118px;padding:8px 10px"><div class="t" style="font-size:16px">120 Ω</div></div>
    </div>
    <div class="row g12" style="justify-content:center">
      ${['从站 1', '从站 2', '从站 3'].map((s) => `<div class="nd" style="flex:0 0 150px;padding:8px 10px;text-align:center"><div class="t" style="font-size:16px;justify-content:center">${s}</div></div>`).join('')}
    </div>
    <div class="row g12" style="margin-top:2px">
      <div class="nd f1"><div class="t" style="font-size:17px">两端 120 Ω</div><div class="d">吸收反射，跟线缆特性阻抗匹配。断电测 A/B 间电阻常接近 60 Ω</div></div>
      <div class="nd f1"><div class="t" style="font-size:17px">星形布线是大忌</div><div class="d">支线越短越好，节点尽量串在主干上</div></div>
    </div>
    <div class="note">A/B 接反了不会烧，只是收不到 —— 所以「通信不上」的第一件事，是把两根线对调试一次。</div>
  </div>`
});

F({
  id: '03-2', file: '03-RS485-2-收发切换.png', h: 520,
  kicker: '嵌入式通信避坑 <i>·</i> 03 RS-485', fig: '图 2', note: '切太早会截断最后一个字节，切太晚会撞总线',
  title: '半双工：方向脚早一步晚一步都出错',
  sub: 'DE 拉高才允许驱动总线，最后一个字节彻底发完才能放手',
  body: `
  <div class="col g12">
    <div class="seg" style="height:64px">
      <div style="flex:2.2;background:#F0EBDD"><div class="lb" style="color:#5A626C">接收</div><div class="sm">DE=0 / RE=0</div></div>
      <div style="flex:3.4;background:#F6E2DC"><div class="lb" style="color:#9C2B1F">发送</div><div class="sm">DE=1，驱动 A/B</div></div>
      <div style="flex:2.2;background:#F0EBDD"><div class="lb" style="color:#5A626C">接收</div><div class="sm">DE=0 / RE=0</div></div>
    </div>
    <div class="row g12" style="justify-content:space-between">
      <div class="nd f1"><div class="t" style="font-size:17px">① 切太早</div><div class="d">最后一位还在移位寄存器里，尾巴被截掉 → 对方校验必错</div></div>
      <div class="nd f1"><div class="t" style="font-size:17px">② 切太晚</div><div class="d">自己还占着总线，下一轮从站应答直接撞车</div></div>
    </div>
    <div class="note">等 TC（发送完成）标志，别等 TXE —— TXE 只表示数据交给了移位寄存器，线上还没发完。这是最常见的 off-by-one 字节错误来源。</div>
  </div>`
});

/* ===== 04 SPI ===== */
F({
  id: '04-1', file: '04-SPI-1-四线连接.png', h: 520,
  kicker: '嵌入式通信避坑 <i>·</i> 04 SPI', fig: '图 1', note: '时钟由主机产生，从机永远跟着走',
  title: '四根线，一根不给就通不了',
  sub: 'SCLK 给节拍，MOSI / MISO 各走一个方向，CS 每台从机一根',
  body: `
  <div class="row" style="align-items:stretch;gap:0">
    <div class="col" style="flex:0 0 130px;justify-content:center;gap:0">
      <div class="nd bl" style="text-align:center"><div class="t" style="justify-content:center">MCU</div><div class="d">主机</div></div>
    </div>
    <div class="col g8 f1" style="padding:0 12px;justify-content:center">
      ${[['SCLK', '→', '时钟', '共用'], ['MOSI', '→', '主出从入', '共用'], ['MISO', '←', '主入从出', '共用'], ['CS0', '→', '片选 A', '只接 A'], ['CS1', '→', '片选 B', '只接 B']].map(([n, a, d, to]) => `
        <div class="row g8">
          <span class="mono" style="color:#5A626C;width:44px;text-align:right">${n}</span>
          <span style="flex:1;border-top:1.6px solid #2E363D;position:relative;height:1px">
            <span style="position:absolute;${a === '→' ? 'right:-1px' : 'left:-1px'};top:-4.6px;
              border-${a === '→' ? 'left' : 'right'}:7px solid #2E363D;border-top:4.4px solid transparent;border-bottom:4.4px solid transparent"></span>
          </span>
          <span style="flex:0 0 90px;font-size:14px;color:#5A626C">${d}</span>
          <span style="flex:0 0 62px;font-size:13px;font-weight:700;color:${to === '共用' ? '#5A626C' : '#9C2B1F'}">${to}</span>
        </div>`).join('')}
    </div>
    <div class="col g8" style="flex:0 0 132px;justify-content:center">
      <div class="nd" style="text-align:center;padding:8px"><div class="t" style="font-size:17px;justify-content:center">从机 A</div><div class="d" style="font-size:13px">CS0</div></div>
      <div class="nd" style="text-align:center;padding:8px"><div class="t" style="font-size:17px;justify-content:center">从机 B</div><div class="d" style="font-size:13px">CS1</div></div>
    </div>
  </div>
  <div class="note" style="margin-top:14px"><span>SCLK / MOSI / MISO 三根所有从机共用；<b>CS 必须一台从机一根</b>，拉低谁谁才应答。代价是片选线随节点数线性增长。</span></div>`
});

F({
  id: '04-2', file: '04-SPI-2-四种模式.png', h: 580,
  kicker: '嵌入式通信避坑 <i>·</i> 04 SPI', fig: '图 2', note: 'CPOL 只看空闲电平，CPHA 只看第几个边沿采样',
  title: 'CPOL 和 CPHA：四个模式一张表',
  sub: '配错了不会报错，只会收到一堆错位的数据',
  body: `
  <div class="mx">
    ${[
      ['Mode 0', 'CPOL 0 · CPHA 0', '空闲低 · 前沿（上升沿）采样'],
      ['Mode 1', 'CPOL 0 · CPHA 1', '空闲低 · 后沿（下降沿）采样'],
      ['Mode 2', 'CPOL 1 · CPHA 0', '空闲高 · 前沿（下降沿）采样'],
      ['Mode 3', 'CPOL 1 · CPHA 1', '空闲高 · 后沿（上升沿）采样'],
    ].map(([m, cp, x], i) => `
      <div class="mxc">
        <div class="h"><b>${m}</b><em>${cp}</em></div>
        <div class="x">${x}</div>
        ${miniWave(i >= 2 ? 1 : 0, i % 2)}
      </div>`).join('')}
  </div>
  <div class="note" style="margin-top:12px">调试顺序：先降频，再固定 Mode 0，连续发 0x55 / 0xAA，同时抓 CS / SCLK / MOSI / MISO 四路。波形对了再谈速率。</div>`
});

/* ===== 05 I2C ===== */
F({
  id: '05-1', file: '05-I2C-1-总线与上拉.png', h: 560,
  kicker: '嵌入式通信避坑 <i>·</i> 05 I²C', fig: '图 1', note: '器件只能拉低，高电平全靠上拉电阻充回来',
  title: '两根线、两个上拉，挂一整排芯片',
  sub: '没上拉，波形根本起不来；上拉太强，下降沿电流又受不了',
  body: `
  <div class="col g10" style="width:100%">
    <div class="row" style="align-items:flex-start;height:74px;position:relative">
      <div style="position:absolute;left:0;right:0;top:8px;height:2px;background:#8C8368"></div>
      <div style="position:absolute;left:10px;top:0;font-size:14px;color:#8C8368;font-weight:700">VCC</div>
      ${[26, 52].map((p) => `<div style="position:absolute;left:${p}%;top:8px;width:0;height:34px;border-left:2px solid #9C2B1F"></div>
        <div style="position:absolute;left:${p}%;top:42px;font-size:13px;color:#9C2B1F;font-weight:700;transform:translateX(-50%)">4.7k</div>`).join('')}
    </div>
    <div style="position:relative;height:58px;margin-top:-16px">
      <div style="position:absolute;left:0;right:0;top:22px;height:3px;background:#1F3A6E"></div>
      <div style="position:absolute;left:0;right:0;top:46px;height:3px;background:#5A626C"></div>
      <div style="position:absolute;left:-6px;top:15px;font-size:14px;font-weight:700;color:#1F3A6E">SDA</div>
      <div style="position:absolute;left:-6px;top:39px;font-size:14px;font-weight:700;color:#5A626C">SCL</div>
    </div>
    <div class="row g8" style="justify-content:space-between">
      ${[['主机', 'MCU', 'bl'], ['EEPROM', '0x50', ''], ['RTC', '0x68', ''], ['传感器', '0x48', '']].map(([n, a, c]) => `
        <div class="nd ${c}" style="flex:1;padding:8px 6px;text-align:center">
          <div class="t" style="font-size:16px;justify-content:center">${n}</div>
          <div class="d mono" style="font-size:13px">${a}</div>
        </div>`).join('')}
    </div>
    <div class="row g12" style="margin-top:2px">
      <div class="nd f1"><div class="t" style="font-size:17px">地址冲突</div><div class="d">两个器件地址相同又改不了 → 换型号，或用 I²C 多路开关</div></div>
      <div class="nd f1"><div class="t" style="font-size:17px">上拉取值</div><div class="d">跟总线电容、目标速率、器件灌电流一起定，不是随手 10k</div></div>
    </div>
    <div class="note">SDA 一直被拉低 → 从机停在发送途中；SCL 被拉低 → 多半是时钟延展。两者要分开查。</div>
  </div>`
});

F({
  id: '05-2', file: '05-I2C-2-读寄存器时序.png', h: 560,
  kicker: '嵌入式通信避坑 <i>·</i> 05 I²C', fig: '图 2', note: '读之前要先「写」一次内部地址 —— 这是新手最容易漏的一步',
  title: '读一个寄存器：从 START 到 STOP 的十一个动作',
  sub: '0x50 是 7 位地址，加上读写位，线上看到的是 0xA0 和 0xA1',
  body: `
  <div class="col g10">
    <div class="row g8" style="flex-wrap:nowrap">
      ${[['START', 'z'], ['0xA0', 'b'], ['ACK', ''], ['0x2A', 'b'], ['ACK', '']].map(([t, c]) =>
        `<div class="nd ${c === 'z' ? 'ac' : ''}" style="flex:1;padding:8px 4px;text-align:center">
          <div class="mono" style="font-size:16px;font-weight:700;color:${c === 'z' ? '#9C2B1F' : c === 'b' ? '#1F3A6E' : '#3E5B45'}">${t}</div></div>`).join('')}
    </div>
    <div class="row g8" style="flex-wrap:nowrap">
      ${[['ReSTART', 'z'], ['0xA1', 'b'], ['ACK', ''], ['DATA', 'b'], ['NACK', ''], ['STOP', 'z']].map(([t, c]) =>
        `<div class="nd ${c === 'z' ? 'ac' : ''}" style="flex:1;padding:8px 4px;text-align:center">
          <div class="mono" style="font-size:16px;font-weight:700;color:${c === 'z' ? '#9C2B1F' : c === 'b' ? '#1F3A6E' : '#3E5B45'}">${t}</div></div>`).join('')}
    </div>
    <div class="row g12" style="margin-top:2px">
      <div class="nd f1"><div class="t" style="font-size:17px">前五个动作在「写」</div><div class="d">告诉器件：我要读你内部 0x2A 这个地址</div></div>
      <div class="nd f1"><div class="t" style="font-size:17px">后六个动作在「读」</div><div class="d">ReSTART 保住总线不放，省一次 STOP + START</div></div>
    </div>
    <div class="note">最后一个字节主机发 NACK，意思是「够了，别再发」。忘了发 NACK，从机会一直占着 SDA。</div>
  </div>`
});

/* ===== 06 CAN ===== */
F({
  id: '06-1', file: '06-CAN-1-位仲裁.png', h: 560,
  kicker: '嵌入式通信避坑 <i>·</i> 06 CAN', fig: '图 1', note: '显性位（0）会盖住隐性位（1），这就是「线与」',
  title: '两个节点同时开口，为什么不会撞车',
  sub: '边发边听：谁发出 1 却听到 0，谁立刻退出，改当接收方',
  body: `
  <div class="col g14">
    ${[
      ['节点 A', '0x123', ['0', '0', '1', '0', '0', '1', '0', '0', '0', '1', '1'], 6],
      ['节点 B', '0x131', ['0', '0', '1', '0', '0', '1', '1', '0', '0', '0', '1'], 6],
    ].map(([nm, id, bits], k) => `
      <div class="col g6">
        <div class="row g8"><span class="tag ${k === 0 ? 'b' : ''}">${nm}</span>
          <span class="mono" style="font-size:14px;color:#5A626C">ID = ${id}</span>
          ${k === 0 ? '<span class="tag z">赢得仲裁</span>' : '<span class="tag">第 7 位退出</span>'}</div>
        <div class="row g4" style="gap:5px">
          ${bits.map((b, i) => `<div style="flex:1;height:34px;display:flex;align-items:center;justify-content:center;
            font-family:Consolas;font-size:15px;font-weight:700;border:1.4px solid rgba(46,54,61,.45);
            border-radius:6px 4px 6px 4px;background:${i === 6 ? (k === 0 ? '#F6E2DC' : '#EDE7D4') : '#FFFDF7'};
            color:${i === 6 ? '#9C2B1F' : '#232A30'}">${b}</div>`).join('')}
        </div>
      </div>`).join('')}
    <div class="note">第 7 位：A 发 0（显性），B 发 1（隐性），线上呈现 0 —— B 读回的值和自己发的不一样，立刻停手。ID 越小越优先，是这么来的，不是软件排的队。</div>
    <div class="row g12">
      <div class="nd f1"><div class="t" style="font-size:17px">不用重发</div><div class="d">输的一方自动转接收，下一轮再抢，没有碰撞退避的浪费</div></div>
      <div class="nd f1"><div class="t" style="font-size:17px">前提是全帧对齐</div><div class="d">所有节点必须在同一时刻采样同一位，所以位定时要配一致</div></div>
    </div>
  </div>`
});

F({
  id: '06-2', file: '06-CAN-2-标准帧结构.png', h: 540,
  kicker: '嵌入式通信避坑 <i>·</i> 06 CAN', fig: '图 2', note: '数据场最多 8 字节，这是经典 CAN 绕不开的上限',
  title: '一帧标准帧：从 SOF 到 EOF',
  sub: 'ID 不是设备地址，是「这条消息是什么、有多急」',
  body: `
  <div class="col g10">
    <div class="seg">
      <div style="flex:.8;background:#F6E2DC"><div class="lb" style="color:#9C2B1F">SOF</div><div class="sm">1</div></div>
      <div style="flex:2.6;background:#E2E7F2"><div class="lb" style="color:#1F3A6E">11 位 ID</div><div class="sm">仲裁场</div></div>
      <div style="flex:1;background:#F0EBDD"><div class="lb">RTR</div></div>
      <div style="flex:1;background:#F0EBDD"><div class="lb">IDE</div></div>
      <div style="flex:1.5;background:#F0EBDD"><div class="lb">DLC</div><div class="sm">长度</div></div>
      <div style="flex:5;background:#FFF3D6"><div class="lb" style="color:#8A6A1E">数据场</div><div class="sm">0 ~ 8 字节</div></div>
      <div style="flex:2.4;background:#E7ECE6"><div class="lb" style="color:#3E5B45">CRC</div><div class="sm">15 + 1</div></div>
      <div style="flex:1.4;background:#F0EBDD"><div class="lb">ACK</div><div class="sm">2</div></div>
      <div style="flex:1.4;background:#F6E2DC"><div class="lb" style="color:#9C2B1F">EOF</div><div class="sm">7</div></div>
    </div>
    <div class="row g12" style="margin-top:4px">
      <div class="nd f1"><div class="t" style="font-size:17px">① 仲裁场决定谁先说</div><div class="d">SOF + ID + RTR，逐位比较，输的退出</div></div>
      <div class="nd f1"><div class="t" style="font-size:17px">② ACK 由所有接收方一起给</div><div class="d">任何一个节点收到就拉低 —— 所以「有人收到」不等于「你要的那台收到了」</div></div>
    </div>
    <div class="note">调试 CAN：先看终端电阻（两端各 120 Ω，断电约 60 Ω），再看位定时，最后才怀疑协议栈。</div>
  </div>`
});

/* ===== 07 CAN FD ===== */
F({
  id: '07-1', file: '07-CANFD-1-双速率.png', h: 520,
  kicker: '嵌入式通信避坑 <i>·</i> 07 CAN FD', fig: '图 1', note: '仲裁段必须慢，数据段才能快 —— 这是它最聪明的设计',
  title: '一帧里两种速率：仲裁慢，数据快',
  sub: 'BRS 位一翻，整条总线的节拍立刻换挡',
  body: `
  <div class="col g14">
    <div class="col g6">
      <div class="row g8"><span class="tag">经典 CAN</span><span style="font-size:14px;color:#5A626C">全程同一速率，500 kbps</span></div>
      <div class="seg" style="height:44px">
        <div style="flex:1;background:#E2E7F2"><div class="sm" style="color:#1F3A6E">仲裁段</div></div>
        <div style="flex:1;background:#FFF3D6"><div class="sm" style="color:#8A6A1E">数据段</div></div>
        <div style="flex:1;background:#E7ECE6"><div class="sm" style="color:#3E5B45">CRC / ACK</div></div>
      </div>
    </div>
    <div class="col g6">
      <div class="row g8"><span class="tag z">CAN FD</span><span style="font-size:14px;color:#5A626C">仲裁 500 kbps → 数据段 2 / 5 Mbps</span></div>
      <div class="seg" style="height:44px">
        <div style="flex:2.2;background:#E2E7F2"><div class="sm" style="color:#1F3A6E">仲裁段 500k</div></div>
        <div style="flex:9;background:#F6E2DC"><div class="sm" style="color:#9C2B1F;font-weight:700">数据段 2M / 5M</div></div>
        <div style="flex:1.4;background:#E7ECE6"><div class="sm" style="color:#3E5B45">CRC</div></div>
      </div>
    </div>
    <div class="row g12" style="margin-top:2px">
      <div class="nd f1"><div class="t" style="font-size:17px">BRS 是那个开关</div><div class="d">隐性 = 切到高速；出错时 ESI 反过来告诉别人「我这有问题」</div></div>
      <div class="nd f1"><div class="t" style="font-size:17px">快起来对物理层更挑</div><div class="d">支线长度、终端匹配、收发器延迟对称性，全部要重新算</div></div>
    </div>
    <div class="note">FD 不是「改个配置就能用」：老收发器、老分析仪、老线束，任何一环跟不上都会成片丢帧。</div>
  </div>`
});

F({
  id: '07-2', file: '07-CANFD-2-选型判断.png', h: 580,
  kicker: '嵌入式通信避坑 <i>·</i> 07 CAN FD', fig: '图 2', note: '载荷不超过 8 字节、也不需要刷写升级，就没必要上 FD',
  title: '什么时候值得为 CAN FD 换硬件',
  sub: '三个问题里有一个答「是」，再往下走',
  body: `
  <div class="col">
    <div class="broot" style="padding-left:0">要不要上 CAN FD</div>
    ${[
      ['单帧要带超过 8 字节', ['传感器打包', '诊断长报文', '图像 / 标定块'], 'z'],
      ['要做在线刷写升级', ['固件下载', '标定数据回读'], 'z'],
      ['总线负载快满了', ['降不下发送频率', '又加不了新节点'], 'b'],
      ['只是换个新芯片', ['老设备还得兼容', '分析仪也不支持'], 'g'],
    ].map(([g, items, tone], i) => `
      <div class="br">
        <span class="nm">${g}</span><span class="dots"></span>
        <span class="tag ${i === 3 ? 'g' : tone}">${i === 3 ? '先别急' : '值得考虑'}</span>
      </div>`).join('')}
  </div>
  <div class="row g12" style="margin-top:12px">
    <div class="nd f1"><div class="t" style="font-size:17px">代价一：整条链路都要换</div><div class="d">收发器、控制器、分析仪、线束终端，少一个就退化成经典 CAN</div></div>
    <div class="nd f1"><div class="t" style="font-size:17px">代价二：调试门槛变高</div><div class="d">双速率下的位定时错误，现象是「偶发丢帧」，极难复现</div></div>
  </div>`
});

/* ===== 08 USB ===== */
F({
  id: '08-1', file: '08-USB-1-枚举流程.png', h: 640,
  kicker: '嵌入式通信避坑 <i>·</i> 08 USB', fig: '图 1', note: '插上到能用，主机要问它六个问题 —— 每一步都可能卡住',
  title: '插上那一刻，主机到底在问什么',
  sub: '枚举失败 = 设备管理器里那个黄叹号，90% 卡在前三步',
  body: `
  <div class="col g6">
    ${[
      ['设备插入', '主机发现 D+ / D− 上拉，判定全速或低速'],
      ['总线复位', '拉低 SE0 至少 10 ms，设备回到默认状态'],
      ['读设备描述符 8 字节', '先只问 VID / PID 和端点 0 的最大包长'],
      ['再读完整设备描述符', '18 字节，拿到厂商、产品、序列号'],
      ['读配置 / 接口 / 端点', '这几层合起来才说明「我是干什么的」'],
      ['选定配置 → 就绪', '主机选中一个配置，设备进入配置态，驱动开始绑'],
    ].map(([t, d], i) => `
      <div class="row">
        <div class="num" style="background:${i === 2 ? '#9C2B1F' : '#2E363D'}">${i + 1}</div>
        <div class="nd f1" style="padding:8px 13px"><div class="t" style="font-size:18px">${t}</div><div class="d" style="font-size:14px">${d}</div></div>
      </div>
      ${i < 5 ? '<div class="ar dn" style="height:14px"><i style="height:8px"></i></div>' : ''}`).join('')}
    <div class="note" style="margin-top:4px">读到 8 字节就崩 → 查上拉和供电；读到完整描述符才崩 → 查描述符表和 wTotalLength。</div>
  </div>`
});

F({
  id: '08-2', file: '08-USB-2-四类传输.png', h: 560,
  kicker: '嵌入式通信避坑 <i>·</i> 08 USB', fig: '图 2', note: '选哪种传输，问的是「丢一包能不能忍」',
  title: '四类传输，四种「等不等得起」',
  sub: 'U 盘用 Bulk，键鼠用 Interrupt，音频用 Isochronous —— 别用错',
  body: `
  <div class="mx">
    ${[
      ['控制 Control', '枚举 / 配置', '保证送达，双向。所有设备必须有端点 0'],
      ['批量 Bulk', 'U 盘、CDC 串口', '保证不丢，但不保证什么时候到。带宽富余时才发'],
      ['中断 Interrupt', '键鼠、HID', '保证最坏延迟，主机定期来问一次，不等设备开口'],
      ['同步 Isochronous', '音频、视频', '保证时间，不保证不丢。宁可断一下也不能卡'],
    ].map(([t, use, d], i) => `
      <div class="mxc ${i === 1 ? 'ac' : ''}">
        <div class="h"><b style="font-size:17px">${t}</b></div>
        <div class="x" style="color:#8C8368;font-size:14px;margin-top:3px">${use}</div>
        <div class="x" style="margin-top:6px;font-size:15px">${d}</div>
      </div>`).join('')}
  </div>
  <div class="note" style="margin-top:12px">FS 的 12 Mbps 是信令速率，不是读盘速度。协议开销、端点轮询、存储介质、MCU 缓冲，每一层都要打折。</div>`
});

/* ===== 09 Ethernet ===== */
F({
  id: '09-1', file: '09-Ethernet-1-协议分层.png', h: 560,
  kicker: '嵌入式通信避坑 <i>·</i> 09 Ethernet', fig: '图 1', note: '灯亮只证明物理层通了，离应用能收到包还差四层',
  title: '从网口灯亮到应用收包，中间隔了五层',
  sub: 'MCU 做以太网 = MAC + PHY，缺一个都只是「灯亮」',
  body: `
  <div class="col g8">
    ${[
      ['应用', 'HTTP / MQTT / Modbus TCP', 'z'],
      ['TCP / UDP', '可靠重传 或 图快不管', ''],
      ['IP', '地址、路由、分片', ''],
      ['MAC + DMA', '以太网帧、CRC、收发描述符', 'b'],
      ['PHY + 变压器 + 网口', '差分信号、自协商、灯', 'h'],
    ].map(([t, d, tone]) => `
      <div class="row">
        <div class="nd ${tone === 'z' ? 'ac' : tone === 'b' ? 'bl' : ''} f1" style="padding:8px 14px">
          <div class="t" style="font-size:18px">${t}</div><div class="d" style="font-size:14px">${d}</div>
        </div>
        <div style="flex:0 0 96px;text-align:right;font-size:13px;color:#8C8368">${tone === 'b' ? '芯片内' : tone === 'z' ? '你的代码' : tone === 'h' ? '板级硬件' : '协议栈'}</div>
      </div>`).join('')}
    <div class="note" style="margin-top:6px">排查永远是自下而上：灯 → 自协商 → ping → ARP → 端口 → 应用。跳步查，最后都会绕回来。</div>
  </div>`
});

F({
  id: '09-2', file: '09-Ethernet-2-排查顺序.png', h: 620,
  kicker: '嵌入式通信避坑 <i>·</i> 09 Ethernet', fig: '图 2', note: 'Wireshark 抓到包却没人回，问题就不在你的代码里',
  title: '网口不通，按这个顺序查',
  sub: '先看灯，再看链路，最后才怀疑协议栈',
  body: `
  <table class="tb" style="margin-top:2px">
    <tr><th style="width:44px">#</th><th style="width:200px">看什么</th><th>典型现象与结论</th></tr>
    ${[
      ['①', 'LINK / ACT 灯', '灯不亮 → 线、对端、PHY 供电；灯亮不闪 → 没有流量'],
      ['②', '自协商速率与双工', '一端 100M 全双工、一端 10M 半双工 → 慢且丢包'],
      ['③', '同网段能否 ping 通', '通 → 上层问题；不通 → 先看 IP / 掩码 / 网关'],
      ['④', 'ARP 表里有没有对端 MAC', '没有 → 二层就没通，别往上查'],
      ['⑤', 'Wireshark 抓包', '发出去了没人回 → 对端或防火墙；根本没发 → 你的栈'],
      ['⑥', '端口、VLAN、防火墙', '前五步都对，仍然断 → 大概率卡在这'],
    ].map(([n, k, d]) => `<tr><td class="k" style="color:#9C2B1F;font-size:17px">${n}</td>
      <td class="k" style="font-size:16px">${k}</td>
      <td style="font-size:15px;color:#4E4636;line-height:1.4">${d}</td></tr>`).join('')}
  </table>
  <div class="note" style="margin-top:10px">半双工 / 全双工不匹配是最阴的一类：能 ping 通、能小包、传大文件就崩，看着像「网络不稳」。</div>`
});

/* ===== 10 LIN ===== */
F({
  id: '10-1', file: '10-LIN-1-主从调度.png', h: 540,
  kicker: '嵌入式通信避坑 <i>·</i> 10 LIN', fig: '图 1', note: '从节点从不主动说话，全靠主节点点名',
  title: '一个主节点点名，从节点只听不说',
  sub: '没有仲裁、没有冲突 —— 因为任何时刻只允许一个人开口',
  body: `
  <div class="col g12">
    <div class="row" style="align-items:flex-start;position:relative;height:96px">
      <div style="position:absolute;left:0;right:0;top:44px;height:3px;background:#1F3A6E"></div>
      <div style="position:absolute;left:0;top:22px;font-size:14px;font-weight:700;color:#1F3A6E">LIN 单线（12 V 域，显性 = 低）</div>
      ${[8, 38, 68].map((p, i) => `<div style="position:absolute;left:${p}%;top:47px;width:0;height:26px;border-left:1.6px solid rgba(46,54,61,.6)"></div>`).join('')}
    </div>
    <div class="row g10" style="margin-top:-30px">
      <div class="nd ac" style="flex:1;text-align:center"><div class="t" style="justify-content:center;font-size:17px">主节点</div><div class="d" style="font-size:13px">发帧头 · 排调度表</div></div>
      ${['车门模块', '后视镜', '雨量传感器'].map((s) => `<div class="nd" style="flex:1;text-align:center"><div class="t" style="justify-content:center;font-size:16px">${s}</div><div class="d" style="font-size:13px">只应答</div></div>`).join('')}
    </div>
    <div class="row g12">
      <div class="nd f1"><div class="t" style="font-size:17px">帧头由主节点发</div><div class="d">Break + Sync + PID，等于喊一声「0x22 报数据」</div></div>
      <div class="nd f1"><div class="t" style="font-size:17px">响应由从节点填</div><div class="d">只有 PID 对上的那个才动，其余装没听见</div></div>
    </div>
    <div class="note">所以 LIN 的实时性是「排出来的」：调度表怎么排，报文就按什么顺序走。改时序 = 改表，不是改代码逻辑。</div>
  </div>`
});

F({
  id: '10-2', file: '10-LIN-2-帧结构.png', h: 520,
  kicker: '嵌入式通信避坑 <i>·</i> 10 LIN', fig: '图 2', note: '20 kbps 的上限，换来的是单线和几毛钱的收发器',
  title: '一帧三段：间隔、同步、受保护的 ID',
  sub: 'Sync 固定发 0x55 —— 从节点拿它量自己的时钟',
  body: `
  <div class="col g12">
    <div class="seg">
      <div style="flex:2;background:#F6E2DC"><div class="lb" style="color:#9C2B1F">Break</div><div class="sm">≥13 bit 显性</div></div>
      <div style="flex:2;background:#E2E7F2"><div class="lb" style="color:#1F3A6E">Sync</div><div class="sm">0x55</div></div>
      <div style="flex:2.6;background:#FFF3D6"><div class="lb" style="color:#8A6A1E">PID</div><div class="sm">6 位 ID + 2 位校验</div></div>
      <div style="flex:4.6;background:#E7ECE6"><div class="lb" style="color:#3E5B45">数据场</div><div class="sm">1 ~ 8 字节</div></div>
      <div style="flex:2;background:#F0EBDD"><div class="lb">校验和</div><div class="sm">经典 / 增强</div></div>
    </div>
    <div class="row g12" style="margin-top:2px">
      <div class="nd f1"><div class="t" style="font-size:17px">Break 是「醒醒」</div><div class="d">一个超长的显性电平，从节点靠它判断帧边界</div></div>
      <div class="nd f1"><div class="t" style="font-size:17px">Sync 是「对表」</div><div class="d">0x55 的方波最好测，用来校准本地位时间</div></div>
    </div>
    <div class="note">PID 里的两位校验是反码 —— 收到后不校验，遇到 ID 只差一位的两个从节点就会同时应答，总线直接被拉死。</div>
  </div>`
});

/* ===== 11 1-Wire ===== */
{
  const bits = [
    { lv: 1, w: 1.2 }, { lv: 0, w: 3.2 }, { lv: 1, w: 1.2 }, { lv: 0, w: 0.9 }, { lv: 1, w: 2.4 },
  ];
  const { d, cells, w } = wave(bits, { bw: 46, yH: 44, yL: 116, x0: 10, tail: 22 });
  F({
    id: '11-1', file: '11-1Wire-1-复位时序.png', h: 540,
    kicker: '嵌入式通信避坑 <i>·</i> 11 1-Wire', fig: '图 1', note: '480 μs 的拉低，是从机唯一能认出的「开场」',
    title: '每次通信，都从拽一下这根线开始',
    sub: '主机拉低 ≥480 μs，松手后从机回一个 15~60 μs 的低电平',
    body: `
    <div class="col g14">
      <svg width="100%" viewBox="0 0 ${w} 150" style="display:block">
        <path d="${d}" fill="none" stroke="#232A30" stroke-width="2.4" stroke-linejoin="round"/>
        <text x="${cells[1].x + cells[1].w / 2}" y="30" text-anchor="middle" font-size="15" font-weight="700" fill="#9C2B1F">Reset 拉低 ≥480 μs</text>
        <text x="${cells[3].x + cells[3].w / 2}" y="30" text-anchor="middle" font-size="15" font-weight="700" fill="#1F3A6E">Presence</text>
        <text x="${cells[3].x + cells[3].w / 2}" y="140" text-anchor="middle" font-size="14" fill="#1F3A6E">15~60 μs</text>
        <line x1="${cells[1].x}" y1="134" x2="${cells[1].x + cells[1].w}" y2="134" stroke="#9C2B1F" stroke-width="2.4"/>
        <line x1="${cells[4].x}" y1="134" x2="${cells[4].x + cells[4].w}" y2="134" stroke="rgba(46,54,61,.4)" stroke-width="1.6"/>
      </svg>
      <div class="row g12">
        <div class="nd f1"><div class="t" style="font-size:17px">没有复位，就没有一切</div><div class="d">从机平时完全沉默，只有抓到这段长低电平才醒过来</div></div>
        <div class="nd ac f1"><div class="t" style="font-size:17px">扫不到器件，先查这一下</div><div class="d">上拉、线长、寄生供电，都会让 Presence 脉冲消失</div></div>
      </div>
      <div class="note">DS18B20 读不到 85 ℃ 之外的数，很多时候不是芯片坏，是复位脉冲太短或时间槽被中断打断。</div>
    </div>`
  });
}

F({
  id: '11-2', file: '11-1Wire-2-ROM寻址.png', h: 540,
  kicker: '嵌入式通信避坑 <i>·</i> 11 1-Wire', fig: '图 2', note: '一根线挂多个，靠的是出厂就烧死的 64 位 ID',
  title: '一根线上挂一堆，怎么认出谁是谁',
  sub: '64 位 ROM：8 位家族码 + 48 位序列号 + 8 位 CRC',
  body: `
  <div class="col g12">
    <div class="seg" style="height:58px">
      <div style="flex:2;background:#F6E2DC"><div class="lb" style="color:#9C2B1F">家族码</div><div class="sm">8 位</div></div>
      <div style="flex:8;background:#E2E7F2"><div class="lb" style="color:#1F3A6E">唯一序列号</div><div class="sm">48 位</div></div>
      <div style="flex:2;background:#E7ECE6"><div class="lb" style="color:#3E5B45">CRC</div><div class="sm">8 位</div></div>
    </div>
    <div class="row g12">
      <div class="nd f1"><div class="t" style="font-size:17px">0x28 → DS18B20</div><div class="d">家族码告诉你这是什么器件，后面 48 位才是身份</div></div>
      <div class="nd f1"><div class="t" style="font-size:17px">搜索算法是逐位试探</div><div class="d">多个从机同时应答时，靠冲突位分叉，逐个枚举出来</div></div>
    </div>
    <div class="note">「一线」只指一根数据线，实际还要地线和上拉。寄生供电省掉 VCC，代价是转换期间必须强上拉。</div>
  </div>`
});

/* ===== 12 无线 ===== */
F({
  id: '12-1', file: '12-无线-1-速率距离.png', h: 600,
  kicker: '嵌入式通信避坑 <i>·</i> 12 无线选型', fig: '图 1', note: '位置只是量级示意 —— 但这条斜线是真实的',
  title: '速率和距离，本质上是一笔交易',
  sub: '想把数据送更远，只能让它更慢、或者更耗电',
  body: `
  <div class="row g14" style="align-items:center">
    <svg width="392" height="330" viewBox="0 0 392 330" style="display:block;flex:0 0 392px">
      <rect x="46" y="14" width="330" height="272" fill="#FFFDF7" stroke="rgba(46,54,61,.35)" stroke-width="1.4"/>
      ${[1, 2, 3, 4].map((i) => `<line x1="46" y1="${14 + i * 68}" x2="376" y2="${14 + i * 68}" stroke="rgba(46,54,61,.10)" stroke-width="1"/>`).join('')}
      <line x1="46" y1="286" x2="376" y2="286" stroke="#2E363D" stroke-width="1.8"/>
      <line x1="46" y1="14" x2="46" y2="286" stroke="#2E363D" stroke-width="1.8"/>
      <text x="211" y="316" text-anchor="middle" font-size="14" fill="#5A626C" font-weight="700">传输距离 →</text>
      <text x="18" y="150" text-anchor="middle" font-size="14" fill="#5A626C" font-weight="700" transform="rotate(-90 18 150)">速率 →</text>
      <line x1="70" y1="44" x2="356" y2="252" stroke="#9C2B1F" stroke-width="1.6" stroke-dasharray="6 5" opacity=".55"/>
      ${[
        ['①', 96, 52], ['②', 118, 74], ['③', 150, 60], ['④', 186, 96],
        ['⑤', 214, 150], ['⑥', 250, 176], ['⑦', 292, 206], ['⑧', 336, 232],
      ].map(([n, x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="#FFFDF7" stroke="#9C2B1F" stroke-width="1.6"/>
        <text x="${x}" y="${y + 5}" text-anchor="middle" font-size="13" fill="#9C2B1F" font-weight="700">${n}</text>`).join('')}
    </svg>
    <div class="col g6 f1">
      ${[
        ['①', 'USB 2.0 HS', '480 Mbps', '几米'],
        ['②', 'Wi-Fi', '几十~几百 Mbps', '几十米'],
        ['③', 'Ethernet 100M', '100 Mbps', '100 米'],
        ['④', 'CAN', '1 Mbps', '40 米'],
        ['⑤', 'BLE', '1 Mbps', '几十米'],
        ['⑥', 'RS-485', '100 kbps', '1200 米'],
        ['⑦', 'LoRa', '0.3~37.5 kbps', '几公里'],
        ['⑧', '1-Wire / LIN', '16~20 kbps', '几十米'],
      ].map(([n, nm, s, d]) => `
        <div class="row g8" style="align-items:center;padding:3px 0;border-bottom:1px dotted rgba(46,54,61,.2)">
          <span style="color:#9C2B1F;font-weight:700;font-size:14px;width:16px">${n}</span>
          <span style="font-size:15px;font-weight:700;width:96px">${nm}</span>
          <span style="font-size:13px;color:#5A626C;flex:1;text-align:right">${s}</span>
        </div>`).join('')}
    </div>
  </div>`
});

F({
  id: '12-2', file: '12-无线-2-三选一.png', h: 560,
  kicker: '嵌入式通信避坑 <i>·</i> 12 无线选型', fig: '图 2', note: '「既要又要还要」不是选型问题，是需求没想清楚',
  title: '三个需求，三种答案',
  sub: '先写下「距离、速率、功耗」三个数，答案基本就定了',
  body: `
  <div class="col g10">
    ${[
      ['要高速 + 要联网', 'Wi-Fi', '视频、网关、云端直连', 'b'],
      ['要配手机 + 要省电', 'BLE', '手环、传感器、配置通道', ''],
      ['要几公里 + 只发几个字节', 'LoRa', '水表、农业、地下管网', 'z'],
    ].map(([need, name, use, tone]) => `
      <div class="row g12">
        <div class="nd f1" style="padding:9px 13px"><div class="t" style="font-size:17px">${need}</div>
          <div class="d" style="font-size:14px">${use}</div></div>
        <div class="ar"><i></i></div>
        <div class="nd ${tone === 'z' ? 'ac' : tone === 'b' ? 'bl' : ''}" style="flex:0 0 138px;text-align:center;padding:9px">
          <div class="t" style="justify-content:center;font-size:19px">${name}</div></div>
      </div>`).join('')}
    <div class="note" style="margin-top:4px">10 公里 + 高清视频 + 纽扣电池用两年 —— 这三个条件凑在一起，缺的不是协议，是常识。</div>
  </div>`
});

/* ===== 13 USB 转串口横评（推文成稿） ===== */
F({
  id: '13-1', file: '01-USB转串口芯片横评-1-标称与实际.png', h: 580,
  kicker: '实用软件分享 <i>·</i> 嵌入式通信避坑 01', fig: '图 1', note: '灰色是手册写的，朱砂是你敢持续用的那条线',
  title: '标称速率和能用速率，是两回事',
  sub: '四颗芯片跑 115200 都毫无压力，差别全在上限那段',
  body: `
  <div class="col g16">
    ${[
      ['CH340', 0.18, 1, '2 Mbps', '500 kbps'],
      ['CP2102', 0.36, 0.52, '1 Mbps', '921600'],
      ['FT232R', 0.55, 0.55, '3 Mbps', '3 Mbps'],
      ['PL2303', 1, 0.62, '6~12 Mbps（看型号）', 'TA / GC 可用，HXA 不可用'],
    ].map(([nm, wr, wa, claim, real]) => `
      <div class="col g6">
        <div class="row" style="align-items:baseline">
          <span class="mono" style="font-size:16px;font-weight:700;width:78px">${nm}</span>
          <span style="font-size:14px;color:#8C8368">标称 <b style="color:#5A626C">${claim}</b></span>
        </div>
        <div class="row g6" style="gap:6px">
          <div style="height:16px;width:${wr * 78}%;background:#D8D2C0;border-radius:3px"></div>
        </div>
        <div class="row g6" style="gap:6px">
          <div style="height:16px;width:${wa * 78}%;background:#9C2B1F;border-radius:3px"></div>
          <span style="font-size:13px;color:#9C2B1F;font-weight:700">${real}</span>
        </div>
      </div>`).join('')}
    <div class="note">官方文档里 CH340 的双向稳定推荐值只到 500k；1M 通常能跑，2M 已经被反复证明不可靠。最贵那颗标称数字反而不是最高，但它说到做到。</div>
  </div>`
});

F({
  id: '13-2', file: '01-USB转串口芯片横评-2-排查顺序.png', h: 600,
  kicker: '实用软件分享 <i>·</i> 嵌入式通信避坑 01', fig: '图 2', note: '最省时间的是第⑥步：换电脑或换模块，一次分清是谁的问题',
  title: '出问题，别一上来就重装驱动',
  sub: '从上往下走，多数问题第一步就现形',
  body: `
  <table class="tb" style="margin-top:2px">
    <tr><th style="width:44px">#</th><th style="width:196px">查什么</th><th>典型现象</th></tr>
    ${[
      ['①', '设备管理器有没有 COM 口', '有黄叹号 → 驱动；完全没有 → 先换一根数据线'],
      ['②', '驱动从哪来的', '驱动站下的旧版 → 去芯片官网重下'],
      ['③', 'TX/RX 是否交叉、GND 是否共地', '发得出去、收不回来'],
      ['④', '两端波特率与帧格式', '全乱码，或固定丢某几个字节'],
      ['⑤', '电平是否匹配', '低速能通，一拉高速就错'],
      ['⑥', '换电脑 / 换模块', '交叉验证，一次分清是板子还是电脑'],
    ].map(([n, k, d]) => `<tr><td class="k" style="color:#9C2B1F;font-size:17px">${n}</td>
      <td class="k" style="font-size:15px;line-height:1.35">${k}</td>
      <td style="font-size:15px;color:#4E4636;line-height:1.4">${d}</td></tr>`).join('')}
  </table>
  <div class="note" style="margin-top:10px">同名相接一定不通：TX 接 TX 是新手的头号错误。第二个高频错误是只接两根信号线、忘了共地 —— 现象是时通时不通。</div>`
});

/* ---------------- 渲染 ---------------- */
for (const fx of FIXES) {
  const i = FIGS.findIndex((x) => x.id === fx.id);
  if (i >= 0) FIGS[i] = fx;
}
function page(f) {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><style>${CSS}
.db9{width:44px;height:44px;border-radius:9px;border:1.5px solid rgba(46,54,61,.45);
  display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:#8C8368;background:#FFFDF7}
.db9.on{border-color:#9C2B1F;background:#F6E2DC;color:#9C2B1F;box-shadow:2px 2px 0 rgba(156,43,31,.18)}
</style></head><body>
<div class="card">
  <div class="hd"><span class="k">${f.kicker}</span><span>程序小猴</span></div>
  <div class="tt">${f.title}</div>
  <div class="sub">${f.sub}</div>
  <div class="bd">${f.body}</div>
  <div class="ft"><span class="no">${f.fig}</span><span>${f.note}</span></div>
</div></body></html>`;
}

function miniWave(cpol, cpha) {
  // idle 段必须画出来：CPOL 的差别就在空闲电平上，不画空闲段四个模式看起来一样
  const yH = 16, yL = 54, x0 = 10, idle = 22, step = 58;
  const lv = [cpol, 1 - cpol, cpol, 1 - cpol, cpol];
  let d = `M ${x0} ${cpol ? yH : yL} L ${x0 + idle} ${cpol ? yH : yL}`;
  let y = cpol ? yH : yL, x = x0 + idle;
  for (let i = 0; i < 4; i++) {
    const yy = lv[i + 1] ? yH : yL;
    d += ` L ${x} ${y} L ${x} ${yy} L ${x + step} ${yy}`;
    x += step; y = yy;
  }
  const sx = x0 + idle + (cpha === 0 ? 0 : step);
  const sy = cpha === 0 ? (lv[1] ? yH : yL) : (lv[2] ? yH : yL);
  return `<svg viewBox="0 0 280 74" style="display:block;width:100%;height:auto;margin-top:7px">
    <path d="${d}" fill="none" stroke="#1F3A6E" stroke-width="2.2"/>
    <line x1="${sx}" y1="4" x2="${sx}" y2="66" stroke="#9C2B1F" stroke-width="1.5" stroke-dasharray="4 3"/>
    <circle cx="${sx}" cy="${sy}" r="4.6" fill="#9C2B1F"/>
    <text x="${sx}" y="72" font-size="12" fill="#9C2B1F" font-weight="700" text-anchor="middle">采样</text>
  </svg>`;
}

let ok = 0, fail = [], manifest = [];
for (const f of FIGS) {
  const html = SCRATCH + '/' + f.id + '.html';
  const pngRaw = RAW + '/' + f.id + '.png';
  fs.writeFileSync(html, page(f), 'utf8');
  try {
    execFileSync(CHROME, [
      '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-sandbox',
      '--force-device-scale-factor=2',
      '--window-size=750,3200',
      '--virtual-time-budget=4000',
      '--screenshot=' + pngRaw,
      'file:///' + html.replace(/\\/g, '/'),
    ], { stdio: 'pipe', timeout: 60000 });
    const buf = fs.readFileSync(pngRaw);
    const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
    const dir = f.file.startsWith('01-USB') ? BASE + '/推文成稿' : BASE + '/素材原稿';
    manifest.push({ id: f.id, raw: pngRaw, out: dir + '/' + f.file });
    ok++;
    console.log(`RENDER ${f.id} ${w}x${h}`);
  } catch (e) {
    fail.push(f.id + ': ' + String(e.message).slice(0, 160));
    console.log('FAIL ' + f.id);
  }
}
fs.writeFileSync(SCRATCH + '/manifest.json', JSON.stringify(manifest, null, 1), 'utf8');
console.log(`\n渲染 ${ok}/${FIGS.length}，待裁边缩放`);
if (fail.length) console.log('失败:\n' + fail.join('\n'));
