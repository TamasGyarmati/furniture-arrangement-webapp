// Tárgyak listája
const items = [];
const apiUrlItem = "http://localhost:5090/item";
const apiUrlRoom = "http://localhost:5090/room";
const apiUrlRoomById = "http://localhost:5090/room/1";

// DOM elemek kiválasztása
let saveBtn = document.getElementById("save-btn");
let addBtn = document.getElementById("add-btn");
let generateBtn = document.getElementById("generateBtn");
let roomSizePtag = document.getElementById("szoba-size-p-tag");
let roomWidthInput = document.getElementById("szoba-merete-1");
let roomHeightInput = document.getElementById("szoba-merete-2");
let parentElement = document.querySelector("#parentgrid");
let roomElement = document.getElementById("room");
let lightAlert = document.getElementById("light-alert");
let dangerAlert = document.getElementById("danger-alert");
let warningAlert = document.getElementById("warning-alert");
let enLink = document.getElementById("enLink");
let huLink = document.getElementById("huLink");
let visionBtn = document.getElementById("visionBtn");
const isHU = !document.getElementById("huLink");

// Szoba méretének beállítása és UI frissítés
let roomData = { width: null, height: null, area: null};

// Az tárgyak és szoba értékeinek nullázása szerveroldalon (oldal frissítéskor)
window.onload = function () {
    fetch(apiUrlItem, {
        method: "DELETE"
    })
    .then(resp => {
        console.log("Itemek törlődtek: ", resp);
        fetch(apiUrlRoom, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: 1,
                width: 0,
                height: 0
            })
        })
        .then(resp => {
            console.log("Szoba törlődött: ", resp);
        })
    })
    .catch(error => console.log(error));
}; 

// Displayek
async function displayRoom() {
    const response = await fetch(apiUrlRoomById);
    const room = await response.json(); 
    console.log("Display room: " + room);
}

async function displayItems() {
    const response = await fetch(apiUrlItem);
    const items = await response.json();
    console.log("Display items: " + items);
}

displayItems();
displayRoom();

// Alerteket kiíró fv.
function AlertWrite(x, y) {
    x.innerHTML = y;
    if (document.body.classList.contains("dark")){
        x.classList.add("white-text-color");
    } else {
        x.classList.remove("white-text-color");
    }
    x.classList.remove("d-none");
    setTimeout(() => {
            x.classList.add("d-none");
        }, 2500);
}

// Szoba méret mentés gomb
saveBtn.addEventListener("click", function() {
    const newRoomWidth = parseFloat(roomWidthInput.value);
    const newRoomHeight = parseFloat(roomHeightInput.value);
    const newRoomArea = (newRoomHeight * newRoomWidth) / 10000;
    const invalidItem = items.some(item =>
        item.itemWidth > newRoomWidth || item.itemHeight > newRoomHeight    
    );
    let sumArea = (items.reduce((sum, element) => sum + element.itemArea, 0));
    dangerAlert.classList.add("d-none");

    // Hibaüzenetek
    if (newRoomWidth > 1000 || newRoomHeight > 1000) {
        AlertWrite(dangerAlert, isHU 
            ? "<strong>Maximum szoba méret: 1000x1000!</strong>" 
            : "<strong>Maximum room size: 1000x1000!</strong>");
        return;
    }
    if (!newRoomWidth || !newRoomHeight || isNaN(newRoomWidth) || isNaN(newRoomHeight)) {
        AlertWrite(dangerAlert, isHU
            ? "<strong>Adj meg érvényes szobaméretet!</strong>"
            : "<strong>Input should be a valid room size!</strong>");
        return;
    }
    if (sumArea > newRoomArea) {
        AlertWrite(dangerAlert, isHU 
            ? "<strong>A hozzáadott tárgyak mérete nagyobb mint az új szoba mérete!</strong>"
            : "<strong>The already added items amount are greater than the new room size!</strong>");
        return;
    }
    if (invalidItem) {
        AlertWrite(dangerAlert, isHU 
            ? "<strong>A szoba szélessége/magassága kevesebb mint egy adott tárgyé!</strong>"
            : "<strong>The room width/height is smaller than an existing item width/height!</strong>");
        return;
    }

    // Mentés gomb 'PUT' request
    fetch(apiUrlRoom, {
        method: "PUT",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({
            id: 1,
            width: newRoomWidth,
            height: newRoomHeight
        })
    })
    .then(resp => {
        console.log("Response: ", resp);
    })
    .catch(error => console.log(error));

    // Az új értékeket elmentjük a tömbbe
    roomData.width = newRoomWidth;
    roomData.height = newRoomHeight;
    roomData.area = newRoomArea;

    // Szoba méret kiírása
    roomSizePtag.textContent = isHU 
    ? "Szoba mérete: " + roomData.width + "x" + roomData.height + "cm" + " (" + roomData.area + "m²)"
    : "Room size: " + roomData.width + "x" + roomData.height + "cm" + " (" + roomData.area + "m²)";

    // Input mezők nullázása (ez miatt kellett a 'roomData')
    roomWidthInput.value = "";
    roomHeightInput.value = "";
});

