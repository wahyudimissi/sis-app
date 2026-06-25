import { NextRequest } from 'next/server';
import { ApiResponseHelper } from '@/lib/api-response';
import { removeAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Remove auth cookie
    await removeAuthCookie();

    return ApiResponseHelper.success(null, 'Logout successful');

  } catch (error) {
    console.error('Logout error:', error);
    return ApiResponseHelper.error('Internal server error');
  }
}
