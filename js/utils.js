// Utility functions
class Utils {
    static showConfirmation(message, confirmCallback, cancelCallback = null) {
        const modal = document.createElement('div');
        modal.className = 'modal confirmation-modal';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Confirm Action</h3>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="confirmation-actions">
                    <button class="btn" id="cancel-confirm">Cancel</button>
                    <button class="btn btn-danger" id="confirm-action">Confirm</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const closeModal = () => {
            document.body.removeChild(modal);
            if (cancelCallback) cancelCallback();
        };
        
        modal.querySelector('.close-modal').addEventListener('click', closeModal);
        modal.querySelector('#cancel-confirm').addEventListener('click', closeModal);
        
        modal.querySelector('#confirm-action').addEventListener('click', () => {
            document.body.removeChild(modal);
            confirmCallback();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    static formatCurrency(amount) {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2
    }).format(amount);
}
    
    static formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}