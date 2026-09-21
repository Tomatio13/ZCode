import type { Locale, SkillScope } from "@zcode/shared";

interface SkillDisplayCandidate {
  name: string;
  description: string;
  path: string;
  scope: SkillScope;
  pluginName?: string;
}

const OFFICIAL_BUILTIN_PLUGIN_NAMES = new Set([
  "android-emulator",
  "browser",
  "browser-use",
  "document-skills",
  "documents",
  "pdf",
  "presentations",
  "spreadsheets",
  "ios-simulator",
  "skill-creator",
  "plugin-creator",
  "superpowers",
  "zcode-guide",
]);

const OFFICIAL_PLUGIN_PATH_MARKERS = [
  "/zcode-plugins-official/",
  "\\zcode-plugins-official\\",
  "/android-emulator-plugin/",
  "/browser-use-plugin/",
  "/document-skills-plugin/",
  "/documents-plugin/",
  "/pdf-plugin/",
  "/presentations-plugin/",
  "/spreadsheets-plugin/",
  "/ios-simulator-plugin/",
  "/skill-creator-plugin/",
  "/plugin-creator-plugin/",
  "/superpowers-plugin/",
  "/zcode-guide-plugin/",
];

const BUILTIN_SKILL_DESCRIPTIONS: Record<string, Record<Locale, string>> = {
  "android-dev": {
    "zh-CN": "通过 android-emulator MCP 工具构建、运行、检查并轻量自动化 Android 应用。",
    "ja-JP":
      "Android アプリケーションを構築、実行、検査し、Android エミュレーター MCP ツールを通じて軽く自動化します。",
    "en-US":
      "Build, run, inspect, and lightly automate Android apps through the android-emulator MCP tools.",
  },
  brainstorming: {
    "zh-CN":
      "在任何创造性工作前使用：创建功能、构建组件、增加能力或修改行为；先探索用户意图、需求和设计。",
    "ja-JP":
      "機能を作成、構築コンポーネントを構築、機能を追加したり、行動を変えるなど、創造的な作業の前に使用する。",
    "en-US":
      "Use before any creative work, including creating features, building components, adding functionality, or modifying behavior. Explores user intent, requirements, and design before implementation.",
  },
  "control-browser": {
    "zh-CN": "控制 ZCode 内置浏览器，用于打开、检查、点击、输入、截图或验证网页和本地开发页面。",
    "ja-JP":
      "ZCodeの内蔵ブラウザをコントロールして、オープン、検査、クリック、タップ、スクリーンショット、またはウェブページや地元開発ターゲットを確認します。",
    "en-US":
      "Control ZCode's built-in browser to open, inspect, click, type, screenshot, or verify webpages and local development targets.",
  },
  "dispatching-parallel-agents": {
    "zh-CN": "面对 2 个以上彼此独立、无共享状态或顺序依赖的任务时使用。",
    "ja-JP": "共有状態や連続依存症なしで作業できる2つの独立した課題に直面する際に使用します。",
    "en-US":
      "Use when facing 2+ independent tasks that can be worked on without shared state or sequential dependencies.",
  },
  docx: {
    "zh-CN":
      "完整的 DOCX 文档创建、编辑与分析能力，支持修订、批注、格式保持和文本提取。适用于创建新文档、修改内容、处理修订、添加批注或其它专业 Word 文档任务。",
    "ja-JP":
      "作成、編集、分析 DOCX ドキュメントのレビュー、コメント、フォーマット保存、テキスト抽出を含む. 新しいドキュメント、編集、修正処理、コメント、およびプロの Word ドキュメント作業に使用します。",
    "en-US":
      "Create, edit, and analyze DOCX documents with revisions, comments, formatting preservation, and text extraction. Use for new documents, edits, revision handling, comments, and professional Word document work.",
  },
  "dynamic-workflows": {
    "zh-CN":
      "编写、调试或重新提交 CreateWorkflow 的 dynamic workflow 脚本时使用：如何设计子代理拓扑、定义结果类型、按文件或 git 扇出、用 world.run 命令做门控检查、用 EvalWorkflowSnippet 预检片段、写 planner-reviewer 循环、用 report() 保住已完成的工作、把产物发布给用户，以及 run 转入后台后该怎么处理。",
    "ja-JP":
      "CreateWorkflow のためのダイナミックワークフロー スクリプトを書き、デバグしたり再サブミットする際に使用する:サブエージェントのトポロジーを選択し、サブエージェントの結果を入力し、ファイルや git を検索し、世界.run コマンドでループをゲートし、EvalWorkflowSnippet を使用してテストパーツ、計画者レビューループ、レポート() 保存、ユーザーが開くアーティファクトの出版、および背景実行を処理します。",
    "en-US":
      "Use when writing, debugging, or resubmitting a dynamic-workflow script for CreateWorkflow: choosing subagent topology, typing subagent results, fanning out over files or git, gating loops on world.run commands, testing pieces with EvalWorkflowSnippet, planner-reviewer loops, report() salvage, publishing artifacts the user opens, and handling a backgrounded run.",
  },
  "executing-plans": {
    "zh-CN": "已有书面实现计划，并要在带评审检查点的独立会话中执行时使用。",
    "ja-JP":
      "あなたがレビューチェックポイントを含む別々のセッションで実行する書面の実施計画を持っているときに使用します。",
    "en-US":
      "Use when you have a written implementation plan to execute in a separate session with review checkpoints.",
  },
  "finishing-a-development-branch": {
    "zh-CN": "实现已完成、测试通过、需要决定如何合并、发 PR 或清理分支时使用。",
    "ja-JP":
      "実施が完了したときに使用し、テストを通過し、合併、PR、またはクリーニングを通じて作業を統合する方法を決定する必要があります。",
    "en-US":
      "Use when implementation is complete, tests pass, and you need to decide how to integrate the work through merge, PR, or cleanup.",
  },
  "ios-dev": {
    "zh-CN": "通过 ios-simulator MCP 工具构建、运行、检查并轻量自动化 iOS 模拟器应用。",
    "ja-JP":
      "iOS シミュレーターアプリケーションを構築、実行、検査し、iOS シミュレーター MCP ツールを通じて軽く自動化します。",
    "en-US":
      "Build, run, inspect, and lightly automate iOS Simulator apps through the ios-simulator MCP tools.",
  },
  pdf: {
    "zh-CN":
      "专业 PDF 工具集，覆盖报告、创意视觉、学术 LaTeX 和现有 PDF 处理四条生产线。可按文档类型自动路由，支持报告、海报、论文、简历、提取、合并、拆分、表单填写和格式转换等任务。",
    "ja-JP":
      "レポート、クリエイティブなビジュアル、学術的なLaTeX、および既存のPDFワークフローのためのプロフェッショナルPDFツールキット. レポート、ポスター、紙、リズム、抽出、合併、分割、フォーム、および変換をサポートします。",
    "en-US":
      "Professional PDF toolkit for reports, creative visuals, academic LaTeX, and existing-PDF workflows. Supports reports, posters, papers, resumes, extraction, merge, split, forms, and conversion.",
  },
  pptx: {
    "zh-CN":
      "检查并窄范围更新从 PPTX 预览区选择的元素。通过完整文件指纹和 OOXML 定位校验 shape 文本或表格单元格，冲突时停止而不猜测。",
    "ja-JP":
      "PPTX Preview Pane で選択した要素をチェックし、細かく更新します. 形状またはテーブルセルテキストのための全ファイル指紋と OOXML ロケーターを確認し、推測する代わりに紛争に立ち止まります。",
    "en-US":
      "Inspect and narrowly update elements selected in PPTX Preview Pane. Verifies the whole-file fingerprint and OOXML locator for shape or table-cell text, and stops on conflicts instead of guessing.",
  },
  "receiving-code-review": {
    "zh-CN":
      "收到代码评审反馈、准备实现建议前使用；尤其当反馈不清楚或技术上可疑时，需要严谨验证而非盲目同意。",
    "ja-JP":
      "提案を実施する前にコードレビューのフィードバックを受け取る際に使用し、特にフィードバックが不明確または技術的に疑問に思う場合。",
    "en-US":
      "Use when receiving code review feedback before implementing suggestions, especially when feedback is unclear or technically questionable.",
  },
  "requesting-code-review": {
    "zh-CN": "完成任务、实现重大功能或合并前，用于请求代码评审以确认满足需求。",
    "ja-JP":
      "課題を完了する際、主要な機能を実施するか、合併前に作業の要件を確認するために使用します。",
    "en-US":
      "Use when completing tasks, implementing major features, or before merging to verify work meets requirements.",
  },
  "plugin-creator": {
    "zh-CN": "创建、校验 ZCode 插件，并指导本地安装与更新。",
    "ja-JP": "ZCode プラグインを作成し、有効化し、地元のインストールと更新をガイドします。",
    "en-US": "Create and validate ZCode plugins, and guide local installation and updates.",
  },
  "skill-creator": {
    "zh-CN":
      "创建新技能、编辑现有技能并迭代措辞。适用于从零编写 SKILL.md、改进已有技能、把重复工作流沉淀为可复用技能，或优化技能描述以提升触发可靠性。",
    "ja-JP":
      "新しいスキルを作成し、既存のスキルを編集し、文字を変換する。スキルをスカートから書き込み、スキルを改善し、繰り返し作業流を捕獲したり、信頼性の高いリリースのための説明をトゥニングするために使用します。",
    "en-US":
      "Create new skills, edit existing skills, and iterate wording. Use for writing SKILL.md from scratch, improving skills, capturing repeated workflows, or tuning descriptions for reliable triggering.",
  },
  "subagent-driven-development": {
    "zh-CN": "在当前会话中执行包含独立任务的实现计划时使用。",
    "ja-JP": "現在のセッションで独立した課題を含む実施計画を実行する際に使用します。",
    "en-US":
      "Use when executing implementation plans with independent tasks in the current session.",
  },
  "systematic-debugging": {
    "zh-CN": "遇到任何 bug、测试失败或异常行为时，在提出修复前使用。",
    "ja-JP": "エラー、テスト失敗、または予期せぬ行動に直面する際に使用し、修正を提案する前に。",
    "en-US":
      "Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes.",
  },
  "test-driven-development": {
    "zh-CN": "实现任何功能或 bugfix 时，在编写实现代码前使用。",
    "ja-JP": "機能またはバグフィックスを実装する際に使用し、実装コードを書く前に。",
    "en-US": "Use when implementing any feature or bugfix, before writing implementation code.",
  },
  "using-git-worktrees": {
    "zh-CN":
      "开始需要隔离的功能工作或执行实现计划前使用，确保存在隔离 workspace，优先使用原生工具，否则回退 git worktree。",
    "ja-JP":
      "実施計画を実行する前に、隔離を必要とする機能の作業を開始する際に使用します. 孤立したワークスペースが先住民ツールまたはGitワークトリーの落下を通じて存在することを保証します。",
    "en-US":
      "Use when starting feature work that needs isolation or before executing implementation plans. Ensures an isolated workspace exists via native tools or git worktree fallback.",
  },
  "using-superpowers": {
    "zh-CN":
      "开始任何对话时使用；说明如何查找和使用技能，并要求在任何回复包括澄清问题前调用 Skill 工具。",
    "ja-JP":
      "会話を始めるときに使用するスキルを発見し、利用する方法を設定し、質問を明確にするなど、回答前にスキルのツールの呼び出しが必要です。",
    "en-US":
      "Use when starting any conversation. Establishes how to find and use skills, requiring Skill tool invocation before any response including clarifying questions.",
  },
  "verification-before-completion": {
    "zh-CN":
      "准备声明工作完成、已修复或测试通过前使用；要求先运行验证命令并确认输出，先有证据再下结论。",
    "ja-JP":
      "請求する前に使用する作業は完了、固定または通過します. 確認コマンドを実行し、成功の要求を前に出力を確認する必要があります。",
    "en-US":
      "Use before claiming work is complete, fixed, or passing. Requires running verification commands and confirming output before success claims.",
  },
  "web-gui-tester": {
    "zh-CN":
      "使用 ZCode Browser Use 对网页和本地 Web 前端执行纯 GUI 黑盒测试，通过真实用户交互、DOM 语义证据和截图验证功能、交互与响应式布局。",
    "ja-JP":
      "ZCode Browser を使用して、ウェブサイトや地元の Web フロントネンドに対して純粋な GUI ブラックボックステストを実行し、実際のユーザーインタラクション、セマンティック DOM の証拠、検査されたスクリーンショットを組み合わせます。",
    "en-US":
      "Run pure GUI black-box tests against websites and local web frontends with ZCode Browser Use, combining real user interactions, semantic DOM evidence, and inspected screenshots.",
  },
  "writing-plans": {
    "zh-CN": "已有规格或多步骤任务需求，在动代码前用于编写实现计划。",
    "ja-JP": "複数ステップのタスクにスペックまたは要件がある場合、コードを触る前に使用します。",
    "en-US":
      "Use when you have a spec or requirements for a multi-step task, before touching code.",
  },
  "writing-skills": {
    "zh-CN": "创建新技能、编辑现有技能或在发布前验证技能是否有效时使用。",
    "ja-JP":
      "新しいスキルを作成するとき、既存のスキルを編集したり、実施前にスキルの作業を確認したりする際に使用します。",
    "en-US":
      "Use when creating new skills, editing existing skills, or verifying skills work before deployment.",
  },
};

