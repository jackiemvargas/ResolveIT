const form = document.getElementById("ticketForm");
const ticketList = document.getElementById("ticketList");
const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");

const totalTickets = document.getElementById("totalTickets");
const openTickets = document.getElementById("openTickets");
const resolvedTickets = document.getElementById("resolvedTickets");

let tickets = [
    {
        id: "RIT-001",
        name: "Monica Brown",
        department: "Sales",
        category: "Network Problem",
        priority: "High",
        technician: "Parker",
        description: "Unable to connect to company Wi-Fi.",
        status: "Open",
        createdAt: new Date().toLocaleString()
    },
    {
        id: "RIT-002",
        name: "Jackson Grey",
        department: "HR",
        category: "Password Reset",
        priority: "Low",
        technician: "Leila",
        description: "Forgot system login password.",
        status: "Resolved",
        createdAt: new Date().toLocaleString()
    }
];

let ticketCounter = 3;

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const newTicket = {
        id: "RIT-" + String(ticketCounter).padStart(3, "0"),
        name: document.getElementById("name").value,
        department: document.getElementById("department").value,
        category: document.getElementById("category").value,
        priority: document.getElementById("priority").value,
        technician: document.getElementById("technician").value,
        description: document.getElementById("description").value,
        status: "Open",
        createdAt: new Date().toLocaleString()
    };

    tickets.push(newTicket);
    ticketCounter++;

    form.reset();
    renderTickets();
});

statusFilter.addEventListener("change", renderTickets);
priorityFilter.addEventListener("change", renderTickets);

function renderTickets() {
    ticketList.innerHTML = "";

    const filteredTickets = tickets.filter(ticket => {
        const matchesStatus =
            statusFilter.value === "All" || ticket.status === statusFilter.value;

        const matchesPriority =
            priorityFilter.value === "All" || ticket.priority === priorityFilter.value;

        return matchesStatus && matchesPriority;
    });

    if (filteredTickets.length === 0) {
        ticketList.innerHTML = `
            <div class="empty-state">
                <h3>No tickets found</h3>
                <p>Submit a ticket or adjust your filters.</p>
            </div>
        `;
    } else {
        filteredTickets.forEach(ticket => {
            const ticketCard = document.createElement("div");
            ticketCard.classList.add("ticket-card");

            ticketCard.innerHTML = `
                <div class="ticket-top">
                    <div>
                        <p class="ticket-id">${ticket.id}</p>
                        <p class="ticket-name">${ticket.name}</p>
                    </div>
                    <div>
                        <span class="badge ${getPriorityClass(ticket.priority)}">${ticket.priority}</span>
                        <span class="badge ${getStatusClass(ticket.status)}">${ticket.status}</span>
                    </div>
                </div>

                <div class="ticket-meta">
                    <p><strong>Department:</strong> ${ticket.department}</p>
                    <p><strong>Category:</strong> ${ticket.category}</p>
                    <p><strong>Assigned To:</strong> ${ticket.technician}</p>
                    <p><strong>Created:</strong> ${ticket.createdAt}</p>
                </div>

                <p class="ticket-description"><strong>Description:</strong> ${ticket.description}</p>

                <div class="ticket-actions">
                    <button class="action-btn progress-btn" onclick="updateStatus('${ticket.id}', 'In Progress')">Mark In Progress</button>
                    <button class="action-btn resolve-btn" onclick="updateStatus('${ticket.id}', 'Resolved')">Mark Resolved</button>
                </div>
            `;

            ticketList.appendChild(ticketCard);
        });
    }

    updateStats();
}

function updateStatus(ticketId, newStatus) {
    tickets = tickets.map(ticket => {
        if (ticket.id === ticketId) {
            ticket.status = newStatus;
        }
        return ticket;
    });

    renderTickets();
}

function updateStats() {
    totalTickets.textContent = tickets.length;
    openTickets.textContent = tickets.filter(ticket => ticket.status === "Open").length;
    resolvedTickets.textContent = tickets.filter(ticket => ticket.status === "Resolved").length;
}

function getPriorityClass(priority) {
    if (priority === "Low") return "priority-low";
    if (priority === "Medium") return "priority-medium";
    if (priority === "High") return "priority-high";
    return "priority-critical";
}

function getStatusClass(status) {
    if (status === "Open") return "status-open";
    if (status === "In Progress") return "status-progress";
    return "status-resolved";
}

renderTickets();