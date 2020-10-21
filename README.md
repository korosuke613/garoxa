# Alexa Skill example (HelloWorld - TypeScript)

This repository is a template project of Alexa Skill for ASK CLI(v2)'s "ask new" command.
We can easy to setup own Alexa custom skill with TypeScript and AWS CloudFormation.


## Usage

```
% ask new  --template-url https://github.com/hideokamoto/alexa-skill-sample-helloworld-typescript.git

Please follow the wizard to start your Alexa skill project ->
? Choose a method to host your skill's backend resources:  AWS with CloudFormation
  Host your skill code with AWS services and provision with AWS CloudFormation (requires AWS account)
[Warn]: CLI is about to download the skill template from unofficial template https://github.com/hideokamoto/alexa
-skill-sample-helloworld-typescript.git. Please make sure you understand the source code to best protect yourself
 from malicious usage.
? Would you like to continue download the skill template?  Yes
? Please type in your skill name:  alexa-skill-sample-helloworld-typescript
? Please type in your folder name for the skill project (alphanumeric):  alexa-skill-sample-helloworld-typescript

% tree alexa-skill-sample-helloworld-typescript -L 3 -I node_modules
alexa-skill-sample-helloworld-typescript
├── LICENSE.txt
├── ask-resources.json
├── hooks
│   └── build.sh
├── infrastructure
│   └── cfn-deployer
│       └── skill-stack.yaml
├── lambda
│   ├── package.json
│   ├── src
│   │   ├── index.ts
│   │   └── util.ts
│   ├── tsconfig.json
│   └── webpack.config.ts
└── skill-package
    ├── assets
    │   ├── en-US_largeIcon.png
    │   └── en-US_smallIcon.png
    ├── interactionModels
    │   └── custom
    └── skill.json

9 directories, 12 files
```

## Deployment

Nevermind!
The project already supported the `npm run build` command by TypeScript with Webpack.
So we just run `ask deploy` to build your project and deploy to AWS.
