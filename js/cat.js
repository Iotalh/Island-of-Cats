var canvas = document.getElementById("cat");
var ctx = canvas.getContext("2d");

// 圖片
const bgImage = new Image();
const btns = new Image();
const dialogs = new Image();
const catBelly = new Image();
const catBody = new Image();
const catHappy = new Image();
const food = new Image();
const keyImg = new Image();
const audioImg = new Image();
const musicImg = new Image();
const bestImg = new Image();

bgImage.src = "img/background.jpg";
btns.src = "img/btn.png";
dialogs.src = "img/dialog.png";
catBelly.src = "img/cat/cat_bellys.png";
catBody.src = "img/cat/cat_body2.png";
catHappy.src = "img/cat/cat_stand.png";
food.src = "img/food/foods.png";
keyImg.src = "img/shortcut_key.png";
audioImg.src = "img/ui/audioOn.png";
musicImg.src = "img/ui/musicOn.png";
bestImg.src = "img/ui/trophy.png";

// 聲音
const bgm = new Audio();
bgm.src = "audio/Night at the Beach.ogg";
bgm.loop = true;
const click = new Audio();
click.src = "audio/click3.ogg";
const feedRight = new Audio();
feedRight.src = "audio/jingles_PIZZA16.ogg";
const feedWrong = new Audio();
feedWrong.src = "audio/jingles_PIZZA05.ogg";

// 聲音開關
let audioSet = true;
let musicSet = true;

// 時間紀錄
var limitTime = 20;
var startTime;
var duringTime;
var nowTime;
var recordTime;
var isPaused = false;

