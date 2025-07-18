import { Organization, OrganizationRole, OrganizationUser, User } from "@prisma/client";
import prisma from "@utils/prisma";
import { createOrganizationSchema } from "./organization.validation";
import { BadRequestError, NotFoundError } from "@middlewares/errorHandler";
import { Or } from "generated/prisma/runtime/library";

export class OrganizationService {
  async createOrganization(data: {
    name: string;
    ownerId: string;
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
	});
      return organization;
    } catch (error: any) {
      if (error.code === "P2002" && error.meta?.target?.includes("name")) {
        throw new Error("Organization with this name already exists");
      }
      throw error;
    }
  }

  async getOrganizations(userId: string): Promise<Organization[]> {
    return prisma.organization.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
  async getOrganizationById(
	organizationId: string,
	userId: string
  ): Promise<Organization | null> {
	const organization = await prisma.organization.findFirst({
	  where: {
		id: organizationId,
		members: {
		  some: {
			userId: userId,
		  },
		},
	  },
	  include: {
		members: {
		  include: {
			user: {
			  select: {
				id: true,
				name: true,
				email: true,
			  },
			},
		  },
		},
	  },
	});
	if (!organization) {
	  throw new NotFoundError("Organization not found or you do not have access");
  }
  	return organization;
	}

	async updateOrganization(
		organizationId: string,
		data: { name?: string; ownerId?: string }
	): Promise<Organization> {
		const organization = await prisma.organization.findUnique({
			where: { id: organizationId },
		});
		if (!organization) {
			throw new NotFoundError("Organization not found");
		}

		const updatedData: any = {};
		if (data.name) updatedData.name = data.name;
		if (data.ownerId) updatedData.ownerId = data.ownerId;

		return prisma.organization.update({
			where: { id: organizationId },
			data: updatedData,
		});
	}

	async addMember(organizationId: string, newMemberUserId: string, role: OrganizationRole): Promise<void>{
		const existingMember = await prisma.organizationUser.findFirst({
			where: {
				organizationId: organizationId,
				userId: newMemberUserId,
			},
		});
		if (existingMember){
			throw new BadRequestError("User is already a member of this organization");
		}
		const userExists = await prisma.user.findUnique({
			where: { id: newMemberUserId },
		});
		if (!userExists) {
			throw new NotFoundError("User not found");
		}
		try {
			await prisma.organizationUser.create({
				data: {
					organizationId,
					userId: newMemberUserId,
					role,
				},
			});
		} catch (error) {
			throw new Error("Failed to add member to organization");
			
		};
	};

	async updateMemberRole(organizationId: string, memberId: string, newRole: OrganizationRole): Promise<OrganizationUser> {
		const memberToUpdate = await prisma.organizationUser.findFirst({
			where: {
					organizationId: organizationId,
					userId: memberId,
			},
		});
		if (!memberToUpdate) {
			throw new NotFoundError("Member not found in this organization");
		};

		if( memberToUpdate.role === OrganizationRole.OWNER && newRole !== OrganizationRole.OWNER) {
			throw new BadRequestError("An owner cannot demote themselves. Transfer ownership first.");
		};
		return prisma.organizationUser.update({
			where: {
						organizationId: organizationId,
						id: memberId,
				},
			data: { role: newRole },
		});
	}
}
