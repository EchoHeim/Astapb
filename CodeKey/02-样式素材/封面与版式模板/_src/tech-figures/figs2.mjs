// 修订版配图：总线拓扑、时序波形、散点 —— 改用内联 SVG 精确控制

export const FIXES = [];

const F = (o) => FIXES.push(o);

// 把一条水平线按「需要断开的位置」切成多段（交叉处留口，比白色遮罩干净）
function rail(y, x0, x1, gaps, color, w) {
  let segs = [[x0, x1]];
  for (const g of gaps) {
    segs = segs.flatMap(([a, b]) => (g > a && g < b ? [[a, g - 6], [g + 6, b]] : [[a, b]]));
  }
  return segs
    .map(([a, b]) => `<line x1="${a}" y1="${y}" x2="${b}" y2="${y}" stroke="${color}" stroke-width="${w}"/>`)
    .join('');
}

/* ===== 03-1 RS-485 差分总线 ===== */
F({
  id: '03-1', file: '03-RS485-1-差分总线.png', h: 560,
  kicker: '嵌入式通信避坑 <i>·</i> 03 RS-485', fig: '图 1',
  note: '终端只在两个物理端点各放一个，不是每个节点都放',
  title: '两根线挂十几台设备，靠的是电压差',
  sub: '两根线一起挨干扰，差不变 —— 这就是差分能拉长线的全部原因',
  body: (() => {
    const yA = 62, yB = 148, x0 = 96, x1 = 574;
    const nodes = [188, 342, 496];
    const boxT = 88, boxH = 34;
    return `
  <div class="col g14" style="width:100%">
    <svg viewBox="0 0 674 182" style="display:block;width:100%;height:auto">
      <rect x="${x0 - 15}" y="${yA}" width="15" height="${yB - yA}" rx="3" fill="#FDF5E8" stroke="#9C2B1F" stroke-width="1.8"/>
      <rect x="${x1}" y="${yA}" width="15" height="${yB - yA}" rx="3" fill="#FDF5E8" stroke="#9C2B1F" stroke-width="1.8"/>
      <line x1="${x0}" y1="${yA}" x2="${x1}" y2="${yA}" stroke="#1F3A6E" stroke-width="2.8"/>
      <line x1="${x0}" y1="${yB}" x2="${x1}" y2="${yB}" stroke="#9C2B1F" stroke-width="2.8"/>
      <text x="${x0 - 23}" y="${(yA + yB) / 2 + 5}" font-size="14" font-weight="700" fill="#9C2B1F" text-anchor="end">120 Ω</text>
      <text x="${x1 + 23}" y="${(yA + yB) / 2 + 5}" font-size="14" font-weight="700" fill="#9C2B1F">120 Ω</text>
      <text x="${x0 + 10}" y="${yA - 9}" font-size="15" font-weight="700" fill="#1F3A6E">A</text>
      <text x="${x0 + 10}" y="${yB + 20}" font-size="15" font-weight="700" fill="#9C2B1F">B</text>
      ${nodes.map((x, i) => `
        <line x1="${x}" y1="${yA}" x2="${x}" y2="${boxT}" stroke="#2E363D" stroke-width="1.7"/>
        <line x1="${x}" y1="${boxT + boxH}" x2="${x}" y2="${yB}" stroke="#2E363D" stroke-width="1.7"/>
        <circle cx="${x}" cy="${yA}" r="3.4" fill="#1F3A6E"/>
        <circle cx="${x}" cy="${yB}" r="3.4" fill="#9C2B1F"/>
        <rect x="${x - 46}" y="${boxT}" width="92" height="${boxH}" rx="8" fill="#FFFDF7" stroke="#2E363D" stroke-width="1.5"/>
        <text x="${x}" y="${boxT + 23}" text-anchor="middle" font-size="14" font-weight="700" fill="#232A30">从站 ${i + 1}</text>`).join('')}
    </svg>
    <div class="row g12">
      <div class="nd f1"><div class="t" style="font-size:17px">两端各一个 120 Ω</div><div class="d">吸收反射，跟线缆特性阻抗匹配。断电测 A/B 间电阻常接近 60 Ω</div></div>
      <div class="nd f1"><div class="t" style="font-size:17px">星形布线是大忌</div><div class="d">支线越短越好，节点尽量串在主干上</div></div>
    </div>
    <div class="note">A/B 接反了不会烧，只是收不到 —— 所以「通信不上」的第一件事，是把两根线对调试一次。</div>
  </div>`;
  })()
});

