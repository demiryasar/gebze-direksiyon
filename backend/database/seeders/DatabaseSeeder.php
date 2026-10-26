<?php

namespace Database\Seeders;

use App\Models\About;
use App\Models\Admin;
use App\Models\Hero;
use App\Models\Review;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Video;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        Admin::create([
            'name' => 'Sedat Hoca',
            'email' => 'admin@gebzedireksiyonegitimi.com',
            'password' => bcrypt('admin123'),
        ]);

        // Hero
        Hero::create([
            'title' => 'Direksiyon Eğitiminde Sedat Hoca Farkı',
            'subtitle' => 'Gebze\'nin En Tecrübeli Direksiyon Eğitmeni ile Ehliyet Yolunda Güvendesiniz. 15 Yıllık Deneyimle Direksiyon Korkunuzu Birlikte Yeniyoruz.',
            'cta_text' => 'Hemen İletişime Geç',
            'cta_url' => '#iletisim',
            'background_image' => 'https://gebzedireksiyonegitimi.com/sedat/images/gebze-direksiyon-egitimi-sedat-hoca5.jpg'
        ]);

        // About
        About::create([
            'content' => '<p>Merhaba, ben <strong>Sedat Hoca</strong>. 15 yılı aşkın süredir Gebze ve çevresinde binlerce öğrenciye güvenli sürüş eğitimi verdim. Amacım sadece ehliyet almanızı sağlamak değil, trafikte kendinden emin, kurallara uyan ve araç hakimiyeti yüksek sürücüler yetiştirmektir.</p><p>Özellikle direksiyon korkusu olan, panik yapan veya araç kullanmaya sıfırdan başlayan öğrencilerimle sabırla ve profesyonel tekniklerle çalışıyorum. Eğitimlerimizi modern ve konforlu turkuaz Renault Clio aracımızla gerçekleştiriyoruz.</p>',
            'image' => 'https://gebzedireksiyonegitimi.com/sedat/images/gebze-direksiyon-dersi-sedat-hoca-3.jpg',
            'stats' => [
                ['value' => '5000+', 'label' => 'Mezun Öğrenci'],
                ['value' => '15', 'label' => 'Yıl Deneyim'],
                ['value' => '100%', 'label' => 'Başarı Oranı'],
                ['value' => '7/24', 'label' => 'Destek'],
            ]
        ]);

        // Services
        $services = [
            [
                'title' => 'Özel Direksiyon Dersi',
                'description' => 'İster kendi aracınızla, ister bizim modern eğitim aracımızla şehir içi trafikte profesyonel sürüş deneyimi.',
                'icon' => '🚗',
                'order' => 1
            ],
            [
                'title' => 'Sınav Hazırlık Eğitimi',
                'description' => 'Direksiyon sınavı parkurunda L park, paralel park ve rampada dur-kalk gibi tüm kritik noktalarda tam hakimiyet.',
                'icon' => '🎯',
                'order' => 2
            ],
            [
                'title' => 'Motosiklet Eğitimi',
                'description' => 'A, A1 ve A2 sınıfı motosikletler için güvenli sürüş ve sınav hazırlık dersleri.',
                'icon' => '🏍️',
                'order' => 3
            ],
            [
                'title' => 'Direksiyon Korkusunu Yenme',
                'description' => 'Trafiğe çıkma korkusu olanlar için psikolojik destekli ve sabırlı eğitim metoduyla özgüven kazanımı.',
                'icon' => '✨',
                'order' => 4
            ],
        ];

        foreach ($services as $s) {
            Service::create($s);
        }

        // Videos
        $videos = [
            ['title' => 'Paralel Park Eğitimi', 'type' => 'file', 'url' => 'https://gebzedireksiyonegitimi.com/sedat/video/paralel-park-sedat-hoca.mp4', 'order' => 1],
            ['title' => 'L Park Çalışması', 'type' => 'file', 'url' => 'https://gebzedireksiyonegitimi.com/sedat/video/L-park-sedat-hoca.mp4', 'order' => 2],
            ['title' => 'Motosiklet Sürüşü', 'type' => 'file', 'url' => 'https://gebzedireksiyonegitimi.com/sedat/video/motosiklet-calismasi-sedat-hoca.mp4', 'order' => 3],
        ];

        foreach ($videos as $v) {
            Video::create($v);
        }

        // Reviews
        $reviews = [
            ['name' => 'Ayşe Demir', 'rating' => 5, 'comment' => 'Sedat Hoca sayesinde direksiyon korkumu yendim. Çok sabırlı ve teknikleri çok net anlatıyor. Teşekkürler!', 'status' => 'approved'],
            ['name' => 'Murat Kaya', 'rating' => 5, 'comment' => 'Paralel park yapamıyordum, Sedat Hocanın püf noktalarıyla artık tek seferde giriyorum. Kesinlikle tavsiye ederim.', 'status' => 'approved'],
            ['name' => 'Selin Akın', 'rating' => 5, 'comment' => 'Sınav öncesi aldığım 2 saatlik dersle ilk denemede ehliyetimi aldım. Harika bir hoca.', 'status' => 'approved'],
        ];

        foreach ($reviews as $r) {
            Review::create($r);
        }

        // Settings
        $settings = [
            'phone' => '0532 764 36 21',
            'email' => 'info@gebzedireksiyonegitimi.com',
            'address' => 'Gebze, Kocaeli',
            'whatsapp' => '905327643621',
            'instagram' => 'https://instagram.com/gebzedireksiyonegitimi',
            'facebook' => 'https://facebook.com/gebzedireksiyonegitimi',
            'map_embed' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48348.65751939502!2d29.40114975!3d40.79958745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cb209930f3a677%3A0xc3f8e658e49b81f1!2sGebze%2C%20Kocaeli!5e0!3m2!1str!2str!4v1714200000000!5m2!1str!2str'
        ];

        foreach ($settings as $key => $val) {
            Setting::create(['key' => $key, 'value' => $val]);
        }
    }
}
