// Suppliers UI functionality
class SuppliersUI {
    constructor() {
        this.suppliersTableBody = document.getElementById('suppliers-table-body');
    }

    renderSuppliers(suppliers) {
        this.suppliersTableBody.innerHTML = '';
        
        suppliers.forEach(supplier => {
            const row = document.createElement('tr');
            const supplierBalance = supplier.owed - supplier.paid;
            
            row.innerHTML = `
                <td>${supplier.name}</td>
                <td class="amount owed">Kshs${supplier.owed.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                <td class="amount paid">Kshs${supplier.paid.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                <td class="amount ${supplierBalance >= 0 ? 'balance-positive' : 'balance-negative'}">
                    Kshs${supplierBalance.toLocaleString('en-US', {minimumFractionDigits: 2})}
                </td>
                <td>
                    <button class="btn btn-warning btn-sm add-payment-btn" data-supplier-id="${supplier.id}">
                        Add Payment
                    </button>
                </td>
            `;
            
            this.suppliersTableBody.appendChild(row);
        });

        // Add event listeners to payment buttons
        this.attachPaymentButtonListeners();
    }

    attachPaymentButtonListeners() {
        document.querySelectorAll('.add-payment-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const supplierId = parseInt(e.target.dataset.supplierId);
                this.openPaymentModal(supplierId);
            });
        });
    }

    openPaymentModal(supplierId) {
        const project = projectsManager.getCurrentProject();
        if (!project) return;

        const supplier = project.suppliers.find(s => s.id === supplierId);
        if (!supplier) return;

        const supplierSelect = document.getElementById('supplier-select');
        supplierSelect.innerHTML = `<option value="${supplier.id}">${supplier.name}</option>`;
        supplierSelect.disabled = true;

        const paymentAmount = document.getElementById('payment-amount');
        const maxPayment = supplier.owed - supplier.paid;
        paymentAmount.max = maxPayment;
        paymentAmount.placeholder = `Max: Kshs${maxPayment.toLocaleString('en-US', {minimumFractionDigits: 2})}`;

        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('payment-date').value = today;

        document.getElementById('payment-modal').style.display = 'flex';
        
        // Store the supplier ID for later use
        document.getElementById('payment-form').dataset.supplierId = supplierId;
    }

    populateSupplierSelect(projectId) {
        const project = projectsManager.getProject(projectId);
        const supplierSelect = document.getElementById('supplier-select');
        
        supplierSelect.innerHTML = '<option value="">Select a supplier</option>';
        supplierSelect.disabled = false;

        if (project) {
            project.suppliers.forEach(supplier => {
                const option = document.createElement('option');
                option.value = supplier.id;
                option.textContent = supplier.name;
                supplierSelect.appendChild(option);
            });
        }
    }
}

// Create global instance
const suppliersUI = new SuppliersUI();