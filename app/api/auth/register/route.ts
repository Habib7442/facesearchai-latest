import { NextResponse } from 'next/server';
import { register } from '@/lib/auth';
import { SignUpFormValues, signUpSchema } from '@/lib/schemas/signUpSchema';

export async function POST(request: Request) {
  try {
    const data: SignUpFormValues = await request.json();

    // Validate with Zod schema
    const validationResult = signUpSchema.safeParse(data);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validationResult.error.errors[0].message 
        },
        { status: 400 }
      );
    }

    // Register user
    const result = await register(validationResult.data);

    if (result.success) {
      return NextResponse.json(
        { 
          success: true, 
          message: "Registration successful",
          data: result.data 
        }, 
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || "Registration failed" 
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Registration failed',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: error.status || 500 }
    );
  }
}