# litianyi817.github.io 开发日志

## 项目概览
- **站点**: https://litianyi817.github.io
- **技术栈**: 纯静态 HTML/CSS/JS，零框架零构建工具
- **托管**: GitHub Pages
- **AI 工具**: Claude Code CLI + DeepSeek v4 pro
- **开发周期**: 2026-05-16 至今

---

## 2026-05-16

### 项目初始化
- 创建 `index.html` + `style.css` 基础页面
- Git 仓库初始化，首次提交
- 推送遇到分支问题：GitHub 默认 main，推到了 master
- 解决：`git branch -M main` 改名后强制推送
- 清理远程 master 分支

### 网站框架搭建
**架构设计**:
```
F:\SITE\
├── index.html              # 首页
├── style.css               # 全局样式
├── script.js               # 全局交互
├── blog/                   # 博客系统
│   ├── index.html          # 列表页
│   ├── posts.json          # 元数据
│   └── posts/              # 文章 HTML 包装页
├── notes/                  # 笔记系统
├── travel/                 # 旅行记录
├── plan/                   # 旅行规划地图
├── game/                   # 宇宙战棋游戏
├── personal/               # 个人加密模块
├── assets/                 # 静态资源
└── components/             # 公共组件 (header/footer)
```

**设计系统**:
- 配色: 深色主题 `#08080a` 背景，`#e4e4e7` 文字，`#3b82f6` 强调色
- 字体: MapleMono 为主字体，支持 Sans/Serif/等线/仿宋/黑体/楷体/Fira Code 切换
- 圆角: 12px 卡片 / 40px 大区块
- 间距: 4px 基础单位，720px 内容宽度

**首页结构**:
- 固定导航栏（毛玻璃效果）
- Hero 全屏区域（大标题 + 副标题 + CTA 按钮）
- About 个人简介区
- 最新博客预览（3 篇卡片）
- 页脚

### 博客系统
- Markdown 源文件 + JSON 元数据 + marked.js 客户端渲染
- 博客列表按年份分组时间线
- 独立 HTML 包装页（SEO 友好）
- 示例文章: "你好，世界！"

### 笔记系统
- 与博客共用渲染逻辑
- JSON 驱动的轻量记录列表

---

## 2026-05-17

### 第一次修改迭代
用户反馈:
1. Hero 文字 "Hi, I'm Litianyi" → "Welcome Back"
2. 字体改为本地 MapleMono
3. 二级页面添加返回按钮
4. 博客支持 .md 格式书写

实现:
- 复制 MapleMono-Regular.ttf 到 assets，添加 @font-face
- 返回链接改为 pill 按钮样式
- blog/ 目录存放 .md 源文件
- 下载 marked.js 到本地（39KB），自托管

### 问题排查
- Blog 列表不显示新文章 → 浏览器缓存 posts.json → 添加 `?v=` 缓存破坏参数
- `||=` 运算符兼容性问题 → 改为 `if (!groups[y]) groups[y] = []`

---

## 2026-05-18

### Settings 面板
导航栏右侧 Settings 下拉面板，支持:
- Theme: Dark / Light
- Font: MapleMono / Sans / Serif
- Font Size: S / M / L
- Width: Standard / Wide
- 通过 `data-*` 属性 + CSS 变量切换
- localStorage 持久化

### 弹幕功能（已移除）
多次尝试实现背景浮动文字效果:
- DOM 方案: 创建 span 元素 + CSS animation（文字颜色太淡，不可见）
- Canvas 方案: requestAnimationFrame 绘制粒子（运行时报错冲突）
- 最终因频繁导致其他功能异常而被完全移除

### 时间问候语
Hero 区域根据系统时间动态显示:
| 时段 | 问候 |
|------|------|
| 0-6 | 夜深了，请注意休息 |
| 6-9 | 早上好，新的一天 |
| 9-12 | 上午好，精力充沛地开始吧 |
| 12-14 | 中午好，别忘了休息一下 |
| 14-18 | 下午好，喝杯茶继续前进 |
| 18-22 | 晚上好，放松一下，享受属于自己的时间 |
| 22-24 | 夜深了，请注意休息 |

### About 弹窗
点击导航 About 或首页"了解更多" → 屏幕中央弹出模态窗口
- 个人简介
- 联系方式: 手机/QQ邮箱/Gmail
- ESC 关闭 / 点击遮罩关闭

---

## 2026-05-19

### 点赞收藏功能
文章底部 ❤ 点赞 + ★ 收藏按钮
- localStorage 持久化计数和状态
- 点击变色（红/金）

### 动画系统
- 页面加载整体淡入
- Hero 交错滑入（greeting → h1 → subtitle → 按钮）
- 导航链接 hover 下划线滑动
- 滚动渐入: 模糊 + 上滑（IntersectionObserver）
- Blog/Notes/Travel 列表交错入场
- 主题切换背景平滑过渡 0.3s-0.4s

