import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '../data');
const ordersFile = path.join(dataDir, 'orders.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Helper to generate UUID (without external library)
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Helper to generate order number
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${year}${month}${day}-${random}`;
}

// Load all orders from file
function loadOrders(): any {
  try {
    if (fs.existsSync(ordersFile)) {
      const data = fs.readFileSync(ordersFile, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading orders file:', error);
  }
  return { users: [], orders: [], shippingAddresses: [], payments: [] };
}

// Save orders to file
function saveOrders(data: any): void {
  try {
    fs.writeFileSync(ordersFile, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving orders file:', error);
  }
}

const router = Router();

// POST: Create/Update User
router.post('/api/checkout/user', (req: Request, res: Response) => {
  try {
    const { id, name, email, phone, address } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const data = loadOrders();
    const userId = id || generateUUID();

    // Check if user exists
    const existingUser = data.users.find((u: any) => u.email === email);

    if (existingUser) {
      // Update user
      Object.assign(existingUser, { name, phone, address, updatedAt: new Date().toISOString() });
      saveOrders(data);
      return res.json({ id: existingUser.id, message: 'User updated' });
    }

    // Create new user
    const newUser = {
      id: userId,
      name,
      email,
      phone: phone || null,
      address: address || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.users.push(newUser);
    saveOrders(data);

    res.json({ id: userId, message: 'User created' });
  } catch (error) {
    console.error('Error creating/updating user:', error);
    res.status(500).json({ error: 'Failed to save user' });
  }
});

// POST: Create Shipping Address
router.post('/api/checkout/shipping-address', (req: Request, res: Response) => {
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
      isDefault,
    } = req.body;

    if (!userId || !recipientName || !streetAddress || !city || !state || !postalCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const data = loadOrders();
    const addressId = generateUUID();

    const newAddress = {
      id: addressId,
      userId,
      recipientName,
      email,
      phone,
      streetAddress,
      city,
      state,
      postalCode,
      country,
      isDefault: isDefault || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.shippingAddresses.push(newAddress);
    saveOrders(data);

    res.json({ id: addressId, message: 'Shipping address created' });
  } catch (error) {
    console.error('Error creating shipping address:', error);
    res.status(500).json({ error: 'Failed to save shipping address' });
  }
});

// POST: Create Order (Checkout)
router.post('/api/checkout/order', (req: Request, res: Response) => {
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
      couponCode,
    } = req.body;

    if (!userId || !shippingAddressId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const data = loadOrders();
    const orderId = generateUUID();
    const orderNumber = generateOrderNumber();

    const newOrder = {
      id: orderId,
      userId,
      orderNumber,
      subtotal,
      taxAmount,
      taxPercentage,
      shippingCost,
      additionalFees,
      totalAmount,
      currency: 'USD',
      shippingAddressId,
      paymentMethodType,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      items,
      couponCode: couponCode || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    data.orders.push(newOrder);
    saveOrders(data);

    res.json({
      id: orderId,
      orderNumber,
      message: 'Order created successfully',
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// POST: Process Payment
router.post('/api/checkout/payment', (req: Request, res: Response) => {
  try {
    const { orderId, paymentMethodId, transactionRef, amount, status = 'completed' } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const data = loadOrders();
    const order = data.orders.find((o: any) => o.id === orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order payment status
    order.paymentStatus = status;
    order.orderStatus = 'confirmed';
    order.paymentDate = new Date().toISOString();
    order.updatedAt = new Date().toISOString();

    // Save payment record
    const payment = {
      id: generateUUID(),
      orderId,
      transactionRef: transactionRef || generateUUID(),
      amount,
      status,
      createdAt: new Date().toISOString(),
    };

    data.payments.push(payment);
    saveOrders(data);

    res.json({
      transactionId: payment.id,
      message: 'Payment processed successfully',
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

// GET: Fetch Orders by User
router.get('/api/checkout/orders/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const data = loadOrders();

    const orders = data.orders
      .filter((o: any) => o.userId === userId)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET: Fetch Single Order
router.get('/api/checkout/order/:orderId', (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const data = loadOrders();

    const order = data.orders.find((o: any) => o.id === orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const shippingAddress = data.shippingAddresses.find(
      (a: any) => a.id === order.shippingAddressId
    );

    res.json({ ...order, shippingAddress });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// PUT: Update Order Status
router.put('/api/checkout/order/:orderId/status', (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { newStatus, notes } = req.body;

    if (!newStatus) {
      return res.status(400).json({ error: 'New status is required' });
    }

    const data = loadOrders();
    const order = data.orders.find((o: any) => o.id === orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.orderStatus = newStatus;
    order.updatedAt = new Date().toISOString();

    saveOrders(data);

    res.json({ message: 'Order status updated' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// GET: Fetch All Orders (Admin)
router.get('/api/checkout/orders-admin', (req: Request, res: Response) => {
  try {
    const data = loadOrders();

    const orders = data.orders.map((order: any) => {
      const user = data.users.find((u: any) => u.id === order.userId);
      return { ...order, userName: user?.name, userEmail: user?.email };
    });

    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

export default router;
