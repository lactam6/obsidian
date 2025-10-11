import { Plugin, Notice } from "obsidian";

export default class FileDeleteButtonPlugin extends Plugin {
	async onload() {
		console.log("File Delete Button Plugin loaded");

		// ファイル右クリックメニューに削除項目を追加
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				menu.addItem((item) => {
					item
						.setTitle("🗑 削除")
						.setIcon("trash")
						.onClick(async () => {
							const confirmed = confirm(`${file.name} を削除しますか？`);
							if (confirmed) {
								await this.app.vault.trashFile(file);
								new Notice(`${file.name} を削除しました`);
							}
						});
				});
			})
		);

		// ファイルエクスプローラー内に削除ボタンを挿入
		this.injectDeleteButtons();
		this.registerDomEvent(document, "click", () => {
			this.injectDeleteButtons();
		});
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
				const filePath = item.closest(".nav-file")?.getAttribute("data-path");
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

	onunload() {
		console.log("File Delete Button Plugin unloaded");
	}
}
