// scripts/createAdmin.js
// ─────────────────────────────────────────────────────────────────────────────
// ONE-TIME setup script to create the first admin user.
// Run ONCE after setting up the database:
//
//   node scripts/createAdmin.js
//
// After running, delete or ignore this file — you don't need it again.
// ─────────────────────────────────────────────────────────────────────────────

import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ─── CHANGE THESE BEFORE RUNNING ─────────────────────────────────────────────
const ADMIN_EMAIL    = 'admin@nomadicventures.com';
const ADMIN_PASSWORD = 'NV@Admin2025!';   // Use a strong password!
const ADMIN_NAME     = 'Nomadic Admin';
// ─────────────────────────────────────────────────────────────────────────────

async function createAdmin() {
  console.log('🔐 Creating admin user...\n');

  // Hash the password with bcrypt (12 rounds = very secure)
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const { data, error } = await supabase
    .from('admin_users')
    .insert({
      email:         ADMIN_EMAIL.toLowerCase(),
      password_hash: passwordHash,
      name:          ADMIN_NAME,
      role:          'admin',
    })
    .select('id, email, name, role')
    .single();

  if (error) {
    if (error.code === '23505') {
      console.error('❌ An admin with this email already exists.');
    } else {
      console.error('❌ Error creating admin:', error.message);
    }
    process.exit(1);
  }

  console.log('✅ Admin created successfully!');
  console.log('─────────────────────────────');
  console.log('  Email:', data.email);
  console.log('  Name: ', data.name);
  console.log('  Role: ', data.role);
  console.log('  ID:   ', data.id);
  console.log('─────────────────────────────');
  console.log('\n⚠️  Save your password — it cannot be recovered!');
  console.log('  Password:', ADMIN_PASSWORD);
}

createAdmin();
