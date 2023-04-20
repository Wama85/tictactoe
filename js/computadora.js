/**
 * con esta clase definiremos los movientos que hará la computadora
 * 
 * 
 */

class Computer extends Player {
  constructor(...props){
    super(...props)
  }

 
  makeMove(){
    const boardSpaces = document.querySelectorAll('ul.boxes')[0].children;
    const availalbeSpaces = []
    for (let i = 0; i < boardSpaces.length; i++){
      if (!boardSpaces[i].classList.contains('box-filled-1') && 
          !boardSpaces[i].classList.contains('box-filled-2')) {
        availalbeSpaces.push(boardSpaces[i])
      }
    }
    const randNum = Math.floor(Math.random() * availalbeSpaces.length)
    const selectedSpace = availalbeSpaces[randNum]
    selectedSpace.click()
  }

}