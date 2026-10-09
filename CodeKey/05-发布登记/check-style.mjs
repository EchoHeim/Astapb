#!/usr/bin/env node
/**
 * 日报润色后的版式自检（字数 + 标点 + 禁用词）
 *
 * 用法：
 *   node CodeKey/05-发布登记/check-style.mjs "AI日报_9月27日_正文.md" ["AI日报_9月27日.md"]
 *
 * 检查项：
 *   1. 三条正文（含「📰 一句话快讯」块）的汉字数 —— 真实基线 1000~1200
 *   2. 禁用标点：破折号、弯双引号、直双引号；冒号只查正文散文区
 *      （小标题、💡小猴点评、📮 往期精选及其后的固定模块属家规，免检）
 *   3. 禁用词与高频踩雷词
 *   4. 「不是A而是B」类句式
 *
 * 结果写到 .workbuddy/_tmp/check-result.txt，用 Read 工具看（PowerShell 不回显 stdout）。
 */
import fs from 'fs';
import path from 'path';

const dir = 'D:/Personal/Astapb/CodeKey/AI 日报';
const args = process.argv.slice(2);
const files = args.length
  ? args
  : ['AI日报_9月24日_正文.md', 'AI日报_9月24日.md'];

const han = (s) => (s.match(/[\u4e00-\u9fa5]/g) || []).length;
const nostrip = (s) => s.replace(/\s/g, '').length;

const BANNED = [
  '说白了', '本质上', '换句话说', '值得注意的是', '不难发现', '综上所述', '总的来说',
  '首先', '其次', '让我们', '在当今', '随着技术的', '意味着', '不可否认', '毋庸置疑',
  '至关重要', '深入探讨', '赋能', '无缝', '显而易见', '事实上', '不得不说', '众所周知',
  '仿佛', '犹如', '宛若', '一丝', '一抹', '不由得', '深吸一口气', '情不自禁', '自然而然',
  '意义重大', '影响深远', '耐心看完', '看到这里',
];

const out = [];

for (const f of files) {
  const p = path.join(dir, f);
  if (!fs.existsSync(p)) { out.push(`=== ${f} ===\n文件不存在\n`); continue; }
  const raw = fs.readFileSync(p, 'utf8');
  const lines = raw.split(/\r?\n/);

  // 三条正文区：## 1. 起，到 📮 往期精选 前
  const s1 = lines.findIndex((l) => /^##\s*1\./.test(l));
  const s2 = lines.findIndex((l) => l.startsWith('📮'));
  const bodyBlock = s1 >= 0 && s2 > s1 ? lines.slice(s1, s2).join('\n') : '';

  out.push(`=== ${f} ===`);
  out.push(`三条正文（含快讯块）汉字 ${han(bodyBlock)}  非空白字符 ${nostrip(bodyBlock)}`);
  out.push(`全文件汉字 ${han(raw)}`);
  out.push('');

  const punct = [];
  const bannedHit = [];
  const notA = [];

  lines.forEach((l, i) => {
    const no = i + 1;
    const inFixed = s2 >= 0 && i >= s2;                 // 固定模块区（含存档尾部）
    const isHead = /^#{2,4}\s/.test(l.trim());          // 小标题
    const isComment = l.includes('小猴点评');            // 点评标签
    const isConfig = l.includes('发布配置') || l.includes('：这一整块');

    if (l.includes('——')) punct.push(`L${no} 破折号: ${l.slice(0, 70)}`);
    if (/[“”]/.test(l)) punct.push(`L${no} 弯双引号: ${l.slice(0, 70)}`);
    if (/["]/.test(l)) punct.push(`L${no} 直双引号: ${l.slice(0, 70)}`);
    if (l.includes('：') && !inFixed && !isHead && !isComment && !isConfig) {
      punct.push(`L${no} 冒号（散文区）: ${l.slice(0, 80)}`);
    }

    BANNED.forEach((w) => {
      if (l.includes(w)) bannedHit.push(`L${no} 命中「${w}」: ${l.slice(0, 80)}`);
    });

    if (/不是[^。；，]{1,20}(，)?(而)?是/.test(l)) notA.push(`L${no} 否定式: ${l.slice(0, 90)}`);
  });

  out.push(`-- 标点违规 ${punct.length} 处 --`);
  out.push(...(punct.length ? punct : ['无']));
  out.push('');
  out.push(`-- 禁用词 ${bannedHit.length} 处 --`);
  out.push(...(bannedHit.length ? bannedHit : ['无']));
  out.push('');
  out.push(`-- 「不是A而是B」类 ${notA.length} 处（递进式「不只是A还有B」属推荐修法，可留） --`);
  out.push(...(notA.length ? notA : ['无']));
  out.push('');
  out.push('');
}

const outFile = 'D:/Personal/Astapb/.workbuddy/_tmp/check-result.txt';
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, out.join('\n'), 'utf8');
console.log('OK -> ' + outFile);
