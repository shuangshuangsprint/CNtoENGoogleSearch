// background.js

// 当扩展安装时，创建右键菜单
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translate-search",
    title: "翻译并搜索",
    contexts: ["selection"]
  });
});

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "translate-search") {
    const selectedText = info.selectionText;
    const targetLanguage = await getUserLanguage();
    const translatedText = await translateText(selectedText, targetLanguage);
    openGoogleSearch(translatedText);
  }
});

// 获取用户选择的目标语言
async function getUserLanguage() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ language: "en" }, (items) => {
      resolve(items.language);
    });
  });
}

// 使用翻译API翻译文本
async function translateText(text, targetLang) {
  const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${targetLang}`);
  const data = await response.json();
  return data.responseData.translatedText;
}

// 打开新的标签页，执行Google搜索
function openGoogleSearch(query) {
  chrome.tabs.create({ url: `https://www.google.com/search?q=${encodeURIComponent(query)}` });
}
