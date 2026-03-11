export const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL ?? 'admin@nuura.pk',
  password: process.env.ADMIN_PASSWORD ?? 'nuura2025',
}

export function isAdminRequest(request: Request): boolean {
  const adminKey = request.headers.get('x-admin-key')
  return adminKey === process.env.ADMIN_SECRET_KEY
}
