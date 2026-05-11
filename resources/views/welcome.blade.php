<?php
/**
 * Mo7assib — Landing Page
 * Multilingual: Darija (default) / Français / English
 * Lang detection: ?lang=dar|fr|en
 */

$lang = request()->query('lang', 'dar');
if ( ! in_array( $lang, ['dar', 'fr', 'en'] ) ) $lang = 'dar';

$translations = [

    /* ── GLOBAL ─────────────────────────────────────────── */
    'lang_dar'  => ['dar' => 'الدارجة',  'fr' => 'الدارجة',  'en' => 'الدارجة'],
    'lang_fr'   => ['dar' => 'Français', 'fr' => 'Français', 'en' => 'Français'],
    'lang_en'   => ['dar' => 'English',  'fr' => 'English',  'en' => 'English'],

    /* ── NAV ─────────────────────────────────────────────── */
    'nav_features'      => ['dar' => 'المميزات',       'fr' => 'Fonctionnalités', 'en' => 'Features'],
    'nav_modules'       => ['dar' => 'الوحدات',        'fr' => 'Modules',         'en' => 'Modules'],
    'nav_sectors'       => ['dar' => 'القطاعات',       'fr' => 'Secteurs',        'en' => 'Sectors'],
    'nav_testimonials'  => ['dar' => 'الآراء',         'fr' => 'Avis',            'en' => 'Reviews'],
    'nav_cta'           => ['dar' => 'سجل فاللستة',   'fr' => 'Rejoindre',       'en' => 'Join Waitlist'],

    /* ── HERO ────────────────────────────────────────────── */
    'hero_badge'    => [
        'dar' => '🚀 قريباً — سجل دابا وخد أول أكسس',
        'fr'  => '🚀 Bientôt disponible — Accès anticipé',
        'en'  => '🚀 Coming soon — Get early access',
    ],
    'hero_title_1'  => [
        'dar' => 'دير تسيير مقاولتك',
        'fr'  => 'Pilotez votre entreprise',
        'en'  => 'Run your business',
    ],
    'hero_title_2'  => [
        'dar' => 'بطريقة ذكية',
        'fr'  => 'de façon intelligente',
        'en'  => 'the smart way',
    ],
    'hero_sub'      => [
        'dar' => 'Mo7assib كيجمع الفاتورة، CRM، المشاريع، الخزينة والمخزون في منصة وحدة. خاصك تدير حسابك مزيان — من دون تعقيد.',
        'fr'  => 'Mo7assib réunit facturation, CRM, projets, trésorerie et stock dans une seule plateforme. Gérez votre entreprise efficacement, sans complexité.',
        'en'  => 'Mo7assib brings invoicing, CRM, projects, treasury and inventory into one platform. Run your business efficiently — without the complexity.',
    ],
    'hero_btn_waitlist' => [
        'dar' => 'سجل فاللستة — مجاناً',
        'fr'  => 'Rejoindre la liste d\'attente',
        'en'  => 'Join the Waitlist — Free',
    ],
    'hero_btn_features' => [
        'dar' => 'شوف المميزات',
        'fr'  => 'Voir les fonctionnalités',
        'en'  => 'See Features',
    ],
    'hero_stat_1_val'   => ['dar' => '+500',     'fr' => '+500',     'en' => '+500'],
    'hero_stat_1_lbl'   => ['dar' => 'مؤسسة',   'fr' => 'Entreprises', 'en' => 'Businesses'],
    'hero_stat_2_val'   => ['dar' => '98%',      'fr' => '98%',      'en' => '98%'],
    'hero_stat_2_lbl'   => ['dar' => 'رضا',      'fr' => 'Satisfaction', 'en' => 'Satisfaction'],
    'hero_stat_3_val'   => ['dar' => '4x',       'fr' => '4x',       'en' => '4x'],
    'hero_stat_3_lbl'   => ['dar' => 'سرعة',    'fr' => 'Plus rapide', 'en' => 'Faster'],

    /* ── TRUST ───────────────────────────────────────────── */
    'trust_label' => [
        'dar' => 'موثوق به من طرف مقاولين ومحاسبين في المغرب',
        'fr'  => 'Fait confiance par des entrepreneurs et comptables au Maroc',
        'en'  => 'Trusted by entrepreneurs and accountants across Morocco',
    ],

    /* ── BENEFITS ────────────────────────────────────────── */
    'benefits_tag'    => ['dar' => 'لماذا Mo7assib؟', 'fr' => 'Pourquoi Mo7assib ?', 'en' => 'Why Mo7assib?'],
    'benefits_title'  => [
        'dar' => 'كل شي لي محتاجه، فمكان وحد',
        'fr'  => 'Tout ce dont vous avez besoin, en un seul endroit',
        'en'  => 'Everything you need, in one place',
    ],
    'benefits_sub'    => [
        'dar' => 'ما عادش تحتاج لبرامج متعددة. Mo7assib عندو كل شي.',
        'fr'  => 'Plus besoin de jongler entre plusieurs logiciels. Mo7assib a tout.',
        'en'  => 'No more juggling between multiple tools. Mo7assib has it all.',
    ],
    'b1_title' => ['dar' => 'توفير الوقت',      'fr' => 'Gain de temps',         'en' => 'Save Time'],
    'b1_text'  => ['dar' => 'أتمتة المهام المتكررة وتوليد الفواتير في ثوانٍ.',
                   'fr'  => 'Automatisez les tâches répétitives et générez vos factures en quelques secondes.',
                   'en'  => 'Automate repetitive tasks and generate invoices in seconds.'],
    'b2_title' => ['dar' => 'رؤية كاملة',       'fr' => 'Visibilité complète',    'en' => 'Full Visibility'],
    'b2_text'  => ['dar' => 'داشبورد ريلتايم يبينك وضعية مقاولتك بشكل واضح.',
                   'fr'  => 'Un tableau de bord en temps réel pour visualiser l\'état de votre entreprise.',
                   'en'  => 'A real-time dashboard to visualise your business health at a glance.'],
    'b3_title' => ['dar' => 'بدون تعقيد',       'fr' => 'Sans complexité',        'en' => 'No Complexity'],
    'b3_text'  => ['dar' => 'واجهة بسيطة مفهومة حتى بلا خبرة محاسبية.',
                   'fr'  => 'Interface simple, compréhensible même sans formation comptable.',
                   'en'  => 'Simple interface — no accounting background needed.'],
    'b4_title' => ['dar' => 'كل شي متوصل',      'fr' => 'Tout connecté',          'en' => 'All Connected'],
    'b4_text'  => ['dar' => 'الفاتورة، الخزينة، CRM — كلهم كيتكلمو مع بعضهم.',
                   'fr'  => 'Facturation, trésorerie, CRM — tout communique entre eux.',
                   'en'  => 'Invoicing, treasury, CRM — all communicate with each other.'],

    'stats_businesses'  => ['dar' => 'مقاولة',         'fr' => 'Entreprises',     'en' => 'Businesses'],
    'stats_invoices'    => ['dar' => 'فاتورة صدرت',   'fr' => 'Factures émises', 'en' => 'Invoices issued'],
    'stats_time_saved'  => ['dar' => 'ساعة موفرة/شهر','fr' => 'h/mois économisées','en' => 'hrs/month saved'],
    'stats_uptime'      => ['dar' => 'ديمومة',         'fr' => 'Disponibilité',   'en' => 'Uptime'],

    /* ── MODULES ─────────────────────────────────────────── */
    'modules_tag'   => ['dar' => 'الوحدات',    'fr' => 'Modules',    'en' => 'Modules'],
    'modules_title' => [
        'dar' => 'أدوات قوية لكل جانب من مقاولتك',
        'fr'  => 'Des outils puissants pour chaque aspect de votre entreprise',
        'en'  => 'Powerful tools for every aspect of your business',
    ],
    'mod_invoice_title'  => ['dar' => 'الفاتورة',          'fr' => 'Facturation',          'en' => 'Invoicing'],
    'mod_invoice_text'   => ['dar' => 'فواتير احترافية، بروفورما، أوامر شراء — بضغطة.',
                              'fr'  => 'Factures pro, devis, bons de commande — en un clic.',
                              'en'  => 'Professional invoices, quotes, purchase orders — in one click.'],
    'mod_crm_title'      => ['dar' => 'CRM والبروسبيكتيون', 'fr' => 'CRM & Prospection',    'en' => 'CRM & Prospecting'],
    'mod_crm_text'       => ['dar' => 'تتبع العملاء المحتملين وحول الفرص لصفقات.',
                              'fr'  => 'Suivez vos prospects et convertissez les opportunités en deals.',
                              'en'  => 'Track leads and convert opportunities into deals.'],
    'mod_project_title'  => ['dar' => 'تسيير المشاريع',    'fr' => 'Gestion de projet',     'en' => 'Project Management'],
    'mod_project_text'   => ['dar' => 'مهام، مواعيد، فرق — كل شي منظم.',
                              'fr'  => 'Tâches, délais, équipes — tout organisé.',
                              'en'  => 'Tasks, deadlines, teams — all organised.'],
    'mod_treasury_title' => ['dar' => 'الخزينة',            'fr' => 'Trésorerie',            'en' => 'Treasury'],
    'mod_treasury_text'  => ['dar' => 'تتبع المدخولات والمصاريف وتوقع التدفق النقدي.',
                              'fr'  => 'Suivez recettes, dépenses et anticipez votre cash-flow.',
                              'en'  => 'Track income, expenses and forecast your cash flow.'],
    'mod_stock_title'    => ['dar' => 'المخزون',            'fr' => 'Stock',                 'en' => 'Inventory'],
    'mod_stock_text'     => ['dar' => 'إدارة المخزون، التنبيهات والأوامر تلقائياً.',
                              'fr'  => 'Gérez le stock, alertes et réapprovisionnement auto.',
                              'en'  => 'Manage inventory, alerts and auto reorder.'],
    'mod_reports_title'  => ['dar' => 'التقارير',           'fr' => 'Rapports',              'en' => 'Reports'],
    'mod_reports_text'   => ['dar' => 'تقارير مفصلة وإحصاءات لاتخاذ قرارات أحسن.',
                              'fr'  => 'Rapports détaillés et statistiques pour décider mieux.',
                              'en'  => 'Detailed reports and analytics to make better decisions.'],

    /* ── WHY ─────────────────────────────────────────────── */
    'why_tag'   => ['dar' => 'ميزتنا',     'fr' => 'Notre avantage', 'en' => 'Our Edge'],
    'why_title' => [
        'dar' => 'خاص بالمقاول المغربي',
        'fr'  => 'Conçu pour l\'entrepreneur marocain',
        'en'  => 'Built for the Moroccan entrepreneur',
    ],
    'why_1' => ['dar' => 'يدعم الدرهم المغربي والتنسيقات المحلية',
                'fr'  => 'Supporte le dirham et les formats locaux',
                'en'  => 'Supports the Moroccan dirham and local formats'],
    'why_2' => ['dar' => 'متوافق مع قوانين الضريبة المغربية',
                'fr'  => 'Conforme à la fiscalité marocaine',
                'en'  => 'Compliant with Moroccan tax regulations'],
    'why_3' => ['dar' => 'دعم فالدارجة والعربية والفرنسية',
                'fr'  => 'Support en darija, arabe et français',
                'en'  => 'Support in darija, Arabic and French'],
    'why_4' => ['dar' => 'نسخة موبايل وديسكتوب',
                'fr'  => 'Version mobile et desktop',
                'en'  => 'Mobile and desktop version'],
    'why_5' => ['dar' => 'داتا محفوظة بأمان فالمغرب',
                'fr'  => 'Données sécurisées au Maroc',
                'en'  => 'Data securely stored in Morocco'],
    'why_6' => ['dar' => 'تكامل سهل مع الأدوات الأخرى',
                'fr'  => 'Intégration facile avec d\'autres outils',
                'en'  => 'Easy integration with other tools'],

    /* ── SECTORS ─────────────────────────────────────────── */
    'sectors_tag'   => ['dar' => 'القطاعات',  'fr' => 'Secteurs',  'en' => 'Sectors'],
    'sectors_title' => [
        'dar' => 'لكل قطاع، Mo7assib فيه الحل',
        'fr'  => 'Pour chaque secteur, Mo7assib a la solution',
        'en'  => 'For every sector, Mo7assib has the solution',
    ],
    'tab_freelance'  => ['dar' => 'الفريلانسر',    'fr' => 'Freelance',    'en' => 'Freelancer'],
    'tab_pme'        => ['dar' => 'PME',            'fr' => 'PME',          'en' => 'SME'],
    'tab_comptable'  => ['dar' => 'المحاسب',        'fr' => 'Comptable',    'en' => 'Accountant'],
    'tab_commerce'   => ['dar' => 'التجارة',        'fr' => 'Commerce',     'en' => 'Commerce'],

    'panel_freelance_title' => [
        'dar' => 'الفريلانسر — تسيير ذاتي بدون تعقيد',
        'fr'  => 'Freelance — Gestion autonome sans complexité',
        'en'  => 'Freelancer — Self-management without complexity',
    ],
    'panel_freelance_text'  => [
        'dar' => 'دير فاتورة، تابع المشاريع وشوف المدخولات ديالك — كل شي فمكان وحد.',
        'fr'  => 'Émettez des factures, suivez vos projets et visualisez vos revenus — tout en un seul endroit.',
        'en'  => 'Issue invoices, track your projects and visualise your income — all in one place.',
    ],
    'panel_pme_title'   => [
        'dar' => 'PME — تسيير متكامل للمقاولة',
        'fr'  => 'PME — Gestion complète de l\'entreprise',
        'en'  => 'SME — Complete business management',
    ],
    'panel_pme_text'    => [
        'dar' => 'من الفاتورة للخزينة، من CRM للمشاريع — دير تسيير مقاولتك بشكل احترافي.',
        'fr'  => 'De la facturation à la trésorerie, du CRM aux projets — gérez professionnellement.',
        'en'  => 'From invoicing to treasury, from CRM to projects — manage professionally.',
    ],
    'panel_comptable_title' => [
        'dar' => 'المحاسب — إدارة ملفات عدة عملاء',
        'fr'  => 'Comptable — Gérez les dossiers de plusieurs clients',
        'en'  => 'Accountant — Manage multiple client files',
    ],
    'panel_comptable_text'  => [
        'dar' => 'ملف لكل عميل، تقارير جاهزة، صادرات سهلة — وفر وقتك.',
        'fr'  => 'Un dossier par client, rapports prêts, exports faciles — gagnez du temps.',
        'en'  => 'A file per client, ready reports, easy exports — save your time.',
    ],
    'panel_commerce_title' => [
        'dar' => 'التجارة — بيع وتتبع وحسب',
        'fr'  => 'Commerce — Vendez, suivez et analysez',
        'en'  => 'Commerce — Sell, track and analyse',
    ],
    'panel_commerce_text'  => [
        'dar' => 'تسيير المخزون، الفواتير للعملاء وتتبع الأرباح — كل شي واضح.',
        'fr'  => 'Gérez le stock, facturez vos clients et suivez les bénéfices — tout est clair.',
        'en'  => 'Manage inventory, invoice clients and track profits — everything clear.',
    ],
    'panel_feature_1' => ['dar' => 'فاتورة تلقائية',      'fr' => 'Facturation auto',       'en' => 'Auto invoicing'],
    'panel_feature_2' => ['dar' => 'تقارير ريلتايم',      'fr' => 'Rapports temps réel',    'en' => 'Real-time reports'],
    'panel_feature_3' => ['dar' => 'تتبع المدفوعات',      'fr' => 'Suivi paiements',        'en' => 'Payment tracking'],
    'panel_feature_4' => ['dar' => 'إدارة العملاء',        'fr' => 'Gestion clients',        'en' => 'Client management'],

    /* ── TESTIMONIALS ────────────────────────────────────── */
    'testi_tag'   => ['dar' => 'الآراء',     'fr' => 'Avis clients',   'en' => 'Reviews'],
    'testi_title' => [
        'dar' => 'واش كيقولو علينا',
        'fr'  => 'Ce qu\'ils disent de nous',
        'en'  => 'What they say about us',
    ],
    't1_text' => [
        'dar' => 'مع Mo7assib، وفرت ساعات فالأسبوع. الفواتير كتصدر بضغطة والعملاء كيتابعو بلا جهد.',
        'fr'  => 'Avec Mo7assib, j\'économise des heures chaque semaine. Les factures sortent en un clic, les clients se suivent sans effort.',
        'en'  => 'With Mo7assib, I save hours every week. Invoices come out in one click, clients are tracked effortlessly.',
    ],
    't1_name' => ['dar' => 'ياسين بوهاري', 'fr' => 'Yassine Bouhari', 'en' => 'Yassine Bouhari'],
    't1_role' => ['dar' => 'فريلانسر — ديزاين غرافيك', 'fr' => 'Freelance — Design graphique', 'en' => 'Freelancer — Graphic design'],

    't2_text' => [
        'dar' => 'أخيراً مشينا من الإكسيل لشي احترافي. الخزينة والمشاريع والفواتير — كلهم فمكان وحد.',
        'fr'  => 'On est enfin passés d\'Excel à quelque chose de professionnel. Tréso, projets, factures — tout au même endroit.',
        'en'  => 'We finally moved from Excel to something professional. Treasury, projects, invoices — all in one place.',
    ],
    't2_name' => ['dar' => 'سلمى الإدريسي', 'fr' => 'Salma Idrissi', 'en' => 'Salma Idrissi'],
    't2_role' => ['dar' => 'مسيرة PME — استشارات', 'fr' => 'Dirigeante PME — Conseil', 'en' => 'SME Director — Consulting'],

    't3_text' => [
        'dar' => 'كتسير ملفات عدد من العملاء. Mo7assib عطاني نظرة واضحة على كل ملف وخدم وقتي.',
        'fr'  => 'Je gère les dossiers de nombreux clients. Mo7assib m\'a donné une vue claire sur chaque dossier et m\'a fait gagner du temps.',
        'en'  => 'I manage files for many clients. Mo7assib gave me a clear view on each file and saved me considerable time.',
    ],
    't3_name' => ['dar' => 'عمر الناصر', 'fr' => 'Omar Ennasser', 'en' => 'Omar Ennasser'],
    't3_role' => ['dar' => 'محاسب معتمد', 'fr' => 'Expert-comptable', 'en' => 'Certified Accountant'],

    /* ── CTA FINAL ───────────────────────────────────────── */
    'cta_title' => [
        'dar' => 'جاهز تبدا؟ سجل دابا وكن من الأوائل',
        'fr'  => 'Prêt à commencer ? Rejoignez les premiers',
        'en'  => 'Ready to start? Be among the first',
    ],
    'cta_sub'   => [
        'dar' => 'المنصة كتتطور. سجل دابا وخد الأكسس الأول — بلا تزيد.',
        'fr'  => 'La plateforme est en cours de développement. Inscrivez-vous maintenant pour l\'accès anticipé — gratuitement.',
        'en'  => 'The platform is in development. Register now for early access — for free.',
    ],
    'cta_btn'   => [
        'dar' => 'سجل فاللستة — مجاناً',
        'fr'  => 'Rejoindre la liste d\'attente',
        'en'  => 'Join the Waitlist — Free',
    ],

    /* ── FOOTER ──────────────────────────────────────────── */
    'footer_tagline' => [
        'dar' => 'تسيير مقاولتك ببساطة.',
        'fr'  => 'Gérez votre entreprise simplement.',
        'en'  => 'Run your business simply.',
    ],
    'footer_product'  => ['dar' => 'المنتج',    'fr' => 'Produit',   'en' => 'Product'],
    'footer_company'  => ['dar' => 'الشركة',    'fr' => 'Société',   'en' => 'Company'],
    'footer_legal'    => ['dar' => 'القانوني',  'fr' => 'Légal',     'en' => 'Legal'],
    'footer_f1'       => ['dar' => 'المميزات',  'fr' => 'Fonctionnalités', 'en' => 'Features'],
    'footer_f2'       => ['dar' => 'الأسعار',   'fr' => 'Tarifs',    'en' => 'Pricing'],
    'footer_f3'       => ['dar' => 'التحديثات', 'fr' => 'Mises à jour', 'en' => 'Updates'],
    'footer_c1'       => ['dar' => 'من نحن',    'fr' => 'À propos',  'en' => 'About'],
    'footer_c2'       => ['dar' => 'المدونة',   'fr' => 'Blog',      'en' => 'Blog'],
    'footer_c3'       => ['dar' => 'تواصل معنا','fr' => 'Contact',   'en' => 'Contact'],
    'footer_l1'       => ['dar' => 'الخصوصية',  'fr' => 'Confidentialité', 'en' => 'Privacy'],
    'footer_l2'       => ['dar' => 'الشروط',    'fr' => 'Conditions', 'en' => 'Terms'],
    'footer_copy'     => [
        'dar' => '© 2025 Mo7assib. جميع الحقوق محفوظة.',
        'fr'  => '© 2025 Mo7assib. Tous droits réservés.',
        'en'  => '© 2025 Mo7assib. All rights reserved.',
    ],

    /* ── WAITLIST MODAL ──────────────────────────────────── */
    'modal_title'      => ['dar' => 'سجل فاللستة',         'fr' => 'Rejoindre la liste',       'en' => 'Join the waitlist'],
    'modal_sub'        => [
        'dar' => 'خد الأكسس الأول — مجاناً. غنبعتلك إيميل حين تتوفر المنصة.',
        'fr'  => 'Accès anticipé gratuit. Nous vous prévenons à l\'ouverture.',
        'en'  => 'Free early access. We\'ll notify you when we launch.',
    ],
    'field_name'       => ['dar' => 'الاسم الكامل',     'fr' => 'Nom complet',       'en' => 'Full name'],
    'field_email'      => ['dar' => 'الإيميل',          'fr' => 'Adresse e-mail',    'en' => 'Email address'],
    'field_phone'      => ['dar' => 'الهاتف',           'fr' => 'Téléphone',         'en' => 'Phone'],
    'field_company'    => ['dar' => 'المؤسسة',          'fr' => 'Entreprise',        'en' => 'Company'],
    'field_activity'   => ['dar' => 'النشاط',           'fr' => 'Activité',          'en' => 'Activity'],
    'field_city'       => ['dar' => 'المدينة',          'fr' => 'Ville',             'en' => 'City'],
    'field_message'    => ['dar' => 'رسالة (اختياري)',  'fr' => 'Message (optionnel)','en' => 'Message (optional)'],
    'form_submit'      => ['dar' => 'سجل الآن',         'fr' => 'S\'inscrire',       'en' => 'Register now'],
    'form_success'     => [
        'dar' => '✅ تسجلت بنجاح! غنتواصلو معك قريباً.',
        'fr'  => '✅ Inscription réussie ! Nous vous contacterons bientôt.',
        'en'  => '✅ Successfully registered! We\'ll be in touch soon.',
    ],
    'form_error'       => [
        'dar' => 'وقع خطأ. عاود المحاولة.',
        'fr'  => 'Une erreur s\'est produite. Réessayez.',
        'en'  => 'An error occurred. Please try again.',
    ],
    'ph_name'          => ['dar' => 'مثلاً: محمد الأمين',    'fr' => 'Ex : Jean Dupont',       'en' => 'e.g. John Smith'],
    'ph_email'         => ['dar' => 'you@example.com',        'fr' => 'vous@exemple.com',        'en' => 'you@example.com'],
    'ph_phone'         => ['dar' => '+212 6XX XXX XXX',       'fr' => '+212 6XX XXX XXX',        'en' => '+212 6XX XXX XXX'],
    'ph_company'       => ['dar' => 'اسم المؤسسة',           'fr' => 'Nom de l\'entreprise',    'en' => 'Company name'],
    'ph_activity'      => ['dar' => 'مثلاً: خدمات، تجارة…', 'fr' => 'Ex : services, commerce…','en' => 'e.g. services, retail…'],
    'ph_city'          => ['dar' => 'الدار البيضاء',         'fr' => 'Casablanca',              'en' => 'Casablanca'],
    'ph_message'       => ['dar' => 'شارك معنا توقعاتك…',   'fr' => 'Partagez vos attentes…',  'en' => 'Share your expectations…'],
];

