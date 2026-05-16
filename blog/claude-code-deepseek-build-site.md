最近用 Claude Code 搭配 DeepSeek v4 pro 模型，从零搭建了这个个人网站。整个过程基本是对话式开发——我说需求，AI 写代码、部署、修 bug。这篇文章复盘一下整个历程。

## 技术栈

- **托管**：GitHub Pages（`litianyi817.github.io`）
- **构建方式**：纯静态 HTML / CSS / JS，零框架、零构建工具
- **博客系统**：Markdown 源文件 + JSON 元数据 + marked.js 客户端渲染
- **AI 工具**：Claude Code（CLI）+ DeepSeek v4 pro 模型

## 项目初始化

Claude 做的第一件事是创建 `index.html` 和 `style.css`，初始化 Git 仓库，配置远程地址，推送到 GitHub Pages。遇到 GitHub 默认分支为 `main` 而我们推送到 `master` 的问题，Claude 排查后重命名分支并强制推送解决。

整个初始化过程不到 5 分钟，网站就上线了。

## 设计系统

Claude 制定了完整的设计 Token：

- **配色**：深色主题为主（`#08080a` 背景），支持一键切换 Light 模式
- **字体**：默认 MapleMono，可切换 Sans / Serif
- **圆角**：12px 卡片、40px 大区块
- **间距**：4px 基础单位，720px 内容最大宽度

风格参考了 `blog.airymoon.com`，定位「简约高级」。

## 核心功能

### 时间问候语
首页 Hero 区域根据系统时间动态显示问候语，深夜时段会提示「夜深了，请注意休息 🌙」。

### Blog 系统
采用 **Markdown 源文件 + JSON 元数据 + marked.js 渲染** 的方案：
1. 在 `blog/` 下写 `.md` 文件
2. 在 `blog/posts/` 创建薄包装 HTML
3. 更新 `blog/posts.json` 添加条目
4. 推送即上线

这样既保持了 Markdown 书写的便利，又保证了 SEO 友好。

### Notes 系统
与 Blog 共用相同的渲染逻辑，用于碎片化记录。

### Settings 面板
导航栏右侧下拉面板，支持：
- **Theme**：Dark / Light
- **Font**：MapleMono / Sans / Serif
- **Font Size**：S / M / L
- **Width**：Standard / Wide

所有偏好通过 `localStorage` 持久化，刷新不丢失。

### About 弹窗
点击导航栏 About 或首页「了解更多」，屏幕中央弹出模态窗口，包含个人简介和联系方式（手机、QQ邮箱、Gmail）。

### 全站动画
- 页面加载整体淡入
- Hero 区域元素交错滑入（greeting → h1 → subtitle → 按钮）
- 导航链接 hover 下划线滑动
- 滚动渐入：模糊 + 上滑动画
- 博客列表 / 卡片交错入场（IntersectionObserver + data-delay）
- 主题切换背景/边框平滑过渡（0.3s–0.4s）

## 踩过的坑

1. **分支问题**：GitHub 新仓库默认 `main`，我们推到了 `master`，导致网站不显示
2. **按钮样式**：将 `<a>` 改为 `<button>` 后丢失了 `.hero-links a` 的样式，修复选择器覆盖
3. **缓存问题**：浏览器缓存 `posts.json` 导致新文章不显示，添加 `?v=timestamp` 破坏缓存
4. **JS 兼容性**：`||=` 运算符在老浏览器不兼容，改为 `if (!x) x = []`
5. **导航栏白条**：`border-bottom` 在快速滚动时出现视觉残影，改为 `box-shadow`

## 后续计划

- [ ] 添加 RSS 订阅
- [ ] 图片懒加载
- [ ] 评论系统（Giscus）
- [ ] 搜索功能
- [ ] 更多主题配色

---

总结一下：**用 AI 写代码的核心体验不是「AI 替你写」，而是「你负责决策，AI 负责执行」**。设计方向、功能取舍、细节调整都需要人来判断，AI 的角色是把这些决策快速落地，并在过程中帮你发现遗漏的问题。

整个网站从零到上线只用了一次对话的功夫，这在以前是不可想象的。
