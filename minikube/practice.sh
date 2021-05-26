# create deployment: hello-minikube
kubectl create deployment hello-minikube \
  --image=k8s.gcr.io/echoserver:1.10
# update image
# kubectl set image deployment/hello-minikube echoserver=k8s.gcr.io/echoserver:1.10

# show deployments, should see not ready
kubectl get deployments
# show pods: hello-minikube-766c594fbc-x7bth
kubectl get pods
# show replica sets: hello-minikube-766c594fbc
kubectl get rs

# build service by selector app:hello-minikube
kubectl expose deployment hello-minikube --type=NodePort --port=8080
# show service, add `-o wide` to see selector
kubectl get service
# go to hello-minikube by service, should open link in browser
minikube service hello-minikube
# or
# curl `minikube service hello-minikube --url`

# delete service
kubectl delete service hello-minikube
# delete deployment
kubectl delete deployment hello-minikube
# show info, status should be `Terminating`
# kubectl get deployment
# kubectl get rs
# kubectl get pods
