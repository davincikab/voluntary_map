var servicesSelect = document.getElementById("service-select");
var regionsSelect = document.getElementById("region-select");
var institutionSelect = document.getElementById("institution-select");
let angebotLegend = document.getElementById("angebot-legend");
let traegerLegend = document.getElementById("traeger-legend");
var activeType = "angebot";

let servicesData = [];
let filterResult;
let angebotIcons = [
    'angebot_kita_ganztag', 'angebot_pflege', 'angebot_seniorinnen', 
    'angebot_mitgliedsorganisation', 'angebot_finanzielle_schwierigkeiten',
    'angebot_flucht_asyl', 'angebot_inklusion', 'angebot_jugend',
    'angebot_kultur', 'angebot_migration', 'angebot_lgbtqi', 
    'angebot_sucht', 'angebot_familie', 'angebot_frauen', 
    'angebot_geschaeftsstelle', 'angebot_straffaelligkeit',
    'angebot_psychische_beeintraechtigung', 'angebot_kinder', 'angebot_wohnungsnotfallhilfe',
    'angebot_engagement', 'angebot_beratung','angebot_freiwilligendienst', 'angebot_migration_integration',
    'angebot_rechts-sozialberatung'
];

let traegerIcons = [
    'traeger_awo_kreisverband_spree-wuhle', 
    'traeger_awo_kreisverband_mitte', 
    'traeger_awo_kreisverband_suedost', 
    'traeger_awo_kreisverband_berlin-nordwest', 
    'traeger_awo_kreisverband_suedwest',
    'traeger_awo_kreisverband_spandau', 
    'traeger_awo_kreisverband_treptow-köpenick', 

    // 'traeger_awo_pro:mensch_ggmbh', 
    // 'traeger_awo_gemeinnuetzige_pflegegesellschaft_mbh', 
    // 'traeger_liga_berlin_der_spitzenverbände_der_freien_wohlfahrtspflege', 
    
    ]

var map = L.map('map').setView([52.50697119418263, 13.400917053222658], 11);

// load a tile layer
L.tileLayer('https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=URi8mB9dsRckbqXdBLh1emM3z9mabDqlnrdrHjSMV6wsZhLunQ03Nlkbr3FzDj2H', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 22,
	subdomains: 'abcd',
	accessToken: 'URi8mB9dsRckbqXdBLh1emM3z9mabDqlnrdrHjSMV6wsZhLunQ03Nlkbr3FzDj2H'
}).addTo(map);

// regions
let regions = L.geoJSON(null, {
    style:function(feature) {
        return {
            fillColor:feature.properties.color,
            fillOpacity:0.3,
            color:'#333',
            weight:0.5
        }
    }
});

fetch(`${data.dataUrl}/data/regions.geojson`)
.then(res => res.json())
.then(data => {
    regions.addData(data);

    map.fitBounds(regions.getBounds())
})
.catch(console.error)


// markers
let markerIcon = L.divIcon({
    className:'div-marker',
    html:'<div></div>'
});

