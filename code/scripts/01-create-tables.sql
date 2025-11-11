-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'mentor', 'admin')),
  created_at TIMESTAMP DEFAULT now()
);

-- Create components table
CREATE TABLE components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  total_quantity INTEGER NOT NULL,
  available_quantity INTEGER NOT NULL,
  qr_code_link TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Create requests table
CREATE TABLE requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES users(id),
  mentor_id UUID REFERENCES users(id),
  component_id UUID NOT NULL REFERENCES components(id),
  quantity INTEGER NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'Requested' CHECK (status IN ('Requested', 'Approved', 'Returned', 'Rejected')),
  request_date TIMESTAMP DEFAULT now(),
  return_date DATE,
  created_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE components ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- RLS Policies for components
CREATE POLICY "Public can view components" ON components
  FOR SELECT USING (true);

-- RLS Policies for requests
CREATE POLICY "Students can view their own requests" ON requests
  FOR SELECT USING (auth.uid()::text = student_id::text);

CREATE POLICY "Mentors can view assigned requests" ON requests
  FOR SELECT USING (auth.uid()::text = mentor_id::text OR auth.uid()::text = (SELECT id::text FROM users WHERE role = 'mentor' LIMIT 1));