// 食物狀態
var order = {
    current: -1,
    goal: 0,
    cheese: 1,
    bowl: 2,
    fish: 3,
    can: 4
}
// 按鍵
var keyUp = {
    keyInput: 0,
    keyW: 87,
    keyA: 65,
    keyS: 83,
    keyD: 68,
    Space: 32,
    Enter: 13
};
// 遊戲狀態
const status = {
    current: 0,
    getReady: 0,
    game: 1,
    gameOver: 2,
    gamePause: 3
}
// 影格數
let frames = 0;
// 貓貓動畫
let cat_actions;
// 貓貓
const cat = {
    cat_body: [
        { sx: 0, sy: 0 },
        { sx: 500, sy: 0 },
        { sx: 0, sy: 0 }
    ],
    cat_happy: [
        { sx: 0, sy: 0 },
        { sw: 640, sh: 630 },
        { dw: 128, dh: 126 }
    ],
    cat_angry: [
        { sx: 0, sy: 0 },
        { sw: 812, sh: 660 },
        { dw: 162.4, dh: 132 }
    ],
    sw: 500,
    sh: 800,
    dx: canvas.width / 2,
    dy: canvas.height / 4,
    dw: 160,
    dh: 256,
    frame: 1,
    draw: function () {
        if (status.current == status.game) {
            cat_actions = this.cat_body[this.frame];
            ctx.drawImage(catBody, cat_actions.sx, cat_actions.sy, this.sw, this.sh, this.dx - 64, this.dy + 160, this.dw * 0.8, this.dh * 0.8);
        }
    },
    update: function () {
        this.period = status.current == status.getReady ? 20 : 10; // 判斷狀態設定不同拍動速率
        this.frame += frames % this.period == 0 ? 1 : 0; // == 0 代表一個周期結束
        this.frame = this.frame % this.cat_body.length; // 讓 frame 的範圍維持在 animation 的陣列長度

    }
}
// 按鍵圖案
const keyIcon = {
    sx: 0,
    sy: 0,
    sw: 125,
    sh: 118,
    cheese_dx: canvas.width * 0.15,
    cheese_dy: canvas.height * 0.875,
    bowl_dx: canvas.width * 0.37,
    bowl_dy: canvas.height * 0.875,
    fish_dx: canvas.width * 0.62,
    fish_dy: canvas.height * 0.875,
    can_dx: canvas.width * 0.9,
    can_dy: canvas.height * 0.875,
    dw: 125 * 0.5,
    dh: 118 * 0.5,
    draw: function () {
        if (status.current == status.game) {
            ctx.drawImage(keyImg, keyIcon.sx, keyIcon.sy, keyIcon.sw, keyIcon.sh, keyIcon.cheese_dx, keyIcon.cheese_dy, keyIcon.dw, keyIcon.dh);
            ctx.drawImage(keyImg, keyIcon.sx, keyIcon.sy, keyIcon.sw, keyIcon.sh, keyIcon.bowl_dx, keyIcon.bowl_dy, keyIcon.dw, keyIcon.dh);
            ctx.drawImage(keyImg, keyIcon.sx, keyIcon.sy, keyIcon.sw, keyIcon.sh, keyIcon.fish_dx, keyIcon.fish_dy, keyIcon.dw, keyIcon.dh);
            ctx.drawImage(keyImg, keyIcon.sx, keyIcon.sy, keyIcon.sw, keyIcon.sh, keyIcon.can_dx, keyIcon.can_dy, keyIcon.dw, keyIcon.dh);
            ctx.save();
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.font = "30px huninn";
            ctx.fillText("W", keyIcon.cheese_dx + 16, keyIcon.cheese_dy + 32);
            ctx.strokeText("W", keyIcon.cheese_dx + 16, keyIcon.cheese_dy + 32);
            ctx.fillText("A", keyIcon.bowl_dx + 20, keyIcon.bowl_dy + 32);
            ctx.strokeText("A", keyIcon.bowl_dx + 20, keyIcon.bowl_dy + 32);
            ctx.fillText("S", keyIcon.fish_dx + 22, keyIcon.fish_dy + 32);
            ctx.strokeText("S", keyIcon.fish_dx + 22, keyIcon.fish_dy + 32);
            ctx.fillText("D", keyIcon.can_dx + 20, keyIcon.can_dy + 32);
            ctx.strokeText("D", keyIcon.can_dx + 20, keyIcon.can_dy + 32);
            ctx.restore();
        }
    }
}
// 食物
const foodCheese = {
    sx: 0,
    sy: 0,
    sw: 500,
    sh: 400,
    dx: canvas.width * 0.05,
    dy: canvas.height * 0.825,
    dw: 250 * 0.4,
    dh: 200 * 0.4,
    draw: function () {
        if (status.current == status.game) {
            ctx.drawImage(food, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
        }
    }
}
const foodBowl = {
    sx: 0,
    sy: 460,
    sw: 560,
    sh: 610,
    dx: canvas.width * 0.25,
    dy: canvas.height * 0.8,
    dw: 280 * 0.42,
    dh: 305 * 0.42,
    draw: function () {
        if (status.current == status.game) {
            ctx.drawImage(food, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
        }
    }
}
const foodFish = {
    sx: 600,
    sy: 420,
    sw: 1150,
    sh: 350,
    dx: canvas.width * 0.5,
    dy: canvas.height * 0.8,
    dw: 1150 * 0.25,
    dh: 350 * 0.25,
    draw: function () {
        if (status.current == status.game) {
            ctx.drawImage(food, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
        }
    }
}
const foodCan = {
    sx: 600,
    sy: 770,
    sw: 550,
    sh: 390,
    dx: canvas.width * 0.75,
    dy: canvas.height * 0.8,
    dw: 550 * 0.25,
    dh: 390 * 0.25,
    draw: function () {
        if (status.current == status.game) {
            ctx.drawImage(food, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
        }
    }
}
const foods = {
    cheese_dx: canvas.width * 0.47,
    cheese_dy: canvas.height * 0.23,
    bowl_dx: canvas.width * 0.47,
    bowl_dy: canvas.height * 0.23,
    fish_dx: canvas.width * 0.44,
    fish_dy: canvas.height * 0.23,
    can_dx: canvas.width * 0.44,
    can_dy: canvas.height * 0.23,
    draw: function () {
        if (status.current == status.game) {
            switch (order.goal) {
                case order.cheese:
                    ctx.drawImage(food, foodCheese.sx, foodCheese.sy, foodCheese.sw, foodCheese.sh, this.cheese_dx, this.cheese_dy, foodCheese.dw, foodCheese.dh);
                    break;
                case order.bowl:
                    ctx.drawImage(food, foodBowl.sx, foodBowl.sy, foodBowl.sw, foodBowl.sh, this.bowl_dx, this.bowl_dy, foodBowl.dw, foodBowl.dh);
                    break;
                case order.fish:
                    ctx.drawImage(food, foodFish.sx, foodFish.sy, foodFish.sw, foodFish.sh, this.fish_dx, this.fish_dy, foodFish.dw, foodFish.dh);
                    break;
                case order.can:
                    ctx.drawImage(food, foodCan.sx, foodCan.sy, foodCan.sw, foodCan.sh, this.can_dx, this.can_dy, foodCan.dw, foodCan.dh);
                    break;
            }
        }
    },
    update: function () {
        if (status.current == status.game) {
            if (order.current == order.goal) {
                order.goal = Math.floor(Math.random() * 4) + 1;
            }
        }
    },
    reset: function () {
        order.goal = Math.floor(Math.random() * 4) + 1;
        scoreInfo.value = 0;
    }
};
const dialog_food = {
    sx: 500,
    sy: 540,
    sw: 500,
    sh: 410,
    dx: canvas.width * 0.3,
    dy: canvas.height * 0.15,
    dw: 500 * 0.7,
    dh: 410 * 0.7,
    draw: function () {
        if (status.current == status.game) {
            ctx.drawImage(dialogs, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
        }
    }
}
// 介面
const timeInfo = {
    sx: 2350,
    sy: 680,
    sw: 1100,
    sh: 530,
    dx: canvas.width * 0.675,
    dy: 0,
    dw: 1100 * 0.2,
    dh: 530 * 0.2,
    draw: function () {
        if (status.current == status.game) {
            ctx.drawImage(btns, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
            ctx.save();
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.font = "40px huninn";
            if (nowTime >= 10) {
                ctx.fillText(nowTime, canvas.width - 150, 64);
                ctx.strokeText(nowTime, canvas.width - 150, 64);
            } else if (nowTime <= 9 && nowTime >= 0) {
                ctx.fillText(nowTime, canvas.width - 130, 64);
                ctx.strokeText(nowTime, canvas.width - 130, 64);
            }
            ctx.restore();
        }
    },
    update: function () {
        if (isPaused) {
            recordTime = new Date(); // 紀錄暫停時間
            isPaused = false;
        }
        if (status.current == status.game) {
            duringTime = parseInt((new Date() - startTime) / 1000);
            if (parseInt(limitTime - duringTime) <= 0) {
                nowTime = 0;
                status.current = status.gameOver;
            } else {
                nowTime = parseInt(limitTime - duringTime);
            }
        }
    },
    reset: function () {
        duringTime = 0;
        nowTime = limitTime;
        startTime = new Date();
    }
}
const scoreInfo = {
    sx: 250,
    sy: 625,
    sw: 700,
    sh: 610,
    dx: 0,
    dy: 0,
    dw: 700 * 0.2,
    dh: 610 * 0.2,
    value: 0,
    scorebest: localStorage.getItem("cat_best") || 0,
    draw: function () {
        if (status.current == status.game) {
            ctx.save();
            ctx.fillStyle = "#f4f0d5";
            ctx.arc(70, 60, 55, 0, 2 * Math.PI);
            ctx.fill();
            ctx.restore();
            ctx.save();
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.font = "40px huninn";
            if (this.value <= 9) {
                ctx.fillText(scoreInfo.value, 57, 73);
                ctx.strokeText(scoreInfo.value, 57, 73);
            } else {
                ctx.fillText(scoreInfo.value, 44, 73);
                ctx.strokeText(scoreInfo.value, 44, 73);
            }
            ctx.restore();
            ctx.drawImage(btns, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
        }
    },
    reset: function () {
        this.value = 0;
    }
}
const startInfo = {
    sx: 0,
    sy: 500,
    sw: 500,
    sh: 360,
    dx: canvas.width / 2 - 500 * 1.2 * 0.525,
    dy: canvas.height * 0.05,
    dw: 500 * 1.2,
    dh: 360 * 1.2,
    draw: function () {
        if (status.current == status.getReady) {
            ctx.drawImage(dialogs, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
            ctx.save();
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.font = "40px huninn";
            ctx.fillText("遊戲規則", canvas.width / 2 - 80, canvas.height * 0.275);
            ctx.strokeText("遊戲規則", canvas.width / 2 - 80, canvas.height * 0.275);
            ctx.fillText("按下 Start 開始遊戲", canvas.width / 2 - 180, canvas.height * 0.33);
            ctx.strokeText("按下 Start 開始遊戲", canvas.width / 2 - 180, canvas.height * 0.33);
            ctx.fillText("W A S D 餵食貓貓", canvas.width / 2 - 162, canvas.height * 0.39);
            ctx.strokeText("W A S D 餵食貓貓", canvas.width / 2 - 162, canvas.height * 0.39);
            ctx.fillText("按下 Space 暫停遊戲", canvas.width / 2 - 180, canvas.height * 0.45);
            ctx.strokeText("按下 Space 暫停遊戲", canvas.width / 2 - 180, canvas.height * 0.45);
            ctx.fillText("餵食貓貓想吃的加1分", canvas.width / 2 - 180, canvas.height * 0.51);
            ctx.strokeText("餵食貓貓想吃的加1分", canvas.width / 2 - 180, canvas.height * 0.51);
            ctx.fillText("不想吃的扣1分", canvas.width / 2 - 125, canvas.height * 0.565);
            ctx.strokeText("不想吃的扣1分", canvas.width / 2 - 125, canvas.height * 0.565);
            ctx.restore();
        }
    }
}
const startBtn = {
    sx: 1200,
    sy: 20,
    sw: 1100,
    sh: 600,
    dx: canvas.width / 2 - 1100 * 0.3 / 2,
    dy: canvas.height * 0.7,
    dw: 1100 * 0.3,
    dh: 600 * 0.3,
    draw: function () {
        if (status.current == status.getReady) {
            ctx.drawImage(btns, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
        }
    }
}
const overBtn = {
    sx: 2350,
    sy: 20,
    sw: 1100,
    sh: 600,
    dx: canvas.width / 2 - (1100 * 0.3) / 2,
    dy: canvas.height * 0.7,
    dw: 1100 * 0.3,
    dh: 600 * 0.3,
    draw: function () {
        if (status.current == status.gameOver) {
            ctx.drawImage(btns, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
        }
    }
}
const overInfo = {
    sx: 0,
    sy: 500,
    sw: 500,
    sh: 360,
    dx: canvas.width / 2 - 500 * 1.2 * 0.525,
    dy: canvas.height * 0.05,
    dw: 500 * 1.2,
    dh: 360 * 1.2,
    draw: function () {
        if (status.current == status.gameOver) {
            ctx.drawImage(dialogs, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
            ctx.save();
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.font = "40px huninn";
            ctx.fillText("得分", canvas.width / 2 - 40, canvas.height * 0.3);
            ctx.strokeText("得分", canvas.width / 2 - 40, canvas.height * 0.3);
            ctx.font = "80px huninn";
            if (scoreInfo.value <= 9) {
                ctx.fillText(scoreInfo.value, canvas.width / 2 - 25, canvas.height * 0.43);
                ctx.strokeText(scoreInfo.value, canvas.width / 2 - 25, canvas.height * 0.43);
            } else {
                ctx.fillText(scoreInfo.value, canvas.width / 2 - 45, canvas.height * 0.43);
                ctx.strokeText(scoreInfo.value, canvas.width / 2 - 45, canvas.height * 0.43);
            }

            ctx.restore();
        }
    }
}
const pauseBtn = {
    sx: 20,
    sy: 20,
    sw: 1100,
    sh: 600,
    dx: canvas.width / 2 - 1110 * 0.3 / 2,
    dy: canvas.height / 2 - 600 * 0.3 / 2,
    dw: 1100 * 0.3,
    dh: 600 * 0.3,
    draw: function () {
        if (status.current == status.gamePause) {
            ctx.drawImage(btns, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
        }
    }
}
const bg = {
    sx: 0,
    sy: 0,
    sw: 5906,
    sh: 5906,
    dx: 0,
    dy: 0,
    dw: canvas.width,
    dh: canvas.height,
    draw: function () {
        ctx.drawImage(bgImage, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
    }
}

const audio_set = {
    sx: 0,
    sy: 0,
    sw: 100,
    sh: 100,
    dx: canvas.width / 2 - 100,
    dy: canvas.height * 0.635,
    dw: 100 * 0.7,
    dh: 100 * 0.7,
    draw: function () {
        if (status.current == status.getReady || status.current == status.gamePause) {
            ctx.drawImage(audioImg, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
        }
    }
}
const music_set = {
    sx: 0,
    sy: 0,
    sw: 100,
    sh: 100,
    dx: canvas.width / 2 + 30,
    dy: canvas.height * 0.635,
    dw: 100 * 0.7,
    dh: 100 * 0.7,
    draw: function () {
        if (status.current == status.getReady || status.current == status.gamePause) {
            ctx.drawImage(musicImg, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
        }
    }
}
const bestInfo = {
    sx: 0,
    sy: 0,
    sw: 100,
    sh: 100,
    dx: canvas.width / 2 - 100,
    dy: canvas.height * 0.45,
    dw: 100 * 0.7,
    dh: 100 * 0.7,
    draw: function () {
        if (status.current == status.gameOver) {
            scoreInfo.scorebest = Math.max(scoreInfo.value, scoreInfo.scorebest);
            localStorage.setItem("cat_best", scoreInfo.scorebest);
            ctx.drawImage(bestImg, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
            ctx.save();
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.font = "40px huninn";
            ctx.fillText(scoreInfo.scorebest, canvas.width / 2 - 15, canvas.height * 0.525);
            ctx.strokeText(scoreInfo.scorebest, canvas.width / 2 - 15, canvas.height * 0.525);
            ctx.restore();
        }
    }
}

function soundMgt() {
    if (audioSet) {
        click.muted = feedWrong.muted = feedRight.muted = false;
    } else {
        click.muted = feedWrong.muted = feedRight.muted = true;
    }
    if (musicSet) {
        bgm.play();
    } else if (!musicSet || status.current == status.gameOver) {
        bgm.pause();
    }
}

canvas.addEventListener("click", function (e) {
    let rect = canvas.getBoundingClientRect();
    let clickX = e.clientX - rect.left;
    let clickY = e.clientY - rect.top;
    switch (status.current) {
        case status.getReady:
            if (clickX >= startBtn.dx && clickX <= startBtn.dx + startBtn.dw &&
                clickY >= startBtn.dy && clickY <= startBtn.dy + startBtn.dh) {
                foods.reset();
                startTime = new Date();
                click.play();
                status.current = status.game;
            } else if (clickX >= audio_set.dx && clickX <= audio_set.dx + audio_set.dw &&
                clickY >= audio_set.dy && clickY <= audio_set.dy + audio_set.dh) {
                audioSet = !audioSet;
                audioImg.src = audioSet ? "img/ui/audioOn.png" : "img/ui/audioOff.png";
            } else if (clickX >= music_set.dx && clickX <= music_set.dx + music_set.dw &&
                clickY >= music_set.dy && clickY <= music_set.dy + music_set.dh) {
                musicSet = !musicSet;
                musicImg.src = musicSet ? "img/ui/musicOn.png" : "img/ui/musicOff.png";
            }
            break;
        case status.gameOver:
            rect = canvas.getBoundingClientRect();
            if (clickX >= overBtn.dx && clickX <= overBtn.dx + overBtn.dw &&
                clickY >= overBtn.dy && clickY <= overBtn.dy + overBtn.dh) {
                foods.reset();
                scoreInfo.reset();
                timeInfo.reset();
                click.play();
                status.current = status.getReady;
            }
            break;
        case status.gamePause:
            if (clickX >= pauseBtn.dx && clickX <= pauseBtn.dx + pauseBtn.dw &&
                clickY >= pauseBtn.dy && clickY <= pauseBtn.dy + pauseBtn.dh) {
                startTime = dateFns.addMilliseconds(startTime, parseInt(new Date() - recordTime));
                click.play();
                status.current = status.game;
            } else if (clickX >= audio_set.dx && clickX <= audio_set.dx + audio_set.dw &&
                clickY >= audio_set.dy && clickY <= audio_set.dy + audio_set.dh) {
                audioSet = !audioSet;
                audioImg.src = audioSet ? "img/ui/audioOn.png" : "img/ui/audioOff.png";
            } else if (clickX >= music_set.dx && clickX <= music_set.dx + music_set.dw &&
                clickY >= music_set.dy && clickY <= music_set.dy + music_set.dh) {
                musicSet = !musicSet;
                musicImg.src = musicSet ? "img/ui/musicOn.png" : "img/ui/musicOff.png";
            }
            break;
    }
});
addEventListener("keyup", function (e) {
    keyUp.keyInput = e.keyCode;
    switch (keyUp.keyInput) {
        case keyUp.keyW:
            if (status.current == status.game) {
                order.current = 1;
                if (order.current == order.goal) {
                    feedRight.play();
                    scoreInfo.value++;
                } else {
                    if (scoreInfo.value > 0) {
                        feedWrong.play();
                        scoreInfo.value--;
                    }
                }
            }
            break;
        case keyUp.keyA:
            if (status.current == status.game) {
                order.current = 2;
                if (order.current == order.goal) {
                    feedRight.play();
                    scoreInfo.value++;
                } else {
                    if (scoreInfo.value > 0) {
                        feedWrong.play();
                        scoreInfo.value--;
                    }
                }
            }
            break;
        case keyUp.keyS:
            if (status.current == status.game) {
                order.current = 3;
                if (order.current == order.goal) {
                    feedRight.play();
                    scoreInfo.value++;
                } else {
                    if (scoreInfo.value > 0) {
                        feedWrong.play();
                        scoreInfo.value--;
                    }
                }
            }
            break;
        case keyUp.keyD:
            if (status.current == status.game) {
                order.current = 4;
                if (order.current == order.goal) {
                    feedRight.play();
                    scoreInfo.value++;
                } else {
                    if (scoreInfo.value > 0) {
                        feedWrong.play();
                        scoreInfo.value--;
                    }
                }
            }
            break;
        case keyUp.Space:
            if (status.current == status.game) {
                isPaused = true;
                status.current = status.gamePause;
            } else if (status.current == status.gamePause) {
                startTime = dateFns.addMilliseconds(startTime, parseInt(new Date() - recordTime));
                status.current = status.game;
            }
            break;
    }
}, false);

function update() {
    cat.update();
    foods.update();
    timeInfo.update();
    soundMgt();
}

function draw() {
    bg.draw();
    cat.draw();
    foodCheese.draw();
    foodBowl.draw();
    foodFish.draw();
    foodCan.draw();
    dialog_food.draw();
    foods.draw();
    keyIcon.draw();
    timeInfo.draw();
    scoreInfo.draw();
    startBtn.draw();
    startInfo.draw();
    audio_set.draw();
    music_set.draw();
    overBtn.draw();
    overInfo.draw();
    bestInfo.draw();
    pauseBtn.draw();
}

function loop() {
    draw();
    update();
    frames++;
    requestAnimationFrame(loop);
}
loop();