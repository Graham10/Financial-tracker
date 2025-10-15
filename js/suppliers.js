// Suppliers UI functionality
class SuppliersUI {
    constructor() {
        this.suppliersTableBody = document.getElementById('suppliers-table-body');
    }

    renderSuppliers(suppliers, projectId) {
        this.suppliersTableBody.innerHTML = '';
        
        if (suppliers.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="5" class="text-center" style="text-align: center; padding: 20px; color: #7f8c8d;">
                    No suppliers added yet. ${authManager.canCreateSuppliers() ? 'Click "Add Supplier" to get started.' : 'Contact administrator to add suppliers.'}
                </td>
            `;
            this.suppliersTableBody.appendChild(row);
            return;
        }
        
        suppliers.forEach(supplier => {
            const row = document.createElement('tr');
            const supplierBalance = supplier.owed - supplier.paid;
            const canDelete = authManager.canDeleteSuppliers();
            
            row.innerHTML = `
                <td>
                    <strong>${supplier.name}</strong>
                    ${supplier.createdBy ? `<br><small>Added by: ${supplier.createdBy}</small>` : ''}
                </td>
                <td class="amount owed">${Utils.formatCurrency(supplier.owed)}</td>
                <td class="amount paid">${Utils.formatCurrency(supplier.paid)}</td>
                <td class="amount ${supplierBalance >= 0 ? 'balance-positive' : 'balance-negative'}">
                    ${Utils.formatCurrency(supplierBalance)}
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-warning btn-sm add-payment-btn" data-supplier-id="${supplier.id}"
                                ${!authManager.canRecordPayments() ? 'disabled' : ''}>
                            Add Payment
                        </button>
                        ${canDelete ? `
                        <button class="btn btn-danger btn-sm delete-supplier-btn" data-supplier-id="${supplier.id}">
                            Delete
                        </button>
                        ` : ''}
                    </div>
                </td>
            `;
            
            this.suppliersTableBody.appendChild(row);
        });

        this.attachPaymentButtonListeners(projectId);
        this.attachDeleteButtonListeners(projectId);
    }

    attachPaymentButtonListeners(projectId) {
        document.querySelectorAll('.add-payment-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                if (!authManager.canRecordPayments()) {
                    alert('You do not have permission to record payments.');
                    return;
                }
                const supplierId = parseInt(e.target.dataset.supplierId);
                this.openPaymentModal(projectId, supplierId);
            });
        });
    }

    attachDeleteButtonListeners(projectId) {
        document.querySelectorAll('.delete-supplier-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const supplierId = parseInt(e.target.dataset.supplierId);
                const supplier = projectsManager.getProject(projectId)?.suppliers.find(s => s.id === supplierId);
                
                if (supplier) {
                    Utils.showConfirmation(
                        `Are you sure you want to delete supplier "${supplier.name}"? This action cannot be undone.`,
                        () => {
                            if (projectsManager.deleteSupplier(projectId, supplierId)) {
                                const app = window.appInstance;
                                app.updateFinancialTotals(projectId);
                                this.renderSuppliers(projectsManager.getProject(projectId).suppliers, projectId);
                            }
                        }
                    );
                }
            });
        });
    }

    openPaymentModal(projectId, supplierId) {
        const project = projectsManager.getProject(projectId);
        if (!project) return;

        const supplier = project.suppliers.find(s => s.id === supplierId);
        if (!supplier) return;

        const supplierSelect = document.getElementById('supplier-select');
        supplierSelect.innerHTML = `<option value="${supplier.id}">${supplier.name}</option>`;
        supplierSelect.disabled = true;

        const paymentAmount = document.getElementById('payment-amount');
        const maxPayment = supplier.owed - supplier.paid;
        paymentAmount.max = maxPayment;
        paymentAmount.placeholder = `Max: ${Utils.formatCurrency(maxPayment)}`;

        const today = new Date().toISOString().split('T')[0];
        document.getElementById('payment-date').value = today;

        document.getElementById('payment-modal').style.display = 'flex';
        
        document.getElementById('payment-form').dataset.projectId = projectId;
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

const suppliersUI = new SuppliersUI();