import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponseHelper } from '@/lib/api-response';
import { withAuthAndRole } from '@/lib/middleware';
import { z } from 'zod';

const profilSekolahSchema = z.object({
  namaSekolah: z.string().min(1, 'Nama sekolah is required'),
  npsn: z.string().min(1, 'NPSN is required'),
  nss: z.string().optional(),
  alamat: z.string().min(1, 'Alamat is required'),
  kelurahan: z.string().min(1, 'Kelurahan is required'),
  kecamatan: z.string().min(1, 'Kecamatan is required'),
  kota: z.string().min(1, 'Kota is required'),
  provinsi: z.string().min(1, 'Provinsi is required'),
  kodePos: z.string().optional(),
  telepon: z.string().optional(),
  fax: z.string().optional(),
  email: z.string().optional().refine((val) => !val || z.string().email().safeParse(val).success, {
    message: 'Email tidak valid',
  }),
  website: z.string().optional(),
  kepalaSekolah: z.string().min(1, 'Kepala sekolah is required'),
  nipKepalaSekolah: z.string().min(1, 'NIP kepala sekolah is required'),
  akreditasi: z.string().optional(),
  tahunBerdiri: z.string().optional(),
  luasTanah: z.string().optional(),
  luasBangunan: z.string().optional(),
  visi: z.string().optional(),
  misi: z.string().optional(),
  logoPath: z.string().optional(),
  kopSuratPath: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Get the first (and should be only) profil sekolah
    const profilSekolah = await prisma.profilSekolah.findFirst();

    if (!profilSekolah) {
      return ApiResponseHelper.notFound('Profil sekolah not found. Please create one first.');
    }

    return ApiResponseHelper.success(profilSekolah);

  } catch (error) {
    console.error('Get profil sekolah error:', error);
    return ApiResponseHelper.error('Internal server error');
  }
}

export async function POST(request: NextRequest) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN'],
    async (req, user) => {
      try {
        // Check if profil sekolah already exists
        const existing = await prisma.profilSekolah.findFirst();
        if (existing) {
          return ApiResponseHelper.badRequest('Profil sekolah already exists. Use PUT to update.');
        }

        const body = await req.json();
        const validation = profilSekolahSchema.safeParse(body);
        
        if (!validation.success) {
          const errors: Record<string, string[]> = {};
          validation.error.issues.forEach((err) => {
            const path = err.path[0] as string;
            if (!errors[path]) errors[path] = [];
            errors[path].push(err.message);
          });
          return ApiResponseHelper.validationError(errors);
        }

        const data = validation.data;

        const profilSekolah = await prisma.profilSekolah.create({
          data,
        });

        return ApiResponseHelper.created(profilSekolah, 'Profil sekolah created successfully');

      } catch (error) {
        console.error('Create profil sekolah error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}

export async function PUT(request: NextRequest) {
  return withAuthAndRole(
    request,
    ['SUPERADMIN', 'ADMIN'],
    async (req, user) => {
      try {
        // Get existing profil sekolah
        const existing = await prisma.profilSekolah.findFirst();
        if (!existing) {
          return ApiResponseHelper.notFound('Profil sekolah not found. Use POST to create one.');
        }

        const body = await req.json();
        const validation = profilSekolahSchema.partial().safeParse(body);
        
        if (!validation.success) {
          const errors: Record<string, string[]> = {};
          validation.error.issues.forEach((err) => {
            const path = err.path[0] as string;
            if (!errors[path]) errors[path] = [];
            errors[path].push(err.message);
          });
          return ApiResponseHelper.validationError(errors);
        }

        const data = validation.data;

        const profilSekolah = await prisma.profilSekolah.update({
          where: { id: existing.id },
          data,
        });

        return ApiResponseHelper.success(profilSekolah, 'Profil sekolah updated successfully');

      } catch (error) {
        console.error('Update profil sekolah error:', error);
        return ApiResponseHelper.error('Internal server error');
      }
    }
  );
}
