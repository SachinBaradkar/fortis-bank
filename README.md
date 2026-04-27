# 🏦 FORTIS BANK — Complete DevOps Banking Project
### Developer → GitHub → Jenkins → Docker → Kubernetes → Nagios

---

## 📁 COMPLETE FOLDER STRUCTURE

```
fortis-bank/
├── frontend/                    ← React.js Banking UI
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js   ← Login state management
│   │   ├── components/
│   │   │   └── Sidebar.js       ← Navigation sidebar
│   │   ├── pages/
│   │   │   ├── Login.js         ← Login page
│   │   │   ├── Dashboard.js     ← Balance + transactions
│   │   │   ├── Transactions.js  ← Full transaction history
│   │   │   ├── Transfer.js      ← Send money (3-step flow)
│   │   │   └── Profile.js       ← Account profile
│   │   ├── App.js               ← Routing setup
│   │   ├── App.css              ← Global styles
│   │   └── index.js             ← React entry point
│   ├── Dockerfile               ← 2-stage: build + nginx
│   ├── nginx.conf               ← Nginx config for SPA
│   └── package.json
│
├── backend/                     ← Node.js + Express API
│   ├── server.js                ← All 5 API endpoints
│   ├── Dockerfile
│   └── package.json
│
├── kubernetes/                  ← K8s deployment files
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── backend-deployment.yaml
│   └── backend-service.yaml
│
├── nagios/
│   └── fortis-bank.cfg          ← Nagios monitoring config
│
├── Jenkinsfile                  ← Full CI/CD pipeline
└── README.md
```

---

## 🔴 CRITICAL: HOW CI/CD WORKS (Understand This First!)

```
❌ Code changes DO NOT reflect automatically!

The ONLY way changes reach the live website:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  1. Developer makes code change (e.g., changes text)
  2. git push → code goes to GitHub
  3. Jenkins detects push → starts pipeline automatically
  4. Jenkins installs dependencies → runs npm run build
  5. Docker builds new image with new code inside
  6. Image is pushed to Docker Hub with new tag
  7. Kubernetes replaces old pods with new pods (rolling update)
  8. NOW the website shows updated changes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you DON'T push to GitHub → Jenkins doesn't run →
Docker image stays old → Kubernetes keeps old pods →
Website shows old content!
```

---

## PART 1: REACT FRONTEND — SETUP & RUN

### Step 1.1 — Install Node.js (on Ubuntu VM)
```bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install Node.js 18
nvm install 18
nvm use 18

# Verify
node --version    # Should show v18.x.x
npm --version     # Should show 9.x.x
```

### Step 1.2 — Run Frontend Locally
```bash
cd fortis-bank/frontend

# Install dependencies
npm install

# Start development server
npm start
# Opens at: http://localhost:3000
```

**Login credentials:**
- Username: `john.doe`
- Password: `password123`

### Step 1.3 — Frontend Pages Explained
| Page | URL | What It Shows |
|------|-----|---------------|
| Login | / | Username/password form |
| Dashboard | /dashboard | Balance card, recent 4 transactions, quick actions |
| Transactions | /transactions | Full history with filter (all/credit/debit) |
| Transfer | /transfer | 3-step money transfer flow |
| Profile | /profile | Account details, security settings |

---

## PART 2: BACKEND — SETUP & RUN

### Step 2.1 — Run Backend Locally
```bash
cd fortis-bank/backend

# Install dependencies
npm install

# Start server
node server.js
# Running at: http://localhost:5000
```

### Step 2.2 — Test APIs Manually
```bash
# Test Login
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john.doe","password":"password123"}'

# Test Balance
curl http://localhost:5000/balance

# Test Transactions
curl http://localhost:5000/transactions

# Test Transfer
curl -X POST http://localhost:5000/transfer \
  -H "Content-Type: application/json" \
  -d '{"toAccount":"1234567890","amount":5000,"description":"Test"}'

# Test Profile
curl http://localhost:5000/profile
```

