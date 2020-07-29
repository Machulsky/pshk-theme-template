module.exports = { 
  entry: { 
    app: './src/js/app.js',
   },
  module: { 
    rules: [ 
      { 
        test: /\.(js)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: [ 
            ['latest', { modules: false } ]
          ]
         }
       }
     ]
   },

   externals: { 

    },

    mode: 'production',

    output: {
      filename: '[name].js',
    },

    optimization: {
      splitChunks: {
       chunks: 'all',
       },
      minimize: false,
  },
 }