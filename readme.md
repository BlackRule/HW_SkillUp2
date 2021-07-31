Deadline 24 июля

Задание для фронтенд:

Необходимо подготовить внешний вид нашего приложения, примерный вариант представлен на скриншоте и на макете figma.

1. Использовать можно HTML, CSS, CSS препроцессоры, VanillaJS.
2. Внешний вид полностью на ваше усмотрение, обязательно условие отсутствие горизонтальной полосы прокрутки, корректное отображение на компьютерах, планшетах смартфонах.
3. Обязателен логотип (на примерах в левой верхней части экрана), имя пользователя и опционально аватар (на примерах в правой верхней части экрана). Бэкенд направление будет заниматься в том числе возможностью регистрации пользователей и хранения данных, поэтому это меню будет использоваться для sign up / sign in / log out
4. Обязателен функционал списка задач с возможностью добавления новых задач, редактирования существующих, удаления задач. Реализация интерфейса добавления задач полностью на ваш выбор
5. Обязателен таймер по методу pomodoro, с возможностью настройки временных интервалов для работы и отдыха, с возможностью ставить таймер на паузу, с возможностью делать сброс таймера.
6. Дополнительный функционал на ваше усмотрение, например, можно добавить:
    - мотивирующие цитаты с обновлением раз в день
    - динамические обои (например, с unsplash с поиском по ключевым словам, можно учитывать время дня)
    - звуковое сопровождение, можно использовать различного рода простые notifications, можно добавить речь
    - можно подготовить управление с помощью горячих клавиш
    - изменение темы, как с темной на светлую, так и полностью на усмотрение пользователя

Техническое задание для Backend-разработчика.
Задача команды: Написать Web-приложение, которое включает в себя список дел и технику управления временем Pomodoro. В приложении есть возможность авторизации для индивидуального пользования. Приложение должно быть реализовано на фреймворке Django.

Задача Backend-разработчика

Создать базу данных для хранения
Списка дел
Выполненных циклов Pomodoro
Данных пользователя

Реализовать форму
Для регистрации и авторизации пользователя~
Для добавления элементов в список дел

Выводить в HTML следующую информацию
Список дел
Выполненные циклы Pomodoro
Имя пользователя

Реализовать следующий функционал
Добавление дел в список
Удаление дел из списка
Возможность удалить все дела за 1 нажатие
Добавлять выполненный цикл Pomodoro
Удалять выполненный цикл Pomodoro

----

--

python -m httpie -a admin:admin http://pomodoro.com:8000/rest/todos/
План:
Сделать связь Todo<-User +
Выбирать только те Todo которые от этого user'а  +
Сделать UI