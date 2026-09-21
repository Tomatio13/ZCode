import assert from "node:assert/strict";
import test from "node:test";
import {
  appSettingsSchema,
  appSettingsPatchSchema,
  localeSchema,
} from "../../shared/src/validationAppSettings.js";
import { zcodeTaskMetaSchema } from "../../shared/src/validation.js";
import {
  localizeConversationShareUrl,
  parseConversationSharePathname,
} from "../../shared/src/conversation-share.js";
import enUS from "../src/i18n/locales/en-US.js";
import jaJP from "../src/i18n/locales/ja-JP.js";
import zhCN from "../src/i18n/locales/zh-CN.js";
import { readAskUserQuestionAnswers } from "../src/lib/askUserQuestion.js";
import {
  getAgentPrimaryText,
  getAgentKindLabel,
} from "../src/ToolCallBlocks/renderers/agentHelpers.js";
import { getToolCallErrorText } from "../src/lib/toolError.js";
import { resolveToolCallIdentity } from "../src/lib/toolIdentity.js";
import { extractStructuredDiff } from "../src/lib/toolDiffPreview.js";

const meta = {
  taskId: "session-example",
  traceId: "trace-example",
  title: "Example",
  workspacePath: "/example/workspace",
  createdAt: 1,
  updatedAt: 2,
  mode: "build",
  provider: "glm",
};

function placeholders(value: string): string[] {
  return [...value.matchAll(/\{([A-Za-z0-9_]+)\}/g)].map((match) => match[1]!).sort();
}

test("Japanese is a supported application and share locale", () => {
  assert.equal(localeSchema.parse("ja-JP"), "ja-JP");
  assert.equal(appSettingsSchema.parse({ localePreference: "ja-JP" }).localePreference, "ja-JP");
  assert.deepEqual(parseConversationSharePathname("/ja/share/example"), {
    rawCode: "example",
    locale: "ja-JP",
  });
  assert.equal(
    localizeConversationShareUrl("https://zcode.z.ai/cn/share/example", "ja-JP"),
    "https://zcode.z.ai/ja/share/example",
  );
});

test("all GUI dictionaries expose the same keys and placeholders", () => {
  const expectedKeys = Object.keys(enUS).sort();
  for (const messages of [zhCN, jaJP]) {
    assert.deepEqual(Object.keys(messages).sort(), expectedKeys);
    for (const key of expectedKeys) {
      assert.deepEqual(placeholders(messages[key]!), placeholders(enUS[key]!), key);
    }
  }
});

test("current task metadata is accepted without upgrading third-party Agent identities", () => {
  assert.equal(zcodeTaskMetaSchema.parse(meta).provider, "glm");
  for (const provider of ["claude", "codex", "gemini", "opencode"]) {
    assert.equal(zcodeTaskMetaSchema.safeParse({ ...meta, provider }).success, false, provider);
  }
});

test("obsolete Agent settings are stripped without dropping current user preferences", () => {
  const settings = {
    enabledBuiltinAgentCliProviders: ["claude", "codex"],
    localePreference: "en-US",
  };
  for (const schema of [appSettingsSchema, appSettingsPatchSchema]) {
    const parsed = schema.parse(settings);
    assert.equal(parsed.localePreference, "en-US");
    assert.equal("enabledBuiltinAgentCliProviders" in parsed, false);
  }
});

test("current question results work while Claude ACP text is no longer interpreted as answers", () => {
  const input = { question: "Choose", options: [{ label: "One" }, { label: "Two" }] };
  assert.deepEqual(
    readAskUserQuestionAnswers({ input, output: { type: "answered", selected: "One" } }),
    { Choose: "One" },
  );
  assert.deepEqual(
    readAskUserQuestionAnswers({ input, output: { type: "answered_custom", text: "Custom" } }),
    { Choose: "Custom" },
  );
  assert.deepEqual(readAskUserQuestionAnswers({ output: { answers: { Choose: "Two" } } }), {
    Choose: "Two",
  });
  for (const output of ['"Choose"="One"', { content: [{ text: '"Choose"="One"' }] }]) {
    assert.equal(readAskUserQuestionAnswers({ input, output }), undefined);
    assert.equal(readAskUserQuestionAnswers({ input, raw: { output } }), undefined);
    assert.equal(readAskUserQuestionAnswers({ input, raw: { rawOutput: output } }), undefined);
  }
});

test("ZCode subagent identity wins over retired Codex nicknames", () => {
  const tool = {
    id: "tool-example",
    kind: "Agent",
    title: "Agent",
    status: "completed" as const,
    input: { subagent_type: "researcher", description: "Inspect sources" },
    raw: { nickname: "retired nickname" },
  };
  assert.equal(getAgentPrimaryText(tool, "Agent"), "Inspect sources");
  assert.equal(getAgentKindLabel(tool, "Agent"), "researcher");
  assert.equal(resolveToolCallIdentity({ toolName: "Task" }).family, "agent");
  assert.equal(resolveToolCallIdentity({ kind: "spawn_agent" }).family, "unknown");
});

test("current tool errors remain available without Claude ACP status overrides", () => {
  assert.equal(
    getToolCallErrorText({ status: "failed", error: "Permission denied" }),
    "Permission denied",
  );
  assert.equal(
    getToolCallErrorText({
      status: "failed",
      output: "<tool_use_error>Invalid input</tool_use_error>",
    }),
    "Invalid input",
  );
  assert.equal(
    getToolCallErrorText({
      status: "completed",
      raw: { status: "failed", rawOutput: "legacy error" },
    }),
    undefined,
  );
});

test("generic structured diffs still accept current tool content", () => {
  const diff = { type: "diff", path: "/example/file.ts", oldText: "before", newText: "after" };
  assert.deepEqual(extractStructuredDiff({ content: [diff] }), {
    path: diff.path,
    oldText: diff.oldText,
    newText: diff.newText,
  });
});
