const state = Immutable.Map({
    name: ''
});

// Maps out requested rover object and merges with previous state to create a new rover state
// Passes new state to be rendered
const updateState = (state, newState) => {
    let roverInfo = newState.rover.roverInfo.photos;
    let roverObj = roverInfo.map(obj => {
        return {
            name: obj.rover.name,
            launchDate: obj.rover.launch_date,
            landingDate: obj.rover.landing_date,
            status: obj.rover.status.charAt(0).toUpperCase() + obj.rover.status.slice(1),
            photos: obj.img_src,
            date: obj.earth_date
        };
    }).reduce((acc, curr) => {
        acc['name'].push(curr.name);
        acc['launchDate'].push(curr.launchDate);
        acc['landingDate'].push(curr.landingDate);
        acc['status'].push(curr.status);
        acc['photos'].push(curr.photos);
        acc['date'].push(curr.date);
        return acc;
    }, { name: [], launchDate: [], landingDate: [], status: [], photos: [], date: [] });
    newState = state.merge(roverObj);
    render(root, newState);
};

const root = document.getElementById('root');
const button = document.querySelector('.button');

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, state);
});

const render = async (root, state) => {
    root.innerHTML = App(state);
};

// Gets value of rover selected from the DOM
button.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('slideshow-container').innerHTML = '';

    let roverName = '';
    if (document.getElementById('curiosityRadio').checked) {
        roverName = 'curiosity';
    }
    if (document.getElementById('opportunityRadio').checked) {
        roverName = 'opportunity';
    }
    if (document.getElementById('spiritRadio').checked) {
        roverName = 'spirit';
    }
    // Sends user choice to get fetched
    grabRoverInfo(state, roverName);
});



// create content
const App = (state) => {
    // let { rover } = state

    return `
        <h1>Welcome to the Mars Rover Page</h1>
        <section>
        ${displayInfo(state)}
        </section>
    `;
};



// ------------------------------------------------------  COMPONENTS


const displayInfo = (rover) => {
    if (rover.get('name') === '') {
        return `
            <h3>Select a rover to see the latest pictures:</h3>
        `;
    } else {
        generateSlideDiv(rover);
        return '<h3>Click on another rover to see their pictures:</h3>';
    }
};

// ------------------------------------------------------  API CALLS

const grabRoverInfo = (state, roverName) => {
    let { rover } = state;

    fetch('http://localhost:3000/' + roverName)
        .then(res => res.json())
        .then(rover => {
            if (!rover.roverInfo.photos) {
                console.log(rover.roverInfo.error.message)
                return document.getElementById('slideshow-container').innerHTML = rover.roverInfo.error.message;
            } else { 
                updateState(state, { rover }); 
            }
        })

    return rover;
};

// ------------------------------------------------------  IMAGE SLIDER
// Creates the HTML to append to the slideshow container from current state
const generateSlideDiv = (rover) => {
    const fragment = new DocumentFragment();
    let display = 'block';
    for (let i = 0; i < rover.get('landingDate').size; i++) {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'rover-slide';
        slideDiv.style.display = display;
        slideDiv.innerHTML = `
        <img src="${rover.get('photos')._tail.array[i]}"/>
        <p class="rover-name">${rover.get('name')._tail.array[i]}</p>
        <div class="slide-details">Photo Date: ${rover.get('date')._tail.array[i]}</div> 
        <div class="slide-details">Launch Date: ${rover.get('launchDate')._tail.array[i]}</div> 
        <div class="slide-details">Landing Date: ${rover.get('landingDate')._tail.array[i]}</div> 
        <div class="slide-details"> Status: ${rover.get('status')._tail.array[i]}</div>
        `;
        // Sets display for all divs to none after the first
        display = 'none';
        fragment.appendChild(slideDiv);
    }
    // Creates next/prev arrows for the image slider
    const prevArrow = document.createElement('a');
    prevArrow.className = 'prev';
    prevArrow.setAttribute('onclick', 'updateSlideIndex.minusSlides()');
    prevArrow.innerHTML = '&#10094';
    fragment.appendChild(prevArrow);
    const nextArrow = document.createElement('a');
    nextArrow.className = 'next';
    nextArrow.setAttribute('onclick', 'updateSlideIndex.plusSlides()');
    nextArrow.innerHTML = '&#10095';
    fragment.appendChild(nextArrow);
    const slideshowContainer = document.getElementById('slideshow-container');
    slideshowContainer.appendChild(fragment);

};

// Initializes slide index number and updates index to move through images
const updateSlideIndex = (function () {
    let slideIndex = 1;
    return {
        plusSlides: function () {
            slideIndex++;
            showSlides(slideIndex);
        },
        minusSlides: function () {
            showSlides(slideIndex);
            slideIndex--;
        },
        updateIndex: function() {
            slideIndex = 0;
        },
        updateIndexReverse: function(n) {
            slideIndex = n;
        }
    };
})();

// hides previous image and reveals next image
function showSlides(n) {
    let slideIndex = n;
    let slides = document.getElementsByClassName('rover-slide');
    
    if (slideIndex >= slides.length) { updateSlideIndex.updateIndex(); }
    if (slideIndex < 1) 
    { 
        slideIndex = slides.length;
        updateSlideIndex.updateIndexReverse(slides.length); 
    }
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
        
    }
    slides[slideIndex -= 1].style.display = 'block';
}

