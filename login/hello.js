$('input#username').parent().attr('id', 'usernamediv');
$('input#password').parent().attr('id', 'userpassworddiv');
$('input#username').attr('onfocus',"this.placeholder = ''").attr('onblur',"this.placeholder = '계정'");
$('input#password').attr('onfocus',"this.placeholder = ''").attr('onblur',"this.placeholder = '비밀번호'");
console.log('hello~~');
// .insertCSS({}, function() {
//     console.log('insert css');
// });