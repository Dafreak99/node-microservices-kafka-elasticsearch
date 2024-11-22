import express, { NextFunction, Request, Response } from 'express';
import { CreateProductRequest, UpdateProductRequest } from '../dto/product.dto';
import { CatalogRepository } from '../repository/catalog.repository';
import { CatalogService } from '../services/catalog.service';
import { RequestValidator } from '../utils/requestValidator';

const router = express.Router();

export const catalogService = new CatalogService(new CatalogRepository());

router.post('/product', async (req: Request, res: Response): Promise<any> => {
  try {
    const { errors, input } = await RequestValidator(
      CreateProductRequest,
      req.body,
    );

    if (errors) {
      return res.status(400).json(errors);
    }

    const data = await catalogService.createProduct(input);
    return res.status(201).json(data);
  } catch (error: any) {
    const err = error as Error;
    return res.status(500).json(err.message);
  }
});

router.patch(
  '/products/:id',
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { errors, input } = await RequestValidator(
        UpdateProductRequest,
        req.body,
      );

      const id = parseInt(req.params.id) || 0;

      if (errors) {
        return res.status(400).json(errors);
      }

      const data = await catalogService.updateProduct({
        ...input,
        id,
      });
      return res.status(200).json(data);
    } catch (error: any) {
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  },
);

router.get('/products', async (req: Request, res: Response): Promise<any> => {
  const { limit, offset } = req.query;

  try {
    const data = await catalogService.getProducts(
      Number(limit),
      Number(offset),
    );
    return res.status(200).json(data);
  } catch (error: any) {
    const err = error as Error;
    return res.status(500).json(err.message);
  }
});

router.get(
  '/product/:id',
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params;

    try {
      const data = await catalogService.getProduct(Number(id));
      return res.status(200).json(data);
    } catch (error: any) {
      return next(error);
    }
  },
);

router.delete(
  '/product/:id',
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
      const data = await catalogService.deleteProduct(Number(id));
      return res.status(200).json(data);
    } catch (error: any) {
      const err = error as Error;
      return res.status(500).json(err.message);
    }
  },
);

export default router;
