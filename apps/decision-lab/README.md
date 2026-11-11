# 纠结终结者

别纠结了，让 AI 帮你理清选择。输入一个生活难题，自己填写或点击「帮我想选项」生成草稿。确认 2–4 个选项后，回答 3–5 道偏好题，即可查看匹配排名、逐题分值、取舍和下一步建议。桌面和手机均可使用。

本应用位于个人网站仓库的 `apps/decision-lab`，有独立的依赖、锁文件和构建入口。以下命令均在此子目录执行。

## 本地运行

使用 Node.js 22.12 或更高版本（本地使用 Node 24）。从仓库根目录开始：

```sh
cd apps/decision-lab
npm ci
npm run dev
```

打开 http://localhost:3000 。不配置环境变量即可演示。生产运行使用 `npm run build && npm start`。

## 两种出题方式

- **演示模式**使用本地题库。“周末出行”“晚饭”“学习与休息”有独立的情境题。自定义难题询问直觉、错过的遗憾和行动意愿，保留用户输入的选项名称。
- **AI 模式**从服务端调用兼容 Chat Completions 的模型。在应用目录将 `.env.example` 复制为 `.env.local`，填写服务端配置后重启。问题、选项及解释所需的已选回答会发给配置的服务商。

| 环境变量 | 用途 |
| --- | --- |
| DEMO_MODE | `true` 强制演示。启用模型时设为 `false`。 |
| AI_API_KEY | 服务端密钥。留空即演示。 |
| AI_BASE_URL | 兼容接口的基础地址，含服务商要求的版本前缀。默认 `https://api.openai.com/v1`。 |
| AI_MODEL | 服务商的模型标识，默认 `gpt-4o-mini`。须支持 JSON 对象输出。 |

真实密钥只填本地环境文件或 Vercel 的服务端环境变量。示例文件中不含密钥。页面显示当前所用模式。单次模型请求超时 6.5 秒，最多重试一次。无效 JSON、评分结构不合法、超时或服务错误均转为带提示的规则输出；演示题的解释始终在本地生成。

## 评分与解释

每个答案通过候选项 ID 关联一个 0–5 的整数及其依据。选项实际得分为所有已选回答权重之和。匹配指数 = 实际得分 ÷（题目数 × 5）× 100，展示时最多保留一位小数。按原始分排序，同分同名次，例如 1、1、3。排名条形图不要求加总为 100%。

例如三道题给一个候选项 5、0、5 分，则得 10/15 分，匹配指数为 66.7%。匹配指数反映你在本次问答中的偏好，不代表客观正确率。并列或前两项相差不超过 10 个指数点时，结果说明会提示差距。

`POST /api/options` 接收 `{prompt, existing:[]}`。没有选项时补充 3 个；已有选项时只补空位，总数最多 4 个。AI 不可用时采用标明来源的主题示例或通用行动思路。生成后停留在首页供人修改。

`POST /api/questions` 接收 `{prompt, options:[{id,name}]}`，返回带模式的问答会话。Zod 和关联校验检查唯一性、数量、分值、完整覆盖、题内及候选项间的区分度。`POST /api/explain` 接收 `{session, choices:[{questionId,answerId}]}`，在服务端重新计算排名。AI 题目携带服务端签名。解释阶段仅让模型选择已有证据 ID 与行动建议，再由模板代入真实得分。所有界面内容按文本显示。

## 验证与动画

```sh
npm test
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
npm run studio
```

`npm run check` 顺序运行单元测试、类型检查和生产构建。浏览器测试需要生产构建，会自动在 3211 端口临时启动演示服务；若使用本机 Chrome，可用 `CHROME_PATH` 指定可执行文件。测试覆盖输入校验、2/4 个选项、键盘操作、返回修改、手机长中文、动画数据、并列与减少动态效果。接口测试使用受控的模型响应与超时信号，不消耗真实密钥。

Remotion Studio 地址为 http://localhost:3300/DecisionReveal 。示例数据由题库及同一评分函数生成。网页按需加载 Player，将真实结果作为 `inputProps` 传入。合成是 150 帧、30 fps；动效以帧为时间源，彩纸采用固定种子。使用系统减少动态效果设置时只展示静态结果。

## 部署至 Vercel

要在功能分支上预览而不合并，可在本地执行：

```sh
# 在仓库根目录切换到开发分支
git switch feature/decision-lab-mvp
cd apps/decision-lab
npx vercel
```

首次运行登录自己的 Vercel 账户，选择新项目（如 `decision-lab`），项目目录选择当前子目录 `./`，使用 Next.js 预设和默认构建输出。该命令生成 Preview 地址。默认演示无需配置密钥；在项目 Settings → Environment Variables 中填写上表变量后，重新部署才能使变更生效。

若使用 Git 集成，从此仓库的开发分支部署到专用项目；Root Directory 选 `apps/decision-lab`，Framework Preset 选 Next.js，安装命令 `npm ci`，构建命令 `npm run build`。该目录目前只在功能分支中。发布生产版本前核对项目和分支。参考 [Vercel monorepo 配置](https://vercel.com/docs/monorepos) 和 [部署环境](https://vercel.com/docs/deployments/environments)。

## 实现范围

Next.js App Router、严格 TypeScript、Tailwind CSS、Motion、Lucide、Zod、Remotion 与 @remotion/player。会话仅保存在当前页面内存，刷新后从头开始。未使用登录、数据库或服务端视频渲染。真实模型的质量和延迟取决于配置的服务商。
