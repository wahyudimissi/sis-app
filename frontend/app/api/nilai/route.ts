import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Validation schema
const nilaiSchema = z.object({
  tahunAjaranId: z.string().uuid(),
  siswaId: z.string().uuid(),
  mataPelajaranId: z.string().uuid(),
  semester: z.enum(['GANJIL', 'GENAP']),
  nilaiTugas: z.number().min(0).max(100).optional().nullable(),
  nilaiUTS: z.number().min(0).max(100).optional().nullable(),
  nilaiUAS: z.number().min(0).max(100).optional().nullable(),
  nilaiAkhir: z.number().min(0).max(100).optional().nullable(),
  predikat: z.string().optional().nullable(),
  deskripsi: z.string().optional().nullable(),
});

const batchNilaiSchema = z.object({
  tahunAjaranId: z.string().uuid(),
  mataPelajaranId: z.string().uuid(),
  semester: z.enum(['GANJIL', 'GENAP']),
  nilaiList: z.array(
    z.object({
      siswaId: z.string().uuid(),
      nilaiTugas: z.number().min(0).max(100).optional().nullable(),
      nilaiUTS: z.number().min(0).max(100).optional().nullable(),
      nilaiUAS: z.number().min(0).max(100).optional().nullable(),
      nilaiAkhir: z.number().min(0).max(100).optional().nullable(),
      predikat: z.string().optional().nullable(),
      deskripsi: z.string().optional().nullable(),
    })
  ),
});

// Helper function to calculate nilai akhir
function hitungNilaiAkhir(
  nilaiTugas: number | null | undefined,
  nilaiUTS: number | null | undefined,
  nilaiUAS: number | null | undefined,
  bobotTugas = 30,
  bobotUTS = 30,
  bobotUAS = 40
): number | null {
  if (
    nilaiTugas === null || nilaiTugas === undefined ||
    nilaiUTS === null || nilaiUTS === undefined ||
    nilaiUAS === null || nilaiUAS === undefined
  ) {
    return null;
  }

  const hasil =
    (nilaiTugas * bobotTugas) / 100 +
    (nilaiUTS * bobotUTS) / 100 +
    (nilaiUAS * bobotUAS) / 100;

  return Math.round(hasil);
}

// Helper function to get predikat
function getPredikat(nilaiAkhir: number | null): string | null {
  if (nilaiAkhir === null) return null;
  if (nilaiAkhir >= 90) return 'A';
  if (nilaiAkhir >= 80) return 'B';
  if (nilaiAkhir >= 70) return 'C';
  if (nilaiAkhir >= 60) return 'D';
  return 'E';
}

