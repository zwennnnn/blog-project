# Blog Platformu

Modern teknolojiler kullanılarak geliştirilmiş full-stack blog platformu.

## Özellikler

- 🔐 Kullanıcı kimlik doğrulama ve yetkilendirme
- 📝 TinyMCE ile zengin metin editörü
- 🖼️ Resim yükleme ve yönetme
- 💬 Blog yazma, düzenleme ve silme
- 🎨 Modern ve responsive tasarım

## Teknolojiler

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer

### Frontend
- React.js
- Redux Toolkit
- TinyMCE
- Tailwind CSS
- Axios

## Kurulum

1. Repoyu klonlayın

```bash 

git clone https://github.com/zwennnnn/blog-project.git

2. Backend klasörüne gidin ve gerekli paketleri yükleyin

cd blog-backend

npm install

3. Frontend klasörüne gidin ve gerekli paketleri yükleyin

cd blog-frontend    

npm install

4. Backend için .env dosyasını oluşturun ve gerekli değişkenleri ekleyin

env

MONGO_URI=MONGO urınız
JWT_SECRET=blog-platformu-secret-key
PORT=5000

5. Frontend için .env dosyasını oluşturun ve gerekli değişkenleri ekleyin

env 

REACT_APP_TINYMCE_API_KEY=blog-platformu-tinymce-api-key
REACT_APP_API_URL=http://localhost:5000


6. Backend ve frontend'i başlatın

```

Backend

cd blog-backend
npm start

Frontend

cd blog-frontend
npm start


## Örnek .env Değişkenleri

Backend (.env):
- MONGODB_URI
- JWT_SECRET
- PORT

Frontend (.env):
- REACT_APP_API_URL
- REACT_APP_TINYMCE_API_KEY

## Katkıda Bulunma

1. Bu repoyu fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inize push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.
