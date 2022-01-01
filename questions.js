var startButton = document.getElementById('start-btn');  // Start Button
startButton.children[0].addEventListener('click', startGame);
startButton.children[1].addEventListener('click', clearHighScore);
var navBar = document.getElementById('nav-bar'); // Nav Bar
navBar.children[0].addEventListener('click', viewHighScore);
var questionContainerElements = document.getElementById('question-container'); //Question Container
var shuffledQuestions, shuffledAnswers, currentQuestionIndex, questions;
var countDown = 75; // Timer variables
var stopQuiz, stopQuizViewHighScore = false;
var inputBoxPlayerName = document.getElementById('input-box-name'); // High Score variables
var submissionResponse = document.getElementById("show-results"); // Get player information
var highScore = document.getElementById('high-score');
var response = [];
var arrayHighScores = JSON.parse(localStorage.getItem("arrayHighScores"));
var correctSound = document.getElementById('correct-sound');
var incorrectSound = document.getElementById('incorrect-sound');
var scoreCount = 0;
var scoreTotal = 0;
var gradeLevel = "F";

if (arrayHighScores === null) {
  arrayHighScores = [];
}

function timer() {
  navBar.children[1].textContent = "Timer: 75"
  var timerInterval = setInterval(() => {
    if (countDown <= 0 || stopQuiz) {
      getPlayerName();
      clearTimeout(timerInterval);
    } else if (stopQuizViewHighScore) {
      clearTimeout(timerInterval);
    } else {
      countDown--
    }
    navBar.children[1].textContent = "Timer: " + countDown
  }, 1000)
}

function startGame() { // Step 1: After clicking on the start button
  pickquestion()
  countDown = 75;
  stopQuiz = false;
  stopQuizViewHighScore = false;
  questionContainerElements.classList.remove('hide');
  shuffledQuestions = questions.sort(() => Math.random() - .5);
  currentQuestionIndex = 0;
  timer();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

function showQuestion(title) { // Step 2: Shows the Question and Answers. Waiting for user to click.
  startButton.classList.add('hide')
  submissionResponse.classList.add('hide')
  while (questionContainerElements.children[1].firstChild) {
    questionContainerElements.children[1].removeChild(questionContainerElements.children[1].firstChild);
  }
  questionContainerElements.children[0].innerText = (title.title)
  shuffledAnswers = questions[currentQuestionIndex].choices.sort(() => Math.random() - .5);
  shuffledAnswers.forEach(answer => {
    var button = document.createElement('button')
    button.innerText = answer.text
    button.classList.add('btn-primary')
    if (answer.correct) {
      button.dataset.correct = answer.correct
    }
    button.addEventListener('click', selectAnswer)
    questionContainerElements.children[1].appendChild(button)
  })
}

function selectAnswer(e) { // Step 3: User selects Answer and determines if answer is correct/incorrect.  If not more question, function will reset.
  var selectedbutton = e.target
  var correct = selectedbutton.dataset.correct
  showAnswer(document.body, correct)
  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    currentQuestionIndex++
    showQuestion(shuffledQuestions[currentQuestionIndex])
  } else {
    stopQuiz = true
  }
}

function showAnswer(element, correct) { // Step 4: Shows users if they are correct/incorrect.
  if (correct) {
    questionContainerElements.children[2].innerText = "Correct"
    correctSound.play();
    scoreTotal++ 
  } else {
    let correctAnswer = [] 
    questions[currentQuestionIndex].choices.forEach(choices => {
      if (choices.correct) correctAnswer = choices.text;
    })
    questionContainerElements.children[2].innerText = "Incorrect: " + questions[currentQuestionIndex].title + " = " + correctAnswer
    incorrectSound.play();
  }
  scoreCount++ 
  if (scoreCount == 15) stopQuiz = true;
}

