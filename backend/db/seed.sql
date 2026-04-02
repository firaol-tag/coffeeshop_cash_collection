USE coffee_shop_pos;

INSERT INTO departments (name) VALUES
('Operations'),
('Kitchen'),
('Front of House');

INSERT INTO menu_items (name, category, sub_category, price) VALUES
('Chechebsa', 'Food', 'Breakfast', 100.00),
('Beyanet', 'Food', 'Lunch', 190.00),
('Sandwich', 'Food', 'Snack', 85.00),
('Espresso', 'Drink', 'Hot', 25.00),
('Americano', 'Drink', 'Hot', 30.00),
('Iced Latte', 'Drink', 'Cold', 45.00);

-- Users: npm run seed (bcrypt passwords)
