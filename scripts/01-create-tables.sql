-- Таблица пользователей
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'superadmin')),
  permissions JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица товаров
CREATE TABLE products (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image TEXT,
  additional_images JSONB DEFAULT '[]',
  show_on_homepage BOOLEAN DEFAULT false,
  features JSONB DEFAULT '[]',
  full_description TEXT,
  technical_specs JSONB DEFAULT '[]',
  applications JSONB DEFAULT '[]',
  advantages JSONB DEFAULT '[]',
  show_features BOOLEAN DEFAULT true,
  show_advantages BOOLEAN DEFAULT true,
  show_applications BOOLEAN DEFAULT true,
  show_download_button BOOLEAN DEFAULT false,
  document_url TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('production', 'supply')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица данных главной страницы
CREATE TABLE homepage_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section VARCHAR(50) NOT NULL UNIQUE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица контактных данных
CREATE TABLE contacts_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  whatsapp_url TEXT,
  working_hours JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица заявок
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  product_image TEXT,
  product_type VARCHAR(50) NOT NULL CHECK (product_type IN ('production', 'supply')),
  quantity INTEGER NOT NULL,
  contact TEXT NOT NULL,
  city VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'processing', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