// Shorthand helper
$t = fn(string $key): string => $translations[$key][$lang] ?? $translations[$key]['fr'] ?? $key;
?>
<!DOCTYPE html>
<html lang="{{ $lang === 'dar' ? 'ar' : $lang }}" dir="{{ $lang === 'dar' ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Mo7assib — {{ $t('hero_title_1') }} {{ $t('hero_title_2') }}</title>
    <meta name="description" content="{{ $t('hero_sub') }}">

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

    @vite(['resources/css/landing.css', 'resources/js/landing.js'])
</head>
<body>

{{-- ═══════════════════════════════════════════════ NAVBAR ═══ --}}
<nav class="lp-nav" role="navigation" aria-label="Main navigation">
    <div class="lp-nav__inner">

        <a href="{{ route('home') }}" class="lp-nav__logo" aria-label="Mo7assib">
            <span class="lp-nav__logo-mark">M7</span>
            <span class="lp-nav__logo-text">Mo7assib</span>
        </a>

        <ul class="lp-nav__links" role="list">
            <li><a href="#benefits"      class="lp-nav__link">{{ $t('nav_features') }}</a></li>
            <li><a href="#modules"       class="lp-nav__link">{{ $t('nav_modules') }}</a></li>
            <li><a href="#sectors"       class="lp-nav__link">{{ $t('nav_sectors') }}</a></li>
            <li><a href="#testimonials"  class="lp-nav__link">{{ $t('nav_testimonials') }}</a></li>
        </ul>

        <div class="lp-nav__right">
            {{-- Language switcher --}}
            <div class="lp-lang" role="navigation" aria-label="Language switcher">
                <a href="?lang=dar" class="lp-lang__btn {{ $lang === 'dar' ? 'lp-lang__btn--active' : '' }}" lang="ar">{{ $t('lang_dar') }}</a>
                <a href="?lang=fr"  class="lp-lang__btn {{ $lang === 'fr'  ? 'lp-lang__btn--active' : '' }}" lang="fr">{{ $t('lang_fr') }}</a>
                <a href="?lang=en"  class="lp-lang__btn {{ $lang === 'en'  ? 'lp-lang__btn--active' : '' }}" lang="en">{{ $t('lang_en') }}</a>
            </div>

            <button class="lp-btn lp-btn--sm" data-modal="waitlist" aria-haspopup="dialog">
                {{ $t('nav_cta') }}
            </button>
        </div>

        <button class="lp-nav__burger" aria-label="Toggle menu" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>
    </div>
