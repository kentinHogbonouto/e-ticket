import createHttpError from "http-errors";

import OrganizerRepository from "../repositories/organizer.repository";

import PasswordHelpers from "../../../../helpers/password.helper";

import GeneralHelpers from "../../../../helpers/general.helper";

import RoleService from "../../roles/services/role.service";

import { Organizer } from "../interfaces/organizer.model";
import {
  ICreateOrganizerDto,
  IFindAllOrganizerDto,
  IUpdateOrganizerDto,
  IUpdateOrganizerPasswordDto,
  IResetOrganizerPasswordDto,
} from "../interfaces/dto/services/organizer.dto";
import {
  CreateOrganizerDto,
  UpdateOrganizerDto,
} from "../interfaces/dto/repositories/organizer.dto";

import { ValidationMessages } from "../../../../validations/validation";
import { OrganizerValidationMessages } from "../validations/organizer.validation";

export default class OrganizerService {
  constructor(
    private organizerRepository: OrganizerRepository,
    private roleService: RoleService
  ) {}

  /**
   * @function findByResetToken
   * @description Get organizer by reset password token.
   * @param token
   * @return Promise<Organizer | null>
   */
  public async findByResetToken(token: string): Promise<Organizer | null> {
    let organizer = await this.organizerRepository.findByResetToken(token);
    if (!organizer) {
      throw new createHttpError.NotFound(OrganizerValidationMessages.NOT_FOUND);
    }
    if (
      organizer.resetTokenExpiration &&
      new Date(organizer.resetTokenExpiration).getTime() <= Date.now()
    ) {
      throw new createHttpError.Forbidden(ValidationMessages.TOKEN_EXPIRED);
    }

    organizer = await this.organizerRepository.findByEmail(
      organizer.email,
      false
    );

    return organizer;
  }

  /**
   * @function findAll
   * @description Get the list of all organizer
   * @param iFindAllOrganizerDto An object of type IFindAllOrganizerDto containing the query filters
   * @return Promise<{ organizer: Organizer[]; totalElements: number }>
   */
  public async findAll(
    iFindAllOrganizerDto: IFindAllOrganizerDto
  ): Promise<{ organizer: Organizer[]; totalElements: number }> {
    let organizer: Organizer[] = [];

    let totalElements = await this.organizerRepository.countAll();

    if (iFindAllOrganizerDto.size === -1) {
      organizer = await this.organizerRepository.findAll({
        sort: iFindAllOrganizerDto.sort,
      });
    } else {
      organizer = await this.organizerRepository.findAll({
        size: iFindAllOrganizerDto.size,
        sort: iFindAllOrganizerDto.sort,
        page: iFindAllOrganizerDto.page,
      });
    }

    return { organizer, totalElements };
  }

  /**
   * @function findOne
   * @description Get organizer by id
   * @param id The id of the organizer
   * @return Promise<Organizer>
   */
  public async findOne(id: string): Promise<Organizer> {
    return await this.getOrganizerById(id);
  }

  /**
   * @function findByEmail
   * @description Get organizer by email
   * @param email The email of the organizer
   * @return Promise<Organizer | null>
   */
  public async findByEmail(email: string): Promise<Organizer | null> {
    return await this.organizerRepository.findByEmail(email, true);
  }

  /**
   * @function findByResetPasswordRequestId
   * @description Get organizer by reset password request id
   * @param requestId The request id
   * @return Promise<Organizer | null>
   */
  public async findByResetPasswordRequestId(
    requestId: string
  ): Promise<Organizer | null> {
    return await this.organizerRepository.findByResetPasswordRequestId(
      requestId
    );
  }

  /**
   * @function createOrganizer
   * @description Create an organizer
   * @param iCreateOrganizerDto An object of type ICreateOrganizerDto containing the organizer account informations
   * @return Promise<Organizer>
   */
  public async createOrganizer(
    iCreateOrganizerDto: ICreateOrganizerDto
  ): Promise<Organizer> {
    const existingOrganizerWithEmail =
      await this.organizerRepository.findByEmail(
        iCreateOrganizerDto.email,
        false
      );
    if (existingOrganizerWithEmail) {
      throw new createHttpError.Forbidden(
        ValidationMessages.EMAIL_ALREADY_IN_USE
      );
    }

    const role = await this.roleService.findOne(
      iCreateOrganizerDto.roleId,
      false
    );

    const createOrganizerDto: CreateOrganizerDto = {
      email: iCreateOrganizerDto.email,
      lastName: iCreateOrganizerDto.lastName,
      firstName: iCreateOrganizerDto.firstName,
      companyName: iCreateOrganizerDto.companyName,
      companyAddress: iCreateOrganizerDto.companyAddress,
      companyNumber: GeneralHelpers.getPhoneNumber(
        iCreateOrganizerDto.companyNumber
      ),
      companyArea: iCreateOrganizerDto.companyArea,
      password: iCreateOrganizerDto.password,
      role,
    };
    let organizer = await this.organizerRepository.createOrganizer(
      createOrganizerDto
    );

    await this.roleService.addOrganizer(role.id, [organizer.id]);

    return this.getOrganizerById(organizer.id);
  }

