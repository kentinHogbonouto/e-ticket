import { Router } from "express";

import AuthController from "../api/v1/auth/controllers/auth.controller";
import RoleController from "../api/v1/roles/controllers/role.controller";
import PermissionController from "../api/v1/permissions/controllers/permission.controller";
import AdminController from "../api/v1/admins/controllers/admin.controller";
import AdminManagementController from "../api/v1/admins/controllers/admin-management.controller";
import OrganizerController from "../api/v1/organizer/controllers/organizer.controller";
import OrganizerManagementController from "../api/v1/organizer/controllers/organizer-management.controller";
import EventController from "../api/v1/events/controllers/event.controller";
import EventTypesController from "../api/v1/event-types/controllers/event-types.controller";
import EventCouponController from "../api/v1/event-coupon/controllers/event-coupon.controller";

import AuthService from "../api/v1/auth/services/auth.service";
import RoleService from "../api/v1/roles/services/role.service";
import AdminService from "../api/v1/admins/services/admin.service";
import OrganizerService from "../api/v1/organizer/services/organizer.service";
import PermissionService from "../api/v1/permissions/services/permission.service";
import EventService from "../api/v1/events/services/event.service";
import EventTypesService from "../api/v1/event-types/services/event-types.service";
import EventCouponService from "../api/v1/event-coupon/services/event-coupon.service";

import RoleRepository from "../api/v1/roles/repositories/role.repository";
import AdminRepository from "../api/v1/admins/repositories/admin.repository";
import OrganizerRepository from "../api/v1/organizer/repositories/organizer.repository";
import PermissionRepository from "../api/v1/permissions/repositories/permission.repository";
import EventRepository from "../api/v1/events/repositories/event.repository";
import EventTypesRepository from "../api/v1/event-types/repositories/event-types.repository";
import EventCouponRepository from "../api/v1/event-coupon/repositories/event-coupon.repository";

import AuthRoutes from "../api/v1/auth/routes/auth.routes";
import RolesRoutes from "../api/v1/roles/routes/role.routes";
import PermissionsRoutes from "../api/v1/permissions/routes/permission.routes";
import AdminsRoutes from "../api/v1/admins/routes/admin.routes";
import OrganizerRoutes from "../api/v1/organizer/routes/organizer.routes";
import AdminsManagementRoutes from "../api/v1/admins/routes/admin-management.routes";
import OrganizerManagementRoutes from "../api/v1/organizer/routes/organizer-management.routes";
import EventRoutes from "../api/v1/events/routes/event.routes";
import EventTypesRoutes from "../api/v1/event-types/routes/event-types.routes";
import EventCouponRoutes from "../api/v1/event-coupon/routes/event-coupon.routes";

/**
 * @description Configured router for serving Routes
 * @exports router
 * @default
 */
 export default function AllRoutes() {
  const router: Router = Router();

  router.use(
    "/v1/auth",
    AuthRoutes(
      new AuthController(
        new AuthService(
          new AdminService(
            new AdminRepository(),
            new RoleService(new RoleRepository())
          ),
          new OrganizerService(
            new OrganizerRepository(),
            new RoleService(new RoleRepository())
          ),
        )
      )
    )
  );

  router.use(
    "/v1/roles",
    RolesRoutes(new RoleController(new RoleService(new RoleRepository())))
  );

  router.use(
    "/v1/permissions",
    PermissionsRoutes(
      new PermissionController(
        new PermissionService(new PermissionRepository())
      )
    )
  );

  router.use(
    "/v1/admins",
    AdminsRoutes(
      new AdminController(
        new AdminService(
          new AdminRepository(),
          new RoleService(new RoleRepository())
        )
      )
    )
  );
  router.use(
    "/v1/managements/admins",
    AdminsManagementRoutes(
      new AdminManagementController(
        new AdminService(
          new AdminRepository(),
          new RoleService(new RoleRepository())
        )
      )
    )
  );

  router.use(
    "/v1/organizers",
    OrganizerRoutes(
      new OrganizerController(
        new OrganizerService(
          new OrganizerRepository(),
          new RoleService(new RoleRepository())
        )
      )
    )
  );

  router.use(
    "/v1/managements/organizers",
    OrganizerManagementRoutes(
      new OrganizerManagementController(
        new OrganizerService(
          new OrganizerRepository(),
          new RoleService(new RoleRepository())
        )
      )
    )
  );

  router.use(
    "/v1/managements/organizers/create",
    OrganizerManagementRoutes(
      new OrganizerManagementController(
        new OrganizerService(
          new OrganizerRepository(),
          new RoleService(new RoleRepository())
        )
      )
    )
  );
  
  router.use(
    "/v1/managements/events",
    EventRoutes(
      new EventController(
        new EventService(
          new EventRepository(),
          new EventTypesService(new EventTypesRepository())
        )
      )
    )
  );

  router.use(
    "/v1/managements/events-types",
    EventTypesRoutes(
      new EventTypesController(
        new EventTypesService(
          new EventTypesRepository()
        )
      )
    )
  );
  
  router.use(
    "/v1/managements/events-coupon",
    EventCouponRoutes(
      new EventCouponController(
        new EventCouponService(
          new EventCouponRepository()
        )
      )
    )
  );

  return router;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     PhoneNumber:
 *       type: object
 *       required:
 *         - phone
 *         - value
 *         - isoCode
 *         - countryCode
 *       properties:
 *         phone:
 *           type: string
 *         value:
 *           type: string
 *         isoCode:
 *           type: string
 *         countryCode:
 *           type: string
 *
 *     Time:
 *       type: object
 *       required:
 *         - hour
 *         - minute
 *         - value
 *       properties:
 *         hour:
 *           type: number
 *         minute:
 *           type: number
 *         value:
 *           type: string
 *     Role:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         permissions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Permission'
 *         admins:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Admin'
 *         organizer:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Organizer'
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Users'
 *
 *     Permission:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         roles:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Role'
 *
 *     Organizer:
 *       type: object
 *       required:
 *         - lastName
 *         - firstName
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *         lastName:
 *           type: string
 *         firstName:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         resetToken:
 *           type: string
 *         resetTokenExpiration:
 *           type: string
 *         resetPasswordRequestId:
 *           type: string
 *         role:
 *           $ref: '#/components/schemas/Role'
 * 
 *     Admin:
 *       type: object
 *       required:
 *         - email
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         resetToken:
 *           type: string
 *         resetTokenExpiration:
 *           type: string
 *         resetPasswordRequestId:
 *           type: string
 *         role:
 *           $ref: '#/components/schemas/Role'
 * 
 * 
 *     Users:
 *       type: object
 *       required:
 *         - lastName
 *         - firstName
 *         - email
 *       properties:
 *         id:
 *           type: string
 *         lastName:
 *           type: string
 *         firstName:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         resetToken:
 *           type: string
 *         resetTokenExpiration:
 *           type: string
 *         resetPasswordRequestId:
 *           type: string
 *         role:
 *           $ref: '#/components/schemas/Role'
 * 
 *     Event:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         types:
 *           type: string
 *         theme:
 *           type: string
 *         startDate:
 *           type: string
 *         endDate:
 *           type: string
 *         EventCoupon:
 *           $ref: '#/components/schemas/Coupon'
 * 
 *     EventTypes:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 * 
 *     EventCoupon:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         formuleName:
 *           type: string
 *         formuleQuantity:
 *           type: string
 *         formuleMatricule:
 *           type: string
 *         totalCoupons:
 *           type: string
 */
