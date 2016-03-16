(function(window){
    cal_days_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    cal_months_labels = ['January', 'February', 'March', 'April',
                         'May', 'June', 'July', 'August', 'September',
                         'October', 'November', 'December'];

    cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    cal_current_date = new Date(); 

    function Calendar(month, year) {
        console.log('new Calendar');
        this.month = (isNaN(month) || month == null) ? cal_current_date.getMonth() : month;
        this.year  = (isNaN(year) || year == null) ? cal_current_date.getFullYear() : year;
        this.html = '';
    }

    Calendar.prototype.generateHTML = function(){
        console.log('generateHTML');
        var firstDay = new Date(this.year, this.month, 1);
        var startingDay = firstDay.getDay();

        var monthLength = cal_days_in_month[this.month];

        if (this.month == 1) { // 2월!!!
            if((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0){
                monthLength = 29;
            }
        }

        // header
        var monthName = cal_months_labels[this.month]
        var html = '<table class="calendar-table toggleView">';
        html += '<tr><th colspan="7">';
        html +=  monthName + "&nbsp;" + this.year;
        html += '</th></tr>';
        html += '<tr class="calendar-header">';
        for(var i = 0; i <= 6; i++ ){
            html += '<td class="calendar-header-day">';
            html += cal_days_labels[i];
            html += '</td>';
        }
        html += '</tr><tr>';

        // days
        var day = 1;
        // weeks (rows)
        for (var i = 0; i < 9; i++) {
            // weekdays (cells)
            for (var j = 0; j <= 6; j++) { 
                html += '<td class="calendar-day">';
                if (day <= monthLength && (i > 0 || j >= startingDay)) {
                    html += day;
                    day++;
                }
                html += '</td>';
            }
            // stop making rows if we've run out of days
            if (day > monthLength) {
                break;
            } else {
                html += '</tr><tr>';  
            }
        }
        html += '</tr></table>';

        this.html = html;
    }

    Calendar.prototype.getHTML = function() {
        return this.html;
    }

    window.Calendar = Calendar;
})(window);