</nav>

{{-- ═══════════════════════════════════════════════ HERO ══════ --}}
<section class="lp-hero" id="hero">
    <div class="lp-container">
        <div class="lp-hero__inner">

            <div class="lp-hero__content lp-reveal">
                <div class="lp-badge">{{ $t('hero_badge') }}</div>

                <h1 class="lp-hero__title">
                    {{ $t('hero_title_1') }}
                    <em class="lp-hero__title-em">{{ $t('hero_title_2') }}</em>
                </h1>

                <p class="lp-hero__sub">{{ $t('hero_sub') }}</p>

                <div class="lp-hero__actions">
                    <button class="lp-btn lp-btn--primary lp-btn--lg" data-modal="waitlist" aria-haspopup="dialog">
                        {{ $t('hero_btn_waitlist') }}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <a href="#modules" class="lp-btn lp-btn--ghost lp-btn--lg">{{ $t('hero_btn_features') }}</a>
                </div>

                <div class="lp-hero__stats">
                    <div class="lp-hero__stat">
                        <strong>{{ $t('hero_stat_1_val') }}</strong>
                        <span>{{ $t('hero_stat_1_lbl') }}</span>
                    </div>
                    <div class="lp-hero__stat-sep"></div>
                    <div class="lp-hero__stat">
                        <strong>{{ $t('hero_stat_2_val') }}</strong>
                        <span>{{ $t('hero_stat_2_lbl') }}</span>
                    </div>
                    <div class="lp-hero__stat-sep"></div>
                    <div class="lp-hero__stat">
                        <strong>{{ $t('hero_stat_3_val') }}</strong>
                        <span>{{ $t('hero_stat_3_lbl') }}</span>
                    </div>
                </div>
            </div>

            {{-- Dashboard mockup --}}
            <div class="lp-hero__visual lp-reveal">
                <div class="lp-mockup">
                    <div class="lp-mockup__bar">
                        <span class="lp-mockup__dot lp-mockup__dot--r"></span>
                        <span class="lp-mockup__dot lp-mockup__dot--y"></span>
                        <span class="lp-mockup__dot lp-mockup__dot--g"></span>
                        <span class="lp-mockup__bar-title">Mo7assib Dashboard</span>
                    </div>
                    <div class="lp-mockup__body">
                        {{-- KPI row --}}
                        <div class="lp-mockup__kpis">
                            <div class="lp-mockup__kpi">
                                <span class="lp-mockup__kpi-val">42 500 MAD</span>
                                <span class="lp-mockup__kpi-lbl">{{ $lang === 'dar' ? 'المبيعات' : ($lang === 'fr' ? 'Ventes' : 'Sales') }}</span>
                                <span class="lp-mockup__kpi-trend lp-mockup__kpi-trend--up">+12%</span>
                            </div>
                            <div class="lp-mockup__kpi">
                                <span class="lp-mockup__kpi-val">18 200 MAD</span>
                                <span class="lp-mockup__kpi-lbl">{{ $lang === 'dar' ? 'المصاريف' : ($lang === 'fr' ? 'Dépenses' : 'Expenses') }}</span>
                                <span class="lp-mockup__kpi-trend lp-mockup__kpi-trend--down">-3%</span>
                            </div>
                            <div class="lp-mockup__kpi">
                                <span class="lp-mockup__kpi-val">24 300 MAD</span>
                                <span class="lp-mockup__kpi-lbl">{{ $lang === 'dar' ? 'الصافي' : ($lang === 'fr' ? 'Net' : 'Net') }}</span>
                                <span class="lp-mockup__kpi-trend lp-mockup__kpi-trend--up">+18%</span>
                            </div>
                        </div>
                        {{-- Chart area --}}
                        <div class="lp-mockup__chart" aria-hidden="true">
                            <svg viewBox="0 0 280 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stop-color="#3ABD72" stop-opacity="0.3"/>
                                        <stop offset="100%" stop-color="#3ABD72" stop-opacity="0"/>
                                    </linearGradient>
                                </defs>
                                <path d="M0,60 C20,50 40,30 70,35 C100,40 120,20 150,15 C180,10 210,25 240,18 C260,13 270,8 280,5" stroke="#3ABD72" stroke-width="2" fill="none"/>
                                <path d="M0,60 C20,50 40,30 70,35 C100,40 120,20 150,15 C180,10 210,25 240,18 C260,13 270,8 280,5 L280,80 L0,80 Z" fill="url(#chartGrad)"/>
                                <path d="M0,72 C30,68 60,64 90,66 C120,68 150,60 180,58 C210,56 240,62 280,60" stroke="#1D5CBF" stroke-width="1.5" stroke-dasharray="4 3" fill="none" opacity="0.5"/>
                            </svg>
                        </div>
                        {{-- Activity list --}}
                        <div class="lp-mockup__list">
                            <div class="lp-mockup__list-item">
                                <span class="lp-mockup__list-dot lp-mockup__list-dot--g"></span>
                                <span class="lp-mockup__list-text">{{ $lang === 'dar' ? 'فاتورة #1042 — مدفوعة' : ($lang === 'fr' ? 'Facture #1042 — Payée' : 'Invoice #1042 — Paid') }}</span>
                                <span class="lp-mockup__list-amt">+5 800 MAD</span>
                            </div>
                            <div class="lp-mockup__list-item">
                                <span class="lp-mockup__list-dot lp-mockup__list-dot--b"></span>
                                <span class="lp-mockup__list-text">{{ $lang === 'dar' ? 'عميل جديد — نجيب لحلو' : ($lang === 'fr' ? 'Nouveau client — Naji Lahlou' : 'New client — Naji Lahlou') }}</span>
                                <span class="lp-mockup__list-amt lp-mockup__list-amt--new">CRM</span>
                            </div>
                            <div class="lp-mockup__list-item">
                                <span class="lp-mockup__list-dot lp-mockup__list-dot--y"></span>
                                <span class="lp-mockup__list-text">{{ $lang === 'dar' ? 'مشروع ويبسايت — قيد التنفيذ' : ($lang === 'fr' ? 'Projet site web — En cours' : 'Project website — In progress') }}</span>
                                <span class="lp-mockup__list-amt">68%</span>
                            </div>
                        </div>
                    </div>

                    {{-- Floating cards --}}
                    <div class="lp-mockup__card lp-mockup__card--1" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="#1B6E3F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="#1B6E3F" stroke-width="1.5"/></svg>
                        <span>{{ $lang === 'dar' ? 'فاتورة أُرسلت' : ($lang === 'fr' ? 'Facture envoyée' : 'Invoice sent') }}</span>
                    </div>
                    <div class="lp-mockup__card lp-mockup__card--2" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2v6l3 3" stroke="#1D5CBF" stroke-width="2" stroke-linecap="round"/><circle cx="12" cy="12" r="9" stroke="#1D5CBF" stroke-width="1.5"/></svg>
                        <span>{{ $lang === 'dar' ? 'تذكير تلقائي' : ($lang === 'fr' ? 'Rappel auto' : 'Auto reminder') }}</span>
                    </div>
                </div>
            </div>

        </div>
    </div>

    {{-- Decorative blobs --}}
    <div class="lp-hero__blob lp-hero__blob--1" aria-hidden="true"></div>
    <div class="lp-hero__blob lp-hero__blob--2" aria-hidden="true"></div>
