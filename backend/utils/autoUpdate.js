const db = require('../config/database');

// Auto-update orders based on status and time threshold
function startAutoStatusUpdate(prevStatus, newStatus, minutesThreshold) {
  setInterval(() => {
    db.run(
      `UPDATE orders 
       SET status = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE status = ? 
       AND datetime(updated_at, '+${minutesThreshold} minutes') <= datetime('now')`,
      [newStatus, prevStatus],
      function(err) {
        if (err) {
          console.error('Auto-update error:', err.message);
        } else if (this.changes > 0) {
          console.log(`Auto-updated ${this.changes} order(s) from ${prevStatus} to ${newStatus}`);
        }
      }
    );
  }, 30000); // Check every 30 seconds
}

// Initialize all auto-update processes
function initializeAutoUpdates() {
  startAutoStatusUpdate('pending', 'processing', 1);
  startAutoStatusUpdate('processing', 'shipping', 2);
  startAutoStatusUpdate('shipping', 'delivered', 3);
}

module.exports = {
  startAutoStatusUpdate: initializeAutoUpdates
};