function getPlayerName() { //Step 5: Get player's name.
  var pleaseStopIt = true;
  inputBoxPlayerName.classList.remove('hide')
  questionContainerElements.classList.add('hide');
  inputBoxPlayerName.children[1].textContent = "Please enter your initials below.";
  if (countDown < 0) {
    countDown = 0
  }
  
  if (scoreTotal == 8) {
    gradeLevel = "D";
  } else if (scoreTotal == 9) {
    gradeLevel = "C";
  } else if (scoreTotal == 10) {
    gradeLevel = "C+";
  } else if (scoreTotal == 11) {
    gradeLevel = "B";
  } else if (scoreTotal == 12) {
    gradeLevel = "A-";
  } else if (scoreTotal == 13) {
    gradeLevel = "A";
  } else if (scoreTotal == 14) {
    gradeLevel = "A+";
  } else if (scoreTotal == 15) {
    gradeLevel = "A++";
  }

  inputBoxPlayerName.children[0].innerHTML = 'Your score is ' + scoreTotal + "/15 Grade: " + gradeLevel;
  inputBoxPlayerName.children[4].addEventListener('click', (event) => {
    event.preventDefault()
    inputBoxPlayerName.children[2].value = inputBoxPlayerName.children[2].value.toUpperCase();
    if (pleaseStopIt) {
      response = inputBoxPlayerName.children[2].value + ": " + scoreTotal + "/15 Grade: " + gradeLevel;
      arrayHighScores.push(response);
      pleaseStopIt = false;
      viewResults();
    } else {
      inputBoxPlayerName.children[1].textContent = "Please try again with your initials ONLY.";
      return;
    }
  })
}

function viewHighScore() {
  stopQuizViewHighScore = true;
  questionContainerElements.classList.add('hide');
  viewResults();
}

function viewResults() { //Step 6: View High Score
  submissionResponse.children[0].textContent = "View High Score";
  highScore.innerHTML = "";
  for (var i = 0; i < arrayHighScores.length; i++) {
    var para = document.createElement("p");
    var node = document.createTextNode(highScore);
    para.appendChild(node);
    highScore.appendChild(para);
    highScore.children[i].textContent = arrayHighScores[i];
  }
  startButton.classList.remove('hide');
  startButton.children[1].classList.remove('hide');
  startButton.children[4].classList.remove('col-9');
  submissionResponse.classList.remove('hide');
  inputBoxPlayerName.classList.add('hide');
  navBar.children[1].textContent = "Timer: 0";
  var JSONReadyUsers = JSON.stringify(arrayHighScores);
  localStorage.setItem("arrayHighScores", JSONReadyUsers);
}

function clearHighScore() {
  arrayHighScores = [];
  highScore.innerHTML = "";
  viewResults();
}

function pickquestion() {
  for (var i = 0; i < allQuestions.length; i++) {
    if (startButton.children[4].children[i].children[0].checked) {
      questions = allQuestions[i];
    }
  }
}


