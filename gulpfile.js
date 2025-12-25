const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const browsersync = require('browser-sync').create();
const webpack = require('webpack-stream');
const obfuscator = require('gulp-javascript-obfuscator');

// Logic to check if we are in production mode
const isProd = process.env.NODE_ENV === 'production';

function copyTask() {
    return src(['*.html', 'assets/**/*'], { base: '.' })
        .pipe(dest('dist'));
}

function scssTask() {
    return src('app/scss/style.scss', { sourcemaps: !isProd }) // Sourcemaps only in dev
        .pipe(sass({
            includePaths: ['./app/scss/globals', './app/scss/components', './app/scss/util']
        }).on('error', sass.logError))
        .pipe(postcss([
            autoprefixer(),
            ...(isProd ? [cssnano({ preset: ['advanced', { discardComments: { removeAll: true }, reduceIdents: true }] })] : [])
        ]))
        .pipe(dest('dist', { sourcemaps: '.' }));
}

function jsTask() {
    let stream = src('app/js/script.js')
        .pipe(webpack({
            mode: isProd ? 'production' : 'development',
            // CRUCIAL: 'eval-source-map' allows Console Ninja to find your code
            devtool: isProd ? false : 'eval-source-map',
            output: {
                filename: 'script.js',
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: ['@babel/preset-env']
                            }
                        }
                    }
                ]
            }
        }));

    // Only obfuscate if we are in production mode
    // Obfuscation breaks Console Ninja's ability to read variables
    if (isProd) {
        stream = stream.pipe(obfuscator({
            compact: true,
            controlFlowFlattening: true,
            numbersToExpressions: true,
            simplify: true,
            stringArray: true,
            stringArrayThreshold: 0.75
        }));
    }

    return stream.pipe(dest('dist'));
}

function browserSyncServe(cb) {
    browsersync.init({
        server: {
            baseDir: 'dist',
        },
        notify: {
            styles: {
                top: 'auto',
                bottom: '0',
            },
        },
    });
    cb();
}

function browserSyncReload(cb) {
    browsersync.reload();
    cb();
}

function watchTask() {
    watch('*.html', series(copyTask, browserSyncReload));
    watch(
        ['app/scss/**/*.scss', 'app/js/**/*.js'],
        series(scssTask, jsTask, browserSyncReload)
    );
}

// Default Task: Run this for development (Console Ninja will work here)
exports.default = series(scssTask, jsTask, copyTask, browserSyncServe, watchTask);

// Build Task: Run this for final deployment (Obfuscation will be active)
exports.build = series(
    (cb) => { process.env.NODE_ENV = 'production'; cb(); }, 
    scssTask, 
    jsTask, 
    copyTask
);