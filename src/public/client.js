const store = Immutable.Map({
    name: ''
})

// make update store a callback
const updateStore = (store, newState) => {
    let roverInfo = newState.rover.roverInfo.photos
    console.log(roverInfo)
    let roverObj = roverInfo.map(obj => {
        return {
            name: obj.rover.name,
            launchDate: obj.rover.launch_date,
            landingDate: obj.rover.landing_date,
            status: obj.rover.status,
            photos: obj.img_src
        }
    }).reduce((acc, curr) => {
        acc["name"].push(curr.name)
        acc["launchDate"].push(curr.launchDate)
        acc["landingDate"].push(curr.landingDate)
        acc["status"].push(curr.status)
        acc["photos"].push(curr.photos)
        return acc
    }, { name: [], launchDate: [], landingDate: [], status: [], photos: [] })
    newState = store.merge(roverObj)
    console.log("new State post merge: ", newState)
    render(root, newState);
}

// add our markup to the page
const root = document.getElementById('root');
const button = document.querySelector('button');

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    console.log('Window load render');
    render(root, store)
})

const render = async (root, state) => {
    console.log("store during render: ", store);
    root.innerHTML = App(state)
}


button.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('slideshow-container').innerHTML = ""

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



// create content
const App = (state) => {
    // let { rover } = state

    return `
        <header></header>
        <h1>Welcome to the Mars Rover Page!</h1>
        <section>
        ${displayInfo(state)}
        </section>
        <footer></footer>
    `
}



// ------------------------------------------------------  COMPONENTS


const displayInfo = (rover) => {
    console.log("rover: ", rover)

    if (rover.get('name') === '') {
        return (`
            <h3>Select a rover to see the latest pictures</h3>
        `)
    } else {
        generateSlideDiv(rover)
        return `<h3>Click on another rover to see their pictures</h3>`
    }
}

// ------------------------------------------------------  API CALLS

const grabRoverInfo = (state, roverName) => {
    let { rover } = state

    switch (roverName) {
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
                // .then(rover => console.log("rover info: ", res.json()))
                .then(rover => updateStore(store, { rover }))

            return rover
        default:
            console.log('There was an error');
    }
}

// ------------------------------------------------------  IMAGE SLIDER

const generateSlideDiv = (rover) => {
    const fragment = new DocumentFragment();
    console.log("rover: ", rover)
    let display = "block"
    for (let i = 0; i < rover.size; i++) {
        const slideDiv = document.createElement("div");
        slideDiv.className = "rover-slide";
        slideDiv.style.display = display
        slideDiv.innerHTML = `
        <img src="${rover.get('photos')._tail.array[i]}"/>
        <p class="rover-name">${rover.get('name')._tail.array[i]}</p>
        <div class="slide-details">Launch Date: ${rover.get('launchDate')._tail.array[i]} Landing Date: ${rover.get('landingDate')._tail.array[i]} Status: ${rover.get('status')._tail.array[i]} </div>
        <a
        `
        display = "none"
        fragment.appendChild(slideDiv)
    }
    const prevArrow = document.createElement("a");
    prevArrow.className = "prev"
    prevArrow.setAttribute('onclick', 'updateSlideIndex.plusSlides(-1)')
    prevArrow.innerHTML = "&#10094"
    fragment.appendChild(prevArrow);
    const nextArrow = document.createElement("a");
    nextArrow.className = "next"
    nextArrow.setAttribute('onclick', 'updateSlideIndex.plusSlides(1)')
    nextArrow.innerHTML = "&#10095"
    fragment.appendChild(nextArrow);
    const slideshowContainer = document.getElementById('slideshow-container');
    slideshowContainer.appendChild(fragment)

}

const updateSlideIndex = (function () {
    let slideIndex = 0;
    return {
        plusSlides: function (n) {
            showSlides(slideIndex += n);
        },
        updateIndex: function() {
            slideIndex = 0
        }
    }
})();

function showSlides(n) {
    let i;
    let slideIndex = n
    let slides = document.getElementsByClassName("rover-slide");
    
    console.log("slide index: ", slideIndex)
    console.log("slide length: ", slides.length)
    

    if (n >= slides.length) { updateSlideIndex.updateIndex() }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
}