var allQuestions = [
  [ //JavaScript Questions
    { title: "2 x 2", choices: [{ text: "6", correct: false }, { text: "8", correct: false }, { text: "4", correct: true }, { text: "2", correct: false },] },
    { title: "3 x 2", choices: [{ text: "8", correct: false }, { text: "10", correct: false }, { text: "6", correct: true }, { text: "4", correct: false },] },
    { title: "4 x 2", choices: [{ text: "10", correct: false }, { text: "12", correct: false }, { text: "8", correct: true }, { text: "6", correct: false },] },
    { title: "5 x 2", choices: [{ text: "12", correct: false }, { text: "14", correct: false }, { text: "10", correct: true }, { text: "8", correct: false },] },
    { title: "6 x 2", choices: [{ text: "14", correct: false }, { text: "16", correct: false }, { text: "12", correct: true }, { text: "10", correct: false },] },
    { title: "7 x 2", choices: [{ text: "16", correct: false }, { text: "18", correct: false }, { text: "14", correct: true }, { text: "12", correct: false },] },
    { title: "8 x 2", choices: [{ text: "18", correct: false }, { text: "9", correct: false }, { text: "16", correct: true }, { text: "14", correct: false },] },
    { title: "9 x 2", choices: [{ text: "9", correct: false }, { text: "12", correct: false }, { text: "18", correct: true }, { text: "16", correct: false },] },
    { title: "3 x 3", choices: [{ text: "12", correct: false }, { text: "15", correct: false }, { text: "9", correct: true }, { text: "18", correct: false },] },
    { title: "4 x 3", choices: [{ text: "15", correct: false }, { text: "18", correct: false }, { text: "12", correct: true }, { text: "9", correct: false },] },
    { title: "5 x 3", choices: [{ text: "18", correct: false }, { text: "21", correct: false }, { text: "15", correct: true }, { text: "12", correct: false },] },
    { title: "6 x 3", choices: [{ text: "21", correct: false }, { text: "24", correct: false }, { text: "18", correct: true }, { text: "15", correct: false },] },
    { title: "7 x 3", choices: [{ text: "24", correct: false }, { text: "27", correct: false }, { text: "21", correct: true }, { text: "18", correct: false },] },
    { title: "8 x 3", choices: [{ text: "27", correct: false }, { text: "16", correct: false }, { text: "24", correct: true }, { text: "21", correct: false },] },
    { title: "9 x 3", choices: [{ text: "16", correct: false }, { text: "20", correct: false }, { text: "27", correct: true }, { text: "24", correct: false },] },
    { title: "4 x 4", choices: [{ text: "20", correct: false }, { text: "24", correct: false }, { text: "16", correct: true }, { text: "27", correct: false },] },
    { title: "5 x 4", choices: [{ text: "24", correct: false }, { text: "28", correct: false }, { text: "20", correct: true }, { text: "16", correct: false },] },
    { title: "6 x 4", choices: [{ text: "28", correct: false }, { text: "32", correct: false }, { text: "24", correct: true }, { text: "20", correct: false },] },
    { title: "7 x 4", choices: [{ text: "32", correct: false }, { text: "36", correct: false }, { text: "28", correct: true }, { text: "24", correct: false },] },
    { title: "8 x 4", choices: [{ text: "36", correct: false }, { text: "25", correct: false }, { text: "32", correct: true }, { text: "28", correct: false },] },
    { title: "9 x 4", choices: [{ text: "25", correct: false }, { text: "30", correct: false }, { text: "36", correct: true }, { text: "32", correct: false },] },
    { title: "5 x 5", choices: [{ text: "30", correct: false }, { text: "35", correct: false }, { text: "25", correct: true }, { text: "36", correct: false },] },
    { title: "6 x 5", choices: [{ text: "35", correct: false }, { text: "40", correct: false }, { text: "30", correct: true }, { text: "25", correct: false },] },
    { title: "7 x 5", choices: [{ text: "40", correct: false }, { text: "45", correct: false }, { text: "35", correct: true }, { text: "30", correct: false },] },
    { title: "8 x 5", choices: [{ text: "45", correct: false }, { text: "36", correct: false }, { text: "40", correct: true }, { text: "35", correct: false },] },
    { title: "9 x 5", choices: [{ text: "36", correct: false }, { text: "42", correct: false }, { text: "45", correct: true }, { text: "40", correct: false },] },
    { title: "6 x 6", choices: [{ text: "42", correct: false }, { text: "48", correct: false }, { text: "36", correct: true }, { text: "45", correct: false },] },
    { title: "7 x 6", choices: [{ text: "48", correct: false }, { text: "54", correct: false }, { text: "42", correct: true }, { text: "36", correct: false },] },
    { title: "8 x 6", choices: [{ text: "54", correct: false }, { text: "49", correct: false }, { text: "48", correct: true }, { text: "42", correct: false },] },
    { title: "9 x 6", choices: [{ text: "49", correct: false }, { text: "56", correct: false }, { text: "54", correct: true }, { text: "48", correct: false },] },
    { title: "7 x 7", choices: [{ text: "56", correct: false }, { text: "63", correct: false }, { text: "49", correct: true }, { text: "54", correct: false },] },
    { title: "8 x 7", choices: [{ text: "63", correct: false }, { text: "64", correct: false }, { text: "56", correct: true }, { text: "49", correct: false },] },
    { title: "9 x 7", choices: [{ text: "64", correct: false }, { text: "72", correct: false }, { text: "63", correct: true }, { text: "56", correct: false },] },
    { title: "8 x 8", choices: [{ text: "72", correct: false }, { text: "81", correct: false }, { text: "64", correct: true }, { text: "63", correct: false },] },
    { title: "9 x 8", choices: [{ text: "81", correct: false }, { text: "90", correct: false }, { text: "72", correct: true }, { text: "64", correct: false },] },
    { title: "9 x 9", choices: [{ text: "90", correct: false }, { text: "99", correct: false }, { text: "81", correct: true }, { text: "72", correct: false },] }
  ],
  [  //HTML Questions
    { title: "4 ÷ 2", choices: [{ text: "3", correct: false }, { text: "1", correct: false }, { text: "2", correct: true }, { text: "4", correct: false },] },
    { title: "6 ÷ 2", choices: [{ text: "5", correct: false }, { text: "2", correct: false }, { text: "3", correct: true }, { text: "4", correct: false },] },
    { title: "8 ÷ 2", choices: [{ text: "7", correct: false }, { text: "3", correct: false }, { text: "4", correct: true }, { text: "6", correct: false },] },
    { title: "10 ÷ 2", choices: [{ text: "9", correct: false }, { text: "4", correct: false }, { text: "5", correct: true }, { text: "8", correct: false },] },
    { title: "12 ÷ 2", choices: [{ text: "11", correct: false }, { text: "5", correct: false }, { text: "6", correct: true }, { text: "10", correct: false },] },
    { title: "14 ÷ 2", choices: [{ text: "13", correct: false }, { text: "6", correct: false }, { text: "7", correct: true }, { text: "12", correct: false },] },
    { title: "16 ÷ 2", choices: [{ text: "15", correct: false }, { text: "7", correct: false }, { text: "8", correct: true }, { text: "14", correct: false },] },
    { title: "18 ÷ 2", choices: [{ text: "17", correct: false }, { text: "8", correct: false }, { text: "9", correct: true }, { text: "16", correct: false },] },
    { title: "9 ÷ 3", choices: [{ text: "19", correct: false }, { text: "2", correct: false }, { text: "3", correct: true }, { text: "18", correct: false },] },
    { title: "12 ÷ 3", choices: [{ text: "10", correct: false }, { text: "3", correct: false }, { text: "4", correct: true }, { text: "9", correct: false },] },
    { title: "15 ÷ 3", choices: [{ text: "13", correct: false }, { text: "4", correct: false }, { text: "5", correct: true }, { text: "12", correct: false },] },
    { title: "18 ÷ 3", choices: [{ text: "16", correct: false }, { text: "5", correct: false }, { text: "6", correct: true }, { text: "15", correct: false },] },
    { title: "21 ÷ 3", choices: [{ text: "19", correct: false }, { text: "6", correct: false }, { text: "7", correct: true }, { text: "18", correct: false },] },
    { title: "24 ÷ 3", choices: [{ text: "22", correct: false }, { text: "7", correct: false }, { text: "8", correct: true }, { text: "21", correct: false },] },
    { title: "27 ÷ 3", choices: [{ text: "25", correct: false }, { text: "8", correct: false }, { text: "9", correct: true }, { text: "24", correct: false },] },
    { title: "16 ÷ 4", choices: [{ text: "28", correct: false }, { text: "3", correct: false }, { text: "4", correct: true }, { text: "27", correct: false },] },
    { title: "20 ÷ 4", choices: [{ text: "17", correct: false }, { text: "4", correct: false }, { text: "5", correct: true }, { text: "16", correct: false },] },
    { title: "24 ÷ 4", choices: [{ text: "21", correct: false }, { text: "5", correct: false }, { text: "6", correct: true }, { text: "20", correct: false },] },
    { title: "28 ÷ 4", choices: [{ text: "25", correct: false }, { text: "6", correct: false }, { text: "7", correct: true }, { text: "24", correct: false },] },
    { title: "32 ÷ 4", choices: [{ text: "29", correct: false }, { text: "7", correct: false }, { text: "8", correct: true }, { text: "28", correct: false },] },
    { title: "36 ÷ 4", choices: [{ text: "33", correct: false }, { text: "8", correct: false }, { text: "9", correct: true }, { text: "32", correct: false },] },
    { title: "25 ÷ 5", choices: [{ text: "37", correct: false }, { text: "4", correct: false }, { text: "5", correct: true }, { text: "36", correct: false },] },
    { title: "30 ÷ 5", choices: [{ text: "26", correct: false }, { text: "5", correct: false }, { text: "6", correct: true }, { text: "25", correct: false },] },
    { title: "35 ÷ 5", choices: [{ text: "31", correct: false }, { text: "6", correct: false }, { text: "7", correct: true }, { text: "30", correct: false },] },
    { title: "40 ÷ 5", choices: [{ text: "36", correct: false }, { text: "7", correct: false }, { text: "8", correct: true }, { text: "35", correct: false },] },
    { title: "45 ÷ 5", choices: [{ text: "41", correct: false }, { text: "8", correct: false }, { text: "9", correct: true }, { text: "40", correct: false },] },
    { title: "36 ÷ 6", choices: [{ text: "46", correct: false }, { text: "5", correct: false }, { text: "6", correct: true }, { text: "45", correct: false },] },
    { title: "42 ÷ 6", choices: [{ text: "37", correct: false }, { text: "6", correct: false }, { text: "7", correct: true }, { text: "36", correct: false },] },
    { title: "48 ÷ 6", choices: [{ text: "43", correct: false }, { text: "7", correct: false }, { text: "8", correct: true }, { text: "42", correct: false },] },
    { title: "54 ÷ 6", choices: [{ text: "49", correct: false }, { text: "8", correct: false }, { text: "9", correct: true }, { text: "48", correct: false },] },
    { title: "49 ÷ 7", choices: [{ text: "55", correct: false }, { text: "6", correct: false }, { text: "7", correct: true }, { text: "54", correct: false },] },
    { title: "56 ÷ 7", choices: [{ text: "50", correct: false }, { text: "7", correct: false }, { text: "8", correct: true }, { text: "49", correct: false },] },
    { title: "63 ÷ 7", choices: [{ text: "57", correct: false }, { text: "8", correct: false }, { text: "9", correct: true }, { text: "56", correct: false },] },
    { title: "64 ÷ 8", choices: [{ text: "64", correct: false }, { text: "7", correct: false }, { text: "8", correct: true }, { text: "63", correct: false },] },
    { title: "72 ÷ 8", choices: [{ text: "65", correct: false }, { text: "8", correct: false }, { text: "9", correct: true }, { text: "64", correct: false },] },
    { title: "81 ÷ 9", choices: [{ text: "73", correct: false }, { text: "8", correct: false }, { text: "9", correct: true }, { text: "72", correct: false },] }
  ]
  // [ //CSS Questions
  //   {
  //     title: "What does CSS stands for",
  //     choices: [
  //       { text: "strings", correct: false },
  //       { text: "booleans", correct: false },
  //       { text: "Cascading Style Sheets", correct: true },
  //       { text: "numbers", correct: false },]
  //   },
  //   {
  //     title: "What is the correct CSS for adding a background color?",
  //     choices: [
  //       { text: "color: yellow;", correct: false },
  //       { text: "background-color-yellow;", correct: false },
  //       { text: "background-color: yellow;", correct: true },
  //       { text: "background-color: (yellow)", correct: false },]
  //   },
  //   {
  //     title: "What is the correct order of margin property sets?",
  //     choices: [
  //       { text: "Top, Top, Top, and Top", correct: false },
  //       { text: "Right, Bottom, Left, and Top", correct: false },
  //       { text: "Top, Right, Bottom, and Left", correct: true },
  //       { text: "Right, Bottom, Top, and Left", correct: false },]
  //   },
  //   {
  //     title: "Which HTML tag is used to define an internal style sheet?",
  //     choices: [
  //       { text: "<callstyle>", correct: false },
  //       { text: "<styles>", correct: false },
  //       { text: "<style>", correct: true },
  //       { text: "<css>", correct: false },]
  //   },
  //   {
  //     title: "How do you insert a comment in a CSS file?",
  //     choices: [
  //       { text: "// this is a comment", correct: false },
  //       { text: "// this is a comment //", correct: false },
  //       { text: "/* this is a comment */", correct: true },
  //       { text: "' this is a comment", correct: false },]
  //   }
  // ], [ //Math Questions
  //   {
  //     title: "What is 25 * 37?",
  //     choices: [
  //       { text: "950", correct: false },
  //       { text: "1000", correct: false },
  //       { text: "925", correct: true },
  //       { text: "975", correct: false },]
  //   },
  //   {
  //     title: "What is 6 ÷ 2(1+2)?",
  //     choices: [
  //       { text: "9", correct: false },
  //       { text: "3", correct: false },
  //       { text: "0", correct: true },
  //       { text: "6", correct: false },]
  //   },
  //   {
  //     title: "What is 666 + 7777?",
  //     choices: [
  //       { text: "9443", correct: false },
  //       { text: "131313", correct: false },
  //       { text: "8443", correct: true },
  //       { text: "7443", correct: false },]
  //   },
  //   {
  //     title: "What is 9 - 3 ÷ 1 ÷ 3 + 1?",
  //     choices: [
  //       { text: "10", correct: false },
  //       { text: "1", correct: false },
  //       { text: "9", correct: true },
  //       { text: "0", correct: false },]
  //   },
  //   {
  //     title: "What is 43 x 67?",
  //     choices: [
  //       { text: "2818", correct: false },
  //       { text: "2811", correct: false },
  //       { text: "2881", correct: true },
  //       { text: "2882", correct: false },]
  //   }
  // ]
]
