import type { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

export const getHealth = async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      database: 'UP',
      uptime: process.uptime(),
    });
  } catch (error) {
    return res.status(503).json({
      status: 'DOWN',
      timestamp: new Date().toISOString(),
      database: 'DOWN',
      uptime: process.uptime(),
    });
  }
};

export const getMetrics = async (req: Request, res: Response) => {
  const memoryUsage = process.memoryUsage();
  
  let prismaMetrics = null;
  try {
    
    if ('$metrics' in prisma) {
       prismaMetrics = await (prisma as any).$metrics.json();
    }
  } catch (error) {

  }

  return res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100} MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100} MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100} MB`,
    },
    databaseMetrics: prismaMetrics,
  });
};
