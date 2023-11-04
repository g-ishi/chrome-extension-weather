console.log('Content script running...');

// 異なるエクステンション コンポーネント間（バックグラウンド スクリプト、コンテンツ スクリプト、ポップアップ、オプション ページなど）でメッセージを送信するための関数
chrome.runtime.sendMessage('From the content script!', (response) => {
  console.log(response);
});
