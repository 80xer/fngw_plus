$('input#username').parent().attr('id', 'usernamediv');
$('input#password').parent().attr('id', 'userpassworddiv');
$('input#username').attr('placeholder', 'ID').attr('onfocus',"this.placeholder = ''").attr('onblur',"this.placeholder = 'ID'");
$('input#password').attr('placeholder', 'PASSWORD').attr('onfocus',"this.placeholder = ''").attr('onblur',"this.placeholder = 'PASSWORD'");
console.log('fnguide groupware plus!');
// .insertCSS({}, function() {
//     console.log('insert css');
// });
