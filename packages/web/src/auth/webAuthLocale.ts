type WebAuthLocale = "zh-CN" | "en-US" | "ja-JP";

interface WebAuthPageCopy {
  brand: string;
  loginTitle: string;
  loginDescription: string;
  loginAction: string;
  callbackTitle: string;
  callbackDescription: string;
  callbackErrorTitle: string;
  callbackErrorDescription: string;
  retryAction: string;
  waitingTitle: string;
  waitingDescription: string;
  signedInAs: string;
  logoutAction: string;
}

const WEB_AUTH_COPY = {
  "zh-CN": {
    brand: "ZCode",
    loginTitle: "登录后继续使用 Web 远程控制",
    loginDescription: "使用与桌面端一致的 Z.AI 账号身份访问当前远控入口。",
    loginAction: "用 Z.AI 登录",
    callbackTitle: "正在完成登录",
    callbackDescription: "请稍候，正在校验账号身份。",
    callbackErrorTitle: "登录失败",
    callbackErrorDescription: "授权流程未完成，请重新登录。",
    retryAction: "重新登录",
    waitingTitle: "已登录",
    waitingDescription: "设备列表能力即将接入，当前账号暂未选择远控目标。",
    signedInAs: "当前账号",
    logoutAction: "断开连接",
  },
  "ja-JP": {
    brand: "ZCode",
    loginTitle: "サインインして続行",
    loginDescription:
      "デスクトップ版と同じ Z.AI アカウントで Web リモートコントロールを利用します。",
    loginAction: "Z.AIでサインイン",
    callbackTitle: "サインインを完了しています",
    callbackDescription: "アカウントを確認しています。しばらくお待ちください。",
    callbackErrorTitle: "サインインに失敗しました",
    callbackErrorDescription: "認証を完了できませんでした。もう一度サインインしてください。",
    retryAction: "もう一度サインイン",
    waitingTitle: "サインイン済み",
    waitingDescription: "リモート操作するデバイスがまだ選択されていません。",
    signedInAs: "サインイン中",
    logoutAction: "接続を解除",
  },
  "en-US": {
    brand: "ZCode",
    loginTitle: "Sign In To Continue",
    loginDescription: "Use the same Z.AI account identity as desktop for Web remote control.",
    loginAction: "Sign in with Z.AI",
    callbackTitle: "Finishing Sign-In",
    callbackDescription: "Verifying your account identity.",
    callbackErrorTitle: "Sign-In Failed",
    callbackErrorDescription: "The authorization flow did not complete. Sign in again.",
    retryAction: "Sign In Again",
    waitingTitle: "Signed In",
    waitingDescription:
      "Device selection is coming next. No remote target is selected for this account yet.",
    signedInAs: "Signed in as",
    logoutAction: "Disconnect",
  },
} satisfies Record<WebAuthLocale, WebAuthPageCopy>;

function resolveWebAuthLocale(language?: string): WebAuthLocale {
  const candidate =
    language ??
    document.documentElement.lang ??
    navigator.language ??
    navigator.languages?.[0] ??
    "";

  const normalized = candidate.toLowerCase();
  if (normalized.startsWith("ja")) return "ja-JP";
  return normalized.startsWith("zh") ? "zh-CN" : "en-US";
}

export function getWebAuthCopy(locale: WebAuthLocale = resolveWebAuthLocale()): WebAuthPageCopy {
  return WEB_AUTH_COPY[locale];
}
