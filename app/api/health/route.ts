import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health checks
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      memory: process.memoryUsage(),
      pid: process.pid,
      version: process.env.npm_package_version || 'unknown',
    };

    // Check if critical services are available
    const checks = {
      puter: typeof window !== 'undefined' && typeof (window as unknown as Record<string, unknown>).puter !== 'undefined',
      env: !!process.env.NEXTAUTH_URL,
    };

    return NextResponse.json({
      ...health,
      checks,
      healthy: Object.values(checks).every(Boolean)
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      }
    });

  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { 
        status: 503,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  }
}