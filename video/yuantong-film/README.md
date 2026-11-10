# Yuantong. / 30 秒个人网站展示片

已于2026-11-11正式导出：1920×1080、16:9、30fps、H.264 / MP4。无个人电话号码、邮箱或二维码，检查辅助线不在成片中。

仓库中的成片：[yuantong-30s.mp4](../yuantong-30s.mp4)。校验信息见[export-report.json](../export-report.json)。

## 预览与编辑

```bash
npm ci
npm run studio
```

打开终端显示的地址并选择 `Yuantong30`。首次播放请点击播放按钮以启用音频。完整片长30秒，900帧。

| 时间 | 内容 |
| --- | --- |
| 0–3秒 | 输入yuantong.com，搜索框展开成网站 |
| 3–7秒 | 创作对话上移、路径折线绘制、文案打字与推近 |
| 7–8秒 | 个人主张停留 |
| 8–13秒 | 数字分身与视角变化 |
| 13–19秒 | 三张作品海报递进入场 |
| 19–25秒 | 网站浏览器窗口层叠与页面移动 |
| 25–30秒 | 网站置于三维笔记本中，镜头拉远并合盖 |

相邻场景重叠淡化0.6秒。原生3D模型由代码创建，无外部模型；所有动画均由当前帧驱动。

## 文件

- `src/Root.tsx`：时间轴、场景、音乐与预览注册。
- `src/scenes/`：各个可单独编辑的场景。
- `src/components/Laptop.tsx`：三维笔记本、镜头与合盖。
- `src/components/BrowserWindow.tsx`：浏览器窗口。
- `src/safe-area.ts`、`src/SafetyOverlay.tsx`：安全区与检查预览。
- `public/`：网站截图、人物、配乐。
- `scripts/make-momentum.mjs`：30秒、120 BPM原创电子配乐生成器，无外部采样。
- `third-party/`：参考动效出处及MIT许可。

`IntroMotionPreview`、`LaptopEndingPreview` 分别检查3–7秒与23–30秒。`SafetyChecks` 中的合成只用于检查，不能作为干净成片输出。

## 导出与验证

```bash
npm run typecheck
npm run render
```

导出到 `out/yuantong-30s.mp4`。macOS必须使用苹果VideoToolbox：脚本显式指定 `--codec=h264 --hardware-acceleration=required --video-bitrate=16M --pixel-format=yuv420p`，不能回退软件视频编码。日志确认视频编码器为 `h264_videotoolbox`；最后合并音频时视频使用 `-c:v copy`，没有再次编码。

已读取实际文件元数据，确认为1920×1080、30fps、视频时长30.000秒；容器含音频时长30.016秒。实际视频码率约14.82Mbps。仍需按具体发布平台预览校准。

## 安全区与来源

通用横屏预设：主体四边5%，文字四边10%。已检查关键帧、转场、连续播放和最终视频抽帧；尚未做目标发布平台实机验收。成片没有四角常驻字标、边缘进度条或个人联系方式。

- 网站截图和人物来源：本仓库原有个人网站素材。
- 三海报参考：https://qieman-shots.pages.dev/#/s/d13df09dff 。许可见 `third-party/qieman-three-step/`。
- 路径洞察参考：https://qieman-shots.pages.dev/#/s/66bd4fdd8c 。许可见 `third-party/qieman-activation-insight/`。折线为创作路径示意，无真实业绩数据。
- 搜索和网页展示参考用户提供的视频，仅重新制作动作语言，没有分发原视频、原音乐、水印或其中其他网站内容。

早期历史备份及旧联系方式不随本次工程发布。
