!function() {
    console.log('in timeout.js');
    function FakeTime() {
        this.targetString = '#attndGadgetTime';
        this.btnWrapString = '.attend_btn_wrap';
        this.inBtnString = '#attndGadgetClockIn';
        this.outBtnString = '#attndGadgetClockOut';
        this.cntrlIsPressed = false;
        this.showToggle = false;
    }

    FakeTime.prototype.run = function () {
        var me = this;
        $(document).on('keydown', function(event){
            if(event.which=="17") {
                me.cntrlIsPressed = true;
                console.log('control key down');
            }
        });

        $(document).on('keyup', function(){
            me.cntrlIsPressed = false;
        });

        $(document).on('click', me.targetString, function() {
            console.log('click');
            if (me.cntrlIsPressed) {
                if (me.showToggle) {
                    me.removeInput();
                } else {
                    me.loadHTML();
                }
                me.showToggle = !me.showToggle;
            }
        });
    }

    FakeTime.prototype.start = function () {
        var jsInitChecktimer = setInterval (checkForJS_Finish, 111);
        var me = this;
        function checkForJS_Finish () {
            if ($(me.targetString).length > 0) {
                clearInterval (jsInitChecktimer);
                me.run();
            }
        }
    }

    FakeTime.prototype.createCopyTime = function (time) {
        $('.fk').remove();
        $( this.targetString )
            .clone()
            .addClass('fk')
            .css('display','none')
            .text(time)
            .appendTo($(this.targetString).parent());
    }

    FakeTime.prototype.loadHTML = function () {
        var me = this;
        $.get(chrome.extension.getURL('home/inputFake.html'), function(data) {
            $('.fktimeout').remove();
            me.createInput(data);
        });
    }

    FakeTime.prototype.setFakeTime = function(inout) {
        var me = this;
        if ($('#fakeStr').val() !== "") {
            me.createCopyTime($('#fakeStr').val());
            $(this.targetString).attr('id', this.targetString.slice(1) + '_fk');
            if ($(this.targetString).text() === $('#fakeStr').val()) {
                // $(this[inout + 'BtnString']).click();
            } else {
                console.log('try again');
            }
            $('.fk').remove();
            $(this.targetString + '_fk').attr('id', this.targetString.slice(1));
        } else {
            console.log('input time');
        }
    }

    FakeTime.prototype.removeInput = function () {
        var me = this;
        $('#inputWrap').css('height', '0px');
        $('#fakeStr').css('opacity', 0);
        setTimeout(function() {
            $('.fktimeout').remove();
            $(me.btnWrapString).show();
        }, 800);
    }

    FakeTime.prototype.createInput = function (html){
        var me = this;
        var appendTarget = $( this.targetString ).parent().parent().parent();
        $(this.btnWrapString).hide();
        $($.parseHTML(html)).appendTo(appendTarget);
        $('#fakeStr').timepicker({ 'timeFormat': 'H:i:s' });
        $('#inTime').on('click', function() {
            me.setFakeTime('in');
        });
        $('#outTime').on('click', function() {
            me.setFakeTime('out');
        });
        setTimeout(function() {
            $('#inputWrap').css('height', '45px');
            $('#fakeStr').css('opacity', 1);
        }, 0);

    }

    window.addEventListener ("load", run, false);

    function run(evt) {
        var faketime = new FakeTime();
        faketime.start();
    }
}();