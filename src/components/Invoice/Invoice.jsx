import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { Download, FileText, Calculator, Plus, Trash2, Printer } from 'lucide-react';

const Invoice = () => {
  const [activeTab, setActiveTab] = useState('invoice');
  const [invoiceData, setInvoiceData] = useState({
    companyName: 'Your Company Name',
    companyAddress: '123 Business St, City, Country',
    companyEmail: 'contact@company.com',
    companyPhone: '+1 (555) 123-4567',
    clientName: 'Client Name',
    clientAddress: '456 Client Ave, City, Country',
    clientEmail: 'client@email.com',
    invoiceNumber: 'INV-001',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    items: [
      { id: 1, description: 'Web Development', quantity: 1, price: 1500, tax: 10 },
      { id: 2, description: 'UI/UX Design', quantity: 1, price: 800, tax: 10 },
      { id: 3, description: 'Consultation', quantity: 3, price: 100, tax: 10 },
    ],
    notes: 'Thank you for your business!',
    terms: 'Payment due within 30 days',
  });

  const [budgetData, setBudgetData] = useState({
    projectName: 'New Project Budget',
    currency: 'USD',
    categories: [
      { id: 1, name: 'Development', items: [
        { id: 1, name: 'Frontend Development', quantity: 1, unitCost: 2000, total: 2000 },
        { id: 2, name: 'Backend Development', quantity: 1, unitCost: 2500, total: 2500 },
      ]},
      { id: 2, name: 'Design', items: [
        { id: 3, name: 'UI Design', quantity: 1, unitCost: 1200, total: 1200 },
        { id: 4, name: 'UX Research', quantity: 1, unitCost: 800, total: 800 },
      ]},
      { id: 3, name: 'Other', items: [
        { id: 5, name: 'Project Management', quantity: 1, unitCost: 1000, total: 1000 },
        { id: 6, name: 'Hosting Setup', quantity: 12, unitCost: 50, total: 600 },
      ]},
    ],
    contingency: 10,
  });

  const calculateInvoiceTotal = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const taxTotal = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.price * (item.tax / 100)), 0);
    return { subtotal, taxTotal, total: subtotal + taxTotal };
  };

  const calculateBudgetTotal = () => {
    const subtotal = budgetData.categories.reduce((sum, category) => 
      sum + category.items.reduce((catSum, item) => catSum + item.total, 0), 0
    );
    const contingencyAmount = subtotal * (budgetData.contingency / 100);
    return { subtotal, contingencyAmount, total: subtotal + contingencyAmount };
  };

  const addInvoiceItem = () => {
    const newItem = {
      id: invoiceData.items.length + 1,
      description: '',
      quantity: 1,
      price: 0,
      tax: 10,
    };
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, newItem],
    });
  };

  const removeInvoiceItem = (id) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.filter(item => item.id !== id),
    });
  };

  const updateInvoiceItem = (id, field, value) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.map(item =>
        item.id === id ? { ...item, [field]: parseFloat(value) || value } : item
      ),
    });
  };

  const updateBudgetItem = (categoryId, itemId, field, value) => {
    const newCategories = budgetData.categories.map(category => {
      if (category.id === categoryId) {
        const updatedItems = category.items.map(item => {
          if (item.id === itemId) {
            const updatedItem = { ...item, [field]: parseFloat(value) || value };
            if (field === 'quantity' || field === 'unitCost') {
              updatedItem.total = updatedItem.quantity * updatedItem.unitCost;
            }
            return updatedItem;
          }
          return item;
        });
        return { ...category, items: updatedItems };
      }
      return category;
    });
    setBudgetData({ ...budgetData, categories: newCategories });
  };

  const addBudgetCategory = () => {
    const newCategory = {
      id: budgetData.categories.length + 1,
      name: `Category ${budgetData.categories.length + 1}`,
      items: [],
    };
    setBudgetData({
      ...budgetData,
      categories: [...budgetData.categories, newCategory],
    });
  };

  const addBudgetItem = (categoryId) => {
    const newItem = {
      id: Date.now(),
      name: 'New Item',
      quantity: 1,
      unitCost: 0,
      total: 0,
    };
    const newCategories = budgetData.categories.map(category => {
      if (category.id === categoryId) {
        return { ...category, items: [...category.items, newItem] };
      }
      return category;
    });
    setBudgetData({ ...budgetData, categories: newCategories });
  };

  // Function to wrap text in PDF
  const wrapText = (text, maxWidth, doc) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = doc.getStringUnitWidth(currentLine + " " + word) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    let yPos = margin;

    if (activeTab === 'invoice') {
      const invoiceTotals = calculateInvoiceTotal();

      // Invoice Header
      doc.setFontSize(24);
      doc.setTextColor(41, 128, 185);
      doc.text('INVOICE', pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;

      // Company and Client Info
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      // From Section
      doc.text('FROM:', margin, yPos);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(invoiceData.companyName, margin, yPos + 6);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      
      const companyLines = wrapText(invoiceData.companyAddress, pageWidth - 2 * margin, doc);
      companyLines.forEach((line, index) => {
        doc.text(line, margin, yPos + 12 + (index * 5));
      });
      doc.text(invoiceData.companyEmail, margin, yPos + 12 + (companyLines.length * 5));
      doc.text(invoiceData.companyPhone, margin, yPos + 17 + (companyLines.length * 5));

      // Bill To Section
      doc.setFontSize(10);
      doc.text('BILL TO:', pageWidth - margin - 60, yPos);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(invoiceData.clientName, pageWidth - margin - 60, yPos + 6);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      
      const clientLines = wrapText(invoiceData.clientAddress, 60, doc);
      clientLines.forEach((line, index) => {
        doc.text(line, pageWidth - margin - 60, yPos + 12 + (index * 5));
      });
      doc.text(invoiceData.clientEmail, pageWidth - margin - 60, yPos + 12 + (clientLines.length * 5));

      yPos = Math.max(yPos + 25 + (companyLines.length * 5), yPos + 25 + (clientLines.length * 5));

      // Invoice Details
      doc.setFontSize(10);
      doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, margin, yPos);
      doc.text(`Date: ${invoiceData.date}`, margin, yPos + 5);
      doc.text(`Due Date: ${invoiceData.dueDate}`, margin, yPos + 10);
      yPos += 20;

      // Table Header
      doc.setFillColor(41, 128, 185);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text('Description', margin + 5, yPos + 7);
      doc.text('Qty', margin + 100, yPos + 7);
      doc.text('Price', margin + 120, yPos + 7);
      doc.text('Tax %', margin + 140, yPos + 7);
      doc.text('Total', margin + 160, yPos + 7);
      yPos += 12;

      // Table Rows
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      invoiceData.items.forEach((item, index) => {
        if (yPos > pageHeight - 50) {
          doc.addPage();
          yPos = margin;
        }

        const bgColor = index % 2 === 0 ? [240, 240, 240] : [255, 255, 255];
        doc.setFillColor(...bgColor);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 10, 'F');
        
        // Truncate long descriptions
        let description = item.description;
        if (description.length > 30) {
          description = description.substring(0, 27) + '...';
        }
        
        doc.text(description, margin + 5, yPos + 7);
        doc.text(item.quantity.toString(), margin + 100, yPos + 7);
        doc.text(`$${item.price.toFixed(2)}`, margin + 120, yPos + 7);
        doc.text(`${item.tax}%`, margin + 140, yPos + 7);
        doc.text(`$${(item.quantity * item.price).toFixed(2)}`, margin + 160, yPos + 7);
        yPos += 10;
      });

      yPos += 5;

      // Totals
      doc.setFont(undefined, 'bold');
      doc.text('Subtotal:', pageWidth - margin - 60, yPos);
      doc.text(`$${invoiceTotals.subtotal.toFixed(2)}`, pageWidth - margin - 10, yPos, { align: 'right' });
      yPos += 7;
      
      doc.text('Tax:', pageWidth - margin - 60, yPos);
      doc.text(`$${invoiceTotals.taxTotal.toFixed(2)}`, pageWidth - margin - 10, yPos, { align: 'right' });
      yPos += 7;
      
      doc.setFontSize(12);
      doc.text('TOTAL:', pageWidth - margin - 60, yPos);
      doc.text(`$${invoiceTotals.total.toFixed(2)}`, pageWidth - margin - 10, yPos, { align: 'right' });
      yPos += 15;

      // Notes and Terms
      if (invoiceData.notes) {
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Notes:', margin, yPos);
        doc.setFont(undefined, 'normal');
        const notesLines = wrapText(invoiceData.notes, pageWidth - 2 * margin, doc);
        notesLines.forEach((line, index) => {
          doc.text(line, margin, yPos + 7 + (index * 5));
        });
        yPos += 10 + (notesLines.length * 5);
      }

      if (invoiceData.terms) {
        doc.setFont(undefined, 'bold');
        doc.text('Terms:', margin, yPos);
        doc.setFont(undefined, 'normal');
        const termsLines = wrapText(invoiceData.terms, pageWidth - 2 * margin, doc);
        termsLines.forEach((line, index) => {
          doc.text(line, margin, yPos + 7 + (index * 5));
        });
      }

    } else {
      // Budget PDF Export
      const budgetTotals = calculateBudgetTotal();

      // Budget Header
      doc.setFontSize(24);
      doc.setTextColor(46, 204, 113);
      doc.text('PROJECT BUDGET', pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Project: ${budgetData.projectName}`, margin, yPos);
      doc.text(`Currency: ${budgetData.currency}`, pageWidth - margin - 40, yPos, { align: 'right' });
      yPos += 10;

      budgetData.categories.forEach((category, catIndex) => {
        if (yPos > pageHeight - 50 && catIndex > 0) {
          doc.addPage();
          yPos = margin;
        }

        // Category Header
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(category.name.toUpperCase(), margin, yPos);
        yPos += 8;

        if (category.items.length > 0) {
          const categoryTotal = category.items.reduce((sum, item) => sum + item.total, 0);

          // Table Header
          doc.setFillColor(46, 204, 113);
          doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.text('Item', margin + 5, yPos + 5);
          doc.text('Qty', margin + 100, yPos + 5);
          doc.text('Unit Cost', margin + 120, yPos + 5);
          doc.text('Total', margin + 160, yPos + 5);
          yPos += 10;

          // Table Rows
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(9);
          category.items.forEach((item, index) => {
            if (yPos > pageHeight - 50) {
              doc.addPage();
              yPos = margin;
            }

            const bgColor = index % 2 === 0 ? [240, 240, 240] : [255, 255, 255];
            doc.setFillColor(...bgColor);
            doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
            
            let itemName = item.name;
            if (itemName.length > 35) {
              itemName = itemName.substring(0, 32) + '...';
            }
            
            doc.text(itemName, margin + 5, yPos + 5);
            doc.text(item.quantity.toString(), margin + 100, yPos + 5);
            doc.text(`$${item.unitCost.toFixed(2)}`, margin + 120, yPos + 5);
            doc.text(`$${item.total.toFixed(2)}`, margin + 160, yPos + 5);
            yPos += 8;
          });

          // Category Total
          yPos += 2;
          doc.setFillColor(200, 230, 200);
          doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
          doc.setFont(undefined, 'bold');
          doc.text('Category Total:', margin + 100, yPos + 5);
          doc.text(`$${categoryTotal.toFixed(2)}`, margin + 160, yPos + 5);
          yPos += 12;
        } else {
          doc.setFontSize(10);
          doc.text('No items in this category', margin, yPos);
          yPos += 10;
        }
        yPos += 5;
      });

      // Budget Summary
      if (yPos > pageHeight - 80) {
        doc.addPage();
        yPos = margin;
      }

      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('BUDGET SUMMARY', margin, yPos);
      yPos += 10;

      doc.setFillColor(52, 152, 219);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.text('Description', margin + 5, yPos + 5);
      doc.text('Amount', pageWidth - margin - 10, yPos + 5, { align: 'right' });
      yPos += 10;

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      
      const summaryRows = [
        ['Subtotal', `$${budgetTotals.subtotal.toFixed(2)}`],
        [`Contingency (${budgetData.contingency}%)`, `$${budgetTotals.contingencyAmount.toFixed(2)}`],
        ['TOTAL BUDGET', `$${budgetTotals.total.toFixed(2)}`]
      ];

      summaryRows.forEach((row, index) => {
        const bgColor = index % 2 === 0 ? [240, 240, 240] : [255, 255, 255];
        doc.setFillColor(...bgColor);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'F');
        
        doc.text(row[0], margin + 5, yPos + 5);
        doc.text(row[1], pageWidth - margin - 10, yPos + 5, { align: 'right' });
        yPos += 8;
      });

      // Highlight total row
      doc.setFont(undefined, 'bold');
      doc.setFillColor(46, 204, 113);
      doc.rect(margin, yPos - 8, pageWidth - 2 * margin, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text('TOTAL BUDGET', margin + 5, yPos - 3);
      doc.text(`$${budgetTotals.total.toFixed(2)}`, pageWidth - margin - 10, yPos - 3, { align: 'right' });
    }

    // Footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
      doc.text(
        'Generated by Invoice & Budget Generator',
        pageWidth - margin,
        pageHeight - 10,
        { align: 'right' }
      );
    }

    doc.save(`${activeTab === 'invoice' ? 'invoice' : 'budget'}_${Date.now()}.pdf`);
  };

  const printDocument = () => {
    window.print();
  };

  // Rest of the component remains the same...
  const InvoiceTemplate = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Company Details</h3>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={invoiceData.companyName}
            onChange={(e) => setInvoiceData({...invoiceData, companyName: e.target.value})}
            placeholder="Company Name"
          />
          <textarea
            className="w-full p-2 border rounded"
            value={invoiceData.companyAddress}
            onChange={(e) => setInvoiceData({...invoiceData, companyAddress: e.target.value})}
            placeholder="Company Address"
            rows="3"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email"
              className="p-2 border rounded"
              value={invoiceData.companyEmail}
              onChange={(e) => setInvoiceData({...invoiceData, companyEmail: e.target.value})}
              placeholder="Email"
            />
            <input
              type="tel"
              className="p-2 border rounded"
              value={invoiceData.companyPhone}
              onChange={(e) => setInvoiceData({...invoiceData, companyPhone: e.target.value})}
              placeholder="Phone"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Client Details</h3>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={invoiceData.clientName}
            onChange={(e) => setInvoiceData({...invoiceData, clientName: e.target.value})}
            placeholder="Client Name"
          />
          <textarea
            className="w-full p-2 border rounded"
            value={invoiceData.clientAddress}
            onChange={(e) => setInvoiceData({...invoiceData, clientAddress: e.target.value})}
            placeholder="Client Address"
            rows="3"
          />
          <input
            type="email"
            className="w-full p-2 border rounded"
            value={invoiceData.clientEmail}
            onChange={(e) => setInvoiceData({...invoiceData, clientEmail: e.target.value})}
            placeholder="Client Email"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          className="p-2 border rounded"
          value={invoiceData.invoiceNumber}
          onChange={(e) => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})}
          placeholder="Invoice #"
        />
        <input
          type="date"
          className="p-2 border rounded"
          value={invoiceData.date}
          onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})}
        />
        <input
          type="date"
          className="p-2 border rounded"
          value={invoiceData.dueDate}
          onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Items</h3>
          <button
            onClick={addInvoiceItem}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Plus size={20} />
            Add Item
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-left">Quantity</th>
                <th className="border p-2 text-left">Price</th>
                <th className="border p-2 text-left">Tax %</th>
                <th className="border p-2 text-left">Total</th>
                <th className="border p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    <input
                      type="text"
                      className="w-full p-1 border rounded"
                      value={item.description}
                      onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      className="w-full p-1 border rounded"
                      value={item.quantity}
                      onChange={(e) => updateInvoiceItem(item.id, 'quantity', e.target.value)}
                      min="1"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      className="w-full p-1 border rounded"
                      value={item.price}
                      onChange={(e) => updateInvoiceItem(item.id, 'price', e.target.value)}
                      step="0.01"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      className="w-full p-1 border rounded"
                      value={item.tax}
                      onChange={(e) => updateInvoiceItem(item.id, 'tax', e.target.value)}
                      step="0.1"
                    />
                  </td>
                  <td className="border p-2">
                    ${(item.quantity * item.price).toFixed(2)}
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => removeInvoiceItem(item.id)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Notes</h3>
          <textarea
            className="w-full p-2 border rounded"
            value={invoiceData.notes}
            onChange={(e) => setInvoiceData({...invoiceData, notes: e.target.value})}
            rows="4"
          />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Terms & Conditions</h3>
          <textarea
            className="w-full p-2 border rounded"
            value={invoiceData.terms}
            onChange={(e) => setInvoiceData({...invoiceData, terms: e.target.value})}
            rows="4"
          />
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
          <div>
            <p className="text-gray-600">Subtotal</p>
            <p className="text-2xl font-bold">${calculateInvoiceTotal().subtotal.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-600">Tax</p>
            <p className="text-2xl font-bold">${calculateInvoiceTotal().taxTotal.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-600">Total</p>
            <p className="text-3xl font-bold text-blue-600">${calculateInvoiceTotal().total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const BudgetTemplate = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          className="p-2 border rounded"
          value={budgetData.projectName}
          onChange={(e) => setBudgetData({...budgetData, projectName: e.target.value})}
          placeholder="Project Name"
        />
        <select
          className="p-2 border rounded"
          value={budgetData.currency}
          onChange={(e) => setBudgetData({...budgetData, currency: e.target.value})}
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="JPY">JPY (¥)</option>
        </select>
        <div className="flex items-center gap-2">
          <label>Contingency:</label>
          <input
            type="number"
            className="p-2 border rounded w-24"
            value={budgetData.contingency}
            onChange={(e) => setBudgetData({...budgetData, contingency: parseFloat(e.target.value) || 0})}
            min="0"
            max="50"
            step="0.5"
          />
          <span>%</span>
        </div>
      </div>

      <div className="space-y-6">
        {budgetData.categories.map((category) => (
          <div key={category.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:border-b focus:border-gray-400"
                value={category.name}
                onChange={(e) => {
                  const newCategories = budgetData.categories.map(cat =>
                    cat.id === category.id ? { ...cat, name: e.target.value } : cat
                  );
                  setBudgetData({...budgetData, categories: newCategories});
                }}
              />
              <button
                onClick={() => addBudgetItem(category.id)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Plus size={20} />
                Add Item
              </button>
            </div>

            {category.items.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Item</th>
                      <th className="border p-2 text-left">Quantity</th>
                      <th className="border p-2 text-left">Unit Cost</th>
                      <th className="border p-2 text-left">Total</th>
                      <th className="border p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="border p-2">
                          <input
                            type="text"
                            className="w-full p-1 border rounded"
                            value={item.name}
                            onChange={(e) => updateBudgetItem(category.id, item.id, 'name', e.target.value)}
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="number"
                            className="w-full p-1 border rounded"
                            value={item.quantity}
                            onChange={(e) => updateBudgetItem(category.id, item.id, 'quantity', e.target.value)}
                            min="1"
                          />
                        </td>
                        <td className="border p-2">
                          <input
                            type="number"
                            className="w-full p-1 border rounded"
                            value={item.unitCost}
                            onChange={(e) => updateBudgetItem(category.id, item.id, 'unitCost', e.target.value)}
                            step="0.01"
                          />
                        </td>
                        <td className="border p-2 font-semibold">
                          ${item.total.toFixed(2)}
                        </td>
                        <td className="border p-2">
                          <button
                            onClick={() => {
                              const newCategories = budgetData.categories.map(cat =>
                                cat.id === category.id 
                                  ? { ...cat, items: cat.items.filter(i => i.id !== item.id) }
                                  : cat
                              );
                              setBudgetData({...budgetData, categories: newCategories});
                            }}
                            className="p-2 text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50 font-semibold">
                      <td colSpan="3" className="border p-2 text-right">Category Total:</td>
                      <td className="border p-2">
                        ${category.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
                      </td>
                      <td className="border p-2"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No items added to this category yet.</p>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addBudgetCategory}
        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 mx-auto"
      >
        <Plus size={24} />
        Add New Category
      </button>

      <div className="bg-gray-50 p-6 rounded-lg mt-6">
        <h3 className="text-xl font-bold mb-4">Budget Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-gray-600">Subtotal</p>
            <p className="text-2xl font-bold">${calculateBudgetTotal().subtotal.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Contingency ({budgetData.contingency}%)</p>
            <p className="text-2xl font-bold">${calculateBudgetTotal().contingencyAmount.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600">Total Budget</p>
            <p className="text-3xl font-bold text-green-600">${calculateBudgetTotal().total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Professional Invoice & Budget Generator
          </h1>
          <p className="text-gray-600">
            Create, customize, and export professional invoices and budgets
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex space-x-2 border-b w-full md:w-auto">
              <button
                className={`px-6 py-3 font-medium rounded-t-lg transition-all ${
                  activeTab === 'invoice'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setActiveTab('invoice')}
              >
                <div className="flex items-center gap-2">
                  <FileText size={20} />
                  Invoice Generator
                </div>
              </button>
              <button
                className={`px-6 py-3 font-medium rounded-t-lg transition-all ${
                  activeTab === 'budget'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
                onClick={() => setActiveTab('budget')}
              >
                <div className="flex items-center gap-2">
                  <Calculator size={20} />
                  Budget Calculator
                </div>
              </button>
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              <button
                onClick={printDocument}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Printer size={20} />
                Print
              </button>
              <button
                onClick={exportToPDF}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={20} />
                Export to PDF
              </button>
            </div>
          </div>

          <div className="mt-6">
            {activeTab === 'invoice' ? <InvoiceTemplate /> : <BudgetTemplate />}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">💡 Quick Tips</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Save your company details for future use</li>
              <li>• Add line items for each service/product</li>
              <li>• Customize tax rates per item if needed</li>
              <li>• Preview before exporting to PDF</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">📊 Features</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Professional invoice templates</li>
              <li>• Detailed budget calculations</li>
              <li>• PDF export with formatting</li>
              <li>• Tax and contingency calculations</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-lg mb-2">📈 Statistics</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span className="font-medium">
                  {activeTab === 'invoice' 
                    ? invoiceData.items.length 
                    : budgetData.categories.reduce((sum, cat) => sum + cat.items.length, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-medium">
                  ${activeTab === 'invoice' 
                    ? calculateInvoiceTotal().total.toFixed(2)
                    : calculateBudgetTotal().total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;