  /**
   * @function updateOrganizer
   * @description Update an organizer account
   * @param iUpdateOrganizerDto An object of type IUpdateOrganizerDto containing the organizer account informations
   * @return Promise<Organizer>
   */
  public async updateOrganizer(
    iUpdateOrganizerDto: IUpdateOrganizerDto
  ): Promise<Organizer> {
    let organizer: any = await this.getOrganizerById(iUpdateOrganizerDto.id);

    const updateOrganizerDto: UpdateOrganizerDto = {
      id: iUpdateOrganizerDto.id,
      firstName: iUpdateOrganizerDto.firstName,
      lastName: iUpdateOrganizerDto.lastName,
      companyAddress: iUpdateOrganizerDto.companyAddress,
      companyName: iUpdateOrganizerDto.companyName,
      companyArea: iUpdateOrganizerDto.companyArea,
    };

    if (iUpdateOrganizerDto.companyNumber) {
      updateOrganizerDto.companyNumber = GeneralHelpers.getPhoneNumber(
        iUpdateOrganizerDto.companyNumber
      );
    }

    organizer = await this.organizerRepository.updateOrganizer(
      updateOrganizerDto
    );

    return organizer;
  }

  /**
   * @function updateOrganizerPassword
   * @description Update an organizer password
   * @param iUpdateOrganizerPasswordDto An object of type iUpdateOrganizerPasswordDto containing the organizer password
   * @return Promise<void>
   */
  public async updateOrganizerPassword(
    iUpdateOrganizerPasswordDto: IUpdateOrganizerPasswordDto
  ): Promise<void> {
    let organizer: any = await this.getOrganizerById(
      iUpdateOrganizerPasswordDto.id
    );

    if (!iUpdateOrganizerPasswordDto.password) {
      throw new createHttpError.Forbidden(
        ValidationMessages.PASSWORD_MUST_BE_PROVIDED
      );
    }

    const isEqual = await PasswordHelpers.comparePasswords(
      iUpdateOrganizerPasswordDto.oldPassword,
      organizer.password
    );

    if (!isEqual) {
      throw new createHttpError.Forbidden(
        ValidationMessages.INCORRECT_OLD_PASSWORD
      );
    }

    const updateOrganizerDto: UpdateOrganizerDto = {
      id: iUpdateOrganizerPasswordDto.id,
      password: iUpdateOrganizerPasswordDto.password,
    };
    await this.organizerRepository.updateOrganizer(updateOrganizerDto);

    return;
  }

  /**
   * TODO
   * @function resetOrganizerPassword
   * @description
   * @param iResetOrganizerPasswordDto
   * @return void
   */
  public async resetOrganizerPassword(
    iResetOrganizerPasswordDto: IResetOrganizerPasswordDto
  ): Promise<void> {
    const updateOrganizerDto: UpdateOrganizerDto = {
      id: iResetOrganizerPasswordDto.id,
      password: iResetOrganizerPasswordDto.password,
      resetPasswordRequestId: iResetOrganizerPasswordDto.resetPasswordRequestId,
    };
    await this.organizerRepository.updateOrganizer(updateOrganizerDto);

    return;
  }

  /**
   * TODO
   * @function generateResetPasswordToken
   * @description
   * @param id
   * @return Promise<Organizer | null>
   */
  public async generateResetPasswordToken(
    id: string
  ): Promise<Organizer | null> {
    return await this.organizerRepository.generateResetPasswordToken(id);
  }

  /**
   * TODO
   * @function getOrganizerById
   * @description
   * @param id
   * @return
   */
  private async getOrganizerById(id: string): Promise<Organizer> {
    const organizer = await this.organizerRepository.getOrganizerById(id);
    if (!organizer) {
      throw new createHttpError.NotFound(OrganizerValidationMessages.NOT_FOUND);
    }
    return organizer;
  }
}
