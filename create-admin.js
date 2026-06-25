// Quick script to create admin user
const baseUrl = 'http://localhost:3000';

async function createAdmin() {
  console.log('🚀 Creating admin user...\n');

  try {
    // Register admin
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123',
        email: 'admin@sekolah.com',
        role: 'ADMIN'
      })
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Admin user created successfully!');
      console.log('\n📝 Login credentials:');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('\n🌐 Go to: http://localhost:3000/login');
    } else if (result.message?.includes('already')) {
      console.log('ℹ️  Admin user already exists');
      console.log('\n📝 Login credentials:');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('\n🌐 Go to: http://localhost:3000/login');
    } else {
      console.log('❌ Failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️  Make sure server is running: npm run dev');
  }
}

createAdmin();
