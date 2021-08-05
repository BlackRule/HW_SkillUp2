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
/** @typedef {"CURRENT_TASK_CHANGED","TIMER_TICK"} EventStr */
/**
 * TODO inherit from CustomEventInit & override  detail
 * @typedef {{detail:{currentTaskId:number}}&EventInit} CURRENT_TASK_CHANGED_args
 */
/***@typedef {"TASK_NOT_SELECTED","STOPPED","WORK","SHORT_BREAK",
 * "LONG_BREAK"} TimerState*/
"use strict"
let DEBUGstate = {}
/**@type number*/
DEBUGstate.lastTaskID = 1
/**
 * @type {{
 *     auth_token:string,
 *     prevTaskId:number,
 *     currentTaskId:number,
 *     tasks: Task[],
 *     timerActive:number,
 *     timeLeft:number,
 *     interval:number,
 *     options:Options,
 *     currentTimerState:TimerState,
 *     timerShortBreaksDone:number
 * }}
 * */
const state = {
    prevTaskId: -1,
    currentTaskId: -1,
    tasks: /**@type Task[]*/[],
    timerActive: false,
    //in seconds
    timeLeft: -1,
    options:/**@type Options*/{},
    currentTimerState:/**@type TimerState*/"TASK_NOT_SELECTED",
    timerShortBreaksDone: 0
}

const SECS_IN_MINUTE = 60

/**@type {Object.<TimerState, string>}*/
const timerStateDesc = {
    "TASK_NOT_SELECTED": "Select task",
    "STOPPED": "Press start",
    "WORK": "Work",
    "SHORT_BREAK": "Short break",
    "LONG_BREAK": "Long break",
}

function timerStateChanged() {
    // (/**@type HTMLAudioElement*/$_("audio")).play()
    $_("timer__currentPomodoro").innerHTML = timerStateDesc[state.currentTimerState]
}

if (localStorage.getItem("auth_token") == null) {
    location.replace("/signup")
}

state.interval = setInterval(() => {
    // /**@type EventStr*/
    // const evt = "TIMER_TICK"
    // document.dispatchEvent(new CustomEvent(evt))
    if (state.timeLeft < 1) {
        switch (state.currentTimerState) {
            case "WORK":
                if (state.timerShortBreaksDone < state.options.shortbreaksInARow) {
                    state.currentTimerState = "SHORT_BREAK"
                    state.timerShortBreaksDone++
                    state.timeLeft = state.options.shortBreak * SECS_IN_MINUTE
                } else {
                    state.currentTimerState = "LONG_BREAK"
                    state.timerShortBreaksDone = 0
                    state.timeLeft = state.options.longBreak * SECS_IN_MINUTE
                }
                break
            case "SHORT_BREAK":
            case "LONG_BREAK":
                state.currentTimerState = "WORK"
                state.timeLeft = state.options.workTime * SECS_IN_MINUTE
                break
        }
        timerStateChanged()

        return
    }
    if (state.currentTimerState !== "STOPPED" && state.currentTimerState !== "TASK_NOT_SELECTED") {
        state.timeLeft -= 1
        const mf = Math.floor
        $_("timer__time").innerHTML =
            `${mf(state.timeLeft / SECS_IN_MINUTE)}${state.timeLeft % 2 === 0 ? ':' : ' '}${(new String(state.timeLeft % SECS_IN_MINUTE)).padStart(2, '0')}`
    }
}, 1000)

$_("startBtn").addEventListener("click", () => {
    if (state.currentTimerState !== "STOPPED") return
    state.timeLeft = state.options.workTime * SECS_IN_MINUTE
    state.currentTimerState = "WORK"
    timerStateChanged()
})
$_("stopBtn").addEventListener("click", () => {
    if (state.currentTimerState === "TASK_NOT_SELECTED") return
    state.currentTimerState = "STOPPED"
    timerStateChanged()
})

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

