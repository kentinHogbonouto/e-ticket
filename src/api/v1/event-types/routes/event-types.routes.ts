import { Response, Request, NextFunction, Router } from "express";

import { EventTypesValidationMessage } from "../validations/event-types.validations";

import EventTypesController from "../controllers/event-types.controller";

import { body } from "express-validator";


export default function EventTypesRoutes(eventTypesController: EventTypesController) {
  const router = Router();

  /**
   * @swagger
   * tags:
   *   name: Event Type Management
   */

  /**
   * @swagger
   * /api/v1/managements/events-types:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     summary: Recupérer la liste des types evenements
   *     tags: [Event Type Management]
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
   *         description: Event type successfully found.
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
   *                        EventTypes:
   *                           $ref: '#/components/schemas/EventTypes'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Event type successfully found.
   *       401:
   *         description: Unaithorized.
   *       500:
   *         description: Erreur serveur
   */
   router.get("/", (req: Request, res: Response, next: NextFunction) =>
   eventTypesController.findAll(req, res, next)
 );

 /**
  * @swagger
  * /api/v1/managements/events-types/{id}:
  *   get:
  *     security:
  *       - bearerAuth: []
  *     summary: Recupérer les données d'un type evenement
  *     tags: [Event Type Management]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *           required: true
  *     responses:
  *       200:
  *         description: Event type successfully found.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                  data:
  *                    type: object
  *                    properties:
  *                      EventTypes:
  *                        $ref: '#/components/schemas/EventTypes'
  *                  success:
  *                    type: boolean
  *                    example: true
  *                  message:
  *                    type: string
  *                    example: Event successfully found.
  *       401:
  *         description: Unthorized
  *       404:
  *         description: Event type not found.
  *       500:
  *         description: Erreur server
  */
 router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
 eventTypesController.findOne(req, res, next)
 );

 /**
  * @swagger
  * /api/v1/managements/events-types:
  *   post:
  *     security:
  *       - bearerAuth: []
  *     summary: Créer un evenement
  *     tags: [Event Type Management]
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
  *                example: Spertacle
  *     responses:
  *       201:
  *         description: Event types successufully created.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                  data:
  *                    type: object
  *                    properties:
  *                      EventTypes:
  *                        $ref: '#/components/schemas/EventTypes'
  *                  success:
  *                    type: boolean
  *                    example: true
  *                  message:
  *                    type: string
  *                    example: Event types successufully created.
  *       401:
  *         description: Unauthorized.
  *       422:
  *         description: Erreur de validation
  *       500:
  *         description: Erreur serveur
  */
 router.post(
   "/",
   [
     body([
       "name"
     ])
       .not()
       .isEmpty()
       .withMessage({
         message: EventTypesValidationMessage.FIELD_REQUIRED,
         errorCode: 0,
       }),
   ],
   (req: Request, res: Response, next: NextFunction) =>
   eventTypesController.create(req, res, next)
 );

 /**
  * @swagger
  * /api/v1/managements/events-types/{id}:
  *   put:
  *     security:
  *       - bearerAuth: []
  *     summary: Modifier un type d'évènement
  *     tags: [Event Type Management]
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
  *                 example: soirée gala
  *     responses:
  *       201:
  *         description: Event type successfully updated.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                  data:
  *                    type: object
  *                    properties:
  *                      EventTypes:
  *                        $ref: '#/components/schemas/EventTypes'
  *                  success:
  *                    type: boolean
  *                    example: true
  *                  message:
  *                    type: string
  *                    example: Event type successfully updated.
  *       401:
  *         description: Unautorized.
  *       404:
  *         description: Event type not found.
  *       422:
  *         description: Erreur de validation
  *       500:
  *         description: erreur serveur
  */
 router.put(
   "/:id",
   [
     body([
      "name"
     ]).not().isEmpty().withMessage({
       message: EventTypesValidationMessage.FIELD_REQUIRED,
       errorCode: 0,
     }),
   ],
   (req: Request, res: Response, next: NextFunction) =>
   eventTypesController.update(req, res, next)
 );

 /**
  * @swagger
  * /api/v1/managements/event-coupon/{id}:
  *   delete:
  *     summary: Supprimer un type d'evenement
  *     tags: [Event Type Management]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *           required: true
  *     responses:
  *       200:
  *         description: Event type successfully delete
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 EventCoupon:
  *                   $ref: '#/components/schemas/EventTypes'
  *       403:
  *         description: Vous n'ête pas autorisé à effectuer cette action
  *       404:
  *         description: Coupon introuvable
  *       500:
  *         description: Erreur serveur
  */
 router.delete("/:id", (req: Request, res: Response, next: NextFunction) =>
 eventTypesController.delete(req, res, next)
 );

  return router;
}
