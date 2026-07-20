export async function GET() {
  return Response.json({
    success: true,
    status: 'OK',
    message: '🚀 Nomadic Ventures API is running',
    timestamp: new Date().toISOString(),
  });
}
