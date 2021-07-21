//Typedefs
/**
 * @typedef {Object} Pomodoro
 * @property {number} id
 * @property {number} time in minutes
 */
/***
 * @typedef {Object} Task
 * @property {number} id
 * @property {string} name
 * @property {boolean} done
 * @property {[Pomodoro]} pomodoros
 **/
/**
 * @typedef {Object} Options
 * @property {boolean} sound
 * @property {boolean} alert
 * @property {number} workTime
 * @property {number} shortBreak
 * @property {number} longBreak
 * @property {number} shortbreaksInARow
 */
"use strict"
let DEBUGstate = {}
DEBUGstate.lastTaskID = 1
const state = {}
state.auth_token = localStorage.getItem("auth_token") == null;
if (state.auth_token) {
    location.replace("/signup")
}

state.currentTaskId = null
state.tasks = []

/**@param {
 * "markTaskCurrent",
 * "clickedCreateTask",
 * "taskCreated"
 * } action*/

/**
 * @param {{task: Task}} args
 */
function currentTaskChanged(args) {
    // state.currentTaskId=
}

function createTaskHandler() {
    let name = prompt("Enter task name");
    if(name!==null) {
        DEBUGstate.lastTaskID++
        taskCreated({task: {id: DEBUGstate.lastTaskID, name: name, done: false, pomodoros: []}})
    }
}

/**
 * We got response from server with ID and stuff
 * @param {{task: Task}} args
 */
function taskCreated(args) {
    $_("todo__list").appendChild(createHTMLTask(args.task))
}

/** @returns [Task]*/
function getTasks() {
    /**@type [Task] */
    const taskList = [
        {
            id: 1, name: "Task1", done: false, pomodoros: [
                {id: 1, time: 25},
                {id: 2, time: 20},
                {id: 3, time: 15}
            ]
        },
        {
            id: 2, name: "Task2", done: false, pomodoros: [
                {id: 4, time: 25},
                {id: 5, time: 20},
                {id: 6, time: 15}
            ]
        },
        {
            id: 3, name: "Task3", done: true, pomodoros: [
                {id: 7, time: 25},
                {id: 8, time: 20},
                {id: 9, time: 15}
            ]
        }
    ]
    DEBUGstate.lastTaskID=3
    return taskList
}

/**
 * @param {Task} task
 * @returns HTMLDetailsElement
 * */
function createHTMLTask(task) {
    const su = $_c("summary")
    const taskName = $_c("span")
    taskName.append(task.name)
    const taskCheckbox = $_c("input")
    taskCheckbox.type = "checkbox"
    taskCheckbox.checked = task.done
    su.appendChild(taskCheckbox)
    su.appendChild(taskName)
    const de = $_c("details")
    const pomodoros = $_c("ul")
    for (const pomodoro of task.pomodoros) {
        const li = $_c("li")
        li.append(document.createTextNode(`${pomodoro.time} minutes`))
        pomodoros.append(li)
    }
    de.append(su)
    de.append(pomodoros)
    return de
}


/**
 * @param {Options} options
 * @param {Element} timer__options
 */
function renderOptions(options, timer__options) {
    function f(opts, type, parent) {
        for (const o of opts) {
            const opt = $_c("label")
            opt.append(o[0])
            const inp = $_c("input")
            inp.type = type
            if (type === "checkbox") {
                inp.checked = o[1]
            } else {
                inp.value = o[1]
            }
            opt.append(inp)
            parent.append(opt)
        }
    }

    f([["Sound", options.sound], ["Alert", options.alert]], "checkbox", timer__options.firstElementChild)
    f([
        ["Work time", options.workTime],
        ["Short break", options.shortBreak],
        ["Long break", options.longBreak],
        ["Short breaks in a row", options.shortbreaksInARow],
    ], "text", timer__options.lastElementChild)
}

window.addEventListener("load", function () {
    state.tasks = getTasks()
    for (const task of state.tasks) {
        $_("todo__list").appendChild(createHTMLTask(task))
    }
    renderOptions({
        sound: true,
        alert: true,
        workTime: 25,
        shortBreak: 5,
        longBreak: 15,
        shortbreaksInARow: 4
    }, $_("timer__options"))
    $_("addTaskBtn").addEventListener("click",createTaskHandler)
})
