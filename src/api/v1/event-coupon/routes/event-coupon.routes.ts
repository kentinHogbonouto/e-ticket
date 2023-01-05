import { Response, Request, NextFunction, Router } from "express";

import { EventCouponValidationMessage } from "../validations/event-coupon.validations";

import EventCouponController from "../controllers/event-coupon.controller";

import { body } from "express-validator";


export default function EventCouponRoutes(eventCouponController: EventCouponController) {
  const router = Router();

  /**
   * @swagger
   * tags:
   *   name: Event coupon Management
   */

  /**
   * @swagger
   * /api/v1/managements/events-coupon:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     summary: Recupérer la liste des tickets d'un evenements
   *     tags: [Event coupon Management]
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
   *         description: Event coupon successfully found.
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
   *                        EventCoupon:
   *                           $ref: '#/components/schemas/EventCoupon'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Event coupon successfully found.
   *       401:
   *         description: Unaithorized.
   *       500:
   *         description: Erreur serveur
   */
   router.get("/", (req: Request, res: Response, next: NextFunction) =>
   eventCouponController.findAll(req, res, next)
 );

 /**
  * @swagger
  * /api/v1/managements/events-coupon/{id}:
  *   get:
  *     security:
  *       - bearerAuth: []
  *     summary: Recupérer les données du coupon d'evenement
  *     tags: [Event coupon Management]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *           required: true
  *     responses:
  *       200:
  *         description: Event coupon successfully found.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                  data:
  *                    type: object
  *                    properties:
  *                      EventCoupon:
  *                        $ref: '#/components/schemas/EventCoupon'
  *                  success:
  *                    type: boolean
  *                    example: true
  *                  message:
  *                    type: string
  *                    example: Event coupon successfully found.
  *       401:
  *         description: Unthorized
  *       404:
  *         description: Event coupon not found.
  *       500:
  *         description: Erreur server
  */
 router.get("/:id", (req: Request, res: Response, next: NextFunction) =>
 eventCouponController.findOne(req, res, next)
 );

 /**
  * @swagger
  * /api/v1/managements/events-coupon:
  *   post:
  *     security:
  *       - bearerAuth: []
  *     summary: Créer un ticket d'évènement
  *     tags: [Event coupon Management]
  *     requestBody:
  *      required: true
  *      content:
  *        application/json:
  *          schema:
  *            type: object
  *            properties:
  *              formuleName:
  *                type: string
  *                required: true
  *                example: Ticket gratuit
  *              formuleQuantity:
  *                type: number
  *                required: true
  *                example: 50
  *              formuleMatricule:
  *                type: string
  *                required: true
  *                example: PMXW50236LT
  *              totalCoupons:
  *                type: number
  *                required: true
  *                example: 1500
  *     responses:
  *       201:
  *         description: Event coupon successufully created.
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                  data:
  *                    type: object
  *                    properties:
  *                      EventCoupon:
  *                        $ref: '#/components/schemas/EventCoupon'
  *                  success:
  *                    type: boolean
  *                    example: true
  *                  message:
  *                    type: string
  *                    example: Event coupon successufully created.
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
       "formuleQuantity",
       "event"
     ])
       .not()
       .isEmpty()
       .withMessage({
         message: EventCouponValidationMessage.FIELD_REQUIRED,
         errorCode: 0,
       }),
   ],
   (req: Request, res: Response, next: NextFunction) =>
   eventCouponController.create(req, res, next)
 );

 /**
   * @swagger
   * /api/v1/events/{id}:
   *   put:
   *     security:
   *       - bearerAuth: []
   *     summary: Modifier un cours
   *     tags: [Event Management]
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
   *               formuleQuantity:
   *                 type: string
   *                 example: 120
   *     responses:
   *       201:
   *         description: Event successfully updated.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  data:
   *                    type: object
   *                    properties:
   *                      EventCoupon:
   *                        $ref: '#/components/schemas/EventCoupon'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Event coupon successfully updated.
   *       401:
   *         description: Unautorized.
   *       404:
   *         description: Event coupon not found.
   *       422:
   *         description: Erreur de validation
   *       500:
   *         description: erreur serveur
   */
  router.put(
    "/:id",
    [
      body(["formuleQuantity"])
        .not()
        .isEmpty()
        .withMessage({
          message: EventCouponValidationMessage.FIELD_REQUIRED,
          errorCode: 0,
        }),
    ],
    (req: Request, res: Response, next: NextFunction) =>
    eventCouponController.update(req, res, next)
  );

  return router;
}
