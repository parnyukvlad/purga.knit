
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create purgaknit_users table (extends auth.users)
CREATE TABLE IF NOT EXISTS purgaknit_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create purgaknit_categories table
CREATE TABLE IF NOT EXISTS purgaknit_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create purgaknit_sizes table
CREATE TABLE IF NOT EXISTS purgaknit_sizes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create purgaknit_items table
CREATE TABLE IF NOT EXISTS purgaknit_items (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  size_id INTEGER REFERENCES purgaknit_sizes(id) ON DELETE RESTRICT,
  category_id INTEGER REFERENCES purgaknit_categories(id) ON DELETE RESTRICT,
  image_url TEXT NOT NULL,
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create purgaknit_shipping_addresses table
CREATE TABLE IF NOT EXISTS purgaknit_shipping_addresses (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES purgaknit_users(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  phone TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create purgaknit_orders table
CREATE TABLE IF NOT EXISTS purgaknit_orders (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES purgaknit_users(id) ON DELETE RESTRICT NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
  shipping_cost DECIMAL(10, 2) NOT NULL CHECK (shipping_cost >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  shipping_address_id INTEGER REFERENCES purgaknit_shipping_addresses(id) ON DELETE RESTRICT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create purgaknit_order_items table
CREATE TABLE IF NOT EXISTS purgaknit_order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES purgaknit_orders(id) ON DELETE CASCADE NOT NULL,
  item_id INTEGER REFERENCES purgaknit_items(id) ON DELETE RESTRICT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_category ON purgaknit_items(category_id);
CREATE INDEX IF NOT EXISTS idx_items_size ON purgaknit_items(size_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON purgaknit_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON purgaknit_orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON purgaknit_order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_user ON purgaknit_shipping_addresses(user_id);

-- Enable Row Level Security
ALTER TABLE purgaknit_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE purgaknit_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE purgaknit_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE purgaknit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purgaknit_shipping_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE purgaknit_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purgaknit_order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for purgaknit_users
CREATE POLICY "Users can view their own profile"
  ON purgaknit_users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON purgaknit_users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for purgaknit_categories (public read)
CREATE POLICY "Categories are viewable by everyone"
  ON purgaknit_categories FOR SELECT
  USING (true);

-- RLS Policies for purgaknit_sizes (public read)
CREATE POLICY "Sizes are viewable by everyone"
  ON purgaknit_sizes FOR SELECT
  USING (true);

-- RLS Policies for purgaknit_items (public read)
CREATE POLICY "Items are viewable by everyone"
  ON purgaknit_items FOR SELECT
  USING (true);

-- RLS Policies for purgaknit_shipping_addresses
CREATE POLICY "Users can view their own addresses"
  ON purgaknit_shipping_addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses"
  ON purgaknit_shipping_addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
  ON purgaknit_shipping_addresses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
  ON purgaknit_shipping_addresses FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for purgaknit_orders
CREATE POLICY "Users can view their own orders"
  ON purgaknit_orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON purgaknit_orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for purgaknit_order_items
CREATE POLICY "Users can view order items for their orders"
  ON purgaknit_order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM purgaknit_orders
      WHERE purgaknit_orders.id = purgaknit_order_items.order_id
      AND purgaknit_orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert order items for their orders"
  ON purgaknit_order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM purgaknit_orders
      WHERE purgaknit_orders.id = purgaknit_order_items.order_id
      AND purgaknit_orders.user_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_purgaknit_users_updated_at
  BEFORE UPDATE ON purgaknit_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purgaknit_items_updated_at
  BEFORE UPDATE ON purgaknit_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purgaknit_shipping_addresses_updated_at
  BEFORE UPDATE ON purgaknit_shipping_addresses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purgaknit_orders_updated_at
  BEFORE UPDATE ON purgaknit_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.purgaknit_users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
