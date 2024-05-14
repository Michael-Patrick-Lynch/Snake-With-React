import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider, extendTheme} from '@chakra-ui/react'
import App from './App.tsx'



const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.900', // A softer dark background color
        color: 'gray.200', // Light text color for better contrast
      },
      '*::placeholder': {
        color: 'gray.500', // Placeholder color for input fields
      },
      '*, *::before, *::after': {
        borderColor: 'gray.700', // Border color for all elements
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        bg: 'gray.800', // Background color for buttons
        color: 'gray.200', // Text color for buttons
        _hover: {
          bg: 'gray.700', // Background color on hover
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          bg: 'gray.800', // Background color for input fields
          color: 'gray.200', // Text color for input fields
          _placeholder: {
            color: 'gray.500', // Placeholder color for input fields
          },
        },
      },
    },
    Card: {
      baseStyle: {
        bg: 'gray.800', // Background color for cards
        color: 'gray.200', // Text color for cards
        borderColor: 'gray.700', // Border color for cards
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
