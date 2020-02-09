var board;
const human = "X"
const comp = "O"
const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]


const cells = document.querySelectorAll('.cell')

startGame()

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    board = Array.from(Array(9).keys());

    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}


function turnClick(event) {
    
        if (typeof board[event.target.id] == 'number') {
            turn(event.target.id, human);
        
        if (emptyevents().length != 0) {
            turn(bestSpot(), comp)
        }     
    }
}


function turn(eventId, player) {
    board[eventId] = player;
    document.getElementById(eventId).innerText = player;

    let gameWon = checkWin(board, player)
    if (gameWon) {
        gameOver(gameWon)
    }
    else {
        checkTie(gameWon)
    }
    
}


function checkWin(board, player) {
    let plays = []
    board.forEach((el, i) => {
        if (el === player ){
            plays.push(i)
        }
    });

    let gameWon =  false
    for (let [index, win] of winCombos.entries()){
        if (win.every(elem => plays.indexOf(elem) > -1 )){
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon
}


function gameOver(gameWon){
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = 
            gameWon.player == human ? "green" : "red";
    }
    for (var i = 0; i < cells.length; i++){
        cells[i].removeEventListener('click', turnClick, false)
    }

    declareWinner(gameWon.player == human ? { winner: 'human', text: 'You Win!' } : { winner: 'comp', text: 'You Lose!' })

}


function declareWinner(who) {
    document.querySelector('.endgame').style.display = 'block'
    document.querySelector('.endgame .text').innerText = who.text

    let num = document.getElementById(who.winner).innerText
    num = Number(num) + 1
    document.getElementById(who.winner).innerText = num
}


function emptyevents() {
    return board.filter(s => typeof s == 'number')
}


function bestSpot() {
    return minimax(board, comp).index;
}

function checkTie(gameWon) {

    if (emptyevents().length == 0 && gameWon === false){
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = 'yellow';
            cells[i].removeEventListener('click', turnClick, false)
   
        }
        declareWinner({ winner: 'draw', text: 'Tie Game!' })
        return true;
    }
    return false
}



function minimax(newBoard, player) {
    var availSpots = emptyevents(newBoard);

    if (checkWin(newBoard, player)) {
        return {score: -10};
    } 
    else if (checkWin(newBoard, comp)) {
        return {score: 20};
    }
    else if (availSpots.length === 0) {
        return {score: 0};
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == comp) {
            var result = minimax(newBoard, human);
            move.score = result.score;
        }
        else {
            var result = minimax(newBoard, comp);
            move.score = result.score;
        }
        newBoard[availSpots[i]] = move.index;
        moves.push(move)
        
    }
    var bestMove;
    if (player === comp) {
        var bestScore = -1000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i
            }
        }
    }
    else {
        var bestScore = 1000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i
            }
        }
    }
    return moves[bestMove]
}