let store = {
    user: { name: "Student" },
    // apod gets updated with json from api
    apod: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit'],
    rover: ''
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
    let roverName = ''
    if (document.getElementById('curiosityRadio').checked) {
        roverName = "curiosity"
    }
    if (document.getElementById('opportunityRadio').checked) {
        roverName = "opportunity"
    }
    if (document.getElementById('spiritRadio').checked) {
        roverName = "spirit"
    }
    grabRoverInfo(store, roverName);
    console.log("rover: ", roverName);
})

const updateStore = (store, newState) => {
    console.log(newState);
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
    let { rovers, rover } = state

    return `
        <header></header>
        <main>
            <h1>Mars Rover</h1>
            <section>
                <h3>Welcome to the Mars Rover page!</h3>
                ${displayInfo(rover)}
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


const displayInfo = (rover) => {
    if (!rover) {
        return (`
            <p>Select a rover to see the latest pictures</p>
        `)
    } else {
        return (`
        <img src="${rover.roverInfo.photos[0].img_src}" height="350px" width="auto" />
        <p>${rover.roverInfo.photos[0].camera.full_name}</p>
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

const grabRoverInfo = (state, roverName) => {
    let { rover } = state
    switch(roverName) {
        case 'curiosity':
            fetch(`http://localhost:3000/curiosity`)
                .then(res => res.json())
                // curiosity is the data being sent from the app.get in index
                .then(rover => updateStore(store, { rover }))

            return rover
        case 'opportunity':
            fetch(`http://localhost:3000/opportunity`)
                .then(res => res.json())
                // curiosity is the data being sent from the app.get in index
                .then(rover => updateStore(store, { rover }))

            return rover
        case 'spirit':
            fetch(`http://localhost:3000/spirit`)
                .then(res => res.json())
                // curiosity is the data being sent from the app.get in index
                .then(rover => updateStore(store, { rover }))

            return rover
        default:
            console.log('There was an error');
    }
}

 