import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  let response = await updateSession(request);

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const basicAuth = request.headers.get('authorization');

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      if (user === 'VERUTHEALLAADMIN' && pwd === 'Deadpool@1966') {
        return response;
      }
    }
    
    return new Response('Auth required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|cutouts|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