// Tárgy hozzáadása
addBtn.addEventListener("click", function() {
    const itemName = document.getElementById("floatingInputGroup1").value;
    const itemWidth = parseFloat(document.getElementById("floatingInputGroup2").value);
    const itemHeight = parseFloat(document.getElementById("floatingInputGroup3").value);
    const itemArea = (itemWidth * itemHeight) / 10000;
    const newRoomWidth = roomData.width;
    const newRoomHeight = roomData.height; 
    warningAlert.classList.add("d-none");

    // Hibaüzenetek
    if (roomData.area == null) {
        AlertWrite(warningAlert, isHU 
            ? "<strong>Először a szoba méretét határozd meg!</strong>"
            : "<strong>At first you need to declare the room size!</strong>");
        return;
    }
    if (!itemName || isNaN(itemWidth) || isNaN(itemHeight) || itemWidth <= 0 || itemHeight <= 0) {
        AlertWrite(warningAlert, isHU
            ? "<strong>Adj meg érvényes nevet és méretet!</strong>"
            : "<strong>Input a valid name and size!</strong>");
        return;
    }
    if (itemWidth > newRoomWidth || itemHeight > newRoomHeight || itemArea > roomData.area) {
        AlertWrite(warningAlert, isHU 
            ? "<strong>A tárgy biztosan nem fér bele a szobába!</strong>"
            : "<strong>This item will definitely won't fit!</strong>");
        return;
    }

    // Tárgyak hozzáadása a tömbhöz
    items.push({ itemName, itemArea, itemWidth, itemHeight });

    // Ellenőrzés, hogy az eddigi elemek összmérete meghaladja-e a szoba összméretét
    let sumArea = (items.reduce((sum, element) => sum + element.itemArea, 0));

    if (sumArea > roomData.area){
        items.pop({ itemName, itemArea, itemWidth, itemHeight });
        AlertWrite(warningAlert, isHU 
            ? "<strong>Az össznégyzet méter-t meghaladja!</strong>"
            : "<strong>It exceeds the total square feet!</strong>");
        return;
    }

    // Tárgy hozzáadása szerveroldalon
    fetch(apiUrlItem, {
        method: "POST",
        headers: { "Content-Type" : "application/json", },
        body: JSON.stringify({
            name: itemName,
            width: itemWidth,
            height: itemHeight
        })
    })
    .then(resp => {
        console.log("Response: ", resp);
        displayItems();
    })
    .catch(error => console.log(error))

    // Táblázathoz új sor hozzáadása
    const table = document.getElementById("itemsTable");
    const row = table.insertRow();

    // Cellákba való értékek beszúrása
    row.insertCell(0).textContent = itemName;
    row.insertCell(1).textContent = itemWidth + "x" + itemHeight + "cm" + " (" + itemArea + "m²)";

    // Törlés gomb létrehozása
    const deleteCell = row.insertCell(2);
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = isHU ? "Törlés" : "Delete";
    deleteBtn.classList.add("btn", "btn-danger");
    deleteBtn.addEventListener("click", async function() {
        const itemNameToDelete = row.cells[0].textContent;
        const itemIndex = items.findIndex(item => item.itemName === itemNameToDelete);
        
        if (itemIndex > -1) {
            try {            
                const response = await fetch(apiUrlItem);
                const dbItems = await response.json();
                
                // Megkeressük a nevet a kapott adatok között
                const dbItem = dbItems.find(item => item.name === itemNameToDelete);
                
                if (dbItem && dbItem.id) {
                    // Ha találtunk azonosítót, akkor töröljük az adatbázisból
                    await fetch(`${apiUrlItem}/${dbItem.id}`, {
                        method: "DELETE"
                    });
                    
                    // Ha sikeres volt, töröljük a memóriából és a táblázatból
                    items.splice(itemIndex, 1);
                    table.deleteRow(row.rowIndex);

                    // Frissítjük a szoba div-t is
                    const roomItems = document.querySelectorAll(".item");
                    roomItems.forEach(item => {
                        item.remove();
                    });
                    
                    displayItems();
                } else {
                    AlertWrite(warningAlert, isHU
                        ? "<strong>Nem található az elem azonosítója!</strong>"
                        : "<strong>Can't find the ID of the item!</strong>");
                }
            } catch (error) {
                console.error("Hiba történt:", error);
                AlertWrite(warningAlert, isHU 
                    ? "<strong>Hiba történt a törlés során!</strong>"
                    : "<strong>Something went wrong during deletion!</strong>");
            }
        }
    });
    deleteCell.appendChild(deleteBtn);

    // Input mezők törlése
    document.getElementById("floatingInputGroup1").value = "";
    document.getElementById("floatingInputGroup2").value = "";
    document.getElementById("floatingInputGroup3").value = "";
    displayItems();
});

