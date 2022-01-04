let deferredPrompt = null;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(function() {
        console.log("Service Worker registered!");
    });
}

window.addEventListener("beforeinstallprompt", function(event) {
    console.log("prevented on 'beforeinstallprompt'");
    deferredPrompt = event;
    event.preventDefault();
    return false;
})
