function get_source (document_body) {
    console.log('in page');
    return document_body.innerText;
}

chrome.extension.sendMessage({
    action: "getSource",
    source: get_source(document.body)
});