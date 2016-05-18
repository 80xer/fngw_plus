!function() {
    chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
        console.log('url:' + msg.url);
        if (msg.action == 'detectURL' && msg.url.indexOf('http://gw.fnguide.com') > -1) {
            console.log('detect url : ' + msg.url + ', run main menu');
            setTimeout(function() {
                setLogo();
            }, 1000);
        }
    });

    function setLogo() {
        console.log('in setLogo');
        var imgPath = chrome.extension.getURL('/img/fngwplus.png');
        var jsInitChecktimer = setInterval (checkForJS_Finish, 111);
        function checkForJS_Finish() {
            if ($('h1>a>img.logo').length > 0) {
                clearInterval(jsInitChecktimer);
                var $plusImg = $('h1>a>img.logo').clone();
                $plusImg.addClass('plusimg').attr('src', imgPath).insertAfter('h1>a>img.logo');
                setTimeout(function() {
                    $plusImg.addClass('show');
                }, 500);

            }
        }
    }
}();
