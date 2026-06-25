import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponseHelper } from '@/lib/api-response';
import { comparePassword, generateToken, setAuthCookie } from '@/lib/auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Validation schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      const errors: Record<string, string[]> = {};
      validation.error.issues.forEach((err) => {
        const path = err.path[0] as string;
        if (!errors[path]) errors[path] = [];
        errors[path].push(err.message);
      });
      return ApiResponseHelper.validationError(errors);
    }

    const { username, password } = validation.data;

    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username },
        ],
      },
      include: {
        guru: true,
        siswa: true,
        orangTua: {
          include: {
            siswa: true,
          },
        },
      },
    });

    if (!user) {
      return ApiResponseHelper.unauthorized('Invalid username or password');
    }

    // Check if user is active
    if (!user.status) {
      return ApiResponseHelper.unauthorized('Account is inactive');
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return ApiResponseHelper.unauthorized('Invalid username or password');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate JWT token
    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    // Set cookie
    await setAuthCookie(token);

    // Prepare user data
    let userData: any = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // Add role-specific data
    if (user.guru) {
      userData.guru = {
        id: user.guru.id,
        nip: user.guru.nip,
        nama: user.guru.nama,
        foto: user.guru.foto,
      };
    }

    if (user.siswa) {
      userData.siswa = {
        id: user.siswa.id,
        nis: user.siswa.nis,
        nisn: user.siswa.nisn,
        nama: user.siswa.nama,
        foto: user.siswa.foto,
      };
    }

    if (user.orangTua) {
      userData.orangTua = {
        id: user.orangTua.id,
        siswa: {
          nama: user.orangTua.siswa.nama,
          nis: user.orangTua.siswa.nis,
        },
      };
    }

    return ApiResponseHelper.success({
      user: userData,
      token,
    }, 'Login successful');

  } catch (error) {
    console.error('Login error:', error);
    return ApiResponseHelper.error('Internal server error');
  }
}
