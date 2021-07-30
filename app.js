window.onerror = function(message, source, lineno, colno, error) {
    console.error(error)
};

const api_url = 'https://www.googleapis.com/calendar/v3'

const access_token = window.localStorage.getItem('access_token')

const MAX_DAYS = 60

const day_mult = 50
const hr_mult = 15

const hour_offset = 6 - 24

const midnight_offset = hr_mult * 2

document.body.style.height = 24 * hr_mult + midnight_offset + 'px'
document.body.style.width = MAX_DAYS * day_mult + 'px'

document.querySelector('#allday').style.height = midnight_offset + 'px'

for(h=0; h<24; h++){
    const tr = document.createElement('tr')
    for(d=0; d<MAX_DAYS; d++){
        const td = document.createElement('td')
        td.style.height = hr_mult - 1 + 'px' // -2 for border
        tr.appendChild(td)
    }
    document.querySelector('table#main#main').appendChild(tr)

    const hr = document.createElement('div')
    hr.style.top = (midnight_offset + hr_mult * h) + 'px'

    h = h + hour_offset
    if(h < 0) {
        h = h + 24
    }
    hr.textContent = h + 'h'
    hr.classList.add('hour')
    document.querySelector('#hours').appendChild(hr)
}
document.querySelector('table#main').style.width = MAX_DAYS * day_mult + 'px'
//document.querySelector('table#main').style.height = 24 * hr_mult + 'px'
document.querySelector('table#main').style.top = midnight_offset + 'px'

const date = new Date()
for(d=0; d<MAX_DAYS; d++){
    const day = document.createElement('div')
    day.classList.add('day')
    day.textContent = date.getDate()
    day.style.left = d * day_mult + 'px'

    document.querySelector('#days').appendChild(day)
    date.setDate(date.getDate() + 1)

    const td = document.createElement('td')
    td.width = day_mult + 'px'
    td.height = midnight_offset - 2 + 'px'
    document.querySelector('#allday table').appendChild(td)
}

function do_now_line(scroll){
    const now = new Date()
    now.setHours(now.getHours() - hour_offset)
    const now_line = document.querySelector('#nowline')
    now_line.id = 'nowline'
    now_line.style.width = day_mult + 'px'
    now_line.style.left = 0 + 'px'
    const topPos = midnight_offset + now.getHours() * hr_mult + now.getMinutes() * hr_mult / 60;
    now_line.style.top = topPos + 'px'

    if(scroll){
        window.scroll(0, topPos - 50)
    }
}
do_now_line(true)
setInterval(do_now_line, 5*60*1000);

window.onscroll = () => {
    document.querySelector('#hours').style.left = window.scrollX + 'px'
    document.querySelector('#days').style.top = window.scrollY + 279 + 'px'
}
document.querySelector('#days').style.top = window.scrollY + 279 + 'px'

var popupOpen = null

