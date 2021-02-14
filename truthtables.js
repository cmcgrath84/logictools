/*

The event listener for the "Do a Truth Table" button.

When the button is pressed, the following occurs:

    1. Outer parentheses are removed from the formula if necessary.
    2. The formula is tested for good syntax.
    3. If the formula has bad syntax, the user is informed.
    4. If the formula has good syntax, the syntax interface is hidden and the truth-table interface is made visible.

*/

document.getElementById('truthtable').addEventListener("click", function(){
    var formula = document.getElementById('display').innerHTML;
    if (formula.length > 3 && removeParens(formula)){
        var noOuterParens = formula.slice(1,-1);
    } else {
        var noOuterParens = formula;
    }
    var doAmpersand = noOuterParens.replace(/&amp;/g,'&');
    var toTest = doAmpersand.replace(/\s/g,'');
    if (preliminaryTests(toTest, true)){
        var variables = howManyVariables(toTest);
        var columns = variables.length;
        var rows = howManyRows(columns);
        makeTheTable(columns,rows,variables, toTest);
    var columnNumber = document.getElementsByClassName('container')[1].children.length;
    var column = document.getElementById('column' + columnNumber);
//    var rows = column.getElementsByClassName('row');
//    for (var i = 0; i < rows.length; i++){
//        rows[i].classList.add('toggle');
//    }
        document.getElementsByTagName('header')[0].style.display = "none";
        var container = document.getElementsByClassName('container');
        container[0].style.display = "none";
        container[1].style.display = "block";
    } else {
        alert('Unfortunately, your formula is grammatically incorrect.');
    }
    

});

document.getElementById('toSyntax').addEventListener("click", function() {
    document.getElementsByTagName('header')[0].style.display = "block"; 
    var container = document.getElementsByClassName('container');
    container[0].style.display = "block";        
    container[1].style.display = "none";
    var table = document.getElementById('table');
    while (table.firstChild){
        table.removeChild(table.firstChild);
    }
});

document.getElementById('check').addEventListener("click", function() {
  testTable();
});



function toggle(column, row){
    var column = document.getElementById('column' + column);
    var rows = column.getElementsByClassName('row');
    if (rows[row].innerHTML === 'T'){
        rows[row].innerHTML = 'F';
    } else if (rows[row].innerHTML === 'F'){
        rows[row].innerHTML = 'T';
    }
}

function testTable(){
    if (testVariableColumns()){
         testTheFormula();
    } else {
        alert('There is a mistake in one of your variable columns.');
    }
}

function testVariableColumns(){
    var isGood = true;
    var iterations = document.getElementsByClassName('var').length;
    var multiple = Math.pow(2,iterations);
    for (var i = 0; i < iterations; i++){
        var j = i + 1;
        var column = document.getElementById('column' + j);
        var columnRows = column.getElementsByClassName('tt');
        var value = 'T';
        multiple = multiple / 2;
        for (var k = 0; k < columnRows.length; k++){
            if (k % multiple === 0 && k !== 0){
                if (value === 'T'){
                    value = 'F';
                } else {
                    value = 'T';
                }
            }
            if (columnRows[k].innerHTML !== value){
                isGood = false;
            }
        }
    }
    return isGood;
}

function howManyVariables(formula){
    var variables = [];
    var characters = formula.split('');
    
    for (var i = 0; i < characters.length; i++){
        if (isAVariable(characters[i])){
            variables.push(characters[i]);
        }
    }
    
    return variables;
}

function howManyRows(columns){
    return Math.pow(2, columns);
}

function makeTheTable(columns, rows, variables, formula){
    var table = document.getElementById('table')
    for (var i = 0; i <= columns; i++){
        var newColumn = document.createElement('div');
        newColumn.setAttribute('id','column' + (i + 1));
        var newHeading = document.createElement('div');
        if (i === columns){
            var newName = document.createTextNode(formula);
            newColumn.setAttribute('class','tt-row');
            newHeading.setAttribute('class','tt-heading tt-formula');
        } else{
            var newName = document.createTextNode(variables[i]);
            newColumn.setAttribute('class', 'tt-row var');
            newHeading.setAttribute('class','tt-heading');
        }
        newHeading.append(newName);
        newColumn.append(newHeading);
        for (var j = 0; j < rows; j++){
            newRow = document.createElement('div');
            newRow.setAttribute('class','row tt toggle');
            var truthValue = document.createTextNode('T');
            newRow.append(truthValue);
            newRow.setAttribute('onclick','toggle(' + (i + 1) + ', ' + j + ')');
            newColumn.append(newRow);
            var space = document.createElement('div');
            newColumn.append(space);
        }
        table.append(newColumn);
    }
}

