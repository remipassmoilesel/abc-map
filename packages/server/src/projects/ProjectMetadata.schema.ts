export const ProjectMetadataSchema = {
  type: 'object',
  minProperties: 5,
  additionalProperties: false,
  properties: {
    id: { type: 'string' },
    version: { type: 'string' },
    name: { type: 'string' },
    projection: {
      type: 'object',
      minProperties: 1,
      properties: {
        name: { type: 'string' },
      },
    },
    containsCredentials: { type: 'boolean' },
  },
};