---

## PART 3: GITHUB — PUSH YOUR PROJECT

### Step 3.1 — Create GitHub Repository
1. Go to https://github.com
2. Click **New Repository**
3. Name it: `fortis-bank`
4. Visibility: **Public** (required for Jenkins webhook)
5. Click **Create Repository**

### Step 3.2 — Push Code to GitHub
```bash
cd fortis-bank

# Initialize git
git init

# Create .gitignore
cat > .gitignore << EOF
node_modules/
build/
.env
*.log
EOF

# Add all files
git add .

# Commit
git commit -m "Initial commit: Fortis Bank DevOps Project"

# Add remote (replace with YOUR GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/fortis-bank.git

# Push to GitHub
git push -u origin main
```

### Step 3.3 — How to Push Future Code Changes
```bash
# After making any change:
git add .
git commit -m "describe your change here"
git push

# This push triggers Jenkins automatically!
```

---

## PART 4: DOCKER — BUILD & PUSH IMAGES

### Step 4.1 — Install Docker on Ubuntu VM
```bash
# Update system
sudo apt update

# Install Docker
sudo apt install -y docker.io

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (so you don't need sudo)
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
```

### Step 4.2 — Build Docker Images Manually
```bash
# Build backend image
cd fortis-bank
docker build -t fortis-bank-backend ./backend

# Build frontend image  
docker build -t fortis-bank-frontend ./frontend

# List your images
docker images
```

### Step 4.3 — Run Containers Locally (without Kubernetes)
```bash
# Run backend container
docker run -d -p 5000:5000 --name fortis-backend fortis-bank-backend

# Run frontend container
docker run -d -p 3000:80 --name fortis-frontend fortis-bank-frontend

# Check running containers
docker ps

# Access:  http://localhost:3000 (frontend)
#          http://localhost:5000 (backend)
```

### Step 4.4 — Push to Docker Hub
```bash
# Login to Docker Hub (create account at hub.docker.com first)
docker login

# Tag images with your Docker Hub username
docker tag fortis-bank-backend YOUR_DOCKERHUB_USERNAME/fortis-bank-backend:latest
docker tag fortis-bank-frontend YOUR_DOCKERHUB_USERNAME/fortis-bank-frontend:latest

# Push images
docker push YOUR_DOCKERHUB_USERNAME/fortis-bank-backend:latest
docker push YOUR_DOCKERHUB_USERNAME/fortis-bank-frontend:latest
```

---

## PART 5: JENKINS — CI/CD PIPELINE

### Step 5.1 — Install Jenkins on Ubuntu VM
```bash
# Install Java (Jenkins needs Java)
sudo apt update
sudo apt install -y openjdk-17-jdk

# Add Jenkins repository
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'

# Install Jenkins
sudo apt update
sudo apt install -y jenkins

# Start Jenkins
sudo systemctl start jenkins
sudo systemctl enable jenkins

# Check status
sudo systemctl status jenkins
```

### Step 5.2 — Open Jenkins in Browser
```
http://localhost:8080
OR
http://<your-ubuntu-vm-ip>:8080
```

Get the initial admin password:
```bash
sudo cat /var/jenkins_home/secrets/initialAdminPassword
```

- Paste password → Install Suggested Plugins → Create Admin User

### Step 5.3 — Install Required Jenkins Plugins
1. Go to **Manage Jenkins** → **Plugins** → **Available Plugins**
2. Search and install:
   - `Git Plugin` (usually pre-installed)
   - `GitHub Integration Plugin`
   - `Docker Pipeline Plugin`
   - `NodeJS Plugin`
3. Click **Install Without Restart**

### Step 5.4 — Configure NodeJS in Jenkins
1. **Manage Jenkins** → **Tools**
2. Scroll to **NodeJS installations**
3. Click **Add NodeJS**
   - Name: `NodeJS-18`
   - Version: `18.x`
4. Click **Save**

