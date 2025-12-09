// Script untuk populate data default ke Firebase
// Jalankan di browser console setelah login ke admin

async function populateDefaultData() {
  console.log('🚀 Memulai populate data default ke Firebase...');
  
  try {
    // 1. Populate Testimoni Default
    const defaultTestimonials = [
      {
        name: 'Budi Santoso',
        business: 'Warung Kopi Budi',
        rating: 5,
        text: 'Gerobak aluminium dari Gerobak Jogja sangat berkualitas! Sudah 2 tahun pakai masih seperti baru. Pelayanannya juga ramah dan profesional.',
        image: 'https://ui-avatars.com/api/?name=Budi+Santoso&background=0284c7&color=fff'
      },
      {
        name: 'Siti Rahayu',
        business: 'Bakso Mas Anto',
        rating: 5,
        text: 'Puas banget dengan hasil custom gerobak kayu untuk jualan bakso. Desainnya sesuai keinginan dan kualitas kayunya bagus. Recommended!',
        image: 'https://ui-avatars.com/api/?name=Siti+Rahayu&background=22c55e&color=fff'
      },
      {
        name: 'Ahmad Fauzi',
        business: 'Es Teh Manis Pak Ahmad',
        rating: 5,
        text: 'Gerobak stainless steel-nya awet dan mudah dibersihkan. Cocok banget buat jualan minuman. Harga juga masuk akal untuk kualitas sebagus ini.',
        image: 'https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=f59e0b&color=fff'
      },
      {
        name: 'Dewi Lestari',
        business: 'Martabak Manis Dewi',
        rating: 5,
        text: 'Terima kasih Gerobak Jogja! Gerobak kombinasi aluminium dan kayu-nya unik dan menarik perhatian pembeli. Omset naik sejak pakai gerobak ini!',
        image: 'https://ui-avatars.com/api/?name=Dewi+Lestari&background=ef4444&color=fff'
      },
      {
        name: 'Eko Prasetyo',
        business: 'Nasi Goreng Pak Eko',
        rating: 5,
        text: 'Pengerjaan cepat dan rapi. Gerobak aluminium premium yang saya pesan selesai tepat waktu. Kualitas pengerjaan sangat memuaskan!',
        image: 'https://ui-avatars.com/api/?name=Eko+Prasetyo&background=8b5cf6&color=fff'
      },
      {
        name: 'Rina Wijaya',
        business: 'Sate Ayam Bu Rina',
        rating: 5,
        text: 'Pelayanan ramah, harga terjangkau, kualitas oke. Gerobak kayu klasik yang saya beli cocok banget buat jualan sate. Terima kasih!',
        image: 'https://ui-avatars.com/api/?name=Rina+Wijaya&background=ec4899&color=fff'
      }
    ];

    console.log(`💬 Menambahkan ${defaultTestimonials.length} testimoni...`);
    for (const testimonial of defaultTestimonials) {
      try {
        await window.addTestimonialToFirebase(testimonial);
        console.log(`✅ Testimoni dari "${testimonial.name}" berhasil ditambahkan`);
      } catch (error) {
        console.error(`❌ Gagal menambahkan testimoni "${testimonial.name}":`, error);
      }
    }

    // 2. Populate Blog Posts Default
    const defaultBlogPosts = [
      {
        title: 'Tips Memilih Gerobak yang Tepat untuk Bisnis Anda',
        slug: 'tips-memilih-gerobak-yang-tepat',
        excerpt: 'Panduan lengkap memilih gerobak sesuai jenis usaha dan kebutuhan Anda',
        content: `
# Tips Memilih Gerobak yang Tepat untuk Bisnis Anda

Memilih gerobak yang tepat adalah investasi penting untuk kesuksesan bisnis kuliner Anda. Berikut panduan lengkapnya:

## 1. Sesuaikan dengan Jenis Usaha

- **Minuman**: Pilih gerobak dengan space untuk dispenser dan penyimpanan gelas
- **Makanan Berat**: Butuh kompor dan area memasak yang luas
- **Snack/Jajanan**: Gerobak display dengan etalase kaca

## 2. Pertimbangkan Material

### Aluminium
- Ringan dan mudah dipindahkan
- Anti karat
- Cocok untuk area outdoor

### Kayu
- Tampilan klasik dan hangat
- Cocok untuk konsep vintage
- Butuh perawatan rutin

### Stainless Steel
- Sangat higienis
- Mudah dibersihkan
- Tahan lama

## 3. Ukuran dan Mobilitas

Pertimbangkan:
- Lokasi jualan (indoor/outdoor)
- Frekuensi perpindahan
- Luas area jualan
- Akses jalan

## 4. Budget

Sesuaikan dengan budget Anda:
- Entry level: Rp 2-3 juta
- Mid range: Rp 3-5 juta
- Premium: Rp 5-8 juta

## Kesimpulan

Gerobak yang tepat akan meningkatkan efisiensi dan daya tarik bisnis Anda. Konsultasikan kebutuhan Anda dengan kami untuk mendapatkan solusi terbaik!
        `,
        category: 'Tips & Trik',
        author: 'Admin Gerobak Jogja',
        publishedAt: new Date().toISOString(),
        featured: true,
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80'
      },
      {
        title: 'Perawatan Gerobak Agar Awet dan Tahan Lama',
        slug: 'perawatan-gerobak-agar-awet',
        excerpt: 'Cara merawat gerobak aluminium, kayu, dan stainless steel agar tetap awet',
        content: `
# Perawatan Gerobak Agar Awet dan Tahan Lama

Investasi gerobak Anda akan bertahan lebih lama dengan perawatan yang tepat. Berikut panduannya:

## Perawatan Gerobak Aluminium

### Pembersihan Rutin
- Lap dengan kain lembut setiap hari
- Gunakan sabun ringan untuk noda membandel
- Keringkan dengan lap kering

### Pencegahan Karat
- Hindari kontak dengan bahan kimia keras
- Simpan di tempat kering saat tidak digunakan
- Aplikasikan pelindung aluminium 6 bulan sekali

## Perawatan Gerobak Kayu

### Pembersihan
- Bersihkan dengan lap lembab
- Hindari air berlebihan
- Keringkan segera jika terkena air

### Finishing
- Cat ulang setiap 6-12 bulan
- Gunakan vernis untuk perlindungan ekstra
- Perbaiki goresan segera

## Perawatan Gerobak Stainless Steel

### Pembersihan
- Lap dengan microfiber setiap hari
- Gunakan pembersih khusus stainless steel
- Hindari spons kasar yang bisa menggores

### Perawatan Khusus
- Poles dengan minyak mineral untuk kilau
- Bersihkan noda air segera
- Hindari pemutih atau klorin

## Tips Umum

1. **Cek Roda**: Beri pelumas setiap bulan
2. **Periksa Sambungan**: Kencangkan baut yang longgar
3. **Simpan dengan Benar**: Tutup dengan terpal saat tidak digunakan
4. **Service Berkala**: Cek kondisi setiap 6 bulan

Dengan perawatan yang tepat, gerobak Anda bisa awet hingga 10 tahun lebih!
        `,
        category: 'Perawatan',
        author: 'Admin Gerobak Jogja',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        featured: false,
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80'
      },
      {
        title: 'Inspirasi Desain Gerobak untuk Berbagai Jenis Usaha',
        slug: 'inspirasi-desain-gerobak',
        excerpt: 'Kumpulan ide desain gerobak kreatif untuk berbagai jenis usaha kuliner',
        content: `
# Inspirasi Desain Gerobak untuk Berbagai Jenis Usaha

Desain gerobak yang menarik bisa meningkatkan daya tarik bisnis Anda. Berikut inspirasinya:

## 1. Gerobak Kopi Modern

**Konsep**: Minimalis dengan sentuhan industrial

**Material**: Kombinasi aluminium hitam dan kayu
**Fitur**:
- Display untuk alat kopi
- Rak untuk cup dan topping
- Area untuk mesin espresso
- Lighting LED

## 2. Gerobak Bakso Klasik

**Konsep**: Tradisional Indonesia

**Material**: Kayu jati dengan finishing natural
**Fitur**:
- Kompor gas built-in
- Tempat mangkok dan sendok
- Display untuk bumbu
- Payung besar

## 3. Gerobak Es Teh Colorful

**Konsep**: Ceria dan eye-catching

**Material**: Aluminium dengan cat warna cerah
**Fitur**:
- Dispenser besar
- Display buah
- Cooler box
- Branding besar

## 4. Gerobak Martabak Premium

**Konsep**: Modern dan bersih

**Material**: Stainless steel full
**Fitur**:
- Griddle besar
- Display topping
- Kaca display
- Exhaust fan

## 5. Gerobak Sate Portable

**Konsep**: Compact dan mobile

**Material**: Aluminium ringan
**Fitur**:
- Tungku arang
- Rak tusuk sate
- Tempat bumbu
- Roda besar

## Tips Desain

1. **Branding Jelas**: Logo dan nama usaha mencolok
2. **Pencahayaan**: LED untuk malam hari
3. **Warna**: Sesuaikan dengan brand identity
4. **Fungsional**: Prioritaskan kemudahan operasional
5. **Unik**: Tambahkan ciri khas yang memorable

Konsultasikan ide desain Anda dengan kami untuk realisasi terbaik!
        `,
        category: 'Inspirasi',
        author: 'Admin Gerobak Jogja',
        publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        featured: true,
        image: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800&q=80'
      }
    ];

    console.log(`📝 Menambahkan ${defaultBlogPosts.length} blog posts...`);
    for (const post of defaultBlogPosts) {
      try {
        await window.addBlogPostToFirebase(post);
        console.log(`✅ Blog post "${post.title}" berhasil ditambahkan`);
      } catch (error) {
        console.error(`❌ Gagal menambahkan blog post "${post.title}":`, error);
      }
    }

    // 3. Populate FAQs Default
    const defaultFAQs = [
      {
        question: 'Berapa lama waktu pembuatan gerobak?',
        answer: 'Waktu pembuatan gerobak berkisar 7-14 hari kerja tergantung tingkat kesulitan dan antrian pesanan. Untuk custom design yang kompleks bisa memakan waktu hingga 21 hari.',
        order: 1
      },
      {
        question: 'Apakah bisa custom design sesuai keinginan?',
        answer: 'Tentu saja! Kami menerima custom design sesuai kebutuhan Anda. Tim kami akan membantu mewujudkan konsep gerobak impian Anda dengan tetap mempertimbangkan aspek fungsional dan budget.',
        order: 2
      },
      {
        question: 'Apakah ada garansi untuk produk?',
        answer: 'Ya, kami memberikan garansi 6 bulan untuk kualitas material dan pengerjaan. Garansi mencakup kerusakan struktur, sambungan las, dan cat/finishing (tidak termasuk kerusakan akibat pemakaian tidak wajar).',
        order: 3
      },
      {
        question: 'Bagaimana cara pemesanan?',
        answer: 'Anda bisa menghubungi kami via WhatsApp di 082327220077 atau datang langsung ke workshop kami di Yogyakarta. Tim kami akan membantu konsultasi dan proses pemesanan.',
        order: 4
      },
      {
        question: 'Apakah melayani pengiriman ke luar kota?',
        answer: 'Ya, kami melayani pengiriman ke seluruh Indonesia menggunakan jasa ekspedisi terpercaya. Biaya pengiriman disesuaikan dengan jarak dan ukuran gerobak.',
        order: 5
      },
      {
        question: 'Apa saja metode pembayaran yang tersedia?',
        answer: 'Kami menerima pembayaran via transfer bank (BCA, Mandiri, BRI), e-wallet (GoPay, OVO, Dana), dan cash. Sistem pembayaran: DP 50% saat order, pelunasan sebelum pengiriman.',
        order: 6
      },
      {
        question: 'Apakah bisa lihat contoh gerobak secara langsung?',
        answer: 'Tentu! Anda bisa datang ke workshop kami di Yogyakarta untuk melihat contoh gerobak dan berkonsultasi langsung dengan tim kami. Silakan hubungi kami terlebih dahulu untuk membuat janji.',
        order: 7
      },
      {
        question: 'Bagaimana perawatan gerobak agar awet?',
        answer: 'Untuk gerobak aluminium: bersihkan secara rutin dan hindari benturan keras. Untuk gerobak kayu: aplikasikan cat/vernis ulang setiap 6-12 bulan. Untuk stainless steel: lap dengan kain lembut dan hindari bahan kimia keras. Beri pelumas pada roda setiap bulan.',
        order: 8
      }
    ];

    console.log(`❓ Menambahkan ${defaultFAQs.length} FAQs...`);
    for (const faq of defaultFAQs) {
      try {
        await window.addFAQToFirebase(faq);
        console.log(`✅ FAQ "${faq.question}" berhasil ditambahkan`);
      } catch (error) {
        console.error(`❌ Gagal menambahkan FAQ "${faq.question}":`, error);
      }
    }

    console.log('');
    console.log('✨ POPULATE DATA SELESAI! ✨');
    console.log('');
    console.log('📊 Ringkasan:');
    console.log(`   - Testimoni: ${defaultTestimonials.length} item`);
    console.log(`   - Blog Posts: ${defaultBlogPosts.length} item`);
    console.log(`   - FAQs: ${defaultFAQs.length} item`);
    console.log('');
    console.log('🔄 Refresh halaman untuk melihat data baru!');

  } catch (error) {
    console.error('❌ Error saat populate data:', error);
  }
}

// Export ke window
window.populateDefaultData = populateDefaultData;

console.log('');
console.log('📋 CARA MENGGUNAKAN:');
console.log('');
console.log('Jalankan: populateDefaultData()');
console.log('');
