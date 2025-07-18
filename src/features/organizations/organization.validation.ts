import { z } from 'zod';
import { OrganizationRole } from '@prisma/client';


export const createOrganizationSchema = z.object({
	  name: z.string().min(3, 'Organization name is required'),
	  ownerId: z.string().cuid('Invalid owner ID'),
});

export const addMemberSchema = z.object({
	userId: z.string().cuid('Invalid user ID'),
	role: z.nativeEnum(OrganizationRole).optional().default(OrganizationRole.MEMBER),
});

export const updateMemberRoleSchema = z.object({
	role: z.nativeEnum(OrganizationRole),
});