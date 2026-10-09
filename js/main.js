// بيانات المنتجات
const products = [
    {
        id: 1,
        name: "نظارات رياضية Ray-Ban",
        price: 12000,
        originalPrice: 15000,
        image: "images/product1.jpg",
        category: "sports",
        rating: 4.5,
        reviews: 125,
        colors: ["أسود", "أحمر", "أزرق"],
        sizes: ["S", "M", "L"],
        description: "نظارات رياضية عالية الجودة من Ray-Ban، مصممة لحماية عينيك خلال الأنشطة الرياضية المختلفة.",
        featured: true
    },
    {
        id: 2,
        name: "نظارات كلاسيكية Oakley",
        price: 10000,
        originalPrice: null,
        image: "images/product2.jpg",
        category: "classic",
        rating: 4.8,
        reviews: 200,
        colors: ["بني", "أسود", "عسلي"],
        sizes: ["M", "L"],
        description: "نظارات كلاسيكية أنيقة من Oakley، تجمع بين التصميم العصري والحماية الفعالة من أشعة الشمس.",
        featured: true
    },
    {
        id: 3,
        name: "نظارات طبية Gucci",
        price: 18000,
        originalPrice: 22000,
        image: "images/product3.jpg",
        category: "medical",
        rating: 4.7,
        reviews: 85,
        colors: ["أسود", "بني", "ذهبي"],
        sizes: ["S", "M", "L", "XL"],
        description: "نظارات طبية فاخرة من Gucci، مصممة لتوفير الراحة والحماية المثالية لعينيك.",
        featured: true
    },
    {
        id: 4,
        name: "نظارات أطفال ملونة",
        price: 5000,
        originalPrice: null,
        image: "images/product4.jpg",
        category: "kids",
        rating: 4.3,
        reviews: 65,
        colors: ["أزرق", "وردي", "أخضر"],
        sizes: ["S", "M"],
        description: "نظارات أطفال مصممة بألوان جذابة ومواد آمنة، لحماية عيون أطفالك من أشعة الشمس الضارة.",
        featured: true
    },
    {
        id: 5,
        name: "نظارات شمسية مستطيلة",
        price: 8000,
        originalPrice: 10000,
        image: "images/product5.jpg",
        category: "classic",
        rating: 4.6,
        reviews: 150,
        colors: ["أسود", "بني", "عسلي"],
        sizes: ["M", "L"],
        description: "نظارات شمسية مستطيلة أنيقة، مثالية للإطلالات اليومية والمناسبات الخاصة.",
        featured: true
    },
    {
        id: 6,
        name: "نظارات رياضية مقاومة للماء",
        price: 14000,
        originalPrice: null,
        image: "images/product6.jpg",
        category: "sports",
        rating: 4.9,
        reviews: 95,
        colors: ["أسود", "أزرق", "أخضر"],
        sizes: ["M", "L", "XL"],
        description: "نظارات رياضية مقاومة للماء، مصممة خصيصاً للأنشطة المائية والرياضات الخارجية.",
        featured: true
    }
];

// عربة التسوق
let cart = [];

// المفضلة
let favorites = [];

// تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedProducts();
    updateCartCount();

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
});