/* ===== 05-1 I2C 总线与上拉 ===== */
F({
  id: '05-1', file: '05-I2C-1-总线与上拉.png', h: 560,
  kicker: '嵌入式通信避坑 <i>·</i> 05 I²C', fig: '图 1',
  note: '器件只能拉低，高电平全靠上拉电阻充回来',
  title: '两根线、两个上拉，挂一整排芯片',
  sub: '没上拉，波形根本起不来；上拉太强，下降沿电流又受不了',
  body: (() => {
    const yV = 26, yS = 108, yC = 168, top = 222;
    const xs = [104, 258, 412, 566];
    const devs = [['主机', 'MCU', 'bl'], ['EEPROM', '0x50', ''], ['RTC', '0x68', ''], ['传感器', '0x48', '']];
    const r1 = 196, r2 = 344;
    const sdaGaps = [r2];
    const sclGaps = xs.map((x) => x - 11);
    const taps = xs.map((x) => `
      <line x1="${x - 11}" y1="${top}" x2="${x - 11}" y2="${yS}" stroke="#1F3A6E" stroke-width="1.8"/>
      <line x1="${x + 11}" y1="${top}" x2="${x + 11}" y2="${yC}" stroke="#5A626C" stroke-width="1.8"/>
      <circle cx="${x - 11}" cy="${yS}" r="3.4" fill="#1F3A6E"/>
      <circle cx="${x + 11}" cy="${yC}" r="3.4" fill="#5A626C"/>`).join('');
    const boxes = xs.map((x, i) => {
      const [n, a] = devs[i];
      return `<rect x="${x - 62}" y="${top}" width="124" height="58" rx="9" fill="#FFFDF7"
        stroke="${i === 0 ? '#1F3A6E' : '#2E363D'}" stroke-width="1.6"/>
        <text x="${x}" y="${top + 26}" text-anchor="middle" font-size="17" font-weight="700"
          fill="${i === 0 ? '#1F3A6E' : '#232A30'}">${n}</text>
        <text x="${x}" y="${top + 47}" text-anchor="middle" font-size="14" fill="#5A626C">${a}</text>`;
    }).join('');
    return `
  <div class="col g14" style="width:100%">
    <svg viewBox="0 0 674 296" style="display:block;width:100%;height:auto">
      <line x1="64" y1="${yV}" x2="600" y2="${yV}" stroke="#8C8368" stroke-width="2"/>
      <text x="56" y="${yV + 5}" text-anchor="end" font-size="14" font-weight="700" fill="#8C8368">VCC</text>
      ${rail(yS, 64, 600, sdaGaps, '#1F3A6E', 2.8)}
      ${rail(yC, 64, 600, sclGaps, '#232A30', 2.8)}
      <text x="56" y="${yS + 5}" text-anchor="end" font-size="15" font-weight="700" fill="#1F3A6E">SDA</text>
      <text x="56" y="${yC + 5}" text-anchor="end" font-size="15" font-weight="700" fill="#232A30">SCL</text>
      <!-- 上拉 1：VCC → SDA -->
      <line x1="${r1}" y1="${yV}" x2="${r1}" y2="44" stroke="#9C2B1F" stroke-width="1.8"/>
      <rect x="${r1 - 6}" y="44" width="12" height="32" rx="2" fill="#FDF5E8" stroke="#9C2B1F" stroke-width="1.8"/>
      <line x1="${r1}" y1="76" x2="${r1}" y2="${yS}" stroke="#9C2B1F" stroke-width="1.8"/>
      <text x="${r1 + 13}" y="65" font-size="14" font-weight="700" fill="#9C2B1F">4.7k</text>
      <!-- 上拉 2：VCC → SCL（在 SDA 处断开） -->
      <line x1="${r2}" y1="${yV}" x2="${r2}" y2="44" stroke="#9C2B1F" stroke-width="1.8"/>
      <rect x="${r2 - 6}" y="44" width="12" height="32" rx="2" fill="#FDF5E8" stroke="#9C2B1F" stroke-width="1.8"/>
      <line x1="${r2}" y1="76" x2="${r2}" y2="${yC}" stroke="#9C2B1F" stroke-width="1.8"/>
      <text x="${r2 + 13}" y="65" font-size="14" font-weight="700" fill="#9C2B1F">4.7k</text>
      ${taps}
      ${boxes}
    </svg>
    <div class="row g12">
      <div class="nd f1"><div class="t" style="font-size:17px">地址冲突</div><div class="d">两个器件地址相同又改不了 → 换型号，或用 I²C 多路开关</div></div>
      <div class="nd f1"><div class="t" style="font-size:17px">上拉取值</div><div class="d">跟总线电容、目标速率、器件灌电流一起定，不是随手 10k</div></div>
    </div>
    <div class="note">SDA 被一直拉低 → 从机停在发送途中；SCL 被拉低 → 多半是时钟延展。</div>
  </div>`;
  })()
});

