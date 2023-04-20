/**
 * maneja los estados del juego
 */

class Game {
    constructor(vsComputer = false){
        //this.vsComputer = vsComputer
        this.board = new Board();
        this.players = this.createPlayers();
        this.win = false;
        this.turns = 0;
        this._ready = false;
    }

    /**
     * Determinamso cual será el jugador ganador o empate
     * @return {object} 
     */
    get activePlayer() {
        return this.players.find(player => player.active);
    }

    get ready(){
        return this._ready
    }

    set ready(val){
        this._ready = val
    }

    /**
     * Creamos dos jugadores
     
     */
    createPlayers(){
        const player1Input = document.getElementById("player-1-name").value;
        const player1Name = player1Input.trim().length > 0 ? player1Input : "Player 1";
        const p1Active = Math.floor(Math.random() * 2) === 0;
        let player2;
       
            const player2Input = document.getElementById("player-2-name").value;
            const player2Name = player2Input.trim().length > 0 ? player2Input : "Player 2";
            player2 = new Player(player2Name, 'player2', '#3688C3', !p1Active)
        
        return [
            new Player(player1Name, "player1", "#FFA000", p1Active),
            player2
        ];
    }

    /**
     * Ajustamos el html para pasar el turno al siguiente jugador
    
     */
    playerTurn(){
        this.ready = true
        const unactivePlayer = this.players.find(player => !player.active);
        const activePlayer = this.activePlayer;
        document.getElementById(unactivePlayer.id).classList.remove('active');
        document.getElementById(activePlayer.id).classList.add('active');
        
        if (activePlayer.name === 'Computer'){
            activePlayer.makeMove()
        }
    }

    /**
     * Cambiamos el jugador despues de un clic
     */
    switchPlayers(){
        for (let player of this.players) {
            player.active = player.active === true ? false : true;
        }
    }

    /**
     * Imprimimos los resultados enviando mensajes
     * @param {string} message 
     */
    gameOver(message, result){
        const finish = document.getElementById('finish');
        const winnerTally = document.querySelector(`.${this.activePlayer.id}-wins span.win-num`)
        finish.classList.remove("screen-win-tie", "screen-win-one", "screen-win-two")
        let screenStyle; 
        document.getElementById('board').style.display = 'none';

        if (result === 'draw') {
            screenStyle = 'screen-win-tie';
            finish.style.backgroundColor = '#54D17A';
        } else {
            screenStyle = this.activePlayer.id == 'player1' ? 'screen-win-one' : 'screen-win-two';
            finish.style.backgroundColor = this.activePlayer.color;
            winnerTally.textContent = parseInt(winnerTally.textContent) + 1
        }
        
        finish.style.display = 'block';
        finish.classList.add(screenStyle);
        document.querySelector('p.message').textContent = message;
    }

    /**
     * Si pasan 9 turnos y no hay un ganador declaramos empate
     * @return {boolean} - empate retorna falso o verdadero
     */
    checkForDraw(){
        let draw = false;
        if (!this.win && this.turns == 9) {
            draw = true;
        }
        return draw;
    }

    /**
     * Revisamos los espacios horizontales y verticales, como diagonales
     * @param {object} target 
     * @return {boolean} 
     */
    checkForWinner(target){
        const owner = target.owner;
        let win = false;

        //vertical
        for (let x = 0; x < this.board.cols - 2; x++) {
            for (let y = 0; y < this.board.rows; y++) {
                if (this.board.spaces[x][y].owner === owner && 
                    this.board.spaces[x + 1][y].owner === owner &&
                    this.board.spaces[x + 2][y].owner === owner ) {
                    win = true;
                    return win;
                }
            }
        }

        //horizontal
        for (let x = 0; x < this.board.cols; x++) {
            for (let y = 0; y < this.board.rows - 2; y++) {
                if (this.board.spaces[x][y].owner === owner && 
                    this.board.spaces[x][y + 1].owner === owner &&
                    this.board.spaces[x][y + 2].owner === owner ) {
                    win = true;
                    return win;
                }
            }
        }

        //diagonal (arriba izquierda - abajo derecha)
        if (this.board.spaces[0][0].owner === owner && 
            this.board.spaces[1][1].owner === owner &&
            this.board.spaces[2][2].owner === owner) {
                win = true;
                return win;
        }

        //diagonal (arriba derecha - abajo izquierda)
        if (this.board.spaces[0][2].owner === owner && 
            this.board.spaces[1][1].owner === owner &&
            this.board.spaces[2][0].owner === owner) {
                win = true;
                return win;
        }

        return win;
    }

    /**
     * actualizamos el estado del juego y buscamos ganador
     * @param {object} token 
     * @param {object} targetSpace 
     */
    updateGameState(token, targetSpace){
        this.turns++;

        //Marcamos el espacio y establecesmos que la ficha ya fue jugada
        targetSpace.mark(token);
        token.played = true;
        //revisamos si hay empate o victoria
        const gameIsOver = this.checkForWinner(targetSpace);
        const draw = this.checkForDraw();
        if (gameIsOver) {
            this.win = true;
            this.gameOver(`${this.activePlayer.name} Ganador!`, 'win');
        } else if (draw) {
            this.gameOver('Empate!', 'draw');
        } else {
            this.switchPlayers();
            this.playerTurn();
        }
    }

    /**
     * alternamos la imagen de la ficha mientras el jugador desplaza el raton
     * @param {object} e - Evento del raton
     */
    handleMouseOver(e){
        if (this.ready) {
            if (e.target.classList.contains('box-filled-1') || e.target.classList.contains('box-filled-2')) {
                return;
            }
            if (!e.target.classList.contains('box')) {return;}
            e.target.style.backgroundImage = `url(${this.activePlayer.activeToken.tokenPath})`;
        }
    }

    /**
     * Eliminar la imagen de la ficha cuando sale del espacio
     * @param {object} e - Evento del raton
     */
    handleMouseOut(e){
        if (this.ready) {
            if (e.target.classList.contains('box-filled-1') || e.target.classList.contains('box-filled-2')) {
                return;
            }
            if (!e.target.classList.contains('box')) {return;}
            e.target.style.backgroundImage = "";
        }
    }

    /**
     * Ocupamos el estacio con solo hacer clic
     * @param {object} e - el evento clic
     */
    handleClick(e){
        if (this.ready) {
            if (e.target.classList.contains('box-filled-1') || e.target.classList.contains('box-filled-2')) { return; }
            if (!e.target.classList.contains('box')) { return; }
            //Mientra el juego se actualiza el jugador queda en false
            this.ready = false;

            //Marcamos el destino
            const fillClass = this.activePlayer.id == 'player1' ? 'box-filled-1' : 'box-filled-2';
            e.target.classList.add(fillClass);

            //Actualizamos el estado del juego
            const spaceId = e.target.id;
            const token = this.activePlayer.activeToken;
            const targetSpace = this.board.findSpace(spaceId);
            this.updateGameState(token, targetSpace);
        }
    }

    /**
     * inciamos el juego
     */
    startGame(){
        this.board.renderHTMLBoard();
        const p1NameCard = document.querySelector(".player1-name");
        const p2NameCard = document.querySelector(".player2-name");
        p1NameCard.textContent = this.players[0].name;
        p1NameCard.style.color = this.players[0].color;
        p2NameCard.textContent = this.players[1].name;
        p2NameCard.style.color = this.players[1].color;
        this.playerTurn();      
    }
}