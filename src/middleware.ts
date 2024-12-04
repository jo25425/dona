import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const DONATION_COMPLETE_FLAG = 'donationComplete';

export function middleware(req: NextRequest) {
    const isAuthorized = req.cookies.get(DONATION_COMPLETE_FLAG);

    // Redirect to the landing page if the user isn't authorized
    if (!isAuthorized) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/donation-feedback', // Apply middleware only to the feedback page
};
