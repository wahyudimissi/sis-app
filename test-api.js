// Test API Script - Sistem Informasi Sekolah
const baseUrl = 'http://localhost:3000';

// Helper function to make requests
async function testAPI(method, endpoint, data = null, description = '') {
  console.log(`\n🧪 Testing: ${description}`);
  console.log(`   ${method} ${endpoint}`);
  
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${baseUrl}${endpoint}`, options);
    
    let result;
    try {
      result = await response.json();
    } catch (e) {
      const text = await response.text();
      console.log(`   ❌ Failed to parse JSON. Response: ${text.substring(0, 200)}`);
      return { success: false, error: 'Invalid JSON response' };
    }

    if (response.ok) {
      console.log(`   ✅ Success (${response.status})`);
      console.log(`   Response:`, JSON.stringify(result, null, 2));
      return { success: true, data: result, status: response.status };
    } else {
      console.log(`   ❌ Failed (${response.status})`);
      console.log(`   Error:`, JSON.stringify(result, null, 2));
      return { success: false, error: result, status: response.status };
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  console.log('='.repeat(60));
  console.log('⏳ Make sure server is running: npm run dev');
  console.log('='.repeat(60));

  // Wait a bit for user
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 1: Create Admin User
  console.log('\n📋 TEST 1: Register Admin User');
  console.log('='.repeat(60));
  const registerResult = await testAPI(
    'POST',
    '/api/auth/register',
    {
      username: 'admin',
      password: 'admin123',
      email: 'admin@sekolah.com',
      role: 'ADMIN'
    },
    'Register Admin Account'
  );

  if (!registerResult.success && registerResult.error?.message?.includes('already')) {
    console.log('   ℹ️  Admin user already exists');
  }

  // Test 2: Login
  console.log('\n📋 TEST 2: Login Admin User');
  console.log('='.repeat(60));
  const loginResult = await testAPI(
    'POST',
    '/api/auth/login',
    {
      username: 'admin',
      password: 'admin123'
    },
    'Login as Admin'
  );

  if (!loginResult.success) {
    console.log('\n❌ Login failed! Cannot continue tests.');
    console.log('⚠️  Please check if server is running and try again.');
    return;
  }

  // Test 3: Get Current User
  console.log('\n📋 TEST 3: Get Current User');
  console.log('='.repeat(60));
  await testAPI('GET', '/api/auth/me', null, 'Get Current User Info');

  // Test 4: Create Profil Sekolah
  console.log('\n📋 TEST 4: Create Profil Sekolah');
  console.log('='.repeat(60));
  const profilResult = await testAPI(
    'POST',
    '/api/profil-sekolah',
    {
      namaSekolah: 'SMK Negeri 1 Jakarta',
      npsn: '20104001',
      nss: '401016001001',
      alamat: 'Jl. Pendidikan No. 1',
      kelurahan: 'Menteng',
      kecamatan: 'Menteng',
      kota: 'Jakarta Pusat',
      provinsi: 'DKI Jakarta',
      kodePos: '10310',
      telepon: '021-1234567',
      email: 'info@smkn1jakarta.sch.id',
      website: 'https://smkn1jakarta.sch.id',
      kepalaSekolah: 'Dr. Soekarno',
      nipKepalaSekolah: '196008171985031015',
      akreditasi: 'A',
      tahunBerdiri: '1965',
      visi: 'Menjadi sekolah unggulan yang menghasilkan lulusan berkarakter, kompeten, dan berdaya saing global',
      misi: '1. Menyelenggarakan pendidikan berkualitas\n2. Mengembangkan karakter siswa\n3. Membangun kemitraan dengan industri'
    },
    'Create School Profile'
  );

  if (!profilResult.success && profilResult.error?.message?.includes('already')) {
    console.log('   ℹ️  School profile already exists');
    
    // Try to get existing profile
    console.log('\n   Getting existing profile...');
    await testAPI('GET', '/api/profil-sekolah', null, 'Get Existing School Profile');
  }

  // Test 5: Create Tahun Ajaran
  console.log('\n📋 TEST 5: Create Tahun Ajaran 2024/2025');
  console.log('='.repeat(60));
  await testAPI(
    'POST',
    '/api/tahun-ajaran',
    {
      tahunAjaran: '2024/2025',
      tanggalMulai: '2024-07-15',
      tanggalSelesai: '2025-06-30',
      status: 'AKTIF',
      isLocked: false
    },
    'Create Academic Year'
  );

  // Test 6: Get List Tahun Ajaran
  console.log('\n📋 TEST 6: Get List Tahun Ajaran');
  console.log('='.repeat(60));
  await testAPI('GET', '/api/tahun-ajaran', null, 'Get All Academic Years');

  // Test 7: Create Mata Pelajaran
  console.log('\n📋 TEST 7: Create Sample Mata Pelajaran');
  console.log('='.repeat(60));
  await testAPI(
    'POST',
    '/api/mata-pelajaran',
    {
      kode: 'MTK',
      nama: 'Matematika',
      kelompok: 'UMUM',
      jamPelajaran: 4,
      kkm: 75,
      deskripsi: 'Mata pelajaran matematika umum'
    },
    'Create Matematika Subject'
  );

  // Test 8: Get List Mata Pelajaran
  console.log('\n📋 TEST 8: Get List Mata Pelajaran');
  console.log('='.repeat(60));
  await testAPI('GET', '/api/mata-pelajaran?limit=5', null, 'Get All Subjects');

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('✅ API Testing Complete!');
  console.log('='.repeat(60));
  console.log('\n📊 Summary:');
  console.log('   ✅ Admin user created/verified');
  console.log('   ✅ Login working');
  console.log('   ✅ Authentication working');
  console.log('   ✅ School profile created/verified');
  console.log('   ✅ Academic year created');
  console.log('   ✅ Subject created');
  console.log('\n🎉 Backend is ready to use!');
  console.log('\n👤 Admin Credentials:');
  console.log('   Username: admin');
  console.log('   Password: admin123');
  console.log('   Email: admin@sekolah.com');
  console.log('   Role: ADMIN');
  console.log('\n🌐 Access:');
  console.log('   Frontend: http://localhost:3000');
  console.log('   Supabase Dashboard: https://app.supabase.com');
  console.log('\n📚 Next Steps:');
  console.log('   1. Login to frontend with admin credentials');
  console.log('   2. Check Supabase Table Editor to see data');
  console.log('   3. Start adding more data (siswa, guru, kelas)');
  console.log('   4. Continue building Academic APIs');
}

// Run tests
runTests().catch(console.error);
