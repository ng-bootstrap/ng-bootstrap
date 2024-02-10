FROM debian:bookworm as build
WORKDIR /home/pubaayaam/

RUN apt update -y && \
    apt install nodejs -y && \
    apt install npm -y && \
    npm install -g yarn

RUN apt install telnet procps lsof -y

RUN npm install -g @angular/cli

WORKDIR /home/pubaayaam/ng-bootstrap
COPY . .
RUN npm install @ng-bootstrap/ng-bootstrap --legacy-peer-deps 
RUN yarn install
RUN  npm run build 

# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest

# Copy the build output to replace the default nginx contents.
RUN mkdir -p /usr/share/nginx/html/img
COPY --from=build /home/pubaayaam/ng-bootstrap/demo/src/public/img/* /usr/share/nginx/html/img
COPY --from=build /home/pubaayaam/ng-bootstrap/demo/dist/* /usr/share/nginx/html

# Expose port 80
EXPOSE 80    

# devops~cloudops
RUN apt update -y && \
    apt install telnet procps lsof -y

COPY entry.point .
RUN chmod +x entry.point
ENTRYPOINT ["./entry.point"]
