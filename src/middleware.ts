import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const DONATION_ID_COOKIE = 'completedDonationId';

export function middleware(req: NextRequest) {
    const donationId = req.cookies.get(DONATION_ID_COOKIE);

    // Redirect to the landing page if the user isn't authorized
    if (donationId == undefined) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/donation-feedback', // Apply middleware only to the feedback page
};
