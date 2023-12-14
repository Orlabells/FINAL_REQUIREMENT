document.addEventListener("DOMContentLoaded", function () {
    let btnRegister = document.querySelector("#btnRegister");
    let btnLogin = document.querySelector("#btnLogin");
    let btnDeleteuser = document.querySelector("#btnDeleteuser");
    let btnLogout = document.querySelector("#btnLogout");
    let currentUser = null;
    let products = getStoredProducts(); // Load products from local storage
    let cart = getStoredCart(); // Load cart from local storage
    let AddProductbtn = document.querySelector("#AddProductbtn");
    let cartContainer = document.querySelector("#cartContainer");
    let btnUpdateProfile = document.querySelector("#btnUpdateProfile");

    btnRegister.onclick = () => {
        console.log("btnRegister is clicked.");
        let email = document.querySelector("#txtregisterEmail").value,
            name = document.querySelector("#txtregisterName").value,
            password = document.querySelector("#txtregisterPassword").value,
            confirmPassword = document.querySelector("#txtregisterConfirmPassword").value,
            address = document.querySelector("#txtRegisterAddress").value,
            birthdate = document.querySelector("#txtRegisterBirthdate").value;

        // Ensure that the 'register' function is defined
        if (typeof register === 'function') {
            register(email, name, password, confirmPassword, address, birthdate);

            // Set user profile information
            document.querySelector("#profileName").textContent = name;
            document.querySelector("#profileEmail").textContent = email;
            document.querySelector("#profileaddress").textContent = address;
            document.querySelector("#profilebirthdate").textContent = birthdate;
        } else {
            console.error("The 'register' function is not defined.");
        }
    };
    btnLogin.onclick = function () {
        let email = document.querySelector("#txtLoginEmail").value;
        let password = document.querySelector("#txtLoginPassword").value;
        login(email, password);

        // Set user profile information if login is successful
        if (currentUser) {
            document.querySelector("#profileName").textContent = currentUser.name;
            document.querySelector("#profileEmail").textContent = email;
            document.querySelector("#profileaddress").textContent = currentUser.address;
            document.querySelector("#profilebirthdate").textContent = currentUser.birthdate;
        }
    };

    btnDeleteuser.onclick = function () {
        if (currentUser) {
            // Get the list of users from local storage
            let users = JSON.parse(localStorage.getItem("users")) || [];

            // Find the index of the logged-in user
            let userIndex = users.findIndex(u => u.email === currentUser.email);

            if (userIndex !== -1) {
                // Remove the logged-in user from the users array
                users.splice(userIndex, 1);

                // Update local storage with the modified users array
                localStorage.setItem("users", JSON.stringify(users));

                // Clear the current user
                currentUser = null;

                // Redirect to the login dashboard
                document.getElementById('loginDashboard').classList.add('active-dashboard');
                document.getElementById('welcomeDashboard').classList.remove('active-dashboard');

                alert("User deleted successfully.");
            } else {
                alert("Error: Logged-in user not found in the user list.");
            }
        } else {
            alert("Error: No user is currently logged in.");
        }
    };

    function register(email, name, password, confirmPassword, address, birthdate) {
        // Check for empty values
        if (!email || !name || !password || !confirmPassword || !address || !birthdate) {
            return alert(`All fields are required.`);
        } else if (password !== confirmPassword) {
            return alert(`Password does not match.`);
        }

        let userToCreate = {
            email,
            name,
            password,
            address,
            birthdate
        };

        let users = JSON.parse(localStorage.getItem("users")) || [];
        users.push(userToCreate);

        // Success validation
        localStorage.setItem("users", JSON.stringify(users));
        alert(`User ${userToCreate.name} has been successfully created.`);
        console.log("You Have Successfully Registered!", userToCreate);
    }

    function login(email, password) {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let userIndex = users.findIndex((u) => {
            return u.email == email && u.password == password;
        });

        if (userIndex == -1) {
            alert(`Invalid email or password. Please try again.`);
            currentUser = null;
        } else {
            // Success validation
            console.log(`Welcome ${users[userIndex].name}.`);
            currentUser = users[userIndex];

            // Switch to the welcome dashboard
            document.getElementById('loginDashboard').classList.remove('active-dashboard');
            document.getElementById('welcomeDashboard').classList.add('active-dashboard');
        }
    }

    btnLogout.onclick = function () {
        // Switch to the login dashboard
        document.getElementById('loginDashboard').classList.add('active-dashboard');
        document.getElementById('welcomeDashboard').classList.remove('active-dashboard');
    }


   // Add click event listener for updating the profile
        btnUpdateProfile.onclick = function () {
            // Check if a user is currently logged in
            if (currentUser) {
                // Get the updated values from the input fields
                let updatedName = document.querySelector("#txtUpdateName").value.trim();
                let updatedAddress = document.querySelector("#txtUpdateAddress").value.trim();
                let updatedBirthdate = document.querySelector("#txtUpdateBirthdate").value.trim();

                // Check if any of the fields are empty
                if (!updatedName || !updatedAddress || !updatedBirthdate) {
                    alert("Invalid.. Please Fill all the fields.");
                    return;
                }

                // Update the user object with the new values
                currentUser.name = updatedName;
                currentUser.address = updatedAddress;
                currentUser.birthdate = updatedBirthdate;

                // Update local storage with the modified user object
                let users = JSON.parse(localStorage.getItem("users")) || [];
                let userIndex = users.findIndex(u => u.email === currentUser.email);
                if (userIndex !== -1) {
                    users[userIndex] = currentUser;
                    localStorage.setItem("users", JSON.stringify(users));

                    // Update the user profile information on the dashboard
                    document.querySelector("#profileName").textContent = updatedName;
                    document.querySelector("#profileaddress").textContent = updatedAddress;
                    document.querySelector("#profilebirthdate").textContent = updatedBirthdate;

                    alert("Profile updated successfully.");
                } else {
                    alert("Error: Logged-in user not found in the user list.");
                }
            } 
        };


     // Add Product Button Click Event
     AddProductbtn.onclick = function () {
        let productName = document.getElementById("productName").value;
        let description = document.getElementById("Description").value;
        let price = document.getElementById("Price").value;
        let productImageInput = document.getElementById("CustomFile");

        // Check if a file is selected
        if (!productName || !description || !isNumeric(price) || productImageInput.files.length === 0) {
            alert("Please fill in all the fields, Price Numbers Only!");
            return;
        }

        // Get the selected file
        let productImage = productImageInput.files[0];

        // Create a new product object
        let newProduct = {
            productName,
            description,
            price,
            productImage: URL.createObjectURL(productImage) // Convert the file to a URL
        };

        // Add the new product to the products array
        products.push(newProduct);

        // Clear input fields
        document.getElementById("productName").value = "";
        document.getElementById("Description").value = "";
        document.getElementById("Price").value = "";
        document.getElementById("CustomFile").value = "";

        // Refresh the product list
        showProductList();
    };

    function isNumeric(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    // Function to show the list of products
    function showProductList() {
        // Get the product container element
        let productContainer = document.getElementById("productContainer");

        // Clear existing products
        productContainer.innerHTML = "";

    // Loop through each product and create HTML elements
    for (let i = 0; i < products.length; i++) {
        let product = products[i];

        // Create a product card
        let productCard = document.createElement("div");
        productCard.className = "col-md-4 card";

        productCard.innerHTML = `
            <img src="${product.productImage}" class="card-img-top" alt="${product.productName}" height="220">
            <div class="card-body">
                <p><h5 class="card-title">${product.productName}</h5></p>
                <p>${product.description}</p>
                <p class="text-success">$${product.price} USD</p>
                <button class="btn btn-outline-success add-to-cart" data-index="${i}">Add to Cart</button>
                <button class="btn btn-info update-product" data-bs-toggle="modal" data-bs-target="#updateProductModal" data-index="${i}">Edit</button>
                <button class="btn btn-outline-danger delete-product" data-index="${i}">Delete Product</button>
            </div>
        `;

        // Append the product card to the product container
        productContainer.appendChild(productCard);

        // Add a click event listener for the "Delete Product" button
        productCard.querySelector(".delete-product").addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            deleteProduct(index);
        });

        // Add a click event listener for the "Add to Cart" button
        productCard.querySelector(".add-to-cart").addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            addToCart(index);
        });

        // Add a click event listener for the "Update Product" button
        productCard.querySelector(".update-product").addEventListener("click", function () {
        let index = this.getAttribute("data-index");
        // Ensure the index is a valid number
        if (!isNaN(index) && index >= 0 && index < products.length) {
            // Store the index in a hidden field for later use
            document.getElementById("updateProductIndex").value = index;

            // Populate the update product modal with existing data
            populateUpdateProductModal(index);
        } else {
            console.error("Invalid index value when updating product.");
        }
});
    }

    // Save products to local storage
    storeProducts(products);
}

