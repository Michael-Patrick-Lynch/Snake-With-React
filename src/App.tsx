import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import { Grid, GridItem, Box, AspectRatio, Heading} from '@chakra-ui/react'
import './App.css'


const initialGameGrid =  Array.from({ length: 20 }, () => Array(20).fill('blue'));
const gameOverGrid =  Array.from({ length: 20 }, () => Array(20).fill('yellow'));

function App() {

  const [gameGrid, setGameGrid] = useState<string[][]>(initialGameGrid);

  useEffect(() => {
    // We have a worker thread to handle updating the game state 
    // and running the game loop. We pass in user input and get back 
    // the current state of the board
    const worker = new Worker(new URL('./Snake.ts', import.meta.url), { type: 'module' });

    worker.postMessage('start');
    worker.onmessage = function(e) {
      if (e.data == 'Game over'){
        setGameGrid(gameOverGrid);
        
      } else {
        setGameGrid(e.data)
      }
    }

    // Event handler to handle user input
    const handleKeyDown = (event : KeyboardEvent) => {
      let direction;

      // Determine the direction to be sent based on the key pressed 
      switch (event.key){
        case 'ArrowUp' : direction = 'up'; break;
        case 'ArrowDown' : direction = 'down'; break;
        case 'ArrowLeft' : direction = 'left'; break;
        case 'ArrowRight' : direction = 'right'; break;
        default : return; // Ignore other keys
      }

      // Send the direction to the web worker
      worker.postMessage(direction);
    };

    // Assign the handleKeyDown handler to be called every time there is a key press
    document.addEventListener('keydown', handleKeyDown);


    return() => {
      document.removeEventListener('keydown', handleKeyDown);
      worker.terminate(); // Cleanup the worker when we unmount the component
    };
  }, []);

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <Heading>
        Snake
        </Heading>

      <Box w='40%' margin={'auto'}>
          <Grid templateColumns="repeat(20, 1fr)" gap={.5}>
            {gameGrid.map((row, rowIndex) =>
              row.map((color, colIndex) => (
                <AspectRatio key={`${rowIndex}-${colIndex}`} ratio={1}>
                  <GridItem h="40%" w="40%" bg={color} />
                </AspectRatio>
              ))
            )}
          </Grid>
        </Box>

        
      <p className="read-the-docs">
        Built with React, Chakra UI, and TypeScript
      </p>
    </>
  )
}

export default App