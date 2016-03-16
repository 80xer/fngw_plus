!function() {
    window.addEventListener ("load", ehr, false);

    function ehr (evt) {
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

        // 유저가 년월 수정시 재실행.
        $('body').on('DOMNodeRemoved', '#attndMyList', function() {
            createCalendar();
        });

        function loadHTML() {
            $.get(chrome.extension.getURL('ehr/cal.html'), function(data) {
                calHtml = data;
                createCalendar();
            });
        }

        function createCalendar(){
            $($.parseHTML(calHtml)).appendTo('#attndToolbar');
            $('#attndMyList').addClass('toggleView');
            var cal = new CalendarView();
        }

        function CalendarView() {
            this.btn = '#btnCalendarView';
            this.show = false;

            $(this.btn).on('click', this.toggle);

            var cal = new Calendar();
            $('.calendar-table').remove();
            cal.generateHTML();
            $($.parseHTML(cal.getHTML())).appendTo('.go_body');
        }

        CalendarView.prototype = (function(){
            function toggleCalendar() {
                this.show = !this.show;
                $('.toggleView').toggle();
                if(this.show) {
                    $('#btnCalendarView span').text('그리드 보기');
                } else {
                    $('#btnCalendarView span').text('캘린더 보기');
                }
            }
            return {
                toggle: toggleCalendar
            }
        }());

        loadHTML();
    }
}();