### Step 5.5 — Add Docker Hub Credentials to Jenkins
1. **Manage Jenkins** → **Credentials** → **System** → **Global credentials**
2. Click **Add Credentials**
   - Kind: `Username with password`
   - Username: your Docker Hub username
   - Password: your Docker Hub password
   - ID: `dockerhub-credentials` ← must match Jenkinsfile exactly
3. Click **Create**

### Step 5.6 — Create Jenkins Pipeline
1. Click **New Item**
2. Name it: `fortis-bank-pipeline`
3. Choose: **Pipeline**
4. Click **OK**

**In the pipeline config:**

Under **Build Triggers**:
- ✅ Check **GitHub hook trigger for GITScm polling**

Under **Pipeline**:
- Definition: **Pipeline script from SCM**
- SCM: **Git**
- Repository URL: `https://github.com/YOUR_USERNAME/fortis-bank.git`
- Branch: `*/main`
- Script Path: `Jenkinsfile`

5. Click **Save**

### Step 5.7 — Set Up GitHub Webhook (Auto-trigger Jenkins)
1. Go to your GitHub repo → **Settings** → **Webhooks**
2. Click **Add webhook**
   - Payload URL: `http://<your-ubuntu-vm-ip>:8080/github-webhook/`
   - Content type: `application/json`
   - Events: **Just the push event**
3. Click **Add webhook**

Now every `git push` will **automatically trigger Jenkins!**

### Step 5.8 — Run Pipeline Manually (First Time)
1. Open your pipeline in Jenkins
2. Click **Build Now**
3. Click the build number → **Console Output** to watch it run

---

## PART 6: KUBERNETES — DEPLOY THE APP

### Step 6.1 — Install Minikube (Local K8s Cluster)
```bash
# Install kubectl
sudo apt update
sudo apt install -y kubectl

# Install Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Start Minikube (uses Docker driver)
minikube start --driver=docker

# Verify
kubectl get nodes
# Should show: minikube   Ready   ...
```

### Step 6.2 — Update Image Names in YAML Files
Open both deployment YAMLs and replace:
```
yourdockerhubusername/fortis-bank-backend:IMAGE_TAG
```
With your actual Docker Hub username. Jenkins will replace `IMAGE_TAG` automatically during pipeline runs.

### Step 6.3 — Deploy Manually (First Time)
```bash
cd fortis-bank/kubernetes

# Update IMAGE_TAG for manual deployment
sed -i 's|IMAGE_TAG|latest|g' backend-deployment.yaml
sed -i 's|IMAGE_TAG|latest|g' frontend-deployment.yaml

# Deploy backend
kubectl apply -f backend-deployment.yaml
kubectl apply -f backend-service.yaml

# Deploy frontend
kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml

# Check deployment status
kubectl get pods
kubectl get services
```

### Step 6.4 — Access the Application
```bash
# Get Minikube IP
minikube ip   # e.g., 192.168.49.2

# Access frontend:  http://192.168.49.2:30800
# Access backend:   http://192.168.49.2:30500
```

### Step 6.5 — Useful Kubernetes Commands
```bash
# See all running pods
kubectl get pods

# See pod logs (replace pod-name with actual name)
kubectl logs <pod-name>

# See detailed info about a pod
kubectl describe pod <pod-name>

# Delete and re-deploy everything
kubectl delete -f kubernetes/
kubectl apply -f kubernetes/

# Watch pods live
kubectl get pods -w

# Check rollout status
kubectl rollout status deployment/fortis-backend
kubectl rollout status deployment/fortis-frontend
```

---

## PART 7: NAGIOS — MONITORING

### Step 7.1 — Install Nagios on Ubuntu VM
```bash
# Install dependencies
sudo apt update
sudo apt install -y nagios4 nagios-plugins-basic nagios-nrpe-plugin

# Start Nagios
sudo systemctl start nagios4
sudo systemctl enable nagios4
```