// Koordináták lekérése
function fetchCoordinates() {
    return fetch("http://localhost:5090/api/RoomPlanner/generate")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network error, or no data!");
            }
            return response.json();
        })
        .then(data => {
            console.log("Placed items coordinates: ", data);
            return data;
        })
        .catch(error => {
            console.error("Something went wrong: ", error);
        });
}

// Szoba megjelenítés generálás gombra
generateBtn.addEventListener("click", function () {
    if (roomData.area !== null) {
        fetchCoordinates().then(coords => {
            if (coords) {
                const rendered = renderItemsInRoom(coords);
                console.log("Renderelt: " + rendered);
                if (rendered) {
                    // Csak akkor görgessen le, ha sikerült a generálás
                    let offset = 350;
                    const elementPosition = roomElement.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: elementPosition - offset,
                        behavior: 'smooth'
                    });
                }
            }
        });
    } else {
        AlertWrite(lightAlert, "<strong>Még nem adtál meg adatokat!</strong>");
    }
});

function renderItemsInRoom(coords) {
    let renderedSomething = false;
    if (items.length === 0) { renderedSomething = true; } // Ha csak szobát generálok tárgyak nélkül

    // A szoba feldolgozása
    parentElement.classList.add("parentTr"); // Gridhez való hozzáadás
    roomElement.classList.add("room");
    roomElement.style.width = roomData.width + "px";
    roomElement.style.height = roomData.height + "px";

    // A tárgyak feldolgozása
    for (let i = 0; i < items.length; i++) {
        if (coords[i] !== undefined) {

            const itemElement = document.createElement("div");
            lightAlert.classList.add("d-none");
            itemElement.classList.remove("show");
            itemElement.classList.add("item");                        
            itemElement.style.width = items[i].itemWidth + "px";
            itemElement.style.height = items[i].itemHeight + "px";
            itemElement.style.left = coords[i].x + "px";
            itemElement.style.top = coords[i].y + "px";
            itemElement.innerText = items[i].itemName;
            itemElement.style.backgroundColor = RandomColor();

            roomElement.appendChild(itemElement);

            setTimeout(() => {
                itemElement.classList.add("show");
            }, 10);

            renderedSomething = true; // Sikeres renderelés
        } else {
            renderedSomething = false; // Sikertelen renderelés
            AlertWrite(lightAlert, isHU 
                ? "<strong>Több elemet már nem lehet berakni!</strong>"
                : "<strong>Can't put more items in the room!</strong>");
            removeLastItem(); // Azért kell törölni, mert ilyenkor már bekerült a tömbbe és az adatbázisba!

            setTimeout(() => {
                // Töröljük az eddig kirenderelt itemeket
                const existingItems = roomElement.querySelectorAll(".item");
                existingItems.forEach(el => el.remove());

                // Újrarenderelés a frissített items listával
                renderItemsInRoom(coords);
            }, 2500); // 2,5s

            break; // kilépünk a ciklusból, hogy ne próbálja tovább
        }
    }
    return renderedSomething; // Görgetéshez kell
}

