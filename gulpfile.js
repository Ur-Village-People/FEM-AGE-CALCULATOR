const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browsersync = require('browser-sync').create();
const webpack = require('webpack-stream');
const obfuscator = require('gulp-javascript-obfuscator');
const isProd = process.env.NODE_ENV === 'production';
function copyTask() {
    return src(['*.html', 'assets/**/*'], { base: '.' })
        .pipe(dest('dist'));
}
function scssTask() {
    return src('app/scss/style.scss', { sourcemaps: !isProd })
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
exports.default = series(scssTask, jsTask, copyTask, browserSyncServe, watchTask);
exports.build = series(
    (cb) => { process.env.NODE_ENV = 'production'; cb(); }, 
    scssTask, 
    jsTask, 
    copyTask
);