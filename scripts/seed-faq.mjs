import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// 1. Load environment variables from .env.local
const envPath = path.join(rootDir, ".env.local");
const envVars = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...values] = trimmed.split("=");
    if (key && values.length) {
      envVars[key.trim()] = values.join("=").trim().replace(/^["']|["']$/g, "");
    }
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || envVars.NEXT_PUBLIC_SANITY_PROJECT_ID || "ievimlhm";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || envVars.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN || envVars.SANITY_API_TOKEN;

// 2. Structured FAQ Data
export const faqDocument = {
  _id: "faq",
  _type: "faq",
  title: "Frequently Asked Questions",
  categories: [
    {
      _key: "cat-layanan",
      key: "layanan",
      title: "Informasi Layanan",
      items: [
        {
          _key: "faq-1",
          question: "Apa saja layanan yang tersedia di RV Project?",
          answer:
            "RV Project menyediakan layanan fotografi, videografi, dokumentasi acara, dan pembuatan yearbook untuk sekolah maupun kebutuhan lainnya.",
        },
        {
          _key: "faq-2",
          question: "Apakah RV Project melayani acara sekolah selain pembuatan yearbook?",
          answer:
            "Ya, kami melayani dokumentasi berbagai acara sekolah, seperti wisuda, perpisahan, pentas seni, acara kelulusan, dan kegiatan lainnya.",
        },
        {
          _key: "faq-3",
          question: "Apakah bisa memesan jasa fotografi atau videografi saja?",
          answer:
            "Bisa. Anda dapat memesan layanan fotografi, videografi, atau keduanya sesuai kebutuhan acara.",
        },
      ],
    },
    {
      _key: "cat-pemesanan",
      key: "pemesanan",
      title: "Pemesanan dan Harga",
      items: [
        {
          _key: "faq-4",
          question: "Bagaimana cara memesan layanan RV Project?",
          answer:
            "Anda dapat menghubungi tim RV Project melalui kontak yang tersedia di website atau media sosial kami untuk mendiskusikan kebutuhan dan jadwal pemesanan.",
        },
        {
          _key: "faq-5",
          question: "Berapa harga jasa RV Project?",
          answer:
            "Harga menyesuaikan jenis layanan, jumlah peserta, durasi acara, dan kebutuhan produksi. Hubungi tim kami untuk mendapatkan penawaran harga.",
        },
        {
          _key: "faq-6",
          question: "Apakah RV Project melayani pemesanan yearbook untuk satu angkatan?",
          answer:
            "Ya, kami melayani pembuatan yearbook untuk satu angkatan maupun kelompok kelas dengan konsep yang disesuaikan dengan kebutuhan sekolah.",
        },
        {
          _key: "faq-7",
          question: "Kapan sebaiknya melakukan pemesanan?",
          answer:
            "Sebaiknya lakukan pemesanan lebih awal agar proses perencanaan, penjadwalan, pemotretan, dan produksi dapat berjalan dengan baik.",
        },
      ],
    },
    {
      _key: "cat-produksi",
      key: "produksi",
      title: "Proses Produksi",
      items: [
        {
          _key: "faq-8",
          question: "Apakah konsep yearbook bisa disesuaikan dengan keinginan sekolah?",
          answer:
            "Ya, konsep desain, tema, gaya fotografi, dan isi yearbook dapat didiskusikan bersama tim kami sebelum proses produksi dimulai.",
        },
        {
          _key: "faq-9",
          question: "Berapa lama proses pembuatan yearbook?",
          answer:
            "Durasi produksi bergantung pada jumlah siswa, kompleksitas desain, jumlah halaman, dan proses revisi. Estimasi waktu akan disampaikan setelah kebutuhan proyek disepakati.",
        },
        {
          _key: "faq-10",
          question: "Apakah pelanggan bisa meminta revisi desain atau video?",
          answer:
            "Ya, revisi dapat dilakukan sesuai ketentuan dan kesepakatan layanan pada awal pemesanan.",
        },
        {
          _key: "faq-11",
          question: "Apakah hasil foto dan video diberikan dalam format digital?",
          answer:
            "Format hasil akhir menyesuaikan paket layanan yang dipilih. Detail mengenai file digital, video, cetakan foto, atau yearbook fisik dapat dikonfirmasi saat konsultasi.",
        },
      ],
    },
    {
      _key: "cat-hasil",
      key: "hasil",
      title: "Hasil dan Dokumentasi",
      items: [
        {
          _key: "faq-12",
          question: "Apakah RV Project menyediakan yearbook dalam bentuk cetak?",
          answer:
            "Kami dapat mendiskusikan kebutuhan yearbook cetak maupun format digital sesuai layanan dan paket yang tersedia.",
        },
        {
          _key: "faq-13",
          question: "Apakah pelanggan bisa melihat portofolio hasil pekerjaan sebelumnya?",
          answer:
            "Ya, Anda dapat melihat pilihan hasil fotografi, videografi, dan yearbook kami melalui halaman galeri atau portofolio RV Project.",
        },
        {
          _key: "faq-14",
          question: "Bagaimana jika ingin mendiskusikan konsep khusus untuk sekolah?",
          answer:
            "Anda dapat menghubungi tim kami dan menyampaikan referensi, tema, serta kebutuhan sekolah. Tim kami akan membantu mendiskusikan konsep yang sesuai.",
        },
      ],
    },
  ],
};

async function seedFaq() {
  console.log("🚀 Menyiapkan Seeder FAQ Sanity...");
  console.log(`📦 Project ID: ${projectId}`);
  console.log(`📂 Dataset: ${dataset}`);

  // 1. Simpan file NDJSON khusus FAQ
  const ndjsonPath = path.join(rootDir, "sanity-faq-seed.ndjson");
  fs.writeFileSync(ndjsonPath, JSON.stringify(faqDocument) + "\n", "utf-8");
  console.log(`✅ File NDJSON berhasil dibuat: ${ndjsonPath}`);

  // 2. Jika token API ditemukan, kirim langsung via Sanity Mutate API
  if (token) {
    console.log("🔑 SANITY_API_TOKEN ditemukan. Mengirim mutasi langsung ke Sanity...");
    try {
      const response = await fetch(
        `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mutations: [
              {
                createOrReplace: faqDocument,
              },
            ],
          }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(`Sanity API Error: ${JSON.stringify(result)}`);
      }

      console.log("🎉 Berhasil! Data FAQ di Sanity telah diperbarui secara langsung.");
      console.log(result);
      return;
    } catch (err) {
      console.error("❌ Gagal mengunggah via API Token:", err.message);
    }
  } else {
    console.log("\nℹ️  SANITY_API_TOKEN belum diset di .env.local.");
    console.log("📌 Anda dapat mengimpor data ini ke Sanity dengan salah satu cara berikut:");
    console.log(`   1. Jalankan perintah Sanity CLI:`);
    console.log(`      npx sanity dataset import sanity-faq-seed.ndjson ${dataset} --replace\n`);
    console.log(`   2. Atau tambahkan SANITY_API_TOKEN di .env.local lalu jalankan script ini kembali:`);
    console.log(`      node scripts/seed-faq.mjs\n`);
  }
}

seedFaq();
