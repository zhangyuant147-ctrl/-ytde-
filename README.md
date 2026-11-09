# 张元通 Yuantong. — AI × IP 打造

黏土数字分身个人网站：深橄榄绿、胶片颗粒、人物视差、作品文件夹、作品筛选与电话联系。

本次更新已替换仓库中的旧版个人网页。旧版仍可从 Git 提交历史找回；现有在线网站保持不变：

**[访问在线网站](https://clay-studio-1109.leaflesscompass1.chatgpt.site)**

## 网站内容

- 首页：黏土人物形象与创作介绍。
- 关于我：张元通，AI × IP 打造。
- 作品文件夹：点击打开详情，支持关闭按钮、ESC 与遮罩关闭。
- 作品精选：按数字形象、品牌表达和创作实验筛选。
- 灵感实验室：三种背景配色和人物视差开关。
- 联系方式：15615543731，可拨号、复制。

数字形象是此次真实创作，另两组项目明确标记为概念示例。人物目前为静态透明 WebP 加视差交互，未包含转头表情视频或作品管理后台。

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

迁移前核心交互已在 Chrome 桌面验证；迁移后执行 TypeScript 检查、静态生产构建、入口与资源路径检查。手机响应式布局已编写，尚未在真机上验证。
