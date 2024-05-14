import Denque from 'denque';


const rows = 20;
const cols = 20;

// This is updated every iteration of the game loop, and holds the grid of cells.
// We pass it to the browser window using postMessage, where it is rendered in React
let gameGrid =  Array.from({ length: 20 }, () => Array(20).fill('black'));

// Contains the co-ordinates of the cherry that the snake is trying to eat
let cherryPosition = [1,2];

// snakeCells is a double sided queue containing the co-ordinates of all of
// the grid cells that contain parts of the snakes body
// Convention: The front co-ord is the head, back co-ord is the tail of the snake
let snakeCells = new Denque();

// Need to initalise snakeCells to hold the head
snakeCells.push([3, 7]);


let currentSnakeDirection = 'right';

let justAteCherry : boolean = false;



// Sends the current state of the game grid to a React component to be rendered
function sendGameGridToReactComponent() {
  postMessage(gameGrid);
}

// Grow the head in current movement direction,
// and remove the tail (unless snake just ate a cherry!)
function moveSnake(){
    let currentHeadPosition : Array<number> = snakeCells.peekFront();

    // The difference between the head position in 
    // any two frames is determined by current snake direction
    let offset : Array<number>;

    switch (currentSnakeDirection){
        case 'up' : offset = [-1, 0]; break;
        case 'down' : offset = [1, 0]; break;
        case 'right' : offset = [0, 1]; break;
        case 'left' : offset = [0, -1]; break;
        default : offset = [0, 0]; break;
    }

    // Calculate the new head position based on the current head position and the offset
    let newHeadPosition = [currentHeadPosition[0]+offset[0], currentHeadPosition[1]+offset[1]];

    // Handle snake going out of bounds
    if (newHeadPosition[0] < 0){
        newHeadPosition[0] = rows - 1;
    }
    else if (newHeadPosition[0] > rows - 1){
        newHeadPosition[0] = 0;
    }
    if (newHeadPosition[1] < 0){
        newHeadPosition[1] = cols - 1;
    }
    else if (newHeadPosition[1] > cols - 1){
        newHeadPosition[1] = 0;
    }

    // The head is always the first element in the deque
    snakeCells.unshift(newHeadPosition);

    // We only shrink the tail if the snake has not just eaten a cherry
    // This has the effect of growing the snake by 1 every time it eats a cherry
    if (!justAteCherry){
        snakeCells.pop();
    } else{
        justAteCherry = false;
    }
}

// If the snakes head is in the same cell as the cherry,
// we set justAteCherry to True and respawn the cherry
function checkIfSnakeWillEatCherry(){
    let currentHeadPosition : Array<number> = snakeCells.peekFront();

    if (arrayEquals(currentHeadPosition, cherryPosition)){
        justAteCherry = true;
        cherryPosition = [randomInRange(0,rows-1), randomInRange(0,cols-1)];
    }

}

// If the snakes head is in the same cell as any other
// part of its body, it is game over
function checkIfSnakeEatsItself(){
    let currentHeadPosition : Array<number> = snakeCells.peekFront();

    for (const snakeCellPosition of snakeCells.toArray()){
        if (arrayEquals(snakeCellPosition, currentHeadPosition) && !(snakeCellPosition === currentHeadPosition)){
            resetGame();
        }
    }
}

// Use the state of cherryPosition and snakeCells to create the game grid 2D array
function writeGameGrid(){
    // "Clear" the grid first by making every cell 'black'
    gameGrid =  Array.from({ length: 20 }, () => Array(20).fill('black'));

    // Then write the snake cells to the screen
    for (const cell of snakeCells.toArray()){
        gameGrid[cell[0]][cell[1]] = 'green';
    }

    // Then write the cherry to the grid
    gameGrid[cherryPosition[0]][cherryPosition[1]] = 'red';
}


self.onmessage = function(e: MessageEvent) {
  if (e.data === 'start') {
    (async function loop() {


    // So I guess this is our game loop?
      while (true) {

        // Handle user input:
        // Recieve message from React component

        // Game logic:
        moveSnake();
        checkIfSnakeWillEatCherry();
        checkIfSnakeEatsItself();

        // Render the screen
        writeGameGrid();
        sendGameGridToReactComponent();


        await delay(100); // 1 second delay
      }
    })();
  }
  else if (e.data === 'up'){
    currentSnakeDirection = 'up';
  }
  else if (e.data === 'down'){
    currentSnakeDirection = 'down';
  }
  else if (e.data === 'right'){
    currentSnakeDirection = 'right';
  }
  else if (e.data === 'left'){
    currentSnakeDirection = 'left';
  }
};

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Javascript has no built in function for this ???
function arrayEquals(a : Array<number>, b : Array<number>) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

// Generates a random number between min and max (inclusive of both)
function randomInRange(min : number, max : number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// When the player loses, run this to reset the game state
function resetGame(){
    snakeCells.clear();
    snakeCells.push([3, 7]);
    currentSnakeDirection = 'right';
    cherryPosition = cherryPosition = [1,2];
}