
let pug_enable = false

let gulp            = require ( 'gulp' ),
    sass            = require ( 'gulp-sass' ),
    clean_css       = require ( 'gulp-clean-css' ),
    browser_sync    = require ( 'browser-sync') .create ( ),
    pug             = require ( 'gulp-pug' ),
    inject          = require ( 'gulp-inject' ),
    concat          = require ( 'gulp-concat' ),
    uglify          = require ( 'gulp-uglify' ),
    rename          = require ( 'gulp-rename' ),
    webpack         = require ( 'webpack' ),
    webpack_config  = require ( './webpack.config.js' ),
    webpack_stream  = require ( 'webpack-stream' ),
    terser          = require ( 'gulp-terser' ),
    del             = require ( 'del' ),
    imagemin        = require ( 'gulp-imagemin' ),
    rollup          = require ( 'gulp-rollup' )


gulp.task ( 'css-min', ( ) => { 
    return gulp.src ( 'src/scss/**/*.+(scss|sass)' )
    .pipe ( sass ( ).on ( 'error', sass.logError ) )
    .pipe ( clean_css ( { compatability: 'ie8' } ) )
    .pipe ( rename ( { suffix: '.min' } ) )
   // .pipe ( gulp.dest ( '.tmp/css/' ) )
    .pipe ( gulp.dest ( 'dist/css/' ) )
} )


gulp.task ( 'css', ( ) => { 
    return gulp.src ( 'src/scss/**/*.+(scss|sass)' )
    .pipe ( sass ( ).on ( 'error', sass.logError ) )
    //.pipe ( gulp.dest ( '.tmp/css/' ) )
    .pipe ( gulp.dest ( 'dist/css/' ) )
} )


gulp.task ( 'js', ( ) => { 
    return gulp.src ( 'src/js/*.js' )
    //.pipe ( rollup ( { input: 'src/js/app.js', format: 'iife' } ) )
    .pipe ( webpack_stream ( webpack_config ), webpack )
    //.pipe ( terser ( ) )
    .pipe ( gulp.dest ( 'dist/js/' ) )
    .pipe ( terser ( ) )
    .pipe ( rename ( { suffix: '.min' } ) )
    //.pipe ( gulp.dest ( '.tmp/js/' ) )
    .pipe ( gulp.dest ( 'dist/js/' ) )

 } )



 gulp.task ( 'img', ( ) => { 
    return gulp.src ( 'src/img/**/*.+(png|svg|jpg|webp|gif)' )
    .pipe ( imagemin ( ) )
    .pipe ( gulp.dest ( 'dist/img/' ) )
  } )


gulp.task ( 'html', ( ) => { 
    return gulp.src ( 'src/**/*.html' )
    .pipe ( gulp.dest ( 'dist/' ) )
 } )

 gulp.task ( 'html-inject', ( ) => { 
     return gulp.src ( 'dist/**/*.html' )
     .pipe ( inject ( gulp.src ( [ 'dist/js/vendors~app.min.js', 'dist/js/app.min.js', 'dist/css/libs.min.css', 'dist/css/styles.min.css' ], { allowEmpty: true, read: false } ), { addRootSlash: false, relative: true, empty: true, removeTags: true } ) )
     .pipe ( gulp.dest ( 'dist/' ) )
} )

gulp.task ( 'serve', ( ) => {
    browser_sync.init ( { server: { baseDir: './public' } }, gulp.series ( 'dev:build' ) )
    browser_sync.watch ( 'src', browser_sync.reload)
    gulp.watch ( 'src/scss/**/*.+(scss|sass)', gulp.series ( 'dev:css' ) )
    if ( pug_enable )  gulp.watch ( 'src/pug/*.pug', gulp.series ( 'dev:pug', 'dev:html', 'dev:inject' ) )
    if ( !pug_enable )  gulp.watch ( 'src/*.html', gulp.series ( 'dev:html', 'dev:inject' ) )
    gulp.watch ( 'src/js/*.js', gulp.series ( 'dev:js' ) )
    gulp.watch ( 'public/js/app.js', browser_sync.reload )
    gulp.watch ( 'src/img/**/*.+(png|svg|jpg|webp|gif)', gulp.series ( 'dev:img' ) )
    gulp.watch ( 'src/fonts/**/*.*', gulp.series ( 'fonts' ) )
    gulp.watch ( 'src/vendor/**/*.*', gulp.series ( 'vendor' ) )
} )


gulp.task ('vendor', () => {
    return gulp.src ( 'src/vendor/*/**.*' )
    .pipe( gulp.dest ('public/vendor/') )
})

gulp.task ( 'dev:css', ( ) => { 
    return gulp.src ( 'src/scss/**/*.+(scss|sass)' )
    .pipe ( sass ( ).on ( 'error', sass.logError ) )
    .pipe ( gulp.dest ( 'public/css/' ) )
} )


gulp.task ( 'fonts', () => { 
    return gulp.src ( 'src/fonts/**/*.*' )
    .pipe( gulp.dest ( 'public/fonts/' ) )
    .pipe( gulp.dest ( 'dist/fonts/' ) )
 } )


gulp.task ( 'dev:js', ( ) => { 
    return gulp.src ( 'src/js/app.js' )
    .pipe ( webpack_stream ( webpack_config ), webpack )
    // .pipe ( terser ( ) )
    .pipe ( gulp.dest ( 'public/js/' ) )
 } )

gulp.task ( 'dev:pug', ( ) => {
    return gulp.src ( 'src/pug/*.pug' )
    .pipe ( pug ( { pretty: true } ) )
    .pipe ( gulp.dest ( 'src/' ) )
} )


gulp.task ( 'dev:html', ( ) => { 
    return gulp.src ( 'src/*.html' )
    .pipe( gulp.dest ( 'public/' ) ) 
 } )

 gulp.task ( 'dev:img', (  ) => { 
     return gulp.src ( 'src/img/**/*.+(png|svg|jpg|webp|gif)' )
     .pipe ( gulp.dest ( 'public/img/' ) )
  } )

gulp.task ( 'dev:inject', ( ) => { 
    return gulp.src ( 'public/*.html' )
    .pipe ( inject ( gulp.src ( [ 'public/js/vendors~app.js', 'public/js/app.js', 'public/css/*.css' ] ), { addRootSlash: false, relative: true } ) )
    .pipe ( gulp.dest ( 'public/' ) )
 } )

 gulp.task ( 'clean:public', ( ) => { 
     return del ( 'public' )
  } )

  gulp.task ( 'clean:dist', ( ) => { 
    return del ( 'dist' )
 } )



if ( pug_enable ) { 
    gulp.task ( 'dev:build', gulp.series ( 'dev:js', 'dev:pug', 'dev:html', 'dev:css', 'fonts', 'dev:inject', 'dev:img' ), ( ) => { } )
    gulp.task ( 'build', gulp.series ( 'clean:dist', 'clean:public', 'js', 'dev:pug', 'css-min', 'css', 'html', 'img', 'html-inject', 'js-libs', 'fonts' ), ( ) => { } )
}
if ( !pug_enable ) {
    gulp.task ( 'dev:build', gulp.series ( 'dev:js', 'dev:html', 'dev:css', 'fonts', 'dev:inject', 'dev:img' ), ( ) => { } )
    gulp.task ( 'build', gulp.series ( 'clean:dist', 'clean:public', 'js', 'css-min', 'css', 'html', 'img', 'html-inject', 'fonts' ), ( ) => { } )
}



