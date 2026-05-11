<?php
/**
 * Template Landing Page Mo7assib.
 *
 * Peut être utilisé comme :
 * - Template complet de homepage via template_include
 * - Rendu via shortcode [mo7assib_landing]
 *
 * @package Mo7assibCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$use_theme_chrome  = ! empty( $GLOBALS['mo7assib_core_use_theme_chrome'] );
$is_full_template  = 'landing-full' === ( $GLOBALS['mo7assib_landing_context'] ?? '' );

// ─── Données facilement modifiables ───────────────────────────
$lp = array(

	'nav' => array(
		'brand'   => 'Mo7assib',
		'links'   => array(
			array( 'label' => 'Fonctionnalités', 'href' => '#modules' ),
			array( 'label' => 'Secteurs',        'href' => '#secteurs' ),
			array( 'label' => 'Témoignages',     'href' => '#temoignages' ),
			array( 'label' => 'Contact',         'href' => '#contact' ),
		),
	),

	'hero' => array(
		'eyebrow'    => 'Plateforme de gestion d\'entreprise',
		'title_1'    => 'Pilotez votre entreprise avec',
		'title_em'   => 'clarté, contrôle',
		'title_2'    => 'et moins de friction.',
		'subtitle'   => 'Une plateforme de gestion pensée pour centraliser vos opérations, suivre vos performances et aider vos équipes à mieux travailler au quotidien.',
		'cta_primary'   => array( 'label' => 'Demander une démo', 'href' => '#contact' ),
		'cta_secondary' => array( 'label' => 'Découvrir la plateforme', 'href' => '#modules' ),
		'trust_text' => '<strong>+200 entreprises</strong> font confiance à Mo7assib',
	),

	'trust_logos' => array(
		'label' => 'Déjà adopté par des entreprises',
		'logos' => array(
			'Entreprise A', 'Entreprise B', 'Entreprise C', 'Entreprise D', 'Entreprise E',
		),
	),

	'benefits' => array(
		'kicker'   => 'Valeur produit',
		'title'    => 'Une seule plateforme pour toutes vos opérations',
		'subtitle' => 'Fini les outils dispersés. Mo7assib centralise tout ce dont vous avez besoin pour piloter votre activité avec sérénité.',
		'items'    => array(
			array(
				'icon'  => 'centralize',
				'title' => 'Centralisez vos opérations',
				'desc'  => 'Un seul espace pour gérer facturation, CRM, projets, trésorerie et stock. Fini les outils éparpillés.',
			),
			array(
				'icon'  => 'time',
				'title' => 'Gagnez du temps chaque jour',
				'desc'  => 'Automatisez vos tâches répétitives et réduisez les saisies manuelles grâce à des workflows intelligents.',
			),
			array(
				'icon'  => 'visibility',
				'title' => 'Suivez vos performances en temps réel',
				'desc'  => 'Tableaux de bord dynamiques pour une vision instantanée de votre activité, à tout moment.',
			),
			array(
				'icon'  => 'team',
				'title' => 'Améliorez la collaboration',
				'desc'  => 'Vos équipes terrain et management partagent le même espace, les mêmes informations, en temps réel.',
			),
			array(
				'icon'  => 'decision',
				'title' => 'Prenez de meilleures décisions',
				'desc'  => 'Des données claires et fiables pour des arbitrages rapides et des stratégies mieux informées.',
			),
		),
		'panel' => array(
			'title'  => 'Des résultats concrets dès les premières semaines',
			'stats'  => array(
				array( 'value' => '42', 'suffix' => '%', 'label' => 'Temps économisé sur la facturation', 'decimals' => 0 ),
				array( 'value' => '3', 'suffix' => 'x', 'label' => 'Plus de visibilité sur la trésorerie', 'decimals' => 0 ),
				array( 'value' => '98', 'suffix' => '%', 'label' => 'Taux de satisfaction client', 'decimals' => 0 ),
				array( 'value' => '2', 'suffix' => 'j', 'label' => 'Délai de prise en main', 'decimals' => 0 ),
			),
			'testimonial' => array(
				'text'   => '« Mo7assib nous a permis de passer d\'une gestion chaotique à un pilotage serein en moins d\'un mois. »',
				'name'   => 'Karim M.',
				'role'   => 'Directeur Général, PME Distribution',
				'initials' => 'KM',
			),
		),
	),

	'modules' => array(
		'kicker'   => 'Modules',
		'title'    => 'Tout ce dont votre entreprise a besoin',
		'subtitle' => 'Cinq modules intégrés, pensés pour travailler ensemble et couvrir l\'ensemble de vos opérations.',
		'items'    => array(
			array(
				'icon'     => 'invoice',
				'title'    => 'Facturation',
				'desc'     => 'Créez, envoyez et suivez vos factures avec fluidité. Relances automatiques, suivi des encaissements, historique complet.',
				'tag'      => 'Essentiel',
				'featured' => false,
				'wide'     => false,
			),
			array(
				'icon'     => 'crm',
				'title'    => 'CRM & Prospection',
				'desc'     => 'Transformez vos opportunités commerciales en croissance durable. Pipeline visuel, suivi des contacts, relances intelligentes.',
				'tag'      => 'Croissance',
				'featured' => false,
				'wide'     => false,
			),
			array(
				'icon'     => 'project',
				'title'    => 'Gestion de projets',
				'desc'     => 'Planifiez, suivez et coordonnez vos projets efficacement. Tâches, jalons, assignation d\'équipe, suivi du temps.',
				'tag'      => 'Collaboration',
				'featured' => true,
				'wide'     => true,
			),
			array(
				'icon'     => 'treasury',
				'title'    => 'Trésorerie',
				'desc'     => 'Gardez une vision claire de vos flux et de vos échéances. Prévisions, alertes de solde, rapprochements bancaires.',
				'tag'      => 'Contrôle',
				'featured' => false,
				'wide'     => false,
			),
			array(
				'icon'     => 'stock',
				'title'    => 'Gestion de stock',
				'desc'     => 'Maîtrisez vos mouvements, vos niveaux de stock et votre traçabilité. Alertes de rupture, inventaires, valorisation.',
				'tag'      => 'Logistique',
				'featured' => false,
				'wide'     => false,
			),
		),
	),

	'why' => array(
		'kicker'   => 'Pourquoi Mo7assib',
		'title'    => 'Une solution conçue pour durer avec vous',
		'subtitle' => 'Nous avons pensé chaque détail pour que la plateforme s\'adapte à votre réalité terrain.',
		'items'    => array(
			array( 'n' => '01', 'title' => 'Prise en main rapide',      'desc' => 'Interface intuitive, onboarding guidé. Vos équipes sont opérationnelles en quelques jours, sans formation complexe.' ),
			array( 'n' => '02', 'title' => 'Pensée pour le terrain',    'desc' => 'Une expérience conçue pour les équipes opérationnelles et le management, avec des vues adaptées à chaque profil.' ),
			array( 'n' => '03', 'title' => 'Accompagnement humain',     'desc' => 'Nous vous accompagnons à chaque étape : déploiement, paramétrage, formation et optimisation continue.' ),
			array( 'n' => '04', 'title' => 'Support réactif',           'desc' => 'Une équipe disponible par chat, email et téléphone. Réponse garantie sous 4 heures en jours ouvrés.' ),
			array( 'n' => '05', 'title' => 'Plateforme évolutive',      'desc' => 'De nouvelles fonctionnalités chaque mois. La plateforme grandit avec votre entreprise, sans coût supplémentaire.' ),
			array( 'n' => '06', 'title' => 'Sécurité & conformité',     'desc' => 'Données hébergées localement, chiffrement AES-256, accès par rôle. Vos informations restent protégées en toutes circonstances.' ),
		),
	),

	'secteurs' => array(
		'kicker'   => 'Secteurs d\'activité',
		'title'    => 'Adapté à votre secteur',
		'subtitle' => 'Mo7assib s\'adapte aux spécificités métier de chaque secteur. Découvrez comment nous répondons à vos enjeux.',
		'tabs' => array(
			array(
				'id'     => 'btp',
				'label'  => 'BTP',
				'title'  => 'Construction & BTP',
				'kicker' => 'Secteur BTP',
				'desc'   => 'Gérez chantiers, devis, sous-traitants et trésorerie de chantier depuis une seule interface. Suivez l\'avancement en temps réel.',
				'points' => array(
					'Suivi financier par chantier',
					'Gestion des sous-traitants',
					'Devis et situations de travaux',
					'Planning et ressources',
				),
				'icon_label' => 'BTP & Construction',
			),
			array(
				'id'     => 'distribution',
				'label'  => 'Distribution',
				'title'  => 'Commerce & Distribution',
				'kicker' => 'Secteur Distribution',
				'desc'   => 'Gérez vos commandes, stocks, livraisons et facturation avec une vision complète de votre chaîne commerciale.',
				'points' => array(
					'Gestion des commandes et livraisons',
					'Suivi des stocks multi-dépôts',
					'Facturation et relances automatiques',
					'Analyse des ventes par produit',
				),
				'icon_label' => 'Commerce & Distribution',
			),
			array(
				'id'     => 'ecommerce',
				'label'  => 'E-commerce',
				'title'  => 'Commerce en ligne',
				'kicker' => 'Secteur E-commerce',
				'desc'   => 'Synchronisez vos ventes en ligne avec votre gestion opérationnelle. Traitez les commandes, gérez les retours, suivez les marges.',
				'points' => array(
					'Synchronisation commandes en ligne',
					'Gestion des retours et SAV',
					'Analyse de marge par SKU',
					'Tableaux de bord performance',
				),
				'icon_label' => 'E-commerce',
			),
			array(
				'id'     => 'industrie',
				'label'  => 'Industrie',
				'title'  => 'Industrie & Production',
				'kicker' => 'Secteur Industrie',
				'desc'   => 'Suivez votre production, gérez vos approvisionnements, contrôlez vos coûts de fabrication et optimisez vos processus industriels.',
				'points' => array(
					'Suivi des ordres de fabrication',
					'Gestion des approvisionnements',
					'Contrôle des coûts de production',
					'Traçabilité des lots',
				),
				'icon_label' => 'Industrie',
			),
			array(
				'id'     => 'services',
				'label'  => 'Services',
				'title'  => 'Prestataires de services',
				'kicker' => 'Secteur Services',
				'desc'   => 'Gérez vos projets, vos clients et votre facturation à la prestation. Suivez vos temps, vos rentabilités, vos contrats.',
				'points' => array(
					'Facturation à l\'avancement',
					'Suivi des temps par projet',
					'CRM et pipeline commercial',
					'Rentabilité par client',
				),
				'icon_label' => 'Prestataires de services',
			),
			array(
				'id'     => 'autres',
				'label'  => 'Autres secteurs',
				'title'  => 'Toute autre activité',
				'kicker' => 'Personnalisable',
				'desc'   => 'Mo7assib est modulaire et paramétrable. Si votre secteur n\'est pas listé, nous configurons la plateforme selon vos besoins spécifiques.',
				'points' => array(
					'Configuration sur mesure',
					'Modules activables à la carte',
					'Accompagnement dédié au démarrage',
					'Évolution continue avec vos retours',
				),
				'icon_label' => 'Autres activités',
			),
		),
	),

	'testimonials' => array(
		'kicker'   => 'Témoignages',
		'title'    => 'Ce qu\'en disent nos clients',
		'subtitle' => 'Des dirigeants et responsables opérationnels qui ont transformé leur gestion quotidienne.',
		'items'    => array(
			array(
				'text'     => '« Avant Mo7assib, je devais jongler entre 4 outils différents. Maintenant tout est centralisé et je gagne facilement 2h par jour. »',
				'name'     => 'Sara B.',
				'role'     => 'Directrice Opérations, Agence services',
				'initials' => 'SB',
				'color'    => '#1C3557',
				'stars'    => 5,
				'featured' => false,
			),
			array(
				'text'     => '« La vision en temps réel de notre trésorerie a changé notre façon de décider. On anticipe mieux, on stresse moins. »',
				'name'     => 'Youssef A.',
				'role'     => 'DAF, Groupe Distribution',
				'initials' => 'YA',
				'color'    => '#C8872A',
				'stars'    => 5,
				'featured' => true,
			),
			array(
				'text'     => '« La prise en main a été très rapide. En une semaine, toute l\'équipe utilisait la plateforme sans formation poussée. »',
				'name'     => 'Nadia K.',
				'role'     => 'Responsable admin, BTP',
				'initials' => 'NK',
				'color'    => '#264873',
				'stars'    => 5,
				'featured' => false,
			),
			array(
				'text'     => '« Le module CRM nous a aidé à structurer notre prospection. Notre taux de conversion a augmenté de 30% en 3 mois. »',
				'name'     => 'Mehdi R.',
				'role'     => 'Directeur Commercial, PME Industrie',
				'initials' => 'MR',
				'color'    => '#1C3557',
				'stars'    => 5,
				'featured' => false,
			),
			array(
				'text'     => '« Support client exemplaire. Chaque fois que j\'ai une question, j\'obtiens une réponse claire et rapide. Vraiment rassurant. »',
				'name'     => 'Fatima Z.',
				'role'     => 'Gérante, Commerce en ligne',
				'initials' => 'FZ',
				'color'    => '#3A6EA5',
				'stars'    => 5,
				'featured' => false,
			),
			array(
				'text'     => '« Mo7assib a structuré notre gestion de projets. On livre à temps, on dépasse rarement le budget. C\'est transformateur. »',
				'name'     => 'Omar H.',
				'role'     => 'CEO, Bureau d\'études',
				'initials' => 'OH',
				'color'    => '#C8872A',
				'stars'    => 5,
				'featured' => false,
			),
		),
	),

	'cta' => array(
		'kicker'  => 'Démarrez aujourd\'hui',
		'title_1' => 'Passez à une gestion plus simple',
		'title_em'=> 'et plus performante.',
		'text'    => 'Découvrez comment Mo7assib peut structurer vos opérations, libérer du temps à vos équipes et accompagner votre croissance.',
		'cta_primary'   => array( 'label' => 'Réserver une démo gratuite', 'href' => '#contact' ),
		'cta_secondary' => array( 'label' => 'Voir les fonctionnalités', 'href' => '#modules' ),
		'guarantee' => 'Démo gratuite · Sans engagement · Réponse sous 24h',
	),

	'footer' => array(
		'brand'   => 'Mo7assib',
		'tagline' => 'La plateforme de gestion d\'entreprise pensée pour les PME et TPE. Centralisez, pilotez, développez.',
		'contact' => array(
			'email' => 'contact@mo7assib.ma',
			'phone' => '+212 6 00 00 00 00',
		),
		'cols' => array(
			array(
				'title' => 'Plateforme',
				'links' => array(
					array( 'label' => 'Facturation',      'href' => '#modules' ),
					array( 'label' => 'CRM & Prospection','href' => '#modules' ),
					array( 'label' => 'Gestion de projets','href' => '#modules' ),
					array( 'label' => 'Trésorerie',       'href' => '#modules' ),
					array( 'label' => 'Gestion de stock', 'href' => '#modules' ),
				),
			),
			array(
				'title' => 'Secteurs',
				'links' => array(
					array( 'label' => 'BTP',          'href' => '#secteurs' ),
					array( 'label' => 'Distribution', 'href' => '#secteurs' ),
					array( 'label' => 'E-commerce',   'href' => '#secteurs' ),
					array( 'label' => 'Industrie',    'href' => '#secteurs' ),
					array( 'label' => 'Services',     'href' => '#secteurs' ),
				),
			),
			array(
				'title' => 'Entreprise',
				'links' => array(
					array( 'label' => 'À propos',          'href' => '#' ),
					array( 'label' => 'Témoignages',       'href' => '#temoignages' ),
					array( 'label' => 'Contact & démo',    'href' => '#contact' ),
					array( 'label' => 'Mentions légales',  'href' => '#' ),
					array( 'label' => 'Politique de confidentialité', 'href' => '#' ),
				),
			),
		),
	),
);

// ─── Icônes SVG inline ────────────────────────────────────────
function mo7assib_lp_icon( $name ) {
	$icons = array(

		'centralize' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>',

		'time'       => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',

		'visibility' => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',

		'team'       => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',

		'decision'   => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',

		'invoice'    => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',

		'crm'        => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.12-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/></svg>',

		'project'    => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',

		'treasury'   => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',

		'stock'      => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',

		'check'      => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',

		'arrow'      => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',

		'building'   => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>',

		'shield'     => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',

		'star'       => '★',
	);

	return $icons[ $name ] ?? '';
}

// ─── Génération des couleurs de testimonial ───────────────────
function mo7assib_lp_avatar_bg( $color ) {
	return 'background-color:' . esc_attr( $color ) . ';';
}

?>
<?php if ( $is_full_template && ! $use_theme_chrome ) : ?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class( 'mo7assib-landing-page' ); ?>>
<?php wp_body_open(); ?>
<?php elseif ( $is_full_template && $use_theme_chrome ) : ?>
<?php get_header(); ?>
<?php endif; ?>

<div class="lp-root" id="mo7assib-landing">

	<!-- ═══════════════════════════════════════════
	     NAVIGATION
	════════════════════════════════════════════ -->
	<nav class="lp-nav" role="navigation" aria-label="Navigation principale">
		<div class="lp-container">
			<div class="lp-nav__inner">
				<a href="#" class="lp-nav__logo">
					<?php echo esc_html( $lp['nav']['brand'] ); ?><span>.</span>
				</a>

				<ul class="lp-nav__links" role="list">
					<?php foreach ( $lp['nav']['links'] as $link ) : ?>
						<li>
							<a href="<?php echo esc_attr( $link['href'] ); ?>" class="lp-nav__link">
								<?php echo esc_html( $link['label'] ); ?>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>

				<div class="lp-nav__cta">
					<a href="<?php echo esc_attr( $lp['hero']['cta_secondary']['href'] ); ?>" class="lp-btn lp-btn--outline">
						<?php echo esc_html( $lp['hero']['cta_secondary']['label'] ); ?>
					</a>
					<a href="<?php echo esc_attr( $lp['hero']['cta_primary']['href'] ); ?>" class="lp-btn lp-btn--primary">
						<?php echo esc_html( $lp['hero']['cta_primary']['label'] ); ?>
					</a>
				</div>
			</div>
		</div>
	</nav>

	<!-- ═══════════════════════════════════════════
	     HERO
	════════════════════════════════════════════ -->
	<section class="lp-hero" aria-labelledby="lp-hero-title">
		<div class="lp-container">
			<div class="lp-hero__inner">

				<!-- Copy -->
				<div class="lp-hero__copy">
					<div class="lp-hero__eyebrow lp-reveal">
						<span class="lp-hero__eyebrow-dot"></span>
						<?php echo esc_html( $lp['hero']['eyebrow'] ); ?>
					</div>

					<h1 id="lp-hero-title" class="lp-hero__title lp-reveal lp-reveal--delay-1">
						<?php echo esc_html( $lp['hero']['title_1'] ); ?>
						<em><?php echo esc_html( $lp['hero']['title_em'] ); ?></em>
						<?php echo esc_html( $lp['hero']['title_2'] ); ?>
					</h1>

					<p class="lp-hero__subtitle lp-reveal lp-reveal--delay-2">
						<?php echo esc_html( $lp['hero']['subtitle'] ); ?>
					</p>

					<div class="lp-hero__actions lp-reveal lp-reveal--delay-3">
						<a href="<?php echo esc_attr( $lp['hero']['cta_primary']['href'] ); ?>" class="lp-btn lp-btn--primary lp-btn--lg">
							<?php echo esc_html( $lp['hero']['cta_primary']['label'] ); ?>
							<span class="lp-btn__arrow" aria-hidden="true"><?php echo mo7assib_lp_icon( 'arrow' ); ?></span>
						</a>
						<a href="<?php echo esc_attr( $lp['hero']['cta_secondary']['href'] ); ?>" class="lp-btn lp-btn--outline lp-btn--lg">
							<?php echo esc_html( $lp['hero']['cta_secondary']['label'] ); ?>
						</a>
					</div>

					<div class="lp-hero__trust lp-reveal lp-reveal--delay-4">
						<div class="lp-hero__trust-avatars" aria-hidden="true">
							<div class="lp-hero__trust-avatar">KM</div>
							<div class="lp-hero__trust-avatar">SB</div>
							<div class="lp-hero__trust-avatar">YA</div>
							<div class="lp-hero__trust-avatar">NK</div>
						</div>
						<p class="lp-hero__trust-text">
							<?php echo wp_kses( $lp['hero']['trust_text'], array( 'strong' => array() ) ); ?>
						</p>
					</div>
				</div>

				<!-- Visual / Mockup -->
				<div class="lp-hero__visual lp-reveal lp-reveal--delay-2" aria-hidden="true">

					<div class="lp-mockup__floating lp-mockup__floating--tl">
						<div class="lp-mockup__floating-label">Factures ce mois</div>
						<div class="lp-mockup__floating-value">124 500 MAD</div>
						<div class="lp-mockup__floating-badge">↑ +18% vs mois préc.</div>
					</div>

					<div class="lp-mockup">
						<div class="lp-mockup__topbar">
							<span class="lp-mockup__brand">Mo7assib<span>.</span></span>
							<div class="lp-mockup__dots">
								<span class="lp-mockup__dot lp-mockup__dot--r"></span>
								<span class="lp-mockup__dot lp-mockup__dot--y"></span>
								<span class="lp-mockup__dot lp-mockup__dot--g"></span>
							</div>
						</div>

						<div class="lp-mockup__body">
							<div class="lp-mockup__stat lp-mockup__stat--accent">
								<div class="lp-mockup__stat-label">Trésorerie nette</div>
								<div class="lp-mockup__stat-value">328 200 MAD</div>
								<div class="lp-mockup__stat-trend">↑ +12,4% ce trimestre</div>
							</div>

							<div class="lp-mockup__stat">
								<div class="lp-mockup__stat-label">Projets actifs</div>
								<div class="lp-mockup__stat-value">24</div>
								<div class="lp-mockup__stat-trend">7 livrés ce mois</div>
							</div>

							<div class="lp-mockup__stat">
								<div class="lp-mockup__stat-label">Clients CRM</div>
								<div class="lp-mockup__stat-value">186</div>
								<div class="lp-mockup__stat-trend">↑ +8 ce mois</div>
							</div>

							<div class="lp-mockup__stat">
								<div class="lp-mockup__stat-label">Stock critique</div>
								<div class="lp-mockup__stat-value">3</div>
								<div class="lp-mockup__stat-trend lp-mockup__stat-trend--neg">⚠ Réappro. requis</div>
							</div>

							<div class="lp-mockup__chart">
								<div class="lp-mockup__chart-title">Facturation — 7 derniers mois</div>
								<div class="lp-mockup__bars" role="img" aria-label="Graphique de facturation">
									<div class="lp-mockup__bar" style="height:38%"></div>
									<div class="lp-mockup__bar" style="height:55%"></div>
									<div class="lp-mockup__bar" style="height:48%"></div>
									<div class="lp-mockup__bar" style="height:72%"></div>
									<div class="lp-mockup__bar" style="height:62%"></div>
									<div class="lp-mockup__bar" style="height:88%"></div>
									<div class="lp-mockup__bar lp-mockup__bar--active" style="height:100%"></div>
								</div>
							</div>

							<div class="lp-mockup__activity">
								<div class="lp-mockup__activity-title">Activité récente</div>
								<div class="lp-mockup__activity-item">
									<span class="lp-mockup__activity-dot lp-mockup__activity-dot--green"></span>
									<span class="lp-mockup__activity-text">Facture #2847 payée</span>
									<span class="lp-mockup__activity-time">09:14</span>
								</div>
								<div class="lp-mockup__activity-item">
									<span class="lp-mockup__activity-dot lp-mockup__activity-dot--gold"></span>
									<span class="lp-mockup__activity-text">Devis #510 envoyé au client</span>
									<span class="lp-mockup__activity-time">11:32</span>
								</div>
								<div class="lp-mockup__activity-item">
									<span class="lp-mockup__activity-dot lp-mockup__activity-dot--blue"></span>
									<span class="lp-mockup__activity-text">Projet "Entrepôt Nord" à 78%</span>
									<span class="lp-mockup__activity-time">14:05</span>
								</div>
							</div>
						</div>
					</div>

					<div class="lp-mockup__floating lp-mockup__floating--br">
						<div class="lp-mockup__floating-label">Satisfaction client</div>
						<div class="lp-mockup__floating-value">98%</div>
						<div class="lp-mockup__floating-badge">★★★★★</div>
					</div>

				</div>
			</div>
		</div>
	</section>

	<!-- ═══════════════════════════════════════════
	     TRUST BAND — Logos entreprises
	════════════════════════════════════════════ -->
	<div class="lp-trust" role="complementary" aria-label="<?php echo esc_attr( $lp['trust_logos']['label'] ); ?>">
		<div class="lp-container">
			<div class="lp-trust__inner">
				<span class="lp-trust__label"><?php echo esc_html( $lp['trust_logos']['label'] ); ?></span>
				<div class="lp-trust__logos">
					<?php foreach ( $lp['trust_logos']['logos'] as $logo ) : ?>
						<div class="lp-trust__logo">
							<span class="lp-trust__logo-text"><?php echo esc_html( $logo ); ?></span>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
		</div>
	</div>

	<!-- ═══════════════════════════════════════════
	     BÉNÉFICES
	════════════════════════════════════════════ -->
	<section id="benefices" class="lp-section" aria-labelledby="lp-benefits-title">
		<div class="lp-container">
			<div class="lp-benefits__grid">

				<!-- Texte + liste -->
				<div class="lp-benefits__left">
					<span class="lp-section__kicker lp-reveal"><?php echo esc_html( $lp['benefits']['kicker'] ); ?></span>
					<h2 id="lp-benefits-title" class="lp-section__title lp-reveal lp-reveal--delay-1">
						<?php echo esc_html( $lp['benefits']['title'] ); ?>
					</h2>
					<p class="lp-section__subtitle lp-reveal lp-reveal--delay-2">
						<?php echo esc_html( $lp['benefits']['subtitle'] ); ?>
					</p>

					<div class="lp-benefits__items">
						<?php foreach ( $lp['benefits']['items'] as $i => $benefit ) : ?>
							<div class="lp-benefit lp-reveal lp-reveal--delay-<?php echo min( $i + 1, 6 ); ?>">
								<div class="lp-benefit__icon" aria-hidden="true">
									<?php echo mo7assib_lp_icon( $benefit['icon'] ); ?>
								</div>
								<div class="lp-benefit__content">
									<h3><?php echo esc_html( $benefit['title'] ); ?></h3>
									<p><?php echo esc_html( $benefit['desc'] ); ?></p>
								</div>
							</div>
						<?php endforeach; ?>
					</div>
				</div>

				<!-- Panneau stats + mini témoignage -->
				<div class="lp-benefits__visual lp-reveal lp-reveal--delay-2">
					<div class="lp-benefits__panel">
						<h3 class="lp-benefits__panel-title">
							<?php echo esc_html( $lp['benefits']['panel']['title'] ); ?>
						</h3>

						<div class="lp-benefits__stats">
							<?php foreach ( $lp['benefits']['panel']['stats'] as $stat ) : ?>
								<div class="lp-benefits__stat">
									<div class="lp-benefits__stat-value"
										 data-counter
										 data-target="<?php echo esc_attr( $stat['value'] ); ?>"
										 data-suffix="<?php echo esc_attr( $stat['suffix'] ); ?>"
										 data-decimals="<?php echo esc_attr( $stat['decimals'] ); ?>">
										<?php echo esc_html( $stat['value'] . $stat['suffix'] ); ?>
									</div>
									<div class="lp-benefits__stat-label"><?php echo esc_html( $stat['label'] ); ?></div>
								</div>
							<?php endforeach; ?>
						</div>

						<div class="lp-benefits__testimonial-mini">
							<p><?php echo esc_html( $lp['benefits']['panel']['testimonial']['text'] ); ?></p>
							<div class="lp-benefits__testimonial-mini-author">
								<div class="lp-benefits__testimonial-mini-avatar" aria-hidden="true">
									<?php echo esc_html( $lp['benefits']['panel']['testimonial']['initials'] ); ?>
								</div>
								<div>
									<div class="lp-benefits__testimonial-mini-name">
										<?php echo esc_html( $lp['benefits']['panel']['testimonial']['name'] ); ?>
									</div>
									<div class="lp-benefits__testimonial-mini-role">
										<?php echo esc_html( $lp['benefits']['panel']['testimonial']['role'] ); ?>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>
	</section>

	<!-- ═══════════════════════════════════════════
	     MODULES / FONCTIONNALITÉS
	════════════════════════════════════════════ -->
	<section id="modules" class="lp-section lp-section--alt" aria-labelledby="lp-modules-title">
		<div class="lp-container">
			<div class="lp-section__head">
				<span class="lp-section__kicker lp-reveal"><?php echo esc_html( $lp['modules']['kicker'] ); ?></span>
				<h2 id="lp-modules-title" class="lp-section__title lp-reveal lp-reveal--delay-1">
					<?php echo esc_html( $lp['modules']['title'] ); ?>
				</h2>
				<p class="lp-section__subtitle lp-reveal lp-reveal--delay-2">
					<?php echo esc_html( $lp['modules']['subtitle'] ); ?>
				</p>
			</div>

			<div class="lp-modules__grid">
				<?php foreach ( $lp['modules']['items'] as $i => $module ) : ?>
					<article class="lp-module-card<?php
						echo $module['featured'] ? ' lp-module-card--featured' : '';
						echo $module['wide']     ? ' lp-module-card--wide'     : '';
					?> lp-reveal lp-reveal--delay-<?php echo min( $i + 1, 6 ); ?>">

						<div class="lp-module-card__icon" aria-hidden="true">
							<?php echo mo7assib_lp_icon( $module['icon'] ); ?>
						</div>
						<h3 class="lp-module-card__title"><?php echo esc_html( $module['title'] ); ?></h3>
						<p class="lp-module-card__desc"><?php echo esc_html( $module['desc'] ); ?></p>
						<span class="lp-module-card__tag"><?php echo esc_html( $module['tag'] ); ?></span>

					</article>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<!-- ═══════════════════════════════════════════
	     POURQUOI NOUS CHOISIR
	════════════════════════════════════════════ -->
	<section id="pourquoi" class="lp-section" aria-labelledby="lp-why-title">
		<div class="lp-container">
			<div class="lp-section__head">
				<span class="lp-section__kicker lp-reveal"><?php echo esc_html( $lp['why']['kicker'] ); ?></span>
				<h2 id="lp-why-title" class="lp-section__title lp-reveal lp-reveal--delay-1">
					<?php echo esc_html( $lp['why']['title'] ); ?>
				</h2>
				<p class="lp-section__subtitle lp-reveal lp-reveal--delay-2">
					<?php echo esc_html( $lp['why']['subtitle'] ); ?>
				</p>
			</div>

			<div class="lp-why__grid">
				<?php foreach ( $lp['why']['items'] as $i => $why ) : ?>
					<article class="lp-why-card lp-reveal lp-reveal--delay-<?php echo min( $i + 1, 6 ); ?>">
						<div class="lp-why-card__number" aria-hidden="true"><?php echo esc_html( $why['n'] ); ?></div>
						<h3 class="lp-why-card__title"><?php echo esc_html( $why['title'] ); ?></h3>
						<p class="lp-why-card__desc"><?php echo esc_html( $why['desc'] ); ?></p>
					</article>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<!-- ═══════════════════════════════════════════
	     SECTEURS D'ACTIVITÉ
	════════════════════════════════════════════ -->
	<section id="secteurs" class="lp-section lp-section--alt" aria-labelledby="lp-secteurs-title">
		<div class="lp-container">
			<div class="lp-section__head">
				<span class="lp-section__kicker lp-reveal"><?php echo esc_html( $lp['secteurs']['kicker'] ); ?></span>
				<h2 id="lp-secteurs-title" class="lp-section__title lp-reveal lp-reveal--delay-1">
					<?php echo esc_html( $lp['secteurs']['title'] ); ?>
				</h2>
				<p class="lp-section__subtitle lp-reveal lp-reveal--delay-2">
					<?php echo esc_html( $lp['secteurs']['subtitle'] ); ?>
				</p>
			</div>

			<div class="lp-secteurs__tabs lp-reveal lp-reveal--delay-2" role="tablist" aria-label="Secteurs d'activité">
				<?php foreach ( $lp['secteurs']['tabs'] as $i => $tab ) : ?>
					<button
						class="lp-secteurs__tab<?php echo 0 === $i ? ' lp-secteurs__tab--active' : ''; ?>"
						data-tab="<?php echo esc_attr( $tab['id'] ); ?>"
						role="tab"
						aria-selected="<?php echo 0 === $i ? 'true' : 'false'; ?>"
						aria-controls="lp-secteur-<?php echo esc_attr( $tab['id'] ); ?>"
					>
						<?php echo esc_html( $tab['label'] ); ?>
					</button>
				<?php endforeach; ?>
			</div>

			<div class="lp-secteurs__panels">
				<?php foreach ( $lp['secteurs']['tabs'] as $i => $tab ) : ?>
					<div
						id="lp-secteur-<?php echo esc_attr( $tab['id'] ); ?>"
						class="lp-secteurs__panel<?php echo 0 === $i ? ' lp-secteurs__panel--active' : ''; ?>"
						data-panel="<?php echo esc_attr( $tab['id'] ); ?>"
						role="tabpanel"
					>
						<div class="lp-secteurs__panel-content">
							<span class="lp-section__kicker"><?php echo esc_html( $tab['kicker'] ); ?></span>
							<h3 class="lp-secteurs__panel-title"><?php echo esc_html( $tab['title'] ); ?></h3>
							<p class="lp-secteurs__panel-desc"><?php echo esc_html( $tab['desc'] ); ?></p>

							<ul class="lp-secteurs__panel-points" role="list">
								<?php foreach ( $tab['points'] as $point ) : ?>
									<li class="lp-secteurs__panel-point">
										<?php echo esc_html( $point ); ?>
									</li>
								<?php endforeach; ?>
							</ul>
						</div>

						<div class="lp-secteurs__panel-visual" aria-hidden="true">
							<div class="lp-secteurs__panel-icon-wrap">
								<?php echo mo7assib_lp_icon( 'building' ); ?>
								<div class="lp-secteurs__panel-icon-label">
									<?php echo esc_html( $tab['icon_label'] ); ?>
								</div>
							</div>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<!-- ═══════════════════════════════════════════
	     TÉMOIGNAGES
	════════════════════════════════════════════ -->
	<section id="temoignages" class="lp-section" aria-labelledby="lp-testimonials-title">
		<div class="lp-container">
			<div class="lp-section__head">
				<span class="lp-section__kicker lp-reveal"><?php echo esc_html( $lp['testimonials']['kicker'] ); ?></span>
				<h2 id="lp-testimonials-title" class="lp-section__title lp-reveal lp-reveal--delay-1">
					<?php echo esc_html( $lp['testimonials']['title'] ); ?>
				</h2>
				<p class="lp-section__subtitle lp-reveal lp-reveal--delay-2">
					<?php echo esc_html( $lp['testimonials']['subtitle'] ); ?>
				</p>
			</div>

			<div class="lp-testimonials__grid">
				<?php foreach ( $lp['testimonials']['items'] as $i => $t ) : ?>
					<article class="lp-testimonial<?php echo $t['featured'] ? ' lp-testimonial--featured' : ''; ?> lp-reveal lp-reveal--delay-<?php echo min( $i + 1, 6 ); ?>">

						<div class="lp-testimonial__stars" aria-label="<?php echo esc_attr( $t['stars'] ); ?> étoiles sur 5">
							<?php for ( $s = 0; $s < $t['stars']; $s++ ) : ?>
								<span class="lp-testimonial__star" aria-hidden="true">★</span>
							<?php endfor; ?>
						</div>

						<p class="lp-testimonial__text"><?php echo esc_html( $t['text'] ); ?></p>

						<div class="lp-testimonial__author">
							<div class="lp-testimonial__avatar" style="<?php echo mo7assib_lp_avatar_bg( $t['color'] ); ?>" aria-hidden="true">
								<?php echo esc_html( $t['initials'] ); ?>
							</div>
							<div>
								<div class="lp-testimonial__name"><?php echo esc_html( $t['name'] ); ?></div>
								<div class="lp-testimonial__role"><?php echo esc_html( $t['role'] ); ?></div>
							</div>
						</div>

					</article>
				<?php endforeach; ?>
			</div>
		</div>
	</section>

	<!-- ═══════════════════════════════════════════
	     CTA FINAL
	════════════════════════════════════════════ -->
	<section id="contact" class="lp-cta-final" aria-labelledby="lp-cta-title">
		<div class="lp-container">
			<div class="lp-cta-final__inner">
				<span class="lp-cta-final__kicker lp-reveal">
					<?php echo esc_html( $lp['cta']['kicker'] ); ?>
				</span>

				<h2 id="lp-cta-title" class="lp-cta-final__title lp-reveal lp-reveal--delay-1">
					<?php echo esc_html( $lp['cta']['title_1'] ); ?>
					<em><?php echo esc_html( $lp['cta']['title_em'] ); ?></em>
				</h2>

				<p class="lp-cta-final__text lp-reveal lp-reveal--delay-2">
					<?php echo esc_html( $lp['cta']['text'] ); ?>
				</p>

				<div class="lp-cta-final__actions lp-reveal lp-reveal--delay-3">
					<a href="<?php echo esc_attr( $lp['cta']['cta_primary']['href'] ); ?>" class="lp-btn lp-btn--primary lp-btn--lg">
						<?php echo esc_html( $lp['cta']['cta_primary']['label'] ); ?>
						<span class="lp-btn__arrow" aria-hidden="true"><?php echo mo7assib_lp_icon( 'arrow' ); ?></span>
					</a>
					<a href="<?php echo esc_attr( $lp['cta']['cta_secondary']['href'] ); ?>" class="lp-btn lp-btn--ghost-white lp-btn--lg">
						<?php echo esc_html( $lp['cta']['cta_secondary']['label'] ); ?>
					</a>
				</div>

				<p class="lp-cta-final__guarantee lp-reveal lp-reveal--delay-4">
					<?php echo esc_html( $lp['cta']['guarantee'] ); ?>
				</p>
			</div>
		</div>
	</section>

	<!-- ═══════════════════════════════════════════
	     FOOTER
	════════════════════════════════════════════ -->
	<footer class="lp-footer" role="contentinfo">
		<div class="lp-container">
			<div class="lp-footer__inner">

				<!-- Brand & contact -->
				<div>
					<div class="lp-footer__brand">
						<?php echo esc_html( $lp['footer']['brand'] ); ?><span>.</span>
					</div>
					<p class="lp-footer__tagline"><?php echo esc_html( $lp['footer']['tagline'] ); ?></p>
					<div class="lp-footer__contact">
						<a href="mailto:<?php echo esc_attr( $lp['footer']['contact']['email'] ); ?>">
							<?php echo esc_html( $lp['footer']['contact']['email'] ); ?>
						</a>
						<a href="tel:<?php echo esc_attr( preg_replace( '/\s/', '', $lp['footer']['contact']['phone'] ) ); ?>">
							<?php echo esc_html( $lp['footer']['contact']['phone'] ); ?>
						</a>
					</div>
				</div>

				<!-- Navigation cols -->
				<?php foreach ( $lp['footer']['cols'] as $col ) : ?>
					<div>
						<h3 class="lp-footer__col-title"><?php echo esc_html( $col['title'] ); ?></h3>
						<ul class="lp-footer__links" role="list">
							<?php foreach ( $col['links'] as $link ) : ?>
								<li>
									<a href="<?php echo esc_attr( $link['href'] ); ?>" class="lp-footer__link">
										<?php echo esc_html( $link['label'] ); ?>
									</a>
								</li>
							<?php endforeach; ?>
						</ul>
					</div>
				<?php endforeach; ?>

			</div>

			<div class="lp-footer__bottom">
				<span class="lp-footer__copy">
					<?php
					echo esc_html(
						sprintf(
							'© %s %s. Tous droits réservés.',
							gmdate( 'Y' ),
							$lp['footer']['brand']
						)
					);
					?>
				</span>
				<nav class="lp-footer__legal" aria-label="Liens légaux">
					<a href="#" class="lp-footer__legal">Mentions légales</a>
					<a href="#" class="lp-footer__legal">Confidentialité</a>
					<a href="#" class="lp-footer__legal">CGU</a>
				</nav>
			</div>
		</div>
	</footer>

</div><!-- /.lp-root -->

<?php if ( $is_full_template && $use_theme_chrome ) : ?>
	<?php get_footer(); ?>
<?php elseif ( $is_full_template && ! $use_theme_chrome ) : ?>
	<?php wp_footer(); ?>
	</body>
	</html>
<?php endif; ?>
