
self.addEventListener('fetch', function(event) {});

var deferredPrompt;

var btnSave = document.getElementById('btnSave');	


window.addEventListener('beforeinstallprompt', (event) => {
  console.log('ServiceWorker登録成功です');
  event.preventDefault();      // デフォルト動作をキャンセル
  deferredPrompt = event;   // あとで利用するのでイベントオブジェクトをとっておく
  // ポップアップを開く
  showInstallPromotion();
  return false;
});

btnSave.addEventListener("click", function () {
  console.log('クリックしたよ')
  if(deferredPrompt !== undefined) {
    // The user has had a postive interaction with our app and Chrome
    // has tried to prompt previously, so let's show the prompt.
    deferredPrompt.prompt();

    // Follow what the user has done with the prompt.
    deferredPrompt.userChoice.then(function(choiceResult) {

      console.log(choiceResult.outcome);

      if(choiceResult.outcome == 'dismissed') {
        console.log('User cancelled home screen install');
      }
      else {
        console.log('User added to home screen');
      }

      // We no longer need the prompt.  Clear it up.
      deferredPrompt = null;
    });
  }
}, false);


