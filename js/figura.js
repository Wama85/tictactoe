/**
 * Cada jugador tendrá una ficha
 *
 */

class Token {
    constructor(owner, index) {
        this.owner = owner;
        this.id = `token-${index}-${owner.id}`; 
        this.played = false;
    }

    get tokenPath(){
        let tokenPath = "";
        if (this.owner.id === "player1") {
            tokenPath = 'img/o.svg';
        } else {
            tokenPath = 'img/x.svg';
        }
        return tokenPath;
    }

    /**
     * Obtenemos la ruta de la ficha y almacenamos una referencia
    
     */
    renderHTMLToken(){
        let tokenPath = "";
        if (this.owner.id === "player1") {
            tokenPath = '../img/o.svg';
        } else {
            tokenPath = '../img/x.svg';
        }
        const tokenId = this.id;
        return [tokenPath, tokenId];
    }

   
    get htmlToken(){
        return document.getElementById(this.id);
    }

}