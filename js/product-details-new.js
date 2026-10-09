// تهيئة صفحة تفاصيل المنتج
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
    loadFavoritesFromLocalStorage();

    // الحصول على معرف المنتج من URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (productId) {
        loadProductDetails(productId);
    } else {
        // إذا لم يتم تحديد معرف المنتج، الانتقال إلى صفحة المنتجات
        window.location.href = 'products.html';
    }

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

    // تغيير الصورة الرئيسية عند النقر على المصغرات
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-product-image');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // إزالة الفئة النشطة من جميع المصغرات
            thumbnails.forEach(t => t.classList.remove('active'));

            // إضافة الفئة النشطة للمصغرة المحددة
            this.classList.add('active');

            // تغيير الصورة الرئيسية
            mainImage.src = this.src.replace('-thumb', '');
        });
    });

    // التحكم بالكمية
    const decreaseBtn = document.querySelector('.quantity-btn.decrease');
    const increaseBtn = document.querySelector('.quantity-btn.increase');
    const quantityInput = document.getElementById('quantity-input');

    decreaseBtn.addEventListener('click', function() {
        if (quantityInput.value > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    });

    increaseBtn.addEventListener('click', function() {
        if (quantityInput.value < 10) {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        }
    });

    // إضافة للسلة
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            const quantity = parseInt(quantityInput.value);
            addToCart(productId, quantity);
        });
    }

    // إضافة للمفضلة
    const addToFavoritesBtn = document.getElementById('add-to-favorites-btn');
    if (addToFavoritesBtn) {
        addToFavoritesBtn.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            toggleFavorite(productId);

            // تحديث أيقونة القلب
            const heartIcon = this.querySelector('i');
            if (favorites.includes(productId)) {
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
            } else {
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
            }
        });
    }

    // مشاركة المنتج
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            // إنشاء نافذة منبثقة للمشاركة
            const shareModal = document.createElement('div');
            shareModal.className = 'modal share-modal';
            shareModal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>مشاركة المنتج</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="share-options">
                            <a href="#" class="share-option" data-platform="facebook">
                                <i class="fab fa-facebook-f"></i>
                                <span>فيسبوك</span>
                            </a>
                            <a href="#" class="share-option" data-platform="twitter">
                                <i class="fab fa-twitter"></i>
                                <span>تويتر</span>
                            </a>
                            <a href="#" class="share-option" data-platform="whatsapp">
                                <i class="fab fa-whatsapp"></i>
                                <span>واتساب</span>
                            </a>
                            <a href="#" class="share-option" data-platform="telegram">
                                <i class="fab fa-telegram"></i>
                                <span>تيليجرام</span>
                            </a>
                            <a href="#" class="share-option" data-platform="link">
                                <i class="fas fa-link"></i>
                                <span>نسخ الرابط</span>
                            </a>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(shareModal);

            // إظهار النافذة المنبثقة
            setTimeout(() => {
                shareModal.classList.add('show');
            }, 10);

            // إغلاق النافذة المنبثقة
            const closeModal = shareModal.querySelector('.close-modal');
            closeModal.addEventListener('click', () => {
                shareModal.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(shareModal);
                }, 300);
            });

            // مشاركة على المنصات المختلفة
            const shareOptions = shareModal.querySelectorAll('.share-option');
            shareOptions.forEach(option => {
                option.addEventListener('click', function(e) {
                    e.preventDefault();
                    const platform = this.dataset.platform;
                    const productUrl = window.location.href;
                    const productTitle = document.getElementById('product-title').textContent;

                    let shareUrl = '';

                    switch(platform) {
                        case 'facebook':
                            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
                            break;
                        case 'twitter':
                            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(productTitle)}`;
                            break;
                        case 'whatsapp':
                            shareUrl = `https://wa.me/?text=${encodeURIComponent(productTitle + ' ' + productUrl)}`;
                            break;
                        case 'telegram':
                            shareUrl = `https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(productTitle)}`;
                            break;
                        case 'link':
                            // نسخ الرابط إلى الحافظة
                            navigator.clipboard.writeText(productUrl).then(() => {
                                showNotification('تم نسخ الرابط بنجاح!', 'success');
                            });
                            break;
                    }

                    if (shareUrl) {
                        window.open(shareUrl, '_blank');
                    }

                    // إغلاق النافذة المنبثقة
                    shareModal.classList.remove('show');
                    setTimeout(() => {
                        document.body.removeChild(shareModal);
                    }, 300);
                });
            });
        });
    }

    // التبويبات
    const tabHeaders = document.querySelectorAll('.tab-header');
    tabHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const tabId = this.dataset.tab;

            // إزالة الفئة النشطة من جميع التبويبات
            tabHeaders.forEach(h => h.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

            // إضافة الفئة النشطة للتبويب المحدد
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
});

