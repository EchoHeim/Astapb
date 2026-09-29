# scripts · 实用小工具

跨平台的零散脚本集合。与业务无关，纯粹为了少敲几次命令。

---

## 目录内容

### `report_ip/` —— 开机自动上报本机 IP

给没有固定公网入口的开发板用的：开机联网后，把本机 IP 发到自己的邮箱，
这样即使 IP 变了也能找到板子。

| 文件 | 作用 |
| --- | --- |
| `ip.sh` | 开机脚本：延时 15 秒等待联网 → 写入 `ip.txt`（主机名 + `ifconfig` 输出）→ 调用发信脚本 |
| `CatchIP.py` | 取本机 IP：向 `8.8.8.8:80` 建 UDP 连接后反查本地地址；带 4 秒超时与异常兜底，失败返回 `0.0.0.0` |
| `autoemail.py` | 用 `yagmail` 把 `ip.txt` 作为正文和附件发出 |
| `ip.txt` | 上一次采集的 IP 记录 |

部署方式与依赖安装见 [`report_ip/README.md`](report_ip/README.md)。

### 其他

| 文件 | 作用 |
| --- | --- |
| `test.py` | 打印 `platform` 模块的各项系统信息（位数、架构、主机名、内核版本等）。属于临时实验脚本 |
| `test.sh` | WiFi 稳定性压力测试：在两套 SSID 之间来回切换，每次切换后反复下载同一个大文件，失败即退出 |

---

## ⚠️ 安全提醒（请优先处理）

本目录中**存在硬编码的明文凭据**：

- `autoemail.py` 里写死了发件邮箱的 **SMTP 授权码**；
- `test.sh` 里写死了两套 WiFi 的 **明文密码**。

这些文件已被提交，**凭据同样存在于 git 历史中**。因此：

1. **删除或改写文件并不能使凭据失效** —— 任何人都能通过 `git log -p` 翻出来；
2. **必须先去对应平台重置授权码 / 修改 WiFi 密码**，把泄漏的凭据作废；
3. 之后改用环境变量或 `.env` 文件读取，并把 `.env` 加进 `.gitignore`：

   ```python
   import os
   password = os.environ["MAIL_AUTH_CODE"]
   ```

本目录的脚本若被他人拿去直接运行，还会把邮件发到作者本人的信箱，
这也是把配置外置的另一个理由。

---

## 已知问题

| 位置 | 问题 | 说明 |
| --- | --- | --- |
| `report_ip/ip.sh:3` | `source_path = /home/pi/ip_report` **等号两侧多了空格** | bash 会把它当成"执行名为 `source_path` 的命令"，赋值完全不生效，后续 `cd $source_path` 会失败。应写成 `source_path=/home/pi/ip_report` |
| `report_ip/autoemail.py:10` | `ip_file.read().splitline()` | 方法名拼写错误，正确是 `splitlines()` |
| `report_ip/autoemail.py:11` | `for line in ip_file` | 前面已经 `read()` 到底，文件指针在末尾，这个循环取不到任何内容，`array` 恒为空 |
| `report_ip/CatchIP.py` | `finally: s.close()` | 若 `socket.socket()` 本身抛出异常，`s` 尚未绑定，`finally` 会再抛 `UnboundLocalError`，把真正的错误盖掉 |

以上均不影响阅读，但会让脚本在新环境上跑不通。

---

## 许可

**MIT**，正文见 [`../LICENSES/MIT.txt`](../LICENSES/MIT.txt)。
