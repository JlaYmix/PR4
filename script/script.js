'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const prevBtn = document.querySelector('#prev');
    const nextBtn = document.querySelector('#next');

    const questions = [
        {
            question: 'Якого кольору бургер?',
            answers: [
                { title: 'Стандарт', url: './image/burger.png' },
                { title: 'Чорний', url: './image/burgerBlack.png' }
            ],
            type: 'radio'
        },
        {
            question: "З якого м'яса котлета?",
            answers: [
                { title: 'Курка', url: './image/chickenMeat.png' },
                { title: 'Яловичина', url: './image/beefMeat.png' },
                { title: 'Свинина', url: './image/porkMeat.png' }
            ],
            type: 'radio'
        },
        {
            question: 'Додаткові інгредієнти?',
            answers: [
                { title: 'Помідор', url: './image/tomato.png' },
                { title: 'Огірок', url: './image/cucumber.png' },
                { title: 'Салат', url: './image/salad.png' },
                { title: 'Цибуля', url: './image/onion.png' }
            ],
            type: 'checkbox'
        },
        {
            question: 'Додати соус?',
            answers: [
                { title: 'Часниковий', url: './image/sauce1.png' },
                { title: 'Томатний', url: './image/sauce2.png' },
                { title: 'Гірчичний', url: './image/sauce3.png' }
            ],
            type: 'radio'
        }
    ];

    let numberQuestion = 0;

    const renderAnswers = (index) => {
        const { answers, type } = questions[index];

        answers.forEach((answer, answerIndex) => {
            const burgerName = answer.title;
            const burgerImgSrc = answer.url;
            const id = `answerItem${index}_${answerIndex}`;

            const answerItem = document.createElement('div');
            answerItem.classList.add('answers-item', 'd-flex', 'flex-column');
            answerItem.innerHTML = `
                <input type="${type}" id="${id}" name="answer" class="d-none" value="${burgerName}">
                <label for="${id}" class="d-flex flex-column justify-content-between">
                    <img class="answerImg" src="${burgerImgSrc}" alt="${burgerName}">
                    <span>${burgerName}</span>
                </label>
            `;

            formAnswers.appendChild(answerItem);
        });
    };

    const renderQuestions = (index) => {
        formAnswers.innerHTML = '';
        questionTitle.textContent = questions[index].question;
        renderAnswers(index);

        prevBtn.classList.toggle('d-none', index === 0);
        nextBtn.classList.toggle('d-none', index === questions.length - 1);
    };

    const playTest = () => {
        numberQuestion = 0;
        renderQuestions(numberQuestion);
    };

    btnOpenModal.addEventListener('click', () => {
        modalBlock.classList.add('d-block');
        playTest();
    });

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
    });

    nextBtn.onclick = () => {
        numberQuestion++;
        renderQuestions(numberQuestion);
    };

    prevBtn.onclick = () => {
        numberQuestion--;
        renderQuestions(numberQuestion);
    };
});
