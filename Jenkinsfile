// ============================================================
//  FORTIS BANK — Jenkins CI/CD Pipeline
//  Flow: GitHub Push → Jenkins → Docker Build → K8s Deploy
// ============================================================

pipeline {
    agent any
     tools {
        nodejs 'NodeJS-18'
    }
    environment {
        // Docker Hub username (change to yours)
        DOCKER_USER    = 'sachinbaradkar'
        FRONTEND_IMAGE = "${DOCKER_USER}/fortis-bank-frontend"
        BACKEND_IMAGE  = "${DOCKER_USER}/fortis-bank-backend"
        // Use BUILD_NUMBER so each build creates a unique image tag
        IMAGE_TAG      = "${BUILD_NUMBER}"
    }

    stages {

        // ── Stage 1: Checkout Code from GitHub ────────────────────────────
        stage('Checkout') {
            steps {
                echo '📥 Pulling latest code from GitHub...'
                checkout scm
                echo "✅ Code checked out at commit: ${env.GIT_COMMIT}"
            }
        }

        // ── Stage 2: Install Dependencies & Test ──────────────────────────
        stage('Install & Test') {
            parallel {
                stage('Frontend Deps') {
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                            echo '✅ Frontend dependencies installed'
                        }
                    }
                }
                stage('Backend Deps') {
                    steps {
                        dir('backend') {
                            sh 'npm install'
                            echo '✅ Backend dependencies installed'
                        }
                    }
                }
            }
        }

        // ── Stage 3: Build React App ───────────────────────────────────────
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    echo '🔨 Building React production bundle...'
                    sh 'npm run build'
                    echo '✅ React build complete → /build folder ready'
                }
            }
        }

        // ── Stage 4: Build Docker Images ──────────────────────────────────
        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker images...'
                sh """
                    docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} -t ${FRONTEND_IMAGE}:latest ./frontend
                    docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG}  -t ${BACKEND_IMAGE}:latest  ./backend
                """
                echo '✅ Docker images built successfully'
            }
        }

        // ── Stage 5: Push to Docker Hub ───────────────────────────────────
        stage('Push to Docker Hub') {
            steps {
                echo '📤 Pushing images to Docker Hub...'
                // 'dockerhub-credentials' = ID you set in Jenkins Credentials
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER_VAR',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER_VAR --password-stdin
                        docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                        docker push ${FRONTEND_IMAGE}:latest
                        docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                        docker push ${BACKEND_IMAGE}:latest
                    """
                }
                echo '✅ Images pushed to Docker Hub'
            }
        }

        // ── Stage 6: Deploy to Kubernetes ─────────────────────────────────
        stage('Deploy to Kubernetes') {
    steps {
        echo 'Building Docker images inside Minikube...'
        sh '''
            eval $(minikube docker-env)

            docker build -t fortis-bank-backend:latest ./backend
            docker build -t fortis-bank-frontend:latest ./frontend

            kubectl rollout restart deployment/fortis-backend
            kubectl rollout restart deployment/fortis-frontend
            kubectl rollout status deployment/fortis-backend --timeout=120s
            kubectl rollout status deployment/fortis-frontend --timeout=120s
        '''
        echo 'Deployment complete!'
    }
}
        // ── Stage 7: Verify Deployment ────────────────────────────────────
        stage('Verify') {
            steps {
                sh """
                    echo '--- Kubernetes Pod Status ---'
                    kubectl get pods -l app=fortis-bank
                    echo '--- Services ---'
                    kubectl get services -l app=fortis-bank
                """
            }
        }

    } // end stages

    // ── Post Actions ──────────────────────────────────────────────────────
    post {
        success {
            echo """
            ╔══════════════════════════════════════╗
            ║  ✅ PIPELINE SUCCEEDED                ║
            ║  Build #${BUILD_NUMBER} deployed!     ║
            ╚══════════════════════════════════════╝
            """
        }
        failure {
            echo """
            ╔══════════════════════════════════════╗
            ║  ❌ PIPELINE FAILED                   ║
            ║  Check console output above           ║
            ╚══════════════════════════════════════╝
            """
        }
        always {
            // Clean workspace after build
            cleanWs()
        }
    }

} // end pipeline
