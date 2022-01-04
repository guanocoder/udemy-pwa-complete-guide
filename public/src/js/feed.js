var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');

function openCreatePostModal() {
  createPostArea.style.display = 'block';

  if (deferredPrompt) {
    console.log('found deferred prompt, now firing the event');
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function(choiceResult) {
        console.log("user picked", choiceResult);
        if (choiceResult.outcome === 'dismissed') {
            console.log("User dismissed app installation");
        } else {
            console.log("User added app to home screen");
        }
    });
    deferredPrompt = null;
  } else {
    console.log('did not find deferred prompt event');
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);
