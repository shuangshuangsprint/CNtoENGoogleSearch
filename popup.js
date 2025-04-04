document.addEventListener('DOMContentLoaded', function() {
  const inputText = document.getElementById('inputText');
  const languageSelect = document.getElementById('languageSelect');
  const translateSearchButton = document.getElementById('translateSearch');

  // 尝试获取当前页面选中的文本
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: function() {
        return window.getSelection().toString();
      }
    }, (results) => {
      if (results && results[0] && results[0].result) {
        inputText.value = results[0].result;
      }
    });
  });

  translateSearchButton.addEventListener('click', function() {
    const text = inputText.value.trim();
    const targetLang = languageSelect.value;

    if (!text) {
      alert('请输入文本！');
      return;
    }

    // 使用 Google 翻译接口进行翻译
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        let translatedText = '';
        data[0].forEach(item => {
          translatedText += item[0];
        });
        // 打开新标签页执行 Google 搜索
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(translatedText)}`;
        chrome.tabs.create({ url: searchUrl });
      })
      .catch(err => {
        console.error('翻译失败：', err);
        alert('翻译失败，请稍后再试。');
      });
  });
});
