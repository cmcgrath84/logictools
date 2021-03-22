# Propositional Logic Educational Tools
## User's Manual

## Table of Contents
1. [What is this program?](#what-is-this-program)
2. [Practice Logical Syntax](#practice-logical-syntax)
3. [Practice Truth Tables](#practice-truth-tables)
4. [How will this program be improved in the future?](#how-will-this-program-be-improved-in-the-future)
5. [What is propositional logic?](#what-is-propositional-logic)

## What is this program?

This is a program I made for my students to study with when we study propositional logic. It has two parts:
1. Practice Logical Syntax
2. Practice Truth Tables

The program is useful for students who are just beginning their study of formal logic. First, it allows them to attempt to write well-formed formulas of propositional logic. Second, it allows them to write out the truth-values in a truth-table and see whether they put the correct truth-values in each spot.

If you don't know what that means, the final section is for you. It is written in language that a graduate of my introductory logic course should be able to understand (so it is not as mathematically rigorous as it could be). If you know this material, feel free to ignore the final section and focus on the next two, on the actual functioning of the program.

## Practice Logical Syntax

This part of the program allows you to write strings of symbols and see whether they are well-formed formulas. You can include the outermost set of parentheses in your formula or leave it off. Right now, the program only allows you to enter propositional variables, not sentence letters, so there is no option to try and write sentences, atomic or compound. 

The top row of buttons in this section are mostly self explanatory:

- The left and right parenthesis buttons enter those symbols into the display.
- So do the connective buttons to their right.
- 'Back' erases the rightmost symbol in the display.
- 'Clear' clears out all of the symbols in the display.

The bottom row of buttons have the following functions:

- 'Enter variable' enters whatever variable is written in the textbox to its left.
- 'Test your formula' will tell you whether you have written a well-formed formula in the display.
- 'Do a truth table' will check whether the string of symbols in the display is a well-formed formula, and if so, take you to Practice Truth Tables.

## Practice Truth Tables

This part of the program allows you to assign truth-values to each propositional form on each row, and then check if you have assigned the correct truth-value at each spot. The program automatically determines which variables you will need and how many rows your table should have. Future versions of the program may allow users to determine these things for themselves.

The program also omits intermediate rows. Users are recommended to write out their truth-tables with intermediate rows using pencil and paper and then enter the variable and final columns in the program to check their answers.

To use this part of the program:
1. Click on each truth-value to toggle between 'T' and 'F'.
2. When finished, click 'Check your table' to find out whether your truth table is correct.

If your table has an error, the program will let you know whether it is in the variable row or final row.

## How will this program be improved in the future?

I have many plans to continue building this program. Some things to look forward to:

1. Using Vue.js or React.js for the user interface.
2. Mobile compatibility.
3. Intermediate truth table columns.
4. Adding a new feature that allows one to determine the truth-values of compound sentences given an assignment of truth-values to atomic sentences.
5. A version that does not run in the browser! Probably using Python.

## What is propositional logic?

Propositional logic is an artificial language — a language that human beings made up. Some people are interested in it because it models interesting features of our own logic and thought. Other people are interested in it for its own sake. This program will help you learn a few useful basics of the language.

### The syntax of propositional logic.

Propositional logic has expressions, just like English does. English has a lot of different sorts of expression, but propositional logic just has a few basic sorts:

- Sentence letters: A, B, C, ..., Z
- Connectives: &, ∨, ~, ⊃ (These are called the conjunction, disjunction, negation, and conditional symbols respectively)
- Parentheses: (, )
- Propositional variables: p, q, ..., z

Let's take a look at sentences first, and then propositional variables and what we can do with them.

#### Sentences

Sentences and connectives are similar to things we have in English. If you are reading this, you know many English sentences. Connectives are phrases like "and", "or", "if... then, ..." and "it is false that...". The latter connect the former together into larger sentences.

Like English, in propositional logic, there are rules that tell us how to form sentences. There are five in particular:

1. Every sentence letter is a sentence. (A sentence formed this way is called an atomic sentence.)
2. If ф and ψ are sentences, then (ф & ψ) is a sentence. (A sentence formed this way is called a conjunction.)
3. If ф and ψ are sentences, then (ф ∨ ψ) is a sentence. (A sentence formed this way is called a disjunction.)
4. If ф is a sentence, then ~ф is a sentence. (A sentence formed this way is called a negation.)
5. If ф and ψ are sentences, then (ф ⊃ ψ) is a sentence. (A sentence formed this way is called a conditional.)

Sentences 

When you build up more complicated sentences from simpler ones, things can get pretty hard to read. Check this out:

(A ∨ ((((E & B) & C) ⊃ (E ∨ B)) ∨ C))

Typically two conventions are adopted in order to make big long sentences easier to read. First, we can alternate between parentheses, brackets, and braces. Second, we can drop the outermost set of parentheses from a sentence. When we do both, we get this string of symbols:

A ∨ ({[(E & B) & C] ⊃ (E ∨ B)} ∨ C)

Still not the easiest thing to read, but at least we can tell which left and right parentheses match with one another.

#### Propositional variables and forms

The English language does not have anything like propositional variables. Propositional variables are variables, like in algebra. Unlike algebraic variables, these variables range over *sentences*. So the variable p stands for all of the following sentences:

- A, B, C, D

But it also stands for these ones as well:

- A & B, F ∨ G, A & (F ∨ G), ~(D ∨ H) ⊃ (~C & ~A)

And any other sentence you can think of!

We can put propositional variables together with connectives to make more complex **propositional forms**. The rules for forming propositional forms are analogous to our sentence rules:

1. Every propositional variable is a propositional form.
2. If ф and ψ are propositional forms, then (ф & ψ) is a propositional form.
3. If ф and ψ are propositional forms, then (ф ∨ ψ) is a propositional form.
4. If ф is a propositional form, then ~ф is a propositional form.
5. If ф and ψ are propositional forms, then (ф ⊃ ψ) is a propositional form.

What do the more complex propositional forms range over? ф & ψ ranges over all conjunctions. So it stands for all of the following conjunctions:

- A & B, A & C, B & C, C & D

But it also stands for these conjunctions as well:

- (A & B) & C, ~(B ∨ F) & (~C ⊃ H), ~A & ~[A ⊃ (E & D]

ф ∨ ψ ranges over all disjunctions in an analogous way; ~ф over all negations; and ф ⊃ ψ over all conditionals.

More complex propositional forms are possible. For instance, ~ф ∨ ~ψ ranges over the set of disjunctions of negations.

Sentences and propositional forms together are called well-formed formulas. In this program, we only deal with propositional forms, not sentences. In future editions, some features will use sentences instead.

### Truth-values, truth-conditions, and truth tables

Sentences in English have truth values — they are either true or false. In an artificial language like propositional logic, where sentences don't have any independent meaning, we stipulate whether atomic sentences are true or false (how this is done in a mathematically rigorous way in a subject for an upper-division logic course).

The truth-values of conjunctions, disjunctions, negations, and conditionals depend upon the truth-values of their parts. How this works is determined by four rules:

1. If ф is true and ψ is true, then (ф & ψ) is true, and it is false otherwise.
2. If ф is true or ψ is true, then (ф ∨ ψ) is true, and it is false otherwise.
3. If ф is false, then ~ф is true, and it is false otherwise.
4. If ф is false or ψ is true, then (ф ⊃ ψ) is true, and it is false otherwise.

Each of these rules allows us to draw up a table of what the truth-value of a compound sentence would be given the truth-values of its constituent parts. For instance, in the case of conjunction:

| p | q | p & q |
|---|---|-------|
| T | T |   T   |
| T | F |   F   |
| F | T |   F   |
| F | F |   F   |

And in the case of disjunction:

| p | q | p ∨ q |
|---|---|-------|
| T | T |   T   |
| T | F |   T   |
| F | T |   T   |
| F | F |   F   |

And in the case of negation:

| p |~q |
|---|---|
| T | F |
| F | T |

And in the case of conditionals:

| p | q | p ⊃ q |
|---|---|-------|
| T | T |   T   |
| T | F |   F   |
| F | T |   T   |
| F | F |   T   |

More complex truth tables are possible as well — for every propositional form, there is a truth table.