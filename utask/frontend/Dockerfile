FROM node

WORKDIR /app/frontend
COPY package.json /app/frontend
ADD . ./

RUN echo 'Running npm install'
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]