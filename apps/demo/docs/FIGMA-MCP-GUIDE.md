# 连接 Figma 与设计系统（Figma MCP）

Figma MCP 让 **Cursor 里的 AI 能直接阅读你的 Figma 文件**：你粘贴一个 Figma 链接，AI 就能通过 MCP 拉取 Frame、组件、变量和布局，再按设计系统生成代码。下面是怎么把 Figma「接到」Cursor 上。

---

## 1. 让 Cursor 能阅读 Figma 文件（必做）

按顺序做一遍，做完后 **在对话里粘贴 Figma 链接，我就能读那个文件**。

### 方法 A：用 Cursor 自带入口 + Figma 官方深链（推荐）

1. **打开 Cursor 的 MCP 配置**
   - macOS：`Cursor` 菜单 → **Settings** → 左侧选 **Tools & MCP**（或 **Features** → MCP）。
   - 或命令面板 `Cmd + Shift + P` 输入 **MCP**，选 **Open MCP Configuration**（若有）。

2. **安装 Figma MCP Server**
   - 在 MCP 列表里找到 **Figma**（若没有，用下面的「方法 B」手动加）。
   - 点击 **Install**（或「Install MCP Server?」里的 Install）。

3. **用官方深链一键打开并添加 Figma**
   - 在浏览器中打开 Figma 官方说明里的深链，会**在 Cursor 里打开 MCP 配置并添加 Figma**：  
     [**Figma MCP server deep link (Cursor)**](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/)
   - 页内「Cursor」小节里有一个 `cursor://...` 链接，点击后 Cursor 会打开配置并加入 Figma 远程服务（`https://mcp.figma.com/mcp`）。

4. **连接并授权 Figma**
   - 在 Cursor 的 MCP 配置里，找到 **Figma**，点 **Connect**。
   - 浏览器会弹出 Figma 的 OAuth 登录，用你的 Figma 账号登录并 **Allow**。
   - 看到「Connected」或「Authentication successful」即表示成功。

5. **重启 Cursor**
   - **完全退出 Cursor 再重新打开**（MCP 只在启动时加载）。  
   - 重启后，在和你对话时**直接粘贴一个 Figma 设计/节点链接**，我就可以通过 Figma MCP 读取该文件内容。

### 方法 B：手动写 MCP 配置（方法 A 里没有 Figma 时用）

1. 打开 Cursor 的 MCP 配置文件（**用户级**，不是项目里）：
   - macOS：`~/.cursor/mcp.json`  
   - 即：`/Users/你的用户名/.cursor/mcp.json`

2. 若没有该文件，新建一个；若有，在 `mcpServers` 里加上 Figma。**示例**（仅作参考，键名以你当前 Cursor 版本为准）：

   ```json
   {
     "mcpServers": {
       "figma": {
         "url": "https://mcp.figma.com/mcp",
         "type": "http"
       }
     }
   }
   ```

   若你的 Cursor 用的是其他格式（例如 `servers`、`inputs`），以 Cursor 当前文档或界面为准；**核心是 Figma 远程地址**：`https://mcp.figma.com/mcp`，类型为 HTTP。

3. 保存后**完全重启 Cursor**，再在 MCP 界面里对 Figma 点 **Connect** 完成授权。

### 怎么确认已经能「读」Figma？

- 在和我对话时发一条：**「请读一下这个 Figma 设计」**，然后粘贴一个 Figma 链接（例如 `https://www.figma.com/design/xxx/文件名?node-id=181-128951`）。
- 若我这边已连上 Figma MCP，我会用 MCP 工具去拉取该链接对应节点并基于内容回复；若没有连接成功，我会提示你检查 MCP 是否安装、是否 Connect、是否重启过 Cursor。

官方说明：[Figma – Guide to the Figma MCP server](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server) | [Remote server 安装（含 Cursor 步骤）](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/)

---

## 2. 获取 Figma 链接

- 在 Figma 中打开目标文件，选中要实现的 **Frame** 或 **节点**。
- 右键 → **Copy link to selection**（或从浏览器地址栏复制并带上 `?node-id=xxx`）。
- 链接形如：`https://www.figma.com/design/文件key/文件名?node-id=181-128951`

把该链接复制到 Cursor 对话中即可被 MCP 识别。

---

## 3. 在 Cursor 里怎么用

在 Cursor 的 Agent / Chat 中：

1. **用 @ 引用 Figma 链接**  
   输入 `@` 后粘贴 Figma 链接，或直接粘贴链接（部分版本支持自动识别）。

2. **按设计系统出码**  
   明确要求「使用本仓库设计系统」的组件与 Token，保证和现有 `design-system/` 一致。

### 示例 prompt（从 Figma 构建组件）

```
参考 @https://www.figma.com/design/xxx/你的文件名?node-id=181-128951 ，
构建一个与设计一致的 React 组件。
请使用我们现有的设计系统组件与 token（design-system/src 下的主题与组件）。
```

替换 `@` 后面的链接为你的实际 Figma 文件/节点链接即可。

---

## 4. 与本仓库设计系统的关系

| 用途       | 来源 |
|------------|------|
| 设计稿     | Figma（通过 MCP 引用链接） |
| Token/样式 | `design-system/src/index.css`、`design-system/src/themes/online.css` |
| 组件用法   | `design-system/src/pages/ComponentsPage.tsx`、各页面组件 |
| 图标       | Figma 图标库见 [Icons 页](../src/pages/IconsPage.tsx) 与 [ICON-LIBRARY.md](./ICON-LIBRARY.md) |

生成代码时优先使用上述 token 与现有组件，再根据 Figma 节点做布局与文案调整，这样既能对齐设计，又能保持设计系统一致。

---

## Related

- [ICON-LIBRARY.md](./ICON-LIBRARY.md) — Figma 图标库与使用规范
- [CONTRIBUTING.md](../../CONTRIBUTING.md) — 设计系统在仓库中的位置与 PR 习惯
- [Figma MCP 官方指南](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server)
