/**
 * Manuel Database Migration ve Seed Kurulum Script'i
 * Gerçek Docker Şifresi ile Güncellendi
 */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// docker-compose.yml dosyasındaki gerçek şifre ve veri tabanı adı
const connectionString = 'postgresql://postgres:password123@localhost:5432/pet_sitter_db';
const client = new Client({ connectionString });

async function runSetup() {
  try {
    // Doğrudan gerçek şifreyle bağlanıyoruz
    await client.connect();
    console.log('🔄 PostgreSQL Veri Tabanına Başarıyla Bağlanıldı...');

    // Çalıştırılacak SQL dosyalarının tam yolları
    const sqlFiles = [
      path.join(__dirname, 'database', 'migrations', '001_create_users.sql'),
      path.join(__dirname, 'database', 'migrations', '002_create_sitter_profiles.sql'),
      path.join(__dirname, 'database', 'migrations', '003_create_conversations.sql'),
      path.join(__dirname, 'database', 'migrations', '004_create_messages.sql'),
      path.join(__dirname, 'database', 'migrations', '005_create_bookings.sql'),
      path.join(__dirname, 'database', 'seeds', 'seed_data.sql')
    ];

    // Dosyaları sırayla oku ve DB'ye bas
    for (const filePath of sqlFiles) {
      if (fs.existsSync(filePath)) {
        console.log(`🚀 Çalıştırılıyor: ${path.basename(filePath)}...`);
        const sqlContent = fs.readFileSync(filePath, 'utf8');
        await client.query(sqlContent);
        console.log(`✅ Tamamlandı: ${path.basename(filePath)}`);
      } else {
        console.log(`❌ Dosya Bulunamadı, Atlanıyor: ${filePath}`);
      }
    }

    console.log('\n🎉 TÜM TABLOLAR VE HAZIR VERİLER (SEED) BAŞARIYLA YÜKLENDİ! PROJE HAZIR.');

  } catch (error) {
    console.error('💥 Kurulum sırasında hata oluştu:', error);
  } finally {
    await client.end();
  }
}

runSetup();