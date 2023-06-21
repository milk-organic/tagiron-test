// スクリプト全体の厳格モード構文
// Reference: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Strict_mode
"use strict";

// const cards = ['R0', 'R1', 'R2', 'R3', 'R4', 'G5', 'R6', 'R7', 'R8', 'R9', 
//                 'B0', 'B1', 'B2', 'B3', 'B4', 'G5', 'B6', 'B7', 'B8', 'B9'];
const cards = [
    { color: 'red', number: 0 },
    { color: 'red', number: 1 },
    { color: 'red', number: 2 },
    { color: 'red', number: 3 },
    { color: 'red', number: 4 },
    { color: 'green', number: 5 },
    { color: 'red', number: 6 },
    { color: 'red', number: 7 },
    { color: 'red', number: 8 },
    { color: 'red', number: 9 },
    { color: 'blue', number: 0 },
    { color: 'blue', number: 1 },
    { color: 'blue', number: 2 },
    { color: 'blue', number: 3 },
    { color: 'blue', number: 4 },
    { color: 'green', number: 5 },
    { color: 'blue', number: 6 },
    { color: 'blue', number: 7 },
    { color: 'blue', number: 8 },
    { color: 'blue', number: 9 }
];

// console.log(cards)

// Get a random number from MIN to MAX. 
// Reference: https://www.sejuku.net/blog/22432
function getRandom( min, max ) {
    let random = Math.floor( Math.random() * (max + 1 - min) ) + min;
    
    return random;
}

// Fisher-Yates shuffle 
// Reference: https://ja.javascript.info/task/shuffle
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // 分割代入(要素の入れ替え)
    }
}

// Get some random elements without duplication (except {color: 'green', number: 5}) from array. 
// Reference: https://www.sejuku.net/blog/22432
// Reference: https://zenn.dev/kou_pg_0131/articles/js-clone-array
function getRandomWithoutDuplication(array, k){
    let arrayCopy = array.concat(); // 元の配列に影響させないため
    shuffle(arrayCopy);
    return arrayCopy.slice(0, k);
}

// Reference: 増井敏克、Pythonではじめるアルゴリズム入門、翔泳社、2021
// Reference: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/fill
// Reference: https://devsakaso.com/javascript-fill-array-from-methods/
function quickSort(array) {
    if (array.length <= 1) {
        return array;
    }
    let pivot = array[0];
    let left = [], right = [], same = 0;

    for (const value of array) {
        if (value < pivot) {
            left.push(value);
        } else if (value > pivot) {
            right.push(value);
        } else {
            same += 1;
        }
    }

    left = quickSort(left);
    right = quickSort(right);

    // Array(same): same 個の要素を持つ空の配列を作成
    // fill(value): 配列の要素をすべて value で埋める
    return (left.concat(Array(same).fill(pivot))).concat(right);
}

// Create an array of numbers. 
function getNumbersArray(array) {
    let numbersArray = [];
    for (const value of array) {
        numbersArray.push(value.number);
    }
    return numbersArray;
}

// Create an array of colors. 
function getColorsArray(array) {
    let colorsArray = [];
    for (const value of array) {
        colorsArray.push(value.color);
    }
    return colorsArray;
}

