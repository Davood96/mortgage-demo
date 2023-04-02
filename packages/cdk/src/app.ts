#!/usr/bin/env ts-node

import * as cdk from "aws-cdk-lib";
import { AppStack } from "./app-stack";

async function main(): Promise<void> {
  // the actual app
  const app = new cdk.App();

  new AppStack(app, "app");

  app.synth();
}

main().catch((e) => {
  console.error(`Something went wrong: \n`);
  console.error(e);
});