### Step 7.2 — Set Up Nagios Password
```bash
sudo htpasswd -c /etc/nagios4/htpasswd.users nagiosadmin
# Enter a password when prompted
```

### Step 7.3 — Add Fortis Bank Monitoring Config
```bash
# Copy our config file to Nagios
sudo cp fortis-bank/nagios/fortis-bank.cfg /etc/nagios4/conf.d/

# Update the IP address in config
# Replace 127.0.0.1 with your Ubuntu VM IP
sudo nano /etc/nagios4/conf.d/fortis-bank.cfg

# Verify config is valid
sudo nagios4 -v /etc/nagios4/nagios.cfg

# Restart Nagios
sudo systemctl restart nagios4
```

### Step 7.4 — Access Nagios Dashboard
```
http://localhost/nagios4
OR
http://<ubuntu-vm-ip>/nagios4

Username: nagiosadmin
Password: (what you set above)
```

- Go to **Services** → See Fortis Frontend App, Backend API, CPU, Disk
- Green = OK, Red = Problem (alert would be sent)

---

## PART 8: COMPLETE PIPELINE FLOW DEMO

### Showing Code Change → Deploy Flow (For Viva)

**Step 1:** Make a visible change in the code
```bash
# Open Login.js and change the tagline
nano frontend/src/pages/Login.js
# Change: "Banking That Moves With You."
# To:     "Secure Banking. Anywhere. Anytime."
```

**Step 2:** Push to GitHub
```bash
git add .
git commit -m "Changed login page tagline"
git push
```

**Step 3:** Watch Jenkins (automatic)
- GitHub sends webhook → Jenkins starts pipeline
- Pipeline runs all 7 stages (takes 3-5 min)
- New Docker image built with new code
- Kubernetes gets new pods via rolling update

**Step 4:** Verify the change
```bash
# Check new pod is running
kubectl get pods
kubectl rollout status deployment/fortis-frontend

# Open browser → refresh → new text visible!
```

---

## PART 9: QUICK REFERENCE — ALL COMMANDS

```bash
# ──── LOCAL DEVELOPMENT ────────────────────────────────────
# Start backend
cd backend && node server.js

# Start frontend
cd frontend && npm start

# ──── DOCKER ──────────────────────────────────────────────
docker build -t fortis-backend ./backend
docker build -t fortis-frontend ./frontend
docker run -d -p 5000:5000 fortis-backend
docker run -d -p 3000:80 fortis-frontend
docker ps                           # list running containers
docker stop fortis-backend fortis-frontend

# ──── KUBERNETES ──────────────────────────────────────────
minikube start
kubectl apply -f kubernetes/
kubectl get pods
kubectl get services
minikube ip                         # get IP to access app
kubectl logs <pod-name>

# ──── GIT / GITHUB ────────────────────────────────────────
git add . && git commit -m "msg" && git push   # trigger Jenkins

# ──── JENKINS ─────────────────────────────────────────────
# Access: http://localhost:8080
sudo systemctl restart jenkins

# ──── NAGIOS ──────────────────────────────────────────────
# Access: http://localhost/nagios4
sudo systemctl restart nagios4
```

---

## PIPELINE STAGES EXPLAINED (For Viva)

| Stage | What Happens | Why Important |
|-------|-------------|---------------|
| **Checkout** | Jenkins pulls latest code from GitHub | Gets the new code |
| **Install & Test** | `npm install` runs for both frontend & backend | Ensures dependencies are available |
| **Build Frontend** | `npm run build` creates optimized production files | React needs to be compiled |
| **Build Docker Images** | `docker build` packages code + dependencies into images | Creates portable containers |
| **Push to Docker Hub** | Images stored in registry with build number tag | Version-controlled, accessible by K8s |
| **Deploy to Kubernetes** | `kubectl apply` updates pods with new image | Live deployment, zero downtime |
| **Verify** | Checks pod status | Confirms everything is healthy |

---

## 🎓 VIVA PREPARATION — Key Answers

