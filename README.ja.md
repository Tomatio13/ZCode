# ZCode

<div align="center">
  <img src="public/logo/icons/1024x1024.png" alt="ZCode" width="128" height="128" />
</div>
<p align="center">
  <a href="https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=47ag983c-8fcb-4d6d-814b-5395193a712c&amp;qr_code=true">Feishuコミュニティ</a> ·
  <a href="https://discord.gg/z9aBcQXZQ3">Discord</a>
</p>
<p align="center">
  <a href="README.md">简体中文</a> | <a href="README.en.md">English</a> | 日本語
</p>

ZCodeは、デスクトップ、ブラウザー、ターミナルから利用できるAIコーディングワークスペースです。このリポジトリには、クライアント、バックエンドサービス、共通UI、Agent CLIとランタイムのソースコードが含まれます。

| インターフェース      | 用途                                                                        | 開発コマンド                   |
| --------------------- | --------------------------------------------------------------------------- | ------------------------------ |
| Desktop               | Electronデスクトップアプリ                                                  | `pnpm dev:desktop`             |
| Web / ZCode CLI配布版 | TUI、Web、バックエンド、Agentをまとめたターミナル／ブラウザーワークスペース | `pnpm dev:web`                 |
| Agent CLI             | ターミナルで`zcode`を使うCLI。DesktopとWebにもAgentランタイムを提供         | `pnpm --filter @zcode/cli dev` |

## セットアップ

Git、Node.js **24.14.0**、pnpm **10.33.2**を用意してください。ツールのバージョンは[mise.toml](mise.toml)を参照してください。以下のコマンドはリポジトリのルートで実行します。

```bash
pnpm bootstrap
```

`pnpm bootstrap`はworkspace依存関係をインストールし、Desktopのローカル実行リソースを準備してから`build:bootstrap`を実行します。

Agent CLIとランタイムのソースは[apps/zcode-cli/](apps/zcode-cli/)にあり、リポジトリのクローンに含まれます。別途チェックアウトしたり、Git submoduleを初期化したりする必要はありません。

| コマンド                       | 用途                                                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `pnpm install`                 | 依存関係をインストール                                                                                      |
| `pnpm prepare:desktop-runtime` | Desktop実行リソースを準備（既定でリモートリソースも準備）                                                   |
| `pnpm prepare:remote-assets`   | リモート実行リソースを個別に準備                                                                            |
| `pnpm bootstrap:with-remote`   | 依存関係とローカル／リモートリソースを準備し、関連パッケージを順番にビルド。Desktopアプリのbundleはスキップ |
| `pnpm build`                   | 各workspaceパッケージのビルドを実行。パッケージごとのリソース準備も含む                                     |

通常の`bootstrap`はリモートリソースの準備を省略するため、ローカルでDesktopを開発するときに適しています。リモートワークスペースを使う場合やリモート配布リソースを検証する場合は、対応する準備コマンドを実行してください。

## 開発と実行

### Desktop

```bash
pnpm dev:desktop

# テスト環境
pnpm dev:desktop:test
```

`pnpm dev:desktop`は`pnpm dev:desktop:prod`を実行し、本番サービス設定を使います。起動時にローカル実行リソースとDesktop用Agentを準備し、Electronとソース監視を開始します。

開発用データを別の場所に保存するには`ZCODE_DATA_BASE_DIR`を設定します（macOS／Linuxの例）。

```bash
ZCODE_DATA_BASE_DIR="$HOME/.zcode-dev-home" pnpm dev:desktop:test
```

### リモート機能（SSH／WSL）

`pnpm bootstrap:with-remote`でリモートリソース（mock-cdn）を準備してから、`pnpm dev:desktop`を起動します。リモートプロジェクトへの接続時は、リソース選択で「ローカルにダウンロードしてからアップロード」を選んでください。開発時のリソースはローカルの`packages/desktop/mock-cdn`とビルド成果物から取得し、SFTPでリモートへ送信します。CDNにはアクセスしません。

### Web開発

Webまたはバックエンドのソースを編集するときは、開発モードを使います。

```bash
pnpm dev:web

# バックエンドのworkspaceを指定（macOS／Linux）
ZCODE_SERVER_WORKSPACE=/path/to/project pnpm dev:web
```

Web開発サーバー（既定`http://localhost:5173`）とバックエンド（既定`http://localhost:3030`）が起動します。ブラウザーではWeb開発サーバーを開いてください。`/ws`と通常の`/api`リクエストはローカルバックエンドへ、`/api/v1/oauth/token`は設定された製品サービスへ転送されます。

Agentのソースを変更した後は`pnpm --filter @zcode/cli... build`を実行してサービスを再起動してください。配布版全体は、後述の手順でビルドして検証できます。

