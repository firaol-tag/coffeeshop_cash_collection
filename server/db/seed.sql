USE coffee_shop_pos;

INSERT INTO departments (name) VALUES
('Operations'),
('Kitchen'),
('Front of House');

INSERT INTO menus (name) VALUES
('Food'),
('Drink');

INSERT INTO menu_items (name, menu_id) VALUES
('Breakfast', 1),
('Lunch', 1),
('Snack', 1),
('Hot', 2),
('Cold', 2);

INSERT INTO foods (name, price, menu_item_id) VALUES
('Chechebsa', 100.00, 1),
('Beyanet', 190.00, 2),
('Sandwich', 85.00, 3),
('Espresso', 25.00, 4),
('Americano', 30.00, 4),
('Iced Latte', 45.00, 5);

-- Users: npm run seed (bcrypt passwords)
