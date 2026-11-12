# 人物表情素材生成说明

工具：内置 image_gen。输入：此前为张元通生成的透明黏土 3D 肖像。

最终提示词：生成 3 列 × 2 行六帧透明背景人物表情图集，每格 4:5。严格保留同一个短黑发、黑色圆领 T 恤的中国年轻男生，哑光细腻泥塑纹理和柔和电影光。相机、肩线、躯干、人物大小和颈部根位置固定，仅改变头部方向、目光、眉毛和嘴部表情。按左至右、上至下依次为：正面温和微笑；朝画面左侧转头约 20° 并向左看；朝画面右侧转头约 20° 并向右看；抬头约 15°、向上看并惊喜微笑；低头约 15°、向下看并可爱嘟嘴；正面开心露齿笑。每格完整头部和上半身，不跨格；无眼镜、胡须、脸部贴纸、背景、边框、文字、水印或道具。

图集按规则网格拆分成六张透明 WebP，网页保留固定躯干并平滑切换头部区域，附加轻微立体倾斜。原始图集保留在生成工具的输出目录中。

## 子页面姿态与四向跟随更新 / 2026-11-10

工具：内置 `image_gen`，透明背景。身份参考：`site/src/expressions/neutral.webp`。用户提供的两张截图仅用于姿态参考；保留当前数字分身的面部、发型、黑色 T 恤和材质，不复制截图中人物的身份、眼镜、贴纸或环境。

项目文件：`site/src/assets/portrait-presenting.png`、`portrait-working.png`；用于网页的透明 WebP 同名。PNG 为生成原图，WebP 只做格式压缩，保留 alpha。原始生成图仍保存在 Codex generated_images 中。

最终提示词 1：

> Use case: stylized-concept. Asset: transparent cutout for the RIGHT side of Zhang Yuantong's personal portfolio. Image 1 is the identity and material reference; image 2 is ONLY the gesture and framing reference. Create ONE coherent half-body 3D character, preserving the exact face, short neat black hair, warm skin, black crew neck T-shirt and sophisticated matte clay/realistic stylized material from image 1. Pose: standing in a relaxed three-quarter orientation, head facing viewer, his right arm extending toward the LEFT of the image, palm open as if introducing the copy to his left; other hand resting on hip. Calm friendly closed-mouth expression. Frame complete head, torso to hips, BOTH hands fully visible within generous transparent margins. Soft warm editorial studio lighting suitable for a graphite-black and warm ivory website. No background, no floor, no letters, no typography, no watermark, no glasses or facial stickers; do not copy the identity in image 2. Genuine transparent alpha background. Preserve the recognizable character from image 1.

最终提示词 2：

> Use case: stylized-concept. Asset: ONE transparent cutout for the RIGHT side of Zhang Yuantong's personal portfolio. Image 1 is the identity and material reference. Image 2 is ONLY pose and scene-props reference. Preserve precisely the short neat black hair, recognizable youthful East Asian face, warm skin, black crew neck T-shirt, sophisticated matte clay/stylized-realistic material of image 1. Repose this SAME character comfortably seated in a simple brown leather lounge chair, with a slim dark unbranded laptop resting on lap, hands typing, head tilted down subtly looking at screen, focused relaxed closed-mouth expression. Frame head through knees including chair armrests, laptop and both hands, fully within frame with generous transparent margins. Character and chair in three-quarter view turned slightly toward LEFT of image, suitable beside left-aligned page content. Soft warm editorial studio lighting for a graphite black and warm ivory website. Genuine transparent alpha background. No environment or floor, text, watermark, logos, glasses, stickers or tongue-out expression. Do not copy the identity of image 2, use only its seated-working pose.

上方历史六帧生成记录保留用于追溯；当前页面只加载正面、左、右、上、下五帧，露齿笑帧不再引用。
