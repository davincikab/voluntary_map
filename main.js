var servicesSelect = document.getElementById("service-select");
var regionsSelect = document.getElementById("region-select");
var languageSelect = document.getElementById("language-select");
var servicesData = [];

var map = L.map('map').setView([52.5034205,13.4128348],9);

// load a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png' ,
  {
   attribution: '<a href="https://www.td-softwaresystems.de" target="_blank">TD Software.Systems </a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
   maxZoom: 18,
   minZoom: 2
}).addTo(map);

let markerIcon = L.divIcon({
    className:'div-marker',
    html:'<div>M</div>'
});

let markerCluster = L.markerClusterGroup({
    iconCreateFunction: iconCreate
})
.addTo(map);
    
function iconCreate(cluster) {
    return L.divIcon({
        className:'marker-cluster',
        html: '<div class="cluster-marker"><b>' + cluster.getChildCount() + '</b><div>' 
    });
}

// 
let servicesObj = L.geoJSON(null, {

});

servicesObj.addTo(map);


// handle input changes
let filterObj = {
};

let filters = document.querySelectorAll(".filter > select");
console.log(filters);

filters.forEach(filter => {
    filter.onchange = function(e) {
        // get the id
        let { name, value } = e.target;
        filterObj[name] = value;

        let filter = {};
        Object.keys(filterObj).forEach(key => {
            if(filterObj[key] != 'all') {
                filter[key] = filterObj[key]
            }
        });

        // filter the results
        let filterResult = filterServices(filter);
        let markers = createMarkers(filterResult);

        // update the map
        markerCluster.clearLayers();
        markerCluster.addLayers(markers);
    }
});

// filter the data
function filterServices(filterItems) {
    const filters = (field, value, filterItems) => filterItems.filter(item => item[field].includes(value));

    let result = JSON.parse(JSON.stringify(servicesData));
    for (const key in filterItems) {
        result = filters(key, filterItems[key], result);
    }
    
    return result;
}


// read the csv file
d3.csv('map_info.csv')
.then(data => {
    console.log(data);

    let rCompose = compose(getUniqueValues, stringFilter, getValues)
    let sCompose = compose(getUniqueValues, stringFilter, trimMap, flattenValues, splitMap, getValues);

    let services = sCompose({items:data, field:'Angebotsart'})
    let regions = rCompose({items:data, field:'Region'});
    let languages = sCompose({items:data, field:'Sprache'})
    console.log(languages);

    // update the  
    updateSelect(
        optionItems(optionItem)(services.sort())
    )(servicesSelect);

    updateSelect(
        optionItems(optionItem)(regions.sort())
    )(regionsSelect);

    updateSelect(
        optionItems(optionItem)(languages.sort())
    )(languageSelect);

    // geocode the addresses
    getDataCoord(data, cbFunction);
    function cbFunction(geoData) {
        // console.log(JSON.stringify(data));
        console.log("Success");
        console.log(geoData);
        servicesData = [...geoData];

        let markers = createMarkers(geoData);
        markerCluster.addLayers(markers);
    }


})
.catch(console.error);

function splitValues(item) {
    return item.split(",");
}

function flattenValues(items) {
    return items.flatMap(i => i);
}

// get the regions
function getValues({items, field}) {
    return items.map(item => item[field].trim())
}

function getUniqueValues(items) {
    return [... new Set(items)];
}

const splitMap = items => items.map(splitValues);
const trimMap = items => items.map(item => item.trim());
const stringFilter = items => items.filter(item => item);

const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);

// update the select section
const updateSelect = (optionHtml) => elem => elem.innerHTML += optionHtml;
const optionItems = fn => x => x.map(fn);
function optionItem(item) {
    return `<option value="${item}">${item}</option>`
}


function getDataCoord(data, cbFunction) {
    let index = 0;
    let newArray = [];

    async function geocode(item) {
        // increment the index
        index += 1;

        if(index == data.length) {
            cbFunction(newArray);
            return;
        }

        if(item.latitude) {
            newArray.push({...item });
            return geocode(data[index]);
        }

        try {
            let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${item.Adresse}.json?&types=address&access_token=pk.eyJ1IjoiZGF1ZGk5NyIsImEiOiJjanJtY3B1bjYwZ3F2NGFvOXZ1a29iMmp6In0.9ZdvuGInodgDk7cv-KlujA`;
        
            let result =  await fetch(url).then(res => res.json());
            let coord = result.features[0].center;

            newArray.push({
                ...item,
                latitude:coord[1],
                longitude:coord[0]
            });

            setTimeout(e => {
            
            }, 500);
        } catch (error) {
            newArray.push({
                ...item,
            });

            console.log(item);
        }
        

        return geocode(data[index]);
    }

    geocode(data[index]);

    // return newArray;
}

function createMarkers(data, isChurch) {
    let icon = isChurch ? churchIcon : markerIcon;

    let markerArray = data.filter(item => item.latitude).map(item => {
        let popupContent = getPopupContent(item, isChurch);
        
        return L.marker([
            parseFloat(item.latitude), 
            parseFloat(item.longitude)
        ], 
        { icon:icon, title:item.Name }
        ).bindPopup(popupContent);


    });

    return markerArray;
}

function getPopupContent(item, isChurch) {
    if(isChurch) {
        return `<h2>${item.Name}</h5> <p>${item.Adresse}</p>`;
    } else {
        return `<h2>${item.Name}</h5> <p>${item.Adresse}</p>`;
    }
}

function getMarkerIcon(item) {
    return L.icon({

    });
}