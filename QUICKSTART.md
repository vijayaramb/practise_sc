# Quick Start Guide

## Getting Started in 3 Steps

### Step 1: Install Backend Dependencies

Open a PowerShell terminal and run:

```powershell
cd backend
npm install
```

### Step 2: Install Frontend Dependencies

Open another PowerShell terminal and run:

```powershell
cd frontend
npm install
```

### Step 3: Start Both Services

**Terminal 1 - Backend:**
```powershell
cd backend
npm start
```
✅ Backend will start on http://localhost:5000

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm start
```
✅ Frontend will automatically open at http://localhost:3000

## Testing the Application

### Create Your First Order

1. Fill in the form:
   - Customer Name: `John Doe`
   - Customer Email: `john@example.com`
   
2. Add items:
   - Product: `Laptop`, Quantity: `1`, Price: `999.99`
   - Click "Add Item"
   - Product: `Mouse`, Quantity: `2`, Price: `29.99`

3. Click "Create Order"

### View and Manage Orders

- **View All Orders**: Scroll down to see the order grid
- **Filter by Status**: Use the dropdown to filter (Pending, Processing, etc.)
- **View Details**: Click any order card to see full details
- **Update Status**: Use the status dropdown on each order card
- **Cancel Order**: Click "Cancel Order" (only available for pending orders)

### Watch Auto-Update in Action

1. Create a new order (it will have "pending" status)
2. Wait 5 minutes
3. Click "Refresh" button
4. The order status will automatically change to "processing"

## Troubleshooting

### Port Already in Use

If you get an error about port 5000 already in use:

```powershell
# Find and kill the process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Cannot Find Module Error

Make sure you installed dependencies:
```powershell
npm install
```

### Database Locked Error

Stop and restart the backend server.

## All Set! 🎉

Your order processing system is now running!

Frontend: http://localhost:3000
Backend API: http://localhost:5000/api
