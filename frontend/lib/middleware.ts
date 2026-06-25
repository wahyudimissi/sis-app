import { NextRequest } from 'next/server';
import { ApiResponseHelper } from './api-response';
import { getCurrentUser, TokenPayload } from './auth';

// Check if user is authenticated
export async function requireAuth(request: NextRequest): Promise<TokenPayload | null> {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    return null;
  }
  
  return currentUser;
}

// Check if user has required role
export function hasRole(user: TokenPayload, allowedRoles: string[]): boolean {
  return allowedRoles.includes(user.role);
}

// Middleware to check authentication
export async function withAuth(
  request: NextRequest,
  handler: (request: NextRequest, user: TokenPayload) => Promise<any>
) {
  const user = await requireAuth(request);
  
  if (!user) {
    return ApiResponseHelper.unauthorized('Authentication required');
  }
  
  return handler(request, user);
}

// Middleware to check authentication and authorization
export async function withAuthAndRole(
  request: NextRequest,
  allowedRoles: string[],
  handler: (request: NextRequest, user: TokenPayload) => Promise<any>
) {
  const user = await requireAuth(request);
  
  if (!user) {
    return ApiResponseHelper.unauthorized('Authentication required');
  }
  
  if (!hasRole(user, allowedRoles)) {
    return ApiResponseHelper.forbidden('You do not have permission to access this resource');
  }
  
  return handler(request, user);
}
