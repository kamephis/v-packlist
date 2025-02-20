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
    renderPackingList(); // Ensure list updates correctly
};

// Show the setup step (reset)
const showSetupStep = () => {
    document.getElementById("setupStep").classList.remove("hidden");
    document.getElementById("listStep").classList.add("hidden");
};

// Generate Packing List (Fixed)
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
    showListStep(); // Move to list step
});

// Add custom item (Fixed)
document.getElementById("addItem").addEventListener("click", () => {
    const customItemInput = document.getElementById("customItem");
    const customCategory = document.getElementById("customCategory").value;
    const customItem = customItemInput.value.trim();

    if (customItem) {
        let packingList = loadPackingList();

        // Ensure category exists
        if (!packingList[customCategory]) {
            packingList[customCategory] = [];
        }

        // Add new item
        packingList[customCategory].push(customItem);
        savePackingList(packingList);

        // Clear input field
        customItemInput.value = "";

        // Refresh list
        renderPackingList();
    }
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

            // Category Title (Clickable for Accordion)
            const categoryTitle = document.createElement("h3");
            categoryTitle.className = "text-lg font-bold cursor-pointer p-2 flex justify-between items-center";
            categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);

            // Toggle Icon (+ / -)
            const toggleIcon = document.createElement("span");
            toggleIcon.textContent = "−"; // Default: Open
            toggleIcon.className = "text-xl font-bold";
            categoryTitle.appendChild(toggleIcon);

            // List Container (Initially Visible)
            const listContainer = document.createElement("div");
            listContainer.className = "mt-2 transition-all duration-300";

            // Toggle Accordion Functionality
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

                // Fix `[object Object]` issue
                const itemName = typeof item === "string" ? item : item.name;
                li.innerHTML = `<span class="w-full">${itemName}</span>`;

                // Click/Tap to toggle packed state
                li.addEventListener("click", () => togglePacked(li));

                // Swipe left to remove (mobile) - Fixed
                let startX = 0;
                let isSwiping = false;

                li.addEventListener("touchstart", (e) => {
                    startX = e.touches[0].clientX;
                    isSwiping = false;
                });

                li.addEventListener("touchmove", (e) => {
                    let diffX = e.touches[0].clientX - startX;
                    if (Math.abs(diffX) > 10) {
                        isSwiping = true;
                        e.preventDefault(); // Prevent scrolling while swiping
                        li.style.transform = `translateX(${diffX}px)`;
                    }
                });

                li.addEventListener("touchend", (e) => {
                    let diffX = e.changedTouches[0].clientX - startX;

                    if (diffX < -50) {
                        // Swipe Left → Remove Item (with smooth animation)
                        li.style.transition = "transform 0.3s ease-out, opacity 0.3s ease-out";
                        li.style.transform = "translateX(-100%)";
                        li.style.opacity = "0";

                        setTimeout(() => {
                            removeItem(category, index);
                        }, 300);
                    } else {
                        li.style.transform = "translateX(0px)";
                    }
                });

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

    // Remove item from category
    packingList[category].splice(index, 1);

    // If category is empty, remove it entirely
    if (packingList[category].length === 0) {
        delete packingList[category];
    }

    // Save updated list and refresh UI
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
