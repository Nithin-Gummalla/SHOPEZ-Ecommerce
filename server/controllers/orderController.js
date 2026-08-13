const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const mongoose = require('mongoose');

// @desc    Create new order & simulate payment/inventory reduction
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod = 'Simulated Card / UPI' } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.phone) {
      return res.status(400).json({ message: 'Please provide complete shipping address details' });
    }

    // Verify products and calculate authoritative backend prices
    const validatedItems = [];
    let itemsPrice = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name || item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock insufficient for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`
        });
      }

      const itemFinalPrice = product.finalPrice;
      itemsPrice += itemFinalPrice * item.quantity;

      validatedItems.push({
        name: product.name,
        quantity: item.quantity,
        image: product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
        price: product.price,
        discountPercent: product.discountPercent,
        finalPrice: itemFinalPrice,
        product: product._id
      });
    }

    // Calculate tax and shipping charges
    const taxPrice = Math.round(itemsPrice * 0.05 * 100) / 100; // 5% tax
    const shippingPrice = itemsPrice > 100 || itemsPrice === 0 ? 0 : 10; // Free shipping over $100
    const totalPrice = Math.round((itemsPrice + taxPrice + shippingPrice) * 100) / 100;

    const order = new Order({
      orderItems: validatedItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      paymentResult: {
        id: 'SIM_PAY_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        status: 'COMPLETED',
        update_time: new Date().toISOString()
      },
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: true,
      paidAt: Date.now(),
      orderStatus: 'PLACED'
    });

    const createdOrder = await order.save();

    // Reduce product inventory stock
    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear user cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Order ID' });
    }

    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization: must be order owner or Admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Order ID' });
    }

    const { status } = req.body;
    const validStatuses = ['PLACED', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status value' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const prevStatus = order.orderStatus;
    order.orderStatus = status;

    if (status === 'DELIVERED') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    // If order is cancelled by admin, restore stock if not previously cancelled
    if (status === 'CANCELLED' && prevStatus !== 'CANCELLED') {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel order (User)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid Order ID' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to cancel this order' });
    }

    if (['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(order.orderStatus)) {
      return res.status(400).json({ message: `Cannot cancel order after it has been ${order.orderStatus.toLowerCase()}` });
    }

    if (order.orderStatus === 'CANCELLED') {
      return res.status(400).json({ message: 'Order is already cancelled' });
    }

    order.orderStatus = 'CANCELLED';
    const updatedOrder = await order.save();

    // Restore stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  cancelOrder
};
