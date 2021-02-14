// functions that check if a string is a connective or a variable.

function isAConnective(char){
    return "&∨~⊃".includes(char);
}

function isAVariable(char){
    return "abcdefghijklmnopqrstuvwxyz".includes(char);
}

// functions to let you know whether your formula has good grammar or not.

function good(truthTable){
    if (truthTable){
        return true;
    } else {
        alert('Your formula is grammatically correct. Congratulations!');
    }
}

function bad(truthTable){
    if (truthTable){
        return false;
    } else {
        alert('Unfortunately, your formula is grammatically incorrect.');
    }
}

// this function will take a string and start at an index (the position of a connective in the formula), moving left or right checking each character and counting the left and right parentheses. when the program is looking for the main connective of a formula, it will use this information. the main connective is not found inside any parentheses. (if the formula has outer parentheses, they will be stripped away.)

function parenCheck(formula, index, direction){
    var leftParen = 0;
    var rightParen = 0;
    var done = false;
    while (done === false){
        if (index === 0 && direction === 'left'){
            done = true;
        }
        if (index === formula.length && direction === 'right'){
            done = true;
        }
        if (direction === 'left'){
            index--;
            if (formula[index] === '('){
                leftParen++;
                if (rightParen < leftParen){
                    done = true;
                } 
            }
            if (formula[index] === ')'){
                rightParen++;
            }
        } else if (direction === 'right'){
            index++;
            if (formula[index] === ')'){
                rightParen++;
                if (rightParen > leftParen){
                    done = true;
                } 
            }
            if (formula[index] === '('){
                leftParen++;
            }
        }
    }
    return [leftParen,rightParen];
}

// if the connective is a negation sign, this function will be used instead of the one above. it gathers more information. for instance, it tells us whether there is another connective found outside all parentheses. if so, then the negation sign is not the main connective.

function negParenCheck(formula, index, direction){
    var leftParens = 0;
    var rightParens = 0;
    var negs = 0;
    var connects = 0;
    var done = false;
    while (done === false){
        
        if (index === 0 && direction === 'left'){
            done = true;
        }
        if (index === formula.length && direction === 'right'){
            done = true;
        }
        
        
        if (direction === 'left'){
            index--;
        } else if (direction === 'right'){
            index++;
        }
        if (formula[index] === '~'){
            negs++;
        } else if (formula[index] === '('){
            leftParens++;
        } else if (formula[index] === ')'){
            rightParens++;
        } else if (isAConnective(formula[index]) && formula[index] !== '~' && leftParens === rightParens){
            connects++;
        }
    }
    return [negs, leftParens, rightParens, connects];
}

// this function is used to determine whether a formula has outer parentheses that need to be removed. moving from left to right, it counts parentheses and tracks whether they are closed by the end. if the first character in the formula is a left paren, and the last character is a right paren that closes it, this formula returns true.

function removeParens(formula){
    var firstParen = false;
    var firstParenOpen = true;
    var lastParen = formula[formula.length - 1] === ')';
    var leftParens = 0;
    var rightParens = 0;
    var closedParens = 0;
    for (var i = 0; i < formula.length; i++){
        if (formula[i] === '('){
            if (i === 0){
                firstParen = true;
            }
            leftParens++;
            if (rightParens === leftParens){
                closedParens++;
            }
        } else if (formula[i] === ')'){
            rightParens++
            if (rightParens === leftParens){
                closedParens++;
                if (closedParens === 1 && i < formula.length - 1){
                    firstParenOpen = false;
                }
            }
        }
    }
    if ((firstParen && lastParen) && firstParenOpen){
        return true;
    } else {
        return false;
    }
}

// this function takes a complex formula and the index of its main connective and returns an array of constituent formulas.