// Rearrange the Cards by rule of the game. 
// Note: ex. is an image in this function.
// (ex. array: ['B6', 'R9', 'B0', 'R0', 'R6'] -> newArray(return value): ['R0', 'B0', 'R6', 'B6', 'R9'])
// Reference: https://codechacha.com/ja/javascript-remove-duplicates-in-array/
function rearrangeCards(array) {
    // Create an array of numbers. 
    // (ex. array: ['B6', 'R9', 'B0', 'R0', 'R6'] -> numberArray: ['6', '9', '0', '0', '6'])
    let numbersArray = getNumbersArray(array);

    // Sort the numberArray in decreasing order and remove the duplicate value.
    // (ex. numberArray: ['6', '9', '0', '0', '6'] -> newNumbersArray: ['0', '0', '6', '6', '9'])
    // (ex. numbersArray: ['0', '0', '6', '6', '9'] -> newNumbersArray: ['0', '6', '9'])
    let newNumbersArray = quickSort(numbersArray);
    newNumbersArray = Array.from(new Set(newNumbersArray)); // 重複を削除

    let newArray = [];
    let tempArray = [];

    // Compare the value of newNumbersArray(['0', '6', '9']) and the value of array(['B6', 'R9', 'B0', 'R0', 'R6']). 
    // And then, if numberValue is '0', get the value containing '0' from array and push in the tempArray. 
    // In the tempArray has two values, the value containing 'R'(red) is move to the left('blue' should be right of 'red'). (This is because of the rules.)
    for (const numberValue of newNumbersArray) {
        for (const arrayValue of array) {
            if (numberValue === arrayValue.number) {
                tempArray.push(arrayValue);
            }
        }
        if (tempArray.length > 1) {
            if (tempArray[0].color === 'blue') {
                [tempArray[0], tempArray[1]] = [tempArray[1], tempArray[0]]; // 分割代入(要素の入れ替え)
            }
        }
        newArray = newArray.concat(tempArray);
        tempArray = [];
    }

    return newArray;
}

// question 0: '赤の数の合計数は？'
function totalNumbersOfRed(array){
    let total = 0;
    for (const value of array) {
        if (value.color === 'red') {
            total += value.number;
        }
    }
    let resultText = `赤の数の合計数は ${total} です. `;
    return resultText;
}

// question 1: '[共有情報カード]数字タイルの最大の数から最小の数を引いた数は？'
// Reference: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/max
function getMaxMinDifference(array){
    // Compare the beginning and the end of the array(only if the cards are rearranged by rules).
    let difference = array[array.length - 1].number - array[0].number;
    let resultText = `数字タイルの最大の数から最小の数を引いた数は ${difference} です. `;
    return resultText;
}

// question 2: '赤の数字タイルは何枚ある？'
function countTilesOfRed(array) {
    let tile = 0;
    for (const value of array) {
        if (value.color === 'red') {
            tile += 1;
        }
    }
    let resultText = `赤の数字タイルは ${tile}枚 です. `;
    return resultText;
}

// question 3: '大きい方から３枚の合計数は？'
function totalTop3Numbers(array) {
    let total = 0;
    for (const value of array.slice(array.length - 3)) {
        total += value.number;
    }
    let resultText = `大きい方から３枚の合計数は ${total} です. `;
    return resultText;
}

// question 4: '同じ数字タイルのペアは何組みある？'
function countPairsOfSameNumber(array) {
    let count = 0;
    let numbersArray = getNumbersArray(array);
    for (let i = 1; i < numbersArray.length; i++) {
        if (numbersArray[i-1] === numbersArray[i]) {
            count += 1;
        }
    }
    let resultText = `同じ数字タイルのペアは ${count}組み です. `;
    return resultText;
}

// question 5: '小さい方から３枚の合計数は？'
function totalBottom3Numbers(array) {
    let total = 0;
    for (const value of array.slice(0, array.length - 3 + 1)) {
        total += value.number;
    }
    let resultText = `小さい方から３枚の合計数は ${total} です. `;
    return resultText;
}

