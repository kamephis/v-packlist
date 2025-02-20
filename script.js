const categories = {
    essentials: ["Passport", "Driver's License", "Currency Exchange", "Toothbrush", "Toothpaste", "Deodorant", "Phone Charger", "Headphones"],
    clothing: ["Underwear", "Socks", "Shirts", "Pants"],
    electronics: ["Phone", "Laptop", "Power Bank"],
    photo: ["Camera", "Camera batteries", "Lenses", "Tripod", "Lens cleaning cloth"],
    sport: ["Running shoes", "Sportswear", "Swim goggles", "Jump rope"]
};

const climatePacking = {
    sunny: ["Sunglasses", "Beach towel", "Swimsuit", "Sunscreen", "Flip-flops"],
    mountain: ["Hiking boots", "Backpack", "Jacket", "Water bottle", "Snacks"],
    rainy: ["Raincoat", "Umbrella", "Waterproof shoes", "Towel"],
    cold: ["Winter coat", "Gloves", "Scarf", "Warm socks", "Thermal wear"]
};

// Retrieve from local storage
const loadPackingList = () => JSON.parse(localStorage.getItem("packingList")) || {};

// Save to local storage
const savePackingList = (list) => localStorage.setItem("packingList", JSON.stringify(list));

// Show the list step and hide the setup step
const showListStep = () => {
    document.getElementById("setupStep").classList.add("hidden");
    document.getElementById("listStep").classList.remove("hidden");
};

// Show the setup step (reset)
const showSetupStep = () => {
    document.getElementById("setupStep").classList.remove("hidden");
    document.getElementById("listStep").classList.add("hidden");
};

// Render packing list
const renderPackingList = () => {
    const packingListEl = document.getElementById("packingList");
    packingListEl.innerHTML = "";
    const packingList = loadPackingList();

    for (const [category, items] of Object.entries(packingList)) {
        if (items.length > 0) {
            const categoryTitle = document.createElement("h3");
            categoryTitle.className = "text-lg font-bold mt-4";
            categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            packingListEl.appendChild(categoryTitle);

            const ul = document.createElement("ul");
            ul.className = "list-none";
            items.forEach((item, index) => {
                const li = document.createElement("li");
                li.className = "flex justify-between items-center bg-gray-200 p-2 rounded mt-2";
                li.innerHTML = `${item} <button class="text-red-500" onclick="removeItem('${category}', ${index})">❌</button>`;
                ul.appendChild(li);
            });
            packingListEl.appendChild(ul);
        }
    }
};

// Generate list
document.getElementById("generateList").addEventListener("click", () => {
    const tripDays = parseInt(document.getElementById("tripDays").value);
    const climateType = document.getElementById("climateType").value;
    const isPhotoVacation = document.getElementById("photoVacation").checked;
    const isSportEquipment = document.getElementById("sportEquipment").checked;
    const isHotelStay = document.getElementById("hotelStay").checked;

    let packingList = {
        essentials: [...categories.essentials],
        clothing: [...categories.clothing.map(item => `${item} x${tripDays}`)],
        electronics: [...categories.electronics]
    };

    if (!isHotelStay) {
        packingList.essentials.push("Towel");
    }

    packingList.essentials = [...new Set(packingList.essentials.concat(climatePacking[climateType] || []))];

    if (isPhotoVacation) packingList.photo = [...categories.photo];
    if (isSportEquipment) packingList.sport = [...categories.sport];

    savePackingList(packingList);
    renderPackingList();
    showListStep(); // Move to list step
});

// Add custom item
document.getElementById("addItem").addEventListener("click", () => {
    const customItemInput = document.getElementById("customItem");
    const customCategory = document.getElementById("customCategory").value;
    const customItem = customItemInput.value.trim();

    if (customItem) {
        let packingList = loadPackingList();
        if (!packingList[customCategory]) {
            packingList[customCategory] = [];
        }
        packingList[customCategory].push(customItem);
        savePackingList(packingList);
        customItemInput.value = "";
        renderPackingList();
    }
});

// Remove item
const removeItem = (category, index) => {
    let packingList = loadPackingList();
    packingList[category].splice(index, 1);
    savePackingList(packingList);
    renderPackingList();
};

// Clear list and restart
document.getElementById("clearList").addEventListener("click", () => {
    localStorage.removeItem("packingList");
    showSetupStep();
});

// Load list if it exists
document.addEventListener("DOMContentLoaded", () => {
    if (Object.keys(loadPackingList()).length > 0) {
        renderPackingList();
        showListStep();
    }
});
