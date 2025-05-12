import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;
    // const isAuth = !!token;

    if(token && 
        (
            url.pathname.startsWith('/signIn')  ||
            url.pathname.startsWith('/signUp')  || 
            url.pathname.startsWith('/verify')  || 
            url.pathname.startsWith('/')   
        )
    ) {
        return NextResponse.redirect(new URL('/abc', request.url))
    }
    
    if(!token && url.pathname.startsWith('/abc')) {
        return NextResponse.redirect(new URL('/signIn', request.url))
    }

return NextResponse.next()
}

export const config = {
    matcher: [
        '/signIn',
        '/signUp',
        '/',
        '/abc/:path*',
        '/verify/:path*'
    ]
}