/* ===== 10-1 LIN 主从调度 ===== */
F({
  id: '10-1', file: '10-LIN-1-主从调度.png', h: 540,
  kicker: '嵌入式通信避坑 <i>·</i> 10 LIN', fig: '图 1',
  note: '从节点从不主动说话，全靠主节点点名',
  title: '一个主节点点名，从节点只听不说',
  sub: '没有仲裁、没有冲突 —— 因为任何时刻只允许一个人开口',
  body: (() => {
    const y = 104;
    const sxs = [300, 440, 576];
    const slaves = ['车门模块', '后视镜', '雨量传感器'];
    return `
  <div class="col g14" style="width:100%">
    <svg viewBox="0 0 674 202" style="display:block;width:100%;height:auto">
      <line x1="56" y1="${y}" x2="620" y2="${y}" stroke="#1F3A6E" stroke-width="2.8"/>
      <text x="620" y="${y - 12}" text-anchor="end" font-size="14" fill="#1F3A6E" font-weight="700">LIN 单线（12 V 域，显性 = 低）</text>
      <line x1="130" y1="${y}" x2="130" y2="${y - 30}" stroke="#2E363D" stroke-width="1.8"/>
      <rect x="48" y="${y - 86}" width="164" height="56" rx="9" fill="#FDF5E8" stroke="#9C2B1F" stroke-width="1.6"/>
      <text x="130" y="${y - 58}" text-anchor="middle" font-size="17" font-weight="700" fill="#9C2B1F">主节点</text>
      <text x="130" y="${y - 38}" text-anchor="middle" font-size="14" fill="#5A626C">发帧头 · 排调度表</text>
      ${sxs.map((x, i) => `
        <line x1="${x}" y1="${y}" x2="${x}" y2="${y + 30}" stroke="#2E363D" stroke-width="1.8"/>
        <circle cx="${x}" cy="${y}" r="3.4" fill="#1F3A6E"/>
        <rect x="${x - 64}" y="${y + 30}" width="128" height="54" rx="9" fill="#FFFDF7" stroke="#2E363D" stroke-width="1.6"/>
        <text x="${x}" y="${y + 56}" text-anchor="middle" font-size="16" font-weight="700" fill="#232A30">${slaves[i]}</text>
        <text x="${x}" y="${y + 74}" text-anchor="middle" font-size="13" fill="#5A626C">只应答</text>`).join('')}
    </svg>
    <div class="row g12">
      <div class="nd f1"><div class="t" style="font-size:17px">帧头由主节点发</div><div class="d">Break + Sync + PID，等于喊一声「0x22 报数据」</div></div>
      <div class="nd f1"><div class="t" style="font-size:17px">响应由从节点填</div><div class="d">只有 PID 对上的那个才动，其余装没听见</div></div>
    </div>
    <div class="note">所以 LIN 的实时性是「排出来的」：调度表怎么排，报文就按什么顺序走。改时序 = 改表，不是改代码逻辑。</div>
  </div>`;
  })()
});