**Q: What is a CI/CD pipeline?**
A: CI (Continuous Integration) = automatically build and test code after every push. CD (Continuous Deployment) = automatically deploy the tested build to production. Jenkins automates both steps.

**Q: Why Docker?**
A: Docker packages the app with all its dependencies into a container that runs the same way anywhere — developer laptop, server, or cloud.

**Q: Why Kubernetes?**
A: Kubernetes manages multiple Docker containers. It restarts crashed pods, scales up when traffic increases, and does rolling updates (zero downtime during deployment).

**Q: What is Nagios?**
A: Nagios monitors the live application 24/7. It checks if the website responds, if the API is working, and if CPU/memory/disk are within limits. It alerts when something goes wrong.

**Q: Why does a code change not reflect immediately?**
A: The running application is inside a Docker container, which was built from a specific snapshot of code. To get new code into production, you must: push → Jenkins builds a new Docker image → Kubernetes replaces old containers with new ones.
~/redeploy.sh
ngrok http 8080
cd /mnt/c/Users/Sachin\ Baradkar/fortis-bank

Terminal 1 — Start Minikube
bashminikube start --driver=docker
minikube status
✅ Wait for Running

Terminal 1 — Build Images & Deploy
basheval $(minikube docker-env)

docker build -t fortis-bank-backend:latest "/mnt/c/Users/Sachin Baradkar/fortis-bank/backend/"
docker build -t fortis-bank-frontend:latest "/mnt/c/Users/Sachin Baradkar/fortis-bank/frontend/"

kubectl delete deployment fortis-backend fortis-frontend 2>/dev/null
kubectl apply -f "/mnt/c/Users/Sachin Baradkar/fortis-bank/kubernetes/backend-deployment.yaml"
kubectl apply -f "/mnt/c/Users/Sachin Baradkar/fortis-bank/kubernetes/backend-service.yaml"
kubectl apply -f "/mnt/c/Users/Sachin Baradkar/fortis-bank/kubernetes/frontend-deployment.yaml"
kubectl apply -f "/mnt/c/Users/Sachin Baradkar/fortis-bank/kubernetes/frontend-service.yaml"

kubectl get pods -w
✅ Wait for all 4 pods Running. Press Ctrl+C

Terminal 2 — Frontend Port Forward (KEEP OPEN)
bashkubectl port-forward service/fortis-frontend-service 3000:80

Terminal 3 — Backend Port Forward (KEEP OPEN)
bashkubectl port-forward service/fortis-backend-service 5000:5000

Terminal 4 — Start Jenkins
bashsudo systemctl start jenkins
sudo systemctl status jenkins

Terminal 4 — Start ngrok
bashngrok http 8080
✅ Copy the https://xxxx.ngrok-free.app URL
Update GitHub webhook with new ngrok URL:

GitHub → repo → Settings → Webhooks → Edit
Payload URL: https://xxxx.ngrok-free.app/github-webhook/
Save


Open These Browser Tabs Before Teacher Arrives
TabURLWebsitehttp://localhost:3000Backend APIhttp://localhost:5000/balanceJenkinshttp://localhost:8080Docker Hubhttps://hub.docker.com/u/sachinbaradkarGitHubhttps://github.com/SachinBaradkar/fortis-bank

Final Check
bashkubectl get pods      # all 4 Running ✅
kubectl get services  # frontend + backend listed ✅
Login to http://localhost:3000 with sachin.baradkar / password123 ✅


🎬 DEMO WITH TEACHER

STEP 1 — Introduce the Project (1 min)
Say:

"This is Fortis Bank — a full-stack banking web application. The main focus is the DevOps CI/CD pipeline. The complete automated flow is: Developer writes code → pushes to GitHub → Jenkins detects it automatically → builds the app → creates Docker image → pushes to Docker Hub → deploys to Kubernetes → changes go live."

Show folder structure:
bashls "/mnt/c/Users/Sachin Baradkar/fortis-bank/"