// question 6: '連番になっているタイルはどこ？'
function findContinuousTiles(array) {
    let resultText = '';
    let continuousArray1 = [1];
    let continuousArray2 = [];
    let continuousArray3 = [];
    let arrayFlag = 3;
    let numbersArray = getNumbersArray(array);
    for (let i = 1; i < numbersArray.length; i++) {
        if (arrayFlag === 3) {
            if (numbersArray[i-1] === numbersArray[i] - 1) {
                continuousArray1.push(i);
                continuousArray1.push(i+1);
            } else {
                arrayFlag = 2;
            }
        } else if (arrayFlag === 2) {
            if (numbersArray[i-1] === numbersArray[i] - 1) {
                continuousArray2.push(i);
                continuousArray2.push(i+1);
            } else {
                arrayFlag = 1;
            }
        } else {
            if (numbersArray[i-1] === numbersArray[i] - 1) {
                continuousArray3.push(i);
                continuousArray3.push(i+1);
            }
        }
    }
    continuousArray1 = Array.from(new Set(continuousArray1)); // 重複を削除
    continuousArray2 = Array.from(new Set(continuousArray2)); // 重複を削除
    continuousArray3 = Array.from(new Set(continuousArray3)); // 重複を削除
    if (continuousArray1.length > 1) {
        resultText += ` 左から${continuousArray1[0]}番目から${continuousArray1[continuousArray1.length-1]}番目まで`;
    }
    if (continuousArray2.length > 1) {
        resultText += ` 左から${continuousArray2[0]}番目から${continuousArray2[continuousArray2.length-1]}番目まで`;
    }
    if (continuousArray3.length > 1){
        resultText += ` 左から${continuousArray3[0]}番目から${continuousArray3[continuousArray3.length-1]}番目まで`;
    }
    if (resultText.length === 0) {
        resultText += 'ありません. '
    } else {
        resultText += ' です. '
    }
    resultText = '連番になっているタイルは' + resultText;
    return resultText;
}

function findTileN(array, number) {
    let resultText = '';
    for (let i = 0; i < array.length; i++) {
        if (array[i].number === number) {
            resultText += `${i+1}, `;
        }
    }
    if (resultText.length === 0) {
        resultText = 'ありません. ';
    } else {
        resultText = ` 左から${resultText.slice(0, resultText.length - 2)}番目 にあります. `;
    }
    resultText = `${number}は${resultText}`;
    return resultText;
}

// question 7: '5はどこ？'
function findTile5(array) {
    return findTileN(array, 5);
}

// question 8: '8または9はどこ？（どちらかひとつ選択）'
function findTile8Or9(array, number=8) {
    return findTileN(array, number);
}

// question 9: '青の数の合計数は？'
function totalNumbersOfBlue(array) {
    let resultText = '';
    let total = 0;
    for (const value of array) {
        if (value.color === 'blue') {
            total += value.number;
        }
    }
    resultText = `青の数の合計数は ${total} です. `;
    return resultText;
}

// question 10: '[共有情報カード]中央の数字タイルは5以上？4以下？'
function checkCentralNumberRange(array) {
    let resultText = '';
    let numbersArray = getNumbersArray(array);
    if (numbersArray[Math.floor(array.length/2)] >= 5) { // OR (numbersArray[2] >= 5)
        resultText += '5以上';
    } else {
        resultText += '4以下';
    }
    return `中央の数字タイルは ${resultText} です. `;
}

// question 11: '1または2はどこ？（どちらかひとつ選択）'
function findTile1Or2(array, number=1) {
    return findTileN(array, number);
}

// question 12: '青の数字タイルは何枚ある？'
function countTilesOfBlue(array) {
    let tile = 0;
    for (const value of array) {
        if (value.color === 'blue') {
            tile += 1;
        }
    }
    let resultText = `青の数字タイルは ${tile}枚 です. `
    return resultText;
}

// question 13: '偶数は何枚ある？'
function countEvenNumbers(array) {
    let total = 0;
    for (const value of array) {
        if (value.number % 2 === 0) {
            total += 1;
        }
    }
    let resultText = `偶数は ${total}枚 あります. `;
    return resultText;
}

// question 14: '奇数は何枚ある？'
function countOddNumbers(array) {
    let total = 0;
    for (const value of array) {
        if (value.number % 2 !== 0) {
            total += 1;
        }
    }
    let resultText = `奇数は ${total}枚 あります. `;
    return resultText;
}