// POST: Create nilai (single or batch)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only ADMIN, GURU can create nilai
    if (!['ADMIN', 'GURU', 'SUPERADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Check if batch or single
    if (body.nilaiList && Array.isArray(body.nilaiList)) {
      // Batch create
      const validation = batchNilaiSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            message: 'Validation failed',
            errors: validation.error.issues,
          },
          { status: 400 }
        );
      }

      const { tahunAjaranId, mataPelajaranId, semester, nilaiList } = validation.data;

      // Get KKM from mata pelajaran
      const mapel = await prisma.mataPelajaran.findUnique({
        where: { id: mataPelajaranId },
        select: { kkm: true },
      });

      const results = await Promise.all(
        nilaiList.map(async (item) => {
          // Auto-calculate nilai akhir if not provided
          const nilaiAkhir = item.nilaiAkhir ?? hitungNilaiAkhir(
            item.nilaiTugas,
            item.nilaiUTS,
            item.nilaiUAS
          );

          // Auto-generate predikat if not provided
          const predikat = item.predikat ?? getPredikat(nilaiAkhir);

          return prisma.nilai.upsert({
            where: {
              siswaId_mataPelajaranId_tahunAjaranId_semester: {
                siswaId: item.siswaId,
                mataPelajaranId,
                tahunAjaranId,
                semester,
              },
            },
            update: {
              nilaiTugas: item.nilaiTugas,
              nilaiUTS: item.nilaiUTS,
              nilaiUAS: item.nilaiUAS,
              nilaiAkhir,
              predikat,
              deskripsi: item.deskripsi,
            },
            create: {
              tahunAjaranId,
              siswaId: item.siswaId,
              mataPelajaranId,
              semester,
              nilaiTugas: item.nilaiTugas,
              nilaiUTS: item.nilaiUTS,
              nilaiUAS: item.nilaiUAS,
              nilaiAkhir,
              predikat,
              deskripsi: item.deskripsi,
            },
            include: {
              siswa: {
                select: {
                  nis: true,
                  nama: true,
                },
              },
            },
          });
        })
      );

      return NextResponse.json({
        success: true,
        message: `Batch nilai berhasil disimpan (${results.length} siswa)`,
        data: results,
      });
    } else {
      // Single create
      const validation = nilaiSchema.safeParse(body);
      if (!validation.success) {
        return NextResponse.json(
          {
            success: false,
            message: 'Validation failed',
            errors: validation.error.issues,
          },
          { status: 400 }
        );
      }

      const {
        tahunAjaranId,
        siswaId,
        mataPelajaranId,
        semester,
        nilaiTugas,
        nilaiUTS,
        nilaiUAS,
        nilaiAkhir: providedNilaiAkhir,
        predikat: providedPredikat,
        deskripsi,
      } = validation.data;

      // Auto-calculate if not provided
      const nilaiAkhir = providedNilaiAkhir ?? hitungNilaiAkhir(nilaiTugas, nilaiUTS, nilaiUAS);
      const predikat = providedPredikat ?? getPredikat(nilaiAkhir);

      const nilai = await prisma.nilai.upsert({
        where: {
          siswaId_mataPelajaranId_tahunAjaranId_semester: {
            siswaId,
            mataPelajaranId,
            tahunAjaranId,
            semester,
          },
        },
        update: {
          nilaiTugas,
          nilaiUTS,
          nilaiUAS,
          nilaiAkhir,
          predikat,
          deskripsi,
        },
        create: {
          tahunAjaranId,
          siswaId,
          mataPelajaranId,
          semester,
          nilaiTugas,
          nilaiUTS,
          nilaiUAS,
          nilaiAkhir,
          predikat,
          deskripsi,
        },
        include: {
          siswa: {
            select: {
              nis: true,
              nama: true,
            },
          },
          mataPelajaran: {
            select: {
              kode: true,
              nama: true,
              kkm: true,
            },
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Nilai berhasil disimpan',
        data: nilai,
      });
    }
  } catch (error: any) {
    console.error('Create nilai error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: Read nilai with filters
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const kelasId = searchParams.get('kelasId');
    const siswaId = searchParams.get('siswaId');
    const mataPelajaranId = searchParams.get('mataPelajaranId');
    const tahunAjaranId = searchParams.get('tahunAjaranId');
    const semester = searchParams.get('semester');

    const where: any = {};

    if (siswaId) where.siswaId = siswaId;
    if (mataPelajaranId) where.mataPelajaranId = mataPelajaranId;
    if (tahunAjaranId) where.tahunAjaranId = tahunAjaranId;
    if (semester) where.semester = semester;

    // If kelasId provided, need to filter by siswa kelas
    if (kelasId) {
      where.siswa = {
        kelasId: kelasId,
      };
    }

    const nilaiList = await prisma.nilai.findMany({
      where,
      include: {
        siswa: {
          select: {
            nis: true,
            nama: true,
            jenisKelamin: true,
            kelas: {
              select: {
                namaKelas: true,
                tingkat: true,
              },
            },
          },
        },
        mataPelajaran: {
          select: {
            kode: true,
            nama: true,
            kkm: true,
          },
        },
        tahunAjaran: {
          select: {
            tahunAjaran: true,
            status: true,
          },
        },
      },
      orderBy: [
        { siswa: { nama: 'asc' } },
      ],
    });

    return NextResponse.json({
      success: true,
      data: nilaiList,
    });
  } catch (error: any) {
    console.error('Get nilai error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
