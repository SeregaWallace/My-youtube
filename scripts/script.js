const keyboard = document.querySelector('.keyboard'),
    keyboardButton = document.querySelector('.search-form__keyboard'),
    closeKeyboard = document.getElementById('close-keyboard'),
    searchInput = document.querySelector('.search-form__input'),
    burger = document.querySelector('.spinner'),
    sidebarMenu = document.querySelector('.sidebarMenu'),
    buttonAuth = document.getElementById('authorize'),
    authWrap = document.querySelector('.auth'),
    dscChannel = document.querySelector('.logo-academy'),
    trends = document.getElementById('yt_trend'),
    like = document.getElementById('like'),
    subscriptions = document.getElementById('subscriptions'),
    searchForm = document.querySelector('.search-form');
    

const API_KEY = 'AIzaSyCCGnLRUQuQK068l8YCWoADYntuYhiUXRE';
const CLIENT_ID = '630060586888-vt5mndnu60nljsm9rggc35fil86lim97.apps.googleusercontent.com';

// keyboard
const toggleKeyboard = () => {
    keyboard.style.top = keyboard.style.top ? '' : '50%';
};

const changeLang = (btns, lang) => {
    const langRu = ['ё', 1, 2, 3, 4, 5, 6, 7, 8, 9, '-', '=', '⬅',
        'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
        'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э',
        'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.',
        'en', ' ',
    ];
    const langEn = ['`', 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, '-', '=', '⬅',
        'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']',
        'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '"',
        'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/',
        'ru', ' ',
    ];

    if (lang === 'en') {
        btns.forEach((elem, i) => {
            elem.textContent = langEn[i];
        })
    } else {
        btns.forEach((elem, i) => {
            elem.textContent = langRu[i];
        })
    }
};

const typing = event => {
    const target = event.target;

    if (target.tagName === 'BUTTON') {
        const allBtns = [...keyboard.querySelectorAll('button')]
            .filter(elem => elem.style.visibility !== 'hidden');

        const keyboardBtn = target.textContent.trim();

        if (keyboardBtn === '⬅') {
            searchInput.value = searchInput.value.slice(0, -1);
        } else if (!keyboardBtn) {
            searchInput.value += ' ';
        } else if (keyboardBtn === 'en' || keyboardBtn === 'ru') {
            changeLang(allBtns, keyboardBtn);
        } else {
            searchInput.value += keyboardBtn;
        }
    }
};

keyboardButton.addEventListener('click', toggleKeyboard);
closeKeyboard.addEventListener('click', toggleKeyboard);
keyboard.addEventListener('click', typing);

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    sidebarMenu.classList.toggle('rollUp');
});

sidebarMenu.addEventListener('click', event => {
    let target = event.target;
    target = target.closest('a[href="#"]');

    if (target) {
        const parentTarget = target.parentElement;
        sidebarMenu.querySelectorAll('li').forEach(elem => {
            if (elem === parentTarget) {
                elem.classList.add('active');
            } else {
                elem.classList.remove('active');
            }
        })
    }
});

// youtubermodal
const youTuber = () => {

    const youTuberItems = document.querySelectorAll('[data-youtuber]');
    const youTuberModal = document.querySelector('.youTuberModal');
    const youtuberContainer = document.getElementById('youtuberContainer');

    const qw = [3840, 2560, 1920, 1280, 854, 640, 426, 256];
    const qh = [2160, 1440, 1080, 720, 480, 360, 240, 144];

    const qVideo = () => {
        const ww = document.documentElement.clientWidth;
        const wh = document.documentElement.clientHeight;

        for (let i = 0; i < qw.length; i++) {
            if (ww > qw[i]) {
                youtuberContainer.querySelector('iframe').style.cssText = `
                width: ${qw[i]}px;
                height: ${qh[i]}px;
                `;
                youtuberContainer.style.cssText = `
                width: ${qw[i]}px;
                height: ${qh[i]}px;
                top: ${(wh - qh[i]) / 2}px;
                left: ${(ww - qw[i]) / 2}px;
                `;

                break;
            }
        }
    };

    youTuberItems.forEach(elem => {
        elem.addEventListener('click', () => {
            // dataset - obj, youtuber - key, 
            const idVideo = elem.dataset.youtuber;
            youTuberModal.style.display = 'block';

            const ytFrame = document.createElement('iframe');
            ytFrame.src = `https://youtube.com/embed/${idVideo}`;
            youtuberContainer.append(ytFrame);

            window.addEventListener('resize', qVideo);

            qVideo();
        })
    })

    youTuberModal.addEventListener('click', () => {
        youTuberModal.style.display = '';
        youtuberContainer.textContent = '';
        window.removeEventListener('resize', qVideo);
    })
}