// تحميل تفاصيل المنتج
function loadProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        window.location.href = 'products.html';
        return;
    }

    // تحديث معلومات المنتج في الصفحة
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('current-price').textContent = `${product.price} د.ج`;

    const originalPrice = document.getElementById('original-price');
    if (product.originalPrice) {
        originalPrice.textContent = `${product.originalPrice} د.ج`;
        originalPrice.style.display = 'inline';

        // حساب وعرض نسبة الخصم
        const discount = Math.round((1 - product.price / product.originalPrice) * 100);
        document.querySelector('.discount-badge').textContent = `خصم ${discount}%`;
        document.querySelector('.discount-badge').style.display = 'inline-block';
    } else {
        originalPrice.style.display = 'none';
        document.querySelector('.discount-badge').style.display = 'none';
    }

    document.getElementById('product-description').innerHTML = `<p>${product.description}</p>`;
    document.getElementById('product-reviews').textContent = `(${product.reviews} تقييم)`;

    // تحديث النجوم
    const starsContainer = document.getElementById('product-stars');
    starsContainer.innerHTML = generateStars(product.rating);

    // تحديث صور المنتج
    document.getElementById('main-product-image').src = product.image;
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumbnail, index) => {
        if (index === 0) {
            thumbnail.src = product.image;
        } else {
            // في التطبيق الحقيقي، سيتم استخدام صور مختلفة
            thumbnail.src = product.image;
        }
    });

    // تحديث خيارات الألوان
    const colorPicker = document.getElementById('color-picker');
    if (colorPicker) {
        colorPicker.innerHTML = product.colors.map((color, index) => `
            <div class="color-option ${index === 0 ? 'selected' : ''}" data-color="${color}" style="background-color: ${getColorCode(color)}"></div>
        `).join('');

        // إضافة مستمعي الأحداث للألوان
        const colorOptions = colorPicker.querySelectorAll('.color-option');
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    }
    
    // تحديث خيارات المقاسات
    const sizePicker = document.getElementById('size-picker');
    if (sizePicker) {
        sizePicker.innerHTML = product.sizes.map((size, index) => `
            <div class="size-option ${index === 0 ? 'selected' : ''}" data-size="${size}">${size}</div>
        `).join('');
        
        // إضافة مستمعي الأحداث للمقاسات
        const sizeOptions = sizePicker.querySelectorAll('.size-option');
        sizeOptions.forEach(option => {
            option.addEventListener('click', function() {
                sizeOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    }
    
    // تحديث أزرار الإجراءات
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.dataset.productId = productId;
    }
    
    const addToFavoritesBtn = document.getElementById('add-to-favorites-btn');
    if (addToFavoritesBtn) {
        addToFavoritesBtn.dataset.productId = productId;
        
        // تحديث أيقونة القلب حسب حالة المفضلة
        const heartIcon = addToFavoritesBtn.querySelector('i');
        if (favorites.includes(productId)) {
            heartIcon.classList.remove('far');
            heartIcon.classList.add('fas');
        } else {
            heartIcon.classList.remove('fas');
            heartIcon.classList.add('far');
        }
    }
}sList.remove('selected'));
                this.classList.add('selected');
            });
        });
    }

    // تحديث خيارات المقاسات
    const sizePicker = document.getElementById('size-picker');
    if (sizePicker) {
        sizePicker.innerHTML = product.sizes.map((size, index) => `
            <div class="size-option ${index === 0 ? 'selected' : ''}" data-size="${size}">${size}</div>
        `).join('');

        // إضافة مستمعي الأحداث للمقاسات
        const sizeOptions = sizePicker.querySelectorAll('.size-option');
        sizeOptions.forEach(option => {
            option.addEventListener('click', function() {
                sizeOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    }

    // تحديث أزرار الإجراءات
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.dataset.productId = productId;
    }

    const addToFavoritesBtn = document.getElementById('add-to-favorites-btn');
    if (addToFavoritesBtn) {
        addToFavoritesBtn.dataset.productId = productId;

        // تحديث أيقونة القلب حسب حالة المفضلة
        const heartIcon = addToFavoritesBtn.querySelector('i');
        if (favorites.includes(productId)) {
            heartIcon.classList.remove('far');
            heartIcon.classList.add('fas');
        } else {
            heartIcon.classList.remove('fas');
            heartIcon.classList.add('far');
        }
    }
}