### ZCode CLI配布版

配布版はTUI、Web、Agentを単一の`zcode`コマンドにまとめます。引数なしではTUIを起動し、先頭引数が`--web`ならWebモードを起動します。それ以外の引数は既存のAgent CLIに渡されます。どちらもElectronを使わず、ローカルで動作します。

```bash
# ターミナルUI
zcode

# Web画面
zcode --web

# プロジェクトとポートを指定し、ブラウザーを自動で開かない
zcode --web --workspace /path/to/project --port 3030 --no-open

# オプションを表示
zcode --help
zcode --web --help
```

Webモードは既定で現在のディレクトリをworkspaceとして使い、`127.0.0.1`で待ち受けます。アクセストークン認証は既定で無効です。空きポートを選び、ブラウザーを開きます。ターミナルに表示されたURLへアクセスし、`Ctrl+C`で停止します。LANから接続する場合は`--host 0.0.0.0`を指定してください。ローカル以外のアドレスで待ち受けると、既定でアクセストークンが生成されます。ターミナルに表示されたトークン付きURLを使ってください。`--token`でトークンを指定するか、`--no-token`で認証を無効にできます。

汎用WebサービスのHTTPエントリーを直接起動する場合は、`ZCODE_SERVER_AUTH_TOKEN`でAPI／WebSocket認証を設定します。プログラムからサービスを作成する場合は`authToken`オプションを使います。

`pnpm build:zcode`は配布物を生成しますが、`PATH`上にある既存の`zcode`コマンドは置き換えません。コマンドが古いインストールや別のソースディレクトリを指す場合、macOS／Linuxでは`command -v zcode`、Windowsでは`where.exe zcode`で確認できます。

### CLIソースの開発

TUIまたはAgentを直接開発する場合は、ソースのエントリーを実行します。

```bash
pnpm --filter @zcode/cli dev --help
pnpm --filter @zcode/cli dev

# CLIとworkspace依存パッケージをビルド
pnpm --filter @zcode/cli... build
node apps/zcode-cli/packages/cli/dist/zcode.cjs --help
```

このエントリーはAgent CLIを直接実行し、配布版の`--web`振り分けは行いません。Web開発には`pnpm dev:web`を、統合された`zcode`コマンドの検証には展開後の`bin/zcode.mjs`を使ってください。

## 設定

ルートの[.env.example](.env.example)にはサービスURLとビルド設定の例があります。必要に応じて`.env`へコピーし、ローカル固有の設定は`.env.local`に置いてください。Desktopの開発環境は`dev:desktop:test`または`dev:desktop:prod`で選択します。

| 設定                                 | 用途                                                            |
| ------------------------------------ | --------------------------------------------------------------- |
| `ZCODE_DATA_BASE_DIR`                | アプリデータの基準ディレクトリ。データはその下の`.zcode/`に保存 |
| `ZCODE_SERVER_WORKSPACE`             | Webバックエンドのworkspaceパス                                  |
| `ZCODE_BUILTIN_PROVIDER_CONFIG_FILE` | ローカルProvider設定ファイルのパス。未指定時は内蔵設定を使用    |
| `ZCODE_DIST_BASE_URL`                | CLI配布版のインストーラーが使うダウンロード元URL                |

実行時の環境変数は起動コマンドの環境に設定できます。クライアント同梱の既定設定は[config/README.md](config/README.md)を参照してください。

## パッケージ作成

第三者ライセンス表示は[THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md)を参照してください。生成・検証スクリプトは[scripts/third-party-notices.mjs](scripts/third-party-notices.mjs)にあります。

### Desktop

```bash
pnpm bundle:desktop

# Linux x64向け（AppImage、deb、rpm、pacman）
pnpm bundle:desktop -- --os linux --arch x64

# Linux ARM64向け
pnpm bundle:desktop -- --os linux --arch arm64

pnpm bundle:desktop -- --help
```

Linux向けビルドは4種類のパッケージを作成します。debファイルは既定で`packages/desktop/dist/`に出力されます。デフォルトの対象はmacOS arm64です。`--os`は`mac`、`win`、`linux`、`--arch`は`x64`、`arm64`を指定できます。実際のパッケージ作成と署名には、対象プラットフォームに対応したツールと設定が必要です。

#### Linux正式版（production）

正式版のLinux x64向けパッケージは、リポジトリのルートで次のように作成します。

```bash
ZCODE_ENV=production pnpm bundle:desktop -- --os linux --arch x64
```

ARM64向けに作成する場合は、`--arch x64`を`--arch arm64`に置き換えます。LinuxビルドはAppImage、deb、rpm、pacmanをまとめて作成するため、Ubuntuでは事前に次のパッケージをインストールしてください。