// تحميل المنتجات المميزة
function loadFeaturedProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    const featuredProducts = products.filter(product => product.featured);

    productsGrid.innerHTML = featuredProducts.map(product => `
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

// توليد نجوم التقييم
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

// عرض المنتج
function viewProduct(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// عرض سريع
function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // إنشاء نافذة منبثقة للعرض السريع
    const quickViewModal = document.createElement('div');
    quickViewModal.className = 'modal quick-view-modal';
    quickViewModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${product.name}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="quick-view-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="quick-view-info">
                    <div class="product-price">
                        ${product.originalPrice ? `<span class="original-price">${product.originalPrice} د.ج</span>` : ''}
                        ${product.price} د.ج
                    </div>
                    <div class="product-rating">
                        <div class="stars">${generateStars(product.rating)}</div>
                        <span class="rating-count">(${product.reviews})</span>
                    </div>
                    <p>${product.description}</p>
                    <div class="product-options">
                        <div class="color-options">
                            <h4>اللون:</h4>
                            <div class="color-picker">
                                ${product.colors.map(color => `
                                    <div class="color-option" data-color="${color}" style="background-color: ${getColorCode(color)}"></div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="size-options">
                            <h4>المقاس:</h4>
                            <div class="size-picker">
                                ${product.sizes.map(size => `
                                    <div class="size-option" data-size="${size}">${size}</div>
                                `).join('')}
                            </div>
                        </div>
                        <div class="quantity-selector">
                            <h4>الكمية:</h4>
                            <div class="quantity-controls">
                                <button class="quantity-btn decrease">-</button>
                                <input type="number" class="quantity-input" value="1" min="1" max="10">
                                <button class="quantity-btn increase">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="viewProduct(${product.id})">عرض التفاصيل</button>
                <button class="btn btn-primary" onclick="addToCart(${product.id})">أضف للسلة</button>
            </div>
        </div>
    `;

    document.body.appendChild(quickViewModal);

    // إظهار النافذة المنبثقة
    setTimeout(() => {
        quickViewModal.classList.add('show');
    }, 10);

    // إغلاق النافذة المنبثقة
    const closeModal = quickViewModal.querySelector('.close-modal');
    closeModal.addEventListener('click', () => {
        quickViewModal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(quickViewModal);
        }, 300);
    });

    // التحكم بالكمية
    const decreaseBtn = quickViewModal.querySelector('.decrease');
    const increaseBtn = quickViewModal.querySelector('.increase');
    const quantityInput = quickViewModal.querySelector('.quantity-input');

    decreaseBtn.addEventListener('click', () => {
        if (quantityInput.value > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    });

    increaseBtn.addEventListener('click', () => {
        if (quantityInput.value < 10) {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        }
    });

    // اختيار اللون
    const colorOptions = quickViewModal.querySelectorAll('.color-option');
    colorOptions[0].classList.add('selected');
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });

    // اختيار المقاس
    const sizeOptions = quickViewModal.querySelectorAll('.size-option');
    sizeOptions[0].classList.add('selected');
    sizeOptions.forEach(option => {
        option.addEventListener('click', () => {
            sizeOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
        });
    });
}

// الحصول على كود اللون
function getColorCode(colorName) {
    const colors = {
        'أسود': '#000000',
        'أبيض': '#FFFFFF',
        'أحمر': '#FF0000',
        'أزرق': '#0000FF',
        'أخضر': '#008000',
        'أصفر': '#FFFF00',
        'بني': '#8B4513',
        'عسلي': '#D2B48C',
        'برتقالي': '#FFA500',
        'وردي': '#FFC0CB',
        'بنفسجي': '#800080',
        'رمادي': '#808080',
        'فضي': '#C0C0C0',
        'ذهبي': '#FFD700'
    };

    return colors[colorName] || '#CCCCCC';
}

// إضافة للسلة
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity
        });
    }

    updateCartCount();
    showNotification(`تمت إضافة "${product.name}" إلى سلة التسوق بنجاح!`, 'success');

    // إغلاق النافذة المنبثقة للعرض السريع إذا كانت مفتوحة
    const quickViewModal = document.querySelector('.quick-view-modal');
    if (quickViewModal) {
        quickViewModal.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(quickViewModal);
        }, 300);
    }
}

// تحديث عداد السلة
function updateCartCount() {
    const cartCount = document.querySelector('.icon-link .count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// تبديل المفضلة
function toggleFavorite(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const index = favorites.indexOf(productId);
    if (index > -1) {
        favorites.splice(index, 1);
        showNotification(`تمت إزالة "${product.name}" من المفضلة`, 'info');
    } else {
        favorites.push(productId);
        showNotification(`تمت إضافة "${product.name}" إلى المفضلة`, 'success');
    }

    // تحديث أيقونة القلب
    const heartIcon = document.querySelector(`.action-btn[onclick="toggleFavorite(${productId})"] i`);
    if (heartIcon) {
        heartIcon.className = index > -1 ? 'far fa-heart' : 'fas fa-heart';
    }
}

// عرض الإشعارات
function showNotification(message, type = 'info') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // إضافة الإشعار إلى الصفحة
    document.body.appendChild(notification);

    // إظهار الإشعار
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // إخفاء الإشعار بعد 3 ثوانٍ
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// حفظ السلة في التخزين المحلي
function saveCartToLocalStorage() {
    localStorage.setItem('visionCart', JSON.stringify(cart));
}

// تحميل السلة من التخزين المحلي
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('visionCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// حفظ المفضلة في التخزين المحلي
function saveFavoritesToLocalStorage() {
    localStorage.setItem('visionFavorites', JSON.stringify(favorites));
}

// تحميل المفضلة من التخزين المحلي
function loadFavoritesFromLocalStorage() {
    const savedFavorites = localStorage.getItem('visionFavorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
    }
}

// فلترة المنتجات حسب الفئة
function filterProductsByCategory(category) {
    return products.filter(product => product.category === category);
}

// فلترة المنتجات حسب النطاق السعري
function filterProductsByPrice(minPrice, maxPrice) {
    return products.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
    );
}

// البحث عن المنتجات
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
}

// ترتيب المنتجات
function sortProducts(productsArray, sortBy) {
    const sortedProducts = [...productsArray];
    
    switch(sortBy) {
        case 'price-low-high':
            return sortedProducts.sort((a, b) => a.price - b.price);
        case 'price-high-low':
            return sortedProducts.sort((a, b) => b.price - a.price);
        case 'rating-high-low':
            return sortedProducts.sort((a, b) => b.rating - a.rating);
        case 'newest':
        default:
            return sortedProducts.sort((a, b) => b.id - a.id);
    }
}

// حساب الإجمالي
function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}
