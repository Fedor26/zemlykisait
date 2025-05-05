const products = [
    { id: 1, name: "Льняная рубаха", price: 3500, image: "png/shirt.jpg" },
    { id: 2, name: "Шерстяной свитер", price: 5000, image: "png/gallery3.jpg" },
    { id: 3, name: "Платок с вышивкой", price: 2000, image: "png/gallery2.jpg" }
];

const galleryImages = [
    { src: "gallery1.jpg", alt: "Галерея 1" },
    { src: "gallery2.jpg", alt: "Галерея 2" },
    { src: "gallery3.jpg", alt: "Галерея 3" }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function loadProducts() {
    const productsDiv = document.querySelector('.catalog__products');
    products.forEach((product, index) => {
        setTimeout(() => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product__image">
                <h3 class="product__name">${product.name}</h3>
                <p class="product__price">${product.price} ₽</p>
                <button class="product__button" onclick="addToCart(${product.id})">Добавить в корзину</button>
            `;
            productsDiv.appendChild(productDiv);
            const productImage = productDiv.querySelector('.product__image');
            productImage.addEventListener('click', () => {
                console.log(`Opening modal for product image: ${product.image}`); // Debug log
                openModal(product.image, product.name);
            });
        }, index * 200);
    });
}

function loadGallery() {
    const galleryDiv = document.querySelector('.about__gallery');
    galleryImages.forEach((image, index) => {
        setTimeout(() => {
            const imgElement = document.createElement('img');
            imgElement.src = image.src;
            imgElement.alt = image.alt;
            imgElement.className = 'about__gallery-item';
            galleryDiv.appendChild(imgElement);
            imgElement.addEventListener('click', () => {
                console.log(`Opening modal for gallery image: ${image.src}`); // Debug log
                openModal(image.src, image.alt);
            });
        }, index * 200);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();

    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = `Товар "${product.name}" добавлен в корзину!`;
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
    cart[index].quantity += 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function removeFromCart(index) {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    showNotification(`Товар "${itemName}" удален из корзины.`);
}

function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    showNotification('Корзина очищена.');
}

function updateCart() {
    const cartItems = document.querySelector('.cart__items');
    const cartTotal = document.querySelector('.cart__total');
    const cartCountElements = document.querySelectorAll('.header__cart-count');
    const checkoutBtn = document.querySelector('.cart__checkout-btn');

    if (cartItems && cartTotal) {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart__item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart__item-image">
                <div class="cart__item-details">
                    <span class="cart__item-name">${item.name}</span>
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
            const cartItemImage = cartItem.querySelector('.cart__item-image');
            cartItemImage.addEventListener('click', () => {
                console.log(`Opening modal for cart item image: ${item.image}`); // Debug log
                openModal(item.image, item.name);
            });
        });

        cartTotal.textContent = `Итого: ${total} ₽`;
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });

    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
        checkoutBtn.style.opacity = cart.length === 0 ? '0.5' : '1';
        checkoutBtn.style.cursor = cart.length === 0 ? 'not-allowed' : 'pointer';
    }
}

function updateQuantity(index, value) {
    const newQuantity = parseInt(value);
    if (isNaN(newQuantity) || newQuantity < 1) {
        cart.splice(index, 1);
    } else {
        cart[index].quantity = newQuantity;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function setupNavigation() {
    document.querySelectorAll('.header__nav-link').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

function setupCartPage() {
    const checkoutBtn = document.querySelector('.cart__checkout-btn');
    const clearCartBtn = document.querySelector('.cart__clear-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Ваша корзина пуста. Пожалуйста, добавьте товары.');
                return;
            }
            document.querySelector('.cart').classList.add('cart--hidden');
            document.querySelector('.checkout').classList.remove('checkout--hidden');
        });
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            clearCart();
        });
    }

    const checkoutForm = document.querySelector('.checkout__form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async e => {
            e.preventDefault();
            const order = {
                name: document.querySelector('.checkout__input[name="name"]').value,
                address: document.querySelector('.checkout__input[name="address"]').value,
                phone: document.querySelector('.checkout__input[name="phone"]').value,
                delivery: document.querySelector('.checkout__select[name="delivery"]').value,
                payment: document.querySelector('.checkout__select[name="payment"]').value,
                items: cart,
                total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
            };

            await fetch('https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: '<YOUR_CHAT_ID>',
                    text: `Новый заказ!\nФИО: ${order.name}\nАдрес: ${order.address}\nТелефон: ${order.phone}\nДоставка: ${order.delivery}\nОплата: ${order.payment}\nТовары: ${order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}\nИтого: ${order.total} ₽`
                })
            });

            alert('Заказ оформлен! Мы свяжемся с вами.');
            cart = [];
            localStorage.removeItem('cart');
            updateCart();
            document.querySelector('.checkout').classList.add('checkout--hidden');
            document.querySelector('.cart').classList.remove('cart--hidden');
        });
    }
}

function setupModal() {
    const modal = document.querySelector('.modal');
    const modalClose = document.querySelector('.modal__close');
    const modalImage = document.querySelector('.modal__image');
    
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            console.log('Closing modal via close button'); // Debug log
            modalImage.classList.add('modal__image--zoom-out');
            modal.classList.remove('modal--visible');
            setTimeout(() => {
                modal.classList.add('modal--hidden');
                modalImage.classList.remove('modal__image--zoom-out');
            }, 400); // Match transition duration
        });
    }

    if (modal) {
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                console.log('Closing modal via background click'); // Debug log
                modalImage.classList.add('modal__image--zoom-out');
                modal.classList.remove('modal--visible');
                setTimeout(() => {
                    modal.classList.add('modal--hidden');
                    modalImage.classList.remove('modal__image--zoom-out');
                }, 400); // Match transition duration
            }
        });
    }
}

function openModal(imageSrc, imageAlt) {
    const modal = document.querySelector('.modal');
    const modalImage = document.querySelector('.modal__image');
    modalImage.src = imageSrc;
    modalImage.alt = imageAlt || 'Увеличенное изображение';
    modalImage.classList.remove('modal__image--zoom-out');
    modal.classList.remove('modal--hidden');
    modal.classList.add('modal--visible');
    modalImage.classList.add('modal__image--zoom');
}

// Initialize based on page
if (document.body.classList.contains('page--main')) {
    loadProducts();
    loadGallery();
    setupNavigation();
    updateCart(); // Update cart count in header
} else if (document.body.classList.contains('page--cart')) {
    setupCartPage();
    updateCart();
}

setupModal();