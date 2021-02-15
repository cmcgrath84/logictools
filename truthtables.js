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

/*

The event listener for the "Go back" button.

It does a few things:

    1. Makes the syntax interface visible.
    2. Hides the truth-table interface.
    3. Removes the current truth-table from the truth-table interface.

*/

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

// The event listener for the "Check your table" button on the truth-table interface just runs the testTable function.

document.getElementById('check').addEventListener("click", function() {
  testTable();
});

// This function just toggles one truth-value on the truth-table from "true" to "false" or vice-versa

function toggle(column, row){
    var column = document.getElementById('column' + column);
    var rows = column.getElementsByClassName('row');
    if (rows[row].innerHTML === 'T'){
        rows[row].innerHTML = 'F';
    } else if (rows[row].innerHTML === 'F'){
        rows[row].innerHTML = 'T';
    }
}

// If testVariableColumns returns false then this function tells the user there's a mistake in the variable columns.

// Otherwise it calls the testTheFormula function, where the bulk of the testing occurs.

function testTable(){
    if (testVariableColumns()){
         testTheFormula();
    } else {
        alert('There is a mistake in one of your variable columns.');
    }
}

/* 

This function checks whether the variable columns (columns for p, q, r, and so on) are correct.

The innermost variable column should alternate T, F, T, F...

The next should alternate T, T, F, F, T, T, F, F...

And so on.

*/

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

/*

The program automatically builds the table, with the exception of assignment truth-values to the right places.

In order to know how many columns and rows a table should have, it needs to know how many variables the formula contains.

This function counts the variables.

*/

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

// Determines the number of rows the table requires.

// For n variables, the number of rows is 2^n.

function howManyRows(variables){
    return Math.pow(2, variables);
}

// Creates the HTML elements that compose the truth-table, and attaches them to the document.

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

// returns an object whose keys are variable names and values are objects whose keys are row numbers and values are truth-values

// this is basically a map of which variables have which truth values on each row

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

// if outermost set of parentheses included in formula, returns a string where they have been removed

// takes care of some other formatting stuff as well

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

// did you write a good truth table? or did you mess something up? find out.

function sendResults(result){
    if (result){
        alert('Your truth table is correct.');
    } else {
        alert('There is a mistake in your truth table.');
    }
}

// this is where the magic happens (the formula's truth-value on each row is tested against the truth-value that it *ought* to have).

// detailed notes coming soon.

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