/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  purge: {
    content: ['./src/views/*.ejs'],
    theme: {
      extend: {
        colors: {
          cyanHover: 'rgb(175, 255, 255)',
          cyan: 'rgb(0, 226, 226)',
        },
        boxShadow: {
          saweria: '0.4rem 0.4rem 0 #222'
        },
        textColor: {
          mongo: '#00684A',
          lightMongo: '#00ED64',
          darkMongo: '#001E2B',
        },
        backgroundColor: {
          mongo: '#00ED64',
          darkMongo: '#001E2B',
          hoverMongo: '#00c251',
          bgMongo: '#00684A',
        },
        borderColor: {
          mongo: '#00ED64'
        }
      },
    },
  },
  plugins: [],
}