function getVariableValues(){
    var values = {};
    var variables = [];
    var iterations = document.getElementsByClassName('var').length;
    var headings = [];
    for (var i = 0; i < iterations; i++){
        j = i + 1;
        var column = document.getElementById('column' + j);
        var variable = column.getElementsByClassName('tt-heading')[0].innerHTML;
        variables.push(variable);
        values[variable] = {};
        var rows = column.getElementsByClassName('row');
        for (var k = 0; k < rows.length; k++){
//            l = k + 1;
//            rowName = 'row' + l;
            var value = rows[k].innerHTML;
            values[variable][k] = value;
        }
    }
    return values;
}

function formatFormula(toBeFormatted = document.getElementsByClassName('tt-formula').innerHTML){
    if (removeParens(toBeFormatted)){
        var noOuterParens = toBeFormatted.slice(1,-1);
    } else {
        var noOuterParens = toBeFormatted;
    }
    var intermediate = noOuterParens.replace(/&amp;/g,'&');
    var formula = intermediate.replace(/\s/g,'');
    return formula;
}

function sendResults(result){
    if (result){
        alert('Your truth table is correct.');
    } else {
        alert('There is a mistake in your truth table.');
    }
}

function testTheFormula(intermediate = '', firstIteration = true){
    var formulaValues = {};
    var isGood = true;
    var variableValues = getVariableValues();
    var columnNumber = document.getElementById('table').children.length;
    var column = document.getElementById('column' + columnNumber);
    var rows = column.getElementsByClassName('row');
    if (firstIteration){
        var intermediate = column.getElementsByClassName('tt-heading')[0].innerHTML.replace(/&amp;/g,'&');
        var formula = formatFormula(intermediate);
    } else {
        var formula = formatFormula(intermediate);
    }
    for (var i = 0; i < rows.length; i++){
//        var rowName = 'row' + (i + 1);
        if (formula.length === 1){
            if (firstIteration && rows[i].innerHTML !== variableValues[formula][i]){
                isGood = false;
            }
        }
    }
    
    
    if (formula.length === 1){
        if (firstIteration){
            sendResults(isGood);
        } else {
            formulaValues = variableValues[formula];
            return formulaValues;
        }
    } else{
        var connectives = [];
        var main = [];
        for (var i = 0; i < formula.length; i++){
            if (isAConnective(formula[i])){
                connectives.push(i);
            }
        }
        connectives.forEach(function(c){
            if (formula[c] !== '~'){
                var testLeft = parenCheck(formula, c, 'left');
                var testRight = parenCheck(formula, c, 'right');
                if ((testLeft[0] === testLeft[1]) && (testRight[0] === testRight[1])){
                    main.push(c);
                }
            } else if (formula[c] === '~'){
                var testLeft = negParenCheck(formula, c, 'left');
                var testRight = negParenCheck(formula, c, 'right');
                if (testLeft[0] === 0 && testLeft[1] === 0 && testLeft[3] === 0 && testRight[3] === 0){
                    main.push(c);
                }
            }

        });
        
        var constituents = getConstituents(formula, main[0]);
        var theMainConnective = formula[main[0]];
        
        var formulaValues = {};
        if (theMainConnective === '~'){
            var toNegate = testTheFormula(constituents[0], false);
            for (var i = 0; i < rows.length; i++){
//                var rowName = 'row' + i;
                if (toNegate[i] === 'F'){
                    formulaValues[i] = 'T';
                } else {
                    formulaValues[i] = 'F';
                }
            } 
    
            if (firstIteration){
                for (var i = 0; i < rows.length; i++){
                    if (rows[i].innerHTML != formulaValues[i]){
                        isGood = false;
                    }
                }
                sendResults(isGood);
            } else {
                return formulaValues;
            }
        }
        
        if (theMainConnective === '&'){
            var toConnect = [testTheFormula(constituents[0], false), testTheFormula(constituents[1], false)];
            
            for (var i = 0; i < rows.length; i++){
//                var rowName = 'row' + i;
                if (toConnect[0][i] == 'T' && toConnect[1][i] == 'T'){
                    formulaValues[i] = 'T';
                } else {
                    formulaValues[i] = 'F';
                }
            }
    
            if (firstIteration){
                for (var i = 0; i < rows.length; i++){
                    if (rows[i].innerHTML != formulaValues[i]){
                        isGood = false;
                    }
                }
                sendResults(isGood);
            } else {
                return formulaValues;
            }
        }
        
        if (theMainConnective === '∨'){
            var toConnect = [testTheFormula(constituents[0], false), testTheFormula(constituents[1], false)];
            
            for (var i = 0; i < rows.length; i++){
//                var rowName = 'row' + i;
                if (toConnect[0][i] == 'T' || toConnect[1][i] == 'T'){
                    formulaValues[i] = 'T';
                } else {
                    formulaValues[i] = 'F';
                }
            }
    
            if (firstIteration){
                for (var i = 0; i < rows.length; i++){
                    if (rows[i].innerHTML != formulaValues[i]){
                        isGood = false;
                    }
                }
                sendResults(isGood);
            } else {
                return formulaValues;
            }
        }
        
        if (theMainConnective === '⊃'){
            var toConnect = [testTheFormula(constituents[0], false), testTheFormula(constituents[1], false)];
            
            for (var i = 0; i < rows.length; i++){
//                var rowName = 'row' + i;
                if (toConnect[0][i] == 'F' || toConnect[1][i] == 'T'){
                    formulaValues[i] = 'T';
                } else {
                    formulaValues[i] = 'F';
                }
            }
    
            if (firstIteration){
                for (var i = 0; i < rows.length; i++){
                    if (rows[i].innerHTML != formulaValues[i]){
                        isGood = false;
                    }
                }
                sendResults(isGood);
            } else {
                return formulaValues;
            }
        }
    }
}


