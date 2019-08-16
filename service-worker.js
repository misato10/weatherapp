self.addEventListener('fetch', function(event) {});

var deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();      // デフォルト動作をキャンセル
  deferredPrompt = event;   // あとで利用するのでイベントオブジェクトをとっておく
  // ポップアップを開く
  return false;
  
});
window.onload = function() {
  // 実行したい処理
  if(deferredPrompt !== undefined) {
    // インストールプロンプト表示
    deferredPrompt.prompt();
    deferredPrompt.userChoice
      .then(function(choiceResult) {
      // キャンセルされた場合
      if(choiceResult.outcome == 'dismissed') {
        console.log('User cancelled home screen install');
      } else {
        // インストールされた場合
        console.log('User added to home screen');
      }
      deferredPrompt = null;
    });
  }
