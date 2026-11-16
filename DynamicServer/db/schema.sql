-- Spice Soiree schema (MySQL 8). Safe to run repeatedly: tables are only created if missing.

CREATE TABLE IF NOT EXISTS settings (
  setting_key   VARCHAR(64)  NOT NULL PRIMARY KEY,
  setting_value VARCHAR(1000) NOT NULL,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Restaurant menu ----------
CREATE TABLE IF NOT EXISTS menu_categories (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL UNIQUE,
  icon         VARCHAR(16)  NOT NULL DEFAULT '',
  page_heading VARCHAR(150) NOT NULL DEFAULT '',
  sort_order   INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS menu_items (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  category_id   INT NOT NULL,
  main_heading  VARCHAR(150) NOT NULL DEFAULT '',
  section       VARCHAR(150) NOT NULL DEFAULT '',
  name          VARCHAR(150) NOT NULL,
  description   VARCHAR(500) NOT NULL DEFAULT '',
  image         VARCHAR(500) NOT NULL DEFAULT '',
  is_bestseller TINYINT(1) NOT NULL DEFAULT 0,
  is_active     TINYINT(1) NOT NULL DEFAULT 1,  -- 0 = hidden from the website
  in_stock      TINYINT(1) NOT NULL DEFAULT 1,  -- 0 = shown as out of stock
  sort_order    INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_menu_items_category FOREIGN KEY (category_id) REFERENCES menu_categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS menu_item_prices (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  menu_item_id INT NOT NULL,
  size_label   VARCHAR(50) NOT NULL,
  price        DECIMAL(10,2) NOT NULL,
  sort_order   INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_menu_prices_item FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Pre-order curries ----------
CREATE TABLE IF NOT EXISTS preorder_categories (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  icon       VARCHAR(16)  NOT NULL DEFAULT '',
  curry_type VARCHAR(50)  NOT NULL, -- 'Non-Veg Curries' | 'Veg Curries' | 'Special Curries'
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS preorder_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  category_id INT NOT NULL,
  name        VARCHAR(150) NOT NULL,
  description VARCHAR(500) NOT NULL DEFAULT '',
  image       VARCHAR(500) NOT NULL DEFAULT '',
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  in_stock    TINYINT(1) NOT NULL DEFAULT 1,
  sort_order  INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_preorder_items_category FOREIGN KEY (category_id) REFERENCES preorder_categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS preorder_item_prices (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  preorder_item_id INT NOT NULL,
  size_label       VARCHAR(50) NOT NULL,
  price            DECIMAL(10,2) NOT NULL,
  sort_order       INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_preorder_prices_item FOREIGN KEY (preorder_item_id) REFERENCES preorder_items(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Fresh meat & eggs ----------
CREATE TABLE IF NOT EXISTS meat_categories (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL UNIQUE,
  icon       VARCHAR(16)  NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS meat_products (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  category_id     INT NOT NULL,
  name            VARCHAR(150) NOT NULL,
  subtitle        VARCHAR(150) NOT NULL DEFAULT '',
  price           DECIMAL(10,2) NOT NULL,
  display_price   VARCHAR(100) NOT NULL DEFAULT '',
  unit            VARCHAR(20)  NOT NULL DEFAULT 'kg',
  image           VARCHAR(500) NOT NULL DEFAULT '',
  cutting_allowed TINYINT(1) NOT NULL DEFAULT 0,
  is_active       TINYINT(1) NOT NULL DEFAULT 1,
  in_stock        TINYINT(1) NOT NULL DEFAULT 1,
  sort_order      INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_meat_products_category FOREIGN KEY (category_id) REFERENCES meat_categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS meat_product_cuts (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  meat_product_id INT NOT NULL,
  name            VARCHAR(100) NOT NULL,
  sort_order      INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_meat_cuts_product FOREIGN KEY (meat_product_id) REFERENCES meat_products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Showcase of cutting styles (cards on the Fresh Meat page)
CREATE TABLE IF NOT EXISTS cutting_styles (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  subtitle   VARCHAR(150) NOT NULL DEFAULT '',
  image      VARCHAR(500) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Booking ----------
CREATE TABLE IF NOT EXISTS delivery_slots (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  label      VARCHAR(50) NOT NULL,
  is_active  TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Seasonal / special menus (e.g. Karthika Masam veg specials) ----------
CREATE TABLE IF NOT EXISTS special_menu_groups (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  image      VARCHAR(500) NOT NULL DEFAULT '',
  is_active  TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS special_menu_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  group_id   INT NOT NULL,
  name       VARCHAR(150) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_special_items_group FOREIGN KEY (group_id) REFERENCES special_menu_groups(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Generic page content (slides, features, reviews, packages, ...) ----------
-- page + section identify a list; the meaning of each column per list is documented in db/seed-data.js.
CREATE TABLE IF NOT EXISTS content_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  page        VARCHAR(50)  NOT NULL,
  section     VARCHAR(50)  NOT NULL,
  title       VARCHAR(255) NOT NULL DEFAULT '',
  subtitle    VARCHAR(255) NOT NULL DEFAULT '',
  description TEXT,
  detail      VARCHAR(255) NOT NULL DEFAULT '',
  icon        VARCHAR(16)  NOT NULL DEFAULT '',
  image       VARCHAR(1000) NOT NULL DEFAULT '',
  button_text VARCHAR(100) NOT NULL DEFAULT '',
  link        VARCHAR(500) NOT NULL DEFAULT '',
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  sort_order  INT NOT NULL DEFAULT 0,
  INDEX idx_content_page (page, section, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Accounts (admins and customers share one table, separated by role) ----------
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  role          ENUM('admin', 'customer') NOT NULL DEFAULT 'customer',
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  phone         VARCHAR(20)  NULL UNIQUE,      -- 10-digit Indian mobile, digits only
  password_hash VARCHAR(255) NOT NULL,          -- bcrypt
  is_active     TINYINT(1) NOT NULL DEFAULT 1,  -- 0 = blocked, cannot log in
  token_version INT NOT NULL DEFAULT 0,         -- bump to invalidate all issued tokens
  last_login_at DATETIME NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------- Orders ----------
-- One row per delivery/pickup. A checkout with several dates creates one order per date.
-- Status lifecycle and allowed transitions are defined in src/orderStatus.js.
CREATE TABLE IF NOT EXISTS orders (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  order_number     VARCHAR(20)  NULL UNIQUE,               -- e.g. SS000123 (set right after insert)
  user_id          INT NOT NULL,
  status           VARCHAR(30)  NOT NULL DEFAULT 'placed',
  fulfilment_type  ENUM('delivery', 'pickup') NOT NULL DEFAULT 'delivery',
  customer_name    VARCHAR(150) NOT NULL,                  -- snapshot at order time
  customer_phone   VARCHAR(20)  NOT NULL,
  delivery_address VARCHAR(500) NULL,
  scheduled_date   DATE NOT NULL,
  time_slot        VARCHAR(50)  NOT NULL,
  customer_notes   VARCHAR(500) NOT NULL DEFAULT '',
  items_total      DECIMAL(10,2) NOT NULL,
  delivery_fee     DECIMAL(10,2) NOT NULL DEFAULT 0,
  total            DECIMAL(10,2) NOT NULL,
  payment_status   ENUM('unpaid', 'paid', 'refunded') NOT NULL DEFAULT 'unpaid',
  cancelled_by     ENUM('customer', 'admin') NULL,
  cancel_reason    VARCHAR(500) NULL,
  dispute_reason   VARCHAR(1000) NULL,
  resolution_note  VARCHAR(1000) NULL,
  completed_at     DATETIME NULL,                          -- when delivered / picked up
  created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_orders_status (status, scheduled_date),
  INDEX idx_orders_user (user_id, created_at),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Line items are snapshots (name/size/price at order time), so later menu edits
-- never change an existing order. item_type + item_id point back to the catalog.
CREATE TABLE IF NOT EXISTS order_items (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  order_id       INT NOT NULL,
  item_type      ENUM('menu', 'preorder', 'meat') NOT NULL,
  item_id        INT NOT NULL,
  name           VARCHAR(150) NOT NULL,
  size_label     VARCHAR(50)  NOT NULL DEFAULT '',
  cutting_option VARCHAR(100) NOT NULL DEFAULT '',
  unit           VARCHAR(20)  NOT NULL DEFAULT '',
  unit_price     DECIMAL(10,2) NOT NULL,
  quantity       INT NOT NULL,
  line_total     DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit trail: every status change, who made it and why.
CREATE TABLE IF NOT EXISTS order_status_history (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  order_id        INT NOT NULL,
  from_status     VARCHAR(30) NULL,
  to_status       VARCHAR(30) NOT NULL,
  note            VARCHAR(1000) NOT NULL DEFAULT '',
  changed_by_id   INT NULL,
  changed_by_role ENUM('customer', 'admin', 'system') NOT NULL,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_history_order (order_id, created_at),
  CONSTRAINT fk_history_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
