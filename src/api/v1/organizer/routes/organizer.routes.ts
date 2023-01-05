import { Request, Response, NextFunction, Router } from "express";

import { body } from "express-validator";

import OrganizerController from "../controllers/organizer.controller";

import { ValidationMessages } from "../../../../validations/validation";

import EnvironmentConfigs from "../../../../configs/environments";

export default function OrganizerRoutes(organizerController: OrganizerController) {
  const router = Router();

  /**
   * @swaggers
   * tags:
   *   name: Organizers
   */

  /**
   * @swagger
   * /api/v1/organizers/get-by-reset-password-token/{token}:
   *   get:
   *     summary: Récupérer un organizers par son token de réinitialisation de mot de passe
   *     tags: [Organizers]
   *     parameters:
   *       - in: path
   *         name: token
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
   *                      Organizer:
   *                        $ref: '#/components/schemas/Organizer'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Organizer successfully found.
   *       403:
   *         description: Token expired.
   *       404:
   *         description: Organizer not found.
   *       500:
   *         description: Erreur server
   */
  router.post(
    "/get-by-reset-password-token/:token",
    (req: Request, res: Response, next: NextFunction) =>
    organizerController.getOrganizerByResetToken(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/organizers/current:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     summary: Récupérer les données du compte de l'organisateur connecté
   *     tags: [Organizers]
   *     responses:
   *       200:
   *         description: Connected organizers found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  data:
   *                    type: object
   *                    properties:
   *                      organizers:
   *                        $ref: '#/components/schemas/Organizers'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Connected organizers found.
   *       401:
   *         description: Unauthorization or expire token.
   *       404:
   *         description: organizers not found.
   *       500:
   *         description: Erreur server
   */
  router.get("/current", (req: Request, res: Response, next: NextFunction) =>
  organizerController.getConnectedOrganizer(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/organizers/current:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     summary: Modifier le compte de l'organisateur connecté
   *     tags: [Organizers]
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
   *                 example: organizer@manager-event.com
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
    "/current",
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
    organizerController.updateConnectedOrganizer(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/organizers/current/update-password:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     summary: Changer le mot de passe de l'organisateur connecté
   *     tags: [Organizers]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               oldPassword:
   *                 type: string
   *                 example: e§udzyi12sCsqdiè#eg!fuif
   *               password:
   *                 type: string
   *                 example: e§udzyi12sCsqdiè#eg!
   *               confirmPassword:
   *                 type: string
   *                 example: e§udzyi12sCsqdiè#eg!
   *     responses:
   *       201:
   *         description: Organizer password successfully updated.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Organizer password successfully updated.
   *       403:
   *         description: Password must be provided. / Incorrect old password.
   *       404:
   *         description: Organizers not found.
   *       422:
   *         description: Erreur de validation des champs.
   *       500:
   *         description: Erreur server
   */
  router.put(
    "/current/update-password",
    [
      body("oldPassword")
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
    organizerController.updateOrganizerConnectedPassword(req, res, next)
  );

  return router;
}
