const container = document.getElementById("card-container");
const aside = document.getElementById("cart-aside");
const buttonIcon = document.getElementById("cart-icon");
const asideIcon = document.getElementById("cart-aside-icon");
const overlayCover = document.getElementById("overlayCover");
const cartNavbar = document.getElementById("cartNavbar");
const parag = document.getElementById("parag");
const increment = document.getElementById("btnInc");
const decrement = document.getElementById("btnDec");

function createStore(initial = { cart: [], count: 0, uniqueCount: 0 }) {
  let state = { ...initial };
  const listeners = new Set();
  const notify = () => listeners.forEach((fn) => fn(state));

  return {
    // --- core ---
    getState() {
      return state;
    },
    subscribe(fn) {
      listeners.add(fn);
      fn(state);
      return () => listeners.delete(fn);
    },
    setState(patch) {
      state = { ...state, ...patch };
      notify();
    },
    // --- cart actions ---
    addToCart(product) {
      const cart = [...state.cart];
      const idx = cart.findIndex((i) => String(i.id) === String(product.id));
      let { count, uniqueCount } = state;

      if (idx > -1) {
        // SAME id -> only total quantity increases
        cart[idx] = { ...cart[idx], qty: (cart[idx].qty || 1) + 1 };
        count += 1;
      } else {
        // DIFFERENT id -> total quantity AND unique items increase
        cart.push({ ...product, qty: 1 });
        count += 1;
        uniqueCount += 1;
      }

      state = { ...state, cart, count, uniqueCount };
      notify();
    },
    addOne(id) {
      const cart = [...state.cart];
      const idx = cart.findIndex((i) => String(i.id) === String(id));
      let { count, uniqueCount } = state;

      if (idx > -1) {
        // SAME id -> only total quantity increases
        cart[idx] = { ...cart[idx], qty: (cart[idx].qty || 1) + 1 };
        count += 1;
      }

      state = { ...state, cart, count, uniqueCount };
      notify();
    },
    removeOne(id) {
      const cart = [...state.cart];
      const idx = cart.findIndex((i) => String(i.id) === String(id));
      if (idx === -1) return;

      let { count, uniqueCount } = state;
      const item = cart[idx];
      const qty = item.qty || 1;

      if (qty > 1) {
        cart[idx] = { ...item, qty: qty - 1 };
        count -= 1;
      } else {
        cart.splice(idx, 1);
        count -= 1;
        uniqueCount -= 1;
      }

      state = { ...state, cart, count, uniqueCount };
      notify();
    },
    clearCart() {
      state = { ...state, cart: [], count: 0, uniqueCount: 0 };
      notify();
    },
  };
}

const store = createStore({ cart: [], count: 0, uniqueCount: 0 });

store.subscribe((s) => {
  console.log(s.cart, "cart");

  // Clear the cart DOM before re-render
  cartNavbar.innerHTML = "";

  s.cart.forEach((element) => {
    const ListItem = document.createElement("li");
    ListItem.className = "priceItems";
    ListItem.innerHTML = `
      <img src="${element.image}" alt="${element.name}"/>
      <p>$ 12.99 ${element.name}</p>
      <div class = "priceItems-icons">
      <i class="fa-solid fa-plus" data-id="${element.id}" id="btnInc"></i>
      <span class = "items-added" id = "items-added">${element.qty}</span>
      <i class="fa-solid fa-minus" data-id="${element.id}" id="btnDec"></i>
      </div>
      
      
    `;
    cartNavbar.appendChild(ListItem);
  });
  cartNavbar.querySelectorAll("i").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      btn.id === "btnInc" && store.addOne(id);
      btn.id === "btnDec" && store.removeOne(id);
    });
  });
});

function openMenu() {
  aside.classList.add("active");
  overlayCover.classList.add("active");
}
function closeMenu() {
  aside.classList.remove("active");
  overlayCover.classList.remove("active");
}

// ---- Events ----
buttonIcon.addEventListener("click", openMenu);
asideIcon.addEventListener("click", closeMenu);
overlayCover.addEventListener("click", closeMenu);

window.addEventListener("scroll", () => {
  if (aside.classList.contains("active")) {
    closeMenu();
  }
});

const navLinks = document.querySelectorAll(".tags ul li a");
navLinks.forEach((link) => link.addEventListener("click", closeMenu));

// ---- Fetch Products ----
async function Product() {
  try {
    const response = await fetch("https://dummyjson.com/recipes");
    if (!response.ok) throw new Error("Response not okay");

    const res = await response.json();
    console.log(res);
    res.recipes.forEach((element) => {
      const ListItem = document.createElement("li");
      ListItem.className = "card";
      ListItem.innerHTML = `
        <img src="${element.image}" alt="fruits">
        <div class="card-content">
            <h3 class = "product-name">${element.name}</h3>
            <p class = "product-info">${element.instructions[1] || ""}</p>
          <div class="links">
            <p class = "price">${element.rating}</p>
            <button data-id="${element.id}" data-name="${
        element.name
      }" data-image="${element.image}" data-qty="${
        element.reviewCount
      }" class = "product-btn">
              Add to Cart
            </button>
          </div>
        </div>
      `;
      container.appendChild(ListItem);
    });

    // Attach event listeners to buttons AFTER rendering
    container.querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const image = btn.dataset.image;
        const qty = btn.dataset.qty;
        addToCart(id, name, image, qty);
      });
    });
  } catch (error) {
    console.error(error);
  }
}
Product();

// ---- Counter buttons ----
// increment.addEventListener("click", () => {
//   store.setState({ count: store.getState().count + 1 });
// });
// decrement.addEventListener("click", () => {
//   store.setState({ count: store.getState().count - 1 });
// });

// ---- Add to Cart ----

function addToCart(id, name, image, qty) {
  console.log(id, name, image, image, qty);
  store.addToCart({ id: id, name: name, image: image, qty: qty });
}
