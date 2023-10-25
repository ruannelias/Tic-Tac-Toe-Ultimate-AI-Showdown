// Representação do tabuleiro
const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let currentPlayer = 'X';
let gameOver = false;

// Mapeamento dos elementos do tabuleiro para variáveis
const cells = Array.from(document.getElementsByClassName('cell'));

// Função para reiniciar o jogo
function resetGame() {
    board.forEach(row => row.fill(''));
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winner');
    });
    currentPlayer = 'X';
    gameOver = false;
}

// Função chamada quando uma jogada é feita
function makeMove(row, col) {
    if (gameOver || board[row][col] !== '') return;

    board[row][col] = currentPlayer;
    cells[row * 3 + col].textContent = currentPlayer;

    if (checkWin(currentPlayer)) {
        endGame(false);
    } else if (isBoardFull()) {
        endGame(true);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

        if (currentPlayer === 'O') {
            // Computador joga automaticamente
            makeComputerMove();
        }
    }
}

// Função para verificar se há um vencedor
function checkWin(player) {
    for (let i = 0; i < 3; i++) {
        if (
            board[i][0] === player &&
            board[i][1] === player &&
            board[i][2] === player
        ) {
            highlightWinningCells(i, 0, i, 1, i, 2);
            return true;
        }
        if (
            board[0][i] === player &&
            board[1][i] === player &&
            board[2][i] === player
        ) {
            highlightWinningCells(0, i, 1, i, 2, i);
            return true;
        }
    }

    if (
        board[0][0] === player &&
        board[1][1] === player &&
        board[2][2] === player
    ) {
        highlightWinningCells(0, 0, 1, 1, 2, 2);
        return true;
    }

    if (
        board[0][2] === player &&
        board[1][1] === player &&
        board[2][0] === player
    ) {
        highlightWinningCells(0, 2, 1, 1, 2, 0);
        return true;
    }

    return false;
}

// Função para verificar se o tabuleiro está completamente preenchido
function isBoardFull() {
    return board.every(row => row.every(cell => cell !== ''));
}

// Função para marcar as células vencedoras
function highlightWinningCells(row1, col1, row2, col2, row3, col3) {
    cells[row1 * 3 + col1].classList.add('winner');
    cells[row2 * 3 + col2].classList.add('winner');
    cells[row3 * 3 + col3].classList.add('winner');
}

// Função chamada quando o jogo termina
function endGame(isDraw) {
    gameOver = true;
    if (isDraw) {
        alert('Empate!');
    } else {
        alert('Jogador ' + currentPlayer + ' venceu!');
    }
}

// Função para fazer a jogada do computador usando o algoritmo Minimax
function makeComputerMove() {
    const bestMove = getBestMove();
    const row = bestMove.row;
    const col = bestMove.col;
    makeMove(row, col);
}

// Função para obter a melhor jogada para o computador usando o algoritmo Minimax
function getBestMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                board[i][j] = 'O';
                const score = minimax(board, 0, false);
                board[i][j] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { row: i, col: j };
                }
            }
        }
    }

    return bestMove;
}

// Função do algoritmo Minimax para avaliar as jogadas
function minimax(board, depth, isMaximizingPlayer) {
    if (checkWin('X')) {
        return -1;
    } else if (checkWin('O')) {
        return 1;
    } else if (isBoardFull()) {
        return 0;
    }

    if (isMaximizingPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'O';
                    const score = minimax(board, depth + 1, false);
                    board[i][j] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'X';
                    const score = minimax(board, depth + 1, true);
                    board[i][j] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}
