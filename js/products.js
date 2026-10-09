// تهيئة صفحة المنتجات
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
    loadFavoritesFromLocalStorage();
    loadProducts();

    // البحث في الموقع
    const searchForm = document.querySelector('.search-box');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchTerm = this.querySelector('input').value.trim();
            if (searchTerm) {
                window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }

    // النموذج البريدي
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value.trim();
            if (email) {
                showNotification('تم الاشتراك بنجاح! ستصلك آخر العروض على بريدك الإلكتروني.', 'success');
                this.querySelector('input').value = '';
            }
        });
    }

    // فلترة حسب السعر
    const applyPriceFilter = document.getElementById('apply-price-filter');
    if (applyPriceFilter) {
        applyPriceFilter.addEventListener('click', applyFilters);
    }

    // فلترة حسب التصنيف
    const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // فلترة حسب اللون
    const colorCheckboxes = document.querySelectorAll('.color-checkbox');
    colorCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // فلترة حسب الماركة
    const brandCheckboxes = document.querySelectorAll('.brand-checkbox');
    brandCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // فلترة حسب التقييم
    const ratingCheckboxes = document.querySelectorAll('.rating-checkbox');
    ratingCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // إعادة تعيين الفلاتر
    const resetFilters = document.getElementById('reset-filters');
    if (resetFilters) {
        resetFilters.addEventListener('click', function() {
            document.getElementById('min-price').value = '';
            document.getElementById('max-price').value = '';

            document.querySelectorAll('.category-checkbox, .color-checkbox, .brand-checkbox, .rating-checkbox').forEach(checkbox => {
                checkbox.checked = false;
            });

            applyFilters();
        });
    }

    // تغيير طريقة العرض
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            viewButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const productsGrid = document.getElementById('products-grid');
            if (this.dataset.view === 'list') {
                productsGrid.classList.remove('products-grid');
                productsGrid.classList.add('products-list');
            } else {
                productsGrid.classList.remove('products-list');
                productsGrid.classList.add('products-grid');
            }
        });
    });

    // ترتيب المنتجات
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            applyFilters();
        });
    }

    // ترقيم الصفحات
    const prevPage = document.getElementById('prev-page');
    const nextPage = document.getElementById('next-page');

    if (prevPage) {
        prevPage.addEventListener('click', function() {
            // تنفيذ الانتقال للصفحة السابقة
            showNotification('الانتقال للصفحة السابقة', 'info');
        });
    }

    if (nextPage) {
        nextPage.addEventListener('click', function() {
            // تنفيذ الانتقال للصفحة التالية
            showNotification('الانتقال للصفحة التالية', 'info');
        });
    }
});

// تحميل المنتجات
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    let filteredProducts = [...products];

    // تطبيق الفلاتر
    filteredProducts = applyCurrentFilters(filteredProducts);

    // ترتيب المنتجات
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        filteredProducts = sortProducts(filteredProducts, sortSelect.value);
    }

    // تحديث عدد المنتجات
    const resultsNumber = document.getElementById('results-number');
    if (resultsNumber) {
        resultsNumber.textContent = filteredProducts.length;
    }

    // عرض المنتجات
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-actions">
                    <div class="action-btn" onclick="toggleFavorite(${product.id})">
                        <i class="${favorites.includes(product.id) ? 'fas' : 'far'} fa-heart"></i>
                    </div>
                    <div class="action-btn" onclick="quickView(${product.id})">
                        <i class="fas fa-eye"></i>
                    </div>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    ${product.originalPrice ? `<span class="original-price">${product.originalPrice} د.ج</span>` : ''}
                    ${product.price} د.ج
                </div>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-buttons">
                    <button class="btn btn-secondary" onclick="viewProduct(${product.id})">عرض التفاصيل</button>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">أضف للسلة</button>
                </div>
            </div>
        </div>
    `).join('');
}

// تطبيق الفلاتر الحالية
function applyCurrentFilters(productsArray) {
    let filteredProducts = [...productsArray];

    // فلترة حسب السعر
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;

    if (minPrice || maxPrice) {
        const min = minPrice ? parseInt(minPrice) : 0;
        const max = maxPrice ? parseInt(maxPrice) : Infinity;

        filteredProducts = filteredProducts.filter(product => 
            product.price >= min && product.price <= max
        );
    }

    // فلترة حسب التصنيف
    const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked'))
        .map(checkbox => checkbox.value);

    if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedCategories.includes(product.category)
        );
    }

    // فلترة حسب اللون
    const selectedColors = Array.from(document.querySelectorAll('.color-checkbox:checked'))
        .map(checkbox => checkbox.value);

    if (selectedColors.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            product.colors.some(color => selectedColors.includes(color))
        );
    }

    // فلترة حسب الماركة
    const selectedBrands = Array.from(document.querySelectorAll('.brand-checkbox:checked'))
        .map(checkbox => checkbox.value);

    if (selectedBrands.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedBrands.some(brand => product.name.includes(brand))
        );
    }

    // فلترة حسب التقييم
    const selectedRatings = Array.from(document.querySelectorAll('.rating-checkbox:checked'))
        .map(checkbox => parseInt(checkbox.value));

    if (selectedRatings.length > 0) {
        const minRating = Math.min(...selectedRatings);
        filteredProducts = filteredProducts.filter(product => 
            product.rating >= minRating
        );
    }

    return filteredProducts;
}

// تطبيق الفلاتر
function applyFilters() {
    loadProducts();
}

// الحصول على معلمات URL
function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        search: urlParams.get('search') || '',
        category: urlParams.get('category') || '',
        minPrice: urlParams.get('minPrice') || '',
        maxPrice: urlParams.get('maxPrice') || ''
    };
}

// تطبيق معلمات URL عند تحميل الصفحة
function applyUrlParams() {
    const params = getUrlParams();

    // تطبيق البحث
    if (params.search) {
        document.querySelector('.search-box input').value = params.search;
    }

    // تطبيق التصنيف
    if (params.category) {
        const categoryCheckbox = document.querySelector(`.category-checkbox[value="${params.category}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
        }
    }

    // تطبيق نطاق السعر
    if (params.minPrice) {
        document.getElementById('min-price').value = params.minPrice;
    }

    if (params.maxPrice) {
        document.getElementById('max-price').value = params.maxPrice;
    }

    // تطبيق الفلاتر
    applyFilters();
}

// تحديث URL مع الفلاتر الحالية
function updateUrlWithFilters() {
    const params = new URLSearchParams();

    // إضافة البحث
    const searchValue = document.querySelector('.search-box input').value.trim();
    if (searchValue) {
        params.set('search', searchValue);
    }

    // إضافة التصنيف
    const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked'))
        .map(checkbox => checkbox.value);

    if (selectedCategories.length > 0) {
        params.set('category', selectedCategories[0]);
    }

    // إضافة نطاق السعر
    const minPrice = document.getElementById('min-price').value;
    const maxPrice = document.getElementById('max-price').value;

    if (minPrice) {
        params.set('minPrice', minPrice);
    }

    if (maxPrice) {
        params.set('maxPrice', maxPrice);
    }

    // تحديث URL
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
}