/* ===== 11-1 1-Wire 复位时序 ===== */
F({
  id: '11-1', file: '11-1Wire-1-复位时序.png', h: 540,
  kicker: '嵌入式通信避坑 <i>·</i> 11 1-Wire', fig: '图 1',
  note: '480 μs 的拉低，是从机唯一能认出的「开场」',
  title: '每次通信，都从拽一下这根线开始',
  sub: '主机拉低 ≥480 μs，松手后从机回一个 15~60 μs 的低电平',
  body: (() => {
    const yH = 46, yL = 124;
    const p = [20, 110, 330, 378, 416, 654];
    const d = `M${p[0]},${yH} L${p[1]},${yH} L${p[1]},${yL} L${p[2]},${yL} L${p[2]},${yH} L${p[3]},${yH} L${p[3]},${yL} L${p[4]},${yL} L${p[4]},${yH} L${p[5]},${yH}`;
    return `
  <div class="col g14" style="width:100%">
    <svg viewBox="0 0 674 200" style="display:block;width:100%;height:auto">
      <path d="${d}" fill="none" stroke="#232A30" stroke-width="2.6" stroke-linejoin="round"/>
      <text x="220" y="26" text-anchor="middle" font-size="16" font-weight="700" fill="#9C2B1F">主机拉低 ≥480 μs</text>
      <text x="397" y="26" text-anchor="middle" font-size="15" font-weight="700" fill="#1F3A6E">从机应答</text>
      <line x1="${p[1]}" y1="172" x2="${p[2]}" y2="172" stroke="#9C2B1F" stroke-width="2.6"/>
      <line x1="${p[1]}" y1="166" x2="${p[1]}" y2="178" stroke="#9C2B1F" stroke-width="2"/>
      <line x1="${p[2]}" y1="166" x2="${p[2]}" y2="178" stroke="#9C2B1F" stroke-width="2"/>
      <text x="220" y="194" text-anchor="middle" font-size="14" fill="#9C2B1F" font-weight="700">复位脉冲</text>
      <line x1="${p[3]}" y1="172" x2="${p[4]}" y2="172" stroke="#1F3A6E" stroke-width="4"/>
      <line x1="${p[4]}" y1="172" x2="${p[4] + 26}" y2="172" stroke="#1F3A6E" stroke-width="1.4" opacity=".5"/>
      <text x="${p[4] + 32}" y="177" font-size="14" fill="#1F3A6E" font-weight="700">15~60 μs</text>
    </svg>
    <div class="row g12">
      <div class="nd f1"><div class="t" style="font-size:17px">没有复位，就没有一切</div><div class="d">从机平时完全沉默，只有抓到这段长低电平才醒过来</div></div>
      <div class="nd ac f1"><div class="t" style="font-size:17px">扫不到器件，先查这一下</div><div class="d">上拉、线长、寄生供电，都会让 Presence 脉冲消失</div></div>
    </div>
    <div class="note">DS18B20 读不到 85 ℃ 之外的数，很多时候不是芯片坏，是复位脉冲太短或时间槽被中断打断。</div>
  </div>`;
  })()
});

/* ===== 12-1 速率 × 距离 ===== */
F({
  id: '12-1', file: '12-无线-1-速率距离.png', h: 600,
  kicker: '嵌入式通信避坑 <i>·</i> 12 无线选型', fig: '图 1',
  note: '斜线是真实规律；⑧ 是例外，它的慢是成本换来的，不是距离换的',
  title: '速率和距离，本质上是一笔交易',
  sub: '想把数据送更远，只能让它更慢、或者更耗电',
  body: `
  <div class="row g14" style="align-items:center">
    <svg viewBox="0 0 392 340" style="display:block;flex:0 0 392px;width:392px">
      <text x="42" y="18" font-size="14" fill="#8C8368" font-weight="700">速率 ↑</text>
      <rect x="46" y="24" width="330" height="256" fill="#FFFDF7" stroke="rgba(46,54,61,.35)" stroke-width="1.4"/>
      ${[1, 2, 3].map((i) => `<line x1="46" y1="${24 + i * 64}" x2="376" y2="${24 + i * 64}" stroke="rgba(46,54,61,.10)" stroke-width="1"/>`).join('')}
      <line x1="70" y1="52" x2="352" y2="242" stroke="#9C2B1F" stroke-width="1.6" stroke-dasharray="6 5" opacity=".55"/>
      ${[
        ['①', 100, 58], ['②', 124, 82], ['③', 158, 66], ['④', 196, 106],
        ['⑤', 236, 106], ['⑥', 268, 168], ['⑦', 342, 240], ['⑧', 128, 226],
      ].map(([n, x, y]) => `<circle cx="${x}" cy="${y}" r="13" fill="#FFFDF7" stroke="#9C2B1F" stroke-width="1.6"/>
        <text x="${x}" y="${y + 5}" text-anchor="middle" font-size="13" fill="#9C2B1F" font-weight="700">${n}</text>`).join('')}
      <text x="211" y="306" text-anchor="middle" font-size="14" fill="#8C8368" font-weight="700">传输距离 →</text>
    </svg>
    <div class="col f1" style="gap:2px">
      ${[
        ['①', 'USB 2.0 HS', '480 Mbps'],
        ['②', 'Wi-Fi', '几十~几百 Mbps'],
        ['③', 'Ethernet', '100 Mbps'],
        ['④', 'CAN', '1 Mbps'],
        ['⑤', 'BLE', '1 Mbps'],
        ['⑥', 'RS-485', '100 kbps'],
        ['⑦', 'LoRa', '0.3~37.5 kbps'],
        ['⑧', '1-Wire / LIN', '16~20 kbps'],
      ].map(([n, nm, s]) => `
        <div class="row" style="align-items:center;padding:5px 0;border-bottom:1px dotted rgba(46,54,61,.22)">
          <span style="color:#9C2B1F;font-weight:700;font-size:13px;width:15px">${n}</span>
          <span style="font-size:14px;font-weight:700;white-space:nowrap">${nm}</span>
          <span style="font-size:12px;color:#5A626C;flex:1;text-align:right">${s}</span>
        </div>`).join('')}
    </div>
  </div>`
});

