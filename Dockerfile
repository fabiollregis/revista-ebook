
# Estágio de build
FROM node:18-alpine as build

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiando arquivos de configuração
COPY package.json package-lock.json ./

# Instalando dependências
RUN npm ci

# Copiando o restante dos arquivos de código-fonte
COPY . .

# Realizando o build da aplicação
RUN npm run build

# Estágio de produção
FROM nginx:alpine

# Expondo a porta 3000
EXPOSE 3000

# Configurando o Nginx para servir na porta 3000
RUN sed -i 's/listen       80;/listen       3000;/' /etc/nginx/conf.d/default.conf

# Copiando os arquivos de build para o diretório do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copiando uma configuração personalizada do Nginx para lidar com rotas do React
RUN echo 'server { \
    listen 3000; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Comando para iniciar o Nginx no primeiro plano
CMD ["nginx", "-g", "daemon off;"]
