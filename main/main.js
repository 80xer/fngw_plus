!function() {
    chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
        if (msg.action == 'detectURL') {
            if(msg.url === 'http://gw.fnguide.com/app/home') {
                console.log('detect url : ' + msg.url + ', run home');
                $.ajax({
                    url: 'https://docs.google.com/spreadsheets/d/1-abxTWAXe3ncueigz-b9wHCNl32ayNmsBR9Wn-I3aSo/pubhtml?gid=1022397995&single=true'
                    // url: 'https://docs.google.com/spreadsheets/d/1nHIKvN4rrg45iYKpJDXAKhHUO63LzenD-YiO0J5WwUQ/pubhtml'
                }).done(function(data){
                    var index = 0;
                    var date = [];
                    var $dutyDoc = $($.parseHTML(data));
                    var jsInitChecktimer = setInterval (checkForJS_Finish, 111);
                    function checkForJS_Finish() {
                        if ($('.profile .info .name').length > 0) {
                            clearInterval(jsInitChecktimer);
                            var userName = $('.profile .info .name').text();
                            var $findName = $('td:contains("' + userName + '")', $dutyDoc);

                            if ($findName.length <= 0) return;

                            for (var i = 0; i < $findName.length; i++) {
                                var $nameCell = $($findName[i]);
                                var $prev = $nameCell.prev();
                                var idx = 0;
                                while($prev.is(':first-child') !== true) {
                                    $prev = $prev.prev();
                                    idx++;
                                }

                                if (idx > 7) {
                                    if ($nameCell.prev().prev().text().trim().length >= 8){
                                        date.push($nameCell.prev().prev().text().trim().replace(/ /g,''));
                                    } else {
                                        date.push($nameCell.prev().prev().prev().text().trim().replace(/ /g,''));
                                    }
                                }
                            }
                            setDutyDate(date);
                        }
                    }
                });
            }

            if(msg.url.indexOf('http://gw.fnguide.com') > -1) {
                console.log('detect url : ' + msg.url + ', run main menu --');
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

                $('.dutyWrap').remove();

                var curDate = $('.current_time_wrap .date').text().split(' ');
                var curYear = curDate[0].match(/\d+/)[0];
                var curMonth = curDate[1].match(/\d+/)[0];
                var curDay = curDate[2].match(/\d+/)[0];
                var cDate = new Date(curYear, curMonth-1, curDay);

                for (var i = 0; i < date.length; i++) {
                    var dutyDate = date[i].split('.');
                    var dutyYear = dutyDate[0].match(/\d+/)[0];
                    var dutyMonth = dutyDate[1].match(/\d+/)[0];
                    var dutyDay = dutyDate[2].match(/\d+/)[0];
                    var dDate = new Date(dutyYear, dutyMonth-1, dutyDay);
                    var diffDate = daydiff(cDate, dDate);
                    var dutyNotice = dutyYear + '년 ' + dutyMonth + '월 ' + dutyDay + '일 ' + getDayName(dDate) + ' 당직';
                    var colorClass = '';
                    var termBlink = 500;
                    var dayNotice = '';
                    if (diffDate < 0) {
                        colorClass = 'past';
                    } else if (diffDate === 0){
                        dayNotice = '오늘 ';
                        colorClass = 'today';
                    } else if (diffDate === 1) {
                        dayNotice = '내일 ';
                        colorClass = 'tomorrow';
                    }

                    $dutyDiv = $('<div class="dutyWrap ' + colorClass + '"><span class="dayNotice">' + dayNotice + '</span><span class="dutyNotice">' + dutyNotice + '</span></div>');
                    $dutyDiv.insertAfter('.current_time_wrap');

                    if (diffDate === 0 ) {
                        (function blink() {
                            $('.dutyWrap.today .dayNotice').fadeOut(termBlink).fadeIn(termBlink, blink);
                        })();
                    }
                }
            }
        }

        function getDayName(date) {
            var weekday = new Array(7);
            weekday[0]=  "일";
            weekday[1] = "월";
            weekday[2] = "화";
            weekday[3] = "수";
            weekday[4] = "목";
            weekday[5] = "금";
            weekday[6] = "토";

            return weekday[date.getDay()];
        }

        function daydiff(first, second) {
            return Math.round((second-first)/(1000*60*60*24));
        }
    }

    function setLogo() {
        $('.logo.plusimg').remove();
        var imgPath = chrome.extension.getURL('/img/fngwplus.png');
        var jsInitChecktimer = setInterval (checkForJS_Finish, 111);
        function checkForJS_Finish() {
            if ($('h1>a>img.logo').length > 0 && $('h1>a>img.logo.plusimg').length == 0) {
                clearInterval(jsInitChecktimer);
                var $plusImg = $('<img class="logo plusimg" src="' + imgPath + '">');
                // console.log('add logo');
                $plusImg.insertAfter('h1>a>img.logo');
                setTimeout(function() {
                    $plusImg.addClass('show');
                }, 500);

            }
        }
    }
}();
