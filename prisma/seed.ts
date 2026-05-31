import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma";

async function main() {
  const adminEmail = "admin@temanpilah.com";
  const adminPassword = "password123";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  console.log("Seeding started...");

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Super Admin",
      password: hashedPassword,
    },
  });

  console.log({ admin });

  const educationData = [
    {
      title: "Panduan Memilah Sampah Rumah Tangga",
      slug: "panduan-memilah-sampah-rumah-tangga",
      overview:
        "Pelajari cara mudah memilah sampah rumah tangga berdasarkan jenisnya untuk mendukung daur ulang dan mengurangi limbah.",
      description:
        "Memilah sampah rumah tangga adalah langkah awal yang penting dalam pengelolaan limbah. Dengan memisahkan sampah organik, anorganik, dan limbah B3, kita dapat memudahkan proses daur ulang dan mengurangi beban Tempat Pembuangan Akhir (TPA). Sampah organik seperti sisa makanan dan daun dapat diolah menjadi kompos, sementara sampah anorganik seperti plastik, kertas, dan logam dapat didaur ulang menjadi produk baru. Limbah B3 seperti baterai dan obat-obatan kadaluarsa memerlukan penanganan khusus agar tidak mencemari lingkungan. Mulailah dengan menyediakan tempat sampah terpisah di rumah dan biasakan anggota keluarga untuk membuang sampah sesuai kategorinya.",
      tags: ["sampah", "daur ulang", "rumah tangga", "panduan"],
      status: "PUBLISHED" as const,
      publishDate: new Date("2026-01-15"),
    },
    {
      title: "Cara Mengolah Sampah Organik Menjadi Kompos",
      slug: "cara-mengolah-sampah-organik-menjadi-kompos",
      overview:
        "Ubah sisa sayuran dan daun kering menjadi kompos berkualitas dengan metode sederhana yang bisa dilakukan di rumah.",
      description:
        "Pengomposan adalah proses alami mengubah sampah organik menjadi pupuk kaya nutrisi. Metode yang paling mudah dilakukan di rumah adalah komposter tabung atau lubang biopori. Bahan yang dibutuhkan terdiri dari sampah organik basah (sisa sayur, buah, ampas kopi) dan sampah organik kering (daun kering, serbuk gergaji) dengan perbandingan 1:2. Pastikan kelembaban dijaga dan diaduk setiap 3-7 hari untuk sirkulasi udara. Dalam waktu 4-6 minggu, kompos siap digunakan untuk menyuburkan tanaman di pekarangan rumah. Selain mengurangi sampah yang dibuang ke TPA, kompos juga menghemat pengeluaran untuk pupuk kimia.",
      tags: ["kompos", "organik", "berkebun", "pupuk"],
      status: "PUBLISHED" as const,
      publishDate: new Date("2026-02-20"),
    },
    {
      title: "Kreatif Mendaur Ulang Plastik Bekas",
      slug: "kreatif-mendaur-ulang-plastik-bekas",
      overview:
        "Inspirasi mengubah sampah plastik menjadi barang berguna dan bernilai estetis melalui teknik daur ulang kreatif.",
      description:
        "Sampah plastik menjadi salah satu masalah lingkungan terbesar saat ini. Namun, dengan sedikit kreativitas, botol plastik bekas, kemasan deterjen, dan kantong plastik dapat disulap menjadi barang bernilai guna. Botol plastik bisa menjadi pot tanaman gantung, tempat alat tulis, atau lampu hias. Kemasan deterjen dapat diubah menjadi celengan atau tempat penyimpanan. Teknik ecobrick juga menjadi solusi inovatif dengan memasukkan sampah plastik ke dalam botol untuk dijadikan bahan bangunan alternatif seperti kursi, meja, atau taman vertikal. Kegiatan daur ulang kreatif tidak hanya mengurangi limbah tetapi juga dapat menjadi sumber penghasilan tambahan.",
      tags: ["plastik", "daur ulang", "kreatif", "ecobrick"],
      status: "PUBLISHED" as const,
      publishDate: new Date("2026-03-10"),
    },
    {
      title: "Mengenal Konsep Zero Waste untuk Pemula",
      slug: "mengenal-konsep-zero-waste-untuk-pemula",
      overview:
        "Pengantar gaya hidup tanpa sampah dengan prinsip 5R: Refuse, Reduce, Reuse, Recycle, Rot yang mudah diterapkan sehari-hari.",
      description:
        "Zero waste adalah filosofi yang mendorong kita untuk meminimalkan produksi sampah sebanyak mungkin. Prinsip utamanya dikenal dengan 5R: Refuse (menolak barang sekali pakai), Reduce (mengurangi konsumsi), Reuse (menggunakan kembali), Recycle (mendaur ulang), dan Rot (mengompos). Untuk pemula, mulailah dengan langkah kecil: bawa tas belanja sendiri, gunakan botol minum isi ulang, tolak sedotan plastik, dan beli produk dengan kemasan minimal. Zero waste bukan tentang kesempurnaan, melainkan tentang melakukan yang terbaik sesuai kemampuan. Setiap langkah kecil yang konsisten akan memberikan dampak positif bagi lingkungan.",
      tags: ["zero waste", "gaya hidup", "ramah lingkungan", "pemula"],
      status: "DRAFT" as const,
      publishDate: null,
    },
    {
      title: "Manfaat Bank Sampah bagi Lingkungan dan Ekonomi",
      slug: "manfaat-bank-sampah-bagi-lingkungan-dan-ekonomi",
      overview:
        "Bank sampah bukan hanya solusi lingkungan tetapi juga memberdayakan ekonomi masyarakat melalui tabungan sampah.",
      description:
        "Bank sampah adalah sistem pengelolaan sampah berbasis masyarakat yang menerapkan prinsip 3R (Reduce, Reuse, Recycle). Nasabah menyetorkan sampah yang sudah dipilah ke bank sampah dan mendapat imbalan berupa uang atau tabungan. Sampah anorganik seperti plastik, kertas, kaca, dan logam memiliki nilai ekonomi yang bervariasi. Selain memberikan penghasilan tambahan bagi masyarakat, bank sampah juga mengurangi volume sampah yang berakhir di TPA, menciptakan lingkungan yang lebih bersih, dan membangun kesadaran kolektif akan pentingnya pengelolaan sampah. Saat ini sudah ribuan bank sampah aktif di seluruh Indonesia yang melibatkan ibu rumah tangga, pemuda, dan komunitas.",
      tags: ["bank sampah", "ekonomi", "masyarakat", "3R"],
      status: "PUBLISHED" as const,
      publishDate: new Date("2026-04-05"),
    },
  ];

  console.log("Seeding education content...");

  for (const data of educationData) {
    const education = await prisma.educationContent.upsert({
      where: { slug: data.slug },
      update: {},
      create: { ...data, thumbnail: null },
    });
    console.log(`  Created: ${education.title}`);
  }

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
