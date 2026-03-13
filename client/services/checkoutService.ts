/**
 * Checkout Service
 * Handles all API calls for checkout, orders, and payment processing
 */

const API_BASE = '/api/checkout';

interface User {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface ShippingAddress {
  userId: string;
  recipientName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface CheckoutData {
  userId: string;
  shippingAddressId: string;
  paymentMethodType: 'bank_transfer' | 'cod' | 'credit_card' | 'e_wallet';
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  taxPercentage?: number;
  shippingCost?: number;
  additionalFees?: number;
  totalAmount: number;
  couponCode?: string;
}

interface PaymentData {
  orderId: string;
  paymentMethodId?: string;
  transactionRef?: string;
  amount: number;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
}

// Save or update user
export async function saveUser(user: User): Promise<{ id: string; message: string }> {
  try {
    console.log('Calling API:', `${API_BASE}/user`, 'with data:', user);
    const response = await fetch(`${API_BASE}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    const contentType = response.headers.get('content-type');
    const text = await response.text();

    console.log('API Response:', { status: response.status, contentType, text: text.substring(0, 500) });

    if (!response.ok) {
      const error = { status: response.status, text, contentType };
      console.error('API Error Response:', error);
      throw new Error(`API Error ${response.status}: ${text || 'Failed to save user'}`);
    }

    if (!text) {
      throw new Error('Empty response from server');
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('JSON Parse Error:', { text, contentType });
      throw new Error(`Invalid JSON response from server: ${text}`);
    }
  } catch (error) {
    console.error('Error saving user:', error instanceof Error ? error.message : String(error));
    throw error;
  }
}

// Save shipping address
export async function saveShippingAddress(address: ShippingAddress): Promise<{ id: string; message: string }> {
  try {
    const response = await fetch(`${API_BASE}/shipping-address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(address),
    });

    const text = await response.text();

    if (!response.ok) {
      console.error('API Error Response:', { status: response.status, text });
      throw new Error(`API Error ${response.status}: Failed to save shipping address`);
    }

    if (!text) {
      throw new Error('Empty response from server');
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      console.error('JSON Parse Error:', text);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    console.error('Error saving shipping address:', error);
    throw error;
  }
}

// Create order (checkout)
export async function createOrder(checkoutData: CheckoutData): Promise<{ id: string; orderNumber: string; message: string }> {
  try {
    const response = await fetch(`${API_BASE}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkoutData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Process payment
export async function processPayment(paymentData: PaymentData): Promise<{ transactionId: string; message: string }> {
  try {
    const response = await fetch(`${API_BASE}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to process payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
}

// Get orders by user
export async function getUserOrders(userId: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE}/orders/${userId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch orders');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

// Get single order
export async function getOrder(orderId: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE}/order/${orderId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch order');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, newStatus: string, notes?: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_BASE}/order/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newStatus, notes }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update order status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

// Get all orders (admin)
export async function getAllOrders(): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE}/orders-admin`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch orders');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}
