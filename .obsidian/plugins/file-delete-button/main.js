// main.js
module.exports = class FileDeleteButtonPlugin {
	onload() {
		console.log("File Delete Button Plugin loaded");

		this.registerEvent(
			this.app.workspace.on('file-menu', (menu, file, source) => {
				// ファイルメニュー右クリックに削除ボタンを追加
				menu.addItem((item) => {
					item
						.setTitle("🗑 削除")
						.setIcon("trash")
						.onClick(async () => {
							const confirmed = await this.app.workspace.confirm(
								`${file.name} を削除しますか？`
							);
							if (confirmed) {
								await this.app.vault.trashFile(file);
								new Notice(`${file.name} を削除しました`);
							}
						});
				});
			})
		);

		// ファイルエクスプローラーの表示監視
		this.injectDeleteButtons();
		this.registerDomEvent(document, "click", (evt) => {
			// 再描画時にボタンを再挿入
			this.injectDeleteButtons();
		});
	}

	onunload() {
		console.log("File Delete Button Plugin unloaded");
	}

	injectDeleteButtons() {
		const fileItems = document.querySelectorAll(".nav-file-title-content");
		fileItems.forEach((item) => {
			if (item.querySelector(".delete-icon")) return; // 重複防止

			const icon = document.createElement("span");
			icon.textContent = "🗑";
			icon.className = "delete-icon";
			icon.style.marginLeft = "6px";
			icon.style.cursor = "pointer";

			icon.addEventListener("click", async (e) => {
				e.stopPropagation();
				const filePath = item.closest(".nav-file").getAttribute("data-path");
				const file = this.app.vault.getAbstractFileByPath(filePath);
				if (!file) return;

				const confirmed = confirm(`${file.name} を削除しますか？`);
				if (confirmed) {
					await this.app.vault.trashFile(file);
					new Notice(`${file.name} を削除しました`);
				}
			});

			item.appendChild(icon);
		});
	}
};
