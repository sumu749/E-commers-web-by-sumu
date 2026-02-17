// --- Products & Categories (uses fakestoreapi) ---
// Load top 3 trending products for the home page
async function loadTrendingProducts() {
    try {
        const res = await fetch("https://fakestoreapi.com/products");
        const products = await res.json();

        const topProducts = products
            .sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
            .slice(0, 3);

        const container = document.getElementById("products-container");
        if (!container) return;
        container.innerHTML = "";

        topProducts.forEach((product) => {
            const rating = product.rating?.rate || 0;
            const card = document.createElement("div");
            card.className =
                "bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100";
            card.innerHTML = `
                                <div class="p-4">
                                    <div class="bg-gray-50 rounded-lg h-48 flex items-center justify-center overflow-hidden mb-4">
                                        <img src="${product.image}" alt="${product.title}" class="max-h-40 object-contain p-4">
                                    </div>
                                    <div class="flex items-center justify-between mb-2">
                                        <p class="text-indigo-600 text-xs font-medium px-3 py-1 bg-indigo-50 rounded-xl">${product.category}</p>
                                        <div class="flex items-center gap-1">
                                            <i class="fa-solid fa-star text-yellow-400 text-sm"></i>
                                            <span class="text-sm font-semibold text-gray-900">${rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                    <h3 class="text-gray-900 font-semibold mb-2 line-clamp-2">${product.title}</h3>
                                    <p class="text-lg font-bold text-gray-900 mb-4">$${product.price.toFixed(2)}</p>
                                    <div class="flex items-center justify-between gap-3">
                                        <button data-id="${product.id}" class="details-btn flex-1 border border-gray-200 text-gray-700 py-2 rounded text-sm font-semibold hover:bg-gray-50">
                                            <i class="fa-solid fa-circle-info mr-2"></i>Details
                                        </button>
                                        <button data-id="${product.id}" class="add-btn bg-indigo-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-indigo-700">
                                            <i class="fa-solid fa-cart-plus mr-2"></i>Add
                                        </button>
                                    </div>
                                </div>
                        `;
            container.appendChild(card);

            const detailsBtn = card.querySelector(".details-btn");
            const addBtn = card.querySelector(".add-btn");
            if (detailsBtn)
                detailsBtn.addEventListener("click", () => openModal(product));
            if (addBtn)
                addBtn.addEventListener("click", () =>
                    addToCart(product.id, product),
                );
        });
    } catch (err) {
        console.error("Error loading trending products", err);
    }
}

async function loadCategories() {
    try {
        const res = await fetch("https://fakestoreapi.com/products/categories");
        const cats = await res.json();
        const container = document.getElementById("categories-container");
        if (!container) return;
        container.innerHTML = "";

        const allBtn = document.createElement("button");
        allBtn.className =
            "px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold shadow-sm";
        allBtn.textContent = "All";
        allBtn.addEventListener("click", () => {
            Array.from(container.children).forEach((c) =>
                c.classList.remove("bg-indigo-600", "text-white"),
            );
            allBtn.classList.add("bg-indigo-600", "text-white");
            loadProducts();
        });
        container.appendChild(allBtn);

        cats.forEach((c) => {
            const btn = document.createElement("button");
            btn.className =
                "px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200";
            btn.textContent = c;
            btn.addEventListener("click", () => {
                Array.from(container.children).forEach((ch) =>
                    ch.classList.remove("bg-indigo-600", "text-white"),
                );
                btn.classList.add("bg-indigo-600", "text-white");
                loadProducts(c);
            });
            container.appendChild(btn);
        });
    } catch (err) {
        console.error("Error loading categories", err);
    }
}

async function loadProducts(category) {
    try {
        const url = category
            ? `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`
            : "https://fakestoreapi.com/products";
        const res = await fetch(url);
        const products = await res.json();

        const container = document.getElementById("products-container");
        if (!container) return;
        container.innerHTML = "";
        const productMap = new Map();

        products.forEach((product) => {
            productMap.set(product.id, product);
            const rating = product.rating?.rate || 0;

            const productCard = document.createElement("div");
            productCard.className =
                "bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100";
            productCard.innerHTML = `
                <div class="p-4">
                  <div class="bg-gray-50 rounded-lg h-48 flex items-center justify-center overflow-hidden mb-4">
                    <img src="${product.image}" alt="${product.title}" class="max-h-40 object-contain p-4">
                  </div>
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-indigo-600 text-xs font-medium px-3 py-1 bg-indigo-50 rounded-xl">${product.category}</p>
                    <div class="flex items-center gap-1">
                      <i class="fa-solid fa-star text-yellow-400 text-sm"></i>
                      <span class="text-sm font-semibold text-gray-900">${rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <h3 class="text-gray-900 font-semibold mb-2 line-clamp-2">${product.title}</h3>
                  <p class="text-lg font-bold text-gray-900 mb-4">$${product.price.toFixed(2)}</p>
                  <div class="flex items-center justify-between gap-3">
                    <button data-id="${product.id}" class="details-btn flex-1 border border-gray-200 text-gray-700 py-2 rounded text-sm font-semibold hover:bg-gray-50">
                      <i class="fa-solid fa-circle-info mr-2"></i>Details
                    </button>
                    <button data-id="${product.id}" class="add-btn bg-indigo-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-indigo-700">
                      <i class="fa-solid fa-cart-plus mr-2"></i>Add
                    </button>
                  </div>
                </div>
            `;
            container.appendChild(productCard);

            // event listeners for buttons
            const detailsBtn = productCard.querySelector(".details-btn");
            const addBtn = productCard.querySelector(".add-btn");
            if (detailsBtn) {
                detailsBtn.addEventListener("click", () => {
                    const id = Number(detailsBtn.getAttribute("data-id"));
                    const p = productMap.get(id);
                    if (p) {
                        openModal(p);
                        // wire Buy Now to this product
                        const modalBuy = document.getElementById("modal-buy");
                        if (modalBuy)
                            modalBuy.onclick = () => {
                                addToCart(p.id, p);
                                alert(
                                    "Added to cart. Proceed to checkout (not implemented).",
                                );
                                closeModal();
                            };
                    }
                });
            }
            if (addBtn) {
                addBtn.addEventListener("click", () => {
                    const id = Number(addBtn.getAttribute("data-id"));
                    addToCart(id, productMap.get(id));
                });
            }
        });
    } catch (error) {
        console.error("Error loading products:", error);
        const container = document.getElementById("products-container");
        if (container)
            container.innerHTML =
                '<div class="text-center text-red-600">Error loading products. Please try again later.</div>';
    }
}

