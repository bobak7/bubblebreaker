function BubbleBreaker (canvas, scoreBoard) {
    
 /*
 ******************************************************************************

    default config

 ******************************************************************************
*/   
 
    this.playerName = '';    
    this.score = 0;
    this.scoreBoard = scoreBoard;
    this.difficulty = 5;
    this.columns = 12;
    this.rows = 12;
    this.ctx = canvas.getContext('2d');
    this.theme = {
        bubbles: ['red', 'yellow', 'lime', 'cyan', 'blue', 'magenta'],
        background: 'lavender',
        highlight: 'rgba(0, 0, 0, 0.2)',
        cell: {
            size: 36,
            padding: 2,
        }
    };
    
/*
 ******************************************************************************

    init

 ******************************************************************************
*/
    
    this.bubbles = new BubbleStorage();
    
    this.selection = new BubbleStorage();
    
    this.drawSelectedBackground = function () {
        var bubble = null;
        var x = 0;
        var y = 0;
        var i = 0;
        var bubbleArray = this.selection.getAll();
        this.ctx.fillStyle = this.theme.highlight;
        for (i = 0; i < bubbleArray.length; i++) {
            this.ctx.fillRect(
                bubbleArray[i].x,
                bubbleArray[i].y,
                this.theme.cell.size,
                this.theme.cell.size
            );
        }
    };
    
    this.drawBubble = function (bubble) {
        var x = bubble.x + this.theme.cell.size / 2;
        var y = bubble.y + this.theme.cell.size / 2;
        var r = this.theme.cell.size / 2 - this.theme.cell.padding;
        var e = 0.4 * r;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.ctx.createRadialGradient(
            x - e, y - e, 0 * r,
            x - e, y - e, 4 * r
        );
        this.ctx.fillStyle.addColorStop(0, 'white');
        this.ctx.fillStyle.addColorStop(0.05, bubble.color);
        this.ctx.fillStyle.addColorStop(0.75, 'black');
        this.ctx.fill();
    };
    
    this.draw = function () {
        var i = 0;
        var bubbleArray = null;
        
        // draw background
        this.ctx.fillStyle = this.theme.background;
        this.ctx.fillRect(
            0,
            0,
            this.columns * this.theme.cell.size,
            this.rows * this.theme.cell.size
        );
        
        // draw all bubbles
        bubbleArray = this.bubbles.getAll();
        for (i = 0; i < bubbleArray.length; i++) {
            this.drawBubble(bubbleArray[i]);
        }
        
        // highlight selected positions
        this.drawSelectedBackground();
        
        this.scoreBoard.innerHTML = this.score;
    };
    
    this.newGame = function() {
        var pos = {x: 0, y: 0};
        var width = this.columns * this.theme.cell.size;
        var height = this.rows * this.theme.cell.size;
        this.score = 0;
        this.selection.clear();
        this.bubbles.clear();
        for (pos.x = 0; pos.x < width; pos.x += this.theme.cell.size) {
            for (pos.y = 0; pos.y < height; pos.y += this.theme.cell.size) {
                this.bubbles.add({
                    x: pos.x,
                    y: pos.y,
                    color: this.theme.bubbles[
                        Math.floor(Math.random() * this.difficulty)
                    ]
                });
            }
        }
        this.draw();
    };
    
    this.checkGameOver = function () {
        var result = {gameOver: false, bonus: 0};
        var bubbles = this.bubbles.getAll();
        var bubbleCount = bubbles.length;
        var i = 0;
        for (i = 0; i < bubbleCount; i++) {
            this.select(bubbles[i]);
            if (this.selection.size() > 1) {
                this.selection.clear();
                return result;
            }
            this.selection.clear();
        }
        result.gameOver = true;
        result.bonus = 1024;
        for (i = 0; i < bubbleCount; i++) {
            result.bonus /= 2;
            if (result.bonus < 2) {
                result.bonus = 0;
                break;
            }
        }
        this.score += result.bonus;
        return result;
    };
    
    this.alignBubbles = function () {
        var bubble = null;
        var pos = {x: 0, y: 0};
        var cellSize = this.theme.cell.size;
        var move = {x: 0, y: 0};
        for (pos.x = (this.columns - 1) * cellSize; pos.x >= -0;
                pos.x -= cellSize) {
            move.y = 0;
            for (pos.y = (this.rows - 1) * cellSize; pos.y >= -0;
                    pos.y -= cellSize) {
                bubble = this.bubbles.getBubble(pos);                
                if (bubble) {
                    if (move.x || move.y) {
                        this.bubbles.remove(bubble);
                        bubble.x += move.x;
                        bubble.y += move.y;
                        this.bubbles.add(bubble);
                    }
                } else {
                    move.y += cellSize;
                }
            }
            if (move.y == (this.rows) * cellSize) {
                move.x += cellSize;
            }
        }
    };
    
    this.breakSelection = function () {
        var bubbles = this.selection.getAll();
        var selectionSize = this.selection.size();
        var i = 0;
        for (i = 0; i < selectionSize; i++) {
            this.bubbles.remove(bubbles[i]);
        }
        this.selection.clear();
        this.score += selectionSize * (selectionSize - 1);
        this.alignBubbles();
        return this.checkGameOver();
    };
    
    this.select = function (pos) {
        var bubble = null;
        var adjacentPos = [
            {x: pos.x + this.theme.cell.size, y: pos.y},
            {x: pos.x, y: pos.y - this.theme.cell.size},
            {x: pos.x - this.theme.cell.size, y: pos.y},
            {x: pos.x, y: pos.y + this.theme.cell.size},
        ];
        var i = 0;
        this.selection.add(this.bubbles.getBubble(pos));
        for (i = 0; i < 4; i++) {
            bubble = this.bubbles.getBubble(adjacentPos[i]);
            if (bubble &&
                    bubble.color == this.bubbles.getBubble(pos).color &&
                    !this.selection.contains(bubble)) {
                this.select(adjacentPos[i]);
            }
        }
    };
    
    this.bubbleClick = function(pos) {
        var result = {gameOver: false, bonus: 0};
        // click on an already selected bubble
        if (this.selection.contains(pos)) {
            result = this.breakSelection();
        } else { // click on bubble which is not selected
            // cancel current selection and select new bubble(s)
            this.selection.clear();
            this.select(pos);
            // single bubble can not be selected
            if (this.selection.size() < 2) {
                this.selection.clear();
            }
        }
        return result;
    };
    
    this.handleClick = function (pos) {
        var result = {gameOver: false, bonus: 0};
        // round coordinates
        pos.x = Math.floor(pos.x / this.theme.cell.size);
        pos.x = Math.max(0, Math.min(this.columns - 1, pos.x));
        pos.x *= this.theme.cell.size;
        pos.y = Math.floor(pos.y / this.theme.cell.size);
        pos.y = Math.max(0, Math.min(this.rows - 1, pos.y));
        pos.y *= this.theme.cell.size;
        // a bubble has been clicked
        if (this.bubbles.contains(pos)) {
            result = this.bubbleClick(pos);
        } else { // click did not hit any bubble
            this.selection.clear();
        }
        this.draw();
        return result;
    };
    
}
