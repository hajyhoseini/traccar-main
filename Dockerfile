# مرحله 1: Build stage
FROM node:20-bullseye AS builder

WORKDIR /app

# به‌روزرسانی npm به آخرین نسخه
RUN npm install -g npm@latest

# کپی package.json و package-lock.json
COPY package*.json ./

# پاک کردن lock و node_modules برای جلوگیری از conflicts
RUN rm -rf package-lock.json node_modules || true

# نصب وابستگی‌ها با پرچم legacy-peer-deps و force برای رفع مشکلات optional deps
RUN npm install --legacy-peer-deps --force

# کپی کل پروژه
COPY . .

# ساخت پروژه (Vite)
RUN npm run build

# مرحله 2: Production stage
FROM nginx:alpine

# کپی فایل تنظیمات Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# کپی فایل‌های ساخته‌شده از مرحله build
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]