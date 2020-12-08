"use strict";

// Импортируем модули из node_modules которые мы установили
const gulp = require("gulp");
const webpack = require("webpack-stream");
const browsersync = require("browser-sync");

const dist = "./dist/"; //задаем переменную для папки в которую помещаем чистый проект
// const dist = 'C:/OpenServer/domains/localhost';

gulp.task("copy-html", () => {                //task по отслеживанию изменения в html файле
    return gulp.src("./src/index.html")       //указываем путь к файлу который отслеживаем
                .pipe(gulp.dest(dist))        //перемещаем данный файл в папку dist
                .pipe(browsersync.stream());  //запускаем browsersync чтобы страница перезагрузилась
});

gulp.task("build-js", () => {                 //task по компиляции скриптов
    return gulp.src("./src/js/main.js")       //указываем путь к файлу скриптов
                .pipe(webpack({               //запускаем webpack
                    mode: 'development',      //режим разработки
                    output: {
                        filename: 'script.js' //указываем куда будет складываться компилированный скрипт
                    },
                    watch: false,             
                    devtool: "source-map",    //карта проектов
                    module: {                 //подключаем модули webpack, в нашем случае babel
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,  //исключаем из папок для поисков 
                            use: {
                              loader: 'babel-loader',  // подключаем babel
                              options: {
                                presets: [['@babel/preset-env', { //выбираем preset для babel
                                    debug: true,                  //подключаем debug, для отслеживания ошибок
                                    corejs: 3,  //настройки библиотеки corejs(подключен в package.json), для полифилов
                                    useBuiltIns: "usage"  //при компиляции, corejs смотрит на script.js, затем
                                }]]                       //на brow-list и подкл. полифилы которые нам нужны в проекте
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist)) //после, файл который получился отправляем в dist
                .on("end", browsersync.reload); //перезагружаем нашу страницу
});

gulp.task("copy-assets", () => {                  //отслеживаем изменения в папках
    return gulp.src("./src/assets/**/*.*")        //отслеживаем все изменения по указанным путям
                .pipe(gulp.dest(dist + "/assets"))//при изменении все файлы перемещаем по определенному адресу
                .on("end", browsersync.reload);   //затем перезагружаем нашу страницу
});

gulp.task("watch", () => {        //запуск отдельного сервера 
    browsersync.init({            //внутри сервера запускаем browsersync
		server: "./dist/",            //browsersync серверит файлы которые находятся в папке dist
		port: 4000,                   //указываем порт 4000 для сервера
		notify: true                  //уведомление
    });
    
    //запуск gulp для слежки за файлами, и запуск определенной команды при изменении - паралельно(copy-html итд)
    gulp.watch("./src/index.html", gulp.parallel("copy-html")); 
    gulp.watch("./src/assets/**/*.*", gulp.parallel("copy-assets"));
    gulp.watch("./src/js/**/*.js", gulp.parallel("build-js"));
});


//запуск (copy-html, copy-assets, build-js) по вызову - необходимо для первичного запуска gulp 
//(возможно файлы до запуска gulp уже поменялись)
gulp.task("build", gulp.parallel("copy-html", "copy-assets", "build-js")); 

gulp.task("build-prod-js", () => { //то же самое что и build js только в чистовом виде для Prodaction
    return gulp.src("./src/js/main.js")
                .pipe(webpack({
                    mode: 'production',
                    output: {
                        filename: 'script.js'
                    },
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(dist));
});


//запуск задачи по умолчанию при первом запуске gulp. 
//build - первичный запуск, вдруг файлы поменялись до запуска gulp - чистовая копия
//watch - запуск отслеживания изменении файлов
gulp.task("default", gulp.parallel("watch", "build"));