STEP 2 — Show the Live Website (3 mins)
Open http://localhost:3000

Login page → enter sachin.baradkar / password123 → Sign In
Dashboard → "Balance and transactions come from Node.js backend API"
Transactions → show filter All/Credits/Debits
Transfer → fill form → show success with reference number
Profile → show account details


STEP 3 — Show Backend APIs (1 min)
Open browser tabs:
http://localhost:5000/balance
http://localhost:5000/transactions
Say:

"These are our REST APIs running inside Docker containers managed by Kubernetes. The React frontend calls these APIs to display data to the user."


STEP 4 — Show GitHub (1 min)
Open https://github.com/SachinBaradkar/fortis-bank

Show all files and folders
Click Commits → show commit history

Say:

"Every code change is tracked here. When I push code, GitHub notifies Jenkins via webhook to start the pipeline."


STEP 5 — Show Docker Hub (1 min)
Open https://hub.docker.com/u/sachinbaradkar

Show fortis-bank-frontend and fortis-bank-backend repositories
Click one → show Tags → show build numbers (5, latest etc.)

Say:

"Jenkins builds Docker images and pushes them here with a unique build number tag. Kubernetes pulls these images to create containers."


STEP 6 — Show Kubernetes (2 mins)
bash# Show pods
kubectl get pods
Say: "4 pods running — 2 frontend, 2 backend. If one crashes Kubernetes restarts it automatically."
bash# Show services
kubectl get services
Say: "Services expose pods on fixed ports — frontend on 3000, backend on 5000."
bash# Show deployments
kubectl get deployments
Say: "Deployments manage replicas and handle rolling updates with zero downtime."

STEP 7 — Show Docker (1 min)
basheval $(minikube docker-env)
docker images | grep fortis
docker ps | grep fortis
Say:

"These are our Docker images. Each image contains the complete app with all dependencies. Kubernetes runs these as containers inside pods."


STEP 8 — Show Jenkins (2 mins)
Open http://localhost:8080

Click fortis-bank-pipeline
Show list of previous builds
Click latest build → Console Output
Point to each stage:

Say:

"Stage 1 — Checkout: pulled latest code from GitHub. Stage 2 — Install: npm install for frontend and backend. Stage 3 — Build: React compiled to production. Stage 4 — Docker Build: new image created with new code. Stage 5 — Push: image sent to Docker Hub. Stage 6 — Deploy: Kubernetes updated with new image."


STEP 9 — ⭐ LIVE CI/CD DEMO (Most Important — 5 mins)

9.1 — Show current website
Open http://localhost:3000
Point to login page — show current text to teacher
Say:

"I will now make a code change. Watch — website will NOT update until full pipeline runs."


9.2 — Make change in VS Code
Open VS Code → frontend/src/pages/Login.js
Find this line:
Secure Banking.
Change to:
Smart Banking.
Press Ctrl+S

9.3 — Refresh browser BEFORE push
Refresh http://localhost:3000
Say:

"See — old text still showing. Code changed on my machine but pipeline hasn't run yet. This proves changes don't reflect automatically."


9.4 — Push to GitHub
bashcd "/mnt/c/Users/Sachin Baradkar/fortis-bank"
git add .
git commit -m "Changed login heading - live demo"
git push
Say:

"Code pushed to GitHub. GitHub webhook will now notify Jenkins automatically."


9.5 — Show Jenkins auto-triggered
Switch to Jenkins browser tab → fortis-bank-pipeline
Show new build started automatically ✅
Click it → Console Output → show stages running live
Say:

"Jenkins detected the push via webhook and started automatically. Watch it install dependencies, build React, create Docker image, push to Docker Hub."


9.6 — Redeploy to Kubernetes
While Jenkins runs, in Terminal 1:
bash~/redeploy.sh
Watch output:
🔄 Rebuilding and redeploying...
✅ Done! Refresh http://localhost:3000

