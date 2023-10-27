//High level functions regarding the game board
const GameBoard = (function(){
    let gameBoard = []; 

    const createBoard = function(){
        for(i = 0; i < 9; i++){
            const newCell = createCell(i);
            displayController.displayCell(newCell);
            gameBoard.push(newCell);
        }

        displayController.setListeners();
    }

    const getCells = () => gameBoard;

    const trySetCellState = function(index){
        if(!gameFlow.isGameStarted())
            return;

        const newState = gameFlow.getCurrentPlayer().getSign();

        const cell = gameBoard[index];
        const cellState = cell.getState();

        if(cellState != "")
            return;

        cell.setState(newState);
        compareCellStates(index);
    }

    function compareCellStates(index){
        const currentCell = gameBoard[index];
        const desiredState = currentCell.getState();

        console.log("Comparing cell with state:" + desiredState);
        const isVerticalCor = checkVertical();
        console.log(isVerticalCor);

        if(checkHorizontal() || checkVertical() || checkDiagonal()){
            console.log("A player has won! using this sign: " + desiredState);

            gameFlow.gameOver(false, desiredState);
        }else if(boardFilled()){
            gameFlow.gameOver(true, desiredState);
        }

        function boardFilled(){
            let filled = true;
            for(let i = 0; i < gameBoard.length; i++){
                if(gameBoard[i].getState() == ""){
                    filled = false;
                }
            }

            return filled;
        }

        function checkVertical(){
            let verticalCorrelation = false;

            let topCell;
            let middleCell;
            let bottomCell;

            if(index < 3){
                topCell = gameBoard[index];
                middleCell = gameBoard[index + 3];
                bottomCell = gameBoard[index + 6];
            }else if(index < 6){
                topCell = gameBoard[index - 3];
                middleCell = gameBoard[index];
                bottomCell = gameBoard[index + 3];
            }else{
                topCell = gameBoard[index - 6];
                middleCell = gameBoard[index - 3];
                bottomCell = gameBoard[index];
            }

            if(isCorrelation(topCell, middleCell, bottomCell)){
                verticalCorrelation = true;
            }

            return verticalCorrelation;
        }

        function checkHorizontal(){
            let horizontalCorrelation = false;

            let leftCell;
            let middleCell;
            let rightCell;

            if(index < 3){
                leftCell = gameBoard[0];
                middleCell = gameBoard[1];
                rightCell = gameBoard[2];
            }else if(index < 6){
                leftCell = gameBoard[3];
                middleCell = gameBoard[4];
                rightCell = gameBoard[5];
            }else{
                leftCell = gameBoard[6];
                middleCell = gameBoard[7];
                rightCell = gameBoard[8];
            }

            if(isCorrelation(leftCell, middleCell, rightCell)){
                horizontalCorrelation = true;
            }

            return horizontalCorrelation;
        }

        function checkDiagonal(){
            let diagonalCorrelation = false;

            let topCell;
            let middleCell = gameBoard[4];
            let bottomCell;

            if(index < 3){
                if(index != 1){
                    topCell = gameBoard[index];

                    if(index == 0){
                        bottomCell = gameBoard[gameBoard.length - 1];
                    }else if(index == 2){
                        bottomCell = gameBoard[6];
                    }
                }
            }else if(index < 6){
                if(index == 4){
                    //Is center so check all directions
                    let topLeft = gameBoard[0];
                    let bottomRight = gameBoard[8];

                    let topRight = gameBoard[2];
                    let bottomLeft = gameBoard[6];

                    if(isCorrelation(topLeft, middleCell, bottomRight) || isCorrelation(topRight, middleCell, bottomLeft)){
                        diagonalCorrelation = true;
                    }
                }
            }else{
                if(index != 7){
                    bottomCell = gameBoard[index];

                    if(index == 8){
                        topCell = gameBoard[0];
                    }else if(index == 6){
                        topCell = gameBoard[2];
                    }
                }
            }

            if(isCorrelation(topCell, middleCell, bottomCell)){
                diagonalCorrelation = true;
            }

            return diagonalCorrelation;
        }

        function isCorrelation(cell1, cell2, cell3){
            if(cell1 == null || cell2 == null || cell3 == null){
                return false;
            }

            let cor = false;
            if(cell1.getState() == desiredState && cell2.getState() == desiredState && cell3.getState() == desiredState){
                 cor = true;
            }
            
            return cor;
        }
    }

    return{createBoard, getCells, trySetCellState};
})();

