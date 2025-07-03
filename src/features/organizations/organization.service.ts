import { Organization, User } from "@prisma/client";
import prisma from "@utils/prisma";
import { createOrganizationSchema } from "./organization.validation"

export class OrganizationService {
	async createOrganization(data: {
		name: string;
		ownerId: string;
		owner: User;
	}): Promise<Organization> {
		const parsed = createOrganizationSchema.safeParse(data);
		if (!parsed.success) {
			throw new Error("Invalid organization data");
		}
		try {
			const organization = await prisma.organization.create({
				data: {
					name: parsed.data.name,
					ownerId: parsed.data.ownerId,
					members: {
						create: {
							userId: parsed.data.ownerId,
							role: "OWNER",
						},
					},
				},
				})
			return organization;
			
		} catch (error: any) {
			if (error.code === "P2002" && error.meta?.target?.includes("name")) {
				throw new Error("Organization with this name already exists");
			}
			throw error;
		}
	}
};