import { z } from 'zod';
import { OrganizationRole } from '@prisma/client';


export const createOrganizationSchema = z.object({
	  name: z.string().min(3, 'Organization name is required'),
	  ownerId: z.string().uuid('Invalid owner ID'),
	  owner: z.object({
		    id: z.string().uuid('Invalid owner ID'),
		    email: z.string().email('Invalid email address'),
		    name: z.string().min(1, 'Name is required'),
	  }),
}).refine(data => data.owner.id === data.ownerId, {
	  message: 'Owner ID must match the owner object ID',
});

export const addMemberSchema = z.object({
	userId: z.string().uuid('Invalid user ID'),
	role: z.nativeEnum(OrganizationRole).optional().default(OrganizationRole.MEMBER),
});

export const updateMemberRoleSchema = z.object({
	role: z.nativeEnum(OrganizationRole),
});