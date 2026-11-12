<!--
  👋 Reading the source? Same energy.
  Every animation on this page is a hand-built SVG (CSS keyframes, no GIFs, no JS),
  generated from scripts/build-svgs.mjs in dark and light. Say hi: juandiego0329@gmail.com
-->

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/hero-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./assets/hero-light.svg">
    <img src="./assets/hero-dark.svg" alt="Juan Diego Londoño (Juandy): I build AI that listens, reasons and acts, inside real software." title="Yes, the packets are flowing. No, it's not a GIF." width="100%">
  </picture>
</div>

<p align="center">
  <a href="https://juandlch.dev/lab/voice"><img src="https://img.shields.io/badge/%F0%9F%8E%99%EF%B8%8F%20Talk%20to%20my%20CV-live%20voice%20demo-9586fa?style=flat-square" alt="Talk to my CV: live voice demo"></a>
  <a href="https://juandlch.dev"><img src="https://img.shields.io/badge/Portfolio-juandlch.dev-48dbc0?style=flat-square" alt="Portfolio: juandlch.dev"></a>
  <a href="https://www.linkedin.com/in/juandlch/"><img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
  <a href="mailto:juandiego0329@gmail.com"><img src="https://img.shields.io/badge/Email-Say%20hello-353B48?style=flat-square&logo=gmail&logoColor=white" alt="Email"></a>
  <a href="https://calendar.app.google/6ae9dpvPz8mEiRRdA"><img src="https://img.shields.io/badge/Book%20a%20call-calendar-353B48?style=flat-square&logo=googlecalendar&logoColor=white" alt="Book a call"></a>
  <a href="https://juandlch.dev/cv/Juan-Londono_AI-Engineer.pdf"><img src="https://img.shields.io/badge/CV-EN-353B48?style=flat-square" alt="CV in English"></a>
  <a href="https://juandlch.dev/cv/Juan-Londono_AI-Engineer_ES.pdf"><img src="https://img.shields.io/badge/CV-ES-353B48?style=flat-square" alt="CV en español"></a>
</p>

### Hey, I'm Juandy 👋

I'm **Juan Diego Londoño**, a **Lead AI Engineer** from **Medellín, Colombia**. I design and ship AI that does real work: **agents** that call tools and keep state, **realtime voice** you can interrupt, and **document AI** that reads what businesses actually send. I take each project from the client's first question to running on AWS.

I'm a software engineer first: full stack in 2022, then backend and cloud, and now I lead AI projects end to end. That covers discovery, architecture, cost and time estimates, the team and delivery.

<details>
  <summary><strong>🇨🇴 Léelo en español</strong></summary>
  <br>

Soy **Juan Diego Londoño (Juandy)**, **Lead AI Engineer** en **Medellín, Colombia**. Diseño y llevo a producción IA que hace trabajo real: **agentes** que usan herramientas y mantienen estado, **voz en tiempo real** que puedes interrumpir y **IA documental** que lee lo que las empresas realmente envían. Acompaño cada proyecto desde la primera pregunta del cliente hasta que corre en AWS.

Primero soy ingeniero de software: full stack en 2022, luego backend y nube, y hoy lidero proyectos de IA de punta a punta: descubrimiento, arquitectura, estimación de costos y tiempos, coordinación del equipo y entrega.