// fetch single product and open modal
async function fetchProductById(id) {
    try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const product = await res.json();
        openModal(product);
        const modalBuy = document.getElementById("modal-buy");
        if (modalBuy)
            modalBuy.onclick = () => {
                addToCart(product.id, product);
                alert("Added to cart. Proceed to checkout (not implemented).");
                closeModal();
            };
    } catch (err) {
        console.error("Error fetching product by id", err);
    }
}

// decide what to load based on page and URL params
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    const idParam = params.get("id");

    const pathname = window.location.pathname || "";

    // If we are on the products page (products.html or categories container exists), load full products UI
    if (
        pathname.includes("products.html") ||
        document.getElementById("categories-container")
    ) {
        loadCategories();
        if (categoryParam) {
            loadProducts(categoryParam);
            // mark active category after a short delay to ensure buttons exist
            setTimeout(() => {
                const container = document.getElementById(
                    "categories-container",
                );
                if (container) {
                    Array.from(container.children).forEach((ch) => {
                        if (
                            ch.textContent.trim().toLowerCase() ===
                            categoryParam.toLowerCase()
                        )
                            ch.classList.add("bg-indigo-600", "text-white");
                    });
                }
            }, 300);
        } else {
            loadProducts();
        }
        if (idParam) fetchProductById(idParam);
    } else {
        // Otherwise assume home page — load trending top 3
        loadTrendingProducts();
    }
});

// CART & MODAL UTILS
let cartCount = Number(localStorage.getItem("cartCount") || "0");
const cartCountEl = document.getElementById("cart-count");
function updateCartBadge() {
    if (cartCountEl) cartCountEl.textContent = String(cartCount);
}
function addToCart(id, product) {
    cartCount += 1;
    localStorage.setItem("cartCount", String(cartCount));
    updateCartBadge();
}

// Modal functions
const modal = document.getElementById("product-modal");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDesc = document.getElementById("modal-desc");
const modalPrice = document.getElementById("modal-price");
const modalRating = document.getElementById("modal-rating");
const modalAdd = document.getElementById("modal-add");
const modalClose = document.getElementById("modal-close");
const modalClose2 = document.getElementById("modal-close-2");

function openModal(product) {
    if (!modal) return;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    if (modalImage) modalImage.src = product.image;
    if (modalTitle) modalTitle.textContent = product.title;
    if (modalDesc) modalDesc.textContent = product.description;
    if (modalPrice) modalPrice.textContent = `$${product.price.toFixed(2)}`;
    if (modalRating)
        modalRating.textContent = `${(product.rating?.rate || 0).toFixed(1)} (${product.rating?.count || 0})`;
    if (modalAdd) {
        modalAdd.onclick = () => {
            addToCart(product.id, product);
            closeModal();
        };
    }
    // wire Buy Now button if present
    const modalBuy = document.getElementById("modal-buy");
    if (modalBuy) {
        modalBuy.onclick = () => {
            addToCart(product.id, product);

            alert(
                "Product added to cart. Proceed to checkout (not implemented).",
            );
            closeModal();
        };
    }

    // close when clicking outside the dialog (overlay)
    const onOverlayClick = (e) => {
        if (e.target === modal) closeModal();
    };
    modal.addEventListener("click", onOverlayClick);

    // close on Escape key
    const onKeyDown = (e) => {
        if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKeyDown);

    // store listeners so they can be removed on close
    modal._onOverlayClick = onOverlayClick;
    modal._onKeyDown = onKeyDown;
}
function closeModal() {
    if (!modal) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    // remove listeners added by openModal
    if (modal._onOverlayClick) {
        modal.removeEventListener("click", modal._onOverlayClick);
        delete modal._onOverlayClick;
    }
    if (modal._onKeyDown) {
        document.removeEventListener("keydown", modal._onKeyDown);
        delete modal._onKeyDown;
    }
}
if (modalClose) modalClose.addEventListener("click", closeModal);
if (modalClose2) modalClose2.addEventListener("click", closeModal);

// initialize badge
updateCartBadge();

// Highlight active nav link based on current page
function setActiveNav() {
    const current = (
        window.location.pathname.split("/").pop() || "index.html"
    ).toLowerCase();
    const anchors = document.querySelectorAll(".fixed a[href]");
    anchors.forEach((a) => {
        try {
            const hrefPath = new URL(
                a.getAttribute("href"),
                window.location.href,
            ).pathname
                .split("/")
                .pop()
                .toLowerCase();
            if (
                (hrefPath === "" && current === "index.html") ||
                hrefPath === current
            ) {
                a.classList.add("text-indigo-600", "font-semibold");
            } else {
                a.classList.remove("text-indigo-600", "font-semibold");
            }
        } catch (e) {
            // ignore invalid URLs
        }
    });
}

document.addEventListener("DOMContentLoaded", setActiveNav);
