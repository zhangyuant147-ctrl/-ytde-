# 张元通 Yuantong. — AI × IP 打造

黏土数字分身个人网站：暗色星空、超大背景标题、六方向人物表情、作品文件夹、作品筛选与电话联系。

本次更新已替换仓库中的旧版个人网页。旧版仍可从 Git 提交历史找回；现有在线网站保持不变：

**[访问在线网站](https://clay-studio-1109.leaflesscompass1.chatgpt.site)**

## 网站内容

- 首页：黏土人物形象与创作介绍。
- 关于我：张元通，AI × IP 打造。
- 作品文件夹：点击打开详情，支持关闭按钮、ESC 与遮罩关闭。
- 作品精选：按数字形象、品牌表达和创作实验筛选。
- 灵感实验室：三种背景配色和人物视差开关。
- 联系方式：15615543731，可拨号、复制。

数字形象是此次真实创作，另两组项目明确标记为概念示例。人物现在会根据鼠标位置向左右转头、抬头、低头和露出笑脸；悬停首页联系按钮或点按人物可触发笑脸，移开自动回正。六帧透明图像平滑切换，躯干固定。支持触屏点按、互动开关和系统“减少动态效果”。未包含连续视频或作品管理后台。

## 本地开发

需要 Node.js 22.13+。

```sh
npm ci
npm run dev
```

## 构建

```sh
npm run build
```

构建会先检查 TypeScript，再生成 `dist/`，最后将静态页面同步到仓库根目录的 `index.html`、`assets/` 与 `favicon.svg`。所有静态资源使用相对路径，可以部署在 GitHub Pages 的仓库子路径。

- `site/src/Portfolio.tsx`：姓名、介绍、电话、作品数据与交互。
- `site/src/styles.css`：视觉样式和响应式布局。
- `site/src/assets/portrait.webp`：透明黏土人物。
- `site/index.html`：网页源入口和 SEO 信息。
- 根目录 `index.html`、`assets/`、`favicon.svg`、`.nojekyll`：可直接部署的构建结果。

若要通过 GitHub Pages 另开一个网站，可在仓库 Settings → Pages 中选择 **Deploy from a branch / main / root**。本次仅替换仓库文件，没有更改现有在线网站或启用新的托管服务。

## 验证

迁移前核心交互已在 Chrome 桌面验证；迁移后执行 TypeScript 检查、静态生产构建、入口与资源路径检查。新增六方向逻辑检查、Chrome 桌面鼠标跟随检查、390 × 844 手机模拟排版与点按笑脸检查，尚未在真实手机上验证。

## 设计参考与素材

首页以 [Hi, I’m Noh 的公开展示](https://www.ludgi.ai/websites/hi-im-noh-3d-portfolio) 为构图参考，重新实现暗色大字背景、中央人物、浮动物体和联系按钮互动；使用张元通自己的文案与 AI 生成形象，没有使用参考站的付费源码或人物素材。参考站演示链接核对时失效，因此没有宣称逐帧复刻其完整交互。

`site/src/InteractivePortrait.tsx` 为人物交互组件；`site/src/portrait-motion.ts` 为鼠标方向映射；`site/src/expressions/` 为六帧表情素材；生成说明见 `ARTWORK.md`。


## 个人网站展示视频

- [30秒1080p成片](video/yuantong-30s.mp4)
- [可编辑Remotion工程与预览说明](video/yuantong-film/README.md)
- [导出验证与SHA-256校验](video/export-report.json)
