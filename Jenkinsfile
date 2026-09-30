// Build & deploy pipeline for the Your Capture Awards Next.js frontend.
// Runs on a Windows Jenkins agent and deploys to a Linux server over SSH.
//
// Required Jenkins setup:
//   Plugins:     Pipeline, Git, NodeJS, Credentials Binding, Timestamper
//   Tools:       NodeJS installation named "node-24" (Manage Jenkins > Tools)
//   Credentials: your-capture-awards-ssh  (SSH Username with private key, user "root")
//                your-capture-awards-env  (Secret file: the production .env)
//
// Windows agent prerequisites: Windows 10 1809+ / Server 2019+ with the built-in
// OpenSSH Client (ssh.exe, scp.exe) and tar.exe, Git, Windows PowerShell 5.1.
// Server prerequisites: node >= 20, npm, pm2, curl, tar, flock.

pipeline {
    agent any

    tools {
        nodejs 'node-24'
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
                script {
                    def scmVars = checkout scm
                    def shortSha = scmVars.GIT_COMMIT.substring(0, 7)
                    def timestamp = powershell(returnStdout: true, script: '[DateTime]::UtcNow.ToString("yyyyMMddHHmmss")').trim()
                    env.RELEASE_ID = "${timestamp}-${env.BUILD_NUMBER}-${shortSha}"
                    currentBuild.displayName = "#${env.BUILD_NUMBER} (${shortSha})"
                }
                bat '''
                    @echo off
                    node --version || exit /b 1
                    call npm --version || exit /b 1
                '''
            }
        }

        stage('Install') {
            steps {
                bat 'call npm ci --no-audit --no-fund'
            }
        }

        stage('Build') {
            steps {
                // NEXT_PUBLIC_* values are inlined at build time, so the env file must be present here.
                withCredentials([file(credentialsId: env.ENV_FILE_CREDENTIALS_ID, variable: 'ENV_FILE')]) {
                    bat '''
                        @echo off
                        copy /Y "%ENV_FILE%" .env >nul || exit /b 1
                        call npm run build || exit /b 1
                    '''
                }
            }
            post {
                always {
                    bat '@if exist .env del /f /q .env'
                }
            }
        }

        stage('Package') {
            steps {
                // Uses the tar.exe that ships with Windows; its archives extract fine with GNU tar on Linux.
                bat '''
                    @echo off
                    if exist "%ARTIFACT%" del /f /q "%ARTIFACT%"
                    "%SystemRoot%/System32/tar.exe" --exclude=.next/cache -czf "%ARTIFACT%" .next public package.json package-lock.json next.config.ts tsconfig.json ecosystem.config.js || exit /b 1
                    dir "%ARTIFACT%"
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
                withCredentials([
                    sshUserPrivateKey(credentialsId: env.SSH_CREDENTIALS_ID, keyFileVariable: 'SSH_KEY'),
                    file(credentialsId: env.ENV_FILE_CREDENTIALS_ID, variable: 'ENV_FILE'),
                ]) {
                    powershell '''
                        # Native tools write progress to stderr; failures are detected via exit codes instead.
                        $ErrorActionPreference = 'Continue'

                        function Resolve-Tool([string]$Name) {
                            $builtIn = Join-Path $env:SystemRoot "System32/OpenSSH/$Name.exe"
                            if (Test-Path -LiteralPath $builtIn) { return $builtIn }
                            $cmd = Get-Command "$Name.exe" -ErrorAction SilentlyContinue
                            if ($cmd) { return $cmd.Source }
                            throw "$Name.exe not found. Install the 'OpenSSH Client' Windows optional feature."
                        }

                        function Invoke-Native([string]$Exe, [string[]]$Arguments) {
                            & $Exe @Arguments
                            if ($LASTEXITCODE -ne 0) {
                                throw ('{0} failed with exit code {1}' -f (Split-Path $Exe -Leaf), $LASTEXITCODE)
                            }
                        }

                        $ssh = Resolve-Tool 'ssh'
                        $scp = Resolve-Tool 'scp'
                        $remote = "$env:DEPLOY_USER@$env:DEPLOY_HOST"
                        $releaseDir = "$env:DEPLOY_PATH/releases/$env:RELEASE_ID"
                        $sharedDir = "$env:DEPLOY_PATH/shared"
                        $envUpload = '.env.deploy'
                        $keyFile = [IO.Path]::GetTempFileName()

                        try {
                            # Windows OpenSSH refuses keys readable by other accounts, and needs LF line
                            # endings plus a trailing newline. Lock the file down before writing the key.
                            $me = [Security.Principal.WindowsIdentity]::GetCurrent().User.Value
                            Invoke-Native 'icacls.exe' @($keyFile, '/inheritance:r', '/grant:r', "*${me}:F")
                            $keyText = (Get-Content -LiteralPath $env:SSH_KEY -Raw) -replace "`r`n", "`n"
                            if (-not $keyText.EndsWith("`n")) { $keyText += "`n" }
                            [IO.File]::WriteAllText($keyFile, $keyText)

                            $sshOpts = @(
                                '-i', $keyFile,
                                '-o', 'IdentitiesOnly=yes',
                                '-o', 'BatchMode=yes',
                                '-o', 'StrictHostKeyChecking=accept-new',
                                '-o', 'ConnectTimeout=15',
                                '-o', 'ServerAliveInterval=30'
                            )

                            Write-Host "Uploading release $env:RELEASE_ID to $remote"
                            Invoke-Native $ssh ($sshOpts + @($remote, "mkdir -p '$releaseDir' '$sharedDir' && chmod 700 '$sharedDir'"))

                            # Relative paths keep scp from mistaking the Windows drive letter for a host name.
                            Copy-Item -LiteralPath $env:ENV_FILE -Destination $envUpload -Force -ErrorAction Stop
                            Invoke-Native $scp ($sshOpts + @($env:ARTIFACT, "${remote}:$releaseDir/$env:ARTIFACT"))
                            Invoke-Native $scp ($sshOpts + @('deploy/remote-deploy.sh', "${remote}:$releaseDir/remote-deploy.sh"))
                            Invoke-Native $scp ($sshOpts + @($envUpload, "${remote}:$sharedDir/.env.upload"))

                            Write-Host 'Activating release'
                            $vars = "APP_NAME='$env:APP_NAME' DEPLOY_PATH='$env:DEPLOY_PATH' RELEASE_ID='$env:RELEASE_ID' APP_PORT='$env:APP_PORT' KEEP_RELEASES='$env:KEEP_RELEASES'"
                            $activate = "set -e; " +
                                "mv -f '$sharedDir/.env.upload' '$sharedDir/.env'; chmod 600 '$sharedDir/.env'; " +
                                "tr -d '\\r' < '$releaseDir/remote-deploy.sh' | $vars bash -s"
                            Invoke-Native $ssh ($sshOpts + @($remote, $activate))
                        }
                        finally {
                            Remove-Item -LiteralPath $keyFile, $envUpload -Force -ErrorAction SilentlyContinue
                        }
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Build ${env.RELEASE_ID ?: currentBuild.displayName} succeeded."
        }
        failure {
            echo "Build ${env.RELEASE_ID ?: currentBuild.displayName} failed. See the stage logs above; a failed deploy is rolled back automatically."
        }
        always {
            bat '''
                @echo off
                if exist .env del /f /q .env
                if exist .env.deploy del /f /q .env.deploy
                if exist "%ARTIFACT%" del /f /q "%ARTIFACT%"
                exit /b 0
            '''
        }
    }
}
