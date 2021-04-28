#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { OpsStack } from "./ops-stack";

const app = new cdk.App();
new OpsStack(app, "OpsStack", {
  stackName: "cloud-computing-assignment-2",
  env: {
    account: "163565994931",
    region: "ap-southeast-2",
  },
});
