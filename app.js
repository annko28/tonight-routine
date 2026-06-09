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

// 初期化（自動で画面を開く）
window.onload = function() {
    showOmikuji();
};

function showOmikuji() {
    // 画面中央に配置されるように調整
    window.scrollTo(0, 0); 
    
    const cards = document.querySelectorAll('.card');
    const closeBtn = document.getElementById('close-modal-btn');
    
    // ボタンを隠す
    closeBtn.classList.add('hidden');
    
    // ランダムにメッセージを3つ選んでシャッフル配置
    let shuffledTexts = [...messages].sort(() => 0.5 - Math.random());
    
    cards.forEach((card, index) => {
        // カードの状態をリセット
        card.classList.remove('flipped');
        card.style.pointerEvents = 'auto'; // クリックできるようにロックを解除
        // カードの裏側にメッセージを入れる
        card.querySelector('.msg-text').innerText = shuffledTexts[index];
    });
}

// カードをタップした時の処理（HTMLのonclickから呼び出せるようにwindowに登録）
window.flipCard = function(selectedCard) {
    // すでにめくられている場合は何もしない
    if (selectedCard.classList.contains('flipped')) return;

    // 選んだカードをひっくり返す
    selectedCard.classList.add('flipped');
    
    // 1枚選んだら、他のカードはタップできないようにする
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => card.style.pointerEvents = 'none');
    
    // 「おやすみ」ボタンを少し遅れて表示させる
    setTimeout(() => {
        document.getElementById('close-modal-btn').classList.remove('hidden');
    }, 600);
};

// おやすみボタンをクリック
document.getElementById('close-modal-btn').addEventListener('click', () => {
    // ボタンのテキストを変更するなど、終了の演出をここに書けます。
    document.getElementById('close-modal-btn').innerText = '良い夢を、おやすみなさい ☾';
});