9.7 — Show change is LIVE
Refresh http://localhost:3000
✅ New text "Smart Banking." now visible on login page!
Say:

"Change is now live — only after going through the complete pipeline: Code → GitHub → Jenkins → Docker → Kubernetes. This is CI/CD in action."


STEP 10 — Show Nagios (if asked)
bashsudo systemctl start nagios4
Open http://localhost/nagios4 → login: nagiosadmin
Click Services → show all green ✅
Say:

"Nagios monitors our application 24/7. It checks if frontend is responding, if backend API is working, and monitors CPU, memory, disk. If anything goes down it sends an alert."



📋 QUICK VIVA ANSWERS
Q: What is CI/CD?

"CI = Continuous Integration — automatically build and test code on every push. CD = Continuous Deployment — automatically deploy tested build to production. Together they eliminate manual steps between writing code and going live."

Q: What is Jenkins?

"Jenkins is the automation server — the brain of our pipeline. It watches GitHub via webhook, and when code is pushed it automatically runs all stages: checkout, install, build, dockerize, deploy."

Q: What is Docker?

"Docker packages the app with all its dependencies into a container. It runs the same way on any machine — no 'works on my machine' problem."

Q: What is Kubernetes?

"Kubernetes manages Docker containers. It runs multiple replicas for high availability, automatically restarts crashed pods, and does rolling updates with zero downtime."

Q: What is Nagios?

"Nagios monitors the live application 24/7. It checks if services are up, measures response times, and monitors system resources. It alerts the team immediately if something fails."

Q: Why doesn't code change reflect immediately?

"The running app is inside a Docker container built from old code. New code only goes live after the complete pipeline runs — push triggers Jenkins, Jenkins builds new Docker image, Kubernetes replaces old containers with new ones."

Q: What is a webhook?

"A webhook is an automatic notification. When code is pushed to GitHub, GitHub sends an HTTP POST request to Jenkins URL. Jenkins receives it and immediately starts the pipeline — no manual triggering needed."

Q: What is a rolling update?

"Kubernetes starts new pods with new code before killing old pods. So during deployment, some pods serve old version and some serve new — users never see downtime."


🚨 EMERGENCY FIXES
Website not opening:
bashkubectl port-forward service/fortis-frontend-service 3000:80
Pods not running:
basheval $(minikube docker-env)
docker build -t fortis-bank-frontend:latest "/mnt/c/Users/Sachin Baradkar/fortis-bank/frontend/"
docker build -t fortis-bank-backend:latest "/mnt/c/Users/Sachin Baradkar/fortis-bank/backend/"
kubectl rollout restart deployment/fortis-frontend
kubectl rollout restart deployment/fortis-backend
kubectl get pods -w
Jenkins not opening:
bashsudo systemctl restart jenkins
# Wait 30 seconds
Jenkins not auto-triggering:
bash# Restart ngrok and update webhook URL in GitHub
ngrok http 8080
Then manually click Build Now in Jenkins and explain webhook concept verbally.
Change not reflecting after redeploy.sh:
bash# Stop and restart port-forward
# Ctrl+C in Terminal 2, then:
kubectl port-forward service/fortis-frontend-service 3000:80

✅ DEMO CHECKLIST
Setup:
□ minikube start → Running
□ All 4 pods → Running
□ Terminal 2 → port-forward frontend 3000
□ Terminal 3 → port-forward backend 5000
□ Jenkins → active on :8080
□ ngrok running → webhook updated in GitHub
□ http://localhost:3000 → opens ✅
□ Login works → sachin.baradkar / password123 ✅
□ http://localhost:5000/balance → responds ✅

During Demo:
□ Show website all 5 pages
□ Show backend APIs in browser
□ Show GitHub repo + commits
□ Show Docker Hub images
□ Show kubectl get pods/services
□ Show docker images
□ Show Jenkins pipeline + console output
□ Live demo: change → push → Jenkins → K8s → live ✅
□ Show Nagios monitoring
Total demo time: ~20 minutes 🎓