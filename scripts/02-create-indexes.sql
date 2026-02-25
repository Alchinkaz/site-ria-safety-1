-- Индексы для оптимизации
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_show_on_homepage ON products(show_on_homepage);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_users_username ON users(username);
