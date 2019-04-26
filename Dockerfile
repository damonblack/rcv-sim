# specify the node base image with your desired version node:<version>
FROM node:8
# replace this with your application's default port
EXPOSE 3000
WORKDIR /app
ADD . /app
RUN apt-get -y update 
RUN apt-get install -y yarn
RUN yarn install
ENTRYPOINT ["yarn", "start"]