</section>

{{-- ═══════════════════════════════════════════════ TRUST ═════ --}}
<section class="lp-trust" aria-label="{{ $t('trust_label') }}">
    <div class="lp-container">
        <p class="lp-trust__label">{{ $t('trust_label') }}</p>
        <div class="lp-trust__logos" aria-hidden="true">
            @foreach(['Atlas Digital', 'Maroc PME', 'FinTech Morocco', 'StartGate', 'Innov Invest', 'CCI Casablanca'] as $logo)
            <div class="lp-trust__logo-item">{{ $logo }}</div>
            @endforeach
        </div>
    </div>
</section>

{{-- ═══════════════════════════════════════════════ BENEFITS ══ --}}
<section class="lp-benefits" id="benefits">
    <div class="lp-container">

        <header class="lp-section-header lp-reveal">
            <span class="lp-tag">{{ $t('benefits_tag') }}</span>
            <h2 class="lp-section-title">{{ $t('benefits_title') }}</h2>
            <p class="lp-section-sub">{{ $t('benefits_sub') }}</p>
        </header>

        <div class="lp-benefits__layout">

            {{-- Cards --}}
            <div class="lp-benefits__cards">
                @php
                $benefits = [
                    ['icon' => '⏱', 'title' => 'b1_title', 'text' => 'b1_text'],
                    ['icon' => '📊', 'title' => 'b2_title', 'text' => 'b2_text'],
                    ['icon' => '✨', 'title' => 'b3_title', 'text' => 'b3_text'],
                    ['icon' => '🔗', 'title' => 'b4_title', 'text' => 'b4_text'],
                ];
                @endphp
                @foreach($benefits as $b)
                <div class="lp-benefit-card lp-reveal">
                    <div class="lp-benefit-card__icon" aria-hidden="true">{{ $b['icon'] }}</div>
                    <h3 class="lp-benefit-card__title">{{ $t($b['title']) }}</h3>
                    <p class="lp-benefit-card__text">{{ $t($b['text']) }}</p>
                </div>
                @endforeach
            </div>

            {{-- Stats panel --}}
            <div class="lp-stats-panel lp-reveal">
                <div class="lp-stats-panel__inner">
                    <div class="lp-stats-panel__item">
                        <strong class="lp-stats-panel__val" data-counter data-target="500" data-suffix="+" aria-label="+500">0</strong>
                        <span class="lp-stats-panel__lbl">{{ $t('stats_businesses') }}</span>
                    </div>
                    <div class="lp-stats-panel__item">
                        <strong class="lp-stats-panel__val" data-counter data-target="12000" data-suffix="+" aria-label="12000+">0</strong>
                        <span class="lp-stats-panel__lbl">{{ $t('stats_invoices') }}</span>
                    </div>
                    <div class="lp-stats-panel__item">
                        <strong class="lp-stats-panel__val" data-counter data-target="8" data-suffix="h" aria-label="8h">0</strong>
                        <span class="lp-stats-panel__lbl">{{ $t('stats_time_saved') }}</span>
                    </div>
                    <div class="lp-stats-panel__item">
                        <strong class="lp-stats-panel__val" data-counter data-target="99.9" data-suffix="%" data-decimals="1" aria-label="99.9%">0</strong>
                        <span class="lp-stats-panel__lbl">{{ $t('stats_uptime') }}</span>
                    </div>
                </div>
            </div>

        </div>
    </div>
