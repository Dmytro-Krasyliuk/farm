let game = document.querySelector('.game')

// <div class="garden"></div>
function createGarden (w:number, h:number, x:number, y:number) {
    let newGarden = document.createElement('div')
    newGarden.classList.add('garden')
    newGarden.style.width = w + 'px';
    newGarden.style.height = h + 'px';
    newGarden.style.left = x + 'px';
    newGarden.style.top = y + "px";
    game?.append(newGarden)
}


export { createGarden };