
/*
# Create Super Admin User

Creates the default super admin account for the Dencast Global CMS.

Credentials:
  Email:    admin@dencastglobal.com
  Password: DencastAdmin2024!
  Role:     super_admin
*/

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Only create if not already there
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@dencastglobal.com') THEN
    v_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      role,
      aud,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      is_sso_user,
      is_anonymous
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@dencastglobal.com',
      crypt('DencastAdmin2024!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Super Admin"}',
      false,
      'authenticated',
      'authenticated',
      now(),
      now(),
      '',
      '',
      false,
      false
    );

    INSERT INTO profiles (id, email, full_name, role, is_active)
    VALUES (v_user_id, 'admin@dencastglobal.com', 'Super Admin', 'super_admin', true)
    ON CONFLICT (id) DO UPDATE SET role = 'super_admin';
  END IF;
END $$;
