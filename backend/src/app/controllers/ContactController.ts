import { Request, Response } from 'express';
import User from '@entities/User';
import Profile from '@entities/Profile';
import queryBuilder from '@utils/queryBuilder';
import Contact from '@entities/Contact';

interface ContactInterface {
  name: string;
  cpf_cnpj: string;
  email: string;
  phone: string;
  profile_id: string;
}

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: Operações relativas às clientes
 */

class ContactController {
  /**
   * @swagger
   * /Contact:
   *   get:
   *     summary: Retorna todas as clientes de um usuário autenticado
   *     tags: [Clientes]
   *     responses:
   *       200:
   *         description: Clientes encontrados
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
   *       401:
   *         description: Usuário não encontrado ou token inválido
   *       500:
   *         description: Erro ao procurar clientes
   */
  public async findContacts(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne(req.userId);

      if (!user) {
        res.status(401).json({ message: 'Usuário não encontrado.' });
        return;
      }

      const querry = queryBuilder(req.query);

      const { where, skip, take }: any = querry;

      console.log(where);

      const contacts = await Contact.find({
        where: where,
        take,
        skip,
        order: { name: 'DESC', created_at: 'DESC' },
        relations: ['profile'],
      });

      const ContactFormatted = contacts.map((contact: Contact) => {
        return {
          id: contact.id,
          name: contact.name,
          cpf_cnpj: contact.cpf_cnpj,
          phone: contact.phone,
          email: contact.email,
          profile_name: contact.profile.name,
          created_at: contact.created_at,
        };
      });

      res.status(200).json(ContactFormatted);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Erro ao procurar clientes, tente novamente mais tarde',
      });
    }
  }

  /**
   * @swagger
   * /Contact/filter:
   *   get:
   *     summary: Retorna todas as clientes de um usuário autenticado
   *     tags: [Clientes]
   *     responses:
   *       200:
   *         description: Clientes encontrados
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
   *       401:
   *         description: Usuário não encontrado ou token inválido
   *       500:
   *         description: Erro ao procurar clientes
   */
  public async filterContacts(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne(req.userId);

      if (!user) {
        res.status(401).json({ message: 'Usuário não encontrado.' });
        return;
      }

      const where = queryBuilder(req.query);

      const contacts = await Contact.find({
        where,
        relations: ['profile'],
      });

      const contactFormatted = contacts.map((contact: Contact) => {
        return {
          id: contact.id,
          name: contact.name,
          cpf_cnpj: contact.cpf_cnpj,
          phone: contact.phone,
          email: contact.email,
          profile_name: contact.profile.name,
          created_at: contact.created_at,
        };
      });

      res.status(200).json(contactFormatted);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'Erro ao procurar clientes, tente novamente mais tarde',
      });
    }
  }

  /**
   * @swagger
   * /Contact/{id}:
   *   get:
   *     summary: Retorna um cliente específica pelo ID
   *     tags: [Clientes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do cliente
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Cliente encontrado
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
   *         description: Cliente não encontrado
   *       500:
   *         description: Erro ao buscar declaração
   */
  public async findContactById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const contact = await Contact.findOne(id, { relations: ['profile'] });

      if (!contact) {
        res.status(404).json({ message: 'Cliente não encontrado.' });
        return;
      }

      res.status(200).json({
        id: contact.id,
        name: contact.name,
        cpf_cnpj: contact.cpf_cnpj,
        phone: contact.phone,
        email: contact.email,
        profile_id: contact.profile.id,
        profile_name: contact.profile.name,
        created_at: contact.created_at,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro ao buscar declaração, tente novamente' });
    }
  }

  /**
   * @swagger
   * /Contact:
   *   post:
   *     summary: Cria uma novo cliente para o usuário autenticado
   *     tags: [Clientes]
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
   *         description: Cliente criada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *       400:
   *         description: Dados inválidos para criação do cliente
   *       401:
   *         description: Usuário não autorizado
   *       500:
   *         description: Erro ao registrar o cliente
   */
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await User.findOne(req.userId, { relations: ['workspace'] });

      if (!user) {
        res.status(401).json({ message: 'Usuário não autorizado.' });
        return;
      }

      const { name, phone, email, cpf_cnpj, profile_id }: ContactInterface =
        req.body;

      console.log(req.body);

      if (!name || !cpf_cnpj || !phone || !profile_id) {
        res
          .status(400)
          .json({ message: 'Dados inválidos para criação do cliente.' });
        return;
      }

      const profile = await Profile.findOne(profile_id);

      if (!profile) {
        res.status(400).json({ message: 'Perfil de clinte não encontrado' });
        return;
      }

      const Contact_find = await Contact.findOne({ where: { cpf_cnpj } });

      if (Contact_find) {
        res.status(400).json({ message: 'CPF já cadastrado' });
        return;
      }

      const contact = await Contact.create({
        name,
        cpf_cnpj,
        phone,
        email,
        profile,
        workspace: user.workspace,
      }).save();

      res.status(201).json({ id: contact.id });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro ao registrar o cliente, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /Contact/{id}:
   *   put:
   *     summary: Atualiza um cliente existente
   *     tags: [Clientes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do cliente a ser atualizada
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
   *         description: Cliente atualizada com sucesso
   *       404:
   *         description: Cliente não encontrado
   *       500:
   *         description: Erro ao atualizar o cliente
   */
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, phone, email, profile_id }: ContactInterface = req.body;

      const contact = await Contact.findOne(id);

      if (!contact) {
        res.status(404).json({ message: 'Cliente não encontrado.' });
        return;
      }

      if (!name || !phone || !email || !profile_id) {
        res
          .status(400)
          .json({ message: 'Dados inválidos para criação do cliente.' });
        return;
      }

      const profile = await Profile.findOne(profile_id);

      if (!profile) {
        res.status(400).json({ message: 'Perfil de clinte não encontrado' });
        return;
      }

      const valuesToUpdate = {
        name: name || contact.name,
        phone: phone || contact.phone,
        email: email || contact.email,
        profile: profile || contact.profile,
      };

      await Contact.update(contact.id, { ...valuesToUpdate });

      res.status(204).json({ message: 'Cliente atualizada com sucesso.' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Erro ao atualizar o cliente, tente novamente.' });
    }
  }

  /**
   * @swagger
   * /Contact/{id}:
   *   delete:
   *     summary: Deleta um cliente existente
   *     tags: [Clientes]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID do cliente a ser deletada
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Cliente deletada com sucesso
   *       404:
   *         description: Cliente não encontrado
   *       401:
   *         description: Não é possível remover clientes submetidas
   *       500:
   *         description: Erro ao deletar o cliente
   */
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const contact = await Contact.findOne(id);

      if (!contact) {
        res.status(404).json({ message: 'Cliente não encontrado.' });
        return;
      }

      await Contact.softRemove(contact);

      res.status(204).json({ messsage: 'Cliente deletada com sucesso.' });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: 'Erro ao deletar o cliente, tente novamente.' });
    }
  }
}

export default new ContactController();
