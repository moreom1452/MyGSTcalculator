// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
    }

    // Update copyright year automatically
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.textContent = currentYear;
    }

    // Initialize calculators if they exist on the page
    initGSTCalculator();
    initITCCalculator();
    initInvoiceGenerator();
});

// GST Calculator functionality
function initGSTCalculator() {
    const gstCalculatorForm = document.getElementById('gst-calculator-form');
    
    if (gstCalculatorForm) {
        gstCalculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get input values
            const productPrice = parseFloat(document.getElementById('product-price').value);
            const gstRate = parseFloat(document.getElementById('gst-rate').value);
            
            // Validate inputs
            if (isNaN(productPrice) || isNaN(gstRate)) {
                alert('Please enter valid numbers for price and GST rate');
                return;
            }
            
            // Calculate GST amount and final price
            const gstAmount = (productPrice * gstRate) / 100;
            const finalPrice = productPrice + gstAmount;
            
            // Display results
            document.getElementById('base-price-result').textContent = productPrice.toFixed(2);
            document.getElementById('gst-rate-result').textContent = gstRate.toFixed(2) + '%';
            document.getElementById('gst-amount-result').textContent = gstAmount.toFixed(2);
            document.getElementById('final-price-result').textContent = finalPrice.toFixed(2);
            
            // Show result container
            document.getElementById('gst-result-container').style.display = 'block';
        });
    }
}

// ITC Calculator functionality
function initITCCalculator() {
    const itcCalculatorForm = document.getElementById('itc-calculator-form');
    
    if (itcCalculatorForm) {
        itcCalculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get input values
            const purchasePrice = parseFloat(document.getElementById('purchase-price').value);
            const purchaseGstRate = parseFloat(document.getElementById('purchase-gst-rate').value);
            const salesPrice = parseFloat(document.getElementById('sales-price').value);
            const salesGstRate = parseFloat(document.getElementById('sales-gst-rate').value);
            
            // Validate inputs
            if (isNaN(purchasePrice) || isNaN(purchaseGstRate) || isNaN(salesPrice) || isNaN(salesGstRate)) {
                alert('Please enter valid numbers for all fields');
                return;
            }
            
            // Calculate GST amounts
            const purchaseGstAmount = (purchasePrice * purchaseGstRate) / 100;
            const salesGstAmount = (salesPrice * salesGstRate) / 100;
            const netGstLiability = salesGstAmount - purchaseGstAmount;
            
            // Display results
            document.getElementById('purchase-price-result').textContent = purchasePrice.toFixed(2);
            document.getElementById('purchase-gst-rate-result').textContent = purchaseGstRate.toFixed(2) + '%';
            document.getElementById('purchase-gst-amount-result').textContent = purchaseGstAmount.toFixed(2);
            document.getElementById('sales-price-result').textContent = salesPrice.toFixed(2);
            document.getElementById('sales-gst-rate-result').textContent = salesGstRate.toFixed(2) + '%';
            document.getElementById('sales-gst-amount-result').textContent = salesGstAmount.toFixed(2);
            document.getElementById('itc-available-result').textContent = purchaseGstAmount.toFixed(2);
            document.getElementById('net-gst-liability-result').textContent = netGstLiability.toFixed(2);
            
            // Show result container
            document.getElementById('itc-result-container').style.display = 'block';
        });
    }
}

// Invoice Generator functionality
function initInvoiceGenerator() {
    const invoiceForm = document.getElementById('invoice-form');
    const addItemBtn = document.getElementById('add-item-btn');
    const itemsContainer = document.getElementById('invoice-items');
    
    if (invoiceForm && addItemBtn && itemsContainer) {
        // Add new item row
        addItemBtn.addEventListener('click', function() {
            const itemRow = document.createElement('div');
            itemRow.className = 'invoice-item';
            itemRow.innerHTML = `
                <div class="form-group">
                    <input type="text" class="item-name" placeholder="Item Name" required>
                </div>
                <div class="form-group">
                    <input type="number" class="item-quantity" placeholder="Quantity" min="1" value="1" required>
                </div>
                <div class="form-group">
                    <input type="number" class="item-price" placeholder="Price" step="0.01" min="0" required>
                </div>
                <div class="form-group">
                    <input type="number" class="item-gst-rate" placeholder="GST Rate %" step="0.01" min="0" required>
                </div>
                <div class="form-group item-total">
                    ₹0.00
                </div>
                <button type="button" class="remove-item-btn">Remove</button>
            `;
            
            // Add event listener to remove button
            const removeBtn = itemRow.querySelector('.remove-item-btn');
            removeBtn.addEventListener('click', function() {
                itemRow.remove();
                calculateInvoiceTotal();
            });
            
            // Add event listeners to calculate item total
            const itemQuantity = itemRow.querySelector('.item-quantity');
            const itemPrice = itemRow.querySelector('.item-price');
            const itemGstRate = itemRow.querySelector('.item-gst-rate');
            
            [itemQuantity, itemPrice, itemGstRate].forEach(input => {
                input.addEventListener('input', function() {
                    calculateItemTotal(itemRow);
                    calculateInvoiceTotal();
                });
            });
            
            itemsContainer.appendChild(itemRow);
        });
        
        // Generate invoice
        invoiceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate if at least one item exists
            const items = document.querySelectorAll('.invoice-item');
            if (items.length === 0) {
                alert('Please add at least one item to the invoice');
                return;
            }
            
            // Generate PDF
            generateInvoicePDF();
        });
        
        // Add initial item row
        addItemBtn.click();
    }
}

// Calculate total for a single invoice item
function calculateItemTotal(itemRow) {
    const quantity = parseFloat(itemRow.querySelector('.item-quantity').value) || 0;
    const price = parseFloat(itemRow.querySelector('.item-price').value) || 0;
    const gstRate = parseFloat(itemRow.querySelector('.item-gst-rate').value) || 0;
    
    const baseAmount = quantity * price;
    const gstAmount = (baseAmount * gstRate) / 100;
    const totalAmount = baseAmount + gstAmount;
    
    itemRow.querySelector('.item-total').textContent = '₹' + totalAmount.toFixed(2);
    
    return {
        baseAmount,
        gstAmount,
        totalAmount
    };
}

// Calculate invoice totals
function calculateInvoiceTotal() {
    const items = document.querySelectorAll('.invoice-item');
    let subtotal = 0;
    let totalGst = 0;
    let grandTotal = 0;
    
    items.forEach(item => {
        const result = calculateItemTotal(item);
        subtotal += result.baseAmount;
        totalGst += result.gstAmount;
        grandTotal += result.totalAmount;
    });
    
    // Update totals in the form
    const subtotalElem = document.getElementById('invoice-subtotal');
    const totalGstElem = document.getElementById('invoice-total-gst');
    const grandTotalElem = document.getElementById('invoice-grand-total');
    
    if (subtotalElem && totalGstElem && grandTotalElem) {
        subtotalElem.textContent = '₹' + subtotal.toFixed(2);
        totalGstElem.textContent = '₹' + totalGst.toFixed(2);
        grandTotalElem.textContent = '₹' + grandTotal.toFixed(2);
    }
}

// Generate PDF invoice
function generateInvoicePDF() {
    // This function will be implemented using jsPDF library
    alert('PDF generation will be implemented with jsPDF library');
    // The actual implementation will be added in the invoice-generator.js file
}