// Product list display
showProductList();


// Add a product to the cart
function addToCart(index) {
    let productToAdd = products[index];
    // Add a quantity property to the productToAdd object
    productToAdd.quantity = 1;
    cart.push(productToAdd);

    // Save cart to local storage
    storeCart(cart);

    // Update the cart display
    showCart();
}

// Function to show the cart
function showCart() {
    // Clear existing cart items
    cartContainer.innerHTML = "";
    // Update item count in the cart button
    document.getElementById("itemCount").textContent = cart.length;

    let totalAmount = 0; // Initialize the total amount

    // Loop through each cart item and create HTML elements
    for (let i = 0; i < cart.length; i++) {
        let cartItem = cart[i];

        // Create a cart item element
        let cartItemElement = document.createElement("div");
        cartItemElement.className = "cart-item";

        cartItemElement.innerHTML = `
            <div class="cart-item-details d-flex justify-content-between align-items-center border p-3 mb-3 shadow">
                <div class="me-3">
                    <p class="m-0"><strong class="text-warning">${cartItem.productName}</strong> - <span class="text-success">$${cartItem.price} USD</span></p>
                </div>
                <div class="quantity-controls btn-group">
                    <button class="btn btn-outline-secondary decrease-quantity" data-index="${i}">-</button>
                    <span class="quantity btn btn-light d-flex align-items-center">${cartItem.quantity}</span>
                    <button class="btn btn-outline-secondary increase-quantity" data-index="${i}">+</button>
                </div>
                <button class="btn btn-outline-danger delete-cart-item" data-index="${i}">Remove</button>
            </div> `;

        // Append the cart item to the cart container
        cartContainer.appendChild(cartItemElement);

        // Add a click event listener for the "Remove" button
        cartItemElement.querySelector(".delete-cart-item").addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            removeFromCart(index);
        });

        // Add click event listeners for quantity controls
        cartItemElement.querySelector(".decrease-quantity").addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            updateCartItemQuantity(index, -1);
        });

        cartItemElement.querySelector(".increase-quantity").addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            updateCartItemQuantity(index, 1);
        });

        // Update the total amount
        totalAmount += cartItem.price * cartItem.quantity;
    }

    // Display the total amount in the cart modal
    document.getElementById("totalAmount").textContent = totalAmount.toFixed(2);

    // Save cart to local storage
    storeCart(cart);
}