/* ===== 13-1 标称 vs 实际（对数轴落差图） ===== */
F({
  id: '13-1', file: '01-USB转串口芯片横评-1-标称与实际.png', h: 600,
  kicker: '实用软件分享 <i>·</i> 嵌入式通信避坑 01', fig: '图 1',
  note: '灰色是手册写的，朱砂是你敢持续用的那条线',
  title: '标称速率和能用速率，是两回事',
  sub: '四颗芯片跑 115200 都毫无压力，差别全在上限那段',
  body: (() => {
    const lo = Math.log10(0.1), hi = Math.log10(20), span = hi - lo;
    const px = (v) => ((Math.log10(v) - lo) / span) * 100;
    const rows = [
      ['CH340', 2, 0.5, '4×'],
      ['CP2102', 1, 0.9216, '差一点'],
      ['FT232R', 3, 3, '说到做到'],
      ['PL2303', 12, null, 'HXA 装不上'],
    ];
    const ticks = [[0.1, '0.1'], [1, '1'], [10, '10']];
    return `
  <div class="col g16">
    <div class="row g16" style="align-items:center;font-size:13px;color:#5A626C">
      <span class="row g6"><i style="display:inline-block;width:13px;height:13px;border-radius:50%;background:#FFFDF7;border:1.8px solid #8C8368"></i>手册标称</span>
      <span class="row g6"><i style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#9C2B1F"></i>实际敢持续用</span>
      <span class="row g6"><i style="display:inline-block;width:26px;border-top:1.6px dashed #9C2B1F"></i>落差</span>
    </div>
    ${rows.map(([nm, claim, real, gap]) => `
      <div class="col g4">
        <div class="row" style="align-items:baseline;justify-content:space-between">
          <span class="mono" style="font-size:16px;font-weight:700">${nm}</span>
          <span style="font-size:13px;color:#8C8368">标称 <b style="color:#5A626C">${claim} Mbps</b> · 差距 <b style="color:#9C2B1F">${gap}</b></span>
        </div>
        <div style="position:relative;height:26px">
          <div style="position:absolute;left:0;right:0;top:12px;height:1.4px;background:rgba(46,54,61,.18)"></div>
          ${real === null ? '' : `<div style="position:absolute;left:${px(real)}%;right:${100 - px(claim)}%;top:12px;height:1.4px;border-top:1.6px dashed #9C2B1F;opacity:.65"></div>`}
          <div style="position:absolute;left:${px(claim)}%;top:5px;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:#FFFDF7;border:1.8px solid #8C8368"></div>
          ${real === null
            ? ''
            : Math.abs(px(real) - px(claim)) < 0.3
              ? `<div style="position:absolute;left:${px(claim)}%;top:4px;width:16px;height:16px;margin-left:-8px;border-radius:50%;background:#9C2B1F;border:2px solid #8C8368"></div>`
              : `<div style="position:absolute;left:${px(real)}%;top:6.5px;width:11px;height:11px;margin-left:-5.5px;border-radius:50%;background:#9C2B1F"></div>`}
        </div>
      </div>`).join('')}
    <div style="position:relative;height:34px;margin-top:2px;border-top:1.6px solid #2E363D">
      ${ticks.map(([v, t]) => `<div style="position:absolute;left:${px(v)}%;top:0;width:0;height:6px;border-left:1.6px solid #2E363D;transform:translateX(-.8px)"></div>
        <div style="position:absolute;left:${px(v)}%;top:9px;transform:translateX(-50%);font-size:12px;color:#5A626C">${t}</div>`).join('')}
      <div style="position:absolute;right:0;top:22px;font-size:12px;color:#8C8368">Mbps（对数）</div>
    </div>
    <div class="note">CH340 官方推荐的双向稳定值只到 500k；1M 通常能跑，2M 已被反复证明不可靠。最贵那颗标称数字反而不是最高，但它说到做到。</div>
  </div>`;
  })()
});
