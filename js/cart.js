// تهيئة صفحة سلة التسوق
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
    loadCartItems();
    updateCartSummary();

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

    // إفراغ السلة
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function() {
            if (confirm('هل أنت متأكد من أنك تريد إفراغ سلة التسوق؟')) {
                cart = [];
                saveCartToLocalStorage();
                loadCartItems();
                updateCartSummary();
                updateCartCount();
                showNotification('تم إفراغ سلة التسوق بنجاح', 'success');
            }
        });
    }
});

// تحميل عناصر السلة
function loadCartItems() {
    const cartItemsContainer = document.getElementById('cart-items-container');
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="empty-cart-message">
                    سلة التسوق فارغة حالياً
                </div>
                <a href="products.html" class="btn btn-primary">
                    <i class="fas fa-arrow-left"></i> استمر في التسوق
                </a>
            </div>
        `;
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-info">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-options">
                        ${item.selectedColor ? `اللون: ${item.selectedColor}` : ''} 
                        ${item.selectedSize ? `| المقاس: ${item.selectedSize}` : ''}
                    </div>
                </div>
            </div>
            <div class="cart-item-price" data-label="السعر">${item.price} د.ج</div>
            <div class="cart-item-quantity" data-label="الكمية">
                <button class="quantity-btn decrease">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10">
                <button class="quantity-btn increase">+</button>
            </div>
            <div class="cart-item-total" data-label="الإجمالي">${item.price * item.quantity} د.ج</div>
            <button class="cart-item-remove">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');

    // إضافة مستمعي الأحداث
    addCartEventListeners();
}

// إضافة مستمعي الأحداث لعناصر السلة
function addCartEventListeners() {
    // أزرار التحكم بالكمية
    const decreaseButtons = document.querySelectorAll('.cart-item .decrease');
    const increaseButtons = document.querySelectorAll('.cart-item .increase');
    const quantityInputs = document.querySelectorAll('.cart-item .quantity-input');

    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const itemId = parseInt(cartItem.dataset.id);
            const input = cartItem.querySelector('.quantity-input');

            if (input.value > 1) {
                input.value = parseInt(input.value) - 1;
                updateCartItemQuantity(itemId, parseInt(input.value));
            }
        });
    });

    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const itemId = parseInt(cartItem.dataset.id);
            const input = cartItem.querySelector('.quantity-input');

            if (input.value < 10) {
                input.value = parseInt(input.value) + 1;
                updateCartItemQuantity(itemId, parseInt(input.value));
            }
        });
    });

    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const cartItem = this.closest('.cart-item');
            const itemId = parseInt(cartItem.dataset.id);
            const quantity = parseInt(this.value);

            if (quantity >= 1 && quantity <= 10) {
                updateCartItemQuantity(itemId, quantity);
            } else {
                this.value = cart.find(item => item.id === itemId).quantity;
            }
        });
    });

    // أزرار الحذف
    const removeButtons = document.querySelectorAll('.cart-item-remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const itemId = parseInt(cartItem.dataset.id);

            if (confirm('هل أنت متأكد من أنك تريد حذف هذا المنتج من السلة؟')) {
                removeCartItem(itemId);
            }
        });
    });
}

// تحديث كمية المنتج في السلة
function updateCartItemQuantity(itemId, quantity) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = quantity;
        saveCartToLocalStorage();

        // تحديث الإجمالي للمنتج
        const cartItem = document.querySelector(`.cart-item[data-id="${itemId}"]`);
        const item = cart[itemIndex];
        cartItem.querySelector('.cart-item-total').textContent = `${item.price * item.quantity} د.ج`;

        // تحديث ملخص السلة
        updateCartSummary();
        updateCartCount();
    }
}

// حذف المنتج من السلة
function removeCartItem(itemId) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        const item = cart[itemIndex];
        cart.splice(itemIndex, 1);
        saveCartToLocalStorage();
        loadCartItems();
        updateCartSummary();
        updateCartCount();
        showNotification(`تم حذف "${item.name}" من سلة التسوق`, 'info');
    }
}

// تحديث ملخص السلة
function updateCartSummary() {
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');

    if (!subtotalElement || !shippingElement || !taxElement || !totalElement) return;

    // حساب الإجمالي الفرعي
    const subtotal = calculateCartTotal();
    subtotalElement.textContent = `${subtotal} د.ج`;

    // حساب تكاليف الشحن
    const shipping = subtotal > 0 ? 500 : 0;
    shippingElement.textContent = `${shipping} د.ج`;

    // حساب الضريبة (10%)
    const tax = Math.round(subtotal * 0.1);
    taxElement.textContent = `${tax} د.ج`;

    // حساب الإجمالي النهائي
    const total = subtotal + shipping + tax;
    totalElement.textContent = `${total} د.ج`;
}

// حساب إجمالي السلة
function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}
