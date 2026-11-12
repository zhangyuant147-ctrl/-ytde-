# 生活切片配图

2026-11-11，使用内置 image_gen 生成。以下为生活意境配图，不代表用户实拍、所拥有车辆、品牌偏好或实际活动地点。

原始 PNG 保存在 `../lifestyle-update/`。网站引用 `site/src/assets/lifestyle/` 中的 WebP，每张有 768px 和 1536px 两种宽度；通过 srcSet、sizes 和懒加载控制下载体积。

文案数据：`site/src/lifestyle.ts`。布局组件：`site/src/LifeSection.tsx`。样式：`site/src/lifestyle.css`。

## 最终提示词

### driving

Use case: photorealistic-natural. Asset type: landscape editorial photograph for a Chinese personal website's driving hobby section, 1536x1024. Primary request: an unposed quiet everyday photograph of a dark graphite two-door coupe parked safely in a modest scenic roadside turnout, seen from the rear three-quarter angle, facing a curving empty road through low wooded hills in China. Ordinary overcast late afternoon, soft pale sky, natural muted greens, realistic damp asphalt and slightly dusty bodywork. Balanced 35mm lens, camera at human eye level, car occupies the lower right half, landscape and road are visible. No people, no readable badges or plates, no dramatic speed, no invented signs. Understated and believable, subtle sensor grain, restrained contrast, physically accurate reflections, realistic car geometry and wheels. Avoid AI look, CGI, illustration, cinematic orange-teal, fantasy scenery, perfect polished advertising, excessive bokeh, visible text, watermarks. Single full-bleed photo.

### billiards

Use case: photorealistic-natural. Asset type: landscape lifestyle photograph for a personal website's billiards hobby section, 1536x1024. Primary request: casual quiet Chinese pool hall, intimate close view across a slightly worn dark green felt pool table. A white cue ball and three separated numbered solid pool balls near a corner pocket, a single straight wooden cue resting diagonally on the rail, no hands or people in focus. Real dark wood rails, authentic rubber cushions and pocket geometry, chalk scuffs and subtle felt fibers, softly out-of-focus ordinary club interior. Warm practical overhead pool-table light, understated everyday photography, honest 50mm perspective, objects naturally spaced and asymmetric. Rich greens with warm neutral shadows and realistic exposure. Avoid CGI, render, impossible ball numbers, extra balls, plastic shine, overly theatrical light, excessive grain, illustrative look, text overlays, watermarks. Single full-bleed photo.

### tea

Use case: photorealistic-natural. Asset type: landscape lifestyle photograph for a Chinese personal website's tea hobby section, 1536x1024. Primary request: a quiet personal tea break by a window, a small unglazed brown Yixing-style teapot and two simple small off-white ceramic cups, one holding amber tea, on a used natural walnut tea tray, a few droplets and subtle tea stains. Cropped ordinary home background, no staged luxury decor. Soft overcast daylight comes from the left, natural brown and warm white palette. Close documentary still life from an informal seated angle using a 50mm lens at f/4, teapot and cups genuinely sharp, naturally soft background, believable ceramic texture and tea reflections, small imperfections. No person, no hands. Avoid exaggerated steam, idealized Japanese zen styling, flowers, artificial sunbeams, glowing liquids, CGI, illustration, exaggerated bokeh, overly perfect composition, text, watermark. Single full-bleed photo.

### evening

Use case: photorealistic-natural. Asset type: landscape lifestyle photograph for a personal website's occasional-drink hobby section, 1536x1024. Primary request: a modest quiet evening at home, one simple short whisky tumbler holding a small amber pour with two realistically shaped irregular ice cubes on a plain brown wooden side table. Close informal crop, dim domestic warm lamp softly visible in background, realistic highlights on thick clear glass, fine condensation near the base, subtle wood wear. Natural casual 50mm documentary photography, restrained exposure, imperfect relaxed framing, warm browns and charcoal shadows, calm everyday life rather than luxury advertisement. No bottle, no labels, no person, no car or road. Avoid CGI, render, artificial liquid glow, floating ice, perfect sphere ice, cinematic orange-teal, overdramatic hard light, extreme shallow depth of field, stylized illustration, any text, watermark. Single full-bleed photo.


## 自己下厨 · 用户提供的真实照片

新增两张用户提供的日常做饭照片：虾与花蛤、番茄炒蛋与蔬菜米饭。直接使用原图转码为 WebP，未使用生成式修改；保留完整画面，提供 768px 和 1280px 两种尺寸。原始 JPEG 备份于工作区 `work/lifestyle-update/cooking-originals/`，网站素材位于 `site/src/assets/lifestyle/cooking-*.webp`。页面和大图弹窗按照片来源分别显示标注。
