!function() {
    chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
        if (msg.action == 'detectURL' && msg.url.indexOf('http://gw.fnguide.com/app/task/folder/160/task') > -1) {
            console.log('detect url : ' + msg.url + ', run dev team menu');
            if ($('.wbsWrap').length > 0) {
                return;
            }
            run();
        }
    });

    var showWBS = false;

    function run () {
        var jsInitChecktimer = setInterval (checkForJS_Finish, 111);

        function checkForJS_Finish () {
            if ($("#content .content_top>div").length > 0) {
                clearInterval (jsInitChecktimer);
                setDevTeamMenu();
            }
        }
    }

    function setDevTeamMenu () {
        createBtnWBS();
        createBtnFilters();
    }

    function createBtnFilters() {
        $btnWrap = $('<div class="filters fngw_plus_btn_wrapper"></div>');
        $btnWrap.append('<span class="fngw_plus_btn all active">전체</span>');
        $btnWrap.append('<span class="fngw_plus_btn">개발</span>');
        $btnWrap.append('<span class="fngw_plus_btn">기획</span>');
        $btnWrap.append('<span class="fngw_plus_btn">디자인</span>');
        $btnWrap.append('<span class="fngw_plus_btn">퍼블리싱</span>');
        $btnWrap.append('<span class="fngw_plus_btn">공통</span>');
        $btnWrap.appendTo('.critical.custom_header');

        $('.filters.fngw_plus_btn_wrapper .fngw_plus_btn').not('.all').on('click', function() {
            var filterString = $(this).text();
            $('#searchTypes').val('TITLE');
            $('#searchKeyword').val($(this).text());
            $('#searchBtn').click();
            setActiveFilter();
        });
        $('.filters.fngw_plus_btn_wrapper .fngw_plus_btn.all').on('click', function() {
            $('#sideFolderList li.task[data-item="companyFolder160"] p').click();
        });

        function setActiveFilter() {
            $(".filters.fngw_plus_btn_wrapper .fngw_plus_btn").removeClass('active');
            $(".filters.fngw_plus_btn_wrapper .fngw_plus_btn").filter(function() { return ($(this).text() === $('#searchKeyword').val()) }).addClass('active');
        }
    }

    function insertWBS() {
        if ($('.wbsWrap').length > 0) {
            return;
        }
        $wbsWrap = $('<div class="wbsWrap"></div>');
        $wbsWrap.hide();
        $wbsIfram = $('<iframe src="https://docs.google.com/spreadsheets/d/1CkyanuO1itSFlM4xwzZl2kOks9CdgD82_44oehk2Ue8/edit?usp=sharing" width="100%" height="' + ($(window).height() - $('header.go_header').height() - $('header.content_top').outerHeight() - 20) + 'px"></iframe>');
        $wbsWrap.append($wbsIfram).appendTo('#160.go_renew');
    }

    function createBtnWBS() {
        $('.toggleWbs').remove();
        $btnToggleWbs = $('<div class="toggleWbs fngw_plus_btn_wrapper"><span class="fngw_plus_btn">WBS 보기</span></div>');
        $btnToggleWbs.appendTo('#content .content_top');
        $btnToggleWbs.click(function() {
            toggleWbs();
        });
    }

    function toggleWbs() {
        if (showWBS) {
            $('#content .content_page').show();
            $('.wbsWrap').hide();
            $('.toggleWbs .fngw_plus_btn').text('WBS 보기');

        } else {
            insertWBS();
            $('#content .content_page').hide();
            $('.wbsWrap').show();
            $('.toggleWbs .fngw_plus_btn').text('업무 보기');
        }
        showWBS = !showWBS;
    }
}();
