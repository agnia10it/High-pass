import {
  src,
  dest,
  series,
  watch
} from 'gulp';

import concat from 'gulp-concat';
import htmlMin from 'gulp-htmlmin';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import svgSprite from 'gulp-svg-sprite';
import image from 'gulp-imagemin';
import browserSync from 'browser-sync';
import terser from 'gulp-terser';
import notify from 'gulp-notify';
import sourceMaps from 'gulp-sourcemaps';
import {
  deleteSync
} from 'del';



export async function cleanBuild() {
  return await deleteSync('build/**/*');
}
export async function cleanDev() {
  browserSync.create();
  return await deleteSync('dev/**/*');
}

// export function resourcesDev() {
//   return src('src/resources/**')
//     .pipe(dest('dev'))
// }

export function fontsDev() {
  return src(['src/fonts/**'], {
    encoding: false
  })
    .pipe(dest('dev/fonts'))
}

export function fontsBuild() {
  return src(['src/fonts/**'], {
    encoding: false
  })
    .pipe(dest('build/fonts'))
}

export function stylesBuild() {
  return src('src/css/**/*.css')
    .pipe(concat('main.css'))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(dest('build'))
}

export function stylesDev() {
  return src('src/css/**/*.css')
    .pipe(sourceMaps.init())
    .pipe(concat('main.css'))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS({
      level: 1
    }))
    .pipe(sourceMaps.write())
    .pipe(dest('dev'))
    .pipe(browserSync.stream())
}

export function htmlMinifyBuild() {
  return src('src/**/*.html')
    .pipe(htmlMin({
      collapseWhitespace: true
    }))
    .pipe(dest('build'))
}
export function htmlMinifyDev() {
  return src('src/**/*.html')
    .pipe(htmlMin({
      collapseWhitespace: true
    }))
    .pipe(dest('dev'))
    .pipe(browserSync.stream())
}

export function svgSpritesBuild() {
  return src('src/img/svg/**/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest('build/img'))
}

export function svgSpritesDev() {
  return src('src/img/svg/**/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest('dev/img'))
    .pipe(browserSync.stream())
}
// export function scriptsBuild() {
//   return src('src/js/**/*.js')
//     .pipe(babel({
//       presets: ['@babel/env']
//     }))
//     .pipe(concat('app.js'))
//     .pipe(terser())
//     .pipe(dest('build'))
// }

// export function scriptsDev() {
//   return src('src/js/**/*.js')
//     .pipe(sourceMaps.init())
//     .pipe(babel({
//       presets: ['@babel/env']
//     }))
//     .pipe(concat('app.js'))
//     .pipe(terser().on('error', notify.onError()))
//     .pipe(sourceMaps.write())
//     .pipe(dest('dev'))
//     .pipe(browserSync.stream())
// }

export function imagesBuild() {
  return src([
      'src/img/**/*.jpg',
      'src/img/**/*.png',
      'src/img/*.svg',
      'src/img/**/*.jpeg'
    ], {
      encoding: false
    })
    .pipe(image())
    .pipe(dest('build/img'))
}

export function imagesDev() {
  return src([
      'src/img/**/*.jpg',
      'src/img/**/*.png',
      'src/img/*.svg',
      'src/img/**/*.jpeg'
    ], {
      encoding: false
    })
    .pipe(image())
    .pipe(dest('dev/img'))
    .pipe(browserSync.stream())
}

export function watchFiles() {
  browserSync.init({
    server: {
      baseDir: 'dev'
    }
  });
}

watch('src/**/*.html', htmlMinifyDev);
watch('src/**/*.css', stylesDev);
watch('src/img/svg/**/*.svg', svgSpritesDev);
watch([
  'src/img/**/*.jpg',
  'src/img/**/*.png',
  'src/img/*.svg',
  'src/img/**/*.jpeg'
], imagesDev);
// watch('src/js/**/*.js', scriptsDev);
// watch('src/resources/**', resourcesDev)

export const build = series(cleanBuild, htmlMinifyBuild, stylesBuild, imagesBuild, svgSpritesBuild, fontsBuild/* , scriptsBuild */);

export default series(cleanDev, htmlMinifyDev, stylesDev, imagesDev, svgSpritesDev, /* scriptsDev, resourcesDev, */ fontsDev, watchFiles);