```bash
sudo apt install rpm libarchive-tools
```

`rpm`はRPM作成用の`rpmbuild`、`libarchive-tools`はpacman作成用の`bsdtar`を提供します。指定した形式のどれかで失敗するとコマンド全体も失敗しますが、先に作成済みのパッケージは`packages/desktop/dist/`に残る場合があります。正式版のdebは通常`ZCode`を含む名前で出力されます。Preview版やテスト用バックエンドのパッケージとは名前が異なります。

このコマンドはローカルでパッケージをビルドするだけで、GitHub Releaseへのアップロードや公開、署名は行いません。公開する場合は成果物の確認後、別途リリース手順を実施してください。

### ZCode CLI配布版

`pnpm build:zcode`でCLI／TUI、バックエンド、Webクライアントをビルドし、TUIのネイティブライブラリ、worker、実行時依存を集めて配布物を組み立てます。配布版の実行にはNode.jsが必要です。バージョンは[mise.toml](mise.toml)を参照してください。

パッケージ作成前に、ダウンロード元のルートURLを`ZCODE_DIST_BASE_URL`に設定します。`.env`、`.env.local`、環境変数、または`--base-url`で指定できます。次のURLは例なので、公開時には実際の配布先へ置き換えてください。

```bash
pnpm build:zcode --base-url https://downloads.example.com/zcode/

# ZCODE_DIST_BASE_URLを設定済みの場合
pnpm build:zcode

# 既存のAgent、バックエンド、Webのビルド成果物から再パッケージ
pnpm build:zcode --skip-build

# オプションを表示
pnpm build:zcode --help
```

バージョンはルートの`package.json`から取得し、`dist/zcode/`へ出力します。

- `releases/<version>/zcode-<version>.tar.gz`: 実行パッケージ
- `releases/<version>/sha256.txt`: チェックサム
- `latest.json`、`install.sh`: バージョン情報とインストールスクリプト

ディレクトリ全体を設定済みのダウンロード先へアップロードしてください。インストーラーはそこから実行パッケージを取得し、既定で`~/.zcode/runtime`へインストールして、`~/.local/bin`に`zcode`コマンドを作成します。`ZCODE_DIST_HOME`でインストール先を、`ZCODE_DIST_BIN_DIR`でコマンド配置先を変更できます。

従来のLite版を利用している場合は、上記のビルドコマンド、環境変数、新しいインストーラーを使ってください。新しいインストールは旧Liteディレクトリや既存セッションデータを削除・移行しません。

配布物をアップロードせずローカルで検証するには、展開して直接起動します。

```bash
zcode_version=$(node -p 'require("./dist/zcode/latest.json").version')
mkdir -p dist/zcode/debug
tar -xzf "dist/zcode/releases/$zcode_version/zcode-$zcode_version.tar.gz" \
  -C dist/zcode/debug

# TUI
node dist/zcode/debug/zcode/bin/zcode.mjs

# Webモード
node dist/zcode/debug/zcode/bin/zcode.mjs --web \
  --workspace "$PWD" --port 3030 --no-open
```

ブラウザーで`http://127.0.0.1:3030`を開くと、同じバックエンドがWeb画面を配信し、Agentを実行する一連の動作を確認できます。ポートが空いている必要があります。`pnpm dev:web`を起動中の場合は別の`--port`を指定してください。

## リポジトリ構成

| ディレクトリ                                         | 役割                                                        |
| ---------------------------------------------------- | ----------------------------------------------------------- |
| `packages/desktop`                                   | Electron Main、Host、Renderer、Desktopパッケージ作成        |
| `packages/web`                                       | Webクライアント                                             |
| `packages/server`                                    | HTTP／WebSocketサービスとリモート接続                       |
| `packages/zcode-server-cli`                          | 独立Serverの起動とプロセス管理                              |
| `packages/ui`                                        | 共通Reactコンポーネント、hooks、Zustand状態                 |
| `packages/services`                                  | ビジネスサービスと永続化                                    |
| `packages/shared`、`packages/rpc`、`packages/client` | 共通プロトコルと型、RPCフレームワーク、AgentクライアントSDK |
| `packages/provider`、`packages/provider-node`        | Provider共通機能とNode.js実装                               |
| `apps/zcode-cli`                                     | Agent CLI、TUI、ランタイム、ツール                          |
| `scripts`、`config`、`third-party`                   | ビルド・保守スクリプト、内蔵設定、第三者ライセンス資料      |

## プロジェクトに関するお知らせ

機能とプロモーションの範囲、保守方針、実行・データに関するリスク、ライセンスと第三者著作権については[NOTICE.md](NOTICE.md)を参照してください。
