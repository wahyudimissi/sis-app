import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export class ApiResponseHelper {
  static success<T>(data: T, message: string = 'Success'): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status: 200 }
    );
  }

  static created<T>(data: T, message: string = 'Created successfully'): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status: 201 }
    );
  }

  static noContent(message: string = 'Deleted successfully'): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: true,
        message,
      },
      { status: 200 }
    );
  }

  static error(message: string = 'Internal server error', status: number = 500): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        message,
        error: message,
      },
      { status }
    );
  }

  static badRequest(message: string = 'Bad request', errors?: Record<string, string[]>): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        message,
        error: message,
        errors,
      },
      { status: 400 }
    );
  }

  static unauthorized(message: string = 'Unauthorized'): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        message,
        error: message,
      },
      { status: 401 }
    );
  }

  static forbidden(message: string = 'Forbidden'): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        message,
        error: message,
      },
      { status: 403 }
    );
  }

  static notFound(message: string = 'Not found'): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        message,
        error: message,
      },
      { status: 404 }
    );
  }

  static validationError(errors: Record<string, string[]>, message: string = 'Validation failed'): NextResponse<ApiResponse> {
    return NextResponse.json(
      {
        success: false,
        message,
        error: message,
        errors,
      },
      { status: 422 }
    );
  }
}
