import { BookStatus, MemberStatus, PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
    try {
        const membersToAdd = [
            {
                id: uuidv4(),
                code: 'M001',
                name: 'Angga',
                status: MemberStatus.ACTIVE,
            },
            {
                id: uuidv4(),
                code: 'M002',
                name: 'Ferry',
                status: MemberStatus.ACTIVE,
            },
            {
                id: uuidv4(),
                code: 'M003',
                name: 'Putri',
                status: MemberStatus.ACTIVE,
            },
        ];

        const createdMembers = await Promise.all(
            membersToAdd.map((member) => prisma.member.create({ data: member }))
        );

        const booksToAdd = [
            {
                id: uuidv4(),
                code: 'JK-45',
                title: 'Harry Potter',
                author: 'J.K. Rowling',
                stock: 1,
                status: BookStatus.AVAILABLE
            },
            {
                id: uuidv4(),
                code: 'SHR-1',
                title: 'A Study in Scarlet',
                author: 'Arthur Conan Doyle',
                stock: 1,
                status: BookStatus.AVAILABLE
            },
            {
                id: uuidv4(),
                code: 'TW-11',
                title: 'Twilight',
                author: 'Stephenie Meyer',
                stock: 1,
                status: BookStatus.AVAILABLE
            },
            {
                id: uuidv4(),
                code: 'HOB-83',
                title: 'The Hobbit, or There and Back Again',
                author: 'J.R.R. Tolkien',
                stock: 1,
                status: BookStatus.AVAILABLE
            },
            {
                id: uuidv4(),
                code: 'NRN-7',
                title: 'The Lion, the Witch and the Wardrobe',
                author: 'C.S. Lewis',
                stock: 1,
                status: BookStatus.AVAILABLE
            },
        ]

        const createdBooks = await Promise.all(
            booksToAdd.map((book) => prisma.book.create({ data: book }))
        );

        console.log('Data buku berhasil ditambahkan:', createdMembers, createdBooks);
    } catch (error) {
        console.error('Gagal menambahkan data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main()
    .catch((error) => {
        console.error('Terjadi kesalahan pada seeder:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });