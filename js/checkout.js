// تهيئة صفحة الدفع
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromLocalStorage();
    loadOrderSummary();

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

    // التنقل بين الخطوات
    const stepHeaders = document.querySelectorAll('.step-header');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');

    stepHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const currentStep = this.closest('.checkout-step');
            const stepIndex = Array.from(document.querySelectorAll('.checkout-step')).indexOf(currentStep);

            if (currentStep.classList.contains('active')) {
                return;
            }

            // التحقق من الخطوات السابقة
            let canProceed = true;
            for (let i = 0; i < stepIndex; i++) {
                const step = document.querySelectorAll('.checkout-step')[i];
                if (!validateStep(step)) {
                    canProceed = false;
                    showStep(step);
                    showNotification('يرجى إكمال جميع الحقول المطلوبة في هذه الخطوة', 'error');
                    break;
                }
            }

            if (canProceed) {
                showStep(currentStep);
            }
        });
    });

    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.checkout-step');
            const nextStep = currentStep.nextElementSibling;

            if (!validateStep(currentStep)) {
                showNotification('يرجى إكمال جميع الحقول المطلوبة', 'error');
                return;
            }

            if (nextStep && nextStep.classList.contains('checkout-step')) {
                hideStep(currentStep);
                showStep(nextStep);
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.checkout-step');
            const prevStep = currentStep.previousElementSibling;

            if (prevStep && prevStep.classList.contains('checkout-step')) {
                hideStep(currentStep);
                showStep(prevStep);
            }
        });
    });

    // إرسال النموذج
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // التحقق من جميع الخطوات
            const allSteps = document.querySelectorAll('.checkout-step');
            let isValid = true;

            allSteps.forEach(step => {
                if (!validateStep(step)) {
                    isValid = false;
                    showStep(step);
                }
            });

            if (!isValid) {
                showNotification('يرجى إكمال جميع الحقول المطلوبة', 'error');
                return;
            }

            // التحقق من وجود منتجات في السلة
            if (cart.length === 0) {
                showNotification('سلة التسوق فارغة، يرجى إضافة منتجات أولاً', 'error');
                return;
            }

            // إنشاء الطلب
            createOrder();
        });
    }

    // تحديث ملخص الطلب عند تغيير طريقة الشحن
    const shippingMethods = document.querySelectorAll('input[name="shipping-method"]');
    shippingMethods.forEach(method => {
        method.addEventListener('change', updateOrderSummary);
    });
});

// عرض خطوة معينة
function showStep(step) {
    step.classList.add('active');
    step.querySelector('.step-content').style.display = 'block';
}

// إخفاء خطوة معينة
function hideStep(step) {
    step.classList.remove('active');
    step.querySelector('.step-content').style.display = 'none';
}

// التحقق من صحة خطوة معينة
function validateStep(step) {
    const inputs = step.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '';
        }
    });

    return isValid;
}

// تحميل ملخص الطلب
function loadOrderSummary() {
    const orderItemsContainer = document.getElementById('order-items');
    if (!orderItemsContainer) return;

    if (cart.length === 0) {
        orderItemsContainer.innerHTML = `
            <div class="empty-cart">
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

    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="order-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="order-item-details">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-options">
                    ${item.selectedColor ? `اللون: ${item.selectedColor}` : ''} 
                    ${item.selectedSize ? `| المقاس: ${item.selectedSize}` : ''}
                    | الكمية: ${item.quantity}
                </div>
            </div>
            <div class="order-item-price">${item.price * item.quantity} د.ج</div>
        </div>
    `).join('');

    updateOrderSummary();
}

// تحديث ملخص الطلب
function updateOrderSummary() {
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');

    if (!subtotalElement || !shippingElement || !taxElement || !totalElement) return;

    // حساب الإجمالي الفرعي
    const subtotal = calculateCartTotal();
    subtotalElement.textContent = `${subtotal} د.ج`;

    // حساب تكاليف الشحن
    const shippingMethod = document.querySelector('input[name="shipping-method"]:checked');
    let shipping = 0;

    if (shippingMethod) {
        switch(shippingMethod.value) {
            case 'standard':
                shipping = 500;
                break;
            case 'express':
                shipping = 1000;
                break;
            case 'pickup':
                shipping = 0;
                break;
        }
    }

    shippingElement.textContent = `${shipping} د.ج`;

    // حساب الضريبة (10%)
    const tax = Math.round(subtotal * 0.1);
    taxElement.textContent = `${tax} د.ج`;

    // حساب الإجمالي النهائي
    const total = subtotal + shipping + tax;
    totalElement.textContent = `${total} د.ج`;
}

// إنشاء الطلب
function createOrder() {
    // جمع بيانات النموذج
    const fullName = document.getElementById('full-name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const state = document.getElementById('state').value;
    const city = document.getElementById('city').value;
    const notes = document.getElementById('notes').value;

    const shippingMethod = document.querySelector('input[name="shipping-method"]:checked').value;
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

    // حساب الإجمالي
    const subtotal = calculateCartTotal();
    let shipping = 0;

    switch(shippingMethod) {
        case 'standard':
            shipping = 500;
            break;
        case 'express':
            shipping = 1000;
            break;
        case 'pickup':
            shipping = 0;
            break;
    }

    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + shipping + tax;

    // إنشاء رقم طلب عشوائي
    const orderNumber = 'VS' + Math.floor(Math.random() * 100000);

    // في تطبيق حقيقي، سيتم إرسال هذه البيانات إلى الخادم
    // هنا سنقوم فقط بمحاكاة العملية

    // إفراغ السلة
    cart = [];
    saveCartToLocalStorage();
    updateCartCount();

    // عرض رسالة النجاح
    showOrderConfirmation(orderNumber, total);
}

// عرض تأكيد الطلب
function showOrderConfirmation(orderNumber, total) {
    // إنشاء نافذة منبثقة لتأكيد الطلب
    const confirmationModal = document.createElement('div');
    confirmationModal.className = 'modal confirmation-modal';
    confirmationModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>تأكيد الطلب</h3>
            </div>
            <div class="modal-body">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h4>شكراً لطلبك!</h4>
                <p>تم استلام طلبك بنجاح.</p>
                <div class="order-details">
                    <div class="detail-row">
                        <span>رقم الطلب:</span>
                        <span>${orderNumber}</span>
                    </div>
                    <div class="detail-row">
                        <span>الإجمالي:</span>
                        <span>${total} د.ج</span>
                    </div>
                    <div class="detail-row">
                        <span>سيتم إرسال تأكيد الطلب إلى بريدك الإلكتروني</span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <a href="index.html" class="btn btn-primary">العودة للرئيسية</a>
                <a href="account.html" class="btn btn-secondary">طلباتي</a>
            </div>
        </div>
    `;

    document.body.appendChild(confirmationModal);

    // إظهار النافذة المنبثقة
    setTimeout(() => {
        confirmationModal.classList.add('show');
    }, 10);
}