//
//// functions that check if a string is a connective or a variable.
//
//function isAConnective(char){
//    return "&∨~⊃".includes(char);
//}
//
//function isAVariable(char){
//    return "abcdefghijklmnopqrstuvwxyz".includes(char);
//}
//
//
//// this function will take a string and start at an index (the position of a connective in the formula), moving left or right checking each character and counting the left and right parentheses. when the program is looking for the main connective of a formula, it will use this information. the main connective is not found inside any parentheses. (if the formula has outer parentheses, they will be stripped away.)
//
//function parenCheck(formula, index, direction){
//    var leftParen = 0;
//    var rightParen = 0;
//    var done = false;
//    while (done === false){
//        if (index === 0 && direction === 'left'){
//            done = true;
//        }
//        if (index === formula.length && direction === 'right'){
//            done = true;
//        }
//        if (direction === 'left'){
//            index--;
//            if (formula[index] === '('){
//                leftParen++;
//                if (rightParen < leftParen){
//                    done = true;
//                } 
//            }
//            if (formula[index] === ')'){
//                rightParen++;
//            }
//        } else if (direction === 'right'){
//            index++;
//            if (formula[index] === ')'){
//                rightParen++;
//                if (rightParen > leftParen){
//                    done = true;
//                } 
//            }
//            if (formula[index] === '('){
//                leftParen++;
//            }
//        }
//    }
//    return [leftParen,rightParen];
//}
//
//// if the connective is a negation sign, this function will be used instead of the one above. it gathers more information. for instance, it tells us whether there is another connective found outside all parentheses. if so, then the negation sign is not the main connective.
//
//function negParenCheck(formula, index, direction){
//    var leftParens = 0;
//    var rightParens = 0;
//    var negs = 0;
//    var connects = 0;
//    var done = false;
//    while (done === false){
//        
//        if (index === 0 && direction === 'left'){
//            done = true;
//        }
//        if (index === formula.length && direction === 'right'){
//            done = true;
//        }
//        
//        
//        if (direction === 'left'){
//            index--;
//        } else if (direction === 'right'){
//            index++;
//        }
//        if (formula[index] === '~'){
//            negs++;
//        } else if (formula[index] === '('){
//            leftParens++;
//        } else if (formula[index] === ')'){
//            rightParens++;
//        } else if (isAConnective(formula[index]) && formula[index] !== '~' && leftParens === rightParens){
//            connects++;
//        }
//    }
//    return [negs, leftParens, rightParens, connects];
//}
//
//// this function is used to determine whether a formula has outer parentheses that need to be removed. moving from left to right, it counts parentheses and tracks whether they are closed by the end. if the first character in the formula is a left paren, and the last character is a right paren that closes it, this formula returns true.
//
//function removeParens(formula){
//    var firstParen = false;
//    var firstParenOpen = true;
//    var lastParen = formula[formula.length - 1] === ')';
//    var leftParens = 0;
//    var rightParens = 0;
//    var closedParens = 0;
//    for (var i = 0; i < formula.length; i++){
//        if (formula[i] === '('){
//            if (i === 0){
//                firstParen = true;
//            }
//            leftParens++;
//            if (rightParens === leftParens){
//                closedParens++;
//            }
//        } else if (formula[i] === ')'){
//            rightParens++
//            if (rightParens === leftParens){
//                closedParens++;
//                if (closedParens === 1 && i < formula.length - 1){
//                    firstParenOpen = false;
//                }
//            }
//        }
//    }
//    if ((firstParen && lastParen) && firstParenOpen){
//        return true;
//    } else {
//        return false;
//    }
//}
//
//// this function takes a complex formula and the index of its main connective and returns an array of constituent formulas.
//
//function getConstituents(formula, index){
//    var constituents = [];
//    if (formula[index] === '~'){
//        constituents.push(formula.slice(index + 1));
//    } else {
//        if (formula.slice(0, index).length === 1 || formula[0] === '~'){
//            constituents.push(formula.slice(0, index));
//        } else {
//            constituents.push(formula.slice(1, index -1));
//        }
//        if (formula.slice(index + 1).length === 1 || formula[index + 1] === '~') {
//            constituents.push(formula.slice(index + 1))
//        } else{
//            constituents.push(formula.slice(index + 2, -1));
//        }
//    }
//    return constituents;
//}

