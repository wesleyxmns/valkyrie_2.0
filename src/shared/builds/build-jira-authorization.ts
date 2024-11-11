export function buildJiraAuthorization() {
  const authorization = `${process.env.NEXT_PUBLIC_SB_USER}:${process.env.NEXT_PUBLIC_SB_PASS}`
  return `Basic ${Buffer.from(authorization).toString('base64')}`
}