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
        stage("Fetch latest code from git") {
            when {
                expression {
                        return env.BRANCH == "main"
                }
            }
            steps {
                sh "cd /var/www/html/Extra-Slip-backend && git pull origin main"
            }
        }
        stage("Install dependancies") {
            when {
                expression {
                        return env.BRANCH == "main"
                }
            }
            steps {
                sh "cd /var/www/html/Extra-Slip-backend && npm i"
            }
        }
        stage("Run Migrations") {
            when {
                expression {
                        return env.BRANCH == "main"
                }
            }
            steps {
                sh "cd /var/www/html/Extra-Slip-backend && npm run migrate"
            }
        }
        stage("Restart Server") {
            when {
                expression {
                        return env.BRANCH == "main"
                }
            }
            steps {
                sh "pm2 restart 0"
            }
        }
    }
}