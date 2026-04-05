<?php
/**
 * Plugin Name: Mo7assib Core
 * Plugin URI: https://example.com/mo7assib-core
 * Description: Remplace proprement la homepage WordPress par une interface Mo7assib plugin-based, sans modifier le theme parent Astra.
 * Version: 2.0.0
 * Author: Mo7assib
 * Author URI: https://example.com
 * Text Domain: mo7assib-core
 * Requires at least: 6.0
 * Requires PHP: 7.4
 *
 * @package Mo7assibCore
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'MO7ASSIB_CORE_VERSION', '2.0.0' );
define( 'MO7ASSIB_CORE_FILE', __FILE__ );
define( 'MO7ASSIB_CORE_PATH', plugin_dir_path( __FILE__ ) );
define( 'MO7ASSIB_CORE_URL', plugin_dir_url( __FILE__ ) );

require_once MO7ASSIB_CORE_PATH . 'includes/shortcodes.php';
require_once MO7ASSIB_CORE_PATH . 'includes/admin.php';

/**
 * Bootstrap principal du plugin.
 */
final class Mo7assib_Core_Plugin {

	/**
	 * Instance unique.
	 *
	 * @var Mo7assib_Core_Plugin|null
	 */
	private static $instance = null;

	/**
	 * Gestionnaire des shortcodes.
	 *
	 * @var Mo7assib_Core_Shortcodes
	 */
	private $shortcodes;

	/**
	 * Gestionnaire admin.
	 *
	 * @var Mo7assib_Core_Admin
	 */
	private $admin;

	/**
	 * Retourne l'instance du plugin.
	 *
	 * @return Mo7assib_Core_Plugin
	 */
	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Initialise les hooks principaux.
	 */
	private function __construct() {
		$this->shortcodes = new Mo7assib_Core_Shortcodes();
		$this->admin      = new Mo7assib_Core_Admin();

		add_action( 'init', array( $this, 'register_shortcodes' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'register_assets' ) );
		add_filter( 'template_include', array( $this, 'intercept_front_page_template' ), 99 );

		if ( is_admin() ) {
			$this->admin->register();
		}
	}

	/**
	 * Declare les assets et les charge sur la homepage plugin.
	 *
	 * @return void
	 */
	public function register_assets() {
		wp_register_style(
			'mo7assib-core-app',
			MO7ASSIB_CORE_URL . 'assets/css/app.css',
			array(),
			MO7ASSIB_CORE_VERSION
		);

		wp_register_script(
			'mo7assib-core-app',
			MO7ASSIB_CORE_URL . 'assets/js/app.js',
			array(),
			MO7ASSIB_CORE_VERSION,
			true
		);

		wp_localize_script(
			'mo7assib-core-app',
			'mo7assibCore',
			array(
				'apiBase'          => esc_url_raw( rest_url() ),
				'ajaxUrl'          => esc_url_raw( admin_url( 'admin-ajax.php' ) ),
				'nonce'            => wp_create_nonce( 'wp_rest' ),
				'pluginUrl'        => esc_url_raw( MO7ASSIB_CORE_URL ),
				'frontPageReplace' => $this->should_replace_front_page(),
				'useThemeChrome'   => $this->admin->use_theme_chrome(),
			)
		);

		if ( $this->should_replace_front_page() ) {
			wp_enqueue_style( 'mo7assib-core-app' );
			wp_enqueue_script( 'mo7assib-core-app' );
		}
	}

	/**
	 * Enregistre les shortcodes exposes par le plugin.
	 *
	 * @return void
	 */
	public function register_shortcodes() {
		$this->shortcodes->register();
	}

	/**
	 * Remplace le template de homepage par celui du plugin.
	 *
	 * @param string $template Template detecte par WordPress.
	 * @return string
	 */
	public function intercept_front_page_template( $template ) {
		if ( ! $this->should_replace_front_page() ) {
			return $template;
		}

		$GLOBALS['mo7assib_core_view_model'] = $this->shortcodes->get_home_view_model(
			array(
				'context' => 'full-homepage-replacement',
				'debug'   => '1',
			)
		);

		$GLOBALS['mo7assib_core_use_theme_chrome'] = $this->admin->use_theme_chrome();

		return $this->shortcodes->get_home_template_path();
	}

	/**
	 * Indique si la homepage doit etre remplacee completement.
	 *
	 * @return bool
	 */
	private function should_replace_front_page() {
		if ( is_admin() || wp_doing_ajax() || is_feed() ) {
			return false;
		}

		if ( ! is_front_page() ) {
			return false;
		}

		return $this->admin->is_replace_homepage_enabled();
	}
}

Mo7assib_Core_Plugin::instance();