// question 15: '連続して隣り合っている同じ色はどこ？'
function findContinuousSameColor(array) {
    let continuousArray1 = [];
    let continuousArray2 = [];
    let continuousArray3 = [];
    let resultText = '';
    let arrayFlag = 3;
    let colorsArray = getColorsArray(array);
    for (let i = 1; i < colorsArray.length; i++) {
        if (arrayFlag === 3) {
            if (colorsArray[i-1] === colorsArray[i]) {
                continuousArray1.push(i);
                continuousArray1.push(i+1);
            } else {
                arrayFlag = 2;
            }
        } else if (arrayFlag === 2) {
            if (colorsArray[i-1] === colorsArray[i]) {
                continuousArray2.push(i);
                continuousArray2.push(i+1);
            } else {
                arrayFlag = 1;
            }
        } else {
            if (colorsArray[i-1] === colorsArray[i]) {
                continuousArray3.push(i);
                continuousArray3.push(i+1);
            }
        }
    }
    continuousArray1 = Array.from(new Set(continuousArray1)); // 重複を削除
    continuousArray2 = Array.from(new Set(continuousArray2)); // 重複を削除
    continuousArray3 = Array.from(new Set(continuousArray3)); // 重複を削除
    if (continuousArray1.length > 1) {
        resultText += ` 左から${continuousArray1[0]}番目から${continuousArray1[continuousArray1.length-1]}番目まで`;
    }
    if (continuousArray2.length > 1) {
        resultText += ` 左から${continuousArray2[0]}番目から${continuousArray2[continuousArray2.length-1]}番目まで`;
    }
    if (continuousArray3.length > 1){
        resultText += ` 左から${continuousArray3[0]}番目から${continuousArray3[continuousArray3.length-1]}番目まで`;
    }
    if (resultText.length === 0) {
        resultText += 'ありません. '
    } else {
        resultText += ' です. '
    }
    resultText = '連続して隣り合っている同じ色は' + resultText;
    return resultText;
}

// question 16: '[共有情報カード]タイルすべての合計数は？'
function totalNumbersOfAll(array) {
    let total = 0;
    for (const value of array) {
        total += value.number;
    }
    let resultText = `タイルのすべての合計数は ${total} です. `;
    return resultText;
}

// question 17: '3または4はどこ？（どちらかひとつ選択）'
function findTile3Or4(array, number=3) {
    return findTileN(array, number);
}

// question 18: '6または7はどこ？（どちらかひとつ選択）'
function findTile6Or7(array, number=6) {
    return findTileN(array, number);
}

// question 19: '0はどこ？'
function findTile0(array) {
    return findTileN(array, 0);
}

// question 20: '中央の３枚の合計数は？'
function totalCentral3Numbers(array) {
    let numbersArray = getNumbersArray(array);
    let centralIndex = Math.floor(array.length/2); // OR numbersArray[2]
    let total = 0;
    let limit = Math.floor(3/2);
    for (let i = centralIndex - limit; i <= centralIndex + limit; i++) {
        total += numbersArray[i];
    }
    let resultText = `中央の３枚の合計数は ${total} です. `;
    return resultText;
}

function judgement(array1, array2) {
    let isMatch = true;
    for (let i = 0; i < array1.length; i++) {
        if (array1[i].color === array2[i].color && array1[i].number === array2[i].number) {
            isMatch = true;
        } else {
            isMatch = false;
            break;
        }
    }
    return isMatch;
}

function convertValuesToArray(color1, color2, color3, color4, color5, numbers1, numbers2, numbers3, number4, numbers5) {
    const colors = [color1, color2, color3, color4, color5];
    const numbers = [numbers1, numbers2, numbers3, number4, numbers5];
    let newArray = [];
    for (let i = 0; i < colors.length; i++) {
        newArray.push({ color: colors[i], number: numbers[i] });
    }
    return newArray;
}

const questions = [
    '赤の数の合計数は？', 
    '[共有情報カード]数字タイルの最大の数から最小の数を引いた数は？', 
    '赤の数字タイルは何枚ある？',
    '大きい方から３枚の合計数は？', 
    '同じ数字タイルのペアは何組みある？', 
    '小さい方から３枚の合計数は？', 
    '連番になっているタイルはどこ？', 
    '5はどこ？', 
    '8または9はどこ？（どちらかひとつ選択）', 
    '青の数の合計数は？', 
    '[共有情報カード]中央の数字タイルは5以上？4以下？', 
    '1または2はどこ？（どちらかひとつ選択）', 
    '青の数字タイルは何枚ある？', 
    '偶数は何枚ある？', 
    '奇数は何枚ある？', 
    '連続して隣り合っている同じ色はどこ？', 
    '[共有情報カード]タイルすべての合計数は？', 
    '3または4はどこ？（どちらかひとつ選択）', 
    '6または7はどこ？（どちらかひとつ選択）', 
    '0はどこ？', 
    '中央の３枚の合計数は？'
]