//// for shorter formulas we might as well use simpler tests. then if it's longer it goes to compoundFormula.
//
//function preliminaryTests(formula){
//    if (formula.length === 1){
//        if (isAVariable(formula)){
//            good();
//        } else {
//            bad();
//        }
//    } else if (formula.length === 2){
//        if (formula[0] === '~' && isAVariable(formula[1])){
//            good();
//        } else {
//            bad();
//        }
//    } else if (isAConnective(formula[formula.length - 1])){
//        bad();
//    } else {
//        compoundFormula(formula, true);
//    }
//}
//
//// when a compound formula is subjected to a recursive test this function is used to test its constituents. if it's an atomic formula it has to be a variable, if it's two characters long it has to be the negation of a well formed atomic formula. otherwise it gets the recursive test. simple negations could be handled just as well by compoundFormula and I might change this in the future.
//
//function checkConstituent(formula){
//        if (formula.length === 1) {
//            if (isAVariable(formula)){
//                return true;
//            } else {
//                return false;
//            }
//        } else if (formula.length === 2) {
//            if (formula[0] === '~' && isAVariable(formula[1])) {
//                return true;
//            } else {
//                return false;
//            }
//        } else {
//            return compoundFormula(formula, false);
//        }
//}
//
//// anything more complex than the negation of an atomic formula gets this recursive test. it does the following: 1. checks whether the formula has outer parentheses and strips them if necessary; 2. puts the index of every connective in an array; 3. tests each connective to see if it is the main connective; 4. if more than one main connective has been identified, the formula has bad grammar; 5. otherwise, runs getConstituents to split the formula into its constituents; 6. counts up every constituent for which checkConstituents returns true; 7. compares the number of constituents to the number which returned true; 8. if those numbers are equal: if the function is being run on a whole formula, calls good(), and if it is being run on a constituent of some more complex formula, returns true.
//
//// the firstIteration argument helps us distinguish between whole formulas and their constituents. since checkConstituents calls compoundFormula, we are able to test formulas of arbitrary complexity.
//
//function compoundFormula(toTest){
//}