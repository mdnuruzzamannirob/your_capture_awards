// Build & deploy pipeline for the Your Capture Awards Next.js frontend.
//
// Required Jenkins setup:
//   Plugins:     Pipeline, Git, NodeJS, SSH Agent, Credentials Binding, Timestamper
//   Tools:       NodeJS installation named "NodeJS-20" (Manage Jenkins > Tools)
//   Credentials: your-capture-awards-ssh  (SSH Username with private key, user "root")
//                your-capture-awards-env  (Secret file: the production .env)
//
// Server prerequisites: node >= 20, npm, pm2, curl, tar, flock.

pipeline {
    agent any

    tools {
        nodejs 'NodeJS-24'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '5'))
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
    }

    parameters {
        booleanParam(name: 'SKIP_DEPLOY', defaultValue: false, description: 'Build and package only; do not deploy.')
    }

    environment {
        APP_NAME                = 'your-capture-awards'
        DEPLOY_BRANCH           = 'main'
        DEPLOY_HOST             = '161.35.56.119'
        DEPLOY_USER             = 'root'
        DEPLOY_PATH             = '/var/www/your-capture-awards'
        APP_PORT                = '3000'
        KEEP_RELEASES           = '5'
        SSH_CREDENTIALS_ID      = 'your-capture-awards-ssh'
        ENV_FILE_CREDENTIALS_ID = 'your-capture-awards-env'
        ARTIFACT                = 'release.tar.gz'
        NEXT_TELEMETRY_DISABLED = '1'
        CI                      = 'true'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    def shortSha = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    def timestamp = sh(script: 'date -u +%Y%m%d%H%M%S', returnStdout: true).trim()
                    env.RELEASE_ID = "${timestamp}-${env.BUILD_NUMBER}-${shortSha}"
                    currentBuild.displayName = "#${env.BUILD_NUMBER} (${shortSha})"
                }
                sh 'node --version && npm --version'
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci --no-audit --no-fund'
            }
        }

        stage('Build') {
            steps {
                // NEXT_PUBLIC_* values are inlined at build time, so the env file must be present here.
                withCredentials([file(credentialsId: env.ENV_FILE_CREDENTIALS_ID, variable: 'ENV_FILE')]) {
                    sh '''
                        set -eu
                        install -m 600 "$ENV_FILE" .env
                        npm run build
                    '''
                }
            }
            post {
                always {
                    sh 'rm -f .env'
                }
            }
        }

        stage('Package') {
            steps {
                sh '''
                    set -eu
                    rm -f "$ARTIFACT"
                    tar --exclude='.next/cache' -czf "$ARTIFACT" \
                        .next public package.json package-lock.json \
                        next.config.ts tsconfig.json ecosystem.config.js
                    ls -lh "$ARTIFACT"
                '''
                archiveArtifacts artifacts: env.ARTIFACT, fingerprint: true
            }
        }

        stage('Deploy') {
            when {
                beforeAgent true
                allOf {
                    expression { !params.SKIP_DEPLOY }
                    expression {
                        def branch = (env.BRANCH_NAME ?: env.GIT_BRANCH ?: '').replaceFirst(/^origin\//, '')
                        return branch == env.DEPLOY_BRANCH
                    }
                }
            }
            steps {
                sshagent(credentials: [env.SSH_CREDENTIALS_ID]) {
                    withCredentials([file(credentialsId: env.ENV_FILE_CREDENTIALS_ID, variable: 'ENV_FILE')]) {
                        sh '''
                            set -eu
                            SSH_OPTS="-o BatchMode=yes -o StrictHostKeyChecking=accept-new -o ConnectTimeout=15 -o ServerAliveInterval=30"
                            REMOTE="$DEPLOY_USER@$DEPLOY_HOST"
                            RELEASE_DIR="$DEPLOY_PATH/releases/$RELEASE_ID"

                            echo "Uploading release $RELEASE_ID to $REMOTE"
                            ssh $SSH_OPTS "$REMOTE" "mkdir -p '$RELEASE_DIR' '$DEPLOY_PATH/shared'"
                            scp $SSH_OPTS "$ARTIFACT" "$REMOTE:$RELEASE_DIR/$ARTIFACT"
                            ssh $SSH_OPTS "$REMOTE" "umask 077 && cat > '$DEPLOY_PATH/shared/.env'" < "$ENV_FILE"

                            echo "Activating release"
                            ssh $SSH_OPTS "$REMOTE" \
                                "APP_NAME='$APP_NAME' DEPLOY_PATH='$DEPLOY_PATH' RELEASE_ID='$RELEASE_ID' APP_PORT='$APP_PORT' KEEP_RELEASES='$KEEP_RELEASES' bash -s" \
                                < deploy/remote-deploy.sh
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo "Build ${env.RELEASE_ID} succeeded."
        }
        failure {
            echo "Build ${env.RELEASE_ID} failed. See the stage logs above; a failed deploy is rolled back automatically."
        }
        always {
            sh "rm -f .env '${env.ARTIFACT}'"
        }
    }
}
