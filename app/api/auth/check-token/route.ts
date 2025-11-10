// app/api/auth/check-token/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
// import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import {  getUserById } from '@/app/_services/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    const userId = cookieStore.get('userId')?.value;

    // If no token, return not authenticated
    if (!token || !userId) {
      return NextResponse.json({ 
        authenticated: false,
        user: null
      });
    }

    // Get user data from database
    const userData = await getUserById(userId);

    if (!userData) {
      return NextResponse.json({ 
        authenticated: false,
        user: null
      });
    }

    console.log("user data here", userData);
    
    return NextResponse.json({
      authenticated: true,
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
      }
    });

  } catch (error) {
    console.error('Token check error:', error);
    return NextResponse.json({ 
      authenticated: false,
      user: null,
      error: 'Token validation failed'
    }, { status: 500 });
  }
}

