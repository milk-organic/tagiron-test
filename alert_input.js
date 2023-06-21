// Reference: https://www.tagindex.com/javascript/window/prompt.html
// https://jellyjellycafe.com/tagiron/memo.php?red

async function disp(){
	const { value: number } = await Swal.fire({
		title: 'Select field validation',
		input: 'select',
		inputOptions: {
			8: '8', 
			9: '9', 
		},
	inputPlaceholder: '探したい番号を選択',
	showCancelButton: true,
	inputValidator: (value) => {
		return new Promise((resolve) => {
		if (value === '8') {
			resolve()
		} else if (value === '9') {
			resolve('You need to select oranges :)')
		}
		})
	}
	})
	
	if (number) {
	Swal.fire(`You selected: ${number}`)
	}
}

// Reference: https://developer.mozilla.org/ja/docs/Web/API/HTMLSelectElement/remove
function determineQuestion(cardsArray, questionsIndexArray) {
	let select = document.getElementById('questions-select');

	// Note: Number('') returns 0.
	if (select.value !== '') {
		let questionIndex = Number(select.value);
		document.getElementById('selected-question').textContent = getResponseOfQuestion(cardsArray, questionIndex);
		// console.log('questionIndex(remove):', questionsIndexArray.indexOf(questionIndex));
		select.remove(questionsIndexArray.indexOf(questionIndex)+1); // value="questionIndex"のselect要素を削除

		// Delete the index number of the selected question from "questionsIndexArray (it contains the index numbers of the questions.)"
		deleteIndexFromQuestionIndexArray(questionsIndexArray, questionIndex);
		select.value = ""; //選択値を「--質問を選択してください--」に指定

	} else {
		document.getElementById('selected-question').textContent = '';
	}
}

function stopGame(cardsArray, questionsIndexArray) {
	removeSelectOfQuestionsForReset(questionsIndexArray);

	let startButton = document.getElementById("start-button");
	startButton.disabled = null; // start button 有効化
	let stopButton = document.getElementById("stop-button");
	stopButton.disabled = "disabled"; // stop button 無効化

	// For test
	let resultText = '';
	for (const value of cardsArray) {
		resultText += `{ color: ${value.color}, number: ${value.number}} \n`;
	}
	document.getElementById('cpu-cards-text').textContent = resultText;

	setImgOfCards(cardsArray);
}

function startGame() {
	let startButton = document.getElementById("start-button");
	startButton.disabled = "disabled"; // start button 無効化
	let stopButton = document.getElementById("stop-button");
	stopButton.disabled = null; // stop button 有効化

	let [cpuCards, questionsIndexArray] = initialization();
	// setSelectOfQuestions(cpuCards, questionsIndexArray);
	createSelectOfQuestions(questionsIndexArray);
	// For test
	document.getElementById('cpu-cards-text').textContent = "";
	setImgOfCardsWhite(cpuCards);
	return [cpuCards, questionsIndexArray];
}

function removeSelectOfQuestionsForReset(questionsIndexArray) {
	let select = document.getElementById('questions-select');
	for (let i = 0; i < questionsIndexArray.length; i++) {
		select.remove(1);
	}
}

function setSelectOfQuestions(questionsIndexArray) {
	// console.log(cardsArray);
	// // Display the CPU's cards for TEST

	// // Create all selects of the questions.
	// let select = document.getElementById('questions-select');
	// for (const questionsIndex of questionsIndexArray) {
	// 	let option = document.createElement("option");
	// 	option.value = questionsIndex;
	// 	option.text = questions[questionsIndex];

	// 	select.add(option, null);
	// }

	// Rewrite the select elements(options).
	let select = document.getElementById('questions-select');
	select.value = ""; //選択値を「--質問を選択してください--」に指定
	let optionElements = select.getElementsByTagName('option');
	for (let i = 1; i < optionElements.length; i++) {
		let optionElement = optionElements[i];
		optionElement.setAttribute("value", questionsIndexArray[i-1]);
		optionElement.innerHTML = questions[questionsIndexArray[i-1]];
		// console.log(questions[questionsIndexArray[i]]);
	}
}

function createSelectOfQuestions(questionsIndexArray) {
	// console.log(cardsArray);
	// // Display the CPU's cards for TEST
	// let resultText = '';
	// for (const value of cardsArray) {
	// 	resultText += `{ color: ${value.color}, number: ${value.number}} \n`;
	// }
	// document.getElementById('cpu-cards-text').textContent = resultText;

	// Create all selects of the questions.
	let select = document.getElementById('questions-select');
	for (const questionsIndex of questionsIndexArray) {
		let option = document.createElement("option");
		option.value = questionsIndex;
		option.text = questions[questionsIndex];

		select.add(option, null);
	}
}

// Reference: https://itsakura.com/js-getattribute
function setImgOfCards(cardsArray) {
	let table = document.getElementById('cards-display');
	let imgElements = table.getElementsByTagName('img');
	for (let i = 0; i < imgElements.length; i++) {
		let imgElement = imgElements[i];
		imgElement.setAttribute("src", `images/card-${cardsArray[i].color}-${cardsArray[i].number}.png`);
		imgElement.setAttribute("alt", `card-${cardsArray[i].color}-${cardsArray[i].number}`);
	}
}

function setImgOfCardsWhite() {
	let table = document.getElementById('cards-display');
	let imgElements = table.getElementsByTagName('img');
	for (let i = 0; i < imgElements.length; i++) {
		let imgElement = imgElements[i];
		imgElement.setAttribute("src", "images/card-white.png");
		imgElement.setAttribute("alt", "card-white");
	}
}
