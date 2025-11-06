-- Add is_admin column to purgaknit_users table
ALTER TABLE purgaknit_users 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE NOT NULL;

-- Create index for faster admin lookups
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON purgaknit_users(is_admin) WHERE is_admin = TRUE;

-- Update RLS policy to allow admins to view all users
DROP POLICY IF EXISTS "Users can view their own profile" ON purgaknit_users;
CREATE POLICY "Users can view their own profile or admins can view all"
  ON purgaknit_users FOR SELECT
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM purgaknit_users 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Allow admins to update any user profile
CREATE POLICY "Admins can update any profile"
  ON purgaknit_users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM purgaknit_users 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Grant admins access to all orders
CREATE POLICY "Admins can view all orders"
  ON purgaknit_orders FOR SELECT
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM purgaknit_users 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Grant admins access to update orders
CREATE POLICY "Admins can update any order"
  ON purgaknit_orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM purgaknit_users 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Grant admins access to all order items
CREATE POLICY "Admins can view all order items"
  ON purgaknit_order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM purgaknit_orders o
      JOIN purgaknit_users u ON u.id = o.user_id
      WHERE o.id = purgaknit_order_items.order_id
      AND (o.user_id = auth.uid() OR u.is_admin = TRUE)
    )
  );

-- Grant admins access to all shipping addresses
CREATE POLICY "Admins can view all shipping addresses"
  ON purgaknit_shipping_addresses FOR SELECT
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM purgaknit_users 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Grant admins access to manage items
CREATE POLICY "Admins can manage items"
  ON purgaknit_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM purgaknit_users 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Grant admins access to manage categories
CREATE POLICY "Admins can manage categories"
  ON purgaknit_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM purgaknit_users 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Grant admins access to manage sizes
CREATE POLICY "Admins can manage sizes"
  ON purgaknit_sizes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM purgaknit_users 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

