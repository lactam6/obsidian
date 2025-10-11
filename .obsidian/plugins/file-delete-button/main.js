const { Plugin } = require("obsidian");

module.exports = class FileDeleteButtonPlugin extends Plugin {
	onload() {
		console.log("File Delete Button Plugin loaded");

		this.registerDomEvent(document, "mouseover", (event) => {
			const target = event.target.closest(".nav-file-title-content");
			if (target && !target.querySelector(".delete-button")) {
				const button = document.createElement("button");
				button.textContent = "🗑";
				button.classList.add("delete-button");
				button.style.marginLeft = "8px";
				button.style.cursor = "pointer";
				button.style.border = "none";
				button.style.background = "transparent";
				button.style.color = "var(--text-muted)";
				button.style.fontSize = "14px";

				target.appendChild(button);

				button.addEventListener("click", async (e) => {
					e.stopPropagation();
					const fileEl = target.closest(".nav-file");
					if (!fileEl) return;

					const path = fileEl.getAttribute("data-path");
					if (!path) return;

					const confirmed = confirm(`Delete "${path}"?`);
					if (confirmed) {
						try {
							await this.app.vault.trash(this.app.vault.getAbstractFileByPath(path), true);
							new Notice(`Deleted: ${path}`);
						} catch (err) {
							console.error(err);
							new Notice(`Failed to delete ${path}`);
						}
					}
				});
			}
		});
	}

	onunload() {
		console.log("File Delete Button Plugin unloaded");
	}
};
