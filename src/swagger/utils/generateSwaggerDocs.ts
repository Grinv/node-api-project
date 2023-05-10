import SwaggerParser from '@apidevtools/swagger-parser';
import { JsonObject } from 'swagger-ui-express';

const SWAGGER_PATH = './src/swagger/annotations/swagger.json';

const generateSwaggerDocs = (): Promise<JsonObject> => SwaggerParser.validate(SWAGGER_PATH);

export default generateSwaggerDocs;