</section>

{{-- ═══════════════════════════════════════════════ MODULES ════ --}}
<section class="lp-modules" id="modules">
    <div class="lp-container">

        <header class="lp-section-header lp-reveal">
            <span class="lp-tag">{{ $t('modules_tag') }}</span>
            <h2 class="lp-section-title">{{ $t('modules_title') }}</h2>
        </header>

        @php
        $modules = [
            ['icon' => '🧾', 'title' => 'mod_invoice_title',  'text' => 'mod_invoice_text',  'color' => 'green'],
            ['icon' => '🎯', 'title' => 'mod_crm_title',      'text' => 'mod_crm_text',      'color' => 'blue'],
            ['icon' => '📋', 'title' => 'mod_project_title',  'text' => 'mod_project_text',  'color' => 'purple'],
            ['icon' => '💰', 'title' => 'mod_treasury_title', 'text' => 'mod_treasury_text', 'color' => 'teal'],
            ['icon' => '📦', 'title' => 'mod_stock_title',    'text' => 'mod_stock_text',    'color' => 'orange'],
            ['icon' => '📈', 'title' => 'mod_reports_title',  'text' => 'mod_reports_text',  'color' => 'indigo'],
        ];
        @endphp

        <div class="lp-modules__grid">
            @foreach($modules as $mod)
            <article class="lp-module-card lp-module-card--{{ $mod['color'] }} lp-reveal">
                <div class="lp-module-card__icon" aria-hidden="true">{{ $mod['icon'] }}</div>
                <h3 class="lp-module-card__title">{{ $t($mod['title']) }}</h3>
                <p class="lp-module-card__text">{{ $t($mod['text']) }}</p>
            </article>
            @endforeach
        </div>

    </div>
