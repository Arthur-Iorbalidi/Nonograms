let currentTemplate = templates[0];
let timerSeconds = 0;
let timerInterval;
isTimerActive = false;

BuildGame();

document.body.addEventListener('click', (event) => {
    if (!event.target.closest('.templatesListBtn') && !event.target.closest('.templatesList')) {
        document.querySelector('.templatesList').classList.remove('visible');
    }
});

document.querySelector('.playing_field').addEventListener('click', () => {
    StartTimer();
    CheckResult();
});

document.querySelector('.playing_field').addEventListener('contextmenu', () => {
    StartTimer();
})

function BuildGame() {
    const header = document.createElement('header');
    const listBtn = document.createElement('div');
    const listWrapper = document.createElement('div');
    listWrapper.classList.add('listWrapper');
    listBtn.classList.add('templatesListBtn');
    const span = document.createElement('span');
    span.textContent = currentTemplate.name;
    const img = document.createElement('img');
    img.src = '../img/bottomArrow.png';
    const list = document.createElement('div');
    list.classList.add('templatesList');

    const resetBtn = document.createElement('button');
    resetBtn.classList.add('reset');
    resetBtn.textContent = 'Reset game';

    listBtn.addEventListener('click', () => {
        list.classList.toggle('visible');
    })
    resetBtn.addEventListener('click', () => {
        ResetGame();
    })

    for (let i = 0; i < templates.length; i++) {
        const option = document.createElement('div');
        option.classList.add('option');
        option.textContent = templates[i].name;
        option.addEventListener('click', (event) => {
            document.querySelector('.templatesListBtn > span').textContent = event.target.textContent;
            currentTemplate = templates.find((template) => template.name === event.target.textContent);
            document.querySelector('.templatesList').classList.remove('visible');
            ResetGame();
        })
        list.append(option);
    }

    header.append(listWrapper);
    listWrapper.append(listBtn);
    listWrapper.append(list);
    header.append(resetBtn);
    listBtn.append(span);
    listBtn.append(img);
    document.body.append(header);
    
    const game = document.createElement('section');
    game.classList.add('game');
    const gameContent = document.createElement('div');
    gameContent.classList.add('game_content');
    const topTips = document.createElement('div');
    topTips.classList.add('top_tips');
    const leftTips = document.createElement('div');
    leftTips.classList.add('left_tips');
    const playingField = document.createElement('div');
    playingField.classList.add('playing_field');

    game.append(gameContent);
    gameContent.append(topTips);
    gameContent.append(leftTips);
    gameContent.append(playingField);

    for (let i = 0; i <= 14; i++) {
        const cell = document.createElement('div');
        cell.classList.add('top_tip');
        if (currentTemplate.topTips[i] > 0) {
            cell.textContent = currentTemplate.topTips[i];
        }
        topTips.append(cell);
    }
    for (let i = 0; i <= 14; i++) {
        const cell = document.createElement('div');
        cell.classList.add('left_tip');
        if (currentTemplate.leftTips[i] > 0) {
            cell.textContent = currentTemplate.leftTips[i];
        }
        leftTips.append(cell);
    }
    for (let i = 0; i <= 24; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', (event) => {
            if (event.target.textContent === '') {
                ChangeCellColor(event);
            }
        });
        cell.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            if (!event.target.classList.contains('picked')) {
                SetX(event);
            }
        })
        playingField.append(cell);
    }

    document.body.append(game);
    
    const timer = document.createElement('div');
    timer.classList.add('timer');
    timer.textContent = '00:00';
    
    document.body.append(timer);

    const modalBackground = document.createElement('div');
    modalBackground.classList.add('modal_background');
    const modal = document.createElement('div');
    modal.classList.add('modal');
    const h2 = document.createElement('h2');
    h2.textContent = 'Great! You have solved the nonogram!';
    const resetBtnModal = document.createElement('button');
    resetBtnModal.classList.add('reset');
    resetBtnModal.textContent = 'Reset game'; 

    resetBtnModal.addEventListener('click', () => {
        document.querySelector('.modal_background').classList.remove('visible');
        ResetGame();
    })

    modalBackground.append(modal);
    modal.append(h2);
    modal.append(resetBtnModal);

    document.body.append(modalBackground);

    const audioClick = document.createElement('audio');
    audioClick.classList.add('clickSound');
    audioClick.src = '../audio/click.mp3';

    const audioWin = document.createElement('audio');
    audioWin.classList.add('winSound');
    audioWin.src = '../audio/win.mp3';

    document.body.append(audioClick);
    document.body.append(audioWin);
}

function ChangeCellColor(event) {
    event.target.classList.toggle('picked');
    document.querySelector('.clickSound').play();
}

function SetX(event) {
    if (event.target.textContent === '') {
        event.target.textContent = 'X';
    }
    else {
        event.target.textContent = '';
    }
    document.querySelector('.clickSound').play();
}

function CheckResult() {
    const cells = document.querySelectorAll('.cell');
    for (let i = 0; i < currentTemplate.content.length; i++) {
        if (!cells[currentTemplate.content[i]].classList.contains('picked')) {
            return;
        }
    }
    if (document.querySelectorAll('.picked').length === currentTemplate.content.length) {
        document.querySelector('.modal_background').classList.add('visible');
        document.querySelector('.winSound').play();
        document.querySelector('.modal > h2').textContent = `Great! You have solved the nonogram in ${timerSeconds} seconds!`
        StopTimer();
    }
}

function ResetGame() {
    document.querySelectorAll('.cell').forEach((cell) => {
        cell.classList.remove('picked');
        cell.textContent = '';
    });
    document.querySelectorAll('.top_tip').forEach((tip, index) => {
        if (currentTemplate.topTips[index] > 0) {
            tip.textContent = currentTemplate.topTips[index];
        }
        else {
            tip.textContent = '';
        }
    });
    document.querySelectorAll('.left_tip').forEach((tip, index) => {
        if (currentTemplate.leftTips[index] > 0) {
            tip.textContent = currentTemplate.leftTips[index];
        }
        else {
            tip.textContent = '';
        }
    });
    StopTimer();
}

function StartTimer() {
    if (!isTimerActive) {
        timerInterval = setInterval(Timer, 1000);
        isTimerActive = true;
    }
}

function Timer() {
    timerSeconds++;
    let formatedTime = `${Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:${Math.floor(timerSeconds % 60).toString().padStart(2, '0')}`;
    document.querySelector('.timer').textContent = formatedTime;
}

function StopTimer() {
    if (isTimerActive) {
        clearInterval(timerInterval);
        timerInterval = null;
        document.querySelector('.timer').textContent = '00:00';
        isTimerActive = false;
        timerSeconds = 0;
    }
}