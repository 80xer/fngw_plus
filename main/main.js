!function() {
    chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
        console.log('url:' + msg.url);
        if (msg.action == 'detectURL') {
            if(msg.url === 'http://gw.fnguide.com/app/home') {
                console.log('detect url : ' + msg.url + ', run home');
                $.ajax({
                    url: 'https://docs.google.com/spreadsheets/d/1-abxTWAXe3ncueigz-b9wHCNl32ayNmsBR9Wn-I3aSo/pubhtml?gid=1022397995&single=true'
                }).done(function(data){
                    var index = 0;
                    var date = '';
                    var $dutyDoc = $($.parseHTML(data));
                    var jsInitChecktimer = setInterval (checkForJS_Finish, 111);
                    function checkForJS_Finish() {
                        if ($('.profile .info .name').length > 0) {
                            clearInterval(jsInitChecktimer);
                            var userName = $('.profile .info .name').text();
                            var $findName = $('td:contains("' + userName + '")', $dutyDoc);

                            if ($findName.length <= 0) return;

                            $findName = $($findName[$findName.length-1]);
                            var $parentTr = $findName.parent();
                            $parentTr.find('td').each(function(idx, td) {
                                if ($(td).text() === $findName.text()) {
                                    index = idx;
                                }
                            });

                            if (index <= 7) return;

                            if ($findName.prev().prev().text().trim().length >= 8){
                                date = $findName.prev().prev().text().trim().replace(/ /g,'');
                            } else {
                                date = $findName.prev().prev().prev().text().trim().replace(/ /g,'');
                            }
                            setDutyDate(date);
                        }
                    }
                });
            }

            if(msg.url.indexOf('http://gw.fnguide.com') > -1) {
                console.log('detect url : ' + msg.url + ', run main menu');
                setTimeout(function() {
                    setLogo();
                }, 1000);
            }
        }
    });

    function setDutyDate(date) {
        var jsInitChecktimer = setInterval (checkForJS_Finish, 111);
        function checkForJS_Finish() {
            if ($('.current_time_wrap .date').length > 0) {
                clearInterval(jsInitChecktimer);

                var curDate = $('.current_time_wrap .date').text().split(' ');
                var curYear = curDate[0].match(/\d+/)[0];
                var curMonth = curDate[1].match(/\d+/)[0];
                var curDay = curDate[2].match(/\d+/)[0];

                var dutyDate = date.split('.');
                var dutyYear = dutyDate[0].match(/\d+/)[0];
                var dutyMonth = dutyDate[1].match(/\d+/)[0];
                var dutyDay = dutyDate[2].match(/\d+/)[0];

                var cDate = new Date(curYear, curMonth-1, curDay);
                var dDate = new Date(dutyYear, dutyMonth-1, dutyDay);

                var diffDate = daydiff(cDate, dDate);
                var dutyNotice = '';
                var colorClass = '';
                var termBlink = 500;
                if (diffDate < 0) {
                    dutyNotice = dutyYear + '년 ' + dutyMonth + '월 ' + dutyDay + '일 ' + getDayName(dDate) + '<br>당직이었습니다.';
                    colorClass = 'past';
                } else if (diffDate === 0){
                    dutyNotice = '오늘 당직입니다.';
                    colorClass = 'today';
                } else if (diffDate === 1) {
                    dutyNotice = '내일 당직입니다.';
                    colorClass = 'tomorrow';
                } else {
                    dutyNotice = dutyYear + '년 ' + dutyMonth + '월 ' + dutyDay + '일 ' + getDayName(dDate) + '<br>당직입니다.';
                }
                $('.dutyWrap').remove();
                $dutyDiv = $('<div class="dutyWrap"><span class="dutyNotice ' + colorClass + '">' + dutyNotice + '</span></div>');
                $dutyDiv.insertAfter('.current_time_wrap');

                if (diffDate === 0 || diffDate === 1) {
                    termBlink = (diffDate === 1)?800:termBlink;
                    (function blink() {
                        $dutyDiv.fadeOut(termBlink).fadeIn(termBlink, blink);
                    })();
                }
            }
        }

        function getDayName(date) {
            var weekday = new Array(7);
            weekday[0]=  "일요일";
            weekday[1] = "월요일";
            weekday[2] = "화요일";
            weekday[3] = "수요일";
            weekday[4] = "목요일";
            weekday[5] = "금요일";
            weekday[6] = "토요일";

            return weekday[date.getDay()];
        }

        function daydiff(first, second) {
            return Math.round((second-first)/(1000*60*60*24));
        }
    }

    function setLogo() {
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
