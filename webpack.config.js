

module.exports = {
    entry: ['whatwg-fetch', './src/index.js'],    // Het bestand/directory met ES2015-code
    output: {
        path: './dist/js',           // De directory waarin Webpack omgeschreven bestanden opslaat.
        filename: 'bundle.js'     // De naam van het bestand met de omgeschreven ES2015 code (ES5 dus).
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loaders: [ 'style', 'css', 'sass' ]
            },
            {
                loader: 'babel-loader',     // Zorgt ervoor dat Webpack Babel kan gebruiken.
                exclude: /node_modules/,    // Negeer node_modules map

                test: /\.js?$/,             // Test of een entrybestand JavaScript is.
                query: {
                    presets: ['es2015']       // De preset die de omzet van ES2015 -> ES5 doet.
                }
            }
        ]
    }
}