</section>

{{-- ═══════════════════════════════════════════════ WHY ════════ --}}
<section class="lp-why" id="why">
    <div class="lp-container">

        <div class="lp-why__inner">
            <div class="lp-why__content lp-reveal">
                <span class="lp-tag lp-tag--light">{{ $t('why_tag') }}</span>
                <h2 class="lp-section-title lp-section-title--light">{{ $t('why_title') }}</h2>

                <ul class="lp-why__list" role="list">
                    @foreach(['why_1','why_2','why_3','why_4','why_5','why_6'] as $key)
                    <li class="lp-why__item">
                        <svg class="lp-why__check" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <circle cx="10" cy="10" r="10" fill="#3ABD72" fill-opacity="0.2"/>
                            <path d="M6 10l3 3 5-5" stroke="#3ABD72" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {{ $t($key) }}
                    </li>
                    @endforeach
                </ul>

                <button class="lp-btn lp-btn--primary lp-btn--lg" data-modal="waitlist" aria-haspopup="dialog">
                    {{ $t('cta_btn') }}
                </button>
            </div>

            <div class="lp-why__visual lp-reveal" aria-hidden="true">
                <div class="lp-why__flag">
                    <span>🇲🇦</span>
                    <span>{{ $lang === 'dar' ? 'صُنع بالمغرب' : ($lang === 'fr' ? 'Fait au Maroc' : 'Made in Morocco') }}</span>
                </div>
                <div class="lp-why__cards-stack">
                    <div class="lp-why__stack-card lp-why__stack-card--back"></div>
                    <div class="lp-why__stack-card lp-why__stack-card--mid"></div>
                    <div class="lp-why__stack-card lp-why__stack-card--front">
                        <div class="lp-why__stack-icon">🏆</div>
                        <strong>{{ $lang === 'dar' ? 'الأفضل للمقاول المغربي' : ($lang === 'fr' ? 'Le meilleur pour l\'entrepreneur marocain' : 'Best for Moroccan entrepreneurs') }}</strong>
                    </div>
                </div>
            </div>
        </div>

    </div>