/**
 * Used for mocking server response
 * @returns [Task]*/
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
    deleteButton.classList.add("far", "fa-trash-alt", "delete-button")
    deleteButton.dataset.deltaskid = task.id
    const taskCheckbox = $_c("input")
    taskCheckbox.type = "checkbox"
    taskCheckbox.checked = task.done
    taskCheckbox.dataset.donetaskid = task.id
    su.appendChild(taskCheckbox)
    su.appendChild(taskText)
    su.appendChild(deleteButton)
    const de = $_c("details")
    de.dataset.taskid = task.id
    const pomodoros = $_c("ul")
    for (const pomodoro of task.pomodoros) {
        const li = $_c("li")
        li.append(document.createTextNode(`${pomodoro.time} minutes`))
        pomodoros.append(li)
    }
    de.append(su)
    de.append(pomodoros)
    de.id = `task${task.id}`
    return de
}


/**
 * @param {Options} options
 * @param {Element} timer__options
 */
function renderOptions(options, timer__options) {
    function f(elements, opts, type, parent) {
        for (const o of elements) {
            const opt = $_c("label")
            opt.append(o[0])
            const inp = $_c("input")
            inp.type = type
            if (type === "checkbox") {
                inp.checked = opts[o[1]]
            } else {
                inp.value = opts[o[1]]
                inp.min = 0
                inp.max = 99
                inp.addEventListener("keydown", (e) => {
                    if (e.key < e.target.min || e.key > e.target.max) {
                        e.preventDefault()
                        return false
                    }
                })
                inp.addEventListener("change", (e) => {
                    state.options[o[1]] = e.target.value
                })
            }
            opt.append(inp)
            parent.append(opt)
            let event = new Event('change');
            inp.dispatchEvent(event);
        }
    }

    f([["Sound", "sound"], ["Alert", "alert"]], options, "checkbox", timer__options.firstElementChild)
    f([
        ["Work time", "workTime"],
        ["Short break", "shortBreak"],
        ["Long break", "longBreak"],
        ["Short breaks in a row", "shortbreaksInARow"],
    ], options, "number", timer__options.lastElementChild)
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
        const dtid = e.target.dataset.deltaskid
        if (dtid) {
            e.preventDefault()
            fetch(`/rest/todos/${dtid}`, {
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
            e.stopPropagation()
            return false
        }

        const dntid = e.target.dataset.taskid
        /*if (dntid) {
            e.preventDefault()
            fetch(`/rest/todos/${dntid}`, {
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
                    e.target.checked = !e.target.checked
                }
            })
            .catch((err) => {
                console.log("ERROR: ");
                console.log(err)

            });
            e.stopPropagation()
            return false
        }*/
        //When clicked on text(span)
        let t = e.target.parentElement.parentElement
        let tidt = t.dataset.taskid
        //When clicked on task itself
        if (!tidt) {
            t = e.target.parentElement
            tidt = t.dataset.taskid
        }
        const tid = 1 * (tidt)
        if (tid) {
            e.preventDefault()
            t.open = true
            state.currentTaskId = tid
            if (state.prevTaskId !== -1) {
                $_(`task${state.prevTaskId}`).classList.remove("active")
                $_(`task${state.prevTaskId}`).open = false
            }
            state.prevTaskId = state.currentTaskId
            t.classList.add("active")
            /***@type EventStr*/
            const evt = "CURRENT_TASK_CHANGED"
            /***@type CURRENT_TASK_CHANGED_args*/
            const a = {detail: {currentTaskId: tid}}
            document.dispatchEvent(new CustomEvent(evt, a))
            e.stopPropagation()
            return false
        }

    })

    /**@type EventStr*/
    const t = "CURRENT_TASK_CHANGED"
    document.addEventListener(t, /**@param e {CURRENT_TASK_CHANGED_args} */(e) => {
        state.currentTimerState = "STOPPED"
        timerStateChanged()
    }, false);
})

