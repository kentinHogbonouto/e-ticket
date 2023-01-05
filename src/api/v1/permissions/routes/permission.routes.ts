import { Response, Request, NextFunction, Router } from "express";

import { body } from "express-validator";

import PermissionController from "../controllers/permission.controller";

import { ValidationMessages } from "../../../../validations/validation";

export default function PermissionsRoutes(
  permissionController: PermissionController
) {
  const router = Router();

  /**
   * @swagger
   * tags:
   *   name: Permissions Management
   */

  /**
   * @swagger
   * /api/v1/permissions:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     summary: Recupérer la liste des permissions
   *     tags: [Permissions Management]
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
   *         description: Permissions successfully found.
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
   *                           $ref: '#/components/schemas/Permission'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Permissions successfully found.
   *       401:
   *         description: You have not authenticated.
   *       500:
   *         description: Erreur serveur
   */
  router.get("/", (req: Request, res: Response, next: NextFunction) =>
    permissionController.findAll(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/permissions/{id}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     summary: Recupérer les données d'une permission
   *     tags: [Permissions Management]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           required: true
   *     responses:
   *       200:
   *         description: Permission successfully found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  data:
   *                    type: object
   *                    properties:
   *                      permission:
   *                        $ref: '#/components/schemas/Permission'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Permission successfully found.
   *       401:
   *         description: You have not authenticated.
   *       404:
   *         description: Permission not found.
   *       500:
   *         description: Erreur server
   */
  router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
    permissionController.findOne(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/permissions:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     summary: Créer une permission
   *     tags: [Permissions Management]
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
   *                example: CAN_DELETE_SCHOOL
   *     responses:
   *       201:
   *         description: Permission successufully created.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  data:
   *                    type: object
   *                    properties:
   *                      permission:
   *                        $ref: '#/components/schemas/Permission'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Permission successufully created.
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
      permissionController.create(req, res, next)
  );

  // /**
  //  * @swagger
  //  * /api/v1/permissions/{id}:
  //  *   put:
  //  *     security:
  //  *       - bearerAuth: []
  //  *     summary: Modifier une permission
  //  *     tags: [Permissions Management]
  //  *     parameters:
  //  *       - in: path
  //  *         name: id
  //  *         schema:
  //  *           type: string
  //  *         riquired: true
  //  *     requestBody:
  //  *       required: true
  //  *       content:
  //  *         application/json:
  //  *           schema:
  //  *             type: object
  //  *             properties:
  //  *               name:
  //  *                 type: string
  //  *                 example: CAN_UPLOAD_RESSOURCE
  //  *     responses:
  //  *       201:
  //  *         description: Permission successfully updated.
  //  *         content:
  //  *           application/json:
  //  *             schema:
  //  *               type: object
  //  *               properties:
  //  *                  data:
  //  *                    type: object
  //  *                    properties:
  //  *                      permission:
  //  *                        $ref: '#/components/schemas/Permission'
  //  *                  success:
  //  *                    type: boolean
  //  *                    example: true
  //  *                  message:
  //  *                    type: string
  //  *                    example: Permission successfully updated.
  //  *       401:
  //  *         description: You have not authenticated.
  //  *       404:
  //  *         description: Permission not found.
  //  *       422:
  //  *         description: Erreur de validation
  //  *       500:
  //  *         description: erreur serveur
  //  */
  // router.put(
  //   "/:id",
  //   [
  //     body("name").not().isEmpty().withMessage({
  //       message: ValidationMessages.FIELD_REQUIRED,
  //       errorCode: 0,
  //     }),
  //   ],
  //   (req: Request, res: Response, next: NextFunction) =>
  //     permissionController.update(req, res, next)
  // );

  /**
   * @swagger
   * /api/v1/permission/{id}:
   *   delete:
   *     summary: Supprimer une permission
   *     tags: [Permissions Management]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           required: true
   *     responses:
   *       200:
   *         description: Permission successfully delete
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 permission:
   *                   $ref: '#/components/schemas/Permission'
   *       403:
   *         description: Vous n'ête pas autorisé à effectuer cette action
   *       404:
   *         description: Permission introuvable
   *       500:
   *         description: Erreur serveur
   */
  router.delete("/:id", (req: Request, res: Response, next: NextFunction) =>
    permissionController.delete(req, res, next)
  );

  return router;
}
