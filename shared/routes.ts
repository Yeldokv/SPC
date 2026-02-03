import { z } from 'zod';
import { 
  insertReportSchema, 
  insertZoneSchema, 
  insertInterventionSchema, 
  updateReportStatusSchema,
  reports, 
  zones, 
  interventions 
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  reports: {
    list: {
      method: 'GET' as const,
      path: '/api/reports',
      responses: {
        200: z.array(z.custom<typeof reports.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/reports',
      input: insertReportSchema,
      responses: {
        201: z.custom<typeof reports.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/reports/:id',
      responses: {
        200: z.custom<typeof reports.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/reports/:id/status',
      input: updateReportStatusSchema,
      responses: {
        200: z.custom<typeof reports.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  zones: {
    list: {
      method: 'GET' as const,
      path: '/api/zones',
      responses: {
        200: z.array(z.custom<typeof zones.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/zones',
      input: insertZoneSchema,
      responses: {
        201: z.custom<typeof zones.$inferSelect>(),
      },
    },
  },
  interventions: {
    list: {
      method: 'GET' as const,
      path: '/api/interventions',
      responses: {
        200: z.array(z.custom<typeof interventions.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/interventions',
      input: insertInterventionSchema,
      responses: {
        201: z.custom<typeof interventions.$inferSelect>(),
      },
    },
  },
  analytics: {
    stats: {
      method: 'GET' as const,
      path: '/api/analytics/stats',
      responses: {
        200: z.custom<{
          totalReports: number;
          byCategory: Record<string, number>;
          byStatus: Record<string, number>;
        }>(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
