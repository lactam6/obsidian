module.exports = async (tp) => {
  const app = tp.app;
  const vault = app.vault;
  const file = app.workspace.getActiveFile();
  let basePath = vault.getRoot().path; // デフォルト: ルート
  let folderPath;

  // 1️⃣ アクティブファイルがある場合
  if (file) {
    const parentFolder = file.parent;
    if (parentFolder) {
      basePath = parentFolder.path;
    }
  } else {
    // 2️⃣ ファイラーでフォルダを選択している場合
    const activeLeaf = app.workspace.activeLeaf;
    const explorer = app.workspace.getLeavesOfType("file-explorer")[0];
    if (explorer?.view?.fileItems) {
      const selectedItems = Object.values(explorer.view.fileItems)
        .filter(item => item?.file?.path && item.el?.classList.contains("is-selected"));
      if (selectedItems.length > 0) {
        const selected = selectedItems[0].file;
        if (selected instanceof window.obsidian.TFolder) {
          basePath = selected.path;
        } else if (selected.parent) {
          basePath = selected.parent.path;
        }
      }
    }
  }

  // 3️⃣ 新しいフォルダ名をユーザー入力
  const newFolderName = await tp.system.prompt("新しいフォルダ名を入力してください:");
  if (!newFolderName) {
    new Notice("キャンセルされました");
    return;
  }

  // 4️⃣ 作成パスを決定
  folderPath = `${basePath}/${newFolderName}`;

  // 5️⃣ すでに存在していないかチェックして作成
  const normalized = folderPath.replace(/\\/g, "/");
  if (!(await vault.adapter.exists(normalized))) {
    await vault.createFolder(normalized);
    new Notice(`✅ フォルダを作成しました: ${normalized}`);
  } else {
    new Notice(`⚠️ フォルダは既に存在します: ${normalized}`);
  }
};
