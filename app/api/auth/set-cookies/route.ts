import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token, role, userId } = await request.json();

    if (!token || !role) {
      return NextResponse.json(
        { error: 'Token and role are required' }, 
        { status: 400 }
      );
    }

    // Create response
    const response = NextResponse.json({ success: true });

    // Set token cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7200, // 2 hours
      path: '/',
    });

    // Set token cookie
    response.cookies.set('userId', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7200, // 2 hours
      path: '/',
    });

    // Set role cookie
    response.cookies.set('role', role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7200, // 7 days
      path: '/',
    });

    return response;

  } catch (error) {
    console.error('Cookie setting error:', error);
    return NextResponse.json(
      { error: 'Failed to set cookies' }, 
      { status: 500 }
    );
  }
}