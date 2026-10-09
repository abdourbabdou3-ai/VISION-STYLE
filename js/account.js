// تهيئة صفحة حسابي
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
    loadFavoritesFromLocalStorage();

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

    // التبويبات
    const menuLinks = document.querySelectorAll('.menu-link[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const tabId = this.dataset.tab;

            // إزالة الفئة النشطة من جميع الروابط والتبويبات
            menuLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));

            // إضافة الفئة النشطة للرابط والتبويب المحددين
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');

            // تحميل المحتوى حسب التبويب
            switch(tabId) {
                case 'orders':
                    // في تطبيق حقيقي، سيتم جلب الطلبات من الخادم
                    break;
                case 'favorites':
                    loadFavorites();
                    break;
            }
        });
    });

    // تسجيل الخروج
    const logoutLink = document.querySelector('.logout');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();

            if (confirm('هل أنت متأكد من أنك تريد تسجيل الخروج؟')) {
                // في تطبيق حقيقي، سيتم إرسال طلب تسجيل الخروج إلى الخادم
                // هنا سنقوم فقط بمحاكاة العملية

                showNotification('تم تسجيل الخروج بنجاح', 'success');

                // الانتقال إلى الصفحة الرئيسية بعد ثانية واحدة
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        });
    }

    // نموذج الملف الشخصي
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // في تطبيق حقيقي، سيتم إرسال البيانات إلى الخادم
            // هنا سنقوم فقط بمحاكاة العملية

            showNotification('تم حفظ التغييرات بنجاح', 'success');
        });
    }

    // نموذج تغيير كلمة السر
    const passwordForm = document.querySelector('.password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            // التحقق من صحة البيانات
            if (!currentPassword || !newPassword || !confirmPassword) {
                showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }

            if (newPassword !== confirmPassword) {
                showNotification('كلمة السر الجديدة وتأكيدها غير متطابقتين', 'error');
                return;
            }

            if (newPassword.length < 8) {
                showNotification('كلمة السر يجب أن تكون 8 أحرف على الأقل', 'error');
                return;
            }

            // في تطبيق حقيقي، سيتم إرسال البيانات إلى الخادم
            // هنا سنقوم فقط بمحاكاة العملية

            showNotification('تم تغيير كلمة السر بنجاح', 'success');

            // إعادة تعيين النموذج
            passwordForm.reset();
        });
    }
});

// تحميل المفضلة
function loadFavorites() {
    const favoritesContainer = document.querySelector('.favorites-container');
    if (!favoritesContainer) return;

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="empty-favorites">
                <div class="empty-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <h3>لا توجد منتجات في المفضلة</h3>
                <p>أضف منتجات إلى المفضلة لعرضها هنا</p>
                <a href="products.html" class="btn btn-primary">
                    <i class="fas fa-arrow-left"></i> استكشف المنتجات
                </a>
            </div>
        `;
        return;
    }

    // الحصول على المنتجات المفضلة
    const favoriteProducts = products.filter(product => favorites.includes(product.id));

    favoritesContainer.innerHTML = favoriteProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-actions">
                    <div class="action-btn" onclick="toggleFavorite(${product.id})">
                        <i class="fas fa-heart"></i>
                    </div>
                    <div class="action-btn" onclick="viewProduct(${product.id})">
                        <i class="fas fa-eye"></i>
                    </div>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">${product.price} د.ج</div>
            </div>
        </div>
    `).join('');
}