// Reference: https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
// Reference: https://pisuke-code.com/js-remove-element-by-value/
function deleteIndexFromQuestionIndexArray(questionsIndexArray, questionIndex) {
    let deleteIndex = questionsIndexArray.indexOf(questionIndex);
    questionsIndexArray.splice(deleteIndex, 1); // 配列の特定の要素を削除
}

function getResponseOfQuestion(array, questionIndex, number=undefined) {
    if (questionIndex === 0) {
        return totalNumbersOfRed(array);
    } else if (questionIndex === 1) {
        return getMaxMinDifference(array);
    } else if (questionIndex === 2) {
        return countTilesOfRed(array);
    } else if (questionIndex === 3) {
        return totalTop3Numbers(array);
    } else if (questionIndex === 4) {
        return countPairsOfSameNumber(array);
    } else if (questionIndex === 5) {
        return totalBottom3Numbers(array);
    } else if (questionIndex === 6) {
        return findContinuousTiles(array);
    } else if (questionIndex === 7) {
        return findTile5(array);
    } else if (questionIndex === 8) {
        return findTile8Or9(array, number);
    } else if (questionIndex === 9) {
        return totalNumbersOfBlue(array);
    } else if (questionIndex === 10) {
        return checkCentralNumberRange(array);
    } else if (questionIndex === 11) {
        return findTile1Or2(array, number);
    } else if (questionIndex === 12) {
        return countTilesOfBlue(array);
    } else if (questionIndex === 13) {
        return countEvenNumbers(array);
    } else if (questionIndex === 14) {
        return countOddNumbers(array);
    } else if (questionIndex === 15) {
        return findContinuousSameColor(array);
    } else if (questionIndex === 16) {
        return totalNumbersOfAll(array);
    } else if (questionIndex === 17) {
        return findTile3Or4(array, number);
    } else if (questionIndex === 18) {
        return findTile6Or7(array, number);
    } else if (questionIndex === 19) {
        return findTile0(array);
    } else if (questionIndex === 20) {
        return totalCentral3Numbers(array);
    } else {
        return 'error. ';
    }
}

function initialization() {
    // Generate cards of CPU. 
    const cpuCards = rearrangeCards(getRandomWithoutDuplication(cards, 5)); // 並び替え済
    console.log('cpuCards:', cpuCards);
    
    // Create an index array of questions to avoid duplication of questions. (This is because of the rule.)
    let questionsIndexArray = [];
    for (let i = 0; i < 21; i++) {
        questionsIndexArray.push(i)
    }

    // Shuffle the index of questions.
    shuffle(questionsIndexArray);

    return [cpuCards, questionsIndexArray];
}

// Generate cards of CPU. 
// const playerCards = getRandomWithoutDuplication(cards, 5); // ランダム

let [cpuCards, questionsIndexArray] = initialization(); // 分割代入(要素の入れ替え)
console.log(questionsIndexArray);
let questionIndex = 0;
deleteIndexFromQuestionIndexArray(questionsIndexArray, questionIndex);
// let question = questions[questionIndex];
// let number = 0;
let response = getResponseOfQuestion(cpuCards, questionIndex);

// for (let i = 0; i < questions.length; i++) {
//     deleteIndexFromQuestionIndexArray(questionsIndexArray, i);
//     let response = getResponseOfQuestion(cpuCards, i);
//     console.log(i, response);
//     console.log(questionsIndexArray);
// }

// Determine if the Player's prediction is correct. 
const playersPrediction = convertValuesToArray('red', 'red', 'green', 'green', 'red', 0, 0, 5, 5, 7);
// console.log(playersPrediction);
// console.log(judgement(playersPrediction, cpuCards));

for (let i = 0; i < questions.length; i++) {
    // console.log(i, getResponseOfQuestion(cpuCards, i));
}
