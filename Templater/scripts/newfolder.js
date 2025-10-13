module.exports = async (tp) => {
  const fs = require('fs');
  const path = require('path');

  // 現在開いているファイルのパスを取得
  const currentFilePath = tp.file.path(true);
  if (!currentFilePath) {
    new Notice("現在編集中のファイルが見つかりません。");
    return;
  }

  // 現在のフォルダパスを取得
  const currentDir = path.dirname(currentFilePath);

  // 新しいフォルダ名をユーザーに入力させる
  const newFolderName = await tp.system.prompt("新しいフォルダ名を入力してください:");
  if (!newFolderName) {
    new Notice("フォルダ作成をキャンセルしました。");
    return;
  }

  // 作成するフォルダのフルパス
  const newFolderPath = path.join(currentDir, newFolderName);

  // すでに存在する場合は警告
  if (fs.existsSync(newFolderPath)) {
    new Notice(`フォルダ "${newFolderName}" はすでに存在します。`);
    return;
  }

  // フォルダ作成
  fs.mkdirSync(newFolderPath);

  new Notice(`フォルダ "${newFolderName}" を作成しました。`);
};
