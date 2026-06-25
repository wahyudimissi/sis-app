import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

// Validation schema
const absensiSchema = z.object({
  tahunAjaranId: z.string().uuid(),
  kelasId: z.string().uuid(),
  siswaId: z.string().uuid(),
  tanggal: z.string(),
  mataPelajaran: z.string().optional(),
  status: z.enum(['HADIR', 'IZIN', 'SAKIT', 'ALPHA', 'TERLAMBAT']),
  keterangan: z.string().optional(),
});

const batchAbsensiSchema = z.object({
  tahunAjaranId: z.string().uuid(),
  kelasId: z.string().uuid(),
  tanggal: z.string(),
  mataPelajaran: z.string().optional(),
  absensiList: z.array(
    z.object({
      siswaId: z.string().uuid(),
      status: z.enum(['HADIR', 'IZIN', 'SAKIT', 'ALPHA', 'TERLAMBAT']),
      keterangan: z.string().optional(),
    })
  ),
});

// POST: Create absensi (single or batch)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only ADMIN, GURU, WALI_KELAS can create absensi
    if (!['ADMIN', 'GURU', 'WALI_KELAS', 'SUPERADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Check if batch or single
    if (body.absensiList && Array.isArray(body.absensiList)) {
      // Batch create
      const validation = batchAbsensiSchema.safeParse(body);
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

      const { tahunAjaranId, kelasId, tanggal, mataPelajaran, absensiList } = validation.data;

      // Create batch absensi
      const results = await Promise.all(
        absensiList.map(async (item) => {
          const mapelValue = mataPelajaran || null;
          
          return prisma.absensi.upsert({
            where: {
              siswaId_tanggal_mataPelajaran: {
                siswaId: item.siswaId,
                tanggal: new Date(tanggal),
                mataPelajaran: mapelValue as string,
              },
            },
            update: {
              status: item.status,
              keterangan: item.keterangan,
            },
            create: {
              tahunAjaranId,
              kelasId,
              siswaId: item.siswaId,
              tanggal: new Date(tanggal),
              mataPelajaran: mapelValue,
              status: item.status,
              keterangan: item.keterangan,
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
        message: `Batch absensi berhasil disimpan (${results.length} siswa)`,
        data: results,
      });
    } else {
      // Single create
      const validation = absensiSchema.safeParse(body);
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

      const { tahunAjaranId, kelasId, siswaId, tanggal, mataPelajaran, status, keterangan } = validation.data;
      
      const mapelValue = mataPelajaran || null;

      const absensi = await prisma.absensi.upsert({
        where: {
          siswaId_tanggal_mataPelajaran: {
            siswaId,
            tanggal: new Date(tanggal),
            mataPelajaran: mapelValue as string,
          },
        },
        update: {
          status,
          keterangan,
        },
        create: {
          tahunAjaranId,
          kelasId,
          siswaId,
          tanggal: new Date(tanggal),
          mataPelajaran: mapelValue,
          status,
          keterangan,
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

      return NextResponse.json({
        success: true,
        message: 'Absensi berhasil disimpan',
        data: absensi,
      });
    }
  } catch (error: any) {
    console.error('Create absensi error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: Read absensi with filters
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
    const tanggal = searchParams.get('tanggal');
    const tanggalMulai = searchParams.get('tanggalMulai');
    const tanggalSelesai = searchParams.get('tanggalSelesai');
    const tahunAjaranId = searchParams.get('tahunAjaranId');
    const status = searchParams.get('status');
    const mataPelajaran = searchParams.get('mataPelajaran');

    const where: any = {};

    if (kelasId) where.kelasId = kelasId;
    if (siswaId) where.siswaId = siswaId;
    if (tahunAjaranId) where.tahunAjaranId = tahunAjaranId;
    if (status) where.status = status;
    if (mataPelajaran) where.mataPelajaran = mataPelajaran;

    // Date range filter
    if (tanggal) {
      where.tanggal = new Date(tanggal);
    } else if (tanggalMulai && tanggalSelesai) {
      where.tanggal = {
        gte: new Date(tanggalMulai),
        lte: new Date(tanggalSelesai),
      };
    } else if (tanggalMulai) {
      where.tanggal = {
        gte: new Date(tanggalMulai),
      };
    } else if (tanggalSelesai) {
      where.tanggal = {
        lte: new Date(tanggalSelesai),
      };
    }

    const absensiList = await prisma.absensi.findMany({
      where,
      include: {
        siswa: {
          select: {
            nis: true,
            nama: true,
            jenisKelamin: true,
          },
        },
        kelas: {
          select: {
            namaKelas: true,
            tingkat: true,
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
        { tanggal: 'desc' },
        { siswa: { nama: 'asc' } },
      ],
    });

    return NextResponse.json({
      success: true,
      data: absensiList,
    });
  } catch (error: any) {
    console.error('Get absensi error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
