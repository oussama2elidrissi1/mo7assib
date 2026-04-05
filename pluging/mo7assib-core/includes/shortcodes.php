<?php
/**
 * Declaration des shortcodes du plugin.
 *
 * @package Mo7assibCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Gere les shortcodes frontend de Mo7assib Core.
 */
class Mo7assib_Core_Shortcodes {

	/**
	 * Enregistre les shortcodes publics.
	 *
	 * @return void
	 */
	public function register() {
		add_shortcode( 'mo7assib_home', array( $this, 'render_home' ) );
	}

	/**
	 * Retourne le chemin du template principal.
	 *
	 * @return string
	 */
	public function get_home_template_path() {
		return MO7ASSIB_CORE_PATH . 'templates/home-interface.php';
	}

	/**
	 * Construit les donnees de vue partagees entre shortcode et homepage complete.
	 *
	 * @param array<string, mixed> $atts Attributs d entree.
	 * @return array<string, mixed>
	 */
	public function get_home_view_model( $atts = array() ) {
		$atts = shortcode_atts(
			array(
				'title'    => __( 'Pilotez vos reservations avec une interface nette, rapide et prete pour votre backend.', 'mo7assib-core' ),
				'subtitle' => __( 'Mo7assib remplace la homepage par une experience SaaS orientee conversion, operations et evolutivite API.', 'mo7assib-core' ),
				'context'  => 'shortcode',
				'debug'    => '1',
			),
			$atts,
			'mo7assib_home'
		);

		return array(
			'eyebrow'           => __( 'Mo7assib Workspace', 'mo7assib-core' ),
			'title'             => $atts['title'],
			'subtitle'          => $atts['subtitle'],
			'context'           => sanitize_key( (string) $atts['context'] ),
			'debug_enabled'     => '0' !== (string) $atts['debug'],
			'primary_cta'       => array(
				'label' => __( 'Demander une demo', 'mo7assib-core' ),
				'url'   => '#mo7assib-cta',
			),
			'secondary_cta'     => array(
				'label' => __( 'Voir le dashboard', 'mo7assib-core' ),
				'url'   => '#mo7assib-dashboard',
			),
			'hero_metrics'      => array(
				array(
					'value' => '24/7',
					'label' => __( 'Visibilite metier', 'mo7assib-core' ),
				),
				array(
					'value' => 'API',
					'label' => __( 'Connexion Laravel ready', 'mo7assib-core' ),
				),
				array(
					'value' => '-42%',
					'label' => __( 'Temps de traitement cible', 'mo7assib-core' ),
				),
			),
			'features'          => array(
				array(
					'kicker'      => __( 'Operations', 'mo7assib-core' ),
					'title'       => __( 'Centralisez reservations, clients et disponibilites', 'mo7assib-core' ),
					'description' => __( 'Une couche frontend dediee pour simplifier les parcours et preparer les appels vers vos services Laravel.', 'mo7assib-core' ),
				),
				array(
					'kicker'      => __( 'Isolation', 'mo7assib-core' ),
					'title'       => __( 'Le theme reste intact, la logique vit dans le plugin', 'mo7assib-core' ),
					'description' => __( 'La homepage est remplacee proprement sans dupliquer Astra ni dependre du contenu WordPress classique.', 'mo7assib-core' ),
				),
				array(
					'kicker'      => __( 'Scalabilite', 'mo7assib-core' ),
					'title'       => __( 'Une base prete pour endpoints, auth et dashboards dynamiques', 'mo7assib-core' ),
					'description' => __( 'Le JS et la structure de rendu sont prets pour brancher une API, des widgets live et des vues metier plus riches.', 'mo7assib-core' ),
				),
			),
			'dashboard_panels'  => array(
				array(
					'label' => __( 'Reservations du jour', 'mo7assib-core' ),
					'value' => '128',
					'trend' => '+12%',
				),
				array(
					'label' => __( 'Paiements verifies', 'mo7assib-core' ),
					'value' => '91%',
					'trend' => '+5%',
				),
				array(
					'label' => __( 'Tickets urgents', 'mo7assib-core' ),
					'value' => '07',
					'trend' => '-18%',
				),
			),
			'dashboard_activity' => array(
				array(
					'time'  => '08:15',
					'title' => __( 'Flux importes depuis Laravel', 'mo7assib-core' ),
					'meta'  => __( 'Synchronisation des reservations et disponibilites', 'mo7assib-core' ),
				),
				array(
					'time'  => '10:40',
					'title' => __( 'Alerte capacite detectee', 'mo7assib-core' ),
					'meta'  => __( 'Une action operateur est requise sur deux departs', 'mo7assib-core' ),
				),
				array(
					'time'  => '13:05',
					'title' => __( 'Export financier prepare', 'mo7assib-core' ),
					'meta'  => __( 'Le rapport est pret pour validation comptable', 'mo7assib-core' ),
				),
			),
			'pricing'           => array(
				array(
					'name'        => __( 'Launch', 'mo7assib-core' ),
					'price'       => __( 'Sur devis', 'mo7assib-core' ),
					'description' => __( 'Pour deployer une homepage premium et connecter les premiers flux.', 'mo7assib-core' ),
					'items'       => array(
						__( 'Homepage plugin full replacement', 'mo7assib-core' ),
						__( 'Design system frontend isole', 'mo7assib-core' ),
						__( 'Preparation API Laravel', 'mo7assib-core' ),
					),
				),
				array(
					'name'        => __( 'Scale', 'mo7assib-core' ),
					'price'       => __( 'Projet sur mesure', 'mo7assib-core' ),
					'description' => __( 'Pour etendre l interface vers des workflows, dashboards et automatisations.', 'mo7assib-core' ),
					'items'       => array(
						__( 'Endpoints metier et auth', 'mo7assib-core' ),
						__( 'Widgets temps reel', 'mo7assib-core' ),
						__( 'Pages internes et analytics', 'mo7assib-core' ),
					),
				),
			),
			'cta'               => array(
				'title'       => __( 'Construisez une homepage qui ressemble a votre produit, pas a un theme generic.', 'mo7assib-core' ),
				'description' => __( 'Gardez Astra pour le reste du site et laissez Mo7assib prendre le controle total de la homepage.', 'mo7assib-core' ),
				'button'      => __( 'Parler integration', 'mo7assib-core' ),
			),
			'integration_hints' => array(
				'endpoint' => '/wp-json/mo7assib/v1/home-dashboard',
				'stack'    => __( 'WordPress frontend + Laravel/API', 'mo7assib-core' ),
				'status'   => __( 'Template plugin pilote la homepage', 'mo7assib-core' ),
			),
		);
	}

	/**
	 * Rend l'interface d'accueil depuis le template du plugin.
	 *
	 * @param array<string, mixed> $atts Attributs du shortcode.
	 * @return string
	 */
	public function render_home( $atts = array() ) {
		wp_enqueue_style( 'mo7assib-core-app' );
		wp_enqueue_script( 'mo7assib-core-app' );

		$view_model = $this->get_home_view_model( $atts );
		$template   = $this->get_home_template_path();

		if ( ! file_exists( $template ) ) {
			return '<div class="mo7assib-home__debug">Mo7assib plugin loaded (template-missing)</div>';
		}

		$GLOBALS['mo7assib_core_use_theme_chrome'] = true;

		ob_start();
		include $template;

		return (string) ob_get_clean();
	}
}