### 壁纸背景
- 用户提供的 `背景.png` (4.8MB) → `assets/bg.png`
- `body::before` 伪元素固定背景
- 暗色主题叠加蓝紫渐变光球
- 预加载 `<link rel="preload">`

### 毛玻璃效果
所有主要区域添加玻璃面板:
- 导航栏始终带 10px blur
- Hero 文字区 40px 圆角玻璃卡片
- About / 博客卡片 / 文章正文 8-10px blur
- 浅色主题同步适配

---

## 2026-05-20

### 导航栏白条修复
- 快速滚动时 `border-bottom` 出现残影
- 改为 `box-shadow: 0 1px 0 var(--border)`

### 背景优化
- 点阵纹理（1.5px 圆点，24px 间距）→ 后来因过于不显眼改为流动光球
- 背景光球增加 `bgShift` 流动动画（14s → 10s）
- Hero 浮动光环（600px 半透明圆环 + 鼠标追踪辉光）

### 字体扩展
新增 5 种字体选项:
- 等线 (DengXian)
- 仿宋 (FangSong)
- 黑体 (SimHei)
- 楷体 (KaiTi)
- Fira Code（复制字体文件到 assets）

### AI 下拉菜单
导航栏 Travel 和 About 之间 "AI" 按钮:
- Gemini / ChatGPT / Grok / DeepSeek / GLM / Doubao
- 新标签页打开，文字居中

### Travel 栏目
- 导航栏新增 Travel 链接
- 旅行记录列表页（类似 Notes）
- 新加坡 NTU AI 访学文章:
  - 标题: 新加坡·NTU 跨学科人工智能访学
  - 目的地突出卡片: 国旗 + 中英文名称
  - 行程卡片: 去程 CA404（天府→樟宜）/回程 CA403
  - 目的地标签: 牛车水/圣淘沙/NTU/NUS
  - 与 Blog 视觉区分: 暖色标题渐变 + 金色标签

### Blog 文章
新增文章: "使用 Claude Code + DeepSeek v4 pro 搭建个人网站全记录"
- 完整复盘技术栈、设计系统、踩坑记录

---

## 2026-05-21

### Plan 栏目（旅行规划地图）
- 导航栏新增 Plan 链接
- SVG 抽象路线地图（11 个城市）
- 设计特征:
  - 蓝色实线 = 铁路 / 白色虚线 = 航空
  - 城市开关面板（按国家分组）
  - 筛选按钮: 全部 / 仅飞机 / 仅铁路
  - 每条路线标注距离 + 票价
  - 滚轮缩放（光标位置为中心）
  - 悬浮框显示航班详细信息
  - 转机路线分行展示两段航程

地图演变:
1. V1: 简单 SVG 点线图
2. V2: 颜色路线 + 交互开关 + 悬浮框
3. V3: 缩放功能 + 城市隐藏 + 分类修复（region 属性曾遗漏导致分类失效）
4. V4: 路线编辑器 + 每条路线独立开关
5. V5: 真实机票数据（从 `价格.json` 加载），旧路线标记"存疑"
6. V6: 机场全名 + 托运额度 + 机型大小标注

**真实数据路线（来自价格.json）**:
| 路线 | 航班 | 详情 |
|------|------|------|
| 广州→首尔 | CX983+CX434 | 转机香港，国泰航空 |
| 首尔→济州 | ZE231 | 易斯达航空 B737-800 |
| 釜山→济州 | LJ569 | 真航空 B737-800 |
| 首尔→东京 | 7C1107 | 济州航空 B737MAX8 |
| 首尔→大阪 | BX176 | 釜山航空 A321 |
| 釜山→大阪 | LJ255 | 真航空 B737-800 |
| 釜山→东京 | 7C1151 | 济州航空 B737-800 |
| 成都→广州 | G3707 | 高铁 8h33min |

---

## 2026-05-22

### Game 栏目（星域征服）
**V1**: 6×6 网格战棋
- 4 种舰船 (Scout/Frigate/Cruiser/Battleship)
- 资源: 能量+矿物
- 攻击/部署/召回
- localStorage 存档

**V2 重构**: 抽象星图 + 建筑系统
- 3 种舰船 + 7 级颜色等级（白蓝绿紫金红浅蓝）
- 8 颗星球 SVG 抽象连线图
- 资源改为矿物+瓦斯
- 建筑系统: 造船厂(L1-3) / 工厂(L1-10,+10%资源) / 研究所(L1-10,+5%战力) / 指挥部(L1-2)
- 学说: 铁壁防线(A) / 雷霆突击(B) / 均衡舰队(C) / 泰坦之怒(D)
- 敌人独立战力数值

