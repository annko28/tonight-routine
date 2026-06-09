document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const finishBtn = document.getElementById('finish-btn');

    let tasks = [];

    // タスク追加ボタン
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            addTask(taskText);
            taskInput.value = '';
        }
    });

    // おやすみボタン（★おみくじ画面が出るようにここに組み込みました！）
    finishBtn.addEventListener('click', () => {
        showOmikuji();
        setTimeout(() => {
            alert('おやすみなさい！今日もお疲れ様でした。');
        }, 100);
    });

    function addTask(text) {
        const task = {
            id: Date.now(),
            text: text,
            completed: false
        };
        tasks.push(task);
        renderTasks();
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            if (task.completed) {
                li.classList.add('completed');
            }

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                updateProgress();
                renderTasks();
            });

            const span = document.createElement('span');
            span.textContent = task.text;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '削除';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => {
                tasks = tasks.filter(t => t.id !== task.id);
                updateProgress();
                renderTasks();
            });

            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
        updateProgress();
    }

    function updateProgress() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.completed).length;
        const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;
    }
});

// =========================================
// 心理学おみくじシステム
// =========================================
const messages = [
    "今日あなたが注いだエネルギーは、目に見えなくても確実に明日のあなたを支える土台になります。よく頑張りました！",
    "完璧じゃなくて大丈夫。今日このルーティンを完了できた、その行動力こそが素晴らしい成果です。",
    "今夜は、今日一番がんばった自分の体をたくさん褒めて、ゆっくり休ませてあげてくださいね。",
    "明日は『小さな実験の日』。いつもと違う道を歩くなど、1つだけ小さな冒険をすると元気が湧いてきますよ。",
    "明日のラッキーアクションは『朝一番の深呼吸』。新鮮な空気が、あなたの本来の素敵さを引き出してくれます。",
    "目を閉じる前に、今日あった『ちょっと嬉しかったこと』を1つだけ思い浮かべてみて。良い夢に繋がります。"
];

function showOmikuji() {
    const cards = document.querySelectorAll('.card');
    document.getElementById('close-modal-btn').classList.add('hidden');
    let shuffledTexts = [...messages].sort(() => 0.5 - Math.random());
    
    cards.forEach((card, index) => {
        card.classList.remove('flipped');
        card.style.pointerEvents = 'auto'; // タップのロックを解除
        card.querySelector('.msg-text').innerText = shuffledTexts[index];
    });
    document.getElementById('omikuji-modal').classList.remove('hidden');
}

// HTML側から直接タップできるようにwindowに登録
window.flipCard = function(selectedCard) {
    if (selectedCard.classList.contains('flipped')) return;

    selectedCard.classList.add('flipped');
    document.querySelectorAll('.card').forEach(card => card.style.pointerEvents = 'none'); // 他のカードをロック
    
    setTimeout(() => {
        document.getElementById('close-modal-btn').classList.remove('hidden');
    }, 600);
};

document.getElementById('close-modal-btn').addEventListener('click', () => {
    document.getElementById('omikuji-modal').classList.add('hidden');
});
