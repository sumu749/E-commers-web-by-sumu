async function loadTrendingProducts() {
    try {
        const response = await fetch("https://fakestoreapi.com/products");
        const products = await response.json();

        const topProducts = products
            .sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
            .slice(0, 3);

        const container = document.getElementById("products-container");
        container.innerHTML = "";

        topProducts.forEach((product) => {
            const rating = product.rating?.rate || 0;
            const ratingCount = product.rating?.count || 0;
            const categoryMap = {
                1: "Men's Clothing",
                2: "Women's Clothing",
                3: "Electronics",
                4: "Jewelry",
            };
            const category = categoryMap[product.category] || product.category;

            const productCard = document.createElement("div");
            productCard.className =
                "bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow";
            productCard.innerHTML = `
                <div class="bg-gray-200 h-64 flex items-center justify-center overflow-hidden">
                    <img src="${product.image}" alt="${product.title}" class="h-full object-contain p-4">
                </div>
                <div class="p-4">
                    <div class="flex items-center justify-between mb-2">
                    <p class="text-indigo-600 text-xs font-medium px-3 py-1 bg-indigo-50 rounded-xl">${category}</p>
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center gap-1">
                            <i class="fa-solid fa-star text-yellow-400 text-sm"></i>
                            <span class="text-sm font-semibold text-gray-900">${rating.toFixed(1)} (${ratingCount})</span>
                        </div>
                    </div>
                    </div>
                    <h3 class="text-gray-900 font-semibold mb-2 line-clamp-2">
                        ${product.title}
                    </h3>
                    <p class="text-lg font-bold text-gray-900 mb-4">
                        $${product.price.toFixed(2)}
                    </p>
                    <div class="flex gap-2">
                        <button class="flex-1 bg-gray-100 text-gray-900 py-2 rounded text-sm font-semibold hover:bg-gray-200">
                            <span>
                                <i class="fa-solid fa-eye"></i>
                            </span>
                            <span>Details</span>
                        </button>
                        <button class="flex-1 bg-indigo-600 text-white py-2 rounded text-sm font-semibold hover:bg-indigo-700">
                            Add
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(productCard);
        });
    } catch (error) {
        console.error("Error loading products:", error);
        document.getElementById("products-container").innerHTML =
            '<div class="text-center text-red-600">Error loading products. Please try again later.</div>';
    }
}

// Load products when page loads
document.addEventListener("DOMContentLoaded", loadTrendingProducts);
