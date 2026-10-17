import type { FAQItemData } from "@/components/ui/faq-tabs";

export const FAQ_CATEGORIES: Record<string, string> = {
  layanan: "Informasi Layanan",
  pemesanan: "Pemesanan dan Harga",
  produksi: "Proses Produksi",
  hasil: "Hasil dan Dokumentasi",
};

export const FAQ_DATA: Record<string, FAQItemData[]> = {
  layanan: [
    {
      question: "Apa saja layanan yang tersedia di RV Project?",
      answer:
        "RV Project menyediakan layanan fotografi, videografi, dokumentasi acara, dan pembuatan yearbook untuk sekolah maupun kebutuhan lainnya.",
    },
    {
      question: "Apakah RV Project melayani acara sekolah selain pembuatan yearbook?",
      answer:
        "Ya, kami melayani dokumentasi berbagai acara sekolah, seperti wisuda, perpisahan, pentas seni, acara kelulusan, dan kegiatan lainnya.",
    },
    {
      question: "Apakah bisa memesan jasa fotografi atau videografi saja?",
      answer:
        "Bisa. Anda dapat memesan layanan fotografi, videografi, atau keduanya sesuai kebutuhan acara.",
    },
  ],
  pemesanan: [
    {
      question: "Bagaimana cara memesan layanan RV Project?",
      answer:
        "Anda dapat menghubungi tim RV Project melalui kontak yang tersedia di website atau media sosial kami untuk mendiskusikan kebutuhan dan jadwal pemesanan.",
    },
    {
      question: "Berapa harga jasa RV Project?",
      answer:
        "Harga menyesuaikan jenis layanan, jumlah peserta, durasi acara, dan kebutuhan produksi. Hubungi tim kami untuk mendapatkan penawaran harga.",
    },
    {
      question: "Apakah RV Project melayani pemesanan yearbook untuk satu angkatan?",
      answer:
        "Ya, kami melayani pembuatan yearbook untuk satu angkatan maupun kelompok kelas dengan konsep yang disesuaikan dengan kebutuhan sekolah.",
    },
    {
      question: "Kapan sebaiknya melakukan pemesanan?",
      answer:
        "Sebaiknya lakukan pemesanan lebih awal agar proses perencanaan, penjadwalan, pemotretan, dan produksi dapat berjalan dengan baik.",
    },
  ],
  produksi: [
    {
      question: "Apakah konsep yearbook bisa disesuaikan dengan keinginan sekolah?",
      answer:
        "Ya, konsep desain, tema, gaya fotografi, dan isi yearbook dapat didiskusikan bersama tim kami sebelum proses produksi dimulai.",
    },
    {
      question: "Berapa lama proses pembuatan yearbook?",
      answer:
        "Durasi produksi bergantung pada jumlah siswa, kompleksitas desain, jumlah halaman, dan proses revisi. Estimasi waktu akan disampaikan setelah kebutuhan proyek disepakati.",
    },
    {
      question: "Apakah pelanggan bisa meminta revisi desain atau video?",
      answer:
        "Ya, revisi dapat dilakukan sesuai ketentuan dan kesepakatan layanan pada awal pemesanan.",
    },
    {
      question: "Apakah hasil foto dan video diberikan dalam format digital?",
      answer:
        "Format hasil akhir menyesuaikan paket layanan yang dipilih. Detail mengenai file digital, video, cetakan foto, atau yearbook fisik dapat dikonfirmasi saat konsultasi.",
    },
  ],
  hasil: [
    {
      question: "Apakah RV Project menyediakan yearbook dalam bentuk cetak?",
      answer:
        "Kami dapat mendiskusikan kebutuhan yearbook cetak maupun format digital sesuai layanan dan paket yang tersedia.",
    },
    {
      question: "Apakah pelanggan bisa melihat portofolio hasil pekerjaan sebelumnya?",
      answer:
        "Ya, Anda dapat melihat pilihan hasil fotografi, videografi, dan yearbook kami melalui halaman galeri atau portofolio RV Project.",
    },
    {
      question: "Bagaimana jika ingin mendiskusikan konsep khusus untuk sekolah?",
      answer:
        "Anda dapat menghubungi tim kami dan menyampaikan referensi, tema, serta kebutuhan sekolah. Tim kami akan membantu mendiskusikan konsep yang sesuai.",
    },
  ],
};
