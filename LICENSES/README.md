# LICENSES · 许可证正文

存放各许可证的**全文**。根目录的 [`LICENSE`](../LICENSE) 只做区域对照与判定规则，
具体条款从本目录取用。

---

## 文件

| 文件 | 许可证 | 适用范围 |
| --- | --- | --- |
| [`MIT.txt`](MIT.txt) | MIT | 代码：`scripts/`、`.github/`、`WebBlog/` 站点代码、`WebSite/` 代码 |
| [`CC-BY-NC-SA-4.0.md`](CC-BY-NC-SA-4.0.md) | CC BY-NC-SA 4.0 | 原创图文：`WebBlog/docs/**/*.md`、`WebBlog/images/`、`WebBlog/sponsor/images/` |

## 不在本目录的许可

以下区域**不适用**上述任何许可证，其声明直接写在各自目录下：

| 区域 | 声明位置 |
| --- | --- |
| `CodeKey/` —— 保留所有权利 | [`../CodeKey/LICENSE`](../CodeKey/LICENSE) |
| `WebBlog/docs/尚德机构-考研/`、`尚德机构-考研-知识库/` —— 第三方资料，未授权 | 该目录下的 `LICENSE` |
| `WebBlog/docs/港股打新/` —— 第三方资料，未授权 | 该目录下的 `LICENSE` |
| `WebSite/` —— 代码 MIT + 第三方图标声明 | [`../WebSite/LICENSE`](../WebSite/LICENSE) |

---

## 为什么不用单一许可证

本仓库同时包含：

- **自己写的代码** —— 适合 MIT 这类宽松许可，方便别人取用；
- **自己写的文章** —— 希望被传播，但不希望被拿去卖钱，所以用 CC BY-NC-SA；
- **自己的商业素材** —— 不打算开放，保留所有权利；
- **别人的版权资料** —— 根本无权授权。

GPL-3.0 曾经覆盖整个仓库（由已删除的 `mfast` 工具链引入），
但用它覆盖文章和素材属于设计错配，且它会授予任何人再分发权，
因此改为分区域授权。详见根目录 [`LICENSE`](../LICENSE) 的"历史说明"。

---

## 优先级

若本目录内容与某个区域内的 `LICENSE` 冲突，**以区域内的为准**。
仍有疑问时，**以最严格的那个许可证为准**。
