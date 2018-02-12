(function main () {

/*
 ******************************************************************************

    init

 ******************************************************************************
*/
    
    function localStorageAvailable () {
        try {
            localStorage.setItem('xexe', 'ok');
            localStorage.getItem('xexe');
            localStorage.removeItem('xexe');
            return true;
        }
        catch (exception) {
            return false;
        }
    }
    
    var canvas = document.getElementById('board');
    var playerNameElement = document.getElementById('playerName');
    var difficultyElement = document.getElementById('difficulty');
    var game = new BubbleBreaker(canvas, document.getElementById('score'));
    var highScores = new HighScores('score', 5);
    // override default settings
    if (localStorageAvailable()) {
        if (localStorage.getItem('playerName')) {
            game.playerName = localStorage.playerName;
        }
        if (localStorage.getItem('difficulty')) {
            game.difficulty = localStorage.difficulty;
        }
        if (localStorage.getItem('highScores')) {
            highScores.load(localStorage.highScores);
        }
    }
    game.theme.background =
        getComputedStyle(canvas, null).getPropertyValue('background-color');
    document.getElementById('headingTitle').innerHTML = 'Bubble Breaker';
    playerNameElement.value = game.playerName;
    difficultyElement.value = game.difficulty;
    highScores.draw();
    game.newGame();

/*
 ******************************************************************************

    actions

 ******************************************************************************
*/
    

    // click on canvas
    
    canvas.addEventListener('click',
        function (event) {
            var bcr = board.getBoundingClientRect();
            var pos = {
                x: event.clientX - bcr.left - getComputedStyle(canvas,
                    null).getPropertyValue('padding-left').slice(0, -2),
                y: event.clientY - bcr.top - getComputedStyle(canvas,
                    null).getPropertyValue('padding-top').slice(0, -2)
            };
            var gameStatus = game.handleClick(pos);
            if (gameStatus.gameOver) {
                if (gameStatus.bonus) {
                    alert('Game over.\n\nBonus: ' + gameStatus.bonus);
                } else {
                    alert('Game over.');
                }
                highScores.consider(
                    {score: game.score, playerName: game.playerName}
                );
                if (localStorageAvailable()) {
                    localStorage.highScores = highScores.save();
                }
            }
        }
    );
    
    
    // click on new game
    
    document.getElementById('newGame').addEventListener('click',
        function (event) {
            game.newGame();
        }
    );
    
    
    // change player name
    
    playerNameElement.addEventListener('change',
        function () {
            if (localStorageAvailable()) {
                localStorage.playerName = playerNameElement.value;
            }
            game.playerName = playerNameElement.value;
        }
    );
    
    
    // change difficulty
    
    difficultyElement.addEventListener('change',
        function () {
            if (localStorageAvailable()) {
                localStorage.difficulty = difficultyElement.value;
            }
            game.difficulty = difficultyElement.value;
            game.newGame();
        }
    );

})();