async function removeLastItem() {
    const table = document.getElementById("itemsTable");

    // Ellenőrzés, hogy van-e egyáltalán sor a táblázatban
    if (table.rows.length === 0) {
        AlertWrite(lightAlert, isHU 
            ? "<strong>Nincs kitörölhető elem a táblázatban!</strong>"
            : "<strong>There's no item in the table to be deleted!</strong>");
        return;
    }

    // A táblázat utolsó sorának törlése
    const lastRow = table.rows[table.rows.length - 1];
    table.deleteRow(lastRow.rowIndex); 

    // A legutolsó elem törlése az items tömbből
    const lastItem = items.pop();

    if (!lastItem) {
        AlertWrite(lightAlert, isHU 
            ? "<strong>Nem található törlendő elem a memóriában!</strong>"
            : "<strong>There's no item in the memory to be deleted!</strong>");
        return;
    }

    // Törlés az adatbázisból az utolsó előfordulás alapján
    try {
        const response = await fetch(apiUrlItem);
        const dbItems = await response.json();

        // Megkeressük az utolsó előfordulást, amely egyezik a tárgy nevével
        const lastIndex = dbItems.map(item => item.name).lastIndexOf(lastItem.itemName);

        if (lastIndex !== -1) {
            const dbItem = dbItems[lastIndex];
            if (dbItem && dbItem.id) {
                // Az adatbázisból való törlés
                await fetch(`${apiUrlItem}/${dbItem.id}`, { method: "DELETE" });
            }
        }
    } catch (error) {
        console.error("Something went wrong when deleting: ", error);
    }
    displayItems();
}

// Véletlen szín generálás
function RandomColor() {
    let red = Math.floor(Math.random()*255);
    let green = Math.floor(Math.random()*255);
    let blue = Math.floor(Math.random()*255);
    let rgb = "rgb("+ red +","+ green +","+ blue +")";
    return rgb;
}

if (enLink) {
    enLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.setItem("scrollPosition", window.scrollY);
        window.location.href = "index-en.html";
    });
}

if (huLink) {
    huLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.setItem("scrollPosition", window.scrollY);
        window.location.href = "index.html";
    });
}

const currentTheme = localStorage.getItem("theme");
if (currentTheme === "dark") {
    document.body.classList.add("dark");
    if (visionBtn) visionBtn.textContent = "☀️";
}

if (visionBtn) {
    visionBtn.addEventListener("click", function() {
        document.body.classList.toggle("dark");
        
        let theme = "light";
        if (document.body.classList.contains("dark")) {
            theme = "dark";
            this.textContent = "☀️";
        } else {
            this.textContent = "🌑";
        }    
        localStorage.setItem("theme", theme);
    });
}

window.addEventListener("load", () => {
    const savedScrollPosition = localStorage.getItem("scrollPosition");
    
    if (savedScrollPosition) {
        window.scrollTo({
            top: parseInt(savedScrollPosition),
            behavior: "instant"
        });
        
        localStorage.removeItem("scrollPosition");
    }
});

// Form újratöltés megakadályozása
document.getElementById("myForm").addEventListener("submit", function(event) {
    event.preventDefault();
});