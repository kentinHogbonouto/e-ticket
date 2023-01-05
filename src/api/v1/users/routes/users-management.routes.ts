import { Request, Response, NextFunction, Router } from "express";

import { body } from "express-validator";

import UsersManagementController from "../controllers/users-management.controller";

import { ValidationMessages } from "../../../../validations/validation";

import EnvironmentConfigs from "../../../../configs/environments";

export default function UsersManagementRoutes(
  usersManagementController: UsersManagementController
) {
  const router = Router();

  /**
   * @swaggers
   * tags:
   *   name: Users Management
   */

  /**
   * @swagger
   * /api/v1/managements/users:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     summary: Récupérer la liste des utilisateurs
   *     tags: [Users Management]
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
   *         description: Users successfully found.
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
   *                           $ref: '#/components/schemas/Users'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Users successfully found.
   *       401:
   *         description: You have not authenticated.
   *       500:
   *         description: Erreur server
   */
  router.get("/", (req: Request, res: Response, next: NextFunction) =>
    usersManagementController.findAll(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/managements/users/{id}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     summary: Récupérer les données du compte d'un utilisateur
   *     tags: [Users Management]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *     responses:
   *       200:
   *         description: User successfully found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  data:
   *                    type: object
   *                    properties:
   *                      user:
   *                        $ref: '#/components/schemas/User'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: User successfully found.
   *       401:
   *         description: You have not authenticated.
   *       404:
   *         description: User not found.
   *       500:
   *         description: Erreur server
   */
  router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
    usersManagementController.findOne(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/managements/users:
   *   post:
   *     summary: Créer le compte d'un utilisateur
   *     tags: [Users Management]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               lastName:
   *                 type: string
   *                 example: Doe
   *               firstName:
   *                 type: string
   *                 example: John
   *               email:
   *                 type: string
   *                 example: Doe@john.com
   *               password:
   *                 type: string
   *                 example: e§udzyi12sCsqdiè#eg!
   *               confirmPassword:
   *                 type: string
   *                 example: e§udzyi12sCsqdiè#eg!
   *     responses:
   *       201:
   *         description: User successfully created.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  data:
   *                    type: object
   *                    properties:
   *                      user:
   *                        $ref: '#/components/schemas/User'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: User successfully created.
   *       401:
   *         description: You have not authenticated.
   *       403:
   *         description: Email address already in use.
   *       404:
   *         description: Role not found
   *       422:
   *         description: Erreur de validation des champs.
   *       500:
   *         description: Erreur server
   */
  router.post(
    "/",
    [
      body(["lastName", "firstName", "email", "password", "confirmPassword"])
        .not()
        .isEmpty()
        .withMessage({
          message: ValidationMessages.FIELD_REQUIRED,
          errorCode: 0,
        }),
    ],
    (req: Request, res: Response, next: NextFunction) =>
      usersManagementController.create(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/managements/users/{id}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     summary: Modifier le compte d'un utilisateur
   *     tags: [Users Management]
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
   *               email:
   *                 type: string
   *                 example: admin@cdv.com
   *               firstName:
   *                 type: string
   *                 example: john.doe
   *               lastName:
   *                 type: string
   *                 example: john.doe
   *     responses:
   *       201:
   *         description: User successfully updated.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  data:
   *                    type: object
   *                    properties:
   *                      user:
   *                        $ref: '#/components/schemas/User'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: User successfully updated.
   *       401:
   *         description: You have not authenticated.
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
      body(["lastName", "firstName", "email"])
        .optional({ nullable: true })
        .not()
        .isEmpty()
        .withMessage({
          message: ValidationMessages.FIELD_REQUIRED,
          errorCode: 0,
        }),
    ],
    (req: Request, res: Response, next: NextFunction) =>
      usersManagementController.update(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/managements/users/{id}/update-role:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     summary: Modifier le rôle d'un utilisateur
   *     tags: [Users Management]
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
   *               roleId:
   *                 type: string
   *                 example: 610299a5f4723947e8e9fd95
   *     responses:
   *       201:
   *         description: Admin role successfully updated.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  data:
   *                    type: object
   *                    properties:
   *                      admin:
   *                        $ref: '#/components/schemas/Admin'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Admin role successfully updated.
   *       401:
   *         description: You have not authenticated.
   *       403:
   *         description: Role id must be provided.
   *       404:
   *         description: Admin not found. / Role not found.
   *       422:
   *         description: Erreur de validation des champs.
   *       500:
   *         description: Erreur server
   */
  router.put(
    "/:id/update-role",
    [
      body("roleId").not().isEmpty().withMessage({
        message: ValidationMessages.FIELD_REQUIRED,
        errorCode: 0,
      }),
    ],
    (req: Request, res: Response, next: NextFunction) =>
      usersManagementController.updateRole(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/managements/users/{id}/update-password:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     summary: Changer le mot de passe d'un 'administrateur
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *     tags: [Users Management]
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
   *         description: Admin password successfully updated.
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
   *                    example: Admin password successfully updated.
   *       403:
   *         description: Password must be provided. / Incorrect old password.
   *       404:
   *         description: User not found.
   *       422:
   *         description: Erreur de validation des champs.
   *       500:
   *         description: Erreur server
   */
  router.put(
    "/:id/update-password",
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
      usersManagementController.updatePassword(req, res, next)
  );

  return router;
}
