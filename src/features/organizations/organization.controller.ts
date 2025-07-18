import { OrganizationService } from "./organization.service";
import { Request, Response, NextFunction } from "express";
import logger from "@utils/logger";
import { Organization, OrganizationRole } from "@prisma/client";
import { createOrganizationSchema } from "./organization.validation";

const organizationService = new OrganizationService();

export class OrganizationController {
  static async createOrganization(
    request: Request,
    response: Response,
	next: NextFunction
  ){
	try {
		const validatedData = createOrganizationSchema.parse(request.body);
		const organization = await organizationService.createOrganization(
	  validatedData
	);
	response.status(200).json(organization);
	logger.info("Organization created successfully");
	} catch (error: any) {
		logger.error(error);
		next(error);
	}
 }

 static async getOrganizations(request: Request, response: Response, next: NextFunction){
	try {
		const userId = request.body;
		const organizations = await organizationService.getOrganizations(userId);
		response.status(200).json(organizations);
	} catch (error) {
		next(error);
	}
 }
}
