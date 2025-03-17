window.templateOpen = async function() {
    await moduleOpen('./src/html/template.html');
    fn1();
    fn3('qwe');
    fn2();
}

function fn1(){
    console.log('fn1')
}
function fn2(){
    console.log('fn2')
}
function fn3(s){
    console.log(s)
}