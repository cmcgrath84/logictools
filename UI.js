var symbols = [];

var leftParen = document.getElementById('a');
var rightParen = document.getElementById('b');
var conjSign = document.getElementById('c');
var disjSign = document.getElementById('d');
var negSign = document.getElementById('e');
var condSign = document.getElementById('f');

var addVar = document.getElementById('g');
var variable = document.getElementById('variable');

var back = document.getElementById('back');
var clear = document.getElementById('clear');

leftParen.addEventListener('click',function(){
    addSymbol('(');
});

rightParen.addEventListener('click',function(){
    addSymbol(')');
});

conjSign.addEventListener('click',function(){
    addSymbol(' & ');
});

disjSign.addEventListener('click',function(){
    addSymbol(' ∨ ');
});

negSign.addEventListener('click',function(){
    addSymbol('~');
});

condSign.addEventListener('click',function(){
    addSymbol(' ⊃ ');
});

addVar.addEventListener('click',function(){
    if (/[a-z]/.test(variable.value)){
        addSymbol(variable.value);
        variable.value = '';
    } else {
        alert('Propositional variables are lower-case letters ("a" through "z").');
        variable.value = '';
    }
});

back.addEventListener('click',function(){
    symbols.pop();
    update();
})

clear.addEventListener('click',function(){
    symbols = [];
    update();
})

function addSymbol(symbol){
    symbols.push(symbol);
    update();
}

function update(){
    var display = document.getElementById('display');
    var str = symbols.join('');
    display.innerHTML = str;
}