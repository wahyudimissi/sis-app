import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCurrentUser } from '@/lib/auth';

const prisma = new PrismaClient();

// GET /api/ppdb/[id] - Get single pendaftaran
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const pendaftaran = await prisma.pendaftaranPPDB.findUnique({
      where: { id },
    });

    if (!pendaftaran) {
      return NextResponse.json(
        {
          success: false,
          message: 'Pendaftaran tidak ditemukan',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: pendaftaran,
    });
  } catch (error: any) {
    console.error('Get PPDB by ID error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch pendaftaran',
      },
      { status: 500 }
    );
  }
}

// PUT /api/ppdb/[id] - Update pendaftaran (admin only for verification/selection)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    // Check auth
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    // Only ADMIN, SUPERADMIN, ADMIN_PPDB can update
    if (!['ADMIN', 'SUPERADMIN', 'ADMIN_PPDB'].includes(user.role)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Forbidden - You do not have permission',
        },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await request.json();

    const {
      statusVerifikasi,
      statusSeleksi,
      catatanVerifikasi,
      nilaiSeleksi,
      jurusanDiterima,
    } = body;

    const updateData: any = {};

    if (statusVerifikasi !== undefined) {
      updateData.statusVerifikasi = statusVerifikasi;
      updateData.tanggalVerifikasi = new Date();
    }

    if (statusSeleksi !== undefined) {
      updateData.statusSeleksi = statusSeleksi;
      updateData.tanggalPengumuman = new Date();
    }

    if (catatanVerifikasi !== undefined) {
      updateData.catatanVerifikasi = catatanVerifikasi;
    }

    if (nilaiSeleksi !== undefined) {
      updateData.nilaiSeleksi = nilaiSeleksi;
    }

    if (jurusanDiterima !== undefined) {
      updateData.jurusanDiterima = jurusanDiterima;
    }

    const updatedPendaftaran = await prisma.pendaftaranPPDB.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil diupdate',
      data: updatedPendaftaran,
    });
  } catch (error: any) {
    console.error('Update PPDB error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to update pendaftaran',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/ppdb/[id] - Delete pendaftaran (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    // Check auth
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    // Only ADMIN, SUPERADMIN can delete
    if (!['ADMIN', 'SUPERADMIN'].includes(user.role)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Forbidden - You do not have permission',
        },
        { status: 403 }
      );
    }

    const { id } = params;

    await prisma.pendaftaranPPDB.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil dihapus',
    });
  } catch (error: any) {
    console.error('Delete PPDB error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to delete pendaftaran',
      },
      { status: 500 }
    );
  }
}
