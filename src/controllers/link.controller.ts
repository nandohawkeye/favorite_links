import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export async function getLinks(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;

    const links = await prisma.link.findMany({
      where: { userId },
      include: { tags: true },
    });

    res.json(links);
  } catch {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

export async function createLink(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { url, title, tagIds } = req.body;

    const link = await prisma.link.create({
      data: {
        url,
        title,
        userId,
        ...(tagIds && {
          tags: { connect: tagIds.map((id: string) => ({ id })) },
        }),
      },
      include: { tags: true },
    });

    res.status(201).json(link);
  } catch {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

export async function updateLink(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const id = req.params['id'] as string;
    const { url, title, tagIds } = req.body;

    const exists = await prisma.link.findFirst({ where: { id, userId } });
    if (!exists) {
      res.status(404).json({ message: 'Link não encontrado' });
      return;
    }

    const link = await prisma.link.update({
      where: { id },
      data: {
        url,
        title,
        ...(tagIds && { tags: { set: tagIds.map((id: string) => ({ id })) } }),
      },
      include: { tags: true },
    });

    res.json(link);
  } catch {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

export async function deleteLink(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const id = req.params['id'] as string;

    const exists = await prisma.link.findFirst({ where: { id, userId } });
    if (!exists) {
      res.status(404).json({ message: 'Link não encontrado' });
      return;
    }

    await prisma.link.delete({ where: { id } });

    res.status(204).send();
  } catch {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
