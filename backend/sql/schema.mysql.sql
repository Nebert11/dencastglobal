CREATE DATABASE IF NOT EXISTS dencast CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dencast;

CREATE TABLE IF NOT EXISTS profiles (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  role ENUM('super_admin', 'admin', 'editor') NOT NULL DEFAULT 'editor',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hero_content (
  id CHAR(36) PRIMARY KEY,
  headline TEXT NOT NULL,
  subheadline TEXT,
  cta_primary_text VARCHAR(255),
  cta_primary_url TEXT,
  cta_secondary_text VARCHAR(255),
  cta_secondary_url TEXT,
  background_video_url TEXT,
  background_image_url TEXT,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS site_settings (
  id CHAR(36) PRIMARY KEY,
  `key` VARCHAR(191) NOT NULL UNIQUE,
  `value` LONGTEXT,
  `type` ENUM('text', 'json', 'boolean', 'number', 'image') DEFAULT 'text',
  label VARCHAR(255),
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS seo_metadata (
  id CHAR(36) PRIMARY KEY,
  page_slug VARCHAR(191) NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image TEXT,
  canonical_url TEXT,
  robots VARCHAR(255) DEFAULT 'index, follow',
  schema_markup JSON,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS social_links (
  id CHAR(36) PRIMARY KEY,
  platform VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  icon VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  industry VARCHAR(255),
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_categories (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(191) NOT NULL UNIQUE,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id CHAR(36) PRIMARY KEY,
  category_id CHAR(36),
  client_id CHAR(36),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(191) NOT NULL UNIQUE,
  tagline TEXT,
  description LONGTEXT,
  challenge LONGTEXT,
  solution LONGTEXT,
  results LONGTEXT,
  content LONGTEXT,
  cover_image TEXT,
  cover_image_url TEXT,
  hero_image TEXT,
  video_url TEXT,
  gallery_images JSON,
  videos JSON,
  technologies JSON,
  services_provided JSON,
  client_name VARCHAR(255),
  client_logo TEXT,
  project_date DATE,
  project_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  views INT NOT NULL DEFAULT 0,
  published_at DATETIME,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_category FOREIGN KEY (category_id) REFERENCES project_categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_projects_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
  INDEX idx_projects_category (category_id),
  INDEX idx_projects_published (published_at)
);

CREATE TABLE IF NOT EXISTS blog_categories (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(191) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(32) DEFAULT '#0056A6',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id CHAR(36) PRIMARY KEY,
  category_id CHAR(36),
  author_id CHAR(36),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(191) NOT NULL UNIQUE,
  excerpt TEXT,
  content LONGTEXT,
  cover_image TEXT,
  cover_image_url TEXT,
  tags JSON,
  meta_title TEXT,
  meta_description TEXT,
  status VARCHAR(32) DEFAULT 'draft',
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  views INT NOT NULL DEFAULT 0,
  read_time INT NOT NULL DEFAULT 5,
  published_at DATETIME,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_blog_category FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL,
  CONSTRAINT fk_blog_author FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE SET NULL,
  INDEX idx_blog_category (category_id),
  INDEX idx_blog_publication (is_published, published_at)
);

CREATE TABLE IF NOT EXISTS service_categories (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(191) NOT NULL UNIQUE,
  description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id CHAR(36) PRIMARY KEY,
  category_id CHAR(36),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(191) NOT NULL UNIQUE,
  tagline TEXT,
  description LONGTEXT,
  icon VARCHAR(100),
  cover_image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_services_category FOREIGN KEY (category_id) REFERENCES service_categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS testimonials (
  id CHAR(36) PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  client_title VARCHAR(255),
  client_company VARCHAR(255),
  client_avatar_url TEXT,
  content LONGTEXT NOT NULL,
  rating TINYINT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  bio LONGTEXT,
  avatar_url TEXT,
  social_links JSON,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_leadership BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS statistics (
  id CHAR(36) PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  value DECIMAL(14,2) NOT NULL,
  suffix VARCHAR(32) DEFAULT '+',
  prefix VARCHAR(32),
  description TEXT,
  icon VARCHAR(100),
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faqs (
  id CHAR(36) PRIMARY KEY,
  question TEXT NOT NULL,
  answer LONGTEXT NOT NULL,
  category VARCHAR(191),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(254) NOT NULL,
  phone VARCHAR(80),
  company VARCHAR(255),
  service_interest VARCHAR(255),
  subject VARCHAR(500),
  message LONGTEXT NOT NULL,
  status ENUM('new', 'read', 'replied', 'archived') NOT NULL DEFAULT 'new',
  reply_message LONGTEXT,
  replied_at DATETIME,
  ip_address VARCHAR(64),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_contact_status (status)
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(254) NOT NULL UNIQUE,
  name VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  source VARCHAR(100) DEFAULT 'website',
  subscribed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at DATETIME
);

CREATE TABLE IF NOT EXISTS media_files (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255),
  url TEXT,
  type VARCHAR(191),
  size BIGINT,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_type ENUM('image', 'video', 'document', 'pdf') NOT NULL,
  mime_type VARCHAR(191),
  file_size BIGINT,
  width INT,
  height INT,
  duration INT,
  alt_text TEXT,
  caption TEXT,
  tags JSON,
  folder VARCHAR(191) DEFAULT 'general',
  cloudinary_id VARCHAR(255),
  uploaded_by CHAR(36),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_media_uploader FOREIGN KEY (uploaded_by) REFERENCES profiles(id) ON DELETE SET NULL,
  INDEX idx_media_type (file_type)
);