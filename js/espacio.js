/**
 * representaremos el espacio que existe en el juego
 */

class Space {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.id = `space-${x}-${y}`;
        this.token = null;
    }

    /**
     * detectar los eventos
     */
    get htmlSpace(){
        return document.getElementById(this.id);
    }

    /**
     * Comprobar si existe espacio y devuelve si está ocupado
     * @return {null || object} 
     */
    get owner(){
        if (this.token === null) {
            return null
        } else {
            return this.token.owner.name;
        }
    }

    /**
     * Creamos un html
     */
    renderHTMLSpace(){
        const space = document.createElement('li');
        space.setAttribute("class", "box");
        space.setAttribute("id", this.id);
        document.querySelector("ul.boxes").appendChild(space);
    }

    /**
     * marcamos el espacio como ocupado
     * @param {object} token - 
     */
    mark(token){
        this.token = token;
    }

}