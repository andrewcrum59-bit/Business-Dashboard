const toggleButton = document.querySelector("#toggle-orders");
const ordersSection = document.querySelector(".orders");

toggleButton.addEventListener("click", function () {
    ordersSection.hidden = !ordersSection.hidden;

    toggleButton.textContent = ordersSection.hidden
        ? "Show Orders"
        : "Hide Orders";

    toggleButton.setAttribute("aria-expanded", !ordersSection.hidden);
});
const dateLabel = document.querySelector("#today");

dateLabel.textContent = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
});
const cards = document.querySelectorAll(".card");
let draggedCard = null;

cards.forEach(function (card) {
    card.addEventListener("dragstart", function (event) {
        draggedCard = card;
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", "");
        card.classList.add("dragging");
    });

    card.addEventListener("dragover", function (event) {
        event.preventDefault();

        if (draggedCard && draggedCard !== card) {
            card.classList.add("drop-target");
        }
    });

    card.addEventListener("dragleave", function () {
        card.classList.remove("drop-target");
    });

    card.addEventListener("drop", function (event) {
        event.preventDefault();

        if (!draggedCard || draggedCard === card) {
            return;
        }

        const container = card.parentElement;
        const currentCards = [...container.children];
        const fromIndex = currentCards.indexOf(draggedCard);
        const toIndex = currentCards.indexOf(card);

        if (fromIndex < toIndex) {
            card.after(draggedCard);
        } else {
            card.before(draggedCard);
        }

        card.classList.remove("drop-target");
    });

    card.addEventListener("dragend", function () {
        cards.forEach(function (item) {
            item.classList.remove("dragging", "drop-target");
        });

        draggedCard = null;
    });
});
const cardsContainer = document.querySelector(".cards");

// Give each card an ID based on its original position.
cards.forEach(function (card, index) {
    card.dataset.cardId = String(index);
});

// Restore the saved order when the page opens.
try {
    const savedOrder = JSON.parse(localStorage.getItem("cardOrder"));

    if (Array.isArray(savedOrder)) {
        savedOrder.forEach(function (id) {
            const matchingCard = [...cards].find(function (card) {
                return card.dataset.cardId === id;
            });

            if (matchingCard) {
                cardsContainer.appendChild(matchingCard);
            }
        });
    }
} catch (error) {
    console.log("The saved card order could not be loaded.");
}

// Save the order after a card is dropped.
cardsContainer.addEventListener("drop", function () {
    const order = [...cardsContainer.querySelectorAll(".card")].map(
        function (card) {
            return card.dataset.cardId;
        }
    );

    try {
        localStorage.setItem("cardOrder", JSON.stringify(order));
    } catch (error) {
        console.log("The card order could not be saved.");
    }
});
const orderForm = document.querySelector("#add-order-form");
const customerInput = document.querySelector("#customer-name");
const amountInput = document.querySelector("#order-amount");
const ordersTable = document.querySelector(".orders tbody");

let nextOrderNumber = 1004;
let totalRevenue = 24500;
let totalOrders = 156;

const revenueDisplay = document.querySelector("#total-revenue");
const ordersDisplay = document.querySelector("#total-orders");

orderForm.addEventListener("submit", function (event) {
    // Stop the form from refreshing the page.
    event.preventDefault();

    const customerName = customerInput.value.trim();
    const amount = Number(amountInput.value);

    if (!customerName || !Number.isFinite(amount) || amount <= 0) {
        return;
    }

    // Create a new table row.
    const row = document.createElement("tr");

    const values = [
        `#${nextOrderNumber}`,
        customerName,
        amount.toLocaleString("en-US", {
            style: "currency",
            currency: "USD"
        })
    ];

    values.forEach(function (value) {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
    });

    ordersTable.prepend(row);
    nextOrderNumber++;
    totalRevenue += amount;
totalOrders++;

revenueDisplay.textContent = totalRevenue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD"
});

ordersDisplay.textContent = totalOrders.toLocaleString("en-US");

    // Show the table if it was hidden.
    ordersSection.hidden = false;
    toggleButton.textContent = "Hide Orders";
    toggleButton.setAttribute("aria-expanded", "true");

    // Clear the form for the next order.
    // Save the updated table and totals.
    updateSummary();
const rows = [...ordersTable.rows].map(function (row) {
    return [...row.cells].slice(0, 3).map(function (cell) {
        return cell.textContent;
    });
});

