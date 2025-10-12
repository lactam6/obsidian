module.exports = (tag = "sup") => {
    function wrapSelection(tag, editor) {
        const selection = editor.getSelection();
        const regex = new RegExp(`<${tag}>(.*?)<\/${tag}>`);
        const matches = regex.exec(selection);
        if (matches) {
            const debracketedSelection = matches[1];
            editor.replaceSelection(debracketedSelection);
            return `Removed <${tag}> tag`;
        } else {
            const wrappedSelection = `<${tag}>${selection}</${tag}>`;
            editor.replaceSelection(wrappedSelection);
            return `Wrapped with <${tag}>`;
        }
    }

    const editor = app.workspace.activeLeaf.view.editor;
    wrapSelection(tag, editor);
    return "";
};
