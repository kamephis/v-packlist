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
const savePackingList = (list) => localStorage.setItem("packingList", JSON.stringify(list));

// Show the list step and hide the setup step
const showListStep = () => {
    document.getElementById("setupStep").classList.add("hidden");
    document.getElementById("listStep").classList.remove("hidden");
    renderPackingList();
};

// Show the setup step (reset)
const showSetupStep = () => {
    document.getElementById("setupStep").classList.remove("hidden");
    document.getElementById("listStep").classList.add("hidden");
};

// Generate Packing List
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
    showListStep();
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

// Export List
document.getElementById("exportList").addEventListener("click", () => {
    const packingList = loadPackingList();
    let textContent = "Packing List\n\n";

    for (const [category, items] of Object.entries(packingList)) {
        textContent += `**${category.toUpperCase()}**\n`;
        items.forEach(item => {
            textContent += `- ${item}\n`;
        });
        textContent += "\n";
    }

    const blob = new Blob([textContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "packing-list.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Render Packing List
const renderPackingList = () => {
    const packingListEl = document.getElementById("packingList");
    packingListEl.innerHTML = "";
    const packingList = loadPackingList();

    for (const [category, items] of Object.entries(packingList)) {
        if (items.length > 0) {
            const categoryContainer = document.createElement("div");
            categoryContainer.className = "mt-4";

            const categoryTitle = document.createElement("h3");
            categoryTitle.className = "text-lg font-bold cursor-pointer p-2 flex justify-between items-center";
            categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);

            const toggleIcon = document.createElement("span");
            toggleIcon.textContent = "−";
            toggleIcon.className = "text-xl font-bold";
            categoryTitle.appendChild(toggleIcon);

            const listContainer = document.createElement("div");
            listContainer.className = "mt-2 transition-all duration-300";

            categoryTitle.addEventListener("click", () => {
                listContainer.classList.toggle("hidden");
                toggleIcon.textContent = listContainer.classList.contains("hidden") ? "+" : "−";
            });

            const ul = document.createElement("ul");
            ul.className = "list-none";
            items.forEach((item, index) => {
                const li = document.createElement("li");
                li.className = "flex justify-between items-center bg-gray-200 p-2 rounded mt-2 border cursor-pointer transition-all duration-300";
                li.dataset.category = category;
                li.dataset.index = index;

                const itemName = typeof item === "string" ? item : item.name;
                li.innerHTML = `<span class="w-full">${itemName}</span>`;

                li.addEventListener("click", () => togglePacked(li));

                let startX = 0;

                li.addEventListener("touchstart", (e) => {
                    startX = e.touches[0].clientX;
                });

                li.addEventListener("touchend", (e) => {
                    let diffX = e.changedTouches[0].clientX - startX;
                    if (diffX < -50) {
                        li.style.transition = "transform 0.3s ease-out, opacity 0.3s ease-out";
                        li.style.transform = "translateX(-100%)";
                        li.style.opacity = "0";
                        setTimeout(() => removeItem(category, index), 300);
                    } else {
                        li.style.transform = "translateX(0px)";
                    }
                });

                if (window.innerWidth > 768) {
                    const deleteBtn = document.createElement("button");
                    deleteBtn.className = "text-red-500 ml-2";
                    deleteBtn.innerHTML = "❌";
                    deleteBtn.onclick = (event) => {
                        event.stopPropagation();
                        removeItem(category, index);
                    };
                    li.appendChild(deleteBtn);
                }

                ul.appendChild(li);
            });

            listContainer.appendChild(ul);
            categoryContainer.appendChild(categoryTitle);
            categoryContainer.appendChild(listContainer);
            packingListEl.appendChild(categoryContainer);
        }
    }
};

// Toggle Packed State
const togglePacked = (li) => {
    li.classList.toggle("bg-green-500");
    li.classList.toggle("text-white");
};

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

// Load list on startup
document.addEventListener("DOMContentLoaded", () => {
    if (Object.keys(loadPackingList()).length > 0) {
        renderPackingList();
        showListStep();
    }
});
