/**
 * Cada jugador tendrá un ícono y estara asociado
 */

class Player {
    constructor(name, id, color, active = false){
        this.name = name;
        this.id = id;
        this.color = color;
        this.active = active;
        this.tokens = this.createTokens(5); //método para crear las fichas de cada jugador
    }

    /**
     * Determinamos que fichas no se han jugado
     * @return {array} Fichas no utilizadas;
     */
    get unusedTokens(){
        const unusedTokens = this.tokens.filter(token => !token.played);
        return unusedTokens;
    }

    /**
     * Sacamos la ficha del jugador no usada para usarla la siguiente
     * @return {object} La primera ficha en el tablero
     */
    get activeToken(){
        return this.unusedTokens[0];
    }

    /**
     * a cada jugador se asigna 5 fichas
     * @param {integer} numOfTokens - numero de fichas creadas
     * @return {array} tabla de las fichas
     */
    createTokens(numOfTokens){
        const tokens = [];
        for (let i = 0; i < numOfTokens; i++) {
            const token = new Token(this, i);
            tokens.push(token);
        }
        return tokens;
    }
}