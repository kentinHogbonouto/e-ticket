import { body } from "express-validator";
import { Request, Response, NextFunction, Router } from "express";

import RoleController from "../controllers/role.controller";

import { ValidationMessages } from "../../../../validations/validation";

export default function RolesRoutes(roleController: RoleController) {
  const router = Router();

  /**
   * @swagger
   * tags:
   *   name: Roles Management
   */

  /**
   * @swagger
   * /api/v1/roles:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     summary: Recupérer la liste des roles
   *     tags: [Roles Management]
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
   *         description: Roles successfully found.
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
   *                           $ref: '#/components/schemas/Role'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Roles successfully found.
   *       401:
   *         description: You have not authenticated.
   *       500:
   *         description: Erreur serveur
   */
  router.get("/", (req: Request, res: Response, next: NextFunction) =>
    roleController.findAll(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/roles/{id}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     summary: Recupérer les données d'un role
   *     tags: [Roles Management]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           required: true
   *     responses:
   *       200:
   *         description: Role successfully found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  data:
   *                    type: object
   *                    properties:
   *                      role:
   *                        $ref: '#/components/schemas/Role'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Role successfully found.
   *       401:
   *         description: You have not authenticated.
   *       404:
   *         description: Role not found.
   *       500:
   *         description: Erreur server
   */
  router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
    roleController.findOne(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/roles:
   *   post:
   *     summary: Créer un role
   *     tags: [Roles Management]
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            type: object
   *            properties:
   *              name:
   *                type: string
   *                required: true
   *                example: ADMIN
   *     responses:
   *       201:
   *         description: Role successufully created.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  data:
   *                    type: object
   *                    properties:
   *                      role:
   *                        $ref: '#/components/schemas/Role'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Role successufully created.
   *       401:
   *         description: You have not authenticated.
   *       422:
   *         description: Erreur de validation
   *       500:
   *         description: Erreur serveur
   */
  router.post(
    "/",
    [
      body("name").not().isEmpty().withMessage({
        message: ValidationMessages.FIELD_REQUIRED,
        errorCode: 0,
      }),
    ],
    (req: Request, res: Response, next: NextFunction) =>
      roleController.create(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/roles/{id}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     summary: Modifier un role
   *     tags: [Roles Management]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         riquired: true
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 example: ADMIN
   *     responses:
   *       201:
   *         description: Role successfully updated.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  data:
   *                    type: object
   *                    properties:
   *                      role:
   *                        $ref: '#/components/schemas/Role'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Role successfully updated.
   *       401:
   *         description: You have not authenticated.
   *       404:
   *         description: Role not found.
   *       422:
   *         description: Erreur de validation
   *       500:
   *         description: erreur serveur
   */
  router.put(
    "/:id",
    [
      body("name").not().isEmpty().withMessage({
        message: ValidationMessages.FIELD_REQUIRED,
        errorCode: 0,
      }),
    ],
    (req: Request, res: Response, next: NextFunction) =>
      roleController.update(req, res, next)
  );

  return router;
}