document.onkeypress = (e) => {
    switch(e.key){
        case 'ArrowDown':
            if(popupOpen){
                popupOpen.element.scrollTop += 50
            } else {
                select_to(1, 0)
            }
            e.preventDefault()
            e.stopPropagation()
            break
        case 'ArrowLeft':
            if(popupOpen){
            } else {
                select_to(0, -1)
            }
            e.preventDefault()
            e.stopPropagation()
            break
        case 'ArrowUp':
            if(popupOpen){
                popupOpen.element.scrollTop -= 50
            } else {
                select_to(-1, 0)
            }
            e.preventDefault()
            e.stopPropagation()
            break
        case 'ArrowRight':
            if(popupOpen){
            } else {
                select_to(0, 1)
            }
            e.preventDefault()
            e.stopPropagation()
            break
        case 'Enter':
            const events = document.querySelectorAll('.event')
            const select_box = document.querySelector('#select').getBoundingClientRect()
            const select_x = select_box.left + select_box.width / 2
            const select_y = select_box.top + select_box.height / 2
            for(event of events){
                const event_box = event.getBoundingClientRect()
                const event_x = event_box.left + event_box.width / 2
                const event_y = event_box.top + event_box.height / 2
                if(
                    (event_box.left < select_x && select_x < event_box.right && event_box.top < select_y && select_y < event_box.bottom)
                    ||
                    (select_box.left < event_x && event_x < select_box.right && select_box.top < event_y && event_y < select_box.bottom)
                    ){
                    console.log("opening box")
                    console.log('event.style.left', event.style.left)
                    /*event.animate([
                            { 
                                width: event_box.width + 'px',
                                height: event_box.height + 'px',
                                top: event_box.top + 'px',
                                left: event_box.left + 'px'
                            }, 
                            { 
                                width: '240px',
                                height: '300px',
                                top: window.scrollY + 'px',
                                left: window.scrollX + 'px'
                            }
                        ], {
                            duration: 200
                        }
                    );*/
                    popupOpen = {
                        element: event,
                        top: event.style.top,
                        left: event.style.left,
                        width: event_box.width + 'px',
                        height: event_box.height + 'px',
                    }
                    
                    event.style.width = '240px'
                    event.style.height = '300px'
                    event.style.top = window.scrollY + 'px'
                    event.style.left = window.scrollX + 'px'
                    event.classList.add('maximised')

                    document.querySelector('#select').style.display = 'none'
                }
            }

            break
        case 'Backspace':
        case 'SoftRight':
            if(popupOpen){
                console.log("backTo")
                e.preventDefault()
                e.stopPropagation()
                
                popupOpen.element.classList.remove('maximised')

                popupOpen.element.style.top = popupOpen.top
                popupOpen.element.style.left = popupOpen.left
                popupOpen.element.style.width = popupOpen.width
                popupOpen.element.style.height = popupOpen.height
                console.log('bT.e.left', popupOpen.left)
                popupOpen = null
                document.querySelector('#select').style.display = 'block'
                return false
            }
            break
    }
}

let select_day = 0
let select_hr = 0
select_to(0, 0)

function select_to(hr, day){
    select_day += day
    select_hr += hr
    if(select_day > MAX_DAYS){
        select_day--
    } else if(select_day < 0){
        select_day = 0
    }
    if(select_hr > 23){
        select_hr = 23
    } else if(select_hr < -1){
        select_hr = -1
    }

    
    document.querySelector('#select').style.width = day_mult + 1 + 'px'
    if(select_hr == -1){
        document.querySelector('#select').style.height = midnight_offset + 1 + 'px'
        document.querySelector('#select').style.top = -1 + 'px'
    } else {
        document.querySelector('#select').style.height = hr_mult + 1 + 'px'
        document.querySelector('#select').style.top = (midnight_offset + select_hr * hr_mult - 0) + 'px'
    }

    document.querySelector('#select').style.left = (select_day * day_mult - 0) + 'px'

    const rect = document.querySelector('#select').getBoundingClientRect()
    if(rect.right > 240){
        window.scroll({left: window.scrollX + day_mult})
    } else if(rect.left < 0){
        window.scroll({left: window.scrollX - day_mult})
    }
    if(rect.bottom > 300){
        window.scroll({top: window.scrollY + hr_mult})
    } else if(rect.top < midnight_offset){
        window.scroll({top: window.scrollY - hr_mult})
    }
}

if(access_token == null){
    window.location.href = 'login.html'
} else {
    console.log("found access token", access_token)
    loadCals()
    showData()
}