let markerCluster = L.markerClusterGroup({
    showCoverageOnHover:false,
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

// Layer control
let layerControl = L.control.layers({}, {
    'Kreisverbände':regions,
    'Angebote':markerCluster
}, { collapsed:false }).addTo(map)


// handle input changes
let filterObj = {
    servicecategory:'all',
    servicelanguage:'all',
    neighbourhood:'all'
};

let filters = document.querySelectorAll(".filter > select");
console.log(filters);

filters.forEach(filter => {
    filter.onchange = function(e) {
        // get the id
        let { name, value } = e.target;
        filterObj[name] = value;

        let filter = [];
        Object.keys(filterObj).forEach(key => {
            if(filterObj[key] != 'all') {
                filter.push({
                    key,
                    value:filterObj[key]
                });
            }
        });

        value == 'all' ? toggleActiveClass(e.target) : toggleActiveClass(e.target, "add");

        // filter the results
        filterResult = filterServices(filter);
        console.log(filterResult);

        let markers = createMarkers(filterResult, activeType);

        // update the map
        markerCluster.clearLayers();
        markerCluster.addLayers(markers);

        paginator
            .setItems(filterResult)
            .renderCards()
            .updateCount()
            .updateActivePageItem()
            .displayPages();
    }
});

var visaulizeBy = document.querySelectorAll(".visual-type");
visaulizeBy.forEach(vBy => {
    vBy.addEventListener("click", function(e) {
        let { target: { name, id} } = e;

        console.log(id);
        activeType = id;

        let data = JSON.parse(JSON.stringify(filterResult || servicesData));
        let markers = createMarkers(data, id);

        // update the map
        markerCluster.clearLayers();
        markerCluster.addLayers(markers);

        // hide the leged section
        if(id == "angebot") {
            angebotLegend.classList.remove('d-none');
            traegerLegend.classList.add('d-none');
        } else {
            angebotLegend.classList.add('d-none');
            traegerLegend.classList.remove('d-none');
        }
    });

    
});

function handleSelectChange(e) {

}

function toggleActiveClass(element, action='remove') {
    if(action == "add") {
        element.classList.add('has-value');
    } else {
        element.classList.remove('has-value');
    }
    
}

// filter the data
function filterServices(filterItems) {
    let result = JSON.parse(JSON.stringify(servicesData));
    return result.filter(item => filterItems.every(fItem => item[fItem.key].includes(fItem.value)))
}

function onLoad(posts) {    
    let markers = createMarkers(posts);
    markerCluster.addLayers(markers);
}

function loadSelectValues(data) {
    let rCompose = compose(getUniqueValues, stringFilter, getValues)
    let sCompose = compose(getUniqueValues, stringFilter, trimMap, flattenValues, splitMap, getValues);

    let services = sCompose({items:data.terms[0], field:'name'})
    let regions = rCompose({items:data.terms[2], field:'name'});
    let institutions = sCompose({items:Object.values(data.posts), field:'traeger'});
    console.log(institutions);

    // update the  
    updateSelect(
        optionItems(optionItem)(services.sort())
    )(servicesSelect);

    updateSelect(
        optionItems(optionItem)(regions.sort())
    )(regionsSelect);

    updateSelect(
        optionItems(optionItem)(institutions.sort())
    )(institutionSelect);

    servicesData = JSON.parse(JSON.stringify(Object.values(data.posts)))

    onLoad(servicesData);
    paginator.setItems(servicesData).renderCards().updateCount();
}

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

function createMarkers(data, type="angebot") {

    let markerArray = data.filter(item => item.laengengrad != "0" && item.laengengrad && item.servicecategory).map(item => {
        let popupContent = getPopupContent(item);
        let iconName;
        if(type == "angebot") {
            iconName = getIconName(item.servicecategory, type);
        } else {
            iconName = getIconName(item.traeger, 'traeger');
        }

        let icon = iconName ? getMarkerIcon(iconName, type) : markerIcon;
        let marker = L.marker([
            parseFloat(item.breitengrad), 
            parseFloat(item.laengengrad)
        ], 
        { icon:icon }
        ).bindPopup(popupContent);


        marker.on('mouseover', function(e) {
            marker.togglePopup();
        });

        return marker;

    });

    console.log(markerArray.length);
    return markerArray;
}

function getPopupContent(item) {
    return `<div>
        <h5 style="margin:0;">${item.post_title}</h5> 
        <p>${item.address}</p>
        <div class="popup-body">
            <div class="">
                <div><b>Telefonnummer</b></div>
                <div>${item.telephone}</div>
            </div>
            <div class="">
                <div><b>Angebote</b></div>
                <div>${item.servicecategory}</div>
            </div>

            <div class="">
                <div><b>Regionen</b></div>
                <div>${item.neighbourhood}</div>
            </div>

            <div class="">
                <div><b>Träger</b></div>
                <div>${item.traeger}</div>
            </div>

            <div class="section-link">
                <a href="${item.website}" class="btn-link">
                    <div class="section-link-inner">Website</div>
                </a>
            </div>
            
        </div>
    </div>`;
}

function getMarkerIcon(value, field) {
    return L.icon({
        iconUrl:getIconUrl(value, field),
        iconSize:[32, 32]
    });
}

// loadSelectValues(data);
function getIconName(value, field) {
    value = value.split(",")[0];

    let name = "";
    if(field == 'angebot') {
        name = value.replace(/\s/g, "_").toLowerCase().replace(/ä/g, "ae").replace("/", "_").replace("*", "");
        let iconName = `${field}_${name}`;

        if(angebotIcons.indexOf(iconName) == -1) {
            console.log(iconName);
        }

        return angebotIcons.indexOf(iconName) != -1 ? iconName : false;
    } else {
        name = value.trim().replace(/\s/g, "_").replace("_e.V.", "").replace(/ü/g, "ue").toLowerCase()
        let iconName = `${field}_${name}`;

        return traegerIcons.indexOf(iconName) != -1 ? iconName : 'traeger_mitgliedsorganisation_korporatives_mitglied';
    }

}

function getIconUrl(iconName, field) {
    // return iconName;
    return `${data.dataUrl}/${field}Icon/${iconName}.png`
}


function visaulizeBy() {
    
}

function updateLegend() {
    // update the legend item
    angebotLegend.innerHTML = data.terms[0].map(term => { 
        let t = "angebot_" + term.slug.replace("-", "_");

        return [term.name, t]
    }).map(item => legendItem(item[1], item[0], "angebot")).join("");

    let sCompose = compose(getUniqueValues, stringFilter, trimMap, flattenValues, splitMap, getValues);
    institutions = sCompose({items:Object.values(data.posts), field:'traeger'});

    traegerLegend.innerHTML = institutions.map(ins => {
        let iconName = ins.trim().replace(/\s/g, "_").replace("_e.V.", "").replace(/ü/g, "ue").toLowerCase();
        iconName = `traeger_${iconName}`;

        // if(traegerIcons.indexOf(iconName) != -1) {
        //     console.log(iconName);
        // }

        iconName = traegerIcons.indexOf(iconName) != -1 ? iconName : 'traeger_mitgliedsorganisation_korporatives_mitglied';

        return [ins, iconName]
    }).map(item => legendItem(item[1], item[0], "traeger")).join("");

}

function legendItem(iconName, category, field="angebot") {
    // let category;
    // if(field == 'angebot') {
    //     category = iconName.split("_").slice(1,).join("/");
    // } else {
    //     category = iconName.split("_").slice(1,).join("/");
    // }

    return `<div class="legend-item">
        <img src="${data.dataUrl}/${field}Icon/${iconName}.png" alt="">
        <div>
            ${category}
        </div>
    </div>`
}

updateLegend();

// pagination section
const Paginator = function(items) {
    this.items = items;
    this.currentPage = 0;
    this.itemsPerPage = 10;
    this.cardItems = document.getElementById("card-items");
    this.cardCount = document.getElementById("card-count");

    this.nextButton = document.querySelector("button.pagination-next");
    this.previousButton = document.querySelector("button.pagination-previous");
    this.listPages = document.querySelectorAll(".pagination ul li");
    this.currentPageItem = document.querySelector("li.current");

    this.setItems = function (items) {
        this.items = items;
        this.currentPage = 0;

        return this;
    }

    this.updateCount = function() {
        this.cardCount.innerHTML = `<span data-postamount="">${this.items.length}</span> 
        <span class="filterPosts">Einträge filtern</span>
        <span class="filteredPosts">Einträge gefunden</span>`;

        return this;
    }

    this.renderCards = function() {
        let start = this.currentPage * this.itemsPerPage;
        let end = start + this.itemsPerPage;

        
        let items = this.items.slice(start, end);
        console.log(items);

        let cards = items.map(item => {
            let services = item.servicecategory.split(",").filter(service => service).map(service => `<span>${service}</span>,`).join("");

            return `<a href="${item.guid}" class="card boxRadius boxShadow">
                <div class="card-services">${services}</div>
            <div class="card-category"></div>
            <div class="card-title h2">${item.post_title}</div>
                    <div class="card-location">Wo? ${item.address}</div>
                <div class="button button--linkSmall">mehr erfahren</div>
          </a>`;

        }).join("");

        this.cardItems.innerHTML = cards;
        return this;
    }

    this.firePageListeners = function() {
        this.previousButton.addEventListener("click", (e) => {
            this.gotoPrevious();
        });

        this.nextButton.addEventListener("click", (e) => {
            this.gotoNext();
        });

        // list Items
        this.listPages.forEach(listPage => {
            listPage.addEventListener("click", (e) => {
                this.currentPageItem.classList.remove("current");

                let { target } = e;
                let  { dataset: { page } } = target;
                
                target.classList.add("current");
                this.currentPageItem = target;

                this.gotoPage(page);
            });

        });
    }

    this.updateActivePageItem = function() {
        console.log(this.currentPage);

        this.listPages.forEach(pageItem => {
            let page = pageItem.getAttribute("data-page");

            if(page == this.currentPage) {
                pageItem.classList.add("current");
                this.currentPageItem = pageItem;
                return pageItem;
            }

            pageItem.classList.remove("current");
            return pageItem;
        });

        return this;
    }

    this.toggleBtnDisabledState = function() {
        if(this.currentPage == 0) {
            this.previousButton.disabled = true;
        } else {
            this.previousButton.disabled = false;
        }

        let pageCounts = Math.floor(this.items.length / this.itemsPerPage);

        if(this.currentPage >= pageCounts) {
            this.nextButton.disabled = true;
        } else {
            this.nextButton.disabled = false;
        }
    }
   
    this.gotoNext = function() {
        this.currentPage += 1;
        this.renderCards();
        this.updateActivePageItem();

        this.toggleBtnDisabledState();

        return this;
    }

    this.gotoPrevious = function() {
        this.currentPage -= 1;
        this.renderCards();
        this.updateActivePageItem();

        this.toggleBtnDisabledState();

        return this;
    }

    this.gotoPage = function(page) {
        this.currentPage = page;

        this.renderCards();
        return this;
    }

    this.displayPages = function() {
        let pageCounts = Math.floor(this.items.length / this.itemsPerPage);
        console.log(pageCounts);

        if(pageCounts < 8) {
            // hide a few pages
            this.listPages.forEach(pageItem => {
                let page = pageItem.getAttribute("data-page");
                if(page <= pageCounts) {
                    pageItem.classList.remove("d-none");
                    return pageItem;
                }
                pageItem.classList.add('d-none');
                return pageItem;
            });

        } else {
            // display the pages
            this.listPages.forEach(pageItem => {
                pageItem.classList.remove('d-none');
            
                return pageItem;
            });
        }


    }
}

let paginator = new Paginator([]);
paginator.firePageListeners();

loadSelectValues(data);
// markerIcon (first category), multiple filter, 
// traeger