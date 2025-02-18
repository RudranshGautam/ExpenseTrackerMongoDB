<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expense Tracker</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .container {
            margin-top: 50px;
            max-width: 600px;
        }
        .pagination {
            margin-top: 20px;
        }
        .pagination-info {
            margin-top: 10px;
            text-align: center;
        }
    </style>
</head>
<body>

<div class="container">
    <h1>Expense Tracker</h1>

    <!-- Premium Purchase and Navigation Buttons -->
    <div>
        <button class="btn btn-success" onclick="buyPremium()">Buy Premium</button>
        <button class="btn btn-info" onclick="location.href='/reports'">Reports</button>
        <button class="btn btn-secondary" onclick="location.href='/leader'">Leaderboard</button>
    </div>

    <!-- Expense Form -->
    <h2>Add Expense</h2>
    <form id="expenseForm">
        <input type="hidden" id="expenseId">
        <div class="form-group">
            <label for="amount">Expense Amount</label>
            <input type="number" class="form-control" id="amount" placeholder="Enter amount" required>
            <div class="invalid-feedback">Please provide a valid amount.</div>
        </div>
        <div class="form-group">
            <label for="description">Description</label>
            <input type="text" class="form-control" id="description" placeholder="Description" required>
            <div class="invalid-feedback">Please provide a description.</div>
        </div>
        <div class="form-group">
            <label for="category">Category</label>
            <select id="category" class="form-control" required>
                <option>Food</option>
                <option>Transport</option>
                <option>Entertainment</option>
                <option>Rent</option>
                <option>Utilities</option>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">Add Expense</button>
    </form>
    <hr>

    <!-- Expenses List -->
    <h4>Your Expenses</h4>
    <ul id="expenseList" class="list-group"></ul>

    <!-- Pagination Controls -->
    <nav aria-label="Page navigation">
        <ul class="pagination" id="paginationControls">
            <li class="page-item" id="prevBtn"><a class="page-link" href="#">Previous</a></li>
            <li class="page-item" id="nextBtn"><a class="page-link" href="#">Next</a></li>
        </ul>
    </nav>

    <!-- Pagination Info -->
    <div class="pagination-info">
        Page <span id="currentPage"></span> of <span id="totalPages"></span>
    </div>
</div>
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script>
    let currentPage = 1;
    const pageSize = 5;
    document.addEventListener('DOMContentLoaded', loadExpenses);
    document.getElementById('expenseForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const amount = document.getElementById('amount').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        const expenseId = document.getElementById('expenseId').value;
        if (!amount || !description || !category) {
            alert('Please fill in all fields.');
            return;
        }
        try {
            if (expenseId) {
                await axios.put(`/expense/${expenseId}`, { amount, description, category }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                document.getElementById('expenseId').value = '';
            } else {
                await axios.post('/expense', { amount, description, category }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            loadExpenses();
            document.getElementById('amount').value = '';
            document.getElementById('description').value = '';
            document.getElementById('category').value = 'Food';
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding the expense.');
        }
    });
    async function loadExpenses() {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get(`/expenses?page=${currentPage}&pageSize=${pageSize}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const expenses = response.data.expenses;
            const expenseList = document.getElementById('expenseList');
            expenseList.innerHTML = '';
            expenses.forEach(expense => {
    const amount = Number(expense.amount); // Ensure it's a number
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `
        ${amount} - ${expense.description} (${expense.category})
        <button class="btn btn-sm btn-danger float-right" onclick="deleteExpense('${expense._id}')">Delete</button>
        <button class="btn btn-sm btn-warning float-right mr-2" onclick="editExpense('${expense._id}', '${amount}', '${expense.description}', '${expense.category}')">Edit</button>
    `;
    expenseList.appendChild(li);
});

            updatePaginationControls(response.data.totalPages);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while loading expenses.');
        }
    }
    async function deleteExpense(id) {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`/expense/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            loadExpenses();
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while deleting the expense.');
        }
    }
    function editExpense(id, amount, description, category) {
        document.getElementById('expenseId').value = id;
        document.getElementById('amount').value = amount;
        document.getElementById('description').value = description;
        document.getElementById('category').value = category;
    }
    function updatePaginationControls(totalPages) {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const currentPageSpan = document.getElementById('currentPage');
        const totalPagesSpan = document.getElementById('totalPages');
        currentPageSpan.textContent = currentPage;
        totalPagesSpan.textContent = totalPages;
        prevBtn.style.display = currentPage === 1 ? 'none' : 'inline';
        nextBtn.style.display = currentPage === totalPages ? 'none' : 'inline';
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                loadExpenses();
            }
        };
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                loadExpenses();
            }
        };
    }
    async function buyPremium() {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.post('/create-order', { amount: 500 }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const { orderId } = response.data;
        const options = {
            key: 'rzp_test_5o50G8FmNVnO34',
            amount: 50000, // Amount in paise
            currency: 'INR',
            name: 'Expense Tracker',
            description: 'Buy Premium Membership',
            order_id: orderId,
            handler: async function (response) {
                try {
                    await axios.post('/verify-payment', response, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    alert('Payment successful! You are now a premium user.');
                } catch (error) {
                    console.error('Payment verification error:', error);
                    alert('Payment verification failed.');
                }
            },
            theme: {
                color: '#3399cc',
            },
        };
        const rzp = new Razorpay(options);
        rzp.open();
    } catch (error) {
        console.error('Error initiating payment:', error);
        alert('An error occurred while processing your payment.');
    }
}
</script>
</body>
</html>
