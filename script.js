const daftarProduk = document.getElementById("daftar-produk");
const statusProduk = document.getElementById("status-produk");

const formPemesanan = document.getElementById("form-pemesanan");
const inputNama = document.getElementById("nama");
const inputBuah = document.getElementById("buah");
const inputJumlah = document.getElementById("jumlah");
const inputAlamat = document.getElementById("alamat");
const pesanForm = document.getElementById("pesan-form");

// Daftar foto buah-buahan
const fotoBuah = [
    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400",
    "https://images.unsplash.com/photo-1547514701-42782101795e?w=400",
    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400",
    "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400",
    "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400"
];

// 1. FETCH API: Mengambil data produk
async function ambilProduk() {
    statusProduk.textContent = "Memuat data produk...";
    daftarProduk.replaceChildren();

    try {
        const response = await fetch("https://dummyjson.com/products");

        if (!response.ok) {
            throw new Error("Gagal mengambil data produk.");
        }

        const data = await response.json();

        tampilkanProduk(data.products);

        statusProduk.textContent =
            `Berhasil memuat ${data.products.length} produk.`;

    } catch (error) {
        statusProduk.textContent =
            "Produk gagal dimuat. Periksa koneksi internet Anda.";

        console.error("Kesalahan Fetch API:", error);
    }
}

// 2. DOM: Menampilkan kartu produk
function tampilkanProduk(produk) {
    daftarProduk.replaceChildren();

    if (!produk || produk.length === 0) {
        statusProduk.textContent = "Tidak ada produk yang tersedia.";
        return;
    }

    produk.forEach((item, index) => {
        const kartu = document.createElement("article");
        kartu.className = "produk-card";

        // Menampilkan foto buah secara bergantian
        const gambar = document.createElement("img");

        gambar.src = fotoBuah[index % fotoBuah.length];
        gambar.alt = "Foto buah-buahan";
        gambar.loading = "lazy";

        gambar.addEventListener("error", () => {
            gambar.hidden = true;
        });

        // Nama produk dari API
        const nama = document.createElement("h3");
        nama.textContent = item.title;

        // Kategori produk dari API
        const kategori = document.createElement("span");
        kategori.className = "kategori";
        kategori.textContent = item.category;

        // Harga produk dari API
        const harga = document.createElement("p");
        harga.className = "harga";

        harga.textContent = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "USD"
        }).format(item.price);

        // Tombol pesan
        const tombol = document.createElement("button");
        tombol.type = "button";
        tombol.className = "btn-pilih";
        tombol.textContent = "Pesan Buah";

        tombol.addEventListener("click", () => {
            document.getElementById("pesan").scrollIntoView({
                behavior: "smooth"
            });

            inputBuah.focus();
        });

        kartu.append(gambar, nama, kategori, harga, tombol);
        daftarProduk.appendChild(kartu);
    });
}

// 3. EVENT HANDLING: Memproses form pemesanan
formPemesanan.addEventListener("submit", function (event) {
    event.preventDefault();

    const nama = inputNama.value.trim();
    const buah = inputBuah.value;
    const jumlah = Number(inputJumlah.value);
    const alamat = inputAlamat.value.trim();

    // Validasi nama
    if (nama.length < 3) {
        tampilkanPesan(
            "Nama harus terdiri dari minimal 3 karakter.",
            false
        );
        inputNama.focus();
        return;
    }

    // Validasi pilihan buah
    if (!buah) {
        tampilkanPesan(
            "Silakan pilih buah terlebih dahulu.",
            false
        );
        inputBuah.focus();
        return;
    }

    // Validasi jumlah
    if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 100) {
        tampilkanPesan(
            "Jumlah pesanan harus berupa bilangan bulat 1–100 kg.",
            false
        );
        inputJumlah.focus();
        return;
    }

    // Validasi alamat
    if (alamat.length < 10) {
        tampilkanPesan(
            "Alamat harus terdiri dari minimal 10 karakter.",
            false
        );
        inputAlamat.focus();
        return;
    }

    // Menampilkan hasil pesanan
    pesanForm.replaceChildren();

    const hasil = document.createElement("div");
    hasil.className = "pesan-sukses";

    const judul = document.createElement("p");
    judul.textContent = "Pesanan berhasil diproses!";

    const detail = document.createElement("p");
    detail.textContent =
        `Nama: ${nama} | Buah: ${buah} | Jumlah: ${jumlah} kg`;

    const tujuan = document.createElement("p");
    tujuan.textContent = `Alamat pengiriman: ${alamat}`;

    hasil.append(judul, detail, tujuan);
    pesanForm.appendChild(hasil);

    // Mengosongkan form setelah berhasil
    formPemesanan.reset();
});

// 4. Menampilkan pesan validasi
function tampilkanPesan(teks, berhasil) {
    pesanForm.replaceChildren();

    const pesan = document.createElement("p");
    pesan.className = berhasil ? "pesan-sukses" : "pesan-error";
    pesan.textContent = teks;

    pesanForm.appendChild(pesan);
}

// Menjalankan Fetch API saat halaman dibuka
ambilProduk();