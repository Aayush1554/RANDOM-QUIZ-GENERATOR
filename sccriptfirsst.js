document.addEventListener('DOMContentLoaded', function () {
  const questionText = document.getElementById("question");
  const optionsContainer = document.getElementById("options");
  const timerText = document.getElementById("time");
  const nextButton = document.getElementById("next-btn");
  const questionsLeft = document.getElementById("questions-left");

  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");
  const closePopupBtn = document.getElementById("close-popup");

  const quizContainer = document.querySelector(".quiz-container");

  let correctAnswer = "";
  let timer;
  let timeLeft = 30;
  const optionLabels = ["A", "B", "C", "D"];
  let questionCount = 0;
  const maxQuestions = 10;
  let score = 0;

  function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  function updateQuestionsLeft() {
    questionsLeft.textContent = maxQuestions - questionCount;
  }

  function resetTimer() {
    clearInterval(timer);
    timeLeft = 30;
    timerText.textContent = timeLeft;

    timer = setInterval(() => {
      timeLeft--;
      timerText.textContent = timeLeft;

      if (timeLeft === 0) {
        clearInterval(timer);
        showPopup(`⏱ Time's up!<br>Correct answer was: <strong>${correctAnswer}</strong>`);
      }
    }, 1000);
  }

  function showPopup(message) {
    popupMessage.innerHTML = message;
    popup.style.display = "flex";
  }

  closePopupBtn.onclick = () => {
    popup.style.display = "none";
    fetchQuestion();
  };

  function checkAnswer(selected) {
    clearInterval(timer);
    if (selected === correctAnswer) {
      score++;
      showPopup("✅ Correct! Well done.");
    } else {
      showPopup(`❌ Wrong!<br>Correct answer was: <strong>${correctAnswer}</strong>`);
    }
  }

  async function fetchQuestion() {
    if (questionCount >= maxQuestions) {
      clearInterval(timer);
      localStorage.setItem("finalScore", score);
      window.location.href = "lastpage.html";
      return;
    }

    try {
      const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple&category=9");
      const data = await response.json();
      const questionData = data.results[0];

      questionText.innerHTML = `${decodeHTML(questionData.question)}`;
      correctAnswer = decodeHTML(questionData.correct_answer);

      const allOptions = [...questionData.incorrect_answers.map(decodeHTML), correctAnswer];
      const shuffled = allOptions.sort(() => Math.random() - 0.5);

      optionsContainer.innerHTML = "";
      shuffled.forEach((option, index) => {
        const button = document.createElement("button");
        button.classList.add("option");
        button.innerHTML = `<strong>${optionLabels[index]}.</strong> ${option}`;
        button.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(button);
      });

      questionCount++;
      updateQuestionsLeft();
      resetTimer();
    } catch (error) {
      showPopup("⚠️ Failed to load question. Check your internet connection.");
    }
  }

  nextButton.onclick = () => {
    clearInterval(timer);
    fetchQuestion();
  };

  updateQuestionsLeft();
  fetchQuestion();
});
