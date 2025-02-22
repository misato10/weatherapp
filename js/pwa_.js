if('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('/service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }
  
  // Code to handle install prompt on desktop
  
  let deferredPrompt;
  const addArea = document.querySelector('.addArea');
  const addBtn = document.querySelector('.addButton');
  const closeBtn = document.querySelector('.closeButton');
  addArea.style.display = 'none';
  
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    addArea.style.display = 'block';
  
    addBtn.addEventListener('click', (e) => {
      // hide our user interface that shows our A2HS button
      aaddArea.style.display = 'none';
      // Show the prompt
      
    closeBtn.addEventListener('click', (e) => {
      addArea.style.display = 'none';
    });
    
  });
