function wrapSelection(tag, editor) {
    const selection = editor.getSelection();
    const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`);
    const matches = regex.exec(selection);
    if (matches) {
        const debracketedSelection = matches[1];
        editor.replaceSelection(debracketedSelection);
    } else {
        const wrappedSelection = `<${tag}>${selection}</${tag}>`;
        editor.replaceSelection(wrappedSelection);
    }
}

module.exports = (tag = "sup") => {
    const editor = app.workspace.activeLeaf.view.editor;
    wrapSelection(tag, editor);
};