export function resolveSkillSourceLabel(scope: SkillScope, locale?: Locale): string {
  if (locale === "zh-CN") {
    if (scope === "workspace") return "工作区";
    if (scope === "plugin") return "插件";
    return "用户";
  }
  if (locale === "ja-JP") {
    if (scope === "workspace") return "ワークスペース";
    if (scope === "plugin") return "プラグイン";
    return "ユーザー";
  }
  if (scope === "workspace") return "Workspace";
  if (scope === "plugin") return "Plugin";
  return "User";
}

export function resolveSkillDisplayDescription(
  skill: SkillDisplayCandidate,
  locale?: Locale,
): string {
  const localized = isOfficialBuiltinSkill(skill)
    ? BUILTIN_SKILL_DESCRIPTIONS[skill.name]?.[locale ?? "en-US"]
    : undefined;
  return localized ?? skill.description;
}

function isOfficialBuiltinSkill(skill: SkillDisplayCandidate): boolean {
  if (skill.scope !== "plugin") {
    return false;
  }
  const pluginName = skill.pluginName?.trim();
  if (pluginName && OFFICIAL_BUILTIN_PLUGIN_NAMES.has(pluginName)) {
    return true;
  }
  const normalizedPath = skill.path.replaceAll("\\", "/");
  return OFFICIAL_PLUGIN_PATH_MARKERS.some((marker) => normalizedPath.includes(marker));
}
