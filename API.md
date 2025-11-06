# API Documentation

## Authentication Endpoints

All authentication is handled client-side using Supabase Auth. No custom API endpoints are needed.

## Checkout API

### POST /api/checkout

Creates a Stripe Checkout Session and order in the database.

**Request Body:**
```json
{
  "items": [
    {
      "id": 1,
      "name": "Product Name",
      "price": 29.99,
      "quantity": 2,
      "image_url": "https://example.com/image.jpg"
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "streetAddress": "123 Main St",
    "city": "Prague",
    "postalCode": "10000",
    "country": "CZ",
    "phone": "+420123456789",
    "email": "customer@example.com"
  },
  "userId": "user-uuid"
}
```

**Response:**
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

**Error Response:**
```json
{
  "error": "Error message"
}
```

## Database Schema

### Tables

All tables use the `purgaknit_` prefix.

#### purgaknit_users
- `id` (UUID, Primary Key) - References auth.users
- `email` (TEXT, Unique)
- `full_name` (TEXT, Nullable)
- `phone` (TEXT, Nullable)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

#### purgaknit_categories
- `id` (SERIAL, Primary Key)
- `name` (TEXT)
- `slug` (TEXT, Unique)
- `description` (TEXT, Nullable)
- `created_at` (TIMESTAMPTZ)

#### purgaknit_sizes
- `id` (SERIAL, Primary Key)
- `name` (TEXT, Unique)
- `description` (TEXT, Nullable)
- `created_at` (TIMESTAMPTZ)

#### purgaknit_items
- `id` (SERIAL, Primary Key)
- `name` (TEXT)
- `description` (TEXT, Nullable)
- `price` (DECIMAL(10, 2))
- `size_id` (INTEGER, Foreign Key → purgaknit_sizes)
- `category_id` (INTEGER, Foreign Key → purgaknit_categories)
- `image_url` (TEXT)
- `stock` (INTEGER, Default: 0)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

#### purgaknit_orders
- `id` (SERIAL, Primary Key)
- `user_id` (UUID, Foreign Key → purgaknit_users)
- `stripe_payment_intent_id` (TEXT, Unique, Nullable)
- `total_amount` (DECIMAL(10, 2))
- `shipping_cost` (DECIMAL(10, 2))
- `status` (TEXT) - 'pending', 'paid', 'shipped', 'delivered', 'cancelled'
- `shipping_address_id` (INTEGER, Foreign Key → purgaknit_shipping_addresses)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

#### purgaknit_order_items
- `id` (SERIAL, Primary Key)
- `order_id` (INTEGER, Foreign Key → purgaknit_orders)
- `item_id` (INTEGER, Foreign Key → purgaknit_items)
- `quantity` (INTEGER)
- `price` (DECIMAL(10, 2))
- `created_at` (TIMESTAMPTZ)

#### purgaknit_shipping_addresses
- `id` (SERIAL, Primary Key)
- `user_id` (UUID, Foreign Key → purgaknit_users)
- `full_name` (TEXT)
- `street_address` (TEXT)
- `city` (TEXT)
- `postal_code` (TEXT)
- `country` (TEXT)
- `phone` (TEXT, Nullable)
- `is_default` (BOOLEAN, Default: false)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

## Row Level Security (RLS)

All tables have RLS enabled with the following policies:

- **purgaknit_users**: Users can view and update their own profile
- **purgaknit_categories**: Public read access
- **purgaknit_sizes**: Public read access
- **purgaknit_items**: Public read access
- **purgaknit_shipping_addresses**: Users can manage their own addresses
- **purgaknit_orders**: Users can view and create their own orders
- **purgaknit_order_items**: Users can view items for their own orders

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key (server-side only)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret (optional)
- `NEXT_PUBLIC_APP_URL` - Application URL
- `NODE_ENV` - Environment (development/production)

## Error Handling

All API routes return appropriate HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

Error responses follow this format:
```json
{
  "error": "Error message"
}
```

