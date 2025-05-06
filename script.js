const products = [
    { 
        id: 1, 
        name: "Льняная рубаха", 
        price: 3500, 
        image: "png/shirt.jpg", 
        description: "Льняная рубаха ручной работы, выполненная из натурального льна. Идеально подходит для повседневной носки и отдыха на природе."
    },
    { 
        id: 2, 
        name: "Шерстяной свитер", 
        price: 5000, 
        image: "png/gallery3.jpg", 
        description: "Тёплый свитер из натуральной шерсти, связанный с заботой. Отлично сохраняет тепло и подчёркивает стиль."
    },
    { 
        id: 3, 
        name: "Платок с вышивкой", 
        price: 2000, 
        image: "png/gallery2.jpg", 
        description: "Элегантный платок с традиционной русской вышивкой. Добавляет утончённости любому образу."
    }
];

const galleryImages = [
    { src: "png/gallery1.jpg", alt: "Галерея 1" },
    { src: "png/gallery2.jpg", alt: "Галерея 2" },
    { src: "png/gallery3.jpg", alt: "Галерея 3" }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function loadProducts() {
    const productsDiv = document.querySelector('.catalog__products');
    if (!productsDiv) {
        console.error('Error: .catalog__products not found in DOM');
        return;
    }
    console.log('Loading products...');
    productsDiv.innerHTML = '';
    products.forEach((product, index) => {
        setTimeout(() => {
            const productLink = document.createElement('a');
            productLink.href = `product.html?id=${product.id}`;
            productLink.className = 'product';
            productLink.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product__image" onerror="console.error('Failed to load image: ${product.image}')">
                <h3 class="product__name">${product.name}</h3>
                <p class="product__price">${product.price} ₽</p>
            `;
            productsDiv.appendChild(productLink);
            console.log(`Loaded product: ${product.name}, image: ${product.image}`);
        }, index * 200);
    });
    console.log(`Finished loading ${products.length} products`);
}

function loadProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        const productDetail = document.querySelector('.product-detail');
        if (productDetail) {
            productDetail.innerHTML = '<p>Товар не найден.</p>';
        }
        console.error(`Error: Product with ID ${productId} not found`);
        return;
    }

    const title = document.querySelector('.product-detail__title');
    const image = document.querySelector('.product-detail__image');
    const description = document.querySelector('.product-detail__description');
    const price = document.querySelector('.product-detail__price');
    const addToCartBtn = document.querySelector('.product-detail__button');

    if (title && image && description && price && addToCartBtn) {
        title.textContent = product.name;
        image.src = product.image;
        image.alt = product.name;
        image.onerror = () => console.error(`Failed to load product image: ${product.image}`);
        description.textContent = product.description;
        price.textContent = `${product.price} ₽`;
        image.addEventListener('click', () => {
            console.log(`Opening image modal for: ${product.image}`);
            openModal(product.image, product.name);
        });
        addToCartBtn.addEventListener('click', () => {
            const size = document.querySelector('.product-detail__select')?.value || 'M';
            addToCart(product.id, size);
        });
        console.log(`Loaded product detail: ${product.name}, image: ${product.image}`);
    } else {
        console.error('Error: Product detail elements not found in DOM');
    }
}

function loadGallery() {
    const galleryDiv = document.querySelector('.about__gallery');
    if (!galleryDiv) {
        console.error('Error: .about__gallery not found in DOM');
        return;
    }
    console.log('Loading gallery images...');
    galleryImages.forEach((image, index) => {
        setTimeout(() => {
            const imgElement = document.createElement('img');
            imgElement.src = image.src;
            imgElement.alt = image.alt;
            imgElement.className = 'about__gallery-item';
            imgElement.onerror = () => console.error(`Failed to load gallery image: ${image.src}`);
            galleryDiv.appendChild(imgElement);
            imgElement.addEventListener('click', () => {
                console.log(`Opening image modal for: ${image.src}`);
                openModal(image.src, image.alt);
            });
            console.log(`Loaded gallery image: ${image.src}`);
        }, index * 200);
    });
}

function addToCart(productId, size = 'M') {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error(`Error: Product with ID ${productId} not found`);
        return;
    }

    const existingItem = cart.find(item => item.id === productId && item.size === size);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1, size });
    }
    
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
        console.error('Error saving cart to LocalStorage:', e);
    }
    updateCart();

    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `Товар "${product.name}" (Размер: ${size}) добавлен в корзину!`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function increaseQuantity(index) {
    if (index >= 0 && index < cart.length) {
        cart[index].quantity += 1;
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (e) {
            console.error('Error saving cart to LocalStorage:', e);
        }
        updateCart();
    }
}

function decreaseQuantity(index) {
    if (index >= 0 && index < cart.length) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (e) {
            console.error('Error saving cart to LocalStorage:', e);
        }
        updateCart();
    }
}

function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        const itemName = cart[index].name;
        const itemSize = cart[index].size;
        cart.splice(index, 1);
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (e) {
            console.error('Error saving cart to LocalStorage:', e);
        }
        updateCart();
        showNotification(`Товар "${itemName}" (Размер: ${itemSize}) удален из корзины.`);
    }
}

function clearCart() {
    cart = [];
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
        console.error('Error saving cart to LocalStorage:', e);
    }
    updateCart();
    showNotification('Корзина очищена.');
}

function updateCart() {
    const cartItems = document.querySelector('.cart__items');
    const cartTotal = document.querySelector('.cart__total');
    const cartCountElements = document.querySelectorAll('.header__cart-count');
    const checkoutBtn = document.querySelector('.cart__checkout-btn');

    if (cartItems && cartTotal) {
        console.log('Updating cart...');
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart__item';
            cartItem.innerHTML = `
                <a href="product.html?id=${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart__item-image" onerror="console.error('Failed to load cart image: ${item.image}')">
                </a>
                <div class="cart__item-details">
                    <span class="cart__item-name">
                        <a href="product.html?id=${item.id}">${item.name}</a>
                    </span>
                    <span class="cart__item-size">Размер: ${item.size}</span>
                    <span class="cart__item-price">${item.price} ₽ x ${item.quantity} = ${item.price * item.quantity} ₽</span>
                    <div class="cart__item-quantity">
                        <button class="cart__quantity-btn" onclick="decreaseQuantity(${index})">-</button>
                        <input type="number" class="cart__quantity-input" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                        <button class="cart__quantity-btn" onclick="increaseQuantity(${index})">+</button>
                    </div>
                </div>
                <button class="cart__item-button" onclick="removeFromCart(${index})">Удалить</button>
            `;
            cartItems.appendChild(cartItem);
            total += item.price * item.quantity;
            console.log(`Loaded cart item: ${item.name}, image: ${item.image}`);
        });

        cartTotal.textContent = `Итого: ${total} ₽`;
    } else {
        console.error('Error: .cart__items or .cart__total not found in DOM');
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(element => {
        if (element) {
            element.textContent = totalItems;
        }
    });

    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
        checkoutBtn.style.opacity = cart.length === 0 ? '0.5' : '1';
        checkoutBtn.style.cursor = cart.length === 0 ? 'not-allowed' : 'pointer';
    }
}

function updateQuantity(index, value) {
    const newQuantity = parseInt(value);
    if (index >= 0 && index < cart.length) {
        if (isNaN(newQuantity) || newQuantity < 1) {
            cart.splice(index, 1);
        } else {
            cart[index].quantity = newQuantity;
        }
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (e) {
            console.error('Error saving cart to LocalStorage:', e);
        }
        updateCart();
    }
}

function setupDropdown() {
    const dropdownToggle = document.querySelector('.header__dropdown-toggle');
    const dropdownMenu = document.querySelector('.header__dropdown-menu');
    const dropdownIcon = document.querySelector('.header__dropdown-icon');
    
    if (dropdownToggle && dropdownMenu && dropdownIcon) {
        dropdownToggle.addEventListener('click', () => {
            const isOpen = dropdownMenu.classList.toggle('header__dropdown-menu--visible');
            dropdownToggle.classList.toggle('header__dropdown-toggle--open', isOpen);
            dropdownIcon.src = isOpen ? 'png/close-icon.png' : 'png/menu-icon.png';
            dropdownIcon.alt = isOpen ? 'Закрыть меню' : 'Меню';
        });

        document.addEventListener('click', (e) => {
            if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('header__dropdown-menu--visible');
                dropdownToggle.classList.remove('header__dropdown-toggle--open');
                dropdownIcon.src = 'png/menu-icon.png';
                dropdownIcon.alt = 'Меню';
            }
        });

        document.querySelectorAll('.header__dropdown-link').forEach(link => {
            link.addEventListener('click', e => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                        dropdownMenu.classList.remove('header__dropdown-menu--visible');
                        dropdownToggle.classList.remove('header__dropdown-toggle--open');
                        dropdownIcon.src = 'png/menu-icon.png';
                        dropdownIcon.alt = 'Меню';
                    }
                }
            });
        });
    } else {
        console.error('Error: .header__dropdown-toggle, .header__dropdown-menu, or .header__dropdown-icon not found in DOM');
    }
}

function setupCartPage() {
    const checkoutBtn = document.querySelector('.cart__checkout-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Ваша корзина пуста. Пожалуйста, добавьте товары.');
                return;
            }
            const cartSection = document.querySelector('.cart');
            const checkoutSection = document.querySelector('.checkout');
            if (cartSection && checkoutSection) {
                cartSection.classList.add('cart--hidden');
                checkoutSection.classList.remove('checkout--hidden');
            }
        });
    } else {
        console.error('Error: .cart__checkout-btn not found in DOM');
    }

    const checkoutForm = document.querySelector('.checkout__form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async e => {
            e.preventDefault();
            const order = {
                name: document.querySelector('.checkout__input[name="name"]')?.value || '',
                address: document.querySelector('.checkout__input[name="address"]')?.value || '',
                phone: document.querySelector('.checkout__input[name="phone"]')?.value || '',
                delivery: document.querySelector('.checkout__select[name="delivery"]')?.value || '',
                payment: document.querySelector('.checkout__select[name="payment"]')?.value || '',
                items: cart,
                total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
            };

            try {
                await fetch('https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: '<YOUR_CHAT_ID>',
                        text: `Новый заказ!\nФИО: ${order.name}\nАдрес: ${order.address}\nТелефон: ${order.phone}\nДоставка: ${order.delivery}\nОплата: ${order.payment}\nТовары: ${order.items.map(i => `${i.name} x${i.quantity} (${i.size})`).join(', ')}\nИтого: ${order.total} ₽`
                    })
                });

                alert('Заказ оформлен! Мы свяжемся с вами.');
                cart = [];
                localStorage.removeItem('cart');
                updateCart();
                const checkoutSection = document.querySelector('.checkout');
                const cartSection = document.querySelector('.cart');
                if (checkoutSection && cartSection) {
                    checkoutSection.classList.add('checkout--hidden');
                    cartSection.classList.remove('cart--hidden');
                }
            } catch (e) {
                console.error('Error submitting order:', e);
                alert('Ошибка при оформлении заказа. Пожалуйста, попробуйте снова.');
            }
        });
    } else {
        console.error('Error: .checkout__form not found in DOM');
    }
}

function setupModals() {
    const modal = document.querySelector('.modal');
    const modalClose = document.querySelector('.modal__close');
    const modalImage = document.querySelector('.modal__image');
    
    if (modal && modalClose && modalImage) {
        modalClose.addEventListener('click', () => {
            console.log('Closing image modal via close button');
            modalImage.classList.add('modal__image--zoom-out');
            modal.classList.remove('modal--visible');
            setTimeout(() => {
                modal.classList.add('modal--hidden');
                modalImage.classList.remove('modal__image--zoom-out');
            }, 400);
        });

        modal.addEventListener('click', e => {
            if (e.target === modal) {
                console.log('Closing image modal via background click');
                modalImage.classList.add('modal__image--zoom-out');
                modal.classList.remove('modal--visible');
                setTimeout(() => {
                    modal.classList.add('modal--hidden');
                    modalImage.classList.remove('modal__image--zoom-out');
                }, 400);
            }
        });
    } else {
        console.error('Error: .modal, .modal__close, or .modal__image not found in DOM');
    }
}

function openModal(imageSrc, imageAlt) {
    const modal = document.querySelector('.modal');
    const modalImage = document.querySelector('.modal__image');
    if (modal && modalImage) {
        modalImage.src = imageSrc;
        modalImage.alt = imageAlt || 'Увеличенное изображение';
        modalImage.onerror = () => console.error(`Failed to load modal image: ${imageSrc}`);
        modalImage.classList.remove('modal__image--zoom-out');
        modal.classList.remove('modal--hidden');
        modal.classList.add('modal--visible');
        modalImage.classList.add('modal__image--zoom');
        console.log(`Opened modal for image: ${imageSrc}`);
    } else {
        console.error('Error: .modal or .modal__image not found in DOM');
    }
}

// Initialize based on page
if (document.body.classList.contains('page--main')) {
    loadProducts();
    loadGallery();
    setupDropdown();
    updateCart();
} else if (document.body.classList.contains('page--cart')) {
    setupCartPage();
    setupDropdown();
    updateCart();
} else if (document.body.classList.contains('page--product')) {
    loadProductDetail();
    setupDropdown();
    updateCart();
}

setupModals();