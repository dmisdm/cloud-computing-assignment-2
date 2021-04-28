import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deployment from "@aws-cdk/aws-s3-deployment";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as ec2 from "@aws-cdk/aws-ec2";
import { AttributeType } from "@aws-cdk/aws-dynamodb";
import path from "path";
import {
  CloudFormationInit,
  InitCommand,
  InitPackage,
  InitSource,
  InstanceClass,
  InstanceSize,
  InstanceType,
  MachineImage,
  SubnetType,
} from "@aws-cdk/aws-ec2";
export class OpsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, "mainVpc");
    const s3Bucket = new s3.Bucket(this, "assets");
    const loginTable = new dynamodb.Table(this, "login", {
      partitionKey: { name: "id", type: AttributeType.NUMBER },
      tableName: "login",
    });
    const musicTable = new dynamodb.Table(this, "music", {
      partitionKey: { name: "id", type: AttributeType.NUMBER },
      tableName: "music",
    });
    const assetsPath = path.resolve(__dirname, "../out");

    const ec2Instance = new ec2.Instance(this, "server", {
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      machineImage: MachineImage.lookup({ name: "Ubuntu Server 20.04" }),
      vpc,
      vpcSubnets: vpc.selectSubnets({ subnetType: SubnetType.PUBLIC }),
      init: CloudFormationInit.fromElements(
        InitPackage.apt("nodejs"),
        InitCommand.shellCommand("npm install --global yarn"),
        InitSource.fromAsset("/app", assetsPath),
        InitCommand.shellCommand("cd /app && PORT=80 yarn start")
      ),
    });
  }
}
