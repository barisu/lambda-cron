import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as events from "aws-cdk-lib/aws-events";
import * as iam from "aws-cdk-lib/aws-iam";
import * as target from "aws-cdk-lib/aws-events-targets";
import * as dotenv from "dotenv";

dotenv.config();

export class CdkCronStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    if (process.env.PROJECT_NAME == undefined) {
      throw Error(".envファイルでPROJECT_NAMEを設定してください。");
    }

    const lambda_basic_policy = new iam.ManagedPolicy(
      this,
      `${process.env.PROJECT_NAME}-policy`,
      {
        managedPolicyName: `${process.env.PROJECT_NAME}-policy`,
        description: "Lambda basic execution policy",
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              "logs:CreateLogGroup",
              "logs:CreateLogStream",
              "logs:PutLogEvents",
            ],
            resources: ["arn:aws:logs:*:*:*"],
          }),
        ],
      }
    );

    const lambda_role = new iam.Role(this, `${process.env.PROJECT_NAME}-lambda-role`, {
      roleName: "lambda_cron_role",
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });

    lambda_role.addManagedPolicy(lambda_basic_policy);

    const lambda_func = new lambda.Function(this, `${process.env.PROJECT_NAME}-function`, {
      code: lambda.Code.fromAsset("../assets"),
      handler: "index.handler",
      runtime: lambda.Runtime.NODEJS_16_X,
      role: lambda_role,
      timeout: cdk.Duration.seconds(10),
    });

    const eventTarget = new target.LambdaFunction(lambda_func);

    // eventのルールを指定
    const eventRule = new events.Rule(this, `${process.env.PROJECT_NAME}-event-rule`, {
      schedule: events.Schedule.cron({
        minute: "0/2",
        hour: "*",
        weekDay: "*",
        month: "*",
        year: "*",
      }),
    });

    // eventのルールにターゲットを指定
    eventRule.addTarget(eventTarget);
  }
}
