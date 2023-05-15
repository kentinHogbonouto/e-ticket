import { Response, Request, NextFunction, Router } from "express";

import { EventValidationMessage } from "../validations/event.validations";

import EventController from "../controllers/event.controller";

import { body } from "express-validator";

import FilesHelpers from "../../../../helpers/files.helper"

import { join, extname } from "path";
import multer from "multer";

const uploadPath = join(process.cwd(), "upload", "images");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (
      ["image/jpeg", "image/png", "image/jpg", "image/jpeg"].includes(
        file.mimetype
      )
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});


export default function EventRoutes(eventController: EventController) {
  const router = Router();

  /**
   * @swagger
   * tags:
   *   name: Event Management
   */

  /**
   * @swagger
   * /api/v1/events:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     summary: Recupérer la liste des evenements
   *     tags: [Event Management]
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
   *         description: Event successfully found.
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
   *                        Event:
   *                           $ref: '#/components/schemas/Event'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Event successfully found.
   *       401:
   *         description: Unaithorized.
   *       500:
   *         description: Erreur serveur
   */
  router.get(
    "/",
    (req: Request, res: Response, next: NextFunction) =>
      eventController.findAll(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/events/{id}:
   *   get:
   *     security:
   *       - bearerAuth: []
   *     summary: Recupérer les données d'un evenement
   *     tags: [Event Management]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           required: true
   *     responses:
   *       200:
   *         description: Event successfully found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  data:
   *                    type: object
   *                    properties:
   *                      Event:
   *                        $ref: '#/components/schemas/Event'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Event successfully found.
   *       401:
   *         description: Unthorized
   *       404:
   *         description: Event not found.
   *       500:
   *         description: Erreur server
   */
  router.get(
    "/:id",
    (req: Request, res: Response, next: NextFunction) =>
      eventController.findOne(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/managements/events:
   *   post:
   *     security:
   *       - bearerAuth: []
   *     summary: Créer un evenement
   *     tags: [Event Management]
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
   *                example: Concert dadju
   *              shortDescription:
   *                type: string
   *                required: true
   *                example: Lorem ipsum indolor
   *              type:
   *                type: string
   *                required: true
   *                example: spertacle estudiantine
   *              theme:
   *                type: string
   *                required: true
   *                example: Le show de l'année
   *              place:
   *                type: string
   *                required: true
   *                example: Stade GMK
   *              categorie:
   *                type: string
   *                required: true
   *                example: Evenement publique
   *              startDate:
   *                type: Date
   *                required: true
   *                example: 28-10-2022
   *              startTime:
   *                type: string
   *                required: true
   *                example: 18:00
   *              endDate:
   *                type: Date
   *                required: true
   *                example: 31-10-2022
   *              endTime:
   *                type: string
   *                required: true
   *                example: 04:00am
   *     responses:
   *       201:
   *         description: Event successufully created.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                  data:
   *                    type: object
   *                    properties:
   *                      Event:
   *                        $ref: '#/components/schemas/Event'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Event successufully created.
   *       401:
   *         description: Unauthorized.
   *       422:
   *         description: Erreur de validation
   *       500:
   *         description: Erreur serveur
   */
  router.post(
    "/",
    upload.single("picture"),
    [
      body([
        "name",
        "shortDescription",
        "type",
        "theme",
        "place",
        "categorie",
        "startDate",
        "endDate",
        "startTime",
        "endTime",
      ])
        .not()
        .isEmpty()
        .withMessage({
          message: EventValidationMessage.FIELD_REQUIRED,
          errorCode: 0,
        }),
    ],
    (req: Request, res: Response, next: NextFunction) =>
      eventController.create(req, res, next)
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
   *               name:
   *                 type: string
   *                 example: Concert dadju
   *               shortDescription:
   *                 type: string
   *                 example: lorem ipsum indolor
   *               type:
   *                 type: string
   *                 example: spertacle sestudiantine
   *               theme:
   *                 type: string
   *                 example: Le concert de l'année
   *               place:
   *                 type: string
   *                 example: Stade GMK
   *               categorie:
   *                 type: string
   *                 example: Evenement publique
   *               startDate:
   *                 type: Date
   *                 example: 2022-10-28
   *               endDate:
   *                 type: Date
   *                 example: 2022-10-31
   *               startTime:
   *                 type: string
   *                 example: 18:00pm
   *               endTime:
   *                 type: string
   *                 example: 04:00am
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
   *                      Event:
   *                        $ref: '#/components/schemas/Event'
   *                  success:
   *                    type: boolean
   *                    example: true
   *                  message:
   *                    type: string
   *                    example: Event successfully updated.
   *       401:
   *         description: Unautorized.
   *       404:
   *         description: Event not found.
   *       422:
   *         description: Erreur de validation
   *       500:
   *         description: erreur serveur
   */
  router.put(
    "/:id",
    [
      body([
        "name",
        "shortDescription",
        "type",
        "theme",
        "place",
        "categorie",
        "startDate",
        "endDate",
        "startTime",
        "endTime",
      ])
        .not()
        .isEmpty()
        .withMessage({
          message: EventValidationMessage.FIELD_REQUIRED,
          errorCode: 0,
        }),
    ],
    (req: Request, res: Response, next: NextFunction) =>
      eventController.update(req, res, next)
  );

  /**
   * @swagger
   * /api/v1/events/{id}:
   *   delete:
   *     summary: Supprimer un evenement
   *     tags: [Event Management]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *           required: true
   *     responses:
   *       200:
   *         description: Event successfully delete
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 Event:
   *                   $ref: '#/components/schemas/Event'
   *       403:
   *         description: Vous n'ête pas autorisé à effectuer cette action
   *       404:
   *         description: Cours introuvable
   *       500:
   *         description: Erreur serveur
   */
  router.delete("/:id", (req: Request, res: Response, next: NextFunction) =>
    eventController.delete(req, res, next)
  );

  return router;
}
