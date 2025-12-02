```typescript
// transaction(statements: string[]): Promise<void>
// Execute multiple statements in a transaction

const ordersTable = client.getTableName('orders')
const inventoryTable = client.getTableName('inventory')
const orderItemsTable = client.getTableName('order_items')

await client.transaction([
  `INSERT INTO ${ordersTable} (id, user_id, total) VALUES ('${orderId}', '${userId}', ${total})`,
  `UPDATE ${inventoryTable} SET quantity = quantity - ${qty} WHERE product_id = '${productId}'`,
  `INSERT INTO ${orderItemsTable} (order_id, product_id, quantity) VALUES ('${orderId}', '${productId}', ${qty})`
])
```
