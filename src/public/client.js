let store = {
    user: { name: "Student" },
    // apod gets updated with json from api
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    curiosity: '',
    opportunity: '',
    spirit: ''
}

// let store = Immutable.Map({
//     user: {
//         first_name: 'John',
//         last_name: 'Doe'
//     })
// }

// const updateStore = (store, newState) => {
//     const newStore = store.merge(newState)
//     render(root, newStore);
// }

// add our markup to the page
const root = document.getElementById('root');
const button = document.querySelector('button');

button.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('click');
    let rover = ''
    if (document.getElementById('curiosityRadio').checked) {
        rover = "curiosity"
    }
    if (document.getElementById('opportunityRadio').checked) {
        rover = "opportunity"
    }
    if (document.getElementById('spiritRadio').checked) {
        rover = "spirit"
    }
    curiousityObj(store);
    console.log("rover: ",rover);
})

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    // console.log("store: ", store)
    console.log("update store render:");
    render(root, store)
}

const render = async (root, state) => {
    console.log("state during render: ", state);
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod, curiosity } = state

    return `
        <header></header>
        <main>
            <h1>Mars Rover</h1>
            <section>
                <h3>Welcome to the Mars Rover page!</h3>
                ${curiosityInfo(curiosity)}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    console.log('Window load render');
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
// const Greeting = (name) => {
//     if (name) {
//         return `
//             <h1>Welcome, ${name}!</h1>
//         `
//     }

//     return `
//         <h1>Hello!</h1>
//     `
// }

// Example of a pure function that renders infomation requested from the backend
// const ImageOfTheDay = (apod) => {
//     // console.log('apod: ', apod);

//     // If image does not already exist, or it is not from today -- request it again
//     const today = new Date()
//     const photodate = new Date(apod.date)
//     // console.log(photodate.getDate(), today.getDate());

//     // console.log(photodate.getDate() === today.getDate());
//     if (!apod || apod.date === today.getDate() ) {
//         getImageOfTheDay(store)
//     }

//     // check if the photo of the day is actually type video!
//     if (apod.media_type === "video") {
//         return (`
//             <p>See today's featured video <a href="${apod.url}">here</a></p>
//             <p>${apod.title}</p>
//             <p>${apod.explanation}</p>
//         `)
//     } else {
//         return (`
//             <img src="${apod.image.url}" height="350px" width="100%" />
//             <p>${apod.image.explanation}</p>
//         `)
//     }
// }

const curiosityInfo = (curiosity) => {
    if (!curiosity) {
        return (`
            <p>Select a rover to see the latest pictures</p>
        `)
    } else {
        return (`
        <img src="${curiosity.curiosity.photos[0].img_src}" height="350px" width="auto" />
        <p>${curiosity.curiosity.photos[0].camera.full_name}</p>
    `)
    }
}

// ------------------------------------------------------  API CALLS

// Example API call

// const getImageOfTheDay = (state) => {
//     let { apod } = state

//     fetch(`http://localhost:3000/apod`)
//         .then(res => res.json())
//         // apod is the data being sent from the app.get in index
//         .then(apod => updateStore(store, { apod }))

//     return apod
// }

const curiousityObj = (state) => {
    let { curiosity } = state

    fetch(`http://localhost:3000/curiosity`)
        .then(res => res.json())
        // curiosity is the data being sent from the app.get in index
        .then(curiosity => updateStore(store, { curiosity }))

    return curiosity
}

 