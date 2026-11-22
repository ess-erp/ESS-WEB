@echo off
echo Creating ECS Task Execution Role...
echo.

REM Create the trust policy file
echo { > trust-policy.json
echo   "Version": "2012-10-17", >> trust-policy.json
echo   "Statement": [ >> trust-policy.json
echo     { >> trust-policy.json
echo       "Effect": "Allow", >> trust-policy.json
echo       "Principal": { >> trust-policy.json
echo         "Service": "ecs-tasks.amazonaws.com" >> trust-policy.json
echo       }, >> trust-policy.json
echo       "Action": "sts:AssumeRole" >> trust-policy.json
echo     } >> trust-policy.json
echo   ] >> trust-policy.json
echo } >> trust-policy.json

echo Creating IAM role...
aws iam create-role --role-name ecsTaskExecutionRole --assume-role-policy-document file://trust-policy.json

echo.
echo Attaching AWS managed policy...
aws iam attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

echo.
echo Cleaning up...
del trust-policy.json

echo.
echo ============================================================
echo  ECS Task Execution Role Created!
echo ============================================================
echo.
echo Role ARN: arn:aws:iam::085464833615:role/ecsTaskExecutionRole
echo.
echo Now go back to the AWS Console and refresh the page.
echo You should see "ecsTaskExecutionRole" in the dropdown.
echo.
pause