**V3 优化**:
- 移动端检测弹窗建议桌面端使用
- 学说效果减半，舰船+30%/级
- 等级用彩色方块显示而非文字
- 舰船升级功能
- 工厂替代兵工厂 (+10% 资源产出)
- L1 学说三选一
- 星球更名（熔岩星/星云站/双子星/暗物质区/冰环带/黑洞边缘/星环之光）

### Personal 加密模块
- 导航栏 Game 右侧新增 Personal
- SHA-256 前端加密密码门（密码 070817）
- 哈希值硬编码，明文不出现在源码中

**子模块**:
1. 📅 课表: 从 `课表.json` 渲染，显示课程名/教师/教室/时段，自动识别今日和即将课程
2. 📷 照片: 证件照预览 + 1寸/2寸 Canvas 裁剪下载
3. 📋 报告: 学籍验证报告在线查看/下载 + 有效期提示（至 2026-08-25）
4. 🍽 FOOD: 计划中 + 用餐评价（后期添加）

---

## 2026-05-23

### 导航栏增强（21st.dev 方案）
- 向下滚动导航隐藏（`translateY(-100%)`）
- 向上滚动导航显示
- 页面顶部时不触发隐藏

### Blog 不对称布局
最新文章大号特色卡片 + 其余文章网格排列
- 大卡片: 蓝色渐变光晕，大标题，完整摘要，"阅读全文→" CTA
- 网格卡片: hover 上浮+放大+阴影

### Glass Panel 统一
将 blog-header + blog-list 合并为单一 `.glass-panel` 容器
- 标题区（上圆角）+ 列表区（下圆角）无缝拼接
- Notebooks/Travel 同理

### 可读性优化
- 返回链接: 灰色文字 → pill 按钮（半透背景 + 边框）
- 描述文字: `--text-muted` → `--text-secondary` 提亮
- 暗色 muted: `#71717a` → `#8b8b95`

### FOOD 栏目
Personal 内新增：
- 只读展示，评级体系: S+/S/A/B/C
- C = "拉完了"
- 用餐评价: 豪客来牛排(B) / 滨寿司(S) / 寿司郎(A)
- 计划中: 知喜多/滨寿司/金倒拐耗儿鱼/X秀吉/粤拭轩
- 卡片式布局 + 评级彩色徽章
- 代金券/工作日/满减/单人套餐 标签系统
- 滨寿司优惠分两行显示

---

## 已知问题 / 经验教训

### 浏览器缓存
频繁出现的问题：更新代码后浏览器不刷新。
- 解决: 所有静态资源链接加 `?v=N` 版本号参数
- JSON 请求加 `Date.now()` 动态破坏缓存
- 组件 fetch 也需版本号

### GitHub Pages 部署
偶发性部署失败，需空 commit 重触发。

### JS 兼容性
- `||=` 逻辑或赋值在旧浏览器不支持 → 改用 `if (!x) x = []`
- 避免使用过于现代的语法糖

### 弹幕功能
三次尝试均失败:
1. DOM span + CSS animation（颜色不可见）
2. DOM span + 提高透明度（与其他功能冲突）
3. Canvas + requestAnimationFrame（运行时异常）

教训: 频繁 DOM 操作的后台动画会影响其他 JS 逻辑，独立页面功能应彻底隔离。

### UI 语言切换
两次尝试均导致其他功能异常:
- MutationObserver 监听动态翻译 + 弹幕 DOM 变更相互干扰
- 已移除，后续可在隔离模块中重新实现

---

## 文件清单

```
F:\SITE\
├── index.html                          # 首页
├── style.css                           # 全局样式 (~1200行)
├── script.js                           # 全局脚本 (~400行)
├── .gitignore
├── DEVELOPMENT.md                      # 本文件
├── blog/
│   ├── index.html
│   ├── posts.json
│   ├── hello-world.md
│   ├── STEAM窗口不显示及解决方案.md
│   ├── claude-code-deepseek-build-site.md
│   └── posts/
│       ├── hello-world.html
│       ├── steam-window-fix.html
│       ├── claude-code-deepseek-build-site.html
│       └── template.html
├── notes/
│   ├── index.html
│   └── notes.json
├── travel/
│   ├── index.html
│   ├── travels.json
│   └── posts/
│       └── ntu-ai-visit.html
├── plan/
│   ├── index.html
│   ├── 价格.json
│   └── 数据/             # 机票截图
├── game/
│   └── index.html
├── personal/
│   ├── index.html
│   ├── 课表.json
│   ├── 证件照.jpg
│   └── 教育部学籍在线验证报告_李天一.pdf
├── assets/
│   ├── bg.png                          # 壁纸 (4.8MB)
│   ├── MapleMono-Regular.ttf
│   ├── FiraCode-Regular.ttf
│   └── marked.min.js
└── components/
    ├── header.html
    └── footer.html
```
