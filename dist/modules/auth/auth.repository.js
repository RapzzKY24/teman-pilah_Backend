"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
class AuthRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Mencari user berdasarkan email.
     * Digunakan saat proses login untuk memverifikasi kredensial.
     *
     * @param email - Alamat email user
     * @returns User yang ditemukan atau null
     */
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    /**
     * Mencari user berdasarkan ID.
     * Digunakan untuk mengambil profil user yang sedang login.
     *
     * @param id - ID user (cuid)
     * @returns User yang ditemukan atau null
     */
    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }
    /**
     * Mengecek apakah email sudah digunakan oleh user lain.
     * Digunakan saat update profil untuk mencegah email duplikat.
     *
     * @param email - Email yang ingin dicek
     * @param excludeId - ID user yang dikecualikan dari pengecekan (user itu sendiri)
     * @returns User yang memiliki email tersebut atau null
     */
    async findByEmailExcludeId(email, excludeId) {
        return this.prisma.user.findFirst({
            where: {
                email,
                NOT: { id: excludeId },
            },
        });
    }
    /**
     * Mengupdate profil user (nama dan/atau email).
     * Hanya field yang dikirim yang akan diupdate.
     *
     * @param id - ID user yang akan diupdate
     * @param data - Field profil yang ingin diupdate (semua opsional)
     * @returns User yang telah diupdate
     */
    async updateProfile(id, data) {
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.email !== undefined)
            updateData.email = data.email;
        return this.prisma.user.update({
            where: { id },
            data: updateData,
        });
    }
    /**
     * Mengupdate password user dengan hash yang sudah di-generate.
     * Hash dilakukan di service layer sebelum method ini dipanggil.
     *
     * @param id - ID user yang akan diupdate passwordnya
     * @param hashedPassword - Password yang sudah di-hash dengan bcrypt
     * @returns User yang telah diupdate
     */
    async updatePassword(id, hashedPassword) {
        return this.prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
        });
    }
}
exports.AuthRepository = AuthRepository;
