//Typedefs
/** @typedef {Object} RESTCollection
 *  @property {number} count
 *  @property {any} next
 *  @property {any} previous
 *  @property {[any]} results
 */
/**
 * @typedef {Object} Pomodoro
 * @property {number} id
 * @property {number} time in minutes
 */
/***
 * @typedef {Object} Task
 * @property {number} id
 * @property {string} text
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
/**@type number*/
DEBUGstate.lastTaskID = 1
const state = {}
state.auth_token = localStorage.getItem("auth_token") == null;
if (state.auth_token) {
    location.replace("/signup")
}
/**@type number*/
state.currentTaskId = -1
/**@type [Task]*/
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
    let text = prompt("Enter task text");
    if (text !== null) {
        const data = new URLSearchParams();
        data.append("text", text);
        data.append("done", "false");
        fetch('/rest/todos/', {
            method: 'post',
            headers: {'Authorization': `Token ${localStorage.getItem("auth_token")}`},
            body: data
        })
            .then((response) => {
                response.json().then(
                    (d) => {
                        console.log(d)
                        if (!response.ok) {
                            console.log(response)

                        } else {
                            taskCreated({task: Object.assign({}, d, {pomodoros: []})})
                        }
                    });

            })
            .catch((err) => {
                console.log("ERROR: ");
                console.log(err)

            });
        // DEBUGstate.lastTaskID++
        // taskCreated({task: {id: DEBUGstate.lastTaskID, text: text, done: false, pomodoros: []}})
    }
}

/**
 * We got response from server with ID and stuff
 * @param {{task: Task}} args
 */
function taskCreated(args) {
    console.log(args)
    $_("todo__list").appendChild(createHTMLTask(args.task))
}

/** @returns [Task]*/
function getTasks() {
    /**@type [Task] */
    const taskList = [
        {
            id: 1, text: "Task1", done: false, pomodoros: [
                {id: 1, time: 25},
                {id: 2, time: 20},
                {id: 3, time: 15}
            ]
        },
        {
            id: 2, text: "Task2", done: false, pomodoros: [
                {id: 4, time: 25},
                {id: 5, time: 20},
                {id: 6, time: 15}
            ]
        },
        {
            id: 3, text: "Task3", done: true, pomodoros: [
                {id: 7, time: 25},
                {id: 8, time: 20},
                {id: 9, time: 15}
            ]
        }
    ]
    DEBUGstate.lastTaskID = 3
    return taskList
}

/**
 * @param {Task} task
 * @returns HTMLDetailsElement
 * */
function createHTMLTask(task) {
    const su = $_c("summary")
    const taskText = $_c("span")
    taskText.append(task.text)
    const deleteButton = $_c("span")
    deleteButton.classList.add("far", "fa-trash-alt")
    deleteButton.dataset.deltaskid = task.id
    const taskCheckbox = $_c("input")
    taskCheckbox.type = "checkbox"
    taskCheckbox.checked = task.done
    su.appendChild(taskCheckbox)
    su.appendChild(taskText)
    su.appendChild(deleteButton)
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
    $_("user__login").innerHTML = localStorage.getItem("username")
    fetch("/rest/todos/", {headers: {'Authorization': `Token ${localStorage.getItem("auth_token")}`}}).then((response) => {
        response.json().then(/**@param {RESTCollection} v */(v) => {
            console.log(v)
            for (const t of v.results) {
                state.tasks.push({id: t.id, text: t.text, done: t.done, pomodoros: []})
            }
            for (const task of state.tasks) {
                $_("todo__list").appendChild(createHTMLTask(task))
            }
        })

    }, () => {
    })

    renderOptions({
        sound: true,
        alert: true,
        workTime: 25,
        shortBreak: 5,
        longBreak: 15,
        shortbreaksInARow: 4
    }, $_("timer__options"))
    $_("addTaskBtn").addEventListener("click", createTaskHandler)

    $_("logout_btn").addEventListener("click", (e) => {
        e.preventDefault()
        fetch('/auth/token/logout/', {
            method: 'post',
            headers: {'Authorization': `Token ${localStorage.getItem("auth_token")}`}
        })
            .then((response) => {
                if (!response.ok) {
                    console.log(response)
                    response.json().then(
                        (d) => {
                            console.log(d)
                        });
                } else {

                    location.replace("/")

                }
            })
            .catch((err) => {
                console.log("ERROR: ");
                console.log(err)

            });
        localStorage.removeItem("username")
        localStorage.removeItem("auth_token")
        return false
    })

    $_("deleteAllBtn").addEventListener("click", (e) => {
        e.preventDefault()
        fetch('/rest/todos/delete_all', {
            method: 'GET',
            headers: {'Authorization': `Token ${localStorage.getItem("auth_token")}`}
        })
            .then((response) => {
                if (!response.ok) {
                    console.log(response)
                    response.json().then(
                        (d) => {
                            console.log(d)
                        });
                } else {
                    $_("todo__list").innerHTML = ""
                }
            })
            .catch((err) => {
                console.log("ERROR: ");
                console.log(err)

            });
        return false
    })

    $_("todo__list").addEventListener("click", (e) => {
        const tid = e.target.dataset.deltaskid
        console.log(tid)

        if (tid) {
            e.preventDefault()
            fetch(`/rest/todos/${tid}`, {
            method: 'DELETE',
            headers: {'Authorization': `Token ${localStorage.getItem("auth_token")}`}
        })
            .then((response) => {
                if (!response.ok) {
                    console.log(response)
                    response.json().then(
                        (d) => {
                            console.log(d)
                        });
                } else {
                    e.target.parentElement.parentElement.parentElement.removeChild(
                        e.target.parentElement.parentElement
                    )
                }
            })
            .catch((err) => {
                console.log("ERROR: ");
                console.log(err)

            });
            return false

        }
        /**/
    })
})
