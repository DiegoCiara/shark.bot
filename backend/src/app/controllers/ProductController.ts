import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import emailValidator from '@utils/emailValidator';
import Product from '@entities/Product';
import User from '@entities/User';

interface ProductInterface {
  name: string;
  description: string;
}

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: Operações relativas às produtos
 */

class ProductController {
  /**
   * @swagger
   * /product:
   *   get:
   *     summary: Retorna todas as produtos de um usuário autenticado
   *     tags: [Produtos]
   *     responses:
   *       200:
   *         description: Produtos encontradas
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   name:
   *                     type: string
   *                   description:
   *                     type: object
   *                     properties:
   *                       rent:
   *                         type: number
   *                       deduction:
   *                         type: number
   *       500:
   *         description: Erro ao procurar produtos
   */
  public async findProducts(req: Request, res: Response): Promise<void> {
    try {
      const products = await Product.find({
        order: { name: 'DESC', created_at: 'DESC' },
      });

      res.status(200).json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Erro ao procurar produtos, tente novamente mais tarde',
      });
    }
  }

  /**
   * @swagger
   * /product/{id}:
   *   get:
   *     summary: Retorna um produto específica pelo ID
   *     tags: [Produtos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do produto
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Produto encontrada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 name:
   *                   type: string
   *                 description:
   *                   type: object
   *                   properties:
   *                     rent:
   *                       type: number
   *                     deduction:
   *                       type: number
   *       404:
   *         description: Produto não encontrada
   *       500:
   *         description: Erro ao buscar declaração
   */
  public async findProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const product = await Product.findOne(id);

      if (!product) {
        res.status(404).json({ message: 'Produto não encontrada.' });
        return;
      }
      console.log(product);
      res.status(200).json(product);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro ao buscar declaração, tente novamente' });
    }
  }

  /**
   * @swagger
   * /product:
   *   post:
   *     summary: Cria uma novo produto para o usuário autenticado
   *     tags: [Produtos]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: object
   *                 properties:
   *                   rent:
   *                     type: number
   *                   deduction:
   *                     type: number
   *     responses:
   *       201:
   *         description: Produto criada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *       400:
   *         description: Dados inválidos para criação do produto
   *       401:
   *         description: Usuário não autorizado
   *       500:
   *         description: Erro ao registrar o produto
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne(req.userId, { relations: ['workspace'] });

      if (!user) {
        res.status(401).json({ message: 'Usuário não autorizado.' });
        return;
      }

      const { name, description }: ProductInterface = req.body;

      if (!name || !description) {
        res
          .status(400)
          .json({ message: 'Dados inválidos para criação do produto.' });
        return;
      }

      const product = await Product.create({
        name,
        description,
        workspace: user.workspace,
      }).save();

      res.status(201).json({ id: product.id });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro ao registrar o produto, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /product/{id}:
   *   put:
   *     summary: Atualiza um produto existente
   *     tags: [Produtos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do produto a ser atualizada
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: object
   *                 properties:
   *                   rent:
   *                     type: number
   *                   deduction:
   *                     type: number
   *               status:
   *                 type: string
   *     responses:
   *       204:
   *         description: Produto atualizada com sucesso
   *       404:
   *         description: Produto não encontrada
   *       500:
   *         description: Erro ao atualizar o produto
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description }: ProductInterface = req.body;

      const product = await Product.findOne(id);

      if (!product) {
        res.status(404).json({ message: 'Produto não encontrada.' });
        return;
      }

      const descriptionToUpdate = {
        name: name || product.name,
        description: description || product.description,
      };

      await Product.update(product.id, { ...descriptionToUpdate });

      res.status(204).json({ message: 'Produto atualizada com sucesso.' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Erro ao atualizar o produto, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /product/{id}:
   *   delete:
   *     summary: Deleta um produto existente
   *     tags: [Produtos]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do produto a ser deletada
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Produto deletada com sucesso
   *       404:
   *         description: Produto não encontrada
   *       401:
   *         description: Não é possível remover produtos submetidas
   *       500:
   *         description: Erro ao deletar o produto
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const product = await Product.findOne(id);

      if (!product) {
        res.status(404).json({ message: 'Produto não encontrada.' });
        return;
      }

      await Product.softRemove(product);

      res.status(204).json({ messsage: 'Produto deletada com sucesso.' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Erro ao deletar o produto, tente novamente.' });
    }
  }
}

export default new ProductController();
