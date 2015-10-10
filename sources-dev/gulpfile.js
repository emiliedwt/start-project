var output = '../site/';

var gulp      = require('gulp'),
    rename    = require('gulp-rename'),    
    sass      = require('gulp-sass'),      
    minifyCss = require('gulp-minify-css'),
    uglify    = require('gulp-uglify'),    
    plumber   = require('gulp-plumber'),   
    gutil     = require("gulp-util"),
    autoprefixer = require("gulp-autoprefixer"),
    uncss     = require("gulp-uncss"),
    extender  = require("gulp-html-extend"),
    sourcemaps = require('gulp-sourcemaps'),
    concat    = require('gulp-concat'),
    imagemin  = require('gulp-imagemin'),
    htmlreplace = require('gulp-html-replace'),
    options	  = require("minimist")(process.argv.slice(2));


// SCSS TASK
gulp.task('css', function() 
{
  return gulp.src('./sass/*.scss')
  	.pipe(plumber())				// evite les plantage en mode watch
  	.pipe(sourcemaps.init())		// facilite le debug des css
    .pipe(sass())					// compile les scss en css
    .pipe(sourcemaps.write())
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
    .pipe(sass())
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
    .pipe(imagemin())				// optimise le poids des images
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
gulp.task('dev', ['css', 'js', 'img', 'html']);
gulp.task('prod', ['css-prod', 'js', 'img', 'html-prod']);