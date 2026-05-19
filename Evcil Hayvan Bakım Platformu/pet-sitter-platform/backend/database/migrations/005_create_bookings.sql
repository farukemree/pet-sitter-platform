CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,

  listing_id INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  sitter_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  pet_name VARCHAR(100),
  pet_type VARCHAR(50),
  note TEXT,

  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled', 'completed')),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CHECK (end_date >= start_date)
);