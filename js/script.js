'use strict';

window.addEventListener('DOMContentLoaded', () => {
    // обьявляем переменные внутри обработчика событий DOMContentLoaded

    // Tabs
    const tabs = document.querySelectorAll('.tabheader__item');
    const tabsContenct = document.querySelectorAll('.tabcontent');
    const tabsParent = document.querySelector('.tabheader__items');

    // функция скрытия всех не нужных табов и активностей

    function hideTabContent() {
        tabsContenct.forEach(item =>{
            // item.style.display = 'none'; статичний

            // добавляем анимацию через классы .show{display: block;}.hide{display: none;}
            //.fade{animation-name: fade;animation-duration: 1.5s;}@keyframes fade{from{opacity: 0.1;}to{opacity: 1;}}

            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });

    }

    // функция которая будет показывать все нужных табы и активности
    // если фкнкция вызивается без аргумента то по умолчанию i = 0

    function showTabContent(i = 0) {
        // tabsContenct[i].style.display = 'block';

        //добавляем анимацию через классы .show{display: block;}.hide{display: none;}
         //.fade{animation-name: fade;animation-duration: 1.5s;}@keyframes fade{from{opacity: 0.1;}to{opacity: 1;}}
        tabsContenct[i].classList.add('show', 'fade');
        tabsContenct[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();


    // делигирование событий = обработчик клика

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });


    // Timer

    const deadLine = new Date(2024, 1, 26, 20); // может приходить с разных источников

    // функция котороя расчитывает разницу между текущим временем и дедлайном
    function getTimeRemaining(endtime) {
         // Исправляем баг с датой которая прошла уже (задаем переменные отдельно)
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());// разница в милисекундах (расчёт)

            // Делаем проверку на меньше или равенство нулю и исправляєм баг (заполняем таймер нулями) => без лишних расчётов
            if (t <= 0){
                days = 0;
                hours = 0;
                minutes = 0;
                seconds = 0;
            }else{
                days = Math.floor(t / (1000 * 60 * 60 * 24)),
                hours = Math.floor((t / (1000 * 60 * 60) % 24)),
                minutes = Math.floor((t / 1000 / 60) % 60),
                seconds = Math.floor((t / 1000) % 60);
            }

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    // функция помошник что доставляєт 0 перед однозначными числами (для правильности)
    // проверяєм строку на количество символом и если один символ то перед числом стави 0
    function getZero(num) {
        if(num >= 0 && num < 10){
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) { //сетим часы на страницу
        const timer = document.querySelector(selector),
                days = timer.querySelector('#days'),
                hours = timer.querySelector('#hours'),
                minutes = timer.querySelector('#minutes'),
                seconds = timer.querySelector('#seconds'),
                timeInterval = setInterval(updateClock, 1000); //запустим сет интервал для выполнения фукции для часов 

        updateClock(); // убираем мерцание верстки уже утавновленого времени при обновлении старинцы
        // функция инициализации - раз запуститься установит текущую дату и исчезнит

        function updateClock() {
            const t = getTimeRemaining(endtime); // рассчет времени на данную секунду - результат работы фукции помещен в переменную
            
            // помещаєм на страницу получившися элементы (обновляєм)
            // юзаєм тут функцию помошника
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            // также нужно будет остановить интервал когда время закончится
            if (t.total <= 0) {
                clearInterval(timeInterval);
            }

        }

    }

    setClock('.timer', deadLine);


    // Modal Window
    // поцепили дата (data-modal) атрибути на кнопки для упрощения работы (только с ними для показа одного и того же дествия)
    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');
          // modalCloseBtn = document.querySelector('[data-close]'); // подправим (делегированием)


          
    // отдельная функция для вызова модального окна
    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = '';
        clearInterval(modalTimerId);
    }

    // цепляем обработчик событий на кнопки (добавляем (переключаем) клас) - перебираем все кнопки и цепляем на все

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });
            //modal.classList.add('show');
            //modal.classList.remove('hide');
    
            // вариант с toogle
            //modal.classList.toggle('show');

            /*
            // делаем так что бы страничка не скролилась при вызове модельного окна
            document.body.style.overflow = 'hidden';*/



    // don't repeat yourself (нельзя повторяться в коде) - лучше вынести в функцию
    function closeModel() {
        // вариант с toogle
        modal.classList.toggle('show');
        document.body.style.overflow = '';
    }

    // modalCloseBtn.addEventListener('click', closeModel); //функция будет выполенна после клика

        // вариант с добавлением класов
        //modal.classList.add('hide');
        //modal.classList.remove('show'););



    // закрытие модального окна кликая на подложку
    modal.addEventListener('click', (e) => { // добавим условие при закритии модалки
        if(e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModel();
        }
    });

    //Закрытие модельного окна через клавишу ESC и если он содержит класс show (что бы не всегда срабатывала функция)

    document.addEventListener('keydown', (e) => {
        if(e.code === 'Escape' && modal.classList.contains('show')) {
            closeModel();
        }
    });

    // коды клавиш https://www.toptal.com/developers/keycode


    // появление модального окна когда пользователь долистал сайт до конца
    const modalTimerId = setTimeout(openModal, 50000);

    //функция удаления обработчика событий scroll

    function showModalByScroll() {
        if (window.scrollY + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);
 //настройки появление однажды
    /*{once:true}*/



    

    // Используєм класи для карточек (update через rest оператор)
    class MenuCard {
        constructor(src, alt, title, desctription, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.desctription = desctription;
            this.price = price;
            this.classes = classes; //не подходит => || 'menu__item'
            //parentSelector родительский селектор для добавления нового div на старинцу
            this.parent = document.querySelector(parentSelector);
            this.transfer = 38; // статический курс
            this.changeToUAH();
        }

        // метод для конвертации валют
        changeToUAH () {
            this.price = this.price * this.transfer;
        }

        // метод создания верстки (update - логическая конструкция условия)
        render() {
            const element = document.createElement('div');
            
            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add (this.element);
            } else {
                // пройтись по каждому елементу классу вытащить название класа и подключить к названию класса
                this.classes.forEach(className => element.classList.add(className));
            }

            // удлаляем каждую информацию и передаем то что в класе как аргумент
            element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.desctription}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
                `;
                this.parent.append(element);//пуш новго div на страницу
        }

    }

    //Визов рендеринг структуры - вызов объэкта единажды и он исчезнит (без переменной) - используєм объэкт на месте
    
    // Вариант 1
    /*const div = new MenuCard();
    div.render();*/

    // передаем аргументы (с верстки в ковычках) + добавим все карточки на страницу
    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        '.menu .container'
        // добавляєм клас который будем помещать на страницу (пишем не через точку так как мы будем его помещать в масимв и использовать в класс листе)
    ).render();

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        14,
        '.menu .container'
    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        21,
        '.menu .container'
    ).render();

    // Чтобы не сломалась верстака удаляем с HTLM статичные карточки

    // Forms

    const forms = document.querySelectorAll('form');

    // сообщение что что-то произошло (объект) - хранилище сообщений
    const message = {
        loading: 'img/form/spinner.svg', // главное путь
        success: 'Спасибо! Скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    //Берем все формы (перебираем их) и накладываем фупкцию postData

    forms.forEach(item => {
        postData(item);
    });


    function postData(form) {
        // обработчик submit
        form.addEventListener('submit', (e) => {
            // отменяем старндартное поведение браузера + добавляем событие
            e.preventDefault();

            // Создание блока на сообщение message
            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading; //обращение к атрибуту через src 
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

            // отправим на страницу
            // form.append(statusMessage);
            // МЕТОД 2 (помещение елементов в разные места верстки)
            form.insertAdjacentElement('afterend', statusMessage);

            // При FormData setRequestHeader не нужен
            //request.setRequestHeader('Content-type', 'multipart/form-data');

            //При работе с JSON
           // request.setRequestHeader('Content-type', 'applicetion/json');

            // создание FormData - данные что заполнил пользователь
            const formData = new FormData (form);

            const object = {};
            formData.forEach(function(value, key) {
                object[key] = value;
            });

            fetch('server.php', {
                method: 'POST',
                headers: {'Content-type': 'applicetion/json' 
                },
                body: JSON.stringify(object) // Превращаем в JSON => object c formData
            })
            .then(data => data.text()) //данные в текстовом формате
            .then(data => {
                    console.log(data);

                    // тут будем вызывать функцию благодарности
                    //statusMessage.textContent = message.success;
                    showThanksModal(message.success);


                    // убирем таймаут (для загрузки)
                    statusMessage.remove();
            }).catch(() => {
                    showThanksModal(message.failure);
            }).finally(() =>{
                // очистим форму
                    form.reset();
            })

            // отправка
            //request.send(formData);
            
            /*request.addEventListener('load', () => {
                if (request.status === 200) {
                    console.log(request.response);

                    // тут будем вызывать функцию благодарности
                    //statusMessage.textContent = message.success;
                    showThanksModal(message.success);

                    // очистим форму
                    form.reset();

                    // убирем таймаут (для загрузки)
                    statusMessage.remove();
                } else {
                    showThanksModal(message.failure);
                }
            });*/
        });
    }


    // Красивое оповещение пользователя + сообщение при статусе отправки
    function showThanksModal (message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        
        //скарываем контент
        prevModalDialog.classList.add('hide');
        openModal(); // открытие модального окна

        // добавление елемента
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');

        // формирование верстки
        thanksModal.innerHTML = `
        <div class="modal__content">
            <div class="modal__close" data-close>×</div>
            <div class="modal__title">${message}</div>
        </div>
        `;

        // заапендим блок на страницу
        document.querySelector('.modal').append(thanksModal);

        //функционал если пользователь захочет отправить форму еще раз => (что бы все вернулось на свои места)
        // воизбежания накопления блоков
        setTimeout(() =>{
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.add('hide');
            closeModel();
        }, 4000);
    }

    fetch ('http://localhost:3000/menu')
    .then(data => data.json())
    .then(res => console.log(res));

});


