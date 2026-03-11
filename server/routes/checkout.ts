import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getOne, getAll, runQuery } from '../db.js';

const router = Router();

// Helper to generate order number
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${year}${month}${day}-${random}`;
}

// POST: Create/Update User
router.post('/api/checkout/user', async (req: Request, res: Response) => {
  try {
    const { id, name, email, phone, address } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const userId = id || uuidv4();

    // Check if user exists
    const existingUser = await getOne(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      // Update user
      await runQuery(
        'UPDATE users SET name = ?, phone = ?, address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [name, phone || null, address || null, existingUser.id]
      );
      return res.json({ id: existingUser.id, message: 'User updated' });
    }

    // Create new user
    await runQuery(
      'INSERT INTO users (id, name, email, phone, address) VALUES (?, ?, ?, ?, ?)',
      [userId, name, email, phone || null, address || null]
    );

    res.json({ id: userId, message: 'User created' });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ error: 'Failed to save user' });
  }
});

// POST: Create Shipping Address
router.post('/api/checkout/shipping-address', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      recipientName,
      email,
      phone,
      streetAddress,
      city,
      state,
      postalCode,
      country,
      isDefault
    } = req.body;

    if (!userId || !recipientName || !streetAddress || !city || !state || !postalCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const addressId = uuidv4();

    await runQuery(
      `INSERT INTO shipping_addresses 
       (id, user_id, recipient_name, email, phone, street_address, city, state, postal_code, country, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [addressId, userId, recipientName, email, phone, streetAddress, city, state, postalCode, country, isDefault ? 1 : 0]
    );

    res.json({ id: addressId, message: 'Shipping address created' });
  } catch (error) {
    console.error('Error creating shipping address:', error);
    res.status(500).json({ error: 'Failed to save shipping address' });
  }
});

// POST: Create Order (Checkout)
router.post('/api/checkout/order', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      shippingAddressId,
      paymentMethodType,
      items,
      subtotal,
      taxAmount,
      taxPercentage = 3,
      shippingCost = 0,
      additionalFees = 0,
      totalAmount,
      couponCode
    } = req.body;

    if (!userId || !shippingAddressId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const orderId = uuidv4();
    const orderNumber = generateOrderNumber();

    // Create order
    await runQuery(
      `INSERT INTO orders 
       (id, user_id, order_number, subtotal, tax_amount, tax_percentage, shipping_cost, additional_fees, total_amount, shipping_address_id, payment_method_type, order_status, payment_status, coupon_code)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        userId,
        orderNumber,
        subtotal,
        taxAmount,
        taxPercentage,
        shippingCost,
        additionalFees,
        totalAmount,
        shippingAddressId,
        paymentMethodType,
        'pending',
        'pending',
        couponCode || null
      ]
    );

    // Create order items
    for (const item of items) {
      const itemId = uuidv4();
      await runQuery(
        `INSERT INTO order_items (id, order_id, product_id, product_name, quantity, unit_price, subtotal)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          itemId,
          orderId,
          item.id,
          item.name,
          item.quantity,
          item.price,
          item.price * item.quantity
        ]
      );
    }

    // Create initial order status history
    await runQuery(
      `INSERT INTO order_status_history (id, order_id, old_status, new_status, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), orderId, null, 'pending', 'Order created']
    );

    res.json({
      id: orderId,
      orderNumber,
      message: 'Order created successfully'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// POST: Process Payment
router.post('/api/checkout/payment', async (req: Request, res: Response) => {
  try {
    const { orderId, paymentMethodId, transactionRef, amount, status = 'processing' } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transactionId = uuidv4();

    // Create payment transaction
    await runQuery(
      `INSERT INTO payment_transactions (id, order_id, payment_method_id, transaction_ref, amount, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [transactionId, orderId, paymentMethodId || null, transactionRef || null, amount, status]
    );

    // Update order payment status
    await runQuery(
      `UPDATE orders SET payment_status = ?, payment_date = CURRENT_TIMESTAMP WHERE id = ?`,
      ['completed', orderId]
    );

    // Update order status to confirmed
    await runQuery(
      `UPDATE orders SET order_status = ? WHERE id = ?`,
      ['confirmed', orderId]
    );

    // Add status history
    await runQuery(
      `INSERT INTO order_status_history (id, order_id, old_status, new_status, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), orderId, 'pending', 'confirmed', 'Payment completed']
    );

    res.json({
      transactionId,
      message: 'Payment processed successfully'
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

// GET: Fetch Orders by User
router.get('/api/checkout/orders/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const orders = await getAll(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );

    // Get items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await getAll(
          'SELECT * FROM order_items WHERE order_id = ?',
          [order.id]
        );
        return { ...order, items };
      })
    );

    res.json(ordersWithItems);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET: Fetch Single Order
router.get('/api/checkout/order/:orderId', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = await getOne(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const items = await getAll(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );

    const shippingAddress = await getOne(
      'SELECT * FROM shipping_addresses WHERE id = ?',
      [order.shipping_address_id]
    );

    const statusHistory = await getAll(
      'SELECT * FROM order_status_history WHERE order_id = ? ORDER BY changed_at DESC',
      [orderId]
    );

    res.json({
      ...order,
      items,
      shippingAddress,
      statusHistory
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// PUT: Update Order Status
router.put('/api/checkout/order/:orderId/status', async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { newStatus, notes } = req.body;

    if (!newStatus) {
      return res.status(400).json({ error: 'New status is required' });
    }

    // Get current order
    const order = await getOne(
      'SELECT order_status FROM orders WHERE id = ?',
      [orderId]
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order status
    await runQuery(
      'UPDATE orders SET order_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newStatus, orderId]
    );

    // Add status history
    await runQuery(
      `INSERT INTO order_status_history (id, order_id, old_status, new_status, notes)
       VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), orderId, order.order_status, newStatus, notes || null]
    );

    res.json({ message: 'Order status updated' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// GET: Fetch All Orders (Admin)
router.get('/api/checkout/orders-admin', async (req: Request, res: Response) => {
  try {
    const orders = await getAll(
      `SELECT o.*, u.name, u.email, u.phone 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC`
    );

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router;
