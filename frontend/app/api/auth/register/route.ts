import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { ApiResponseHelper } from '@/lib/api-response';
import { hashPassword } from '@/lib/auth';
import { z } from 'zod';

// Validation schema
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['SISWA', 'GURU', 'ORANG_TUA', 'ADMIN', 'STAFF_KEUANGAN', 'PETUGAS_PERPUSTAKAAN', 'STAFF_INVENTARIS', 'ADMIN_PPDB', 'ADMIN_BKK']),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const errors: Record<string, string[]> = {};
      validation.error.issues.forEach((err) => {
        const path = err.path[0] as string;
        if (!errors[path]) errors[path] = [];
        errors[path].push(err.message);
      });
      return ApiResponseHelper.validationError(errors);
    }

    const { email, username, password, role } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      return ApiResponseHelper.badRequest(
        existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken'
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role,
        status: true,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return ApiResponseHelper.created(user, 'User registered successfully');

  } catch (error) {
    console.error('Registration error:', error);
    return ApiResponseHelper.error('Internal server error');
  }
}
