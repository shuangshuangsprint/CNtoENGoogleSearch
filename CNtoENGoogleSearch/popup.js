document.getElementById('searchButton').addEventListener('click', function() {
  let inputText = document.getElementById('inputText').value.trim();
  
  if(inputText) {
    // 使用谷歌翻译API将中文翻译为英文
    let translateUrl = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=' + encodeURIComponent(inputText);
    
    fetch(translateUrl)
      .then(response => response.json())
      .then(data => {
        let translatedText = data[0][0][0];
        // 构建谷歌搜索URL
        let searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(translatedText);
        // 在新标签页中打开搜索结果
        chrome.tabs.create({ url: searchUrl });
      })
      .catch(error => {
        console.error('翻译出错：', error);
        alert('抱歉，翻译失败，请稍后重试。');
      });
  } else {
    alert('请输入搜索内容！');
  }
});