{
    document.body.insertAdjacentHTML('beforeend', `
        <div class="youTuberModal">
            <div id="youtuberClose">&#215;</div>
            <div id="youtuberContainer"></div>
        </div>
    `);
    youTuber();
}

// oAuth

gapi.load("client:auth2", () => gapi.auth2.init({client_id: CLIENT_ID}));

const authenticate = () => gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
        .then(() => console.log("Sign-in successful"))
        .catch(errorAuth);


const loadClient = () => {
    gapi.client.setApiKey(API_KEY);
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(() => console.log("GAPI client loaded for API"))
        .then(() => authWrap.style.display = 'none')
        .catch(errorAuth);
}

buttonAuth.addEventListener("click", () => {
    authenticate().then(loadClient);
})

const errorAuth = err => {
    console.error(err);
    authWrap.style.display = '';
};

//requests

const request = prmtrs => gapi.client.youtube[prmtrs.requestMethod]
    .list(prmtrs)
    .then(response => response.result.items)
    .then(data => prmtrs.requestMethod === 'subscriptions' ? renderSubs(data) : render(data))
    .catch(err => console.error('error:' + err));

const render = data => {
    const ytWrapper = document.getElementById('yt-wrapper');
    ytWrapper.textContent = '';
    data.forEach(item => {
        try {  
        const { id, id: {videoId}, snippet: {resourceId: {videoId: likedVideoId} = {}, channelTitle, title, thumbnails: {high: {url}}} } = item;
        ytWrapper.innerHTML += `
        <div class="yt" data-youtuber="${likedVideoId || videoId || id}">
            <div class="yt-thumbnail" style="--aspect-ratio:16/9;">
                <img src="${url}" alt="thumbnail" class="yt-thumbnail__img">
            </div>
            <div class="yt-title">${title}</div>
            <div class="yt-channel">${channelTitle}</div>
        </div>
        `;
        } catch(err) {
            console.error(err);
        }
    })

    youTuber();
};

const renderSubs = data => {
    const ytWrapper = document.getElementById('yt-wrapper');
    ytWrapper.textContent = '';
    data.forEach(item => {
        try {
        const { snippet: {resourceId: {channelId}, title, description, thumbnails: {high: {url}}} } = item;
        ytWrapper.innerHTML += `
        <div class="yt" data-youtuber="${channelId}">
            <div class="yt-thumbnail" style="--aspect-ratio:16/9;">
                <img src="${url}" alt="thumbnail" class="yt-thumbnail__img">
            </div>
            <div class="yt-title">${title}</div>
            <div class="yt-channel">${description}</div>
        </div>
        `;
        } catch(err) {
            console.error(err);
        }
    });

    ytWrapper.querySelectorAll('.yt').forEach(item => {
        item.addEventListener('click', () => {
            request({
                requestMethod: 'search',
                part: 'snippet',
                channelId: item.dataset.youtuber,
                order: 'date',
                maxResults: 8,
            })
        })
    })
};

dscChannel.addEventListener('click', () => {
    request({
        requestMethod: 'search',
        part: 'snippet',
        channelId: 'UC05mHIxrD6IG7dc3c1lEaJg',
        order: 'date',
        maxResults: 8,
    })
});

trends.addEventListener('click', () => {
    request({
        requestMethod: 'videos',
        part: 'snippet',
        chart: 'mostPopular',
        maxResults: 8,
        regionCode: 'RU',
    })
});

like.addEventListener('click', () => {
    request({
        requestMethod: 'playlistItems',
        part: 'snippet',
        playlistId: 'PLvQkHJi9WIlIt0GsOISAWZnpC_W943qPf',
        maxResults: 8,
    })
});

subscriptions.addEventListener('click', () => {
    request({
        requestMethod: 'subscriptions',
        part: 'snippet',
        mine: true,
        maxResults: 8,
    })
});

searchForm.addEventListener('submit', event => {
    event.preventDefault();

    const inputValue = searchForm.elements[0].value;

    if (!inputValue) {
        searchForm.style.border = '1px solid red'
        return;
    }

    searchForm.style.border = '';
    request({
        requestMethod: 'search',
        part: 'snippet',
        order: 'relevance',
        maxResults: 8,
        q: inputValue,
    })

    searchForm.elements[0].value = '';
}) 