// Function to update the quantity of a specific item in the cart
function updateCartItemQuantity(index, change) {
    cart[index].quantity += change;

    // Ensure quantity doesn't go below 1
    if (cart[index].quantity < 1) {
        cart[index].quantity = 1;
    }

    // Refresh the cart display
    showCart();
}

// Remove an item from the cart
function removeFromCart(index) {
    // Remove the item from the cart array
    cart.splice(index, 1);

    // Refresh the cart display
    showCart();
}

// Delete a product
function deleteProduct(index) {
    // Remove the product from the array
    products.splice(index, 1);

    // Refresh the product list
    showProductList();
}

// Function to get products from local storage
function getStoredProducts() {
    let storedProducts = localStorage.getItem("products");
    return storedProducts ? JSON.parse(storedProducts) : [];
}

// Function to store products in local storage
function storeProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

// Function to get cart from local storage
function getStoredCart() {
    let storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
}

// Function to store cart in local storage
function storeCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}
// Add a "Update Product" button
document.getElementById("updateProductBtn").addEventListener("click", function () {
    // Get the updated values from the modal
    let updatedNameInput = document.getElementById("updateProductName");
    let updatedDescriptionInput = document.getElementById("updateDescription");
    let updatedPriceInput = document.getElementById("updatePrice");
    let indexToUpdateField = document.getElementById("updateProductIndex");

    if (updatedNameInput && updatedDescriptionInput && updatedPriceInput && indexToUpdateField) {
        let updatedName = updatedNameInput.value;
        let updatedDescription = updatedDescriptionInput.value;
        let updatedPrice = updatedPriceInput.value;
        let indexToUpdate = indexToUpdateField.value;

        if (!isNaN(indexToUpdate) && indexToUpdate >= 0 && indexToUpdate < products.length) {
            // Update the product in the array
            products[indexToUpdate].productName = updatedName;
            products[indexToUpdate].description = updatedDescription;
            products[indexToUpdate].price = updatedPrice;

            // Refresh the product list
            showProductList();

            // Close the modal after updating
            let updateProductModal = new bootstrap.Modal(document.getElementById('updateProductModal'));
            updateProductModal.hide();
        } else {
            console.error("Invalid");
        }
    } else {
        console.error("404");
    }
});

// Function to populate the update product modal with existing data
function populateUpdateProductModal(index) {
    let productToUpdate = products[index];

    // Set values in the modal input fields
    let updateProductNameInput = document.getElementById("updateProductName");

    // Check if the element with ID "updateProductName" exists
    if (updateProductNameInput) {
        updateProductNameInput.value = productToUpdate.productName;
    } else {
        console.error("Element with ID 'updateProductName' not found.");
    }

    // Set values in the modal input fields
    document.getElementById("updateDescription").value = productToUpdate.description;
    document.getElementById("updatePrice").value = productToUpdate.price;

    // Store the index in a hidden field for later use
    document.getElementById("updateProductIndex").value = index;
}
});