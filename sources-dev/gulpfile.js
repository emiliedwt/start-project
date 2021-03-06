var output = '../site/';

var gulp      = require('gulp'),
    rename    = require('gulp-rename'),    
    compass = require('gulp-compass'),      
    minifyCss = require('gulp-minify-css'),
    uglify    = require('gulp-uglify'),    
    plumber   = require('gulp-plumber'),   
    gutil     = require("gulp-util"),
    autoprefixer = require("gulp-autoprefixer"),
    uncss     = require("gulp-uncss"),
    extender  = require("gulp-html-extend"),
    concat    = require('gulp-concat'),
    imagemin  = require('gulp-imagemin'),
    pngquant  = require('imagemin-pngquant');
    htmlreplace = require('gulp-html-replace'),
    options	  = require("minimist")(process.argv.slice(2));


// SCSS TASK
gulp.task('css', function() 
{
  return gulp.src('./sass/*.scss')
  	.pipe(plumber())				// evite les plantage en mode watch
    .pipe(compass({
      config_file: './config.rb',
      css: '../site/css',
      sass: 'sass',
      sourcemap: true
    }))					// compile les scss en css
    .pipe(autoprefixer())			// ajoute les prefixes navigateur
    // .pipe(uncss({				// supprime les css non utilisé (attention au css injecté en js)
    //   html: ['./*.html']
    // }))
    .pipe(rename({					// renomme l'extension du fichier
      extname: ".css"
    }))               
    .pipe(gulp.dest(output + 'css/'));
});

// SCSS TASK
gulp.task('css-prod', function() 
{
  return gulp.src('./sass/**/*.scss')
    .pipe(compass({
      config_file: './config.rb',
      css: '../site/css',
      sass: 'sass'
    }))
    .pipe(autoprefixer())
    // .pipe(uncss({
    //     html: 'index.html'
    // }))
    .pipe(rename({
      suffix: '.min',
      extname: ".css"
    }))               
    .pipe(minifyCss())             	// minifie les css    
    .pipe(gulp.dest(output + 'css/'));
});

// FONT TASK
gulp.task('font', function() 
{
  return gulp.src('./font/**/*.{otf,ttf,eot,svg,woff,woff2}')
    .pipe(gulp.dest(output + 'font/'));
});

// JAVASCRIPT TASK
gulp.task('js', function() 
{
  return gulp.src('./js/**/*.js')
    .pipe(uglify())					// minifie les js
    .pipe(concat('main.min.js'))	// concatène tous les js
    .pipe(gulp.dest(output + 'js/'));
});

// IMAGE TASK
gulp.task('img', function () {
  return gulp.src('./img/**/*.{png,jpg,jpeg,gif,svg}')
    .pipe(imagemin({				// optimise le poids des images
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))	
    .pipe(gulp.dest(output + 'img/'));
});

// HTML TASK
gulp.task('html', function() {
  return  gulp.src(['*.html'])
    .pipe(extender({				// autorise l'utilisation d'include dans les html
      annotations: false,
      verbose: false
    }))
    .pipe(gulp.dest(output))
});

// HTML PROD TASK
gulp.task('html-prod', function() {
  return  gulp.src(['*.html'])
  	.pipe(extender({
      annotations: false,
      verbose: false
    }))
    .pipe(htmlreplace({				// remplace la css chargé par la version minifiée
        'css': 'main.min.css'
    }))
    .pipe(gulp.dest(output))
});

// WATCH TASK
gulp.task('watch', function() 
{
  gulp.watch('./sass/**/*', ['css']);
  gulp.watch('./js/**/*', ['js']);
  gulp.watch(['*.html', 'tpl/**/*.html'],['html']);
  gulp.watch(['./img/**/*'],['img']);

});

// WATCH TASK
gulp.task('dev', ['css', 'font', 'js', 'img', 'html']);
gulp.task('prod', ['css-prod', 'font', 'js', 'img', 'html-prod']);