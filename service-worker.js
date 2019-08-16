self.addEventListener('fetch', function(event) {});

window.addEventListener("beforeinstallprompt", function(e) { 
  // log the platforms provided as options in an install prompt 
  console.log(e.platforms); // e.g., ["web", "android", "windows"] 
  alert('動くよ');
  e.userChoice.then(function(outcome) { 
    console.log(outcome); // either "accepted" or "dismissed"
    alert('エラー');
  }, handleError); 
});