try {
    localStorage.setItem("dashboardOrders", JSON.stringify({
        totalRevenue: totalRevenue,
        totalOrders: totalOrders,
        nextOrderNumber: nextOrderNumber,
        rows: rows
    }));
} catch (error) {
    console.log("Orders could not be saved.");
}
    orderForm.reset();
    customerInput.focus();

});
// Restore saved orders and totals.
try {
    const saved = JSON.parse(localStorage.getItem("dashboardOrders"));

    if (saved) {
        totalRevenue = saved.totalRevenue;
        totalOrders = saved.totalOrders;
        nextOrderNumber = saved.nextOrderNumber;

        ordersTable.replaceChildren();

        saved.rows.forEach(function (values) {
            const row = document.createElement("tr");

            values.forEach(function (value) {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            ordersTable.appendChild(row);
        });

            revenueDisplay.textContent = totalRevenue.toLocaleString("en-US", {
            style: "currency",
            currency: "USD"
        });

        ordersDisplay.textContent = totalOrders.toLocaleString("en-US");
    }
} catch (error) {
    console.log("Saved orders could not be loaded.");
}

function addDeleteButtons() {
    [...ordersTable.rows].forEach(function (row) {
        // Don't add a second button to the same row.
        if (row.querySelector(".delete-order")) {
            return;
        }

        const cell = document.createElement("td");
        const button = document.createElement("button");

        button.type = "button";
        button.className = "delete-order";
        button.textContent = "Delete";

        cell.appendChild(button);
        row.appendChild(cell);
    });
}

// Add buttons to existing and restored orders.
addDeleteButtons();

// Add a button whenever a new order is created.
orderForm.addEventListener("submit", addDeleteButtons);

// Handle clicks on the delete buttons.
ordersTable.addEventListener("click", function (event) {
    const button = event.target.closest(".delete-order");

    if (!button) {
        return;
    }

    const row = button.closest("tr");
    const amount = Number(
        row.cells[2].textContent.replace(/[$,]/g, "")
    );

    if (!Number.isFinite(amount)) {
        return;
    }

    row.remove();

    totalRevenue = Math.round((totalRevenue - amount) * 100) / 100;
    totalOrders--;

    revenueDisplay.textContent = totalRevenue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    });

    ordersDisplay.textContent = totalOrders.toLocaleString("en-US");
updateSummary();
    const rows = [...ordersTable.rows].map(function (row) {
        return [...row.cells].slice(0, 3).map(function (cell) {
            return cell.textContent;
        });
    });

    try {
        localStorage.setItem("dashboardOrders", JSON.stringify({
            totalRevenue: totalRevenue,
            totalOrders: totalOrders,
            nextOrderNumber: nextOrderNumber,
            rows: rows
        }));
    } catch (error) {
        console.log("The deletion could not be saved.");
    }
});
const orderSearch = document.querySelector("#order-search");

function filterOrders() {
    const searchText = orderSearch.value.trim().toLowerCase();
    let matchingOrders = 0;

    [...ordersTable.rows].forEach(function (row) {
        const customerName = row.cells[1].textContent.toLowerCase();
        const matches = customerName.includes(searchText);

        row.hidden = !matches;

        if (matches) {
            matchingOrders++;
        }
    });

    const message = document.querySelector("#no-orders-message");
    message.hidden = matchingOrders > 0;

    message.textContent = searchText
        ? "No matching orders."
        : "No orders yet.";
}
// Update the message after deleting an order.
ordersTable.addEventListener("click", filterOrders);
// Run the filter whenever you type.
orderSearch.addEventListener("input", filterOrders);

// Update the filter after adding an order.
orderForm.addEventListener("submit", filterOrders);

// Apply the filter when the page opens.
filterOrders();
function updateSummary() {
    const rows = [...ordersTable.rows];
    let revenueInCents = 0;
    const customers = new Set();

    rows.forEach(function (row) {
        const amount = Number(
            row.cells[2].textContent.replace(/[$,]/g, "")
        );

        revenueInCents += Math.round(amount * 100);

        const name = row.cells[1].textContent
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase();

        customers.add(name);
    });

    totalRevenue = revenueInCents / 100;
    totalOrders = rows.length;

    revenueDisplay.textContent = totalRevenue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
    });

    ordersDisplay.textContent = totalOrders.toLocaleString("en-US");

    document.querySelector("#total-customers").textContent =
        customers.size.toLocaleString("en-US");
}

// Calculate accurate totals after saved orders load.
updateSummary();