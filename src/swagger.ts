const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'URL Shortener API',
    version: '1.0.0',
    description: 'A URL shortener service built with Express and TypeScript for system-design practice.',
  },
  paths: {
    '/healthz': {
      get: {
        summary: 'Health check',
        tags: ['Health'],
        responses: {
          '200': {
            description: 'Application is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Application healthy' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/shorten': {
      post: {
        summary: 'Shorten a URL',
        description: 'Accepts a URL and returns a shortened version. Returns the existing short URL if the same URL was already shortened.',
        tags: ['URL'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['url'],
                properties: {
                  url: { type: 'string', format: 'uri', example: 'https://example.com/very-long-path' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Shortened URL',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    url: { type: 'string', example: 'http://localhost:3000/a1b2c3' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'array',
                      items: { type: 'string' },
                      example: ['"url" is required'],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/{id}': {
      get: {
        summary: 'Redirect to original URL',
        description: 'Redirects to the original URL associated with the given short ID. Returns 404 if the ID does not exist or has expired.',
        tags: ['URL'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'The short URL hash identifier',
          },
        ],
        responses: {
          '301': { description: 'Redirects to the original URL' },
          '404': {
            description: 'Short URL not found or expired',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Not found' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/stats/{id}': {
      get: {
        summary: 'Get URL statistics',
        description: 'Returns click count, creation date, expiration, and last access time for a shortened URL.',
        tags: ['Stats'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'The short URL hash identifier',
          },
        ],
        responses: {
          '200': {
            description: 'URL statistics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    originalUrl: { type: 'string', example: 'https://example.com/very-long-path' },
                    createdAt: { type: 'string', format: 'date-time' },
                    expiresAt: { type: 'string', format: 'date-time', nullable: true },
                    clicks: { type: 'integer', example: 42 },
                    lastAccessedAt: { type: 'string', format: 'date-time', nullable: true },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Short URL not found or expired',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Not found' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default swaggerSpec;
