-- Run if you already created menu_items without image_filename:
USE coffee_shop_pos;

ALTER TABLE menu_items
  ADD COLUMN image_filename VARCHAR(255) NULL AFTER price;
