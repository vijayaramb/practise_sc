"# Order Processing System

A full-stack order processing system built with React, Node.js, Express, and SQLite.

## Features

✅ **Create Order** - Create new orders with multiple items  
✅ **View Order Details** - Retrieve complete order information by ID  
✅ **Update Status** - Change order status (Pending → Processing → Shipping → Delivered)  
✅ **Auto-Update** - Pending orders automatically change to Processing after 5 minutes  
✅ **List Orders** - View all orders with filtering by status  
✅ **Cancel Orders** - Cancel orders that are in Pending status  

## Tech Stack

### Backend
- Node.js
- Express.js
- SQLite3
- CORS

### Frontend
- React 18
- Axios
- CSS3

## Project Structure

```
practise_sc/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration and initialization
│   ├── controllers/
│   │   └── orderController.js   # Order business logic
│   ├── routes/
│   │   └── orderRoutes.js       # API routes
│   ├── utils/
│   │   └── autoUpdate.js        # Auto-update mechanism
│   ├── package.json
│   └── server.js                # Express server entry point
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreateOrder.js   # Order creation form
│   │   │   ├── CreateOrder.css
│   │   │   ├── OrderList.js     # Order listing and filtering
│   │   │   ├── OrderList.css
│   │   │   ├── OrderDetails.js  # Order details modal
│   │   │   └── OrderDetails.css
│   │   ├── services/
│   │   │   └── orderService.js  # API service layer
│   │   ├── App.js               # Main application component
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── orders.db                     # SQLite database (created on first run)
```

## Database Schema

### Orders Table
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  total_amount REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### Order Items Table
```sql
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
)
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```powershell
cd backend
```

2. Install dependencies:
```powershell
npm install
```

3. Start the backend server:
```powershell
npm start
```

The backend server will run on `http://localhost:5000`

For development with auto-restart:
```powershell
npm run dev
```

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```powershell
cd frontend
```

2. Install dependencies:
```powershell
npm install
```

3. Start the React development server:
```powershell
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "items": [
    {
      "product_name": "Product 1",
      "quantity": 2,
      "price": 29.99
    }
  ]
}
```

### Get All Orders
```http
GET /api/orders
GET /api/orders?status=pending
```

### Get Order by ID
```http
GET /api/orders/:id
```

### Update Order Status
```http
PATCH /api/orders/:id/status
Content-Type: application/json

{
  "status": "processing"
}
```

### Cancel Order
```http
DELETE /api/orders/:id
```

## Order Status Flow

```
pending → processing → shipping → delivered
```

- **Pending**: Order created, awaiting processing
- **Processing**: Order is being prepared
- **Shipping**: Order has been shipped
- **Delivered**: Order has been delivered to customer

**Note**: Pending orders are automatically updated to Processing after 5 minutes.

## Features in Detail

### 1. Create Order
- Enter customer name and email
- Add multiple items with product name, quantity, and price
- Automatically calculates total amount
- Real-time form validation

### 2. View Orders
- Grid view of all orders
- Filter by status (All, Pending, Processing, Shipping, Delivered)
- Color-coded status badges
- Click on any order to view full details

### 3. Order Details Modal
- Complete customer information
- Detailed item list with subtotals
- Order timestamps
- Status information

### 4. Update Status
- Change status directly from order card
- Dropdown selector for available statuses
- Real-time updates

### 5. Cancel Order
- Only pending orders can be cancelled
- Confirmation dialog before deletion
- Cascade delete for order items

### 6. Auto-Update Mechanism
- Runs every minute on the backend
- Converts pending orders to processing after 5 minutes
- Logs updates to console
- No manual intervention required

## Usage Examples

### Creating an Order
1. Fill in customer name and email
2. Add product details (name, quantity, price)
3. Click "Add Item" to add more products
4. Review the total amount
5. Click "Create Order"

### Filtering Orders
1. Use the status dropdown in the order list
2. Select desired status (or "All Statuses")
3. Orders are filtered instantly

### Cancelling an Order
1. Find the pending order
2. Click "Cancel Order" button
3. Confirm in the dialog
4. Order is removed from the system

## Development Notes

- The backend uses SQLite for simplicity and portability
- Database file is created automatically on first run
- Frontend uses React hooks for state management
- Auto-update mechanism runs continuously when server is active
- All API calls are centralized in the orderService

## Future Enhancements

- User authentication and authorization
- Order history and tracking
- Email notifications
- Payment integration
- Advanced reporting and analytics
- Export orders to CSV/PDF
- Search functionality
- Pagination for large order lists

## Troubleshooting

### Backend won't start
- Ensure port 5000 is not in use
- Check Node.js version (v14+)
- Verify all dependencies are installed

### Frontend won't connect to backend
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify proxy setting in frontend package.json

### Database errors
- Delete `orders.db` file to reset database
- Restart the backend server

## License

This project is created for educational purposes.

## Author

Created as a technical demonstration project." 