</section>

{{-- ═══════════════════════════════════════════════ SECTORS ════ --}}
<section class="lp-secteurs" id="sectors">
    <div class="lp-container">

        <header class="lp-section-header lp-reveal">
            <span class="lp-tag">{{ $t('sectors_tag') }}</span>
            <h2 class="lp-section-title">{{ $t('sectors_title') }}</h2>
        </header>

        <div class="lp-secteurs__tabs-wrapper lp-reveal" role="tablist" aria-label="{{ $t('sectors_tag') }}">
            <button class="lp-secteurs__tab lp-secteurs__tab--active" data-tab="freelance" role="tab" aria-selected="true"  aria-controls="panel-freelance">{{ $t('tab_freelance') }}</button>
            <button class="lp-secteurs__tab"                          data-tab="pme"       role="tab" aria-selected="false" aria-controls="panel-pme">{{ $t('tab_pme') }}</button>
            <button class="lp-secteurs__tab"                          data-tab="comptable" role="tab" aria-selected="false" aria-controls="panel-comptable">{{ $t('tab_comptable') }}</button>
            <button class="lp-secteurs__tab"                          data-tab="commerce"  role="tab" aria-selected="false" aria-controls="panel-commerce">{{ $t('tab_commerce') }}</button>
        </div>

        @php
        $panels = [
            ['id' => 'freelance', 'title_key' => 'panel_freelance_title', 'text_key' => 'panel_freelance_text', 'emoji' => '💻'],
            ['id' => 'pme',       'title_key' => 'panel_pme_title',       'text_key' => 'panel_pme_text',       'emoji' => '🏢'],
            ['id' => 'comptable', 'title_key' => 'panel_comptable_title', 'text_key' => 'panel_comptable_text', 'emoji' => '📒'],
            ['id' => 'commerce',  'title_key' => 'panel_commerce_title',  'text_key' => 'panel_commerce_text',  'emoji' => '🛒'],
        ];
        @endphp

        @foreach($panels as $i => $panel)
        <div class="lp-secteurs__panel {{ $i === 0 ? 'lp-secteurs__panel--active' : '' }}"
             data-panel="{{ $panel['id'] }}"
             id="panel-{{ $panel['id'] }}"
             role="tabpanel">
            <div class="lp-secteurs__panel-inner">
                <div class="lp-secteurs__panel-content">
                    <div class="lp-secteurs__panel-emoji" aria-hidden="true">{{ $panel['emoji'] }}</div>
                    <h3 class="lp-secteurs__panel-title">{{ $t($panel['title_key']) }}</h3>
                    <p class="lp-secteurs__panel-text">{{ $t($panel['text_key']) }}</p>
                    <ul class="lp-secteurs__features" role="list">
                        @foreach(['panel_feature_1','panel_feature_2','panel_feature_3','panel_feature_4'] as $fkey)
                        <li>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8l3 3 7-7" stroke="#3ABD72" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                            {{ $t($fkey) }}
                        </li>
                        @endforeach
                    </ul>
                    <button class="lp-btn lp-btn--primary" data-modal="waitlist" aria-haspopup="dialog">{{ $t('nav_cta') }}</button>
                </div>
                <div class="lp-secteurs__panel-visual" aria-hidden="true">
                    <div class="lp-secteurs__mini-dash">
                        <div class="lp-secteurs__mini-bar"></div>
                        <div class="lp-secteurs__mini-bar lp-secteurs__mini-bar--mid"></div>
                        <div class="lp-secteurs__mini-bar lp-secteurs__mini-bar--short"></div>
                    </div>
                </div>
            </div>
        </div>
        @endforeach

    </div>
</section>

{{-- ═══════════════════════════════════════════════ TESTIMONIALS  --}}
<section class="lp-testimonials" id="testimonials">
    <div class="lp-container">

        <header class="lp-section-header lp-reveal">
            <span class="lp-tag">{{ $t('testi_tag') }}</span>
            <h2 class="lp-section-title">{{ $t('testi_title') }}</h2>
        </header>

        @php
        $testimonials = [
            ['text' => 't1_text', 'name' => 't1_name', 'role' => 't1_role', 'initial' => 'ي'],
            ['text' => 't2_text', 'name' => 't2_name', 'role' => 't2_role', 'initial' => 'س'],
            ['text' => 't3_text', 'name' => 't3_name', 'role' => 't3_role', 'initial' => 'ع'],
        ];
        @endphp

        <div class="lp-testimonials__grid">
            @foreach($testimonials as $testi)
            <article class="lp-testi-card lp-reveal">
                <div class="lp-testi-card__stars" aria-label="5 stars">★★★★★</div>
                <blockquote class="lp-testi-card__quote">
                    <p>{{ $t($testi['text']) }}</p>
                </blockquote>
                <footer class="lp-testi-card__author">
                    <div class="lp-testi-card__avatar" aria-hidden="true">{{ $testi['initial'] }}</div>
                    <div>
                        <strong class="lp-testi-card__name">{{ $t($testi['name']) }}</strong>
                        <span class="lp-testi-card__role">{{ $t($testi['role']) }}</span>
                    </div>
                </footer>
            </article>
            @endforeach
        </div>

    </div>
</section>

{{-- ═══════════════════════════════════════════════ CTA FINAL ══ --}}
<section class="lp-cta-final" id="cta">
    <div class="lp-container">
        <div class="lp-cta-final__inner lp-reveal">
            <h2 class="lp-cta-final__title">{{ $t('cta_title') }}</h2>
            <p class="lp-cta-final__sub">{{ $t('cta_sub') }}</p>
            <button class="lp-btn lp-btn--primary lp-btn--xl" data-modal="waitlist" aria-haspopup="dialog">
                {{ $t('cta_btn') }}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12M12 5l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        </div>
    </div>
</section>