function getConstituents(formula, index){
    var constituents = [];
    if (formula[index] === '~'){
        constituents.push(formula.slice(index + 1));
    } else {
        if (formula.slice(0, index).length === 1 || formula[0] === '~'){
            constituents.push(formula.slice(0, index));
        } else {
            constituents.push(formula.slice(1, index -1));
        }
        if (formula.slice(index + 1).length === 1 || formula[index + 1] === '~') {
            constituents.push(formula.slice(index + 1))
        } else{
            constituents.push(formula.slice(index + 2, -1));
        }
    }
    return constituents;
}

// for shorter formulas we might as well use simpler tests. then if it's longer it goes to compoundFormula.

function preliminaryTests(formula, truthTable){
    if (formula.length === 1){
        if (isAVariable(formula)){
            return good(truthTable);
        } else {
            return bad(truthTable);
        }
    } else if (formula.length === 2){
        if (formula[0] === '~' && isAVariable(formula[1])){
            return good(truthTable);
        } else {
            return bad(truthTable);
        }
    } else if (formula.length === 3 && isAVariable(formula[1])){
        return bad(truthTable);
    } else if (isAConnective(formula[formula.length - 1])){
        return bad(truthTable);
    } else if (truthTable){
        return compoundFormula(formula, true, truthTable);
    } else {
        compoundFormula(formula, true, truthTable);
    }
}

// when a compound formula is subjected to a recursive test this function is used to test its constituents. if it's an atomic formula it has to be a variable, if it's two characters long it has to be the negation of a well formed atomic formula. otherwise it gets the recursive test. simple negations could be handled just as well by compoundFormula and I might change this in the future.

function checkConstituent(formula, truthTable){
        if (formula.length === 1) {
            if (isAVariable(formula)){
                return true;
            } else {
                return false;
            }
        } else if (formula.length === 2) {
            if (formula[0] === '~' && isAVariable(formula[1])) {
                return true;
            } else {
                return false;
            }
        } else {
            return compoundFormula(formula, false, truthTable);
        }
}

// anything more complex than the negation of an atomic formula gets this recursive test. it does the following: 1. checks whether the formula has outer parentheses and strips them if necessary; 2. puts the index of every connective in an array; 3. tests each connective to see if it is the main connective; 4. if more than one main connective has been identified, the formula has bad grammar; 5. otherwise, runs getConstituents to split the formula into its constituents; 6. counts up every constituent for which checkConstituents returns true; 7. compares the number of constituents to the number which returned true; 8. if those numbers are equal: if the function is being run on a whole formula, calls good(), and if it is being run on a constituent of some more complex formula, returns true.

// the firstIteration argument helps us distinguish between whole formulas and their constituents. since checkConstituents calls compoundFormula, we are able to test formulas of arbitrary complexity.

function compoundFormula(toTest, firstIteration, truthTable){
    if (removeParens(toTest)){
        formula = toTest.slice(1,-1);
    } else {
        formula = toTest;
    }
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
    if (formula.length > 1 && (main.length > 1 || main.length < 1)){
        bad();
    } else {
        var constituents = getConstituents(formula, main[0]);
        var goodConstituents = 0;
        constituents.forEach(function(c){
            if (checkConstituent(c)){
                goodConstituents++;
            }
        });
        if (!firstIteration){
            if (constituents.length === goodConstituents){
                return true;
            } else {
                return false;
            }
        } else {
            if (constituents.length === goodConstituents){
                return good(truthTable);
            } else {
                return bad(truthTable);
            }}

    }
}

// when the 'test' button is clicking we grab the formula from the display thing and send it to preliminaryTests, which then sends it to compoundFormula if that is necessary.

document.getElementById('test').addEventListener('click',function(){
    var formula = document.getElementById('display').innerHTML;
    if (formula.length > 3 && removeParens(formula)){
        var noOuterParens = formula.slice(1,-1);
    } else {
        var noOuterParens = formula;
    }
    var doAmpersand = noOuterParens.replace(/&amp;/g,'&');
    var toTest = doAmpersand.replace(/\s/g,'');
    preliminaryTests(toTest, false);
});