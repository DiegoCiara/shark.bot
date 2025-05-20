import User from '@entities/User';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { generateToken } from '@utils/auth/generateToken';
import sendMail from '@src/services/mail/sendEmail';
import Session from '@entities/Session';


dotenv.config();

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Operações relativas à sessions
 */

class SessionController {
  // /**
  //  * @swagger
  //  * /session/:
  //  *   post:
  //  *     summary: Autentica um usuário
  //  *     tags: [Autenticação]
  //  *     requestBody:
  //  *       required: true
  //  *       content:
  //  *         application/json:
  //  *           schema:
  //  *             type: object
  //  *             properties:
  //  *               email:
  //  *                 type: string
  //  *               password:
  //  *                 type: string
  //  *     responses:
  //  *       200:
  //  *         description: Autenticação bem-sucedida
  //  *         content:
  //  *           application/json:
  //  *             schema:
  //  *               type: object
  //  *               properties:
  //  *                 id:
  //  *                   type: string
  //  *                 email:
  //  *                   type: string
  //  *                 name:
  //  *                   type: string
  //  *                 has_configured:
  //  *                   type: boolean
  //  *       400:
  //  *         description: Valores inválidos para o usuário
  //  *       404:
  //  *         description: Usuário não encontrado
  //  *       401:
  //  *         description: Senha inválida
  //  *       500:
  //  *         description: Erro interno na autenticação
  //  */
  public async findSessions(req: Request, res: Response): Promise<void> {
    try {

      // const sessions = await Session.find();

      const sessions = [
        {
          id: '1',
          name: 'Session 1',
          assistant_id: '1',
        }
      ]
      res.status(200).json(sessions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno ao buscar sessões.' });
    }
  }
}

export default new SessionController();
