import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;

// Database schema initialization
export async function initDatabase() {
  const client = await pool.connect();

  try {
    // Visitor tracking table - captures EVERYTHING
    await client.query(`
      CREATE TABLE IF NOT EXISTS visitor_tracking (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255),
        ip_address VARCHAR(45),
        user_agent TEXT,
        referrer TEXT,
        landing_page TEXT,
        country VARCHAR(100),
        city VARCHAR(100),
        region VARCHAR(100),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        isp VARCHAR(255),
        device_type VARCHAR(50),
        browser VARCHAR(100),
        os VARCHAR(100),
        screen_resolution VARCHAR(50),
        language VARCHAR(50),
        timezone VARCHAR(100),
        is_bot BOOLEAN DEFAULT false,
        bot_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Page views tracking - every single page view
    await client.query(`
      CREATE TABLE IF NOT EXISTS page_views (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255),
        page_url TEXT,
        page_title VARCHAR(255),
        time_on_page INTEGER,
        scroll_depth INTEGER,
        clicks_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Click tracking - every single click
    await client.query(`
      CREATE TABLE IF NOT EXISTS click_tracking (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255),
        element_type VARCHAR(100),
        element_id VARCHAR(255),
        element_class VARCHAR(255),
        element_text TEXT,
        page_url TEXT,
        x_position INTEGER,
        y_position INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Form interactions - track form fills
    await client.query(`
      CREATE TABLE IF NOT EXISTS form_tracking (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255),
        form_name VARCHAR(255),
        field_name VARCHAR(255),
        interaction_type VARCHAR(50),
        time_spent INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Honeypot alerts - track suspicious activity
    await client.query(`
      CREATE TABLE IF NOT EXISTS honeypot_alerts (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255),
        ip_address VARCHAR(45),
        user_agent TEXT,
        trap_type VARCHAR(100),
        trap_url TEXT,
        request_method VARCHAR(10),
        request_headers JSONB,
        request_body TEXT,
        threat_level VARCHAR(20),
        country VARCHAR(100),
        is_vpn BOOLEAN DEFAULT false,
        is_proxy BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Contact form submissions
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255),
        ip_address VARCHAR(45),
        name VARCHAR(255),
        email VARCHAR(255),
        message TEXT,
        user_agent TEXT,
        country VARCHAR(100),
        is_spam BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Mouse movements (sampled) - track behavior patterns
    await client.query(`
      CREATE TABLE IF NOT EXISTS mouse_tracking (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255),
        page_url TEXT,
        movements JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Session summary - aggregate data per session
    await client.query(`
      CREATE TABLE IF NOT EXISTS session_summary (
        id SERIAL PRIMARY KEY,
        session_id VARCHAR(255) UNIQUE,
        ip_address VARCHAR(45),
        total_pages INTEGER DEFAULT 0,
        total_clicks INTEGER DEFAULT 0,
        total_time_seconds INTEGER DEFAULT 0,
        triggered_honeypot BOOLEAN DEFAULT false,
        is_suspicious BOOLEAN DEFAULT false,
        first_visit TIMESTAMP,
        last_visit TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_visitor_ip ON visitor_tracking(ip_address);
      CREATE INDEX IF NOT EXISTS idx_visitor_session ON visitor_tracking(session_id);
      CREATE INDEX IF NOT EXISTS idx_page_session ON page_views(session_id);
      CREATE INDEX IF NOT EXISTS idx_honeypot_ip ON honeypot_alerts(ip_address);
      CREATE INDEX IF NOT EXISTS idx_honeypot_date ON honeypot_alerts(created_at);
      CREATE INDEX IF NOT EXISTS idx_session_summary ON session_summary(session_id);
    `);

    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
}
