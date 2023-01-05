import { Request, Response, NextFunction, Router } from "express";

import { body } from "express-validator";

import OrganizerManagementController from "../controllers/organizer-management.controller";

import { ValidationMessages } from "../../../../validations/validation";

import EnvironmentConfigs from "../../../../configs/environments";

export default function OrganizerManagementRoutes(
  organizerManagementController: OrganizerManagementController
) {
  const router = Router();

  /**
   * @swaggers
   * tags:
   *   name: Organizer Management
   */

  /**
   * @swagger
   * /api/v1/managements/organizers:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     summary: Récupérer la liste des organisateurs
   *     tags: [Organizer Management]
   *     parameters:
   *       - name: page
   *         in: query
   *         required: false
   *         schema:
   *           type: number
   *       - name: size
   *         in: query
   *         required: false
   *         schema:
   *           type: number
   *       - name: sort
   *         in: query
   *         required: false
   *         schema:
   *           type: string
   *           enum:
   *           - asc
   *           - desc
   *     responses:
   *       200:
   *         description: Organizer successfully found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  data:
   *                    type: object
   *                    properties:
   *                      perPage:
   *                        type: number
   *                        example: 20
   *                      totalElements:
   *                        type: number
   *                        example: 30
   *                      currentPage:
   *                        type: number
   *                        example: 1
   *                      hasPreviousPage:
   *                        type: boolean
   *                        example: false
   *                      previousPage:
   *                        type: number
   *                        example: 0
   *                      hasNextPage:
   *                        type: boolean
   *                        example: true
   *                      nextPage:
   *                        type: number
   *                        example: 2
   *                      totalPages:
   *                        type: number
   *                        example: 2
   *                      items:
   *                        type: array
   *                        items:
   *                           $ref: '#/components/schemas/Organizer'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Organizer successfully found.
   *       401:
   *         description: Unauthorized.
   *       500:
   *         description: Erreur server
   */
  router.get("/", (req: Request, res: Response, next: NextFunction) =>
  organizerManagementController.getAllOrganizers(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/managements/organizers/{id}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     summary: Récupérer les données du compte d'un organisateur
   *     tags: [Organizer Management]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *     responses:
   *       200:
   *         description: Organizer successfully found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  data:
   *                    type: object
   *                    properties:
   *                      organizer:
   *                        $ref: '#/components/schemas/Organizer'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: organizer successfully found.
   *       401:
   *         description: Unauthorized.
   *       404:
   *         description: Organizer not found.
   *       500:
   *         description: Erreur server
   */
  router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
  organizerManagementController.getOrganizer(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/managements/organizers:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     summary: Créer un compte organisateur
   *     tags: [Organizer Management]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               lastName:
   *                 type: string
   *                 example: John
   *               firstName:
   *                 type: string
   *                 example: Doe
   *               email:
   *                 type: string
   *                 example: organizer@manger-event.com
   *               companyName:
   *                 type: string
   *                 example:  eventManagaprod
   *               companyAddress:
   *                 type: string
   *                 example: 44, rue place des matyre
   *               companyNumber:
   *                 type: string
   *                 example: +229 62 85 96 10 / +1 819 5555555 / +254 789 651230
   *               companyArea:
   *                 type: string
   *                 example: spectacle estudiantine
   *               password:
   *                 type: string
   *                 example: e§udzyi12sCsqdiè#eg!
   *               confirmPassword:
   *                 type: string
   *                 example: e§udzyi12sCsqdiè#eg!
   *     responses:
   *       201:
   *         description: Organizer successfully created.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  data:
   *                    type: object
   *                    properties:
   *                      organizer:
   *                        $ref: '#/components/schemas/Organizer'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Organizer successfully created.
   *       401:
   *         description: Unauthorized.
   *       403:
   *         description: Email address already in use.
   *       422:
   *         description: Erreur de validation des champs.
   *       500:
   *         description: Erreur server
   */
  router.post(
    "/",
    [
      body("lastName").not().isEmpty().withMessage({
        message: ValidationMessages.FIELD_REQUIRED,
        errorCode: 0,
      }),
      body("firstName").not().isEmpty().withMessage({
        message: ValidationMessages.FIELD_REQUIRED,
        errorCode: 0,
      }),
      body("email")
        .not()
        .isEmpty()
        .withMessage({
          message: ValidationMessages.FIELD_REQUIRED,
          errorCode: 0,
        })
        .isEmail()
        .withMessage({
          message: ValidationMessages.INVALID_EMAIL_ADDRESS,
          errorCode: 8,
        })
        .normalizeEmail({ gmail_remove_dots: false }),
      body("password")
        .trim()
        .not()
        .isEmpty()
        .withMessage({
          message: ValidationMessages.FIELD_REQUIRED,
          errorCode: 0,
        })
        .isLength({ min: EnvironmentConfigs.getPasswordMinLength() })
        .withMessage({
          message: ValidationMessages.lengthConstraintsFailed({
            min: EnvironmentConfigs.getPasswordMinLength(),
          }),
          errorCode: 3,
        }),
      body("companyName").not().isEmpty().withMessage({
        message: ValidationMessages.FIELD_REQUIRED,
        errorCode: 0,
      }),
      body("companyAddress").not().isEmpty().withMessage({
        message: ValidationMessages.FIELD_REQUIRED,
        errorCode: 0,
      }),
      body("companyNumber").not().isEmpty().withMessage({
        message: ValidationMessages.FIELD_REQUIRED,
        errorCode: 0,
      }),
      body("companyArea").not().isEmpty().withMessage({
        message: ValidationMessages.FIELD_REQUIRED,
        errorCode: 0,
      }),
      body("confirmPassword")
        .trim()
        .not()
        .isEmpty()
        .withMessage({
          message: ValidationMessages.FIELD_REQUIRED,
          errorCode: 0,
        })
        .custom((value, { req }) =>
          ValidationMessages.isPasswordConfirmationMatch(
            value,
            req.body.password
          )
        ),
    ],
    (req: Request, res: Response, next: NextFunction) =>
    organizerManagementController.createOrganizer(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/managements/organizers/{id}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     summary: Modifier le compte d'un organisateur
   *     tags: [Organizer Management]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               lastName:
   *                 type: string
   *                 example: John
   *               firstName:
   *                 type: string
   *                 example: Doe
   *               email:
   *                 type: string
   *                 example: organizer@manger-event.com
   *               companyName:
   *                 type: string
   *                 example: eventManagaprod
   *               companyAddress:
   *                 type: string
   *                 example: 44, rue place des matyre
   *               companyNumber:
   *                 type: string
   *                 example: +229 62 85 96 10 / +1 819 5555555 / +254 789 651230
   *               companyArea:
   *                 type: string
   *                 example: spectacle estudiantine
   *     responses:
   *       201:
   *         description: Organizer successfully updated.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  data:
   *                    type: object
   *                    properties:
   *                      organizer:
   *                        $ref: '#/components/schemas/Organizer'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Organizer successfully updated.
   *       401:
   *         description: Unauthorized.
   *       403:
   *         description: Email address already in use.
   *       422:
   *         description: Erreur de validation des champs.
   *       500:
   *         description: Erreur server
   */
  router.put(
    "/:id",
    [
      body("lastName")
        .optional({ nullable: true })
        .not()
        .isEmpty()
        .withMessage({
          message: ValidationMessages.FIELD_REQUIRED,
          errorCode: 0,
        }),
      body("firstName")
        .optional({ nullable: true })
        .not()
        .isEmpty()
        .withMessage({
          message: ValidationMessages.FIELD_REQUIRED,
          errorCode: 0,
        }),
      body("email")
        .optional({ nullable: true })
        .not()
        .isEmpty()
        .withMessage({
          message: ValidationMessages.FIELD_REQUIRED,
          errorCode: 0,
        })
        .isEmail()
        .withMessage({
          message: ValidationMessages.INVALID_EMAIL_ADDRESS,
          errorCode: 8,
        })
        .normalizeEmail({ gmail_remove_dots: false }),
      body("companyName")
        .optional({ nullable: true })
        .not()
        .isEmpty()
        .withMessage({
          message: ValidationMessages.FIELD_REQUIRED,
          errorCode: 0,
        }),
      body("companyAddress")
        .optional({ nullable: true })
        .not()
        .isEmpty()
        .withMessage({
          message: ValidationMessages.FIELD_REQUIRED,
          errorCode: 0,
        }),
      body("companyNumber")
        .optional({ nullable: true })
        .not()
        .isEmpty()
        .withMessage({
          message: ValidationMessages.FIELD_REQUIRED,
          errorCode: 0,
        }),
      body("companyArea")
        .optional({ nullable: true })
        .not()
        .isEmpty()
        .withMessage({
          message: ValidationMessages.FIELD_REQUIRED,
          errorCode: 0,
        }),
    ],
    (req: Request, res: Response, next: NextFunction) =>
    organizerManagementController.updateOrganizer(req, res, next)
  );

  return router;
}