{{-- ═══════════════════════════════════════════════ FOOTER ═════ --}}
<footer class="lp-footer" role="contentinfo">
    <div class="lp-container">
        <div class="lp-footer__inner">

            <div class="lp-footer__brand">
                <a href="{{ route('home') }}" class="lp-nav__logo" aria-label="Mo7assib">
                    <span class="lp-nav__logo-mark">M7</span>
                    <span class="lp-nav__logo-text">Mo7assib</span>
                </a>
                <p class="lp-footer__tagline">{{ $t('footer_tagline') }}</p>
                <div class="lp-lang lp-lang--footer">
                    <a href="?lang=dar" class="lp-lang__btn {{ $lang === 'dar' ? 'lp-lang__btn--active' : '' }}" lang="ar">الدارجة</a>
                    <a href="?lang=fr"  class="lp-lang__btn {{ $lang === 'fr'  ? 'lp-lang__btn--active' : '' }}" lang="fr">FR</a>
                    <a href="?lang=en"  class="lp-lang__btn {{ $lang === 'en'  ? 'lp-lang__btn--active' : '' }}" lang="en">EN</a>
                </div>
            </div>

            <nav class="lp-footer__col" aria-label="{{ $t('footer_product') }}">
                <h4 class="lp-footer__col-title">{{ $t('footer_product') }}</h4>
                <ul role="list">
                    <li><a href="#benefits" class="lp-footer__link">{{ $t('footer_f1') }}</a></li>
                    <li><a href="#"         class="lp-footer__link">{{ $t('footer_f2') }}</a></li>
                    <li><a href="#"         class="lp-footer__link">{{ $t('footer_f3') }}</a></li>
                </ul>
            </nav>

            <nav class="lp-footer__col" aria-label="{{ $t('footer_company') }}">
                <h4 class="lp-footer__col-title">{{ $t('footer_company') }}</h4>
                <ul role="list">
                    <li><a href="#" class="lp-footer__link">{{ $t('footer_c1') }}</a></li>
                    <li><a href="#" class="lp-footer__link">{{ $t('footer_c2') }}</a></li>
                    <li><a href="#" class="lp-footer__link">{{ $t('footer_c3') }}</a></li>
                </ul>
            </nav>

            <nav class="lp-footer__col" aria-label="{{ $t('footer_legal') }}">
                <h4 class="lp-footer__col-title">{{ $t('footer_legal') }}</h4>
                <ul role="list">
                    <li><a href="#" class="lp-footer__link">{{ $t('footer_l1') }}</a></li>
                    <li><a href="#" class="lp-footer__link">{{ $t('footer_l2') }}</a></li>
                </ul>
            </nav>

        </div>

        <div class="lp-footer__bottom">
            <span>{{ $t('footer_copy') }}</span>
            <span class="lp-footer__made">
                {{ $lang === 'dar' ? 'صُنع بـ' : ($lang === 'fr' ? 'Fait avec' : 'Made with') }}
                <span aria-label="love">♥</span>
                {{ $lang === 'dar' ? 'فالمغرب' : ($lang === 'fr' ? 'au Maroc' : 'in Morocco') }}
            </span>
        </div>
    </div>
</footer>

{{-- ═══════════════════════════════════════════════ WAITLIST MODAL  --}}
<div id="waitlist-modal" class="lp-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <div class="lp-modal">
        <header class="lp-modal__header">
            <div>
                <h2 id="modal-title" class="lp-modal__title">{{ $t('modal_title') }}</h2>
                <p class="lp-modal__sub">{{ $t('modal_sub') }}</p>
            </div>
            <button class="lp-modal__close" aria-label="{{ $lang === 'dar' ? 'إغلاق' : ($lang === 'fr' ? 'Fermer' : 'Close') }}">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
            </button>
        </header>

        <div class="lp-modal__body">

            <div id="waitlist-success" class="lp-form__success" style="display:none" role="alert">
                {{ $t('form_success') }}
            </div>

            <div id="waitlist-error" class="lp-form__server-error" style="display:none" role="alert">
                {{ $t('form_error') }}
            </div>

            <form id="waitlist-form"
                  action="{{ route('waitlist.store') }}"
                  method="POST"
                  novalidate>
                @csrf

                <div class="lp-form__row">
                    <div class="lp-form__field">
                        <label class="lp-form__label" for="wl-name">
                            {{ $t('field_name') }} <span aria-hidden="true">*</span>
                        </label>
                        <input class="lp-form__input"
                               type="text" id="wl-name" name="name"
                               placeholder="{{ $t('ph_name') }}"
                               required autocomplete="name">
                        <span class="lp-form__field-err" aria-live="polite">
                            {{ $lang === 'dar' ? 'هذا الحقل إلزامي' : ($lang === 'fr' ? 'Ce champ est requis' : 'This field is required') }}
                        </span>
                    </div>
                    <div class="lp-form__field">
                        <label class="lp-form__label" for="wl-email">
                            {{ $t('field_email') }} <span aria-hidden="true">*</span>
                        </label>
                        <input class="lp-form__input"
                               type="email" id="wl-email" name="email"
                               placeholder="{{ $t('ph_email') }}"
                               required autocomplete="email">
                        <span class="lp-form__field-err" aria-live="polite">
                            {{ $lang === 'dar' ? 'بريد إلكتروني غير صالح' : ($lang === 'fr' ? 'Adresse e-mail invalide' : 'Invalid email address') }}
                        </span>
                    </div>
                </div>

                <div class="lp-form__row">
                    <div class="lp-form__field">
                        <label class="lp-form__label" for="wl-phone">{{ $t('field_phone') }}</label>
                        <input class="lp-form__input"
                               type="tel" id="wl-phone" name="phone"
                               placeholder="{{ $t('ph_phone') }}"
                               autocomplete="tel">
                    </div>
                    <div class="lp-form__field">
                        <label class="lp-form__label" for="wl-company">{{ $t('field_company') }}</label>
                        <input class="lp-form__input"
                               type="text" id="wl-company" name="company"
                               placeholder="{{ $t('ph_company') }}"
                               autocomplete="organization">
                    </div>
                </div>

                <div class="lp-form__row">
                    <div class="lp-form__field">
                        <label class="lp-form__label" for="wl-activity">{{ $t('field_activity') }}</label>
                        <input class="lp-form__input"
                               type="text" id="wl-activity" name="activity"
                               placeholder="{{ $t('ph_activity') }}">
                    </div>
                    <div class="lp-form__field">
                        <label class="lp-form__label" for="wl-city">{{ $t('field_city') }}</label>
                        <input class="lp-form__input"
                               type="text" id="wl-city" name="city"
                               placeholder="{{ $t('ph_city') }}"
                               autocomplete="address-level2">
                    </div>
                </div>

                <div class="lp-form__field">
                    <label class="lp-form__label" for="wl-message">{{ $t('field_message') }}</label>
                    <textarea class="lp-form__input lp-form__textarea"
                              id="wl-message" name="message"
                              rows="3"
                              placeholder="{{ $t('ph_message') }}"></textarea>
                </div>

                <button type="submit" class="lp-btn lp-btn--primary lp-btn--full lp-form__submit">
                    <span class="js-submit-label">{{ $t('form_submit') }}</span>
                    <span class="js-submit-spin" style="display:none" aria-hidden="true">
                        <svg class="lp-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="white" stroke-width="3" stroke-linecap="round"/>
                        </svg>
                    </span>
                </button>

            </form>
        </div>
    </div>
</div>

</body>
</html>
