// app/api/auth/check-token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import {  getUserById } from '@/app/_services/auth';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const role = cookieStore.get('role')?.value;
    const userId = cookieStore.get('userId')?.value;

    // If no token, return not authenticated
    if (!token) {
      return NextResponse.json({ 
        authenticated: false,
        user: null
      });
    }

    

    // Fallback: Get user data from database if cookies are incomplete
    const userData = await getUserById(userId);

    console.log("user data here", userData)
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: userData?.id,
        email: userData?.email,
        name: userData?.name,
        role: userData?.role,
      }
    });

  } catch (error) {
    console.error('Token check error:', error);
    return NextResponse.json({ 
      authenticated: false,
      user: null,
      error: 'Token validation failed'
    });
  }
}

