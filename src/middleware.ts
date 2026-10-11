import { NextResponse, type NextRequest } from "next/server";

const legacyRoutes: Record<string, string> = {
  "/departments": "/admin/departments",
  "/projects": "/admin/projects",
  "/tasks": "/admin/tasks",
  "/tags": "/admin/tags",
  "/search": "/admin/search",
};

export function middleware(request: NextRequest) {
  const destination = legacyRoutes[request.nextUrl.pathname];
  if (!destination) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = destination;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/departments", "/projects", "/tasks", "/tags", "/search"],
};