function showData() {
    document.querySelector('#events').innerHTML = ''
    document.querySelector('#allday').innerHTML = ''

    const cals = JSON.parse(window.localStorage.getItem('cals'))
    for(cal of cals){
        console.log("adding cal", cal.summary)
        const events = JSON.parse(window.localStorage.getItem(cal.summary))

        console.log('adding events', events)

        if(events){ // it can be null
            for(event of events){
                const start = new Date(event.start)
                const end = new Date(event.end)

                console.log(event.summary.substring(0, 5))

                console.log("was", start, end)

                start.setHours(start.getHours() - hour_offset)
                end.setHours(end.getHours() - hour_offset)
                end.setMinutes(end.getMinutes() - 1) // prevents things finishing at 00:00 being counted as finishing the next day

                console.log("now", start, end)

                const start_day = getDay(start) - getDay(new Date())
                const end_day = getDay(end) - getDay(new Date())

                console.log("start/end days", start_day, end_day)

                if(start_day < MAX_DAYS){
                    const div = document.createElement('div')
                    div.classList.add('event')

                    const title = document.createElement('div')
                    title.classList.add('title')
                    title.textContent = event.summary
                    div.appendChild(title)

                    const details = document.createElement('div')
                    details.classList.add('details')

                    const summary = document.createElement('div')
                    summary.textContent = event.summary
                    summary.classList.add('summary')
                    details.appendChild(summary)

                    const loc = document.createElement('div')
                    loc.textContent = event.location
                    loc.classList.add('loc')
                    details.appendChild(loc)

                    const desc = document.createElement('div')
                    desc.textContent = event.description
                    desc.classList.add('desc')
                    details.appendChild(desc)

                    div.appendChild(details)

                    div.style.left = start_day * day_mult + 'px'
                    if(start_day == end_day){
                        const start_time = start.getHours() * hr_mult + start.getMinutes() * hr_mult/60
                        const end_time = end.getHours() * hr_mult + end.getMinutes() * hr_mult/60
                        div.style.top = start_time + midnight_offset + 'px'
                        div.style.height = end_time - start_time + 'px'
                        div.style.width = day_mult + 'px'
                    } else {
                        div.style.top = 0
                        div.style.width = (end_day - start_day) * day_mult + 'px'
                        div.style.height = midnight_offset + 'px'
                    }
                    div.style.zIndex = 1 + start_day

                    div.style.backgroundColor = cal.back
                    div.style.color = '#FFF' //cal.fore

                    if(start_day == end_day){
                        document.querySelector('#events').appendChild(div)
                    } else {
                        document.querySelector('#allday').appendChild(div)
                    }
                }
            }
        }
    }
}

function getDay(datetime){
    var date = new Date(datetime);
    var start = new Date(date.getFullYear(), 0, 0);
    var diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return date.getFullYear() * 365 + day
}


function loadCals() {
    console.log('loading calendarList')
    api('/users/me/calendarList', {})
    .then(data => {
        console.log('calendarList reply', data)
        const cals = []

        for(cal of data.items){
            if(cal.selected){
                cals.push({
                    summary: cal.summary,
                    fore: cal.foregroundColor,
                    back: cal.backgroundColor
                })

                console.log('loading calendar', cal.id)
                api('/calendars/' + cal.id + '/events', { orderBy: 'startTime', timeMin: new Date().toISOString(), singleEvents: true })
                .then(data => {
                    const events = []

                    for(event of data.items){
                        let start
                        let end
                        if(event.start.date){
                            start = new Date(event.start.date).toISOString()
                            end = new Date(event.end.date).toISOString()
                        } else {
                            start = event.start.dateTime
                            end = event.end.dateTime
                        }

                        events.push({
                            summary: event.summary,
                            description: event.description,
                            location: event.location,
                            start: start,
                            end: end
                        })
                    }
                    console.log("saving calendar", data.summary, "item count", events.length)
                    window.localStorage.setItem(data.summary, JSON.stringify(events))
                })
            }
        }
        console.log("saving cals. count", cals.length)
        window.localStorage.setItem('cals', JSON.stringify(cals))

        showData()
    })
}

function api(resource, data){
    const url = new URL(api_url + resource)
    const params = new URLSearchParams()
    for(key in data){
        params.set(key, data[key])
    }
    params.set('access_token', access_token)
    url.search = params.toString();
    //console.log(url.href)
    
    var promise = new Promise( (resolve, reject) => {
        //console.log("loading url", url.href)
        fetch(url)
        .then( (response) => response.json() )
        .then( (data) => {
            //console.log("api result "+resource, data)
            if(data.error){
                console.log(data.error)
                if(data.error.code == 401){
                    window.location.href = 'login.html'
                }
            } else {
                resolve(data)
            }
        })
        .catch( (err) => {
            console.log(err)
            //reject(err)
        })
    })

    return promise
}