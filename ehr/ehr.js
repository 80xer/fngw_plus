!function() {
    chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
        if (msg.action == 'detectURL' && msg.url === 'http://gw.fnguide.com/app/ehr') {
            console.log('detect url : ' + msg.url + ', run ehr');
            ehr();
        }
    });

    function ehr () {
        console.log('in ehr');
        var jsInitChecktimer = setInterval (checkForJS_Finish, 111);

        function checkForJS_Finish () {
            if ($("#attndToolbar").length > 0) {
                clearInterval (jsInitChecktimer);
                start();
            }
        }
    }

    function start() {
        var calHtml;
        var showing = false;
        // 유저가 년월 수정시 재실행.
        // $(document).on('click', '#prevMonth, #nextMonth, #todayMonth, .ui-datepicker-calendar td a', function(){
        //     reStart();
        // });

        $('body').on('DOMNodeRemoved', '#attndMyList', function(){
            reStart();
        });

        function reStart() {
            var jsInitChecktimer = setInterval (checkForList_Finish, 111);
            function checkForList_Finish () {
                if ($('#attndMyList').length > 0) {
                    clearInterval (jsInitChecktimer);
                    var cal = createCalendar();
                    showing = !showing
                    cal.toggle();
                }
            }
        }

        function loadHTML() {
            $.get(chrome.extension.getURL('ehr/cal.html'), function(data) {
                calHtml = data;
                var cal = createCalendar();
                showing = true;
                cal.toggle();
            });
        }

        function createCalendar(){
            $($.parseHTML(calHtml)).appendTo('#attndToolbar');
            $('#attndMyList').addClass('toggleView');
            var cal = new CalendarView();
            return cal;
        }

        function CalendarView() {
            this.btn = '#btnCalendarView';
            $(document).off('click', this.btn);
            $(document).on('click', this.btn, this.toggle);
            var curDate = $('.current_date .date').text().replace('.','');
            var year = parseInt(curDate.substring(0,4),10);
            var month = parseInt(curDate.substring(4,6),10) - 1;
            var cal = new Calendar(month, year);
            $('.calendar-table').remove();
            cal.generateHTML();
            $($.parseHTML(cal.getHTML())).appendTo('.content_page .go_body');
            var $calDays = $('td.calendar-day:not(:empty)');
            var inTime, outTime, workTime, state;
            $('#attndMyList tr.attend_none').each(function(idx, tr) {
                if (!$(tr).hasClass('holiday')) {
                    inTime = $('<div class="intime' + $(tr).children().eq(1).attr('class') + '">' + $(tr).children().eq(1).text().trim() + '</div>');
                    outTime = $('<div class="outtime">' + $(tr).children().eq(2).text().trim() + '</div>');
                    workTime = $('<div class="worktime">' + ($(tr).children().eq(3).text().trim()||'-') + '</div>');
                    state = $('<div class="state">' + ($(tr).children().eq(4).text().trim()||'-') + '</div>');
                    $calDays.eq(idx).append(inTime).append(outTime).append(workTime).append(state);
                }
            })
        }

        CalendarView.prototype.toggle = function() {
            console.log('in toggle', showing);
            if(showing) {
                $('#attndMyList').hide();
                $('.calendar-table ').show();
                $('#btnCalendarView span').text('리스트 보기');
            } else {
                $('#attndMyList').show();
                $('.calendar-table ').hide();
                $('#btnCalendarView span').text('캘린더 보기');
            }
            showing = !showing;
        }

        loadHTML();
    }
}();
