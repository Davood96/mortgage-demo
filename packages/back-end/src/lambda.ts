import { Server } from "http";
import { APIGatewayProxyHandler } from "aws-lambda";
import { createServer, proxy } from "aws-serverless-express";
import app from "./app";

let server: Server;

export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (server === undefined) {
    server = createServer(app);
  }
  return proxy(server, event, context, "PROMISE").promise;
};
