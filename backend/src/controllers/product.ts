import type { Request, Response } from 'express';
import prisma from '../utils/prisma.js';
import type { Prisma } from '../../generated/prisma/client.js';

export const getProducts = async (req: Request, res: Response) => {
  const { page, limit, search, sortBy, sortOrder } = req.query as unknown as {
    page: number;
    limit: number;
    search?: string;
    sortBy: 'name' | 'stock';
    sortOrder: 'asc' | 'desc';
  };

  const skip = (page - 1) * limit;


  const where: Prisma.ProductWhereInput = search
    ? {
        name: {
          contains: search,
        },
      }
    : {};


  const orderBy: Prisma.ProductOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

 
  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: {
        [sortBy as string]: sortOrder,
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    }),
  ]);

  const totalPages = Math.ceil(total / limitNumber);

  return res.status(200).json({
    status: 'success',
    data: products,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  });
};
