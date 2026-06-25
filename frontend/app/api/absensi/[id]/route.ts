import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';
import { z } from 'zod';

const updateAbsensiSchema = z.object({
  status: z.enum(['HADIR', 'IZIN', 'SAKIT', 'ALPHA', 'TERLAMBAT']),
  keterangan: z.string().optional(),
});

// GET: Get single absensi by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const absensi = await prisma.absensi.findUnique({
      where: { id: params.id },
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
    });

    if (!absensi) {
      return NextResponse.json(
        { success: false, message: 'Absensi not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: absensi,
    });
  } catch (error: any) {
    console.error('Get absensi by ID error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT: Update absensi
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only ADMIN, GURU, WALI_KELAS can update
    if (!['ADMIN', 'GURU', 'WALI_KELAS', 'SUPERADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = updateAbsensiSchema.safeParse(body);

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

    const { status, keterangan } = validation.data;

    const absensi = await prisma.absensi.update({
      where: { id: params.id },
      data: {
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
      message: 'Absensi berhasil diupdate',
      data: absensi,
    });
  } catch (error: any) {
    console.error('Update absensi error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete absensi
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only ADMIN can delete
    if (!['ADMIN', 'SUPERADMIN'].includes(user.role)) {
      return NextResponse.json(
        { success: false, message: 'Forbidden: Only admin can delete absensi' },
        { status: 403 }
      );
    }

    await prisma.absensi.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Absensi berhasil dihapus',
    });
  } catch (error: any) {
    console.error('Delete absensi error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
