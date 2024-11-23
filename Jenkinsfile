pipeline {
     agent any
     stages {
        stage("Environment Setup"){
             steps{
                script {
                    env.GIT_BRANCH_NAME=sh(returnStdout: true, script: "git name-rev --name-only HEAD").trim()
                    env.BRANCH=env.GIT_BRANCH_NAME.split("origin/")[1]
                }
                echo "GIT_BRANCH is ${env.GIT_BRANCH}"
                echo "GIT_BRANCH_NAME is ${env.GIT_BRANCH_NAME}"
                echo "BRANCH is ${env.BRANCH}"
            }
        }

        stage("Staging Fetch latest code from git") {
            when {
                expression {
                        return env.BRANCH == "develop"
                }
            }
            steps {
                sh "cd /var/www/html/staging/Extra-Slip-backend && git config --global --add safe.directory /var/www/html/staging/Extra-Slip-backend"
                sh "cd /var/www/html/staging/Extra-Slip-backend && sudo chown -R $USER:$USER .git"
                sh "cd /var/www/html/staging/Extra-Slip-backend && git pull origin develop"
            }
        }
        stage("Prod Fetch latest code from git") {
            when {
                expression {
                        return env.BRANCH == "main"
                }
            }
            steps {
                sh "cd /var/www/html/Extra-Slip-backend && git config --global --add safe.directory /var/www/html/staging/Extra-Slip-backend"
                sh "cd /var/www/html/Extra-Slip-backend && sudo chown -R $USER:$USER .git"
                sh "cd /var/www/html/Extra-Slip-backend && git pull origin main"
            }
        }
        stage("Staging Install dependancies") {
            when {
                expression {
                        return env.BRANCH == "develop"
                }
            }
            steps {
                sh "cd /var/www/html/staging/Extra-Slip-backend && npm i --legacy-peer-deps"
            }
        }
        stage("Prod Install dependancies") {
            when {
                expression {
                        return env.BRANCH == "main"
                }
            }
            steps {
                sh "cd /var/www/html/Extra-Slip-backend && npm i --legacy-peer-deps"
            }
        }
        stage("Staging Run Migrations") {
            when {
                expression {
                        return env.BRANCH == "develop"
                }
            }
            steps {
                sh "cd /var/www/html/staging/Extra-Slip-backend && npm run migrate"
            }
        }
        stage("Prod Run Migrations") {
            when {
                expression {
                        return env.BRANCH == "main"
                }
            }
            steps {
                sh "cd /var/www/html/Extra-Slip-backend && npm run migrate"
            }
        }
        stage("Staging Restart Server") {
            when {
                expression {
                        return env.BRANCH == "develop"
                }
            }
            steps {
                sh "sudo pm2 restart 2"
            }
        }
        stage("Prod Restart Server") {
            when {
                expression {
                        return env.BRANCH == "main"
                }
            }
            steps {
                sh "sudo pm2 restart 0"
            }
        }
    }
}