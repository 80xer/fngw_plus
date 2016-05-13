!function() {
    chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
        if (msg.action == 'detectURL' && msg.url === 'http://gw.fnguide.com/app/ehr' || msg.url === 'http://gw.fnguide.com/app/ehr/attendance/my') {
            console.log('detect url : ' + msg.url + ', run ehr');
            ehr();
        }

        if (msg.action == 'detectURL' && msg.url.indexOf('http://gw.fnguide.com/app/ehr/attendance/companylist?searchdate=') >= 0) {
            console.log('detect url : ' + msg.url + ', run grid filter');
            ehrCompany();
        }
    });

    function ehrCompany () {
        var jsInitChecktimer = setInterval(checkForJS_FInish, 111);
        console.log('in ehrCompany');
        function checkForJS_FInish () {
            if ($('#deptAttndListWapper_paginate').length > 0) {
                clearInterval(jsInitChecktimer);
                startCompanyList();
            }
        }
    }

    function createDeptBtn () {
        var deptFix = [
            '신사업TFT',
            '데이터팀',
            '리서치팀',
            '펀드평가팀',
            '금융솔루션팀',
            '데이터공학팀',
            '마케팅팀',
            '인덱스팀',
            '경영지원팀',
            '평가사업본부',
            '기관컨설팅팀',
            '금융전략팀'
        ]
        var url = window.location.href.split('?');
        if (url.length < 2) return;
        var querystring = window.location.href.split('?')[1].split('&searchtype')[0];
        querystring = querystring.replace('offset=30', 'offset=100');
        var url = 'http://gw.fnguide.com/api/ehr/attnd/company/record?' + querystring;
        var users;
        $.ajax({
            url: url,
            dataType: 'json'
        }).done(function (response) {
            users = response.data;
            var flags = [], dept = [], l = users.length, i;
            for( i=0; i<l; i++) {
                if( flags[users[i].deptName] || users[i].deptName.replace(/ /g,'') === '' || deptFix.indexOf(users[i].deptName) < 0) continue;
                flags[users[i].deptName] = true;
                dept.push(users[i].deptName);
            }
            dept.sort();
            $('#dept_btns').remove();
            var $div = $('<div id="dept_btns" class="fngw_plus_btn_wrapper">');
            for (var i = 0; i < dept.length; i++) {
                $div.append('<span class="btn_tool_depts fngw_plus_btn">' + dept[i] + '</span>');
            }
            // $div.insertBefore('#deptAttndListWapper');
            $div.appendTo('#content');

            $('span.btn_tool_depts').click(function(){
                var sTypeSelector, deptVal, sKeywordSelector, sBtnSelector;
                if ($('#attnd_tab>ul>li.on.first.daily').length > 0) {
                    sTypeSelector = '#searchTypes';
                    deptVal = 'deptName';
                    sKeywordSelector = '#searchKeyword';
                } else {
                    sTypeSelector = '#searchtype';
                    deptVal = 'dept';
                    sKeywordSelector = '#keyword';
                }
                sBtnSelector = '#searchBtn';
                console.log(sTypeSelector, sKeywordSelector, sBtnSelector);
                $(sTypeSelector).val(deptVal);
                $(sKeywordSelector).val($(this).text());
                $(sBtnSelector)[0].click();
            });

        }).fail(function (jqXHR, textStatus) {
            console.log( "Request failed: " + jqXHR + ', ' + textStatus );
        }).complete(function () {
        });
    }

    function getUrlParse() {
        var url = window.location.href.split('?')[0];
        var querystring = window.location.href.split('?')[1];
        var params = querystring && querystring.split('&') || [];
        var objParams = {}
        for (var i = 0; i < params.length; i++) {
            objParams[params[i].split('=')[0]] = params[i].split('=')[1];
        }
        return {
            url: url,
            querystring: querystring,
            objParams: objParams
        }
    }

    function createMenuPlus() {
        if ($('#content .content_top>div').length > 0) {
            $('.fngw_plus_btn_wrapper').remove();
            var $plusmenu = $('<div class="fngw_plus_btn_wrapper"><span class="companylist_fngw_plus fngw_plus_btn">PLUS</span></div>');
            $plusmenu.on('click', '.fngw_plus_btn', function() {
                var querystring = window.location.href.split('?')[1].split('&searchtype')[0].replace('offset=30', 'offset=100');
                var url = 'http://gw.fnguide.com/api/ehr/attnd/company/record?' + querystring;
                $('#deptAttndListWapper').css('visibility', 'hidden');
                $('#deptAttndListWapper_processing').css('visibility', 'visible');

                $.ajax({
                    url: url,
                    dataType: 'json'
                }).done(function (response) {
                    users = response.data;
                    tabledata = [];
                    $table = $('<table class="type_normal tb_agenda tb_attend dataTable" id="fngw_plus_datatable" style="width: 100%; margin-bottom: 0px; visibility: hidden;">');
                    $table.insertBefore($('.table_search.table_new_search'));
                    users.map(function(data, n){
                        tabledata.push([
                            data.userName || '',
                            data.deptName || '',
                            data.clockInTime || '',
                            data.clockInIp || '',
                            data.clockOutTime || '',
                            data.clockOutIp || '',
                            data.workingTime || '',
                            data.statuses[0] && data.statuses[0].memo || ''
                        ])
                    });

                    $table.DataTable({
                        data: tabledata,
                        columns: [
                            { title: "부서원" },
                            { title: "부서명" },
                            { title: "출근" },
                            { title: "IP" },
                            { title: "퇴근" },
                            { title: "IP" },
                            { title: "근무시간" },
                            { title: "상태" }
                        ]
                    });

                    $('#deptAttndListWapper_wrapper').remove();
                    $table.css('visibility', 'visible');
                }).fail(function (jqXHR, textStatus) {
                    console.log( "Request failed: " + jqXHR + ', ' + textStatus );
                }).complete(function () {
                });
            })
            $plusmenu.appendTo('#content');
        }
    }

    function createBtns() {
        var location = getUrlParse();
        console.log(location.objParams.offset);
        if (location.objParams.offset && location.objParams.offset < 100) {
            console.log($('#deptAttndListWapper_length select').eq(0).val());
            // setTimeout(function(){
                // $('select', '.dataTables_length').val(100).change();
                // window.location.href = location.url + '?' + location.querystring.replace('offset=', 'offset=100&'); // $('#deptAttndListWapper_length select').trigger('change');
            // }, 2000);
            // $('#deptAttndListWapper_length select option[value="100"]')[0].click();
        } else {
            $('#deptAttndListWapper').css('visibility', 'visible');
        }
    }

    function startCompanyList() {
        $('body').on('DOMNodeRemoved', '#content .go_body', function(){
            run();
        });

        function run() {
            var jsInitChecktimer = setInterval (checkForList_Finish, 111);
            function checkForList_Finish () {
                if ($('#content .go_body').length > 0) {
                    clearInterval (jsInitChecktimer);
                    if ($('#dept_btns').length <= 0) {
                        console.log('in ififif');
                        createDeptBtn();
                        // createBtns();
                        // createMenuPlus();
                    }
                }
            }
        }
        run();
    }

    function ehr () {
        // console.log('in ehr');
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

        $('body').on('DOMNodeRemoved', '#attndMyList', function(){
            reStart();
        });

        function reStart() {
            // console.log('in restart');
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
            $('#attndMyList tbody tr').each(function(idx, tr) {
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
