# enable ingress, default using Nginx
minikube addons enable ingress

# build web-api image
# docker build -t web-api:v1 -f Dockerfile-web .
