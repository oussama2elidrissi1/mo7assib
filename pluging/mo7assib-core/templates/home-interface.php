<?php
/**
 * Template principal Mo7assib.
 *
 * Utilise comme :
 * - template complet de homepage via template_include
 * - rendu shortcode sur d autres pages
 *
 * Variables attendues :
 * - array $view_model
 *
 * @package Mo7assibCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! isset( $view_model ) ) {
	$view_model = isset( $GLOBALS['mo7assib_core_view_model'] ) && is_array( $GLOBALS['mo7assib_core_view_model'] )
		? $GLOBALS['mo7assib_core_view_model']
		: array();
}

$use_theme_chrome = ! empty( $GLOBALS['mo7assib_core_use_theme_chrome'] );
$is_full_template = 'full-homepage-replacement' === ( $view_model['context'] ?? '' );

$hero_title    = __( 'Votre comptabilite simple, rapide et digitale.', 'mo7assib-core' );
$hero_subtitle = __( 'Mo7assib aide les TPE, PME et entrepreneurs marocains a centraliser leur comptabilite, suivre leurs depenses et piloter leur activite avec une interface claire.', 'mo7assib-core' );
$services      = array(
	array(
		'icon'        => '01',
		'title'       => __( 'Comptabilite simplifiee', 'mo7assib-core' ),
		'description' => __( 'Organisez vos ecritures, vos justificatifs et vos obligations dans un espace clair, pense pour les realites des entreprises marocaines.', 'mo7assib-core' ),
	),
	array(
		'icon'        => '02',
		'title'       => __( 'Gestion des factures', 'mo7assib-core' ),
		'description' => __( 'Suivez vos ventes, vos encaissements et vos documents sans vous perdre dans des tableurs ou des process disperses.', 'mo7assib-core' ),
	),
	array(
		'icon'        => '03',
		'title'       => __( 'Suivi des depenses', 'mo7assib-core' ),
		'description' => __( 'Identifiez rapidement les sorties d argent, classez vos charges et gardez une vision nette de votre tresorerie.', 'mo7assib-core' ),
	),
	array(
		'icon'        => '04',
		'title'       => __( 'Tableaux de bord utiles', 'mo7assib-core' ),
		'description' => __( 'Visualisez les indicateurs essentiels pour piloter votre activite sans dependre d outils techniques complexes.', 'mo7assib-core' ),
	),
);
$advantages    = array(
	array(
		'title'       => __( 'Gain de temps reel', 'mo7assib-core' ),
		'description' => __( 'Moins de saisie manuelle, moins d aller-retour, plus de temps pour faire avancer votre entreprise.', 'mo7assib-core' ),
	),
	array(
		'title'       => __( 'Interface claire', 'mo7assib-core' ),
		'description' => __( 'Une experience pensee pour les dirigeants, independants et equipes qui veulent aller a l essentiel.', 'mo7assib-core' ),
	),
	array(
		'title'       => __( 'Support humain', 'mo7assib-core' ),
		'description' => __( 'Une equipe disponible pour vous accompagner dans la prise en main et les questions du quotidien.', 'mo7assib-core' ),
	),
	array(
		'title'       => __( 'Donnees securisees', 'mo7assib-core' ),
		'description' => __( 'Vos informations restent structurees, securisees et prêtes a alimenter vos futurs flux metier.', 'mo7assib-core' ),
	),
);
$steps         = array(
	array(
		'number'      => '1',
		'title'       => __( 'Creer votre compte', 'mo7assib-core' ),
		'description' => __( 'Demarrez rapidement avec un espace configure pour votre activite et vos besoins de gestion.', 'mo7assib-core' ),
	),
	array(
		'number'      => '2',
		'title'       => __( 'Ajouter vos donnees', 'mo7assib-core' ),
		'description' => __( 'Importez vos pieces, vos factures et vos informations de base pour centraliser votre suivi.', 'mo7assib-core' ),
	),
	array(
		'number'      => '3',
		'title'       => __( 'Suivre votre activite', 'mo7assib-core' ),
		'description' => __( 'Consultez vos indicateurs, vos depenses et vos documents depuis une meme interface.', 'mo7assib-core' ),
	),
);
$plans         = array(
	array(
		'name'        => __( 'Starter', 'mo7assib-core' ),
		'price'       => __( 'A partir de 149 DH/mois', 'mo7assib-core' ),
		'description' => __( 'Pour independants et petites structures qui veulent une base claire et efficace.', 'mo7assib-core' ),
		'items'       => array(
			__( 'Suivi comptable essentiel', 'mo7assib-core' ),
			__( 'Gestion simple des factures', 'mo7assib-core' ),
			__( 'Support de demarrage', 'mo7assib-core' ),
		),
		'featured'    => false,
	),
	array(
		'name'        => __( 'Business', 'mo7assib-core' ),
		'price'       => __( 'A partir de 299 DH/mois', 'mo7assib-core' ),
		'description' => __( 'Pour TPE et PME qui veulent un suivi plus complet et une meilleure visibilite.', 'mo7assib-core' ),
		'items'       => array(
			__( 'Tableaux de bord avances', 'mo7assib-core' ),
			__( 'Suivi des depenses et justificatifs', 'mo7assib-core' ),
			__( 'Accompagnement prioritaire', 'mo7assib-core' ),
		),
		'featured'    => true,
	),
	array(
		'name'        => __( 'Sur mesure', 'mo7assib-core' ),
		'price'       => __( 'Offre personnalisee', 'mo7assib-core' ),
		'description' => __( 'Pour les entreprises qui veulent connecter Mo7assib a leurs flux et outils internes.', 'mo7assib-core' ),
		'items'       => array(
			__( 'Besoins specifiques metier', 'mo7assib-core' ),
			__( 'Preparation integration Laravel/API', 'mo7assib-core' ),
			__( 'Accompagnement dedie', 'mo7assib-core' ),
		),
		'featured'    => false,
	),
);

if ( $is_full_template && ! $use_theme_chrome ) :
	?><!DOCTYPE html>
	<html <?php language_attributes(); ?>>
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<?php wp_head(); ?>
	</head>
	<body <?php body_class( 'mo7assib-homepage-template' ); ?>>
	<?php wp_body_open(); ?>
<?php elseif ( $is_full_template && $use_theme_chrome ) : ?>
	<?php get_header(); ?>
<?php endif; ?>

<main class="mo7assib-homepage" id="mo7assib-homepage-root">
	<section class="mo7assib-home" aria-labelledby="mo7assib-home-title">
		<div class="mo7assib-home__shell">
			<?php if ( ! empty( $view_model['debug_enabled'] ) ) : ?>
				<div class="mo7assib-home__debug">
					<?php echo esc_html( 'Mo7assib plugin loaded' ); ?>
					<span class="mo7assib-home__debug-context">
						<?php echo esc_html( sprintf( '(%s)', $view_model['context'] ?? 'unknown' ) ); ?>
					</span>
				</div>
			<?php endif; ?>

			<section class="mo7assib-home__hero">
				<div class="mo7assib-home__hero-copy">
					<span class="mo7assib-home__eyebrow"><?php esc_html_e( 'Solution comptable pour entreprises marocaines', 'mo7assib-core' ); ?></span>
					<h1 id="mo7assib-home-title" class="mo7assib-home__title"><?php echo esc_html( $hero_title ); ?></h1>
					<p class="mo7assib-home__subtitle"><?php echo esc_html( $hero_subtitle ); ?></p>

					<div class="mo7assib-home__actions">
						<a class="mo7assib-home__button mo7assib-home__button--primary" href="#mo7assib-cta">
							<?php esc_html_e( 'Commencer maintenant', 'mo7assib-core' ); ?>
						</a>
						<a class="mo7assib-home__button mo7assib-home__button--secondary" href="mailto:contact@mo7assib.ma?subject=Demande%20de%20demo">
							<?php esc_html_e( 'Demander une demo', 'mo7assib-core' ); ?>
						</a>
					</div>

					<ul class="mo7assib-home__hero-points" role="list">
						<li><?php esc_html_e( 'Concu pour TPE, PME et entrepreneurs', 'mo7assib-core' ); ?></li>
						<li><?php esc_html_e( 'Suivi simple des factures et depenses', 'mo7assib-core' ); ?></li>
						<li><?php esc_html_e( 'Base prete pour evolutions API et automatisation', 'mo7assib-core' ); ?></li>
					</ul>
				</div>

				<div class="mo7assib-home__hero-visual">
					<div class="mo7assib-home__mockup">
						<div class="mo7assib-home__mockup-topbar">
							<span class="mo7assib-home__mockup-brand"><?php esc_html_e( 'Mo7assib', 'mo7assib-core' ); ?></span>
							<span class="mo7assib-home__mockup-badge"><?php esc_html_e( 'Vue client', 'mo7assib-core' ); ?></span>
						</div>

						<div class="mo7assib-home__mockup-grid">
							<div class="mo7assib-home__mockup-card mo7assib-home__mockup-card--primary">
								<span><?php esc_html_e( 'Tresorerie du mois', 'mo7assib-core' ); ?></span>
								<strong>124 500 DH</strong>
								<em><?php esc_html_e( '+18% vs mois precedent', 'mo7assib-core' ); ?></em>
							</div>
							<div class="mo7assib-home__mockup-card">
								<span><?php esc_html_e( 'Factures suivies', 'mo7assib-core' ); ?></span>
								<strong>286</strong>
								<em><?php esc_html_e( 'Toutes vos pieces au meme endroit', 'mo7assib-core' ); ?></em>
							</div>
							<div class="mo7assib-home__mockup-chart">
								<div class="mo7assib-home__mockup-chart-head">
									<strong><?php esc_html_e( 'Vue d ensemble', 'mo7assib-core' ); ?></strong>
									<span><?php esc_html_e( 'Dashboard dynamique demain via Laravel', 'mo7assib-core' ); ?></span>
								</div>
								<div class="mo7assib-home__bars" aria-hidden="true">
									<span style="height: 48px;"></span>
									<span style="height: 86px;"></span>
									<span style="height: 72px;"></span>
									<span style="height: 114px;"></span>
									<span style="height: 94px;"></span>
									<span style="height: 128px;"></span>
								</div>
							</div>
							<div class="mo7assib-home__mockup-list">
								<div class="mo7assib-home__mockup-list-title"><?php esc_html_e( 'Actions recentes', 'mo7assib-core' ); ?></div>
								<ul role="list">
									<li><?php esc_html_e( 'Facture client ajoutee', 'mo7assib-core' ); ?></li>
									<li><?php esc_html_e( 'Depense fournisseur classee', 'mo7assib-core' ); ?></li>
									<li><?php esc_html_e( 'Rapport mensuel genere', 'mo7assib-core' ); ?></li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section class="mo7assib-home__section" aria-labelledby="mo7assib-services-title">
				<div class="mo7assib-home__section-head">
					<span class="mo7assib-home__section-kicker"><?php esc_html_e( 'Services', 'mo7assib-core' ); ?></span>
					<h2 id="mo7assib-services-title"><?php esc_html_e( 'Les outils essentiels pour piloter votre gestion au quotidien', 'mo7assib-core' ); ?></h2>
				</div>
				<div class="mo7assib-home__service-grid">
					<?php foreach ( $services as $service ) : ?>
						<article class="mo7assib-home__service-card">
							<div class="mo7assib-home__service-icon"><?php echo esc_html( $service['icon'] ); ?></div>
							<h3><?php echo esc_html( $service['title'] ); ?></h3>
							<p><?php echo esc_html( $service['description'] ); ?></p>
						</article>
					<?php endforeach; ?>
				</div>
			</section>

			<section class="mo7assib-home__section" aria-labelledby="mo7assib-advantages-title">
				<div class="mo7assib-home__section-head">
					<span class="mo7assib-home__section-kicker"><?php esc_html_e( 'Pourquoi Mo7assib', 'mo7assib-core' ); ?></span>
					<h2 id="mo7assib-advantages-title"><?php esc_html_e( 'Une solution pensee pour les besoins concrets des entreprises', 'mo7assib-core' ); ?></h2>
				</div>
				<div class="mo7assib-home__advantage-grid">
					<?php foreach ( $advantages as $advantage ) : ?>
						<article class="mo7assib-home__advantage-card">
							<h3><?php echo esc_html( $advantage['title'] ); ?></h3>
							<p><?php echo esc_html( $advantage['description'] ); ?></p>
						</article>
					<?php endforeach; ?>
				</div>
			</section>

			<section class="mo7assib-home__section" aria-labelledby="mo7assib-steps-title">
				<div class="mo7assib-home__section-head">
					<span class="mo7assib-home__section-kicker"><?php esc_html_e( 'Comment ca marche', 'mo7assib-core' ); ?></span>
					<h2 id="mo7assib-steps-title"><?php esc_html_e( 'Une prise en main rapide, sans complexite technique', 'mo7assib-core' ); ?></h2>
				</div>
				<div class="mo7assib-home__steps">
					<?php foreach ( $steps as $step ) : ?>
						<article class="mo7assib-home__step">
							<div class="mo7assib-home__step-number"><?php echo esc_html( $step['number'] ); ?></div>
							<h3><?php echo esc_html( $step['title'] ); ?></h3>
							<p><?php echo esc_html( $step['description'] ); ?></p>
						</article>
					<?php endforeach; ?>
				</div>
			</section>

			<section class="mo7assib-home__section" aria-labelledby="mo7assib-pricing-title">
				<div class="mo7assib-home__section-head">
					<span class="mo7assib-home__section-kicker"><?php esc_html_e( 'Tarifs', 'mo7assib-core' ); ?></span>
					<h2 id="mo7assib-pricing-title"><?php esc_html_e( 'Choisissez la formule adaptee a votre stade de croissance', 'mo7assib-core' ); ?></h2>
				</div>
				<div class="mo7assib-home__pricing-grid">
					<?php foreach ( $plans as $plan ) : ?>
						<article class="mo7assib-home__pricing-card<?php echo $plan['featured'] ? ' mo7assib-home__pricing-card--featured' : ''; ?>">
							<div class="mo7assib-home__pricing-header">
								<h3><?php echo esc_html( $plan['name'] ); ?></h3>
								<div class="mo7assib-home__pricing-price"><?php echo esc_html( $plan['price'] ); ?></div>
							</div>
							<p><?php echo esc_html( $plan['description'] ); ?></p>
							<ul class="mo7assib-home__pricing-list" role="list">
								<?php foreach ( $plan['items'] as $item ) : ?>
									<li><?php echo esc_html( $item ); ?></li>
								<?php endforeach; ?>
							</ul>
						</article>
					<?php endforeach; ?>
				</div>
			</section>

			<section id="mo7assib-cta" class="mo7assib-home__cta">
				<div class="mo7assib-home__cta-copy">
					<span class="mo7assib-home__section-kicker"><?php esc_html_e( 'Essayez gratuitement', 'mo7assib-core' ); ?></span>
					<h2><?php esc_html_e( 'Passez a une gestion plus simple et plus moderne.', 'mo7assib-core' ); ?></h2>
					<p><?php esc_html_e( 'Demandez une demonstration ou lancez votre espace pour decouvrir une comptabilite plus fluide, plus visible et mieux structuree.', 'mo7assib-core' ); ?></p>
				</div>
				<div class="mo7assib-home__cta-side">
					<a class="mo7assib-home__button mo7assib-home__button--primary" href="mailto:contact@mo7assib.ma?subject=Essai%20gratuit%20Mo7assib">
						<?php esc_html_e( 'Essayer gratuitement', 'mo7assib-core' ); ?>
					</a>
					<a class="mo7assib-home__button mo7assib-home__button--ghost" href="mailto:contact@mo7assib.ma?subject=Demande%20de%20demo%20Mo7assib">
						<?php esc_html_e( 'Parler a un conseiller', 'mo7assib-core' ); ?>
					</a>
				</div>
			</section>

			<footer class="mo7assib-home__footer">
				<div>
					<strong><?php esc_html_e( 'Mo7assib', 'mo7assib-core' ); ?></strong>
					<p><?php esc_html_e( 'La solution de gestion comptable digitale pour entrepreneurs, TPE et PME au Maroc.', 'mo7assib-core' ); ?></p>
				</div>
				<div class="mo7assib-home__footer-meta">
					<a href="mailto:contact@mo7assib.ma">contact@mo7assib.ma</a>
					<a href="tel:+212600000000">+212 6 00 00 00 00</a>
					<span><?php echo esc_html( sprintf( '© %s Mo7assib. Tous droits reserves.', gmdate( 'Y' ) ) ); ?></span>
				</div>
			</footer>
		</div>
	</section>
</main>

<?php if ( $is_full_template && $use_theme_chrome ) : ?>
	<?php get_footer(); ?>
<?php elseif ( $is_full_template && ! $use_theme_chrome ) : ?>
	<?php wp_footer(); ?>
	</body>
	</html>
<?php endif; ?>
