'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const prevBtn = document.querySelector('#prev');
    const nextBtn = document.querySelector('#next');
    const sendBtn = document.querySelector('#send');

    let questions = [];

    let numberQuestion = 0;
    const finalAnswers = [];

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

    const renderPhoneStep = () => {
        questionTitle.textContent = 'Введіть ваш номер телефону';
        formAnswers.innerHTML = `
            <div class="form-group w-100 px-3">
                <label for="number">Номер телефону</label>
                <input type="tel" class="form-control" id="number" placeholder="+380 XX XXX XX XX">
            </div>
        `;
    };

    const renderQuestions = (index) => {
        formAnswers.innerHTML = '';

        switch (index) {
            case 0:
                prevBtn.classList.add('d-none');
                nextBtn.classList.remove('d-none');
                sendBtn.classList.add('d-none');
                break;
            case questions.length:
                prevBtn.classList.remove('d-none');
                nextBtn.classList.add('d-none');
                sendBtn.classList.remove('d-none');
                break;
            default:
                prevBtn.classList.remove('d-none');
                nextBtn.classList.remove('d-none');
                sendBtn.classList.add('d-none');
                break;
        }

        if (index === questions.length) {
            renderPhoneStep();
        } else {
            questionTitle.textContent = questions[index].question;
            renderAnswers(index);
        }
    };

    const checkAnswers = () => {
        const obj = {};

        const inputs = [...formAnswers.elements].filter(elem => {
            return elem.checked || elem.id === 'number';
        });

        inputs.forEach((elem, i) => {
            if (numberQuestion < questions.length) {
                obj[`${i}_${questions[numberQuestion].question}`] = elem.value;
            } else {
                obj['Номер телефону'] = elem.value;
            }
        });

        finalAnswers[numberQuestion] = obj;
    };

    const playTest = (data) => {
        questions = data;
        numberQuestion = 0;
        finalAnswers.length = 0;
        sendBtn.disabled = false;
        renderQuestions(numberQuestion);
    };

    const closeTest = () => {
        modalBlock.classList.remove('d-block');
    };

    const getData = () => {
        questionTitle.textContent = '';
        formAnswers.textContent = 'LOAD';
        prevBtn.classList.add('d-none');
        nextBtn.classList.add('d-none');
        sendBtn.classList.add('d-none');

        setTimeout(() => {
            firebase.database().ref().child('questions').once('value')
                .then(snap => playTest(snap.val()))
                .catch(err => {
                    formAnswers.textContent = 'Помилка завантаження даних!';
                    console.error(err);
                });
        }, 1000);
    };

    btnOpenModal.addEventListener('click', () => {
        modalBlock.classList.add('d-block');
        getData();
    });

    closeModal.addEventListener('click', closeTest);

    nextBtn.onclick = () => {
        checkAnswers();
        numberQuestion++;
        renderQuestions(numberQuestion);
    };

    prevBtn.onclick = () => {
        numberQuestion--;
        renderQuestions(numberQuestion);
    };

    sendBtn.onclick = () => {
        const phone = document.querySelector('#number');
        if (!phone || !phone.value.trim()) {
            phone && phone.classList.add('is-invalid');
            return;
        }

        checkAnswers();
        sendBtn.disabled = true;
        console.log(finalAnswers);

        firebase.database().ref().child('contacts').push(finalAnswers)
            .catch(err => console.error(err));

        questionTitle.textContent = '';
        formAnswers.textContent = 'Дякую, наш менеджер з вами зв\'яжеться';
        prevBtn.classList.add('d-none');
        sendBtn.classList.add('d-none');

        setTimeout(closeTest, 2000);
    };
});
