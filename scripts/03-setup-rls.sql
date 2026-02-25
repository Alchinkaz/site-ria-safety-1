-- RLS политики (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Политики доступа (все данные доступны для чтения и записи)
CREATE POLICY "Allow all operations" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON products FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON homepage_data FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON contacts_data FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON orders FOR ALL USING (true);
