var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');

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

/*
function onCardSaveButtonClick(event) {
    // example of caching an item from normal javascript on page
    if ('caches' in window) {
        caches.open('user-requested').then(function(cache) {
            return cache.addAll([
                'https://httpbin.org/get',
                '/src/images/sf-boat.jpg'
            ]);
        });
    }
}
*/

function createCard(data) {
    var cardWrapper = document.createElement('div');
    cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';
    var cardTitle = document.createElement('div');
    cardTitle.className = 'mdl-card__title';
    cardTitle.style.backgroundImage = `url("${data.image}")`;
    cardTitle.style.backgroundSize = 'cover';
    cardTitle.style.height = '180px';
    cardWrapper.appendChild(cardTitle);
    var cardTitleTextElement = document.createElement('h2');
    cardTitleTextElement.className = 'mdl-card__title-text';
    cardTitleTextElement.textContent = data.title;
    cardTitleTextElement.style.color = 'white';
    cardTitle.appendChild(cardTitleTextElement);
    var cardSupportingText = document.createElement('div');
    cardSupportingText.className = 'mdl-card__supporting-text';
    cardSupportingText.textContent = data.location;
    cardSupportingText.style.textAlign = 'center';
    // var cardSaveButton = document.createElement('button');
    // cardSaveButton.textContent = 'Save';
    // cardSaveButton.addEventListener('click', onCardSaveButtonClick)
    // cardSupportingText.appendChild(cardSaveButton);
    cardWrapper.appendChild(cardSupportingText);
    componentHandler.upgradeElement(cardWrapper);
    sharedMomentsArea.appendChild(cardWrapper);
}

function loadPosts(postsData) {
    if (Array.isArray(postsData)) {
        for (let i = 0; i < postsData.length; i++) {
            createCard(postsData[i]);
        }
    } else {
        createCard(postsData);
    }
}

getPost('first-post');

function getPost(postId) {

    let checkCache = Promise.resolve([]);
    if ('indexedDB' in window) {
        checkCache = readData('posts').then(data => {
            return data;
        });
    }

    return checkCache.then(function(data) {
        if ((Array.isArray(data) && data.length > 0) || (!Array.isArray(data) && typeof(data) === 'object' && data !== null)) {
            return data;
        } else {
            return fetch(`http://localhost:5000/data/posts/${postId}`).then(function(res) {
                return res.json();
            });
        }
    }).then(function(data) {
        loadPosts(data);
    });
}
