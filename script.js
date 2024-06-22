document.addEventListener("DOMContentLoaded", () => {
    const productListElement = document.getElementById('product-list');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    let products = [];
    let currentPage = 1;
    const productsPerPage = 6;

    // Fetch JSON data
    fetch('./online_store_extended.json')  
        .then(response => response.json())
        .then(data => {
            // stockage de produit et les cathégorie
            products = data.products;
            displayCategories(data.categories);
            displayProducts(products);
            updatePaginationInfo();
        })
        .catch(error => console.error('Erreur lors du chargement des produits:', error));
        //affiche produit
    function displayProducts(productsToDisplay) {
        productListElement.innerHTML = '';

        // Pagination logic
        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;
        const paginatedProducts = productsToDisplay.slice(start, end);

        // afficher chaque produit
        paginatedProducts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product';
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="image">
                <div class="here">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <p>Prix: ${product.price} €</p>
                    <div class="d-flex justify-content-center flex-wrap here">
                        <button onclick="addToCart(${product.id})" class="btn1">Ajouter au panier</button>
                        <a href="details.html?id=${product.id}" class="btn1">Détails</a>
                    </div>
                </div>
            `;
            productListElement.appendChild(productElement);
        });
    }

    // affiche categorie au option de la navigation
    function displayCategories(categories) {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    }

    // recherche
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );
        currentPage = 1;  
        displayProducts(filteredProducts);
        updatePaginationInfo(filteredProducts);
    });

    // Filtre par cathégorie
    categoryFilter.addEventListener('change', () => {
        const categoryId = categoryFilter.value;
        const filteredProducts = categoryId === 'all' ? products : products.filter(product => product.categoryId == categoryId);
        currentPage = 1;  
        displayProducts(filteredProducts);
        updatePaginationInfo(filteredProducts);
    });

    // Pagination de controls
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayProducts(filteredProducts());
            updatePaginationInfo(filteredProducts());
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < Math.ceil(filteredProducts().length / productsPerPage)) {
            currentPage++;
            displayProducts(filteredProducts());
            updatePaginationInfo(filteredProducts());
        }
    });

    // function pour obtenir la produit rechercher
    function filteredProducts() {
        const query = searchInput.value.toLowerCase();
        const categoryId = categoryFilter.value;
        return products.filter(product =>
            (categoryId === 'all' || product.categoryId == categoryId) &&
            (product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query))
        );
    }
    function updatePaginationInfo(filteredProductsList = filteredProducts()) {
        const totalPages = Math.ceil(filteredProductsList.length / productsPerPage);
        pageInfo.textContent = `Page ${currentPage} sur ${totalPages}`;
    }
    window.addToCart = (productId) => {
        // Ici vous pouvez gérer l'ajout d'un produit au panier
        console.log(`Produit ${productId} ajouté au panier.`);
        alert(`Produit ${productId} ajouté au panier.`);
    };
});


/*ici c'est la details en javascript */
document.addEventListener("DOMContentLoaded", () => {
    const productDetailsElement = document.getElementById('product-details');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productId = urlParams.get('id');

    if (!productId) {
        productDetailsElement.innerHTML = '<p>Produit non trouvé</p>';
        return;
    }

    
    fetch('./online_store_extended.json') 
        .then(response => response.json())
        .then(data => {
            
            const product = data.products.find(p => p.id == productId);
            if (product) {
                displayProductDetails(product);
            } else {
                productDetailsElement.innerHTML = '<p>Produit non trouvé</p>';
            }
        })
        .catch(error => console.error('Erreur lors du chargement des détails du produit:', error));

    function displayProductDetails(product) {
        productDetailsElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <p class="price">Prix: ${product.price} €</p>
            <p>Stock disponible: ${product.stock}</p>
            <span>Taillle : <span>
                            ${product.attributes.size}
                        </span></span>
            <button onclick="addToCart(${product.id})" class="btn1 w-0">Ajouter au panier</button>
        `;
    }

   
    window.addToCart = (productId) => {
        // Ici vous pouvez gérer l'ajout d'un produit au panier
        console.log(`Produit ${productId} ajouté au panier.`);
        alert(`Produit ${productId} ajouté au panier.`);
    };
});

/*Ici c'est mon panier*/


const displayCartOnPage = () => {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p>Votre panier est vide.</p>';
        cartTotalElement.textContent = 'Total: 0 €';
        return;
    }

    let cartDetails = '';
    let total = 0;

    cart.forEach(product => {
        cartDetails += `
            <div class="cart-item">
                <img src="${product.image}" alt="${product.name}">
                <div class="cart-item-details">
                    <p>${product.name}</p>
                    <p>Prix: ${product.price} €</p>
                </div>
            </div>
        `;
        total += product.price;
    });

    cartItemsElement.innerHTML = cartDetails;
    cartTotalElement.textContent = `Total: ${total} €`;
};
