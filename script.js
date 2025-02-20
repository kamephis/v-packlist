<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Packing List App</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 text-gray-900">

    <div class="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
        <h1 class="text-2xl font-bold text-center">📦 Packing List</h1>

        <!-- Step 1: Create List -->
        <div id="setupStep">
            <div class="mt-4">
                <label class="block text-sm font-medium">Number of Days:</label>
                <input type="number" id="tripDays" class="w-full p-2 border rounded mt-1" min="1" value="3">
            </div>

            <div class="mt-4">
                <label class="block text-sm font-medium">Trip Type:</label>
                <select id="tripType" class="w-full p-2 border rounded mt-1">
                    <option value="vacation">Vacation</option>
                    <option value="day_trip">Day Trip</option>
                </select>
            </div>

            <div class="mt-4">
                <label class="block text-sm font-medium">Climate:</label>
                <select id="climateType" class="w-full p-2 border rounded mt-1">
                    <option value="sunny">Sunny/Beach</option>
                    <option value="mountain">Mountain</option>
                    <option value="rainy">Rainy</option>
                    <option value="cold">Cold</option>
                </select>
            </div>

            <!-- Additional Options -->
            <div class="mt-4">
                <label class="flex items-center">
                    <input type="checkbox" id="photoVacation" class="mr-2">
                    Include Photo Equipment
                </label>
                <label class="flex items-center mt-2">
                    <input type="checkbox" id="sportEquipment" class="mr-2">
                    Include Sport Equipment
                </label>
                <label class="flex items-center mt-2">
                    <input type="checkbox" id="hotelStay" class="mr-2">
                    Staying at a Hotel
                </label>
            </div>

            <button id="generateList" class="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                Generate Packing List
            </button>
        </div>

        <!-- Step 2: View List -->
        <div id="listStep" class="hidden">
            <h2 class="text-xl font-bold mt-6">Your Packing List</h2>
            <div id="packingList" class="mt-2"></div>

            <!-- Add Custom Item -->
            <div class="mt-8">  <!-- Increased margin for better UX -->
                <h3 class="text-lg font-semibold mt-6">Add Custom Item</h3>
                <div class="mt-4 flex">
                    <input type="text" id="customItem" class="w-full p-2 border rounded" placeholder="Add custom item">
                    <select id="customCategory" class="ml-2 p-2 border rounded">
                        <option value="essentials">Essentials</option>
                        <option value="clothing">Clothing</option>
                        <option value="electronics">Electronics</option>
                        <option value="photo">Photo Equipment</option>
                        <option value="sport">Sport Equipment</option>
                    </select>
                    <button id="addItem" class="ml-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">+</button>
                </div>
            </div>

            <!-- Export & Import Buttons -->
            <div class="mt-6 flex justify-between">
                <button id="exportList" class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600">Export List</button>
                <input type="file" id="importList" accept=".json" class="hidden">
                <label for="importList" class="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-gray-600">Import List</label>
            </div>

            <!-- Start Over Button (Extra Spacing for Better UX) -->
            <button id="clearList" class="mt-20 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600">
                Start Over
            </button>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>
