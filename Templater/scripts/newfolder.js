module.exports = async (tp) => {
  const fs = require('fs');
  const path = require('path');

  // Vault の絶対パス（テンプレートから見た相対パスから推定）
  // tp.file.path(true) は「Vault 内の相対パス」を返す
  const currentFileRelPath = tp.file.path(true);
  if (!currentFileRelPath) {
    new Notice("現在編集中のファイルが見つかりません。");
    return;
  }

  // Obsidian の Vault ルートは app.vault.adapter.basePath で取得
  const vaultRoot = tp.app.vault.adapter.basePath;

  // 現在のファイルがあるディレクトリ
  const currentDir = path.dirname(path.join(vaultRoot, currentFileRelPath));

  // 新しいフォルダ名をユーザーに入力
  const newFolderName = await tp.system.prompt("新しいフォルダ名を入力してください:");
  if (!newFolderName) {
    new Notice("フォルダ作成をキャンセルしました。");
    return;
  }

  const newFolderPath = path.join(currentDir, newFolderName);

  if (fs.existsSync(newFolderPath)) {
    new Notice(`フォルダ "${newFolderName}" はすでに存在します。`);
    return;
  }

  // フォルダ作成（親ディレクトリが存在しない場合も作る）
  fs.mkdirSync(newFolderPath, { recursive: true });

  new Notice(`フォルダ "${newFolderName}" を作成しました。`);
};