- 🎙️ **Habla con mi CV:** [Sophie](https://juandlch.dev/lab/voice) es un agente de voz que conoce mi trabajo. Interrúmpela cuando quieras.
- 💬 **Mira al agente pensar:** el [Chat Lab](https://juandlch.dev/lab/chat) muestra cada paso del agente en vivo.
- 📄 **CV:** [Español](https://juandlch.dev/cv/Juan-Londono_AI-Engineer_ES.pdf) · [English](https://juandlch.dev/cv/Juan-Londono_AI-Engineer.pdf)
- 📅 **¿Hablamos?** [Agenda una llamada](https://calendar.app.google/6ae9dpvPz8mEiRRdA) o escríbeme a [juandiego0329@gmail.com](mailto:juandiego0329@gmail.com).

<sub>Fuera del teclado: arquero de fútbol, Linux y experimentos de automatización. ⚽🐧</sub>
</details>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/terminal-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="./assets/terminal-light.svg">
  <img src="./assets/terminal-dark.svg" alt="Animated terminal: whoami prints Juandy, Lead AI Engineer in Medellín; cat principles.txt lists architecture before implementation, a latency/cost/failure budget for every AI feature, and production-grade from the first commit; Claude Code is the main tool and every PR still gets human eyes; off the clock: goalkeeper, Linux tinkerer, automation experiments." title="$ whoami" width="100%">
</picture>

### Don't take my word for it. Try it 👇

<p align="center">
  <a href="https://juandlch.dev/lab/voice"><picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/lab-voice-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./assets/lab-voice-light.svg">
    <img src="./assets/lab-voice-dark.svg" alt="Voice Lab: talk to Sophie, a realtime voice agent that knows my work. You can interrupt her." width="49%">
  </picture></a>
  <a href="https://juandlch.dev/lab/chat"><picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/lab-chat-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./assets/lab-chat-light.svg">
    <img src="./assets/lab-chat-dark.svg" alt="Chat Lab: a multimodal agent (text, images, documents, audio) that shows every step live." width="49%">
  </picture></a>
</p>

<p align="center"><sub>Both are live demos on <a href="https://juandlch.dev">juandlch.dev</a>. Click a card, say hi, and try to break them.</sub></p>

### What I've shipped

<sub>Client names are anonymised and the work lives in private repos, so these are the shapes of the systems. Click a case file to open it.</sub>

<details>
  <summary><strong>🍔 Drive-thru voice AI</strong>: a voice agent that takes your order, and lets you interrupt it</summary>
  <br>

Realtime voice agents for a quick-service chain that take orders at the drive-thru. I built the voice integration with **ElevenLabs on Claude models**, including turn-taking, interruptions (barge-in) and placing the order into the system.

```mermaid
flowchart LR
    C(["🚗 Customer speaks"]) -->|"audio stream"| STT["Deepgram<br/>streaming STT"]
    STT --> A{"Claude agent<br/>turn-taking"}
    A -->|"tool call"| POS[("Order / POS API")]
    A --> TTS["ElevenLabs<br/>voice"]
    TTS -->|"speaks back"| C
    C -. "interrupts mid-sentence" .-> A
```

<img src="./assets/icons/anthropic.svg" width="26" height="26" alt="Claude" title="Claude"> <img src="./assets/icons/elevenlabs.svg" width="26" height="26" alt="ElevenLabs" title="ElevenLabs"> <img src="./assets/icons/deepgram.svg" width="26" height="26" alt="Deepgram" title="Deepgram"><sub>Claude · ElevenLabs · Deepgram · WebSockets · AWS</sub>
</details>

<details>
  <summary><strong>🛡️ Insurance assistant on WhatsApp</strong>: policies, coverage and claims inside a chat</summary>
  <br>

Built and evolved conversations on **Meta's WhatsApp Cloud API** for an insurer: policy lookups, coverage checks, claims, and connections to the insurer's own systems. I also migrated the older flows.

```mermaid
flowchart LR
    U(["📱 WhatsApp user"]) --> M["Meta WhatsApp<br/>Cloud API"]
    M -->|"webhook"| R{"Conversation<br/>flows"}
    R --> P["Policy lookup"]
    R --> CV["Coverage check"]
    R --> CL["Claims"]
    P & CV & CL --> I[("Insurer systems")]
    R -->|"reply"| M
```

<img src="./assets/icons/whatsapp.svg" width="26" height="26" alt="WhatsApp" title="WhatsApp"> <img src="./assets/icons/meta.svg" width="26" height="26" alt="Meta" title="Meta"> <sub>WhatsApp Cloud API · Meta · insurer integrations</sub>
</details>

<details>
  <summary><strong>🎓 Automated class evaluation</strong>: from a recorded class to a structured report</summary>
  <br>

I helped build a pipeline that **transcribes class recordings**, orchestrates the work with **Step Functions**, and runs **evaluation agents** that return JSON reports for the client's app.

```mermaid
flowchart LR
    V(["🎥 Class recording"]) --> TR["Amazon Transcribe"]
    TR --> SF{{"Step Functions"}}
    SF --> E["Evaluation agents"]
    E --> J["JSON report"]
    J --> APP(["Client app"])
```

<img src="./assets/aws/transcribe.svg" width="26" height="26" alt="Amazon Transcribe" title="Amazon Transcribe"> <img src="./assets/aws/stepfunctions.svg" width="26" height="26" alt="Step Functions" title="Step Functions"> <sub>Amazon Transcribe · Step Functions · evaluation agents</sub>
</details>

<details>
  <summary><strong>🎬 Cinema conversational assistant</strong>: RAG that knows what's playing tonight</summary>
  <br>

A digital-channel assistant that answers from the live listings and recommends what to watch. I worked on retrieval, recommendation logic, backend integrations and the AWS architecture. The retrieval loop below is the pattern I keep coming back to.

```mermaid
flowchart LR
    Q(["❓ Question"]) --> RW["Query rewrite"]
    RW --> H["Hybrid search<br/>keyword + vector"]
    H --> RR["Rerank"]
    RR --> VA{"Validator agent<br/>grounded?"}
    VA -->|"yes"| ANS(["✅ Answer + recommendation"])
    VA -. "no, try again" .-> RW
```

<sub>RAG · hybrid search · reranking · AWS</sub>
</details>

<sub>Also shipped: OCR and agents for financial services, HubSpot CRM integrations, and AWS data pipelines.</sub>

### The road so far

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="./assets/timeline-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="./assets/timeline-light.svg">
  <img src="./assets/timeline-dark.svg" alt="Career timeline: 2022 Full Stack at Stellion Tech; 2023 Cloud & Backend at Trade EC / TRD Global; 2024 AI Engineering; 2024 to now Lead AI Engineer." width="100%">
</picture>

<p align="center">
  <a href="https://www.credly.com/badges/1c2e844c-9c17-4030-9cb5-b052673ca22a/public_url"><img src="https://img.shields.io/badge/Claude%20Certified%20Architect-Foundations-D97757?style=flat-square&logo=claude&logoColor=white" alt="Claude Certified Architect – Foundations"></a>
  <a href="https://www.credly.com/badges/8fae51ff-40de-4bbc-aae7-3025afe5bd88/public_url"><img src="https://img.shields.io/badge/AWS%20Certified-AI%20Practitioner-FF9900?style=flat-square&logo=amazonwebservices&logoColor=white" alt="AWS Certified AI Practitioner"></a>
  <a href="https://www.credly.com/badges/01204e88-1b1e-48ca-a90d-3e52f5592e64/public_url"><img src="https://img.shields.io/badge/AWS%20AI%20Practitioner-Early%20Adopter-232F3E?style=flat-square&logo=amazonwebservices&logoColor=white" alt="AWS Certified AI Practitioner – Early Adopter"></a>
  <img src="https://img.shields.io/badge/B.Sc.-Software%20Engineering%20·%20UdeM-353B48?style=flat-square" alt="B.Sc. Software Engineering, Universidad de Medellín">
</p>

### Daily drivers

<p align="center">
  <img src="./assets/aws/bedrock.svg" width="44" height="44" alt="Amazon Bedrock" title="Amazon Bedrock">
  <img src="./assets/aws/agentcore.svg" width="44" height="44" alt="Bedrock AgentCore" title="Bedrock AgentCore">
  <img src="./assets/icons/anthropic.svg" width="44" height="44" alt="Claude" title="Claude: my model of choice">
  <img src="./assets/icons/langgraph.svg" width="44" height="44" alt="LangGraph" title="LangGraph">
  <img src="./assets/icons/modelcontextprotocol.svg" width="44" height="44" alt="Model Context Protocol" title="Model Context Protocol">
  <img src="./assets/aws/lambda.svg" width="44" height="44" alt="AWS Lambda" title="AWS Lambda">
  <img src="./assets/aws/stepfunctions.svg" width="44" height="44" alt="Step Functions" title="Step Functions">
  <img src="https://skillicons.dev/icons?i=python,fastapi,ts,docker&theme=light" alt="Python, FastAPI, TypeScript and Docker" height="44">
</p>

<p align="center"><sub>Hover an icon for its name. My deepest focus is AI engineering, backend and AWS. Frontend is part of my full-stack background, and I won't pretend every tool below is a daily driver.</sub></p>

<details>
  <summary><strong>🧰 Open the full toolbox</strong>: AI, voice, backend, frontend, data, integrations</summary>
  <br>

#### AI, agents & LLMs

<p>
  <img src="./assets/aws/bedrock.svg" width="42" height="42" alt="Amazon Bedrock" title="Amazon Bedrock">
  <img src="./assets/aws/agentcore.svg" width="42" height="42" alt="Amazon Bedrock AgentCore" title="Amazon Bedrock AgentCore">
  <img src="./assets/aws/nova.svg" width="42" height="42" alt="Amazon Nova" title="Amazon Nova">
  <img src="./assets/aws/sagemaker.svg" width="42" height="42" alt="Amazon SageMaker AI" title="Amazon SageMaker AI">
  <img src="./assets/icons/langgraph.svg" width="42" height="42" alt="LangGraph" title="LangGraph">
  <img src="./assets/icons/langchain.svg" width="42" height="42" alt="LangChain" title="LangChain">
  <img src="./assets/icons/modelcontextprotocol.svg" width="42" height="42" alt="Model Context Protocol" title="Model Context Protocol">
  <img src="./assets/icons/anthropic.svg" width="42" height="42" alt="Anthropic Claude" title="Anthropic Claude">
</p>

<sub>Amazon Bedrock · Bedrock AgentCore · Amazon Nova · SageMaker · LangGraph · LangChain · MCP · Claude</sub>

<sub>Also: OpenAI API · LlamaIndex · agent/tool orchestration · RAG · embeddings · semantic search & reranking · model routing · evaluations & tracing</sub>

#### Voice, vision & document intelligence

<p>
  <img src="./assets/icons/deepgram.svg" width="42" height="42" alt="Deepgram" title="Deepgram">
  <img src="./assets/icons/elevenlabs.svg" width="42" height="42" alt="ElevenLabs" title="ElevenLabs">
  <img src="./assets/aws/transcribe.svg" width="42" height="42" alt="Amazon Transcribe" title="Amazon Transcribe">
  <img src="./assets/aws/textract.svg" width="42" height="42" alt="Amazon Textract" title="Amazon Textract">
  <img src="./assets/aws/rekognition.svg" width="42" height="42" alt="Amazon Rekognition" title="Amazon Rekognition">
</p>

<sub>Deepgram · ElevenLabs · Amazon Transcribe · Textract · Rekognition · OCR · STT/TTS pipelines · multimodal workflows</sub>

#### Languages, backend & APIs

<p><img src="https://skillicons.dev/icons?i=python,fastapi,ts,js,nodejs&theme=light" alt="Python, FastAPI, TypeScript, JavaScript and Node.js" height="42"></p>

<sub>FastAPI · Pydantic · Zod · REST APIs · WebSockets · SSE/streaming · webhooks · authentication & authorization · Pytest</sub>

#### Frontend & UI

<p>
  <img src="https://skillicons.dev/icons?i=react,nextjs,tailwind,html,css,bootstrap&theme=light" alt="React, Next.js, Tailwind CSS, HTML5, CSS3 and Bootstrap" height="42">
  <img src="./assets/icons/mui.svg" width="42" height="42" alt="Material UI" title="Material UI">
  <img src="./assets/icons/antdesign.svg" width="42" height="42" alt="Ant Design" title="Ant Design">
  <img src="./assets/icons/angular.svg" width="42" height="42" alt="Angular" title="Angular">
</p>

<sub>React · Next.js · Tailwind CSS · Material UI · Ant Design · Angular · component libraries · dashboards · responsive interfaces. Earlier experience also includes Vue.</sub>

#### Engineering tools & delivery

<p><img src="https://skillicons.dev/icons?i=aws,docker,terraform,githubactions,git,linux&theme=light" alt="AWS, Docker, Terraform, GitHub Actions, Git and Linux" height="42"></p>

<sub>AWS SAM · Infrastructure as Code · GitHub Actions · CI/CD · containers · Linux · observability · cloud operations</sub>

#### Data & storage

<p>
  <img src="https://skillicons.dev/icons?i=postgres,redis,mongodb,supabase&theme=light" alt="PostgreSQL, Redis, MongoDB and Supabase" height="42">
  <img src="./assets/aws/dynamodb.svg" width="42" height="42" alt="Amazon DynamoDB" title="Amazon DynamoDB">
  <img src="./assets/aws/aurora.svg" width="42" height="42" alt="Amazon Aurora" title="Amazon Aurora">
</p>

<sub>PostgreSQL / Aurora Serverless · DynamoDB · Redis / Valkey · MongoDB · S3 · Redshift · Glue · DMS · SQL</sub>

#### Integrations & automation

<p>
  <img src="./assets/icons/meta.svg" width="42" height="42" alt="Meta" title="Meta">
  <img src="./assets/icons/whatsapp.svg" width="42" height="42" alt="WhatsApp" title="WhatsApp">
  <img src="./assets/icons/hubspot.svg" width="42" height="42" alt="HubSpot" title="HubSpot">
  <img src="./assets/icons/discord.svg" width="42" height="42" alt="Discord" title="Discord">
  <img src="./assets/icons/n8n.svg" width="42" height="42" alt="n8n" title="n8n">
  <img src="./assets/icons/google.svg" width="42" height="42" alt="Google APIs" title="Google APIs">
</p>

<sub>Meta WhatsApp Business Platform / Cloud API · Twilio · Discord bots · HubSpot CRM · Google Drive APIs · n8n · webhook automation · Selenium / UiPath / PyAutoGUI</sub>

<details>
  <summary><strong>Earlier & complementary experience</strong></summary>
  <br>
  <strong>Other languages & web:</strong> Java, C#, Angular, Vue, Bootstrap, HTML/CSS, JavaScript frontend tooling.<br>
  <strong>Data science & automation:</strong> Pandas, NumPy, Matplotlib, Jupyter, Python scripting, UiPath, Selenium, PyAutoGUI.<br>
  <strong>Additional tooling:</strong> Voiceflow, low-code workflows, notebooks and rapid prototyping.
  <br><br>
</details>

</details>

<details>
  <summary><strong>☁️ AWS Cloud Stack</strong>: 35 services across AI, compute, data, events and security</summary>
  <br>

<sub>Services I've worked with across AI engineering, serverless applications, data platforms and cloud operations. All icons are stored in this repository.</sub>

<table>
  <tr>
    <td width="50%" valign="top">
      <strong>AI & Machine Learning</strong><br><br>
      <img src="./assets/aws/bedrock.svg" width="39" height="39" alt="Amazon Bedrock" title="Amazon Bedrock">
      <img src="./assets/aws/agentcore.svg" width="39" height="39" alt="Bedrock AgentCore" title="Bedrock AgentCore">
      <img src="./assets/aws/nova.svg" width="39" height="39" alt="Amazon Nova" title="Amazon Nova">
      <img src="./assets/aws/sagemaker.svg" width="39" height="39" alt="SageMaker AI" title="SageMaker AI">
      <img src="./assets/aws/textract.svg" width="39" height="39" alt="Textract" title="Textract">
      <img src="./assets/aws/rekognition.svg" width="39" height="39" alt="Rekognition" title="Rekognition">
      <img src="./assets/aws/transcribe.svg" width="39" height="39" alt="Transcribe" title="Transcribe">
      <br><sub>Amazon Bedrock · Bedrock AgentCore · Amazon Nova · SageMaker AI · Textract · Rekognition · Transcribe</sub>
    </td>
    <td width="50%" valign="top">
      <strong>Compute & Containers</strong><br><br>
      <img src="./assets/aws/lambda.svg" width="39" height="39" alt="AWS Lambda" title="AWS Lambda">
      <img src="./assets/aws/ec2.svg" width="39" height="39" alt="Amazon EC2" title="Amazon EC2">
      <img src="./assets/aws/ecs.svg" width="39" height="39" alt="Amazon ECS" title="Amazon ECS">
      <img src="./assets/aws/fargate.svg" width="39" height="39" alt="AWS Fargate" title="AWS Fargate">
      <img src="./assets/aws/ecr.svg" width="39" height="39" alt="Amazon ECR" title="Amazon ECR">
      <br><sub>AWS Lambda · Amazon EC2 · Amazon ECS · AWS Fargate · Amazon ECR</sub>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>Networking & Web Delivery</strong><br><br>
      <img src="./assets/aws/apigateway.svg" width="39" height="39" alt="API Gateway" title="API Gateway">
      <img src="./assets/aws/cloudfront.svg" width="39" height="39" alt="CloudFront" title="CloudFront">
      <img src="./assets/aws/waf.svg" width="39" height="39" alt="AWS WAF" title="AWS WAF">
      <img src="./assets/aws/amplify.svg" width="39" height="39" alt="AWS Amplify" title="AWS Amplify">
      <br><sub>API Gateway · CloudFront · AWS WAF · AWS Amplify</sub>
    </td>
    <td width="50%" valign="top">
      <strong>Databases & Storage</strong><br><br>
      <img src="./assets/aws/s3.svg" width="39" height="39" alt="Amazon S3" title="Amazon S3">
      <img src="./assets/aws/dynamodb.svg" width="39" height="39" alt="DynamoDB" title="DynamoDB">
      <img src="./assets/aws/rds.svg" width="39" height="39" alt="Amazon RDS" title="Amazon RDS">
      <img src="./assets/aws/aurora.svg" width="39" height="39" alt="Aurora Serverless" title="Aurora Serverless">
      <img src="./assets/aws/elasticache.svg" width="39" height="39" alt="ElastiCache / Valkey" title="ElastiCache / Valkey">
      <br><sub>Amazon S3 · DynamoDB · Amazon RDS · Aurora Serverless · ElastiCache / Valkey</sub>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>Data, Analytics & Migration</strong><br><br>
      <img src="./assets/aws/glue.svg" width="39" height="39" alt="AWS Glue" title="AWS Glue">
      <img src="./assets/aws/redshift.svg" width="39" height="39" alt="Amazon Redshift" title="Amazon Redshift">
      <img src="./assets/aws/dms.svg" width="39" height="39" alt="AWS DMS" title="AWS DMS">
      <br><sub>AWS Glue · Amazon Redshift · AWS DMS</sub>
    </td>
    <td width="50%" valign="top">
      <strong>Events, Workflows & Messaging</strong><br><br>
      <img src="./assets/aws/eventbridge.svg" width="39" height="39" alt="EventBridge / Scheduler" title="EventBridge / Scheduler">
      <img src="./assets/aws/sqs.svg" width="39" height="39" alt="Amazon SQS" title="Amazon SQS">
      <img src="./assets/aws/stepfunctions.svg" width="39" height="39" alt="Step Functions" title="Step Functions">
      <img src="./assets/aws/ses.svg" width="39" height="39" alt="Amazon SES" title="Amazon SES">
      <img src="./assets/aws/pinpoint.svg" width="39" height="39" alt="Amazon Pinpoint" title="Amazon Pinpoint">
      <br><sub>EventBridge / Scheduler · Amazon SQS · Step Functions · Amazon SES · Amazon Pinpoint</sub>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <strong>Security & Identity</strong><br><br>
      <img src="./assets/aws/cognito.svg" width="39" height="39" alt="Amazon Cognito" title="Amazon Cognito">
      <img src="./assets/aws/iam.svg" width="39" height="39" alt="AWS IAM" title="AWS IAM">
      <img src="./assets/aws/secretsmanager.svg" width="39" height="39" alt="Secrets Manager" title="Secrets Manager">
      <img src="./assets/aws/ssm.svg" width="39" height="39" alt="Systems Manager / Parameter Store" title="Systems Manager / Parameter Store">
      <br><sub>Amazon Cognito · AWS IAM · Secrets Manager · Systems Manager / Parameter Store</sub>
    </td>
    <td width="50%" valign="top">
      <strong>Observability & Infrastructure</strong><br><br>
      <img src="./assets/aws/cloudwatch.svg" width="39" height="39" alt="Amazon CloudWatch" title="Amazon CloudWatch">
      <img src="./assets/aws/cloudformation.svg" width="39" height="39" alt="AWS CloudFormation" title="AWS CloudFormation">
      <br><sub>Amazon CloudWatch · AWS CloudFormation</sub>
    </td>
  </tr>
</table>

<sub>Additional experience: AWS SAM, EventBridge Scheduler, Aurora PostgreSQL / Serverless, and Valkey Serverless. AWS Architecture Icons are provided by AWS.</sub>

</details>

### GitHub snapshot

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github-stats-extended.vercel.app/api?username=JuanDLCH&show_icons=true&include_all_commits=true&hide_border=true&theme=github_dark">
    <source media="(prefers-color-scheme: light)" srcset="https://github-stats-extended.vercel.app/api?username=JuanDLCH&show_icons=true&include_all_commits=true&hide_border=true&theme=default">
    <img src="https://github-stats-extended.vercel.app/api?username=JuanDLCH&show_icons=true&include_all_commits=true&hide_border=true&theme=default" alt="GitHub activity statistics for JuanDLCH" height="175">
  </picture>
</div>

<p align="center"><sub>Public numbers only tell part of the story. Most of my recent work lives in private repos.</sub></p>

<br>

<a href="https://www.linkedin.com/in/juandlch/">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./assets/footer-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="./assets/footer-light.svg">
    <img src="./assets/footer-dark.svg" alt="Useful AI over impressive demos. Off the clock: goalkeeper, Linux tinkerer, automation experiments. Medellín, Colombia." title="Saved. 🧤" width="100%">
  </picture>
</a>

<p align="center">
  <a href="https://www.linkedin.com/in/juandlch/">Let's connect</a>
  &nbsp;·&nbsp;
  <a href="mailto:juandiego0329@gmail.com">Get in touch</a>
  &nbsp;·&nbsp;
  <a href="https://calendar.app.google/6ae9dpvPz8mEiRRdA">Book a call</a>
  &nbsp;·&nbsp;
  <a href="https://juandlch.dev">juandlch.dev</a>
</p>