//Low level functions for displaying all the various elements
const displayController = (function(){
    const board = document.getElementById("board");
    const playerboxes = document.getElementsByClassName("playerbox");
    const winnerBox = document.getElementsByClassName("winnerbox")[0];

    const displayCell = function(cell){
        //Creating new cell and assigning the index to the html element
        const index = cell.index();

        const createdCell = document.createElement("button");
        createdCell.innerHTML = cell.getState();
        createdCell.setAttribute('data-id', index);
        board.appendChild(createdCell);
    }

    //Set click functionality
    const setListeners = function(){
        let cells = GameBoard.getCells();
        for(let i = 0; i < cells.length; i++){
            const index = "\"" + i + "\"";
            let cell = document.querySelector(`[data-id=${index}]`);
            cell.addEventListener("click", onclick);
            console.log(i);
            function onclick(){
                clickedCell(i);
            }
        }
    }

    const updateCell = function(cell){
        const index = "\"" + cell.index() + "\"";
        let element = document.querySelector(`[data-id=${index}]`);

        element.innerHTML = cell.getState();
    }

    const displayPlayer = function(element, player){
        playerName = document.createElement("h2");
        playerName.innerHTML = player.getName();

        playerSign = document.createElement("h1");
        playerSign.innerHTML = player.getSign();

        element.appendChild(playerName);
        element.appendChild(playerSign);

        player.setUIElement(element);
    }

    const onCurrentPlayerSwitch = function(oldplayer, newplayer){
        if(oldplayer != null){
        oldplayer.getUIElement().setAttribute(`data-current`, false);
        }

        newplayer.getUIElement().setAttribute(`data-current`, true);
    }

    const showEndPanel = function(player = null){
        winnerBox.id = "visible";
        const finishingText = winnerBox.children[0];
        if(player == null){
            //Its a draw
            finishingText.innerHTML = "It's a draw!";
        }else{
            //A player has won

            finishingText.innerHTML = `${player.getName()} has won!`;
        }
    }

    return {displayCell, setListeners, updateCell, displayPlayer, onCurrentPlayerSwitch, showEndPanel};
})();

//Creating a cell that has needed data
function createCell(idx){
    let id = idx;
    let state = "";

    const index = () => id;

    const getState = () => state;
    const setState = function (newState){
        state = newState
        displayController.updateCell(this);
        gameFlow.changedCellState();
    };
    
    return {index, getState, setState};
}

function createPlayer(name, _sign){
    let sign = _sign;
    let UIelement;

    const getName = () => name;
    const getSign = () => sign;

    const getUIElement = () => UIelement;
    const setUIElement = (element) => UIelement = element;

    return{getName, getSign, getUIElement, setUIElement};
}


const gameFlow = (function(){
    const players = [];
    let currentPlayer;
    let gameStarted;

    const isGameStarted = () => gameStarted;
    
    const startGame = function(){
        GameBoard.createBoard();
        createPlayers();
        setCurrentPlayer(players[0]);

        gameStarted = true;
    }

    //Initialize
    const createPlayers = function(){
        const player1 = createPlayer("Player 1", "X");
        const player2 = createPlayer("Player 2", "O");
        players.push(player1);
        players.push(player2);

        const playerbox1 = document.getElementById("left");
        displayController.displayPlayer(playerbox1, player1);
        const playerbox2 = document.getElementById("right");
        displayController.displayPlayer(playerbox2, player2);

        console.log(players);
    }

    const changedCellState = function(){
        const cp = currentPlayer;

        for(let i = 0; i < players.length; i++){
            if(players[i].getName() != cp.getName()){
                const player = players[i];
                setCurrentPlayer(player);
                console.log(player.getSign());
            }
        }
    }

    const getPlayerFromState = function(state){
        for(let i = 0; i < players.length; i++){
            if(players[i].getSign() == state){
                return players[i];
            }
        }

        return null;
    }

    const getCurrentPlayer = () => currentPlayer;
    const setCurrentPlayer =function (player) { 
        displayController.onCurrentPlayerSwitch(currentPlayer, player);
        currentPlayer = player;
    };

    const gameOver = function(isDraw, lastState){
        const lastPlayer = getPlayerFromState(lastState);

        if(isDraw){
        displayController.showEndPanel();
        }else{
            displayController.showEndPanel(lastPlayer);
        }

        gameStarted = false;
    }

    const restartGame = function(){
        location.reload();
    }

    return{getCurrentPlayer, setCurrentPlayer, startGame, changedCellState, gameOver, isGameStarted, restartGame};
})();

function clickedCell(id){
    GameBoard.trySetCellState(id);
}

function replay(){
    gameFlow.restartGame();
}

gameFlow.startGame();
