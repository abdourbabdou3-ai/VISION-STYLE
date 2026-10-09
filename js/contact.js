// تهيئة صفحة التواصل
document.addEventListener('DOMContentLoaded', function() {
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

    // نموذج الاتصال
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // جمع بيانات النموذج
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // التحقق من صحة البيانات
            if (!name || !email || !subject || !message) {
                showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }

            // في تطبيق حقيقي، سيتم إرسال هذه البيانات إلى الخادم
            // هنا سنقوم فقط بمحاكاة العملية

            // عرض رسالة النجاح
            showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك في أقرب وقت ممكن.', 'success');

            // إعادة تعيين النموذج
            contactForm.reset();
        });
    }
});
